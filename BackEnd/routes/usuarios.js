// =========================================================
// Rutas de usuario
// =========================================================
const moment = require('moment')
var express = require('express');
var bcrypt = require('bcryptjs'); // Encripta la contraseña
var mdAutenticacion = require('../middlewares/autenticacion');
var Usuario = require('../models/usuario');
var respuesta = require('../config/respuestas');

var app = express();

// =========================================================
// Obtener usuario por id
// =========================================================
app.get('/:id', (req, res, next) => {

    var id = req.params.id;
    Usuario.findById(id).exec((err, usuarios) => {

        if (err) {
            return respuesta.error500( err, res );
        }

        if (!usuarios) {
            return respuesta.error404( err, res );
        }

        respuesta.OK200(usuarios, res);

    })

});

// =========================================================
// Crear un nuevo usuario
// =========================================================
app.post('/', (req, res) => {

    var body = req.body;





    // Pasamos los campos que vienen de la petición a un objeto, el cual será insertado
    var usuario = new Usuario({
        name: body.name,
        surnames: body.surnames,
        birthdate: body.birthdate,
        age: birthdate(body.birthdate),
        gender: body.genero,
        city: body.city,
        country: body.country,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), // Contraseña encriptada
        img: body.img,
        role: body.role

    })
    if( usuario.age > 17 ) {
      // Guardamos el objeto
      usuario.save((err, usuarioGuardado) => {

          if (err) {
             return respuesta.error500( err, res );
          }

          respuesta.OK201(usuarioGuardado, res);

      });
    } else {
      return res.status(401).json({
          ok: false,
          mensaje: 'Edad incorrecta',
          errors: { message: 'Los tipos permitidos son productos o usuarios' }
      });
    }
});



// =========================================================
// Actualizar usuario
// =========================================================
app.put('/:id', /*[mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE_AND_USER],*/ (req, res) => {

    var id = req.params.id;
    var body = req.body;

    // Buscamos al usuario
    Usuario.findById(id).exec((err, usuario) => {

        if (err) {
            respuesta.error500( err, res );
        }

        if (!usuario) {
            respuesta.error404( err, res );
        }

        // Actualizamos los campos
        usuario.name = body.name
        usuario.surnames = body.surnames
        usuario.birthdate = birthdate(body.birthdate)
        usuario.gender = body.genero
        usuario.city = body.city
        usuario.country = body.country
        usuario.email = body.email
        usuario.password = bcrypt.hashSync(body.password, 10) // Contraseña encriptada
        usuario.img = body.img

        // Guardamos los nuevos datos en la BD
        if( usuario.age > 17 ) {
          // Guardamos el objeto
          usuario.save((err, usuarioGuardado) => {

              if (err) {
                 return respuesta.error500( err, res );
              }

              respuesta.OK201(usuarioGuardado, res);

          });
        } else {
          return res.status(401).json({
              ok: false,
              mensaje: 'Edad incorrecta',
              errors: { message: 'Los tipos permitidos son productos o usuarios' }
          });
        }
    })
});


// =========================================================
// Borrar un usuario por id
// =========================================================
app.delete('/:id', /*mdAutenticacion.verificaToken,*/ (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return respuesta.error500( err, res );
        }

        if (!usuarioBorrado) {
            return respuesta.error404( err, res );
        }

        respuesta.OK200(usuarioBorrado, res);

    });

});



function birthdate( birthdate ){
  var current_date = moment()
  var birthdate_b = moment(birthdate, 'YYYY-MM-DD')


  if(!birthdate_b.isValid()){
    console.log('Date entered does not validate')
  }
  else{
    console.log('Date is validate')
    var years = current_date.diff(birthdate, 'year')
    birthdate_b.add(years, 'year')
    var months = current_date.diff(birthdate_b, 'months')
    birthdate_b.add(months, 'months')
    var days = current_date.diff(birthdate_b, 'days')
    console.log(`The birthdate is:${years} ${months} ${days}`)
  }
  return years;
}

module.exports = app;
