const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const oAuth2Client = new google.auth.OAuth2(process.env.OAUTH_CLIENT, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token:process.env.REFRESH_TOKEN });

async function getAccessToken(){
    const accessToken = await oAuth2Client.getAccessToken;
    return accessToken;
}

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service:'gmail',
    auth: {
        type:'OAuth2',
        user:'ayushtest935@gmail.com',
        clientId: process.env.OAUTH_CLIENT,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: getAccessToken()
    }
});

module.exports = transporter;