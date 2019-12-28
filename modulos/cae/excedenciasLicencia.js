// Funciones de inicialización
$(function () {
    $excedenciaLicencia('input[name=p_valor1]').on('click change', function () {
        $excedenciaLicencia('.tbl-valores th, .tbl-valores td').removeAttr('style');
        let elem = $(this).parent();
        let row = elem.parent();
        elem.css('background-color', 'rgb(100, 200, 100)');
        for (let i = 0; i < elem.index(); i++) {
            row.children().eq(i).css('background-color', 'lightgreen');
            row.children().eq(i).css('color', 'black');
        }
        for (let i = 0; i < row.index(); i++) {
            row.parent().children().eq(i).children().eq(elem.index()).css('background-color', 'rgb(209, 255, 209)');
        }
        let head = row.parent().parent().children().first();
        if (head.prop("tagName") == 'THEAD') head.children().first().children().eq(elem.index()).css('background-color', 'rgb(50, 96, 135)');
    });

    $excedenciaLicencia('.btn-adjuntar_ficheros').click(function () {
        setParameter(
            excedModal().child.modalBody,
            'filesmodal',
            getParameter(excelicAqui(), 'filesmodal'));

        excedModal().child.modalBody.load({
            url: 'modulos/cae/modalAdjuntarFicheros.html',
            script: true
        });
        construirModal({
            title: 'Adjuntar Ficheros',
            w: '900px',
            oktext: "Aceptar",
            okfunction: function () {
                let codapl = excelicAqui().codapl;
                let count = getParameter(excelicAqui(), 'filesmodal').cnt;
                let files_aux = getParameter(excelicAqui(), 'filesmodal').files;
                let input_files = [];
                for (let i = 0; i < files_aux.length; i++) {
                    if (files_aux[i] != 'null') input_files.push(files_aux[i]);
                }

                let codusr = Moduls.header.user.codusr;
                let nomext = '', nomint = '';
                for (let i = 0; i < input_files.length; i++) {
                    if (input_files[i].nomint) {
                        nomext += input_files[i].nomext + '#';
                        nomint += input_files[i].nomint + '#';
                    } else {
                        count++;
                        let nom_file = sysdate('YYMMDD') + codapl + codusr + '_' + count + input_files[i].fileProperties.extension;
                        input_files[i].uploadDocument({ file: nom_file });

                        nomext += input_files[i].fileProperties.name + '#';
                        nomint += nom_file + '#';

                        input_files[i] = {
                            nomext: input_files[i].fileProperties.name,
                            nomint: nom_file
                        };
                    }
                }

                setParameter(excelicAqui(), 'filesmodal', {
                    cnt: count,
                    files: input_files,
                    role: getParameter(excelicAqui(), 'filesmodal').role
                });

                excelicAqui().Forms.frmExcedenciaLicencia.set({ p_nomext: nomext, p_nomint: nomint });
                excelicAqui().Forms.frmUpdateDocs.set({ p_nomext: nomext, p_nomint: nomint });

                if (excelicAqui().Forms.frmUpdateDocs.parametros.p_codtra.value != 'empty') {
                    excelicAqui().Forms.frmUpdateDocs.executeForm();
                }

                cerrarModalIE($('#myModal'));
            }
        });
    });


    $excedenciaLicencia('.btn-aceptar').click(function () {
        invocaAjax({
            direccion: '/management/mvc-management/controller/newintra.xwi_plantilla_cae.acepta_tramite.json',
            parametros: {
                p_codtra: excelicAqui().Forms.frmUpdateDocs.parametros.p_codtra.value
            },
            contentType: 'application/json',
            retorno: function (s, d, e) {
                if (s) {
                    $excedenciaLicencia('.botonera-aceptar').addClass('dn');
                    $excedenciaLicencia('.botonera-rechazar').addClass('dn');
                    toast({ tipo: 'success', msg: 'Se ha aceptado la solicitud' });
                    initFormularioExternalSesion();
                } else {
                    toast({ tipo: 'error', msg: 'Error al aceptar la solicitud' });
                }
            }
        });
    });

    $excedenciaLicencia('.btn-solicitar-excedencia').click(function () {
        let dirEmail = excelicAqui().Forms.frmExcedenciaLicencia.parametros.p_emlusr.value.split('@');
        if (dirEmail.length > 2) {
            toast({ tipo: 'error', msg: 'Solo puede indicar una dirección de E-Mail' });
        } else {
            excelicAqui().Forms.frmExcedenciaLicencia.executeForm();
        }
    });

    $excedenciaLicencia('.btn-rechazar').click(function () {
        excedModal().child.modalBody.load({
            url: 'modulos/comunes/comunes.html?modalConfirmacion',
            script: false
        });

        construirModal({
            title: 'Rechazar petición',
            w: '900px',
            canceltext: 'Cancelar',
            oktext: "Aceptar",
            okfunction: function () {
                let motivo = $('.modalConfirmacion textarea[name=p_motivo]').val();
                if (motivo && motivo.length < 2000) {
                    cerrarModalIE($('#myModal'));

                    invocaAjax({
                        direccion: '/management/mvc-management/controller/newintra.xwi_plantilla_cae.rechaza_tramite.json',
                        parametros: {
                            p_codtra: excelicAqui().Forms.frmUpdateDocs.parametros.p_codtra.value,
                            p_observ: motivo
                        },
                        contentType: 'application/json',
                        retorno: function (s, d, e) {
                            if (s) {
                                $excedenciaLicencia('.botonera-aceptar').addClass('dn');
                                $excedenciaLicencia('.botonera-rechazar').addClass('dn');
                                toast({ tipo: 'success', msg: 'Se ha rechazado la solicitud' });
                                initFormularioExternalSesion();
                            } else {
                                toast({ tipo: 'error', msg: 'Error al rechazar la solicitud' });
                            }
                        }
                    });
                } else {
                    if (motivo) {
                        toast({ tipo: 'error', msg: 'El campo del motivo es obligatorio' });
                    } else {
                        toast({ tipo: 'error', msg: 'El campo del motivo debe tener un tamaño máximo de 2000 carácteres' });
                    }
                }
            }
        });
    });

    $excedenciaLicencia('form[name=frmExcedenciaLicencia] [name=p_valor2]').change(function () {
        $excedenciaLicencia('form[name=frmExcedenciaLicencia] [name=p_valor3]').attr('min', $(this).val());
    });

    $excedenciaLicencia('form[name=frmExcedenciaLicencia] [name=p_valor3]').change(function () {
        $excedenciaLicencia('form[name=frmExcedenciaLicencia] [name=p_valor2]').attr('max', $(this).val());
    });

    $excedenciaLicencia('form[name=frmExcedenciaLicencia] [name=p_valor2]').blur(function () {
        if ($('.rein_3').is(':checked') || $('.rein_6').is(':checked') || $('.rein_9').is(':checked') || $('.rein_121').is(':checked') || $('.rein_125').is(':checked')) {
            excelicAqui().Forms.frmExcedenciaLicencia.set({ p_valor3: esInternetExplorer() ? this.value.hazFecha('dd/mm/yyyy', 'yyyy-mm-dd') : this.value });
        }
    });

    $excedenciaLicencia('form[name=frmExcedenciaLicencia] [name=p_valor1]').change(function () {
        if ($('.rein_3').is(':checked') || $('.rein_6').is(':checked') || $('.rein_9').is(':checked') || $('.rein_121').is(':checked') || $('.rein_125').is(':checked')) {
            $('.fechaFin').addClass('dn');
            excelicAqui().Forms.frmExcedenciaLicencia.set({ p_valor3: esInternetExplorer() ? $excedenciaLicencia('form[name=frmExcedenciaLicencia] [name=p_valor2]').val().hazFecha('dd/mm/yyyy', 'yyyy-mm-dd') : $excedenciaLicencia('form[name=frmExcedenciaLicencia] [name=p_valor2]').val() });
        } else {
            $('.fechaFin').removeClass('dn');
            excelicAqui().Forms.frmExcedenciaLicencia.set({ p_valor3: '' });
        }
    });

    onload();
});

