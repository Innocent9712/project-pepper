// Method to create a user only if current user has the superadmin role or admin role
// Method to fetch user details if a user has the superadmin role or admin role or the user is the same user
// Method to update user details if a user has the superadmin role or admin role or the user is the same user
// Method to delete a user only if current user has the superadmin role or admin role
// Method to fetch all users only if current user has the superadmin role or admin role

import { db } from "../utils/db.server";
import { Request, Response, NextFunction } from "express";
import {BaseController, SUPERADMIN, ADMIN} from "./BaseController";
import { User } from "@prisma/client";

class UserController extends BaseController {
  constructor() {
    super();
  }

  async create(req: Request, res: Response) {
    try {
      const { name, username, email, password, roleID } = req.body;
      // check if user is superadmin or admin
      const user = await db.user.findUnique({
        where: {
          id: req.body?.id,
        },
        include: {
          role: true,
        }
      });
      // if user is not superadmin or admin, return 401
      if (!user) { 
        return res.status(401).json({ 
          message: "You are not authorized to create a user" 
        });
      } else{
        // if user is superadmin or admin, create a user
        const user= await db.user.create({
          data: {
            id: req.body?.id,
            email: req.body?.email,
            username,
            password,
            roleID,
          },
        });
      }
    } catch (error:any) {
      return res.status(500).json({message: "Something went wrong", error: error.message});
    }
  }
  

  async fetch(req: Request, res: Response) {
    // fetch user details.
    try {
      const user = await db.user.findUnique({
        where: {
          id: req.body?.id,
        },
        include: {
          role: true,
        }
      });

      if (!user) {
        return res.status(401).json({
          message: "You are not authorized to fetch this user"
        })
      }
      if (user.role.name !== 'admin' && user.role.name !== 'superadmin') {
        return res.status(401).json({
          message: "You are not allowed to fetch this user"
        });
      } else {
        return res.status(200).json({
          message: "User fetched successfully",
          user,
        });
      }
    } catch (error:any) {
      return res.status(500).json({
        message: "Something went wrong",
        error: error.message,
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, email, username, password, roleID } = req.body;

      const user = await db.user.findFirst({
        where: {
          id: req.body?.id,
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
        req.body?.id === user?.id

        ) {
            await db.user.update({
              where: {
                id: req.body?.id,
              },
              data: {
                username,
                email,
                password,
                roleID,
              },
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
    } catch (error:any) {
      return res.status(500).json({
        message: "Something went wrong",
        error: error.message,
      });
    }
  }
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await db.user.findFirst({
        where: {
          id: req.params,
        },
      });

      const role = await db.role.findFirst({
        where: {
          id: user?.roleID,
        },
      });

      if (role?.name === "superadmin" || role?.name === "admin") {
        await db.user.delete({
          where: {
            id: req.body?.id,
          },
        });

        return res.status(200).json({
          message: "User deleted successfully",
        });
      } else {
        return res.status(401).json({
          message: "You are not authorized to delete this user",
        });
      }
    } catch (error:any) {
      return res.status(500).json({
        message: "Something went wrong",
        error: error.message,
      });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const users = await db.user.findMany({
        include: {
          role: true,
        },
      });

      return res.status(200).json({
        message: "Users fetched successfully",
        users,
      });
    } catch (error:any) {
      return res.status(500).json({
        message: "Something went wrong",
        error: error.message,
      });
    }
  }
}

const userController = new UserController();
export default userController;