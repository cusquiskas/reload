/*
Documentación
-------------
table.class:      define los estilos de la tabla, los usados por defecto son 'table table-style-01', se puede añadir en un futuro clases del tipo 'table-style-xx'
table.type:       una tabla solo se considerará una datatable si tiene este atributo 'type="datatable"'
table.select:   el nombre de la función a la que se llamará cuando se seleccione una fila, la función recibe un parametro que son los datos seleccionados
table.source:     la ruta, separada por puntos, des de el dato que devuelve el formulario hasta la lista contenida en dicha respuesta 'source="root.perfil"'
table.language:   lenguage de los textos de la tabla, por defecto es 'ES', si no se especifica este atributo
table.pagination: valdrá true/false, si vale true se habilita la paginación, sino la tabla no utilizará paginación

th.type:          si vale 'funcition' renderizará el valor mediante una función que recibe por parámetro los datos del registro, si vale 'date' si tratará como un campo de fecha y se tendrán en cuenta los atributos inmask/outmask, sino se tratará el valor como un string
th.data:          en el caso no tener type o ser type 'date' será en nombre del tributo del registro de datos, en el caso de ser tipo 'function' será el nombre de la función que renderizará los datos
th.inmask:        la mascara con la que se interpretará el valor del atributo de entrada
th.outmask:       la mascara que especifica como se mostrará el campo en la tabla

button.class:     clase con los estilos del botón, cambian la apariencia
button.alpulsar:  nombre de la función que se ejecutará al pulsar el botón, si vale excel/print realizará las funciones de exportar la tabla en formato excel o imprimirla
button.title:     en el caso de ser 'alpulsar="excel"' será el nombre del fichero descargado, en caso de ser 'alpulsar="print"' será el nombre del titulo añadido en el fichero impreso


A tener en cuenta
-----------------

LA PRIMERA CLASE DE LA TABLA SERÁ SU IDENTIFICADOR UNEQUIVOCO Y DEBE SER ÚNICO

La tabla se pintará al submitarse e fomulario en el que este contenida.
El div con el 'for="datatable"' tiene que compartir padre con el datatable y
no haber más de uno por datatable. Esto significa que diferentes datatables
deben estan en diferentes contenedores con su respectivo div 'for="datatable"'
que contendrá los botones de sendas tablas.


Ejemplo de uso
--------------

<div class="datatable">
    <table
        class="tblGestionPerfil table table-style-01"
        type="datatable"
        select="selectedRow"
        source="root.perfil"
        language="ES"
        pagination="false">
    
        <thead>
            <tr>
                <th data="codpfl" width="20%">Código</th>
                <th data="nombre" width="70%">Nombre</th>
                <th data="activo" width="10%">Activo</th>
                <th data="getNombre" type="function">Nombre</th>
				<th data="telper" type="date" inmask="YYYY.DD.MM" outmask="DD/MM/YYYY">Fecha Nacimiento</th>
            </tr>
        </thead>
    </table>
    <div for="datatable">
        <button class="btn btn-outline-indigo" alpulsar="clickNuevo">Nuevo</button>
        <button class="btn btn-outline-indigo" alpulsar="clickModificar">Modificar</button>
        <button class="btn btn-outline-danger" alpulsar="clickBorrar">Borrar</button>
        <button class="btn btn-outline-cyan" alpulsar="clickDetalle">Detalles</button>
        <button class="btn btn-outline-info" alpulsar="clickAsignacionEmpleado">Asignación de empleado</button>
		<button class="btn btn-outline-indigo" alpulsar="excel" title="ejemplo">Genera Excel</button>
		<button class="btn btn-outline-indigo" alpulsar="print" title="Impreso">Imprimir</button>
    </div>
</div>

*/

class DataTable {

    static cleanFixedHeaders() {
        let handlers = jQuery._data(window, 'events').scroll;
        if (handlers) {
            for (let i = 0; i < handlers.length; i++) {
                let namespace = handlers[i].namespace.substring(4);
                if (namespace && !$('.' + namespace).not('.fixedHeader-floating').length) {
                    $(window).unbind('.dtfc' + namespace);
                    $('.' + namespace).remove();
                }
            }
        }
    }

