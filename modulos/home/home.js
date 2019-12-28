
$('.buscadorEmpleado').click(function () {
    Moduls.app.load({
        url: 'modulos/home/buscador/buscador.html',
        script: true
    });
});
$('.tablonAnuncio').click(function () {
    Moduls.app.load({
        url: 'modulos/home/tablonAnuncios/tablon.html',
        script: true
    });
});


$(document).ready(function () {

    if (controlCargaModales()) {


        Moduls.app.child.modal.load({
            url: 'modulos/comunes/modal.html',
            script: false
        });

        Moduls.app.child.cajaAccesos.load({
            url: 'modulos/home/accesos/accesos.html',
            script: true
        });

        Moduls.app.child.cajaListin.load({
            url: 'modulos/home/listin/listin.html',
            script: true
        });


        Moduls.app.child.cajaFavoritos.load({
            url: 'modulos/home/favoritos/favoritos.html',
            script: true
        });

        Moduls.app.child.cajaAnuncios.load({
            url: 'modulos/home/anuncios/anuncios.html',
            script: true
        });

        Moduls.app.child.cajaBanners.load({
            url: 'modulos/home/banners/banners.html',
            script: true
        });

        Moduls.app.child.cajaPreFooter.load({
            url: 'modulos/home/pre-footer/pre-footer.html',
            script: true
        });

        Moduls.app.Forms.noticiasHome.executeForm();

    }

    $('.discard').click(function () {
        $('.modalFoto').fadeOut();
        $('.modalFoto').parent().css('max-width', '');
        $('body').css('overflow', 'auto');
    });

    if ($(document).width() > 769) {
        $('.textoBanner').removeClass('dn');
        $('.textoBanner').css('font-size', '16px');
    } else if ($(document).width() > 425) {
        $('.textoBanner').removeClass('dn');
        $('.textoBanner').css('font-size', '14px');
    } else {
        $('.textoBanner').addClass('dn');
    }

    // // xx584 - 27/02/2019 - Eliminamos la libreria que se utilizaba ya que estaba modificada por las peticiones que se nos hicieron. 
    // Las modificaciones eran para la antigua estructura de la HOME.
    // Si vuelve el TOUR, descargar la ultima versión de la libreria (teniamos bootstrap-0.12.0) y modificarla si vuelve a hacer falta para la nueva estructura de la HOME.
    // // VIRTUAL TOUR
    // var tourHome = new Tour({
    //     container: "#home",
    //     steps: [
    //         {
    //             orphan: true,
    //             title: "<b>¡BIENVENIDO/A AL NUEVO PORTAL DEL EMPLEADO!</b>",
    //             content: "¡Espera! No cierres esta ventana.<br><br>Nos gustaría presentarte en 10 pasos el nuevo portal del empleado de Globalia.<br><br>Sabemos que nos queda mucho trabajo por hacer, pero al menos hemos echado a andar. Haz clic en SIGUIENTE y te mostramos los cambios más destacados ;-)",
    //             backdrop: true,
    //             smartPlacement: true,
    //             autoscroll: true,
    //             animation: true
    //         }, {
    //             element: "#cajaHeader",
    //             title: "<b>1. VAMOS POR PARTES! (como diría Jack, el destripador).</b>",
    //             content: "<b>- TU NOMBRE:</b> sin duda, lo más importante. Haciendo clic en él accederás a todos tus datos (o casi).<br><br><b>- HOME:</b> el enlace a la página principal (por si en algún momento te pierdes como Pulgarcito).<br><br><b>- MENÚ:</b> un desplegable con las mismas herramientas y utilidades de la anterior versión del portal (sí, son las mismas, nos queda trabajo, ¿verdad?).<br><br><b>- BUSCADOR:</b> te facilitará el acceso a herramientas y utilidades por si no las localizas en el menú (lo hemos intentado simplificar).<br><br><b>- BOTÓN DE SALIDA:</b> que te recomendamos usar por seguridad para cuando decidas abandonar el portal.",
    //             backdrop: true,
    //             smartPlacement: true,
    //             autoscroll: true,
    //             animation: true,
    //             backdropPadding: { right: 175 }
    //         }, {
    //             element: "#cajaNovedades",
    //             title: "<b>2. ÚLTIMAS NOTICIAS (nos ponemos un poco serios).</b>",
    //             content: "Haremos un esfuerzo por contarte lo mejor posible la actualidad más relevante de lo que pasa en Globalia para que te enteres tú primero y por nosotros, siempre con rigurosidad y transparencia.",
    //             backdrop: true,
    //             smartPlacement: true,
    //             autoscroll: true,
    //             animation: true
    //         }, {
    //             element: "#cajaAccesosListin",
    //             title: "<b>3. ACCESOS DIRECTOS Y EL LISTÍN TELEFÓNICO (se lo sabe todo, teléfonos y extensiones).</b>",
    //             content: "Aquí encuentras los accesos directos a las utilidades más populares entre los usuarios del portal junto con el Listín Telefónico que, como verás, también hemos adaptado al nuevo diseño del portal.",
    //             backdrop: true,
    //             smartPlacement: true,
    //             autoscroll: true,
    //             animation: true
    //         }, {
    //             orphan: true,
    //             title: "<b>4. VAMOS MUY… ¿DES PA CI TO? (seguro que en tu cabeza has escuchado a Luis Fonsi).</b>",
    //             content: "Te prometemos que nos queda muy poquito, lo hemos cronometrado y sólo nos ha ganado Usain Bolt.",
    //             backdrop: true,
    //             smartPlacement: true,
    //             autoscroll: true,
    //             animation: true
    //         }, {
    //             element: "#divCajaComunicados",
    //             title: "<b>5. COMUNICADOS INTERNOS (de nuevo nos ponemos serios).</b>",
    //             content: "En este espacio podrás volver a leer los comunicados internos que os haremos llegar también por correo electrónico.<br><br>Si no los recibes y deseas hacerlo, facilítanos tu email (seguro qué ya sabes dónde; sino, una pista: vuelve al paso 1).",
    //             backdrop: true,
    //             smartPlacement: true,
    //             autoscroll: true,
    //             animation: true
    //         }, {
    //             element: "#divCajaOfertas",
    //             title: "<b>6. OFERTAS PARA EMPLEADOS (qué más se puede añadir… días de vacaciones, lo sabemos).</b>",
    //             content: "Espacio destacado para todas las ofertas de las que te puedes beneficiar como empleado de Globalia (que no son pocas), empezando por las propuestas de nuestros hoteles. ¡Faltan días al año para poder disfrutar de tantas experiencias!",
    //             backdrop: true,
    //             smartPlacement: true,
    //             autoscroll: true,
    //             animation: true
    //         }, {
    //             element: "#divCajaFavoritos",
    //             title: "<b>7. FAVORITOS (no es la lista de Spotify, aunque quién sabe si algún día elaboramos una y la compartimos).</b>",
    //             content: "Te facilitamos un espacio donde configurar tus propios enlaces directos a tus utilidades más frecuentes o preferidas.<br><br>En la anterior versión del portal contabas con esta posibilidad (por si no lo sabías) y hemos querido mantenerla (ahora ya lo sabes, puedes usarla).",
    //             backdrop: true,
    //             smartPlacement: true,
    //             autoscroll: true,
    //             animation: true
    //         }, {
    //             element: "#divCajaVacantes",
    //             title: "<b>8. VACANTES INTERNAS (ojo, léase vacantes y no vacaciones).</b>",
    //             content: "Queremos que sea más fácil cambiar de puesto, si así lo deseas. Y para eso, primero debes poder enterarte de los puestos vacantes.<br><br>Aquí los encontrarás y te diremos cómo apuntarte a las distintas convocatorias.",
    //             backdrop: true,
    //             smartPlacement: true,
    //             autoscroll: true,
    //             animation: true
    //         }, {
    //             element: "#divCajaAnuncios",
    //             title: "<b>9. TABLÓN DE ANUNCIOS (nuestro particular corcho digital).</b>",
    //             content: "Estamos seguros de que Wallapop nos copió esta opción del antiguo portal del empleado.<br><br>Era una de las secciones más frecuentadas en el antiguo portal y por eso la mantenemos, destacándola aún más si cabe.",
    //             backdrop: true,
    //             smartPlacement: true,
    //             autoscroll: true,
    //             animation: true
    //         }, {
    //             element: "#bannerIzq",
    //             title: "<b>10. ATENCIÓN AL EMPLEADO (los amantes de neologismos prefieren hablar de Employee Care).</b>",
    //             content: "En cuanto acabe el tutorial, puedes hacernos llegar ya tus sugerencias. Es nuestra prioridad.<br><br>Necesitamos que nos cuentes todo lo que consideres importante para ti y que puedas hacerlo de modo fácil y directo.",
    //             backdrop: true,
    //             smartPlacement: true,
    //             autoscroll: true,
    //             animation: true
    //         }, {
    //             element: "#bannerDer",
    //             title: "<b>11. REGÍSTRATE (tranquilos, no queremos hacerte SPAM, SPAM, SPAM como dirían los Monty Python).</b>",
    //             content: "El mejor viaje es contigo y queremos compartir todo lo que sucede en Globalia de manera rápida, veraz y directa contigo. Por eso, si no recibes nuestros comunicados, comprueba en el apartado Mis Datos, la dirección de email que aparece reflejada.<br><br>Si tienes una dirección laboral (@dominiodetuempresa) deberías recibir nuestros emails.<br><br>Si no dispones de dirección laboral, podrás facilitarnos una dirección personal (que sólo verás tú, no se hará pública en ningún caso) a la que te dirigiremos todos nuestros comunicados mientras seas empleado/a de Globalia.",
    //             backdrop: true,
    //             smartPlacement: true,
    //             autoscroll: true,
    //             animation: true
    //         }, {
    //             orphan: true,
    //             title: "<b>EL MEJOR VIAJE ES CONTIGO</b>",
    //             content: "¡Lo has logrado! Ahora, cuando hagas clic en FINALIZAR te haremos un examen y, por último, una encuesta de calidad… ¡Es broma! No lo haremos.<br><br>Sólo queremos agradecer toda tu atención y confiamos en que la transformación digital que estamos viviendo te resulte útil y te facilite un poco más tu trabajo diario.<br><br>Gracias por leernos y haber llegado hasta aquí.<br>PD. El siguiente reto que te proponemos es ir a Ikea y salir sin rodeos.",
    //             backdrop: true,
    //             smartPlacement: true,
    //             autoscroll: true,
    //             animation: true
    //         }
    //     ], onEnd: function (tour) {
    //         $('body').css('overflow', 'auto');
    //         $('header .fixed-top').css('z-index', 1030);
    //     }, onShow: function (tour) {
    //         $('header .fixed-top').css('z-index', 0);
    //         $('body').css('overflow', 'hidden');
    //     }
    // });

    // if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
    //     // xx584 - 30/08/2018 - Quitamos el tour
    //     // 14293 - 03.10.2018 - Ojo, que si hay que volver a ponerlo, se tiene que iniciar en la función de controlCargaModales()
    //     console.log('El tour ya no se ve');
    //     // tourHome.init();
    //     // tourHome.start();
    // } else {
    //     console.log('Esto es un dispositivo móvil, no se verá el tour');
    // }
});

