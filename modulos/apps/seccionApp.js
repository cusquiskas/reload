(function () {
    let clickAnterior = '';
    $('.enlaceMenu').click(function () {
        $('.enlaceMenu').each(function () {
            $(this).removeClass('submenuBorde');
        });
        if ($(this).children('article').text() != clickAnterior) {
            clickAnterior = $(this).children('article').text();
            $('.submenu').removeClass('dn');
            $(this).addClass('submenuBorde');
            $('.seccionAppIframe').addClass('dn');
            $('.submenu .cajita').each(function (i) {
                $('article', this).html(clickAnterior + '.' + i);
            });
        } else {
            $('.submenu').addClass('dn');
            clickAnterior = '';
            $('.seccionAppIframe').removeClass('dn');
        }
    });
    $('.returnBtn').click(function () {
        $('.divCajas').removeClass('dn');
        $('.seccionAppIframe').addClass('dn');
        $('.divTemplate').addClass('dn');
        $('.divTemplateModal').addClass('dn');
        $(this).parent().addClass('dn');
        accionMenu($('.accionMenu'));
    });
    altoPantalla();
})();

$(document).ready(function () {
    Moduls.app.child.modal.load({ url: 'modulos/comunes/modal.html', script: false });
    $('[data-toggle="tooltip"]').tooltip({
        template: '<div class="tooltip show"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
    });
    Moduls.app.Forms.carpetas.executeForm();
    comprobarWidth();

    $('.accionMenu').click(function () {
        accionMenu(this);
    });

    $('.menuNuevaFuncionalidad').removeClass('col-lg-1');
    $('.menuNuevaFuncionalidad').addClass('col-lg-2');
});

function accionMenu(context) {
    if ($(document).width() > 550) {
        $('.iconoMenu', context).toggleClass('rotar180');
        $(context).parent('ul').toggleClass('encogerMenu');
        $('ul.accionMenu ul', $(context).parent()).css('display', 'unset');
        $('.contenidoMostrado').animate({ maxWidth: '100%', width: '90%', flex: 1 });
    } else {
        $('.separacionLista').toggleClass('menuEncogidoMovil');
    }

    //escribir o ocultar text
    if (comparar($('#wordMenu').text(), 'ocultar') == true) {
        $('.menuNuevaFuncionalidad').removeClass('col-lg-2');
        $('.menuNuevaFuncionalidad').addClass('col-lg-1');
        borrarTexto('ocultar', 'mostrar');
        // NO TOCAR
        // 26/02/2019 - A este trigger estan subscritas funciones del portal (ej: datatables) para que reajusten su tamaño al del menú
        $(window).trigger('replegarmenu');
    } else {
        $('.menuNuevaFuncionalidad').removeClass('col-lg-1');
        $('.menuNuevaFuncionalidad').addClass('col-lg-2');
        borrarTexto('mostrar', 'ocultar');
        // NO TOCAR
        // 26/02/2019 - A este trigger estan subscritas funciones del portal (ej: datatables) para que reajusten su tamaño al del menú
        $(window).trigger('desplegarmenu');
    }
}

function altoPantalla() {
    console.log($(window).height() - ($('.navbar').outerHeight(true) + $('footer').outerHeight(true) + $('.seccionApp .row').outerHeight(true)));
    $('.seccionAppIframe').css('height', $(window).height() - ($('.navbar').outerHeight(true) + $('footer').outerHeight(true) + $('.seccionApp .row').outerHeight(true) + 10));
}

