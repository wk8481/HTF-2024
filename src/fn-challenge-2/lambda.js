const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');
const axios = require('axios');
const AWSXRay = require('aws-xray-sdk-core');
AWSXRay.captureHTTPsGlobal(require('http'));
AWSXRay.captureHTTPsGlobal(require('https'));

const SQSQueue = process.env.SQS;
const TeamName = process.env.TeamName;

exports.handler = async (event) => {
    const graphqlEndpoint = "https://spacex-production.up.railway.app/";
    const graphqlQuery = 'query findFirstLaunchpadandLandPadById {\n' +
        '  launchpads(limit: 1) {\n' +
        '    id\n' +
        '    name\n' +
        '  }\n' +
        '  landpad(id: "5e9e3032383ecb90a834e7c8") {\n' +
        '    id\n' +
        '    full_name\n' +
        '  }\n' +
        '}';

    try {
        // Send the request to the GraphQL API
        const response = await axios.post(graphqlEndpoint, { query: graphqlQuery });
        await sendToSQS("test");
        return response.data;
    } catch (error) {
        console.error("Error calling GraphQL endpoint:", error);
    }
};

async function sendToSQS(message) {
    // SQS
    let messageBodyToSend = {
        Message: message,
        TeamName: TeamName
    };

    // Create an SQS client
    const sqsClient = new SQSClient();

    // Create a message to send to SQS
    const params = {
        QueueUrl: SQSQueue,
        MessageBody: JSON.stringify(messageBodyToSend)
    };

    try {
        const data = await sqsClient.send(new SendMessageCommand(params));
        console.log("Message sent to SQS:", data);
    } catch (err) {
        console.error("Error sending message to SQS:", err);
    }
}