const express = require('express');
const User = require('./users-model')
const Post = require('../posts/posts-model')
const { validateUserId, validateUser, validatePost } = require('../middleware/middleware')

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', (req, res, next) => {
  User.get()
    .then(users => {
      res.json(users)
    })
    .catch(next)
});

router.get('/:id', validateUserId, (req, res) => {
  res.json(req.user)
});

router.post('/', validateUser, (req, res, next) => {
  User.insert({ name: req.name })
    .then(newUser => {
      res.status(201).json(newUser)
    })
    .catch(next)
});

router.put('/:id', validateUser, validateUserId, (req, res, next) => {
  User.update(req.params.id, { name: req.name })
    .then(() => {
      return User.getById(req.params.id)
    })
    .then(user => {
      res.status(201).json(user)
    })
    .catch(next)
});

router.delete('/:id', validateUserId, async (req, res, next) => {

  try {
    let currentUser = User.getById(req.params.id)
    await User.remove(req.params.id)
    res.json(currentUser)
  } catch (err) {
    next(err)
  }
});


router.get('/:id/posts', validateUserId, async (req, res, next) => {

  try {
    const posts = await User.getUserPosts(req.params.id)
    res.json(posts)
  } catch (err) {
    next(err)
  }

});

router.post('/:id/posts', validateUserId, validatePost, async (req, res, next) => {
  try {
    const result = await Post.insert({
      ...req.body,
      user_id: req.params.id,
      text: req.text,
    })
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
});

router.use((err, req, res) => {
  res.status(err.status || 500).json({
    customMessage: 'something went wrong',
    errorMessage: err.message,
    stack: err.stack
  })
})

// do not forget to export the router
module.exports = router;