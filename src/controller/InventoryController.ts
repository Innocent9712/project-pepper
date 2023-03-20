// Method to create a new inventory Item with an inital count of 0 if the user has the superadmin role or admin role or inventory manager role
// Method to fetch all inventory items by any user
// Method to update an inventory item only if the user has the superadmin role or admin role or inventory manager role
// Method to delete an inventory item only if the user has the superadmin role or admin role or inventory manager role
// Method to reduce the count of an inventory item only if the user has the superadmin role or admin role or sales role

import { db } from "../utils/db.server";
import { Request, Response, NextFunction } from "express";
import { checkPermission } from "./RoleController";
import {BaseController, SUPERADMIN, ADMIN} from "./BaseController";

interface CreateRequest extends Request {
    name: string;
}



class InventoryController {
  static async create(req: Request, res: Response) {
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

const inventoryController = new InventoryController();
export default inventoryController;