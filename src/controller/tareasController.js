import db from "../config/firebase.js";
//Crear Tarea
export const crearTarea = async (req, res) => {
  try {
    const { titulo, descripcion, fechaVencimiento, prioridad, estado } = req.body;
    const usuarioId = req.usuarioId; // Obtener el `usuarioId` desde el middleware

    // Validaciones básicas
    if (!titulo || !descripcion) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    // Crear la nueva tarea con todos los campos adicionales
    const nuevaTarea = {
      titulo,
      descripcion,
      fecha_creacion: new Date().toISOString(),
      fecha_vencimiento: fechaVencimiento || null, // Fecha opcional
      prioridad: prioridad || "media", // Valor predeterminado a "media"
      estado: estado || "pendiente", // Estado predeterminado a "pendiente"
      usuario_id: usuarioId // Asociar la tarea al usuario autenticado
    };

    // Guardar la tarea en Firestore
    const tareaRef = await db.collection("tareas").add(nuevaTarea);

    // Responder con los detalles de la nueva tarea
    res.status(201).json({
      id: tareaRef.id,
      ...nuevaTarea,
    });
  } catch (error) {
    console.error("Error al crear la tarea:", error);
    res.status(500).send("Error al crear la tarea");
  }
};

//Lista de Tareas

export const obtenerTareas = async (req, res) => {
  try {
    const usuarioId = req.usuarioId; // Obtener el `usuarioId` desde el middleware
    // Consultar todas las tareas asociadas con el usuario autenticado
    const listaTareas = await db
      .collection("tareas")
      .where("usuario_id", "==", usuarioId)
      .get();

    // Verificar si el usuario tiene tareas
    if (listaTareas.empty) {
      return res
        .status(404)
        .json({ mensaje: "No se encontraron tareas para este usuario" });
    }

    // Crear una lista de las tareas obtenidas
    const tareas = listaTareas.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Responder con la lista de tareas
    res.status(200).json(tareas);
  } catch (error) {
    console.error("Error al obtener las tareas:", error);
    res
      .status(500)
      .json({ mensaje: "Error al obtener las tareas", error: error.message });
  }
};

//Actualizar
export const actualizarTarea = async (req, res) => {
  try {
    const usuarioId = req.usuarioId; // Obtener el `usuarioId` desde el middleware
    const { id } = req.params; // Obtener el ID de la tarea desde los parámetros de la URL
    const { titulo, descripcion, fechaVencimiento, prioridad, estado } = req.body;

    // Verificar si la tarea existe y pertenece al usuario autenticado
    const dataActualizar = await db.collection("tareas").doc(id).get();

    if (!dataActualizar.exists) {
      return res.status(404).json({ mensaje: "Tarea no encontrada" });
    }

    // Verificar si el usuario tiene permisos
    if (dataActualizar.data().usuario_id !== usuarioId) {
      return res
        .status(403)
        .json({ mensaje: "No tienes permiso para actualizar esta tarea" });
    }

    // Preparar los campos a actualizar
    const datosActualizados = {
      titulo: titulo || dataActualizar.data().titulo, // Si no se envía un nuevo título, mantener el actual
      descripcion: descripcion || dataActualizar.data().descripcion,
      fecha_vencimiento: fechaVencimiento || dataActualizar.data().fecha_vencimiento,
      prioridad: prioridad || dataActualizar.data().prioridad,
      estado: estado || dataActualizar.data().estado || "pendiente", // Estado predeterminado a "pendiente" si no se proporciona
    };

    // Realizar la actualización en Firestore
    await db.collection("tareas").doc(id).update(datosActualizados);

    // Responder con los datos actualizados
    res.status(200).json({ id, ...datosActualizados });

  } catch (error) {
    console.error("Error al actualizar la tarea:", error);
    res.status(500).json({ mensaje: "Error al actualizar la tarea", error: error.message });
  }
};


//Eliminar

export const eliminarTarea = async (req, res) => {
  try {
    const usuarioId = req.usuarioId; // Obtener el `usuarioId` desde el middleware
    const { id } = req.params; // Obtener el ID de la tarea desde los parámetros de la URL

    // Verificar si la tarea existe y pertenece al usuario autenticado
    const dataEliminar = await db.collection('tareas').doc(id).get();

    if (!dataEliminar.exists) {
      return res.status(404).json({ mensaje: "Tarea no encontrada" });
    }

    if (dataEliminar.data().usuario_id !== usuarioId) {
      return res.status(403).json({ mensaje: "No tienes permiso para eliminar esta tarea" });
    }

    // Eliminar la tarea en Firestore
    await db.collection('tareas').doc(id).delete();

    // Responder con un mensaje de éxito
    res.status(200).json({ mensaje: "Tarea eliminada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar la tarea:", error);
    res.status(500).json({ mensaje: "Error al eliminar la tarea", error: error.message });
  }
};

