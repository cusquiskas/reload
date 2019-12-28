
$(function () { });

function clickNuevo() {
    Moduls.app.child.modal.child.modalBody.load({ url: 'modulos/comunes/comunes.html?formNuevoEditarGestionPerfil', script: false });
    Moduls.app.child.templateGestion.Forms.variablesControl.nuevoPerfil = true;
    construirModal({ title: "Nuevo perfil", w: 600 });
    //TODO: FALTA implementar comprobación para detectar que se ha seleccionado algo en la modificación
}

function clickModificar() {
    Moduls.app.child.modal.child.modalBody.load({ url: 'modulos/comunes/comunes.html?formNuevoEditarGestionPerfil', script: false });
    if (Moduls.app.child.templateGestion.Forms.variablesControl.elementoPerfil == null) {
        toast({ tipo: 'error', msg: 'Seleccione un registro' });
    } else {
        Moduls.app.child.templateGestion.Forms.variablesControl.nuevoPerfil = false;
        construirModal({ title: "Modificar perfil", w: 600 });
    }
}

function clickBorrar() {
    if (Moduls.app.child.templateGestion.Forms.variablesControl.elementoPerfil == null) {
        toast({ tipo: 'error', msg: 'Seleccione un registro' });
    } else {
        Moduls.app.child.modal.child.modalBody.load({ url: 'modulos/comunes/comunes.html?mensajeBorrar', script: false });
        construirModal({
            title: 'Perfil',
            w: 300,
            canceltext: "No",
            oktext: "Sí",
            okfunction: function () {
                let objeto = {};
                objeto['p_codpfl'] = Moduls.app.child.templateGestion.Forms.variablesControl.elementoPerfil['codpfl'];
                Moduls.app.child.templateGestion.Forms.borrarPerfil.set(objeto);
                cerrarModalIE($('#myModal'));
                //  $('#myModal').modal('hide');
                Moduls.app.child.templateGestion.Forms.borrarPerfil.executeForm();
            }
        });
    }
}

function clickDetalle() {
    if (Moduls.app.child.templateGestion.Forms.variablesControl.elementoPerfil == null) {
        toast({ tipo: 'error', msg: 'Seleccione un registro' });
    } else {
        Moduls.app.child.modal.child.modalBody.load({ url: 'modulos/comunes/comunes.html?formDetalleGestionPerfil', script: false });
        construirModal({
            title: "Detalle Asignación",
            canceltext: "Cerrar"
        });
    }
}

function clickAsignacionEmpleado() {
    if (Moduls.app.child.templateGestion.Forms.variablesControl.elementoPerfil == null) {
        toast({ tipo: 'error', msg: 'Seleccione un registro' });
    } else {
        Moduls.app.child.templateGestion.Forms.variablesControl.nuevoPerfil = false;
        $(Moduls.app.child.templateGestion.template).hide();
        Moduls.app.child.templateGestionModal.load({ url: 'modulos/config/perfiles.html', script: true });
        Moduls.app.child.templateParamas = {
            codgrp: 'PERFIL',
            perfil: Moduls.app.child.templateGestion.Forms.variablesControl.elementoPerfil,
            template: Moduls.app.child.templateGestionModal
        };
    }
}

function listadoPerfil(s, d, e) {
    Moduls.app.child.templateGestion.Forms.variablesControl = {};
    if (!s) toast({ tipo: 'error', msg: resuelveError(d) });
}

function selectedRow(data) {
    Moduls.app.child.templateGestion.Forms.variablesControl.elementoPerfil = data;
}

function deselectedRow(data) {
    Moduls.app.child.templateGestion.Forms.variablesControl.elementoPerfil = null;
}

function mostrarPerfil(s, d, e) {
    if (s) {
        if (!Moduls.app.child.templateGestion.Forms.variablesControl.nuevoPerfil) {
            for (let chn in Moduls.app.child.templateGestion.Forms.variablesControl.elementoPerfil) {
                if (e.form.modul.Forms.gestionPerfil.parametros['p_' + chn]) {
                    let objeto = {};
                    objeto['p_' + chn] = Moduls.app.child.templateGestion.Forms.variablesControl.elementoPerfil[chn];
                    e.form.modul.Forms.gestionPerfil.set(objeto);
                    let event = document.createEvent("Event"); event.initEvent('focus', false, true);
                    e.form.modul.Forms.gestionPerfil.parametros['p_' + chn].object.dispatchEvent(event);
                }
            }

            $('#codigoGestionPerfil[name=p_codpfl]').attr("readonly", true);
        }
        e.form.modul.Forms.gestionPerfil.set({ p_flag: (Moduls.app.child.templateGestion.Forms.variablesControl.nuevoPerfil) ? 'I' : 'U' });
    }
}

