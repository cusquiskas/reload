

// Funciones de inicialización
$(function() {
    $('.divAEASolidaria input[readonly]').click(function() {
        $(this).blur();
    });
    $('.divAEASolidaria').click(function() {
        $('.divAEASolidaria label').addClass('active');
    });
});

function initDatosPersonales(datos) {
    Moduls.app.child.templateAplicacion.Forms.frmSolicitudAEA.set({
        p_codusr: datos.pernr,
        nombre: datos.nombre,
        dniusr: datos.perid,
        nomemp: datos.empresa,
        nomdep: datos.uni_org,
        p_email: datos.correo,
        p_tlfono: datos.telper
    });
}

// Funciones de Callback

function cbkOnload(s, d, e) {
    datosUsuarioLast({
        usr: Moduls.header.user.codusr,
        fnc: 'initDatosPersonales',
        nDatos: 'PL'
    });
}

function cbkSolicitudAEA(s, d, e) {
    if (s) {
        $('.formularioSolicitudAEA').addClass('dn');
        $('.agradecimientoSolicitudAEA').removeClass('dn');
    } else {
        validaErroresCbk(d);
    }
}