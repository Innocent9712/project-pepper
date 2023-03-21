// I put all the assist functions here so that we have one place to modify them and
// they can be used every where.

import {BaseController, SUPERADMIN, ADMIN} from "../controller/BaseController";
import { Role, User } from "@prisma/client";
import { db } from "../utils/db.server";
import { Request, Response, NextFunction } from "express";
import { PassThrough } from "stream";
import redisClient from "../utils/redis.server";

interface AuthRequest extends Request {
    username?: string;
}

// This function parses cookies
export async function parseCookies(req: AuthRequest) {
    const cookies: {[key: string]: string} = {};
    if (req.headers.cookie) {
        req.headers.cookie.split(';').forEach(cookie => {
            const parts = cookie.split('=');
            cookies[parts[0].trim()] = parts[1].trim();
        });
    }
    return cookies;
}

// This function checks the persmissions assigned to a username
export async function checkPermission(username: string) {
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
    return false;
};
