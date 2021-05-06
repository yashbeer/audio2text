const path = require('path');
const axios = require('axios');
const settings = require('./settings');

module.exports = {
    // Input:  url
    // Output: text
    recognize: function(params) {
        return new Promise(async (resolve, reject) => {
            try
            {
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
                // console.log(params)
                const config = {
                    encoding: 'MP3',
                    sampleRateHertz: 8000,
                    languageCode: 'en-IN',
                };
                let transcription,runningLength='short';
                /*
                    ---params----
                    url:normal or google cloud url
                    runningLength:short,long
                */
                // Fetch audio from a hosted url

                //if duration is gt 60 seconds use async flow or else use sync flow
                if(params.runningLength)runningLength=params.runningLength;
                if(runningLength==='short')
                {
                    //sync flow
                    var audioBytes =  await  axios.get(params.url, {
                        responseType: 'arraybuffer'
                    })
                    .then(response => new Buffer.from(response.data, 'binary').toString('base64'));
                    const audio = {content: audioBytes};
                
                    const request = {
                        audio: audio,
                        config: config
                    };
            
                    // Detects speech in the audio file
                    const [response] = await client.recognize(request);
                    transcription = response.results
                    .map(result => result.alternatives[0].transcript)
                    .join('\n');
                }
                else
                {
                    //async flow
                    const audio = {uri: params.url};

                    const request = {
                      config: config,
                      audio: audio
                    };
                    // Detects speech in the audio file. This creates a recognition job that you
                    // can wait for now, or get its result later.
                    const [operation] = await client.longRunningRecognize(request);
                    // Get a Promise representation of the final result of the job
                    const [response] = await operation.promise();
                    transcription = response.results
                      .map(result => result.alternatives[0].transcript)
                      .join('\n');
                }
                resolve(transcription);
            }
            catch(error)
            {
                reject(error);
            }
        })
    }
}