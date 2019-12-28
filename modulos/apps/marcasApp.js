var marcasApp = class {


    constructor(modulo) {
        let me = this;

        me.cargaMarcas();

        $('.volver-marcas').click(function () {
            me.cargaMarcas();
        });

        $('.link-volver-marcas').click(function () {
            if ($(document).width() < 769) {
                me.cargaMarcas();
            }
        });
    }

    cargaMarcas () {
        Moduls.getMarcacontent().load({ url: 'modulos/marcas/marcas.html', script: true, class:'marcasHome' });
    }

    conmutaTexto() {
        $('.voyvengo').toggleClass('dn');
    }

}



