$(".tabla").click(function (event) {
    let fav = $(event.target);
    while (fav[0].className.indexOf('col') == -1) fav = fav.children();
    if (fav.attr('id') != '') {
        //activarFavorito 'true': activar el favorito al usuario
        //activarFavorito 'false': quitar el favorito al usuario
        let activarFavorito = fav.hasClass('noactivo');
        if (activarFavorito) {
            //Validar el limite de 7 favoritos activo por usuario
            if (obtenerNumeroFavoritosActivos() >= 7) {
                toast({ tipo: 'error', msg: 'No puede activarse más de 7 aplicaciones favoritas.', donde: '.modal-header' });
                return;
            }
        }
        //Aplicar el cambio
        Moduls.app.child.modal.child.modalBody.Forms.guardarFavorito.set({ p_codmop: fav.attr('id'), p_flag: (activarFavorito ? 'I' : 'D') });
        Moduls.app.child.modal.child.modalBody.Forms.guardarFavorito.executeForm();
    }
});

function listaGestionFavoritos(s, d, e) {
    if (s) {
        let contenedor = $('.tablaGestionFavoritos'),
            cadena = e.form.modul.return('modulos/comunes/tabla.html?tablaGestionFavoritos'),
            json = d.root.opcionesMenu, reg;
        //Cargar el listado con todos los favoritos disponibles para el usuario
        contenedor.empty();
        for (let i = 0; i < json.length; i++) {
            //if (json[i]._qlink == 'S') {
            json[i].favsel = (json[i].favsel == 'S' ? 'activo' : 'noactivo');
            reg = cadena.reemplazaMostachos(json[i]);
            contenedor.append($.parseHTML(reg));
            //}
        }
        mostrarTotalFavoritosSelec();
    } else {
        toast({ tipo: 'error', msg: resuelveError(d), donde: '.modal-header' });
    }
}

function guardarFavorito(s, d, e) {
    if (s) {
        let codmop = e.form.modul.Forms.guardarFavorito.parametros.p_codmop.value,
            estado = (e.form.modul.Forms.guardarFavorito.parametros.p_flag.value == 'I');
        activarFavoritoIU(codmop, estado);
        mostrarTotalFavoritosSelec();
    }
    else
        toast({ tipo: 'error', msg: resuelveError(d), donde: '.modal-header' });
}

function activarFavoritoIU(codmop, estado) {
    let fav = $('#' + codmop);
    if (fav) {
        //estado 'true': activar el favorito al usuario
        //estado 'false': quitar el favorito al usuario
        fav.removeClass((estado ? 'noactivo' : 'activo'));
        fav.addClass((estado ? 'activo' : 'noactivo'));
    }
}

function obtenerNumeroFavoritosActivos() {
    let favs = $('.tabla .col'),
        cont = 0;
    for (let i = 0; i < favs.length; i++) {
        if (favs[i].className.indexOf('noactivo') == -1) {
            cont++;
        }
    }
    return cont;
}

function mostrarTotalFavoritosSelec() {
    $('.numFavoritosSeleccionados').text(obtenerNumeroFavoritosActivos());
}