
/**
  Copyright(c) 2015 Yassine Khachlek

  @author Yassine Khachlek <yassine.khachlek@gmail.com>
  @version 0.0.2
  @license GPLv2
*/

module.exports = function(appServer) {

  var os = require('os');

  var io = require('socket.io')(appServer);

  var clients = [];

  var dataOsEmitter = function (clientId) {

    var data = {
          //tmpdir: os.tmpdir(),
          //endianness: os.endianness(),
          hostname: os.hostname(),
          type: os.type(),
          platform: os.platform(),
          arch: os.arch(),
          release: os.release(),
          //uptime: os.uptime(),
          //loadavg: os.loadavg(),
          //totalmem: os.totalmem(),
          //freemem: os.freemem(),
          //cpus: os.cpus(),
          //networkInterfaces: os.networkInterfaces(),
          //EOL: os.EOL,
        };

    /**
      Emit only when there is a difference
    */
    if( JSON.stringify(data, null,'') != JSON.stringify(clients[clientId].data.os, null,'') ){
      clients[clientId].data.os = data;
      //client.volatile.emit('dataOs', data);
      clients[clientId].socket.emit('dataOs', clients[clientId].data.os);
    }

  };

  var dataCpusEmitter = function (clientId) {

    var data = {
          cpus: os.cpus(),
        };

    /**
    Add cpus number
    */
    var id = 0;
    for(var cpus in data.cpus){
        data.cpus[cpus].id = id;
        id++;
    }
    
    /**
      Emit only when there is a difference with last data
    */
    if( JSON.stringify(data, null,'') != JSON.stringify(clients[clientId].data.cpus, null,'') ){
      clients[clientId].data.cpus = data;
      //client.volatile.emit('dataCpus', data);
      clients[clientId].socket.emit('dataCpus', clients[clientId].data.cpus);
    }

  };

  var dataNetworkInterfacesEmitter = function (clientId) {

    var data = {
          networkInterfaces: os.networkInterfaces(),
        };
    
    /**
      Emit only when there is a difference with last data
    */
    if( JSON.stringify(data, null,'') != JSON.stringify(clients[clientId].data.networkInterfaces, null,'') ){
      clients[clientId].data.networkInterfaces = data;
      //client.volatile.emit('dataCpus', data);
      clients[clientId].socket.emit('dataNetworkInterfaces', clients[clientId].data.networkInterfaces);
    }

  };

  var dataRamEmitter = function (clientId) {

    var data = {
          totalmem: os.totalmem(),
          freemem: os.freemem(),          
        };
    
    /**
      Emit only when there is a difference with last data
    */
    if( JSON.stringify(data, null,'') != JSON.stringify(clients[clientId].data.ram, null,'') ){
      clients[clientId].data.ram = data;
      //client.volatile.emit('dataCpus', data);
      clients[clientId].socket.emit('dataRam', clients[clientId].data.ram);
    }

  };

  /**
    Clear client interval dataEmitter
  */
  var clearDataEmitter = function (clientId, dataEmitter) {
    clearInterval(clients[clientId].interval.dataEmitter[dataEmitter]);
  };

  /**
    Client connection event
  */
  io.on('connection', function (socket) {

    /**
      Set the new client id
    */
    var clientId = new Date().getTime();

    /**
      Set the client data
    */
    clients[clientId] = {};

    /**
    Add necessary client data
    */
    clients[clientId].socket = socket; // socket
    clients[clientId].interval = {}; // intervals
    clients[clientId].interval.dataEmitter = {}; // dataEmitter
    clients[clientId].interval.dataEmitter = {}; // dataEmitter

    clients[clientId].data = {}; // data to hold last data value
    clients[clientId].data.os = {};
    clients[clientId].data.cpus = {};
    clients[clientId].data.networkInterfaces = {};
    clients[clientId].data.ram = {};

    /**
      Set the client different dataEmitter interval
    */
    clients[clientId].interval.dataEmitter.os = setInterval(dataOsEmitter, 1000, clientId);
    clients[clientId].interval.dataEmitter.cpus = setInterval(dataCpusEmitter, 1000, clientId);
    clients[clientId].interval.dataEmitter.networkInterfaces = setInterval(dataNetworkInterfacesEmitter, 1000, clientId);
    clients[clientId].interval.dataEmitter.ram = setInterval(dataRamEmitter, 1000, clientId);

    /**
      disconnect client event
    */
    socket.on('disconnect', function () {
      
      /**
        Clear all the client interval emitters
      */
      for(var dataEmitter in clients[clientId].interval.dataEmitter){
        clearDataEmitter(clientId, dataEmitter);
      }

      /**
        Delete the client data
      */
      delete clients[clientId];

    });

  });

};
