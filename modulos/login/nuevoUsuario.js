$(document).ready(function () {
    Moduls.app.child.modal.load({ url: 'modulos/comunes/modal.html', script: false });
});

$('.botonVolver').click(function () {
    Moduls.app.load({ url: 'modulos/login/login.html', script: true });
});

$('.botonAceptar').click(function () {
    let form = $('.nuevoUsuario form[name=primerLogin]')[0];
    dondeEstoy(form).executeForm();
});

function primerLogin(s, d, e) {
    if (s) {
        toast({ tipo: 'success', msg: resuelveError(d) });
        sessionStorage.setItem('FIRST_MODAL_ALERT', 'false');
        top.SESION_ID = Moduls.app.xsid;
        delete (Moduls.app.xsid);
        if ($('#checkMantenerSesion').prop('checked')) {
            localStorage.setItem("SESION_ID", top.SESION_ID);
        }
        sessionStorage.setItem("SESION_ID", top.SESION_ID);
        Moduls.app.codusr = e.form.parametros.p_codusr.value;
        Moduls.header.Forms.datosSesion.executeForm();
        Moduls.app.PuntoPartida = 'Header/Login';
        registroOpciones('LOGIN');
        $('#header, #footer, .new-login .border-login').addClass('db');
    } else {
        validaErroresCbk(d);
    }
}

function cargaDatosCrearUsuario(s, d, e) {
    if (s) {
        let objeto = {};
        objeto['p_codusr'] = Moduls.app.codusr
        e.form.modul.Forms.existeUsuario.set(objeto);
        e.form.modul.Forms.existeUsuario.executeForm();
    } else {
        toast({ tipo: 'error', msg: resuelveError(d) });
    }
}

function existeUsuario(s, d, e) {
    if (s) {
        if (d.root && d.root.usuarios) {
            if (d.root.usuarios.length > 1) {
                Moduls.app.usuariosDisponibles = d.root.usuarios;
                Moduls.app.child.modal.child.modalBody.load({ url: 'modulos/comunes/comunes.html?comboUsuariosExistentes', script: false });
                construirModal({
                    title: 'Cuentas Usuario',
                    w: 500,
                    ocultarXCerrar: true,
                    oktext: "ACEPTAR",
                    okfunction: function () {
                        let codUsuario = $('.selectUsuariosDisponibles').val().split('-')[0].substring(0, $('.selectUsuariosDisponibles').val().split('-')[0].length - 1);
                        if (Moduls.app.codusr.toUpperCase() == codUsuario) {
                            for (let i = 0; i < d.root.usuarios.length; i++) {
                                if (Moduls.app.codusr.toUpperCase() == d.root.usuarios[i].codusr) {
                                    cerrarModalIE($('#myModal'));
                                    let objeto = {};
                                    objeto['p_codusr'] = Moduls.app.codusr;
                                    objeto['p_email'] = d.root.usuarios[i].email;
                                    objeto['p_tlfemp'] = d.root.usuarios[i].telemp;
                                    objeto['p_extusr'] = d.root.usuarios[i].ext;
                                    objeto['p_correc'] = d.root.usuarios[i].correo;
                                    objeto['p_telrec'] = d.root.usuarios[i].teleph;
                                    e.form.modul.Forms.primerLogin.set(objeto);
                                    delete (Moduls.app.codusr);
                                    break;
                                }
                            }
                        } else {
                            Moduls.app.UsuarioExistenteSeleccionado = $('.selectUsuariosDisponibles').val();
                            cerrarModalIE($('#myModal'));
                            Moduls.app.load({ url: 'modulos/login/login.html', script: true });
                        }
                    }
                });
            } else {
                let objeto = {};
                objeto['p_codusr'] = Moduls.app.codusr;
                objeto['p_email'] = d.root.usuarios[0].email;
                objeto['p_tlfemp'] = d.root.usuarios[0].telemp;
                objeto['p_extusr'] = d.root.usuarios[0].ext;
                objeto['p_correc'] = d.root.usuarios[0].correo;
                objeto['p_telrec'] = d.root.usuarios[0].teleph;
                e.form.modul.Forms.primerLogin.set(objeto);
                delete (Moduls.app.codusr);
            }
        }
    } else {
        toast({ tipo: 'error', msg: resuelveError(d) });
    }
}

function cargarUsuariosCombo(s, d, e) {
    if (s) {
        let select = document.getElementsByName('usuariosDisponibles')[0];
        if (Moduls.app.usuariosDisponibles) {
            for (let i = 0; i < Moduls.app.usuariosDisponibles.length; i++) {
                let option = document.createElement("option");
                option.text = Moduls.app.usuariosDisponibles[i].codusr;
                if (Moduls.app.usuariosDisponibles[i].codusr == Moduls.app.codusr.toUpperCase()) {
                    option.text = option.text + ' - "Cuenta Nueva"';
                }
                select.add(option);
            }
        }
    } else {
        toast({ tipo: 'error', msg: resuelveError(d) });
    }
}