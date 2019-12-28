
$(function() {
    
    $('form[name=busquedaUsuario] select').change(function() {
        onInputChange(this);
    });
    $('form[name=busquedaUsuario] select').ajaxSuccess(function() {
        if(this.options.length > 0 && this.options[0].value == '') {
            this.options[0]= new Option('', '');
        } else {
            this.prepend(new Option('', ''));
        }
        this.selectedIndex = "0";
        onInputChange(this);
    });

    $('.btnBorrarDepartamento').click(function() {
        dondeEstoy(this).set({p_coddep: '', nomdep: ''});
        $(this).parent().children('input').change();
    });

    $('#dep-tree').click(function () {
        this.blur();
    });
    $('#btnDepartamento').click(function () {
        $('form[name=busquedaUsuario] .arbolModalDepartamento').toggleClass('dn');
    });

    $('.input-btn').click(function() {
        Moduls.getModalbodysearchusr().getForm('busquedaUsuario').executeForm();
    });
    
    $('.page-prev').click(function() {
        let form = Moduls.getModalbodysearchusr().getForm('busquedaUsuario');
        form.set({"p_inicio": Number(form.parametros.p_inicio.value) - 5});
        $('.page-item').addClass('disabled');
        form.executeForm();
    });
    $('.page-next').click(function() {
        let form = Moduls.getModalbodysearchusr().getForm('busquedaUsuario');
        form.set({"p_inicio": Number(form.parametros.p_inicio.value) + 5});
        $('.page-item').addClass('disabled');
        form.executeForm();
    });
    $("form[name=busquedaUsuario] input[name='p_nombre']").on('input', function() {
        Moduls.getModalbodysearchusr().getForm('busquedaUsuario').set({"p_inicio": 1});
        $('.page-item').addClass('disabled');
    });
    $("#dep-tree, form[name=busquedaUsuario] select").change(function() {
        Moduls.getModalbodysearchusr().getForm('busquedaUsuario').set({"p_inicio": 1});
        $('.page-item').addClass('disabled');
    });

    onload();
});

// Carga los combos de empresas, divisiones y sub-divisiones
function onInputChange(enviroment) {
    if(!$(enviroment).val() || $(enviroment).val() == null || $(enviroment).val() == '') {
        $(enviroment).parent().children().removeClass("active");
    } else {
        $(enviroment).parent().children().addClass("active");
    }
}

// Cargar el arbol de departamento
function obtenerArbolDepartamentos(s, d, e) {
    if(s) {
        $('form[name=busquedaUsuario] .arbolDepartamento').append(procesarArbol(d));
        $('form[name=busquedaUsuario] .arbolDepartamento').genTreed(); // Añade clases y imagenes a la lista html para hacerla interactiva

        $('form[name=busquedaUsuario] .arbolDepartamento.tree li').dblclick(function (e) {
            let me = $(this);
            $('form[name=busquedaUsuario] .tree li').each(function () {
                $(this).removeClass('filaSeleccionada');
            });
            me.addClass('filaSeleccionada');
            Moduls.getModalbodysearchusr().getForm('busquedaUsuario').parametros.p_coddep.value = me.attr('id');
            $('#dep-tree').val(me.attr('name'));
            $('#dep-tree').change();
            onInputChange($('#dep-tree'));
            $('form[name=busquedaUsuario] .arbolModalDepartamento').addClass('dn');
            return false;
        });
    } else {
        validaErroresCbk(d, true);
    }
}
function procesarArbol(json) {
    var lista = "";
    for (let i = 0; i < json.children.length; i++) {
        let hijo = json.children[i];
        lista += "<li name='" + hijo.uniorg + "' id='" + hijo.id + "'><div class='tree-node'><span>" + hijo.uniorg + "</div></span>";
        if (hijo.children !== undefined) lista += "<ul>" + procesarArbol(hijo) + "</ul>";
        lista += "</li>";
    }
    return lista;
}

function onload() {
    let params = Moduls.getModalbodysearchusr().usersearchparams;
    Moduls.getModalbodysearchusr().getForm('busquedaUsuario').set(params);
    const form =  Moduls.getModalbodysearchusr().getForm('busquedaUsuario');

    if (params.p_dniusr.length > 0) {
        let paramsDni = params.p_dniusr;
        form.parametros.p_filtro.value = params.p_filtro = '00';
        paramsDni = paramsDni.replace(/[.]|[,]|[ ]|[a-z]|[-]|[/]/gi, '');
        form.parametros.p_dniusr.value = paramsDni;
        Moduls.getModalbodysearchusr().getForm('busquedaUsuario').executeForm();
        //consultarLis({});
    } else {
        //busEmpresa();
        $('form[name=busquedaUsuario] .input-name').removeClass('dn');
        $('.input-btn').removeClass('dn');
        if(params.p_filtro.substr(0,1) == '1') {
            $('form[name=busquedaUsuario] .input-div').removeClass('dn');
            Moduls.getModalbodysearchusr().getForm('busquedaUsuario').set({"combo-onload":"JSON"});
        } 
        if(params.p_filtro.substr(1,1) == '1') {
            $('form[name=busquedaUsuario] .input-dep').removeClass('dn');
            Moduls.getModalbodysearchusr().Forms.obtenerArbolDepartamentos.executeForm();
        }
    }
}

// Callback de la búsqueda de usuarios
function busquedaUsuario(s, d, e) {
    if(s) {
        $('#listaUsuarios').empty();
        let cadena = e.form.modul.return('modulos/comunes/tabla.html?tablaUsuarios'),
            json = d.dato;
        if(json) {
            let jlength = (json.length==6) ? json.length -1 : json.length;
            for (let i = 0; i < jlength; i++) {
                let HTML = $.parseHTML(cadena.reemplazaMostachos(json[i]));
                HTML[0].addEventListener('click', function () {
                    $('.listado .tabla .row').removeClass('filaSeleccionada');
                    $(this).addClass('filaSeleccionada');
                    //Moduls.app.child.templateGestion.Forms.variablesControl.usuarioSeleccionada = json[i];
                    cerrarModalIE($('#myModalSearchUsr'));
                    Moduls.getModalbodysearchusr().usersearchparams.fnc(json[i]);
                });
                $('#listaUsuarios').append(HTML);
            }
            let params = Moduls.getModalbodysearchusr().getForm('busquedaUsuario').parametros;
            if(params.p_inicio.value != 1) $('.page-prev').removeClass('disabled');
            if(json.length > 5) $('.page-next').removeClass('disabled');
        } else {
            toast({ tipo: 'success', msg: 'No se han encontrado resultados', donde: '.modal-header' });
        }
    } else {
        validaErroresCbk(d, true);
    }
}