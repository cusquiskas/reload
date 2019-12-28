var Calendar = class {
    constructor(modul) {
        this.modul = modul;
        this.calendar = null;
        this.forms = modul.Forms;
        this.selectors = {
            calendarContainer: $('div[name="calendar"]'),
            nextMonth: $('button[aria-label="next"]'),
            prevMonth: $('button[aria-label="prev"]')
        };
        this.models = {
            fichaje: {
                backgroundColor: '#0061ae',
                borderColor: 'black',
                textColor: 'white'
            },
            festivo: {
                backgroundColor: '#dc3545',
                borderColor: 'black',
                textColor: 'white'
            },
            ausencias: {
                backgroundColor: '#ec8e00',
                borderColor: 'black',
                textColor: 'white'
            },
            hTotales: {
                backgroundColor: '#68aeea',
                borderColor: 'black',
                textColor: 'black'
            },
            vacaciones: {
                backgroundColor: '#00ae3e',
                borderColor: 'black',
                textColor: 'white'
            }
        };
        this.calendarData = [];
        this.dataControl = {festivos:[], ausencias:[]};
        LibraryManager.load('fullcalendar-4.3.1', ['core', 'daygrid', 'list'], this.onCalendarLoad.bind(this));
    };

    // 14293 - 18.11.2019 - esta función es invocada por el padre, cuando nos quiere decir que conmutamos entre fichajes propios o del empleado
    toggleList(obj) {
        // 14293 - 02.12.2019 - De momento el modo listado es una demo y no está preparada para responsables
        // let select = $('.selectEmployee')[0];
        // let form = dondeEstoy(select);
        // if (obj.selectedProc == 'responsable') {
        //     $('.responableBar').removeClass('dn');
        //     rellenaSelect(select, obj.ArrayEmployee, false, {txt:'nombre', val:'codtra'});
        // } else {
        //     $('.responableBar').addClass('dn');
        //     rellenaSelect(select, [], false, {txt:'nombre', val:'codtra'});
        // }
        // form.executeForm();
    };

    onCalendarLoad() {
        let calendarContainerNode = this.selectors.calendarContainer[0];
        var calendar = new FullCalendar.Calendar(calendarContainerNode, {
            plugins: ['interaction', 'dayGrid', 'timeGrid', 'list'],
            header: {
                left: 'prev,next',
                center: 'title',
                right: 'dayGridMonth,timeGridMonth,timeGridDay,listMonth'
            },
            themeSystem: 'bootstrap',
            buttonText: {
                month: 'mes',
                list: 'listado'
            },
            firstDay: 1,
            locale: 'es',
            events: []
        });
        this.calendar = calendar;
        this.requestData();
        calendar.render();
        this.addEvents();
    };

    addEvents() {
        $('button[aria-label="next"], button[aria-label="prev"]').click(this.requestData.bind(this));
        $('button[aria-label="refreshData"]').click(this.onRefreshCalendar.bind(this));
    };

    onRefreshCalendar() {
        this.calendar.removeAllEvents();
        this.requestData();
    }

    requestData() {
        const { fechad, fechah, currentYearOnCalendar } = this.getDates();
        this.forms.fichajes.set({ fechad, fechah });
        this.forms.fichajes.executeForm();
        if (this.dataControl.festivos.inArray(currentYearOnCalendar) < 0){
            this.forms.festivos.formulario.action = this.forms.festivos.formulario.action.replace("%7BCodigoTrabajador%7D", Moduls.getHeader().user.codusr);
            this.forms.festivos.formulario.action = this.forms.festivos.formulario.action.replace("%7Banyo%7D", currentYearOnCalendar);
            this.forms.festivos.authorization = {type:'NoAuth', key:sessionStorage.getItem("tokenArmageddon")};
            this.forms.festivos.executeForm();
            this.forms.festivos.formulario.action = this.forms.festivos.formulario.action.replace(currentYearOnCalendar, "%7Banyo%7D");
        }
        if (this.dataControl.ausencias.inArray(currentYearOnCalendar) < 0){
            this.forms.ausencias.formulario.action = this.forms.ausencias.formulario.action.replace("%7BCodigoTrabajador%7D", Moduls.getHeader().user.codusr);
            this.forms.ausencias.formulario.action = this.forms.ausencias.formulario.action.replace("%7Banyo%7D", currentYearOnCalendar);
            this.forms.ausencias.authorization = {type:'NoAuth', key:sessionStorage.getItem("tokenArmageddon")};
            this.forms.ausencias.executeForm();
            this.forms.ausencias.formulario.action = this.forms.ausencias.formulario.action.replace(currentYearOnCalendar, "%7Banyo%7D");
        }
    };

    getDates() {
        let currentMonthOnCalendar = this.calendar.getDate().getMonth() + 1;
        let currentYearOnCalendar = this.calendar.getDate().getFullYear();
        /* 
            DATE FROM
        */
        let dateFrom = new Date(currentYearOnCalendar, currentMonthOnCalendar - 1, 1).add(0, 0, -7);
        let dateFromMonth = pad(dateFrom.getMonth() + 1);
        let dayFrom = pad(dateFrom.getDate());
        currentMonthOnCalendar = currentMonthOnCalendar.length === 1 ? '0' + currentMonthOnCalendar : currentMonthOnCalendar;
        let fechad = `${dayFrom}/${dateFromMonth}/${currentYearOnCalendar}`;
        /*
            DATE TO
        */
        let numberDaysOfMonth = new Date(currentYearOnCalendar, currentMonthOnCalendar, 0).getDate();
        let fechah = `${numberDaysOfMonth}/${currentMonthOnCalendar}/${currentYearOnCalendar}`;
        return { fechad, fechah, currentYearOnCalendar };
    };

    loadData(success, data, e) {
        // Aquí realizaremos la petición a BD y posteriormente setearemos los eventos en el constructor
        // la estructura que le debemos pasar al calendario para añadir un evento 
        //     {
        //         model: 'fichaje', --> este modelo puede ser cualquiera que esté presente en el constructor básicamente es para los estilos
        //         title: 'PROBANDO',
        //         start: '2019-10-31T16:30:00',
        //         allDay: false 
        //     }
        if (success) {
            const that = e.form.modul.getScript();
            const formatedEvents = [];
            if (e.form.formulario.name == 'fichajes') {    
                data.root.forEach((event) => {
                    formatedEvents.push({
                        model: 'hTotales',
                        title: `Horas Totales: ${padToTime(event.horaT)}`,
                        start: that.formatDate(event.fecha, event.horaT),
                        allDay: true
                    });
                    formatedEvents.push({
                        model: 'fichaje',
                        title: `Primero`,
                        start: that.formatDate(event.fecha, event.horaI),
                        allDay: false
                    });
                    formatedEvents.push({
                        model: 'fichaje',
                        title: `Último`,
                        start: that.formatDate(event.fecha, event.horaF),
                        allDay: false
                    });
                }, that);
            } else if (e.form.formulario.name == 'festivos') {
                try { if (typeof(data)=='string') data = JSON.parse(data); } catch (err) { return false; }
                data.festivos.forEach((event) => {
                    formatedEvents.push({
                        model: 'festivo',
                        title: `${event.festivo}`,
                        start: that.formatDate(event.fecha, '00:00'),
                        allDay: true
                    });
                }, that);
                data.diasnoselec.forEach((event) => {
                    formatedEvents.push({
                        model: 'festivo',
                        title: `Día Empresa`,
                        start: that.formatDate(event, '00:00'),
                        allDay: true
                    });
                }, that);
            } else if (e.form.formulario.name == 'ausencias') {
                try { if (typeof(data)=='string') data = JSON.parse(data); } catch (err) { return false; }
                data.rowset.forEach((event) => {
                    // 14293 - 4.12.2019 - la librería dice que la fecha hasta en eventos de "allDay" es excluyente, así que le sumamos siempre un día.
                    let newFechst = event.fechst.hazObjFecha('dd/mm/yy');
                    newFechst = new Date(newFechst.y, newFechst.m-1, newFechst.d);
                    newFechst = newFechst.add(0,0,1);
                    event.fechst = newFechst.formatea('dd/mm/yyyy');
                    formatedEvents.push({
                        model: (event.tipoAusencia=='VAC'?'vacaciones':'ausencias'),
                        title: `${event.subtipo}`,
                        start: that.formatDate(event.fecdsd.hazFecha('dd/mm/yy','dd/mm/yyyy'), '00:00'),
                        end:   that.formatDate(event.fechst, '00:00'),
                        allDay: true
                    });
                });
            }
            data = that.addModelToData(formatedEvents);
            that.calendar.addUniqEvents(data);
            that.calendarData = data;
        }
        else {
            if (e.xxhttpresponsecodexx !== 401) validaErroresCbk(data);
        }
    };

    formatDate(date, time) {
        let formatedDate = date.hazFecha('dd/mm/yyyy', 'yyyy-mm-dd');
        let formatedTime = time.length <= 4 ? '0' + time + ':00' : time + ':00';
        return `${formatedDate}T${formatedTime}`;
    };

    addModelToData(data) {
        /*
            
             Añadimos los estilos dinámicamente, ya que cada día debe tener sus propios estilos, y 
             los festivos tienen estilos diferentes a los fichajes.
    
        */
        return data.map((dayData) => {
            return $.extend(dayData, this.models[dayData.model])
        }, this);
    };
};