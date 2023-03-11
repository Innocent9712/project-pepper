import {Role, User, Permission} from "@prisma/client";
export const user: User = {
    id: 1,
    username: 'superadmin',
    email: 'john@doe.com',
    password: 'c3VwZXJhZG1pbgo=',
    roleID: 1
}

export const role: Role = {
    id: 1,
    name: 'superadmin'
}

export const permissions: Permission[] = [
    {
        id: 1,
        name: "CreateUser"
    },
    {
        id: 2,
        name: "ReadUser"
    },
    {
        id: 3,
        name: "UpdateUser"
    },
    {
        id: 4,
        name: "DeleteUser"
    },
    {
        id: 5,
        name: "CreateRole"
    },
    {
        id: 6,
        name: "ReadRole"
    },
    {
        id: 7,
        name: "UpdateRole",
    },
    {
        id: 8,
        name: "DeleteRole"
    },
    {
        id: 9,
        name: "AddItem"
    },
    {
        id: 10,
        name: "ReadItem"
    },
    {
        id: 11,
        name: "UpdateItem"
    },
    {
        id: 12,
        name: "DeleteItem"
    },
    {
        id: 13,
        name: "AddToItem"
    },
    {
        id: 14,
        name: "RemoveFromItem"
    }
]

export const rolePermissions = permissions.map((permission) => {
    return {
        
    }
})