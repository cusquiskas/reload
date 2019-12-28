$(document).ready(function () {
    LibraryManager.load('crypto-js-3.1.9-1', 'core', function () { });
});

$('#buttonLoginPrincipal').click(function () {
    let pwdnew = Moduls.app.Forms.login.parametros.p_newpas.value;
    let pwdrpt = Moduls.app.Forms.login.parametros.p_pwdrpt.value;

    if (pwdnew != pwdrpt) {
        toast({ tipo: 'error', msg: 'Las contrase&#241;as deben coincidir' });
    } else {
        Moduls.app.Forms.login.set({ p_passwrd: encrypt(pwdnew) });
        Moduls.app.Forms.login.executeForm();
    }
});

function login(s, d, e) {
    if (s) {
        top.location.href = '/';
    } else {
        validaErroresCbk(d);
    }
}

$('.bodyNuestro').keyup(function (e) {
    if (e.keyCode == 13) {
        if (Moduls.app.Forms && Moduls.app.Forms.login !== undefined) {
            if (Moduls.app.Forms.login.parametros.p_pwdrpt.value != Moduls.app.Forms.login.parametros.p_pwdrpt.object.value) {
                Moduls.app.Forms.login.set({ p_pwdrpt: Moduls.app.Forms.login.parametros.p_pwdrpt.object.value });
            }
            let event = document.createEvent("Event"); event.initEvent('click', false, true);
            $('#buttonLoginPrincipal')[0].dispatchEvent(event);
        }
    }
});

// Funciones de callback
function cbkOnload(s, d, e) {

    if (s) {
        if (d.root) {
            $('<link>')
                .appendTo('head')
                .attr({
                    type: 'text/css',
                    rel: 'stylesheet',
                    href: 'librerias/strengthify/strengthify.min.css'
                });
            $.getScript("librerias/strengthify/MY.strengthify.js")
                .done(function (script, textStatus) {
                    passwordthify($('input[name=p_newpas]'), true);
                    if (d.root.validacion == 'A') {
                        $('input[name=p_newpas]').strengthify({
                            user: d.root.usuario,
                            button: $('#buttonLoginPrincipal')[0],
                            drawMessage: true,
                            drawBars: true,
                            validations: {
                                length: { min: 8 },
                                chargroup: { num: 3, types: ['NUMB', 'MAY', 'MIN', 'SPEC'] },
                                match: 3
                            }
                        });
                    } else if (d.root.validacion == 'G') {
                        $('input[name=p_newpas]').strengthify({
                            user: d.root.usuario,
                            button: $('#buttonLoginPrincipal')[0],
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
                })
                .fail(function (jqxhr, settings, exception) {
                    toast({ tipo: 'error', msg: 'No se ha podido cargar la libreria "MY.strengthify.js"' });
                }
                );
        }
    } else {
        validaErroresCbk(d);
    }
}