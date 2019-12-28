$('.enviarPregunta').click(function () {
    Moduls.app.PuntoPartida = 'Home/Banner';
    Moduls.app.Opcion = '9716';
    Moduls.app.Path = 'IN / 94';
    Moduls.app.load({ url: 'modulos/apps/seccionApp.html', script: true });
});

$('.registrarAhora').click(function () {
    Moduls.app.PuntoPartida = 'Home/Banner';
    Moduls.app.Opcion = 'MISDATOS';
    Moduls.app.Path = '00';
    Moduls.app.Seccion = 'datosEmpresa';
    registroOpciones('MISDATOS');
    setPerfilEmpleadoDefault('datosEmpresa');
    Moduls.app.load({ url: 'modulos/apps/seccionApp.html', script: true });
});