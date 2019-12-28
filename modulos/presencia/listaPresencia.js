var ListaPresencia = class {

    constructor(modulo) {
        let me = this;
        let form = this.form = $('.listaPresencia form[name=frmListaPresencia]')[0];
        let fecha = new Date();
        dondeEstoy(form).set({p_fechad:fecha.addDay(-8).formatea('yyyy-MM-dd'), p_fechah:fecha.addDay(-1).formatea('yyyy-MM-dd')});

        $('input[name=p_nomusr]', form).change(function() {
            if($(this).val()) {
                buscarUsuario({
                    codusr: $(this).val(),
                    extern: 'S',
                    ndatos: 'LE',
                    fnc: function(usr) {
                        dondeEstoy(form).set({ p_codusr: usr.pernr, p_nomusr: usr.nombre });
                        $('input[name=p_nomusr]', form).change();
                    }
                });
            }
        });
        $('.btnUsrSearch', form).click(function() {
            buscarUsuario({
                extern: 'S',
                ndatos: 'LE',
                filtro: '00',
                fnc: function(usr) {
                    dondeEstoy(form).set({ p_codusr: usr.pernr, p_nomusr: usr.nombre });
                    $('input[name=p_nomusr]', form).change();
                }
            });
        });
    
        $('select', form).change(function() {
            me._activeLabel(this);
        });
        $('select', form).ajaxSuccess(function() {
            if(this.options.length > 0 && this.options[0].value == '') {
                this.options[0]= new Option('', '');
            } else {
                this.prepend(new Option('', ''));
            }
            this.selectedIndex = "0";
            me._activeLabel(this);
        });
    
        $('.btnClearFrmListaPresencia', form).click(function() {
            me._clearFrmListaPresencia();
        });
    
        $('.btnClearUsrSearch', form).click(function() {
            me._clearUsrSearch();
        });
    
        $('input[name=p_fechad]', form).change(function() {
            $('input[name=p_fechah]', form).attr('min', $(this).val());
        });
        $('input[name=p_fechah]', form).change(function() {
            $('input[name=p_fechad]', form).attr('max', $(this).val());
        });
    
        $('.btnCollapseFilter', form).click(function() {
            me._collapseFilter($('i', this));
        });
    }

    // Funciones de eventos
    btnVer() {
        let form = $('.listaPresencia form[name=frmListaPresencia]')[0];
        if(dondeEstoy(form).selected) {
            Moduls.app.child.modal.child.modalBody.load({ 
                url: 'modulos/presencia/modals/listaPresencia/modalPresencia.html', 
                script: true,
                args:{
                    p_codusr: dondeEstoy(form).selected.codusr,
                    p_fecha:  dondeEstoy(form).selected.fecha
                }
            });
            construirModal({
                title: 'Detalles de los Fichajes',
                w: '900px',
                oktext: "Aceptar"
            });
        } else {
            toast({ tipo: 'success', msg: 'Debe seleccionar un registro' });
        }
    }

    _clearFrmListaPresencia() {
        let form = $('.listaPresencia form[name=frmListaPresencia]')[0];
        dondeEstoy(form).set({
            p_codusr: '',
            p_nomusr: '',
            p_codemp: '',
            p_ceco:   '',
            p_fechad: '',
            p_fechah: ''
        });
        this._activeAllLabel(form);
    }

    _clearUsrSearch() {
        let form = $('.listaPresencia form[name=frmListaPresencia]')[0];
        dondeEstoy(form).set({
            p_codusr: '',
            p_nomusr: ''
        });
        this._activeAllLabel(form);
    }

    _collapseFilter(obj) {
        obj.html(obj.html() == 'expand_more' ? 'expand_less' : 'expand_more');
    }

    selListaPresencia(obj) {
        let form = $('.listaPresencia form[name=frmListaPresencia]')[0];
        dondeEstoy(form).selected = obj;
    }


    // Funciones de callback
    cbkListaPresencia(s, d, e) {
        if(!s) validaErroresCbk(d);
    }

    concatOcupat(row) {
        return row.ocupat?'<span style="display: none;">' + row.ocupat.toString().lpad(3, '0') + '</span>' + row.ocupat + '%':'';
    }
    
    // Funciones auxiliares
    _activeAllLabel(form) {
        let me = this;
        $('input:not([type=date]), select', form).each(function() {
            me._activeLabel(this);
        });
    }
    _activeLabel(enviroment) {
        if(!$(enviroment).val() || $(enviroment).val() == null || $(enviroment).val() == '') {
            $(enviroment).parent().children().removeClass("active");
        } else {
            $(enviroment).parent().children().addClass("active");
        }
    }

}