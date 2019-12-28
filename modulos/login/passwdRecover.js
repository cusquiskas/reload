// Funciones de inialización
$(function () {
    LibraryManager.load('crypto-js-3.1.9-1', 'core', function () { });

    Moduls.app.child.modal.passwdRecoverLogin = { fase: 0 };

    if (Moduls.app.child.modal.passwdrecover.loginuser) {
        Moduls.app.child.passwordRecovery.Forms.frmContactInfo.set({
            p_codusr: Moduls.app.child.modal.passwdrecover.loginuser
        });
        Moduls.app.child.passwordRecovery.Forms.frmContactInfo.executeForm();
    } else {
        $('.noPass .d-contac').removeClass('dn');
    }

    $(window).unbind('keyup.passrecover');
    $(window).bind('keyup.passrecover', function (e) {
        if (e.keyCode == 13 && $('.noPass').length == 1) fncSiguientePasswdRecover();
    });

    $('.noPass .btnRecuperarPassword').click(function () {
        fncSiguientePasswdRecover();
    });

    $('.fowardToIban').click(function() {
        if($('.noPass .iban-sufx').html()) {
            $('.noPass .d-chkibn').removeClass('dn');
            $('.noPass .d-crrtlf').addClass('dn');
            Moduls.app.child.modal.passwdRecoverLogin.fase = 6;
        } else {
            $('.noPass .d-tlfcnt').removeClass('dn');
            $('.noPass .d-crrtlf').addClass('dn');
            Moduls.app.child.modal.passwdRecoverLogin.fase = 5;
        }
    });

    $('.noPass label[for=xchkcrrx]').click(function () {
        if ($('.noPass #xchktlfx').is(':checked')) $('.noPass #xchktlfx').click();
        if (!$(this).is(':checked')) Moduls.app.child.passwordRecovery.Forms.frmRecuperar.parametros.p_mode.value = 'CORREO';
    });
    $('.noPass label[for=xchktlfx]').click(function () {
        if ($('.noPass #xchkcrrx').is(':checked')) $('.noPass #xchkcrrx').click();
        if (!$(this).is(':checked')) Moduls.app.child.passwordRecovery.Forms.frmRecuperar.parametros.p_mode.value = 'TELEPH';
    });

    $('.btnVolverALogin').click(function() {
        location.reload();
    });

    $('#myModal').focus();
});

