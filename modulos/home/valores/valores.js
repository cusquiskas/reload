$(document).ready(function () {
    if ($(document).width() > 1199) {
        $('.contenedorValores').css('margin-top', '-160px');
        $('.valoresNormal').removeClass('dn');
        $('.valoresResponsive').addClass('dn');
    } else {
        $('.contenedorValores').css('margin-top', '35px');
        $('.valoresNormal').removeClass('dn');
        $('.valoresResponsive').addClass('dn');
        if ($(document).width() < 768) {
            $('.valoresNormal').addClass('dn');
            $('.valoresResponsive').removeClass('dn');
        }
    }
});

$('.transparencia').click(function () {
    window.open('https://comunicacioninterna.globalia.com/valores-de-globalia-transparencia/');
});

$('.honestidad').click(function () {
    window.open('https://comunicacioninterna.globalia.com/valores-de-globalia-honestidad/');
});

$('.adaptacion').click(function () {
    window.open('https://comunicacioninterna.globalia.com/valores-de-globalia-adaptacion/');
});

$('.liderazgo').click(function () {
    window.open('https://comunicacioninterna.globalia.com/valores-de-globalia-liderazgo/');
});

$('.equipo').click(function () {
    window.open('https://comunicacioninterna.globalia.com/valores-globalia-equipo-vital/');
});

$('.normalidad').click(function () {
    window.open('https://comunicacioninterna.globalia.com/valores-globalia-normalidad/');
});

$('.trabajo_profesional').click(function () {
    window.open('https://comunicacioninterna.globalia.com/valores-globalia-trabajo-profesional-holistico-y-sostenible/');
});

$('.integridad').click(function () {
    window.open('https://comunicacioninterna.globalia.com/descubre-los-valores-de-globalia/');
});

$('.nuestros_valores').click(function () {
    window.open('https://comunicacioninterna.globalia.com/descubre-los-valores-de-globalia/');
});