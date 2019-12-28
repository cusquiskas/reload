
$('.navbar-toggler').click(function () {
    // if (esInternetExplorer()) $('#navbarSupportedContent22').toggleClass('show');
    $('.animated-icon4').toggleClass('open');
    $('.modal-overlay').css('display') == 'none' ? ($('.modal-overlay').css("display", "block")) : ($('.modal-overlay').css("display", "none"));

    // Para hacer posible conmutacion entre Menu y Buscador
    $('.cajaBuscador').css('display', 'none');
    $('#listaBusquedaOpcionesMenu').empty();
    $('.clickFueraBuscador').addClass('dn');
    $("#search-input").val('');
});

$('.modal-overlay').click(function () {
    modal();
});

//perfilEmpleado
$('.linkUserNavbar').click(function () {
    Moduls.app.Opcion = 'MISDATOS';
    Moduls.app.Path = '00';
    Moduls.app.PuntoPartida = 'Header/LinkUser';
    Moduls.app.load({ url: 'modulos/apps/seccionApp.html', script: true });
});

// logo header
$('.logoNavbar:not(.logo-header)').click(function () {
    Moduls.header.Forms.datosSesion.executeForm();
    if ($('.animated-icon4').hasClass('open')) {
        $('.animated-icon4').toggleClass('open');
        $('.modal-overlay').css("display", "none");
        if ($('#navbarSupportedContent22').hasClass('show'))
            $('#navbarSupportedContent22').removeClass('show');
    }
});

$('.seccionApp .cerrarSeccionApp').click(function () {
    $('.aplicaciones').removeClass('dn');
    $('.seccionApp').addClass('dn');
});

$('.search-button').click(function () {
    $(this).parent().addClass("btnActiveSearchHeader");
    $(".search-close-button").addClass("btnCerrarActiveSearchHeader");
    $("#search-input").addClass('buscadorEsparcioCerrar');
    $("#search-inputMenu").addClass('buscadorEsparcioCerrar');
});

$('.buscarPC').click(function () {
    $('.cajaBuscador').fadeIn();
    Moduls.header.Forms.busquedaOpcionesMenu.parametros.p_nombre.object.focus();

    // Para hacer posible conmutacion entre Menu y Buscador
    if ($('#navbarSupportedContent22').hasClass('show'))
        $('#navbarSupportedContent22').removeClass('show');
    if ($('.animated-icon4').hasClass('open'))
        $('.animated-icon4').removeClass('open');
    if ($('.modal-overlay').css('display') != 'none')
        $('.modal-overlay').css("display", "none")
});

$('.buscarPCResponsive').click(function () {
    $('.cajaBuscador').fadeIn();
    Moduls.header.Forms.busquedaOpcionesMenuResponsive.parametros.p_nombre.object.focus();

    // Para hacer posible conmutacion entre Menu y Buscador

});

$('.cerrarPC').click(function () {
    $('.cajaBuscador').fadeOut();
    $('#listaBusquedaOpcionesMenu').empty();
    $('.clickFueraBuscador').addClass('dn');
    $("#search-input").val('');
});

$('.cerrarPCResponsive').click(function () {
    $('#listaBusquedaOpcionesMenuResponsive').empty();
    $('.clickFueraBuscador').addClass('dn');
    $("#search-inputMenu").val('');
});

$(".search-close-button").click(function () {
    $(this).parent().removeClass("btnActiveSearchHeader");
    $(".search-close-button").removeClass("btnCerrarActiveSearchHeader");
    $("#search-input").removeClass('buscadorEsparcioCerrar');
    $("#search-inputMenu").removeClass('buscadorEsparcioCerrar');
    $('#listaBusquedaOpcionesMenu').empty();
    $('.clickFueraBuscador').addClass('dn');
    $("#search-input").val('');
});

