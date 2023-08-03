const express = require("express");
const mongoose = require("mongoose");


const { auth } = require("express-oauth2-jwt-bearer");
const errorHandler = require("./middlewares/errorHandler");


require('dotenv').config();

// Configuracion Middleware con el Servidor de Autorización 
const autenticacion = auth({
  audience: process.env.OAUTH_AUDIENCE,
  issuerBaseURL: process.env.OAUTH_URL,
  tokenSigningAlg: "RS256",
});


// URL de conexión a la base de datos MongoDB
const mongoURL = process.env.MONGO_URL;
console.log('Valor de MONGO_URL:', mongoURL);


// Conexión a la base de datos
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Conexión a la base de datos establecida');
}).catch((error) => {
  console.error('Error al conectar a la base de datos:', error);
  process.exit(1); // Salir de la aplicación en caso de error de conexión
});


const app = express();
app.use(express.json());

// Importamos el Router de Libros
const librosRouter = require("./routes/libros");

//Configuramos el middleware de autenticacion
app.use("/api/libros", autenticacion,  librosRouter);

app.use(errorHandler);

app.listen(3001, () => {
  console.log("Servidor iniciado en el puerto 3000");
});

module.exports = app;