
$('.modal-overlay').click(function () {
    modal();
});


$('.btnSalirPortal').click(function () {
    let objeto = {};
    if (localStorage.getItem("SESION_ID") != "") {
        objeto['p_oldses'] = localStorage.getItem("SESION_ID");
    } else {
        objeto['p_oldses'] = sessionStorage.getItem("SESION_ID");
    }
    Moduls.header.Forms.cerrarSesion.set(objeto);
    Moduls.header.Forms.cerrarSesion.executeForm();
});

function cargaSesion(s, d, e) {
    top.SESION_ID = getValue('s',top); 
    sessionStorage.setItem("SESION_ID",top.SESION_ID);
    e.form.modul.Forms.datosSesion.set({p_sesid:top.SESION_ID});
    e.form.modul.Forms.datosSesion.executeForm();
}

function datosSesion(s, d, e) {
    if (s) {
        setParameter(Moduls, 'sesion_externa', true)
        if (d.root.directo === 'S') { 
            Moduls.app.load({ url: d.root.ruta, script: true }); 
        } else { 
            Moduls.app.load({ url: 'modulos/login/login_externo.html', script: true }); 
        }

    } else {
        validaErroresCbk(d);
    }
}

function cerrarSesion(s, d, e) {
    top.SESION_ID = null;
    if (localStorage.getItem("SESION_ID") != "") {
        localStorage.setItem("SESION_ID", "");
    }
    sessionStorage.setItem("SESION_ID", "");
    window.location.href = '/';
}

$(document).ready(function () {
    comprobarWidth();
});

function IconoHeaderManejar() {


    Moduls.header.Forms.IconoHeader.executeForm();
    //$('.ImagenIcono').setAttribute('src','res/img/'+nombrearvhivo);

}
function IconoHeader(s,d,e) {

    if(s){

        if(d.root.ico.length>0)
        {   $('.ImagenIcono')[0].setAttribute("src", "/estatico/portal/opcionmenu/" +d.root.ico[0].imagen+'.PNG');
            $('.ImagenIcono')[0].setAttribute("title", d.root.ico[0].texto);
            $('.ImagenIcono')[0].setAttribute("alt", d.root.ico[0].texto);
        }else{

        }

    }
    else {
        validaErroresCbk(d);
    }
}