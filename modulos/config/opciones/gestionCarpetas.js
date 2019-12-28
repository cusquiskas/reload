$(window).scroll(function () {
    if ($('template .container form').position() && $(this).scrollTop() > $('template .container form').position().top + 50) {
        $('.gestionCarpetas form.botones').addClass('fijo');
        $('.gestionCarpetas form.botones .listado').removeClass('dn');
    } else {
        $('.gestionCarpetas form.botones').removeClass('fijo');
        $('.gestionCarpetas form.botones .listado').addClass('dn');
    }
});
//procesarArbol();
$('.nuevoModGestionCarpeta').click(function () {
    Moduls.app.child.modal.child.modalBody.load({ url: 'modulos/comunes/comunes.html?modalGestionCarpetas', script: false });
    if ($(this).text().toLowerCase() === "nuevo") {
        Moduls.app.nuevaGestionCarpeta = true;
        construirModal({ title: "Nueva gestión de carpetas" });
        //TODO: FALTA implementar comprobación para detectar que se ha seleccionado algo en la modificación
    } else if ($(this).text().toLowerCase() === "modificar") {
        if (Moduls.app.carpetaSeleccionada == null) {
            toast({ tipo: 'error', msg: 'Seleccione un registro' });
        } else {
            Moduls.app.nuevaGestionCarpeta = false;
            construirModal({ title: "Modificar gestión de carpetas" });
        }
    }
});
/** botón Volver */
$('.volverGetionCarpeta').click(function () {
    Moduls.app.child.templateGestion.load({ url: 'modulos/config/opciones/opcionesMenu.html', script: true });
});

/* Obtener en template gestionCarpetas*/
function obtenerArbolCarpetasGesCarpeta(s, d, e) {
    if (s) {
        $('.treeGestionCarpeta').empty();
        procesadoArbolCarpetas(d.root, '.treeGestionCarpeta', e, 'carpetaSeleccionada');
    }
}

/* Obtener en modal gestionCarpetas*/
function obtenerArbolModalGestionCarpetas(s, d, e) {
    if (s) {
        procesadoArbolCarpetas(d.root, '.treeModalGestionCarpeta', e, 'carpetaSeleccionadaModal');
    }
}
function procesadoArbolCarpetas(json, donde, modulo, guardar) {
    let arbol = procesarArbol(json);
    $(donde).append(arbol);
    if (donde === '.treeGestionCarpeta') {
        $(donde).treed({ desplegar: true });
    } else
        $(donde).treed();

    let arrayNombre = [];

    $('.treeGestionCarpeta.tree li').dblclick(function (e) {
        let me = $(this);
        $('.tree li').each(function () {
            $(this).removeClass('filaSeleccionada');
        });
        me.addClass('filaSeleccionada');
        modulo.form.modul.padre[guardar] = { 'codmca': me.attr('id'), 'nombre': me.attr('name'), 'padre': me.attr('padre'), 'padre_nombre': me.attr('padre_nombre'), 'hlplbl': me.attr('hlplbl'), 'activa': me.attr('activa'), 'posici': me.attr('posici'), 'hidden': me.attr('phidden') };
        return false;
    });

    $('.treeModalGestionCarpeta.tree li').dblclick(function (e) {
        let me = $(this);
        $('.tree li').each(function () {
            $(this).removeClass('filaSeleccionada');
        });
        me.addClass('filaSeleccionada');
        $('input[name="p_padre"]').val(me.attr('name'));
        Moduls.app.child.modal.child.modalBody.Forms.elementoGestionCarpeta.parametros.p_parent.value = me.attr('id');
        $('.arbolModalGestionCarpeta').addClass('dn');
        return false;
    });
}

function rellenarModalCarpeta(s, d, e) {
    if (s) {
        if (!Moduls.app.nuevaGestionCarpeta) {
            for (let chn in e.form.modul.padre.padre.carpetaSeleccionada) {
                let objeto = {};
                if (chn === 'padre') {
                    objeto['p_' + chn] = (e.form.modul.padre.padre.carpetaSeleccionada['codmca'] != '0') ? e.form.modul.padre.padre.carpetaSeleccionada['padre_nombre'] : '';
                    objeto['p_parent'] = e.form.modul.padre.padre.carpetaSeleccionada['padre'];
                } else
                    objeto['p_' + chn] = e.form.modul.padre.padre.carpetaSeleccionada[chn];

                 if(e.form.modul.padre.padre.carpetaSeleccionada.hidden == 'true'){
                     e.form.modul.padre.padre.carpetaSeleccionada.hidden='S';

                 }
                e.form.modul.Forms.elementoGestionCarpeta.set(objeto);
                let event = document.createEvent("Event"); event.initEvent('focus', false, true);
                e.form.modul.Forms.elementoGestionCarpeta.parametros['p_' + chn].object.dispatchEvent(event);
            }
            $('#codigoCarpeta[name=p_codmca]').attr("readonly", true);
        }
        e.form.modul.Forms.elementoGestionCarpeta.set({ p_flag: (Moduls.app.nuevaGestionCarpeta) ? 'I' : 'U' });
    }
}

function desplegarArbol() {
    if ($('#codigoCarpeta').val() != '0')
        $('.arbolModalGestionCarpeta').removeClass('dn');
}

function elementoGestionCarpeta(s, d, e) {
    if (s) {
        toast({ tipo: 'success', msg: d.root.msg });
        e.form.modul.Forms.carpetaSeleccionada = null;
        e.form.modul.padre.padre.child.templateGestion.Forms.obtenerArbolCarpetasGesCarpeta.executeForm();
    } else {
        toast({ tipo: 'error', msg: resuelveError(d) });
    }
    cerrarModalIE($('#myModal'));
    //  $('#myModal').modal('hide');
}

$('.borrarGestionCarpeta').click(function () {
    if (Moduls.app.carpetaSeleccionada == null) {
        toast({ tipo: 'error', msg: 'Seleccione un registro' });
    } else {
        Moduls.app.child.modal.child.modalBody.load({ url: 'modulos/comunes/comunes.html?mensajeBorrar', script: false });
        construirModal({
            title: 'Borrado de carpetas',
            w: 500,
            canceltext: "No",
            oktext: "Sí",
            okfunction: function () {
                let objeto = {};
                objeto['p_codmca'] = Moduls.app.carpetaSeleccionada['codmca'];
                Moduls.app.child.templateGestion.Forms.borrarGestionCarpeta.set(objeto);
                cerrarModalIE($('#myModal'));
                //  $('#myModal').modal('hide');
                Moduls.app.child.templateGestion.Forms.borrarGestionCarpeta.executeForm();
            }
        });
    }
});

function borrarGestionCarpeta(s, d, e) {
    if (s) {
        toast({ tipo: 'success', msg: 'Carpeta eliminada correctamente' });
        e.form.modul.padre.carpetaSeleccionada = null;
        e.form.modul.padre.child.templateGestion.Forms.borrarGestionCarpeta.parametros.p_codmca.value = null;
        e.form.modul.padre.child.templateGestion.Forms.obtenerArbolCarpetasGesCarpeta.executeForm();
    } else {
        toast({ tipo: 'error', msg: resuelveError(d) });
    }
}