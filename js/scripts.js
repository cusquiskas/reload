// Inicializador de colores para menu
const colores = ['#2962ff', '#2979ff', '#448aff', '#82b1ff', '#000', '#82a1ff', '#81a1ff'];
let contadorHijo = 0;
let nivelRecursivo = 1;
let timerLogin;
let contadorLogin = 1;

//rellenar aplicacion
function iniciarApp() {
    Moduls.header.load({ url: 'modulos/header/header.html', script: true });
    Moduls.footer.load({ url: 'modulos/footer/footer.html', script: true });
}

//cerrar modal
function modal() {
    $('.modal-overlay').css("display", "none");
    $('.listaMenuApp').removeClass('show');
    $('.animated-icon4').toggleClass('open');
    //$('body').removeClass('noScrollable');
}

$(window).resize(function () {
    comprobarWidth();
    comprobarHeight();
});


$(document).ready(function () {

    iniciarApp();

    comprobarWidth();
    comprobarHeight();

});

// Funcion para construir la modal, recibe un objeto modal con parametros
function construirModal(modal) {
    let param = JSON.parse(JSON.stringify(modal));
    $myModal.on('hidden.bs.modal', function () {
        if (param.relogin) {
            if (Moduls.getModalbodyrelogin) Moduls.getModalbodyrelogin().load({ url: 'res/blanco.html', script: false });
        } else {
            if (param.searchUsr) {
                if (Moduls.getModalbodysearchusr) Moduls.getModalbodysearchusr().load({ url: 'res/blanco.html', script: false });
            } else {
                if (Moduls.getModalbody) Moduls.getModalbody().load({ url: 'res/blanco.html', script: false });
            }
        }
    })
    if (modal.ocultarXCerrar) {
        $('button.close', $myModal).hide();
    } else {
        $('button.close', $myModal).show();
        if (typeof (modal.xfunction) === 'function') {
            $('button.close', $myModal).click(function () {
                modal.xfunction();
            });
        }
    }
    $('.modal-content', $myModal).css({ "width": 'auto', 'height': 'auto', 'margin': '0 auto' });
    if (modal.w && modal.w != 0)
        $('.modal-content', $myModal).css("max-width", modal.w);
    else
        $('.modal-content', $myModal).css("max-width", 'unset');
    if (modal.h && modal.h != 0)
        $('.modal-content', $myModal).css("max-height", modal.h);
    else
        $('.modal-content', $myModal).css("max-height", 'unset');

    $('.modal-title', $myModal).html(!modal.title ? "<br />" : modal.title);
    var $myModalFooter = $('.modal-footer', $myModal).empty();
    if (modal.oktext) {
        if (!(typeof (modal.okfunction) === 'function')) {
            modal.okfunction = function () {
                cerrarModalIE($myModal);
            };
        }
        $myModalFooter.append('<button id="okfunction" type="button" class="btn btn-primary">' + modal.oktext + '</button>');
        $("#okfunction").on("click", function () { modal.okfunction(); return false; });
    }
    if (modal.canceltext) {
        if (!(typeof (modal.cancelfunction) === 'function')) {
            modal.cancelfunction = function () { cerrarModalIE($myModal); };
        }
        $myModalFooter.append('<button id="cancelfunction" type="button" class="btn btn-default">' + modal.canceltext + '</button>');
        $("#cancelfunction").on("click", function () { modal.cancelfunction(); return false; });
    }
    if (esInternetExplorer()) {
        $myModal.removeClass('fade');
        $('.modal-overlay').show();
        $myModal.show();
    } else {
        $myModal.removeClass('fade');
        $myModal.modal({ show: true });
    }

    //click a la "x" de cerrar modal
    $('.close', $myModal).click(function () {
        cerrarModalIE($myModal);
    });
}

