const ftp = require('basic-ftp');
const path = require('path');
const fs = require('fs');
const AWSXRay = require('aws-xray-sdk-core');
AWSXRay.captureHTTPsGlobal(require('http'));
AWSXRay.captureHTTPsGlobal(require('https'));
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const TeamName = process.env.TeamName;
const S3Bucket = process.env.S3Bucket;

exports.handler = async (event) => {
    // Just a suggestion, you can do another way if you like
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        // Connect to the FTP server
        console.log("Connected to FTP server");

        // List files in the directory
        
        // Find the most recently modified file
        console.log("Latest file:", null);

        // Download the latest file to /tmp directory
        console.log("File downloaded to:", '/tmp/TeamName.txt');

        // Upload file content to S3
        console.log("File downloaded and uploaded to S3");
    } catch (err) {
        console.error("Error :", err);
    }

    // If using a client, don't forget to close your connection!
};