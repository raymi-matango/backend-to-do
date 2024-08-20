/*import fs from 'fs';
import admin from 'firebase-admin';

// Función para cargar el archivo JSON
const loadJSON = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));

// Cargar el archivo JSON con las credenciales de Firebase
const servicioFirebase = loadJSON('/etc/secrets/firebaseKey.json');

// Inicializar Firebase con las credenciales de la cuenta de servicio
admin.initializeApp({
    credential: admin.credential.cert(servicioFirebase),
});

// Exportar la referencia a la base de datos Firestore
const db = admin.firestore();

export default db;*/

import fs from 'fs';
import admin from 'firebase-admin';

// Función para cargar el archivo JSON
const loadJSON = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));

// Cargar el archivo JSON con las credenciales de Firebase desde la ruta de secrets en Render
const servicioFirebase = loadJSON('/etc/secrets/firebaseKey.json');

// Inicializar Firebase con las credenciales de la cuenta de servicio
admin.initializeApp({
    credential: admin.credential.cert(servicioFirebase),
});

// Exportar la referencia a la base de datos Firestore
const db = admin.firestore();

export default db;

