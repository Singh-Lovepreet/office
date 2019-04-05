var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Media = new Schema({
  title: String,
  description: String
},
{
    collection: 'media'
}
);

var Post = mongoose.model("Media", Media);
module.exports = Post;
