const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  text: {
    type: String,
    required: [true, "Please add a text"],
    maxlength: [500, "Text can not be more than 500 characters"],
  },
  photo: {
    type: String,
    default: "no-photo.jpg",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
