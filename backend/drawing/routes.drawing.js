const express = require('express');
const router = express.Router();
const drawingController = require('./controller.drawing.js');

router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

router.get('/all/:token', drawingController.verifyToken, drawingController.getAllDrawings);
router.post('/create/:token', drawingController.verifyToken, drawingController.createDrawing);
// router.put('/update/:id/:token', drawingController.verifyToken, drawingController.addADrawingToDrawing);
router.delete('/delete/:id/:token', drawingController.verifyToken, drawingController.deleteDrawing);
// router.delete('/delete/singledrawing/:id/:drawingId/:token', drawingController.verifyToken, drawingController.deleteSingleDrawing);
module.exports = router;
