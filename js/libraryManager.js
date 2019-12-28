
function Semaphore(value) {
    var me = this;
    if (!value || value < 1) {
        value = 1;
    }

    me._value = value;
    me._queue = [];

    me.wait = function (callback) {
        if (me._value > 0) {
            me._value--;
            window.setTimeout(function () {
                callback();
                me.post();
            });
        } else {
            me._queue.push(callback);
        }
    };

    me.post = function () {
        me._value++;

        if (me._value > 0) {
            var callback = me._queue.shift();
            if (callback) {
                me.wait(callback);
            }
        }
    };
}

class LibraryManager {

    // Variables
    static root() {
        return 'librerias';
    };
    static repository() {
        return {
            // ENCRIPTA LA CONTRASEÑA
            'crypto-js-3.1.9-1': {
                core: [
                    'crypto-js.js',
                    'enc-utf8.js'
                ]
            },
            // PINTA EN MODELO TABLA
            'datatable-1.10.19': {
                core: [
                    'jquery.dataTables.min.js',
                    'dataTables.bootstrap4.min.js',
                    'dataTables.bootstrap4.min.css'
                ],
                select: [
                    'dataTables.select.min.js',
                    'select.bootstrap4.min.css'
                ],
                fixedHeader: [
                    'MY.dataTables.fixedHeader.min.js',
                    'fixedHeader.dataTables.min.css'
                ],
                buttons: [
                    'dataTables.buttons.min.js',
                    'buttons.dataTables.min.css'
                ],
                print: [
                    'buttons.html5.min.js',
                    'buttons.print.min.js'
                ],
                excel: [
                    'buttons.html5.min.js',
                    'jszip.min.js'
                ]
            },
            // DESCARGA ARCHIVOS EN TODOS LOS NAVEGADORES Y DISPOSITIVOS
            'filesaver-1.0.1': {
                core: [
                    'FileSaver.js'
                ]
            },
            // RECORTA IMAGENES EN PANTALLA
            'jcrop-0.9.15': {
                core: [
                    'jquery.Jcrop.min.js',
                    'jquery.Jcrop.min.css'
                ]
            },
            // MANIPULACION DE FECHAS
            'moment-2.24.0': {
                core: [
                    'moment.min.js'
                ]
            },
            // EDITOR DE TEXTO
            'nicedit-0.0.9': {
                core: [
                    'nicEdit.js'
                ]
            },
            // ANCLAJE DE ELEMENTOS AL HACER SCROLL
            'stickybits-3.6.1': {
                core: [
                    'stickybits.min.js'
                ]
            },
            // FULLCALENDAR LIBRARY 
            // Siempre que usemos fullcalendar tenemos que importar cómo mínimo el core, ya que este es el que
            // "ofrece" la variable FullCalendar para posteriormente ser instanciada y usada.
            'fullcalendar-4.3.1': {
                core: [
                    'core/main.css',
                    'core/main.js'
                ],
                daygrid: [
                    'plugins/daygrid/main.css',
                    'plugins/daygrid/main.js'
                ],
                list: [
                    'plugins/list/main.css',
                    'plugins/list/main.js'
                ]
            }
        }
    };
    static _dependencies() {
        return {
            'datatable-1.10.19': [
                { group: 'moment-2.24.0', id: 'core' },
                { group: 'stickybits-3.6.1', id: 'core' }
            ]
        };
    };

    // Public Methods
    static cleanOnLoadedlibraryEvents() {
        $(window).unbind('onloadedlibrary');
    }

    static isloaded(id) {
        return window.loadedjs && (window.loadedjs[id] === true || window.loadedjs[id] == 'tmp');
    }

