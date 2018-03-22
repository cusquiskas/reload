class peticionAjax {
    respuesta () {
        let http = this.asincrono ? this : this.xmlhttp;
        if (http.readyState == 4) {
            if (http.responseType != "arraybuffer") {
                if (http.responseText == "" || http.responseText == null) {
                    try {
                        this.retorno(false, {"errmsg":"La llamada no ha devuelto datos"}, this.extra);
                    } catch (e) {}
                    return; //Ha llegado una cadena vacía del servidor, abortamos el resto de comprobaciones y devolvemos la situación
                }
            }
            let resultado = {};
            try {
                resultado = typeof JSON != "undefined" ? JSON.parse(http.responseText) : eval("(function(){return " + http.responseText + ";})()");
            } catch (e) {
                resultado.response = http.responseText;
                resultado.success  = false;
                resultado.errmsg   = 'Se esperaba un objeto JSON';
            }
            if (typeof this.retorno == "function") this.retorno((http.status == 200 && resultado.success), resultado, this.extra);
        }
    }
    
    pide() {
        let cad = "";
        if (this.asincrono) this.xmlhttp.onreadystatechange = this.respuesta;
        for (let chd in this.parametros) cad += "&" + chd + "=" + escape(String(this.parametros[chd]));
        cad = cad.substr(1);
        if (this.metodo == "POST") {
            this.xmlhttp.open(this.metodo, this.direccion, this.asincrono);
            if (this.contentType == "application/json") {
                this.xmlhttp.setRequestHeader("Content-type", "application/json;" + this.caracteres);
                this.xmlhttp.send(JSON.stringify(this.parametros));
            } else {
                this.xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded;" + this.caracteres);
                this.xmlhttp.send(cad);
            }
        } else if (this.metodo == "DELETE") {
            this.xmlhttp.open(this.metodo, this.direccion, this.asincrono);
            this.xmlhttp.setRequestHeader("Content-type", "application/json");
            this.xmlhttp.send(JSON.stringify(this.parametros));
        } else {
            this.xmlhttp.open("GET", this.direccion + (this.direccion.indexOf("?") < 0 ? "?" : "&") + cad, this.asincrono);
            this.xmlhttp.send();
        }
        if (!this.asincrono) this.respuesta();
    }

    constructor(datos) {
        this.metodo      = typeof datos.metodo      == "string"   ? datos.metodo      : "POST";
        this.direccion   = typeof datos.direccion   == "string"   ? datos.direccion   : "";
        this.caracteres  = typeof datos.caracteres  == "string"   ? datos.caracteres  : "utf-8";
        this.parametros  = typeof datos.parametros  == "object"   ? datos.parametros  : {};
        this.retorno     = typeof datos.retorno     == "function" ? datos.retorno     : function() {};
        this.extra       = typeof datos.extra       == "object"   ? datos.extra       : {};
        this.asincrono   = typeof datos.asincrono   == "boolean"  ? datos.asincrono   : true;
        this.contentType = typeof datos.contentType == "string"   ? datos.contentType : "application/json";
        this.xmlhttp     = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        this.pide();
    }
}