const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'farmacia_ecommerce'
});

// Probar conexión
db.connect(err => {
  if (err) {
    console.error('Error de conexión:', err);
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});

// Ejemplo: obtener productos
app.get('/api/productos', (req, res) => {
  db.query('SELECT * FROM Productos', (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

app.listen(3000, () => {
  console.log('Servidor backend corriendo en http://localhost:3000');
});
