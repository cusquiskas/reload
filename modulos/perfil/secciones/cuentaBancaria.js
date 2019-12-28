var cuentaBancaria = class {

    constructor(modulo) {
        Moduls.app.ExisteCuentaBancaria = true;
        if (esInternetExplorer()) $('.ibabananti')[0].style.width='300px';
        if ((!Moduls.app.ExisteDatosPersonales && !Moduls.app.ExisteDatosEmpresa && !Moduls.app.ExisteDatosFiscales &&
            !Moduls.app.ExisteSituacionFamiliar && !Moduls.app.ExisteParentesco && !Moduls.app.ExisteBeneficiarios) || getPerfilEmpleadoDefault() === 'cuentaBancaria') {
            $('.aperturaDatosPersonales').removeClass('cambio');
            $('.cuerpoDatosPersonales').removeClass('show');
            $('#heading5').addClass('cambio');
            $('#collapse5').addClass('show');
        }
    }

    initCuentaBancaria(s, d, e) {
        if (s) {
            let objeto = {};
            let p = 0, atr;
            if (d.list) {
                if (['C', 'A', 'E'].inArray(d.list.solicitud.estsol) >= 0) {
                    $('#modificarCuentaBancaria').addClass('dn')
                    $('#mensajeCuentaBancariaNo').removeClass('dn');
                    $('#mensajeCuentaBancariaSi').addClass('dn');
                    $('#mensajeCuentaBancariain').addClass('dn');
                    $('.codigoIBAN').removeClass('dn');
                    $('#codigoIBAN')[0].setAttribute('value', d.list.datban[0].ibanActual);
                    $('.ibabananti').addClass('dn');
                }
                if (d.list.datban) {
                    if (d.list.datban.length > 1) {
                        for (let chd in d.list.datban[p]) {
                            if (chd === 'ibanActual') atr = 'ibabananti';
                            else atr = chd;
                            let event = document.createEvent("Event"); event.initEvent('focus', false, true);
                            objeto['p_' + atr + (p === 1 ? '2' : '')] = d.list.datban[p][chd];
                            e.form.parametros['p_' + atr + (p === 1 ? '2' : '')] && e.form.parametros['p_' + atr + (p === 1 ? '2' : '')].object.dispatchEvent(event);
                        }
                        p = 1;
                    }
                    for (let chd in d.list.datact[p]) {
                        if (chd === 'ibanActual') atr = 'ibabananti';
                        else atr = chd;
                        let event = document.createEvent("Event"); event.initEvent('focus', false, true);
                        objeto['p_' + atr + (p === 1 ? '2' : '')] = d.list.datact[p][chd];
                        e.form.parametros['p_' + atr + (p === 1 ? '2' : '')] && e.form.parametros['p_' + atr + (p === 1 ? '2' : '')].object.dispatchEvent(event);
                    }
                    e.form.modul.Forms.cuentaBancaria.set(objeto);
                    if (d.list.datact && d.list.datact.length > 0) e.form.modul.Forms.cuentaBancaria.set({ p_banks: d.list.datact[0].ibanActual.substring(0, 2) });
                }
            }
        } else {
            toast({ tipo: 'error', msg: resuelveError(d) });
        }
    }

    cuentaBancaria(s, d, e) {
        if (s) {
            toast({ tipo: 'success', msg: resuelveError(d) });
            if (!(e.status && e.status === 'validation')) {
                $('#collapse5 .btnModificando').fadeOut("slow", function () {
                    $("#modificarCuentaBancaria").fadeIn("slow", function () {
                    });
                });
                e.form.modul.Forms.initCuentaBancaria.executeForm();

                $('#formCuentaBancaria input, #formCuentaBancaria select').each(function () {
                    $(this).prop({ 'readOnly': true, 'disabled': true });
                });
            } else {
                validaErroresCbk(d);
            }
        } else {
            if (d && d.errmsg && d.errmsg.includes('A completado la solicitud')) {
                toast({ tipo: 'success', msg: resuelveError(d) });
                if (!(e.status && e.status === 'validation')) {
                    $('#collapse5 .btnModificando').fadeOut("slow", function () {
                        $("#modificarCuentaBancaria").fadeIn("slow", function () {
                        });
                    });

                    e.form.modul.Forms.initCuentaBancaria.executeForm();

                    $('#formCuentaBancaria input, #formCuentaBancaria select').each(function () {
                        $(this).prop({ 'readOnly': true, 'disabled': true });
                    });
                }
            } else {
                validaErroresCbk(d);
            }
        }
    }

    habilitarModificacionDatosBancarios() {
        $("#modificarCuentaBancaria").fadeOut("slow", function () {
            $('.codigoIBAN').removeClass('dn');
            $('#ibabananti_label')[0].innerText = 'Código IBAN Actual';
            $('#collapse5 .btnModificando').removeClass('dn');
            $("#collapse5 .btnModificando").fadeIn("slow", function () { });
        });
        $('#formCuentaBancaria input, #formCuentaBancaria select').each(function () {
            $(this).prop({ 'readOnly': false, 'disabled': false });
        });
        $('#fechaDesdeBan, #fechaHastaBan').each(function () {
            $(this).prop({ 'readOnly': true, 'disabled': true });
        });

        Moduls.app.HabilitarModificacion = '';
    }

    GuardarCuentaBancaria() {
        Moduls.app.child.templateAplicacion.child.tempCuentaBancaria.Forms.cuentaBancaria.set({ p_ibaban: $('#codigoIBAN').val() });
        Moduls.app.child.templateAplicacion.child.tempCuentaBancaria.Forms.cuentaBancaria.set({ p_banks: $('#codigoIBAN').val().substr(0, 2) });
        Moduls.app.child.templateAplicacion.child.tempCuentaBancaria.Forms.cuentaBancaria.set({ p_bankl: $('#codigoIBAN').val().substr(4, 8) });
        Moduls.app.child.templateAplicacion.child.tempCuentaBancaria.Forms.cuentaBancaria.set({ p_bkont: $('#codigoIBAN').val().substr(12, 2) });
        Moduls.app.child.templateAplicacion.child.tempCuentaBancaria.Forms.cuentaBancaria.set({ p_bankn: $('#codigoIBAN').val().substr(14, 10) });
        Moduls.app.child.templateAplicacion.child.tempCuentaBancaria.Forms.cuentaBancaria.set({ p_ibabananti: $('#ibabananti').val() });
        Moduls.app.child.templateAplicacion.child.tempCuentaBancaria.Forms.cuentaBancaria.set({ p_password: Moduls.getModalbody().getForm('accionCheckLogin').parametros.p_pasusr.value });
        Moduls.app.child.templateAplicacion.child.tempCuentaBancaria.Forms.cuentaBancaria.executeForm();
    }
}

