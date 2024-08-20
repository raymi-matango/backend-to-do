import db from "../config/firebase.js";
import { JWT_SECRET } from "../config/parametros.js";
import jwt from "jsonwebtoken";

// Función para registrar un nuevo usuario
export const registrar = async (req, res) => {
  try {
    const nuevoUsuario = req.body; // Obtener los datos del usuario desde el cuerpo de la solicitud
    // Guardar el nuevo usuario en la colección "usuarios"
    const docRef = await db.collection("usuarios").add(nuevoUsuario);
    res.status(201).json({ id: docRef.id, ...nuevoUsuario }); // Responder con el ID del nuevo usuario y sus datos
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).send("Error al registrar usuario");
  }
};

// Función para iniciar sesión
export const login = async (req, res) => {
  try {
    const { correo, clave } = req.body;

    // Verificación
    const queryUsuario = await db
      .collection("usuarios")
      .where("correo", "==", correo)
      .where("clave", "==", clave)
      .get();

    if (queryUsuario.empty) {
      return res.status(401).json({ mensaje: "Correo o clave incorrectos" });
    }

    // Extraer el usuario y su ID
    const usuarioDoc = queryUsuario.docs[0]; // Obtener el primer documento encontrado
    const usuario = usuarioDoc.data();
    const usuarioId = usuarioDoc.id; // Obtener el ID del documento

    // Generar el token JWT incluyendo el `usuarioId`
    const token = jwt.sign({ id: usuarioId, correo: usuario.correo }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ mensaje: "Inicio de sesión exitoso", token });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).send("Error al iniciar sesión");
  }
};
