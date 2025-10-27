import { Request } from "express";
import { fileUploader } from "../../helpers/fileUploader";
import bcrypt from "bcryptjs";
import { prisma } from "../../shared/prisma";
import { Admin, Doctor, Prisma, UserRole, UserStatus } from "@prisma/client";
import { paginationHelper } from "../../helpers/paginationHelpers";
import { userSearchableFields } from "./user.constant";
import { IJwtPayload } from "../../types/common";

const createPatient = async (req: Request) => {
  try {
    if (req.file) {
      const uploadedResult = await fileUploader.uploadToCloudinary(req.file);
      req.body.patient.profilePhoto = uploadedResult?.secure_url;
      //     console.log({ uploadResult });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const result = await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          email: req.body.patient.email,
          password: hashedPassword,
        },
      });
      return await tx.patient.create({
        data: req.body.patient,
      });
    });
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const createAdmin = async (req: Request): Promise<Admin> => {
  const file = req.file;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.admin.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const userData = {
    email: req.body.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });
    const createdAdminData = await transactionClient.admin.create({
      data: req.body.admin,
    });
    return createdAdminData;
  });

  return result;
};

// const createDoctor = async (req: Request): Promise<Doctor> => {
//   const file = req.file;
//   if (file) {
//     const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
//     req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url;
//   }

//   const hashedPassword = await bcrypt.hash(req.body.password, 10);

//   const userData = {
//     email: req.body.doctor.email,
//     password: hashedPassword,
//     role: UserRole.DOCTOR,
//   };

//   const result = await prisma.$transaction(async (transactionClient) => {
//     await transactionClient.user.create({
//       data: userData,
//     });
//     const createdDoctorData = await transactionClient.doctor.create({
//       data: req.body.doctor,
//     });
//     return createdDoctorData;
//   });

//   return result;
// };

const createDoctor = async (req: Request): Promise<Doctor> => {
  const file = req.file;

  // Upload profile photo if file exists
  if (file) {
    const uploadResult = await fileUploader.uploadToCloudinary(file);
    req.body.doctor.profilePhoto = uploadResult?.secure_url;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const userData = {
    email: req.body.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };

  // Prepare doctor data with nested experienceDetails
  const doctorData = {
    ...req.body.doctor,
    experienceDetails: req.body.doctor.experienceDetails
      ? { create: req.body.doctor.experienceDetails }
      : undefined,
  };

  // Transaction: create User first, then Doctor
  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({ data: userData });

    const createdDoctor = await tx.doctor.create({
      data: doctorData,
    });

    return createdDoctor;
  });

  return result;
};

const getAllFromDB = async (params: any, options: any) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.UserWhereInput[] = [];
  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};

  const result = await prisma.user.findMany({
    skip,
    take: limit,
    where: {
      AND: whereConditions,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
const getMyProfile = async (user: IJwtPayload) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      needPasswordChange: true,
      role: true,
      status: true,
    },
  });

  let profileData;

  if (userInfo.role === UserRole.PATIENT) {
    profileData = await prisma.patient.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.DOCTOR) {
    profileData = await prisma.doctor.findUnique({
      where: {
        email: userInfo.email,
      },
      include: {
        experienceDetails: true,
      },
    });
  } else if (userInfo.role === UserRole.ADMIN) {
    profileData = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.SUPER_ADMIN) {
    profileData = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  }

  return {
    ...userInfo,
    ...profileData,
  };
};
export const UserService = {
  createPatient,
  createAdmin,
  createDoctor,
  getAllFromDB,
  getMyProfile,
};
