function cargarNovedades(s, d, e) {
    if (s) {
        if (Moduls.app.Novedades && Moduls.app.Novedades.length > 0) {
            let cadenaNov = e.form.modul.return('modulos/comunes/tabla.html?novedades');
            let idNot = [];
            let contNovedades = 0;
            for (let i = 0; i < Moduls.app.Novedades.length && contNovedades < 3; i++) {
                idNot.push(Moduls.app.Novedades[i].codnot);
                Moduls.app.Novedades[i].imgnot = 'src="' + Moduls.app.Novedades[i].imgnot + '"';
                if (Moduls.app.Novedades[i].catnot.indexOf(',') != -1) {
                    Moduls.app.Novedades[i].catnot = Moduls.app.Novedades[i].catnot.split(',')[0];
                }
                let HTML = $.parseHTML(cadenaNov.reemplazaMostachos(Moduls.app.Novedades[i]));
                $('#listadoNovedades').append(HTML);
                contNovedades++;
            }
            Moduls.app.IdNoticias = idNot;
        } else {
            e.form.modul.template.className = 'dn';
        }
        if (Moduls.app.Novedades.Url) {
            if ($(".btnTodasNovedades")) {
                $('.btnTodasNovedades').attr("href", Moduls.app.Novedades.Url);
            }
        }
    } else {
        toast({ tipo: 'error', msg: resuelveError(d) });
    }
}