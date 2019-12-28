
$('.tipoExclusionSelect').ajaxSuccess(function(){
    this.prepend(new Option('', ''));
    this.selectedIndex = "0";
});

function listadoExclusiones(s, d, e) {
    Moduls.app.child.templateGestion.Forms.variablesControl = {};
    if (s) {
        $('#listaExclusiones').empty();
        let cadena = e.form.modul.return('modulos/comunes/tabla.html?tablaExclusiones'),
            json = d.root.uexlist;
        for (let i = 0; i < json.length; i++) {
            let HTML = $.parseHTML(cadena.reemplazaMostachos(json[i]));
            HTML[0].addEventListener('click', function () {
                $('.listado .tabla .row').removeClass('filaSeleccionada');
                $(this).addClass('filaSeleccionada');
                Moduls.app.child.templateGestion.Forms.variablesControl.exclusionSeleccionada = json[i];
            });
            $('#listaExclusiones').append(HTML);
        }
    } else {
        toast({ tipo: 'error', msg: resuelveError(d) });
    }
}

$('.modalExclusion').click(function () {
    Moduls.app.child.modal.child.modalBody.load({ url: 'modulos/comunes/comunes.html?formNuevoEditarExclusion', script: false });
    if ($(this).text().toLowerCase() === "nuevo") {
        Moduls.app.child.templateGestion.Forms.variablesControl.nuevaExclusion = true;
        construirModal({ title: "Nueva exclusión" });
    } else if ($(this).text().toLowerCase() === "modificar") {
        if (Moduls.app.child.templateGestion.Forms.variablesControl.exclusionSeleccionada == null) {
            toast({ tipo: 'error', msg: 'Seleccione un registro' });
        } else {
            Moduls.app.child.templateGestion.Forms.variablesControl.nuevaExclusion = false;
            construirModal({ title: "Modificar exclusión" });
        }
    }
});

function initModalExclusiones(s, d, e) {
    var evar = Moduls.app.child.templateGestion.Forms.variablesControl,
        enew = evar.nuevaExclusion,
        esel = evar.exclusionSeleccionada;

    $('.tipoExclusionModalSelect').prepend(new Option('', ''));
    if(enew) {
        e.form.modul.Forms.gestionExclusiones.set({
            p_pkctex: '',
            p_pkcusr: '',
            p_pkfhst: '',
            p_opflag: 'I'});
        $('.tipoExclusionModalSelect').selectedIndex = "0";
        $("input[name='p_codusr']").change(function(e){ loadUser(); });
    } else if(esel) {
        e.form.modul.Forms.gestionExclusiones.set({
            p_pkctex: esel.codtex,
            p_pkcusr: esel.codusr,
            p_pkfhst: esel.fhasta,
            p_codtex: esel.codtex,
            p_codusr: esel.codusr,
            p_fdesde: formatDate(esel.fdesde),
            p_fhasta: formatDate(esel.fhasta),
            p_opflag: 'U'});
            $("input[name='p_codusr']").prop('readonly', true);
            $(".tipoExclusionModalSelect").prop("disabled", true); 
            $("input[name='p_fdesde']").prop('readonly', true);
            loadUser();
    }
}
function loadUser() {
    datosUsuarioLast({
        usr: $("input[name='p_codusr']").val(),
        fnc: 'cbkDatosUsr'});
}
function cbkDatosUsr(usr) {
    $('#nombreUsuario').val(usr.nombre);
}

function gestionExclusiones(s, d, e) {
    if (s) {
        finProcesoGuardar(d);
    } else {
        if (d.length) {
            var msg = 'Los siguientes campos son obligatorios: ';
            for (let i = 0; i < d.length; i++) {
                if (d[i].type === 'required') msg = msg + d[i].label + ((i != d.length -1) ? ', ': '');
            }
            toast({ tipo: 'error', msg: msg, donde: '.modal-header' });
        } else {
            toast({ tipo: 'error', msg: resuelveError(d), donde: '.modal-header' });
        }
    }
}

$('.borrarExclusion').click(function () {
    var esel = Moduls.app.child.templateGestion.Forms.variablesControl.exclusionSeleccionada;
    
    if(esel) {
        Moduls.app.child.modal.child.modalBody.load({ url: 'modulos/comunes/comunes.html?mensajeBorrar', script: false });
        construirModal({
            title: 'Exclusiones',
            w: 300,
            canceltext: "No",
            oktext: "Sí",
            okfunction: function () {
                Moduls.app.child.templateGestion.Forms.borrarExclusiones.set({
                    p_pkctex: esel.codtex,
                    p_pkcusr: esel.codusr,
                    p_pkfhst: esel.fhasta,
                    p_fhasta: getYesterdaysDate(),
                    p_opflag: 'U'
                });
                cerrarModalIE($('#myModal'));
                Moduls.app.child.templateGestion.Forms.borrarExclusiones.executeForm();
            }
        });
    } else {
        toast({ tipo: 'error', msg: 'Seleccione un registro' });
    } 
});
function borrarExclusiones(s, d, e) {
    if (s) {
        toast({ tipo: 'success', msg: 'La exclusión se ha eliminado correctamente' });
        Moduls.app.child.templateGestion.Forms.variablesControl.exclusionSeleccionada = null;
        //e.form.modul.padre.child.templateGestion.Forms.borrarExclusiones.parametros.p_codmop.value = null;
        Moduls.app.child.templateGestion.Forms.listadoExclusiones.executeForm();
    } else {
        toast({ tipo: 'error', msg: resuelveError(d) });
    }
}

