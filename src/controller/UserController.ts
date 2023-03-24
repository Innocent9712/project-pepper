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
      const { super_admin_id, username, email, password, roleID } = req.body;

      console.log(req.body);

      // check if user is superadmin or admin
      const user = await db.user.findUnique({
        where: {
          id: parseInt(super_admin_id),
        }
      });
      console.log(user)
      // if user is not superadmin or admin, return 401
      if (!user) { 
        return res.status(401).json({ 
          message: "You are not authorized to create a user" 
        });
      } else{
        // if user is superadmin or admin, create a user
        const user = await db.user.create({
          data: {
            // id: parseInt(super_admin_id),
            email: email,
            username: username,
            password: password,
            roleID: roleID,
          },
        }).then((response)=> {

          let result = {
            statusCode: 201,
            success: true,
            message: "User created successfully",
            data: response,
          }

          return res.status(201).json(result);

        });
      }
    } catch (error:any) {

      let result = {
        statusCode: 500,
        message: "Something went wrong",
        success: false,
        error: error.message
      };

      return res.status(500).json(result);

    }
  }
  

  async fetch(req: Request, res: Response) {
    // fetch user details.
    try {
      const {id} = req.params;
      //check if user is superadmin or admin
      const user = await db.user.findUnique({
        where: {
          id: parseInt(id),
        }
    })
    if (!user) {
      return res.status(401).json({
        message: "You are not authorized to fetch user details"
      })
    } else {
      // if user is superadmin or admin, fetch user details
      const user = await db.user.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          role: true,
        },
      }).then((response)=> {
          let result = {
            statusCode: 200,
            success: true,
            message: "User fetched successfully",
            data: response,
          }
  
          return res.status(200).json(result);
  
        }
      );
    }
  }
    catch (error:any) {
      let result = {
        statusCode: 500,
        message: "Something went wrong",
        success: false,
        error: error.message
      };
  
      return res.status(500).json(result);
    }
  }
  

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { email, username, password, roleID } = req.body;
      //find user
      const user = await db.user.findUnique({
        where: {
          id: parseInt(id),
        }, include: {
          role: true,
        }
      });
      if (!user) {
        return res.status(401).json({
          message: "You are not authorized to update user details"
        })
      } else {
        //check if user is superadmin or admin
        const user = await db.user.update({
          where: {
            id: parseInt(id),
          },
          data: {
            email: email,
            username: username,
            password: password,
            roleID: roleID,
          },
        }).then((response)=> {
          let result = {
            statusCode: 200,
            success: true,
            message: "User updated successfully",
            data: response,
          }
          return res.status(200).json(result);
        }
        );
      } 
    } catch (error:any) {
      let result = {
        statusCode: 500,
        message: "Something went wrong",
        success: false,
        error: error.message
      };
      return res.status(500).json(result);

      };
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