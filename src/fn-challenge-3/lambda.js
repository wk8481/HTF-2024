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
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        // Connect to the FTP server
        await client.access({
            host: "ftp.swpc.noaa.gov",
            user: "anonymous",
            password: "guest",
            secure: false
        });
        console.log("Connected to FTP server");

        // List files in the directory
        const list = await client.list("/pub/forecasts/geomag_forecast");
        if (list.length === 0) {
            throw new Error("No files found in the directory");
        }

        // Find the most recently modified file
        const latestFile = list.reduce((latest, file) => {
            return file.modified > latest.modified ? file : latest;
        });
        console.log("Latest file:", latestFile.name);

        // Download the latest file to /tmp directory
        const localFilePath = path.join("/tmp", latestFile.name);
        await client.downloadTo(localFilePath, `/pub/forecasts/geomag_forecast/${latestFile.name}`);
        console.log("File downloaded to:", localFilePath);

        // Upload file content to S3
        const s3Client = new S3Client();
        const fileContent = fs.readFileSync(localFilePath);
        const uploadParams = {
            Bucket: S3Bucket,
            Key: `${TeamName}/${latestFile.name}`,
            Body: fileContent
        };
        await s3Client.send(new PutObjectCommand(uploadParams));
        console.log("File downloaded and uploaded to S3");
    } catch (err) {
        console.error("Error:", err);
    } finally {
        client.close();
    }
};