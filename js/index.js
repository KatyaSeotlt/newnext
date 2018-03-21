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
    detail: false,
    initialize: function() {
        this.bindEvents();

    },
    isAuth: function() {
  //    console.log(window.localStorage.getItem("access"));
       // return !(window.localStorage.getItem("access") === undefined || window.localStorage.getItem("access") === "undefined" || window.localStorage.getItem("access") === null);
       return true;
    },
    isLocal: function(name){
      return !(window.localStorage.getItem(name) === undefined || window.localStorage.getItem(name) === "undefined" || window.localStorage.getItem(name) === null);
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
      if(localStorage.getItem('registrationId')==null){
        var ms = new Date();
        this.registrationId=ms.getTime();
        window.localStorage.setItem("registrationId", this.registrationId);
      }else{
        this.registrationId=localStorage.getItem('registrationId');
      }
      var myData={
        name: $('#name').val(),
        lastname: $('#lastname').val(),
        country: $('#country').val(),
        city: $('#city').val(),
        email: $('#email').val(),
        phone: $('#phone').val(),
        code: this.registrationId,
      }
    //  console.log(myData);
      $.ajax({
                type: "POST",
                xhrFields: {
                    withCredentials: true
                },
                dataType: "json",
                contentType: "application/javascript",
                data:  JSON.stringify(myData),
                url: "http://seotlt:newagspass@crypto.seotlt.ru/newnext/mobile.php",
                success: function (jsonData) {
                  if(jsonData.error==='false'){
                    $('#page-sms-confirm').show();
                    $('#page-signals').hide();
                    $('#page-registr').hide();
                  }else{
                    $('.phoneError').html(msg.error);
                  }
                },
                error: function (request, textStatus, errorThrown) {
                  //  console.log(request.responseText);
                //    console.log(textStatus);
              //      console.log(errorThrown);
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
                data: JSON.stringify(myData),
                url: "http://seotlt:newagspass@crypto.seotlt.ru/newnext/mobile.php",
                success: function (jsonData) {
                  if(jsonData.error==='false'){
                    $('#page-sms-confirm').hide();
                    $('#page-signals').show();
                    $('#page-registr').hide();
                    app.getDataSignals();
                    window.localStorage.setItem("access", 1);
                  }else{
                    $('.signalsError').html(msg.error);
                  }

                },
                error: function (request, textStatus, errorThrown) {
                    // console.log(request.responseText);
                    // console.log(textStatus);
                    // console.log(errorThrown);
                },
                username: app.username,
                password: app.password,
            });
    },
    showDetail: function(id){
      if(app.detail==false){
        app.detail=true;
      $('.signalblock').hide();
      $('#signal'+id).addClass('showDetail');
      $('#signal'+id).show();
      $('#signal'+id+' textLine1 span').removeClass('blueRound');
      localStorage.setItem('signal'+id, 'show');
    }else{
      app.detail=false;
    $('#signal'+id).removeClass('showDetail');
    $('#signal'+id+' textLine1 span').removeClass('blueRound');
    $('.signalblock').show();
    }
    },
    //getData Signal
    getDataSignals:  function(){
      var myData={
        userCode: 'mytest',// this.registrationId,
      };
      $.ajax({
                type: "POST",
                xhrFields: {
                    withCredentials: true
                },
                dataType: "json",
                contentType: "application/javascript",
                data:  JSON.stringify(myData),
                url: "http://seotlt:newagspass@crypto.seotlt.ru/newnext/mobile.php",
                success: function (jsonData) {
                    $('body').addClass('open');
                    var html='';
                    var arrow_type = 'img/arrow_up.png';
                    var color_type = 'greentext';
                    var showSignalsCircle='';

                    for (var i in jsonData.signals){
                       arrow_type = 'img/arrow_up.png';
                       color_type = 'greentext';
                      if(jsonData.signals[i].type=='SHORT'){
                        arrow_type = 'img/arrow_d.png';
                        color_type = 'redtext';
                        }
                    var shareOptions = {
                        title: "SGA cryptotrading Signals",
                        message: jsonData.signals[i].dates+ " "+jsonData.signals[i].times+". "+jsonData.signals[i].doit+" позицию "+jsonData.signals[i].type+". Криптовалютная пара " +jsonData.signals[i].name+ ". Рекомендованная цена "+jsonData.signals[i].price,
                        url: "http://sga.com.ru/sgacryptotrading.php"
                      };
                      var url="https://vk.com/share.php?title="+shareOptions.message+" http://sga.com.ru/sgacryptotrading.php";
                      var okurl="http://ok.ru/dk?st.cmd=addShare&st.s=1&st._surl=http://sga.com.ru/sgacryptotrading.php&st.comments="+shareOptions.message;
                      var twurl="http://twitter.com/share?text="+shareOptions.message+"&url=http://sga.com.ru/sgacryptotrading.php";
                      var fburl="http://www.facebook.com/share.php?u=http://sga.com.ru/sgacryptotrading.php";
                      var fburl2="https://www.facebook.com/dialog/feed?app_id=145634995501895&display=popup&amp;caption="+shareOptions.message+"&link=http://sga.com.ru/sgacryptotrading.php&redirect_uri=http://sga.com.ru/sgacryptotrading.php";


                      if(!app.isLocal('signal'+jsonData.signals[i].id)){showSignalsCircle='blueRound';}
                      html=html+'<div class="signalblock" id="signal'+jsonData.signals[i].id+'" onclick="app.showDetail('+jsonData.signals[i].id+')">'
                      +'<div class="textLine1"><span class="'+showSignalsCircle+'"></span>'+jsonData.signals[i].doit+' позицию</div>'
                      +'<div class="timeLines">'
                        +'<div class="dates"><img src="img/calendar.png" class="imgStyle"/><span class="normalTextBig">'+jsonData.signals[i].dates+'</span> </div>'
                        +'<div class="dates"><img src="img/time.png" class="imgStyle"/><span class="normalTextBig">'+jsonData.signals[i].times+'</span> </div>'
                      +'</div>'
                      + '<div class="openPosition"><span class="normalTextBig">'+jsonData.signals[i].doit+' позицию </span>'
                      + '<div class="'+color_type+'">'+jsonData.signals[i].type+'</div><img src="'+arrow_type+'" class="imgStyleArrow"/></div>'
                      + '<div class="price"><div class="litetext">Криптовалютная пара</div></div>'
                      + '<div class="tiker"><div class="normalTextBigEMitent">'+jsonData.signals[i].name+'</div></div>'
                      + '<div class="price"><div class="litetext">Рекомендованная цена</div></div>'
                      + '<div class="tiker"><div class="normalTextBig">'+jsonData.signals[i].price+'</div></div>'
                      + '<div class="price"><div class="litetext">Тип сигнала</div></div>'
                      + '<div class="tiker"><div class="normalTextBig">'+jsonData.signals[i].type_signal+'</div></div>'
                      + '<div class="detail price"><div class="litetext">Поделиться</div></div>'
                      + '<div class="detail tiker">'
                      +'<div class="shareicons"><a href="'+url+'" target="_system" data-rel="external"><img src="img/vk.png" class="shareicon"/></a></div>'
                      +'<div class="shareicons"><a href="'+twurl+'" target="_system" data-rel="external"><img src="img/tw.png" class="shareicon"/></a></div>'
                      +'<div class="shareicons"><a href="'+okurl+'" target="_system" data-rel="external"><img src="img/ok.png" class="shareicon"/></a></div>'
                      +'</div>'
                      +'</div>';
                    }
                    if(html==''){
                      html='<div class="nodata"><div class="normalTextBig">Сигналов не обнаружено</div></div>';
                    }
                    $('.signal-container').html(html);
                    window.setTimeout(function(){  app.getDataSignals();}, 40000);
                },
                error: function (request, textStatus, errorThrown) {
                    // console.log(request.responseText);
                    // console.log(textStatus);
                    // console.log(errorThrown);
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
        app.registrationId=localStorage.getItem('registrationId');
        if(app.isAuth()){
          $('#page-registr').hide();
          $('#page-sms-confirm').hide();
          app.getDataSignals();
          $('#page-signals').show();
          $('body').addClass('open');
        }else{
          $('#page-sms-confirm').hide();
          $('#page-signals').hide();
          $('#page-registr').show();
        }
    },
    setupPush: function() {
        //console.log('calling push init');
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
        //console.log('after init');

        push.on('registration', function(data) {
          //  console.log('registration event: ' + data.registrationId);

            var oldRegId = localStorage.getItem('registrationId');
            if (oldRegId !== data.registrationId) {
                // Save new registration ID
                localStorage.setItem('registrationId', data.registrationId);

                app.registrationId=data.registrationId;

                var myData={
                  oldApikey: oldRegId,
                  newApikey: data.registrationId,
                };
                $.ajax({
                          type: "POST",
                          xhrFields: {
                              withCredentials: true
                          },
                          dataType: "json",
                          contentType: "application/javascript",
                          data: JSON.stringify(myData),
                          url: "http://seotlt:newagspass@crypto.seotlt.ru/newnext/mobile.php",
                          success: function (jsonData) {},
                          error: function (request, textStatus, errorThrown) {},
                          username: app.username,
                          password: app.password,
                      });
            }

        });

        push.on('error', function(e) {
        //    console.log("push error = " + e.message);
        });

        push.on('notification', function(data) {
        //    console.log('notification event');
            navigator.notification.alert(
                data.message,         // message
                null,                 // callback
                data.title,           // title
                'Ok'                  // buttonName
            );
             app.getDataSignals();
       });
    }
};
