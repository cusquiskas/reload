var situacionfami = class {

    constructor(modulo) {
        Moduls.app.ExisteSituacionFamiliar = true;

        if ((!Moduls.app.ExisteDatosPersonales && !Moduls.app.ExisteDatosEmpresa && !Moduls.app.ExisteDatosFiscales) || getPerfilEmpleadoDefault() === 'situacionFamiliar') {
            $('.aperturaDatosPersonales').removeClass('cambio');
            $('.cuerpoDatosPersonales').removeClass('show');
            $('#heading2').addClass('cambio');
            $('#collapse2').addClass('show');
        }

        callFileOptions({ apl: 'autoservicio', cbk: 'setFileOptionfami' });
    }

    initSituacionFamiliar(s, d, e) {
        if (s) {
            let objeto = {};
            if (d.list) {
                if (d.list.datfam) {
                    for (let chd in d.list.datfam) {
                        if (d.list.datfam['codfam'].length > 1) {
                            if (chd == 'fdesde') {
                                objeto['p_' + chd] = d.list.datfam[chd][0].hazFecha('dd/mm/yyyy', 'yyyy-mm-dd');
                            } else {
                                objeto['p_' + chd] = d.list.datfam[chd][0].toString();
                            }
                        } else {
                            if (chd == 'fdesde') {
                                objeto['p_' + chd] = d.list.datfam[chd].hazFecha('dd/mm/yyyy', 'yyyy-mm-dd');
                            } else {
                                objeto['p_' + chd] = d.list.datfam[chd].toString();
                            }
                        }
                        let event = document.createEvent("Event"); event.initEvent('focus', false, true);
                        e.form.parametros['p_' + chd] && e.form.parametros['p_' + chd].object.dispatchEvent(event);
                    }
                    e.form.modul.Forms.situacionFamiliar.set(objeto);
                }
                if (d.list.mod === "VER") {
                    $('#modificarSituacionFamiliar').addClass('dn');
                    $('#divAdjuntar').removeClass('dn');
                    $('#divFechaDesde').removeClass('dn');
                    $('#mensajeSituacionFamiliar').removeClass('dn');
                    $('#situacionFamiliarForm button').prop({ 'disabled': true });
                }
            }
        } else {
            toast({ tipo: 'error', msg: resuelveError(d) });
        }
    }

    situacionFamiliar(s, d, e) {
        if (!(e.status && e.status === 'validation')) {
            $('#collapse2 .btnModificando').fadeOut("slow", function () {
                $("#modificarSituacionFamiliar").fadeIn("slow", function () { });
            });

            Moduls.app.child.templateAplicacion.child.tempSituacionFamiliar.Forms.initSituacionFamiliar.executeForm();

            $('#situacionFamiliarForm input , #situacionFamiliarForm select').each(function () {
                $(this).prop({ 'readOnly': true, 'disabled': true });
            });

            if (s) {
                toast({ tipo: 'success', msg: resuelveError(d) });
                Moduls.app.child.templateAplicacion.child.tempSituacionFamiliar.Forms.nFile.initDocument();
                $('#divFechaDesde').addClass('dn');
                $('#divAdjuntar').addClass('dn');
            } else {
                validaErroresCbk(d);
            }
        } else {
            validaErroresCbk(d);
        }
    }

    SubidaCorrecta(s, d, e) {
        if (s) {
            toast({ tipo: 'success', msg: 'Archivo guardado correctamente' });
            Moduls.app.child.templateAplicacion.child.tempSituacionFamiliar.Forms.situacionFamiliar.set({ p_docfam: e.upload.config.file });
        } else {
            toast({ tipo: 'error', msg: 'Ha ocurrido un error al guardar el documento, por favor, contante con Soporte y reporte el siguiente mensaje:<br>' + resuelveError(d) });
            //Moduls.app.child.tempSituacionFamiliar.Forms.nFile.initDocument();
        }
    }

    valida_archivo(s, d, e) {
        let tipo = (s) ? 'success' : 'error',
            msg = (d.type == 'smax') ? 'Excedido tamaño del documento:<br>Máximo: ' + d.fileMax + '<br>' + 'Real: ' + d.fileSize :
                (d.type == 'exts') ? 'Tipo de archivo no permitido:<br>Permitidos: ' + d.exts + '<br>Real: ' + d.fileExt :
                    'Error desconocido validando el documento'
        if (!s) {
            toast({ tipo: tipo, msg: msg });
        } else {
            Moduls.app.child.templateAplicacion.child.tempSituacionFamiliar.Forms.nFile.uploadDocument({ file: sysdate('yymmdd') + 'DATFA_' + Moduls.header.user.codusr + Moduls.app.child.templateAplicacion.child.tempSituacionFamiliar.Forms.nFile.fileProperties.extension.toUpperCase() });
        }
    }

    habilitarModificacionDatosFamiliares() {
        $("#modificarSituacionFamiliar").fadeOut("slow", function () {
            $('#collapse2 .btnModificando').removeClass('dn');
            $("#collapse2 .btnModificando").fadeIn("slow", function () { });
        });
        $('#situacionFamiliarForm input, #situacionFamiliarForm select').each(function () {
            if (this.name != 'p_docfam')
                $(this).prop({ 'readOnly': false, 'disabled': false });
        });
        $('#divFechaDesde').removeClass('dn');
        $('#divAdjuntar').removeClass('dn');

        $('#cancelarSituacionFamiliar').click(function () {
            $('#collapse2 .btnModificando').fadeOut("slow", function () {
                $("#modificarSituacionFamiliar").fadeIn("slow", function () { });
            });
            $('#divFechaDesde').addClass('dn');
            $('#divAdjuntar').addClass('dn');

            Moduls.app.child.templateAplicacion.child.tempSituacionFamiliar.Forms.situacionFamiliar.formulario.reset();
            Moduls.app.child.templateAplicacion.child.tempSituacionFamiliar.Forms.initSituacionFamiliar.executeForm();

            $('#situacionFamiliarForm input , #situacionFamiliarForm select').each(function () {
                $(this).prop({ 'readOnly': true, 'disabled': true });
            });

            Moduls.app.HabilitarModificacion = '';
        });
    }

    guardarDatos() {
        Moduls.app.child.templateAplicacion.child.tempSituacionFamiliar.Forms.situacionFamiliar.set({ P_xsid: getXsid() });
        Moduls.app.child.templateAplicacion.child.tempSituacionFamiliar.Forms.situacionFamiliar.set({ p_password: Moduls.getModalbody().getForm('accionCheckLogin').parametros.p_pasusr.value });
        Moduls.app.child.templateAplicacion.child.tempSituacionFamiliar.Forms.situacionFamiliar.executeForm();
    }
}