//Función para crear las notificaciones
function toast(toast) {
    let tipo;
    let margenTop;
    switch (toast.tipo) {
        case 'success':
            tipo = { i: 'check', color: '#28a745' }
            break;
        case 'error':
            tipo = { i: 'error', color: 'red' }
            break;
        case 'warning':
            tipo = { i: 'error_outline', color: '#ffc107' }
            break;
        case 'info':
            tipo = { i: 'info_outline', color: '#17a2b8' }
            break;
        default:
            tipo = { i: 'info_outline', color: '#17a2b8' }
    }

    let divPos;
    if ($('#header').is(":visible") == false) {
        divPos = '.border-login';
    } else {
        divPos = '.seccionHeadFija';
    }

    $(toast.donde || divPos).append(
        '<div class="notify" style="background:' + tipo.color + '">' +
        '<i class="material-icons">' + tipo.i + '</i>' +
        '<span>' + toast.msg + '</span>' +
        '<i class="material-icons cliqueable" onclick="removeThisContainer(this)">clear</i>' +
        '</div>');

    ($('.notify:nth-last-child(2)').length > 0 ? margenTop = $('.notify:nth-last-child(2)').css('margin-top') : margenTop = $('.notify').css('margin-top'));
    $('.notify').last().css('margin-top', parseInt(margenTop.substring(0, margenTop.length - 2)) + 70 + 'px');
    $('.notify').fadeOut(12000, 'linear', function () { $(this).remove() });
}
function removeThisContainer(obj) {
    $(obj).parent().remove();
}

/** Coger un elemento y arrastarlo */
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}

function dondeEstoy(obj) {
    let cadena = [];
    let turno = obj;
    let form = 0;
    while (turno && turno.nodeName != 'HTML' && turno.nodeName != 'WINDOW') {
        if (turno.nodeName == 'TEMPLATE' && turno.id != "") {
            if (cadena[cadena.length - 1] != 'Forms') cadena.push('child');
            cadena.push(turno.id);
            form++;
        }
        if (turno.nodeName == 'FORM' && turno.name != "" && form == 0) {
            form++;
            cadena.push(turno.name);
            cadena.push('Forms');
        }
        turno = turno.parentNode;
    }
    if (cadena.length > 0) {
        turno = Moduls;
        for (form = cadena.length - 1; form >= 0; form--) { if (!(form == 0 && cadena[form] == 'child')) turno = turno[cadena[form]]; }
    } else turno = false;
    return turno;
}

//============================================================================================
//=========================== NOTIFICACIONES PUSH CON WEBSOCKET ==============================
//============================================================================================
let socket = new WebSocket("wss://" + ((VERSION_PORTAL === false) ? "desarrollo.intranet.globalia-corp" : location.hostname) + "/webSocketServer/websocket");

socket.onopen = function () {
    console.log('onOpen DEL WebSocket JS');
}

socket.onmessage = function (e) {
    console.log('onMessage DEL WebSocket: ' + e.data);
    let notification = window.Notification || window.mozNotification || window.webkitNotification;
    if (notification && notification.permission && notification.permission == 'granted') {
        Notifica('¡NUEVA NOTICIA!', e.data);
    }
}

socket.send = function (e) {
    if (Moduls.header.user && Moduls.header.user.administrador && Moduls.header.user.administrador === true) {
        console.log('Al SI ser administrador SI tiene permiso para enviar notificaciones');
    } else {
        console.log('Al NO ser administrador NO tiene permiso para enviar notificaciones');
        toast({ tipo: 'error', msg: "Hemos detectado que intencionadamente quiere ejercer un mal uso de nuestra plataforma ... VAMOS A POR USTED ... NO ES BROMA" });
    }
}

socket.onclose = function () {
    console.log('onClose DEL WebSocket JS');
}

socket.onerror = function (error) {
    console.log('onError DEL WebSocket JS: ' + error);
}


function Notifica(titulo, contenido) {
    let notification = window.Notification || window.mozNotification || window.webkitNotification;
    if ('undefined' === typeof notification) {
        return false;
    }
    var notificar = new notification(
        titulo, {
        body: contenido,
        dir: 'auto',
        lang: 'ES',
        icon: 'res/img/icon-notificacionGlobalia.png'
    }
    );
    notificar.onclick = function () {
    };
    notificar.onerror = function () {
    };
    notificar.onshow = function () {
    };
    notificar.onclose = function () {
    };
    return true;
}

