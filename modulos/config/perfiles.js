
$(function() {

    $('.backGestionPerfil').click(function () {
        if(Moduls.app.child.templateParamas.template.template.id == 'templateGestionModal') {
            $(Moduls.app.child.templateParamas.template.template).hide();
            $(Moduls.app.child.templateGestion.template).show();
        } else {
            $('.divTemplate').removeClass('dn');
            $('.divTemplateModal').addClass('dn');
        }
        
        /*
        Moduls.app.child.templateGestion.load({
            url: 'modulos/config/opciones/gestionPerfil.html',
            script: true
        });
        */
    });

    $('form[name=frmGestionPerfil] [name=p_nomper]').change(function() {
        if($(this).val()) {
            buscarUsuario({
                codusr: $(this).val(),
                extern: 'S',
                ndatos: 'LE',
                fnc: function(usr) { cbkBusquedaUsuario(usr); }
            });
        }
    });
    $('.btnContacto').click(function() {
        buscarUsuario({
            extern: 'S',
            ndatos: 'LE',
            filtro: '00',
            fnc: function(usr) { cbkBusquedaUsuario(usr); }
        });
    });
    $('.btnSociedad').click(function() {
        buscarSociedad(function(soc) {
            Moduls.app.child.templateParamas.template.Forms.frmGestionPerfil.set({
                p_objtiv: (soc.codemp ? soc.codemp : ''),
                p_coddiv: (soc.coddiv ? soc.coddiv : ''),
                p_codsdv: (soc.codsdv ? soc.codsdv : '')
            });
            let socpath = '';
            if(soc.nomemp) {
                socpath += soc.nomemp;
                if(soc.nomdiv) {
                    socpath += ' >> ' + soc.nomdiv;
                    if(soc.nomsdv) {
                        socpath += ' >> ' + soc.nomsdv;
                    }
                }
            }
            $('form[name=frmGestionPerfil] [name=p_nomemp]').val(socpath);
        });
    });

    $('.asignacionEmpleado select').ajaxSuccess(function() {
        switch($(this).attr('name')) {
            case 'p_concep':
                $(this).find('[value="WERKS"]').remove();
                $(this).find('[value="BTRTL"]').remove();
                Moduls.app.child.templateParamas.template.Forms.frmGestionPerfil.set({p_concep: 'PERNR'});
                break;
            case 'p_desemp':
                $(this).prop('selectedIndex', 0).change();
                break;
            case 'p_desdiv':
                this.prepend(new Option('..División..', ''));
                $(this).prop('selectedIndex', 0).change();
                break;
            case 'p_dessdv':
                this.prepend(new Option('..Subdivisión..', ''));
                $(this).prop('selectedIndex', 0).change();
                break;
            case 'p_arenom':
                this.prepend(new Option('..Área de Nómina..', ''));
                $(this).prop('selectedIndex', 0).change();
                break;
            case 'p_trfar':
                this.prepend(new Option('..Convenio..', ''));
                $(this).prop('selectedIndex', 0).change();
                break;
            case 'p_idcon':
                this.prepend(new Option('..Id Contrato..', ''));
                $(this).prop('selectedIndex', 0).change();
                break;
            case 'p_agrprev':
                this.prepend(new Option('..Agrupador Prevención..', ''));
                $(this).prop('selectedIndex', 0).change();
                break;
        }
        $(this).trigger('change');
    });

    $('form[name=frmGestionPerfil] [name=p_concep]').change(function() {
        $('.d-switch').addClass('dn');
        $('.d-'+$(this).val().toLowerCase()).removeClass('dn');
        
        resetInputs();

        controlAccesoBotonera();
    });

    $('form[name=frmGestionPerfil] [name=p_desemp],' +
      'form[name=frmGestionPerfil] [name=p_desdiv],' +
      'form[name=frmGestionPerfil] [name=p_dessdv],' +
      'form[name=frmGestionPerfil] [name=p_arenom],' +
      'form[name=frmGestionPerfil] [name=p_kokrs],' +
      'form[name=frmGestionPerfil] [name=p_idcon],' +
      'form[name=frmGestionPerfil] [name=p_agrprev],' +
      'form[name=frmGestionPerfil] [name=p_trfar]').change(function() {
        Moduls.app.child.templateParamas.template.Forms.frmGestionPerfil.set({
            p_objtiv: $(this).val()
        });
    });

    $('form[name=frmGestionPerfil] [name=nomdep]').click(function () {
        this.blur();
    });
    $('form[name=frmGestionPerfil] .btnDepartamento').click(function () {
        $('form[name=frmGestionPerfil] .arbolDepartamento').toggleClass('dn');
    });

    $('.btnBorrarDepartamento').click(function() {
        borrarDepartamento();
    });

    $('.addOr').click(function() {
        segundaFase('OR');
    });
    $('.addAnd').click(function() {
        segundaFase('AND');
    });
    $('.delPerfil').click(function() {
        segundaFase('DEL');
    });
    $('.btn-add').click(function() {
        let op = Moduls.app.child.templateParamas.template.Forms.frmGestionPerfil.parametros.operacion.value;
        if(op == 'OR') {
            let objtiv = Moduls.app.child.templateParamas.template.Forms.frmGestionPerfil.parametros.p_objtiv.value;
            let concep = Moduls.app.child.templateParamas.template.Forms.frmGestionPerfil.parametros.p_concep.value;
            if(objtiv && concep) {
                Moduls.app.child.templateParamas.template.Forms.frmGestionPerfil.set({
                    p_vpadre: '',
                    p_ipadre: ''
                });
                Moduls.app.child.templateParamas.template.Forms.frmGestionPerfil.executeForm();
            } else {
                if(!concep) toast({tipo: 'error', msg: 'El concepto es obligatorio'});
                if(!objtiv) toast({tipo: 'error', msg: 'El valor de concepto es obligatorio'});
            }
        } else if(op == 'AND') {
            let objtiv = Moduls.app.child.templateParamas.template.Forms.frmGestionPerfil.parametros.p_objtiv.value;
            let concep = Moduls.app.child.templateParamas.template.Forms.frmGestionPerfil.parametros.p_concep.value;
            if(objtiv && concep) {
                Moduls.app.child.templateParamas.template.Forms.frmGestionPerfil.set({
                    p_vpadre: Moduls.app.child.templateParamas.template.Forms.frmGestionPerfil.parametros.p_vpaaux.value,
                    p_ipadre: Moduls.app.child.templateParamas.template.Forms.frmGestionPerfil.parametros.p_ipaaux.value
                });
                Moduls.app.child.templateParamas.template.Forms.frmGestionPerfil.executeForm();
            } else {
                if(!concep) toast({tipo: 'error', msg: 'El concepto es obligatorio'});
                if(!objtiv)  toast({tipo: 'error', msg: 'El valor de concepto es obligatorio'});
            }
        } else if(op == 'DEL') {
            Moduls.app.child.modal.child.modalBody.load({ url: 'modulos/comunes/comunes.html?confirmarBorrarPerfil', script: false });
            construirModal({
                title: 'Confirma borrar el perfil?',
                w: 700, h: 700,
                ocultarXCerrar: true,
                canceltext: 'CANCELAR',
                oktext: "CONFIRMAR",
                okfunction: function () {
                    let nodo = getNodoSeleccionado();
                    Moduls.app.child.templateParamas.template.Forms.frmBorrarPerfil.set({
                        p_vpadre: Moduls.app.child.templateParamas.template.Forms.frmGestionPerfil.parametros.p_vpaaux.value,
                        p_ipadre: Moduls.app.child.templateParamas.template.Forms.frmGestionPerfil.parametros.p_ipaaux.value,
                        p_delfrt: esConcepto(nodo.attr('id')) ? 'N' : 'S'
                    });
                    Moduls.app.child.templateParamas.template.Forms.frmBorrarPerfil.executeForm();
                    Moduls.app.child.templateParamas.template.Forms.frmBorrarPerfil.set({
                        p_vpadre: '',
                        p_ipadre: '',
                        p_delfrt: ''
                    });
                    cerrarModalIE($('#myModal'));
                }
            });
        }
    });

    $('.btn-refresh').click(function() {
        $(this).blur();
        Moduls.app.child.templateParamas.template.Forms.datosPerfil.executeForm();
    });

    $('.btn-volver').click(function() {
        primeraFase();
    });

    onload();
});

