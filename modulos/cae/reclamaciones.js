
$(function() {
    $('.reclamaciones-cae .cabecera button').click(function() {
        let href = $(this).attr('href');
        if($(this).attr('codapl')) {
            invocaAjax({
                direccion: '/management/mvc-management/controller/newintra.xwi_plantilla_cae.dev_solicitud_pendiente.json',
                parametros: {
                    p_aplsol: $(this).attr('codapl'),
                    xchn:    'JSON'
                },
                contentType: 'application/json',
                retorno: function(s, d, e) {
                    if(s) {
                        if(d.root == 'S') {
                            Moduls.app.child.templateAplicacion.paramSelSolCae = null;
                            Moduls.app.child.templateAplicacion.child.panelPlantilla.load({
                                url: href,
                                script: true
                            });
                        } else {
                            toast({ tipo: 'error', msg: 'Aún tiene solicitudes en curso, solo puede solicitar un tramite de cada tipo a la vez' });
                        }
                    } else {
                        validaErroresCbk(d);
                    }
                }
            });
        } else {
            if(href.indexOf('PerfilEmpleado') !== -1) {
                let last = window.location.href.lastIndexOf('/');
                window.location.href = window.location.href.substr(0, last) + '?' + href;
            } else {
                Moduls.app.child.templateAplicacion.paramSelSolCae = null;
                Moduls.app.child.templateAplicacion.child.panelPlantilla.load({
                    url: href,
                    script: true
                });
            }
        }
    });

    onload();
});

function onload() {
    Moduls.app.child.templateAplicacion.child.panelPlantilla.load({
        url: 'modulos/comunes/blanco.html',
        script: false
    });

    invocaAjax({
        direccion: '/management/mvc-management/controller/portal.xwi_menu.acceso_datos_personales.json',
        parametros: {},
        contentType: 'application/json',
        retorno: function(s, d, e) {
            if(s) {
                for(let key in d.root.pfl) {
                    let conf = d.root.pfl[key];
                    if(conf) {
                        $('.reclamaciones-cae .cabecera button[view=' + key + ']').removeClass('dn');
                    }
                }
            } else {
                validaErroresCbk(d);
            }
        }
    });
}