$.fn.extend({
    genTreed: function (o) {
        if (o === undefined || !o.desplegar) {
            var openedClass = 'remove_circle_outline';//-
            var closedClass = 'add_circle';//+
        } else {
            var openedClass = '', closedClass = '';//+
        }
        if (typeof o != 'undefined') {
            if (typeof o.openedClass != 'undefined') {
                openedClass = o.openedClass;
            }
            if (typeof o.closedClass != 'undefined') {
                closedClass = o.closedClass;
            }
        };
        var tree = $(this);
        tree.addClass("tree");
        tree.find('li').has("ul").each(function () {
            var branch = $(this);
            branch.children('.tree-node').prepend("<i class='material-icons'>" + closedClass + "</i>");
            branch.addClass('branch');
            if (o === undefined || !o.desplegar) {
                branch.children('.tree-node').children('i').on('click', function (e) {
                    if (this == e.target) {
                        var icon = $(this).first();//.children('i:first');
                        if (icon.text() == openedClass) {
                            icon.removeClass("iconoMenos");
                            icon.text(closedClass);
                        } else {
                            icon.addClass("iconoMenos");
                            icon.text(openedClass);
                        }
                        $(this).parent().parent().children('ul').children().toggle();
                    }
                })
                branch.children('ul').children().toggle();
            }
        });
        tree.find('.branch .indicator').each(function () {
            $(this).on('click', function () {
                $(this).closest('li').click();
            });
        });
    }
});

function refreshProgresBar() {
    invocaAjax({
        direccion: '/management/mvc-management/controller/portal.xwi_personal.dev_porcentaje_perfil.json',
        method: "POST",
        contentType: 'application/json',
        parametros: { p_codusr: Moduls.header.user.codusr },
        retorno: function (s, d, e) {
            if (s && d && d.root) {
                setTimeout(function () {
                    $('.progress-bar-perfil').removeClass('bg-success bg-warning bg-danger');
                    $('.perfilCompleto').removeClass('color-black color-red color-orange color-green');
                    if (d.root.porper == 0) {
                        $('.progress-bar-perfil').addClass('bg-danger');
                        $('.perfilCompleto').addClass('color-black');
                    } else if (d.root.porper < 35) {
                        $('.progress-bar-perfil').addClass('bg-danger');
                        $('.perfilCompleto').addClass('color-red');
                    } else if (d.root.porper < 80) {
                        $('.progress-bar-perfil').addClass('bg-warning');
                        $('.perfilCompleto').addClass('color-orange');
                    } else {
                        $('.progress-bar-perfil').addClass('bg-success');
                        $('.perfilCompleto').addClass('color-green');
                    }
                    $('.progress-bar-perfil').animate({ width: d.root.porper + '%' }, 1500);
                    $('.progress-bar-perfil').attr('aria-valuenow', d.root.porper);
                }, 1500);

                let tooltip = '';
                if (d.root.avatar) tooltip += ', foto';
                if (d.root.email) tooltip += ', email';
                if (d.root.teleph) tooltip += ', teléfono';
                if (d.root.recuperacion) tooltip += ', información recuperación contraseña';
                if (tooltip.length > 0) {
                    tooltip = '<strong>Pendiente completar tu perfil:</strong> ' + tooltip.substr(2) + '.';
                }
                $('.pb-perfil-tooltip').
                    attr('title', tooltip).
                    tooltip('fixTitle').
                    data('bs.tooltip').tip().
                    addClass('tooltip-of-pbp');
                if ($('.pb-perfil-tooltip-2').length > 0) {
                    $('.pb-perfil-tooltip-2').
                        tooltip('fixTitle').
                        data('bs.tooltip').tip().
                        addClass('tooltip-of-pbp');
                }
                if (tooltip.length == 0) $('.pb-perfil-tooltip').removeAttr('data-original-title');

                if (d.root.porper == 100) {
                    $('.pbp-header').addClass('dn');
                    $('.perfilCompleto').html('Perfil Completo');
                } else {
                    $('.pbp-header').removeClass('dn');
                    $('.perfilCompleto, .pbp-header label').html(d.root.porper + '%');
                }
            } else {
                validaErroresCbk(d);
            }
        }
    });
}

function loading(act) {
    if (typeof (act) === 'boolean')
        Moduls.header.Forms.cerrarSesion.loading('loadingForzadoXCodigo', act);
}


