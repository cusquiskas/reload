$(document).ready(function () {
    LibraryManager.load('crypto-js-3.1.9-1', 'core', function () { });
});

$('#changePassButton').click(function () {
    let voy = dondeEstoy(this);
    if (voy.parametros.p_psswrd.value === voy.parametros.p_reppas.value) {
        top.SESION_ID = genXsid();
        voy.set({
            p_newpas: encrypt(voy.parametros.p_psswrd.value),
            p_oldpas: encrypt(voy.parametros.p_auxoldpss.value)
        });
        voy.executeForm();
    } else {
        voy.set({ p_psswrd: '', p_reppas: '' });
        cambioContrasena(false, [{ name: 'p_psswrd', type: 'nomatch', label: 'Las contraseñas' }], { form: voy, status: 'validation' })
    }
});

function cambioContrasena(s, d, e) {
    if (e && e.status && e.status == 'validation')
        for (let i = 0; i < d.length; i++) {
            if (d[i].type === 'required')
                toast({ tipo: 'error', msg: d[i].label + ': El valor es obligatorio' });
            else {
                if (d[i].type === 'nomatch')
                    toast({ tipo: 'error', msg: d[i].label + ' no coinciden' });
                else
                    toast({ tipo: 'error', msg: resuelveError(d) });
            }
        }
    else
        toast({ tipo: (s) ? 'success' : 'error', msg: resuelveError(d) });

    if (s) {
        e.form.set({ p_auxoldpss: '', p_psswrd: '', p_reppas: '' });
        if (e.form.modul.name == '#app') {
            Moduls.header.Forms.datosSesion.executeForm();
        }
    }
}

// Utils
function loadValidator(usr) {
    if (window.loadedjs && window.loadedjs.strengthify) {
        $('form[name=desbloquear] input[name=p_psswrd]').strengthify({
            user: usr,
            button: $('#changePassButton')[0],
            drawMessage: true,
            drawBars: true,
            validations: {
                length: { min: 8 },
                chargroup: { num: 3, types: ['NUMB', 'MAY', 'MIN', 'SPEC'] },
                match: 3
            }
        });
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
                $('form[name=desbloquear] input[name=p_psswrd]').strengthify({
                    user: usr,
                    button: $('#changePassButton')[0],
                    drawMessage: true,
                    drawBars: true,
                    validations: {
                        length: { min: 8 },
                        chargroup: { num: 3, types: ['NUMB', 'MAY', 'MIN', 'SPEC'] },
                        match: 3
                    }
                });
            })
            .fail(function (jqxhr, settings, exception) {
                toast({ tipo: 'error', msg: 'No se ha podido cargar la libreria "MY.strengthify.js"' });
            }
            );
    }
    /*
    if(val == 'A') {
        $('form[name=desbloquear] input[name=p_psswrd]').strengthify({
            user: usr,
            button: $('#changePassButton')[0],
            drawMessage: true,
            drawBars: true,
            validations: {
                length: {min: 8},
                chargroup: {num: 3, types: ['NUMB', 'MAY', 'MIN', 'SPEC']},
                match: 3
            }
        });
    } else if(val == 'G') {
        $('form[name=desbloquear] input[name=p_psswrd]').strengthify({
            user: usr,
            button: $('#changePassButton')[0],
            drawMessage: true,
            drawBars: true,
            validations: {
                length: {min: 6, max: 10},
                charpos: [{pos: 0, type: 'LET'}],
                chartype: ['LET', 'NUMB'],
                match: 0
            }
        });
    } else {
        $('form[name=desbloquear] input[name=p_psswrd]').disposeStrengthify();
    }
    */
}

// Funciones de Callback
function cbkOnloadCambioContrasenaDesatendido(s, d, e) {
    $('form[name=desbloquear] input[name=p_codusr]').keyup(function () {
        loadValidator($(this).val());
        $('form[name=desbloquear] input[name=p_psswrd]').keyup();
    });
    loadValidator('');

    passwordthify($('form[name=desbloquear] input[name=p_psswrd]'), true);
}