function onload() { }

function initFormulario(codusr, fecsol) {
    invocaAjax({
        direccion: '/management/mvc-management/controller/newintra.xwi_plantilla_cae.lista_tramite.json',
        parametros: {
            p_codusr: codusr,
            p_fecsol: fecsol
        },
        contentType: 'application/json',
        retorno: function (s, d, e) {
            if (s && d.root.length > 0) {
                if (d.root[0].codest == 'X') {
                    $('.panel-observacion').removeClass('dn');
                }
                initAjustarPorCodigoPlantilla(d.root[0].codplt.toString());
                initFiles(d.root[0].codtra);
                initTablaResponsablesEL(d.root[0].codusr);
                datosUsuarioLast({
                    nDatos: 'LEP', usr: d.root[0].codusr, fnc: function (user) {
                        excelicAqui().Forms.frmExcedenciaLicencia.set({
                            p_numusr: user.pernr,
                            p_nombre_completo: user.vorna + ' ' + user.nach + ' ' + user.nach2,
                            p_empresa: user.empresa,
                            p_centro: user.centro + ' - ' + user.subdiv,
                            p_departamento: user.uni_org,
                            p_tlfusr: d.root[0].tlfusr,
                            p_emlusr: d.root[0].emlusr,
                            p_valor1: d.root[0].valor1,
                            p_valor2: formatDate(d.root[0].valor2),
                            p_valor3: formatDate(d.root[0].valor3),
                            p_observ: d.root[0].observ
                        });

                        $excedenciaLicencia('form[name=frmExcedenciaLicencia] input[type=text]').change();
                        $excedenciaLicencia('form[name=frmExcedenciaLicencia] input[value=' + d.root[0].valor1 + ']:visible').prop("checked", true);
                        $excedenciaLicencia('form[name=frmExcedenciaLicencia] input').prop('readonly', true);
                        $excedenciaLicencia('form[name=frmExcedenciaLicencia] input').prop('disabled', false);
                        $excedenciaLicencia('form[name=frmExcedenciaLicencia] :radio:not(:checked)').attr('disabled', true);
                    }
                });
                excelicAqui().Forms.frmUpdateDocs.set({ p_codtra: d.root[0].codtra });
            } else {
                validaErroresCbk(d);
            }
        }
    });
}

