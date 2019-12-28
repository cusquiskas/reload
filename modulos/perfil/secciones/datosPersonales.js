var datosPersonales = class {

    constructor(modulo) {
        Moduls.app.ExisteDatosPersonales = true;

        if (getPerfilEmpleadoDefault() === '' || getPerfilEmpleadoDefault() === 'datosPersonales') {
            $('.aperturaDatosPersonales').removeClass('cambio');
            $('.cuerpoDatosPersonales').removeClass('show');
            $('#heading1').addClass('cambio');
            $('#collapse1').addClass('show');
        }
    }

    initDatosPersonales(s, d, e) {
        if (s) {
            let objeto = {};
            if (d.root) {
                if (d.root.mod === "VER") {
                    $('#modificarDatosPersonales').addClass('dn')
                    $('#mensajeDatosPersonales').removeClass('dn');
                }
                if (d.root.datper) {
                    for (let chd in d.root.datper) {
                        objeto['p_' + chd] = d.root.datper[chd];
                        let event = document.createEvent("Event"); event.initEvent('focus', false, true);
                        e.form.parametros['p_' + chd] && e.form.parametros['p_' + chd].object.dispatchEvent(event);
                    }
                    e.form.modul.Forms.datosPersonalesform.set(objeto);
                }
            }
        } else {
            toast({ tipo: 'error', msg: resuelveError(d) });
        }
    }

    datosPersonalesform(s, d, e) {
        if (!(e.status && e.status === 'validation')) {
            $('#collapse1 .btnModificando').fadeOut("slow", function () {
                $("#modificarDatosPersonales").fadeIn("slow", function () { });
            });

            Moduls.app.child.templateAplicacion.child.tempDatosPersonales.Forms.initDatosPersonales.executeForm();

            $('#datosPersonalesForm input , #datosPersonalesForm select').each(function () {
                $(this).prop({ 'readOnly': true, 'disabled': true });
            });

            if (s) {
                toast({ tipo: 'success', msg: resuelveError(d) });
            } else {
                validaErroresCbk(d);
            }
        } else {
            validaErroresCbk(d);
        }
    }

    habilitarModificacionDatosPersonales() {
        $("#modificarDatosPersonales").fadeOut("slow", function () {
            $('#collapse1 .btnModificando').removeClass('dn');
            $("#collapse1 .btnModificando").fadeIn("slow", function () { });
        });
        $('#datosPersonalesForm input, #datosPersonalesForm select').each(function () {
            $(this).prop({ 'readOnly': false, 'disabled': false });
        });

        Moduls.app.HabilitarModificacion = '';
    }

    GuardarPersonales() {
        Moduls.app.child.templateAplicacion.child.tempDatosPersonales.Forms.datosPersonalesform.set({ P_xsid: getXsid() });
        Moduls.app.child.templateAplicacion.child.tempDatosPersonales.Forms.datosPersonalesform.set({ p_password: Moduls.getModalbody().getForm('accionCheckLogin').parametros.p_pasusr.value });

        Moduls.app.child.templateAplicacion.child.tempDatosPersonales.Forms.datosPersonalesform.executeForm();
    }
}

$('#guardarDatosPersonales').click(function () {
    confirmaSesion('DATPE');
})

$("#modificarDatosPersonales").click(function () {
    Moduls.getTempdatospersonales().getScript().habilitarModificacionDatosPersonales();
});

$("#direccionAdicional").change(function () {
    if (this.value.esMail()) {
        toast({ tipo: 'error', msg: 'Este campo no no puede contener un correo electrónico' });
        let aqui = dondeEstoy(this);
        let para = {};
        para[this.name] = '';
        aqui.set(para);
    }
});

$('#heading1').click(function () {
    if ($('#collapse1').hasClass('show')) {
        $('#heading1').removeClass('cambio');
        $('#collapse1').removeClass('show');
    } else {
        $('.aperturaDatosPersonales').removeClass('cambio');
        $('.cuerpoDatosPersonales').removeClass('show');
        $('#heading1').addClass('cambio');
        $('#collapse1').addClass('show');
    }
});

$('#cancelarDatosPersonales').click(function () {
    $('#collapse1 .btnModificando').fadeOut("slow", function () {
        $("#modificarDatosPersonales").fadeIn("slow", function () { });
    });

    Moduls.app.child.templateAplicacion.child.tempDatosPersonales.Forms.initDatosPersonales.executeForm();

    $('#datosPersonalesForm input , #datosPersonalesForm select').each(function () {
        $(this).prop({ 'readOnly': true, 'disabled': true });
    });
});