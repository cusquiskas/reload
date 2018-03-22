class ModulController {

    secciona(data, param) {
        return $("div." + param, data)[0] || '';
    }

    return(url) {
        let me = this,
            direcc = url,
            result = "";
        $.ajax({
            url: url,
            method: 'GET',
            async: false,
            success: function (data, status) {
                result = (!direcc.split('?')[1]) ? data : me.secciona(data, direcc.split('?')[1]);
            }
        });

        return typeof result == 'string' ? result : result.outerHTML;
    }

    enlazarScript(datos, script, donde) {
        if (script === true) {
            let url = datos.slice(0, -4) + 'js';
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            $(donde).append(script);
        }
    }

    load(objeto) {
        let me = this;
        $(this.name).empty();
        $.get(objeto.url, function (data, status) {
            data = (!objeto.url.split('?')[1]) ? data : me.secciona(data, objeto.url.split('?')[1]);
            $(me.name).append(data);
            me.enlazarScript(objeto.url, objeto.script, me.name);
            //me.child = [];
            let Template = me.template.getElementsByTagName('template');
            for (let i = 0; i < Template.length; i++) me/*.child*/[Template[i].id] = new ModulController(Template[i], me);
            me.Forms = [];
            let formularios = me.template.getElementsByTagName('form');
            for (let i = 0; i < formularios.length; i++) if (formularios[i].name) me.Forms[formularios[i].name] = new FormController(formularios[i], me);
        });
    }

    constructor(Template, ModulControler) {
        this.template = Template;
        this.name = '#' + Template.id;
        this.padre = ModulControler;
    }
}