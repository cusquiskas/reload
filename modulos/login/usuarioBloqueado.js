function cargaDatosDesbloquear(s, d, e) {
    if (s) {
        let objeto = {};
        objeto['p_codusr'] = Moduls.app.codusr
        e.form.modul.Forms.desbloquear.set(objeto);
        delete (Moduls.app.codusr);
    } else {
        toast({ tipo: 'error', msg: resuelveError(d) });
    }
}

function desbloquear(s, d, e) {
    if (s) {
        Moduls.header.Forms.datosSesion.executeForm();
    } toast({ tipo: ((s) ? 'success' : 'error'), msg: resuelveError(d) });
}

$('.usuarioBloqueado').keyup(function (e) {
    if (e.keyCode == 13) {
        if (Moduls.app.Forms.desbloquear !== undefined) {
            if (Moduls.app.Forms.desbloquear.parametros.p_dniusr.value != Moduls.app.Forms.desbloquear.parametros.p_dniusr.object.value) {
                Moduls.app.Forms.desbloquear.set({ p_dniusr: Moduls.app.Forms.desbloquear.parametros.p_dniusr.object.value });
            }
            if (Moduls.app.Forms.desbloquear.parametros.p_fecnac.value != Moduls.app.Forms.desbloquear.parametros.p_fecnac.object.value) {
                Moduls.app.Forms.desbloquear.set({ p_fecnac: Moduls.app.Forms.login.parametros.p_fecnac.object.value });
            }
            Moduls.app.Forms.desbloquear.executeForm();
        }
    }
});