function initFormularioExternalSesion() {
    invocaAjax({
        direccion: '/management/mvc-management/controller/newintra.xwi_plantilla_cae.tramite_sesion.json',
        parametros: {},
        contentType: 'application/json',
        retorno: function (s, d, e) {
            if (s && d.root) {
                if (d.root.codest != 'A') {
                    $excedenciaLicencia('.observaciones_responsable').removeClass('dn');
                    $('.observaciones_responsable2').removeClass('dn');
                    if (d.root.codest == 'W' && d.root.reclam == 'X') {
                        $excedenciaLicencia('.botonera-aceptar').removeClass('dn');
                        $excedenciaLicencia('.botonera-rechazar').addClass('dn');
                    } else if (d.root.codest == 'W' && d.root.reclam == null) {
                        $excedenciaLicencia('.botonera-aceptar').removeClass('dn');
                        $excedenciaLicencia('.botonera-rechazar').removeClass('dn');
                    }
                }
                excedModal().load({ url: 'modulos/comunes/modal.html', script: false });
                initAjustarPorCodigoPlantilla(d.root.codplt.toString());
                initFiles(d.root.codtra);
                initTablaResponsablesEL(d.root.codusr);
                datosUsuarioLast({
                    nDatos: 'LEP', usr: d.root.codusr, fnc: function (user) {
                        Moduls.app.Forms.frmExcedenciaLicencia.set({
                            p_numusr: user.pernr,
                            p_nombre_completo: user.vorna + ' ' + user.nach + ' ' + user.nach2,
                            p_empresa: user.empresa,
                            p_centro: user.centro + ' - ' + user.subdiv,
                            p_departamento: user.uni_org,
                            p_tlfusr: d.root.tlfusr,
                            p_emlusr: d.root.emlusr,
                            p_valor1: d.root.valor1,
                            p_valor2: formatDate(d.root.valor2),
                            p_valor3: formatDate(d.root.valor3),
                            p_horas: d.root.valor4,
                            p_horario: d.root.valor4,
                            observ: d.root.motrch
                        });

                        $excedenciaLicencia('form[name=frmExcedenciaLicencia] input[type=text]').change();
                        $excedenciaLicencia('form[name=frmExcedenciaLicencia] input[value=' + d.root.valor1 + ']:visible').prop("checked", true);

                        $excedenciaLicencia('form[name=frmExcedenciaLicencia] input, ' +
                            'form[name=frmExcedenciaLicencia] textarea').prop('readonly', true);
                        $excedenciaLicencia('form[name=frmExcedenciaLicencia] input').prop('disabled', false);
                        $excedenciaLicencia('form[name=frmExcedenciaLicencia] :radio:not(:checked)').attr('disabled', true);
                    }
                });

                Moduls.app.Forms.frmExcedenciaLicencia.set({ p_estsol: 'La solicitud se encuentra ' + d.root.desest });

                $('.estado').val('La solicitud se encuentra ' + d.root.desest);
                $('.observ').val(d.root.motrch);
                $('.token').html('<span style="color:darkgrey;">' + sessionStorage.SESION_ID + '</span>');

                Moduls.app.Forms.frmUpdateDocs.set({ p_codtra: d.root.codtra });
            } else {
                validaErroresCbk(s ? { extra: 'No se ha podido interpretar la respuesta de "newintra.xwi_plantilla_cae.tramite_sesion.json"' } : d);
            }
        }
    });
}

