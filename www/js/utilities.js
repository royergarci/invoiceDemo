

function validateFormDs() {

    var rs = document.forms["formDf"]["razonSocial"];
    if (rs.value == null || rs.value == "") {
        alert("Campo Razon Social Requerido");
        rs.focus();
        return false;
    }
    
    var rfc = document.forms["formDf"]["rfc"];
    if (rfc.value == null || rfc.value == "") {
        alert("Campo RFC Requerido");
        rfc.focus();
        return false;
    }
    
    var rs = document.forms["formDf"]["razonSocial"];
    if (rs.value == null || rs.value == "") {
        alert("Campo Razon Social Requerido");
        rs.focus();
        return false;
    }
    
    var email = document.forms["formDf"]["email"];
    if (email.value == null || email.value == "") {
        alert("Campo Email Requerido");
        email.focus();
        return false;
    }
    
    var cp = document.forms["formDf"]["cp"];
    if (cp.value == null || cp.value == "") {
        alert("Campo cp Requerido");
        cp.focus();
        return false;
    }
    return true;
}

function strToUpperDs(element){
	//alert('Estoy en upper '+$(element).val());
	element.value = element.value.toUpperCase();
}