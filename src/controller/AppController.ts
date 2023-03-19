import { db } from "../utils/db.server";
import redisClient from "../utils/redis.server";
import { Request, Response } from "express";

class AppController {
    async getStatus(req: Request, res: Response) {
        let dbStatus = false
        try {
            await db.$connect()
            await db.user.findMany()
            // await db.$queryRaw('SELECT 1')
            // console.log('Prisma client is okay')
            dbStatus = true
        } catch (error) {
            dbStatus = false
        }

        res.status(200).json({ db: true, redis: redisClient.isAlive() })
    }
}

const appController = new AppController();
export default appController;