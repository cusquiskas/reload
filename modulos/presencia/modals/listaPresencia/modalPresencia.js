
var ModalPresencia = class {

    // Funciones de inicialización
    constructor(mod, extra) {
        let form = mod.getForm('frmModalPresencia')
        form.set(extra);
        form.executeForm();
    }

    // Funciones de callback
    cbkModalPresencia(s, d, e) {
        if(!s) validaErroresCbk(d);
    }
}