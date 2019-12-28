var MantenimientoPerfilesModal = class {
    constructor(modul, args) {
        this.data = args;
        this.selectedUser = {}
        $('body').css('overflow', 'hidden');
        $('.close').on('click', () => {
            $('body').css('overflow', 'auto');
        });
    };

    renderDataTable(s, d, e) {
        const tabla = e.form.tablas[0];
        const data = [];
        let usersOfCurrentDpt = [];
        if (tabla.script.data.selectedDpt === "Globalia Corporación") {
            usersOfCurrentDpt = tabla.script.data.users.filter((user) => {
                return user.empresa === "Todas las Unidades Organizativas"
            });
        }
        else {
            usersOfCurrentDpt = tabla.script.data.users.filter((user) => {
                return user.codemp.split('.')[1] === tabla.script.data.selectedDptId 
            });
        }
        usersOfCurrentDpt.forEach((user) => {
            data.push({ 'Nombre': user.nomusr, Código: user.codusr })
        });
        tabla.renderizar(data);
    };

    removeUser(evt) {
        const modul = dondeEstoy(evt.target).modul;
        const thisClass = modul.script;
        const { codapl, codPerf } = thisClass.data;
        let { Código } = thisClass.selectedUser;
        let companyCode = '.' + thisClass.data.selectedDptId;
        modul.Forms.borrar_perfil.set({
            p_aplicacion: codapl,
            p_perfil: codPerf,
            p_usuario: Código,
            p_empresa: companyCode
        });
        modul.Forms.borrar_perfil.executeForm();
    };

    onSelectUser(user) {
        this.selectedUser = user;
    };

    onDeselectionUser() {
        this.selectedUser = {}
    };

    deleteHandler(s, d, e) {
        $('body').css('overflow', 'auto');
        if (s) {
            e.form.modul.script.data.fc();
            toast({ tipo: 'success', msg: d.txtmsg });
        }
        else {
            validaErroresCbk(d, true);
        }
    };

};


