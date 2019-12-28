$(document).ready(function () {
    Moduls.app.ExisteCambioConstrasena = true;

    if ((!Moduls.app.ExisteDatosPersonales && !Moduls.app.ExisteDatosEmpresa && !Moduls.app.ExisteDatosFiscales &&
        !Moduls.app.ExisteSituacionFamiliar && !Moduls.app.ExisteParentesco && !Moduls.app.ExisteBeneficiarios &&
        !Moduls.app.ExisteCuentaBancaria) || getPerfilEmpleadoDefault() === 'cambioContrasena') {
        $('.aperturaDatosPersonales').removeClass('cambio');
        $('.cuerpoDatosPersonales').removeClass('show');
        $('#heading7').addClass('cambio');
        $('#collapse7').addClass('show');
    }

    LibraryManager.load('crypto-js-3.1.9-1', 'core', function () { });

    let aqui = false;
    let codusr = false;
    if (Moduls.app && Moduls.app.child && Moduls.app.child.templateAplicacion && Moduls.app.child.templateAplicacion.child.tempCambioContrasena) {
        aqui = Moduls.app.child.templateAplicacion.child.tempCambioContrasena;
        codusr = Moduls.header.user.codusr;
    } else {
        aqui = Moduls.app;
        codusr = Moduls.app.codusr;
        $('#heading7').addClass('cambio');
        $('#collapse7').addClass('show');
        $('.cancelPass').addClass('dn');
        top.SESION_ID = genXsid();
    }

    aqui.Forms.cambioContrasena.set({ p_codusr: codusr });
    aqui.Forms.frmOnloadCambioContrasena.set({ p_codusr: codusr });
    aqui.Forms.frmOnloadCambioContrasena.executeForm();

    getId('botoGardarCambioContrasenya').addEventListener('click', function () {
        let voy = dondeEstoy(this);
        if (voy.parametros.p_passwd.value === voy.parametros.p_reppas.value) {
            voy.set({
                p_oldpas: encrypt(voy.parametros.p_auxoldpas.value),
                p_newpas: encrypt(voy.parametros.p_passwd.value)
            });
            voy.executeForm();
        } else {
            voy.set({ p_passwd: '', p_reppas: '' });
            cambioContrasena(false, [{ name: 'p_passwd', type: 'nomatch', label: 'Las contraseñas' }], { form: voy, status: 'validation' })
        }
    });

    passwordthify($('form[name=cambioContrasena] input[name=p_passwd]'));
});

$('.cancelPass').click(function () {
    Moduls.app.child.templateAplicacion.child.tempCambioContrasena.Forms.cambioContrasena.set({ p_auxoldpas: '', p_passwd: '', p_reppas: '' });
});

$('#heading7').click(function () {
    if ($('#collapse7').hasClass('show')) {
        $('#heading7').removeClass('cambio');
        $('#collapse7').removeClass('show');
    } else {
        $('.aperturaDatosPersonales').removeClass('cambio');
        $('.cuerpoDatosPersonales').removeClass('show');
        $('#heading7').addClass('cambio');
        $('#collapse7').addClass('show');
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
        e.form.set({ p_auxoldpas: '', p_passwd: '', p_reppas: '' });
        if (e.form.modul.name == '#app') {
            Moduls.header.Forms.datosSesion.executeForm();
        }
    }
}

function loadValidator(val, usr) {
    if (val == 'A') {
        $('form[name=cambioContrasena] input[name=p_passwd]').strengthify({
            user: usr,
            button: $('#botoGardarCambioContrasenya')[0],
            drawMessage: true,
            drawBars: true,
            validations: {
                length: { min: 8 },
                chargroup: { num: 3, types: ['NUMB', 'MAY', 'MIN', 'SPEC'] },
                match: 3
            }
        });
    } else if (val == 'G') {
        $('form[name=cambioContrasena] input[name=p_passwd]').strengthify({
            user: usr,
            button: $('#botoGardarCambioContrasenya')[0],
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

function cbkOnloadCambioContrasena(s, d, e) {
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
                    });
            }
        }
    } else {
        validaErroresCbk(d);
    }
}