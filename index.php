<?php echo '
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta http-equiv="X-UA-Compatible" content="ie=10" />

    <!-- Intentamos eliminar la caché del navegador lo máximo posible -->
    <meta http-equiv="cache-control" content="max-age=0" />
    <meta http-equiv="cache-control" content="no-cache" />
    <meta http-equiv="expires" content="0" />
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
    <meta http-equiv="pragma" content="no-cache" />

    <title>GLOBALIA | portal del empleado</title>

    <link rel="shortcut icon" href="res/iconos/favicon.png" type="image/png">

    <!------------------------------->
    <!------- Liberias Estilo ------->
    <!------------------------------->
    <!-- mdb ==========> Diseño de materiales para bootstrap 4 -->
    <!-- titatoggle ===> Animacion checkbox -->
    <link rel="stylesheet" href="librerias/bootstrap-4.3.1/css/bootstrap.min.css">
    <link rel="stylesheet" href="librerias/mdb-4.4.3/css/mdb.min.css">
    <link rel="stylesheet" href="librerias/titatoggle-2.0.1/titatoggle-dist-min.css">

    <!--------------------------------------->
    <!------- Liberias Estilo Propias ------->
    <!--------------------------------------->
    <link rel="stylesheet" href="css/v_normalize.css">
    <link rel="stylesheet" href="css/v_style.css">
    <link rel="stylesheet" href="css/v_style_login.css">
</head>

<body>
    
    <template id="header"></template>
    <div class="body">
        <template id="app"></template>
        <template id="modal"></template>
    </div>
    <div class="footer">
        <template id="footer"></template>
    </div>

    <!------------------------>
    <!------- Liberias ------->
    <!------------------------>
    <!-- pooper ============> Utilizada internamente por bootstrap 4 -->
    <!-- mdb ===============> Diseño de materiales para bootstrap 4 -->
    <!-- bootstrap-tour ====> No la quitamos porque se utiliza el "fixTittle" en la barra de progreso del perfil -->
    <script src="librerias/jQuery-3.3.1/jquery.min.js"></script>
    <script src="librerias/bootstrap-4.3.1/js/bootstrap.js"></script>
    <script src="librerias/popper-1.14.7/popper.min.js"></script>
    <script src="librerias/mdb-4.4.3/js/mdb.min.js"></script>
    <script src="librerias/bootstrap-tour-0.12.0/js/bootstrap-tour-standalone.min.js"></script>

    <!-------------------------------->
    <!------- Liberias Propias ------->
    <!-------------------------------->
    <script src="js/libraryManager.js"></script>
    <script src="js/dependencias.js"></script>
    <script src="js/funciones.js"></script>
    <script src="js/peticionAjax.js"></script>
    <script src="js/uploadFile.js"></script>
    <script src="js/controller.js"></script>
    <script src="js/dataTable.js"></script>
    <script src="js/scripts.js"></script>
</body>

</html>
' ?>