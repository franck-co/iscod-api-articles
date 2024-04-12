const { Schema, model } = require("mongoose");

const ArticleStatus = {
  draft: "draft",
  published: "published"
}
const articleSchema = new Schema({
  title: String,
  content: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: {
      values: [ArticleStatus.draft, ArticleStatus.published],
      message: "{VALUE} inconnue",
    },
  },
});

module.exports = {
  Article: model("Article", articleSchema),
  ArticleStatus
};