    configure(form) {
        let me = this;
        let table = $(me.table);
        me.script = (this.modul.getScript && typeof this.modul.getScript == 'function') ? this.modul.getScript() : window;

        me.buttonCommon = {
            exportOptions: {
                format: {
                    body: function (data, row, column, node) {
                        let d = data;
                        let index = data.indexOf('<span style="display: none;">');
                        if (index != -1) d = d.substring(d.indexOf('</span>') + 7, d.length);
                        return d.replace(/<span>/g, '').replace(/<\/span>/g, '');
                    }
                },
                modifier: {
                    order: 'current',
                    page: 'all',
                    selected: 'all',
                }
            }
        };

        me.columns = [];
        table.find('thead tr th').each(function () {
            let config = $(this);
            if (config.attr('type') == 'function') {
                me.columns.push({
                    data: null,
                    width: config.attr('width'),
                    render: function (data, type, dataToSet) { return me.script[config.attr('data')](data); }
                });
            } else {
                me.columns.push({
                    data: config.attr('data'),
                    width: config.attr('width'),
                    render: function (data) {
                        return me.enmascararValorColumnas(
                            {
                                type: config.attr('type'),
                                inmask: config.attr('inmask'),
                                outmask: config.attr('outmask')
                            },
                            data
                        );
                    }
                });
            }
        });

        me.buttons = [];
        table.parent().find('div[for=datatable] button').each(function () {
            switch ($(this).attr('alpulsar')) {
                case 'excel':
                    me.buttons.push({
                        text: $(this).html(),
                        extend: 'excel',
                        className: $(this).attr('class'),
                        filename: $(this).attr('title'),
                        enabled: $(this).attr('disabled') != 'disabled',
                        exportOptions: me.buttonCommon.exportOptions
                    });
                    me.hasexcelbutton = true;
                    break;
                case 'print':
                    me.buttons.push({
                        text: $(this).html(),
                        extend: 'print',
                        className: $(this).attr('class'),
                        title: $(this).attr('title'),
                        enabled: $(this).attr('disabled') != 'disabled',
                        exportOptions: me.buttonCommon.exportOptions
                    });
                    me.hasprintbutton = true;
                    break;
                default:
                    me.buttons.push({
                        text: $(this).html(),
                        className: $(this).attr('class'),
                        action: me.script[$(this).attr('alpulsar')],
                        enabled: $(this).attr('disabled') != 'disabled'
                    });
                    break;
            }
        });
        table.parent().children('div[for=datatable]').hide();
        let textos = table.attr('textos') ? me.script[table.attr('textos')]() : {};
        let language = {};
        switch (table.attr('language')) {
            case 'ES':
            default:
                language = {
                    "sProcessing": "Procesando...",
                    "sLengthMenu": "Mostrar _MENU_ registros",
                    "sZeroRecords": "No se encontraron resultados",
                    "sEmptyTable": "Ningún dato disponible en esta tabla",
                    "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                    "sInfoEmpty": "Mostrando registros dsel 0 al 0 de un total de 0 registros",
                    "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                    "sInfoPostFix": "",
                    "sSearch": "B&uacute;scar:",
                    "sUrl": "",
                    "sInfoThousands": ",",
                    "sLoadingRecords": "Cargando...",
                    "oPaginate": {
                        "sFirst": "Primero",
                        "sLast": "&Uacute;ltimo",
                        "sNext": "Siguiente",
                        "sPrevious": "Anterior"
                    },
                    "oAria": {
                        "sSortAscending": ": Actilet para ordenar la columna de manera ascendente",
                        "sSortDescending": ": Actilet para ordenar la columna de manera descendente"
                    },
                    "select": {
                        "rows": "%d filas seleccionadas"
                    }
                };
                break;
        }
        jQuery.extend(language, textos);
        this.language = language;
    }

    enmascararValorColumnas(metainf, data) {
        if (!data) return '';
        switch (metainf.type) {
            case 'date':
                let inmask = metainf.inmask || 'DD/MM/YYYY';
                let outmask = metainf.outmask || 'DD/MM/YYYY';
                let date = moment(data, inmask);
                return '<span style="display: none;">' + date.format('YYYYMMDDHHmmss') + '</span>' + date.format(outmask);
            case 'time':
                let time = data.replace(/:/g, '').padStart(15, '0');
                return '<span style="display: none;">' + time + '</span>' + $.parseHTML('<span>' + data + '</span>')[0].outerHTML;
            default:
                return $.parseHTML('<span>' + data + '</span>')[0].outerHTML;
        }
    }