function initAjustarPorCodigoPlantilla(codplt) {
    $excedenciaLicencia('.elem-by-codpla').each(function () {
        let plantillas_validas = $(this).attr('codpla').split(',');
        if ($.inArray(codplt, plantillas_validas) < 0) $(this).addClass('dn');
    });
}

function initFiles(codtra) {
    invocaAjax({
        direccion: '/management/mvc-management/controller/newintra.xwi_plantilla_cae.lista_documento.json',
        parametros: {
            p_codtra: codtra
        },
        contentType: 'application/json',
        retorno: function (s, d, e) {
            if (s) {
                let cont = 0;
                let files = [];
                for (let i = 0; i < d.root.length; i++) {
                    let indice = parseInt(d.root[i].nomint.substring(
                        d.root[i].nomint.lastIndexOf("_") + 1,
                        d.root[i].nomint.lastIndexOf(".")
                    ));
                    if (cont < indice) cont = indice;
                    files.push({
                        nomext: d.root[i].nomext,
                        nomint: d.root[i].nomint,
                        fecupl: d.root[i].fecupl
                    });
                }
                setParameter(excelicAqui(), 'filesmodal', {
                    cnt: cont,
                    files: files,
                    role: !Moduls.app.child.templateAplicacion ?
                        'ACCEPT' :
                        Moduls.app.child.templateAplicacion.paramSelSolCae ?
                            Moduls.app.child.templateAplicacion.paramSelSolCae.role : ''
                });
            } else {
                validaErroresCbk(d);
            }
        }
    });
}

function initTablaResponsablesEL(codusr) {
    invocaAjax({
        direccion: '/management/mvc-management/controller/newintra.xwi_autoservicio.dev_responsable.json',
        parametros: {
            p_codusr: codusr
        },
        contentType: 'application/json',
        retorno: function (s, d, e) {
            if (s) {
                let json = d.dat;
                let codres = '';
                let cuerpo = '<tr><td>{{nomusr}}</td><td>{{posusr}}</td></tr>';
                $excedenciaLicencia('.tbl-responsable tbody').empty();
                for (let c = 0; c < json.length; c++) {
                    codres += '#' + json[c].codusr;
                    let HTML = $.parseHTML(cuerpo.reemplazaMostachos(json[c]));
                    $excedenciaLicencia('.tbl-responsable tbody').append(HTML);
                }
                excelicAqui().Forms.frmExcedenciaLicencia.set({
                    p_codres: codres.substr(1)
                });
            } else {
                validaErroresCbk(d);
            }
        }
    });
}