function carpetas(s, d, e) {
    let pathRecibido = '';
    if (Moduls.app.Path && Moduls.app.Path != '') {
        pathRecibido = Moduls.app.Path.split(' / ');
    }

    if (s && Moduls.app.Aplicaciones.length > 0) {
        let ul = document.getElementById('ulMenu');
        let divSeparacion = document.createElement('div');
        divSeparacion.setAttribute('class', 'separacionLista');
        for (let z = 0; z < Moduls.app.Aplicaciones.length; z++) {
            let li = document.createElement('li');
            let a = document.createElement('a');
            let div = document.createElement('div');
            let span1 = document.createElement('span');
            let img = document.createElement('img');
            let spanImg = document.createElement('span');
            a.setAttribute('class', 'textoLargo cabeceraMenu nav-lvl-1  ');
            a.setAttribute('href', '#');
            a.setAttribute('miPath', Moduls.app.Aplicaciones[z].des);
            div.setAttribute('class', 'cuerpoCabezaMenu textoLargo');
            span1.setAttribute('class', 'textoCabeza textoLargo');
            // span1.setAttribute('data-toggle', 'tooltip');
            span1.setAttribute('data-placement', 'top');
            // span1.setAttribute('title', Moduls.app.Aplicaciones[z].des);
            span1.setAttribute('href', '#');
            span1.setAttribute('id', Moduls.app.Aplicaciones[z].cod);
            span1.appendChild(document.createTextNode(Moduls.app.Aplicaciones[z].des));
            spanImg.setAttribute('class', 'sidebar-navigation-icon');
            img.setAttribute('src', 'res/img/icon-' + ponerIcono(Moduls.app.Aplicaciones[z].des) + '.png');
            spanImg.appendChild(img);
            div.appendChild(spanImg);
            div.appendChild(span1);
            a.appendChild(div);
            li.setAttribute('id', z);
            li.setAttribute('class', 'elementoMenu');
            li.appendChild(a);
            if (typeof Moduls.app.Aplicaciones[z].children !== 'undefined') {
                if (Moduls.app.Aplicaciones[z].hidden == true) {
                    li.setAttribute('class', 'dn');
                } else {
                    if (Moduls.app.Aplicaciones[z].children.length <= 0) {
                        a.setAttribute('class', 'textoLargo cabeceraMenu nav-lvl-1 panel-trigger vacio');
                    } else {
                        var hijosocultos = false;
                        var contadorocultos = 0;
                        for (let k = 0; k < Moduls.app.Aplicaciones[z].children.length; k++) {
                            if (Moduls.app.Aplicaciones[z].children[k].hidden == true) {
                                contadorocultos++;
                            }
                            if (contadorocultos == k + 1) {
                                hijosocultos = true;
                            }
                        }
                        if (hijosocultos) {
                            a.setAttribute('class', 'textoLargo cabeceraMenu nav-lvl-1 panel-trigger vacio');

                        } else {

                            a.setAttribute('class', 'textoLargo cabeceraMenu nav-lvl-1 panel-trigger');
                            nivelRecursivo = 1;
                            li.appendChild(recursividad({
                                hijos: Moduls.app.Aplicaciones[z].children,
                                padre: Moduls.app.Aplicaciones[z].des,
                                hidden: Moduls.app.Aplicaciones[z].hidden
                            }));
                        }
                    }
                }
                divSeparacion.appendChild(li);
            } else {
                divSeparacion.appendChild(li);
            }
        }

        ul.appendChild(divSeparacion);
        $('.menuAppIframe')[0].appendChild(ul);
        $('[data-toggle="tooltip"]').tooltip({
            template: '<div class="tooltip show"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
        });
        $('.menuNuevaFuncionalidad .cabeceraMenu').click(function (ev) {
            $('li.paraPlegar').css('display', 'block');
            $('.expandir.active').removeClass('active');
            e.form.set({ titulo: $(ev.currentTarget).attr('mipath') });
            if (Moduls.app.pathParaComparar && Moduls.app.pathParaComparar != $(ev.currentTarget).attr('mipath')) {
                mostrarTemplate('modulos/comunes/blanco.html', false);
            }
            Moduls.app.pathParaComparar = $(ev.currentTarget).attr('mipath');

            if ($(ev.currentTarget).children('div').children('span')[1].id == '00'
                || $(ev.currentTarget).children('div').children('span')[1].id == 'BENEF'
                || $(ev.currentTarget).children('div').children('span')[1].id == 'IN'
            ) {
                cargaOpciones($(ev.currentTarget).children('div').children('span')[1].id);
            }
            contadorHijo = 0;
            $('ul', $(this).parent()).css('display', 'none');
            $('a.hijoCabeceraMenu', $(this).parent().children('ul')).removeClass('hijoCabeceraMenu').css('background', 'unset');
            if ($(this).hasClass('desplegado')) {
                $(this).removeClass('desplegado  active');
                $(this).parent().children('ul').fadeOut('fast');
            } else {
                $('.menuNuevaFuncionalidad .cabeceraMenu').removeClass('desplegado  active');
                $(this).addClass('desplegado  active');
                $(this).parent().children('ul').fadeIn('slow');
            }
            $('.menuNuevaFuncionalidad .cabeceraMenu:not(.desplegado)').each(function () {
                $(this).parent().children('ul').fadeOut('fast');
            });
        });

        $('ul li ul li a').click(function (ev) {
            ev.preventDefault();
            e.form.set({ titulo: $(ev.currentTarget).attr('mipath') });
            if ($(this).hasClass('active') && ($(this).hasClass('expandir') || $(this).hasClass('asdf'))) {
                $(this).removeClass('active');
            } else {
                $(this).addClass('active');
            }
            if (typeof Moduls.app.Path == 'undefined') {
                $('.menuAppIframe .opcionSeleccionada').removeClass('opcionSeleccionada');
                if (!$(ev.currentTarget.parentNode).children('ul').length > 0) {
                    $(this).addClass('opcionSeleccionada');
                }
                cargaOpciones(ev.currentTarget.id);
            }
            if (typeof Moduls.app.PuntoPartida == 'undefined') {
                Moduls.app.PuntoPartida = 'Apps/Menu';
            }
            if ($(ev.currentTarget.parentNode).children('ul').length > 0) {
                if ($(ev.currentTarget.parentNode).children('ul').children().children('a').hasClass('hijoCabeceraMenu')) {
                    contadorHijo--;
                } else {
                    contadorHijo++;
                    $(ev.currentTarget.parentNode).children('ul').children().each(function () {
                        $(this).children('a').addClass('hijoCabeceraMenu');
                    });
                }
                $(ev.currentTarget.parentNode).children('ul').css('display') == 'none' ? ($(ev.currentTarget.parentNode).children('ul').css('display', 'block')) : ($(ev.currentTarget.parentNode).children('ul').css('display', 'none'));
            }
        });

        if (pathRecibido != '') {
            for (let iArray = 0; iArray < pathRecibido.length; iArray++) {
                if (iArray == 0) {
                    if ($('#' + pathRecibido[iArray], '.cuerpoCabezaMenu').parent().parent().length > 0) {
                        $('#' + pathRecibido[iArray], '.cuerpoCabezaMenu').parent().parent().trigger('click');
                    } else {
                        $('.cabezaMenu').removeClass('active');
                        $('li.paraPlegar').css('display', 'none');
                        Moduls.app.Path = undefined;
                    }
                } else if (iArray == pathRecibido.length - 1) {
                    $('#' + pathRecibido[iArray]).trigger('click');
                    $('#' + pathRecibido[iArray]).addClass('opcionSeleccionada');
                    cargaOpciones(pathRecibido[iArray]);
                } else {
                    $('#' + pathRecibido[iArray]).trigger('click');
                }
            }
        } else {
            $('.menuAppIframe .cuerpoCabezaMenu .textoCabeza').each(function () {
                if (this.getAttribute('id') == Moduls.app.SeleccionAplicaciones.cod) {
                    if (this.getAttribute('id') == '00' || this.getAttribute('id') == 'BENEF') {
                        cargaOpciones(this.getAttribute('id'));
                    }
                    mostrarTemplate('modulos/comunes/blanco.html', false);
                    $('#' + Moduls.app.SeleccionAplicaciones.cod, '.cuerpoCabezaMenu').parent().parent().trigger('click');
                }
            });
        }
    }
}

