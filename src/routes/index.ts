import express from 'express';
import appController from '../controller/AppController';
import auth from '../controller/AuthController';
import inventoryController from '../controller/InventoryController';
import roleController from '../controller/RoleController';
import userController from '../controller/UserController';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World!');
});

// router.get('/status', (req, res) => {
//     appController.getStatus(req, res)
// })

router.get('/status', appController.getStatus)

router.post('/login', (req, res) => {
    auth.login(req, res);
})

router.post('/logout', auth.logout)

// router.get("/inventory/:id", auth.auth, inventoryController.get)

export default router;
