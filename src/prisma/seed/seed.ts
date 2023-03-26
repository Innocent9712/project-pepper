// import { PrismaClient } from "@prisma/client";
import { db } from "../../utils/db.server";
import { user, roles, rolePermissions, permissions } from "./data";

// const prisma = new PrismaClient();


async function seed() {
    for (const permission of permissions) {
        await db.permission.create({
            data: permission
        });
    }

    for (const role of roles) {
        await db.role.create({
            data: role
        });
    }

    for (const rolePermission of rolePermissions) {
        await db.rolePermissions.create({
            data: rolePermission
        });
    }

    await db.user.create({
        data: user
    });

}

seed()
  .catch((e) => console.error(e))
  .finally(async () => {
    await db.$disconnect();
});