$('.btnSalirPortal').click(function () {
    let objeto = {};
    if (localStorage.getItem("SESION_ID") != "") {
        objeto['p_oldses'] = localStorage.getItem("SESION_ID");
    } else {
        objeto['p_oldses'] = sessionStorage.getItem("SESION_ID");
    }
    Moduls.header.Forms.cerrarSesion.set(objeto);
    Moduls.header.Forms.cerrarSesion.executeForm();
});

$('.btnRecordatorio').click(function () {
    Moduls.app.Opcion = 'LSTRECORD';
    Moduls.app.Path = '00';
    Moduls.app.PuntoPartida = 'Home/AccesoDirecto';
    Moduls.app.load({ url: 'modulos/apps/seccionApp.html', script: true });
});

$('.registroHorarioBtn').click(() => {
    Moduls.app.Opcion = 'HORARIOAPP';
    Moduls.app.Path = 'IN / REGHOR';
    Moduls.app.PuntoPartida = 'Home/AccesoDirecto';
    Moduls.app.load({ url: 'modulos/apps/seccionApp.html', script: true });
});



function datosSesion(s, d, e) {
    // 14293 - 01.10.2018 - intentamos actualizar la información de la sesión
    // lo sacamos al principio de todo, por si la sesión viene con un acceso directo
    if (localStorage.getItem("SESION_ID") != "") {
        top.SESION_ID = ((top.SESION_ID) ? top.SESION_ID : ((localStorage.getItem("SESION_ID")) ? localStorage.getItem("SESION_ID") : getValue('xsid')));
    } else {
        top.SESION_ID = ((top.SESION_ID) ? top.SESION_ID : ((sessionStorage.getItem("SESION_ID")) ? sessionStorage.getItem("SESION_ID") : getValue('xsid')));
    }

    // 14293 - 12.12.2019 - que la información del top esté es importante, pero es más importante que esté en el storage
    sessionStorage.setItem('SESION_ID', top.SESION_ID);
    
    if (controlAccesosDirectos()) {
        // 14293 - 02.10.2018 - Hay elementos en la URL que se han procesado, los almacenamos y reiniciamos la carga con la URL limpia
        window.location.href = '/';
        return true;
    }

    if (s && d.root.usuario && d.root.usuario.length > 0) {
        shouldShowSchedule(d.extra.rgthr);
        // 14293 - 27.02.2019 - Y la carga de home.js no se puede hacer, hasta que tengamos las aplicaciones
        // Moduls.app.load({ url: 'modulos/home/home.html', script: true });
        // 14293 - 02.10.2018 - La carga de modales se inicia el evento ready de home.js
        // controlCargaModales();
        e.form.set({ displayname: d.root.usuario[0].nombre });
        Moduls.header.user = d.root.usuario[0];
        Moduls.header.user.encuesta = (d.extra && d.extra.encpd === true);
        Moduls.header.user.politicasRGPD = (d.extra && d.extra.polpd === true);
        Moduls.header.user.administrador = (d.extra && d.extra.admin === true);
        $('.user-navbar').removeClass('dn');
        $('.menuBocadillo').removeClass('dn');
        $('.btnSalirPortal').removeClass('dn');
        $('.casita').removeClass('dn');
        e.form.modul.Forms.cargaAplicaciones.executeForm();
        if (d.extra && d.extra.admin === true) $('.admin-portal').removeClass('dn');
        comprobarWidth();
        $(".search-close-button").parent().removeClass("btnActiveSearchHeader");
        $(".search-close-button").removeClass("btnCerrarActiveSearchHeader");
        $("#search-input").removeClass('buscadorEsparcioCerrar');
        $("#search-inputMenu").removeClass('buscadorEsparcioCerrar');
        $('#listaBusquedaOpcionesMenu').empty();
        $('.clickFueraBuscador').addClass('dn');
        $("#search-input").val('');

        refreshNumAlertas();
        refreshProgresBar();
        //xx588 - 08-02-2019 - Cuando no se muestre login, se debe mostrar los siguientes elementos.
        $('#header, #footer, .new-login .border-login').addClass('db');
    } else {
        if (document.location.href.indexOf('changePassword') > 0) {
            Moduls.app.load({ url: 'modulos/login/cambiaPass.html', script: true });
        } else {
            Moduls.app.load({ url: 'modulos/login/login.html', script: true });
            // 14293 - 29.04.2019 - dentro de login, se comprueba si hay que ir directo a recuperación
            // if (document.location.href.indexOf('recoveryPassword') > 0) $('.new-login .password-recovery-action a').click();
        }
    }
}

