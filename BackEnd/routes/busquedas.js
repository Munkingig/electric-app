
// =========================================================
// Busqueda asincrona mediante promesas 
// =========================================================

var express = require('express');
var Usuario = require('../models/usuario');
var Producto = require('../models/producto');

var app = express();

// =========================================================
// Buscar por colección 
// =========================================================
app.get('/coleccion/:tabla/:busqueda', (req, res, next) => {

    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    var desde = req.query.desde || 0;
    desde = Number(desde);

    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex, desde);
            break;

        case 'productos':
            promesa = buscarProducto(busqueda, regex, desde);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Tipo incorrecto, introduce un usuario o producto',
                error: { message: 'Debe introducir usuarios o productos' }
            });

    }

    promesa.then(data => {

        res.status(200).json({

            ok: false,
            [tabla]: data,
            registros_actuales: (Object.keys(data).length - 1)

        });
    });
});

// =========================================================
// Buscar en toda la bd
// =========================================================
app.get('/bd/:busqueda', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
        buscarUsuarios(busqueda, regex, desde),
        buscarProducto(busqueda, regex, desde)
    ]).then(respuestas => {

        res.status(200).json({

            ok: true,
            usuarios: respuestas[0],
            productos: respuestas[1]

        });
    });
});

// =========================================================
// Funciones
// =========================================================

function buscarProducto(busqueda, regex, desde) {

    return new Promise((resolve, reject) => {

        Producto.count({}, (err, conteo) => {

            registros_totales = conteo;

        });

        Producto.find({ name: regex })
            .populate('Usuarios')
            .exec((err, productos) => {

                if (err) {

                    reject('Error al cargar los productos', err);

                } else {

                    resolve(productos);

                }

            });
    });

}

function buscarUsuarios(busqueda, regex, desde) {

    return new Promise((resolve, reject) => {

        Usuario.find({ name: regex })
            .exec((err, usuarios) => {

                if (err) {

                    reject('Error al cargar los usuarios', err);

                } else {

                    resolve(usuarios);

                }

            });
    });

}

module.exports = app;