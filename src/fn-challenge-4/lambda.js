const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const AWSXRay = require('aws-xray-sdk-core');
AWSXRay.captureHTTPsGlobal(require('http'));
AWSXRay.captureHTTPsGlobal(require('https'));

const TeamName = process.env.TeamName;
const MailgunApiKey = process.env.MailgunApiKey;
const MailgunUrl = process.env.MailgunUrl;
const NasaApiKey = process.env.NasaApiKey;

exports.handler = async (event) => {

    try {

        // Step 1: Fetch the APOD (A Picture of the Day) data

        // Step 2: Download APOD

        // Step 3: Save the APOD Image to /tmp

        // Step 4: Read out image and send email

    } catch (err) {
        console.error(err);
    }

};