// Funciones de Callback
function cbkCodigoPlantilla(s, d, e) {
    if (s && d.root.length > 0) {
        if (getParameter(Moduls, 'sesion_externa') === true) {
            // 14293 - 09.09.2019 - El responsable no puede acceder a la documentación.
            $('.btn-adjuntar_ficheros').addClass('dn');
            $excedenciaLicencia().css('padding', '80px 100px 0px 80px');
            initFormularioExternalSesion();
            $excedenciaLicencia('label').addClass('active');
            $excedenciaLicencia('.hide-on-accept').addClass('dn');
        } else {
            let p = Moduls.app.child.templateAplicacion.paramSelSolCae;
            if (p) {
                initFormulario(p.param.numper, p.param.fecsol);

                $excedenciaLicencia('.hide-on-' + p.role.toLowerCase()).addClass('dn');
                $('.panel-estado2').addClass('dn');

                excelicAqui().Forms.frmExcedenciaLicencia.set({
                    p_estsol: 'La solicitud se encuentra ' + Moduls.app.child.templateAplicacion.paramSelSolCae.param.destado
                });
            } else {
                initTablaResponsablesEL(Moduls.header.user.codusr);
                $excedenciaLicencia('.botonera-aceptar').addClass('dn');
                $excedenciaLicencia('.botonera-rechazar').addClass('dn');
                $excedenciaLicencia('.panel-estado').addClass('dn');
                $('.panel-estado2').addClass('dn');

                setParameter(excelicAqui(), 'filesmodal', { cnt: 0, files: [], role: 'SOLICITAR' });

                excelicAqui().Forms.frmExcedenciaLicencia.set({
                    p_codplt: d.root[0].codplt.toString()
                });

                initAjustarPorCodigoPlantilla(d.root[0].codplt.toString());

                excedModal().child.modalBody.load({
                    url: 'modulos/comunes/comunes.html?procedimientos-cae-excedenlicen',
                    script: false
                });
                $('#myModal .modal-body').unbind("DOMSubtreeModified.plantillascae");
                $('#myModal .modal-body').bind("DOMSubtreeModified.plantillascae", function () {
                    $('.procedimientos-cae-excedenlicen .elem-by-codpla').each(function () {
                        let plantillas_validas = $(this).attr('codpla').split(',');
                        if ($.inArray(d.root[0].codplt.toString(), plantillas_validas) < 0) $(this).addClass('dn');
                    });
                });
                construirModal({ title: 'Procedimiento', w: '900px', oktext: "Aceptar" });

                datosUsuarioLast({ nDatos: 'LEP', usr: Moduls.header.user.codusr, fnc: cbkInitDatosPersonales });

                invocaAjax({
                    direccion: '/newintra/newintra/1/xwi_plantilla_cae.configuracion_tramite.json',
                    parametros: {
                        p_codplt: d.root[0].codplt
                    },
                    retorno: function (s, d, e) {
                        if (s) {
                            excelicAqui().codapl = d.root[0].codapl;
                        } else {
                            validaErroresCbk(d);
                        }
                    }
                });

                $excedenciaLicencia('[type=radio]').each(function () {
                    switch (d.root[0].codplt) {
                        case 5:
                            switch ($(this).attr('value')) {
                                case 'value_1':
                                case 'value_2':
                                    $(this).attr(
                                        'title',
                                        '<ul style="text-align:justify;">' +
                                        '<li style="list-style:inside;">Fotocopia de libro de familia o resolución administrativa o judicial acreditativa de la adopción o acogimiento que refleje la edad o fecha de nacimiento copia del Libro de Familia en el caso en que su nacimiento se produjera con anterioridad al inicio del contrato o bien, documentación acreditativa de la adopción o acogimiento.</li>' +
                                        '<li style="list-style:inside;">Caso de progenitores separados o hayan cesado en la convivencia: Convenio regulador o régimen de visitas en los que consten los periodos en los que el menor permanezca con cada uno de los progenitores.</li>' +
                                        '<li style="list-style:inside;">En caso solicitud fuera de plazo, justificación documental de la fuerza mayor que le impidió cumplir con el preaviso.</li>' +
                                        '</ul>'
                                    );
                                    break;
                                case 'value_4':
                                case 'value_5':
                                    $(this).attr(
                                        'title',
                                        '<ul style="text-align:justify;">' +
                                        '<li style="list-style:inside;">Documento que acredite el grado de parentesco hasta segundo grado (libro de familia)</li>' +
                                        '<li style="list-style:inside;">Documento acreditativo de la situación de inactividad laboral de la persona que requiere los cuidados (vida laboral o cualquier otro documento oficial)</li>' +
                                        '<li style="list-style:inside;">Informe de organismo oficial (certificado medico Seguridad Social) que acredite que la persona que genera el derecho no puede valerse por sí misma, duración de esta situación si es temporal o el carácter indefinido de la misma si no tiene una fecha estimada.</li>' +
                                        '<li style="list-style:inside;">Acreditación de la implicación efectiva de la persona solicitante del derecho en los cuidados que precisa el familiar incapacitado.</li>' +
                                        '<li style="list-style:inside;">Documento que acredite que el familiar se encuentra ingresado permanente o temporalmente en algún centro público o privado (si es el caso)</li>' +
                                        '<li style="list-style:inside;">Caso de que sea hijo menor de edad la persona que necesita de los cuidados y con progenitores separados o hayan cesado en la convivencia Convenio regulador o declaración jurada en los que consten los periodos en los que el menor permanezca con cada uno de los progenitores.</li>' +
                                        '</ul>'
                                    );
                                    break;
                                case 'value_7':
                                case 'value_8':
                                case 'value_10':
                                case 'value_11':
                                    $(this).attr(
                                        'title',
                                        '<ul style="text-align:justify;">' +
                                        '<li style="list-style:inside;">Fotocopia del DNI o Pasaporte del solicitante</li>' +
                                        '</ul>'
                                    );
                                    break;
                                case 'value_12':
                                    $(this).attr(
                                        'title',
                                        '<ul style="text-align:justify;">' +
                                        '<li style="list-style:inside; list-style:none;">DEBERÁ APORTAR A SU INCORPORACIÓN:</li>' +
                                        '<li style="list-style:inside;">Acreditación de los estudios realizados o justificación de la estancia en el extranjero.</li>' +
                                        '<li style="list-style:inside;">Vida laboral para acreditar que no ha prestado servicios en empresas sujetas al CC Agencia de Viajes.</li>' +
                                        '</ul>'
                                    );
                                    break;
                                case 'value_13':
                                    // case 'value_14':
                                    $(this).attr(
                                        'title',
                                        '<ul style="text-align:justify;">' +
                                        '<li style="list-style:inside;">Fotocopia del DNI o Pasaporte del solicitante</li>' +
                                        '</ul>'
                                    );
                                    break;
                            }
                            break;
                        case 1:
                        case 4:
                        case 6:
                        case 7:
                            switch ($(this).attr('value')) {
                                case 'value_1':
                                case 'value_2':
                                    $(this).attr(
                                        'title',
                                        '<ul style="text-align:justify;">' +
                                        '<li style="list-style:inside;">Fotocopia de libro de familia o resolución administrativa o judicial acreditativa de la adopción o acogimiento que refleje la edad o fecha de nacimiento copia del Libro de Familia en el caso en que su nacimiento se produjera con anterioridad al inicio del contrato o bien, documentación acreditativa de la adopción o acogimiento.</li>' +
                                        '<li style="list-style:inside;">Caso de progenitores separados o hayan cesado en la convivencia: Convenio regulador o régimen de visitas en los que consten los periodos en los que el menor permanezca con cada uno de los progenitores.</li>' +
                                        '<li style="list-style:inside;">En caso solicitud fuera de plazo, justificación documental de la fuerza mayor que le impidió cumplir con el preaviso.</li>' +
                                        '</ul>'
                                    );
                                    break;
                                case 'value_4':
                                case 'value_5':
                                    $(this).attr(
                                        'title',
                                        '<ul style="text-align:justify;">' +
                                        '<li style="list-style:inside;">Documento que acredite el grado de parentesco hasta segundo grado (libro de familia)</li>' +
                                        '<li style="list-style:inside;">Documento acreditativo de la situación de inactividad laboral de la persona que requiere los cuidados (vida laboral o cualquier otro documento oficial)</li>' +
                                        '<li style="list-style:inside;">Informe de organismo oficial (certificado medico Seguridad Social) que acredite que la persona que genera el derecho no puede valerse por sí misma, duración de esta situación si es temporal o el carácter indefinido de la misma si no tiene una fecha estimada.</li>' +
                                        '<li style="list-style:inside;">Acreditación de la implicación efectiva de la persona solicitante del derecho en los cuidados que precisa el familiar incapacitado.</li>' +
                                        '<li style="list-style:inside;">Documento que acredite que el familiar se encuentra ingresado permanente o temporalmente en algún centro público o privado (si es el caso)</li>' +
                                        '<li style="list-style:inside;">Caso de que sea hijo menor de edad la persona que necesita de los cuidados y con progenitores separados o hayan cesado en la convivencia Convenio regulador o declaración jurada en los que consten los periodos en los que el menor permanezca con cada uno de los progenitores.</li>' +
                                        '</ul>'
                                    );
                                    break;
                                case 'value_7':
                                case 'value_8':
                                case 'value_10':
                                case 'value_11':
                                    $(this).attr(
                                        'title',
                                        '<ul style="text-align:justify;">' +
                                        '<li style="list-style:inside;">Fotocopia del DNI o Pasaporte del solicitante</li>' +
                                        '</ul>'
                                    );
                                    break;
                                case 'value_13':
                                    // case 'value_14':
                                    $(this).attr(
                                        'title',
                                        '<ul style="text-align:justify;">' +
                                        '<li style="list-style:inside;">Fotocopia del DNI o Pasaporte del solicitante</li>' +
                                        '</ul>'
                                    );
                                    break;
                            }
                            break;
                    }
                });
                $excedenciaLicencia('[data-toggle="tooltip"]').tooltip({
                    template: '<div class="tooltip show" style="max-width: 500px !important;"><div class="tooltip-arrow"></div><div class="tooltip-inner" style="max-width: 500px !important;"></div></div>'
                });
            }
        }
    } else {
        validaErroresCbk(d);
    }
}

