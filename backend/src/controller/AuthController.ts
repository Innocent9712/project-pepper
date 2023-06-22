import { db } from "../utils/db.server";
import redisClient from "../utils/redis.server";
import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { parseCookies } from "../utils/utilFunctions";
import opentelemetry from '@opentelemetry/api';


interface AuthRequest extends Request {
    username?: string;
}
class Auth {
    async login(req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization;

            if (authHeader) {
                const basicAuth = authHeader.split(' ')[1];
                const decodedAuth = Buffer.from(basicAuth, 'base64').toString("utf8");
                const [username, password] = decodedAuth.split(':');

                const user = await db.user.findUnique({ where: { username } }) || await db.user.findUnique({ where: {email: username}});
          
                if (user) {
                    const encodedpassword = Buffer.from(password, 'utf8').toString("base64");
                    if (user.password === encodedpassword) {
                        const token = uuidv4();
                        await redisClient.set(token, username, 60 * 60 * 24);
                        res.status(200).cookie('token', token).json({session_token: token});
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
            console.log("Missing information", error);
            res.status(400).send('Bad request')
        }    
    }

    async logout(req: Request, res: Response) {
        try {
            const cookies = await parseCookies(req);
            const {token} = cookies

            let bearer
            
            const authHeader = req.headers['authorization'];
            
            if (authHeader && authHeader.startsWith('Bearer ')) {
              bearer = authHeader.split(' ')[1];
            }
            
            const tokenValue = token || bearer

            if (tokenValue) {
                await redisClient.del(tokenValue);
                console.log(`logged out`);
                res.status(200).clearCookie('token').send('Logged out');
            } else {
                res.status(401).send('Unauthorized');
            }
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal server error');
        }
    }

    async auth(req: AuthRequest, res: Response, next: NextFunction) {
        let activeSpan = opentelemetry.trace.getActiveSpan();
        try {
            const cookies = await parseCookies(req);
            const {token} = cookies
            let bearer
            
            const authHeader = req.headers['authorization'];
            
            if (authHeader && authHeader.startsWith('Bearer ')) {
              bearer = authHeader.split(' ')[1];
            }
            
            const tokenValue = token || bearer
            
            if (tokenValue) {
                const username = await redisClient.get(tokenValue);
                if (username) {
                    // req.username = username;
                    const user = await db.user.findUnique({ where: { username } });
                    
                    if (user) {
                        activeSpan?.setAttribute("user.id", user.id);
                        activeSpan?.setAttribute("user.name", username);
                        req.body = {...req.body, uname: username};
                        // req.body.username = username
                        res.cookie('token', tokenValue)
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