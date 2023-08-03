# Usa la imagen base de Node.js
FROM node:14

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo package.json y package-lock.json a la imagen
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos de la aplicación a la imagen
COPY . .

# Expone el puerto en el que se ejecuta tu aplicación
EXPOSE 3000

# Comando para ejecutar tu aplicación con Nodemon
CMD ["npm", "start"]
