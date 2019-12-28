// Funciones de inicialización
$(function() {

    onload();
});

function onload() {
    Moduls.app.child.templateAplicacion.child.panelPlantilla.Forms.frmInit.set({
        p_codusr: Moduls.app.child.templateAplicacion.paramSelSolCae.param.numper,
        p_fecsol: Moduls.app.child.templateAplicacion.paramSelSolCae.param.fecsol
    });
    Moduls.app.child.templateAplicacion.child.panelPlantilla.Forms.frmInit.executeForm();

    Moduls.app.child.templateAplicacion.child.panelPlantilla.Forms.frmBeneficiarios.set({
        p_estsol: 'La solicitud se encuentra ' + Moduls.app.child.templateAplicacion.paramSelSolCae.param.destado
    });
}

// Callback functions
function cbkInit(s, d, e) {
    if(s) {
        let cadena = e.form.modul.return('modulos/comunes/tabla.html?rowGestionSolicitudBeneficiarios');
        let lactual = d.benes.act.ben;
        for (let i = 0; i < lactual.length; i++) {
            let HTML = $.parseHTML(cadena.reemplazaMostachos(lactual[i]));
            $benef('.tblDatosActuales').append(HTML);
        }

        cadena = e.form.modul.return('modulos/comunes/tabla.html?rowGestionSolicitudBeneficiarios2');
        let lmodif = d.benes.mas.mas;
        for(let i = 0; i < lmodif.length; i++) {
            lmodif[i].desest = desest(lmodif[i].estado);
            let HTML = $.parseHTML(cadena.reemplazaMostachos(lmodif[i]));
            if(lmodif[i].accion == '+') $benef('.tblPendientesAnadir').append(HTML);
            if(lmodif[i].accion == '-') $benef('.tblPendientesBorrar').append(HTML);
        }
    } else {
        validaErroresCbk(d);
    }
}

// Utils Functions
function $benef(path) {
    return $('.beneficiarios-cae ' + path);
}

function desest(estado) {
    let estados = [
        {key: 'A', value: 'Abierta'},
        {key: 'C', value: 'En Curso'},
        {key: 'X', value: 'Rechazada'},
        {key: 'V', value: 'Aceptada'},
        {key: 'E', value: 'Error'},
        {key: 'P', value: 'Precerrada'},
        {key: 'W', value: 'Pdte.Auto.'},
        {key: 'R', value: 'Pdte.RRLL'},
        {key: 'T', value: 'Pdte.Tra.Final'},
        {key: 'U', value: 'Rech.por Usr.'}
    ];
    for(let i = 0; i < estados.length; i++) {
        if(estados[i].key == estado) return estados[i].value;
    }
    return '';
}