// Funciones de inicialización
$(function() {

    $relBancaria('input').focus(function() {
        $(this).blur();
        $relBancaria('label').addClass('active');
    });

    onload();
});

function onload() {
    Moduls.app.child.templateAplicacion.child.panelPlantilla.Forms.frmInit.set({
        p_codusr: Moduls.app.child.templateAplicacion.paramSelSolCae.param.numper,
        p_fecsol: Moduls.app.child.templateAplicacion.paramSelSolCae.param.fecsol
    });
    Moduls.app.child.templateAplicacion.child.panelPlantilla.Forms.frmInit.executeForm();

    Moduls.app.child.templateAplicacion.child.panelPlantilla.Forms.frmRelacionBancaria.set({
        p_estsol: 'La solicitud se encuentra ' + Moduls.app.child.templateAplicacion.paramSelSolCae.param.destado
    });
}

// Callback functions
function cbkInit(s, d, e) {
    if(s) {
        Moduls.app.child.templateAplicacion.child.panelPlantilla.Forms.frmRelacionBancaria.set({
            p_codibn: d.list.datban[0].ibanActual
        });
    } else {
        validaErroresCbk(d);
    }
}

// Utils Functions
function $relBancaria(path) {
    return $('.relacion-bancaria-cae ' + path);
}