// Funciones de callback
function cbkContactInfo(s, d, e) {
    if (s && d && d.root) {
        $('.noPass .d-contac').addClass('dn');
        Moduls.app.child.passwordRecovery.Forms.frmRecuperar.set({
            p_codusr: Moduls.app.child.passwordRecovery.Forms.frmContactInfo.parametros.p_codusr.value
        });
        Moduls.app.child.passwordRecovery.Forms.frmRecuperarPorIban.set({
            p_codusr: Moduls.app.child.passwordRecovery.Forms.frmContactInfo.parametros.p_codusr.value
        });
        Moduls.app.child.passwordRecovery.Forms.frmPasswrdClaveSms.set({
            p_codusr: Moduls.app.child.passwordRecovery.Forms.frmContactInfo.parametros.p_codusr.value
        });
        Moduls.app.child.passwordRecovery.Forms.frmOnloadRecuperacionContrasena.set({
            p_codusr: Moduls.app.child.passwordRecovery.Forms.frmContactInfo.parametros.p_codusr.value
        });
        if (d.root.iban) {
            $('.noPass .iban-sufx').html('- ' + d.root.iban.substr(d.root.iban.length - 4));
            Moduls.app.child.passwordRecovery.Forms.frmRecuperarPorIban.set({
                p_nomusr: d.root.nomusr
            });
        }
        if (d.root.teleph || d.root.correo) {
            /*
            $('.noPass form[name=frmRecuperar] input[name=p_correo]').on('keydown', function (e) {
                if ($.inArray(Moduls.app.child.modal.passwdRecoverLogin, [1, 2, 3])) {
                    if (e.keyCode == 8) {
                        e.preventDefault();
                        let index = $(this).val().indexOf('*');
                        if (index == -1) index = $(this).val().indexOf('@');
                        if (index > $('.noPass [name=frmRecuperar] [name=p_savcor]').val().indexOf('*')) {
                            Moduls.app.child.passwordRecovery.Forms.frmRecuperar.set({
                                p_correo: $(this).val().substring(0, index - 1) + '*' + $(this).val().substring(index)
                            });
                            this.setSelectionRange(index - 1, index - 1);
                        }
                    } else if (e.keyCode == 46) {
                        e.preventDefault();
                    }
                }
            });
            $('.noPass form[name=frmRecuperar] input[name=p_correo]').on('keypress', function (e) {
                if ($.inArray(Moduls.app.child.modal.passwdRecoverLogin, [1, 2, 3])) {
                    e.preventDefault();
                    let index = $(this).val().indexOf('*');
                    if (index != -1 && /[a-zA-Z0-9-_.]/.test(String.fromCharCode((e.which || e.keyCode)))) {
                        Moduls.app.child.passwordRecovery.Forms.frmRecuperar.set({
                            p_correo: $(this).val().substring(0, index) + String.fromCharCode((e.which || e.keyCode)) + $(this).val().substring(index + 1)
                        });
                        this.setSelectionRange(index + 1, index + 1);
                    }
                }
            });
            $('.noPass form[name=frmRecuperar] input[name=p_teleph]').on('keydown', function (e) {
                if ($.inArray(Moduls.app.child.modal.passwdRecoverLogin, [1, 2, 3])) {
                    if (e.keyCode == 8) {
                        e.preventDefault();
                        let index = $(this).val().indexOf('*');
                        if (index == -1) index = $(this).val().length;
                        if (index > $('.noPass [name=frmRecuperar] [name=p_savtel]').val().indexOf('*')) {
                            Moduls.app.child.passwordRecovery.Forms.frmRecuperar.set({
                                p_teleph: $(this).val().substring(0, index - 1) + '*' + $(this).val().substring(index)
                            });
                            this.setSelectionRange(index - 1, index - 1);
                        }
                    } else if (e.keyCode == 46) {
                        e.preventDefault();
                    }
                }
            });
            $('.noPass form[name=frmRecuperar] input[name=p_teleph]').on('keypress', function (e) {
                if ($.inArray(Moduls.app.child.modal.passwdRecoverLogin, [1, 2, 3])) {
                    e.preventDefault();
                    let index = $(this).val().indexOf('*');
                    if (index != -1 && !isNaN(String.fromCharCode(e.which || e.keyCode))) {
                        Moduls.app.child.passwordRecovery.Forms.frmRecuperar.set({
                            p_teleph: $(this).val().substring(0, index) + String.fromCharCode(e.which || e.keyCode) + $(this).val().substring(index + 1)
                        });
                        this.setSelectionRange(index + 1, index + 1);
                    }
                }
            });
            $('.noPass form[name=frmRecuperar] input[type=text]').on('click focus', function () {
                if ($.inArray(Moduls.app.child.modal.passwdRecoverLogin, [1, 2, 3])) {
                    let index = $(this).val().indexOf('*');
                    if (index != -1) this.setSelectionRange(index, index);
                }
            });
            $('.noPass form[name=frmRecuperar] input[type=text]').on('paste', function (e) {
                e.preventDefault();
            });
            */

            $('.noPass .d-crrtlf').removeClass('dn');
            if (!d.root.teleph) {
                $('.fowardEmailToIban').toggleClass('dn');
                Moduls.app.child.passwordRecovery.Forms.frmRecuperar.set({
                    p_correo: d.root.correo,
                    p_savcor: d.root.correo
                });
                $('.noPass label[for=xchkcrrx]').click();
                $('.noPass label[for=xchktlfx]').addClass('not-clickeable');
                $('.noPass label[for=xchkcrrx]').addClass('not-clickeable');
                Moduls.app.child.modal.passwdRecoverLogin.fase = 1;
            } else if (!d.root.correo) {
                $('.fowardTelephoneToIban').toggleClass('dn');
                Moduls.app.child.passwordRecovery.Forms.frmRecuperar.set({
                    p_teleph: d.root.teleph,
                    p_savtel: d.root.teleph
                });
                $('.noPass label[for=xchktlfx]').click();
                $('.noPass label[for=xchktlfx]').addClass('not-clickeable');
                $('.noPass label[for=xchkcrrx]').addClass('not-clickeable');
                Moduls.app.child.modal.passwdRecoverLogin.fase = 2;
            } else {
                Moduls.app.child.passwordRecovery.Forms.frmRecuperar.set({
                    p_correo: d.root.correo,
                    p_savcor: d.root.correo,
                    p_teleph: d.root.teleph,
                    p_savtel: d.root.teleph
                });
                Moduls.app.child.modal.passwdRecoverLogin.fase = 3;
            }
        } else if (d.root.iban) {
            $('.noPass .d-chkibn').removeClass('dn');
            Moduls.app.child.modal.passwdRecoverLogin.fase = 6;
        } else {
            $('.noPass .d-tlfcnt').removeClass('dn');
            Moduls.app.child.modal.passwdRecoverLogin.fase = 5;
        }
    } else {
        if (!s) {
            backToLogin();
            validaErroresCbk(d);
        }
    }
}

