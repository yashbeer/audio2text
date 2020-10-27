const path = require('path');
const axios = require('axios');
const settings = require('./settings');

module.exports = {
    // Input:  url
    // Output: text
    recognize: function(params) {
        return new Promise(async (resolve, reject) => {
            
            if(!settings.validate_credentials()) {
                reject({error:'GCS Credentials not provided'});
            }
            
            // Imports the Google Cloud client library
            const speech = require('@google-cloud/speech');
            const fs = require('fs');
            
            // Creates a client
            const client = new speech.SpeechClient({
                projectId: process.env.GCS_PROJECT_ID,
                keyFilename: path.resolve(__dirname,'audio2text-gcs-keys.json')
            });
            
            // Fetch audio from a hosted url
            try {
                var audioBytes =  await  axios.get(params.url, {
                    responseType: 'arraybuffer'
                })
                .then(response => new Buffer.from(response.data, 'binary').toString('base64'))
                
            } catch (e) {
                return {error: e};
            }
            
            // Reads a local audio file and converts it to base64
            //const fileName = path.resolve(__dirname, 'a06959ab7c89fa7b88e0bdff26081492.mp3');
            //const file = fs.readFileSync(fileName);
            //const audioBytes = file.toString('base64');
            
            // The audio file's encoding, sample rate in hertz, and BCP-47 language code
            const audio = {
                content: audioBytes,
            };
            const config = {
                encoding: 'MP3',
                sampleRateHertz: 8000,
                languageCode: 'en-IN',
            };
            const request = {
                audio: audio,
                config: config,
            };
            
            // Detects speech in the audio file
            const [response] = await client.recognize(request);
            const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');
            
            //console.log(`Transcription: ${transcription}`);
            
            resolve(transcription);
        })
    }
    
}