function cargarVacantes(s, d, e) {
    if (s) {
        let cadenaVac = e.form.modul.return('modulos/comunes/tabla.html?vacantes');
        if (Moduls.app.Vacantes && Moduls.app.Vacantes.length > 0) {
            for (let i = 0; i < Moduls.app.Vacantes.length; i++) {
                Moduls.app.Vacantes[i].imgcomnot = 'src="' + Moduls.app.Vacantes[i].imgcomnot + '"';
                if (Moduls.app.Vacantes[i].desnot.substr(-1) != '.') {
                    Moduls.app.Vacantes[i].desnot = Moduls.app.Vacantes[i].desnot + "..."
                }
                let HTML = $.parseHTML(cadenaVac.reemplazaMostachos(Moduls.app.Vacantes[i]));
                $('#listadoVacantes').append(HTML);
            }
            if (Moduls.app.Vacantes.Url) {
                if ($(".btnTodasVacantes")) $(".btnTodasVacantes").attr("href", Moduls.app.Vacantes.Url);
            }
        } else if (Moduls.app.Bizneo && Moduls.app.Bizneo.length > 0) {
            for (let i = 0; i < Moduls.app.Bizneo.length; i++) {
                Moduls.app.Bizneo[i].imgcomnot = 'src="' + Moduls.app.Bizneo[i].imgcomnot + '"';
                if (Moduls.app.Bizneo[i].desnot.substr(-1) != '.') {
                    Moduls.app.Bizneo[i].desnot = Moduls.app.Bizneo[i].desnot + "..."
                }
                let HTML = $.parseHTML(cadenaVac.reemplazaMostachos(Moduls.app.Bizneo[i]));
                $('#listadoVacantes').append(HTML);
            }
            if (Moduls.app.Bizneo.Url) {
                if ($(".btnTodasVacantes")) $(".btnTodasVacantes").attr("href", Moduls.app.Bizneo.Url);
            }
        } else if (Moduls.app.Novedades && Moduls.app.Novedades.length > 0) {
            let contadorVacantes = 0;
            let idVac = [];
            for (let i = 0; i < Moduls.app.Novedades.length; i++) {
                if (($.inArray(Moduls.app.Novedades[i].codnot, Moduls.app.IdNoticias) === -1) &&
                    contadorVacantes < 3) {
                    
                    idVac.push(Moduls.app.Novedades[i].codnot);
                    Moduls.app.Novedades[i].imgcomnot = 'src="' + Moduls.app.Novedades[i].imgcomnot + '"';
                    if (Moduls.app.Novedades[i].desnot.substr(-1) != '.') {
                        Moduls.app.Novedades[i].desnot = Moduls.app.Novedades[i].desnot + "..."
                    }
                    let HTML = $.parseHTML(cadenaVac.reemplazaMostachos(Moduls.app.Novedades[i]));
                    $('#listadoVacantes').append(HTML);
                    contadorVacantes++;
                }
                Moduls.app.IdVacantes = idVac;
                if (Moduls.app.Novedades.Url) {
                    if ($(".btnTodasVacantes")) $('.btnTodasVacantes').attr("href", Moduls.app.Novedades.Url);
                }
                $('#listadoVacantes h2 span').html('<img src="res/img/icon-comunicados.png" alt="">Más Noticias');
            }
        } else {
            e.form.modul.template.className = 'dn';
        }
    } else {
        toast({ tipo: 'error', msg: resuelveError(d) });
    }
}