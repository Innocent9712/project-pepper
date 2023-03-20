// Method to create a new role only if the user has the superadmin role or admin role
// Method to add permissions to a role only if the user has the superadmin role or admin role
// Method to fetch all roles only if the user has the superadmin role or admin role
// Method to remove permissions from a role only if the user has the superadmin role or admin role
// Method to delete a role only if the user has the superadmin role or admin role


// (Messing with the superadmin role is prohibitted)
import { db } from "../utils/db.server";
import { Request, Response, NextFunction } from "express";
import { Role, RolePermissions, User } from "@prisma/client";
import {BaseController, SUPERADMIN, ADMIN} from "./BaseController";
import baseController from "./BaseController";


async function checkPermission(username: string) {
  const user: User | null = await db.user.findUnique({
    where: { username },
  });

  if (user) {
    const userRole: Role | null = await db.role.findUnique({
      where: { id: user.roleID }
    })

    if (userRole) {
      if ([SUPERADMIN, ADMIN].includes(userRole.name)) {
        return true
      }
    }
  }
  return false
}
class RoleController extends BaseController {
  // private authRoles = ['superadmin', 'admin']
  // private authRoles: string[]
  constructor() {
    super()
  }

  async createRole(req: Request, res: Response) {
    try {
      const { username } = req.body;
      if (username && await checkPermission(username)) {
        const {name} = req.body
        console.log(name)
        if (name) {
          const role = await db.role.create({
            data: {
              name,
            },
          });
          return res.status(201).json({
            message: "Role created successfully",
            role,
          });
        }

      }
      return res.status(403).json({
        message: "You don't have the right to create a role",
      });

    } catch (err) {
      return res.status(500).json({
        message: "Something went wrong",
        err,
      });
    }
  }

  async updateRole(req: Request, res: Response) {
    try {
      const { username } = req.body;

      if (username && await checkPermission(username)) {
        const {roleID} = req.params
        if (roleID) {
          const role = await db.role.findUnique({
            where: {
              id: parseInt(roleID),
            },
          });

          if (role) {
            if (username !== SUPERADMIN && this.authRoles.includes(role.name)) {
              return res.status(403).json({
                message: "You don't have the right to update this role",
              });
            }
            const {name} = req.body
            if (name) {
              const role = await db.role.update({
                where: {
                  id: parseInt(roleID),
                },
                data: {
                  name,
                },
              });
              return res.status(200).json({
                message: "Role updated successfully",
                role,
              });
            }

          } else {
            return res.status(404).json({
              message: "Role not found",
            });
          }
        }
      }
      return res.status(403).json({
        message: "You don't have the right to update a role",
      });

    } catch (err) {
      return res.status(500).json({
        message: "Something went wrong",
        err,
      });
    }
  }

