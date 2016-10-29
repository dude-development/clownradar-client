const Koa = require('koa')
const IO = require('koa-socket')
//var bodyParser = require('koa-bodyparser')

const app = Koa()
const radar = new IO()

radar.attach(app)
//io.use(bodyParser())

radar.on('connection', ctx => {
  console.log('[server] connected')
})

const stats = payload => {
  radar.broadcast("stats", payload)
}

let devices = [];
radar.on('disconnect', ctx => {
  const { device_id } = ctx.socket
  if (device_id) {
    console.log(`[server] disconnected: ${device_id}`);
    devices = devices.filter(u => u !== device_id)
    stats({ num_clients: devices.length })
  }
})

const clowns = [1,2,3,4,5].map(clown => ({ device_uid: null, position: randomGeo([50.941301, 6.958106], 500) }))

//Create random lat/long coordinates in a specified radius around a center point
function randomGeo(center, radius) {
    var y0 = center[0];
    var x0 = center[1];
    var rd = radius / 111300; //about 111300 meters in one degree

    var u = Math.random();
    var v = Math.random();

    var w = rd * Math.sqrt(u);
    var t = 2 * Math.PI * v;
    var x = w * Math.cos(t);
    var y = w * Math.sin(t);

    //Adjust the x-coordinate for the shrinking of the east-west distances
    var xp = x / Math.cos(y0);

    var newlat = y + y0;
    var newlon = x + x0;
    var newlon2 = xp + x0;

    return [
      newlat,
      newlon
    ]

    /*return {
        'latitude': newlat.toFixed(5),
        'longitude': newlon.toFixed(5),
        'longitude2': newlon2.toFixed(5),
        'distance': distance(center.latitude, center.longitude, newlat, newlon).toFixed(2),
        'distance2': distance(center.latitude, center.longitude, newlat, newlon2).toFixed(2),
    };*/
}

//Calc the distance between 2 coordinates as the crow flies
function distance(lat1, lon1, lat2, lon2) {
    var R = 6371000;
    var a = 0.5 - Math.cos((lat2 - lat1) * Math.PI / 180) / 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * (1 - Math.cos((lon2 - lon1) * Math.PI / 180)) / 2;
    return R * 2 * Math.asin(Math.sqrt(a));
}

//Generate a number of mappoints
function generateMapPoints(centerpoint, distance, amount) {
    var mappoints = [];
    for (var i=0; i<amount; i++) {
        mappoints.push(randomGeo(centerpoint, distance));
    }
    return mappoints;
}

radar.on("spawn", ctx => {
  const { device_id } = ctx.data
  ctx.socket.device_id = device_id
  devices.push(device_id)
  clowns.forEach(clown => radar.broadcast("spawn", clown))
  stats({ num_clients: devices.length })
})

/*
io.on('login', (ctx, { username }) => {
  console.log(`[server] login: ${username}`);
  usernames.push(username);
  ctx.socket.username = username;

  io.broadcast('users.login', { username });
});

io.on('logout', ctx => {
  const { username } = ctx.socket;
  if (username) {
    console.log(`[server] logout: ${username}`);
    usernames = usernames.filter(u => u !== username)
    delete ctx.socket['username'];

    io.broadcast('users.logout', { username });
  }
});

let messages = [];
io.on('message', (ctx, { text }) => {
  console.log(`[server] message: ${text}`);
  const message = {
    id: messages.length,
    text,
    username: ctx.socket.username,
  };
  messages.push(message);

  io.broadcast('messages.new', { message });
});
*/
app.listen(4000, () => {
  console.log('[server] ready');
});