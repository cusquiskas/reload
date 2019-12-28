var ModalFoundedUserDpt = class {
    constructor(modul, args) {
        this.tabla = modul.Forms.showDpts.tablas[0];
        this.data = args;
    };

    renderDataTable(s,d,e) {
        const data = []
        e.form.tablas[0].script.data.selectedUsr.forEach(usr => {
            data.push({
                Código: usr.codemp.replace('.', ''),
                Nombre: usr.empresa.split('/')[ usr.empresa.split('/').length -1]
            })
        });
        const tabla = e.form.tablas[0];
        tabla.renderizar(data);
    };

    onSelectDpt(selectedDpt) {
        let dptSelector = $(`#uo${selectedDpt.Código}`);
        Moduls.app.child.templateAplicacion.getScript().searchDptOfUser(dptSelector);
        $('.close').click();
    };

    onDeselectDpt() {
        this.selectedUser = {}
    };

};


