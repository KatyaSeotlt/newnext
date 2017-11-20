/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    username: "seotlt",
    password: "newagspass",
    registrationId: "mytest",
    initialize: function() {
        this.bindEvents();

    },
    isAuth: function() {
      return !(window.localStorage.getItem("access") === undefined || window.localStorage.getItem("access") === "undefined" || window.localStorage.getItem("access") === null);
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    //registration User
    registrationUser: function(){

      var myData={
        name: $('#name').val(),
        lastname: $('#lastname').val(),
        country: $('#country').val(),
        city: $('#city').val(),
        email: $('#email').val(),
        phone: $('#phone').val(),
        code: this.registrationId,
      }
      $.ajax({
                type: "POST",
                xhrFields: {
                    withCredentials: true
                },
                dataType: "json",
                contentType: "application/javascript",
                data: myData,
                url: "http://seotlt:newagspass@crypto.seotlt.ru/newnext/mobile.php",
                success: function (jsonData) {
                    console.log(jsonData);
                },
                error: function (request, textStatus, errorThrown) {
                    console.log(request.responseText);
                    console.log(textStatus);
                    console.log(errorThrown);
                },
                username: app.username,
                password: app.password,
            });
    },
      //registration User
    confirmRegistrationUser:  function(){
      var myData={
        smscode: $('#confirmSms').val(),
        codes: this.registrationId,
      };
      $.ajax({
                type: "POST",
                xhrFields: {
                    withCredentials: true
                },
                dataType: "json",
                contentType: "application/javascript",
                data: myData,
                url: "http://seotlt:newagspass@crypto.seotlt.ru/newnext/mobile.php",
                success: function (jsonData) {
                    console.log(jsonData);
                    window.localStorage.setItem("access", 1);
                },
                error: function (request, textStatus, errorThrown) {
                    console.log(request.responseText);
                    console.log(textStatus);
                    console.log(errorThrown);
                },
                username: app.username,
                password: app.password,
            });
    },
    //getData Signal
    getDataSignals:  function(){
      var myData={
        userCode: this.registrationId,
      };
      $.ajax({
                type: "POST",
                xhrFields: {
                    withCredentials: true
                },
                dataType: "json",
                contentType: "application/javascript",
                data: myData,
                url: "http://seotlt:newagspass@crypto.seotlt.ru/newnext/mobile.php",
                success: function (jsonData) {
                    console.log(jsonData);
                    var html='';
                      $('#page-signals').html(html);
                },
                error: function (request, textStatus, errorThrown) {
                    console.log(request.responseText);
                    console.log(textStatus);
                    console.log(errorThrown);
                },
                username: app.username,
                password: app.password,
            });
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.setupPush();
        this.registrationId=localStorage.getItem('registrationId');
        if(app.isAuth()){
          $('#page-registr').hide();
          $('#page-sms-confirm').hide();
          app.getDataSignals();
          $('#page-signals').show();
        }else{
          $('#page-sms-confirm').hide();
          $('#page-signals').hide();
          $('#page-registr').show();
        }
    },
    setupPush: function() {
        console.log('calling push init');
        var push = PushNotification.init({
            "android": {
                "senderID": "460180288949"
            },
            "browser": {},
            "ios": {
                "sound": true,
                "vibration": true,
                "badge": true
            },
            "windows": {}
        });
        console.log('after init');

        push.on('registration', function(data) {
            console.log('registration event: ' + data.registrationId);

            var oldRegId = localStorage.getItem('registrationId');
            if (oldRegId !== data.registrationId) {
                // Save new registration ID
                localStorage.setItem('registrationId', data.registrationId);
                // Post registrationId to your app server as the value has changed
            }

            // var parentElement = document.getElementById('registration');
            // var listeningElement = parentElement.querySelector('.waiting');
            // var receivedElement = parentElement.querySelector('.received');
            //
            // listeningElement.setAttribute('style', 'display:none;');
            // receivedElement.setAttribute('style', 'display:block;');
        });

        push.on('error', function(e) {
            console.log("push error = " + e.message);
        });

        push.on('notification', function(data) {
            console.log('notification event');
            navigator.notification.alert(
                data.message,         // message
                null,                 // callback
                data.title,           // title
                'Ok'                  // buttonName
            );
       });
    }
};