function refreshNumAlertas() {
    Moduls.header.Forms.frmContRecordatoriosPendiente.executeForm();
}

function compruebaAutorizacionOauth2UsuarioRecord(s, d, e) {
    if (e.xxhttpresponsecodexx == 401 || e.xxhttpresponsecodexx == 403) {
        if (e.form.recursivecount === undefined || e.form.recursivecount === null) {
            e.form.recursivecount = 5;
        }
        if (e.form.recursivecount > 0) {
            e.form.recursivecount = e.form.recursivecount - 1;
            invocaAjax({
                direccion: '/oauth2/oauth/token?grant_type=password&username=' + top.SESION_ID + '&password=none&auth_type=xsid',
                method: 'POST',
                authorization: {
                    type: 'basic',
                    key: 'cmVjb3JkYXRvcmlvOnIzYzByZDR0MHIxMA=='
                },
                retorno: function (suc, dat, ext) {
                    let obj = JSON.parse(dat);
                    e.form.authorization = {
                        type: 'oauth2',
                        key: obj.access_token
                    }
                    e.form.executeForm();
                }
            });
            return 0;
        } else {
            e.form.recursivecount = 0;
            return -1;
        }
    }
    try {
        return JSON.parse(d);
    } catch (e) {
        return -1;
    }
}

function passwordthify(input, focused, border) {
    let addon = $('<div class="input-group-append"></div>');
    let inneraddon = $('<span class="input-group-text passwd-view cliqueable"><i class="material-icons">visibility</i></span>');
    inneraddon.appendTo(addon);
    input.parent().append(addon);
    if (focused !== true) {
        input.focus(function () {
            inneraddon.addClass('focused');
            input.addClass('focused');
        });
        input.blur(function () {
            inneraddon.removeClass('focused');
            input.removeClass('focused');
        });
    }
    if (border === true) {
        inneraddon.css('cssText', 'border: 0px solid black !important;');
    }
    inneraddon.children('i').click(function () {
        if ($(this).html() == 'visibility') {
            $(this).html('visibility_off');
            input.attr('type', 'text');
        } else {
            $(this).html('visibility');
            input.attr('type', 'password');
        }
    });
}

function encrypt(p_msg, p_key) {

    let k = p_key ? p_key : top.SESION_ID;

    let value = CryptoJS.enc.Utf8.parse(p_msg);
    let key = CryptoJS.enc.Utf8.parse(k.substr(0, 8));
    let iv = CryptoJS.enc.Utf8.parse(k.substr(8, 8));

    return CryptoJS.DES.encrypt(
        value,
        key,
        {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }).toString();
}

function genXsid() {
    let xsid = Math.random().toString(36).slice(2) + "" + Math.random().toString(36).slice(2) + "" + Math.random().toString(36).slice(2);
    return xsid.substr(0, 32).toUpperCase();
}

function confirmaSesion(cbkfun, obj) {
    Moduls.app.child.modal.child.modalBody.load({ url: 'modulos/login/confirm-login.html', script: true });
    construirModal({
        title: 'Confirma tu sesión',
        w: 700, h: 900,
        ocultarXCerrar: true,
        canceltext: 'CANCELAR',
        oktext: "CONFIRMAR",
        okfunction: function () {
            if (cbkfun == 'NOMINAS') {
                Moduls.app.HabilitarVista = cbkfun;
                Moduls.app.Objeto = obj;
            } else {
                Moduls.app.HabilitarModificacion = cbkfun;
            }

            let form = Moduls.app.child.modal.child.modalBody.Forms.accionCheckLogin;
            form.set({ p_pasusr: encrypt(form.parametros.p_auxpasusr.value) });
            form.executeForm();
        }
    });
}

