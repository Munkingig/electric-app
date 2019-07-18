///////////////////////////////////////////////////
//  Schema de usuarios
///////////////////////////////////////////////////

var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator'); // Plugin para menssaje de error por unicidad

var Schema = mongoose.Schema;

// Roles validos
var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};

var usuarioSchema = new Schema({

    name: { type: String, required: [true, 'Required name'] },
    surnames: { type: String, required: [true, 'Required name'] },
    birthdate: { type: Date, required :[true, 'Required birth date'] },
    age : {type: String},
    gender: { type: String, values:['Masculino', 'Femenino']},
    city: { type: String },
    country: { type: String },
    email: { type: String, unique: true, required: [true, 'Required e-mail'] },
    password: { type: String, required: [true, 'Required password'] },
    img: { type: String, required: false },
    // role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos },
    __v: { type: Number, select: false },

});



usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' }) // Menssaje de error uniqueValidator

module.exports = mongoose.model('Usuario', usuarioSchema);
