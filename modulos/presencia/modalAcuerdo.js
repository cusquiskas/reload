var ModalAcuerdo = class {
    constructor (modul, args) {
        this.args = args;
        let form = modul.getForm('gestionAcuerdo');
        if (args.nuevo===false) {
            form.set(args.row);
            form.formulario.codusr.disabled = true;
            form.formulario.fechad.disabled = true;
            form.formulario.horini.disabled = true;
            form.formulario.horfin.disabled = true;
        } else {
            $('input[name=codusr]', form.formulario).change(function() {
                if(this.value!=="") {
                    let valor = this.value;
                    form.formulario.codusr.value = form.parametros.codusr.value = '';
                    form.formulario.codusrX.value = form.parametros.codusrX.value = '';
                    buscarUsuario({
                        codusr: valor,
                        extern: 'N',
                        ndatos: 'X',
                        fnc: function(usr) {
                            form.formulario.codusr.value = form.parametros.codusr.value = usr.pernr;
                            form.formulario.codusrX.value = form.parametros.codusrX.value = usr.nombre;
                        }
                    });
                } else {
                    form.formulario.codusr.value = form.parametros.codusr.value = '';
                    form.formulario.codusrX.value = form.parametros.codusrX.value = '';
                }
            });

            $('.btnUsrSearch', form.formulario).click(function() {
                buscarUsuario({
                    extern: 'N',
                    ndatos: 'X',
                    fnc: function(usr) {
                        form.formulario.codusr.value = form.parametros.codusr.value = usr.pernr;
                        form.formulario.codusrX.value = form.parametros.codusrX.value = usr.nombre;
                    }
                });
            });
            

        }

    }

    cbkGestionAcuerdo (s,d,e) {
        if (!s) validaErroresCbk(d,true);
        else {
            toast({msg:d.txtmsg}, true);
            e.form.modul.getScript().args.recarga && e.form.modul.getScript().args.recarga(e.form.modul.getScript().args.clase); 
            cerrarModalIE($('#myModal'));
        }
    }
}