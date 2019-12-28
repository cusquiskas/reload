var InsertarFichaje = class {
    constructor(modul, args) {
        this.modul = modul;
        this.forms = modul.Forms;
        this.selectors = createJQerySelectors(this.forms.insertRecord);
        this.addEvents();
        this.isRadioBtnChecked = false;
        this.args = args;
    };

    addEvents() {
        $('button[aria-label="insertRecord"]').click(this.onBtnSaveClickHandler.bind(this));
        $('input[name="check"]').click(() => {
            this.isRadioBtnChecked = true;
        });
    };

    onBtnSaveClickHandler() {
        /* 
            fecha en formato 'YYYYMMDDHH24MI'
            direc --> P1 para entrada  P2 para salida
            terminal --> '9999' para el que coge la fecha y hora del navegador y '8888' para que el empleado pone la fecha y hora
        */
        if (this.checkIfNotEmptyInputs()) {
            let date = this.forms.insertRecord.parametros.date.value.hazFecha((esInternetExplorer() ? 'dd/mm/yyyy' : 'yyyy-mm-dd'), 'yyyymmdd');
            let time = this.forms.insertRecord.parametros.time.value;
            let fecha = date + time.replace(':', '');
            let current = new Date;
            let dateToInsert = new Date((esInternetExplorer() ? this.forms.insertRecord.parametros.date.value.hazFecha('dd/mm/yyyy', 'yyyy-mm-dd') : this.forms.insertRecord.parametros.date.value))
            let currentDate = new Date(current.formatea().hazFecha('dd/mm/yyyy', 'yyyy-mm-dd'))
            let direc = this.forms.insertRecord.parametros.check.value;
            if (this.checkDates(dateToInsert, currentDate)) { // Evitamos introducir fichajes para fechas anteriores a 3 días.
                this.forms.insertRecord.set({
                    fecha, direc,
                    dispFecha: this.getDispDate(),
                    trmnl: '8888',
                    tokenSession: this.args.tokenSession
                });
                this.forms.insertRecord.executeForm();
            };
        }
        else {
            toast({ tipo: 'error', msg: 'Debe rellenar todos los campos', donde: '.modal-header' })
        };
    };

    checkIfNotEmptyInputs() {
        let counter = 0;
        let form = this.forms.insertRecord;
        ['date', 'time'].forEach((inputName) => {
            if ((form.parametros[inputName].value !== '')
                && (inputName == 'date' && form.parametros[inputName].value.esFecha((esInternetExplorer() ? 'dd/mm/yyyy' : 'yyyy-mm-dd')))
                || (inputName == 'time' && form.parametros[inputName].value.esHora('hh:mm'))
            ) {
                counter++
            };
        }, this);
        return (counter === 2 && this.isRadioBtnChecked)
    };

    checkDates(dateToInsert, currentDate) {
        let msg = {
            afterDate: 'No puede insertar un fichaje a futuro',
            beforeDate: 'No puede insertar un fichaje anterior a 3 días'
        };
        let isCorrectly = true;
        let msgToShow = null;
        if (dateToInsert > currentDate || dateToInsert < currentDate.add(0, 0, -3)) {
            isCorrectly = false;
            msgToShow = dateToInsert > currentDate ? 'afterDate' : 'beforeDate';
            toast({ tipo: 'error', msg: msg[msgToShow], donde: '.modal-header' })
        };
        return isCorrectly;
    };

    getDispDate() {
        let date = new Date;
        let currentMonth = pad(date.getMonth() + 1);
        let currentDay = pad(date.getDate())
        let currentHour = pad(date.getHours())
        let currentMinutes = pad(date.getMinutes());
        let currentSeconds = pad(date.getSeconds());
        return `${date.getFullYear()}${currentMonth}${currentDay}${currentHour}${currentMinutes}${currentSeconds}`
    };

    onDataSaved(s, d, e) {
        if (s) {
            toast({ tipo: 'success', msg: d.txtmsg, donde: '.modal-header' })
            $('button[aria-label="refreshData"]').click();
            $('.close').click();
        } else {
            validaErroresCbk(d,true);
        }
    };

};