var EmpleadoAcuerdo = class {
    constructor (modul, arg) {
        this.rowSelect = false;
        let formSrc = modul.getForm('frmEmpleadoAcuerdo');
        this.search = formSrc;
        modul.getForm('frmEmpleadoAcuerdo').set({fecha:sysdate('yyyy-mm-dd')});
        
        $('input[name=nomusr]', formSrc.formulario).blur(function() {
            if($(this).val() && !isNaN(this.value)) {
                buscarUsuario({
                    codusr: $(this).val(),
                    extern: 'N',
                    ndatos: 'L',
                    fnc: function(usr) {
                        formSrc.set({ codusr: usr.pernr, nomusr: usr.nombre });
                    }
                });
            }
        });

        $('.btnUsrSearch', formSrc.formulario).click(function() {
            buscarUsuario({
                extern: 'N',
                ndatos: 'L',
                filtro: '00',
                fnc: function(usr) {
                    formSrc.set({ codusr: usr.pernr, nomusr: usr.nombre });
                }
            });
        });

        $('.btnClearUsrSearch', formSrc.formulario).click(function() {
            formSrc.set({ codusr: '', nomusr: '' });
        });

    }

    
    clickNuevo (evt) {
        let modul = dondeEstoy(evt.currentTarget).modul;
        let clase = modul.getScript();
        Moduls.getModalbody().load({ url: 'modulos/presencia/modalAcuerdo.html', script: true, args:{nuevo:true, row:clase.rowSelect, clase, recarga:clase.recarga}});
        construirModal({ title: "Nuevo Acuerdo", w: 600, xfunction:function(){}});
    }
    
    clickModificar (evt) {
        let modul = dondeEstoy(evt.currentTarget).modul;
        let clase = modul.getScript();
        if (clase.rowSelect !== false) {
            Moduls.getModalbody().load({ url: 'modulos/presencia/modalAcuerdo.html', script: true, args:{nuevo:false, row:clase.rowSelect, clase, recarga:clase.recarga}});
            construirModal({ title: "Modifica Acuerdo", w: 600, xfunction:function(){}});
        } else {
            toast({msg:'Debes seleccionar un registro'});
        }
    }

    recarga (context) {
        context.search.executeForm();
        context.rowSelect = false;
    }
    
    cbkListaAcuerdo (s,d,e) { if (!s) validaErroresCbk(d); }
    deselectedRow(data) { this.rowSelect = false; }
    selectedRow  (data) { 
        this.rowSelect = JSON.parse(JSON.stringify(data));
        this.rowSelect.fechad = this.rowSelect.fechad.hazFecha('dd/mm/yyyy','yyyy-mm-dd');
        this.rowSelect.fechah = this.rowSelect.fechah.hazFecha('dd/mm/yyyy','yyyy-mm-dd');
    }
    
}