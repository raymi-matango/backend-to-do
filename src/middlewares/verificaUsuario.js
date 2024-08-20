import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/parametros.js';

export const verificaUsuario = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso no autorizado, token requerido' });
  }

  try {
    const usuario = jwt.verify(token, JWT_SECRET);
    req.usuarioId = usuario.id; // Asegúrate de asignar el `usuarioId` al objeto `req`
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token no válido' });
  }
};
