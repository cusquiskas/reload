window.location.hash = "no-back-button";
window.location.hash = "Again-No-back-button"; //chrome
window.onhashchange = function () { window.location.hash = "#"; };

//rellenar aplicacion
function iniciarApp() {
    Moduls.header.load({ url: 'modulos/header/header_externo.html', script: true });
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
});


$(document).ready(function () {
    let url = location.href;
    if (VERSION_PORTAL !== false) {
        // 14293 - al portal se accede por https
        if (url.substr(0, url.search('//')) != 'https:') {
            top.document.location.href = 'https:' + url.substr(url.search('//'), url.length);
            return false;
        }
        // 14293 - si accedes por el dominio antiguo, te redirige al nuevo
        if (url.search('globalia-corp.com') > 0) {
            top.document.location.href = top.document.location.href.replace('globalia-corp.com', 'globalia.com');
            return false;
        }
        // 14293 - si te equivocas de URL y el apache resuelve PORTAL, te redirecciono al portal bien.
        if (url.search('intranet.globalia.com') < 0) {
            top.document.location.href = 'https://intranet.globalia.com';
            return false;
        }
    }

    iniciarApp();

    comprobarWidth();

});

// Funcion para construir la modal, recibe un objeto modal con parametros
function construirModal(modal) {
    var $myModal = $('#myModal');
    $myModal.on('hidden.bs.modal', function () {
        Moduls.modal.child.modalBody.load({ url: 'res/blanco.html', script: false });
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
    } else
        $myModal.modal('show');

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
    $(toast.donde || '.seccionHeadFija').append(
        '<div class="notify" style="background:' + tipo.color + '">' +
        '<i class="material-icons">' + tipo.i + '</i>' +
        '<span>' + toast.msg + '</span>' +
        '<i class="material-icons cliqueable" onclick="removeThisContainer()">clear</i>' +
        '</div>');

    ($('.notify:nth-last-child(2)').length > 0 ? margenTop = $('.notify:nth-last-child(2)').css('margin-top') : margenTop = $('.notify').css('margin-top'));
    $('.notify').last().css('margin-top', parseInt(margenTop.substring(0, margenTop.length - 2)) + 70 + 'px');
    $('.notify').fadeOut(12000, 'linear', function () { $(this).remove() });
}
function removeThisContainer() {
    $(this).parent().remove();
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

function loading(act) {
    if (typeof (act) === 'boolean')
        Moduls.header.Forms.cerrarSesion.loading('loadingForzadoXCodigo', act);
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

function getParameter(base, key) {
    return base.params ? base.params[key] : base.params;
}
function setParameter(base, key, val) {
    if (!base.params) base.params = {};
    base.params[key] = val;
}

function nombreFichero(url) {
    let ini = url.lastIndexOf('/');
    let fin = url.lastIndexOf('.');
    return url.substring(ini + 1, fin).replace(/[^a-zA-Z0-9]/g, '');
}

function firstToUpper(name) {
    return name.charAt(0).toUpperCase() + name.slice(1)
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