// Funciones de inicialización de la página
$(function () {
    init();

    $consultasCae('form[name=frmConsultaCae] input[type=text]').change(function () {
        if (!$(this).val()) {
            $(this).parent().children().removeClass("active");
        } else {
            $(this).parent().children().addClass("active");
        }
    });
    $consultasCae('form[name=frmConsultaCae] .btn-add-attachment').click(function () {
        Moduls.app.child.templateAplicacion.child.panelPlantilla.fileUploader.content.click();
    });
    $consultasCae('form[name=frmConsultaCae] [name=p_docusr]').click(function () {
        $(this).blur();
    });
});
function init() {
    $consultasCae('form[name=frmConsultaCae] input[type=text], ' +
        'form[name=frmConsultaCae] textarea').val('');
    Moduls.app.child.templateAplicacion.child.panelPlantilla.fileUploader = new uploadProject();
    callFileOptions({ apl: 'autoservicio', cbk: 'configFileUploader' });
}
function configFileUploader(conf) {
    let fileUploader = Moduls.app.child.templateAplicacion.child.panelPlantilla.fileUploader;
    fileUploader.setFncValidation(function (s, d, e) {
        if (s) {
            $consultasCae('form[name=frmConsultaCae] [name=p_docusr]').change();
        } else {
            let msg =
                (d.type == 'smax') ? 'Excedido tamaño del documento:<br>Máximo: ' + d.fileMax + '<br>' + 'Real: ' + d.fileSize :
                    (d.type == 'exts') ? 'Tipo de archivo no permitido:<br>Permitidos: ' + d.exts + '<br>Real: ' + d.fileExt :
                        'Error desconocido validando el documento';
            toast({ tipo: 'error', msg: msg });
        }
    });
    fileUploader.setFncCallback(function (s, d, e) {
        if (s) {
            toast({ tipo: 'success', msg: 'El documento adjunto se ha subido correctamente' });
        } else {
            validaErroresCbk(d);
        }
        init();
    });
    fileUploader.setBoxEco($consultasCae('form[name=frmConsultaCae] [name=p_docusr]')[0]);
    fileUploader.setBtnDelete($consultasCae('form[name=frmConsultaCae] .btn-delete-attachment')[0]);
    fileUploader.setConfig(conf);
    fileUploader.initDocument();
}

// Funciones de Callback
function cbkConsultaCae(s, d, e) {
    if (s && d.errmsg.errtip != 'error') {
        toast({ tipo: 'success', msg: 'La consulta se ha registrado correctamente' });
        if (d.errmsg.doc) {
            let fileUploader = Moduls.app.child.templateAplicacion.child.panelPlantilla.fileUploader;
            fileUploader.uploadDocument({ file: d.errmsg.doc });
        } else {
            init();
        }
    } else {
        init();
        validaErroresCbk(d);
    }
}

// Utils Functions
function $consultasCae(path) {
    return $('.consultas-cae ' + path);
}