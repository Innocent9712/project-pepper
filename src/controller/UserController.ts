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

    if (uname) {
      //check if the user exists
      const user = await db.user.findUnique({ where: { username: uname } });
      const permission = await db.rolePermissions.findFirst({
        where: {
          roleID: user?.roleID,
        }
      });

      try {
        if (user && permission) {
          const newUser = await db.user.create({
            data: {
              email: email,
              username: username,
              password: password,
              role: {
                connect: {
                  id: parseInt(roleID),
                }
              }
            },
          }).then((response) => {
            let result = {
              statusCode: 201,
              success: true,
              message: "User created successfully",
              data: response,
            }

            return res.status(201).json(result);
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
  }

  //fetch user details
  async fetchUser(req: Request, res: Response) {
    // fetch user details.

    //check if user is superadmin or admin
    const { uname } = req.body
    if (uname) {
      const user = await db.user.findUnique(({ where: { username: uname } }));
      if (user) {
        const permission = await db.rolePermissions.findFirst({
          where: {
            roleID: user?.roleID,
            permissionID: 2
          }
        });
        if (permission) {
          try {
            const user = await db.user.findUnique({
              where: {
                username: req.body.uname,
                //id: parseInt(req.params.id),
              }, select: {
                id: true,
                username: true,
                email: true,
                roleID: true,
                role: true,
              }
            }).then((response) => {
              let result = {
                statusCode: 200,
                success: true,
                message: "User details fetched successfully",
                data: response,
              }
              return res.status(200).json(result);
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
    }
  }


  // update user details
  async updateUser(req: Request, res: Response) {
    const id = parseInt(req.params.userID);
    console.log(id);

    const { username, password, roleID, email } = req.body;
    console.log(req.body)

    if(id === undefined){
      return res.status(400).json({
        message: "Please provide a valid user id"
      });
    }

    const user = await db.user.findUniqueOrThrow(({ 

      where: { 
        id: id
      } 

    })).then(async (response) =>  {

      const permission = await db.rolePermissions.findFirst({
        
        where: {
          roleID: response.roleID,
          permissionID: 3
        }

      }).then(async (response) => {

        const user = await db.user.update({
          where: {
            id: id,
          }, 
          data: {
            email: email,
            username: username,
            password: password,
            roleID: parseInt(roleID),
            }
          }) .then((response) => {

            let result = {
              statusCode: 200,
              success: true,
              message: "User details updated successfully",
              data: response,
            }

            return res.status(200).json(result);

        }).catch((error: any) => {

          let result = {
            statusCode: 500,
            message: "User Error",
            success: false,
            error: error.message
          };

          return res.status(500).json(result);

        });

      }).catch((error: any) => {

        let result = {
          statusCode: 500,
          message: "Permmision Error",
          success: false,
          error: error.message
        };

        return res.status(500).json(result);

      });


    }).catch((error: any) => {

      let result = {
        statusCode: 500,
        message: "User check Error",
        success: false,
        error: error.message
      };

      return res.status(500).json(result);
    });


  }


  // delete user
  async deleteUser (req: Request, res: Response) {
    const id = parseInt(req.params.userID);
    console.log(id);

    if(id === undefined){
      return res.status(400).json({
        message: "Please provide a valid user id"
      });
    }

    const user = await db.user.findUniqueOrThrow(({
      where: {
        id: id
  }
})).then(async (response) =>  {

  const permission = await db.rolePermissions.findFirst({
    
    where: {
      roleID: response.roleID,
      permissionID: 3
    }

  }).then(async (response) => {

    const user = await db.user.delete({
      where: {
        id: id,
      }}) .then((response) => {
        let result = {
          statusCode: 200,
          success: true,
          message: "User deleted successfully",
          data: response,
        }
        return res.status(200).json(result);
    }).catch((error: any) => {
      let result = {
        statusCode: 500,
        message: "User Error",
        success: false,
        error: error.message
      };
      return res.status(500).json(result);
    });
  }).catch((error: any) => {
    let result = {
      statusCode: 500,
      message: "Permmision Error",
      success: false,
      error: error.message
    };
  });
}).catch((error: any) => {
  let result = {
    statusCode: 500,
    message: "User check Error",
    success: false,
    error: error.message
  };
  return res.status(500).json(result);
});
  }
    

  // get all users
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