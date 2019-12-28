$(".favourite-list").click(function (event) {
    let fav = $(event.target);
    //Seleccionar el objeto LI
    while (fav[0].tagName != 'LI') fav = fav.parent();
    //Abrir el enlace seleccionado 
    abrirEnlace(fav);
});

function abrirEnlace(fav) {
    let url = fav.attr('url');
    if (typeof (url) == 'string' && url.length > 0) {
        //Abrir en popup
        Moduls.app.PuntoPartida = 'Home/Favoritos';
        if (fav.attr('popup') == 'S') {
            registroOpciones(fav.attr('codmop'));
            window.open(url);
        }
        else {
            Moduls.app.Opcion = fav.attr('codmop');
            Moduls.app.Path = fav.attr('path');
            Moduls.app.load({ url: 'modulos/apps/seccionApp.html', script: true });
        }
    }
}

function listaFavoritosHome(s, d, e) {
    if (s) {
        let contenedor = $('.favourite-list'),
            cadena = e.form.modul.return('modulos/comunes/tabla.html?tablaFavoritosHome'),
            json = d.root.opcionesMenu, reg, selec = 0;
        contenedor.empty();
        cadena = cadena.substring(cadena.indexOf('<li'))
        cadena = cadena.substring(0, cadena.indexOf('</li>') + 5);
        for (let i = 0; i < json.length; i++) {
            if (json[i].favsel == 'S') {
                reg = cadena.reemplazaMostachos(json[i]);
                contenedor.append($.parseHTML(reg));
                selec++;
            }
        }
        //Rellenar hasta 7 con favoritos vacios
        for (let i = selec; i < 7; i++) {
            reg = cadena.reemplazaMostachos({ nombre: 'Vacío', direcc: '', estrella: "estrellaSinIluminar" });
            contenedor.append($.parseHTML(reg));
        }

    } else {
        toast({ tipo: 'error', msg: resuelveError(d), donde: '.modal-header' });
    }
}

$(".btnCambiarFavoritos").click(function (event) {
    Moduls.app.child.modal.child.modalBody.load({ url: 'modulos/home/favoritos/gestionfavoritos.html', script: true });
    construirModal({
        title: 'Gestiona tus Favoritos',
        oktext: 'Aceptar',
        w: 700, h: 900, ocultarXCerrar: true,
        okfunction: function () {
            Moduls.app.child.cajaFavoritos.Forms.listaFavoritosHome.executeForm();
            cerrarModalIE($('#myModal'));
        }
    });
});

$('#clickEnlaceSalud').click(function () {
    window.open('https://comunicacioninterna.globalia.com/tag/salud/');
});

$('#menuPozuelo').click(function () {
    window.open('https://comunicacioninterna.globalia.com/menu-sede/pozuelo/');
});

$('#menuLlucmajor').click(function () {
    window.open('https://comunicacioninterna.globalia.com/menu-sede/llucmajor/');
});
