export type IDoctorFilterRequest = {
  searchTerm?: string | undefined;
  email?: string | undefined;
  contactNumber?: string | undefined;
  gender?: string | undefined;
  specialties?: string | undefined;
};

type IDoctorExpriences = {
  instituteName: string;
  designation: string;
  department: string;
  startDate: string;
  endDate: string;
};

export type IDoctorUpdate = {
  name?: string;
  profilePhoto?: string;
  contactNumber?: string;
  address?: string;
  registrationNumber?: string;
  gender?: "MALE" | "FEMALE";
  appointmentFee?: number;
  qualification?: string;
  currentWorkingPlace?: string;
  // NEW: Simplified specialty management
  specialties?: string[]; // Array of specialty IDs to add
  removeSpecialties?: string[]; // Array of specialty IDs to remove
  doctorExpriences: IDoctorExpriences;
};

export type ISpecialties = {
  specialtiesId: string;
  isDeleted?: null;
};
