$('.nominasCertificados').click(function () {
    Moduls.app.Opcion = '1313';
    Moduls.app.Path = '00';
    Moduls.app.PuntoPartida = 'Home/AccesoDirecto';
    Moduls.app.load({ url: 'modulos/apps/seccionApp.html', script: true });
});
$('.comisionesServicios').click(function () {
    Moduls.app.Opcion = '1966';
    Moduls.app.Path = 'CG / 130 / INTERLINE';
    Moduls.app.PuntoPartida = 'Home/AccesoDirecto';
    Moduls.app.load({ url: 'modulos/apps/seccionApp.html', script: true });
});
$('.gastosEmpleados').click(function () {
    Moduls.app.Opcion = '1738';
    Moduls.app.Path = 'ADMIN / 100002';
    Moduls.app.PuntoPartida = 'Home/AccesoDirecto';
    Moduls.app.load({ url: 'modulos/apps/seccionApp.html', script: true });
});
$('.beneficios').click(function () {
    Moduls.app.Path = 'BENEF';
    Moduls.app.Opcion = 'fakeOption';
    Moduls.app.PuntoPartida = 'Home/AccesoDirecto';
    Moduls.app.load({ url: 'modulos/apps/seccionApp.html', script: true });
});
$('.menuCampusOnline').click(function () {
    Moduls.app.Opcion = '1980';
    Moduls.app.Path = 'FORM / CAMPUS';
    Moduls.app.PuntoPartida = 'Home/AccesoDirecto';
    Moduls.app.load({ url: 'modulos/apps/seccionApp.html', script: true });
});

$('.marcasapp').click(function () {
    Moduls.app.Opcion = 'MARCAS';
    Moduls.app.Path = 'INFCORP / MARCAS';
    Moduls.app.PuntoPartida = 'Home/AccesoDirecto';
    Moduls.app.load({ url: 'modulos/apps/seccionApp.html', script: true });
});
