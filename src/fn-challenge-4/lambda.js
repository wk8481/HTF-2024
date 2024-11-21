const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const TeamName = process.env.TeamName;
const MailgunApiKey = process.env.MailgunApiKey;
const MailgunDomain = process.env.MailgunDomain;  // Example: 'sandbox-123.mailgun.org'
const NasaApiKey = process.env.NasaApiKey;

exports.handler = async (event) => {
    try {
        // Fetch the APOD data
        const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${NasaApiKey}`);

        // Download the APOD image URL and retrieve the date
        const url = response.data.url;
        const date = response.data.date;
        const imageResponse = await axios.get(url, { responseType: 'stream' });

        // Save the APOD Image to /tmp
        const imagePath = `/tmp/apod_${date}_${TeamName}.jpg`;
        const writer = fs.createWriteStream(imagePath);
        imageResponse.data.pipe(writer);

        // Wait for the download to complete and save the image
        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        console.log(`Image saved at: ${imagePath}`);

        // Send email using Mailgun API
        const form = new FormData();
        form.append('from', `${TeamName} <mailgun@${MailgunDomain}>`);
        form.append('to', 'william.kasasa@student.kdg.be');
        form.append('subject', 'APOD - Picture of the Day');
        form.append('text', 'Here is the APOD for today');
        form.append('attachment', fs.createReadStream(imagePath));

        // Post the email using axios
        const mailgunResponse = await axios.post(`https://api.mailgun.net/v3/${MailgunDomain}/messages`, form, {
            headers: {
                ...form.getHeaders(),
                'Authorization': `Basic ${Buffer.from(`api:${MailgunApiKey}`).toString('base64')}`,
                'Host': `api.mailgun.net`
            }
        });

        console.log('Email sent successfully:', mailgunResponse.data);
    } catch (err) {
        console.error('Error occurred:', err);
    }
};
