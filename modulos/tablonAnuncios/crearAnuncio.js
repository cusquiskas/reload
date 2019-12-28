$(document).ready(function () {
    setFileOption();

    let objeto = { p_codcpo: Moduls.header.user.codcpo, titulo: 'Nuevo' };
    if (Moduls.app.anuncioSelect) {
        objeto.titulo = 'Editar';
        for (let chn in Moduls.app.anuncioSelect) {
            objeto['p_' + chn] = Moduls.app.anuncioSelect[chn];
        }

        let file = Moduls.app.Forms.gestionAnuncios.nFile;
        if (Moduls.app.anuncioSelect.ficadj) {
            file._hide(file.buttons.select);
            file._show(file.buttons.delete);
        }

        delete (Moduls.app.anuncioSelect);
    }
    Moduls.app.Forms.gestionAnuncios.set(objeto);

    Moduls.app.child.cajaBanners2.load({
        url: 'modulos/home/banners/banners.html',
        script: true
    });

    Moduls.app.child.cajaPreFooter2.load({
        url: 'modulos/home/pre-footer/pre-footer.html',
        script: true
    });

    $('.tablonAnuncios').click(function () {
        Moduls.app.Forms.gestionAnuncios.nFile.initDocument();
        Moduls.app.load({
            url: 'modulos/tablonAnuncios/tablonAnuncios.html',
            script: true
        });
    });
    $('[data-toggle="tooltip"]').tooltip({
        template: '<div class="tooltip show"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
    });
});

function gestionAnuncios(s, d, e) {
    if (s) {
        if (e.form.parametros.failUpload.value === 'false') {
            if (d.extra.ficadj && e.form.parametros.ficheroDefault.value != '=') {
                Moduls.app.Forms.gestionAnuncios.set({ p_seqdoc: d.extra.seqdoc });
                Moduls.app.Forms.gestionAnuncios.nFile.uploadDocument({ file: d.extra.ficadj });
            } else {
                toast({ tipo: 'success', msg: resuelveError(d) });
                Moduls.app.load({ url: 'modulos/tablonAnuncios/tablonAnuncios.html', script: true });
            }
        } else {
            Moduls.app.Forms.gestionAnuncios.set({ failUpload: 'false' });
        }
    } else {
        validaErroresGestionAnuncios(d);
    }
}

function setFileOption() {
    Moduls.app.Forms.gestionAnuncios.nFile = new uploadProject();
    let file = Moduls.app.Forms.gestionAnuncios.nFile;
    file.setBtnSelect(getId('btnAdjuntarArchivoTabAnun'));
    file.setFncValidation(valida_archivo);
    file.setFncCallback(SubidaCorrectaAnuncio);
    file.setBoxEco(getId('adjuntarArchivoTabAnun'));
    file.setBtnDelete(getId('btnRemoveAdjArchTabAnun'));
    file.setConfig({ exts: ['.JPG', '.JPEG', '.BMP', '.GIF', '.PNG', '.PDF'], smax: 5242880, ruta: '/var/www/webapps04/estatico/portal/anuncios/' });
    file.initDocument();
}

function SubidaCorrectaAnuncio(s, d, e) {
    if (s) {
        toast({ tipo: 'success', msg: 'El documento se ha añadido correctamente.' });
        Moduls.app.load({ url: 'modulos/tablonAnuncios/tablonAnuncios.html', script: true });
    }
    else {
        toast({ tipo: 'error', msg: resuelveError(d) });
    }
}

function valida_archivo(s, d, e) {
    if (s) {
        let adjArchHidden = $('.adjArchTabAnunHidden')[0];
        adjArchHidden.value = e.upload.fileProperties.name;
        let event = document.createEvent("Event"); event.initEvent('change', false, true);
        adjArchHidden.dispatchEvent(event);
    } else {
        let msg = (d.type == 'smax') ? 'Excedido tamaño del documento:<br>Máximo: ' + d.fileMax + '<br>' + 'Real: ' + d.fileSize :
            (d.type == 'exts') ? 'Tipo de archivo no permitido:<br>Permitidos: ' + d.exts + '<br>Real: ' + d.fileExt :
                'Error desconocido validando el documento';
        toast({ tipo: 'error', msg: msg });
    }
}

function validaErroresGestionAnuncios(d) {
    if (d.length) {
        for (let i = 0; i < d.length; i++) {
            if (d[i].type === 'required')
                toast({ tipo: 'error', msg: d[i].label + ': El valor no puede ser nulo' });
            else
                toast({ tipo: 'error', msg: resuelveError(d) });
        }
    } else {
        toast({ tipo: 'error', msg: resuelveError(d) });
    }
}