import {Role, User, Permission} from "@prisma/client";

const encodedpassword = Buffer.from('superadmin', 'utf8').toString("base64");

export const user: User = {
    id: 1,
    username: 'superadmin',
    email: 'john@doe.com',
    password: encodedpassword,
    roleID: 1
}

export const role: Role = {
    id: 1,
    name: 'superadmin'
}

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

export const rolePermissions = permissions.map((permission) => {
    return {
        
    }
})