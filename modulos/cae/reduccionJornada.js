// Funciones de inicialización
$(function () {

    $reduccionJornada('input[name=p_valor1]').on('click change', function () {
        $reduccionJornada('.tbl-valores th, .tbl-valores td').removeAttr('style');
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

    $reduccionJornada('.btn-adjuntar_ficheros').click(function () {
        setParameter(
            redjorModal().child.modalBody,
            'filesmodal',
            getParameter(redjorAqui(), 'filesmodal'));

        redjorModal().child.modalBody.load({
            url: 'modulos/cae/modalAdjuntarFicheros.html',
            script: true
        });
        construirModal({
            title: 'Adjuntar Ficheros',
            w: '900px',
            oktext: "Aceptar",
            okfunction: function () {
                let codapl = redjorAqui().codapl;
                let count = getParameter(redjorAqui(), 'filesmodal').cnt;
                let files_aux = getParameter(redjorAqui(), 'filesmodal').files;
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
                setParameter(redjorAqui(), 'filesmodal', {
                    cnt: count,
                    files: input_files,
                    role: getParameter(redjorAqui(), 'filesmodal').role
                });
                redjorAqui().Forms.frmReduccionJornada.set({ p_nomext: nomext, p_nomint: nomint });
                redjorAqui().Forms.frmUpdateDocs.set({ p_nomext: nomext, p_nomint: nomint });

                if (redjorAqui().Forms.frmUpdateDocs.parametros.p_codtra.value != 'empty') {
                    redjorAqui().Forms.frmUpdateDocs.executeForm();
                }

                cerrarModalIE($('#myModal'));
            }
        });
    });

    $reduccionJornada('.btn-aceptar').click(function () {

        invocaAjax({
            direccion: '/management/mvc-management/controller/newintra.xwi_plantilla_cae.acepta_tramite.json',
            parametros: {
                p_codtra: redjorAqui().Forms.frmUpdateDocs.parametros.p_codtra.value
            },
            contentType: 'application/json',
            retorno: function (s, d, e) {
                if (s) {
                    $reduccionJornada('.botonera-aceptar').addClass('dn');
                    $reduccionJornada('.botonera-rechazar').addClass('dn');
                    toast({ tipo: 'success', msg: 'Se ha aceptado la solicitud' });
                    initFormularioExternalSesion();
                } else {
                    toast({ tipo: 'error', msg: 'Error al aceptar la solicitud' });
                }
            }
        });
    });

    $reduccionJornada('.btn-rechazar').click(function () {

        redjorModal().child.modalBody.load({
            url: 'modulos/comunes/comunes.html?modalConfirmacion',
            script: false
        });
        construirModal({
            title: 'Rechazar petición',
            w: '900px',
            canceltext: 'Cancelar',
            oktext: "Rechazar",
            okfunction: function () {
                let motivo = $('.modalConfirmacion textarea[name=p_motivo]').val();
                if (motivo && motivo.length < 2000) {
                    cerrarModalIE($('#myModal'));

                    invocaAjax({
                        direccion: '/management/mvc-management/controller/newintra.xwi_plantilla_cae.rechaza_tramite.json',
                        parametros: {
                            p_codtra: redjorAqui().Forms.frmUpdateDocs.parametros.p_codtra.value,
                            p_observ: motivo
                        },
                        contentType: 'application/json',
                        retorno: function (s, d, e) {
                            if (s) {
                                $reduccionJornada('.botonera-aceptar').addClass('dn');
                                $reduccionJornada('.botonera-rechazar').addClass('dn');
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
                        toast({ tipo: 'error', msg: 'El campo del motivo debe tener un tamaño máximo de 2000 caracteres' });
                    }
                }
            }
        });
    });

    $reduccionJornada('.btn-fintra-reduccjor').click(function () {
        if (Moduls.app.child.templateAplicacion.ReduccionJornada11) {
            redjorAqui().Forms.frmFinalizarTramiteRJ.parametros.p_valor8.object.required = true;
            redjorAqui().Forms.frmFinalizarTramiteRJ.parametros.p_valor9.object.required = true;
        }
        if (Moduls.app.child.templateAplicacion.RegistroCupoSeleccionado) {
            redjorAqui().Forms.frmFinalizarTramiteRJ.set({
                p_valor8: Moduls.app.child.templateAplicacion.RegistroCupoSeleccionado.p_period,
                p_valor9: Moduls.app.child.templateAplicacion.RegistroCupoSeleccionado.p_regrjo,
                p_fecini: Moduls.app.child.templateAplicacion.RegistroCupoSeleccionado.p_fecini,
                p_fecfin: Moduls.app.child.templateAplicacion.RegistroCupoSeleccionado.p_fecfin,
                p_idredj: Moduls.app.child.templateAplicacion.RegistroCupoSeleccionado.p_idrejo,
                p_idtirj: Moduls.app.child.templateAplicacion.RegistroCupoSeleccionado.p_idtipo,
                p_idperj: Moduls.app.child.templateAplicacion.RegistroCupoSeleccionado.p_idperi
            });
        }
        redjorAqui().Forms.frmFinalizarTramiteRJ.executeForm();
    });

    $reduccionJornada('.btn-solicitar-reduccjor').click(function () {
        let dirEmail = redjorAqui().Forms.frmReduccionJornada.parametros.p_emlusr.value.split('@');
        if (dirEmail.length > 2) {
            toast({ tipo: 'error', msg: 'Solo puede indicar una dirección de E-Mail' });
        } else {
            redjorAqui().Forms.frmReduccionJornada.executeForm();
        }
    });

    $reduccionJornada('.btn-recha-usu').click(function () {
        redjorAqui().Forms.frmRechazaTramiteUsuRJ.executeForm();
    });

    $reduccionJornada('form[name=frmReduccionJornada] [name=p_valor2]').change(function () {
        $reduccionJornada('form[name=frmReduccionJornada] [name=p_valor3]').attr('min', $(this).val());
    });
    $reduccionJornada('form[name=frmReduccionJornada] [name=p_valor3]').change(function () {
        $reduccionJornada('form[name=frmReduccionJornada] [name=p_valor2]').attr('max', $(this).val());
    });

    $reduccionJornada('form[name=frmReduccionJornada] [name=p_horario], form[name=frmReduccionJornada] [name=p_horas]').change(function () {
        redjorAqui().Forms.frmReduccionJornada.set({
            p_valor4: $(this).val()
        });
    });

    $reduccionJornada('form[name=frmReduccionJornada] [name=p_valor2]').blur(function () {
        if ($('.finRJ').is(':checked')) {
            redjorAqui().Forms.frmReduccionJornada.set({ p_valor3: esInternetExplorer() ? this.value.hazFecha('dd/mm/yyyy', 'yyyy-mm-dd') : this.value });
        }
    });

    $reduccionJornada('form[name=frmReduccionJornada] [name=p_valor1]').change(function () {
        if ($('.finRJ').is(':checked')) {
            $('.fechaFin').addClass('dn');
            $('.concrecion').addClass('dn');
            redjorAqui().Forms.frmReduccionJornada.set({ p_valor3: esInternetExplorer() ? $reduccionJornada('form[name=frmReduccionJornada] [name=p_valor2]').val().hazFecha('dd/mm/yyyy', 'yyyy-mm-dd') : $reduccionJornada('form[name=frmReduccionJornada] [name=p_valor2]').val(), p_horas: '40', p_horario: 'jornada completa' });
        } else {
            $('.fechaFin').removeClass('dn');
            $('.concrecion').removeClass('dn');
            redjorAqui().Forms.frmReduccionJornada.set({ p_valor3: '', p_horas: '', p_horario: '' });
        }
    });

    $reduccionJornada('.verAlt').click(function () {
        $('.datatableCupo').addClass('dn');
        $('.datatableCupoAlt').removeClass('dn');
        $('.mensajeRRHH').addClass('dn');
    });

    $reduccionJornada('.verNorm').click(function () {
        $('.datatableCupo').removeClass('dn');
        $('.datatableCupoAlt').addClass('dn');
        $('.mensajeRRHH').addClass('dn');
    });

    $reduccionJornada('form[name=frmReduccionJornada] [name=p_valor2]').change(function () {
        $reduccionJornada('form[name=frmReduccionJornada] [name=p_valor3]').attr('min', $(this).val());
    });
});

function cbkOnloadRJ() {
}

function initFormulario(codusr, fecsol, role) {
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
                initTablaResponsables(d.root[0].codusr);
                //datosUsuarioLast({nDatos:'LEP', usr: d.root[0].codres, fnc: cbkInitResponsable});
                datosUsuarioLast({
                    nDatos: 'LEP', usr: d.root[0].codusr, fnc: function (user) {
                        redjorAqui().Forms.frmReduccionJornada.set({
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
                            p_horas: d.root[0].valor4,
                            p_horario: d.root[0].valor4,
                            p_valor8: d.root[0].valor8,
                            p_valor9: d.root[0].valor9,
                            p_observ: d.root[0].observ
                        });

                        $reduccionJornada('form[name=frmReduccionJornada] input[type=text]').change();
                        $reduccionJornada('form[name=frmReduccionJornada] input[value=' + d.root[0].valor1 + ']:visible').prop("checked", true);

                        $reduccionJornada('form[name=frmReduccionJornada] input, ' +
                            'form[name=frmReduccionJornada] textarea').prop('readonly', true);
                        $reduccionJornada('form[name=frmReduccionJornada] input').prop('disabled', false);
                        $reduccionJornada('form[name=frmReduccionJornada] :radio:not(:checked)').attr('disabled', true);

                        if (d.root[0].codplt == 11) {
                            Moduls.app.child.templateAplicacion.ReduccionJornada11 = 'S';
                        }
                        if (role == 'view' && d.root[0].codplt == 11 && d.root[0].codest == 'V') {
                            $('.regimenPeriodo').removeClass('dn');
                        }
                    }
                });
                redjorAqui().Forms.frmUpdateDocs.set({ p_codtra: d.root[0].codtra });
                redjorAqui().Forms.frmFinalizarTramiteRJ.set({ p_codtra: d.root[0].codtra });
                redjorAqui().Forms.frmRechazaTramiteUsuRJ.set({ p_codtra: d.root[0].codtra });
                if (d.root[0].codplt == 11 && role == 'tram') {
                    redjorAqui().Forms.listadoCupo.set({ p_codtra: d.root[0].codtra });
                    redjorAqui().Forms.listadoCupo.executeForm();
                }
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
                    $reduccionJornada('.observaciones_responsable').removeClass('dn');
                    $('.observaciones_responsable2').removeClass('dn');
                    if (d.root.codest == 'W' && d.root.reclam == 'X') {
                        $reduccionJornada('.botonera-aceptar').removeClass('dn');
                        $reduccionJornada('.botonera-rechazar').addClass('dn');
                    } else if (d.root.codest == 'W' && d.root.reclam == null) {
                        $reduccionJornada('.botonera-aceptar').removeClass('dn');
                        $reduccionJornada('.botonera-rechazar').removeClass('dn');
                    }
                }
                redjorModal().load({ url: 'modulos/comunes/modal.html', script: false });
                initAjustarPorCodigoPlantilla(d.root.codplt.toString());
                initFiles(d.root.codtra);
                initTablaResponsables(d.root.codusr);
                //datosUsuarioLast({nDatos:'LEP', usr: d.root.codres, fnc: cbkInitResponsable});
                datosUsuarioLast({
                    nDatos: 'LEP', usr: d.root.codusr, fnc: function (user) {
                        Moduls.app.Forms.frmReduccionJornada.set({
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

                        $reduccionJornada('form[name=frmReduccionJornada] input[type=text]').change();
                        $reduccionJornada('form[name=frmReduccionJornada] input[value=' + d.root.valor1 + ']:visible').prop("checked", true);

                        $reduccionJornada('form[name=frmReduccionJornada] input, ' +
                            'form[name=frmReduccionJornada] textarea').prop('readonly', true);
                        $reduccionJornada('form[name=frmReduccionJornada] input').prop('disabled', false);
                        $reduccionJornada('form[name=frmReduccionJornada] :radio:not(:checked)').attr('disabled', true);
                    }
                });
                Moduls.app.Forms.frmReduccionJornada.set({
                    p_estsol: 'La solicitud se encuentra ' + d.root.desest
                });
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
    $reduccionJornada('.elem-by-codpla').each(function () {
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
                setParameter(redjorAqui(), 'filesmodal', {
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

function initTablaResponsables(codusr) {
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
                $reduccionJornada('.tbl-responsable tbody').empty();
                for (let c = 0; c < json.length; c++) {
                    codres += '#' + json[c].codusr;
                    let HTML = $.parseHTML(cuerpo.reemplazaMostachos(json[c]));
                    $reduccionJornada('.tbl-responsable tbody').append(HTML);
                }
                redjorAqui().Forms.frmReduccionJornada.set({
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
    if (s) {
        if (d.root.length > 0) {
            if (getParameter(Moduls, 'sesion_externa') === true) {
                $reduccionJornada().css('padding', '80px 100px 0px 80px');
                initFormularioExternalSesion();
                $reduccionJornada('label').addClass('active');
                $reduccionJornada('.hide-on-accept').addClass('dn');
            } else {
                let p = Moduls.app.child.templateAplicacion.paramSelSolCae;
                if (p) {
                    $reduccionJornada('.hide-on-' + p.role.toLowerCase()).addClass('dn');
                    $('.panel-estado2').addClass('dn');

                    initFormulario(p.param.numper, p.param.fecsol, p.role.toLowerCase());

                    Moduls.app.child.templateAplicacion.child.panelPlantilla.Forms.frmReduccionJornada.set({
                        p_estsol: 'La solicitud se encuentra ' + Moduls.app.child.templateAplicacion.paramSelSolCae.param.destado
                    });

                    redjorAqui().Forms.frmReduccionJornada.set({
                        p_fechas: 'algo'
                    });
                } else {
                    initTablaResponsables(Moduls.header.user.codusr);
                    $reduccionJornada('.hide-on-solicitar').addClass('dn');
                    $reduccionJornada('.botonera-aceptar').addClass('dn');
                    $reduccionJornada('.botonera-rechazar').addClass('dn');
                    $reduccionJornada('.panel-estado').addClass('dn');
                    $('.panel-estado2').addClass('dn');

                    setParameter(redjorAqui(), 'filesmodal', { cnt: 0, files: [], role: 'SOLICITAR' });

                    let formrj = Moduls.app.child.templateAplicacion.child.panelPlantilla.Forms.frmReduccionJornada;
                    formrj.set({
                        p_codplt: d.root[0].codplt.toString()
                    });
                    if (d.root[0].codplt == 11) {
                        //formrj.parametros.p_valor3.object.required = false;
                        formrj.parametros.p_valor4.object.required = false;
                    }

                    initAjustarPorCodigoPlantilla(d.root[0].codplt.toString());

                    redjorModal().child.modalBody.load({
                        url: 'modulos/comunes/comunes.html?procedimientos-cae-reduccjor',
                        script: false
                    });
                    $('#myModal .modal-body').unbind("DOMSubtreeModified.plantillascae");
                    $('#myModal .modal-body').bind("DOMSubtreeModified.plantillascae", function () {
                        $('.procedimientos-cae-reduccjor .elem-by-codpla').each(function () {
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
                                Moduls.app.child.templateAplicacion.child.panelPlantilla.codapl = d.root[0].codapl;
                            } else {
                                validaErroresCbk(d);
                            }
                        }
                    });

                    $reduccionJornada('[type=radio]').each(function () {
                        switch (d.root[0].codplt) {
                            case 8:
                            case 9:
                            case 10:
                            case 11:
                            case 12:
                                switch ($(this).attr('value')) {
                                    case 'value_1':
                                    case 'value_2':
                                    case 'value_3':
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
                                    case 'value_6':
                                        $(this).attr(
                                            'title',
                                            '<ul style="text-align:justify;">' +
                                            '<li style="list-style:inside;">Documento que acredite el grado de parentesco hasta segundo grado (libro de familia)</li>' +
                                            '<li style="list-style:inside;">Documento acreditativo de la situación de inactividad laboral de la persona que requiere los cuidados (vida laboral o cualquier otro documento oficial)</li>' +
                                            '<li style="list-style:inside;">Informe de organismo oficial (certificado medico Seguridad Social) que acredite que la persona que genera el derecho no puede valerse por sí misma, duración de esta situación si es temporal o el carácter indefinido de la misma si no tiene una fecha estimada.</li>' +
                                            '<li style="list-style:inside;">Acreditación de la implicación efectiva de la persona solicitante del derecho en los cuidados que precisa el familiar</li>' +
                                            '<li style="list-style:inside;">Documento que acredite que el familiar se encuentra ingresado permanente o temporalmente en algún centro público o privado (si es el caso). Acreditación que, durante la ausencia de ingreso o cuidador, la persona que requiere los cuidados está bajo la tutela/cuidado del solicitante de la RJ.</li>' +
                                            '<li style="list-style:inside;">Caso de que sea hijo menor de edad la persona que necesita de los cuidados y con progenitores separados o hayan cesado en la convivencia Convenio regulador o declaración jurada en los que consten los periodos en los que el menor permanezca con cada uno de los progenitores.</li>' +
                                            '</ul>'
                                        );
                                        break;
                                    case 'value_7':
                                    case 'value_8':
                                    case 'value_9':
                                        $(this).attr(
                                            'title',
                                            '<ul style="text-align:justify;">' +
                                            '<li style="list-style:inside;">Fotocopia del DNI o Pasaporte del solicitante</li>' +
                                            '</ul>'
                                        );
                                        break;
                                    case 'value_10':
                                    case 'value_11':
                                    case 'value_12':
                                        $(this).attr(
                                            'title',
                                            '<ul style="text-align:justify;">' +
                                            '<li style="list-style:inside;">Fotocopia de libro de familia o resolución administrativa o judicial acreditativa de la adopción o acogimiento que refleje la edad o fecha de nacimiento.</li>' +
                                            '<li style="list-style:inside;">Informe del servicio público de salud u órgano administrativo sanitario de la Comunidad Autónoma correspondiente que acredite que el menor se encuentra afectado por cáncer o enfermedad grave que precise de cuidado directo, continuo y permanente durante la hospitalización o tratamiento continuado.</li>' +
                                            '<li style="list-style:inside;">En caso solicitud fuera de plazo, justificación documental de la fuerza mayor que le impidió cumplir con el preaviso.</li>' +
                                            '<li style="list-style:inside;">Caso de progenitores separados o hayan cesado en la convivencia: - Convenio regulador o declaración jurada en los que consten los periodos en los que el menor permanezca con cada uno de los progenitores.</li>' +
                                            '</ul>'
                                        );
                                        break;
                                    case 'value_13':
                                    case 'value_14':
                                    case 'value_15':
                                        $(this).attr(
                                            'title',
                                            '<ul style="text-align:justify;">' +
                                            '<li style="list-style:inside;">Fotocopia del DNI o Pasaporte del solicitante</li>' +
                                            '</ul>'
                                        );
                                        break;
                                    case 'value_16':
                                    case 'value_17':
                                        $(this).attr(
                                            'title',
                                            '<ul style="text-align:justify;">' +
                                            '<li style="list-style:inside;">DNI de la persona con discapacidad</li>' +
                                            '<li style="list-style:inside;">Resolución del organismo administrativo oficial que acredite la discapacidad y el grado</li>' +
                                            '<li style="list-style:inside;">Documento del organismo administrativo competente que acredite la necesidad del cuidado de la persona con discapacidad y la implicación efectiva de la persona solicitante del derecho de RJ.</li>' +
                                            '<li style="list-style:inside;">En caso solicitud fuera de plazo, justificación documental de la fuerza mayor que le impidió cumplir con el preaviso.</li>' +
                                            '<li style="list-style:inside;">Caso de que sea hijo menor de edad la persona que necesita de los cuidados y con progenitores separados o hayan cesado en la convivencia Convenio regulador o declaración jurada en los que consten los periodos en los que el menor permanezca con cada uno de los progenitores</li>' +
                                            '</ul>'
                                        );
                                        break;
                                    case 'value_18':
                                    case 'value_19':
                                        $(this).attr(
                                            'title',
                                            '<ul style="text-align:justify;">' +
                                            '<li style="list-style:inside;">Fotocopia de libro de familia o resolución administrativa o judicial acreditativa de la adopción o acogimiento que refleje la edad o fecha de nacimiento</li>' +
                                            '<li style="list-style:inside;">Informe del servicio público de salud u órgano administrativo sanitario de la Comunidad Autónoma correspondiente que acredite que el menor se encuentra afectado por cáncer o enfermedad grave que precise de cuidado directo, continuo y permanente durante la hospitalización o tratamiento continuado.</li>' +
                                            '<li style="list-style:inside;">En caso solicitud fuera de plazo, justificación documental de la fuerza mayor que le impidió cumplir con el preaviso.</li>' +
                                            '<li style="list-style:inside;">Caso de progenitores separados o hayan cesado en la convivencia: Convenio regulador o régimen de visitas en los que consten los periodos en los que el menor permanezca con cada uno de los progenitores.</li>' +
                                            '</ul>'
                                        );
                                        break;
                                }
                                break;
                        }
                    });
                    $reduccionJornada('[data-toggle="tooltip"]').tooltip({
                        template: '<div class="tooltip show" style="max-width: 500px !important;"><div class="tooltip-arrow"></div><div class="tooltip-inner" style="max-width: 500px !important;"></div></div>'
                    });
                }
            }
        }
    } else {
        validaErroresCbk(d);
    }
}
function cbkInitDatosPersonales(user) {
    Moduls.app.child.templateAplicacion.child.panelPlantilla.Forms.frmReduccionJornada.set({
        p_numusr: user.pernr,
        p_nombre_completo: user.vorna + ' ' + user.nach + ' ' + user.nach2,
        p_empresa: user.empresa,
        p_centro: user.centro + ' - ' + user.subdiv,
        p_departamento: user.uni_org,
        p_tlfusr: user.telemp,
        p_emlusr: user.correo
    });

    $reduccionJornada('form[name=frmReduccionJornada] input[type=text]').change();
}
function cbkReduccionJornada(s, d, e) {
    if (s) {
        toast({ tipo: 'success', msg: 'La solicitud ha sido enviada correctamente' });
        Moduls.app.child.templateAplicacion.child.panelPlantilla.load({
            url: 'modulos/comunes/blanco.html',
            script: false
        });
    } else {
        validaErroresCbk(d);
    }
}

function cbkFinalizarTramiteRJ(s, d, e) {
    if (s) {
        Moduls.app.child.templateAplicacion.paramSelSolCae = null;
        Moduls.app.child.templateAplicacion.ReduccionJornada11 = null;
        Moduls.app.child.templateAplicacion.load({
            url: 'modulos/cae/listaSolicitudes.html',
            script: true
        });
        toast({ tipo: 'success', msg: 'La solicitud se ha tramitado satisfactoriamente' });
    } else {
        validaErroresCbk(d);
        redjorAqui().Forms.listadoCupo.executeForm();
    }
}

function cbkRechazaTramiteUsuRJ(s, d, e) {
    if (s) {
        Moduls.app.child.templateAplicacion.paramSelSolCae = null;
        Moduls.app.child.templateAplicacion.load({
            url: 'modulos/cae/listaSolicitudes.html',
            script: true
        });
        toast({ tipo: 'success', msg: 'La solicitud se ha descartado satisfactoriamente' });
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

function listadoCupo(s, d, e) {
    if (s) {
        if (d.root.cupo.length > 0) {
            $('.datatableCupo').removeClass('dn');
            $('.datatableCupoAlt').addClass('dn');
            $('.mensajeRRHH').addClass('dn');
        } else {
            if (d.root.cupo_alt.length > 0) {
                $('.datatableCupo').addClass('dn');
                $('.datatableCupoAlt').removeClass('dn');
                $('.mensajeRRHH').removeClass('dn');
            } else {
                $('.datatableCupo').addClass('dn');
                $('.datatableCupoAlt').addClass('dn');
                $('.mensajeRRHH').removeClass('dn');
            }
        }
    } else {
        validaErroresCbk(d);
        $('.mensajeRRHH').removeClass('dn');
    }
}

function cupoSeleccionado(data) {
    Moduls.app.child.templateAplicacion.RegistroCupoSeleccionado = data;
}

function cupoDesseleccionado(data) {
    Moduls.app.child.templateAplicacion.RegistroCupoSeleccionado = null;
}

function cupoAltSeleccionado(data) {
    Moduls.app.child.templateAplicacion.RegistroCupoSeleccionado = data;
}

function cupoAltDesseleccionado(data) {
    Moduls.app.child.templateAplicacion.RegistroCupoSeleccionado = null;
}

// Utils Functions
function $reduccionJornada(path) {
    return $('.reduccion-jornada-cae ' + (path ? path : ''));
}

function redjorAqui() {
    if (getParameter(Moduls, 'sesion_externa') === true) {
        return Moduls.app;
    } else {
        return Moduls.app.child.templateAplicacion.child.panelPlantilla;
    }
}

function redjorModal() {
    if (getParameter(Moduls, 'sesion_externa') === true) {
        return Moduls.modal;
    } else {
        return Moduls.app.child.modal;
    }
}

function formatDate(date) {
    return date ? date.split("/").reverse().join("-") : date;
}

function formatDate2(date) {
    return date ? date.split("-").reverse().join("/") : date;
}