function onload() {
    Moduls.app.child.templateParamas.template.Forms.datosPerfil.set({
        p_codgrp: Moduls.app.child.templateParamas.codgrp,
        p_subgrp: Moduls.app.child.templateParamas.perfil.codpfl
    });
    Moduls.app.child.templateParamas.template.Forms.frmGestionPerfil.set({
        p_codgrp: Moduls.app.child.templateParamas.codgrp,
        p_subgrp: Moduls.app.child.templateParamas.perfil.codpfl
    });
    Moduls.app.child.templateParamas.template.Forms.frmBorrarPerfil.set({
        p_codgrp: Moduls.app.child.templateParamas.codgrp,
        p_subgrp: Moduls.app.child.templateParamas.perfil.codpfl
    });
    Moduls.app.child.templateParamas.template.Forms.datosPerfil.executeForm();

    Moduls.app.child.templateParamas.template.treeState = [];
    
    $('.asignacionEmpleado .titulo-perfil').html(Moduls.app.child.templateParamas.perfil.codpfl);

    $(Moduls.app.child.templateParamas.template.template).show();
}

function datosPerfil(s, d, e) {
    if (s) {
        $('.arbolPerfil').empty();
        if(d.root.children[0].concep != "") {
            $('.arbolPerfil').append(procesarArbol(d.root));
            $('.arbolPerfil').genTreed(); // Añade clases y imagenes a la lista html para hacerla interactiva
        }

        $('.arbolPerfil.tree li span').click(function (e) {
            $('.tree li span').each(function () {$(this).removeClass('filaSeleccionada2');});
            $(this).addClass('filaSeleccionada2');
            
            Moduls.app.child.templateParamas.template.Forms.frmGestionPerfil.set(parametrosSeleccionados());
            controlAccesoBotonera();
            return false;
        });

        initTree();
        controlAccesoBotonera();
    } else toast({tipo: 'error', msg: resuelveError(d)});
}

