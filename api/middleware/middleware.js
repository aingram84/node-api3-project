const User = require('../users/users-model');

function logger(req, res, next) {
  const timeStamp = new Date().toLocaleString();
  const method = req.method;
  const url = req.originalUrl;
  console.log(`[${timeStamp}] ${method} to ${url}`);
  next();
}

async function validateUserId(req, res, next) {
  try {
    const currentUser = await User.getById(req.params.id)
    if (!currentUser) {
      res.status(404).json({message: 'user not found'})
    } else {
      req.user = currentUser
      next()
    }
  } catch (error) {
    res.status(500).json({message: `There was an error finding the user:  ${error.message}`})
  } next()
}

function validateUser(req, res, next) {
  const {name} = req.body
  if (!name || !name.trim()) {
    res.status(400).json({message: 'missing required name field'})
  } else {
    req.name = name.trim()
    next()
  }
}

function validatePost(req, res, next) {
  const {text} = req.body
  if (!text || !text.trim()) {
    res.status(400).json({message: 'missing required text field'})
  } else {
    req.text = text.trim()
    next()
  }
}

module.exports = {logger, validateUserId, validateUser, validatePost};

// do not forget to expose these functions to other modules
