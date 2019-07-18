// =========================================================
// Rutas para subir imagenes
// =========================================================

var express = require('express');
const fileUpload = require('express-fileupload');
var Productos = require('../models/producto');
var Usuario = require('../models/usuario');
var fs = require('fs');
var respuesta = require('../config/respuestas');


var app = express();
app.use(fileUpload());

// Rutas para subir la imagen por tipo(productos/usuarios) y por id(idusuario/idproducto)
app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    //Validar tipos
    var tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Coleccion incorrecta',
            errors: { message: 'Los tipos permitidos son productos o usuarios' }
        });
    }

    if (!req.files.imagen || !req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio el archivo',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[Object.keys(nombreCortado).length - 1];

    // Extensiones aceptadas
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg', 'PNG'];
    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Archivo no soportado',
            errors: { message: 'Debe subir un archivo con formato ' + extensionesValidas }

        });
    }

    // Nombre de archivo personalizado
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;

    // Path de archivos
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;
    
    // movemos la imagen al sistem archivos(carpeta upload del proyecto)
    archivo.mv(path, err => {
        if (err) {
            respuesta.error500( err, res );
        }

        subirPorTipo(tipo, id, path, res);

    });
});

// Función para actualizar usuarios y productos con la ruta valida
function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                fs.unlinkSync(nombreArchivo);
                return respuesta.error404( err, res );
            }

            var pathViejo = usuario.image;
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ":)";

                return respuesta.OK201(usuarioActualizado, res);

            });
        });

    } else if (tipo === 'productos') {

        Productos.findById(id, (err, producto) => {


            if (!producto) {
                fs.unlinkSync(nombreArchivo);
                return respuesta.error404( err, res );
            }


            var pathViejo = producto.image;

            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }



            producto.image = nombreArchivo;
            producto.save((err, productoActualizado) => {

                return respuesta.OK201(productoActualizado, res);
                
            });
        });

    }

}

module.exports = app;