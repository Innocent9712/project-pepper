import { PassThrough } from "stream";
import { db } from "../utils/db.server";
import redisClient from "../utils/redis.server";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

class Auth {
    async login(req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization;

            if (authHeader) {
                const basicAuth = authHeader.split(' ')[1];
                const decodedAuth = Buffer.from(basicAuth, 'base64').toString("utf8");
                const [username, password] = decodedAuth.split(':');

                const user = await db.user.findUnique({ where: { username } });
          
                if (user) {
                    const encodedpassword = Buffer.from(password, 'utf8').toString("base64");
                    if (user.password === encodedpassword) {
                        const token = uuidv4();
                        res.status(200).cookie('token', token).send(`${username} logged in`);
                        console.log(`${username} logged in`);
                    } else {
                        console.log('Incorrect Password');
                        res.status(401).send('Incorrect Password');
                    }
                } else {
                    console.log('User not found');
                    res.status(404).send('User not found');
                }
            }
        } catch (error) {
            console.log("Missing information");
            res.status(400).send('Bad request')
        }
          

    }
}

const auth = new Auth();
export default auth;