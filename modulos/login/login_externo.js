$(document).ready(function () {
    LibraryManager.load('crypto-js-3.1.9-1', 'core', function () { });
    Moduls.app.Forms.login.set({p_sesion:sessionStorage.getItem("SESION_ID")});
    Moduls.app.Forms.login.parametros.p_codusr.object.focus();
    //Moduls.app.child.modal.load({ url: 'modulos/comunes/modal.html', script: false });

    $('#buttonLoginPrincipal').click(function() {
        Moduls.app.Forms.login.set({
            p__clave: Moduls.app.Forms.login.parametros.p_auxclave.value
        });
        Moduls.app.Forms.login.executeForm();
    });
});

function login(s, d, e) {
    if (s && d.root.tipo!=="error") {
        Moduls.app.load({ url: d.root.ruta, script: true });
    } else {
        validaErroresCbk(d);
    }
}

$('.bodyNuestro').keyup(function (e) {
    if (e.keyCode == 13) {
        if (Moduls.app.Forms && Moduls.app.Forms.login !== undefined) {
            if (Moduls.app.Forms.login.parametros.p_auxclave.value != Moduls.app.Forms.login.parametros.p_auxclave.object.value) {
                Moduls.app.Forms.login.set({ p_auxclave: Moduls.app.Forms.login.parametros.p_auxclave.object.value });
            }
            let event = document.createEvent("Event"); event.initEvent('click', false, true);
            $('#buttonLoginPrincipal')[0].dispatchEvent(event);
        }
    }
});