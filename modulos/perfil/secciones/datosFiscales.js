var datosFiscales = class {

    constructor(modulo) {
        Moduls.app.ExisteDatosFiscales = true;

        if ((!Moduls.app.ExisteDatosPersonales && !Moduls.app.ExisteDatosEmpresa) || getPerfilEmpleadoDefault() === 'datosFiscales') {
            $('.aperturaDatosPersonales').removeClass('cambio');
            $('.cuerpoDatosPersonales').removeClass('show');
            $('#heading6').addClass('cambio');
            $('#collapse6').addClass('show');
        }

        LibraryManager.load('filesaver-1.0.1', 'core', function () { });
    }

    initDatosFiscales(s, d, e) {
        if (s) {
            let objeto = {};
            if (d.list) {
                if (d.list.datfis) {
                    for (let chd in d.list.datfis) {
                        if (d.list.datfis.codusr.length > 1) {
                            objeto['p_' + chd] = d.list.datfis[chd][0];
                        } else {
                            objeto['p_' + chd] = d.list.datfis[chd];
                        }
                        if (chd === 'doc145') {
                            Moduls.app.CondicionesOrigen = '/var/www/repositorio/newintra/rrhh/autoservicio/' + objeto.p_doc145;
                            Moduls.app.CondicionesNombre = objeto.p_doc145;

                        }
                        if (chd === 'docIRPF') {
                            Moduls.app.AjustesOrigen = '/var/www/repositorio/newintra/rrhh/autoservicio/' + objeto.p_docIRPF;
                            Moduls.app.AjustesNombre = objeto.p_docIRPF;
                        }
                        let event = document.createEvent("Event"); event.initEvent('focus', false, true);
                        e.form.parametros['p_' + chd] && e.form.parametros['p_' + chd].object.dispatchEvent(event);
                    }
                    e.form.modul.Forms.datosFiscalesform.set(objeto);
                }
                if (d.list.mod === "VER") {
                    $('#modificarDatosFiscales').addClass('dn');
                    $('#mensajeDatosFiscales').removeClass('dn');
                    if (!objeto.p_doc145) {
                        $('#divAdjuntarCondiciones').addClass('dn');
                    }
                    if (!objeto.p_docIRPF) {
                        $('#divAdjuntarAjustes').addClass('dn');
                    }
                }
            }
        } else {
            toast({ tipo: 'error', msg: resuelveError(d) });
        }

        callFileOptions({ apl: 'autoservicio', cbk: 'setFileOptionDatFis' });
    }

    datosFiscalesform(s, d, e) {
        if (s) {
            if (d && d.errmsg && d.errmsg.extra && d.errmsg.extra.msg) {
                toast({ tipo: 'error', msg: d.errmsg.extra.msg });
                Moduls.app.HabilitarModificacion = '';
                Moduls.app.child.templateAplicacion.child.tempDatosFiscales.Forms.datosFiscalesform.formulario.reset();
            } else {
                if (e.form.parametros.p_doc145.value !== '' || e.form.parametros.p_docIRPF.value !== '') {
                    if (e.form.parametros.p_doc145.value !== '') {
                        Moduls.app.child.templateAplicacion.child.tempDatosFiscales.Forms.nFileCondiciones.uploadDocument({ file: sysdate('yymmdd') + 'DATFI_M145_' + Moduls.header.user.codusr + Moduls.app.child.templateAplicacion.child.tempDatosFiscales.Forms.nFileCondiciones.fileProperties.extension.toUpperCase() });
                    }
                    if (e.form.parametros.p_docIRPF.value !== '') {
                        Moduls.app.child.templateAplicacion.child.tempDatosFiscales.Forms.nFileAjustes.uploadDocument({ file: sysdate('yymmdd') + 'DATFI_IRPF_' + Moduls.header.user.codusr + Moduls.app.child.templateAplicacion.child.tempDatosFiscales.Forms.nFileAjustes.fileProperties.extension.toUpperCase() });
                    }
                }
                toast({ tipo: 'success', msg: 'Datos fiscales guardados correctamente' });
            }
            $('#collapse6 .btnModificando').fadeOut("slow", function () {
                $("#modificarDatosFiscales").fadeIn("slow", function () { });
            });

            $('#formDatosFiscales input, #formDatosFiscales select, #formDatosFiscales button').each(function () {
                $(this).prop({ 'readOnly': true, 'disabled': true });
            });

            Moduls.app.child.templateAplicacion.child.tempDatosFiscales.Forms.initDatosFiscales.executeForm();
        } else {
            validaErroresCbk(d);
        }
    }

    habilitarModificacionDatosFiscales() {
        $("#modificarDatosFiscales").fadeOut("slow", function () {
            $('#collapse6 .btnModificando').removeClass('dn');
            $("#collapse6 .btnModificando").fadeIn("slow", function () { });
        });
        $('#formDatosFiscales input, #formDatosFiscales select, #formDatosFiscales button').each(function () {
            if (this.name != 'p_doc145' && this.name != 'p_docIRPF')
                $(this).prop({ 'readOnly': false, 'disabled': false });
        });
    }

    setFileOptionAjustes(o) {
        Moduls.app.child.templateAplicacion.child.tempDatosFiscales.Forms.nFileAjustes = new uploadProject();
        let fileAjustes = Moduls.app.child.templateAplicacion.child.tempDatosFiscales.Forms.nFileAjustes;
        fileAjustes.setBtnSelect(getId('botonAdjuntarAjustes'));
        fileAjustes.setBtnViewer(getId('lupaAjustes'));
        fileAjustes.setFncValidation(Moduls.getTempdatosfiscales().getScript().valida_archivoDatosFiscales);
        fileAjustes.setFncCallback(Moduls.getTempdatosfiscales().getScript().SubidaCorrectaDatosFiscales);
        fileAjustes.setBoxEco(getId('adjuntarAjustes'));
        fileAjustes.setConfig(o);

        if (!getId('adjuntarAjustes').value)
            fileAjustes.initDocument();
        else
            fileAjustes._hide(fileAjustes.buttons.select);
    }

    SubidaCorrectaDatosFiscales(s, d, e) {
        if (s) {
            toast({ tipo: 'success', msg: 'Fichero subido correctamente' });
            if (e.upload.config.file.indexOf('_IRPF_') > 0) {
                Moduls.app.child.templateAplicacion.child.tempDatosFiscales.Forms.datosFiscalesform.set({ p_docIRPF: e.upload.config.file });
            } else {
                Moduls.app.child.templateAplicacion.child.tempDatosFiscales.Forms.datosFiscalesform.set({ p_doc145: e.upload.config.file });
            }
        } else {
            toast({ tipo: 'error', msg: resuelveError(d) });
        }
    }

    setFileOptionCondiciones(o) {
        Moduls.app.child.templateAplicacion.child.tempDatosFiscales.Forms.nFileCondiciones = new uploadProject();
        let fileCondiciones = Moduls.app.child.templateAplicacion.child.tempDatosFiscales.Forms.nFileCondiciones;
        fileCondiciones.setBtnSelect(getId('botonAdjuntarCondiciones'));
        fileCondiciones.setBtnViewer(getId('lupaCondiciones'))
        fileCondiciones.setFncValidation(Moduls.getTempdatosfiscales().getScript().valida_archivoDatosFiscales);
        fileCondiciones.setFncCallback(Moduls.getTempdatosfiscales().getScript().SubidaCorrectaDatosFiscales);
        fileCondiciones.setBoxEco(getId('adjuntarCondiciones'));
        fileCondiciones.setConfig(o);

        if (!getId('adjuntarCondiciones').value)
            fileCondiciones.initDocument();
        else
            fileCondiciones._hide(fileCondiciones.buttons.select);
    }

    saveDatosFiscales() {
        Moduls.app.child.templateAplicacion.child.tempDatosFiscales.Forms.datosFiscalesform.set({ P_xsid: getXsid() });
        Moduls.app.child.templateAplicacion.child.tempDatosFiscales.Forms.datosFiscalesform.set({ p_password: Moduls.getModalbody().getForm('accionCheckLogin').parametros.p_pasusr.value });
        Moduls.app.child.templateAplicacion.child.tempDatosFiscales.Forms.datosFiscalesform.set({ p_doc145: $('#adjuntarCondiciones').val() });
        Moduls.app.child.templateAplicacion.child.tempDatosFiscales.Forms.datosFiscalesform.set({ p_docIRPF: $('#adjuntarAjustes').val() });
        Moduls.app.child.templateAplicacion.child.tempDatosFiscales.Forms.datosFiscalesform.executeForm();
    }

    valida_archivoDatosFiscales(s, d, e) {
        let tipo = (s) ? 'success' : 'error',
            msg = (d.type == 'smax') ? 'Excedido tamaño del documento:<br>Máximo: ' + d.fileMax + '<br>' + 'Real: ' + d.fileSize :
                (d.type == 'exts') ? 'Tipo de archivo no permitido:<br>Permitidos: ' + d.exts + '<br>Real: ' + d.fileExt :
                    'Error desconocido validando el documento'
        if (!s) {
            toast({ tipo: tipo, msg: msg });
        }
    }
}

