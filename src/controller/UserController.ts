// Method to create a user only if current user has the superadmin role or admin role
// Method to fetch user details if a user has the superadmin role or admin role or the user is the same user
// Method to update user details if a user has the superadmin role or admin role or the user is the same user
// Method to delete a user only if current user has the superadmin role or admin role
// Method to fetch all users only if current user has the superadmin role or admin role

import { db } from "../utils/db.server";
import { Request, Response, NextFunction } from "express";
import { checkPermission } from "../utils/utilFunctions";
import { BaseController, SUPERADMIN, ADMIN } from "./BaseController";
import { User } from "@prisma/client";

class UserController extends BaseController {
  constructor() {
    super();
  }

  async create(req: Request, res: Response) {
    //check permissions
    const { email, username, password, role, roleID } = req.body;
    const { uname } = req.body;
    console.log(req.body)

    const user = await db.user.findUnique({ where: { username: uname } });
    const permission = await db.rolePermissions.findFirst({
      where: {
        roleID: user?.roleID,
      }
    });

    try {
      if (user && permission?.permissionID === 1) {
        await db.user.create({
          data: {
            email: email,
            username: username,
            password: Buffer.from(password, 'utf8').toString("base64"),
            role: {
              connect: {
                id: parseInt(roleID),
              }
            }
          },
        }).then((response) => {
          if (response) {
            let result = {
              statusCode: 201,
              success: true,
              message: "User created successfully",
              data: response,
            }
  
            return res.status(201).json(result);
          }
          throw new Error("User not created");
        });
      };
    } catch (error: any) {

      let result = {
        statusCode: 500,
        message: "Something went wrong",
        success: false,
        error: error.message
      };

      return res.status(500).json(result);

    }
  }

  //fetch user details
  async fetchUser(req: Request, res: Response) {
    // fetch user details.

    //check if user is superadmin or admin
    const { uname } = req.body
    const {userID} = req.params
    const user = await db.user.findUnique(({ where: { username: uname } }));
    const permission = await db.rolePermissions.findFirst({
      where: {
        roleID: user?.roleID,
        permissionID: 2
      }
    });
    if (user && (user.id === parseInt(userID) || permission)) {
        try {
          await db.user.findUnique({
            where: {
              id: parseInt(userID),
              //id: parseInt(req.params.id),
            }, select: {
              id: true,
              username: true,
              email: true,
              roleID: true,
              role: true,
            }
          }).then((response) => {
            if (response) {
              let result = {
                statusCode: 200,
                success: true,
                message: "User details fetched successfully",
                data: response,
              }
              return res.status(200).json(result);                
            }
            return res.status(404).json({
              success: false,
              message: "User not found",
            })
          });

        } catch (error: any) {
          let result = {
            statusCode: 500,
            message: "Something went wrong",
            success: false,
            error: error.message
          };

          return res.status(500).json(result);
        }
    } else {
      return res.status(401).json({
        message: "You are not authorized to fetch user details"
      });
    }
  }


  async updateUser(req: Request, res: Response) {
    const { uname, username, password, roleID, email  } = req.body
    const {userID } = req.params
    const user = await db.user.findUnique({where: {username: uname}})
    const permission = await db.rolePermissions.findFirst({where: {roleID: user?.roleID, permissionID: 3}})
    if (user?.id === parseInt(userID) || permission) {
      const userData: Partial<User> = {}
      if (username) userData['username'] = username
      if (password) userData['password'] = Buffer.from(password, 'utf8').toString("base64")
      if (roleID) userData['roleID'] = parseInt(roleID)
      if (email) userData['email'] = email
      try {
        await db.user.update({
          where: {
            id: parseInt(userID),
          },
          data: userData
        }).then((response: Partial<Pick<User, 'password'>>) => {
          if (response) {
            delete response.password
            let result = {
              statusCode: 200,
              success: true,
              message: "User details updated successfully",
              data: response,
            }
            return res.status(200).json(result);
          }
          return res.status(404).json({
            success: false,
            message: "User not found",
          })
        });

      } catch (error: any) {
        let result = {
          statusCode: 500,
          message: "Something went wrong",
          success: false,
          error: error.message
        };

        return res.status(500).json(result);
      }
    } else {
      return res.status(401).json({
        message: "You are not authorized to update user details"
      });
    }
  }

    
  async deleteUser(req: Request, res: Response) {
    const {userID} = req.params
    const {uname} = req.body
    const user = await db.user.findUnique({where: {username: uname}})
    const permission = await db.rolePermissions.findFirst({where: {roleID: user?.roleID, permissionID: 4}})
    if (permission && parseInt(userID) !== 1) {
        await db.user.delete({
          where: {
            id: parseInt(userID),
          }
        }).then((response) => {
          if (response) {
            let result = {
              statusCode: 200,
              success: true,
              message: "User deleted successfully",
            }
            return res.status(200).json(result);
          }
          return res.status(404).json({
            success: false,
            message: "User not found",
          }) 
        }).catch((error: any) => {
          let result = {
            statusCode: 500,
            message: "User Error",
            success: false,
            error: error.message
          };
          return res.status(500).json(result);
        });
    } else {
      return res.status(401).json({
        message: "You are not authorized to delete user"
      });
    }
  }

  // get all users
  async getAll(req: Request, res: Response) {
        try {
          const {uname} = req.body
          const user = await db.user.findUnique({where: {username: uname}})
          const permission = await db.rolePermissions.findFirst({where: {roleID: user?.roleID, permissionID: 15}})
          if (permission) {
            let users: Partial<Pick<User, 'password'>>[] = await db.user.findMany({
              include: {
                role: true,
              },
            })
            users = users.map((user: Partial<Pick<User, 'password'>>) => {
              delete user?.password
              return user
            });
  
            return res.status(200).json({
              message: "Users fetched successfully",
              users,
            });
          }
          return res.status(401).json({message: "Unauthorized"})
        } catch (error: any) {
          return res.status(500).json({
            message: "Something went wrong",
            error: error.message,
          });
        }
      }
    }

    const userController = new UserController();
    export default userController;