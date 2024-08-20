import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Exportar las variables necesarias
export const JWT_SECRET = process.env.JWT_SECRET;
