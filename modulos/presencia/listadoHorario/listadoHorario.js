var ListadoHorario = class {
    constructor(modul, args) {
        this.forms = modul.Forms;
        this.modul = modul;
        this.dates = {
            isDatesLoaded: false,
            dateFrom: {
                day: null,
                month: null,
                year: null,
                date: null,
                dateFrom: null
            },
            dateTo: {
                day: null,
                month: null,
                year: null,
                date: null,
                dateTo: null
            },
        };
        this.loadData();
        this.addEvents();
        this.responsable = false;
    };

    // 14293 - 18.11.2019 - esta función es invocada por el padre, cuando nos quiere decir que conmutamos entre fichajes propios o del empleado
    toggleList(obj) {
        let select = $('.selectEmployee')[0];
        let form = dondeEstoy(select);
        if (obj.selectedProc == 'responsable') {
            this.responsable = true;
            $('.responableBar').removeClass('dn');
            $('.morfingRowBtn').removeClass('dn');
            rellenaSelect(select, obj.ArrayEmployee, false, {txt:'nomtra', val:'codtra'});
            $('.morfingRowDate').removeClass('col-md-6');
            $('.morfingRowDate').addClass('col-md-4');
        } else {
            this.responsable = false;
            $('.responableBar').addClass('dn');
            $('.morfingRowBtn').addClass('dn');
            rellenaSelect(select, [], false, {txt:'nombre', val:'codtra'});
            $('.morfingRowDate').removeClass('col-md-4');
            $('.morfingRowDate').addClass('col-md-6');
        }
        this.dates.isDatesLoaded = false;
        $('div[name="rowsOfCheckIn"]').empty();
        form.set({codusr:obj.ArrayEmployee[0].codtra, token:obj.tokenArmageddon});
        this.loadData();
    };

    loadData() {
        this.getDates();
        this.forms.fichajes.set({ fechad: this.dates.dateFrom.dateFrom, fechah: this.dates.dateTo.dateTo });
        this.forms.fichajes.executeForm();
    };

    getDates() {
        /* Date to */
        let dateTo = this.dates.isDatesLoaded ? this.dates.dateTo.date.add(0, 0, -21) : new Date; 
        this.dates.dateTo.date = dateTo;
        this.dates.dateTo.day = pad(dateTo.getDate());
        this.dates.dateTo.month = pad(dateTo.getMonth() + 1)
        this.dates.dateTo.year = dateTo.getFullYear();
        this.dates.dateTo.dateTo = `${this.dates.dateTo.day}/${this.dates.dateTo.month}/${this.dates.dateTo.year}`;
        /* --------------------------------------------------- */
        /* Date From */
        this.dates.dateFrom.date = dateTo.add(0, 0, -21); // Creamos la fecha desde, que la hacemos con la fecha hasta restándole 20 días, y posteriormente empezamos a trabajar con ella.
        this.dates.dateFrom.day = pad(this.dates.dateFrom.date.getDate());
        this.dates.dateFrom.month = pad(this.dates.dateFrom.date.getMonth() + 1);
        this.dates.dateFrom.year = this.dates.dateFrom.date.getFullYear();
        this.dates.dateFrom.dateFrom = `${this.dates.dateFrom.day}/${this.dates.dateFrom.month}/${this.dates.dateFrom.year}`;
        /* --------------------------------------------------- */
        this.dates.isDatesLoaded = true;
    };

    addEvents() {
        $('button[aria-label="refreshData"]').click(() => {
            $('div[name="rowsOfCheckIn"]').empty();
            this.dates.isDatesLoaded = false;
            this.loadData();
        });
        $('button[aria-label="SeeMore"]').click(this.loadData.bind(this));
        $('.selectEmployee').click(() => {
            $('div[name="rowsOfCheckIn"]').empty();
            this.dates.isDatesLoaded = false;
            this.loadData();
        });
    };

    onDataLoad(s, d, e) {
        if (s) {
            const dates = d.root;
            const that = e.form.modul.getScript();
            let cadena = that.tableRow();
            let tableRows;
            for (var i = 0; i < dates.length; i++) {
                let day = dates[i];
                let date = day.fecha.split('/');
                let myDate = new Date(date[2], date[1] - 1, date[0]);
                day.date = getCurrentDateInES(myDate);
                day.horaI = that.formatTime(day.horaI);
                day.horaF = that.formatTime(day.horaF) + ' ' ;
                day.alertI == 'TRUE' ? day.classHoraI = 'alertFichaje' : day.displayGraphiconI = 'dn'; 
                day.alertF == 'TRUE'? day.classHoraF = 'alertFichaje' : day.displayGraphiconF = 'dn'; 
                tableRows += cadena.reemplazaMostachos(day);
            };
            if (tableRows) { // Hacemos esta condición a fin de no conducir a error, por si el usuario no tiene registros evitar que la aplicación falle
                tableRows = tableRows.replace('undefined', '');
            };
            $('div[name="rowsOfCheckIn"]').append(tableRows);
            if (that.responsable === true) {
                $('.morfingRowBtn').removeClass('dn');
                $('.morfingRowDate').removeClass('col-md-6');
                $('.morfingRowDate').addClass('col-md-4');
                $('.holaSoyUnBotón-pinchame').off('click'); 
                $('.holaSoyUnBotón-pinchame').on('click', (evt) => { 
                    Moduls.app.child.modal.child.modalBody.load({ 
                        url: 'modulos/presencia/modals/listaPresencia/modalPresencia.html', 
                        script: true,
                        args:{
                            p_codusr:evt.target.getAttribute('p_codusr'),
                            p_fecha: evt.target.getAttribute('p_fecha'),
                            p_token: sessionStorage.getItem("tokenArmageddon")
                        }
                    });
                    construirModal({
                        title: 'Detalles de los Fichajes',
                        w: '900px',
                        oktext: "Aceptar"
                    });
                 });
            }
        } else {
            validaErroresCbk(d);        
        }
    };

    formatTime(time) {
        let splitTime = time.split(':');
        return pad(splitTime[0]) + ':' + splitTime[1] + 'h';
    };

    tableRow() {
        return (
            '<div name="record" class="row">' +
                '<div class="col-md-6 col-12 morfingRowDate">{{date}}</div>' +
                '<div class="col-md-3 col-12 d-flex justify-content-center align-center {{classHoraI}}">' + 
                    '<i title="Notificación de incidencia fichaje notificada por el trabajador" class="material-icons {{displayGraphiconI}}">info</i>' +
                    '&nbsp;{{horaI}}' +
                '</div>' +
                '<div class="col-md-3 col-12 d-flex justify-content-center align-center  {{classHoraF}}">' +
                    '<i title="Notificación de incidencia fichaje notificada por el trabajador" class="material-icons {{displayGraphiconF}}">info</i>'+
                    '&nbsp;{{horaF}}' +
                '</div>' +
                '<div class="col-md-2 col-12 d-flex justify-content-center align-center dn morfingRowBtn">' +
                    '<button class="holaSoyUnBotón-pinchame" p_codusr="{{codusr}}" p_fecha="{{fecha}}" type="button">Ver</button>' +
                '</div>' +
            '</div>'
        );
    };
};