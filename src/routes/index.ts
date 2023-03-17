import express from 'express';
import appController from '../controller/AppController';
import auth from '../controller/AuthController';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.get('/status', (req, res) => {
    appController.getStatus(req, res)
})

router.get('/login', (req, res) => {
    auth.login(req, res);
})

export default router;
