var beneficiario = class {

    constructor(modulo) {
        Moduls.app.ExisteBeneficiarios = true;
        $('.contenedorBeneficiario').width('100%');
        if ((!Moduls.app.ExisteDatosPersonales && !Moduls.app.ExisteDatosEmpresa && !Moduls.app.ExisteDatosFiscales &&
            !Moduls.app.ExisteSituacionFamiliar && !Moduls.app.ExisteParentesco) || getPerfilEmpleadoDefault() === 'beneficiarios') {
            $('.aperturaDatosPersonales').removeClass('cambio');
            $('.cuerpoDatosPersonales').removeClass('show');
            $('#heading8').addClass('cambio');
            $('#collapse8').addClass('show');
        }

        Moduls.header.varBeneficiarios = {};
        Moduls.header.varBeneficiarios.mas = '';
        Moduls.header.varBeneficiarios.menos = '';
        Moduls.header.varBeneficiarios.cuenta = 0;
        Moduls.header.varBeneficiarios.nFile = new uploadProject();

        callFileOptions({ apl: 'autoservicio', cbk: 'setFileOptionBeneficiarios' });

        LibraryManager.load('moment-2.24.0', 'core', function () { });
    }

    initBeneficiarios(s, d, e) {
        if (s) {
            // primero cargamos la información que viene de SAP, que es la base //
            if (d.benes && d.benes.act && d.benes.act.ben) {
                $('#listaBeneficiarios').empty();
                let cadena = e.form.modul.return('modulos/comunes/tabla.html?listadoBeneficiariosAct'),
                    json = d.benes.act.ben,
                    form = Moduls.header.varBeneficiarios;
                if (typeof (json) == "object" && !esArray(json)) json = [json];
                for (let i = 0; i < json.length; i++) {
                    json[i].nif = (json[i].nif ? json[i].nif : "");
                    let HTML = $.parseHTML(cadena.reemplazaMostachos(json[i]));
                    HTML[0].getElementsByTagName('i')[0].setAttribute('row', JSON.stringify(json[i]));
                    HTML[0].getElementsByTagName('i')[0].addEventListener('click', function (e) {
                        let json = JSON.parse(this.getAttribute('row'));
                        $(document.getElementById(json.nif + '_' + json.cparen + '_' + json.nombre + '_d')).addClass('dn');
                        $(document.getElementById(json.nif + '_' + json.cparen + '_' + json.nombre + '_c')).removeClass('dn');
                        //$(document.getElementById(json.nif + '_' + json.cparen + '_' + json.nombre + '_c').parentNode.parentNode).addClass('colorRojo');
                        $(document.getElementById(json.nif + '_' + json.cparen + '_' + json.nombre + '_c').parentNode.parentNode).addClass('textoTachado');
                        form.menos += '$cod$' + Moduls.header.user.codusr + '$cod$';
                        form.menos += '$nom$' + (json.nombre || '') + '$nom$';
                        form.menos += '$ap1$' + (json.apell1 || '') + '$ap1$';
                        form.menos += '$ap2$' + (json.apell2 || '') + '$ap2$';
                        form.menos += '$nac$' + (json.fecnac || '') + '$nac$';
                        form.menos += '$par$' + (json.cparen || '') + '$par$';
                        form.menos += '$dni$' + (json.nif || '') + '$dni$';
                        form.menos += '$tip$' + (json.tnif || '') + '$tip$';
                        form.menos += '$beg$' + (json.begda || '') + '$beg$';
                        form.menos += '$acc$-$acc$##';
                    });
                    $('#listaBeneficiarios').append(HTML);
                }

            }
            // comprobamos si es una solicitud abierta, para mostrar el estado y añadir las modificaciones //
            if (d.benes && d.benes.mas !== "") {
                $('#mensajeBeneficiariosNo').removeClass('dn');
                $('#modificarBeneficiarios').addClass('dn');
                // ajustamos la líneas de los beneficiarios actuales //
                for (let i = 0; i < d.benes.mas.mas.length; i++) {
                    let json = d.benes.mas.mas[i];
                    if (json.nif === "null" || !json.nif || json.nif === " ") json.nif = "";
                    switch (json.accion) {
                        case "-":
                            $(document.getElementById(json.nif + '_' + json.pparen + '_' + json.nombre + '_d')).addClass('dn');
                            $(document.getElementById(json.nif + '_' + json.pparen + '_' + json.nombre + '_c')).removeClass('dn');
                            break;
                        case "+":
                            let cadena = e.form.modul.return('modulos/comunes/tabla.html?listadoBeneficiariosAct');
                            let HTML = $.parseHTML(cadena.reemplazaMostachos(
                                {
                                    begda: 'Pendiente',
                                    nombre: json.nombre,
                                    apell1: json.apell1,
                                    fecnac: json.fecnac,
                                    pparen: json.pdespa,
                                    nif: json.nif,
                                    cparen: json.pparen
                                }
                            ));
                            $(HTML).addClass('colorVerde');
                            $('#listaBeneficiarios').append(HTML);
                            break;
                    }
                }
            }
        } else {
            validaErroresCbk(d);
        }
    }

    callBackSubidaArchivoBeneficiario(s, d, e) {
        if (s) {

        } else {
            validaErroresCbk(d, true);
            e.upload.initDocument();
        }
    }

    beneficiarios(s, d, e) {
        let form = e.form.modul.Forms.submit_beneficiarios;
        form.set({
            p_codusr: Moduls.header.user.codusr,
            p_datos: Moduls.header.varBeneficiarios.mas + Moduls.header.varBeneficiarios.menos,
            P_xsid: getXsid(),
            p_password: Moduls.getModalbody().getForm('accionCheckLogin').parametros.p_pasusr.value
        });
        form.executeForm();
    }

    submit_beneficiarios(s, d, e) {
        if (s) {
            toast({ tipo: 'info', msg: 'Petición enviada a Atención al empleado' });
            $('#collapse8 .btnModificando').fadeOut("slow", function () { $("#modificarBeneficiarios").fadeIn("slow", function () { }); });

            Moduls.app.child.templateAplicacion.child.tempBeneficiarios.Forms.initBeneficiarios.executeForm();

        } else {
            validaErroresCbk(d);
        }
    }

    validaArchivoBeneficiario(s, d, e) {
        if (s) {
            e.upload.uploadDocument({ file: sysdate('yymmdd') + 'DATBE_' + Moduls.header.user.codusr + '_' + Moduls.header.varBeneficiarios.cuenta + e.upload.fileProperties.extension.toUpperCase() });
        } else {
            let msg = (d.type == 'smax') ? 'Excedido tamaño del documento:<br>Máximo: ' + d.fileMax + '<br>' + 'Real: ' + d.fileSize :
                (d.type == 'exts') ? 'Tipo de archivo no permitido:<br>Permitidos: ' + d.exts + '<br>Real: ' + d.fileExt :
                    'Error desconocido validando el documento';
            toast({ tipo: 'error', msg: msg, donde: '.modal-header' });
        }
    }

    ajustaDNIBeneficiario(combo) {
        let aqui = dondeEstoy(combo.target);
        if (combo.target.value !== "-") {
            aqui.parametros.nif.object.required = true;
            aqui.parametros.nif.object.disabled = false;
        } else {
            aqui.parametros.nif.object.required = false;
            aqui.parametros.nif.object.disabled = true;
            aqui.set({ nif: '' });
            let event = document.createEvent("Event"); event.initEvent('blur', false, true);
            aqui.parametros.nif.object.dispatchEvent(event);
        }
    }

    ajustaParentesco(combo) {
        combo = combo.target;
        let valores = ['1', '2', '11', '12', '13', 'Z1', 'Z3', 'Z4'], i;
        for (i = 1; i < combo.options.length; i++) {
            if (valores.inArray(combo.options[i].value) < 0) {
                combo.remove(i); i--;
            }
        }
        dondeEstoy(combo).parametros.pparen.value = combo.value;
    }

    addFileForAddPerson() {
        let cadena = Moduls.app.return('modulos/comunes/tabla.html?listadoBeneficiariosAct')
        let HTML = $.parseHTML(cadena.reemplazaMostachos({ begda: '', nombre: '', apell1: '', fecnac: '', pparen: '', nif: '', cparen: '' }));
        HTML[0].getElementsByTagName('i')[2].addEventListener('click', function (e) {
            Moduls.app.child.modal.child.modalBody.load({ url: 'modulos/comunes/comunes.html?formNuevoBeneficiario', script: false });
            construirModal({ title: 'Datos del Beneficiario', w: '800px' });
        });
        $('#listaBeneficiarios').append(HTML);
        $('#___m').removeClass('dn');
    }

    habilitarModificacionBeneficiarios() {
        $("#modificarBeneficiarios").fadeOut("slow", function () {
            $('#collapse8 .btnModificando').removeClass('dn');
            $("#collapse8 .btnModificando").fadeIn("slow", function () { });
            Moduls.getTempbeneficiarios().getScript().addFileForAddPerson();
        });

    }
    guardarDatosBeneficiarios() {
        Moduls.app.child.templateAplicacion.child.tempBeneficiarios.Forms.beneficiarios.executeForm();
    }

    initFileOptionBeneficiarios() {
        let file = Moduls.header.varBeneficiarios.nFile;
        file.setBtnSelect(getId('botonAdjuntarArchivo'));
        file.setFncValidation(Moduls.getTempbeneficiarios().getScript().validaArchivoBeneficiario);
        file.setFncCallback(Moduls.getTempbeneficiarios().getScript().callBackSubidaArchivoBeneficiario);
        file.setBoxEco(getId('adjuntarArchivoBeneficiario'));
        file.initDocument();
    }
}

