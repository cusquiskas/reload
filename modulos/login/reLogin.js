function autExecuteForm(s, d, e) {
    LibraryManager.load('crypto-js-3.1.9-1', 'core', function () { });

    if (localStorage.getItem('SESION_ID') != "") {
        e.form.modul.Forms.accionReLogin.set({ p_oldses: localStorage.getItem('SESION_ID') });
    } else {
        e.form.modul.Forms.accionReLogin.set({ p_oldses: sessionStorage.getItem('SESION_ID') });
    }
};

$('.close').click(function () {
    let objeto = {};
    if (localStorage.getItem("SESION_ID") != "") {
        objeto['p_oldses'] = localStorage.getItem('SESION_ID');
    } else {
        objeto['p_oldses'] = sessionStorage.getItem("SESION_ID");
    }
    Moduls.header.Forms.cerrarSesion.set(objeto);
    Moduls.header.Forms.cerrarSesion.executeForm();

    top.SESION_ID = null;
    if (localStorage.getItem("SESION_ID") != "") {
        localStorage.setItem("SESION_ID", "");
    }
    sessionStorage.setItem("SESION_ID", "");
    window.location.href = '/';
});

$('.btnEntrarSesion').click(function () {
    let form = $('.recuperarSesion form[name=accionReLogin]')[0];
    //top.SESION_ID = genXsid(); // Es necesario??
    let sesion = null;
    if (localStorage.getItem("SESION_ID") != "") {
        sesion = localStorage.getItem("SESION_ID");
    } else if (sessionStorage.getItem("SESION_ID")) {
        sesion = sessionStorage.getItem("SESION_ID");
    }

    if (sesion != null) {
        dondeEstoy(form).set({ p_pasusr: encrypt(dondeEstoy(form).parametros.p_pasusr2.value, sesion) });
        dondeEstoy(form).executeForm();
        Moduls.relogin.lanzado = false;
    } else {
        window.location.href = '/';
    }
});

function accionReLogin(s, d, e) {
    if (s && d.root.valid) {
        Moduls.relogin.lanzado = false;

        if (localStorage.getItem("SESION_ID") != "") {
            top.SESION_ID = localStorage.getItem('SESION_ID');
        } else {
            top.SESION_ID = sessionStorage.getItem('SESION_ID');
        }

        toast({ tipo: 'success', msg: resuelveError(d), donde: '.modal-header' });
        cerrarModalIE($('#myModalRelogin'));
    } else {
        if (e.form.parametros.p_codusr.value == '') {
            toast({ tipo: 'error', msg: 'Codigo de empleado: El valor no puede ser nulo', donde: '.modal-header' });
        } else if (e.form.parametros.p_pasusr.value == '') {
            toast({ tipo: 'error', msg: 'Contraseña: El valor no puede ser nulo', donde: '.modal-header' });
        } else {
            toast({ tipo: 'error', msg: resuelveError(d), donde: '.modal-header' });
        }
    }
}

$('.recuperarSesion').keyup(function (e) {
    if (e.keyCode == 13) {
        let aqui = dondeEstoy(this);
        if (aqui.Forms && aqui.Forms.accionReLogin !== undefined) {
            if (aqui.Forms.accionReLogin.parametros.p_pasusr.value != aqui.Forms.accionReLogin.parametros.p_pasusr.object.value) {
                aqui.Forms.accionReLogin.set({ p_pasusr: aqui.Forms.accionReLogin.parametros.p_pasusr.object.value });
            }
            Moduls.relogin.lanzado = false;
            let sesion;
            if (localStorage.getItem("SESION_ID") != "") {
                sesion = localStorage.getItem("SESION_ID");
            } else if (sessionStorage.getItem("SESION_ID")) {
                sesion = sessionStorage.getItem("SESION_ID");
            }

            if (sesion != null) {
                aqui.Forms.accionReLogin.set({ p_pasusr: encrypt(aqui.Forms.accionReLogin.parametros.p_pasusr2.value, sesion) });
                aqui.Forms.accionReLogin.executeForm();
            } else {
                window.location.href = '/';
            }
        }
    }
});