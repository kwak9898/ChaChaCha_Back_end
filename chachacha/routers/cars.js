const express = require("express");
const Cars = require("../schemas/cars");

const router = express.Router();

router.get("/cars", async (req, res, next) => {
    try {
        const { category } = req.query;
        const cars = await Cars.find({ category }).sort("id");
        res.json({ cars: cars });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get("/cras/:card_id", async (req, res) => {
    const { card_id } = req.params;
    const cars = await Cars.findById({ _id: card_id });
    res.json({ cars: cars });
});

module.exports = router;