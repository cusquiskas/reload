$.fn.extend({
    treed: function (o) {
        if (o === undefined || !o.desplegar) {
            var openedClass = '-';//-
            var closedClass = 'add_box';//+
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
            branch.prepend("<i class='material-icons'>" + closedClass + "</i>");
            branch.addClass('branch');
            if (o === undefined || !o.desplegar) {
                branch.children('i').on('click', function (e) {
                    if (this == e.target) {
                        var icon = $(this).first();//.children('i:first');
                        if (icon.text() == openedClass) {
                            icon.removeClass("iconoMenos");
                            icon.text(closedClass);
                        } else {
                            icon.addClass("iconoMenos");
                            icon.text(openedClass);
                        }
                        $(this).parent().children().children().toggle();
                    }
                })
                branch.children().children().toggle();
            }
        });
        tree.find('.branch .indicator').each(function () {
            $(this).on('click', function () {
                $(this).closest('li').click();
            });
        });
    }
});

function procesarArbol(json) {
    var lista = "";
    for (var j in json.children) {
        if (!(j == 'inArray')) {
            var hijo = json.children[j];
            lista += "<li name='" + hijo.nombre + "' id='" + hijo.codmca + "' padre='" + hijo.parent + "' padre_nombre='" + hijo.parent_nombre + "' phidden='" + hijo.hidden + "' hlplbl='" + ((hijo.hlplbl == null) ? "" : hijo.hlplbl) + "' activa='" + hijo.activa + "' path='" + hijo.path + "' posici='" + hijo.posici + "'>" + hijo.nombre;
            if (hijo.children !== undefined) {
                lista += "<ul>";
                lista += procesarArbol(hijo);
                lista += "</ul>";
            }
            lista += "</li>";
        }
    }
    return lista;
}

$('.close').on('click', () => {
    showBodyScroll(true);
    //$('modal-content').css('border-radius', 'unset');
});

$('.modalOpcionMenu').click(function () {
    showBodyScroll(false);
    //$('.modal-content').css('border-radius', '25px');
    Moduls.app.child.modal.child.modalBody.load({ url: 'modulos/comunes/comunes.html?formNuevoEditarOpcionMenu', script: false });
    if ($(this).text().toLowerCase() === "nuevo") {
        Moduls.app.child.templateGestion.Forms.variablesControl.nuevaOpcionMenu = true;
        construirModal({ title: "Nuevo opción de menú", w: '70vw' });
        //TODO: FALTA implementar comprobación para detectar que se ha seleccionado algo en la modificación
    } else if ($(this).text().toLowerCase() === "modificar") {
        if (Moduls.app.child.templateGestion.Forms.variablesControl.elementoOpcionesMenu == null) {
            showBodyScroll(true);
            toast({ tipo: 'error', msg: 'Seleccione un registro' });
        } else {
            Moduls.app.child.templateGestion.Forms.variablesControl.nuevaOpcionMenu = false;
            construirModal({ title: "Modificar opción de menú", w: '70vw' });
        }
    }
});

$('.borrarOpcionesMenu').click(function () {
    if (Moduls.app.child.templateGestion.Forms.variablesControl.elementoOpcionesMenu == null) {
        toast({ tipo: 'error', msg: 'Seleccione un registro' });
    } else {
        Moduls.app.child.modal.child.modalBody.load({ url: 'modulos/comunes/comunes.html?mensajeBorrar', script: false });
        construirModal({
            title: 'Opciones de menu',
            w: 300,
            canceltext: "No",
            oktext: "Sí",
            okfunction: function () {
                let objeto = {};
                objeto['p_codmop'] = Moduls.app.child.templateGestion.Forms.variablesControl.elementoOpcionesMenu['codmop'];
                Moduls.app.child.templateGestion.Forms.borrarOpcionesMenu.set(objeto);
                cerrarModalIE($('#myModal'));
                //$('#myModal').modal('hide');
                Moduls.app.child.templateGestion.Forms.borrarOpcionesMenu.executeForm();
            }
        });
    }
});

$('.perfilesOpcionMenu').click(function () {
    if (Moduls.app.child.templateGestion.Forms.variablesControl.elementoOpcionesMenu == null) {
        toast({ tipo: 'error', msg: 'Seleccione un registro' });
    } else {
        Moduls.app.child.modal.child.modalBody.load({ url: 'modulos/comunes/comunes.html?opcionesPerfil', script: false });
        construirModal({ title: "Perfiles asociados" });
    }
});

