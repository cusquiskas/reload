$('.buscadorPluriEmpleado').ajaxSuccess(function () {
    if (this.options.length > 0) $('form[name=listadoNominas]').removeClass('dn');
    if (Moduls.app.Forms.listadoNominas != undefined) {
        Moduls.app.Forms.listadoNominas.set({ p_pernr: this.value });
        Moduls.app.Forms.listadoNominas.executeForm();
    } else {
        Moduls.app.child.templateAplicacion.Forms.listadoNominas.set({ p_pernr: this.value });
        Moduls.app.child.templateAplicacion.Forms.listadoNominas.executeForm();
    }
});

$('.buscadorPluriEmpleado').change(function (a, b, c, d) {
    let dondeEstoy = (Moduls.app.Forms.listadoNominas != undefined) ? Moduls.app.Forms : Moduls.app.child.templateAplicacion.Forms;
    if (dondeEstoy.listadoNominas.parametros.p_pernr.value != this.value) {
        dondeEstoy.listadoNominas.set({ p_pernr: this.value });
        dondeEstoy.listadoNominas.executeForm();
    }
});

function listadoNominas(s, d, e) {
   if(!s) toast({ tipo: 'error', msg: resuelveError(d) });
}

function getPDF(obj, i, e) {
    return "<div class='imgPdf' objeto='" + JSON.stringify(obj) + "' onclick='descargarPDF(this)'></div>";
}
function descargarPDF(div) {
    let obj = JSON.parse($(div).attr('objeto'));
    let objeto = {};
    for (let chd in obj) {
        objeto['p_' + chd.toLowerCase()] = obj[chd];
    }
    dondeEstoy($('form[name=descargaNomina]')[0]).set(objeto);
    dondeEstoy($('form[name=descargaNomina]')[0]).executeForm();
}

function descargaNomina(s, d, e) {
    LibraryManager.load('filesaver-1.0.1', 'core', function () { });
    if (s) getFile(d.file.origen, d.file.nombre, false);
    else muestraError({ tit: 'Consulta de nóminas', tipo: 'error', msg: resuelveError(d) });
}

function getColumns() {
    let cols = [];
    if ($(document).width() > 425) {
        cols = cols.concat([
            {data: "Pernr",         width: "20%", title: "Número Empleado"},
            {data: "Butxt",         width: "30%", title: "Sociedad"},
            {data: "Gjahr",         width: "20%", title: "Ejercicio"},
            {data: "getPeriodo425", width: "20%", title: "Periodo",  type: "function"},
            {data: "getPDF",        width: "10%", title: "Recibo",   type: "function"}
        ]);
    } else {
        cols = cols.concat([
            {data: "Butxt",       width: "50%", title: "Sociedad"},
            {data: "getPeriodo",  width: "30%", title: "Periodo",  type: "function"},
            {data: "getPDF",      width: "20%", title: "Recibo",   type: "function"}
        ]);
    }
    return cols;
}
function getPeriodo425(obj) {
    return mes(obj.Periodo);
}
function getPeriodo(obj) {
    return mes(obj.Periodo) + " " + obj.Gjahr;
}

function mes(mes, area) {
    var map;
    if (area == "DO") {
        var mm = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "99"];
        var month = ["Enero-1", "Enero-2", "Febrero-1", "Febrero-2", "Marzo-1", "Marzo-2", "Abril-1", "Abril-2", "Mayo-1", "Mayo-2", "Junio-1", "Junio-2", "Julio-1", "Julio-2", "Agosto-1", "Agosto-2", "Septiembre-1", "Septiembre-2", "Octubre-1", "Octubre-2", "Noviembre-1", "Noviembre-2", "Diciembre-1", "Diciembre-2", "IRPF"];
    } else {
        var mm = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "99", "88"];
        var month = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre", "IRPF", "Atrasos"];
    }
    map = mapFromArrays(mm, month);
    return map[mes];
}

function mapFromArrays(keys, values) {
    var map = {};
    for (i = 0; i < keys.length; i++) {
        map[keys[i]] = values[i];
    }
    return map;
}