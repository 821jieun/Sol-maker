const drawingModel = require('./model.drawing');
const jwt = require('jsonwebtoken');
const config = require('../../config');

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization || req.params.token;

  if (!token) {
    res.status(401).json({
      message: 'no token provided'
    })
    return;
  }
  jwt.verify(token, config.JWT_SECRET, (err, decodedObj) => {
    if (err) {
      res.status(401).json({
        message: 'token is not valid!'
      })
      return;
    }
    req.user = decodedObj;
    next();
  })
}

exports.getAllDrawings = (req, res) => {

  drawingModel
    .find({
      userId: req.user.id})
    .populate('userId', 'username')
    .then(drawings => {

      res.json({
        drawings: drawings.map((drawing) => {
          return drawing.serialize();
        })
      })
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error'});
    });
};

exports.getDrawing = (req, res) => {
  drawingModel
  .findById(req.params.id)
  .then(drawing => res.json(drawing.serialize()))
  .catch(err => {
    console.error(err);
    res.status(500).json({ message: 'Internal server error'})
  });
};

exports.createDrawing = (req, res) => {
  const requiredFields = ['entryText'];

  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];

    if (!(field in req.body)) {
      const message = `missing ${field} in request body`
      console.error(message);
      return res.status(400).send(message)
    }
  }

  drawingModel
    .create({
      entryText: req.body.entryText,
      userId: req.user.id
    })
    .then(drawing => res.status(201).json(drawing.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error'});
    });
};


exports.addDrawing = (req, res) => {
  // ensure that the id in the request path and the one in request body match
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).json({ message: message });
  }

  const toUpdate = {};
  const updateableFields = ['title', 'description', 'bookId', 'author', 'image'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  drawingModel
    .findByIdAndUpdate(req.params.id, { $push: {books: toUpdate }})
    // .then(drawing => res.status(204).end())
    .then(drawing => {
      res.status(204).end()
    })
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
};

exports.deleteDrawing = (req, res) => {
  drawingModel
    .findByIdAndRemove(req.params.id)
    .then(drawing => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
};
