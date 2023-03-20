import { db } from "../utils/db.server";
import { Request, Response, NextFunction } from "express";
import { BaseController, SUPERADMIN, ADMIN } from "./BaseController";

class PermissionController extends BaseController {
    constructor() {
        super()
    } 

    async getAll(req: Request, res: Response) {
        const permissions = await db.permission.findMany();
        res.status(200).json(permissions);
    }

}

const permissionController = new PermissionController();

export default permissionController;