function procesarArbol(json) {
    var lista = "";
    for (let i = 0; i < json.children.length; i++) {
        let hijo = json.children[i];
        if(hijo.valorf != 'N') lista += "<li name='" + (hijo.concepX || hijo.valorcX) + "' id='" + (hijo.concep || hijo.valorc) + "' indice='" + hijo.indice + "'><div class='tree-node'><span>" + (hijo.concepX || hijo.valorcX ? hijo.concepX || hijo.valorcX : hijo.concep || hijo.valorc) + "</div></span>";
        if (hijo.children !== undefined) {
            if (hijo.concep) {

            }
            lista += "<ul>" + procesarArbol(hijo) + "</ul>";
        }
        lista += "</li>";
    }
    return lista;
}

function cbkGestionPerfil(s, d, e) {
    if (s) {
        resetInputs();
        primeraFase();
        Moduls.app.child.templateParamas.template.Forms.datosPerfil.executeForm();
        toast({tipo: 'success', msg: d.root});
    } else toast({tipo: 'error', msg: resuelveError(d)});
}

function cbkBusquedaUsuario(usr) {
    Moduls.app.child.templateParamas.template.Forms.frmGestionPerfil.set({
        p_objtiv: usr.pernr,
        p_nomper: usr.nombre
    });
}

// Cargar el arbol de departamento
function obtenerArbolDepartamentos(s, d, e) {
    if(s) {
        $('form[name=frmGestionPerfil] .arbolDepartamento').append(procesarArbolDep(d));
        $('form[name=frmGestionPerfil] .arbolDepartamento').genTreed(); // Añade clases y imagenes a la lista html para hacerla interactiva

        $('form[name=frmGestionPerfil] .arbolDepartamento.tree li').dblclick(function (e) {
            let me = $(this);
            $('form[name=frmGestionPerfil] .tree li').each(function () {
                $(this).removeClass('filaSeleccionada');
            });
            me.addClass('filaSeleccionada');

            Moduls.app.child.templateParamas.template.Forms.frmGestionPerfil.set({
                p_objtiv: me.attr('id')
            });

            $('form[name=frmGestionPerfil] [name=nomdep]').val(me.attr('name'));
            $('form[name=frmGestionPerfil] [name=nomdep]').change();
            $('form[name=frmGestionPerfil] .arbolDepartamento').addClass('dn');
            return false;
        });
    } else {
        validaErroresCbk(d, true);
    }
}
function borrarDepartamento() {
    Moduls.app.child.templateParamas.template.Forms.frmGestionPerfil.set({
        p_objtiv: '',
        nomdep: ''
    });
    $(this).parent().children('input').change();
}
function procesarArbolDep(json) {
    var lista = "";
    for (let i = 0; i < json.children.length; i++) {
        let hijo = json.children[i];
        lista += "<li name='" + hijo.uniorg + "' id='" + hijo.id + "'><div class='tree-node'><span>" + hijo.uniorg + "</div></span>";
        if (hijo.children !== undefined) lista += "<ul>" + procesarArbolDep(hijo) + "</ul>";
        lista += "</li>";
    }
    return lista;
}

