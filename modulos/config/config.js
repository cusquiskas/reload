(function () {
    $(document).ready(function () {
        Moduls.app.child.modal.load({ url: 'modulos/comunes/modal.html', script: false });
        Moduls.app.child.templateGestion.load({ url: 'modulos/config/opciones/gestionPerfil.html', script: true });
        $('#opcionMenu').click(function () {
            Moduls.app.child.templateGestion.load({ url: 'modulos/config/opciones/opcionesMenu.html', script: true });
        });
        $('#gestionPerfiles').click(function () {
            Moduls.app.child.templateGestion.load({ url: 'modulos/config/opciones/gestionPerfil.html', script: true });
        });
        $('#exclusiones').click(function () {
            Moduls.app.child.templateGestion.load({ url: 'modulos/config/opciones/exclusiones/exclusiones.html', script: true });
        });
        $('#gestionNotificaciones').click(function () {
            Moduls.app.child.templateGestion.load({ url: 'modulos/config/opciones/gestionNotificaciones/gestionNotificaciones.html', script: true });
        });
        $('#gestionIconoPortal').click(function () {
            Moduls.app.child.templateGestion.load({ url: 'modulos/config/opciones/gestionIconoPortal.html', script: true ,class:'gestionIconoPortal' });
        });
    });
})();