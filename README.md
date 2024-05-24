# Backend Kainet

Este es el backend para la aplicación Kainet.

## Instalación

### Requisitos previos

- Asegúrate de tener Node.js y npm instalados en tu máquina. Si no los tienes, puedes descargarlos e instalarlos desde el [sitio web oficial de Node.js](https://nodejs.org/).

### Pasos

1. Clona el repositorio en tu máquina local:

   ```bash
   git clone https://github.com/Manuel-Lopez17/backend-kainet.git
   ```

2. Navega hasta el directorio del proyecto:

   ```bash
   cd backend-kainet
   ```

3. Instala las dependencias:

   ```bash
   npm install
   ```

4. Ejecuta en local:

   ```bash
   npm start
   ```

Este comando iniciará el servidor de desarrollo. Abre tu navegador y ve a [http://localhost:3000/](http://localhost:3000/) para ver la aplicación.

### Probar

Aquí tienes las URLs para probar el servicio en tu navegador:

- [http://localhost:3000/](http://localhost:3000/): Página principal
- [http://localhost:3000/posiciones](http://localhost:3000/posiciones): Request por defecto de posiciones
- [http://localhost:3000/posiciones?page=1&per_page=10&order=asc](http://localhost:3000/posiciones?page=1&per_page=10&order=asc): Request con parámetros
  - El parámetro `order` puede ser "asc" o "desc"
- [http://localhost:3000/usuarios](http://localhost:3000/usuarios): Request de usuarios

Para agregar un usuario desde la consola se puede usar el comando 

```
node addUser.js "Nombre del Usuario" "email@dominio.com"

```
