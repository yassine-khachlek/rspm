    /**
    Default hostname & port
    */
    var protocol = window.location.protocol;
    var hostname = window.location.hostname;
    var port = 3000;

    /**
    NOT WORKING ON HTTPS, WILL VERIFY THIS LATER
    AT THE MOMENT JUST REDIRECT TO HTTP.
    */
    if( window.location.protocol!='http:' ){
      window.location = 'http://' + window.location.host;
    }

    /**
     Just for heroku app demo, need to change the port to 80
    */
    if( hostname.indexOf('herokuapp.com') >= 0 ){
      port = 80;
    }

    /**
    Connect to ws server
    */
    var socket = io.connect(protocol + '//' + hostname + ':' + port);

    /**
     Connect event
    */
    socket.on('connect', function () {
    
      var tpl = $('#connect-template').html();

      var connectData = {
        connectionStateColor: 'success',
        connectionState: 'Connected',
        connectionInfo: new Date().toISOString().replace(/Z|T/gi, ' ').split('.')[0],
      }

      var rendered = Mustache.render(tpl, connectData);

      $('#connect-container').html(rendered);

    });

    socket.on('disconnect', function () {
    
      var tpl = $('#connect-template').html();

      var connectData = {
        connectionStateColor: 'danger',
        connectionState: 'Disconnected',
        connectionInfo: new Date().toISOString().replace(/Z|T/gi, ' ').split('.')[0],
      }

      var rendered = Mustache.render(tpl, connectData);

      $('#connect-container').html(rendered);

    });

    socket.on('reconnect_attempt', function (data) {
    
      var tpl = $('#connect-template').html();

      var connectData = {
        connectionStateColor: 'warning',
        connectionState: 'Reconnect attempt',
        connectionInfo: data,
      }

      var rendered = Mustache.render(tpl, connectData);

      $('#connect-container').html(rendered);

    });

    socket.on('reconnect_error', function (data) {
    
      var tpl = $('#connect-template').html();

      var connectData = {
        connectionStateColor: 'danger',
        connectionState: 'Reconnect failed',
        connectionInfo: data,
      }

      var rendered = Mustache.render(tpl, connectData);

      $('#connect-container').html(rendered);

    });

    /**
      dataOs event
    */
    socket.on('dataOs', function (dataOs) {
    
      var tpl = $('#dataOsTemplate').html();

      dataOs.lastChanged = new Date().toISOString().replace(/Z|T/gi, ' ').split('.')[0];

      var rendered = Mustache.render(tpl, dataOs);

      $('#data-os-container').html(rendered);

    });

    /**
      dataCpus event
    */
    socket.on('dataCpus', function (dataCpus) {

      var tpl = $('#dataCpusTemplate').html();

      dataCpus.lastChanged = new Date().toISOString().replace(/Z|T/gi, ' ').split('.')[0];
      dataCpus.count = function() { return this.cpus.length; }

      var rendered = Mustache.render(tpl, dataCpus);

      $('#data-cpus-container').html(rendered);

    });

    /**
      dataNetworkInterfaces event
    */
    socket.on('dataNetworkInterfaces', function (dataNetworkInterfaces) {

      var tpl = $('#dataNetworkInterfacesTemplate').html();

      var mustacheFormattedData = {
          'networkInterfaces': [],
          'interfaces': [],
      };

      for (var prop in dataNetworkInterfaces) {
        mustacheFormattedData.networkInterfaces.push({key: prop, value: dataNetworkInterfaces[prop]});
        for (var prop1 in dataNetworkInterfaces[prop]) {
          mustacheFormattedData.interfaces.push(({key: prop1, value: dataNetworkInterfaces[prop][prop1]}));
        }
      }

      mustacheFormattedData.lastChanged = new Date().toISOString().replace(/Z|T/gi, ' ').split('.')[0];

      var rendered = Mustache.render(tpl, mustacheFormattedData);

      $('#data-networkInterfaces-container').html(rendered);

    });    