function noticiasHome(s, d, e) {
    if (s) {
        for (let cnl in d.root.canales) {
            switch (d.root.canales[cnl].codcan) {
                case 1:
                    Moduls.app.Novedades = d.root.canales[cnl].noticias;
                    Moduls.app.Novedades.Url = d.root.canales[cnl].urlcon;
                    break;
                case 2:
                    Moduls.app.Comunicados = d.root.canales[cnl].noticias;
                    Moduls.app.Comunicados.Url = d.root.canales[cnl].urlcon;
                    break;
                case 3:
                    Moduls.app.Ofertas = d.root.canales[cnl].noticias;
                    Moduls.app.Ofertas.Url = d.root.canales[cnl].urlcon;
                    break;
                case 4:
                    Moduls.app.Vacantes = d.root.canales[cnl].noticias;
                    Moduls.app.Vacantes.Url = d.root.canales[cnl].urlcon;
                    break;
                case 5:
                    Moduls.app.Bizneo = d.root.canales[cnl].noticias;
                    Moduls.app.Bizneo.Url = d.root.canales[cnl].urlcon;
                    break;
            }
        }

        if (Moduls.app.child.cajaNovedades)
            Moduls.app.child.cajaNovedades.load({
                url: 'modulos/home/novedades/novedades.html',
                script: true
            });

        if (Moduls.app.child.cajaValores)
            Moduls.app.child.cajaValores.load({
                url: 'modulos/home/valores/valores.html',
                script: true
            });

        if (Moduls.app.child.cajaComunicados)
            Moduls.app.child.cajaComunicados.load({
                url: 'modulos/home/comunicados/comunicados.html',
                script: true
            });

        if (Moduls.app.child.cajaOfertas)
            Moduls.app.child.cajaOfertas.load({
                url: 'modulos/home/ofertas/ofertas.html',
                script: true
            });

        if (Moduls.app.child.cajaVacantes)
            Moduls.app.child.cajaVacantes.load({
                url: 'modulos/home/vacantes/vacantes.html',
                script: true
            });

    } else {
        toast({ tipo: 'error', msg: resuelveError(d) });
        e.form.modul.child.cajaNovedades.template.className = 'dn';
        e.form.modul.child.cajaComunicados.template.className = 'dn';
        e.form.modul.child.cajaOfertas.template.className = 'dn';
        e.form.modul.child.cajaVacantes.template.className = 'dn';
    }
}

$('.logoEMVEC').click(function () {
    Moduls.header.Forms.datosSesion.executeForm();
    if ($('.animated-icon4').hasClass('open')) {
        $('.animated-icon4').toggleClass('open');
        $('.modal-overlay').css("display", "none");
        if ($('#navbarSupportedContent22').hasClass('show'))
            $('#navbarSupportedContent22').removeClass('show');
    }
});