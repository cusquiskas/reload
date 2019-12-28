var P_flag;
var fechasok = true;
var fecha;
var nombrearchivo;
var gestionIconoPortal = class {


    constructor(modulo) {

        fecha = new Date();
        let mes = fecha.getMonth() + 1;
        nombrearchivo = fecha.getDate() + "-" + mes + "-" + fecha.getFullYear() + fecha.getHours() + fecha.getMinutes() + fecha.getSeconds();


    }


    listadoImagenes(s, d, e) {

        if (s) {

        } else {
            validaErroresCbk(d);
        }

    }

    selectedRow(data) {
        Moduls.app.child.templateGestion.Forms.GestionIcono = data;
    }

    deselectedRow(data) {
        Moduls.app.child.templateGestion.Forms.GestionIcono = null;
    }

    clickNuevo() {

        Moduls.app.child.templateGestion.Forms.GestionIcono = null;
        Moduls.app.child.modal.child.modalBody.load({
            url: 'modulos/comunes/comunes.html?formNuevoEditarGestionIcono',
            script: false
        });

        construirModal({title: "Nuevo Icono", w: 1200});
        P_flag = "I";


    }


    clickModificar() {

        Moduls.app.child.modal.child.modalBody.load({
            url: 'modulos/comunes/comunes.html?formNuevoEditarGestionIcono',
            script: false
        });

        if (Moduls.app.child.templateGestion.Forms.GestionIcono == null) {
            toast({tipo: 'error', msg: 'Seleccione un registro'});
        } else {

            construirModal({title: "Modificar Icono", w: 1200});
            P_flag = "U";


        }
    }


    clickBorrar() {

        if (Moduls.app.child.templateGestion.Forms.GestionIcono == null) {
            toast({tipo: 'error', msg: 'Seleccione un registro'});
        } else {
            Moduls.app.child.modal.child.modalBody.load({
                url: 'modulos/comunes/comunes.html?mensajeBorrar',
                script: false
            });
            construirModal({
                title: 'Icono',
                w: 300,
                canceltext: "No",
                oktext: "Sí",
                okfunction: function () {
                    P_flag = "D";
                    let object = {};
                    object['P_CODICO'] = Moduls.app.child.templateGestion.Forms.GestionIcono.CODICO;
                    object['P_FLAG'] = P_flag;
                    Moduls.app.child.templateGestion.Forms.borrarIcono.set(object);
                    cerrarModalIE($('#myModal'));
                    Moduls.app.child.templateGestion.Forms.borrarIcono.executeForm();


                }
            });
        }
    }


}


function borrarIcono(s, d, e) {
    if (s) {

        toast({tipo: 'success', msg: d.root.msg.toString()});
        Moduls.app.child.templateGestion.Forms.listadoImagenes.executeForm()


    } else {
        validaErroresCbk(d, true);
    }

}

function GestionIcono(s, d, e) {


    if (s) {


        e.form.modul.Forms.nFile.uploadDocument({file: e.form.parametros.P_IMAGEN.value})
        cerrarModalIE($('#myModal'));
        toast({tipo: 'success', msg: d.root.msg.toString()});
        Moduls.app.child.templateGestion.Forms.listadoImagenes.executeForm()
    } else {
        validaErroresCbk(d, true);
    }

}


function listadoImagenesComun() {
    configurarBotonsubida();


}

function configurarBotonsubida() {

    Moduls.app.child.modal.child.modalBody.Forms.nFile = new uploadProject();

    let file = Moduls.app.child.modal.child.modalBody.Forms.nFile;
    let aqui = dondeEstoy(Moduls.app.child.modal.child.modalBody.Forms.GestionIcono.formulario);

    file.setBtnSelect(aqui.formulario.getElementsByClassName('btnAdjuntarArchivoIcono')[0]);
    file.setBoxEco(aqui.formulario.getElementsByClassName('addfile')[0]);
    file.setBtnDelete(aqui.formulario.getElementsByClassName('eliminarAdjuntarArchivo')[0]);
    file.setFncValidation(SubidaCorrectaImagen);
    file.setFncCallback(subida_correcta_imagen);
    file.setConfig({
        exts: ['.PNG'],
        smax: 5242880,
        ruta: '/var/www/webapps04/estatico/portal/opcionmenu/'
    });
    file.initDocument();

}


function subida_correcta_imagen(s, d, e) {
    if (s) {

    } else {
        toast({tipo: 'error', msg: resuelveError(d), donde: '.modal-header'});

    }
}

function SubidaCorrectaImagen(s, d, e) {


    if (s) {
        toast({tipo: 'success', msg: 'Fichero añadido correctamente', donde: '.modal-header'});


    } else {
        toast({
            tipo: 'error',
            msg: "el formato permitido es PNG , el que usted a intentado es:" + d.fileExt,
            donde: '.modal-header'
        });

    }
}

function CargarFormulatioIcono() {


    if (Moduls.app.child.templateGestion.Forms.GestionIcono == null) {

    } else {
        let aquis = Moduls.app.child.modal.child.modalBody.Forms.GestionIcono;
        aquis.set({P_CODICO: Number(Moduls.app.child.templateGestion.Forms.GestionIcono.CODICO)});
        aquis.set({P_FLAG: P_flag});
        aquis.set({P_FECHADESDE: formatDate(Moduls.app.child.templateGestion.Forms.GestionIcono.fdesde)});
        aquis.set({P_FECHAHASTA: formatDate(Moduls.app.child.templateGestion.Forms.GestionIcono.fhasta)});
        aquis.set({P_IMAGEN: Moduls.app.child.templateGestion.Forms.GestionIcono.imagen+'@'+ Moduls.app.child.templateGestion.Forms.GestionIcono.nombreimagen});
        aquis.set({P_TEXTO: Moduls.app.child.templateGestion.Forms.GestionIcono.texto});
        aquis.set({P_FINAN: Moduls.app.child.templateGestion.Forms.GestionIcono.fhasta});
    }
}

function formatDate(date) {

    return date.split("/").reverse().join("-");

}

function comprobraarchivo(archivoor,archivoca) {


}
function eventosBotonesIcono() {
    $('.ComprobarFechas').click(function () {


        if (Moduls.app.child.modal.child.modalBody.Forms.GestionIcono.parametros.P_FECHAHASTA.value < Moduls.app.child.modal.child.modalBody.Forms.GestionIcono.parametros.P_FECHADESDE.value) {

            toast({tipo: 'error', msg: 'La fecha Hasta en mayor que la fecha Desde ', donde: '.modal-header'});

            return fechasok = false;

        } else {

            if( Moduls.app.child.modal.child.modalBody.Forms.GestionIcono.parametros.P_IMAGEN.value.includes('@')){
                Moduls.app.child.modal.child.modalBody.Forms.GestionIcono.set({P_IMAGEN:  Moduls.app.child.modal.child.modalBody.Forms.GestionIcono.parametros.P_IMAGEN.value});

            }else {
                Moduls.app.child.modal.child.modalBody.Forms.GestionIcono.set({P_IMAGEN: nombrearchivo + "@" + Moduls.app.child.modal.child.modalBody.Forms.GestionIcono.parametros.P_IMAGEN.value});
            }
            Moduls.app.child.modal.child.modalBody.Forms.GestionIcono.executeForm();
            return fechasok = true;
        }
    });

}