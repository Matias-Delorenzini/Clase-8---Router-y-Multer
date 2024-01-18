// Importamos fs
import { promises as fsPromises } from 'fs';

// Declaramos la clase
class CartManager {
    constructor() {
        // Definimos las rutas de los archivos
        this.cartsPath = './data/carritos.json';
        this.productsPath = './data/productos.json';
        // Inicializamos
        this.init();
    }

    // Método de inicialización
    async init() {
        try {
            // Verificamos si existe el archivo de carritos
            await fsPromises.access(this.cartsPath);
        } catch (error) {
            // Si no existe, lo creamos con un array vacío
            await fsPromises.writeFile(this.cartsPath, JSON.stringify([]), 'utf-8');
        }
    }

    // Método para agregar un carrito
    async addCart() {
        try {
            // Leemos el contenido actual de los carritos
            let content = await fsPromises.readFile(this.cartsPath, 'utf-8');
            let carts = JSON.parse(content);
    
            // Encontramos el ID máximo actual
            const maxId = carts.reduce((max, cart) => (cart.id > max ? cart.id : max), 0);
    
            // Generamos un nuevo ID para el nuevo carrito
            const cartId = maxId + 1;
    
            // Creamos el nuevo carrito
            const newCart = {
                id: cartId,
                products: []
            };
    
            // Agregamos el nuevo carrito al array de carritos
            carts.push(newCart);
    
            // Escribimos el array de carritos de nuevo al archivo
            await fsPromises.writeFile(this.cartsPath, JSON.stringify(carts), 'utf-8');
    
            // Devolvemos un mensaje de éxito
            return { status: 201, message: `Carrito añadido exitosamente con ID: ${cartId}` };
        } catch (error) {
            // Manejamos errores
            return { status: 500, message: `Error al añadir el carrito: ${error.message}` };
        }
    }

    // Método para obtener un carrito por su ID
    async getCartById(requestedID) {
        try {
            // Convertimos el ID solicitado a un número
            const id = parseInt(requestedID);
            // Leemos el contenido actual de los carritos
            let content = await fsPromises.readFile(this.cartsPath, 'utf-8');
            const carts = JSON.parse(content);
            // Buscamos el carrito con el ID solicitado
            let cartFound = carts.find(cart => cart.id === id);
            // Si no se encuentra, devolvemos un mensaje de error
            if (!cartFound) {
                return { status: 404, message: `No existe un carrito con ID ${id}` };
            }
            // Devolvemos el carrito encontrado
            return { status: 200, data: cartFound };
        } catch (error) {
            // Manejamos errores
            return { status: 500, message: `Error al buscar el carrito con id ${id}: ${error.message}` };
        }
    }

    // Método para agregar un producto a un carrito
    async addProductToCart(requestedCartId, requestedProductId) {
        try {
            // Convertimos los IDs solicitados a números
            const cid = parseInt(requestedCartId);
            const pid = parseInt(requestedProductId);
    
            // Leemos el contenido actual de los carritos y productos
            const cartsContent = await fsPromises.readFile(this.cartsPath, 'utf-8');
            const productsContent = await fsPromises.readFile(this.productsPath, 'utf-8');
    
            // Parseamos los datos de carritos y productos
            const carts = JSON.parse(cartsContent);
            const products = JSON.parse(productsContent);
    
            // Encontramos el índice del carrito en el array de carritos
            const cartIndex = carts.findIndex(cart => cart.id === cid);
    
            // Verificamos si el carrito existe
            if (cartIndex !== -1) {
                // Obtenemos el carrito
                const cart = carts[cartIndex];
                
                // Buscamos el producto en la lista de productos
                const product = products.find(p => p.id === pid);

                // Si el producto existe
                if (product) {
                    // Encontramos el índice del producto en el carrito
                    const existingProductIndex = cart.products.findIndex(p => p.id === pid);
    
                    // Si el producto ya está en el carrito, incrementamos la cantidad
                    if (existingProductIndex !== -1) {
                        cart.products[existingProductIndex].quantity += 1;
                    } else {
                        // Si el producto no está en el carrito, lo añadimos con cantidad 1
                        cart.products.push({ id: pid, quantity: 1 });
                    }
    
                    // Escribimos el array de carritos de nuevo al archivo
                    await fsPromises.writeFile(this.cartsPath, JSON.stringify(carts), 'utf-8');
    
                    // Devolvemos un mensaje indicando la cantidad actual del producto en el carrito
                    if (!cart.products[existingProductIndex]){
                        return { status: 200, message: `Producto ID ${pid} agregado al carrito ID ${cid}. Hay 1 actualmente.` };
                    }
                    return { status: 200, message: `Producto ID ${pid} agregado al carrito ID ${cid}. Hay ${cart.products[existingProductIndex].quantity} actualmente.` };
                    
                } else {
                    // Si el producto no se encuentra, devolvemos un mensaje de error
                    return { status: 404, message: `Producto ID ${pid} no encontrado.` };
                }
            } else {
                // Si el carrito no se encuentra, devolvemos un mensaje de error
                return { status: 404, message: `Carrito ID ${cid} no encontrado.` };
            }
        } catch (error) {
            // Manejamos errores
            return { status: 500, message: `Error al agregar producto al carrito: ${error.message}` };
        }
    }
}

// Exportamos la clase
export default CartManager;
