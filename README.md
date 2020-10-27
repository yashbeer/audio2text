# audio2text

`audio2text` Converts mp3 audio to text using **Google Speech Recognition.**

---


## Requirements

- node > 10.10.1
- Google Cloud [Speech-to-Text]((https://console.cloud.google.com/apis/library/speech.googleapis.com)) API Credentials
  Download the file [key.json](https://console.cloud.google.com/apis/credentials) of the service account. Note the project id, private key, and client email


## Configuration

To run this project, you'll need to set following environment variables -

`GOOGLE_VOICE2TEXT_PRIVATE_KEY`, `GOOGLE_VOICE2TEXT_CLIENT_EMAIL`, and `GCS_PROJECT_ID`


## Using the library

```
const audio2text = require('audio2text');

const params = {
    url: 'https://storage.googleapis.com/assets.frapp.in/WhatsApp-Ptt-2020-10-16-at-6.02.22-PM.mp3'
}
audio2text.recognize(params).then(transcript => {
	console.log(transcript)
});
```