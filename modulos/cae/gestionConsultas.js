// Funciones de inicialización
$(function () {
    LibraryManager.load('filesaver-1.0.1', 'core', function () { });

    $gestCons('input').focus(function () {
        $(this).blur();
        $gestCons('label').addClass('active');
    });

    $gestCons('form[name=frmGestionConsulta] .btn-docadj-consulta').click(function () {
        let path = $gestCons('form[name=frmGestionConsulta] [name=filepath]').val();
        let doc = $gestCons('form[name=frmGestionConsulta] [name=p_docadj]').val();
        if (doc != '') getFile(path + '/' + doc);
    });
    $gestCons('form[name=frmGestionConsulta] .btn-docadj-respuesta').click(function () {
        let path = $gestCons('form[name=frmGestionConsulta] [name=filepath]').val();
        let doc = $gestCons('form[name=frmGestionConsulta] [name=p_docmnt]').val();
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

    Moduls.app.child.templateAplicacion.child.panelPlantilla.Forms.frmGestionConsulta.set({
        p_estsol: 'La solicitud se encuentra ' + Moduls.app.child.templateAplicacion.paramSelSolCae.param.destado
    });

    callFileOptions({ apl: 'autoservicio', cbk: 'cbkFileConfig' });
}

// Callback functions
function cbkInit(s, d, e) {
    if (s) {
        Moduls.app.child.templateAplicacion.child.panelPlantilla.Forms.frmGestionConsulta.set({
            p_asunto: d.reclamaciones.asunto,
            p_docadj: d.reclamaciones.docusr,
            p_texto: d.reclamaciones.contenido,
            p_motivo: d.reclamaciones.desmotivo,
            p_docmnt: d.reclamaciones.adjunto
        });
        let respuesta = $.parseHTML(
            '<span>' +
                d.reclamaciones.respuesta.replace(/\\n/g, '<br>') +
            '</span>')
        $gestCons('.p_histrl').html(respuesta);
    } else {
        validaErroresCbk(d);
    }
}
function cbkFileConfig(conf) {
    Moduls.app.child.templateAplicacion.child.panelPlantilla.Forms.frmGestionConsulta.set({
        filepath: conf.ruta
    });
}

// Utils Functions
function $gestCons(path) {
    return $('.gestion-consulta-cae ' + path);
}