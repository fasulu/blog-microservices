const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/posts', async (req, res) => {
    const postId = randomBytes(4).toString('hex');
    const { title } = req.body;

    posts[postId] = { postId, title };

    await axios.post('http://localhost:4005/events', {
        type: 'PostCreated',
        data: { postId, title }
    })
    res.status(201).send(posts[postId]);

    console.table(posts);
});

app.post('/events', (req, res) => {
    console.log(`Received event is ${req.body.type}`);

    res.send({});
});

app.listen(4000, () => {
    console.log('Post server listening on port 4000');
});