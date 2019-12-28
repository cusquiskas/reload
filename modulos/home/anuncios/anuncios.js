

$('.tablonAnuncios').click(function () {
    Moduls.app.load({ url: 'modulos/tablonAnuncios/tablonAnuncios.html', script: true });
});

function anunciosHome(s, d, e) {
    if (s) {
        $('#listadoTabAnunciosHome').empty();
        let cadena = e.form.modul.return('modulos/comunes/tabla.html?tablonAnunciosHome'),
            json = d.root.anuncios,
            contImagen = 0;

        for (let i = 0; i < json.length; i++) {
            // XX584 - 30.05.2018
            // se quitan las imágenes de la home
            // contImagen += (json[i].ficadj) ? 1 : 0.5;
            contImagen += 0.5;
            // ---------
            json[i].imgOrigen = ((json[i].imgOrigen) ? json[i].imgOrigen : (json[i].ficadj ? '/newintra/doc/anuncios/' + json[i].ficadj : null));
            if (contImagen <= 3) {
                // Se comprueba si se tiene que mostrar imagen o fichero.
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
                // Se prepara el JSON para reemplazar las variables
                json[i].ficrep = 'src="' + json[i].imgOrigen + '"';
                json[i].borrar = (json[i].propietario) ? '' : 'elementoBorrar';
                json[i].mostrarLeer = (json[i].propietario) ? 'elementoBorrar' : '';
                let HTML = $.parseHTML(cadena.reemplazaMostachos(json[i]));

                // Se indica la modal a abrir para ver los datos del anuncio
                $(HTML[0].getElementsByClassName('verAnuncio')).each(function () {
                    this.addEventListener('click', function () {
                        let urlModal;
                        if ((!json[i].ficadj) || (json[i].ficadj && json[i].ficadj.indexOf("pdf") > -1)) {
                            urlModal = 'modulos/comunes/comunes.html?modalAnuncioSinImagen';
                        } else {
                            urlModal = 'modulos/comunes/comunes.html?modalAnuncio';
                        }
                        e.form.modul.padre.anuncioSelect = json[i];
                        e.form.modul.padre.child.modal.child.modalBody.load({ url: urlModal, script: false });
                        construirModal({ title: json[i].titdoc, canceltext: 'Cerrar', w: '700px' });
                    });
                });
                $('#listadoTabAnunciosHome').append(HTML);

                /*
                let imagen = HTML[0].getElementsByTagName('img')[0];
                imagen.addEventListener('load', function () {
                    if (this.width > this.height) {
                        this.className = 'imagenesHomeAnunciosWidth';
                    } else {
                        this.className = 'imagenesHomeAnunciosHeight';
                    }
                });
                */

                // Se eliminan los elementos con dicha clase.
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
                // Se indica la pantalla a abrir para editar los datos del anuncio
                if (HTML[0].getElementsByClassName('editAnuncio')[0]) {
                    HTML[0].getElementsByClassName('editAnuncio')[0].addEventListener('click', function () {
                        e.form.modul.padre.anuncioSelect = json[i];
                        Moduls.app.load({ url: 'modulos/tablonAnuncios/crearAnuncio.html', script: true });
                    });
                }
                // Se realiza la llamada al negocio para eliminar el anuncio
                if (HTML[0].getElementsByClassName('removeAnuncio')[0]) {
                    HTML[0].getElementsByClassName('removeAnuncio')[0].addEventListener('click', function () {
                        e.form.modul.Forms.eliminarAnunciosHome.set({ p_seqdoc: json[i].seqdoc });
                        e.form.modul.Forms.eliminarAnunciosHome.executeForm();
                    });
                }
            }
        }
    } else {
        toast({ tipo: 'error', msg: resuelveError(d) });
    }
}

function eliminarAnunciosHome(s, d, e) {
    if (s) {
        toast({ tipo: 'success', msg: 'El anuncio se ha eliminado correctamente' });
        e.form.modul.Forms.anunciosHome.executeForm();
    } else {
        toast({ tipo: 'error', msg: resuelveError(d) });
    }
}

function datosAnuncio(s, d, e) {
    e.form.set(e.form.modul.padre.padre.anuncioSelect);
    prepareImgFicAnuncio(e.form.modul.padre.padre.anuncioSelect.imgOrigen, e.form.modul.template.getElementsByTagName('img')[0], e.form.modul.template.getElementsByTagName('a')[0]);
    delete (e.form.modul.padre.padre.anuncioSelect);
}

function prepareImgFicAnuncio(imgOrigen, tagimg, tagFic) {
    if (imgOrigen != null) {
        let extension = imgOrigen.substr(imgOrigen.lastIndexOf('.'));
        if ($.inArray(extension.toUpperCase(), ['.GIF', '.JPG', '.BMP', '.JPEG', '.PNG']) === -1) {
            var node = document.getElementsByClassName('imagenesModalAnuncios')[0];
            node.parentNode.removeChild(node);
            // tagimg.remove();
            tagFic.href = imgOrigen;
        } else {
            var nodePDF = document.getElementsByClassName('imgPdf')[0];
            nodePDF.parentNode.removeChild(nodePDF);
            // tagFic.remove();
            tagimg.src = imgOrigen;
        }
    } else {
        var nodeTagImg = document.getElementsByClassName('imagenesModalAnuncios')[0];
        nodeTagImg.parentNode.removeChild(nodeTagImg);
        var nodePDF = document.getElementsByClassName('imgPdf')[0];
        nodePDF.parentNode.removeChild(nodePDF);
        // tagimg.remove();
        // tagFic.remove();
    }
}