var menuAirEuropa = class {
    constructor(modulo) {
        let me = this;
        let seccion = Moduls.getApp().getScript().marcaSeccion;
        me.abreApp(seccion);
        me.cargaPage((seccion === 'Flota' ? 'AEA' : 'ESP'));

        Moduls.getApp().getScript().conmutaTexto();

        $('.cabeceraMenu').click(function () {
            let open = ($(this).hasClass('opcionFlota') ? 'Flota' : 'Destino');
            let close = ((open == 'Flota') ? 'Destino' : 'Flota');
            me.abreApp(open);
            me.cierraApp(close);
        });

        $('.opcionMenuMarca').click(function () {
            me.cargaPage(this.getAttribute('data-target'));
        });
    }

    cierraApp(sec) {
        $('.opcion' + sec).removeClass('active');
        $('.paraPlegar' + sec)[0].style.display = 'none';
    }

    abreApp(sec) {
        $('.opcion' + sec).addClass('active');
        $('.paraPlegar' + sec)[0].style.display = 'block';
    }

    cargaPage(page) {
        let mapa;
        switch (page) {
            case 'AEA':
                Moduls.app.Opcion = 'MARCAFLAEA';
                Moduls.app.Path = 'INFCORP / MARCAS / MARCAAEA / MARCAAEAFL';
                Moduls.getAireuropacontent().load({ url: 'modulos/marcas/AirEuropa/flota-aea.html', script: true, class: 'flotaAEA' });
                break;
            case 'OVA':
                Moduls.app.Opcion = 'MARCAFLOVA';
                Moduls.app.Path = 'INFCORP / MARCAS / MARCAAEA / MARCAAEAFL';
                Moduls.getAireuropacontent().load({ url: 'modulos/marcas/AirEuropa/flota-express.html', script: true, class: 'flotaExpress' });
                break;
            case 'ESP': mapa = 'mapaEspanya';
            case 'EUR': mapa = mapa || 'mapaEuropa';
            case 'AME': mapa = mapa || 'mapaAmerica';
                Moduls.app.Opcion = 'MARCADP' + page;
                Moduls.app.Path = 'INFCORP / MARCAS / MARCAAEA / MARCAAEADP';
                Moduls.getApp().getScript().page = mapa;
                Moduls.getAireuropacontent().load({ url: 'modulos/marcas/AirEuropa/destinos.html', script: true, class: 'Destinos' });
                break;
        }
        Moduls.app.PuntoPartida = 'Apps/Menu';
        registroOpciones(Moduls.app.Opcion)
    }

}