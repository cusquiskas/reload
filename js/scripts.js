let Moduls = [];
$(document).ready(function (){
    let Template = document.getElementsByTagName('template');
    for (let i = 0; i < Template.length; i++) 
        Moduls[Template[i].id] = new ModulController(Template[i], null);
    //... inicialmente, no debería haber ningún formulario fuera de un template ...//
    // Moduls.Forms = [];
    // for (let i = 0; i < document.forms.length; i++) 
    //     Moduls.Forms[document.forms[i].name] = new FormController(document.forms[i], null);
});