$('#guardarCuentaBancaria').click(function () {
    confirmaSesion('DATBA');
});

$("#modificarCuentaBancaria").click(function () {
    Moduls.getTempcuentabancaria().getScript().habilitarModificacionDatosBancarios();
});

$('#cancelarCuentaBancaria').click(function () {
    let form = dondeEstoy(this);
    form.modul.Forms.cuentaBancaria.formulario.reset();
    $('.codigoIBAN').addClass('dn');
    $('#ibabananti_label')[0].innerHTML = 'Código IBAN ';
    $('#collapse5 .btnModificando').fadeOut("slow", function () {
        $("#modificarCuentaBancaria").fadeIn("slow", function () { });
    });

    form.modul.Forms.initCuentaBancaria.executeForm();

    $('#formCuentaBancaria input, #formCuentaBancaria select').each(function () {
        $(this).prop({ 'readOnly': true, 'disabled': true });
    });
});

$('#heading5').click(function () {
    if ($('#collapse5').hasClass('show')) {
        $('#heading5').removeClass('cambio');
        $('#collapse5').removeClass('show');
    } else {
        $('.aperturaDatosPersonales').removeClass('cambio');
        $('.cuerpoDatosPersonales').removeClass('show');
        $('#heading5').addClass('cambio');
        $('#collapse5').addClass('show');
    }
});
