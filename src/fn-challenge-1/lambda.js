const morse = require('morse');
const axios = require('axios');
const AWSXRay = require('aws-xray-sdk-core');
AWSXRay.captureHTTPsGlobal(require('http'));
AWSXRay.captureHTTPsGlobal(require('https'));

/*
 * The first one should be fairly easy.
 * Good luck!
 */

const TeamName = process.env.TeamName;
const DiscordWebhook = process.env.DiscordWebhook;

exports.handler = async (event) => {
    // Log the incoming event
    console.log(JSON.stringify(event));

    // Retrieve the encoded message from the event
    let encodedMessage = "-.-. --- -. --. .-. .- - ..- .-.. .- - .. --- -. ... --..-- / -.-- --- ..- / -- .- -. .- --. . -.. / - --- / -.. . -.-. --- -.. . / - .... .. ... / -- . ... ... .- --. . .-.-.- / .. ..-. / -.-- --- ..- / ..-. .. -. -.. / .- / .-- .- -.-- / - --- / ... . -. -.. / - .... .. ... / - --- / -.-- --- ..- .-. / ... .--. .- -.-. . ... .... .. .--. .----. ... / . -. - .. .-. . / - . .- -- / ...- .. .- / -.. .. ... -.-. --- .-. -.. / .-. . .-.. .. .- -... .-.. -.-- --..-- / -.-- --- ..- / .... .- ...- . / -.-. --- -- .--. .-.. . - . -.. / .-.. . ...- . .-.. / .---- / .- -. -.. / -.-. .- -. / -. --- .-- / .--. .-. --- -.-. . . -.. .-.-.-";
    
    try {
        // Decode your message
        let decodedMessage = morse.decode(encodedMessage);

        // Send to Discord
        await sendMessageToDiscord(decodedMessage)
    } catch (err) {
        console.error(err);
    }

};

async function sendMessageToDiscord(message) {
    // Send "${TeamName}: ${message}"
    const discordMessage = `${TeamName}: ${message}`;
    const response = await axios.post(DiscordWebhook, {
        content: discordMessage
    });
    console.log(response.data);
}