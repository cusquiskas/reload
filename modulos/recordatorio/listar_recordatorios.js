
// Funciones de inicialización
$(function() {
});

// Funciones de callback
function cbkOnload(s, d, e) {
    let forms = Moduls.app.child.templateAplicacion.Forms;
    let auth = { type: 'oauth2', key: ''}
    forms.frmListarRecordatoriosNotificaciones.authorization = auth;
    forms.frmListarRecordatoriosTareas.authorization = auth;
    forms.frmListarRecordatoriosEncuestas.authorization = auth;

    forms.frmListarRecordatoriosNotificaciones.executeForm();
    forms.frmListarRecordatoriosTareas.executeForm();
    forms.frmListarRecordatoriosEncuestas.executeForm();
}


function cbkListarRecordatoriosNotificaciones(s, d, e) {
    if(e.xxhttpresponsecodexx == 401 || e.xxhttpresponsecodexx == 403) {
        configureToken(e);
    } else {
        if(s) {
            let count = 0;
            let dat = JSON.parse(d);
            $.each(dat, function(i, v) {
                if(v.codest == 200) count++;
            });
            $('.lstRecordatoriosPropios .not-title').html('<h3>Notificaciones' + (count > 0 ? ' (' + count + ')</h3>' : '</h3>'));
        } else {
            validaErroresCbk(d);
        }
    }
}
function cbkListarRecordatoriosTareas(s, d, e) {
    if(e.xxhttpresponsecodexx == 401 || e.xxhttpresponsecodexx == 403) {
        configureToken(e);
    } else {
        if(s) {
            let count = 0;
            let dat = JSON.parse(d);
            $.each(dat, function(i, v) {
                if(v.codest == 400) count++;
            });
            $('.lstRecordatoriosPropios .task-title').html('<h3>Mis Tareas' + (count > 0 ? ' (' + count + ')</h3>' : '</h3>'));
        } else {
            validaErroresCbk(d);
        }
    }
}
function cbkListarRecordatoriosEncuestas(s, d, e) {
    if(e.xxhttpresponsecodexx == 401 || e.xxhttpresponsecodexx == 403) {
        configureToken(e);
    } else {
        if(s) {
            let dat = JSON.parse(d);
            $('.lstRecordatoriosPropios .enc-title').html('<h3>Encuestas' + (dat.length > 0 ? ' (' + dat.length + ')</h3>' : '</h3>'));
        } else {
            validaErroresCbk(d);
        }
    }
}
function cbkCambiarEstadoNotificacion(s, d, e) {
    if(e.xxhttpresponsecodexx == 401 || e.xxhttpresponsecodexx == 403) {
        configureToken(e);
    } else {
        if(s) {
            Moduls.app.child.templateAplicacion.Forms.frmListarRecordatoriosNotificaciones.executeForm();
            refreshNumAlertas();
        } else {
            validaErroresCbk(d);
        }
    }
}
function cbkListarPoliticas(s, d, e) {
    if(e.xxhttpresponsecodexx == 401 || e.xxhttpresponsecodexx == 403) {
        configureToken(e);
    } else {
        let count = 0;
        $.each(d.root.pol, function(i, v) {
            $.each(v.con, function(i, y) {
                if(y.estado == 'Pendiente') count++;
            });
        });
        $('.lstRecordatoriosPropios .pol-title').html('<h3>Políticas' + (count > 0 ? ' (' + count + ')</h3>' : '</h3>'));
        if(!s) validaErroresCbk(d);
    }
}

// Utils
function configureToken(e) {
    if(e.form.recursivecount === undefined || e.form.recursivecount === null) {
        e.form.recursivecount = 5;
    }
    if(e.form.recursivecount > 0) {
        e.form.recursivecount = e.form.recursivecount - 1;
        invocaAjax({
            direccion: '/oauth2/oauth/token?grant_type=password&username=' + top.SESION_ID + '&password=none&auth_type=xsid',
            method: 'POST',
            authorization: {
                type: 'basic',
                key:  'cmVjb3JkYXRvcmlvOnIzYzByZDR0MHIxMA=='
            }, 
            retorno: function (suc, dat, ext) {
                let obj = JSON.parse(dat);
                e.form.authorization = {
                    type: 'oauth2',
                    key:  obj.access_token
                }
                e.form.executeForm();
            }
        });
    } else {
        e.form.recursivecount = 0;
        toast({ tipo: 'error', msg: 'Error de llamada de authenticacion. No se ha logrado optener permisos para cargar la tabla de recordatorio'});
    }
}

