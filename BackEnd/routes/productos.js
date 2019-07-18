// =========================================================
// Rutas para productos
// =========================================================

var express = require('express');
var bcrypt = require('bcryptjs'); // Encripta la contraseña
var mdAutenticacion = require('../middlewares/autenticacion'); // Añadir una vez finalice el desarrollo 
var Producto = require('../models/producto');
var respuesta = require('../config/respuestas');
const http = require('http');
var app = express();


// =========================================================
// Obtener todos los productos 
// =========================================================
app.get('/', (req, res, next) => {

    // Parametros para seleccionar intervalo de productos a mostrar
    var desde = req.query.desde || 0;
    var hasta = req.query.hasta || 5;
    desde = Number(desde);
    hasta = Number(hasta);

    Producto.find({}).populate('user').skip(desde).limit(hasta).exec((err, productos) => {

        if (err) {
            return respuesta.error500( err, res );
        }

        Producto.count({}, (err, conteo) => {
            respuesta.OK200C(productos, res, conteo);
        });
    });
});


// =========================================================
// Obtener un producto por id 
// =========================================================
app.get('/:id', (req, res, next) => {

    var id = req.params.id;

    Producto.findById(id).populate('user').exec((err, productos) => {

        if (err) {
            return respuesta.error500( err, res );
        }

        if (!productos) {
            return respuesta.error404( err, res );
        }

        respuesta.OK200(productos, res);

    });
});

// =========================================================
// Obtener todos los productos creados por el usuario
// =========================================================
app.get('/ownInventory/:userId', (req, res, next) => {
    
    var id = req.params.userId;

    Producto.find({user:id}).populate('user').exec((err, productos) => {

        if (err) {
            console.log("error");
            return respuesta.error500( err, res );
        }

        if (!productos) {
            return respuesta.error404( err, res );
        }

        respuesta.OK200(productos, res);

    });
});

// =========================================================
// Mostrar productos por ciudad
// =========================================================
app.get('/filter/:city', (req, res, next) => {

    var city = req.params.city;

    var desde = req.query.desde || 0;
    var hasta = req.query.hasta || 5;
    desde = Number(desde);
    hasta = Number(hasta);

    Producto.find({}).populate({path: 'user', match:{ city: city }}).skip(desde).limit(hasta).exec((err, productos) => {

        if (err) {
            return respuesta.error500( err, res );
        }
        if(!productos[0].user) {
            return respuesta.error404( err, res );
        }
        var products = [];
        var cont = 0;

        for ( let i = 0; i < productos.length; i++) {
            if(productos[i].user != null){
                products[i] = productos[i];
                cont++;
            }
        }
        respuesta.OK200C(products, res, cont);

    })

});

// =========================================================
// Crear un nuevo producto
// =========================================================
app.post('/', (req, res) => {
    var body = req.body;
    var producto = new Producto({
        name: body.name,
        price: body.price,
        description: body.description,
        user: body.user

    })

    producto.save((err, productoGuardado) => {

        if (err) {
            return respuesta.error500( err, res );
        }

        respuesta.OK201(productoGuardado, res);

    });
});

// =========================================================
// Actualizar producto
// =========================================================
app.put('/:id' /*, mdAutenticacion.verificaToken*/ , (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Producto.findById(id, (err, producto) => {

        if (err) {
            return respuesta.error500( err, res );
        }

        if (!producto) {
            return respuesta.error404( err, res );
        }

        producto.name = body.name;
        producto.price = body.price;
        producto.image = body.image;
        producto.description = body.description;


        producto.save((err, productoGuardado) => {

            if (err) {
                return respuesta.error400( err, res );
            }

            respuesta.OK201(productoGuardado, res);

        });
    });
});


// =========================================================
// Borrar un producto por id
// =========================================================
app.delete('/:id' /*, mdAutenticacion.verificaToken*/ , (req, res) => {

    var id = req.params.id;

    Producto.findByIdAndRemove(id, (err, productoBorrado) => {

        if (err) {
            return respuesta.error500( err, res );
        }

        if (!productoBorrado) {
            return respuesta.error404( err, res );
        }

        respuesta.OK200(productoBorrado, res);

    });
});

// =========================================================
// Mostrar productos ordenados por propiedad
// ========================================================= 
// La propiedad puede ser asc(ascendente) o desc(descendente)
app.get('/:orden/:propiedad', (req, res, next) => {

    var propiedad = req.params.propiedad;
    var orden = req.params.orden;

    Producto.find({}).populate('user').exec((err, products) => {

        if (err) {
            return respuesta.error500( err, res );
        }

        var oJSON = sortJSON1(products, propiedad, orden);

        Producto.count({}, (err, cont) => {
            respuesta.OK200C(oJSON, res, cont);
        })

    })

});

// =========================================================
// Ordenar JSON
// =========================================================

function sortJSON1(data, key, orden) {
    return data.sort((a, b) => {
        var x = a[key],
            y = b[key];

        if (x == undefined) { x = 0 }
        if (y == undefined) { y = 0 }

        if (orden === 'asc') {
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }

        if (orden === 'desc') {
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        }
    });
}

module.exports = app;