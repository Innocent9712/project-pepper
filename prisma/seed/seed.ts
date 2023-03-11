// import { PrismaClient } from "@prisma/client";
import { db } from "../../src/utils/db.server";
import { user, role, permissions } from "./data";

// const prisma = new PrismaClient();


async function seed() {
    await db.role.create({
        data: role
    });

    for (const permission of permissions) {
        await db.permission.create({
            data: permission
        });

        await db.rolePermissions.create({
            data: {
                id: permission.id,
                roleID: role.id,
                permissionID: permission.id
            }
        })
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