function recursividad(datoRecibido) {
    nivelRecursivo++;
    let ul = document.createElement('ul');
    for (let i = 0; i < datoRecibido.hijos.length; i++) {
        let li = document.createElement('li');
        let a = document.createElement('a');
        a.setAttribute('miPath', datoRecibido.padre + ' / ' + datoRecibido.hijos[i].des);
        a.setAttribute('class', 'textoLargo nav-lvl-' + nivelRecursivo);
        // a.setAttribute('data-toggle', 'tooltip');
        a.setAttribute('data-placement', 'top');
        // a.setAttribute('title', datoRecibido.hijos[i].des);
        a.setAttribute('href', '#');
        a.setAttribute('id', datoRecibido.hijos[i].cod);
        a.appendChild(document.createTextNode(datoRecibido.hijos[i].des));
        li.appendChild(a);
        li.setAttribute('class', 'paraPlegar');

        if (typeof datoRecibido.hijos[i].children !== 'undefined') {
            for (let j = 0; j < datoRecibido.hijos[i].children.length; j++) {
                if (datoRecibido.hijos[i].children[j].hidden == true) {
                    a.setAttribute('class', 'textoLargo nav-lvl-' + nivelRecursivo);
                } else {
                    a.setAttribute('class', 'expandir textoLargo nav-lvl-' + nivelRecursivo);
                    break;
                }
            }
            li.appendChild(recursividad({
                hijos: datoRecibido.hijos[i].children,
                padre: datoRecibido.padre + ' / ' + datoRecibido.hijos[i].des,
                hidden: datoRecibido.hijos[i].hidden
            }));
        }
        ul.appendChild(li);
        $('[data-toggle="tooltip"]').tooltip({
            template: '<div class="tooltip show"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
        });

        if (datoRecibido.hijos[i].hidden == true) {
            a.setAttribute('class', 'dn');
        }
    }

    nivelRecursivo--;
    return ul;
}

