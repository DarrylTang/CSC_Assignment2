$('#registerBtn').click(function () {
  var email = document.getElementById("emailReg").value;
  var password = document.getElementById("passwordReg").value;
  var name = document.getElementById("nameReg").value;
  var repassword = document.getElementById("rePasswordReg").value;

  var ok = true;
  if (document.getElementById("registerForms").checkValidity()) {
    if (password != repassword) {
      document.getElementById("passwordReg").style.borderColor = "#E34234";
      document.getElementById("rePasswordReg").style.borderColor = "#E34234";
      alert("Passwords do not match. Please key again.");
      ok = false;
    }
    else if (password == repassword) {
      if (password.length < 8) {
        alert("Passwords too short. At least 8 characters.");
        ok = false;
      }
    }

    if (password.length < 8) {
      alert("Passwords too short. At least 8 characters.");
    }
    else {
      var regData = {
        email: email,
        name: name,
        password: password,
        recaptcha: grecaptcha.getResponse(),
        hostName: window.location.host
      };
      $.ajax({
        data: JSON.stringify(regData),
        dataType: 'json',
        url: '/createAccount/register/',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
          console.log("Account Created for " + data);
          
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          console.log("Status: " + textStatus);
          console.log("Error: " + errorThrown);
        }
      });
    }
  }
});

function logout() {
  sessionStorage.clear();
  window.location.href = '/login.html';
}

function checkSession() {
  var authToken = null;
  var countryPrefix = localStorage.getItem('urlPrefix');
  authToken = sessionStorage.getItem('token');
  if (authToken == null || authToken == "") {
    window.location.href = '/login.html';
  }
  fetch(new Request('/api/checkToken',
    {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + authToken
      }
    })).then(function (response) {
      return response.json();
    }).then(function (data) {
      if (!data.success) {
        window.location.href = '/login.html';
      }
    }).catch(function (error) {
      console.log(error);
    });
}
