///////////////////////////////////////////////////
//  Schema de productos
///////////////////////////////////////////////////

var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator'); // Plugin para menssaje de error por unicidad

var Schema = mongoose.Schema;

var productoSchema = new Schema({
    name: { type: String },
    description: { type: String },
    price: { type: Number },
    fechaDeCreacion: { type: Date, default: Date.now },
    image: { type: String, required: false },
    __v: { type: Number, select: false },
    user: { type: Schema.Types.ObjectId, ref: 'Usuario', required: [true, 'Es obligatorio introducir el usuario'] }

});

productoSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' }) // Menssaje de error uniqueValidator

module.exports = mongoose.model('Producto', productoSchema);