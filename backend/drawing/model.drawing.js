'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const User = require('../user/model.user');

const  drawingSchema = mongoose.Schema({
  publishDate: {
    type: Date,
    default: Date.now()
  },
  instruction: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  canvas: {
    data: Buffer,
    contentType: String
  }
});

drawingSchema.methods.serialize = function() {

  return {
    id: this._id,
    publishDate: this.publishDate,
    instruction: this.instruction,
    userId: this.userId,
    canvas: this.canvas
  };
}


module.exports = mongoose.model('Drawing', drawingSchema);
