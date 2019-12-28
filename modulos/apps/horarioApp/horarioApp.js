var HorarioApp = class {
    constructor(modul, args) {
        this.moduls = modul;
        this.args = args;
        this.selectors = {
            btnFichaje: $('button[aria-label="Fichaje"]'),
            btnInsercion: $('button[aria-label="Inserción"]'),
            responsable: $('button[aria-label="responsable"]'),
            switchBtn: $('button[aria-label="calendarioListado"]')
        };
        this.listsRoutes = {
            listado: 'modulos/presencia/listadoHorario/listadoHorario.html',
            calendar: 'modulos/presencia/calendar/calendar.html'
        };
        this.selectedList = 'listado';
        this.selectedProc = 'propio';
        this.addEvents();
        this.containerList();
        Moduls.getModal().load({ url: 'modulos/comunes/modal.html', script: false });
        this.setTokenSession();
        this.tokenSession = null;
        this.ArrayEmployee = [];
        this.AcordDirec = false;

        if (!sessionStorage.getItem('SESION_ID') || sessionStorage.getItem('SESION_ID') == "") sessionStorage.setItem('SESION_ID', top.SESION_ID);
        
        if (sessionStorage.getItem("tokenArmageddon") && sessionStorage.getItem("tokenArmageddon") !== "") {
            this.getTokenArmageddon(true, '{"username":"","token":"'+sessionStorage.getItem("tokenArmageddon")+'"}', {form:modul.getForm('getTokenArmageddon'), xxhttpresponsecodexx:200});
        } else {
            modul.getForm('getTokenArmageddon').authorization = {type:'NoAuth', key:sessionStorage.getItem('SESION_ID') };
            modul.getForm('getTokenArmageddon').executeForm();
        }
    };


    setTokenSession() {
        let date = new Date;
        let offsetUTC = date.getTimezoneOffset() / 60;
        offsetUTC = offsetUTC < 0 ? `UTCM0${Math.abs(offsetUTC)}00` : `UTCL0${offsetUTC}00`;
        offsetUTC = offsetUTC.toString();
        this.tokenSession = insertSubstrIntoStr(getXsid(), 6, offsetUTC); // Generamos el token de sessión, NO modificar para evitar errores de autenticación.
    };

    containerList() {
        /* AQUÍ TENGO QUE REALIZAR LA PETICIÓN */
        let codusr = Moduls.getHeader().user.codusr;
        let usersCanSeeCalendar = ['14293', 'XX698', 'XX584', '909', '39972', '14502']; // Sólo la verdadera élite, machos de pecho plateado, pueden visualizar el calendario
        if (usersCanSeeCalendar.inArray(codusr) >= 0) {
            this.enableSwitchBtn();
        };
        Moduls.getListcontainer().load({ url: this.listsRoutes[this.selectedList], script: true });
    };

    enableSwitchBtn() {
        this.selectors.switchBtn.click(this.onSwitchBtnClickHandler.bind(this));
        this.selectors.switchBtn.removeClass('dn');
    };

    onSwitchBtnClickHandler() {
        this.selectedList = this.selectedList == 'listado' ? 'calendar' : 'listado';
        Moduls.getListcontainer().load({ url: this.listsRoutes[this.selectedList], script: true });
    };

    enableResponsableBtn() {
        this.selectors.responsable.click(this.onSwitchBtnRespClickHandler.bind(this));
        this.selectors.responsable.removeClass('dn');
    };

    onSwitchBtnRespClickHandler() {
        this.selectedProc = this.selectedProc == 'propio'?'responsable':'propio';
        if (!this.AcordDirec) {
            this.selectors.btnInsercion.toggleClass('dn');
            this.selectors.btnFichaje.toggleClass('dn');
        }
        $('.toggleSpanResp').toggleClass('dn');
        // 14293 - 18.11.2019 - esta función tiene que estar en cada uno de los diferentes listados que se puedan cargar
        Moduls.getListcontainer().getScript().toggleList({selectedProc:this.selectedProc, ArrayEmployee:this.ArrayEmployee, tokenArmageddon:sessionStorage.getItem("tokenArmageddon")});
    };

    addEvents() {
        this.selectors.btnFichaje.click(this.loadModal.bind(this));
        this.selectors.btnInsercion.click(this.loadModal.bind(this));
    };

    loadModal(evt) {
        let action = evt.target.getAttribute('aria-label');
        let title, modalToOpen, width = null;
        let clase = dondeEstoy(evt.target).getScript();
        if (action === 'Fichaje') {
            title = 'Nuevo Registro';
            modalToOpen = 'insertarFichaje/insertarFichaje.html';
            width = '649px';
        } else {
            title = 'Nuevo Registro';
            modalToOpen = 'fichajeVirtual/fichajeVirtual.html'
            width = '949px';
        }
        Moduls.getModalbody().load({ url: `modulos/presencia/modals/${modalToOpen}`, script: true, args:{tokenSession:clase.tokenSession} })
        construirModal({ title, w: width, })
    };

    getTokenArmageddon(s,d,e) {
        if (s) {
            // 14293 - 22.11.2019 - Armageddon devuelve un String, tenemos que hacer el parseo
            try { if (typeof(d)==='string') d = JSON.parse(d); } catch(err) { return false; }
            let modulo = e.form.modul;
            let form = modulo.getForm('getEmployees');
            sessionStorage.setItem("tokenArmageddon", d.token);
            form.formulario.action = form.formulario.action.replace("%7BCodigoTrabajador%7D", Moduls.getHeader().user.codusr);
            form.authorization = {type:'NoAuth', key:d.token};
            form.executeForm();
        }
    };
    
    getEmployees(s,d,e) {
        // 14293 - 22.11.2019 - Armageddon devuelve un String, tenemos que hacer el parseo
        try {    
            if (typeof(d)==='string') d = JSON.parse(d);
        } catch (err) {
            d = false;
        }
        if (s) {
            if (d.rowset.length > 0) {
                let clase = e.form.modul.getScript();
                clase.enableResponsableBtn();
                clase.ArrayEmployee = d.rowset;
            }
        } else {
            if ([401,403].inArray(e.xxhttpresponsecodexx) > 0) {
                let form = e.form.modul.getForm('getTokenArmageddon');
                form.authorization = {type:'NoAuth', key:sessionStorage.getItem('SESION_ID') };
                console.log('getEmployees 2 -> '+sessionStorage.getItem('SESION_ID'));
                form.executeForm();
            }/* else {
                toast({tipo:'error', msg:'Error al recuperar el listado de Empleados'});
                if (d) validaErroresCbk(d);
            }*/
        }
    };

    getAcuerdoDirecc(s, d, e) {
        if (s) {
            if (d.root.fechad && d.root.fechad !== "") {
                let clase = e.form.modul.getScript();
                clase.AcordDirec = true;
                clase.selectors.btnInsercion.addClass('dn');
                clase.selectors.btnFichaje.addClass('dn');
            }
        } else {
            validaErroresCbk(d);
        }
    };
};