function formatDate(date) {
    return date.split("/").reverse().join("-");
}
function getYesterdaysDate() {
    var date = new Date();
    date.setDate(date.getDate()-1);
    return date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear();
}

function finProcesoGuardar(d) {
    var evar = Moduls.app.child.templateGestion.Forms.variablesControl,
        enew = evar.nuevaExclusion,
        esel = evar.exclusionSeleccionada;

    if(enew) toast({ tipo: 'success', msg: 'Exclusión creada correctamente' });
    else toast({ tipo: 'success', msg: 'Exclusión modificada correctamente' });

    evar.exclusionSeleccionada = null;
    Moduls.app.child.templateGestion.Forms.listadoExclusiones.executeForm();
    cerrarModalIE($('#myModal'));
}

/*
$(function() {

    Moduls.app.child.templateAplicacion.child.modal.load({ url: 'modulos/comunes/modal.html', script: false });

    $('#btn-insrt-fraseslogin').click(function() {
        Moduls.app.child.templateAplicacion.child.modal.child.modalBody.load({ url: 'modulos/frasesInicio/frasesInicioModal.html', script: true });
        Moduls.app.child.templateAplicacion.Forms.modifyPhrasesInfo.set({ 
            p_desc: '',
            p_fini: '',
            p_ffin: ''
        });
        construirModal({
            title: 'Añadir frase de inicio',
            w: 700, h: 700,
            ocultarXCerrar: true,
            canceltext: 'CANCELAR',
            oktext: "GUARDAR",
            okfunction: function () {
                Moduls.app.child.templateAplicacion.child.modal.child.modalBody.Forms.addFraseInicio.set({ 
                    p_flag: 'I'
                });
                Moduls.app.child.templateAplicacion.child.modal.child.modalBody.Forms.addFraseInicio.executeForm();

            }
        });
    });
});

function modifyFrasesLogin(cod, des, fci, fcf) {
    Moduls.app.child.templateAplicacion.child.modal.child.modalBody.load({ url: 'modulos/frasesInicio/frasesInicioModal.html', script: true });
    Moduls.app.child.templateAplicacion.Forms.modifyPhrasesInfo.set({ 
        p_desc: des,
        p_fini: fci,
        p_ffin: fcf
    });
    construirModal({
        title: 'Modificar frase de inicio',
        w: 700, h: 700,
        ocultarXCerrar: true,
        canceltext: 'CANCELAR',
        oktext: "GUARDAR",
        okfunction: function () {
            Moduls.app.child.templateAplicacion.child.modal.child.modalBody.Forms.addFraseInicio.set({ 
                p_codfra: cod,
                p_flag: 'U'
            });
            Moduls.app.child.templateAplicacion.child.modal.child.modalBody.Forms.addFraseInicio.executeForm();

            Moduls.app.child.templateAplicacion.Forms.listaFrasesLogin.executeForm();
        }
    });
}

function deleteFrasesLogin(code) {
    construirModal({
        title: 'Seguro que desea borrar la frase?',
        w: 500,
        ocultarXCerrar: true,
        canceltext: 'NO',
        oktext: "SI",
        okfunction: function () {
            Moduls.app.child.templateAplicacion.Forms.borrarFrasesLogin.set({ 
                p_codfra: code,
                p_flag: 'D'
            });
            Moduls.app.child.templateAplicacion.Forms.borrarFrasesLogin.executeForm();
        }
    });
}
function deleteFrasesInicio(s, d, e) {
    if (s) {
        cerrarModalIE($('#myModal'));
        Moduls.app.child.templateAplicacion.Forms.listaFrasesLogin.executeForm();
    } else {
        toast({ tipo: 'error', msg: resuelveError(d), donde: '.modal-header' });
    }
}

function listaFrasesLogin(s, d, e) {
    if (s) {
        $('#listaFrasesLogin').empty();
        let cadena = e.form.modul.return('modulos/comunes/tabla.html?tablaFrasesLogin'),
            json = d.root.children;

        for (let i = 0; i < json.length; i++) {
            let HTML = $.parseHTML(cadena.reemplazaMostachos(json[i]));
            $('#listaFrasesLogin').append(HTML);
        }
    } else {
        toast({ tipo: 'error', msg: resuelveError(d) });
    }
}

*/