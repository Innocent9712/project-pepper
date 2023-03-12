import express from 'express';
import appController from '../controller/AppController';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.get('/status', (req, res) => {
    appController.getStatus(req, res)
})

export default router;
