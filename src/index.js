import app from "./app.js";

const PORT = process.env.PORT || 3535;
app.listen(PORT, () => {
  console.log(`Servicio iniciado en el puerto ${PORT}`);
});