function compruebaAutorizacionOauth2UsuarioRecord(s, d, e) {
    if (e.xxhttpresponsecodexx == 401 || e.xxhttpresponsecodexx == 403) {
        if (e.form.recursivecount === undefined || e.form.recursivecount === null) {
            e.form.recursivecount = 5;
        }
        if (e.form.recursivecount > 0) {
            e.form.recursivecount = e.form.recursivecount - 1;
            invocaAjax({
                direccion: '/oauth2/oauth/token?grant_type=password&username=' + top.SESION_ID + '&password=none&auth_type=xsid',
                method: 'POST',
                authorization: {
                    type: 'basic',
                    key: 'cmVjb3JkYXRvcmlvOnIzYzByZDR0MHIxMA=='
                },
                retorno: function (suc, dat, ext) {
                    let obj = JSON.parse(dat);
                    e.form.authorization = {
                        type: 'oauth2',
                        key: obj.access_token
                    }
                    e.form.executeForm();
                }
            });
            return 0;
        } else {
            e.form.recursivecount = 0;
            return -1;
        }
    }
    try {
        return JSON.parse(d);
    } catch (e) {
        return -1;
    }
}

function getParameter(base, key) {
    return base.params ? base.params[key] : base.params;
}
function setParameter(base, key, val) {
    if (!base.params) base.params = {};
    base.params[key] = val;
}

if (!String.prototype.padStart) {
    String.prototype.padStart = function (len, str) {
        len = len >> 0; str = str === undefined ? '\u0020' : String(str);
        if (len <= this.length || str.length === 0) return String(this);
        var buffer = new Array(len - this.length); str = str.split('');
        for (var i = 0; i < buffer.length; i++) buffer[i] = str[i % str.length];
        return buffer.join('').concat(this);
    };
}

if (!Array.prototype.fill) {
    Array.prototype.fill = function (value) {
        if (this == null) {
            throw new TypeError('this is null or not defined');
        }
        var O = Object(this);
        var len = O.length >>> 0;
        var start = arguments[1];
        var relativeStart = start >> 0;
        var k = relativeStart < 0 ?
            Math.max(len + relativeStart, 0) :
            Math.min(relativeStart, len);
        var end = arguments[2];
        var relativeEnd = end === undefined ?
            len : end >> 0;
        var final = relativeEnd < 0 ?
            Math.max(len + relativeEnd, 0) :
            Math.min(relativeEnd, len);
        while (k < final) {
            O[k] = value;
            k++;
        }

        return O;
    };
}

function createJQerySelectors(form) {
    const selectors = {};
    const params = form.parametros;
    const fields = Object.keys(params);
    $.each(fields, (index, fieldName) => {
        selectors[fieldName] = $(params[fieldName].object);
    });
    return selectors;
};


function validateJSON(json) {
    try {
        JSON.parse(json);
    } catch (e) {
        return false;
    }
    return true;
};

function getCurrentDateInES(date = new Date()) {
    let translateMonth = {
        1: 'enero', 2: 'febrero', 3: 'marzo', 4: 'abril', 5: 'mayo', 6: 'junio', 7: 'julio', 8: 'agosto', 9: 'septiembre',
        10: 'octubre', 11: 'noviembre', 12: 'diciembre'
    };
    let translateDay = {
        0: 'Domingo', 1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves', 5: 'Viernes', 6: 'Sábado'
    };
    let currentDayOfMonth = date.getDate().toString();
    let currentMonth = translateMonth[date.getMonth() + 1];
    let dayOfWeek = translateDay[date.getDay()];
    let currentYear = date.getFullYear();
    return `${dayOfWeek} ${currentDayOfMonth} ${currentMonth} ${currentYear}`
};

function getCurrentTime(){
    let date = new Date();
    let currentMinutes = date.getMinutes().toString();
    currentMinutes = currentMinutes.length === 1 ? `0${currentMinutes}` : currentMinutes;
    let currentHour = date.getHours();
    currentHour = currentHour.toString().length === 1 ? `0${currentHour}` : currentHour;
    return `${currentHour}:${currentMinutes}`
};

function pad(n) { return n < 10 ? '0' + n : n }; // Función creada para fechas y horas, se puede extrapolar su uso allá dónde sea necesario

function padToTime(time) {
    let splitedTime = time.split(':');
    splitedTime[0] = splitedTime[0].length == 2 ? splitedTime[0] : pad(splitedTime[0]);
    splitedTime[1] = splitedTime[1].length == 2 ? splitedTime[1] : pad(splitedTime[1]);
    return `${splitedTime[0]}:${splitedTime[1]}`;
};


function insertSubstrIntoStr(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
};