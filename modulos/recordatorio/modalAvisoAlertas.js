
// Funciones de inicialización
$(function() {
    $('#myModalAvisoAlertas .btnAceptar').click(function() {
        cerrarModalAlertas();
    });
});

// Funciones de callback
function cbkOnloadAvisoAlertas(s, d, e) {
    Moduls.app.child.modalAlertasPendientes.Forms.frmContRecordatoriosPendiente2.executeForm();
}

function cbkContarRecordatorios2(s, d, e) {
    let dat = compruebaAutorizacionOauth2UsuarioRecord(s, d, e);
    switch(dat) {
        case -1: 
            toast({ tipo: 'error', msg: 'Error de llamada de authenticacion. No se ha logrado optener permisos para cargar la tabla de recordatorio'});
            break;
        case 0: 
            break;
        default:
            if(s) {
                let total = 0, noleida = 0, pendiente = 0;
                total = dat.total;
                sessionStorage.setItem("ALERTAS_TOTAL", total);
                for(let i = 0; i < dat.parcial.length; i++) {
                    let parcial = dat.parcial[i];
                    if(parcial.estado == 200) {
                        noleida = parcial.count;
                        sessionStorage.setItem("ALERTAS_NO_LEIDAS", noleida);
                    }
                    if(parcial.estado == 400) {
                        pendiente = parcial.count;
                        sessionStorage.setItem("ALERTAS_PENDIENTES", pendiente);
                    }
                }
                if(total == 0) {
                    $('.num_alertas').addClass('dn');
                } else {
                    $('.num_alertas').html(total);
                    $('.num_alertas').removeClass('dn');

                    if(total > 0) {
                        if(total == 1) {
                            let myform = Moduls.app.child.modalAlertasPendientes.Forms.frmAlertasPendientes;
                            if(noleida == 1) {
                                myform.parametros.codest.value = 200;
                                myform.executeForm();
                            } else if(pendiente == 1) {
                                myform.parametros.codest.value = 400;
                                myform.executeForm();
                            }
                        } else {
                            $('#myModalAvisoAlertas .modal-title').html('Alertas pendientes');
                            $('#myModalAvisoAlertas .modal-container').html('Tiene tareas pendientes por realizar en el apartado de alertas');
                            monstrarModalAvisoAlertas();
                        }
                    }
                }
            } else {
                validaErroresCbk(d);
            }
            break;
    }
}

function cbkAlertasPendientes(s, d, e) {
    let dat = compruebaAutorizacionOauth2UsuarioRecord(s, d, e);
    switch(dat) {
        case -1: 
            toast({ tipo: 'error', msg: 'Error de llamada de authenticacion. No se ha logrado optener permisos para cargar la tabla de recordatorio'});
            break;
        case 0: 
            break;
        default:
            if(s) {
                if(dat[0]) {
                    $('#myModalAvisoAlertas .modal-title').html(dat[0].titulo);
                    $('#myModalAvisoAlertas .modal-container').html(dat[0].detall);

                    if(dat[0].codagr == 100) {
                        $('.modal-footer').html(
                            '<button class="btn btn-primary" onclick="marcarLeida2(' + dat[0].codrec + ')" type="button">Aceptar</button>');
                    } else if(dat[0].codagr == 200) {
                        $('.modal-footer').html(
                            '<button class="btn btn-info" onclick="cerrarModalAlertas()" type="button">Más tarde</button>' +
                            '<a class="btn btn-primary" href="' + dat[0].enlace + '">Realizar Tarea</a>');
                    }
                    monstrarModalAvisoAlertas();
                }
            } else {
                validaErroresCbk(d);
            }
    }
}

function cbkCambiarEstadoNotificacion2(s, d, e) {
    let dat = compruebaAutorizacionOauth2UsuarioRecord(s, d, e);
    switch (dat) {
        case -1:
            toast({ tipo: 'error', msg: 'Error de llamada de authenticacion. No se ha logrado optener permisos para cargar la tabla de recordatorio' });
            break;
        case 0:
            break;
        default:
            refreshNumAlertas();
            cerrarModalAlertas();
    }
}

// Utils
function monstrarModalAvisoAlertas() {
    let $modal = $('#myModalAvisoAlertas');

    $('.modal-content', $modal).css("width", '700px');
    $('.modal-content', $modal).css("min-height", '250px');
    $('.modal-content', $modal).css("max-height", '750px');
    $('.modal-content', $modal).css("overflow", 'auto');
    $('.modal-content', $modal).css("margin", '0px auto');

    if (esInternetExplorer()) {
        $modal.removeClass('fade');
        $('.modal-overlay').show();
        $modal.show();
    } else {
        $modal.modal('show');
        $('body').css('overflow', 'hidden');
    }
}

function cerrarModalAlertas() {
    let $modal = $('#myModalAvisoAlertas');
    if (esInternetExplorer()) {
        $modal.removeClass('fade');
        $('.modal-overlay').hide();
        $modal.hide();
    } else {
        $modal.modal('hide');
        $('body').css('overflow', 'auto');
    }
}

function marcarLeida2(codrec) {
    let form = Moduls.app.child.modalAlertasPendientes.Forms.frmCambiarEstadoNotificacion2;
    form.set({codrec: codrec});
    form.executeForm();
}