// Importamos la librería 'supertest' para hacer peticiones HTTP al servidor de pruebas
const request = require("supertest");

// Importamos la aplicación de Express que queremos probar
const app = require("../../src/app");

// Importamos el modelo 'libroModel' para simular interacciones con la base de datos
const libroModel = require("../../src/models/libroModel");

// Mockup de Autenticación
// Simulamos el módulo 'express-oauth2-jwt-bearer' para que retorne funciones vacías que pasan al siguiente middleware sin autenticar
jest.mock("express-oauth2-jwt-bearer", () => {
  return {
    auth: jest.fn().mockImplementation(() => (req, res, next) => next()),
    requiredScopes: jest.fn().mockImplementation(() => (req, res, next) => next()),
  };
});

// Mockup de Mongoose
// Simulamos el modelo 'libroModel' para que no realice operaciones reales de base de datos
jest.mock("../../src/models/libroModel");

// Iniciamos la descripción del conjunto de pruebas
describe("Libro API", () => {

  // Primera prueba: 'GET /libros' debería obtener todos los libros
  test("GET /libros debería obtener todos los libros", async () => {
    // Datos de libros ficticios que queremos que retorne el modelo 'libroModel.find'
    const mockLibros = [
      { id: "1", title: "Libro 1" },
      { id: "2", title: "Libro 2" },
    ];

    // Simulamos que el modelo 'libroModel.find' resuelve con los datos ficticios
    libroModel.find.mockResolvedValue(mockLibros);

    // Realizamos una petición HTTP GET al endpoint '/api/libros' utilizando 'supertest'
    const response = await request(app).get("/api/libros");

    // Comprobamos que el código de estado de la respuesta sea 200 (éxito)
    expect(response.status).toBe(200);

    // Comprobamos que el cuerpo de la respuesta sea igual a los datos ficticios
    expect(response.body).toEqual(mockLibros);

    // Comprobamos que la función 'libroModel.find' se haya llamado una sola vez
    expect(libroModel.find).toHaveBeenCalledTimes(1);
  });

  // Segunda prueba: 'POST /libros' debería crear un nuevo libro
  test("POST /libros debería crear un nuevo libro", async () => {
    // Datos de un nuevo libro que queremos crear
    const libroCreado = { id: "1", titulo: "Nuevo Libro", autor: "Juan Perez" };

    // Simulamos un objeto similar al modelo 'libroModel' que contendrá los datos del libro creado
    const libroMock = {
      ...libroCreado,
      // Definimos una función 'save' vacía para simular la función de guardar un libro en la base de datos
      save: () => {}
    };
    // Simulamos que el modelo 'libroModel.create' resuelve con el objeto del libro creado
    libroModel.create.mockResolvedValue(libroMock);
    // Realizamos una petición HTTP POST al endpoint '/api/libros' enviando el libro a crear
    const response = await request(app).post("/api/libros").send(libroMock);
    // Comprobamos que el código de estado de la respuesta sea 201 (creado)
    expect(response.status).toBe(201);

    // Comprobamos que el cuerpo de la respuesta sea igual al libro creado
    expect(response.body).toEqual(libroCreado);

    // Comprobamos que la función 'libroModel.create' se haya llamado una sola vez
    expect(libroModel.create).toHaveBeenCalledTimes(1);

    // Comprobamos que la función 'libroModel.create' se haya llamado con los datos del libro creado
    expect(libroModel.create).toHaveBeenCalledWith(libroCreado);
  });
});
