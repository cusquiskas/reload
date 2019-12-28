$(document).ready(function () {
    LibraryManager.load('crypto-js-3.1.9-1', 'core', function () {
    });
});

function autExecuteForm(s, d, e) {
    Moduls.app.child.modal.child.modalBody.Forms.accionCheckLogin.set({
        p_codusr: Moduls.header.user.codusr
    });
    $('#conflogin-usrname').html(Moduls.header.user.nombre);
};

function accionCheckLogin() {
    if (Moduls.app.HabilitarModificacion) {
        if (Moduls.app.HabilitarModificacion == 'DATPE') {
            Moduls.getTempdatospersonales().getScript().GuardarPersonales();
        } else if (Moduls.app.HabilitarModificacion == 'DATFA') {
            Moduls.getTempsituacionfamiliar().getScript().guardarDatos();
        } else if (Moduls.app.HabilitarModificacion == 'DATEM') {
            Moduls.getTempdatosempresa().getScript().GuardarDatosEmpresa();
        } else if (Moduls.app.HabilitarModificacion == 'DATBA') {
            Moduls.getTempcuentabancaria().getScript().GuardarCuentaBancaria();
        } else if (Moduls.app.HabilitarModificacion == 'DATFI') {
            Moduls.getTempdatosfiscales().getScript().saveDatosFiscales();
        } else if (Moduls.app.HabilitarModificacion == 'DATPP') {
            Moduls.getTempprorrateopagas().getScript().guardarpagas();
        } else if (Moduls.app.HabilitarModificacion == 'DATBE') {
            Moduls.getTempbeneficiarios().getScript().guardarDatosBeneficiarios();
        } else if (Moduls.app.HabilitarModificacion == 'DATRC') {
            Moduls.getTemprecuperacioncontrasena().getScript().guardarrecuperacontra();
        } else if (Moduls.app.HabilitarModificacion == 'DATPX') {
            Moduls.getTempparentesco().getScript().guardarParents();
        }
    }
    if (Moduls.app.HabilitarVista) {
        if (Moduls.app.HabilitarVista == 'NOMINAS') {
            habilitarVisitaNominas();
        }
    }
    cerrarModalIE($('#myModal'));
}

$('.comprobarSesion').keyup(function (e) {
    if (e.keyCode == 13) {
        let aqui = dondeEstoy(this);
        aqui.Forms.accionCheckLogin.set({ p_auxpasusr: aqui.Forms.accionCheckLogin.parametros.p_auxpasusr.object.value });
        $('#okfunction').trigger("click");
    }
});
