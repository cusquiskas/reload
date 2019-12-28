$(function () {
    init();

    $modalFicheros('.btn-adjuntar-fichero').click(function () {
        let role = getParameter(adjfichModal().child.modalBody, 'filesmodal').role;
        let modalBody = adjfichModal().child.modalBody;
        let conf = modalBody.inputFileConfig;
        let fileUploader = new uploadProject();
        fileUploader.setConfig(conf);
        fileUploader.setFncValidation(function (s, d, e) {
            if (s) {
                var index = getParameter(adjfichModal().child.modalBody, 'filesmodal').files.push(fileUploader) - 1;

                addRowModalAdj(fileUploader.fileProperties.name, index);
            } else {
                let msg =
                    (d.type == 'smax') ? 'Excedido tamaño del documento:<br>Máximo: ' + d.fileMax + '<br>' + 'Real: ' + d.fileSize :
                        (d.type == 'exts') ? 'Tipo de archivo no permitido:<br>Permitidos: ' + d.exts + '<br>Real: ' + d.fileExt :
                            'Error desconocido validando el documento';
                toast({ tipo: 'error', msg: msg, donde: '.modal-header' });
            }
        });
        fileUploader.content.click();
    });

    // $modalFicheros('.btn-borrar-fichero').click(function() { borrarFichero(this); });
});

function init() {
    let input_files = getParameter(adjfichModal().child.modalBody, 'filesmodal').files;
    let role = getParameter(adjfichModal().child.modalBody, 'filesmodal').role;

    for(let i = 0; i < input_files.length; i++) {
        if(input_files[i].nomint) {
            addRowModalAdj(input_files[i].nomext, i, input_files[i].fecupl);
        } else {
            addRowModalAdj(input_files[i].fileProperties.name, i);
        }
    }

    if (role == 'ACCEPT') {
        $('#okfunction').addClass('dn');
        $modalFicheros('.btn-adjuntar-fichero').addClass('dn');
        $modalFicheros('.del-col').addClass('dn');
    } else if (role == 'VIEW') {
        $('#okfunction').addClass('dn');
        $modalFicheros('.btn-adjuntar-fichero').addClass('dn');
        $modalFicheros('.del-col').addClass('dn');
    } else if (role == 'MODF') {
        $('#okfunction').html('Aceptar y Notificar');
        $modalFicheros('.del-col').addClass('dn');
    } else if (role == 'TRAM') {
        $('#okfunction').addClass('dn');
        $modalFicheros('.btn-adjuntar-fichero').addClass('dn');
        $modalFicheros('.del-col').addClass('dn');
    }

    callFileOptions({ apl: 'autoservicio', cbk: 'configFileUploader' });
}
function configFileUploader(config) {
    adjfichModal().child.modalBody.inputFileConfig = config;
}

function verFichero(e) {
    LibraryManager.load('filesaver-1.0.1', 'core', function () { });

    let input_files = getParameter(adjfichModal().child.modalBody, 'filesmodal').files;
    let indice = parseInt($(e).attr('indice'));

    getFile(
        adjfichModal().child.modalBody.inputFileConfig.ruta + '/' + input_files[indice].nomint,
        input_files[indice].nomext,
        true);
}

function borrarFichero(e) {
    let input_files = getParameter(adjfichModal().child.modalBody, 'filesmodal').files;

    let indice = parseInt($(e).attr('indice'));
    input_files[indice] = 'null';

    $(e).parent().parent().remove();
}

function addRowModalAdj(file, indx, fecupl) {
    $modalFicheros('.tbl-ficheros').append(
        '<tr><th>' + file + '</th>' + 
        (fecupl ? '<th style="min-width: 180px;">' + fecupl + '</th>' : '') + 
        '<td class="del-col"><button class="btn btn-info btn-with-img btn-borrar-fichero" ' +
        'indice="' + indx + '"><span>Borrar </span><i class="material-icons">delete</i></button>' + 
        '<td class="view-col"><button class="btn btn-primary btn-with-img btn-ver-fichero" ' +
        'indice="' + indx + '"><span>Ver </span><i class="material-icons">search</i></button></td>' +
        '</td></tr>'
    );
    $modalFicheros('[indice=' + indx + '].btn-ver-fichero').click(function () {
        verFichero(this);
    });
    $modalFicheros('[indice=' + indx + '].btn-borrar-fichero').click(function () {
        borrarFichero(this);
    });
}

// Utils Functions
function $modalFicheros(path) {
    return $('.modal-adjuntar-ficheros ' + path);
}

function adjfichModal() {
    if (getParameter(Moduls, 'sesion_externa') === true) {
        return Moduls.modal;
    } else {
        return Moduls.app.child.modal;
    }
}