function controlCargaModales() {
    if (Moduls.header.user.politicasRGPD) {
        Moduls.app.child.modalPoliticasRGPD.load({
            url: 'modulos/politicasRGPD/politicasRGPD.html',
            script: true
        });
    } else {
        if (sessionStorage.getItem("redirectTo") !== "" && sessionStorage.getItem("redirectTo") !== null) {
            let conf = JSON.parse(sessionStorage.getItem("redirectTo"));
            Moduls.app.PuntoPartida = conf.PuntoPartida;
            Moduls.app.Opcion = conf.Opcion;
            Moduls.app.Path = conf.Path;
            sessionStorage.setItem("redirectTo", "");
            setPerfilEmpleadoDefault(conf.Seccion);
            if (Moduls.app.Path == '###') {
                setTimeout(function () { Moduls.app.load({ url: 'modulos/perfil/perfil.html', script: true }); }, 1000);
            } else {
                setTimeout(function () { Moduls.app.load({ url: 'modulos/apps/seccionApp.html', script: true }); }, 1000);
            }

            return false;
        } else {
            if (Moduls.header.user.encuesta) {
                Moduls.header.user.encuesta = false;
                Moduls.app.child.modalEncuesta.load({
                    url: 'modulos/encuesta/encuesta.html',
                    script: true
                });
            } else {
                if (!sessionStorage.getItem('FIRST_MODAL_ALERT') || sessionStorage.getItem('FIRST_MODAL_ALERT') == 'false') {
                    sessionStorage.setItem('FIRST_MODAL_ALERT', 'true');
                    Moduls.app.child.modalAlertasPendientes.load({
                        url: 'modulos/recordatorio/modalAvisoAlertas.html',
                        script: true
                    });
                }
            }
        }
    }
    return true;
}

function controlAccesosDirectos() {
    // 14293 - 21.08.2018 - carga de aplicaciones por URL
    // se lanzará al completar "cargaAplicaciones"
    if (document.location.href.indexOf('AtencionEmpleado') > 0) {
        let seccion = '';
        if (seccion == '' && document.location.href.indexOf('AtencionEmpleado-tramites') > 0) seccion = '9716';
        else seccion = '9716';
        sessionStorage.setItem("redirectTo", JSON.stringify({ PuntoPartida: 'URL/direct', Opcion: seccion, Path: 'IN / 94' }));
        return true;
    }

    if (document.location.href.indexOf('OKN') > 0) {
        sessionStorage.setItem("redirectTo", JSON.stringify({ PuntoPartida: 'URL/direct', Opcion: '1980', Path: 'FORM / CAMPUS' }));
        return true;
    }

    if (document.location.href.indexOf('formularioAEASolidaria') > 0) {
        sessionStorage.setItem("redirectTo", JSON.stringify({ PuntoPartida: 'URL/direct', Opcion: '2004', Path: 'FO / 1815' }));
        return true;
    }


    if (document.location.href.indexOf('nuestrasMarcas') > 0) {
        sessionStorage.setItem("redirectTo", JSON.stringify({ PuntoPartida: 'URL/direct', Opcion: 'MARCAS', Path: 'INFCORP / MARCAS' }));
        return true;
    }

    if (document.location.href.indexOf('Beneficios') > 0) {
        sessionStorage.setItem("redirectTo", JSON.stringify({ PuntoPartida: 'URL/direct', Opcion: 'DUMMY', Path: 'BENEF' }));
        return true;
    }

    if (document.location.href.indexOf('PerfilEmpleado') > 0) {
        let seccion = '';
        if (seccion == '' && document.location.href.indexOf('PerfilEmpleado-beneficiarios') > 0) seccion = 'beneficiarios';
        if (seccion == '' && document.location.href.indexOf('PerfilEmpleado-cuentaBancaria') > 0) seccion = 'cuentaBancaria';
        if (seccion == '' && document.location.href.indexOf('PerfilEmpleado-datosParentesco') > 0) seccion = 'parentesco';
        if (seccion == '' && document.location.href.indexOf('PerfilEmpleado-datosEmpresa') > 0) seccion = 'datosEmpresa';
        if (seccion == '' && document.location.href.indexOf('PerfilEmpleado-datosFiscales') > 0) seccion = 'datosFiscales';
        if (seccion == '' && document.location.href.indexOf('PerfilEmpleado-datosPersonales') > 0) seccion = 'datosPersonales';
        if (seccion == '' && document.location.href.indexOf('PerfilEmpleado-prorrateoPagas') > 0) seccion = 'prorrateoPagas';
        if (seccion == '' && document.location.href.indexOf('PerfilEmpleado-situacionFamiliar') > 0) seccion = 'situacionFamiliar';
        if (seccion == '' && document.location.href.indexOf('PerfilEmpleado-cambiaPass') > 0) seccion = 'passwRecover';
        if (seccion == '' && document.location.href.indexOf('PerfilEmpleado-recuperaPass') > 0) seccion = 'passwRecover';

        sessionStorage.setItem("redirectTo", JSON.stringify({ PuntoPartida: 'URL/direct', Opcion: 'MISDATOS', Path: '00', Seccion: seccion }));
        return true;
    }

    return false;
}

