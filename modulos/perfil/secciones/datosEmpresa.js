var DatosEmpresa = class {

    constructor(modulo) {
        Moduls.app.ExisteDatosEmpresa = true;

        if ((!Moduls.app.ExisteDatosPersonales) || getPerfilEmpleadoDefault() === 'datosEmpresa') {
            $('.aperturaDatosPersonales').removeClass('cambio');
            $('.cuerpoDatosPersonales').removeClass('show');
            $('#heading4').addClass('cambio');
            $('#collapse4').addClass('show');
        }

        $('[data-toggle="tooltip"]').tooltip({
            template: '<div class="tooltip show"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
        });
    }

    initDatosEmpresa(s, d, e) {
        if (s) {
            let objeto = {};
            let a;
            if (d.usuario) {
                for (let chd in d.usuario) {
                    if (chd === 'tlf') {
                        a = 'tel'
                    }
                    if (chd === 'mail') {
                        a = 'email'
                    }
                    if (chd === 'movemp') {
                        a = 'mov'
                    }
                    if (chd === 'ext') {
                        a = 'ext'
                    }
                    if (chd === 'chg') {
                        a = 'chg'
                        Moduls.app.child.templateAplicacion.child.tempDatosEmpresa.Chg = d.usuario[chd].toString();
                    }
                    objeto['p_' + a] = d.usuario[chd];
                    let event = document.createEvent("Event");
                    event.initEvent('focus', false, true);
                    e.form.parametros['p_' + a] && e.form.parametros['p_' + a].object.dispatchEvent(event);
                }
                e.form.modul.Forms.datosEmpresa.set(objeto);
            }

            $('#email').removeClass('resaltarEmail');
            $('#labelEmail').removeClass('resaltarEmail');

        } else {
            toast({ tipo: 'error', msg: resuelveError(d) });
        }
    }

    datosEmpresa(s, d, e) {
        if (s) {
            if (d.error) {
                toast({ tipo: 'error', msg: d.error });
            } else {
                toast({ tipo: 'success', msg: 'El cambio puede tardar unos minutos en verse en el portal' });
            }

            $('#collapse4 .btnModificando').fadeOut("slow", function () {
                $("#modificarDatosEmpresa").fadeIn("slow", function () {
                });
            });

            Moduls.app.child.templateAplicacion.child.tempDatosEmpresa.Forms.initDatosEmpresa.executeForm();

            $('#formDatosEmpresa input , #formDatosEmpresa select').each(function () {
                $(this).prop({ 'readOnly': true, 'disabled': true });
            });

            $('#formDatosEmpresa i').each(function () {
                $(this).addClass('dn');
            });

            refreshProgresBar();

        } else {
            validaErroresCbk(d);
        }
    }

    habilitarModificacionDatosEmpresa() {
        $("#modificarDatosEmpresa").fadeOut("slow", function () {
            $('#collapse4 .btnModificando').removeClass('dn');
            $("#collapse4 .btnModificando").fadeIn("slow", function () {
            });
        });
        $('.checkboxspam').prop({ 'disabled': false });

        $('#formDatosEmpresa i').each(function () {
            $(this).removeClass('dn');
        });

        for (let i = 0; i < Moduls.app.child.templateAplicacion.child.tempDatosEmpresa.Chg.length; i++) {
            if (i == 0 && Moduls.app.child.templateAplicacion.child.tempDatosEmpresa.Chg[i] == '1') {
                $('#telefonoEmpresa').prop({ 'readOnly': false, 'disabled': false });
                $('#iconoTelEmp').addClass('dn');
            } else if (i == 1 && Moduls.app.child.templateAplicacion.child.tempDatosEmpresa.Chg[i] == '1') {
                $('#extension').prop({ 'readOnly': false, 'disabled': false });
                $('#iconoExt').addClass('dn');
            } else if (i == 2 && Moduls.app.child.templateAplicacion.child.tempDatosEmpresa.Chg[i] == '1') {
                $('#email').prop({ 'readOnly': false, 'disabled': false });
                $('#iconoEmail').addClass('dn');
            } else if (i == 3 && Moduls.app.child.templateAplicacion.child.tempDatosEmpresa.Chg[i] == '1') {
                $('#movilEmpresa').prop({ 'readOnly': false, 'disabled': false });
                $('#iconoMovEmp').addClass('dn');
            }
        }

        $('#email').removeClass('resaltarEmail');
        $('#labelEmail').removeClass('resaltarEmail');

        Moduls.app.HabilitarModificacion = '';
    }

    estadoSpam(s, d, e) {
        if (s) {
            if (d.root && d.root.option) {
                let check;
                if (d.root.option.estado == '1') {
                    $('.checkboxspam').prop('checked', false);
                    check = 'N';
                } else {
                    $('.checkboxspam').prop('checked', true);
                    check = 'S';
                }
                Moduls.app.child.templateAplicacion.child.tempDatosEmpresa.Forms.datosEmpresa.set({ p_check: check });
            }
        } else {
            validaErroresCbk(d);
        }
    }

    cambiaEstadoSpam(s, d, e) {
        if (s) {
            toast({ tipo: 'success', msg: d.errmsg.errmsg });
        } else {
            validaErroresCbk(d);
        }
    }

    GuardarDatosEmpresa() {
        Moduls.app.child.templateAplicacion.child.tempDatosEmpresa.Forms.datosEmpresa.set({ P_xsid: getXsid() });
        Moduls.app.child.templateAplicacion.child.tempDatosEmpresa.Forms.datosEmpresa.set({ p_password: Moduls.getModalbody().getForm('accionCheckLogin').parametros.p_pasusr.value });
        Moduls.app.child.templateAplicacion.child.tempDatosEmpresa.Forms.datosEmpresa.executeForm();
    }
}

$('#guardarDatosEmpresa').click(function () {
    confirmaSesion('DATEM');
})

$("#modificarDatosEmpresa").click(function () {
    Moduls.getTempdatosempresa().getScript().habilitarModificacionDatosEmpresa();
});

$('.checkboxspam').on('change', function () {
    let check = 'N';
    if ($('.checkboxspam').is(':checked')) { check = 'S'; }
    Moduls.app.child.templateAplicacion.child.tempDatosEmpresa.Forms.datosEmpresa.set({ p_check: check });
    Moduls.app.child.templateAplicacion.child.tempDatosEmpresa.Forms.cambiaEstadoSpam.executeForm();
});

$('#cancelarDatosEmpresa').click(function () {
    $('#collapse4 .btnModificando').fadeOut("slow", function () {
        $("#modificarDatosEmpresa").fadeIn("slow", function () {
        });
    });

    Moduls.app.child.templateAplicacion.child.tempDatosEmpresa.Forms.initDatosEmpresa.executeForm();

    $('#formDatosEmpresa input , #formDatosEmpresa select').each(function () {
        $(this).prop({ 'readOnly': true, 'disabled': true });
    });

    $('#formDatosEmpresa i').each(function () {
        $(this).addClass('dn');
    });

    $('#email').removeClass('resaltarEmail');
    $('#labelEmail').removeClass('resaltarEmail');
});

$('#heading4').click(function () {
    if ($('#collapse4').hasClass('show')) {
        $('#heading4').removeClass('cambio');
        $('#collapse4').removeClass('show');
    } else {
        $('.aperturaDatosPersonales').removeClass('cambio');
        $('.cuerpoDatosPersonales').removeClass('show');
        $('#heading4').addClass('cambio');
        $('#collapse4').addClass('show');
    }
});