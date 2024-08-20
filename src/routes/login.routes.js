import express from 'express';
import { registrar, login } from '../controller/loginController.js';

const router = express.Router();

// Rutas para las acciones de la API login
router.post('/registrar', registrar);
router.post('/login', login);


export default router;
