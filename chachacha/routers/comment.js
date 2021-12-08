const express = require("express");
const Joi = require("joi");
const Comments = require("../schemas/comment");
const userMiddleware = require("../auth-middleware/middleware")
const router = express.Router();
/*
유효성검사
*/
const postCommentsSchema = Joi.object({
    comment: Joi.string().required(),
    date: Joi.string().required(),
});

//댓글쓰기
router.post("/detail/write/:card_id", userMiddleware, async (req, res) => {
    const id = res.locals.user.id;
    console.log(id + "*********")
    if (!id) {
        res.status(401).send({
            msg: "로그인 후 사용하세요",
        });
        return;
    }
    try {
        const { card_id } = req.params;
        const { comment, date } = await postCommentsSchema.validateAsync(req.body);

        if (card_id) {
            await Comments.create({
                card_id,
                id,
                comment,
                date,
            });
            res.send({ msg: "댓글 입력 완료" });
        }
    } catch (err) {
        console.log(err);
        res.status(400).send({ msg: "댓글을 입력해주세요" });
    }
});
// 해당 상세 페이지의 댓글들 보기
router.get("/detail/comment", async (req, res, next) => {
    const { card_id } = req.query;
    try {
        const commentList = await Comments.find({ card_id: card_id }).sort("-date");
        res.json({ commentList: commentList });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

//댓글을 삭제하기
router.delete("/detail/delete/:comment_id", userMiddleware, async (req, res) => {
    const { comment_id } = req.params;
    const id = res.locals.user.id;
    if (!id) {
        res.status(401).send({
            msg: "로그인 후 사용하세요",
        });
        return;
    }
    const comment = await Comments.findOne({ comment_id });
    if (comment.id !== id) {
        res.status(401).send({
            msg: "작성자 본인이 아닙니다"
        })
        return;
    }
    if (comment) {
        await Comments.deleteOne({ _id: comment_id });
        res.send({ msg: "댓글 삭제 완료" });
    }
});

/*
유효성검사
*/
const postEditSchema = Joi.object({
    comment: Joi.string().required(),
});
//댓글을 수정하기
router.patch("/detail/edit/:comment_id", userMiddleware, async (req, res) => {
    const { comment_id } = req.params;
    const id = res.locals.user.id;
    if (!id) {
        res.status(401).send({
            errorMessage: "로그인 후 사용하세요",
        });
        return;
    }
    const comment = await Comments.findOne({ comment_id });
    if (comment.id !== id) {
        res.status(401).send({
            errorMessage: "작성자 본인이 아닙니다"
        })
        return;
    }
    try {
        const { comment } = await postEditSchema.validateAsync(req.body);

        let commentOne = await Comments.findOne({ _id: comment_id });
        if (commentOne) {
            commentOne.comment = comment;
            await commentOne.save();
            res.send({ msg: "댓글 수정 완료" });
        }
    } catch (err) {
        console.log(err);
        res.status(400).send({ msg: "댓글을 입력해주세요" });
    }
});
module.exports = router;