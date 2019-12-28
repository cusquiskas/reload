// Funciones de inicialización
$(function () {
    LibraryManager.load('filesaver-1.0.1', 'core', function () { });

    $datFis('input').focus(function () {
        $(this).blur();
        $datFis('label').addClass('active');
    });

    $datFis('form[name=frmDatosFiscales] .btn-cndadj').click(function () {
        let path = $datFis('form[name=frmDatosFiscales] [name=filepath]').val();
        let doc = $datFis('form[name=frmDatosFiscales] [name=p_cndadj]').val();
        if (doc != '') getFile(path + '/' + doc);
    });
    $datFis('form[name=frmDatosFiscales] .btn-ajtadj').click(function () {
        let path = $datFis('form[name=frmDatosFiscales] [name=filepath]').val();
        let doc = $datFis('form[name=frmDatosFiscales] [name=ajtadj]').val();
        if (doc != '') getFile(path + '/' + doc);
    });

    onload();
});

function onload() {
    Moduls.app.child.templateAplicacion.child.panelPlantilla.Forms.frmInit.set({
        p_codusr: Moduls.app.child.templateAplicacion.paramSelSolCae.param.numper,
        p_fecsol: Moduls.app.child.templateAplicacion.paramSelSolCae.param.fecsol
    });
    Moduls.app.child.templateAplicacion.child.panelPlantilla.Forms.frmInit.executeForm();

    Moduls.app.child.templateAplicacion.child.panelPlantilla.Forms.frmDatosFiscales.set({
        p_estsol: 'La solicitud se encuentra ' + Moduls.app.child.templateAplicacion.paramSelSolCae.param.destado
    });

    callFileOptions({ apl: 'autoservicio', cbk: 'cbkFileConfig' });
}

// Callback functions
function cbkInit(s, d, e) {
    if (s) {
        if (d.root.length > 0) {
            Moduls.app.child.templateAplicacion.child.panelPlantilla.Forms.frmDatosFiscales.set({
                p_cndadj: d.root[0].datfis.doc145,
                p_ajtadj: d.root[0].datfis.docIRPF
            });
            if (d.root[0].datfis.doc145) $datFis('.doc145').removeClass('dn');
            if (d.root[0].datfis.docIRPF) $datFis('.docIRPF').removeClass('dn');
        }
    } else {
        validaErroresCbk(d);
    }
}
function cbkFileConfig(conf) {
    Moduls.app.child.templateAplicacion.child.panelPlantilla.Forms.frmDatosFiscales.set({
        filepath: conf.ruta
    });
}

// Utils Functions
function $datFis(path) {
    return $('.datos-fiscales-cae ' + path);
}