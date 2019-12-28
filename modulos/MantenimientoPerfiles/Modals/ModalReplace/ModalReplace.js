var ModalReplace = class {
    constructor(modul, args) {
        this.data = args;
        this.selectors = $.extend({}, {
            lupa: $('form[name="listadoPerfil"]').find('.lupaBuscarUsuarios'),
            btnSave: $('button[name="saveReplaceOrClone"]'),
            closeModal: $('span[name="closeModalReplace"]'),
            myModalReplace: $('div[name="myModalReplace"]'),
            buttonCloseModal: $('button[name="closeModalReplace"]')
        })
        this.selectors = $.extend(this.selectors, createJQerySelectors(modul.Forms.listadoPerfil))
        this.selectedUser = {}
        this.forms = modul.Forms;
        this.addEvents();
        this.setInitialData();
        $('body').css('overflow', 'hidden')
    };

    addEvents() {
        this.selectors.buttonCloseModal.on('click', this.closeModal.bind(this));
        this.selectors.lupa.on('click', this.searchUser.bind(this))
        this.selectors.codusr.on('blur', this.searchUser.bind(this))
        this.selectors.btnAllOrg.on('click', this.btnClickHandler.bind(this))
        this.selectors.btnCurrentOrg.on('click', this.btnClickHandler.bind(this))
        this.selectors.btnSave.on('click', this.saveProfile.bind(this));
    };

    btnClickHandler(evt) {
        this.data.allOrg = evt.target.name === 'btnAllOrg';
    };

    closeModal() {
        $('#modalReplace').css('display', 'none');
        $('body').css('overflow', 'auto');
        Moduls.getModalreplace().load({
            url: 'res/blanco.html',
            script: false,
        });
    };

    setInitialData() {
        let title = this.data.action === 'replace' ? 'Sustituir Usuario ' : 'Clonar Usuario ';
        title += `(${this.data.selectedUsr[0].nomusr})`
        $('h4[name="modalTitle"]').text(title)
        this.forms.listadoPerfil.set({
            codapl: this.data.codapl,
            p_apl: this.data.codPerf
        });
    };

    onFormModalLoad(s, d, e) {
        e.form.set({ selectedDpt: e.form.modul.script.data.selectedDpt })
    };

    searchUser(evt) {
        if (evt.type !== 'blur' || this.hasChanged(evt.target)) {
            let params = {
                ndatos: 'X',
                fecbaj: 'N',
                extern: 'N',
                filtro: '00',
                fnc: (usr) => { this.replaceUsr(usr) }
            };
            if (evt.type === 'blur') {
                params.codusr = evt.target.value
            }
            else {
                $('#modalReplace').css('display', 'none');
                $('body').css('overflow', 'auto');
            }
            buscarUsuario(params);
        }
    };

    hasChanged(input) {
        let inputOnForm = this.forms.listadoPerfil.parametros[input.name];
        let hasChanged = false;
        if (inputOnForm.preValue !== inputOnForm.value && inputOnForm.value !== '') {
            inputOnForm.preValue = inputOnForm.value;
            hasChanged = true;
        }
        return hasChanged;
    }

    replaceUsr(usr) {
        $('body').css('overflow', 'hidden');
        $('#modalReplace').css('display', '');
        this.selectors.myModalReplace.css('display', 'block');
        this.data.currentUsr = usr;
        this.selectors.codusr.siblings().closest('label').addClass('active');
        this.forms.listadoPerfil.set({
            usrname: usr.vorna,
            codusr: usr.pernr
        })
        this.shouldEnable(true)
    };

    shouldEnable(enable) {
        const selectorsKeys = Object.keys(this.forms.listadoPerfil.parametros);
        selectorsKeys.forEach((key) => {
            $(this.forms.listadoPerfil.parametros[key].object).prop('disabled', !enable)
        });
        this.selectors.usrname.prop('disabled', true);
    };

    setDptsToUsr() {
        let p_empdep = '';
        if (this.data.allOrg) {
            this.data.selectedUsr.forEach((usr) => {
                p_empdep = p_empdep + `.*.*.:${usr.codemp.split('.')[1]}:#`
            });
        }
        else {
            let dptsOfCurrentUser = this.data.users.filter((usr) => {
                return usr.codusr == this.data.currentUsr.pernr
            }, this);
            dptsOfCurrentUser.forEach((currentUsr) => {
                p_empdep = p_empdep + `.*.*.:${currentUsr.codemp.replace('.','')}:#`;
            });
            let dptId = $('.personIconActive').parent().parent().attr('id').replace('uo', '');
            p_empdep =  p_empdep + `.*.*.:${dptId}:#`
        }
        return p_empdep;
    };

    saveProfile() {
        let p_perfil = this.forms.listadoPerfil.parametros.p_apl.value;
        let p_aplicacion = this.forms.listadoPerfil.parametros.codapl.value;
        let p_usuario = this.forms.listadoPerfil.parametros.codusr.value;
        let p_empdep = this.setDptsToUsr();
        this.forms.guardar_perfiles.set({
            p_perfil, p_aplicacion, p_usuario, p_empdep
        });
        this.forms.guardar_perfiles.executeForm();
        if (this.data.action === 'replace') {
            this.deleteProfile({ p_perfil, p_aplicacion, p_empresa: p_empdep, p_usuario: this.data.selectedUsr[0].codusr });
        }
        setTimeout(this.data.fc, 500);
        this.closeModal();
    };

    deleteProfile(usr) {
        if (this.data.allOrg) {
            this.data.selectedUsr.forEach((selectedUsr) => {
                let formadUsr = Object.assign(usr, { p_empresa: selectedUsr.codemp });
                this.forms.borrar_perfil.set(formadUsr);
                this.forms.borrar_perfil.executeForm();
            });
        }
        else {
            let formadUsr = Object.assign(usr, { p_empresa: '.' + $('.personIconActive').parent().parent().attr('id').replace('uo', '')})
            this.forms.borrar_perfil.set(formadUsr);
            this.forms.borrar_perfil.executeForm();
        };
    };


}