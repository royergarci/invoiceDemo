$(document).ready(function(){
	var datosFiscales = {};
	localStorage.setItem('df', '');
	
	var qrImgBase64 = '';
	
	//Esta variable nos sirve para saber si ya cambiaron los datos Fiscales
	var dfChange = false;
	
	
	$.support.cors = true;
    $.mobile.allowCrossDomainPages = true;
	
	loadDatosFiscales();
//	saveDatosFiscales();
	
	//loadImage64();
	
	$("#startScan").click(function(){
		cordova.plugins.barcodeScanner.scan(
				function (result) {
					var s = "Result: " + result.text + "<br/>" +
					"Format: " + result.format + "<br/>" +
					"Cancelled: " + result.cancelled;
					$("#results").html(s);
				}, 
				function (error) {
					alert("Scanning failed: " + error);
				}
			);
	});
	
	$("#register").click(function(){
		register();
	});
	
	$("#btnGuardarDf").click(function(){
		$.mobile.loading( "show" );
		if (!validateFormDs()){
			$.mobile.loading( "hide" );
			return false;
		}
		saveDatosFiscales();
		$.mobile.loading( "hide" );
	});
	
	$("#imgDf").click(function(){
		 $.mobile.loading( "show" );
		fillDatosFiscales();
		$.mobile.loading( "hide" );
	});
	
	$("#getQr").click(function(){
		
		datosFiscales = JSON.parse(localStorage.getItem('df'));
		alert('Estoy en getQr '+datosFiscales.razonSocial);
		if (datosFiscales.razonSocial === undefined || datosFiscales.razonSocial === '' || datosFiscales.razonSocial === null){
			alert('No existen datos fiscales');
		}
		else{
			loadImage64();
		}
	});
});


function loadDatosFiscales(){
	//alert('Estoy en load datosFiscales 2');
	
	var createCORSRequest = function(method, url) {
		  var xhr = new XMLHttpRequest();
		  if ("withCredentials" in xhr) {
		    // Most browsers.
		    xhr.open(method, url, true);
		  } else if (typeof XDomainRequest != "undefined") {
		    // IE8 & IE9
		    xhr = new XDomainRequest();
		    xhr.open(method, url);
		  } else {
		    // CORS not supported.
		    xhr = null;
		  }
		  return xhr;
		};

		var url = 'http://www.pureexample.com/backend/data/car-sale.json';
		var method = 'GET';
		var xhr = createCORSRequest(method, url);

		xhr.onload = function() {
		  // Success code goes here.
		//	alert('Sucess cors');
		};

		xhr.onerror = function() {
		  // Error code goes here.
			alert('fall cors');
		};

		xhr.send();
  
	
}

//Guardar Datos Fiscales

function saveDatosFiscales(){
	
	datosFiscales = {
		razonSocial: $("#razonSocial").val(),
		rfc: $("#rfc").val(),
		email: $("#email").val(),
		calle: $("#calle").val(),
		numExt: $("#numExt").val(),
		numInt: $("#numInt").val(),
		colonia: $("#colonia").val(),
		cp: $("#cp").val(),
		delegacion: $("#delegacion").val(),
		ciudad: $("#ciudad").val(),
		estado: $("#estado").val(),
		pais: $("#pais").val(),
	};
	localStorage.setItem('df', JSON.stringify(datosFiscales));
	
	//Cuando se guardan Datos Fiscales hay que generar de nuevo el QR y guardarlo en LocalStorage
	//loadImage64();
	alert('Se han guardado los Datos Fiscales Correctamente');
	dfChange = true;
}

function fillDatosFiscales(){
	
	datosFiscales = JSON.parse(localStorage.getItem('df'));
	
	$("#razonSocial").val(datosFiscales.razonSocial);
	$("#rfc").val(datosFiscales.rfc);
	$("#email").val(datosFiscales.email);
	$("#calle").val(datosFiscales.calle);
	$("#numExt").val(datosFiscales.numExt);
	$("#numInt").val(datosFiscales.numInt);
	$("#colonia").val(datosFiscales.colonia);
	$("#cp").val(datosFiscales.cp);
	$("#delegacion").val(datosFiscales.delegacion);
	$("#ciudad").val(datosFiscales.ciudad);
	$("#estado").val(datosFiscales.estado);
	$("#pais").val(datosFiscales.pais);
}

