const mongoose = require('mongoose');

const MemoSchema = mongoose.Schema({
  writer: String,
  contents: String,
  starred: [String],
  date: {
    created: { type: Date, default: Date.now },
    edited: { type: Date, default: Date.now },
  },
  is_edited: { type: Boolean, default: false },
});

const Memo = mongoose.model('Memo', MemoSchema);
module.exports = Memo;
