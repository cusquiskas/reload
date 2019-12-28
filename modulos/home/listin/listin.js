$('.listinBuscarKeyUp').keyup(function (key) {
    if (key.keyCode === 13) {
        if (Moduls.app.child.cajaListin.Forms.listinTelefonico !== undefined) {
            if (Moduls.app.child.cajaListin.Forms.listinTelefonico.parametros.p_nomusr.value != Moduls.app.child.cajaListin.Forms.listinTelefonico.parametros.p_nomusr.object.value) {
                Moduls.app.child.cajaListin.Forms.listinTelefonico.set({ p_nomusr: Moduls.app.child.cajaListin.Forms.listinTelefonico.parametros.p_nomusr.object.value });
            }
        }
        let event = document.createEvent("Event"); event.initEvent('click', false, true);
        $('.listinTelefonico')[0].dispatchEvent(event);
    }
});

$('.listinTelefonico').click(function () {
    Moduls.app.PuntoPartida = 'Home/Listin';
    registroOpciones('99');
    Moduls.app.load({ url: 'modulos/listinTelefonico/listinTelefonico.html', script: true });
    let numeros = "0123456789";
    if (numeros.indexOf(Moduls.app.child.cajaListin.Forms.listinTelefonico.parametros.p_nomusr.value.charAt(), 0) != -1) {
        Moduls.app.busquedaListin = {
            p_telusr: Moduls.app.child.cajaListin.Forms.listinTelefonico.parametros.p_nomusr.value
            // p_codemp: Moduls.app.child.cajaListin.Forms.listinTelefonico.parametros.p_codemp.value
        };
    } else {
        Moduls.app.busquedaListin = {
            p_nomusr: Moduls.app.child.cajaListin.Forms.listinTelefonico.parametros.p_nomusr.value
            // p_codemp: Moduls.app.child.cajaListin.Forms.listinTelefonico.parametros.p_codemp.value
        };
    }
});

$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip({
        template: '<div class="tooltip show"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
    });
});

// function cargarDatosInicio(s, d, e) {
//     if (s) {
//         let lis = e.form.modul.Forms.listinTelefonico;
//         lis.parametros.p_codemp.object.addEventListener('ajaxSuccess', function () {
//             $('select').children('option:first').text('Empresa');
//         });
//     } else {
//         toast({ tipo: 'error', msg: resuelveError(d) });
//     }
// }