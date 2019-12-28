$(document).ready(function () {
    Moduls.app.InsertarPolitica = null;
    Moduls.app.ModificarPolitica = null;
    Moduls.app.PoliticaSeleccionada = null;
    Moduls.app.RefrescarListado = null;
    Moduls.app.ArrayDatos = null;
    Moduls.app.NuevaVersion = null;
    Moduls.app.UltimaVersion = null;

    LibraryManager.load('nicedit-0.0.9', 'core', function () { });

    LibraryManager.load('filesaver-1.0.1', 'core', function () { });

    Moduls.app.child.modal.load({ url: 'modulos/comunes/modal.html', script: false });

    Moduls.app.child.templateAplicacion.Forms.listadoPoliticas.executeForm();
});

function insertarPolitica() {
    Moduls.app.InsertarPolitica = true;
    Moduls.app.ModificarPolitica = null;
    Moduls.app.NuevaVersion = null;
    Moduls.app.UltimaVersion = null;
    Moduls.app.child.modal.child.modalBody.load({ url: 'modulos/comunes/comunes.html?formInsertarModificarPoliticaRGPD', script: false });
    construirModal({ title: "Insertar Política", w: 700 });
}

function modificarPolitica() {
    if (Moduls.app.PoliticaSeleccionada == null) {
        toast({ tipo: 'info', msg: 'Seleccione un registro' });
    } else {
        Moduls.app.child.templateAplicacion.Forms.ultimaVersion.set({ p_codpol: Moduls.app.PoliticaSeleccionada.codpol });
        Moduls.app.child.templateAplicacion.Forms.ultimaVersion.executeForm();
        Moduls.app.InsertarPolitica = null;
        Moduls.app.ModificarPolitica = true;
        Moduls.app.NuevaVersion = null;
        Moduls.app.UltimaVersion = null;
        Moduls.app.child.modal.child.modalBody.load({ url: 'modulos/comunes/comunes.html?formInsertarModificarPoliticaRGPD', script: false });
        construirModal({ title: "Modificar Política", w: 700 });
    }
}

function descargaAceptacion() {
    if (Moduls.app.PoliticaSeleccionada == null) {
        toast({ tipo: 'info', msg: 'Seleccione un registro' });
    } else {
        Moduls.app.child.templateAplicacion.Forms.generarExcel.set({ p_codpol: Moduls.app.PoliticaSeleccionada.codpol, p_vesion: Moduls.app.PoliticaSeleccionada.vesion, p_numero: 1 });
        Moduls.app.child.templateAplicacion.Forms.generarExcel.executeForm();
    }
}

function generarExcel(s, d, e) {
    if (s) {
        if (Moduls.app.ArrayDatos == null) {
            Moduls.app.ArrayDatos = d.root.usr;
        } else {
            for (let i = 0; i < d.root.usr.length; i++) {
                Moduls.app.ArrayDatos.push(d.root.usr[i]);
            }
        }
        if (d.root.ultpos) {
            Moduls.app.child.templateAplicacion.Forms.generarExcel.set({ p_codpol: Moduls.app.PoliticaSeleccionada.codpol, p_vesion: Moduls.app.PoliticaSeleccionada.vesion, p_numero: d.root.ultpos + 1 });
            Moduls.app.child.templateAplicacion.Forms.generarExcel.executeForm();
        } else {
            loading(true);
            invocaAjax({
                direccion: '/management/mvc-management/downloadExcel.FILE',
                parametros: {
                    contentType: 'application/json',
                    fileName: 'aceptaciones.xlsx',
                    book: {
                        sheets: [
                            {
                                columns: [{
                                    title: "F. Aceptación",
                                    reference: "fecha"
                                }, {
                                    title: "Cód. Usuario",
                                    reference: "codusr"
                                }, {
                                    title: "Nombre",
                                    reference: "nombre"
                                }, {
                                    title: "Empresa",
                                    reference: "empresa"
                                }, {
                                    title: "Division",
                                    reference: "division"
                                }, {
                                    title: "Centro",
                                    reference: "centro"
                                }, {
                                    title: "Categoria",
                                    reference: "categoria"
                                }, {
                                    title: "F. Baja",
                                    reference: "baja"
                                }],
                                name: "Aceptados",
                                datos: Moduls.app.ArrayDatos,
                                hideParameters: true
                            }]
                    }
                },
                retorno: function (suc, dat, ext) {
                    loading(false);
                    if (!suc) {
                        validaErroresCbk(dat);
                    } else {
                        Moduls.app.ArrayDatos = null;
                    }
                }
            });
        }
    } else {
        validaErroresCbk(d);
    }
}

function politicaSeleccionada(data) {
    Moduls.app.PoliticaSeleccionada = data;
}

function politicasDesseleccionada(data) {
    Moduls.app.PoliticaSeleccionada = null;
}

function gestionPoliticaRGPD(s, d, e) {
    if (s) {
        toast({ tipo: 'success', msg: d.txtmsg });
        cerrarModalIE($('#myModal'));
        if (Moduls.app.RefrescarListado == true) {
            Moduls.app.child.templateAplicacion.Forms.listadoPoliticas.executeForm();
            Moduls.app.RefrescarListado = null;
        }
    } else {
        validaErroresCbk(d, true);
    }
}

