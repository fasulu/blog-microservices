const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const events=[];

app.post('/events', async (req, res) => {
    const event = req.body;

    events.push(event);

    await axios.post('http://localhost:4000/events', event).catch((err) => {
        console.log('Error on port 4000 ', err.message);
    });
    await axios.post('http://localhost:4001/events', event).catch((err) => {
        console.log('Error on port 4001 ', err.message);
    });
    await axios.post('http://localhost:4002/events', event).catch((err) => {
        console.log('Error on port 4002 ', err.message);
    });
    await axios.post('http://localhost:4003/events', event).catch((err) => {
        console.log('Error on port 4003 ', err.message);
    });
    res.send({ status: 'Ok' });
});

app.get('/events', (req,res)=>{
    res.send(events);
})

app.listen(4005, () => {
    console.log("Event-bus server listening on port 4005...");
})