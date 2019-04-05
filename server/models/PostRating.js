var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var RatePost = new Schema({
  id: Object,
  rating: Number
},
{
    collection: 'mediaRating'
}
);

var PostRating = mongoose.model("RatePost", RatePost);
module.exports = PostRating;