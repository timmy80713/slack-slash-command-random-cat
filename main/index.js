'use strict';

const axios = require('axios');
const functions = require('@google-cloud/functions-framework');
const slack = require('./slack');

functions.http('fetchRandomCat', (req, res) => {
    console.log('The service has started.');
    console.log('Request headers ==> ', req.headers);
    console.log('Request body ==> ', req.body);

    try {
        slack.verify(req);
    } catch (error) {
        console.log('Slack verify failed.');
        console.log(error.message);
        res.status(200).send(error.message);
        return;
    }

    const slackPayload = {
        response_type: 'ephemeral',
        text: `Please wait a moment.`
    };
    res.status(200).send(slackPayload);

    const responseUrl = req.body.response_url;

    axios.get('https://api.thecatapi.com/v1/images/search')
        .then((response) => {
            const data = response.data
            console.log('Fetch random cat succeeded.', data)
            const slackPayload = {
                response_type: 'in_channel',
                blocks: [
                    {
                        type: 'image',
                        image_url: data[0].url,
                        alt_text: 'meow'
                    }
                ]
            }
            axios.post(responseUrl, JSON.stringify(slackPayload), {
                headers: { 'Content-Type': 'application/json' }
            }).then((response) => {
                console.log(`Send Slack message succeeded, response => ${response}`);
            }).catch((error) => {
                console.log(`Send Slack message failed, error => ${error.message}`);
            })
        })
        .catch((e) => {
            console.log('Fetch random cat failed', e)
        })
});