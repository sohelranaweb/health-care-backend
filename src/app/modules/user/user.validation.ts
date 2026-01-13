import { Gender, UserStatus } from "@prisma/client";
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
    contactNumber: z
      .string({
        error: "Contact number is required!",
      })
      .optional(),
    address: z
      .string({
        error: "Address is required!",
      })
      .optional(),
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

// Doctor validation
const createDoctorValidationSchema = z.object({
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
  doctor: z.object({
    name: z.string({ error: "Name is required" }),
    email: z.string({ error: "Email is required" }),
    contactNumber: z.string({ error: "Contact number is required" }).optional(),
    address: z.string({ error: "Address is required" }).optional(),
    registrationNumber: z
      .string({
        error: "Registration number is required",
      })
      .optional(),
    experience: z
      .number()
      .int()
      .min(0, "Experience must be at least 0")
      .optional(),
    gender: z.enum([Gender.MALE, Gender.FEMALE]).optional(),
    appointmentFee: z
      .number()
      .int({ error: "Appointment fee is required" })
      .optional(),
    followUpFee: z
      .number()
      .int({ error: "Followup fee is required" })
      .optional(),
    qualification: z
      .string({
        error: "Qualification is required",
      })
      .optional(),
    currentWorkingPlace: z
      .string({
        error: "Current working place is required!",
      })
      .optional(),
    about: z
      .string({
        error: "About is required!",
      })
      .optional(),
    avgConsultationTime: z.number().int().optional(),
    InstitutionName: z
      .string({
        error: "Institution name is required!",
      })
      .optional(),
    designation: z
      .string({
        error: "Designation is required!",
      })
      .optional(),
    department: z
      .string({
        error: "Department is required!",
      })
      .optional(),
    period: z
      .number()
      .int({
        error: "Period Time is required!",
      })
      .optional(),
    startTime: z
      .string({
        error: "Start Date is required!",
      })
      .optional(),
    endTime: z
      .string({
        error: "End Date is required!",
      })
      .optional(),
    // NEW: Add specialties array for doctor creation
    specialties: z
      .array(
        z.string().uuid({
          message: "Each specialty must be a valid UUID",
        })
      )
      .min(1, {
        message: "At least one specialty is required",
      })
      .optional(),

    // NEW: Add specialties array for doctor creation
    symptoms: z
      .array(
        z.string().uuid({
          message: "Each symptom must be a valid UUID",
        })
      )
      .min(1, {
        message: "At least one symptom is required",
      })
      .optional(),
  }),
});

const updateStatus = z.object({
  body: z.object({
    status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED, UserStatus.DELETED]),
  }),
});

export const UserValidation = {
  createPatientValidationSchema,
  createAdminValidationSchema,
  createDoctorValidationSchema,
  updateStatus,
};
