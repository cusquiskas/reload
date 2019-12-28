var porroteopagas = class {

    constructor(modulo) {
        Moduls.app.ExisteProrrateoPagas = true;

        if ((!Moduls.app.ExisteDatosPersonales && !Moduls.app.ExisteDatosEmpresa && !Moduls.app.ExisteDatosFiscales &&
            !Moduls.app.ExisteSituacionFamiliar && !Moduls.app.ExisteParentesco && !Moduls.app.ExisteBeneficiarios &&
            !Moduls.app.ExisteCuentaBancaria && !Moduls.app.ExisteCambioConstrasena && !Moduls.app.ExistePasswRecover) || getPerfilEmpleadoDefault() === 'prorrateoPagas') {
            $('.aperturaDatosPersonales').removeClass('cambio');
            $('.cuerpoDatosPersonales').removeClass('show');
            $('#heading3').addClass('cambio');
            $('#collapse3').addClass('show');
        }
    }

    initProrrateoPagas(s, d, e) {
        if (s) {
            if (d.root) {
                if (d.root.tiene) {
                    $('#pagas').addClass('dn');
                    $('#parrafoPagas').addClass('dn');
                    $('#yaPagasProrrateadas').removeClass('dn');
                }
                if (d.root.asignado) {
                    if (d.root.asignado == -1) {
                        $('#pagas').addClass('dn');
                        $('#parrafoPagas').addClass('dn');
                        $('#solicitudEnCurso').removeClass('dn');
                    }
                }
            }
        } else {
            $('#pagas').addClass('dn');
            $('#parrafoPagas').addClass('dn');
            $('#usuarioNoValido').removeClass('dn');
        }
    }

    prorrateoPagas(s, d, e) {
        if (s) {
            Moduls.getTempprorrateopagas().getScript().habilitarModificacionProrrateoPagas();

        } else {
            toast({ tipo: 'error', msg: resuelveError(d) });
        }
    }

    guardarpagas() {
        Moduls.app.child.templateAplicacion.child.tempProrrateoPagas.Forms.prorrateoPagas.set({ P_xsid: getXsid() });
        Moduls.app.child.templateAplicacion.child.tempProrrateoPagas.Forms.prorrateoPagas.set({ p_password: Moduls.getModalbody().getForm('accionCheckLogin').parametros.p_pasusr.value });
        Moduls.app.child.templateAplicacion.child.tempProrrateoPagas.Forms.prorrateoPagas.executeForm();
    }

    habilitarModificacionProrrateoPagas() {
        if (d.root) {
            if (d.root.estado) {
                if (d.root.estado === 'E') {
                    toast({ tipo: 'error', msg: resuelveError(d) });
                }
                if (d.root.estado === 'V') {
                    toast({
                        msg: 'Solicitud pagas prorrateadas enviada'
                    });

                    $('#pagasProrrateadas').fadeOut("slow", function () {
                        $('#solicitudRealizada').removeClass('dn');
                        $('#solicitudRealizada').fadeIn("slow", function () { });
                    });
                }
            }
        }
    }
}

$('#acceptarPagas').click(function () {
    confirmaSesion('DATPP');
});

$('#heading3').click(function () {
    if ($('#collapse3').hasClass('show')) {
        $('#heading3').removeClass('cambio');
        $('#collapse3').removeClass('show');
    } else {
        $('.aperturaDatosPersonales').removeClass('cambio');
        $('.cuerpoDatosPersonales').removeClass('show');
        $('#heading3').addClass('cambio');
        $('#collapse3').addClass('show');
    }
});