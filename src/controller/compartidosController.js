import db from '../config/firebase.js';

export const crearCompartidos = async (req, res) => {
  try {
    const { titulo, descripcion, fechaVencimiento, prioridad, estado, correosColaboradores } = req.body;
    const usuarioId = req.usuarioId; // ID del usuario autenticado

    // Validar campos requeridos
    if (!titulo || !descripcion) {
      return res.status(400).json({ mensaje: "Título y descripción son obligatorios" });
    }

    // Crear la nueva tarea en la colección 'compartidos'
    const nuevaTarea = {
      titulo,
      descripcion,
      fecha_creacion: new Date().toISOString(),
      fecha_vencimiento: fechaVencimiento || null, // Fecha opcional
      prioridad: prioridad || "media", // Valor predeterminado a "media"
      estado: estado || "pendiente", // Estado predeterminado a "pendiente"
      compartida_por: usuarioId, // ID del usuario que creó la tarea
      compartida_con: [usuarioId] // El creador de la tarea también es un colaborador
    };

    // Guardar la tarea en la tabla 'compartidos'
    const tareaRef = await db.collection('compartidos').add(nuevaTarea);
    const tareaId = tareaRef.id; // ID de la tarea recién creada

    // Si hay correos para compartir, buscar usuarios y agregar sus IDs a la tarea
    if (correosColaboradores?.length) {
      const usuariosSnapshot = await db.collection('usuarios')
        .where('correo', 'in', correosColaboradores)
        .get();

      const nuevosColaboradores = usuariosSnapshot.docs.map(doc => doc.id);

      // Actualizar la tarea con los nuevos colaboradores
      await db.collection('compartidos').doc(tareaId).update({
        compartida_con: [...nuevaTarea.compartida_con, ...nuevosColaboradores]
      });
    }

    // Responder con un mensaje de éxito y el ID de la tarea creada
    res.status(201).json({ mensaje: "Tarea creada y compartida exitosamente en la tabla 'compartidos'", id: tareaId });
  } catch (error) {
    console.error("Error al crear y compartir la tarea:", error);
    res.status(500).json({ mensaje: "Error al crear y compartir la tarea" });
  }
};
//Lista

export const obtenerCompartidos = async (req, res) => {
  try {
    const usuarioId = req.usuarioId; // ID del usuario autenticado

    // Consultar todas las tareas compartidas con el usuario autenticado
    const tareasSnapshot = await db.collection('compartidos')
      .where('compartida_con', 'array-contains', usuarioId)
      .get();

    if (tareasSnapshot.empty) {
      return res.status(404).json({ mensaje: "No se encontraron tareas compartidas para este usuario" });
    }

    // Crear una lista de las tareas compartidas obtenidas
    const tareasCompartidas = tareasSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Responder con la lista de tareas compartidas
    res.status(200).json(tareasCompartidas);
  } catch (error) {
    console.error("Error al obtener las tareas compartidas:", error);
    res.status(500).json({ mensaje: "Error al obtener las tareas compartidas", error: error.message });
  }
};

//Eliminar

export const eliminarTareaCompartida = async (req, res) => {
  try {
    const usuarioId = req.usuarioId; // ID del usuario autenticado
    const { id } = req.params; // ID de la tarea compartida

    // Obtener la tarea compartida
    const tareaDoc = await db.collection('compartidos').doc(id).get();

    if (!tareaDoc.exists) {
      return res.status(404).json({ mensaje: "Tarea no encontrada" });
    }

    // Verificar que el usuario autenticado sea el creador de la tarea
    if (tareaDoc.data().compartida_por !== usuarioId) {
      return res.status(403).json({ mensaje: "No tienes permiso para eliminar esta tarea" });
    }

    // Eliminar la tarea
    await db.collection('compartidos').doc(id).delete();

    res.status(200).json({ mensaje: "Tarea eliminada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar la tarea compartida:", error);
    res.status(500).json({ mensaje: "Error al eliminar la tarea compartida", error: error.message });
  }
};

//Actualizar
export const actualizarTareaCompartida = async (req, res) => {
  try {
    const usuarioId = req.usuarioId; // ID del usuario autenticado
    const { id } = req.params; // ID de la tarea compartida
    const { titulo, descripcion, fechaVencimiento, prioridad, estado } = req.body;

    // Obtener la tarea compartida
    const tareaDoc = await db.collection('compartidos').doc(id).get();

    if (!tareaDoc.exists) {
      return res.status(404).json({ mensaje: "Tarea no encontrada" });
    }

    // Verificar que el usuario autenticado sea el creador de la tarea o un colaborador
    const { compartida_por, compartida_con } = tareaDoc.data();
    if (compartida_por !== usuarioId && !compartida_con.includes(usuarioId)) {
      return res.status(403).json({ mensaje: "No tienes permiso para actualizar esta tarea" });
    }

    // Actualizar la tarea con los nuevos datos proporcionados
    const datosActualizados = {
      titulo: titulo || tareaDoc.data().titulo,
      descripcion: descripcion || tareaDoc.data().descripcion,
      fecha_vencimiento: fechaVencimiento || tareaDoc.data().fecha_vencimiento,
      prioridad: prioridad || tareaDoc.data().prioridad,
      estado: estado || tareaDoc.data().estado,
    };

    await db.collection('compartidos').doc(id).update(datosActualizados);

    res.status(200).json({ mensaje: "Tarea actualizada exitosamente", id });
  } catch (error) {
    console.error("Error al actualizar la tarea compartida:", error);
    res.status(500).json({ mensaje: "Error al actualizar la tarea compartida", error: error.message });
  }
};