function gestionPerfil(s, d, e) {
    if (s) {
        toast({ tipo: 'success', msg: d.root.msg });
        Moduls.app.child.templateGestion.Forms.variablesControl.elementoPerfil = null;
        e.form.modul.padre.padre.child.templateGestion.Forms.listadoPerfil.executeForm();
        cerrarModalIE($('#myModal'));
        //$('#myModal').modal('hide');
    } else {
        validaErroresCbk(d, true);
    }
}

function borrarPerfil(s, d, e) {
    if (s) {
        toast({ tipo: 'success', msg: 'El perfil se ha eliminado correctamente' });
        Moduls.app.child.templateGestion.Forms.variablesControl.elementoPerfil = null;
        e.form.modul.padre.child.templateGestion.Forms.borrarPerfil.parametros.p_codpfl.value = null;
        e.form.modul.padre.child.templateGestion.Forms.listadoPerfil.executeForm();
    } else {
        toast({ tipo: 'error', msg: resuelveError(d) });
    }
}

function onLoadDetalle(s, d, e) {
    e.form.modul.Forms.detalleOpcionPerfil.set({ p_codpfl: Moduls.app.child.templateGestion.Forms.variablesControl.elementoPerfil.codpfl });
    e.form.modul.Forms.detalleOpcionPerfil.executeForm();
    e.form.modul.Forms.detalleUsuarioPerfil.set({ p_codpfl: Moduls.app.child.templateGestion.Forms.variablesControl.elementoPerfil.codpfl });
    e.form.modul.Forms.detalleUsuarioPerfil.executeForm();
}

function detalleOpcionPerfil(s, d, e) {
    if (s) {
        $('.listaOpcionPerfil').empty();
        let cadena = e.form.modul.return('modulos/comunes/tabla.html?tablaDetalleOpcionesPerfiles'),
            json = d.root.opcion;
        for (let i = 0; i < json.length; i++) {
            let HTML = $.parseHTML(cadena.reemplazaMostachos(json[i]));
            $('.listaOpcionPerfil').append(HTML);
        }
    } else {
        validaErroresCbk(d, true);
    }
}

function detalleUsuarioPerfil(s, d, e) {
    if (s) {
        $('.listaUsuarioPerfil').empty();
        let cadena = e.form.modul.return('modulos/comunes/tabla.html?tablaDetallePersonasPerfiles'),
            json = d.root.usuario;
        for (let i = 0; i < json.length; i++) {
            let HTML = $.parseHTML(cadena.reemplazaMostachos(json[i]));
            $('.listaUsuarioPerfil').append(HTML);
        }
    } else {
        validaErroresCbk(d, true);
    }
}

function onLoadPerfil(s, d, e) {
    e.form.modul.Forms.datosPerfil.set({ p_subgrp: Moduls.app.child.templateGestion.Forms.variablesControl.elementoPerfil.codpfl });
    e.form.modul.Forms.datosPerfil.executeForm();
}

function datosPerfil(s, d, e) {
    if (s) {
        $('.arbolDepartamento').append(procesarArbol(d.root));
        $('.arbolDepartamento').genTreed(); // Añade clases y imagenes a la lista html para hacerla interactiva

        /*$('.arbolDepartamento.tree li').dblclick(function (e) {
            let me = $(this);
            $('.tree li').each(function () {
                $(this).removeClass('filaSeleccionada');
            });
            me.addClass('filaSeleccionada');
            Moduls.app.child.modal.child.modalBody.Forms.busquedaUsuario.parametros.p_coddep.value = me.attr('id');
            $('#dep-tree').val(me.attr('name'));
            $('#dep-tree').change();
            onInputChange($('#dep-tree'));
            $('.arbolModalDepartamento').addClass('dn');
            return false;
        });*/
    } else toast({ tipo: 'error', msg: resuelveError(d) });
}

function procesarArbol(json) {
    var lista = "";
    for (let i = 0; i < json.children.length; i++) {
        let hijo = json.children[i];
        lista += "<li name='" + (hijo.concepX || hijo.valorcX) + "' id='" + (hijo.concep || hijo.valorc) + "'><div class='tree-node'><span>" + (hijo.concepX || hijo.valorcX) + "</div></span>";
        if (hijo.children !== undefined) {
            if (hijo.concep) {

            }
            lista += "<ul>" + procesarArbol(hijo) + "</ul>";
        }
        lista += "</li>";
    }
    return lista;
}