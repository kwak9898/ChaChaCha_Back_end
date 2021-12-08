const mongoose = require("mongoose");

const { Schema } = mongoose;
const UserSchema = new Schema({
    id: String, // 아이디를 담아줄 곳
    pwd: String // 비밀번호
});

UserSchema.virtual("user_id").get(function () { // 보류
    return this._id.toHexString();
});
UserSchema.set("toJSON", {
    virtuals: true,
});

module.exports = mongoose.model("Users", UserSchema);