function cbkRecuperar(s, d, e) {
    if (s) {
        switch (Moduls.app.child.modal.passwdRecoverLogin.fase) {
            case 7:
                $('.noPass .d-crrtlf').addClass('dn');
                $('.noPass .d-chkkey').removeClass('dn');
                break;
            default:
                $('.noPass .d-crrtlf').addClass('dn');
                $('.noPass .d-cnfcrr').removeClass('dn');
                $('.noPass .correo-enviado-a').html(d.root);
                break;
        }
    } else {
        let intentos = (d && d.extra && !isNaN(d.extra)) ? Number(d.extra) : -1;
        if (intentos > 0) {
            Moduls.app.child.modal.passwdRecoverLogin.fase = Moduls.app.child.modal.passwdRecoverLogin.afase;
            toast({ tipo: 'error', msg: d.errmsg + '<br>Quedan ' + intentos + ' intentos restantes' });
        } else if (intentos == 0) {
            backToLogin();
            toast({ tipo: 'error', msg: d.errmsg });
        } else {
            backToLogin();
            validaErroresCbk(d);
        }
    }
}

function cbkRecuperarPorIban(s, d, e) {
    if (s) {
        switch (Moduls.app.child.modal.passwdRecoverLogin.fase) {
            case 7:
                $('.noPass .d-chkibn').addClass('dn');
                $('.noPass .d-chkkey').removeClass('dn');
                break;
            default:
                $('.noPass .d-chkibn').addClass('dn');
                $('.noPass .d-cnfcrr').removeClass('dn');
                $('.noPass .correo-enviado-a').html(d.root);
                break;
        }
    } else {
        let intentos = (d && d.extra && !isNaN(d.extra)) ? Number(d.extra) : -1;
        if (intentos > 0) {
            Moduls.app.child.modal.passwdRecoverLogin.fase = Moduls.app.child.modal.passwdRecoverLogin.afase;
            toast({ tipo: 'error', msg: d.errmsg + '<br>Quedan ' + intentos + ' intentos restantes' });
        } else if (intentos == 0) {
            backToLogin();
            toast({ tipo: 'error', msg: d.errmsg });
        } else {
            backToLogin();
            validaErroresCbk(d);
        }
    }
}

function cbkPasswrdClaveSms(s, d, e) {
    if (s) {
        toast({ tipo: 'success', msg: d.root });
        backToLogin();
    } else {
        validaErroresCbk(d);
    }
}

function cbkOnloadRecuperacionContrasena(s, d, e) {
    if (s) {
        if (d.root) {
            if (window.loadedjs && window.loadedjs.strengthify) {
                loadValidator(d.root.validacion, d.root.usuario);
            } else {
                $('<link>')
                    .appendTo('head')
                    .attr({
                        type: 'text/css',
                        rel: 'stylesheet',
                        href: 'librerias/strengthify/strengthify.min.css'
                    });
                $.getScript("librerias/strengthify/MY.strengthify.js")
                    .done(function (script, textStatus) {
                        loadValidator(d.root.validacion, d.root.usuario);
                    })
                    .fail(function (jqxhr, settings, exception) {
                        toast({ tipo: 'error', msg: 'No se ha podido cargar la libreria "MY.strengthify.js"' });
                    }
                    );
            }
        }
    } else {
        validaErroresCbk(d);
    }
}

// Funciones de uso general
function loadValidator(val, usr) {
    passwordthify($('form[name=frmPasswrdClaveSms] input[name=p_auxpsswrd]'), true, true);

    if (val == 'A') {
        $('form[name=frmPasswrdClaveSms] input[name=p_auxpsswrd]').strengthify({
            user: usr,
            button: $('form[name=frmPasswrdClaveSms] .btnRecuperarPassword')[0],
            drawMessage: true,
            drawBars: true,
            validations: {
                length: { min: 8 },
                chargroup: { num: 3, types: ['NUMB', 'MAY', 'MIN', 'SPEC'] },
                match: 3
            }
        });
    } else if (val == 'G') {
        $('form[name=frmPasswrdClaveSms] input[name=p_auxpsswrd]').strengthify({
            user: usr,
            button: $('form[name=frmPasswrdClaveSms] .btnRecuperarPassword')[0],
            drawMessage: true,
            drawBars: true,
            validations: {
                length: { min: 6, max: 10 },
                charpos: [{ pos: 0, type: 'LET' }],
                chartype: ['LET', 'NUMB'],
                match: 0
            }
        });
    }
}

