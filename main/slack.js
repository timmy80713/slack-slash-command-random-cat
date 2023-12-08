'use strict';

const { verifyRequestSignature } = require('@slack/events-api');

function verify(req) {
    if (req.method !== 'POST') {
        throw new Error('Only POST requests are accepted');
    }
    const teamId = req.body.team_id;
    if (teamId !== "T03180XEC") {
        throw new Error('You cannot use this slash command in this Slack team.');
    }
    const userId = req.body.user_id;
    const userWhitelist = ["U025MBKQ8QJ"];
    if (!userWhitelist.includes(userId)) {
        throw new Error('You cannot use this slash command.');
    }
    const signature = {
        signingSecret: process.env.SLACK_SIGNING_SECRET_RANDOM_CAT,
        requestSignature: req.headers['x-slack-signature'],
        requestTimestamp: req.headers['x-slack-request-timestamp'],
        body: req.rawBody,
    };
    verifyRequestSignature(signature);
}

module.exports = {
    verify
};