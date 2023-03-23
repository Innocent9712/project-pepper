import { db } from "../utils/db.server";


async function main() {

    // const roles = await db.rolePermissions.findMany({
    //     distinct: ['roleID'],
    //     include: { role: true },
    //   });
    // console.log(roles)
    // const permission = db.permission.findUnique({
    //     where: {
    //         name: "CreateUser"
    //     },
    //     include: {
    //         roles: 
    //     }
    // });
    const permissionWithNameCreateUser = await db.permission.findUnique({
        where: {
          name: 'ReadRole', // Specify the name of the permission to fetch
        },
        select: {
          id: true,
          name: true,
          description: true,
          roles: {
            select: {
              id: true,
              roleID: true,
              permissionID: true
              // Add any other fields you want to fetch from the RolePermissions table
            },
          },
        },
      });
    console.log(permissionWithNameCreateUser)
}


// console.log(main())
main()