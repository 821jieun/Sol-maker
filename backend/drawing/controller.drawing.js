const drawingModel = require('./model.drawing');
const jwt = require('jsonwebtoken');
const config = require('../../config');

exports.verifyToken = (req, res, next) => {
  if (req.method === 'OPTIONS') { res.writeHead(200) res.end() return }
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
  const requiredFields = ['canvas', 'instruction'];

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
      instruction: req.body.instruction,
      canvas: req.body.canvas,
      userId: req.user.id
    })
    .then(drawing => res.status(201).json(drawing.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error'});
    });
};


exports.deleteDrawing = (req, res) => {
  drawingModel
    .findByIdAndRemove(req.params.id)
    .then(drawing => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
};



//