  async deleteRole(req: Request, res: Response) {
    try {
      const { username } = req.body;

      if (username && await checkPermission(username)) {
        const {roleID} = req.params
        if (roleID) {
          const role = await db.role.findUnique({
            where: {
              id: parseInt(roleID),
            },
          });

          if (role) {
            if (username !== SUPERADMIN && this.authRoles.includes(role.name)) {
              return res.status(403).json({
                message: "You don't have the right to delete this role",
              });
            }
            const rolePermissions = await db.rolePermissions.findMany({
              where: {
                roleID: parseInt(roleID),
              },
            });

            if (rolePermissions.length > 0) {
              await db.rolePermissions.deleteMany({
                where: {
                  roleID: parseInt(roleID),
                },
              });
            }
            await db.role.delete({
              where: {
                id: parseInt(roleID),
              },
            });
            return res.status(200).json({
              message: "Role deleted successfully",
            });
          } else {
            return res.status(404).json({
              message: "Role not found",
            });
          }
        }
      }
      return res.status(403).json({
        message: "You don't have the right to delete a role",
      });

    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: "Something went wrong",
        err,
      });
    }
  }

  async getRole(req: Request, res: Response) {
    try {
      const { username } = req.body;

      if (username && await checkPermission(username)) {
        const {roleID} = req.params
        if (roleID) {
          const role = await db.role.findUnique({
            where: {
              id: parseInt(roleID),
            },
          });
          if(role) {
            // if (username !== SUPERADMIN && role.name === SUPERADMIN) {
            //   return res.status(403).json({
            //     message: "You don't have the right to fetch a role",
            //   });
            // }
            return res.status(200).json({
              message: "Role fetched successfully",
              role,
            });
          } else {
            return res.status(404).json({
              message: "Role not found",
            });
          }
        }
      }
      return res.status(403).json({
        message: "You don't have the right to fetch a role",
      });

    } catch (err) {
      return res.status(500).json({
        message: "Something went wrong",
        err,
      });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const { username } = req.body;

      if (username && await checkPermission(username)) {
        const roles: Role[] = await db.role.findMany();
        return res.status(200).json({
          message: "Roles fetched successfully",
          roles,
        });
      }
      return res.status(403).json({
        message: "You don't have the right to fetch roles",
      });

    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: "Something went wrong",
        err,
      });
    }
  }

  async addPermission(req: Request, res: Response) {
    try {
      const { username } = req.body;

      if (username && await checkPermission(username)) {
        const {roleID} = req.params
        const {permissionID} = req.query
        if (roleID && permissionID && typeof roleID === 'string' && typeof permissionID === 'string') {
          const role = await db.role.findUnique({
            where: {
              id: parseInt(roleID),
            },
          });
          if (role) {
            if (username !== SUPERADMIN && role.name === SUPERADMIN) {
              return res.status(403).json({
                message: "You don't have the right to add permission to this role",
              });
            }
            const permission = await db.permission.findUnique({
              where: {
                id: parseInt(permissionID),
              },
            });
            if (permission) {
              // check if role already has the permission
              const rolePermission = await db.rolePermissions.findFirst({
                where: {
                  roleID: parseInt(roleID),
                  permissionID: parseInt(permissionID),
                }
              })

              if (!rolePermission) {
                await db.rolePermissions.create({
                  data: {
                    roleID: parseInt(roleID),
                    permissionID: parseInt(permissionID),
                  },
                });
                return res.status(200).json({
                  message: "Permission added successfully",
                });
              } else {
                return res.status(400).json({
                  message: "Role already has the permission",
                });
              }
            } else {
              return res.status(404).json({
                message: "Permission not found",
              });
            }
          } else {
            return res.status(404).json({
              message: "Role not found",
            });
          }
        } else {
          return res.status(400).json({
            message: "RoleID or permissionID not provided",
          });
        }
      }
      return res.status(403).json({
        message: "You don't have the right to add a permission",
      });

    } catch (err) {
      return res.status(500).json({
        message: "Something went wrong",
        err,
      });
    }
  }

  async removePermission(req: Request, res: Response) {
    try {
      const {username} = req.body
      if (username && await checkPermission(username)) {
        const {roleID} = req.params
        const {permissionID} = req.query
        if (roleID && permissionID && typeof roleID === "string" && typeof permissionID === "string") {
          const role = await db.role.findUnique({
            where: {
              id: parseInt(roleID),
            },
          });
          if (role) {
            if (username !== SUPERADMIN && role.name === SUPERADMIN) {
              return res.status(403).json({
                message: "You don't have the right to remove permission from this role",
              });
            }
            const rolePermission = await db.rolePermissions.findFirst({
              where: {
                roleID: parseInt(roleID),
                permissionID: parseInt(permissionID),
              }
            })
            if (rolePermission) {
              await db.rolePermissions.delete({
                where: {
                  id: rolePermission.id,
                },
              });
              return res.status(200).json({
                message: "Permission removed successfully",
              });
            } else {
              return res.status(404).json({
                message: "Permission not found",
              });
            }
          } else {
            return res.status(404).json({
              message: "Role not found",
            });
          }
        } else {
          return res.status(400).json({
            message: "RoleID or permissionID not provided",
          });
        }
      }
      return res.status(403).json({
        message: "You don't have the right to remove a permission",
      });
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: "Something went wrong",
        err,
      });
    }
  }
}

const roleController = new RoleController();

export default roleController;