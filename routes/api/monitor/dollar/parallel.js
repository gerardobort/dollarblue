var Twit = require('twit');
var T = new Twit({
    consumer_key: config.twitter.consumer_key,
    consumer_secret: process.env.AD_TWITTER_CS,
    access_token: config.twitter.access_token,
    access_token_secret: process.env.AD_TWITTER_TS,
})
var _ = require('underscore');

exports.get = function (req, res) {

    // https://dev.twitter.com/docs/api/1/get/statuses/public_timeline
    T.get('/statuses/user_timeline', { screen_name: 'DolarBlue', trim_user: true, include_entities: false, count: 200 }, function(err, data) {
        data = _(data).map(function (tweet) {
            return {
                created: new Date(tweet.created_at).getTime(),
                price: parseFloat(tweet.text.replace(/^.*?\$/, '').replace(',', '.'), 10)
            };
        });
        data = _(data).sortBy(function (o) { return -o.created; });
        res.send({ data: data });
    })

};
