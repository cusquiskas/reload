function cargaInicialGestionNotificaciones(s, d, e) {
    let auth = { type: 'oauth2', key: '' }
    Moduls.app.child.templateGestion.Forms.listadoNoticiafiones.authorization = auth;
    Moduls.app.child.templateGestion.Forms.listadoNoticiafiones.executeForm();
}

function crearNotificacion() {
    Moduls.app.child.modal.child.modalBody.load({ url: 'modulos/comunes/comunes.html?formCrearModificarGestionNotificaciones', script: false });
    Moduls.app.child.templateGestion.Forms.variablesControl.crearNotificacion = true;
    construirModal({
        title: "Crear Notificación",
        w: 800,
        canceltext: "CANCELAR",
        oktext: "GUARDAR",
        okfunction: function () {
            let fecha = $('#fechaListadoNoticiafiones').val();
            let referencia = $('#referListadoNoticiafiones').val();
            let titulo = $('#asuntoListadoNoticiafiones').val();
            let detalle = $('#detalleGestionNoticiafiones').val();
            let excel = $('#excel').val();
            if (fecha == "" || referencia == "" || titulo == "" || detalle == "" || excel == "") {
                toast({ tipo: 'error', msg: 'Debe completar todos los campos del formulario', donde: '.modal-header' });
            } else {
                let auth = { type: 'oauth2', key: '' }
                Moduls.app.child.modal.child.modalBody.Forms.gestionNotificacion.authorization = auth;
                Moduls.app.child.modal.child.modalBody.Forms.gestionNotificacion.executeForm();
            }
        }
    });
}

function modificarNotificacion() {
    Moduls.app.child.modal.child.modalBody.load({ url: 'modulos/comunes/comunes.html?formCrearModificarGestionNotificaciones', script: false });
    if (Moduls.app.child.templateGestion.Forms.variablesControl.modificarNotificacion == null) {
        toast({ tipo: 'info', msg: 'Debe seleccionar un registro' });
    } else {
        Moduls.app.child.templateGestion.Forms.variablesControl.crearNotificacion = false;
        construirModal({
            title: "Modificar Notificación",
            w: 800,
            canceltext: "CANCELAR",
            oktext: "GUARDAR",
            okfunction: function () {
                let fecha = $('#fechaListadoNoticiafiones').val();
                let referencia = $('#referListadoNoticiafiones').val();
                let titulo = $('#asuntoListadoNoticiafiones').val();
                let detalle = $('#detalleGestionNoticiafiones').val();
                let excel = $('#excel').val();
                if (fecha == "" || referencia == "" || titulo == "" || detalle == "" || excel == "") {
                    toast({ tipo: 'error', msg: 'Debe completar todos los campos del formulario', donde: '.modal-header' });
                } else {
                    let auth = { type: 'oauth2', key: '' }
                    Moduls.app.child.modal.child.modalBody.Forms.gestionNotificacion.authorization = auth;
                    Moduls.app.child.modal.child.modalBody.Forms.gestionNotificacion.executeForm();
                }
            }
        });
    }
}

function listadoNoticiafiones(s, d, e) {
    Moduls.app.child.templateGestion.Forms.variablesControl = {};
    if (e.xxhttpresponsecodexx == 401 || e.xxhttpresponsecodexx == 403) {
        configureToken(e);
    } else {
        if (s) {

        } else {
            validaErroresCbk(d);
        }
    }
}

function notificacionSeleccionada(data) {
    Moduls.app.child.templateGestion.Forms.variablesControl.modificarNotificacion = data;
}

function notificacionDesseleccionada(data) {
    Moduls.app.child.templateGestion.Forms.variablesControl.modificarNotificacion = null;
}

function configureToken(e) {
    if (e.form) {
        if (e.form.recursivecount === undefined || e.form.recursivecount === null) {
            e.form.recursivecount = 5;
        }
        if (e.form.recursivecount > 0) {
            e.form.recursivecount = e.form.recursivecount - 1;
            invocaAjax({
                direccion: '/oauth2/oauth/token?grant_type=password&username=' + top.SESION_ID + '&password=none&auth_type=xsid&application=portalapp',
                method: 'POST',
                authorization: {
                    type: 'basic',
                    key: 'cmVjb3JkYXRvcmlvOnIzYzByZDR0MHIxMA=='
                },
                retorno: function (suc, dat, ext) {
                    let obj = JSON.parse(dat);
                    e.form.authorization = {
                        type: 'oauth2',
                        key: obj.access_token
                    }
                    e.form.executeForm();
                }
            });
        }
    } else {
        e.form.recursivecount = 0;
        toast({ tipo: 'error', msg: 'Error de llamada de authenticacion. No se ha logrado optener permisos para cargar la tabla de recordatorio' });
    }
}

function mostrarNotificacion(s, d, e) {
    if (s) {
        setFileOptionGestionNotificaciones();
        if (!Moduls.app.child.templateGestion.Forms.variablesControl.crearNotificacion) {
            for (let chn in Moduls.app.child.templateGestion.Forms.variablesControl.modificarNotificacion) {
                if (e.form.modul.Forms.notificacion.parametros[chn]) {
                    let objeto = {};
                    if (chn == 'fecha') {
                        objeto[chn] = formatearFecha(Moduls.app.child.templateGestion.Forms.variablesControl.modificarNotificacion[chn]);
                    } else {
                        objeto[chn] = Moduls.app.child.templateGestion.Forms.variablesControl.modificarNotificacion[chn];
                    }
                    e.form.modul.Forms.notificacion.set(objeto);
                    let event = document.createEvent("Event"); event.initEvent('focus', false, true);
                    e.form.modul.Forms.notificacion.parametros[chn].object.dispatchEvent(event);
                }
            }

            $('#referListadoNoticiafiones').attr("disabled", true);
            $('#asuntoListadoNoticiafiones').attr("disabled", true);
            $('#detalleGestionNoticiafiones').attr("disabled", true);
            $('#detalleGestionNoticiafiones').css('color', 'rgba(0, 0, 0, .46)');
            $('#estadoListadoNoticiafiones').attr("disabled", false);
        } else {
            $('#fechaListadoNoticiafiones').val(sysdate('yyyy-mm-dd'));
        }
    }
}

