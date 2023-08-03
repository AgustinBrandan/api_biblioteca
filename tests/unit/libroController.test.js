// Importar las funciones del controlador a probar
const {
    getAllLibros,
    createLibro,
    updateLibro,
    deleteLibro,
    getLibroById,
  } = require("../../src/controllers/libroController");
  
  // Importar el modelo del libro y configurar un mock para simular interacciones con la base de datos
  const libroModel = require("../../src/models/libroModel");
  jest.mock("../../src/models/libroModel");
  
  // Descripción general del conjunto de pruebas para el controlador de libros
  describe("Libro Controller", () => {
    let mockRes;
  
    // Antes de cada prueba, crear un objeto mock de la respuesta HTTP
    beforeEach(() => {
      mockRes = {
        status: jest.fn().mockReturnThis(), // Función simulada para el código de estado de respuesta
        json: jest.fn(), // Función simulada para enviar datos en formato JSON en la respuesta
      };
    });
  
    // Prueba: Obtener todos los libros
    test("getLibros debería obtener todos los libros", async () => {
      const mockLibros = [
        { id: "1", title: "Libro 1" },
        { id: "2", title: "Libro 2" },
      ];
      libroModel.find.mockResolvedValue(mockLibros); // Simular que el modelo retorna los libros
      const mockReq = {};
      await getAllLibros(mockReq, mockRes); // Llamar a la función del controlador a probar
      expect(mockRes.status).toHaveBeenCalledWith(200); // Verificar que se responde con el código de estado 200
      expect(mockRes.json).toHaveBeenCalledWith(mockLibros); // Verificar que se envían los libros en formato JSON
    });
  
    // Prueba: Obtener un libro por ID
    test("getLibroById debería obtener un libro", async () => {
      const mockLibro = { id: "1", titulo: "Libro Encontrado", autor: "Juan Perez" };
      libroModel.findById.mockResolvedValue(mockLibro); // Simular que el modelo retorna un libro
      const mockReq = { params: { id: "1" } };
      await getLibroById(mockReq, mockRes); // Llamar a la función del controlador a probar
      expect(mockRes.status).toHaveBeenCalledWith(200); // Verificar que se responde con el código de estado 200
      expect(mockRes.json).toHaveBeenCalledWith(mockLibro); // Verificar que se envía el libro en formato JSON
    });
  
    // Prueba: Crear un nuevo libro
    test("createLibro debería crear un nuevo libro", async () => {
      const mockLibro = { id: "1", titulo: "Nuevo Libro", autor: "Juan Perez" };
      mockLibro.save = () => {}; // Agregar una función mock para simular el método "save" del modelo
      libroModel.create.mockResolvedValue(mockLibro); // Simular que el modelo crea el libro
      const mockReq = { body: mockLibro };
      await createLibro(mockReq, mockRes); // Llamar a la función del controlador a probar
      expect(mockRes.status).toHaveBeenCalledWith(201); // Verificar que se responde con el código de estado 201
      expect(mockRes.json).toHaveBeenCalledWith(mockLibro); // Verificar que se envía el libro creado en formato JSON
    });
  
    // Prueba: Actualizar un libro existente
    test("updateLibro debería actualizar un libro existente", async () => {
      const libroId = '1';
      const libroActualizado = { titulo: 'Libro Actualizado', autor: 'Autor Actualizado' };
      const libroActualizadoMock = { _id: libroId, ...libroActualizado };
      libroModel.findByIdAndUpdate.mockResolvedValue(libroActualizadoMock); // Simular que el modelo actualiza el libro
      const mockReq = { params: { id: "1" }, body: libroActualizado };
      await updateLibro(mockReq, mockRes); // Llamar a la función del controlador a probar
      expect(libroModel.findByIdAndUpdate).toHaveBeenCalledWith(libroId, libroActualizado, { new: true }); // Verificar que el modelo se llamó correctamente
      expect(mockRes.status).toHaveBeenCalledWith(200); // Verificar que se responde con el código de estado 200
      expect(mockRes.json).toHaveBeenCalledWith(libroActualizadoMock); // Verificar que se envía el libro actualizado en formato JSON
    });
  
    // Prueba: Actualizar un libro que no existe (caso de error)
    test("updateLibro debería devolver un error si el libro no existe", async () => {
      libroModel.findByIdAndUpdate.mockResolvedValue(null); // Simular que el modelo no encuentra el libro
      const mockReq = {
        params: { id: "99" },
        body: { titulo: "Libro Actualizado" },
      };
      await updateLibro(mockReq, mockRes); // Llamar a la función del controlador a probar
      expect(mockRes.status).toHaveBeenCalledWith(404); // Verificar que se responde con el código de estado 404
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Libro no encontrado" }); // Verificar que se envía un mensaje de error en formato JSON
    });
  
    // Prueba: Eliminar un libro existente
    test("deleteLibro debería eliminar un libro existente", async () => {
      const mockLibroEliminado = { titulo: 'Libro Eliminado', autor: 'Autor Eliminado' };
      libroModel.findByIdAndRemove.mockResolvedValue(mockLibroEliminado); // Simular que el modelo elimina el libro
      const mockReq = { params: { id: "1" } };
      await deleteLibro(mockReq, mockRes); // Llamar a la función del controlador a probar
      expect(libroModel.findByIdAndRemove).toHaveBeenCalledWith(mockReq.params.id); // Verificar que el modelo se llamó correctamente
      expect(mockRes.status).toHaveBeenCalledWith(200); // Verificar que se responde con el código de estado 200
      expect(mockRes.json).toHaveBeenCalledWith(mockLibroEliminado); // Verificar que se envía el libro eliminado en formato JSON
    });
  });
  