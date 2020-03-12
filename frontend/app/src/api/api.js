let api = (function(){
    "use strict";
    const axios = require('axios').default;

    let module = {}

    module.signup = function(username, password) {
        axios.post('/username', {
            username: username,
            password: password
          })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
        this.onlogin(username, password);
    }

    module.signin = function(username, password) {
        axios.get('/username',{
            params: {
              ID: username
            }
        })
        .then(function (response) {
            // handle success
            console.log(response);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });

        this.onlogin(username, password);
    }

    
    return module;
});