function formatearFecha(dato) {
    return dato.split('@')[0].split("/").reverse().join("-");
}

function formatearFecha2(dato) {
    return dato.split("-").reverse().join("/");
}

function setFileOptionGestionNotificaciones() {
    Moduls.app.child.modal.child.modalBody.Forms.nFile = new uploadProject();
    let file = Moduls.app.child.modal.child.modalBody.Forms.nFile;
    file.setBtnSelect(getId('adjuntarGestionNotificaciones'));
    file.setFncValidation(valida_archivo);
    file.setFncCallback(subida_correcta);
    file.setBoxEco(getId('excel'));
    file.setConfig({ exts: ['.XLS', '.XLSX'], smax: 5242880, ruta: '/var/www/repositorio/tmp/' });
    file.initDocument();
}

function valida_archivo(s, d, e) {
    let tipo = (s) ? 'success' : 'error',
        msg = (d.type == 'smax') ? 'Excedido tamaño del archivo:<br>Máximo: ' + d.fileMax + '<br>' + 'Real: ' + d.fileSize :
            (d.type == 'exts') ? 'Tipo de archivo no permitido:<br>Permitidos: ' + d.exts + '<br>Real: ' + d.fileExt :
                'Error desconocido validando el archivo'
    if (!s) {
        toast({ tipo: tipo, msg: msg, donde: '.modal-header' });
    } else {
        Moduls.app.filedx = top.SESION_ID + d.fileExt;
        Moduls.app.child.modal.child.modalBody.Forms.nFile.uploadDocument({ file: Moduls.app.filedx });
    }
}

function subida_correcta(s, d, e) {
    if (s) {
        procesarArchivo();
    } else {
        toast({ tipo: 'error', msg: resuelveError(d), donde: '.modal-header' });

    }
}

function procesarArchivo() {
    invocaAjax({
        direccion: '/management/mvc-management/pathExcelToJSON.json',
        metodo: 'GET',
        parametros: {
            path: '/var/www/repositorio/tmp/' + Moduls.app.filedx
        },
        retorno: function (suc, dat, ext) {
            if (suc) {
                Moduls.app.child.templateGestion.Forms.destinos = [];
                for (let i = 0; i < dat[0].cells.length; i++) {
                    if (dat[0].cells[i][0] != null) {
                        Moduls.app.child.templateGestion.Forms.destinos.push(dat[0].cells[i][0]);
                    }
                }
                toast({ tipo: 'success', msg: 'Fichero subido y procesado correctamente', donde: '.modal-header' });
            } else {
                toast({ tipo: 'success', msg: resuelveError(dat), donde: '.modal-header' });
            }
        }
    });
}

function preparamosNombre() {
    let arrayUsuarios = new Array();
    for (let i = 0; i < Moduls.app.child.templateGestion.Forms.destinos.length; i++) {
        let objNombre = new Object();
        objNombre.nombre = Moduls.app.child.templateGestion.Forms.destinos[i];
        arrayUsuarios.push(objNombre);
    }
    return arrayUsuarios;
}

function preparamosRecordatorio() {
    let objRecordatorio = new Object();
    objRecordatorio.codagr = "100";
    objRecordatorio.codest = $('#estadoListadoNoticiafiones').val();
    objRecordatorio.fecha = formatearFecha2($('#fechaListadoNoticiafiones').val());
    objRecordatorio.refer = $('#referListadoNoticiafiones').val();
    objRecordatorio.destin = null;
    objRecordatorio.titulo = $('#asuntoListadoNoticiafiones').val();
    objRecordatorio.detall = $('#detalleGestionNoticiafiones').val();
    objRecordatorio.alerta = false;
    objRecordatorio.enlace = null;

    return objRecordatorio;
}

function gestionNotificacion(s, d, e) {
    let arrayUsuarios = new Array();
    arrayUsuarios = preparamosNombre();

    let objRecordatorio = new Object();
    objRecordatorio = preparamosRecordatorio();

    invocaAjax({
        authorization: e.form.authorization,
        contentType: 'application/json',
        metodo: 'POST',
        direccion: '/recordatorio/admin_services/create_massive',
        parametros: {
            usuarios: arrayUsuarios,
            recordatorio: objRecordatorio
        },
        retorno: function (suc, dat, ext) {
            if (ext && ext.xxhttpresponsecodexx == 401 || ext.xxhttpresponsecodexx == 403) {
                configureToken(e);
            } else {
                if (suc) {
                    cerrarModalIE($('#myModal'));
                    toast({ tipo: 'success', msg: 'Notificaciones guardadas correctamente' });
                    Moduls.app.child.templateGestion.Forms.listadoNoticiafiones.executeForm();
                } else {
                    toast({ tipo: 'error', msg: resuelveError(dat), donde: '.modal-header' });
                }
            }
        }
    });
}