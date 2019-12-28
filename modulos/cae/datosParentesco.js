$(function () {


    Moduls.app.child.templateAplicacion.child.panelPlantilla.Forms.initParentesco.set({ P_fecsol: Moduls.app.child.templateAplicacion.paramSelSolCae.param.fecsol });
    Moduls.app.child.templateAplicacion.child.panelPlantilla.Forms.initParentesco.set({ P_codusr: Moduls.header.user.codusr });

    Moduls.app.child.templateAplicacion.child.panelPlantilla.Forms.initNacimiento.set({ P_fecsol: Moduls.app.child.templateAplicacion.paramSelSolCae.param.fecsol });
    Moduls.app.child.templateAplicacion.child.panelPlantilla.Forms.initNacimiento.set({ P_codusr: Moduls.header.user.codusr });
    Moduls.app.child.templateAplicacion.child.panelPlantilla.Forms.initNacimiento.executeForm();
    Moduls.app.child.templateAplicacion.child.panelPlantilla.Forms.initParentesco.executeForm();
});


function initNacimiento(s, d, e) {
    if (s) {

        if (d.root.NEWINTRA.length != 0) {
            $('.lugar-nacimiento').addClass('active');
            $('#provinaci').attr("disabled", true);
            $('#p_nacimiento').prop({ 'readOnly': true, 'disabled': true });
            $('#paisnaci').attr("disabled", true);
            Moduls.app.child.templateAplicacion.child.panelPlantilla.Forms.Nacimiento.set({
                p_nacimiento: d.root.NEWINTRA[0].lugarnaci,
                p_nacper: d.root.NEWINTRA[0].nacionalidad,
                p_proper: d.root.NEWINTRA[0].provincia
            });
        }

    } else {
        validaErroresCbk(d);


    }


}
function initParentesco(s, d, e) {
    if (s) {

        if (d.root.NEWINTRA.length > 0) {


            let estado = "";

            switch (d.root.NEWINTRA[0].estado) {

                case "A":
                    estado = "Abierta"
                    break;

                case "C":
                    estado = "En Curso"
                    break;

                case "E":
                    estado = "En Curso"
                    break;


                case "W":
                    estado = "Pendiente"
                    break;

                case "R":
                    estado = "Pdte. RRLL"
                    break;

                case "X":
                    estado = "Rechazada"
                    break;

                case "T":
                    estado = "Pdte. Tramitación Final"
                    break;
                case "U":
                    estado = "Rechazada por el Solicitante"
                    break;

                case "V":
                    estado = "Aceptada"
                    break;


            }


            Moduls.app.child.templateAplicacion.child.panelPlantilla.Forms.Parentesco.set({
                p_madre_name: d.root.NEWINTRA[0].Nombre,
                p_madre_ape: d.root.NEWINTRA[0].Apellido,
                p_padre_name: d.root.NEWINTRA[1].Nombre,
                p_padre_ape: d.root.NEWINTRA[1].Apellido,
                p_estado: estado


            });

        }


    } else {
        toast({ tipo: tipo, msg: msg });
    }
}