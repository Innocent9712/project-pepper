import { PassThrough } from "stream";
import { db } from "../utils/db.server";
import redisClient from "../utils/redis.server";
// import { RedisClient} from "../utils/redis.server";
import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

// const redisClient = new RedisClient();

interface AuthRequest extends Request {
    username?: string;
}
class Auth {
    async login(req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization;
            console.log(authHeader)

            if (authHeader) {
                const basicAuth = authHeader.split(' ')[1];
                const decodedAuth = Buffer.from(basicAuth, 'base64').toString("utf8");
                const [username, password] = decodedAuth.split(':');

                const user = await db.user.findUnique({ where: { username } });
          
                if (user) {
                    const encodedpassword = Buffer.from(password, 'utf8').toString("base64");
                    if (user.password === encodedpassword) {
                        const token = uuidv4();
                        await redisClient.set(token, username, 60 * 60 * 24);
                        res.status(200).cookie('token', token).send(`${username} logged in`);
                        console.log(`${username} logged in`);
                    } else {
                        console.log('Incorrect Password');
                        console.log(decodedAuth)
                        res.status(401).send('Incorrect Password');
                    }
                } else {
                    console.log('User not found');
                    res.status(404).send('User not found');
                }
            }
        } catch (error) {
            console.log("Missing information", error);
            res.status(400).send('Bad request')
        }    
    }

    async auth(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const token = req.cookies.token;
            if (token) {
                const username = await redisClient.get(token);
                if (username) {
                    // req.username = username;
                    const user = await db.user.findUnique({ where: { username } });
                    if (user) {
                        req.username = username
                        res.cookie('token', token)
                        next();
                    }
                } else {
                    res.status(401).send('Unauthorized');
                }
            } else {
                res.status(401).send('Unauthorized');
            }
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
}

const auth = new Auth();
export default auth;