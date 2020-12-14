import Client, { Server } from "nextcloud-node-client";
let _configs = require('../../config/preferences');

const server = new Server(
  {
    basicAuth:
    {
      password: _configs.nextcloud.pwd,
      username: _configs.nextcloud.usr,
    },
    url: "http://192.168.3.179:8080/remote.php/webdav",
  });

const nextClient = new Client(server);
export default nextClient