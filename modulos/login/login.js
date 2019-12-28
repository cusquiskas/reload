$(document).ready(function () {
    LibraryManager.load('crypto-js-3.1.9-1', 'core', function () { });
    Moduls.app.Forms.login.parametros.p_codusr.object.focus();
    Moduls.app.child.modal.load({ url: 'modulos/comunes/modal.html', script: false });

    if (Moduls.app.UsuarioExistenteSeleccionado) {
        let objeto = {};
        objeto['p_codusr'] = Moduls.app.UsuarioExistenteSeleccionado;
        Moduls.app.Forms.login.set(objeto);
        delete (Moduls.app.UsuarioExistenteSeleccionado);
    }

    $('.new-login .password-recovery-action a').click(function (event) {
        event.preventDefault();
        $('.new-login .login-form-container').addClass('dn');

        Moduls.app.child.modal.passwdrecover = {
            loginuser: Moduls.app.Forms.login.parametros.p_codusr.value
        }
        Moduls.app.child.passwordRecovery.load({
            url: 'modulos/login/passwdRecover.html',
            script: true
        });
    });

    if (document.location.href.indexOf('recoveryPassword') > 0) $('.new-login .password-recovery-action a').click();

    let estadoNotificaciones = window.Notification || window.mozNotification || window.webkitNotification;
    if ($(document).width() > 769) {
        if ('undefined' === typeof estadoNotificaciones) {
            $('.divNotificaciones').addClass('dn');
        } else {
            $('.divNotificaciones').removeClass('dn');
        }
    } else {
        $('.divNotificaciones').addClass('dn');
    }
    if (estadoNotificaciones && estadoNotificaciones.permission && estadoNotificaciones.permission == 'granted') {
        $('.divNotificaciones').css("background-color", "#28a745");
        $('.imagenNotificaciones ').css("cursor", "default");
        $('.primero').css("background-color", "#28a745");
        $('.primero').css("width", "310px");
        $('.primero').css("height", "50px");
        $('.primero').css("top", "14px");
        $('.primero').css("padding", "12px");
        $('.primero').toggleClass('verde');
        $('.primero').html('¡Alertas de escritorio ACTIVADAS!');
    } else if (estadoNotificaciones && estadoNotificaciones.permission && estadoNotificaciones.permission == 'denied') {
        $('.divNotificaciones').css("background-color", "#ff3547");
        $('.imagenNotificaciones ').css("cursor", "default");
        $('.primero').css("background-color", "#ff3547");
        $('.primero').css("width", "310px");
        $('.primero').css("height", "50px");
        $('.primero').css("top", "14px");
        $('.primero').css("padding", "12px");
        $('.primero').toggleClass('rojo');
        $('.primero').html('¡Alertas de escritorio BLOQUEADAS!');
    }

    $('#buttonLoginPrincipal').click(function () {
        top.SESION_ID = genXsid();
        Moduls.app.Forms.login.set({ p_pasusr: encrypt(Moduls.app.Forms.login.parametros.p_psswrd.value) });
        //Moduls.app.Forms.login.set({p_pasusr: Moduls.app.Forms.login.parametros.p_psswrd.value});
        Moduls.app.Forms.login.executeForm();
    });
});

function login(s, d, e) {
    if (s && d.root && d.root.valid) {
        sessionStorage.setItem('FIRST_MODAL_ALERT', 'false');
        top.SESION_ID = d.root.xsid;
        if ($('#checkMantenerSesion').prop('checked')) {
            localStorage.setItem("SESION_ID", d.root.xsid);
        }
        sessionStorage.setItem("SESION_ID", d.root.xsid);
        Moduls.app.codusr = e.form.parametros.p_codusr.value;
        Moduls.header.codusr = e.form.parametros.p_codusr.value;
        Moduls.Forms.frm_wpLogin.set({ log: e.form.parametros.p_codusr.value, pwd: e.form.parametros.p_psswrd.value });
        Moduls.Forms.frm_wpLogin.formulario.submit();
        Moduls.header.Forms.datosSesion.executeForm();
        Moduls.app.PuntoPartida = 'Header/Login';
        registroOpciones('LOGIN');
        $('#header, #footer, .new-login .border-login').addClass('db');
    } else {
        if (e.form.parametros.p_codusr.value == '') {
            toast({ tipo: 'error', msg: 'Codigo de empleado: El valor no puede ser nulo' });
        } else if (e.form.parametros.p_psswrd.value == '') {
            toast({ tipo: 'error', msg: 'Contraseña: El valor no puede ser nulo' });
        } else {
            top.SESION_ID = "";
            if ($('#checkMantenerSesion').prop('checked')) {
                localStorage.setItem("SESION_ID", "");
            }
            sessionStorage.setItem("SESION_ID", "");
            if (!d.root || !d.root.pricon) toast({ tipo: 'error', msg: resuelveError(d) });
            if (contadorLogin == 3) {
                toast({ tipo: 'error', msg: 'Si introduce de nuevo mal la contraseña, la cuenta se bloqueará' });
                contadorLogin = 0;
            } else {
                contadorLogin++;
            }
            if (d.root) {
                if (d.root.looked) {
                    Moduls.app.codusr = e.form.parametros.p_codusr.value;
                    Moduls.app.load({ url: 'modulos/login/usuarioBloqueado.html', script: true });
                }
                if (d.root.expired) {
                    Moduls.app.codusr = e.form.parametros.p_codusr.value;
                    Moduls.app.load({ url: 'modulos/login/cambioContrasena.html', script: true });
                }
                if (d.root.pricon) {
                    Moduls.app.codusr = e.form.parametros.p_codusr.value;
                    Moduls.app.xsid = d.root.xsid;
                    Moduls.app.load({ url: 'modulos/login/nuevoUsuario.html', script: true });
                }
            }
        }
    }
}

$('.new-login').keyup(function (e) {
    if (e.keyCode == 13 && $('.noPass').length == 0) {
        if (Moduls.app.Forms && Moduls.app.Forms.login !== undefined) {
            if (Moduls.app.Forms.login.parametros.p_psswrd.value != Moduls.app.Forms.login.parametros.p_psswrd.object.value) {
                Moduls.app.Forms.login.set({ p_psswrd: Moduls.app.Forms.login.parametros.p_psswrd.object.value });
            }
            let event = document.createEvent("Event"); event.initEvent('click', false, true);
            $('#buttonLoginPrincipal')[0].dispatchEvent(event);
        }
    }
});

$('.imagenNotificaciones').click(function () {
    let notification = window.Notification || window.mozNotification || window.webkitNotification;
    if (notification && notification.permission) {
        notification.requestPermission(function (permission) {
            if (permission == 'granted') {
                $('.divNotificaciones').css("background-color", "#28a745");
                $('.imagenNotificaciones ').css("cursor", "default");
                $('.primero').css("background-color", "#28a745");
                $('.primero').css("width", "310px");
                $('.primero').css("height", "50px");
                $('.primero').css("top", "14px");
                $('.primero').css("padding", "12px");
                $('.primero').toggleClass('verde');
                $('.primero').html('¡Alertas de escritorio ACTIVADAS!');
            } else if (permission == 'denied') {
                $('.divNotificaciones').css("background-color", "#ff3547");
                $('.imagenNotificaciones ').css("cursor", "default");
                $('.primero').css("background-color", "#ff3547");
                $('.primero').css("width", "310px");
                $('.primero').css("height", "50px");
                $('.primero').css("top", "14px");
                $('.primero').css("padding", "12px");
                $('.primero').toggleClass('rojo');
                $('.primero').html('¡Alertas de escritorio BLOQUEADAS!');
            }
        });
    }
});