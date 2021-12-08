const mongoose = require("mongoose");

const { Schema } = mongoose;
const CommentSchema = new Schema({
    card_id: String,     // 카드 고유 번호
    id: String,    // 댓글 user ID
    comment: String,    // 댓글 내용
    date: {             // 댓글 작성 날짜
        type: Date,
        default: Date.now
    }
});

CommentSchema.virtual("comment_id").get(function () {
    return this._id.toHexString();
});
CommentSchema.set("toJSON", {
    virtuals: true,
});

module.exports = mongoose.model("Comment", CommentSchema);