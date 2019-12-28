var recuperacioncontra = class {

    constructor(modulo) {
        Moduls.app.ExistePasswRecover = true;

        if ((!Moduls.app.ExisteDatosPersonales && !Moduls.app.ExisteDatosEmpresa && !Moduls.app.ExisteDatosFiscales &&
            !Moduls.app.ExisteSituacionFamiliar && !Moduls.app.ExisteParentesco && !Moduls.app.ExisteBeneficiarios &&
            !Moduls.app.ExisteCuentaBancaria && !Moduls.app.ExisteCambioConstrasena) || getPerfilEmpleadoDefault() === 'passwRecover') {
            $('.aperturaDatosPersonales').removeClass('cambio');
            $('.cuerpoDatosPersonales').removeClass('show');
            $('#heading9').addClass('cambio');
            $('#collapse9').addClass('show');
        }

        $('#heading9').click(function () {
            if ($('#collapse9').hasClass('show')) {
                $('#heading9').removeClass('cambio');
                $('#collapse9').removeClass('show');
            } else {
                $('.aperturaDatosPersonales').removeClass('cambio');
                $('.cuerpoDatosPersonales').removeClass('show');
                $('#heading9').addClass('cambio');
                $('#collapse9').addClass('show');
            }
        });

        $("#collapse9 .btnModPasswdRecover").click(function () {
            Moduls.getTemprecuperacioncontrasena().getScript().habilitarPasswRecover();
            //
        });
        $("#collapse9 .btnSavePasswdRecover").click(function () {
            confirmaSesion('DATRC');
        });

        $('#collapse9 .btnCancelPasswdRecover').click(function () {
            $('#collapse9 .btnSavePasswdRecover').add('#collapse9 .btnCancelPasswdRecover').fadeOut("slow", function () {
                $("#collapse9 .btnModPasswdRecover").fadeIn("slow", function () { });
            });

            Moduls.app.child.templateAplicacion.child.tempRecuperacionContrasena.Forms.frmPasswRecover.formulario.reset();
            Moduls.app.child.templateAplicacion.child.tempRecuperacionContrasena.Forms.frmInitPasswRecover.executeForm();

            $('#collapse9 input').each(function () {
                $(this).prop({ 'readOnly': true, 'disabled': true });
            });
            Moduls.app.HabilitarModificacion = '';
        });
    }

    cbkInitPasswRecover(s, d, e) {
        if (s) {
            if (d.root) {
                e.form.modul.Forms.frmPasswRecover.set({
                    p_telrec: d.root.teleph,
                    p_correc: d.root.correo
                });
                $('#collapse9 input').change();
            }
        } else {
            toast({ tipo: 'error', msg: resuelveError(d) });
        }
    }

    cbkPasswRecover(s, d, e) {
        $('#collapse9 .btnSavePasswdRecover').
            add('#collapse9 .btnCancelPasswdRecover').fadeOut("slow", function () {
                $("#collapse9 .btnModPasswdRecover").fadeIn("slow", function () { });
            });
        Moduls.app.child.templateAplicacion.child.tempRecuperacionContrasena.Forms.frmInitPasswRecover.executeForm();
        $('#collapse9 input').each(function () {
            $(this).prop({ 'readOnly': true, 'disabled': true });
        });

        if (s) {
            refreshNumAlertas();
            refreshProgresBar();
            toast({ tipo: 'success', msg: resuelveError(d) });
        } else {
            validaErroresCbk(d);
        }
    }

    guardarrecuperacontra() {
        Moduls.app.child.templateAplicacion.child.tempRecuperacionContrasena.Forms.frmPasswRecover.set({ P_xsid: getXsid() });
        Moduls.app.child.templateAplicacion.child.tempRecuperacionContrasena.Forms.frmPasswRecover.set({ p_password: Moduls.getModalbody().getForm('accionCheckLogin').parametros.p_pasusr.value });
        let form = Moduls.app.child.templateAplicacion.child.tempRecuperacionContrasena.Forms.frmPasswRecover;

        let teleph = form.parametros.p_telrec.value;
        let correo = form.parametros.p_correc.value;
        let error = false;
        if (correo.length > 0 && correo.indexOf('@') == -1) {
            toast({ tipo: 'error', msg: 'El correo debe contener un @' });
            error = true;
        }
        if (teleph.length > 0 && (teleph.length != 9 || (teleph[0] != '6' && teleph[0] != '7'))) {
            toast({ tipo: 'error', msg: 'El teléfono debe ser de longitud 9 y empezar por 6 o 7' });
            error = true;
        }

        if (!error) form.executeForm();
    }

    habilitarPasswRecover() {
        $("#collapse9 .btnModPasswdRecover").fadeOut("slow", function () {
            $('#collapse9 .btnSavePasswdRecover').
                add('#collapse9 .btnCancelPasswdRecover').removeClass('dn');
            $('#collapse9 .btnSavePasswdRecover').
                add('#collapse9 .btnCancelPasswdRecover').fadeIn("slow", function () { });
        });
        $('#collapse9 input').each(function () {
            $(this).prop({ 'readonly': false, 'disabled': false });
        });
    }
}