function setFileOptionBeneficiarios(obj) {
    Moduls.header.varBeneficiarios.nFile.setConfig(obj);
}

function eventosFormularioNuevoBeneficiario(s, d, e) {
    e.form.modul.Forms.addBeneficiario.parametros.pparen.object.addEventListener('ajaxSuccess', Moduls.getTempbeneficiarios().getScript().ajustaParentesco);
    e.form.modul.Forms.addBeneficiario.parametros.tnif.object.addEventListener('change', Moduls.getTempbeneficiarios().getScript().ajustaDNIBeneficiario);
    Moduls.getTempbeneficiarios().getScript().initFileOptionBeneficiarios();
}

function addBeneficiario(s, d, e) {
    if (s) {
        let fecha = moment($('#fechaNacBene').val());
        let fechaActual = moment(sysdate('yyyy-mm-dd'));
        let diferencia = fechaActual.diff(fecha, 'days');

        if (diferencia > 1095 && !$('#dniBene').val()) {
            toast({
                tipo: 'info',
                msg: 'La edad del Beneficiario es mayor de 3 años, debe indicar Tipo y Número de Documentación ',
                donde: '.modal-header'
            });
        } else {
            let json = e.form.parametros;
            let cadena = e.form.modul.return('modulos/comunes/tabla.html?listadoBeneficiariosAct');
            let HTML = $.parseHTML(cadena.reemplazaMostachos(
                {
                    begda: 'Pendiente',
                    nombre: json.nombre.value,
                    apell1: json.apell1.value,
                    fecnac: json.fecnac.value.hazFecha(((esInternetExplorer()) ? 'dd/mm/yyyy' : 'yyyy-mm-dd'), 'dd/mm/yyyy'),
                    pparen: getSelectText(json.pparen.object, json.pparen.value),
                    nif: json.nif.value,
                    cparen: json.pparen.value
                }
            ));
            $(HTML).addClass('colorVerde');
            // 14293 - 2019.03.22 - En Explorer no lo interpreta JQuery
            // se comprueba que a Chrome lo interpreta igual con la doble invocación a JQuery
            $($('.listadoBeneficiariosAct')[$('.listadoBeneficiariosAct').length - 1]).remove();
            $('#listaBeneficiarios').append(HTML);
            Moduls.header.varBeneficiarios.cuenta++;
            Moduls.getTempbeneficiarios().getScript().addFileForAddPerson();
            cerrarModalIE($('#myModal'));
            let form = Moduls.header.varBeneficiarios;
            form.mas += '$cod$' + Moduls.header.user.codusr + '$cod$';
            form.mas += '$nom$' + json.nombre.value + '$nom$';
            form.mas += '$ap1$' + json.apell1.value + '$ap1$';
            form.mas += '$ap2$' + json.apell2.value + '$ap2$';
            form.mas += '$nac$' + json.fecnac.value.hazFecha(((esInternetExplorer()) ? 'dd/mm/yyyy' : 'yyyy-mm-dd'), 'dd/mm/yyyy') + '$nac$';
            form.mas += '$par$' + json.pparen.value + '$par$';
            form.mas += '$dni$' + json.nif.value + '$dni$';
            form.mas += '$tip$' + json.tnif.value + '$tip$';
            if (Moduls.header.varBeneficiarios.nFile.config.file != '') {
                form.mas += '$doc$' + Moduls.header.varBeneficiarios.nFile.config.file + '$doc$';
            }
            form.mas += '$acc$+$acc$##';
            Moduls.header.varBeneficiarios.nFile.config.file = '';
        }
    } else {
        validaErroresCbk(d, true);
    }
}

$('#guardarBeneficiarios').click(function () {
    confirmaSesion('DATBE');
});

$("#modificarBeneficiarios").click(function () {
    Moduls.getTempbeneficiarios().getScript().habilitarModificacionBeneficiarios();
});

$('#cancelarBeneficiarios').click(function () {
    $('#collapse8 .btnModificando').fadeOut("slow", function () {
        $("#modificarBeneficiarios").fadeIn("slow", function () { });
    });

    Moduls.header.varBeneficiarios.mas = '';
    Moduls.header.varBeneficiarios.menos = '';
    Moduls.header.varBeneficiarios.cuenta = 0;

    Moduls.app.child.templateAplicacion.child.tempBeneficiarios.Forms.initBeneficiarios.executeForm();
});

$('#heading8').click(function () {
    if ($('#collapse8').hasClass('show')) {
        $('#heading8').removeClass('cambio');
        $('#collapse8').removeClass('show');
    } else {
        $('.aperturaDatosPersonales').removeClass('cambio');
        $('.cuerpoDatosPersonales').removeClass('show');
        $('#heading8').addClass('cambio');
        $('#collapse8').addClass('show');
    }
});