function register() {
    var pushNotification = window.plugins.pushNotification;
    alert('Estoy dentro de Register ');
    //if (isAndroidDevice()) {
        pushNotification.register(function(result) {                    
            console.log('Status: ' + result);
            alert('Status '+result);
        }, function(result) {
            alert('Error handler ' + result);
        }, {
            "senderID": "528989849650", /* Google developers project number */
            "ecb" : "onNotificationGCM" /* Function name to handle notifications */
        });
   // } else {
    //    alert('Your device platform is not Android!!!');
   // }    
}

function onNotificationGCM(e) {
	alert('Estoy en notificacion');
    switch (e.event) {
        case 'registered':
            if (e.regid.length > 0) {
                var registrationId = e.regid; //GCM Registration ID
                //registerOn3rdPartyServer(registrationId);
                alert('RegId '+registrationId);
            }
            break;
 
        case 'message':
            if (e.foreground) {
                alert('FOREGROUND MSG:' + JSON.stringify(e));
            } else if (e.coldstart) {
                alert('COLDSTART MSG:' + JSON.stringify(e));
            } else {
                alert('BACKGROUND:' + JSON.stringify(e));
            }
            break;
 
        case 'error':
            // handle error
            break;
 
        default:
            // handle default
            break;
    }
} 