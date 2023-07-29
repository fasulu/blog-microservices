const express = require('express');
const axios=require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

// The posts data will look like the following format;
// {
//   'ab123c12': {
//      id: 'ab123c12',
//      title: 'post title',
//      comments: [
//        {
//          id: 'ct456s34',
//          content: 'comment'
//        }
//      ]
//    },
// }

const handleEvent = (type, data) => {

  if (type === 'PostCreated') {
    const { postId, title } = data;
    // console.log(postId, title)

    posts[postId] = { postId, title, comments: [] };
  };

  if (type === 'CommentCreated') {

    const { id, postId, content, status } = data;
    // console.log(id, postId, content, status);

    const post = posts[postId];
    // console.log(post);
    post.comments.push({ id, content, status });
  };

  if (type === 'CommentUpdated') {
    const { id, postId, content, status } = data;
    const post = posts[postId];

    const comment = post.comments.find(comment => {
      return comment.id === id;
    });

    comment.status = status;
    comment.content = content;
  }
};

app.get('/posts', (req, res) => {

  res.send(posts);

});

app.post('/events', (req, res) => {

  const { type, data } = req.body;
  // console.log(type, data);

  handleEvent(type, data);

  console.log(posts);
  res.send({});
});

app.listen(4002, async () => {
  console.log('Query server listening on 4002');

  try {
    const res = await axios.get("http://localhost:4005/events");

    for (let event of res.data) {
      console.log("Processing event:", event.type);

      handleEvent(event.type, event.data);
    }
  } catch (error) {
    console.log(error.message);
  }
});