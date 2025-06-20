# Instalación de dependencias - Farmacia Salud Total

Este proyecto utiliza Node.js y MySQL. Asegúrate de tener instalados:

- Node.js (https://nodejs.org/)
- XAMPP con MySQL habilitado

## Pasos para instalar dependencias del backend

1. Abre una terminal en la carpeta `/backend`
2. Ejecuta el siguiente comando para instalar las dependencias necesarias:

```bash
npm install express mysql2 cors
```

Esto instalará:

- `express`: servidor backend
- `mysql2`: conexión a base de datos MySQL
- `cors`: manejo de peticiones entre dominios

## Base de datos

Importa el archivo `farmacia_ecommerce_completo.sql` en phpMyAdmin o usando la consola de XAMPP para crear la base de datos y cargar todos los datos.

