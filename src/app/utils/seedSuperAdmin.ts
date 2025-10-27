import { UserRole } from "@prisma/client";
import config from "../../config";
import { prisma } from "../shared/prisma";
import bcrypt from "bcryptjs";
export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await prisma.user.findUnique({
      where: {
        email: config.super_admin.email,
      },
    });

    if (isSuperAdminExist) {
      console.log("Super Admin Already Exists");
      return;
    }
    console.log("Trying to create super admin...");

    const hashedPassword = await bcrypt.hash(
      config.super_admin.password as string,
      Number(config.salt)
    );

    const superAdmin = await prisma.user.create({
      data: {
        email: config.super_admin.email as string,
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
        needPasswordChange: false,
        status: "ACTIVE",
      },
    });
    console.log("Super admin created successfully! \n");
    console.log(superAdmin);
  } catch (err) {
    console.error(err);
  }
};
