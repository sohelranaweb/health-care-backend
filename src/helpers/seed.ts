import { UserRole } from "@prisma/client";
import { prisma } from "../shared/prisma";
import bcrypt from "bcryptjs";
import config from "../config";
import { fa } from "zod/locales";

const seedSuperAdmin = async () => {
  try {
    const isExistSuperAdmin = await prisma.user.findFirst({
      where: {
        role: UserRole.SUPER_ADMIN,
      },
    });
    if (isExistSuperAdmin) {
      console.log("Super Admin already exists");
      return;
    }
    const hashedPassword = await bcrypt.hash(
      config.superAdmin.password as string,
      Number(config.salt_round)
    );
    const superAdminData = await prisma.user.create({
      data: {
        email: config.superAdmin.email as string,
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
        needPasswordChange: false,
        admin: {
          create: {
            name: "Super Admin",
            contactNumber: "01700000001",
          },
        },
      },
    });
    console.log("Super Admin Created Successfully?", superAdminData);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
};

export default seedSuperAdmin;
