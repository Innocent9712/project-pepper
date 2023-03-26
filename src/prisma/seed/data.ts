import {Role, User, Permission, RolePermissions} from "@prisma/client";

const encodedpassword = Buffer.from('superadmin', 'utf8').toString("base64");

export const user: User = {
    id: 1,
    username: 'superadmin',
    email: 'john@doe.com',
    password: encodedpassword,
    roleID: 1
}

export const roles: Role[] = [
    {
        id: 1,
        name: 'superadmin'
    },
    {
        id: 2,
        name: "admin"
    },
    {
        id: 3,
        name: "manager"
    },
    {
        id: 4,
        name: "shopkeeper"
    }

]

export const permissions: Permission[] = [
    {
        id: 1,
        name: "CreateUser",
        description: "Create a new User"
    },
    {
        id: 2,
        name: "ReadUser",
        description: "Fetch user details"

    },
    {
        id: 3,
        name: "UpdateUser",
        description: "Update a user's information"
    },
    {
        id: 4,
        name: "DeleteUser",
        description: "Delete a user"
    },
    {
        id: 5,
        name: "CreateRole",
        description: "Create a new role"
    },
    {
        id: 6,
        name: "ReadRole",
        description: "Fetch role details"
    },
    {
        id: 7,
        name: "UpdateRole",
        description: "Update a role's information"
    },
    {
        id: 8,
        name: "DeleteRole",
        description: "Delete a role"
    },
    {
        id: 9,
        name: "AddItem",
        description: "Add item to inventory"
    },
    {
        id: 10,
        name: "ReadItem",
        description: "Get item information from inventory"
    },
    {
        id: 11,
        name: "UpdateItem",
        description: "Update inventory item information"
    },
    {
        id: 12,
        name: "DeleteItem",
        description: "Remove item from inventory"
    },
    {
        id: 13,
        name: "AddToItem",
        description: "Add quantity to item"
    },
    {
        id: 14,
        name: "RemoveFromItem",
        description: "Remove quantity from item"
    },
    {
        id: 15,
        name: "ReadAllUsers",
        description: "Get all user details"
    }
]

const superadminPermissions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const adminPermissions = [1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const managerPermissions = [2, 6, 9, 10, 11, 12, 13, 15];
const shopKeeperPermissions = [14]

let rolePermissionIDCount = 1
function buildRolePermissions(roleID: number, arr: number[]) {
    return arr.map((permissionID: number) => {
        return {
            id: rolePermissionIDCount++,
            roleID,
            permissionID
        }
    })
}

const superadminRolePermissions = buildRolePermissions(1, superadminPermissions)
const adminRolePermissions = buildRolePermissions(2, adminPermissions)
const managerRolePermissions = buildRolePermissions(3, managerPermissions)
const shopKeeperRolePermissions = buildRolePermissions(4, shopKeeperPermissions)

export const rolePermissions: RolePermissions[] = [...superadminRolePermissions, ...adminRolePermissions, ...managerRolePermissions, ...shopKeeperRolePermissions]
// console.log(rolePermissions)