function eventosBotones() {
    $('.publicarFunction').click(function () {
        Moduls.app.child.modal.child.modalBody.Forms.gestionPoliticaRGPD.set({ p_chkacc: 'S' });
        Moduls.app.child.modal.child.modalBody.Forms.gestionPoliticaRGPD.set({ p_fechap: sysdate('dd/mm/yyyy') });
        ejecutarGestion();
    });

    $('.guardarFunction').click(function () {
        Moduls.app.child.modal.child.modalBody.Forms.gestionPoliticaRGPD.set({ p_chkacc: 'N' });
        Moduls.app.child.modal.child.modalBody.Forms.gestionPoliticaRGPD.set({ p_fechap: null });
        ejecutarGestion();
    });

    $('.cancelarFunction').click(function () {
        cerrarModalIE($('#myModal'));
    });

    $('.divLapizPoliticas').click(function () {
        desbloquearEditor();
        Moduls.app.NuevaVersion = true;
    });
}

function ejecutarGestion() {
    Moduls.app.RefrescarListado = true;
    if (Moduls.app.InsertarPolitica == true) {
        Moduls.app.child.modal.child.modalBody.Forms.gestionPoliticaRGPD.set({ p_vesion: $('form[name=gestionPoliticaRGPD] input[name=p_vesion]').val() });
    } else if (Moduls.app.ModificarPolitica == true) {
        Moduls.app.PoliticaSeleccionada = null;
        if (Moduls.app.NuevaVersion == true) {
            Moduls.app.child.modal.child.modalBody.Forms.gestionPoliticaRGPD.set({ p_vesion: parseInt(Moduls.app.UltimaVersion + 1) });
        } else {
            Moduls.app.child.modal.child.modalBody.Forms.gestionPoliticaRGPD.set({ p_vesion: $('form[name=gestionPoliticaRGPD] input[name=p_vesion]').val() });
        }
    }
    Moduls.app.child.modal.child.modalBody.Forms.gestionPoliticaRGPD.set({ p_fechcr: $('form[name=gestionPoliticaRGPD] input[name=p_fechcr]').val() });
    Moduls.app.child.modal.child.modalBody.Forms.gestionPoliticaRGPD.set({ p_txhtml: nicEditors.findEditor('textoPolitica').getContent() });
    Moduls.app.child.modal.child.modalBody.Forms.gestionPoliticaRGPD.executeForm();
}

function mostrarDatosPolitica(s, d, e) {
    if (s) {
        if (Moduls.app.InsertarPolitica != true) {
            for (let chn in Moduls.app.PoliticaSeleccionada) {
                if (e.form.modul.Forms.gestionPoliticaRGPD.parametros['p_' + chn]) {
                    let objeto = {};
                    objeto['p_' + chn] = Moduls.app.PoliticaSeleccionada[chn];
                    e.form.modul.Forms.gestionPoliticaRGPD.set(objeto);
                    let event = document.createEvent("Event"); event.initEvent('focus', false, true);
                    e.form.modul.Forms.gestionPoliticaRGPD.parametros['p_' + chn].object.dispatchEvent(event);
                }
            }

            $('form[name=gestionPoliticaRGPD] input[name=p_nomcor]').attr("disabled", true);
            $('form[name=gestionPoliticaRGPD] input[name=p_nomlar]').attr("disabled", true);
            $('form[name=gestionPoliticaRGPD] input[name=p_period]').attr("disabled", true);

            if ($('form[name=gestionPoliticaRGPD] input[name=p_fechap]').val() != "") {
                $('.guardarFunction').attr("disabled", true);
            }

        } else {
            $('form[name=gestionPoliticaRGPD] input[name=p_vesion]').val('1');
            $('form[name=gestionPoliticaRGPD] input[name=p_chkacc]').val('N');
            $('form[name=gestionPoliticaRGPD] input[name=p_fechcr]').val(sysdate('dd/mm/yyyy'));
        }
    }
}

function editorTexto() {
    new nicEditor({
        maxHeight: 250,
    }).panelInstance('textoPolitica');
}


function bloquearEditor() {
    if (Moduls.app.ModificarPolitica == true) {
        $('.nicEdit-main').attr("contenteditable", false);
        $('.nicEdit-main').css('color', 'rgba(0, 0, 0, .46)');
        $('form[name=gestionPoliticaRGPD] label[for=p_txhtml]').removeClass('labelPoliticas');
        $('form[name=gestionPoliticaRGPD] label[for=p_txhtml]').addClass('labelPoliticasContenido');
        $('.divLapizPoliticas').removeClass('dn');
    }
}

function desbloquearEditor() {
    $('.nicEdit-main').attr("contenteditable", true);
    $('.nicEdit-main').css('color', '');
    $('.guardarFunction').attr("disabled", false);
}

function listadoPoliticas(s, d, e) {
    if (s) {

    } else {
        validaErroresCbk(d);
    }
}

function ultimaVersion(s, d, e) {
    if (s) {
        Moduls.app.UltimaVersion = d.root.version;
    } else {
        validaErroresCbk(d);
    }
}