function guardarEncuestaEmpleado(s,d,e){
    let event = document.createEvent("Event"); event.initEvent('click', false, true);
    getId('cerrarModalEncuestas').dispatchEvent(event);
}

function mostrarEncuestaEmpleado(s,d,e){
    if (s && d.root.encs && d.root.encs.length > 0) {
        /* definimos la modal y la mostramos */
        let $myModal = $('#myModalEncuesta');
        if (esInternetExplorer()) {
            $myModal.removeClass('fade');
            $('.modal-overlay').show();
            $myModal.show();
        } else
            $myModal.modal('show');
        //click a la "x" de cerrar modal
        $('.close', $myModal).click(function () {
            cerrarModalIE($myModal);
        });
        /*************/
        e.form.modul.Forms.guardarEncuestaEmpleado.set({
            p_codenc:d.root.encs[0].codenc,
            desenc:d.root.encs[0].desenc,
            despre:d.root.encs[0].pres[0].despre
        });
        let cadena = e.form.modul.return('modulos/comunes/tabla.html?valoracionCaritasEncuesta');
        for (let i = 0; i < d.root.encs[0].pres[0].ress.length; i++) {
            let HTML = $.parseHTML(cadena.reemplazaMostachos(d.root.encs[0].pres[0].ress[i]));
            $('.respuestasPreguntaEncuesta').append(HTML);
        }
        $('.imgEncuesta').click(function () {
            let aqui = dondeEstoy(this);
            aqui.set({p_codres:this.getAttribute('codpre')+':'+this.getAttribute('codres')});
            aqui.executeForm();
        });
    } else {
        
    }
    
}