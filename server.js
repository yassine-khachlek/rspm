
/**
  Copyright(c) 2015 Yassine Khachlek

  @author Yassine Khachlek <yassine.khachlek@gmail.com>
  @version 0.0.1
  @license GPLv2
*/

module.exports = function(appServer) {

  var os = require('os');

  var io = require('socket.io')(appServer);

  var data = function(client){

    client.volatile.emit('data',
        //JSON.stringify(
        {
          //tmpdir: os.tmpdir(),
          //endianness: os.endianness(),
          hostname: os.hostname(),
          type: os.type(),
          platform: os.platform(),
          arch: os.arch(),
          release: os.release(),
          uptime: os.uptime(),
          loadavg: os.loadavg(),
          totalmem: os.totalmem(),
          freemem: os.freemem(),
          cpus: os.cpus(),
          networkInterfaces: os.networkInterfaces(),
          //EOL: os.EOL,
        }
      //  , null, '  ')
    );

  };

  io.on('connection', function (socket) {

    var dataSocketInterval = setInterval(data, 1000, socket);

    socket.on('disconnect', function () {
      clearInterval(dataSocketInterval);
    });

  });

};
