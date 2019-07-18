
// =========================================================
// login
// ========================================================= 

var express = require('express');
var bcrypt = require('bcryptjs'); // Encripta la contraseña
var jwt = require('jsonwebtoken'); // Libreria para crear los token
var SEED = require('../config/config').SEED;
var Usuario = require('../models/usuario');
var mdAutenticacion = require('../middlewares/autenticacion');
var respuesta = require('../config/respuestas');

var app = express();

// =========================================================
// Autenticación normal
// ========================================================= 

app.post('/', (req, res) => {

    var body = req.body;
    // Buscamos al usuario por mail
    Usuario.findOne({ email: body.email }).exec((err, usuarioDB) => {

        if (err) {
            return respuesta.error500( err, res );
        }

        if (!usuarioDB) {
            return respuesta.error404( err, res );
        }

        // Comprobamos que la contraseña introducida igual a la de la BD
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return respuesta.error404( err, res );
        }
        // Cambiamos el pass por una cara feliz :)
        usuarioDB.password = ':)'; 
        // Crear token
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });

        res.status(200).json({
            ok: true,
            user: usuarioDB,
            token: token,
            id: usuarioDB.id
        });

    })

})


// =========================================================
// Renovar toquen
// ========================================================= 

app.get('/renuevatoken', mdAutenticacion.verificaToken, (req, res) => {

    var token = jwt.sign({ usuario: req.usuario }, SEED, { expiresIn: 14400 });

    return res.status(200).json({
        ok: true,
        token: token
    });

});

module.exports = app;