let jsonCarpetas = 0;
function cargaAplicaciones(s, d, e) {
    if (s && d.root.children.length > 0) {
        let cadena = e.form.modul.return('modulos/comunes/tabla.html?tablaAplicaciones'),
            json = d.root.children;
        $('#listaAplicaciones').empty()
        if (json[0] && json[0].children && json[0].children.length > 0) {
            Moduls.app.Aplicaciones = json[0].children;
            jsonCarpetas = json[0].children;

            for (let i = 0; i < json[0].children.length; i++) {
                let HTML = $.parseHTML(cadena.reemplazaMostachos(json[0].children[i]));
                HTML[0].addEventListener('click', function () {
                    Moduls.app.PuntoPartida = 'Header/Menu';
                    Moduls.app.SeleccionAplicaciones = jsonCarpetas[i];
                    Moduls.app.load({ url: 'modulos/apps/seccionApp.html', script: true });
                    modal();
                });
                if(jsonCarpetas[i].hidden){

                }else {

                    $('#listaAplicaciones').append(HTML);
                }
            }
            inertarIconosImg();
            $('[data-toggle="tooltip"]').tooltip({
                template: '<div class="tooltip show"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
            });
        }
        // 14293 - 27.02.2019 - Y la carga de home.js no se puede hacer, hasta que tengamos las aplicaciones
        Moduls.app.load({ url: 'modulos/home/home.html', script: true });
        // 14293 - 02.10.2018 - La carga de modales se inicia el evento ready de home.js
        // controlCargaModales();
    } else {
        if (!s) toast({ tipo: 'error', msg: resuelveError(d) });
    }
}

function inertarIconosImg() {
    $('.tablaAplicaciones').each(function (i) {
        $('img', this).attr("src", 'res/img/icon-' + ponerIcono(Moduls.app.Aplicaciones[i].des) + '.png');
    });
}

function cerrarSesion(s, d, e) {
    top.SESION_ID = null;
    if (localStorage.getItem("SESION_ID") != "") {
        localStorage.setItem("SESION_ID", "");
    }
    sessionStorage.setItem("SESION_ID", "");
    window.location.href = '/';
}

$('#search-input').keyup(function () {
    if ($('#search-input').val().length > 4) {
        let objeto = {};
        objeto['p_nombre'] = $('#search-input').val();
        Moduls.header.Forms.busquedaOpcionesMenu.set(objeto);
        Moduls.header.Forms.busquedaOpcionesMenu.executeForm();
    }
});