function parametrosSeleccionados() {
    let params = {p_vpaaux: '', p_ipaaux: ''};
    let nodo = getNodoSeleccionado();
    if(nodo.length > 0) {
        if(esConcepto(nodo.attr('id'))) {
            let padre = getNodoPadre(nodo);
            if(padre) {
                params = {p_vpaaux: padre.attr('id'), p_ipaaux: padre.attr('indice')};
            } else {
                let hijo = getNodoHijo(nodo).first();
                params = {p_vpaaux: '', p_ipaaux: hijo.attr('indice')};
            }
        } else {
            params = {p_vpaaux: nodo.attr('id'), p_ipaaux: nodo.attr('indice')};
        }
    }
    return params;
}

function controlAccesoBotonera() {
    let nodo = getNodoSeleccionado();
    let op = Moduls.app.child.templateParamas.template.Forms.frmGestionPerfil.parametros.operacion.value;
    if(op == 'OR') {
        habilitarPonerCondicion(true);
    } else if(op == 'AND') {
        if(nodo.length == 0) {
            habilitarPonerCondicion(false);
        } else if(esConcepto(nodo.attr('id'))) {
            let padre = getNodoPadre(nodo);
            if(padre) {
                habilitarPonerCondicion(nodo.attr('id'));
            } else {
                habilitarPonerCondicion(false);
            }
        } else {
            let hijo = getNodoHijo(nodo).first();
            if(hijo.length > 0) {
                habilitarPonerCondicion(hijo.attr('id'));
            } else {
                let padre = getNodoPadre(nodo);
                deshabilitarPonerCondicion(padre.attr('id'));
            }
        }
    } else if(op == 'DEL') {
        habilitarPonerCondicion(nodo.length != 0);
    }
}

function getRoot() {
    return $('.arbolPerfiles');
}

function getNodoSeleccionado() {
    return $('.filaSeleccionada2').parent().parent();
}

function getNodoPadre(nodo) {
    return nodo.parent().hasClass('arbolPerfil') ? null : nodo.parent().parent()
}

function getNodoHijo(nodo) {
    return nodo.children('ul').children('li');
}

function esConcepto(p) {
    let conceps = ['TRFAR', 'BUKRS', 'WERKS', 'BTRTL', 'PERNR', 'KOKRS', 'ORGEH', 'ABKRS', 'IDCON', 'AGRPRV'];
    return conceps.indexOf(p) != -1;
}

function habilitarPonerCondicion(condicion) {
    if(condicion === true) {
        $('.btn-add').prop("disabled", false);
    } else if(condicion === false) {
        $('.btn-add').prop("disabled", true);
    } else {
        $('.btn-add').prop("disabled", $('form[name=frmGestionPerfil] [name=p_concep]').val() != condicion);
    }
}

function deshabilitarPonerCondicion(condicion) {
    let concep = $('form[name=frmGestionPerfil] [name=p_concep]').val();
    $('.btn-add').prop(
        "disabled",
        concep == condicion || (concep == 'BUKRS' && (condicion == 'WERKS' || condicion == 'BTRTL')));
}

