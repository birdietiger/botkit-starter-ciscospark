var express = require('express');
var bodyParser = require('body-parser');
var querystring = require('querystring');
var debug = require('debug')('botkit:webserver');

module.exports = function(controller, bot) {


    var webserver = express();
    webserver.use(bodyParser.json({verify: function(req, res, buf, encoding) {
        req.rawBody = buf.toString();
    }}));
    webserver.use(bodyParser.urlencoded({ extended: true }));

    // import express middlewares that are present in /components/express_middleware
    var normalizedPath = require("path").join(__dirname, "express_middleware");
    require("fs").readdirSync(normalizedPath).forEach(function(file) {
        if (file.substring(0,1) == '.')
            return;
        require("./express_middleware/" + file)(webserver, controller);
    });

    webserver.use(express.static('public'));


    webserver.listen(process.env.PORT || 3000, null, function() {

        debug('Express webserver configured and listening at http://localhost:' + process.env.PORT || 3000);

    });

    // import all the pre-defined routes that are present in /components/routes
    var normalizedPath = require("path").join(__dirname, "routes");
    require("fs").readdirSync(normalizedPath).forEach(function(file) {
        if (file.substring(0,1) == '.')
            return;
        require("./routes/" + file)(webserver, controller);
    });

    controller.webserver = webserver;

    return webserver;

}