$('#search-inputMenu').keyup(function () {
    if ($('#search-inputMenu').val().length > 4) {
        let objeto = {};
        objeto['p_nombre'] = $('#search-inputMenu').val();
        Moduls.header.Forms.busquedaOpcionesMenuResponsive.set(objeto);
        Moduls.header.Forms.busquedaOpcionesMenuResponsive.executeForm();
    }
});

function busquedaOpcionesMenu(s, d, e) {
    if (s) {
        let cadena = e.form.modul.return('modulos/comunes/tabla.html?tablaBusquedaOpcionesMenu'),
            json = d.root.opcionesMenu;
        $('#listaBusquedaOpcionesMenu').empty();
        $('.clickFueraBuscador').addClass('dn');
        if (json) {
            for (let i = 0; i < json.length; i++) {
                let HTML = $.parseHTML(cadena.reemplazaMostachos(json[i]));
                HTML[0].addEventListener('click', function () {
                    Moduls.app.PuntoPartida = 'Header/Buscador';
                    Moduls.app.Opcion = json[i].codmop;
                    Moduls.app.Path = json[i].path;
                    Moduls.app.load({ url: 'modulos/apps/seccionApp.html', script: true });
                    $(".search-close-button").parent().removeClass("btnActiveSearchHeader");
                    $(".search-close-button").removeClass("btnCerrarActiveSearchHeader");
                    $("#search-input").removeClass('buscadorEsparcioCerrar');
                    $('.cajaBuscador').fadeOut();
                    $('#listaBusquedaOpcionesMenu').empty();
                    $('.clickFueraBuscador').addClass('dn');
                    $("#search-input").val('');
                });
                $('#listaBusquedaOpcionesMenu').append(HTML);
                $('.clickFueraBuscador').removeClass('dn');
            }
        }
    } else {
        toast({ tipo: 'error', msg: resuelveError(d) });
    }
}

function busquedaOpcionesMenuResponsive(s, d, e) {
    if (s) {
        let cadena = e.form.modul.return('modulos/comunes/tabla.html?tablaBusquedaOpcionesMenu'),
            json = d.root.opcionesMenu;
        $('#listaBusquedaOpcionesMenuResponsive').empty();
        $('.clickFueraBuscador').addClass('dn');
        if (json) {
            for (let i = 0; i < json.length; i++) {
                let HTML = $.parseHTML(cadena.reemplazaMostachos(json[i]));
                HTML[0].addEventListener('click', function () {
                    Moduls.app.PuntoPartida = 'Header/Buscador';
                    Moduls.app.Opcion = json[i].codmop;
                    Moduls.app.Path = json[i].path;
                    Moduls.app.load({ url: 'modulos/apps/seccionApp.html', script: true });
                    $(".search-close-button").parent().removeClass("btnActiveSearchHeader");
                    $(".search-close-button").removeClass("btnCerrarActiveSearchHeader");
                    $("#search-inputMenu").removeClass('buscadorEsparcioCerrar');
                    $('.cajaBuscador').fadeOut();
                    $('#listaBusquedaOpcionesMenuResponsive').empty();
                    $('.clickFueraBuscador').addClass('dn');
                    $("#search-inputMenu").val('');
                    $('#navbarSupportedContent22').removeClass('show');
                    $('.animated-icon4').toggleClass('open');
                    $('.modal-overlay').css("display", "none");
                });
                $('#listaBusquedaOpcionesMenuResponsive').append(HTML);
                $('.clickFueraBuscador').removeClass('dn');
            }
        }
    } else {
        toast({ tipo: 'error', msg: resuelveError(d) });
    }
}

function registroOpciones(cod) {
    if (Moduls.app.PuntoPartida == undefined) {
        Moduls.app.PuntoPartida = 'Apps/Menu';
    }
    let objeto = {};
    objeto['p_codmop'] = cod;
    objeto['p_punpar'] = Moduls.app.PuntoPartida;
    objeto['p_infusu'] = Moduls.app.InformacionUsuario;
    Moduls.header.Forms.registroOpciones.set(objeto);
    Moduls.header.Forms.registroOpciones.executeForm();
}

