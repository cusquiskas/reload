var Destinos = class {
    constructor(modulo) {
        var me = this;
        me.abreMapa(Moduls.getApp().getScript().page);
    }

    abreMapa (mapa) {
        $('.main-navigation-section').addClass('dn');
        $('.'+mapa).removeClass('dn');
    }
}