function resetInputs() {
    $('form[name=frmGestionPerfil] [name=p_objtiv],' +
        'form[name=frmGestionPerfil] [name=p_nomper],' +
        'form[name=frmGestionPerfil] [name=p_kokrs],'  +
        'form[name=frmGestionPerfil] [name=p_nomemp]').val('');

    borrarDepartamento();
    
    $('form[name=frmGestionPerfil] [name=p_arenom],' +
      'form[name=frmGestionPerfil] [name=p_idcon],' +
      'form[name=frmGestionPerfil] [name=p_agrprev],' +
      'form[name=frmGestionPerfil] [name=p_trfar]').prop('selectedIndex', 0).change();
}

function primeraFase() {
    resetInputs();
    $('.asignacionEmpleado .botonera').removeClass('dn');
    $('.asignacionEmpleado .formulario').addClass('dn');
    $('.asignacionEmpleado .titulo').html('Asignación de Perfiles');
}

function segundaFase(op) {
    $('.asignacionEmpleado .botonera').addClass('dn');
    $('.asignacionEmpleado .formulario').removeClass('dn');

    Moduls.app.child.templateParamas.template.Forms.frmGestionPerfil.set({operacion: op});
    $('.asignacionEmpleado .titulo').html(function(){
        switch(op) {
            case 'OR':  return 'Añadir Nivel';
            case 'AND': return 'Añadir Condición';
            case 'DEL': return 'Borrar Condición';
            default: return 'Asignación de Perfiles';
        }
    });
    $('.asignacionEmpleado .btn-add').html(function(){
        switch(op) {
            case 'OR':  return '<i class="material-icons">playlist_add</i><span>Añadir</span>';
            case 'AND': return '<i class="material-icons">playlist_add</i><span>Añadir</span>';
            case 'DEL': return '<i class="material-icons">delete</i><span>Borrar</span>';
            default: return '<i class="material-icons">playlist_add</i><span>Añadir</span>';
        }
    });
    if(op == 'DEL') {
        $('.hide-on-del').addClass('dn');
    } else {
        $('.d-'+$('form[name=frmGestionPerfil] [name=p_concep]').val().toLowerCase()+'.hide-on-del, ' + 
          '.inpt-concep.hide-on-del').removeClass('dn');
    }

    controlAccesoBotonera();
}

function initTree() {
    $('.tree-node i').click(function() {
        let state = Moduls.app.child.templateParamas.template.treeState;
        let id = $(this).parent().parent().attr('id');
        let icon = $(this).first();
        let path = getTreePath(this);
        if (icon.text() == 'add_circle') {
            for(let i = 0; i < path.length; i++) {
                let parent = path[i];
                let index = state.map(function(e) {return e.id;}).indexOf(parent);
                if(i == (path.length - 1)) {
                    state[index].id = 'xxCLLxx'+state[index].id;
                } else {
                    state = state[index].children;
                }
            }
            state = state.filter(function(obj) {return obj.id != id;});
        } else {
            for(let i = 0; i < path.length; i++) {
                let parent = path[i];
                let index = state.map(function(e) {return e.id;}).indexOf(parent);
                if(index == -1) {
                    index = state.map(function(e) {return e.id;}).indexOf('xxCLLxx'+parent);
                    if(index == -1) {
                        state.push({id: id, children: []});
                    } else {
                        state[index].id = id;
                    }
                    break;
                } else {
                    state = state[index].children;
                }
            }
        }
    });
    
    expandirNodos(
        getRoot(),
        Moduls.app.child.templateParamas.template.treeState
    );
}

function expandirNodos(nodo, state) {
    let hijos = getNodoHijo(nodo);
    hijos.each(function () {
        let index = state.map(function(e) {return e.id;}).indexOf($(this).attr('id'));
        if(index != -1) {
            expand($(this));
            expandirNodos($(this), state[index].children);
        } else {
            index = state.map(function(e) {return e.id;}).indexOf('xxCLLxx'+$(this).attr('id'));
            if(index != -1) expandirNodos($(this), state[index].children);
        }
    });
}

function getTreePath(element) {
    let result = [];
    let parent = $(element).parent().parent();
    while(!parent.hasClass('arbolPerfiles')) {
        result.unshift(parent.attr('id'));
        parent = $(parent).parent().parent();
    }
    return result;
}

function expand(element) {
    let icon = element.children('.tree-node').children('i');
    icon.first().addClass("iconoMenos");
    icon.first().text('remove_circle_outline');
    icon.parent().parent().children('ul').children().toggle();
}