$('#guardarDatosFiscales').click(function () {
    confirmaSesion('DATFI');
});

$("#modificarDatosFiscales").click(function () {
    Moduls.getTempdatosfiscales().getScript().habilitarModificacionDatosFiscales();
});

$('#cancelarDatosFiscales').click(function () {
    $('#collapse6 .btnModificando').fadeOut("slow", function () {
        $("#modificarDatosFiscales").fadeIn("slow", function () { });
    });

    Moduls.app.child.templateAplicacion.child.tempDatosFiscales.Forms.datosFiscalesform.formulario.reset();
    Moduls.app.child.templateAplicacion.child.tempDatosFiscales.Forms.initDatosFiscales.executeForm();

    $('#formDatosFiscales input, #formDatosFiscales select, #formDatosFiscales button').each(function () {
        $(this).prop({ 'readOnly': true, 'disabled': true });
    });
    Moduls.app.HabilitarModificacion = '';
});

$('#heading6').click(function () {
    if ($('#collapse6').hasClass('show')) {
        $('#heading6').removeClass('cambio');
        $('#collapse6').removeClass('show');
    } else {
        $('.aperturaDatosPersonales').removeClass('cambio');
        $('.cuerpoDatosPersonales').removeClass('show');
        $('#heading6').addClass('cambio');
        $('#collapse6').addClass('show');
    }
});

$('#lupaCondiciones').click(function () {
    if (Moduls.app.CondicionesOrigen && Moduls.app.CondicionesNombre) {
        getFile(Moduls.app.CondicionesOrigen, Moduls.app.CondicionesNombre, false);
    } else {
        toast({ tipo: 'error', msg: 'Problema al descargar el archivo, vuelva a intentarlo' });
    }
});

$('#lupaAjustes').click(function () {
    if (Moduls.app.AjustesOrigen && Moduls.app.AjustesNombre) {
        getFile(Moduls.app.AjustesOrigen, Moduls.app.AjustesNombre, false);
    } else {
        toast({ tipo: 'error', msg: 'Problema al descargar el archivo, vuelva a intentarlo' });
    }
});

function setFileOptionDatFis(o) {
    Moduls.getTempdatosfiscales().getScript().setFileOptionCondiciones(o);
    Moduls.getTempdatosfiscales().getScript().setFileOptionAjustes(o);
}