function cargaOpciones(cod) {
    let objeto = {};
    objeto['p_codmca'] = cod
    Moduls.app.Forms.cargaOpciones.set(objeto);
    Moduls.app.Forms.cargaOpciones.executeForm();
}

function eventoClickOpcion(objeto) {
    Moduls.app.Path = undefined;
    if (objeto.getAttribute) {
        if (!esInternetExplorer()) {
            if (objeto.getAttribute('codopc') == 'MISDATOS') {
                $('.divTemplate').addClass('row');
            } else {
                $('.divTemplate').removeClass('row');
            }
        }
        if (objeto.getAttribute('codopc') == '1313') {
            confirmaSesion('NOMINAS', objeto);
        } else {
            registroOpciones(objeto.getAttribute('codopc'));
            if ($(objeto).attr('up') === 'true') {
                ventanaNueva($(objeto).attr('url'));
            } else {
                if ($(objeto).attr('prp') === 'S') {
                    Moduls.app.botonVolver = true;
                    const args = $(objeto.parentElement.parentElement).data();
                    mostrarTemplate($(objeto).attr('url'), true, args);
                } else {
                    mostrarIFrame($(objeto).attr('url'));
                }
            }
        }
    }
}


function habilitarVisitaNominas() {
    registroOpciones(Moduls.app.Objeto.id);
    if ($(Moduls.app.Objeto).attr('up') === 'true') {
        ventanaNueva($(Moduls.app.Objeto).attr('url'));
    } else {
        if ($(Moduls.app.Objeto).attr('prp') === 'S') {
            Moduls.app.botonVolver = true;
            mostrarTemplate($(Moduls.app.Objeto).attr('url'));
        } else {
            mostrarIFrame($(Moduls.app.Objeto).attr('url'));
        }
    }

    Moduls.app.HabilitarVista = '';
}

function callbackCargaOpciones(s, d, e) {
    if (s) {
        if (d.root.children.length > 0) {
            $('.divCajas').removeClass('dn');
            $('.seccionAppIframe').addClass('dn');
            $('.divTemplate').addClass('dn');
            $('.totalCajas').html('');
            let cuerpo = Moduls.app.return('modulos/comunes/comunes.html?nuevaCajaApp'),
                json = d.root.children;
            for (let c = 0; c < json.length; c++) {
                json[c].favsel = (json[c].favsel == 'S' ? 'estrellaactivo' : 'estrellanoactivo');
                if (!json[c]['desbtn']) {
                    json[c]['desbtn'] = '« Otro';
                } else {
                    json[c]['desbtn'] = '« ' + json[c]['desbtn'];
                }
                if (!json[c].icomopInt) json[c].icomopInt = 'default.png';
                let HTML = $.parseHTML(cuerpo.reemplazaMostachos(json[c]));
                if(json[c].params) {
                    let formadJson = json[c].params.replace(/["'"]/gi,'"');
                    formadJson = JSON.parse(formadJson);
                    $(HTML).data(formadJson); 
                };
                $('.totalCajas').append(HTML);
            }
            $('.nuevaCajaApp button[url=""]').addClass('dn');
            controlFondo();
            anadirEventoFavoritos();
        } else {
            mostrarTemplate('modulos/comunes/blanco.html', false);
        }
    } else {
        toast({ tipo: 'error', msg: resuelveError(d) });
    }

    $('.nuevaCajaApp button').click(function () {
        accionMenu($('.accionMenu'));
        eventoClickOpcion(this);
    });

    // Nos colocamos en el objeto y simulamos el click, porque sacando la funcion fuera no funciona
    if (typeof Moduls.app.Path != 'undefined' && Moduls.app.Path != '') {
        // 14293 - 07.05.2019 - ¡No hay que usar ID! si coincide un ID de carpeta con un ID de opción de menú... MUERTE!!
        //let objeto = $('#' + Moduls.app.Opcion);//.parent().children(3).children(0);
        //if (objeto.length == 0) {
        let objeto = $('[codopc=' + Moduls.app.Opcion + ']');
        if (objeto.length > 1) objeto = objeto[objeto.length - 1];
        else objeto = objeto[0];
        //} else {
        //    objeto = objeto[0];
        //}
        if (typeof objeto !== 'undefined') {
            accionMenu($('.accionMenu'));
            eventoClickOpcion(objeto);
        }
    }
    $('[data-toggle="tooltip"]').tooltip({
        template: '<div class="tooltip show"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
    });
}

