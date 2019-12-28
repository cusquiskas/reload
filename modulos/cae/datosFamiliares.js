// Funciones de inicialización
$(function () {
    LibraryManager.load('filesaver-1.0.1', 'core', function () { });

    $datFam('input').focus(function () {
        $(this).blur();
        $datFam('label').addClass('active');
    });

    $datFam('form[name=frmDatosFamiliares] .btn-docadj').click(function () {
        let path = $datFam('form[name=frmDatosFamiliares] [name=filepath]').val();
        let doc = $datFam('form[name=frmDatosFamiliares] [name=p_docadj]').val();
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

    Moduls.app.child.templateAplicacion.child.panelPlantilla.Forms.frmDatosFamiliares.set({
        p_estsol: 'La solicitud se encuentra ' + Moduls.app.child.templateAplicacion.paramSelSolCae.param.destado
    });

    callFileOptions({ apl: 'autoservicio', cbk: 'cbkFileConfig' });
}

// Callback functions
function cbkInit(s, d, e) {
    if (s) {
        Moduls.app.child.templateAplicacion.child.panelPlantilla.Forms.frmDatosFamiliares.set({
            p_estcvl: d.list.datfam.desfam,
            p_fdesde: d.list.datfam.fdesde,
            p_docadj: d.list.datfam.docfam
        });
    } else {
        validaErroresCbk(d);
    }
}
function cbkFileConfig(conf) {
    Moduls.app.child.templateAplicacion.child.panelPlantilla.Forms.frmDatosFamiliares.set({
        filepath: conf.ruta
    });
}

// Utils Functions
function $datFam(path) {
    return $('.datos-familiares-cae ' + path);
}