$(window).scroll(function () {
    if ($('template .container form').position() && $(this).scrollTop() > $('template .container form').position().top + 70) {
        $('.gestionOpcionesMenu form.botones').addClass('fijo');
        $('.gestionOpcionesMenu form.botones .listado').removeClass('dn');
    } else {
        $('.gestionOpcionesMenu form.botones').removeClass('fijo');
        $('.gestionOpcionesMenu form.botones .listado').addClass('dn');
    }
});

function listadoOpcionesMenu(s, d, e) {
    Moduls.app.child.templateGestion.Forms.variablesControl = {};
    if (s) {
        $('#listaOpcionesMenu').empty();
        let cadena = e.form.modul.return('modulos/comunes/tabla.html?tablaOpcionesMenu'),
            json = d.root.opcionesMenu;
        for (let i = 0; i < json.length; i++) {
            let HTML = $.parseHTML(cadena.reemplazaMostachos(json[i]));
            HTML[0].addEventListener('click', function () {
                $('.listado .tabla .row').removeClass('filaSeleccionada');
                $(this).addClass('filaSeleccionada');
                Moduls.app.child.templateGestion.Forms.variablesControl.elementoOpcionesMenu = json[i]
            });
            $('#listaOpcionesMenu').append(HTML);
        }
    } else {
        toast({ tipo: 'error', msg: resuelveError(d) });
    }
}

function mostrarOpcionesMenu(s, d, e) {
    $('.seleccionArbolOpMenu')[0].addEventListener('dblclick', function () { quitarCarpetasOpcion(this); });
    if (s) {
        // Se realiza la carga del árbol de carpetas
        let arbol = procesarArbol(d.root);
        $('#tree1').append(arbol);
        $('#tree1').treed();

        $('.tree li').dblclick(function (e) {
            let me = $(this)
            let datos = [];
            $('option', '.seleccionArbolOpMenu').each(function (index) {
                datos.push($('option', '.seleccionArbolOpMenu')[index].text);
            });
            if ($.inArray(me.attr('path'), datos) === -1)
                $('.seleccionArbolOpMenu').append(new Option(me.attr('path'), me.attr('id') || ''));
            return false;
        });
        if (!Moduls.app.child.templateGestion.Forms.variablesControl.nuevaOpcionMenu) {
            for (let chn in Moduls.app.child.templateGestion.Forms.variablesControl.elementoOpcionesMenu) {
                if (chn != 'icomop') {
                    if (e.form.modul.Forms.gestionOpcionesMenu.parametros['p_' + chn]) {
                        let objeto = {};
                        objeto['p_' + chn] = Moduls.app.child.templateGestion.Forms.variablesControl.elementoOpcionesMenu[chn];
                        e.form.modul.Forms.gestionOpcionesMenu.set(objeto);
                        let event = document.createEvent("Event"); event.initEvent('focus', false, true);
                        e.form.modul.Forms.gestionOpcionesMenu.parametros['p_' + chn].object.dispatchEvent(event);
                    }
                }
            }
           
            $('#codigoOpcionMenu[name=p_codmop]').attr("readonly", true);
        }
        const formatedParams = e.form.modul.Forms.gestionOpcionesMenu.parametros['p_params'].value.replace(/["'"]/gi, '"');
        e.form.modul.Forms.gestionOpcionesMenu.set({
            p_params: formatedParams,
            p_flag: (Moduls.app.child.templateGestion.Forms.variablesControl.nuevaOpcionMenu) ? 'I' : 'U'
        });
        $('[data-toggle="tooltip"]').tooltip({
            template: '<div class="tooltip show"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
        });


        Moduls.app.child.modal.child.modalBody.Forms.nFile = new uploadProject();
        let file = Moduls.app.child.modal.child.modalBody.Forms.nFile;
        file.setBtnSelect(getId('btnAdjuntarArchivoOpcionMenu'));
        file.setFncValidation(valida_archivo);
        file.setFncCallback(SubidaCorrectaIcono);
        file.setBoxEco(getId('adjuntarArchivoOpcionMenu'));
        file.setBtnDelete(getId('btnRemoveAdjArchOpcionMenu'));
        file.setConfig({ exts: ['.JPG', '.JPEG', '.BMP', '.GIF', '.PNG', '.PDF'], smax: 5242880, ruta: '/var/www/webapps04/estatico/portal/opcionmenu/' });
        file.initDocument();
        if (Moduls.app.child.templateGestion.Forms.variablesControl.elementoOpcionesMenu && Moduls.app.child.templateGestion.Forms.variablesControl.elementoOpcionesMenu.icomopPub && Moduls.app.child.templateGestion.Forms.variablesControl.elementoOpcionesMenu.icomopPub != "") {
            e.form.modul.Forms.gestionOpcionesMenu.set({ x_icomop: Moduls.app.child.templateGestion.Forms.variablesControl.elementoOpcionesMenu.icomopPub });
            file._hide(file.buttons.select);
            file._show(file.buttons.delete);
        } else {
            e.form.modul.Forms.gestionOpcionesMenu.set({ p_icomop: "=" });
        }

        getId('adjuntarArchivoOpcionMenu').addEventListener('change', function () {
            Moduls.app.child.modal.child.modalBody.Forms.gestionOpcionesMenu.set({ p_icomop: Moduls.app.child.templateGestion.Forms.variablesControl.elementoOpcionesMenu.icomop });
        });
        let params = e.form.modul.Forms.gestionOpcionesMenu.parametros;
        const inputsKeys = Object.keys(params);
        inputsKeys.forEach((key) => {
            let selector = $(params[key].object);
            if (selector.attr('type') !== 'hidden' && params[key].value !== '') {
                selector.siblings().closest('label').addClass('active');
            }
            else if(selector.attr('type') !== 'hidden' && params[key].value == '') {
                selector.siblings().closest('label').removeClass('active');
            }
        });
    }
}


