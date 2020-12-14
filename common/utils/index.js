const pluginDir = __dirname + '/';
const fs = require('fs');
module.exports = {};
fs.readdirSync(pluginDir).forEach(file => {
    Object.assign(module.exports, require(pluginDir + file));
});

