const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');
const axios = require('axios');
const AWSXRay = require('aws-xray-sdk-core');
AWSXRay.captureHTTPsGlobal(require('http'));
AWSXRay.captureHTTPsGlobal(require('https'));
 
const SQSQueue = process.env.SQS;
const TeamName = process.env.TeamName;

exports.handler = async (event) => {
    const graphqlEndpoint = "https://spacex-production.up.railway.app/";
    const graphqlQuery = '';
 
    try {
        // Send the request to the GraphQL API

        await sendToSQS("test");
        return response.data;
    } catch (error) {
        console.error("Error calling GraphQL endpoint:", error);
    }
};

async function sendToSQS (message) {
    // SQS
    let messageBodyToSend = {
        Message: message,
        TeamName: process.env.TeamName
    };

    // Create a message to send to SQS (Tip: Look for the things already defined for you at the top :) )
}