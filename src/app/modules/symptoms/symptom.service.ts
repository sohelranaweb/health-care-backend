import { Request } from "express";
import { fileUploader } from "../../helpers/fileUploader";
import { prisma } from "../../shared/prisma";
import { paginationHelper } from "../../helpers/paginationHelpers";
import { Symptoms } from "@prisma/client";

const createSymptoms = async (req: Request) => {
  const file = req.file;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.icon = uploadToCloudinary?.secure_url;
  }

  const result = await prisma.symptoms.create({
    data: req.body,
  });

  return result;
};

const getAllFromDB = async (options: any) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const result = await prisma.symptoms.findMany({
    skip,
    take: limit,
  });

  const total = await prisma.symptoms.count();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateSymptomById = async (id: string, req: Request) => {
  await prisma.symptoms.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const file = req.file;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.icon = uploadToCloudinary?.secure_url;
  }

  return await prisma.symptoms.update({
    where: {
      id,
    },
    data: req.body,
  });
};

const deleteSymptom = async (id: string): Promise<Symptoms> => {
  const result = await prisma.symptoms.delete({
    where: {
      id,
    },
  });
  return result;
};

export const SymptomsService = {
  createSymptoms,
  getAllFromDB,
  updateSymptomById,
  deleteSymptom,
};