function quitarCarpetasOpcion(select) {
    select.remove(select.selectedIndex)
}

function gestionOpcionesMenu(s, d, e) {
    if (s) {
        if (d.extra && d.extra.ficadj && e.form.parametros.p_icomop.value != '=') {
            e.form.modul.Forms.nFile.uploadDocument({ file: d.extra.ficadj });
        } else {
            finProcesoGuardar(d, e);
        }
    } else {
        validaErroresCbk(d, true);
    }
}

function borrarOpcionesMenu(s, d, e) {
    if (s) {
        toast({ tipo: 'success', msg: 'La opcion de menú se ha eliminado correctamente' });
        Moduls.app.child.templateGestion.Forms.variablesControl.elementoOpcionesMenu = null;
        e.form.modul.padre.child.templateGestion.Forms.borrarOpcionesMenu.parametros.p_codmop.value = null;
        e.form.modul.padre.child.templateGestion.Forms.listadoOpcionesMenu.executeForm();
    } else {
        toast({ tipo: 'error', msg: resuelveError(d) });
    }
}

function controlEdicionPerfilOpciones(s, d, e) {
    $('.perfilesCargados')[0].addEventListener('dblclick', function () { aniadirPerfilesOpcion(); });
    $('.perfilesSeleccionados')[0].addEventListener('dblclick', function () { quitarPerfilesOpcion(); });
    e.form.modul.Forms.perfilesOpcionesMenu.set({ p_codmop: Moduls.app.child.templateGestion.Forms.variablesControl.elementoOpcionesMenu.codmop });
    $('[data-toggle="tooltip"]').tooltip({
        template: '<div class="tooltip show"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
    });
}

function perfilesOpcionesMenu(s, d, e) {
    if (s) {
        toast({ tipo: 'success', msg: d.root.msg });
        cerrarModalIE($('#myModal'));
        // $('#myModal').modal('hide');
    } else {
        validaErroresCbk(d, true);
    }
}

function quitarPerfilesOpcion() {
    let ori = $('.perfilesSeleccionados')[0];
    let des = $('.perfilesCargados')[0];

    if ($('.perfilesSeleccionados').val().length > 0) {
        for (let i = 0; i < ori.selectedOptions.length; i++) {
            des.options.add(new Option(ori.options[ori.selectedOptions[i].index].text, ori.options[ori.selectedOptions[i].index].value));
        }
        while (ori.selectedIndex > -1) {
            ori.options[ori.selectedIndex] = null;
        }
    }
}

function aniadirPerfilesOpcion() {
    let ori = $('.perfilesCargados')[0];
    let des = $('.perfilesSeleccionados')[0];

    if ($('.perfilesCargados').val().length > 0) {
        for (let i = 0; i < ori.selectedOptions.length; i++) {
            des.options.add(new Option(ori.options[ori.selectedOptions[i].index].text, ori.options[ori.selectedOptions[i].index].value));
        }
        while (ori.selectedIndex > -1) {
            ori.options[ori.selectedIndex] = null;
        }
    }
}

