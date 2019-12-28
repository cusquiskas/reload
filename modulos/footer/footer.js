$('.admin-portal').click(function () {
    Moduls.app.load({ url: 'modulos/config/config.html', script: true });
});
$('[data-toggle="tooltip"]').tooltip({
    template: '<div class="tooltip show"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
});