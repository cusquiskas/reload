
$(function() {
    //iniciar Carousel automaticamente, comprobar si es IE
    if (esInternetExplorer() || esFirefox()) {
        $('.carousel-indicators li').click(function () {
            $('.carousel-indicators li').removeClass('active');
            $('.carousel-item').removeClass('active');
            $(this).addClass('active');
            $($('.carousel-item')[$($(this)).attr('data-slide-to')]).addClass('active');
        });
    } else {
            $('.carousel').carousel({ interval: 5000 });
    }
});

function cargarOfertas(s, d, e) {
    if (s) {
        if (Moduls.app.Ofertas && Moduls.app.Ofertas.length > 0) {
            let cadenaOfeActiva = e.form.modul.return('modulos/comunes/tabla.html?ofertasActiva');
            let cadenaOferta = e.form.modul.return('modulos/comunes/tabla.html?ofertas');
            for (let i = 0; i < Moduls.app.Ofertas.length; i++) {
                Moduls.app.Ofertas[i].imgnot = 'src="' + Moduls.app.Ofertas[i].imgnot + '"';
                let HTML;
                if (i == 0) {
                    HTML = $.parseHTML(cadenaOfeActiva.reemplazaMostachos(Moduls.app.Ofertas[i]));
                } else {
                    HTML = $.parseHTML(cadenaOferta.reemplazaMostachos(Moduls.app.Ofertas[i]));
                }
                let imagen = HTML[0].getElementsByTagName('img')[0];

                $('#listadoOfertas').append(HTML);

                imagen.addEventListener('load', function () {
                    if (this.width <= this.height || this.width - this.height <= 100) {
                        this.className = 'd-block w-100 imagenesHomeOfertasHeight';
                    } else {
                        this.className = 'd-block w-100 imagenesHomeOfertasWidth';
                    }
                });
            }
        } else {
            e.form.modul.template.className = 'dn';
        }
        if (Moduls.app.Ofertas.Url) {
            if ($(".btnTodasOfertas")) $(".btnTodasOfertas").attr("href", Moduls.app.Ofertas.Url);
        }
    } else {
        toast({ tipo: 'error', msg: resuelveError(d) });
    }
}