function rowStyle(row, data, dataIndex) {
    switch(data['codest']) {
        case 200:
        case 400:
            $(row).addClass('color-red2');
            break;
    }
}
function rowStylePoliticas(row, data, dataIndex) {
    switch(data['estado']) {
        case 'Pendiente':
            $(row).addClass('color-red2');
            break;
    }
}

function filaSeleccionadaNotificaciones(dat, row, lastselectedrow) {
    if (lastselectedrow && lastselectedrow.child && lastselectedrow.child.isShown()) lastselectedrow.child.hide();

    let html = '<div style="display:table; width:100%; color: #1b65bd; font-size: 16px;">';
    html += '<div style="display:table-cell; text-align:justify; width:80%; vertical-align:top;">';
    html += dat.detall;
    html += '</div><div style="display:table-cell; text-align:center; width:20%; padding:10px;">';
    if(dat.codest == 100 || dat.codest == 300) {
        html += '<div>' + moment.utc(dat.fechaModEstado).utcOffset(0).format('DD/MM/YYYY HH:mm:ss') + '</div>'
    } else {
        html += '<button class="btn btn-primary" onclick="marcarLeida(' + dat.codrec + ')" type="button"> Marcar Leída</button>';
    }
    html += '</div></div>';

    row.child(html).show();
    row.child().addClass('back-gray');
}

function filaSeleccionadaTareas(dat, row, lastselectedrow) {
    if (lastselectedrow && lastselectedrow.child && lastselectedrow.child.isShown()) lastselectedrow.child.hide();

    let html = '<div style="display:table; width:100%; color: #1b65bd; font-size: 16px;">';
    html += '<div style="display:table-cell; text-align:justify; width:80%; vertical-align:top;">';
    html += dat.detall;
    html += '</div><div style="display:table-cell; text-align:center; width:20%; padding:10px;">';
    if(dat.codest == 100 || dat.codest == 300) {
        html += '<div>' + moment.utc(dat.fechaModEstado).utcOffset(0).format('DD/MM/YYYY HH:mm:ss') + '</div>'
    } else {
        html += '<a class="btn btn-primary" href="' + dat.enlace + '"> Realizar Tarea</a>';
    }
    html += '</div></div>';

    row.child(html).show();
    row.child().addClass('back-gray');
}

function filaSeleccionadaPoliticas(value) {
    Moduls.app.child.modal.child.modalBody.load({
        url: 'modulos/recordatorio/politicas_rgpd.html',
        script: true,
        fnc: function() {
            let form = $('.gestion-politica-rgpd form[name=frmLoadPoliticaRGPD]')[0];
            let params = { p_codpol: value.codpol, p_vesion: value.version };
            dondeEstoy(form).set(params).executeForm();
            
            if(value.estado == 'Pendiente') {
                construirModal({
                    title: value.title,
                    w: 700, h: 700,
                    ocultarXCerrar: true,
                    canceltext: 'CERRAR',
                    oktext: "ACEPTAR",
                    okfunction: function () {
                        let frmAceptar = $('.gestion-politica-rgpd form[name=fmrAceptarPoliticasRGPD]')[0];
                        dondeEstoy(frmAceptar).set(params).executeForm();
                    }
                });
            } else {
                construirModal({
                    title: value.title,
                    w: 700, h: 700,
                    ocultarXCerrar: true,
                    canceltext: 'CERRAR'
                });
            }
        }
    });
}

function filaDesseleccionada(dat, row) {
    if (row.child.isShown()) row.child.hide();
}

function textosNotificaciones() {
    return {"sEmptyTable": "Ninguna notificación pendiente"};
}
function textosTareas() {
    return {"sEmptyTable": "Ninguna tarea pendiente"};
}
function textosEncuestas() {
    return {"sEmptyTable": "Ninguna encuesta pendiente"};
}
function textosPoliticas() {
    return {"sEmptyTable": "Ninguna política pendiente de aceptación"};
}

function marcarLeida(codrec) {
    let form = Moduls.app.child.templateAplicacion.Forms.frmCambiarEstadoNotificacion;
    form.set({codrec: codrec});
    form.executeForm();
}

function postprocesado(datos) {
    let result = [];
    $.each(datos, function(i, v) {
        $.each(v.con, function(i, y) {
            result.push({
                title:  v.nomlar,
                nombre: y.entrad,
                estado: y.estado,
                codpol: y.codpol,
                version: y.version
            });
        });
    });

    return result;
}