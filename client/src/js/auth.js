'use strict';

import config from './config.json';

const authUser = (email, pass, callback) => {
 $.ajax({
    type: 'POST',
    url: `${config.ENDPOINT}/login`,
    data: JSON.stringify({
      username: email,
      password: pass
    }),

    contentType: "application/json",

    success: function(data) {
      if (data.authenticated) {
        $.ajaxSetup({
          headers: { 
            'Authorization': data.token
          }
        });

        callback({
          authenticated: true,
          token: data.token
        });
      } else {
        callback({
          authenticated: false
        });
      }
    },
    error: function() {
      callback({
        authenticated: false
      });
    }
  });
};

module.exports = {
  login(email, pass, cb) {
    cb = arguments[arguments.length - 1]
    if (localStorage.token) {
      if (cb) cb(true)
      this.onChange(true)
      return
    }

    authUser(email, pass, (res) => {
      if (res.authenticated) {
        localStorage.token = res.token

        if (cb) cb(true)
        this.onChange(true)
      } else {
        if (cb) cb(false)
        this.onChange(false)
      }
    })
  },

  getToken() {
    return localStorage.token
  },

  logout(cb) {
    delete localStorage.token
    
    if (cb) cb()
    this.onChange(false)
  },

  loggedIn() {
    return !!localStorage.token
  },

  onChange() {}
}