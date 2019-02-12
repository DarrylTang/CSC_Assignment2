grecaptcha.ready(function () {
  grecaptcha.execute('6LdR0ZAUAAAAAP41YPC9xj7dncGCAJGuT1CMnrqi', { action: 'homepage' }).then(function (token) {
  });
});

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
      fetch(new Request('/api/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(regData)
        })).then(function (response) {
          return response.json();
        }).then(function (data) {
          if (!data.success) {
            alert(data.errorMsg);
          }
          else {
            alert('You have registered successfully. A link will be sent to your email for you to activate your account.');
          }
        }).catch(function (error) {
          console.log(error);
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
