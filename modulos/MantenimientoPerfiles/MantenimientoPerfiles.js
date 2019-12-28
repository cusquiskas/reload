/*
    Esta clase espera recibir dos parametros --> (Proceso, p_codapl):
    * Proceso que será seteado cómo título.
    * p_codapl para hacer la petición de los perfiles en base a la aplicación que se le pase.

*/


var MantenimientoPerfiles = class {
    constructor(modul, args) {
        this.selectors = {
            table: {
                tProfiles: $('table[name="profilesTable"]'),
                theader: $('thead[name="theader"]'),
                tbody: $('tbody[name="tbody"]')
            },
            btns: {
                removeBtn: $('.floatRemoveBtn'),
                addBtn: $('.floatAddBtn'),
                clonBtn: $('.floatClonBtn'),
                sustBtn: $('.floatSustiBtn')
            },
            aplication: {
                container: $('div[name="aplication"]'),
                lupa: $('.lupaBuscarUsuarios')
            }
        };
        this.data = {
            codapl: null,
            profilesOfApp: [],
            bluePrint: [],
            users: [],
            selectedDpt: null,
            selectedProfile: null,
            selectedUsr: null,
            fc: this.reloadUsers.bind(this)
        };
        this.forms = {}
        this.forms = modul.Forms;
        this.selectors.mantenimientoPerfiles = createJQerySelectors(modul.Forms.MantenimientoPerfiles);
        this.addEvents();
        this.setInitData(this.forms.MantenimientoPerfiles, args);
    };

    reloadUsers() {
        this.forms.refresh_users.set({
            p_perfil: this.data.codPerf,
            p_aplicacion: this.data.codapl,
        });
        this.forms.refresh_users.executeForm();
    };

    addEvents() {
        this.selectors.mantenimientoPerfiles.codapl.change(this.setCodApl.bind(this));
        this.selectors.mantenimientoPerfiles.p_apl.on('ajaxSuccess', this.onProfilesOfAppAppLoad.bind(this));
        this.selectors.mantenimientoPerfiles.arbolDpt.on('ajaxSuccess', this.createDptTree.bind(this));
        this.selectors.mantenimientoPerfiles.usersProfileList.on('ajaxSuccess', this.onUsersLoad.bind(this));
        this.selectors.btns.removeBtn.on('click', this.btnRemoveHandler.bind(this));
        this.selectors.btns.addBtn.on('click', this.btnAddHandler.bind(this));
        this.selectors.btns.clonBtn.on('click', this.btnClonHandler.bind(this));
        this.selectors.btns.sustBtn.on('click', this.btnSustHandler.bind(this));
        this.selectors.aplication.lupa.on('click', () => { this.searchUser(this.searchUserOnTree.bind(this)) })
        this.selectors.mantenimientoPerfiles.foundUser.on('blur', (evt) => {
            this.forms.MantenimientoPerfiles.set({ dptName: '', codDpt: '' });
            if (evt.target.value.length == 0) {
                this.forms.MantenimientoPerfiles.set({ foundUserName: '' });
            } else {
                this.searchUser(this.searchUserOnTree.bind(this), evt.target.value)
            }


        });
        this.selectors.mantenimientoPerfiles.codDpt.on('blur', (evt) => {
            this.forms.MantenimientoPerfiles.set({ foundUserName: '', foundUser: '' });
            if (evt.target.value.length == 0) {
                this.forms.MantenimientoPerfiles.set({ dptName: '' });
            } else { this.searchDpt(evt) }
        });
        $('.popover').remove();
    };

    setInitData(form, args) {
        form.set(args)
    }

    setCodApl(e) {
        const { name, value } = e.target;
        if (this.data[name]) {
            this.selectors.table.theader.empty();
            this.selectors.aplication.container.addClass('dn');
            $('.personIcon').remove();
            this.foldDpts();
        };
        this.data[name] = value;
    };

    onProfilesOfAppAppLoad(e) {
        const profilesOfApp = e.originalEvent.data.root;
        this.data.profilesOfApp = profilesOfApp;
        this.createTableHeaders();
        this.selectors.aplication.container.removeClass('dn');
    };

    createTableHeaders() {
        const ths = [];
        let tr = document.createElement('tr');
        const that = this;
        for (var i = 0; i < this.data.profilesOfApp.length; i++) {
            let th = $(document.createElement('th')).attr({ 'scope': 'col', 'ind': i }).text(this.data.profilesOfApp[i].despfl)
                .addClass('w-100 font-weight-bold logoNavbar bg-light').click(this.profileClickHandler.bind(that));
            ths.push(th);
        };
        $(tr).addClass('d-flex text-center').append(ths);
        this.selectors.table.theader.append(tr);
    };

    profileClickHandler(evt) {
        this.resetCurrentData();
        $('.popover').remove();
        $('.personIcon').remove();
        $('.selectDpt').removeClass('selectDpt');
        //Si hemos seleccionado otro perfil de aplicación primero cerramos el arbol organizativo y luego lo desplegamos con los nuevos usuarios.
        this.foldDpts(false);
        let ths = this.selectors.table.theader.children().children();
        ths.removeClass('nav-lvl-1');
        $(evt.target).addClass('nav-lvl-1');
        //  Le quitamos la clase que le da el background color a todos los table headers, para no acumular dichos elementos con este background,
        //  únicamente tendremos uno seleccionado, por ello se lo quitamos a todos y luego se lo ponemos al elemento seleccionado.
        let index = evt.target.getAttribute('ind');
        const currentProfile = this.data.profilesOfApp[index];
        const { codapl, despfl, codpfl } = currentProfile;
        this.data.selectedProfile = despfl;
        this.data.codPerf = codpfl;
        this.forms.MantenimientoPerfiles.set({
            process: codapl, despfl, selectedProfile: codpfl, foundUserName: '', foundUser: '', dptName: '', codDpt: ''
        });
        $('.floatClonBtn , .floatSustiBtn').prop('disabled', true);
    };

    createDptTree(evt) {
        let arbolDepartamento = $('.arbolDepartamento');
        arbolDepartamento.append(this.procesarArbolDep(evt.originalEvent.data));
        this.genTreed(arbolDepartamento);
        arbolDepartamento.addClass('arbolDepartamentoExpandible');
        $('.arbolDepartamento li').dblclick(this.dptDbClickHandler.bind(this));
    };


    procesarArbolDep(json) {
        var lista = "";
        for (let i = 0; i < json.children.length; i++) {
            let hijo = json.children[i];
            lista += "<li name='" + hijo.uniorg + "' id='uo" + hijo.id + "'><div class='tree-node'><span>" + hijo.uniorg + "</div></span>";
            if (hijo.children !== undefined) lista += "<ul>" + this.procesarArbolDep(hijo) + "</ul>";
            lista += "</li>";
        };
        return lista;
    };

    genTreed(tree) {
        if (tree === undefined || !tree.desplegar) {
            var openedClass = 'remove_circle_outline';//-
            var closedClass = 'add_circle';//+
        } else {
            var openedClass = '', closedClass = '';//+
        };
        if (typeof tree != 'undefined') {
            if (typeof tree.openedClass != 'undefined') {
                openedClass = tree.openedClass;
            };
            if (typeof tree.closedClass != 'undefined') {
                closedClass = tree.closedClass;
            };
        };
        tree.addClass("tree");
        tree.find('li').has("ul").each(function () {
            var branch = $(this);
            branch.children('.tree-node').prepend("<i class='material-icons'>" + closedClass + "</i>");
            branch.addClass('branch');
            branch.children('.tree-node').children('i').on('click', function (e) {
                if (this == e.target) {
                    var icon = $(this).first();//.children('i:first');
                    if (icon.text() == openedClass) {
                        icon.removeClass("iconoMenos");
                        icon.text(closedClass);
                    } else {
                        icon.addClass("iconoMenos");
                        icon.text(openedClass);
                    }
                    $(this).parent().parent().children('ul').children().toggle().toggleClass('activeDpt');
                    $(this).toggleClass('activeDpt');
                    $('.personIconActive').popover('hide');
                }
            });
            branch.children('ul').children().toggle();

        });
        tree.find('.branch .indicator').each(function () {
            $(this).on('click', function () {
                $(this).closest('li').click();
            });
        });
    };

    dptDbClickHandler(evt) {
        if (!$(evt.target).hasClass('material-icons')) {
            $('.selectDpt').removeClass('selectDpt');
            let branchNode = this.findBranchNode(evt.target);
            branchNode.attr('id').includes('uo') ? this.data.selectedDptId = branchNode.attr('id').replace('uo', '') : branchNode.attr('id');
            this.data.selectedDpt = branchNode.attr('name');
            branchNode.addClass('selectDpt')
            return false;
        };
    };

    findBranchNode(el) {
        let branchNode = $(el).is('span') ? $(el).parent().parent() : $(el).parent().attr('id') ? $(el).parent() : $(el);
        return branchNode;
    };

    btnRemoveHandler() {
        this.addAndDeleteHandler(this.openModal.bind(this));
    };

    btnAddHandler() {
        this.addAndDeleteHandler(() => { this.searchUser(this.addUserToDpt.bind(this)) });
    };

    addAndDeleteHandler(callback) {
        (this.data.selectedDpt && this.data.selectedProfile) ? callback() : toast({
            tipo: 'error', msg: 'Debe seleccionar almenos un departamento y un perfil de aplicación'
        });
    };

    searchUser(callback, codusr) {
        let params = {
            ndatos: 'XL',
            fecbaj: 'N',
            extern: 'N',
            filtro: '00',
            fnc: (usr) => { callback(usr) }
        };
        if (codusr) {
            params.codusr = codusr;
        }
        buscarUsuario(params);
    };

    addUserToDpt(currentUsr) {
        let usrDpts = `.*.*.:${this.data.selectedDptId}:#`;
        let userHaveDpt = this.data.users.filter((user) => {
            return currentUsr.pernr == user.codusr
        });
        if (userHaveDpt.length > 0) {
            userHaveDpt.forEach((usr) => {
                usrDpts = usrDpts + `.*.*.:${usr.codemp.split('.')[1]}:#`
            });
        }
        this.forms.guardar_perfiles.set(
            {
                p_perfil: this.data.codPerf,
                p_aplicacion: this.data.codapl,
                p_usuario: currentUsr.pernr,
                p_empdep: usrDpts
            }
        );
        this.forms.guardar_perfiles.executeForm();
    };

    btnClonHandler() {
        this.data.action = 'clon';
        this.openModalReplace();
    };

    clonUser(user) {
        const fromUsr = this.data.users.filter((usr) => {
            return usr.codusr === this.data.selectedUsr
        });
        this.forms.guardar_perfiles.set(
            {
                p_perfil: this.data.codPerf,
                p_aplicacion: this.data.codapl,
                p_usuario: user.pernr,
                p_empdep: `.*.*.:${fromUsr[0].codemp.split('.')[1]}:#`
            }
        );
        this.forms.guardar_perfiles.executeForm();
    };

    btnSustHandler() {
        this.data.action = 'replace';
        this.openModalReplace();
    };

    openModalReplace() {
        if (this.data.selectedUsr !== null) {
            $('#modalReplace').css('display', 'block')
            Moduls.getModalreplace().load({
                url: 'modulos/MantenimientoPerfiles/Modals/ModalReplace/ModalReplace.html',
                script: true,
                args: this.data
            });
        }
    };

    replaceUser(user) {
        this.clonUser(user);
        const fromUsr = this.data.users.filter((usr) => {
            return usr.codusr === this.data.selectedUsr
        });
        this.forms.borrar_perfil.set({
            p_aplicacion: this.data.codapl,
            p_perfil: this.data.codPerf,
            p_usuario: fromUsr[0].codusr,
            p_empresa: fromUsr[0].codemp
        });
        this.forms.borrar_perfil.executeForm();
    };


    onUsersLoad(evt) {
        this.foldDpts(false);
        const data = evt.originalEvent.data.root;
        this.showUsersOnTree(data);
    };

    unfoldDpts(dpts) {
        if (dpts[0] !== 'Todas las Unidades Organizativas') {
            for (var i = 0; i < dpts.length; i++) {
                this.recursiveUnFold(dpts[i])
            };
        };
    };

    recursiveUnFold(dpt, isSearchingDpt) {
        isSearchingDpt ? isSearchingDpt : false;
        let currentDpt = null;
        if (!dpt.children().children().closest('i').hasClass('activeDpt') && !dpt.hasClass('d-orgeh') && !dpt.hasClass('elementoMenu')) {
            if (!isSearchingDpt) {
                currentDpt = dpt.children().children().closest('i').filter((ind, el) => { return $(el).attr('codusr') === this.data.selectedUsr.codusr });
            } else {
                currentDpt = dpt.children().children().closest('i').filter((ind, el) => { return $(el).hasClass('personIcon') === false });
            }
            currentDpt.click();
            this.recursiveUnFold(dpt.parent().parent(), isSearchingDpt);
        };
    };

    foldDpts(resetData) {
        $('.activeDpt').click().removeClass('activeDpt');
        if (resetData !== false) this.resetCurrentData();
    };

    resetCurrentData() {
        const initialState = { bluePrint: [], selectedUsr: null, selectedProfile: null, codPerf: null, selectedDpt: null, fc: this.reloadUsers.bind(this) };
        this.data = $.extend({}, this.data);
        this.data = $.extend(this.data, initialState);
    };


    openModal() {
        Moduls.app.child.modal.child.modalBody.load({
            url: 'modulos/MantenimientoPerfiles/Modals/ModalDelete/MantenimientoPerfilesModal.html',
            script: true,
            args: this.data
        });
        construirModal({ title: `${this.data.selectedDpt} (${this.data.selectedProfile})`, w: '50vw', 'h': '100vh' });
    };

    onUserAdded(s, d, e) {
        if (s) {
            $('.close').click();
            toast({ tipo: 'success', msg: d.txtmsg });
            e.form.modul.getForms().refresh_users.set({
                p_perfil: e.form.modul.script.data.codPerf,
                p_aplicacion: e.form.modul.script.data.codapl,
            });
            e.form.modul.getForms().refresh_users.executeForm();
        }
        else {
            validaErroresCbk(d, true);
        }
    };

    onUsersChanged(s, d, e) {
        if (s) {
            const that = e.form.modul.script;
            $('.selectDpt').removeClass('selectDpt');
            $('.close').click();
            $('.popover').remove();
            let selecteProfile = that.data.selectedProfile;
            let currentCodPerf = that.data.codPerf;
            that.resetCurrentData();
            that.data.users = d.root;
            that.data.codPerf = currentCodPerf;
            that.data.selectedProfile = selecteProfile;
            that.showUsersOnTree(d.root);
        }
    };

    showUsersOnTree(data) {
        let personIcon = $('.personIcon');
        personIcon.remove();
        personIcon.off('click')
        this.data.users = data;
        for (var i = 0; i < data.length; i++) {
            if (data[i].isCompany === 'false') {
                let id = data[i].codemp.replace('.', '');
                let dptOfProfile = $('#uo' + id);
                if (id === 'ALL') { dptOfProfile = $('li[name="Globalia Corporación"]') };
                let title = esInternetExplorer() ? `<i  title="${data[i].nomusr}"  class="material-icons personIcon" codusr="${data[i].codusr}">perm_identity</i>` :
                    `<i  data-container="body" data-toggle="popover" data-placement="top" data-trigger="manual" data-content="${data[i].nomusr}"  class="material-icons personIcon" codusr="${data[i].codusr}">perm_identity</i>`;
                let personIcon = $.parseHTML(title);
                $(dptOfProfile.find('.tree-node')[0]).append(personIcon);
            };
        };
        if (!esInternetExplorer()) {
            $('[data-toggle="popover"]').popover({
                container: 'form[name="MantenimientoPerfiles"]'
            })
        }
        $('.personIcon').on('click', this.onPersonIconClickHandler.bind(this));
    };

    onPersonIconClickHandler(evt) {
        $('.selectDpt').removeClass('selectDpt');
        let iconTarget = $(evt.target);
        if (iconTarget.hasClass('personIconActive')) {
            this.data.selectedUsr = null;
            $('.personIconActive').popover('hide').removeClass('personIconActive');
            $('.floatClonBtn , .floatSustiBtn').prop('disabled', true);
        }
        else {
            $('.personIconActive').popover('hide').removeClass('personIconActive');
            $('.floatClonBtn , .floatSustiBtn').prop('disabled', false);
            let setSelectedUsr = dondeEstoy($('input[name="selectedProfile"]')[0]).modul.script.data.users.filter((usr) => {
                return usr.codusr == iconTarget.attr('codusr')
            });
            dondeEstoy($('input[name="selectedProfile"]')[0]).modul.script.data['selectedUsr'] = setSelectedUsr;
            this.data.selectedDpt = iconTarget.parent().parent().attr('name');
            this.data.selectedDptId = iconTarget.parent().parent().attr('id').replace('uo', '');
            iconTarget.parent().parent().addClass('selectDpt')
            setTimeout(() => {
                iconTarget.addClass('personIconActive');
                if (!esInternetExplorer()) {
                    iconTarget.popover('toggle')
                };
            });
        }
    };

    deselectionUser() {
        this.data.selectedUsr = null;
        $('.personIconActive').removeClass('personIconActive');
    };

    searchUserOnTree(userToFind) {
        let foundedUser = this.data.users.filter((usr) => {
            return userToFind.pernr == usr.codusr
        });
        if (foundedUser.length > 0) {
            this.data.selectedUsr = foundedUser[0];
            let dptSelector = $(`#uo${foundedUser[0].codemp.replace('.', '')}`);
            this.forms.MantenimientoPerfiles.set({
                foundUserName: userToFind.nombre
            })
            if (foundedUser.length === 1) {
                this.searchDptOfUser(dptSelector);
            }
            else {
                this.data.selectedUsr = foundedUser;
                setTimeout(() => {
                    Moduls.app.child.modal.child.modalBody.load({
                        url: 'modulos/MantenimientoPerfiles/Modals/ModalFoundedUserDpt/ModalFoundedUserDpt.html',
                        script: true,
                        args: this.data
                    });
                    construirModal({ title: `${userToFind.vorna} está presente en los siguientes departamentos`, w: '50vw', 'h': '100vh' });
                });
            };
        }
        else {
            toast({
                tipo: 'error', msg: `${userToFind.vorna} no tiene un departamento asignado con los filtros actuales de perfil y aplicación`
            });
        }
    };

    searchDptOfUser(dptSelector) {
        if (!dptSelector.hasClass('activeDpt')) {
            this.recursiveUnFold(dptSelector);
        };
        let personsOfSelectedDpt = dptSelector.find('.personIcon');
        if (personsOfSelectedDpt.length == 1) {
            personsOfSelectedDpt.click();
        }
        else {
            $.each(personsOfSelectedDpt, (ind, el) => {
                if ($(el).attr('codusr') == this.forms.MantenimientoPerfiles.parametros.foundUser.value) {
                    $(el).click();
                }
            });
        }

        window.scroll(0, dptSelector.offset().top - 500);
    };

    searchDpt(evt) {
        let dptSelector = $(`#uo${evt.target.value}`);
        if (dptSelector.length > 0) {
            this.forms.MantenimientoPerfiles.set({
                dptName: dptSelector.attr('name')
            });
            if (!dptSelector.hasClass('activeDpt')) {
                this.recursiveUnFold(dptSelector, true);
            };
            dptSelector.dblclick();
            window.scroll(0, dptSelector.offset().top - 500);
        }
        else {
            toast({
                tipo: 'error', msg: `No existe un departamento con dicho código`
            });
        }

    };
};


