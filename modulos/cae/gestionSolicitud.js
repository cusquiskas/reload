// Funciones de inicialización
$(function() {

    $gestionSol('.btn-back').click(function() {
        Moduls.app.child.templateAplicacion.paramSelSolCae = null;
        Moduls.app.child.templateAplicacion.load({
            url: 'modulos/cae/listaSolicitudes.html',
            script: true
        });
    });

    onload();
});

function onload() {

    let appl = Moduls.app.child.templateAplicacion.paramSelSolCae.param.aplsol;
    let role = Moduls.app.child.templateAplicacion.paramSelSolCae.role;
    let path;

    switch(appl) {
        case 'DATRE':
            $gestionSol('.card-title').html('Autoservicio');
            path = 'modulos/cae/gestionConsultas.html';
            break;
        case 'DATPE':
            $gestionSol('.card-title').html('Datos Personales');
            path = 'modulos/cae/datosPersonales.html';
            break;
        case 'DATFA':
            $gestionSol('.card-title').html('Situación Familiar');
            path = 'modulos/cae/datosFamiliares.html';
            break;
        case 'DATBA':
            $gestionSol('.card-title').html('Relación Bancaria');
            path = 'modulos/cae/relacionBancaria.html';
            break;

        case 'DATPX':
            $gestionSol('.card-title').html('Parentesco');
            path = 'modulos/cae/datosParentesco.html';
            break;
        case 'DATFI':
            $gestionSol('.card-title').html('Ajustes IRPF');
            path = 'modulos/cae/ajustesIrpf.html';
            break;
        case 'DATEX':
            if(role == 'VIEW') {
                $gestionSol('.card-title').html('Consultar Solicitud');
            } else if(role == 'MODF') {
                $gestionSol('.card-title').html('Modificar Solicitud');
            }
            path = 'modulos/cae/excedenciasLicencia.html';
            break;
        case 'DATRJ':
            if(role == 'VIEW') {
                $gestionSol('.card-title').html('Consultar Solicitud');
            } else if(role == 'MODF') {
                $gestionSol('.card-title').html('Modificar Solicitud');
            }
            path = 'modulos/cae/reduccionJornada.html';
            break;
        case 'DATBE':
            $gestionSol('.card-title').html('Solicitud de cambio de beneficiarios');
            path = 'modulos/cae/beneficiarios.html';
            break;
    }

    if(path) {
        Moduls.app.child.templateAplicacion.child.panelPlantilla.load({ url: path, script: true });
    } else {
        Moduls.app.child.templateAplicacion.child.panelPlantilla.load({
            url: 'modulos/comunes/blanco.html',
            script: false
        });
    }
    
}

// Utils Functions
function $gestionSol(path) {
    return $('.modulGestionSolicitudCae ' + path);
}