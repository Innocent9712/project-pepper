// Method to create a new role only if the user has the superadmin role or admin role
// Method to add permissions to a role only if the user has the superadmin role or admin role
// Method to fetch all roles only if the user has the superadmin role or admin role
// Method to remove permissions from a role only if the user has the superadmin role or admin role
// Method to delete a role only if the user has the superadmin role or admin role


// (Messing with the superadmin role is prohibitted)
import { db } from "../utils/db.server";
import { Request, Response, NextFunction } from "express";

class RoleController {
  static async create(req: Request, res: Response) {
    try {
      const { name } = req.body;

      const role = await db.role.create({
        data: {
          name,
        },
      });

      return res.status(201).json({
        message: "Role created successfully",
        role,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong",
        error: error.message,
      });
    }
  }

  static async addPermissions(req: Request, res: Response) {
    try {
      const { roleID, permissions } = req.body;

      const role = await db.role.findFirst({
        where: {
          id: roleID,
        },
      });

      if (role?.name === "superadmin") {
        return res.status(401).json({
          message: "You are not authorized to add permissions to the superadmin role",
        });
      }

      for (const permission of permissions) {
        await db.rolePermissions.create({
          data: {
            id: permission.id,
            roleID: roleID,
            permissionID: permission.id,
          },
        });
      }

      return res.status(200).json({
        message: "Permissions added successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong",
        error: error.message,
      });
    }
  }

  static async fetchAll(req: Request, res: Response) {
    try {
      const roles = await db.role.findMany();

      return res.status(200).json({
        message: "Roles fetched successfully",
        roles,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong",
        error: error.message,
      });
    }
  }

  static async removePermissions(req: Request, res: Response) {
    try {
      const { roleID, permissions } = req.body;

      const role = await db.role.findFirst({
        where: {
          id: roleID,
        },
      });

      if (role?.name === "superadmin") {
        return res.status(401).json({
          message: "You are not authorized to remove permissions from the superadmin role",
        });
      }

      for (const permission of permissions) {
        await db.rolePermissions.delete({
          where:
            {
                id: permission.id,
                },
        });
        }

      return res.status(200).json({
        message: "Permissions removed successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong",
        error: error.message,
      });
    }
  }

  static async addPermissions(req: Request, res: Response) {
    try {
      const { roleID, permissions } = req.body;

      const role = await db.role.findFirst({
        where: {
          id: roleID,
        },
      });

      if (role?.name === "superadmin") {
        return res.status(401).json({
          message: "You are not authorized to add permissions to the superadmin role",
        });
      }

      for (const permission of permissions) {
        await db.rolePermissions.create({
          data: {
            id: permission.id,
            roleID: roleID,
            permissionID: permission.id,
          },
        });
      }
      return res.status(200).json({
        message: "Permissions added successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong",
        error: error.message,
      });
    }
  }

  static async removePermissions(req: Request, res: Response) {
    try {
      const { roleID, permissions } = req.body;

      const role = await db.role.findFirst({
        where: {
          id: roleID,
        },
      });

      if (role?.name === "superadmin") {
        return res.status(401).json({
          message: "You are not authorized to remove permissions from the superadmin role",
        });
      }

      for (const permission of permissions) {
        await db.rolePermissions.delete({
          where:
            {
                id: permission.id,
                },
        });
        }
        return res.status(200).json({
        message: "Permissions removed successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
        }
    }
    static async getPermissions(req: Request, res: Response) {
        try {
            const { roleID } = req.params;

            const role = await db.role.findFirst({
                where: {
                    id: roleID,
                },
            });

            if (role?.name === "superadmin") {
                return res.status(401).json({
                    message: "You are not authorized to get permissions from the superadmin role",
                });
            }

            const permissions = await db.rolePermissions.findMany({
                where: {
                    roleID: roleID,
                },
            });

            return res.status(200).json({
                message: "Permissions fetched successfully",
                permissions,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Something went wrong",
                error: error.message,
            });
        }
    }
}

const roleController = new RoleController();

export default roleController;