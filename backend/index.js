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

// obtener productos
app.get('/api/productos', (req, res) => {
  console.log("REQ BODY:", req.body);
  const sql = `
    SELECT p.*, c.nombre AS categoria_nombre 
    FROM Productos p
    JOIN Categoria c ON p.id_categoria = c.id_categoria
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});



app.post('/api/comprar', (req, res) => {
  console.log("REQ BODY:", req.body);
  const { productos, total, direccion, id_cliente } = req.body;
  const fecha = new Date();

  if (!productos || !Array.isArray(productos)) {
    return res.status(400).json({ error: "El campo productos es inválido o no existe." });
  }

  db.beginTransaction(err => {
    if (err) {
      console.error("Error al iniciar transacción:", err);
      return res.status(500).send("Error al iniciar transacción");
    }

    db.query(
      'INSERT INTO Venta (total, fecha_venta, direccion_envio, id_cliente) VALUES (?, ?, ?, ?)',
      [total, fecha, direccion, id_cliente],
      (err, result) => {
        if (err) {
          console.error("Error al insertar en Venta:", err);
          return db.rollback(() => res.status(500).send("Error al guardar venta"));
        }

        const id_venta = result.insertId;

        const acciones = productos.map(p => {
          return new Promise((resolve, reject) => {
            const subtotal = p.precio * p.cantidad;
            db.query(
              'INSERT INTO Detalle_venta (cantidad, precio_unitario, subtotal, id_venta, id_producto) VALUES (?, ?, ?, ?, ?)',
              [p.cantidad, p.precio, subtotal, id_venta, p.id_producto],
              err => {
                if (err) {
                  console.error("Error al insertar en Detalle_venta:", err);
                  return reject(err);
                }

                db.query(
                  'UPDATE Productos SET stock = stock - ? WHERE id_producto = ? AND stock >= ?',
                  [p.cantidad, p.id_producto, p.cantidad],
                  err => {
                    if (err) {
                      console.error("Error al actualizar stock:", err);
                      return reject(err);
                    }
                    resolve();
                  }
                );
              }
            );
          });
        });

        Promise.all(acciones)
          .then(() => {
            db.commit(err => {
              if (err) {
                console.error("Error al hacer commit:", err);
                return db.rollback(() => res.status(500).send("Error al confirmar compra"));
              }
              res.json({ success: true, id_venta });
            });
          })
          .catch(err => {
            console.error("Error en acciones de productos:", err);
            db.rollback(() => res.status(500).send("Error al procesar productos"));
          });
      }
    );
  });
});
// factura
app.get('/api/factura/:id', (req, res) => {
  const idVenta = req.params.id;

  const sql = `
    SELECT v.id_venta, v.fecha_venta, v.total, v.direccion_envio,
           d.cantidad, d.precio_unitario, d.subtotal,
           p.nombre AS nombre_producto
    FROM venta v
    JOIN detalle_venta d ON v.id_venta = d.id_venta
    JOIN productos p ON d.id_producto = p.id_producto
    WHERE v.id_venta = ?
  `;

  db.query(sql, [idVenta], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});


app.listen(3000, () => {
  console.log('Servidor backend corriendo en http://localhost:3000');
});