function ventanaNueva(url) {
    $('.returnBtn').parent().addClass('dn');
    window.open(url, '_blank');
    // mostrarTemplate('modulos/comunes/blanco.html', false);
    controlFondo(url);
}

function mostrarIFrame(url) {
    $('.divCajas').addClass('dn');
    $('.seccionAppIframe').removeClass('dn');
    $('.divTemplate').addClass('dn');
    $('.returnBtn').parent().removeClass('dn');
    window['applicationFrame'].abrirApl(url, 0, 1);
    controlFondo(url);
}

function mostrarTemplate(url, src, args) {
    if (Moduls.app.botonVolver && Moduls.app.botonVolver == true) {
        $('.returnBtn').parent().removeClass('dn');
        Moduls.app.botonVolver = false;
    }
    $('.divCajas').addClass('dn');
    $('.seccionAppIframe').addClass('dn');
    $('.divTemplate').removeClass('dn');
    Moduls.app.child.templateAplicacion.load({ url: url, script: (src !== false), args: (args ? args : false)});
    controlFondo(url);
}

function controlFondo(url) {
    (url === 'modulos/comunes/blanco.html') ? $('.divTemplate').parent().addClass('fondoBlanco') : $('.divTemplate').parent().removeClass('fondoBlanco');
};

function anadirEventoFavoritos() {
    $('.estrella').click(function (event) {
        let id = $(event.target).attr('id').replace('EST', '');
        let activarFavorito = $(event.target).hasClass('estrellanoactivo')
        Moduls.app.Forms.guardarFavorito.set({
            p_codmop: id,
            p_flag: (activarFavorito ? 'I' : 'D')
        });
        Moduls.app.Forms.guardarFavorito.executeForm();
    });
}

function guardarFavorito(s, d, e) {
    if (s) {
        let params = e.form.modul.Forms.guardarFavorito.parametros;
        activarFavoritoIU(
            params.p_codmop.value,
            (params.p_flag.value == 'I'));
    } else
        toast({ tipo: 'error', msg: resuelveError(d) });
}

function activarFavoritoIU(codmop, estado) {
    let fav = $('#EST' + codmop);
    if (fav) {
        //estado 'true': activar el favorito al usuario
        //estado 'false': quitar el favorito al usuario
        fav.removeClass((estado ? 'estrellanoactivo' : 'estrellaactivo'));
        fav.addClass((estado ? 'estrellaactivo' : 'estrellanoactivo'));
    }
}

function escribirTexto(palabra) {
    let timer;
    let word = palabra.split("");
    var bucle = function () {
        if (word.length > 0) {
            try {
                document.getElementById('wordMenu').innerHTML += word.shift();
            } catch (e) {

            }
        } else {
            $('.barraMenu.escribir').fadeOut();
            return false;
        }
        ;
        timer = setTimeout(bucle, 100);
    };
    bucle();
};

function borrarTexto(palabra, escribir) {
    let i = 0;
    let timer;
    let word = palabra.split("");
    $('.barraMenu.escribir').fadeIn();
    var bucle = function () {
        if (word.length > 0) {
            word.pop();
            try {
                document.getElementById('wordMenu').innerHTML = word.join("");
            } catch (e) {

            }
        } else {
            if (word.length > (i + 1)) {
                i++;
            } else {
                i = 0;
            }
            ;
            escribirTexto(escribir);
            return false;
        }
        ;
        timer = setTimeout(bucle, 100);
    };
    bucle();
};

function comparar(container, value) {
    var returnValue = false;
    var pos = container.indexOf(value);
    if (pos >= 0) {
        returnValue = true;
    }
    return returnValue;
}