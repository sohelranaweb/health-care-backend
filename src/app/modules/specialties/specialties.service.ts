import { Request } from "express";
import { fileUploader } from "../../helpers/fileUploader";
import { prisma } from "../../shared/prisma";
import { Prisma, Specialties } from "@prisma/client";
import { paginationHelper } from "../../helpers/paginationHelpers";
import { specialtiesSearchableFields } from "./specialties.constant";

const createSpecialties = async (req: Request) => {
  const file = req.file;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.icon = uploadToCloudinary?.secure_url;
  }

  const result = await prisma.specialties.create({
    data: req.body,
  });

  return result;
};

const getAllFromDB = async (filters: any, options: any) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  console.log("params", filters);

  const andConditions: Prisma.SpecialtiesWhereInput[] = [];
  if (searchTerm) {
    andConditions.push({
      OR: specialtiesSearchableFields.map((field) => ({
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

  const whereConditions: Prisma.SpecialtiesWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};

  const result = await prisma.specialties.findMany({
    skip,
    take: limit,
    where: {
      AND: whereConditions,
    },
  });

  const total = await prisma.specialties.count({
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

const updateSpecialtyById = async (id: string, req: Request) => {
  await prisma.specialties.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const file = req.file;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.icon = uploadToCloudinary?.secure_url;
  }

  return await prisma.specialties.update({
    where: {
      id,
    },
    data: req.body,
  });
};

const deleteSpecialty = async (id: string): Promise<Specialties> => {
  const result = await prisma.specialties.delete({
    where: {
      id,
    },
  });
  return result;
};

export const SpecialtiesService = {
  createSpecialties,
  getAllFromDB,
  updateSpecialtyById,
  deleteSpecialty,
};
