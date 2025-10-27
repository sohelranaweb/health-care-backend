import { Gender } from "@prisma/client";
import z from "zod";

const createPatientValidationSchema = z.object({
  password: z
    .string({ message: "Password must be a string" })
    .nonempty("Password is required")
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least 1 uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least 1 lowercase letter",
    })
    .regex(/\d/, { message: "Password must contain at least 1 number" })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must contain at least 1 special character",
    }),
  patient: z.object({
    name: z.string().nonempty("Name is required"),
    email: z.string().nonempty("Email is required"),
    address: z.string().optional(),
  }),
});
const createAdminValidationSchema = z.object({
  password: z
    .string({ message: "Password must be a string" })
    .nonempty("Password is required")
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least 1 uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least 1 lowercase letter",
    })
    .regex(/\d/, { message: "Password must contain at least 1 number" })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must contain at least 1 special character",
    }),
  admin: z.object({
    name: z.string({
      error: "Name is required!",
    }),
    email: z.string({
      error: "Email is required!",
    }),
    contactNumber: z.string({
      error: "Contact Number is required!",
    }),
  }),
});

// ExperienceDetails validation
const experienceDetailsSchema = z.object({
  InstitutionName: z.string().optional(),
  designation: z.string().optional(),
  department: z.string().optional(),
  period: z.number().int().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

// Doctor validation
const createDoctorValidationSchema = z.object({
  password: z.string({
    error: "Password is required",
  }),
  doctor: z.object({
    name: z.string({ error: "Name is required" }),
    email: z.string({ error: "Email is required" }),
    contactNumber: z.string({ error: "Contact number is required" }),
    address: z.string({ error: "Address is required" }),
    registrationNumber: z.string({
      error: "Registration number is required",
    }),
    experience: z
      .number()
      .int()
      .min(0, "Experience must be at least 0")
      .optional(),
    gender: z.enum([Gender.MALE, Gender.FEMALE]),
    appointmentFee: z.number().int({ error: "Appointment fee is required" }),
    followUpFee: z.number().int().optional(),
    qualification: z.string().optional(),
    currentWorkingPlace: z.string().optional(),
    about: z.string().optional(),
    avgConsultationTime: z.number().int().optional(),
    experienceDetails: z.array(experienceDetailsSchema).optional(),
  }),
});

export const UserValidation = {
  createPatientValidationSchema,
  createAdminValidationSchema,
  createDoctorValidationSchema,
};