$('.gestionMenuCarpetas').click(function () {
    Moduls.app.child.templateGestion.load({ url: 'modulos/config/opciones/gestionCarpetas.html', script: true });
});

// Cargar el arbol de los filtros de búsqueda
$('.filtroPadre').click(function () {
    if ($('.arbolModalGestionCarpetaFiltro').hasClass('dn'))
        desplegarArbolFiltro();
    else
        $('.arbolModalGestionCarpetaFiltro').addClass('dn');
});

$('.limpiarFiltroPadre').click(function () {
    Moduls.app.child.templateGestion.Forms.listadoOpcionesMenu.parametros.p_codmca.value = '';
    $('input[name="p_padre"]').val('');
    // Se oculta el árbol de carpetas y se quitan los seleccionados
    $('.arbolModalGestionCarpetaFiltro').addClass('dn');
    $('.tree li').each(function () {
        $(this).removeClass('filaSeleccionada');
    });
});

function desplegarArbolFiltro() {
    $('.arbolModalGestionCarpetaFiltro').removeClass('dn');
}

function obtenerArbolFiltroCarpetasOpcMenu(s, d, e) {
    if (s) {
        procesadoArbolCarpetasOpcMenu(d.root, '.treeModalGestionCarpetaFiltro');
    }
}

function procesadoArbolCarpetasOpcMenu(json, donde) {
    let arbol = procesarArbol(json);
    $(donde).append(arbol);

    $(donde).treed();

    let arrayNombre = [];

    $('.treeModalGestionCarpetaFiltro.tree li').dblclick(function (e) {
        let me = $(this);
        $('.tree li').each(function () {
            $(this).removeClass('filaSeleccionada');
        });
        me.addClass('filaSeleccionada');

        Moduls.app.child.templateGestion.Forms.listadoOpcionesMenu.parametros.p_codmca.value = me.attr('id');
        $('input[name="p_padre"]').val(me.attr('name'));
        $('.arbolModalGestionCarpetaFiltro').addClass('dn');
        return false;
    });
}

function valida_archivo(s, d, e) {
    if (s) {
        let adjArchHidden = getId('p_icomop');
        adjArchHidden.value = e.upload.fileProperties.name;
        let event = document.createEvent("Event"); event.initEvent('change', false, true);
        adjArchHidden.dispatchEvent(event);
    } else {
        let msg = (d.type == 'smax') ? 'Excedido tamaño del documento:<br>Máximo: ' + d.fileMax + '<br>' + 'Real: ' + d.fileSize :
            (d.type == 'exts') ? 'Tipo de archivo no permitido:<br>Permitidos: ' + d.exts + '<br>Real: ' + d.fileExt :
                'Error desconocido validando el documento';
        toast({ tipo: 'error', msg: msg, donde: '.modal-header' });
    }
}

function SubidaCorrectaIcono(s, d, e) {
    if (s) {
        finProcesoGuardar(d);
    }
    else {
        validaErroresCbk(d, true);
    }
}

function finProcesoGuardar(d) {
    showBodyScroll(true);
    toast({ tipo: 'success', msg: 'Fichero subido correctamente' });
    Moduls.app.child.templateGestion.Forms.variablesControl.elementoOpcionesMenu = null;
    Moduls.app.child.templateGestion.Forms.listadoOpcionesMenu.executeForm();
    cerrarModalIE($('#myModal'));
    //$('#myModal').modal('hide');
}


function onFormLoad() {
    $('button[name="guardar"]').on('click', (evt) => {
        let p_paramsInput = $('input[name="p_params"]');
        if (validateInputJson(p_paramsInput)) {
            dondeEstoy(evt.target).executeForm();
        }
    });
    $('button[id="cancelfunction"]').on('mousedown', () => {
        showBodyScroll(true);
        cerrarModalIE($('#myModal'));
    });
};


function validateInputJson(p_paramsInput) {
    let isValidate = p_paramsInput[0].value === '' ? true : validateJSON(p_paramsInput.val());
    if (!isValidate) {
        toast({ tipo: 'error', 'msg': 'La cadena de parametros no es un JSON valido', donde: '.modal-header' });
        dondeEstoy(p_paramsInput[0]).set({
            p_params: ''
        });
        $("#myModal").animate({ scrollTop: 0 }, "slow");
        return false
    }
    return isValidate;
}


function showBodyScroll(show) {
    let body = $('body');
    show ? body.css('overflow', 'auto') : body.css('overflow', 'hidden');
};