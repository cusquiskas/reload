var FichajeVirtual = class {
    constructor(modul, args) {
        this.modul = modul;
        this.forms = modul.Forms;
        this.args = args;
        this.setData();
        this.loadLastRecords();
        this.addEvents();
        setInterval(this.setData.bind(this), 5000); // Seteamos la hora dinámicamente en rangos de 5 segundos
    };

    setData() {
        this.forms.fichajeVirtual.set({ date: getCurrentDateInES(), time: getCurrentTime() + 'h' })
    };

    loadLastRecords() {
        /* 
            Para obtener los últimos registros haremos una petición pidiendo los registros desde la fecha actual
            a 5 días atrás 
         */
        var date = new Date();
        var currentMonth = pad(date.getMonth() + 1);
        var currentDay = pad(date.getDate());
        var currentYear = date.getFullYear();
        var fechad = `${currentDay - 5}/${currentMonth}/${currentYear}`;
        var fechah = `${currentDay}/${currentMonth}/${currentYear}`;
        this.forms.lastRecords.set({ fechad, fechah });
        this.forms.lastRecords.executeForm();
    };

    addEvents() {
        $('button[aria-label="checkIn"]').click(this.onBtnSaveClickHandler.bind(this));
    };

    onBtnSaveClickHandler() {
        /* 
            fecha en formato 'YYYYMMDDHH24MI'
            direc --> P1 para entrada  P2 para salida
            terminal --> '9999' para el que coge la fecha y hora del navegador y '8888' para que el empleado pone la fecha y hora
        */
        let date = new Date;
        let currentMonth = pad(date.getMonth() + 1);
        let currentDay = pad(date.getDate())
        let currentHour = pad(date.getHours())
        let currentMinutes = pad(date.getMinutes());
        let currentSeconds = pad(date.getSeconds());
        let dispDate = `${date.getFullYear()}${currentMonth}${currentDay}${currentHour}${currentMinutes}${currentSeconds}`;
        let formatedDate = `${date.getFullYear()}${currentMonth}${currentDay}${currentHour}${currentMinutes}`
        /*
            Esta operación la hacemos para obtener la diferencia en minutos que tiene el usuario con el UTC.
            Si es negativa quiere decir que estamos por delante, porqué el número que devuelve serían los minutos que tendríamos que restarle a nuestra hora para estar en la UTC,
            de lo contrario saldría en positivo, querría decir que tenemos que sumar X minutos para establecernos en el UTC 
        */
        this.forms.checkIn.set({
            fecha: formatedDate,
            dispFecha: dispDate,
            direc: 'P1',
            trmnl: '9999',
            tokenSession: this.args.tokenSession
        });
        this.forms.checkIn.executeForm();

    };

    onReceiveData(s, d, e) {
        if (s) {
            const data = d.root;
            const container = $('ul[name="lastRecords"]');
            const node = e.form.modul.return('modulos/presencia/modals/fichajeVirtual/fichajeVirtual.html?recordNode');
            let lastRecords = "1"
            for (let i = 0; i < data.length && i < 3; i++) {
                let date = data[i].fecha.split('/');
                let myDate = new Date(date[2], date[1] - 1, date[0]);
                data[i].horaI = padToTime(data[i].horaI) + 'h';
                data[i].horaF = padToTime(data[i].horaF) + 'h'
                data[i].fecha = getCurrentDateInES(myDate);
                lastRecords += node.reemplazaMostachos(data[i])
            };
            lastRecords = lastRecords.replace("1", "");
            container.append(lastRecords);
        };
    };

    onDataSaved(s, d, e) {
        if (s) {
            toast({ tipo: 'success', msg: d.txtmsg })
            $('button[aria-label="refreshData"]').click();
            $('.close').click();
        } else {
            validaErroresCbk(d,true);
        }
    };

};
