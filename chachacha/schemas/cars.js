const mongoose = require("mongoose");

const { Schema } = mongoose;
const CarsSchema = new Schema({
    id: {
        type: String,
    },
    title: {
        // 차 이름
        type: String,
        required: true,
    },
    efficiency: {
        // 차 요약 스펙_연비
        type: String,
    },
    fuel: {
        // 차 요약 스펙_연료
        type: String,
    },
    thumbnailUrl: {
        // 차 사진
        type: String,
    },
    emblem: {
        // 차 로고
        type: String,
    },
    company: {
        // 차 회사명
        type: String,
    },
    price: {
        // 차 가격
        type: String,
    },
    category: {
        // 차 종
        type: String,
    },
    info: {
        // 차 크기?
        type: String,
    },
});

CarsSchema.virtual("card_id").get(function () {
    return this._id.toHexString();
});
CarsSchema.set("toJSON", {
    virtuals: true,
});

module.exports = mongoose.model("Cars", CarsSchema);