    static load(group, pid, donefnc) {
        if (LibraryManager._dependencies()[group]) {
            let frecursive = [];
            frecursive.push(function () {
                LibraryManager._load(group, pid, donefnc);
            });
            $.each(LibraryManager._dependencies()[group].reverse(), function (i, v) {
                frecursive.push(function () {
                    LibraryManager._load(v.group, v.id, frecursive[i]);
                });
            })
            frecursive[frecursive.length - 1]();
        } else {
            LibraryManager._load(group, pid, donefnc);
        }
    }
    static _load(group, pid, donefnc) {
        let jslist = [], csslist = [], auxjslist = [];
        let idlist = typeof pid === 'string' ? [pid] : pid;
        for (let x = 0; x < idlist.length; x++) {
            let id = idlist[x];
            if (LibraryManager.repository()[group] && LibraryManager.repository()[group][id]) {
                let files = LibraryManager.repository()[group][id];
                for (let i = 0; i < files.length; i++) {
                    let file = files[i];
                    switch (LibraryManager._extension(file)) {
                        case 'js':
                            if (!LibraryManager.isloaded(file) && jslist.indexOf(file) == -1) {
                                jslist.push(file);
                                LibraryManager._setTmpLoaded(file);
                            }
                            if (auxjslist.indexOf(file) == -1) auxjslist.push(file);
                            break;
                        case 'css':
                            if (!LibraryManager.isloaded(file) && !csslist.indexOf(file) > -1) {
                                csslist.push(file);
                                LibraryManager._setTmpLoaded(file);
                            }
                            break;
                    }
                }
            }
        }

        if (jslist.length == 0) {
            let loaded2 = true;
            for (let b = 0; b < auxjslist.length && loaded2; b++) {
                if (window.loadedjs[auxjslist[b]] !== true) loaded2 = false;
            }
            if (loaded2) {
                donefnc();
            } else {
                $(window).bind('onloadedlibrary', function (event) {
                    let loaded = true;
                    for (let b = 0; b < auxjslist.length && loaded; b++) {
                        if (window.loadedjs[auxjslist[b]] !== true) loaded = false;
                    }
                    if (loaded) {
                        $(this).unbind(event);
                        donefnc();
                    }
                });
            }
        }
        let elements = [];
        let control = {
            indx: 0,
            chck: new Array(jslist.length),
            data: new Array(jslist.length),
            paths: new Array(jslist.length)
        };
        for (let io = 0; io < jslist.length; io++) {
            control.chck[io] = false;
            control.data[io] = false;
            control.paths[io] = '';
        }
        let semaphore = new Semaphore(1);
        $.each(jslist, function (i, v) {
            elements.push({
                path: v,
                ondone: function (data) {
                    semaphore.wait(function () {
                        control.chck[i] = true;
                        control.data[i] = { data: data };
                        control.paths[i] = v;
                        LibraryManager._recursive(control, donefnc);
                    });
                },
                onfail: function () {
                    semaphore.wait(function () {
                        control.chck[i] = 'error';
                        LibraryManager._removeTmpLoaded(jslist.slice(i, jslist.length));
                        toast({ tipo: 'error', msg: 'Linkage error: "' + group + '"."' + v + '"' });
                    });
                }
            });
        });
        LibraryManager._loadjs(elements, LibraryManager.root() + '/' + group + '/js');
        for (let i = 0; i < csslist.length; i++) {
            let css = csslist[i];
            LibraryManager._loadcss(LibraryManager.root() + '/' + group + '/css/' + css);
            this._setLoaded(css);
        }
    }
    static _recursive(c, donefnc) {
        if (c.indx < c.chck.length) {
            if (c.chck[c.indx] && c.chck[c.indx] != 'error') {
                window.eval(c.data[c.indx].data);
                this._setLoaded(c.paths[c.indx]);
                c.indx++;
                this._recursive(c, donefnc);
            }
        } else {
            donefnc();
        }
    }

    // Private Methods
    static _loadjs(elements, root) {
        let _arr = $.map(elements, function (elem) {
            return $.get(root + '/' + elem.path, function (data) {
                elem.ondone(data);
            },
                "text")
                .fail(function () {
                    elem.onfail();
                });
        });

        _arr.push($.Deferred(function (deferred) {
            $(deferred.resolve);
        }));

        return $.when.apply($, _arr);
    }
    static _loadcss(path) {
        $('<link>')
            .appendTo('head')
            .attr({
                type: 'text/css',
                rel: 'stylesheet',
                href: path
            });
    }
    static _setLoaded(pid) {
        let idlist = typeof pid === 'string' ? [pid] : pid;
        if (!window.loadedjs) window.loadedjs = {};
        for (let i = 0; i < idlist.length; i++) {
            let id = idlist[i];
            window.loadedjs[id] = true;
        }
        $(window).trigger('onloadedlibrary');
    }
    static _setTmpLoaded(pid) {
        let idlist = typeof pid === 'string' ? [pid] : pid;
        if (!window.loadedjs) window.loadedjs = {};
        for (let i = 0; i < idlist.length; i++) {
            let id = idlist[i];
            window.loadedjs[id] = 'tmp';
        }
    }
    static _removeTmpLoaded(pid) {
        let idlist = typeof pid === 'string' ? [pid] : pid;
        if (!window.loadedjs) window.loadedjs = {};
        for (let i = 0; i < idlist.length; i++) {
            let id = idlist[i];
            if (window.loadedjs[id] == 'tmp') window.loadedjs[id] = undefined;
        }
    }

    static _extension(file) {
        return /(?:\.([^.]+))?$/.exec(file)[1];
    }

    // Constructores
    constructor() { }

}