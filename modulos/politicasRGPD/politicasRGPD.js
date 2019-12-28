$(document).ready(function () {
    $('#inputCodigoPolitica').bind('change', function () {
        redimensionar();
    });

    $('#myModalPoliticasRGPD #botonMasTarde').click(function () {
        invocaAjax({
            direccion: '/management/mvc-management/controller/portal.xwi_rgpd.aplazar_aceptacion.json',
            method: 'POST',
            contentType: 'application/json',
            parametros: {
                p_codpol: dondeEstoy(this).parametros.p_codpol.value,
                p_vesion: dondeEstoy(this).parametros.p_vesion.value
            },
            retorno: function (s, d, e) {
                if (s) {
                    cerrarModalIE($('#myModalPoliticasRGPD'));
                    Moduls.app.child.modal.child.modalBody.load({
                        url: 'modulos/comunes/comunes.html?infoMasTardePoliticaRGPD',
                        script: false
                    });
                    construirModal({
                        title: 'Aviso',
                        w: '900px',
                        oktext: "Aceptar",
                        okfunction: function () {
                            cerrarModalIE($('#myModal'));
                            $('body').css('overflow', 'auto');
                        }
                    });
                } else {
                    validaErroresCbk(d);
                }
            }
        });
    });
});

$('.contenidoPoliticaRGPD').scroll(function () {
    let heightCampoTexto = $(".cuerpoPoliticaRGPD").height();
    let posicionScroll = $(".contenidoPoliticaRGPD").scrollTop();
    $('#botonAceptarSeguir, #botonMasTarde').attr("disabled", posicionScroll + 300 < heightCampoTexto);
});

function aceptarPoliticasRGPD(s, d, e) {
    if (s) {
        let $myModal = $('#myModalPoliticasRGPD');
        cerrarModalIE($myModal);
        $('body').css('overflow', 'auto');
        Moduls.header.user.politicasRGPD = false;
        controlCargaModales();
    } else {
        toast({ tipo: 'error', msg: resuelveError(d), donde: '#contenedorModalPoliticas' });
    }
}

function mostrarPoliticaRGPD(s, d, e) {
    if (s) {
        let objeto = {};
        if (d.root.pol.length > 0) {
            let politica = d.root.pol[d.root.pol.length - 1];
            let $myModal = $('#myModalPoliticasRGPD');
            if (esInternetExplorer()) {
                $myModal.removeClass('fade');
                $('.modal-overlay').show();
                $myModal.show();
            } else {
                $myModal.modal('show');
                $('body').css('overflow', 'hidden');
            }
            objeto['p_codpol'] = politica.codpol;
            objeto['p_vesion'] = politica.con[0].version;
            $('#tituloPoliticaRGPD').html(politica.nomlar);
            $('#entradillaPoliticaRGPD').html(politica.con[0].entrad.cambia('\n', '<br>'));
            Moduls.app.Contenido = politica.con[0].txhtml;
            $('.cuerpoPoliticaRGPD').html(politica.con[0].txhtml);
            $('#botonMasTarde').toggleClass('dn', politica.con[0].fecmtr ? true : false);
            e.form.modul.Forms.aceptarPoliticasRGPD.set(objeto);
        }
        if ($(".contenidoPoliticaRGPD").scrollTop() +300 < $(".cuerpoPoliticaRGPD").height()) {
            $('#botonAceptarSeguir, #botonMasTarde').attr("disabled", false);
        }
    } else {
        toast({ tipo: 'error', msg: resuelveError(d) });
    }
}

function redimensionar() {
    if (Moduls.app.Contenido.length > 2000) {
        $('#botonAceptarSeguir, #botonMasTarde').attr("disabled", true);
    }
}