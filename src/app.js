import express from 'express';
import cors from 'cors';
import loginRouter from './routes/login.routes.js';
import tareasRouter from './routes/tareas.routes.js'; // Importa tus rutas de tareas
import compartidosRouter from './routes/compartidos.routes.js';


// Creación de la aplicación
const app = express();

// Configuración de CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// APIs
app.use('/api/usuarios', loginRouter); // Rutas para manejo de usuarios y login
app.use('/api/tareas', tareasRouter); // Rutas para manejo de tareas
app.use('/api/compartidos', compartidosRouter); // Rutas para manejo de tareas compartidos






export default app;