function cbkInitDatosPersonales(user) {
    excelicAqui().Forms.frmExcedenciaLicencia.set({
        p_numusr: user.pernr,
        p_nombre_completo: user.vorna + ' ' + user.nach + ' ' + user.nach2,
        p_empresa: user.empresa,
        p_centro: user.centro + ' - ' + user.subdiv,
        p_departamento: user.uni_org,
        p_tlfusr: user.telemp,
        p_emlusr: user.correo
    });

    $excedenciaLicencia('form[name=frmExcedenciaLicencia] input[type=text]').change();
}

function cbkExcedenciaLicencia(s, d, e) {
    if (s) {
        toast({ tipo: 'success', msg: 'La solicitud ha sido enviada correctamente' });
        excelicAqui().load({
            url: 'modulos/comunes/blanco.html',
            script: false
        });
    } else {
        validaErroresCbk(d);
    }
}

function cbkUpdateDocs(s, d, e) {
    if (s) {
        Moduls.app.child.templateAplicacion.paramSelSolCae = null;
        Moduls.app.child.templateAplicacion.load({
            url: 'modulos/cae/listaSolicitudes.html',
            script: true
        });
        toast({ tipo: 'success', msg: 'Ficheros actualizados correctamente' });
    } else {
        validaErroresCbk(d);
    }
}

// Utils Functions
function $excedenciaLicencia(path) {
    return $('.excenencia-licencia-cae ' + (path ? path : ''));
}

function formatDate(date) {
    return date.split("/").reverse().join("-");
}

function excedModal() {
    if (getParameter(Moduls, 'sesion_externa') === true) {
        return Moduls.modal;
    } else {
        return Moduls.app.child.modal;
    }
}

function excelicAqui() {
    if (getParameter(Moduls, 'sesion_externa') === true) {
        return Moduls.app;
    } else {
        return Moduls.app.child.templateAplicacion.child.panelPlantilla;
    }
}