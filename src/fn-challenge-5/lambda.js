const axios = require('axios');
const AWSXRay = require('aws-xray-sdk-core');
AWSXRay.captureHTTPsGlobal(require('http'));
AWSXRay.captureHTTPsGlobal(require('https'));
const { S3Client, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
const { Readable } = require('stream');

// Environment variables
const geminiApiKey = process.env.GeminiApiKey;
const s3Bucket = process.env.S3Bucket;

exports.handler = async (event) => {
    try {
        // Step 1: List objects in S3 bucket
        const s3Client = new S3Client();
        const listObjectsParams = {
            Bucket: s3Bucket,
            MaxKeys: 1
        };
        const listObjectsData = await s3Client.send(new ListObjectsV2Command(listObjectsParams));
        if (listObjectsData.Contents.length === 0) {
            console.log('No files found in the bucket.');
            return;
        }

        // Step 2: Retrieve the first text file from S3
        const firstObjectKey = listObjectsData.Contents[0].Key;
        const getObjectParams = {
            Bucket: s3Bucket,
            Key: firstObjectKey
        };
        const data = await s3Client.send(new GetObjectCommand(getObjectParams));
        const fileContent = await streamToString(data.Body);

        // Step 3: Print the content of the first text file
        console.log('Content of the first text file:', fileContent);

        // Step 4: Analyze content using Google Generative AI
        let isSafe;
        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`,
                {
                    contents: [{ parts: [{ text: fileContent }] }]
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            isSafe = response.data.contents[0].parts[0].text.includes('safe for passage');
        } catch (apiError) {
            console.error('Gemini API error:', apiError.message || apiError);
            // Fallback decision
            isSafe = false; // Default to not safe for passage
        }

        // Step 5: Print the AI analysis result
        console.log('Is the content safe for passage?', isSafe ? 'Yes' : 'No');
    } catch (err) {
        console.error('Error occurred:', err.message || err);
    }
};

// Helper function to convert stream to string
const streamToString = (stream) => {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        stream.on('error', reject);
    });
};