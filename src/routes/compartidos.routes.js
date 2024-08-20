import express from 'express';
import { verificaUsuario } from '../middlewares/verificaUsuario.js';
import { actualizarTareaCompartida, crearCompartidos, eliminarTareaCompartida, obtenerCompartidos } from '../controller/compartidosController.js';


const router = express.Router();

// APIs compartidos
router.post('/crear', verificaUsuario, crearCompartidos);
router.get('/lista', verificaUsuario, obtenerCompartidos)
router.delete('/eliminar/:id', verificaUsuario, eliminarTareaCompartida)
router.put('/actualizar/:id', verificaUsuario, actualizarTareaCompartida)


export default router;
