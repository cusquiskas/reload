var crop_max_width = 400;
var crop_max_height = 400;
var jcrop_api;
var canvas;
var context;
var image;

var prefsize;

$(document).ready(function () {
  
  $('.imageActualAvatar')[0].src = (Moduls.header.user.imagen) ? Moduls.header.user.imagen : 'res/img/user.png';

  LibraryManager.load('jcrop-0.9.15', 'core', function () { });
});

$("#archivoCrop").change(function () {
  if ($('.imageActualAvatar')[0]) $('.imageActualAvatar')[0].className = 'dn';

  loadImage(this);
});

function loadImage(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    canvas = null;
    reader.onload = function (e) {
      image = new Image();
      image.onload = validateImage;
      image.src = e.target.result;
    }
    reader.readAsDataURL(input.files[0]);
  }
}

function dataURLtoBlob(dataURL) {
  var BASE64_MARKER = ';base64,';
  if (dataURL.indexOf(BASE64_MARKER) == -1) {
    var parts = dataURL.split(',');
    var contentType = parts[0].split(':')[1];
    var raw = decodeURIComponent(parts[1]);

    return new Blob([raw], {
      type: contentType
    });
  }
  var parts = dataURL.split(BASE64_MARKER);
  var contentType = parts[0].split(':')[1];
  var raw = window.atob(parts[1]);
  var rawLength = raw.length;
  var uInt8Array = new Uint8Array(rawLength);
  for (var i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], {
    type: contentType
  });
}

function validateImage() {
  if (canvas != null) {
    image = new Image();
    image.onload = restartJcrop;
    image.src = canvas.toDataURL('image/png');
  } else restartJcrop();
}

function restartJcrop() {
  if (jcrop_api != null) {
    jcrop_api.destroy();
  }
  $("#avatar").empty();
  $("#avatar").append("<canvas id=\"canvas\">");
  canvas = $("#canvas")[0];
  context = canvas.getContext("2d");
  canvas.width = image.width;
  canvas.height = image.height;
  context.drawImage(image, 0, 0);
  $("#canvas").Jcrop({
    onSelect: selectcanvas,
    onRelease: clearcanvas,
    boxWidth: crop_max_width,
    boxHeight: crop_max_height
  }, function () {
    jcrop_api = this;
  });
  clearcanvas();
}

function clearcanvas() {
  prefsize = {
    x: 0,
    y: 0,
    w: canvas.width,
    h: canvas.height,
  };
}

function selectcanvas(coords) {
  prefsize = {
    x: Math.round(coords.x),
    y: Math.round(coords.y),
    w: Math.round(coords.w),
    h: Math.round(coords.h)
  };
}

function applyCrop() {
  canvas.width = prefsize.w;
  canvas.height = prefsize.h;
  context.drawImage(image, prefsize.x, prefsize.y, prefsize.w, prefsize.h, 0, 0, canvas.width, canvas.height);
  validateImage();
}

function applyRotate() {
  canvas.width = image.height;
  canvas.height = image.width;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.translate(image.height / 2, image.width / 2);
  context.rotate(Math.PI / 2);
  context.drawImage(image, -image.width / 2, -image.height / 2);
  validateImage();
}

$("#rotatebutton").click(function (e) {
  applyRotate();
});

$(".btnQuitarAvatar").click(function (e) {
  Moduls.app.child.modal.child.modalBody.Forms.gestionAvatar.set({ p_imagen: '', p_flag: 'D' });
  Moduls.app.child.modal.child.modalBody.Forms.gestionAvatar.executeForm();
});

$(".btnAceptarAvatar").click(function (e) {
  if (prefsize) {
    applyCrop();

    let nombreFile = top.SESION_ID + '.png';
    let formData = createFormData(nombreFile);

    Moduls.app.child.modal.child.modalBody.Forms.gestionAvatar.loading('gestionAvatar', true);
    invocaAjax({
      direccion: "/management/mvc-management/uploadFile",
      method: "POST",
      parametros: {
        data: formData,
        contentType: "multipart/form-data"
      },
      extra: {
        nombreFile: nombreFile
      },
      retorno: function (s, d, e) {
        Moduls.app.child.modal.child.modalBody.Forms.gestionAvatar.loading('gestionAvatar', false);
        if (s) {
          Moduls.app.child.modal.child.modalBody.Forms.gestionAvatar.set({ p_imagen: e.nombreFile, p_flag: 'I' });
          Moduls.app.child.modal.child.modalBody.Forms.gestionAvatar.executeForm();
        } else {
          if (typeof d == 'string')
            d = JSON.parse(d);

          toast({ tipo: 'error', msg: resuelveError(d), donde: '.modal-header' });
        }
      }
    });
  } else {
    toast({ tipo: 'error', msg: 'Seleccione una imagen', donde: '.modal-header' });
  }
});

function createFormData(nombreFile) {
  //--- Add file blob to the form data
  var blob = dataURLtoBlob(canvas.toDataURL('image/png'));

  let formData = new FormData();
  formData.append("file", new File([blob], nombreFile));
  formData.append("destFile", '/var/www/webapps04/estatico/portal/avatares');
  formData.append("fileName", nombreFile);
  formData.append("maxSize", '5242880');
  formData.append("encrypt", false);
  formData.append("xsid", top.SESION_ID);
  formData.append("resize", true);
  formData.append("width", '1024');

  return formData;
}

function gestionAvatar(s, d, e) {
  if (s) {
    toast({ tipo: 'success', msg: d.root.msg });
    Moduls.header.user.imagen = d.extra.imagen;
    $('.imagenAvatarUsr')[0].src = (d.extra.imagen) ? d.extra.imagen : 'res/img/user.png';
    cerrarModalIE($('#myModal'));
    //$('#myModal').modal('hide');

    refreshProgresBar();
  } else {
    toast({ tipo: 'error', msg: resuelveError(d), donde: '.modal-header' });
  }
}

// /* readURL */
// function readURL(input) {
//   if (input.files && input.files[0]) {
//     var reader = new FileReader();

//     reader.onload = function (e) {
//       $('.nuevoAvatar')
//         .attr('src', e.target.result)
//     };

//     reader.onload = function (e) {
//       $('.jcrop-holder img')
//         .attr('src', e.target.result)
//     };

//     reader.readAsDataURL(input.files[0]);
//   }
// }