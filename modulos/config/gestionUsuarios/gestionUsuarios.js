var GestionUsuarios = class {
    constructor(modulo) {
        this.selectors = { utils: {} };
        this.selectors.gestionUsuarios = createJQerySelectors(modulo.Forms.gestionUsuarios);
        this.selectors.utils['lupa'] = $('.lupaBuscarUsuarios');
        this.selectors.utils['btnCleanForm'] = $('button[role="refresh"]');
        this.addEvents();
        this.selectors.utils.lupa.trigger('click');
    };

    addEvents() {
        this.selectors.utils.lupa.click(this.initSearchUser.bind(this));
        this.selectors.utils.btnCleanForm.click(this.cleanForm.bind(this));
        this.selectors.gestionUsuarios.codusr.on('blur', this.initSearchUser.bind(this));
        this.selectors.gestionUsuarios.usraut.on('blur', this.initSearchUser.bind(this));
        this.selectors.gestionUsuarios.dniusr.on('blur', this.initSearchUser.bind(this));
        this.selectors.gestionUsuarios.socint.on('change', this.addClassActive);
        this.selectors.gestionUsuarios.coddep.on('change', this.addClassActive);
        this.selectors.gestionUsuarios.mthval.on('change', this.addClassActive);
        this.selectors.gestionUsuarios.codemp.on('change', this.addClassActive);
    };


    initSearchUser(evt) {
        var form = dondeEstoy(evt.target);
        if (evt.type === 'click' || this.hasChanged(form, evt)) {
            let params = this.prepareParams(form, evt);
            buscarUsuario(params);
        };
    };

    hasChanged(form, evt) {
        let fieldToCheck = form.parametros[evt.target.name];
        let fieldIsChanged = fieldToCheck.preValue !== fieldToCheck.value;
        if (fieldIsChanged) {
            fieldToCheck.preValue = fieldToCheck.value;
            fieldIsChanged = fieldToCheck.value !== '';
        };
        return fieldIsChanged;
    };

    prepareParams(form, evt) {
        let evtName = evt.target.getAttribute('name');
        let params = {
            ndatos: 'LEP',
            fecbaj: 'S',
            extern: 'S',
            filtro: '00',
        };
        if (evtName == 'lupa' || evtName == 'usraut') {
            params['fnc'] = (usr) => { this.setAuthorized(usr, form) };
            evtName == 'usraut' ? params['codusr'] = form.parametros.usraut.value.toUpperCase() : null;
        }
        else {
            params['fnc'] = (usr) => { this.setData(usr, form) };
            let key = evtName == 'codusr' ? 'codusr' : 'dniusr';
            params[key] = form.parametros[key].value.toUpperCase();
        };
        return params;
    };

    setAuthorized(usr, form) {
        let { pernr, nombre } = usr;
        form.set({ usraut: pernr, authName: nombre });
    };

    setData(usr, form) {
        let typeUsr, currentCompany = null;
        let tipEmpleado = '';
        if(['FIC', 'EXT', 'FQZ', 'ESPC'].inArray(usr.codemp)>=0) {
            typeUsr = usr.codemp;
            currentCompany = usr.socint;
            tipEmpleado =  usr.tipo_contrato == 'D' ? 'Fijo Discontinuo en periodo Activo' : '';
        }
        else {
            typeUsr = 'EMP';
            currentCompany = usr.codemp;
        }
        let that = this;
        let selectors = Object.keys(this.selectors.gestionUsuarios);
        $.each(selectors, (index, selector) => {
            if (typeUsr === 'EMP') {
                that.selectors.gestionUsuarios[selector].prop('disabled', true);
            };
            that.selectors.gestionUsuarios[selector].val('').siblings().addClass('active');;
        });
        let gbdat = this.formatDate(usr.gbdat);
        let fecfin = usr.fecfin ? this.formatDate(usr.fecfin) : '';
        let updatedData = {
            codusr: usr.pernr,
            nombre: usr.vorna,
            priapl: usr.nach,
            secapl: usr.nach2,
            dniusr: usr.perid,
            codemp: typeUsr,
            socext: usr.socext,
            coddep: usr.coddep,
            socint: currentCompany,
            fecbaj: fecfin,
            fecnac: gbdat,
            mthval: usr.mthval,
            usraut: usr.usraut,
            tipEmpleado
        };
        form.set(updatedData);
        this.setPrevValue(form);
        form.parametros.usraut.preValue = '';
        typeUsr === 'EMP' ? this.selectors.gestionUsuarios.usraut.prop('disabled', true).addClass('disabledField'): 
                            this.selectors.gestionUsuarios.usraut.blur();
    };

    formatDate(date) {
        let splitDate = date.split('/');
        return splitDate[2] + '-' + splitDate[1] + '-' + splitDate[0];
    };

    cleanForm(evt) {
        $(window).scrollTop(0);
        const form = dondeEstoy(evt.target);
        let that = this;
        let selectors = Object.keys(this.selectors.gestionUsuarios);
        $.each(selectors, (index, selector) => {
            that.selectors.gestionUsuarios[selector].prop('disabled', false).val('');
            if (that.selectors.gestionUsuarios[selector].attr('type') !== 'date') {
                that.selectors.gestionUsuarios[selector].siblings().removeClass('active');
            }
        });
        $('label[for="socint"]').addClass('active');
        let updatedData = {};
        let keys = Object.keys(form.parametros);
        keys.forEach((key) => {
            updatedData[key] = '';
        });
        form.set(updatedData);
        this.setPrevValue(form);
        this.selectors.gestionUsuarios.usraut.removeClass('disabledField');
        this.selectors.utils.lupa.trigger('click');
    };

    setPrevValue(form) {
        const coddep = form.parametros.coddep.preValue;
        $.each(Object.keys(form.parametros), (index, key) => {
            form.parametros[key].preValue = form.parametros[key].value;
        });
        form.set({
            coddep
        });
    };

    addClassActive(evt) {
        $(evt.target).siblings().addClass('active');
    };

};

function gestionUsuarios(success, data, e) {
    if (success) {
        toast({ tipo: 'success', msg: data.txtmsg });
    } else {
        validaErroresCbk(data);
    };

};
