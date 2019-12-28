$('.listinBuscarKeyUp').keyup(function (key) {
    if (key.keyCode === 13) {
        if (Moduls.app.Forms.busquedaListinTelefonico !== undefined) {
            if (Moduls.app.Forms.busquedaListinTelefonico.parametros.p_nomusr.value != Moduls.app.Forms.busquedaListinTelefonico.parametros.p_nomusr.object.value) {
                Moduls.app.Forms.busquedaListinTelefonico.set({ p_nomusr: Moduls.app.Forms.busquedaListinTelefonico.parametros.p_nomusr.object.value });
            }
        }
        let event = document.createEvent("Event"); event.initEvent('click', false, true);
        $('.listinBuscarClick')[0].dispatchEvent(event);
    }
});

$(document).ready(function () {
    Moduls.app.child.modal.load({ url: 'modulos/comunes/modal.html', script: false });

    Moduls.app.child.cajaBanners1.load({
        url: 'modulos/home/banners/banners.html',
        script: true
    });

    Moduls.app.child.cajaPreFooter1.load({
        url: 'modulos/home/pre-footer/pre-footer.html',
        script: true
    });
    $('[data-toggle="tooltip"]').tooltip({
        template: '<div class="tooltip show"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
    });

    $('form[name=busquedaListinTelefonico] select').ajaxSuccess(function () {
        this.selectedIndex = "0";
    });
});

function cargarFiltrosBusqueda(s, d, e) {
    if (s) {
        let listin = e.form.modul.Forms.busquedaListinTelefonico;
        listin.set(e.form.modul.busquedaListin);
        delete (e.form.modul.busquedaListin);
        listin.parametros.p_codemp.object.addEventListener('ajaxSuccess', function () {
            listin.executeForm();
            $('.mis-contactos select').children('option:first').text('Empresa');
        });
    } else {
        toast({ tipo: 'error', msg: resuelveError(d) });
    }
}

function busquedaListinTelefonico(s, d, e) {
    // Se vacía el listado y la paginación
    $('#listaUsrListTelef').empty();
    $('.pagination').empty();
    if (s) {
        let json = d.root.usuario;

        // Se informan los datos de la label que muestra el total de registros encontrados y los campos por los que se filtra.
        e.form.modul.Forms.resultadosBúsqueda.set({
            total: (json.length == 0) ? 'NO SE HAN ENCONTRADO RESULTADOS DE BÚSQUEDA PARA: ' : + json.length + ' RESULTADOS DE BÚSQUEDA PARA: ',
            busquedaNom: e.form.parametros.p_nomusr.value,
            busquedaTel: (e.form.parametros.p_telusr.value != '') ? ((e.form.parametros.p_nomusr.value != '') ? ' / ' : '') + e.form.parametros.p_telusr.value : '',
            busquedaEmp: (e.form.parametros.p_codemp.value != '') ? ((e.form.parametros.p_nomusr.value != '' || e.form.parametros.p_telusr.value != '') ? ' / ' : '') + getSelectText(e.form.parametros.p_codemp.object, e.form.parametros.p_codemp.value) : ''
        });

        // Calcula número de páginas para la paginación
        let numPagi = Math.ceil(json.length / 15);
        let paginacion = '';
        for (let i = numPagi; i > 0; i--) {
            paginacion = (i == numPagi) ? '<a class="pagina" href="#">' + i + '</a>' + paginacion : '<a class="pagina" href="#">' + i + '</a> · ' + paginacion;
        }
        $('.pagination').append(paginacion);
        $('.pagina').first().addClass('paginaSelect');
        $('.pagina').click(function () {
            $('.pagina').removeClass('paginaSelect');
            $(this).addClass('paginaSelect');
            let pagina = parseInt(this.text);
            mostrarUsuariosPaginados(e, json, (pagina - 1) * 15, pagina * 15 - 1);
        });

        mostrarUsuariosPaginados(e, json, 0, 14);
    } else {
        // No se han encontrado resultados
        e.form.modul.Forms.resultadosBúsqueda.set({
            total: 'APLIQUE LOS FILTROS, SE HAN ENCONTRADO MUCHOS USUARIOS',
            busquedaNom: '',
            busquedaTel: '',
            busquedaEmp: ''
        });
        toast({ tipo: 'error', msg: resuelveError(d) });
    }
}

function mostrarUsuariosPaginados(e, json, valueI, maxUsers) {
    let cadena = e.form.modul.return('modulos/comunes/tabla.html?resultadosListinTelefonico');
    $('#listaUsrListTelef').empty();
    for (let i = valueI; i <= maxUsers && i < json.length; i++) {
        if (json[i].tlfemp != null) {
            json[i].ver_tlf = json[i].tlfemp;
        } else if (json[i].movemp != null) {
            json[i].ver_tlf = json[i].movemp;
        } else if (json[i].extusr != null) {
            json[i].ver_tlf = json[i].extusr;
        } else {
            json[i].ver_tlf = '-';
        }
        // json[i].ver_tlf = (json[i].tlfemp == null) ? '-' : '';
        // json[i].ver_ext = (json[i].extusr == null) ? '-' : '';
        json[i].ver_mail = (json[i].email == null) ? '-' : '';
        json[i].imgOrigen = json[i].imagen || 'res/img/user.png';
        json[i].imagenlist = (json[i].imagen != null) ? 'src="' + json[i].imagen + '"' : 'src="res/img/user.png"';
        let HTML = $.parseHTML(cadena.reemplazaMostachos(json[i]));
        HTML[0].getElementsByClassName('verUsuario')[0].addEventListener('click', function () {
            Moduls.app.child.tempListadoUsrs.usrSeleccionado = json[i];
            Moduls.app.child.modal.child.modalBody.load({ url: 'modulos/comunes/comunes.html?modalDatosUsuario', script: false });
            construirModal({ title: json[i].nomusr + ' (' + json[i].codusr + ')', canceltext: 'Cerrar', w: '700px' });
        });
        HTML[0].getElementsByClassName('verTelefonos')[0].addEventListener('click', function () {
            Moduls.app.child.tempListadoUsrs.usrSeleccionado = json[i];
            Moduls.app.child.modal.child.modalBody.load({ url: 'modulos/comunes/comunes.html?modalDatosUsuario', script: false });
            construirModal({ title: json[i].nomusr + ' (' + json[i].codusr + ')', canceltext: 'Cerrar', w: '700px' });
        });
        $('#listaUsrListTelef').append(HTML);
    }
}

function datUsrListinTlf(s, d, e) {
    if (s) {
        e.form.set(e.form.modul.padre.padre.child.tempListadoUsrs.usrSeleccionado);
        e.form.modul.template.getElementsByTagName('img')[0].src = e.form.modul.padre.padre.child.tempListadoUsrs.usrSeleccionado.imgOrigen;
    } else
        toast({ tipo: 'error', msg: resuelveError(d) });
}