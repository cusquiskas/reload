$('.tablonBuscarKeyUp').keyup(function (key) {
    if (key.keyCode == 13) {
        let aqui = dondeEstoy(this)
        if (aqui !== undefined) {
            if (aqui.parametros.p_titdoc.value != aqui.parametros.p_titdoc.object.value) {
                aqui.set({ p_titdoc: aqui.parametros.p_titdoc.object.value });
            }
            aqui.executeForm();
        }
    }
});

$(document).ready(function () {
    Moduls.app.child.modal.load({ url: 'modulos/comunes/modal.html', script: false });

    Moduls.app.child.cajaBanners2.load({
        url: 'modulos/home/banners/banners.html',
        script: true
    });

    Moduls.app.child.cajaPreFooter2.load({
        url: 'modulos/home/pre-footer/pre-footer.html',
        script: true
    });

    $('.crearAnuncio').click(function () {
        Moduls.app.load({
            url: 'modulos/tablonAnuncios/crearAnuncio.html',
            script: true
        });
    });
    $('.discard').click(function () {
        $('.modalFoto').fadeOut();
        $('body').css('overflow', 'auto');
    });
    $('[data-toggle="tooltip"]').tooltip({
        template: '<div class="tooltip show"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
    });
});

function tablonAnunciosBusc(s, d, e) {
    if (s) {
        $('#listadoTabAnuncios').empty();
        $('.pagination').empty();
        let json = d.root.anuncios;

        // Calcula número de páginas para la paginación
        let numPagi = Math.ceil(json.length / 15);
        let paginacion = '';
        for (let i = numPagi; i > 0; i--) {
            paginacion = (i == numPagi) ? '<a class="pagina" href="#">' + i + '</a>' + paginacion : '<a class="pagina" href="#">' + i + '</a> · ' + paginacion;
        }
        $('.pagination').append(paginacion);
        $('.pagina').first().addClass('paginaSelect');
        $('.pagina').click(function () {
            $('.pagina').removeClass('paginaSelect');
            $(this).addClass('paginaSelect');
            let pagina = parseInt(this.text);
            mostrarAnuncios(e, json, (pagina - 1) * 15, pagina * 15 - 1);
        });

        mostrarAnuncios(e, json, 0, 14);
    } else {
        toast({ tipo: 'error', msg: resuelveError(d) });
    }
}

function mostrarAnuncios(e, json, valueI, maxUsers) {
    let cadena = e.form.modul.return('modulos/comunes/tabla.html?tablonAnunciosList');
    $('#listadoTabAnuncios').empty();
    for (let i = valueI; i <= maxUsers && i < json.length; i++) {
        json[i].imgOrigen = ((json[i].imgOrigen) ? json[i].imgOrigen : (json[i].ficadj ? '/newintra/doc/anuncios/' + json[i].ficadj : null));
        if (json[i].imgOrigen) {
            let extension = json[i].imgOrigen.substr(json[i].imgOrigen.lastIndexOf('.'));
            if ($.inArray(extension.toUpperCase(), ['.GIF', '.JPG', '.BMP', '.JPEG', '.PNG']) === -1) {
                json[i].esImagen = 'elementoBorrar';
                json[i].esFichero = '';
            } else {
                json[i].esFichero = 'elementoBorrar';
                json[i].esImagen = '';
            }
        } else {
            json[i].esFichero = 'elementoBorrar';
            json[i].esImagen = 'elementoBorrar';
        }

        json[i].ficrep = 'src="' + json[i].imgOrigen + '"';
        json[i].borrar = (json[i].propietario) ? '' : 'elementoBorrar';
        json[i].mostrarLeer = (json[i].propietario) ? 'elementoBorrar' : '';
        let HTML = $.parseHTML(cadena.reemplazaMostachos(json[i]));
        // let aImagenPDF = HTML[0].getElementsByClassName('aImagenPdf')[0];

        $(HTML[0].getElementsByClassName('verAnuncio')).each(function () {
            this.addEventListener('click', function () {
                let urlModal;
                if ((!json[i].ficadj) || (json[i].ficadj && json[i].ficadj.indexOf("pdf") > -1)) {
                    urlModal = 'modulos/comunes/comunes.html?modalAnuncioSinImagen';
                } else {
                    urlModal = 'modulos/comunes/comunes.html?modalAnuncio';
                }
                e.form.modul.anuncioSelect = json[i];
                e.form.modul.child.modal.child.modalBody.load({ url: urlModal, script: false });
                construirModal({ title: json[i].titdoc, canceltext: 'Cerrar', w: '700px' });
            });
        });
        $('#listadoTabAnuncios').append(HTML);

        let imagen = HTML[0].getElementsByTagName('img')[0];
        imagen.addEventListener('load', function () {
            if (this.width > this.height) {
                this.className = 'imagenesHomeAnunciosWidth';
            } else {
                this.className = 'imagenesHomeAnunciosHeight';
            }
        });

        $('.imgPdf').css("width", "22rem");

        // Se eliminan los iconos de editar y eliminar anuncio.
        $('.elementoBorrar').remove();
        // Abrir imagen en grande

        if (HTML[0].getElementsByTagName('img')[0]) {
            HTML[0].getElementsByTagName('img')[0].addEventListener('click', function (src) {
                $('.modalFoto').fadeIn();
                $('body').css('overflow', 'hidden');
                $('.modalFoto img').attr('src', $(src.currentTarget).attr('src'));
                $('.modalFoto img').css('margin-top', -$('.modalFoto img').height() / 2);
                $('.modalFoto img').css('margin-left', -$('.modalFoto img').width() / 2);
                $('.modalFoto').parent().css('max-width', 'initial');
            });
        }

        if (HTML[0].getElementsByTagName('img')[0]) {
            HTML[0].getElementsByTagName('img')[0].addEventListener('click', function (src) {
                $('.modalFoto').fadeIn();
                $('body').css('overflow', 'hidden');
                $('.modalFoto img').attr('src', $(src.currentTarget).attr('src'));
                $('.modalFoto img').css('margin-top', -$('.modalFoto img').height() / 2);
                $('.modalFoto img').css('margin-left', -$('.modalFoto img').width() / 2);
            });
        }
        if (HTML[0].getElementsByClassName('editAnuncio')[0]) {
            HTML[0].getElementsByClassName('editAnuncio')[0].addEventListener('click', function () {
                e.form.modul.anuncioSelect = json[i];
                Moduls.app.load({ url: 'modulos/tablonAnuncios/crearAnuncio.html', script: true });
            });
        }
        // Se realiza la llamada al negocio para eliminar el anuncio
        if (HTML[0].getElementsByClassName('removeAnuncio')[0]) {
            HTML[0].getElementsByClassName('removeAnuncio')[0].addEventListener('click', function () {
                e.form.modul.Forms.eliminarAnuncios.set({ p_seqdoc: json[i].seqdoc });
                e.form.modul.Forms.eliminarAnuncios.executeForm();
            });
        }
    }
}

function eliminarAnuncios(s, d, e) {
    if (s) {
        toast({ tipo: 'success', msg: 'El anuncio se ha eliminado correctamente' });
        e.form.modul.Forms.tablonAnunciosBusc.executeForm();
    } else {
        toast({ tipo: 'error', msg: resuelveError(d) });
    }
}