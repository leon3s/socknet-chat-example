const app = require('express')();
const http = require('http').Server(app);
const socknet = require('socknet').default(http);
// ArgTypes validator like react prop-types
const ArgTypes = require('socknet').ArgTypes;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

socknet.on({
  config: {
    return: true,
    route: '/message',
    args: {
      // Be sure message is a non empty string.
      message: ArgTypes.string.isRequired,
    },
  },
  on(socket, args, next) {
    // broadcast new message to all connected sockets
    socknet.io.emit('message/new', args.message);
    // Send response to client emiting the event
    next();
  }
});

http.listen(3000, () => {
  console.log('http listening on *:3000');
  socknet.listen(() => {
    console.log('socknet event listening');
  });
});
