function cargarComunicados(s, d, e) {
    if (s) {
        if (Moduls.app.Comunicados && Moduls.app.Comunicados.length > 0) {
            let cadenaCom = e.form.modul.return('modulos/comunes/tabla.html?comunicados');
            let contadorComunicados = 1;
            for (let i = 0; i < Moduls.app.Comunicados.length; i++) {
                if (($.inArray(Moduls.app.Comunicados[i].codnot, Moduls.app.IdNoticias) === -1) &&
                    ($.inArray(Moduls.app.Comunicados[i].codnot, Moduls.app.IdVacantes) === -1) &&
                    contadorComunicados <= 3) {
                    
                    Moduls.app.Comunicados[i].imgcatnot = 'src="' + Moduls.app.Comunicados[i].imgcatnot + '"';
                    if (Moduls.app.Comunicados[i].desnot.substr(-1) != '.') {
                        Moduls.app.Comunicados[i].desnot = Moduls.app.Comunicados[i].desnot + "..."
                    }
                    let HTML = $.parseHTML(cadenaCom.reemplazaMostachos(Moduls.app.Comunicados[i]));
                    $('#listadoComunicados').append(HTML);
                    contadorComunicados++;
                }
            }
        } else {
            e.form.modul.template.className = 'dn';
        }
        if (Moduls.app.Comunicados.Url) {
            if ($(".btnTodosComunicados")) $('.btnTodosComunicados').attr("href", Moduls.app.Comunicados.Url);
        }
    } else {
        toast({ tipo: 'error', msg: resuelveError(d) });
    }
}