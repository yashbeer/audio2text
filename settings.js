const path = require('path');
const fs = require('fs');

module.exports = function () {
    if(process.env.hasOwnProperty('GCS_PRIVATE_KEY') && process.env.hasOwnProperty('GCS_CLIENT_EMAIL')) {
        fs.writeFileSync(path.resolve(__dirname,'audio2text-gcs-keys.json'),`{"private_key":${JSON.stringify(process.env.GCS_PRIVATE_KEY)},"client_email":${JSON.stringify(process.env.GCS_CLIENT_EMAIL)}}`);
        return true;
    }
    else if(process.env.hasOwnProperty('GOOGLE_VOICE2TEXT_PRIVATE_KEY') && process.env.hasOwnProperty('GOOGLE_VOICE2TEXT_CLIENT_EMAIL')) {
        fs.writeFileSync(path.resolve(__dirname,'audio2text-gcs-keys.json'),JSON.stringify(`{"private_key":"${process.env.GOOGLE_VOICE2TEXT_PRIVATE_KEY}","client_email":"${process.env.GOOGLE_VOICE2TEXT_CLIENT_EMAIL}"}`));
        return true;
    }
    else {
        return false;
    }
}();