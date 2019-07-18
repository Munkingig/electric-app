
// =========================================================
// Errors
// =========================================================

module.exports.error500 = (err, res) => {

    return res.status(500).json({
        ok: false,
        mensaje: 'Error en bbdd, Internal Server Error.',
        errors: err
    });
  
};

module.exports.error404 = (err, res) => {

    return res.status(404).json({
        ok: false,
        mensaje: 'Datos no encontrados, asegurese de que el id es correcto.',
        errors: err
    });

};

module.exports.error400 = (err, res) => {

    return res.status(400).json({
        ok: false,
        mensaje: 'Bad Request',
        errors: err
    });

};

// =========================================================
// Peticiones correctas
// =========================================================

module.exports.OK200 = (datos, res) => {

    return res.status(200).json({
        ok: true,
        mensaje: 'Petición correcta',
        data: datos
    });

};

module.exports.OK200C = (datos, res, conteo) => {

    return res.status(200).json({
        ok: true,
        mensaje: 'Petición correcta',
        data: datos,
        count: conteo
    });

};

module.exports.OK201 = (datos, res) => {

    return res.status(201).json({
        ok: true,
        mensaje: 'Nuevo recurso creado o actualizado',
        data: datos
    });

};