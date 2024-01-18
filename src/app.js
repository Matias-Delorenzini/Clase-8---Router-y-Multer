// PREENTREGA 1 Matias Delorenzini
// Importamos las dependencias
import express from 'express';
import bodyParser from 'body-parser';
import cartRouter from './routes/carts.router.js';
import productRouter from './routes/products.router.js';

// Inicializamos la aplicación y le indicamos que debe leer json
const app = express();
app.use(express.json());

// Definimos el port
const port = 8080;

// Definimos los routers
app.use('/api/carts', cartRouter);
app.use('/api/products', productRouter);


app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Hacemos listen
app.listen(port, () => {
    console.log(`Servidor arriba escuchando en el puerto ${port}`);
});

