var _ = require('underscore');

exports.get = function (req, res) {

    var http = require('http');
    http.get('http://www.bloomberg.com/markets/chart/data/1Y/USDARS:CUR', function(response) {
        var body = '';
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            body += chunk;
        });
        response.on('end', function() {
            var data = JSON.parse(body);
            data = _(data.data_values).map(function (tick) {
                return {
                    created: tick[0],
                    price: tick[1]
                };
            });
            data = _(data).sortBy(function (o) { return -o.created; });
            res.send({ data: data });
        });
    }).on('error', function(e) {
        res.send({ error: true });
    });

};