function fncSiguientePasswdRecover() {
    switch (Moduls.app.child.modal.passwdRecoverLogin.fase) {
        case 0:
            Moduls.app.child.passwordRecovery.Forms.frmContactInfo.executeForm();
            break;
        case 1:
            Moduls.app.child.passwordRecovery.Forms.frmRecuperar.set({ p_mode: 'CORREO' });
            /*
            if (Moduls.app.child.passwordRecovery.Forms.frmRecuperar.parametros.p_correo.value.indexOf('*') == -1) {
                Moduls.app.child.passwordRecovery.Forms.frmRecuperar.executeForm();
                Moduls.app.child.modal.passwdRecoverLogin.afase = Moduls.app.child.modal.passwdRecoverLogin.fase;
            } else {
                toast({ tipo: 'error', msg: 'Debe rellenar los espacios con "*" para el correo' });
            }
            */
            Moduls.app.child.passwordRecovery.Forms.frmRecuperar.executeForm();
            Moduls.app.child.modal.passwdRecoverLogin.afase = Moduls.app.child.modal.passwdRecoverLogin.fase;
            break;
        case 2:
            Moduls.app.child.passwordRecovery.Forms.frmRecuperar.set({ p_mode: 'TELEPH' });
            /*
            if (Moduls.app.child.passwordRecovery.Forms.frmRecuperar.parametros.p_teleph.value.indexOf('*') == -1) {
                Moduls.app.child.passwordRecovery.Forms.frmRecuperar.executeForm();
                Moduls.app.child.modal.passwdRecoverLogin.afase = Moduls.app.child.modal.passwdRecoverLogin.fase;
                Moduls.app.child.modal.passwdRecoverLogin.fase = 7;
            } else {
                toast({ tipo: 'error', msg: 'Debe rellenar los espacios con "*" para el teléfono' });
            }
            */
            Moduls.app.child.passwordRecovery.Forms.frmRecuperar.executeForm();
            Moduls.app.child.modal.passwdRecoverLogin.afase = Moduls.app.child.modal.passwdRecoverLogin.fase;
            Moduls.app.child.modal.passwdRecoverLogin.fase = 7;
            break;
        case 3:
            let mode = Moduls.app.child.passwordRecovery.Forms.frmRecuperar.parametros.p_mode.value;
            switch (mode) {
                case 'CORREO':
                    /*
                    if (Moduls.app.child.passwordRecovery.Forms.frmRecuperar.parametros.p_correo.value.indexOf('*') == -1) {
                        Moduls.app.child.passwordRecovery.Forms.frmRecuperar.executeForm();
                        Moduls.app.child.modal.passwdRecoverLogin.afase = Moduls.app.child.modal.passwdRecoverLogin.fase;
                    } else {
                        toast({ tipo: 'error', msg: 'Debe rellenar los espacios con "*" para el correo' });
                    }
                    */
                    Moduls.app.child.passwordRecovery.Forms.frmRecuperar.executeForm();
                    Moduls.app.child.modal.passwdRecoverLogin.afase = Moduls.app.child.modal.passwdRecoverLogin.fase;
                    break;
                case 'TELEPH':
                    /*
                    if (Moduls.app.child.passwordRecovery.Forms.frmRecuperar.parametros.p_teleph.value.indexOf('*') == -1) {
                        Moduls.app.child.passwordRecovery.Forms.frmRecuperar.executeForm();
                        Moduls.app.child.modal.passwdRecoverLogin.afase = Moduls.app.child.modal.passwdRecoverLogin.fase;
                        Moduls.app.child.modal.passwdRecoverLogin.fase = 7;
                    } else {
                        toast({ tipo: 'error', msg: 'Debe rellenar los espacios con "*" para el teléfono' });
                    }
                    */
                    Moduls.app.child.passwordRecovery.Forms.frmRecuperar.executeForm();
                    Moduls.app.child.modal.passwdRecoverLogin.afase = Moduls.app.child.modal.passwdRecoverLogin.fase;
                    Moduls.app.child.modal.passwdRecoverLogin.fase = 7;
                    break;
                default:
                    toast({ tipo: 'error', msg: 'Debe seleccionar teléfono o correo' });
            }
            break;
        case 5:
            backToLogin();
            break;
        case 6:
            let teleph = Moduls.app.child.passwordRecovery.Forms.frmRecuperarPorIban.parametros.p_teleph.value;
            let correo = Moduls.app.child.passwordRecovery.Forms.frmRecuperarPorIban.parametros.p_correo.value;
            let iban = Moduls.app.child.passwordRecovery.Forms.frmRecuperarPorIban.parametros.p_iban.value;

            let error = false;
            let istel = true;
            if (iban) {
                if (iban.length != 4 || isNaN(iban)) {
                    toast({ tipo: 'error', msg: 'El IBAN ebe ser un código numérico de cuatro cifras' });
                    error = true;
                }
            } else {
                toast({ tipo: 'error', msg: 'El número de IBAN es obligatorio' });
                error = true;
            }
            if (correo.length > 0) {
                if (correo.indexOf('@') == -1) {
                    toast({ tipo: 'error', msg: 'El correo debe contener un @' });
                    error = true;
                } else {
                    istel = false;
                }
            }
            if (teleph.length > 0 && (teleph.length != 9 || (teleph[0] != '6' && teleph[0] != '7'))) {
                toast({ tipo: 'error', msg: 'El teléfono debe ser de longitud 9 y empezar por 6 o 7' });
                error = true;
            }
            if (!correo && !teleph) {
                toast({ tipo: 'error', msg: 'Debe añadir un correo o un teléfono' });
                error = true;
            }

            if (!error) {
                Moduls.app.child.modal.passwdRecoverLogin.afase = Moduls.app.child.modal.passwdRecoverLogin.fase;
                if (istel) Moduls.app.child.modal.passwdRecoverLogin.fase = 7;
                Moduls.app.child.passwordRecovery.Forms.frmRecuperarPorIban.executeForm();
            }
            break;
        case 7:
            let clave = Moduls.app.child.passwordRecovery.Forms.fmrAskKey.parametros.p_clasms.value;
            if (!clave || clave.length != 8) {
                toast({ tipo: 'error', msg: 'La clave debe ser de 8 dígitos' });
            } else {
                invocaAjax({
                    direccion: '/management/mvc-management/controller/portal.xwi_recuperacion.check_clavesms.json',
                    parametros: {
                        p_codusr: Moduls.app.child.passwordRecovery.Forms.frmRecuperar.parametros.p_codusr.value,
                        p_clasms: clave
                    },
                    contentType: 'application/json',
                    asincrono: false,
                    retorno: function (s, d, e) {
                        if (s) {
                            if (d.root && d.root == 'S') {
                                Moduls.app.child.passwordRecovery.Forms.frmPasswrdClaveSms.set({
                                    p_clasms: clave
                                });
                                $('.noPass .d-chkkey').addClass('dn');
                                $('.noPass .d-newpss').removeClass('dn');
                                Moduls.app.child.modal.passwdRecoverLogin.fase = 8;
                                Moduls.app.child.passwordRecovery.Forms.frmOnloadRecuperacionContrasena.executeForm();
                            } else if (d.root && d.root == '=') {
                                backToLogin();
                                toast({ tipo: 'error', msg: 'La clave proporcionada ha caducado' });
                            } else {
                                toast({ tipo: 'error', msg: 'La clave proporcionada es incorrecta' });
                            }
                        } else {
                            backToLogin();
                            validaErroresCbk(d);
                        }
                    }
                });
            }
            break;
        case 8:
            let passnew = Moduls.app.child.passwordRecovery.Forms.frmPasswrdClaveSms.parametros.p_auxpsswrd.value;
            let passrpt = Moduls.app.child.passwordRecovery.Forms.frmPasswrdClaveSms.parametros.p_pssrpt.value;

            let error2 = false;
            if (passnew.length < 4) {
                toast({ tipo: 'error', msg: 'La contraseña debe tener al menos 4 carácteres' });
                error2 = true;
            }
            if (passnew != passrpt) {
                toast({ tipo: 'error', msg: 'Las contraseñas deben coincidir' });
                error2 = true;
            }

            if (!error2) {
                top.SESION_ID = genXsid();
                Moduls.app.child.passwordRecovery.Forms.frmPasswrdClaveSms.set({ p_psswrd: encrypt(passnew) });
                Moduls.app.child.passwordRecovery.Forms.frmPasswrdClaveSms.executeForm();
            }

            break;
        default:
            backToLogin();
    }
}

function backToLogin() {
    $(Moduls.app.child.passwordRecovery.template).empty();
    $('.new-login .login-form-container').removeClass('dn');
}

function formatIban(iban) {
    return [
        iban.slice(0, 4),
        iban.slice(4, 8),
        iban.slice(8, 12),
        iban.slice(12, 16),
        iban.slice(16, 20),
        iban.slice(20, 24)].join(' - ');
}