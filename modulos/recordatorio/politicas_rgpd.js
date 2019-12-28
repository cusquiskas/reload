// Independiente del login
var Politicasrgpd = class {

    constructor() {

    }

    cbkLoadPoliticaRGPD(s, d, e) {
        if (s) {
            if (d.root.pol.length > 0) {
                let politica = d.root.pol[d.root.pol.length - 1];
                $('.gestion-politica-rgpd .entradi').html(politica.con[0].entrad.cambia('\n', '<br>'));
                $('.gestion-politica-rgpd .content').html(politica.con[0].txhtml);
            }
        } else {
            toast({ tipo: 'error', msg: resuelveError(d) });
        }
    }

    cbkAceptarPoliticasRGPD(s, d, e) {
        if (s) {
            cerrarModalIE($('#myModal'));
            let frmMain = $('.lstRecordatoriosPropios form[name=frmListarPoliticas]')[0];
            dondeEstoy(frmMain).executeForm();
            refreshNumAlertas();
            toast({ tipo: 'success', msg: 'La política se ha aceptado satisfactoriamente' });
        } else {
            toast({ tipo: 'error', msg: resuelveError(d) });
        }
    }

}