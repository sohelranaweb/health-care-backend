import { Request } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import bcrypt from "bcryptjs";
import { prisma } from "../../../shared/prisma";
import { Admin, Doctor, Prisma, UserRole, UserStatus } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelpers";
import { userSearchableFields } from "./user.constant";

import config from "../../../config";
import { IAuthUser } from "../../interfaces/common";

const createPatient = async (req: Request) => {
  const file = req.file;
  if (file) {
    const uploadedResult = await fileUploader.uploadToCloudinary(file);
    req.body.patient.profilePhoto = uploadedResult?.secure_url;
  }
  const hashedPassword = await bcrypt.hash(
    req.body.password,
    Number(config.salt_round)
  );
  const userData = {
    email: req.body.patient.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  };
  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        ...userData,
        needPasswordChange: false,
      },
    });
    const createdPatientData = await tnx.patient.create({
      data: req.body.patient,
    });
    return createdPatientData;
  });
  return result;
};

const createAdmin = async (req: Request): Promise<Admin> => {
  const file = req.file;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.admin.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(
    req.body.password,
    Number(config.salt_round)
  );

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

//   // Upload profile photo if file exists
//   if (file) {
//     const uploadResult = await fileUploader.uploadToCloudinary(file);
//     req.body.doctor.profilePhoto = uploadResult?.secure_url;
//   }

//   // Hash password
//   const hashedPassword = await bcrypt.hash(req.body.password, Number(config.salt));

//   const userData = {
//     email: req.body.doctor.email,
//     password: hashedPassword,
//     role: UserRole.DOCTOR,
//   };

//   // Prepare doctor data with nested experienceDetails
//   const doctorData = {
//     ...req.body.doctor,
//     experienceDetails: req.body.doctor.experienceDetails
//       ? { create: req.body.doctor.experienceDetails }
//       : undefined,
//   };

//   // Transaction: create User first, then Doctor
//   const result = await prisma.$transaction(async (tx) => {
//     await tx.user.create({ data: userData });

//     const createdDoctor = await tx.doctor.create({
//       data: doctorData,
//     });

//     return createdDoctor;
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
  const hashedPassword = await bcrypt.hash(
    req.body.password,
    Number(config.salt_round)
  );

  const userData = {
    email: req.body.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };

  // Extract specialties and symptoms from doctor data
  const { specialties, symptoms, ...doctorData } = req.body.doctor;
  const result = await prisma.$transaction(async (transactionClient) => {
    // Step 1: Create user
    await transactionClient.user.create({
      data: userData,
    });

    // Step 2: Create doctor
    const createdDoctorData = await transactionClient.doctor.create({
      data: doctorData,
    });

    // Step 3: Create doctor specialties if provided
    if (specialties && Array.isArray(specialties) && specialties.length > 0) {
      // Verify all specialties exist
      const existingSpecialties = await transactionClient.specialties.findMany({
        where: {
          id: {
            in: specialties,
          },
        },
        select: {
          id: true,
        },
      });

      const existingSpecialtyIds = existingSpecialties.map((s) => s.id);
      const invalidSpecialties = specialties.filter(
        (id) => !existingSpecialtyIds.includes(id)
      );

      if (invalidSpecialties.length > 0) {
        throw new Error(
          `Invalid specialty IDs: ${invalidSpecialties.join(", ")}`
        );
      }

      // Create doctor specialties relations
      const doctorSpecialtiesData = specialties.map((specialtyId) => ({
        doctorId: createdDoctorData.id,
        specialitiesId: specialtyId,
      }));

      await transactionClient.doctorSpecialties.createMany({
        data: doctorSpecialtiesData,
      });
    }

    if (symptoms && Array.isArray(symptoms) && symptoms.length > 0) {
      // Verify all symptoms exist
      const existingSymptoms = await transactionClient.symptoms.findMany({
        where: {
          id: {
            in: symptoms,
          },
        },
        select: {
          id: true,
        },
      });

      const existingSymptomIds = existingSymptoms.map((s) => s.id);
      const invalidSymptoms = symptoms.filter(
        (id) => !existingSymptomIds.includes(id)
      );

      if (invalidSymptoms.length > 0) {
        throw new Error(`Invalid specialty IDs: ${invalidSymptoms.join(", ")}`);
      }

      // Create doctor symptoms relations
      const doctorSymptomsData = symptoms.map((symptomId) => ({
        doctorId: createdDoctorData.id,
        symptomsId: symptomId,
      }));

      await transactionClient.doctorSymptoms.createMany({
        data: doctorSymptomsData,
      });
    }

    // Step 4: Return doctor with specialties and symptoms
    const doctorWithSpecialties = await transactionClient.doctor.findUnique({
      where: {
        id: createdDoctorData.id,
      },
      include: {
        doctorSpecialties: {
          include: {
            specialities: true,
          },
        },
        doctorSymptoms: {
          include: {
            symptoms: true,
          },
        },
      },
    });

    return doctorWithSpecialties!;
  });
  return result;
};

const getAllFromDB = async (params: any, options: any) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
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
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      admin: true,
      patient: true,
      doctor: true,
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
const getMyProfile = async (user: IAuthUser) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
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
