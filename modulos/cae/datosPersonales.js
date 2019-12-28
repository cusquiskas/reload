// Funciones de inicialización
$(function() {

    $datPer('input').focus(function() {
        $(this).blur();
        $datPer('label').addClass('active');
    });

    onload();
});

function onload() {
    Moduls.app.child.templateAplicacion.child.panelPlantilla.Forms.frmInit.set({
        p_codusr: Moduls.app.child.templateAplicacion.paramSelSolCae.param.numper,
        p_fecsol: Moduls.app.child.templateAplicacion.paramSelSolCae.param.fecsol
    });
    Moduls.app.child.templateAplicacion.child.panelPlantilla.Forms.frmInit.executeForm();

    Moduls.app.child.templateAplicacion.child.panelPlantilla.Forms.frmDatosPersonales.set({
        p_estsol: 'La solicitud se encuentra ' + Moduls.app.child.templateAplicacion.paramSelSolCae.param.destado
    });
}

// Callback functions
function cbkInit(s, d, e) {
    if(s) {
        Moduls.app.child.templateAplicacion.child.panelPlantilla.Forms.frmDatosPersonales.set({
            p_clapub: d.root.datper.tipvia + ' ' + d.root.datper.destipvia,
            p_nomcll: d.root.datper.nomvia,
            p_numcll: d.root.datper.numvia,
            p_puecll: d.root.datper.plavia,
            p_infadc: d.root.datper.adivia,
            p_nompai: d.root.datper.desnacper,
            p_nomprv: d.root.datper.desproper,
            p_nompob: d.root.datper.pobper,
            p_codpst: d.root.datper.codcpo,
            p_telprn: d.root.datper.te1per
        });
    } else {
        validaErroresCbk(d);
    }
}

// Utils Functions
function $datPer(path) {
    return $('.datos-personales-cae ' + path);
}