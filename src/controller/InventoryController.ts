// Method to create a new inventory Item with an inital count of 0 if the user has the superadmin role or admin role or inventory manager role
// Method to fetch all inventory items by any user
// Method to update an inventory item only if the user has the superadmin role or admin role or inventory manager role
// Method to delete an inventory item only if the user has the superadmin role or admin role or inventory manager role
// Method to reduce the count of an inventory item only if the user has the superadmin role or admin role or sales role

import { db } from "../utils/db.server";
import { Request, Response, NextFunction } from "express";
import { checkPermission } from "../utils/utilFunctions";
import {BaseController, SUPERADMIN, ADMIN} from "./BaseController";
import { PassThrough } from "stream";
import { getUsername } from "../utils/utilFunctions";

interface CreateRequest extends Request {
    name: string;
}

class InventoryController {
  async create(req: Request, res: Response) {
    const username = await getUsername(req);
    if (username) {
      const user = await db.user.findUnique({ where: { username } });
      if (user) {
        const id = user.roleID;
        const permission = await db.rolePermissions.findFirst({ where: {roleID: id, permissionID: 9}});
        if (permission) {
          if (req.body) {
            console.log(req.body)
            res.send(req.body)
            /*
            try {
              const { name, description, quantity } = req.body;
              const newItem = await db.inventory.create({
                data: {
                  name: name,
                  description: description,
                  quantity: quantity,
                },
              });
              return res.status(201).json({
                message: "Inventory item created successfully",
                newItem,
              });
            } catch (err) {
              console.error(err);
              res.status(500).json({ error: 'Failed to create inventory item' });
            }
            */
          } else {
            console.log("Missing product information");
            res.status(400).send('Missing product information')
          }
        } else {
          console.log('You are not authorized to create an inventory item');
          res.status(401).send('You are not authorized to create an inventory item');
        }
      } else {
          console.log('User not found');
          res.status(404).send('User not found');
      }
    }

    res.status(200);
  }
}










/*
class InventoryControl {
  static async createInventory(req: Request, res: Response) {
    try {
      const { name, username } = req.body;

      const role = await db.role.findFirst({
        where: {
          id: user.roleID,
        },
      });

      if (
        role?.name === "superadmin" ||
        role?.name === "admin" ||
        role?.name === "inventory manager"
      ) {
        const inventory = await db.inventory.create({
          data: {
            name,
            description,
            price,
            count,

          name
          description
          quantity
          
          },
        });

        return res.status(201).json({
          message: "Inventory item created successfully",
          inventory,
        });
      } else {
        return res.status(401).json({
          message: "You are not authorized to create an inventory item",
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong",
        error: error.message,
      });
    }
  }

  static async fetchAll(req: Request, res: Response) {
    try {
      const inventory = await db.inventory.findMany();

      return res.status(200).json({
        message: "Inventory items fetched successfully",
        inventory,
      });
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
      const { name, description, price, count } = req.body;
      const user = req.user;

      const role = await db.role.findFirst({
        where: {
          id: user.roleID,
        },
      });

      if (
        role?.name === "superadmin" ||
        role?.name === "admin" ||
        role?.name === "inventory manager"
      ) {
        const inventory = await db.inventory.update({
          where: {
            id,
          },
          data: {
            name,
            description,
            price,
            count,
          },
        });

        return res.status(200).json({
          message: "Inventory item updated successfully",
          inventory,
        });
      } else {
        return res.status(401).json({
          message: "You are not authorized to update an inventory item",
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

  */
const inventoryController = new InventoryController();
export default inventoryController;