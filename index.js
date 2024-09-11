require('@tensorflow/tfjs');

const express = require("express");
const app = express();
const pitch_type = require('./pitch_type');
const bodyParser = require('body-parser');

const TIMEOUT_BETWEEN_EPOCHS_MS = 500;
const PORT = 8001 || process.env.PORT;

async function train() {
    let numTrainingIterations = 10;
  for (var i = 0; i < numTrainingIterations; i++) {
    console.log(`Training iteration : ${i+1} / ${numTrainingIterations}`);
    await pitch_type.model.fitDataset(pitch_type.trainingData, {epochs: 1});
    console.log('accuracyPerClass', await pitch_type.evaluate(true));
    await sleep(TIMEOUT_BETWEEN_EPOCHS_MS);
  }
}

train();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/', (req, res) => {
    pitch_type.predictSample(req.body.data).then((val) => {
        res.send(val);
    })
    // console.log(req.body.data.length);
    // let hoho = req.body.data
    // res.send(hoho);
})

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})

// util function to sleep for a given ms
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
