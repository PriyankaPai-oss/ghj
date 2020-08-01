
    function ValidationForm() {
       
        let email = document.forms["RegForm"]["email"];
       
       let gender = document.forms["RegForm"]["gender"];
       var formValid = false;
       
       var gnderadio = document.getElementsByName("gender");
       var formValid = false;
   
       var i = 0;
      //  let select = document.forms["RegForm"]["Subject"];
        //let pass = document.forms["RegForm"]["Password"];

   

        if(username.value == "") {
          alert("Please enter your name.");
          username.focus();
          return false;
        }
        if(email.value == "") {
          alert("Please enter a valid e-mail address.");
          email.focus();
          return false;
        }
        if(email.value.indexOf("@", 0) < 0) {
          alert("Please enter a valid e-mail address.");
          email.focus();
          return false;
        }
        if(email.value.indexOf(".", 0) < 0) {
          alert("Please enter a valid e-mail address.");
          email.focus();
          return false;
        }
        // if(lastName.value == "") {
        //   alert("Please enter your last Name");
        //   phoneNumber.focus();
        //   return false;
        // }
        // if(pass.value == "") {
        //   alert("Please enter your password");
        //   pass.focus();
        //   return false;
        // }
        // if(select.selectedIndex < 1) {
        //   alert("Please enter your course.");
        //   select.focus();
        //   return false;
        // }
       if(gnderadio.length==0){
           alert("Select an option");
       }
       else{
       while (!formValid && i < gnderadio.length) {
           if (radios[i].checked) formValid = true;
           i++;        
       }
   
       if (!formValid){
           alert("Must check some option!");
       return formValid;
       
    }
    }
        return true;
      }

