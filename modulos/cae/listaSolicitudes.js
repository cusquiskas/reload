
//Funciones de Inicialización
$(function () {

    $listaSol('form[name=frmListaSolicitudCae] [name=p_fecini]').change(function () {
        $listaSol('form[name=frmListaSolicitudCae] [name=p_fecfin]').attr('min', $(this).val());
    });
    $listaSol('form[name=frmListaSolicitudCae] [name=p_fecfin]').change(function () {
        $listaSol('form[name=frmListaSolicitudCae] [name=p_fecini]').attr('max', $(this).val());
    });

    init();
});

function init() {
    let lst_tip = [
        { val: '', txt: '..Tipo..' },
        { val: 'DATRE', txt: 'Consultas' },
        { val: 'DATBA', txt: 'Datos Bancarios' },
        { val: 'DATFI', txt: 'Datos Fiscales' },
        { val: 'DATPE', txt: 'Datos Personales' },
        { val: 'DATFA', txt: 'Situación Familiar' },
        { val: 'DATEX', txt: 'Excedencias' },
        { val: 'DATRJ', txt: 'Reducción de Jornada' },
        { val: 'DATBE', txt: 'Beneficiarios' }
    ];
    for (let i = 0; i < lst_tip.length; i++)
        $listaSol('form[name=frmListaSolicitudCae] [name=p_codapl]').append(
            new Option(lst_tip[i].txt, lst_tip[i].val)
        );
    $listaSol('form[name=frmListaSolicitudCae] [name=p_codapl]').val('');

    let lst_est = [
        { val: '', txt: '..Estado..' },
        { val: 'A', txt: 'Abierta' },
        { val: 'C', txt: 'En Curso' },
        { val: 'W', txt: 'Pendiente' },
        { val: 'R', txt: 'Pdte. RRLL' },
        { val: 'X', txt: 'Rechazada' },
        { val: 'T', txt: 'Pdte. Tramitación Final' },
        { val: 'U', txt: 'Rechazada por el Solicitante' },
        { val: 'V', txt: 'Aceptada' }
    ];
    for (let i = 0; i < lst_est.length; i++)
        $listaSol('form[name=frmListaSolicitudCae] [name=p_estado]').append(
            new Option(lst_est[i].txt, lst_est[i].val)
        );
    $listaSol('form[name=frmListaSolicitudCae] [name=p_estado]').val('');

    if (Moduls.app.child.templateAplicacion.filtroSolCae) {
        Moduls.app.child.templateAplicacion.Forms.frmListaSolicitudCae.set(
            Moduls.app.child.templateAplicacion.filtroSolCae
        );
    }
    Moduls.app.child.templateAplicacion.Forms.frmListaSolicitudCae.executeForm();
}

function selSolicitud(data) {
    Moduls.app.child.templateAplicacion.selectedSolCae = data;
    $listaSol('.btn-view').removeClass('disabled');
    if ((data.aplsol == 'DATEX' || data.aplsol == 'DATRJ') && (data.estado == 'A' || data.estado == 'C') && (data.alerta != null && data.alerta == 'Z')) {
        $listaSol('.btn-modf').removeClass('disabled');
    } else {
        $listaSol('.btn-modf').addClass('disabled');
    }
    // $listaSol('.btn-modf').toggleClass(
    //     'disabled',
    //     ((data.aplsol != 'DATEX' && data.aplsol != 'DATRJ') && (data.alerta != null && data.alerta != 'Z')) ||
    //     (data.estado != 'A' && data.estado != 'C'));
    $listaSol('.btn-tram').toggleClass('disabled', data.estado != 'T');
    if ((data.aplsol == 'DATEX' || data.aplsol == 'DATRJ') && (data.estado == 'V') && (data.fecsol > sysdate('dd/mm/yyyy'))) {
        $listaSol('.btn-canc').removeClass('disabled');
    } else {
        $listaSol('.btn-canc').addClass('disabled');
    }
}

function clickVerSolicitud() {
    click('VIEW');
}
function clickModificarSolicitud() {
    click('MODF');
}
function clickTramitarSolicitud() {
    click('TRAM');
}
function clickCancelarSolicitud() {
    invocaAjax({
        direccion: '/management/mvc-management/controller/newintra.xwi_plantilla_cae.elimina_tramite.json',
        parametros: {
            p_codusr: Moduls.app.child.templateAplicacion.selectedSolCae.numper.toString(),
            p_fecsol: Moduls.app.child.templateAplicacion.selectedSolCae.fecsol
        },
        contentType: 'application/json',
        retorno: function (s, d, e) {
            if (s) {
                toast({ tipo: 'success', msg: 'La solicitud ha sido enviada correctamente' });
                Moduls.app.child.templateAplicacion.Forms.frmListaSolicitudCae.executeForm();
            } else {
                validaErroresCbk(d);
            }
        }
    });
}
function click(role) {

    let params = Moduls.app.child.templateAplicacion.Forms.frmListaSolicitudCae.parametros;
    Moduls.app.child.templateAplicacion.filtroSolCae = {
        p_codapl: params.p_codapl.value,
        p_fecini: params.p_fecini.value,
        p_fecfin: params.p_fecfin.value,
        p_estado: params.p_estado.value
    };

    Moduls.app.child.templateAplicacion.paramSelSolCae = {
        role: role,
        param: Moduls.app.child.templateAplicacion.selectedSolCae
    };
    Moduls.app.child.templateAplicacion.load({
        url: 'modulos/cae/gestionSolicitud.html',
        script: true
    });
}

function getObservaciones(obj) {
    return obj.observ;
    //return obj.observ.replace(/\\n/g, '<br>');
}

// Funciones de Callback
function cbkListaSolicitudCae(s, d, e) {
    if (s) {
        if (!d.list || !d.list.sol || !d.list.sol) {
            toast({ tipo: 'error', msg: 'No se ha encontrado ningún resultado' });
        }
    } else {
        validaErroresCbk(d);
    }
}

// Utils Functions
function $listaSol(path) {
    return $('.modulListaSolicitudCae ' + path);
}