
$(function() {
    
    $('form[name=busquedaSociedad] select').change(function() {
        onInputChange(this);
    });
    $('form[name=busquedaSociedad] select').ajaxSuccess(function() {
        if(this.options.length > 0 && this.options[0].value == '') {
            this.options[0] = new Option('', '');
        } else {
            this.prepend(new Option('', ''));
        }
        this.selectedIndex = "0";
        onInputChange(this);
    });

    $('.btnSeleccionSociedad').click(function() {
        Moduls.app.child.modal.companysearchparams({
            codemp: $('form[name=busquedaSociedad] [name=p_codemp] option:selected').val(),
            nomemp: $('form[name=busquedaSociedad] [name=p_codemp] option:selected').text(),
            coddiv: $('form[name=busquedaSociedad] [name=p_coddiv] option:selected').val(),
            nomdiv: $('form[name=busquedaSociedad] [name=p_coddiv] option:selected').text(),
            codsdv: $('form[name=busquedaSociedad] [name=p_codsdv] option:selected').val(),
            nomsdv: $('form[name=busquedaSociedad] [name=p_codsdv] option:selected').text()
        });
        cerrarModalIE($('#myModal'));
    });

    onload();
});

function onload() {}

// Carga los combos de empresas, divisiones y sub-divisiones
function onInputChange(enviroment) {
    if(!$(enviroment).val() || $(enviroment).val() == null || $(enviroment).val() == '') {
        $(enviroment).parent().children().removeClass("active");
    } else {
        $(enviroment).parent().children().addClass("active");
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
                    cerrarModalIE($('#myModal'));
                    Moduls.app.child.modal.usersearchparams.fnc(json[i]);
                });
                $('#listaUsuarios').append(HTML);
            }
            let params = Moduls.app.child.modal.child.modalBody.Forms.busquedaUsuario.parametros;
            if(params.p_inicio.value != 1) $('.page-prev').removeClass('disabled');
            if(json.length > 5) $('.page-next').removeClass('disabled');
        } else {
            toast({ tipo: 'success', msg: 'No se han encontrado resultados', donde: '.modal-header' });
        }
    } else {
        validaErroresCbk(d, true);
    }
}