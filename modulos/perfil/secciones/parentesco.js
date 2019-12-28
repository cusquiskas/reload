var date = new Date();
var parentesco = class {

    constructor(modulo) {
        Moduls.app.ExisteParentesco = true;

        if ((!Moduls.app.ExisteDatosPersonales && !Moduls.app.ExisteDatosEmpresa && !Moduls.app.ExisteDatosFiscales &&
            !Moduls.app.ExisteSituacionFamiliar) || getPerfilEmpleadoDefault() === 'parentesco') {
            $('.aperturaDatosPersonales').removeClass('cambio');
            $('.cuerpoDatosPersonales').removeClass('show');
            $('#heading10').addClass('cambio');
            $('#collapse10').addClass('show');
        }

        Moduls.app.child.templateAplicacion.child.tempParentesco.Forms.initParentesco.set({ P_codusr: Moduls.header.user.codusr });
        Moduls.app.child.templateAplicacion.child.tempParentesco.Forms.initParentesco.executeForm();
    }

    parentesco(s, d, e) {
        if (s) {
            toast({ tipo: 'success', msg: 'Cambios realizados correctamente' });
        } else {
            validaErroresCbk(d);
        }

        $('.divAdjuntarParentesco').addClass('dn');

        $('#collapse10 .btnModificando').fadeOut("slow", function () {
            $(".btnModificarDatosParentesco").fadeIn("slow", function () {
            });
        });

        Moduls.app.child.templateAplicacion.child.tempParentesco.Forms.initParentesco.executeForm();

        $('.divContenedorFormDatPX input, .divContenedorFormDatPT input, .divContenedorFormDatPT select').each(function () {
            $(this).prop({ 'readOnly': true, 'disabled': true });
        });
    }

    setFileOptionParent() {
        Moduls.app.child.templateAplicacion.child.tempParentesco.Forms.nFile = new uploadProject();
        let file = Moduls.app.child.templateAplicacion.child.tempParentesco.Forms.nFile;
        file.setBtnSelect(getId('botonAdjuntarArchivoParentesco'));
        file.setFncValidation(Moduls.getTempparentesco().getScript().valida_archivo);
        file.setFncCallback(Moduls.getTempparentesco().getScript().SubidaCorrecta);
        file.setBoxEco(getId('adjuntarArchivoParent'));
        file.setConfig({
            exts: ['.PNG', '.JPG', '.GIF', '.PDF'],
            smax: 5242880,
            ruta: '/var/www/repositorio/newintra/rrhh/autoservicio'
        });
        file.initDocument();
    }

    habilitarParentesco() {
        Moduls.getTempparentesco().getScript().setFileOptionParent();

        $('.divAdjuntarParentesco').removeClass('dn');

        $(".btnModificarDatosParentesco").fadeOut("slow", function () {
            $('#collapse10 .btnModificando').removeClass('dn');
            $("#collapse10 .btnModificando").fadeIn("slow", function () {
            });
        });

        $('.divContenedorFormDatPX input, .divContenedorFormDatPT input, .divContenedorFormDatPT select').each(function () {
            $(this).prop({ 'readOnly': false, 'disabled': false });
        });
    };

    SubidaCorrecta(s, d) {
        if (s) {
            toast({ tipo: 'success', msg: 'Archivo guardado correctamente' });

        } else {
            toast({
                tipo: 'error',
                msg: 'Ha ocurrido un error al guardar el documento, por favor, contante con Soporte y reporte el siguiente mensaje:<br>' + resuelveError(d)
            });
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
            Moduls.app.child.templateAplicacion.child.tempParentesco.Forms.nFile.uploadDocument({ file: sysdate('yymmdd') + date.getHours() + date.getMinutes() + date.getSeconds() + 'DATPX_' + Moduls.header.user.codusr + Moduls.app.child.templateAplicacion.child.tempParentesco.Forms.nFile.fileProperties.extension.toUpperCase() });
        }
    }

    guardarParents() {
        if (Moduls.app.child.templateAplicacion.child.tempParentesco.Forms.parentesco.parametros.p_docpare.value == '') {
            toast({ tipo: 'error', msg: 'Debe adjuntar documentación' });
        } else {
            Moduls.getTempparentesco().getForm('parentesco').set({ P_xsid: getXsid() });
            Moduls.getTempparentesco().getForm('parentesco').set({ p_password: Moduls.getModalbody().getForm('accionCheckLogin').parametros.p_pasusr.value });
            Moduls.getTempparentesco().getForm('parentesco').set({ p_docpare: sysdate('yymmdd') + date.getHours() + date.getMinutes() + date.getSeconds() + 'DATPX_' + Moduls.header.user.codusr + Moduls.app.child.templateAplicacion.child.tempParentesco.Forms.nFile.fileProperties.extension.toUpperCase() });
            Moduls.app.child.templateAplicacion.child.tempParentesco.Forms.parentesco.executeForm();
        }
    }

    initParentesco(s, d, e) {
        if (s) {
            if (d.root.NEWINTRA.length == 0) {
                for (let j = 0; j < d.root.SAP.length; j++) {
                    if (d.root.SAP[j].Sexo == '11') {
                        $('.nombre-padre').addClass('active');
                        $('.apellido-padre').addClass('active');
                        e.form.modul.Forms.parentesco.set({ p_padre_name: d.root.SAP[j].Nombre });
                        e.form.modul.Forms.parentesco.set({ p_padre_ape: d.root.SAP[j].Apellido });
                        e.form.modul.Forms.parentesco.set({ p_nacper: d.root.SAP[j].tripulante[0].nacionalidad });
                        e.form.modul.Forms.parentesco.set({ p_proper: d.root.SAP[j].tripulante[0].provincia });
                        e.form.modul.Forms.parentesco.set({ p_nacimiento: d.root.SAP[j].tripulante[0].lugarnaci });
                    } else {
                        $('.nombre-madre').addClass('active');
                        $('.apellido-madre').addClass('active');
                        e.form.modul.Forms.parentesco.set({ p_madre_name: d.root.SAP[j].Nombre });
                        e.form.modul.Forms.parentesco.set({ p_madre_ape: d.root.SAP[j].Apellido });
                        e.form.modul.Forms.parentesco.set({ p_nacper: d.root.SAP[j].tripulante[0].nacionalidad });
                        e.form.modul.Forms.parentesco.set({ p_proper: d.root.SAP[j].tripulante[0].provincia });
                        e.form.modul.Forms.parentesco.set({ p_nacimiento: d.root.SAP[j].tripulante[0].lugarnaci });
                    }
                }
            } else {
                for (let k = 0; k < d.root.NEWINTRA.length; k++) {
                    if (d.root.NEWINTRA[k].estado == 'A' || d.root.NEWINTRA[k].estado == 'C' || d.root.NEWINTRA[k].estado == 'E') {
                        $('.mensajeDatosParentesco').removeClass('dn');
                        $('.provinaci').attr("disabled", true);
                        $('.p_nacimiento').prop({ 'readOnly': true, 'disabled': true });
                        $('.paisnaci').attr("disabled", true);
                        $('.btnModificarDatosParentesco').addClass('dn');
                        if (d.root.NEWINTRA[k].Sexo == '11') {
                            $('.nombre-padre').addClass('active');
                            $('.apellido-padre').addClass('active');
                            e.form.modul.Forms.parentesco.set({ p_padre_name: d.root.NEWINTRA[k].Nombre });
                            e.form.modul.Forms.parentesco.set({ p_padre_ape: d.root.NEWINTRA[k].Apellido });
                            e.form.modul.Forms.parentesco.set({ p_nacper: d.root.NEWINTRA[k].tripulante[0].nacionalidad });
                            e.form.modul.Forms.parentesco.set({ p_proper: d.root.NEWINTRA[k].tripulante[0].provincia });
                            e.form.modul.Forms.parentesco.set({ p_nacimiento: d.root.NEWINTRA[k].tripulante[0].lugarnaci });
                        } else {
                            $('.nombre-madre').addClass('active');
                            $('.apellido-madre').addClass('active');
                            e.form.modul.Forms.parentesco.set({ p_madre_name: d.root.NEWINTRA[k].Nombre });
                            e.form.modul.Forms.parentesco.set({ p_madre_ape: d.root.NEWINTRA[k].Apellido });
                            e.form.modul.Forms.parentesco.set({ p_nacper: d.root.NEWINTRA[k].tripulante[0].nacionalidad });
                            e.form.modul.Forms.parentesco.set({ p_proper: d.root.NEWINTRA[k].tripulante[0].provincia });
                            e.form.modul.Forms.parentesco.set({ p_nacimiento: d.root.NEWINTRA[k].tripulante[0].lugarnaci });
                        }
                    } else {
                        for (let j = 0; j < d.root.SAP.length; j++) {
                            if (d.root.SAP[j].Sexo == '11') {
                                $('.nombre-padre').addClass('active');
                                $('.apellido-padre').addClass('active');
                                e.form.modul.Forms.parentesco.set({ p_padre_name: d.root.SAP[j].Nombre });
                                e.form.modul.Forms.parentesco.set({ p_padre_ape: d.root.SAP[j].Apellido });
                                e.form.modul.Forms.parentesco.set({ p_nacper: d.root.SAP[j].tripulante[0].nacionalidad });
                                e.form.modul.Forms.parentesco.set({ p_proper: d.root.SAP[j].tripulante[0].provincia });
                                e.form.modul.Forms.parentesco.set({ p_nacimiento: d.root.SAP[j].tripulante[0].lugarnaci });
                            } else {
                                $('.nombre-madre').addClass('active');
                                $('.apellido-madre').addClass('active');
                                e.form.modul.Forms.parentesco.set({ p_madre_name: d.root.SAP[j].Nombre });
                                e.form.modul.Forms.parentesco.set({ p_madre_ape: d.root.SAP[j].Apellido });
                                e.form.modul.Forms.parentesco.set({ p_nacper: d.root.SAP[j].tripulante[0].nacionalidad });
                                e.form.modul.Forms.parentesco.set({ p_proper: d.root.SAP[j].tripulante[0].provincia });
                                e.form.modul.Forms.parentesco.set({ p_nacimiento: d.root.SAP[j].tripulante[0].lugarnaci });
                            }
                        }
                    }
                }
            }
        } else {
            validaErroresCbk(d);
        }
    }
}