function loadImage64(){
	
	//Antes de generar debemos revisar que este en memoria los datos fiscales
	alert('Estoy dentro de load');
	
	
	//Generamos la cadena de datos Fiscales
    var datosFiscalesCad = generaCadenaDf();
    
    //Limpiamos el html donde va la imagen
    $("#qrImagen").html('');
   
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;
    //Metodo por imagen
    /*
    //Mostramos loading
    $.mobile.loading( "show" );
    
    //Creamos el objeto ImagenQr
    var imgQr = new Image();
    
    imgQr.src = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data='+datosFiscalesCad;
    	
    var div = document.getElementById('qrImagen');

    imgQr.onload = function() {
    	$.mobile.loading( "hide" );
    	div.appendChild(imgQr);
    };

    */
    //Metodo por Base 64
   
    //Generamos la cadena
    datosFiscales = JSON.parse(localStorage.getItem('df'));
    
    var jsonQrGenerator = '{"DatosFiscales":'+
    	'['+
 		'{'+
 			'"df_razon_social":"'+datosFiscales.razonSocial+'",'+
 			'"df_rfc":"IRS0603234M2",'+
 			'"df_calle":"Av. Morelos",'+
 			'"df_num_int":"Edif. 13 Int. 3",'+
 			'"df_num_ext":"827",'+
 			'"df_colonia":"Jardín Balbuena",'+
 			'"df_cp":"15900",'+
 			'"df_deleg_munic":"Venustiano Carranza",'+
 			'"df_ciudad":"Ciudad de México",'+
 			'"df_estado":"Distrito Federal",'+
 			'"df_pais":"México",'+
 			'"df_correo":"jgonzalez@it-reals.com.mx"'+
 		'}'+
 	']'+
 '}';
    
    if (dfChange){
    
		$.ajax({
			url: 'http://208.43.124.154:3016/clientes/alta/generaQR',
			type: 'POST',
			 beforeSend : function() {$.mobile.loading('show')},
			 complete   : function() {$.mobile.loading('hide')},
			 data: jsonQrGenerator,
		     contentType: 'text/plain',
			//dataType: 'jsonp',
			//async: false,
			success: function(dataResult){
				//alert(dataResult);
			//	alert('Respuesta ok Imagen'+dataResult.qr);
				//$("#qrImagen").html('<img src="data:image/png;base64,'+dataResul+'" />');
				
				//qrImgBase64 = 'data:image/png;base64,'+iVBORw0KGgoAAAANSUhEUgAAARgAAAEYCAIAAAAI7H7bAAAEr0lEQVR42u3dwZEDIQxFQfJPepyDKaGP6He3jRE9l6W865O03bIFEkgSSBJIkkCSQJJAkkCSBJIEkgSSBJIkkCSQJJAkkCSBJIEkgSSBJAkkCSQJJAkkSSBJIEkgSQJJAkkCSQJJEkgSSBJIEkiSQJJAkkCSQKr41Cm1bIKhtOwPSCAZCkgggQSSmYEEEkgggQQSSIYCEkgggWRmIIEEEkggDYCU+Efrf1d7/ijsvO0jQwEJJJBAAgkkkEACCSSQQAIJJJBAAgkkkEACCSSQQAIJJJBAAgmkxKM56YSdv7JkKCCBZCggmRlIIJkZSCCBBJKhgASSoYBkZiCBZGYggQQSSIYCEkiGAtJzM6tYbcvXBAkkkAwFJJBAAsnMQAIJJJBAAgkkQwEJJJBAMjOQQAIJJJBAuuiEFeE0FJBAAgkkkEACCSSQQAIJJJBAAgkkkMwMJJBAAgkkkEACCSSQQAKpFpLVBkIyFJBAMhSQrBYkkMwMJJBAAslQQALJUECyWpBAMjOQQAIJJEMBCSRDeQjSXRUd6/MvfGcoIIEEEkgggQQSSCCBBBJIIIEEEkgggQQSSCCBBBJIIIE0HpJaHkO2DiSBBJJAAkkgCSSQQAJJIIEkkEASSAIJJJBAEkgg7R6FnTNU8cIv8OcB7lnPavrPGiCBBBJIIIEEEkgggQQSSCCBBBJIIIEEEkgggQQSSCCBBBJIIIFUuPXnt6/I52U/33F8taOebiCBBBJIIIEEEkgggQQSSCCBBBJIIIEEEkgggQQSSCCBFAMp7SgUnaHzH+oxBBJIIIEEEkgggQQSSCCBBBJIIIEEEkgggQQSSCCBBBJIIIEEEkidJ77lbYsO7kVXhOo2Ie2hABJIIIEEEkgggQQSSCCBBBJIIIEEEkgggQQSSCCBBBJIAyClbW4L7KgX1kFK8wkSSCCBBBJIIIEEEkgggQQSSCCBBBJIIIEEEkgggQQSSCCBBBJIqvVw112eIgxxF6wcd5BAAgkkkEACCSSQBBJIIIEEEkgggQQSSCCBJJBAAgkkkCZBWlNK2727tj3QJ0gggQQSSCCBBBJIIIEEEkgggQQSSCCBBBJIIIEEEkggzYb05XV+te88FMYcIZBAAgkkkEACCSSQQAIJJJBAAgkkkEACCSSQQAIJJJBAAgkkkEAqPGEtq634mkW7V/Q1W1YLEkgggQQSSCCBBBJIIIEEEkgggQQSSCCBBBJIIIEEEkgggQQSSCBdeVDSLiXddaEJJJBAAgkkkEACCSSQQAIJJJBAAgkkkEACCSSQQAIJJJBAmnGz4fzhWx21PN1AAgkkkEACCSSQQAIJJJBAAgkkkEACCSSQQAIJJJBAAgkkkEACKXEX0lZ71xWhSZsAEkgggQQSSCCBBBJIIIEEEkgggQQSSCCBBBJIIIEEEkgggQQSSFszSyvtaLasNu1eEkgggQQSSCCBBBJIIIEEEkgggQQSSCCBBBJIIIEEEkggPQ5JGhZIEkgSSBJIkkCSQJJAkkCSBJIEkgSSBJIkkCSQJJAkkCSBJIEkgSSBJAkkCSQJJAkkSSBJIEkgSQJJAkkCSQJJEkgSSBJIEkiSQJJAkkCSpvcDnPxcFkTGMfUAAAAASUVORK5CYII=';
				localStorage.setItem('qr', JSON.stringify(dataResult.qr));
				
				qrImgBase64 = 'data:image/gif;base64,'+dataResult.qr;
				
				alert(qrImgBase64);
				$("#qrImagen").html('<img width=250px; heigth=250px; src="'+qrImgBase64+'"/>');
				console.log('Respuesta ok');
		 	},
			error: function(dataResult){
				alert('Lo sentimos, ha ocurrido un error al obtener el qr '+JSON.stringify(dataResult)); 
			}
		});
    }
    else{
    	var qrLs = JSON.parse(localStorage.getItem('qr'));
    	alert('Obteniendo qr de localStorage '+qeLs);
    	qrImgBase64 = 'data:image/gif;base64,'+qrLs;
	
		$("#qrImagen").html('<img width=250px; heigth=250px; src="'+qrImgBase64+'"/>');
		dfChange = false;
    }
	
}

function generaCadenaDf(){
    datosFiscales = JSON.parse(localStorage.getItem('df'));
	var cadDf = '';
	
	cadDf = '||'+datosFiscales.razonSocial +'|'+
			datosFiscales.rfc +'|'+
			datosFiscales.email +'|'+
			datosFiscales.calle +'|'+
			datosFiscales.numExt +'|'+
			datosFiscales.numInt +'|'+
			datosFiscales.colonia +'|'+
			datosFiscales.cp +'|'+
			datosFiscales.delegacion +'|'+
			datosFiscales.ciudad +'|'+
			datosFiscales.estado +'|'+
			datosFiscales.pais +'||';
	return cadDf;
}

//Cargar imagenes
function loadSprite(src, callback) {
    var sprite = new Image();
    sprite.onload = callback;
    sprite.src = src;
}