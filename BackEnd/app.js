///////////////////////////////////////////////////
//  Archivo principal
///////////////////////////////////////////////////

// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var CON = require('./config/config').CON;


// Inicializar variables
var app = express();

// Cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// Importar rutas :)
var loginRoutes = require('./routes/login');
var usuarioRoutes = require('./routes/usuarios');
var productosRoutes = require('./routes/productos');
var busquedaRoutes = require('./routes/busquedas');
var imagenesRoutes = require('./routes/show_Img');
var uploadsRoutes = require('./routes/upload_Img');

// Conexión BBDD
mongoose.connection.openUri( CON, { useNewUrlParser: true }, (err, res) => { 
        if (err) throw err;
        console.log('Base datos Mongo puerto 27017: \x1b[32m%s\x1b[0m', 'online');
    })
 


// Rutas
// Se puede ver la api RESTful en: https://documenter.getpostman.com/view/3950371/S17tRntX
app.use('/busqueda', busquedaRoutes);
app.use('/login', loginRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/productos', productosRoutes);
app.use('/showImg', imagenesRoutes);
app.use('/uploadImg', uploadsRoutes);

// Escuchar peticiones 
app.listen(process.env.PORT || 3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
})