$(".btnModificarDatosParentesco").click(function () {
    Moduls.getTempparentesco().getScript().habilitarParentesco();
});

$('.btnCancelarDatosParentesco').click(function () {
    $('.divAdjuntarParentesco').addClass('dn');

    $('#collapse10 .btnModificando').fadeOut("slow", function () {
        $(".btnModificarDatosParentesco").fadeIn("slow", function () {
        });
    });

    Moduls.app.child.templateAplicacion.child.tempParentesco.Forms.initParentesco.executeForm();

    $('.divContenedorFormDatPX input, .divContenedorFormDatPT input, .divContenedorFormDatPT select').each(function () {
        $(this).prop({ 'readOnly': true, 'disabled': true });
    });
});

$('#heading10').click(function () {
    if ($('#collapse10').hasClass('show')) {
        $('#heading10').removeClass('cambio');
        $('#collapse10').removeClass('show');
    } else {
        $('.aperturaDatosPersonales').removeClass('cambio');
        $('.cuerpoDatosPersonales').removeClass('show');
        $('#heading10').addClass('cambio');
        $('#collapse10').addClass('show');
    }
});

$('.btnGuardarDatosParentesco').click(function () {
    Moduls.app.child.templateAplicacion.child.tempParentesco.Forms.parentesco.set({ p_docpare: getId('adjuntarArchivoParent').value });
    confirmaSesion('DATPX');
})