$('#guardarSituacionFamiliar').click(function () {
    confirmaSesion('DATFA');
});

function setFileOptionfami(o) {
    Moduls.app.child.templateAplicacion.child.tempSituacionFamiliar.Forms.nFile = new uploadProject();
    let file = Moduls.app.child.templateAplicacion.child.tempSituacionFamiliar.Forms.nFile;
    file.setBtnSelect(getId('botonAdjuntarArchivo'));
    file.setFncValidation(Moduls.getTempsituacionfamiliar().getScript().valida_archivo);
    file.setFncCallback(Moduls.getTempsituacionfamiliar().getScript().SubidaCorrecta);
    file.setBoxEco(getId('adjuntarArchivo'));
    file.setConfig(o);
    file.initDocument();
}

$("#modificarSituacionFamiliar").click(function () {
    Moduls.getTempsituacionfamiliar().getScript().habilitarModificacionDatosFamiliares();
});

$('#heading2').click(function () {
    if ($('#collapse2').hasClass('show')) {
        $('#heading2').removeClass('cambio');
        $('#collapse2').removeClass('show');
    } else {
        $('.aperturaDatosPersonales').removeClass('cambio');
        $('.cuerpoDatosPersonales').removeClass('show');
        $('#heading2').addClass('cambio');
        $('#collapse2').addClass('show');
    }
});