    renderizar(data) {
        let me = this;
        let ids = ['core'];
        if ($(this.table).attr('select') != 'false') ids.push('select');
        if ($(this.table).attr('header') != 'false') ids.push('fixedHeader');
        if (this.buttons.length > 0) ids.push('buttons');
        if (this.hasprintbutton) ids.push('print');
        if (this.hasexcelbutton) ids.push('excel');
        LibraryManager.load('datatable-1.10.19', ids,
            function () {
                me._renderizar(data);
            }
        );
    }

    _renderizar(data) {
        let me = this;
        let table = $(me.table);
        let datos = data;
        let source = table.attr('source')
        if ((typeof datos) == 'string') {
            try {
                datos = JSON.parse(datos);
            } catch (e) {
                return false;
            }
        }

        if (source) {
            source = source.split('.');
            for (let i = 0; i < source.length; i++) {
                if (!datos || !((typeof datos == 'object' && datos.constructor === Object) && !Array.isArray(datos))) {
                    datos = [];
                    break;
                }
                datos = datos[source[i]];
            }
        }
        datos = table.attr('postprocess') ? me.script[table.attr('postprocess')](datos) : datos;

        let header = $(this.table).attr('header') == 'false' ? false : true;

        let columns = null;
        let cols = null;
        if (table.attr('columns')) {
            columns = [];
            cols = me.script[table.attr('columns')](datos);
            for (let i = 0; i < cols.length; i++) {
                let c = cols[i];
                if (c.type == 'function') {
                    columns.push({
                        data: null,
                        width: c.width,
                        render: function (data, type, dataToSet) { return me.script[c.data](data); }
                    });
                } else {
                    columns.push({
                        data: c.data,
                        width: c.width,
                        render: function (data) { return me.enmascararValorColumnas(c, data); }
                    });
                }
            };
        }
        
        this.datos = !datos ? [] : !Array.isArray(datos) ? [datos] : datos;
        
        if($.fn.dataTable.isDataTable(table)) {
            table.dataTable().fnClearTable();
            table.dataTable().fnDestroy();
        }
        if (cols) table.find('thead').html(this.generateHeader(cols));

        let tbl = table.DataTable({
            data: this.datos,
            columns: columns ? columns : this.columns,
            select: $(this.table).attr('select') == 'false' ? false : true,
            info: false,
            bPaginate: ($(this.table).attr('pagination') == 'true' || !isNaN($(this.table).attr('pagination'))) ? true : false,
            pageLength: !isNaN($(this.table).attr('pagination')) ? Number($(this.table).attr('pagination')) : 10,
            fixedHeader: { header: header, footer: header },
            dom: $(this.table).attr('headtemplate') ? $(this.table).attr('headtemplate') : '<"dom_wrapper fh-fixedHeader"Br>tip',
            buttons: this.buttons,
            initComplete: function (settings, json) {
                $('.dt-button').removeClass('dt-button');
                if(header) {
                    $(window).on('replegarmenu', function() {
                        settings.oInstance.api().fixedHeader.adjust();
                    });
                    $(window).on('desplegarmenu', function() {
                        settings.oInstance.api().fixedHeader.adjust();
                    });
                }
            },
            language: this.language,
            // destroy: true,
            autoWidth: false,
            createdRow: function (row, data, dataIndex) {
                if (table.attr('rowstyle')) me.script[table.attr('rowstyle')](row, data, dataIndex);
            },
            aaSorting: []
        });
        stickybits('.dom_wrapper');

        me.lastselectedrow = null;
        if(!me.initevents && table.attr('select')) {
            tbl.on('select', function (e, dt, type, indexes) {
                let lastselectedrow = me.lastselectedrow;
                let row = dt.row({ selected: true });
                me.lastselectedrow = row;
                let data = row.data();
                me.script[table.attr('select')](data, row, lastselectedrow);
            });
        }
        if(!me.initevents && table.attr('deselect')) {
            tbl.on('deselect', function (e, dt, type, indexes) {
                me.script[table.attr('deselect')](me.lastselectedrow.data(), me.lastselectedrow);
            });
        }
        me.initevents = true;
    }

    destruir() {
        $(this.table).DataTable({ destroy: true });
    }

    constructor(table, form) {
        this.table = table;
        this.modul = form.modul;
        this.script = null; //(form.modul.getScript && form.modul.getScript()) ? form.modul.getScript() : window;
        //this.configure();
    }

    // Auxiliar funcions
    generateHeader(cols) {
        let r = '';
        for (let i = 0; i < cols.length; i++) r += '<th width="' + cols[i].width + '">' + cols[i].title + '</th>';
        return '<tr>' + r + '</tr>';
    }
}