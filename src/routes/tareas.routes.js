import express from 'express';
import { actualizarTarea, crearTarea, eliminarTarea, obtenerTareas } from '../controller/tareasController.js';
import { verificaUsuario }from '../middlewares/verificaUsuario.js';


const router = express.Router();

// APIs después de Login de cada usuario
router.get('/lista', verificaUsuario, obtenerTareas);
router.post('/crear', verificaUsuario, crearTarea);
router.put('/actualizar/:id', verificaUsuario, actualizarTarea);
router.delete('/eliminar/:id', verificaUsuario, eliminarTarea);


export default router;
