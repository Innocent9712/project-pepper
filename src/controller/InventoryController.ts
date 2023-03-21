// Method to create a new inventory Item with an inital count of 0 if the user has the superadmin role or admin role or inventory manager role
// Method to fetch all inventory items by any user
// Method to update an inventory item only if the user has the superadmin role or admin role or inventory manager role
// Method to delete an inventory item only if the user has the superadmin role or admin role or inventory manager role
// Method to reduce the count of an inventory item only if the user has the superadmin role or admin role or sales role

import { db } from "../utils/db.server";
import { Request, Response } from "express";
// import { checkPermission } from "../utils/utilFunctions";
// import {BaseController, SUPERADMIN, ADMIN} from "./BaseController";

interface CreateRequest extends Request {
    name: string;
}

class InventoryController {
  async create(req: Request, res: Response) {
    const { username } = req.body;
    if (username) {
      const user = await db.user.findUnique({ where: { username } });
      if (user) {
        //const id = user.roleID;
        const permission = await db.rolePermissions.findFirst({ where: {roleID: user.roleID, permissionID: 9}});
        if (permission) {
          try {
            const { name, description, quantity } = req.body;
            if (name && quantity) {
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
            } else {
              console.log("Missing information");
              res.status(400).send('Bad request');
            }
          } catch (err) {
              console.error(err);
              res.status(500).json({ error: 'Failed to create inventory item' });
            }
        } else {
          console.log('You are not authorized to create an inventory item');
          res.status(401).send('You are not authorized to create an inventory item');
        }
      }
    }
  }

  async updateItem(req: Request, res: Response) {
    const { username } = req.body;
    if (username) {
      const user = await db.user.findUnique({ where: { username } });
      if (user) {
        const permission = await db.rolePermissions.findFirst({ where: {roleID: user.roleID, permissionID: 11}});
        if (permission) {
          try {
            const { itemID } = req.params;
            if (itemID) {
              const item = await db.inventory.findUnique({ where: { id: parseInt(itemID) } });
              if (item) {
                const { name, description, quantity } = req.body;
                if (name || description ||quantity) {
                  const inventory = await db.inventory.update({
                    where: {
                      id: parseInt(itemID),
                    },
                    data: {
                      name,
                      description,
                      quantity,
                    },
                  });

                  return res.status(200).json({
                    message: "Inventory item updated successfully",
                    inventory,
                  });
                } else {
                  console.log("Missing information");
                  res.status(400).send('Bad request')
                }
              } else {
                return res.status(404).json({
                  message: "Item not found",
                });
              }
            }
          } catch (err) {
              console.error(err);
              res.status(500).json({ error: 'Failed to update inventory' });
            }
        } else {
          console.log('You are not authorized to update inventory');
          res.status(401).send('You are not authorized to update inventory');
        }
      }
    }
  }

  async fetchInventory(req: Request, res: Response) {
    const { username } = req.body;
    if (username) {
      const user = await db.user.findUnique({ where: { username } });
      if (user) {
        const permission = await db.rolePermissions.findFirst({ where: {roleID: user.roleID, permissionID: 10}});
        if (permission) {
          try {
            const inventory = await db.inventory.findMany();
            if (inventory) {
              return res.status(200).json({
                message: "Inventory items fetched successfully",
                inventory,
              });
            } else {
              console.log("Empty Database");
              res.status(404).send('Empty Database')
            }
          } catch (err) {
              console.error(err);
              res.status(500).json({ error: 'Failed to fetch inventory' });
            }
        } else {
          console.log('You are not authorized to fetch inventory');
          res.status(401).send('You are not authorized to fetch inventory');
        }
      }
    }
  }

  async deleteItem(req: Request, res: Response) {
    const { username } = req.body;
    if (username) {
      const user = await db.user.findUnique({ where: { username } });
      if (user) {
        const permission = await db.rolePermissions.findFirst({ where: {roleID: user.roleID, permissionID: 12}});
        if (permission) {
          try {
            const { itemID } = req.params;
            if (itemID) {
              const item = await db.inventory.findUnique({ where: { id: parseInt(itemID) } });
              if (item) {
                await db.inventory.delete({
                  where: {
                    id: parseInt(itemID),
                  },
                });
                return res.status(200).json({
                  message: "Item deleted successfully",
                })
              } else {
                return res.status(404).json({
                  message: "Item not found",
                });
              }
            } else {
              return res.status(404).json({
                message: "Item not found",
              });
            }
          } catch (err) {
              console.error(err);
              res.status(500).json({ error: 'Failed to delete item' });
            }
        } else {
          console.log('You are not authorized to update inventory');
          res.status(401).send('You are not authorized to update inventory');
        }
      }
    }
  }

  async sellItem(req: Request, res: Response) {
    const { username } = req.body;
    if (username) {
      const user = await db.user.findUnique({ where: { username } });
      if (user) {
        const permission = await db.rolePermissions.findFirst({ where: {roleID: user.roleID, permissionID: 13 || 14}});
        if (permission) {
          try {
            const { itemID } = req.params;
            if (itemID) {
              const { quantity } = req.body;
              if (quantity) {
                const item = await db.inventory.findUnique({ where: { id: parseInt(itemID) } });
                if (item) {
                  if (quantity <= item.quantity) {
                    const count = item.quantity - quantity;

                    const inventory = await db.inventory.update({
                      where: {
                        id: parseInt(itemID),
                      },
                      data: {
                        quantity: count,
                      },
                    });
    
                    return res.status(200).json({
                      message: "Inventory item sold successfully",
                      inventory,
                    });
                  } else {
                    console.log(`${quantity} is greater than what is available`);
                    res.status(500).json({ error: `${quantity} is greater than what is available` });
                  }
                } else {
                  return res.status(404).json({
                    message: "Item not found",
                  });
                }
                
              } else {
                console.log("Missing information");
                res.status(400).send('Bad request')
              }
            }
          } catch (err) {
              console.error(err);
              res.status(500).json({ error: 'Failed to update inventory' });
            }
        } else {
          console.log('You are not authorized to update inventory');
          res.status(401).send('You are not authorized to update inventory');
        }
      }
    }
  }
}

const inventoryController = new InventoryController();
export default inventoryController;