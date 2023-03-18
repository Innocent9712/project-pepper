// Method to create a user only if current user has the superadmin role or admin role
// Method to fetch user details if a user has the superadmin role or admin role or the user is the same user
// Method to update user details if a user has the superadmin role or admin role or the user is the same user
// Method to delete a user only if current user has the superadmin role or admin role
// Method to fetch all users only if current user has the superadmin role or admin role

import { db } from "../utils/db.server";
import { Request, Response, NextFunction } from "express";

class UserController {
  static async create(req: Request, res: Response) {
    try {
      const { name, username, password, roleID } = req.body;

      const role = await db.role.findFirst({
        where: {
          id: roleID,
        },
      });

      if (role?.name === "superadmin") {
        return res.status(401).json({
          message: "You are not authorized to create a superadmin user",
        });
      }

      const user = await db.user.create({
        data: {
          name,
          username,
          password,
          roleID,
        },
      });

      return res.status(201).json({
        message: "User created successfully",
        user,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong",
        error: error.message,
      });
    }
  }

  static async fetch(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await db.user.findFirst({
        where: {
          id,
        },
      });

      const role = await db.role.findFirst({
        where: {
          id: user?.roleID,
        },
      });

      if (
        role?.name === "superadmin" ||
        role?.name === "admin" ||
        req.user?.id === user?.id
      ) {
        return res.status(200).json({
          message: "User fetched successfully",
          user,
        });
      } else {
        return res.status(401).json({
          message: "You are not authorized to fetch this user",
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong",
        error: error.message,
      });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, username, password, roleID } = req.body;

      const user = await db.user.findFirst({
        where: {
          id,
        },
      });

      const role = await db.role.findFirst({
        where: {
          id: user?.roleID,
        },
      });

      if (
        role?.name === "superadmin" ||
        role?.name === "admin" ||
        req.user?.id === user?.id

        ) {
            await db.user.update({
              name,
              username,
              password,
              roleID,
            });

            return res.status(200).json({
              message: "User updated successfully",
              user,
            });
        } else {
          return res.status(401).json({
            message: "You are not authorized to update this user",
          });
        }
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong",
        error: error.message,
      });
    }
  }
}

const userController = new UserController();
export default userController;