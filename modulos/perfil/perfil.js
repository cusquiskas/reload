(function () {
    $(document).ready(function () {
        Moduls.app.child.modal.load({ url: 'modulos/comunes/modal.html', script: false });
        $('.empleadoLogado')[0].textContent = Moduls.header.user.nomusr;
        $('.imagenAvatarUsr')[0].src = (Moduls.header.user.imagen) ? Moduls.header.user.imagen : 'res/img/user.png';

        // CAMBIAR FOTO PERFIL
        $('#cambiarFoto').click(function () {
            // AVATAR
            Moduls.app.child.modal.child.modalBody.load({ url: 'modulos/perfil/cambioAvatar/cambioAvatar.html', script: true });
            construirModal({
                title: "CAMBIAR FOTO DE PERFIL",
                h: '500px'
            });
        });

        refreshProgresBar();
        // 14293 - 05.10.2018 - control para quitar el valor por defecto, en caso de que venga establecido
        setTimeout(function () { setPerfilEmpleadoDefault('') }, 2000);
    });
})();

function perfilesDePerfil(s, d, e) {
    if (s) {
        if (d.root) {
            if (d.root.pfl) {
                // DATOS PERSONALES
                if (d.root.pfl.datper && d.root.pfl.datper == true) {
                    Moduls.app.child.templateAplicacion.child.tempDatosPersonales.load({ url: 'modulos/perfil/secciones/datosPersonales.html', script: true, class: 'datosPersonales' });
                }
                // DATOS EMPRESA
                if (d.root.pfl.datemp && d.root.pfl.datemp == true) {
                    Moduls.app.child.templateAplicacion.child.tempDatosEmpresa.load({ url: 'modulos/perfil/secciones/datosEmpresa.html', script: true, class: 'DatosEmpresa' });
                }
                // DATOS FISCALES
                if (d.root.pfl.datfis && d.root.pfl.datfis == true) {
                    Moduls.app.child.templateAplicacion.child.tempDatosFiscales.load({ url: 'modulos/perfil/secciones/datosFiscales.html', script: true, class: 'datosFiscales' });
                }
                // SITUACION FAMILIAR
                if (d.root.pfl.sitfam && d.root.pfl.sitfam == true) {
                    Moduls.app.child.templateAplicacion.child.tempSituacionFamiliar.load({ url: 'modulos/perfil/secciones/situacionFamiliar.html', script: true, class: 'situacionfami' });
                }
                // PARENTESCO
                if (d.root.pfl.parenteso && d.root.pfl.parenteso == true) {
                    Moduls.app.child.templateAplicacion.child.tempParentesco.load({ url: 'modulos/perfil/secciones/parentesco.html', script: true, class: 'parentesco' });
                }
                // BENEFICIARIOS
                if (d.root.pfl.benefp && d.root.pfl.benefp == true) {
                    Moduls.app.child.templateAplicacion.child.tempBeneficiarios.load({ url: 'modulos/perfil/secciones/beneficiarios.html', script: true, class: 'beneficiario' });
                }
                // CAMBIO CUENTA BANCARIA
                if (d.root.pfl.cueban && d.root.pfl.cueban == true) {
                    Moduls.app.child.templateAplicacion.child.tempCuentaBancaria.load({ url: 'modulos/perfil/secciones/cuentaBancaria.html', script: true, class: 'cuentaBancaria' });
                }
                // CAMBIO CONTRASEÑA
                if (d.root.pfl.camcon && d.root.pfl.camcon == true) {
                    Moduls.app.child.templateAplicacion.child.tempCambioContrasena.load({ url: 'modulos/login/cambioContrasena.html', script: true });
                }
                // RECUPERACIÓN CONTRASEÑA
                if (d.root.pfl.reccon && d.root.pfl.reccon == true) {
                    Moduls.app.child.templateAplicacion.child.tempRecuperacionContrasena.load({ url: 'modulos/perfil/secciones/recuperacionContrasena.html', script: true, class: 'recuperacioncontra' });
                }
                // PRORRATEO PAGAS
                if (d.root.pfl.propex && d.root.pfl.propex == true) {
                    Moduls.app.child.templateAplicacion.child.tempProrrateoPagas.load({ url: 'modulos/perfil/secciones/prorrateoPagas.html', script: true, class: 'porroteopagas' });
                }
            }
        }
    } else
        toast({ tipo: 'error', msg: resuelveError(d) });
}