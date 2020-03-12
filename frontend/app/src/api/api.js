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

    }

    module.addUser = function(username) {
        axios.post('/username',{
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

    }

    module.vote = function(option) {
        axios.post('/vote',{
            params: {
              ID: username,
              vote: option
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

    }
    
    return module;
});