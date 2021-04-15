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
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        var that = this;


        $(document).on('tap','[data-dstpage]', that.buttonClickChangePage.bind(that) )
        $(document).on('tap','[data-action="download-and-play"]', that.testDownloadAndPlayVideo.bind(that) )

        $(document).on('tap','[data-action="reboot-philips-monitor"]', that.testRebootMonitorPhilips.bind(that) )

    }, // onDeviceReady

    buttonClickChangePage: function(event){
        var that = this;
        var button = $(event.target)
        var page = button.attr('data-dstpage')
        that.changePage.call(that,page)
    }, // buttonClickChangePage

    changePage: function( page, options ){
        var that = this;
        options = (typeof options === 'undefined') ? {} : options;
        $(':mobile-pagecontainer').pagecontainer('change', page, options)
    }, // changePage

    testDownloadAndPlayVideo: function( event,  ){
        var that = this;
        var fileTransfer = new FileTransfer();

        that.uiSetProgressbarValue.call(that,0);

        var srcUri = $.mobile.activePage.find('input[name="srcUri"]').val()
        var dstFilename = srcUri.substr(srcUri.lastIndexOf("/")+1);
        var dstPath = cordova.file.dataDirectory + 'Documents/';
        var dstPathFilename = dstPath + dstFilename

        var fnDownloadSuccess = that.testDownloadSuccess.bind(that)
        var fnDownloadError = that.testDownloadSuccess.bind(that)

        fileTransfer.onprogress = that.testDownloadProgress.bind(that)

        fileTransfer.download(srcUri,dstPathFilename,fnDownloadSuccess,fnDownloadError,false,{});
    }, // testDownloadAndPlayVideo

    testDownloadSuccess: function( fileEntry ){
        var that = this;
        var videoUrl = fileEntry.nativeURL

        var options = {
            successCallback: function() {
                console.log("Video was closed without error.");
            }, // successCallback
            errorCallback: function(errMsg) {
                console.log("Error! " + errMsg);
            }, // errorCallback
            orientation: 'portrait', //'landscape'
            shouldAutoClose: true,  // true(default)/false
            controls: false, // true(default)/false. Used to hide controls on fullscreen
            closeOnVideoTouch: true, // true(default)/false
        } // options

        console.log(videoUrl)
        window.plugins.streamingMedia.playVideo(videoUrl,options);
    }, // testDownloadSuccess

    testDownloadError: function( error ){
        var that = this;
        console.log('fnDownloadError')
    }, // testDownloadError

    testDownloadProgress: function( progressEvent ){
        var that = this;
        if ( progressEvent.lengthComputable) {
            var percent = (progressEvent.loaded / progressEvent.total) * 100;
            percent = Math.round(percent);
        }
        else {
            percent++;
        }

        that.uiSetProgressbarValue.call(that,percent);
    }, // testDownloadProgress

    uiSetProgressbarValue: function( percent ){
        var that = this;
        $('.progressbar').attr('data-content',percent+'%');
        var uiProgressbar = $('.progressbar')
        var percentage = percent+'%'
        uiProgressbar.find('.label').html(percentage)
        uiProgressbar.find('.progress').css('width',percentage)
    }, // uiSetProgressbarValue


    testRebootMonitorPhilipsSuccess: function(){
        var that = this;
        console.log('INTENTO DI RIAVVIO INVIATO')
    }, // testRebootMonitorPhilipsSuccess


    testRebootMonitorPhilipsError: function(){
        var that = this;
        console.log('ERRORE!!! INTENTO DI RIAVVIO')
    }, // testRebootMonitorPhilipsSuccess

    testRebootMonitorPhilips: function(event){
        var that = this;

        var intentOptions = {
            action: 'php.intent.action.REBOOT',
            flags: [16777216], // REQUIRED IN ANDROID 8+ Intent.FLAG_RECEIVER_INCLUDE_BACKGROUND - DECIMAL 16777216
            //extras: {}
        } // intentOptions

        var fnIntentSuccess = that.testRebootMonitorPhilipsSuccess.bind(that)
        var fnIntentError = that.testRebootMonitorPhilipsError.bind(that)

        window.plugins.webintent.sendBroadcast( intentOptions, fnIntentSuccess, fnIntentError );
    }, // testRebootMonitorPhilips





};

app.initialize();