function callbackRegistroOpciones(s, d, e) {
    if (s) {
        Moduls.app.PuntoPartida = undefined;
    } else {
        toast({ tipo: 'error', msg: resuelveError(d) });
    }
}

$('.clickFueraBuscador').click(function () {
    $('#listaBusquedaOpcionesMenu').empty();
    $('#listaBusquedaOpcionesMenuResponsive').empty();
    $('.clickFueraBuscador').addClass('dn');

    $('.clickFueraBuscador').addClass('dn');
    $("#search-inputMenu").val('');
    $('.cajaBuscador').fadeOut();
    $("#search-input").val('');
});

function setPerfilEmpleadoDefault(str) { Moduls.app.perfilEmpleadoDefault = str; }
function getPerfilEmpleadoDefault() { return Moduls.app.perfilEmpleadoDefault || ''; }

$(document).ready(function () {
    comprobarWidth();
});

// Funciones de Callback
function cbkContarRecordatorios(s, d, e) {
    let dat = compruebaAutorizacionOauth2UsuarioRecord(s, d, e);
    switch (dat) {
        case -1:
            toast({ tipo: 'error', msg: 'Error de llamada de authenticacion. No se ha logrado optener permisos para cargar la tabla de recordatorio' });
            break;
        case 0:
            break;
        default:
            if (s) {
                let total = 0, noleida = 0, pendiente = 0;
                total = dat.total;
                sessionStorage.setItem("ALERTAS_TOTAL", total);
                for (let i = 0; i < dat.parcial; i++) {
                    let parcial = dat.parcial[i];
                    if (parcial.estado == 200) {
                        noleida = parcial.count;
                        sessionStorage.setItem("ALERTAS_NO_LEIDAS", noleida);
                    }
                    if (parcial.estado == 400) {
                        pendiente = parcial.count;
                        sessionStorage.setItem("ALERTAS_PENDIENTES", pendiente);
                    }
                }

                invocaAjax({
                    direccion: '/management/mvc-management/controller/portal.xwi_rgpd.listar_politica_rgpd.json',
                    parametros: {
                        p_flag: 'L'
                    },
                    contentType: 'application/json',
                    retorno: function (s, d, e) {
                        if (s) {
                            let countpol = 0;
                            $.each(d.root.pol, function (i, v) {
                                $.each(v.con, function (i, y) {
                                    if (y.estado == 'Pendiente') countpol++;
                                });
                            });
                            total += countpol;
                            if (total == 0) {
                                $('.num_alertas').addClass('dn');
                            } else {
                                $('.num_alertas').html(total);
                                $('.num_alertas').removeClass('dn');
                            }
                        } else {
                            if (total == 0) {
                                $('.num_alertas').addClass('dn');
                            } else {
                                $('.num_alertas').html(total);
                                $('.num_alertas').removeClass('dn');
                            }
                            toast({ tipo: 'error', msg: 'Error al contar el número de políticas pendientes' });
                        }
                    }
                });
            } else {
                validaErroresCbk(d);
            }
            break;
    }
}

function IconoHeaderManejar() {


    Moduls.header.Forms.IconoHeader.executeForm();


}
function IconoHeader(s,d,e) {




    if(s){

        if(d.root.ico.length>0 ) {

            $('.ImagenIcono')[0].setAttribute("src", "/estatico/portal/opcionmenu/" +d.root.ico[0].imagen+'@' +d.root.ico[0].nombreimagen);
            $('.ImagenIcono')[0].setAttribute("title", d.root.ico[0].texto);
            $('.ImagenIcono')[0].setAttribute("alt", d.root.ico[0].texto);
        }else
            {

            }



    }else {
        validaErroresCbk(d);
    }
}

function shouldShowSchedule(shouldShow) {
    if(shouldShow) {
        $('.divRegistroHorario').removeClass('dn');
    };
};



