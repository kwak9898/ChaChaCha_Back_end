const express = require("express");
const Cars = require("../schemas/cars");

const cheerio = require("cheerio");
const axios = require("axios");
const iconv = require("iconv-lite");

const router = express.Router();

router.get("/cars/add/crawling", async (req, res) => {
    let url = "";
    let doc = {};
    let category_YN = "";
    try {
        for (let i = 0; i < 2; i++) {
            //국산차가 N 수입차가 Y
            category_YN = i === 0 ? "N" : "Y";
            //국산차, 수입차 각각 5페이지씩 크롤링한다.
            for (let j = 0; j < 5; j++) {
                url = `https://auto.naver.com/car/mainList.nhn?importYn=${category_YN}&page=${j + 1
                    }`;
                //크롤링 대상 웹사이트 HTML 가져오기

                await axios({
                    url: url,
                    method: "GET",
                    responseType: "arraybuffer",
                }).then(async (html) => {
                    //크롤링 코드
                    const content = iconv.decode(html.data, "UTF-8").toString();
                    const $ = cheerio.load(content);
                    const list = $("ul.model_lst li");

                    await list.each(async (i, tag) => {
                        let image = $(tag).find("div div span a img").attr("src");
                        let title = $(tag).find("div div a.model_name span strong").text();
                        let price = $(tag).find("div ul li.price.new span.cont").text();
                        let emblem = $(tag).find("div div a.emblem img").attr("src");
                        let company = $(tag).find("div div a.emblem img").attr("alt");
                        let fuelInfo = $(tag)
                            .find("div ul li.mileage span span.ell")
                            .text();
                        //let relaese = $(tag).find("div ul li.info a em").text(); //출시
                        let size = $(tag).find("div ul li.info a span").text();
                        let category = category_YN === "N" ? "국산차" : "수입차";
                        if (image && title && price && emblem && company && fuelInfo) {
                            let date = new Date();
                            let id = date.getTime();
                            let fuel_efficiency = fuelInfo.toString().split("\n");
                            console.log(fuel_efficiency);
                            let efficiency = fuel_efficiency[1].trim(); //연비
                            let fuel = fuel_efficiency[3].trim(); //연료
                            doc = {
                                id: id,
                                thumbnailUrl: image,
                                title: title,
                                price: price,
                                emblem: emblem,
                                company: company,
                                category: category,
                                efficiency: efficiency,
                                fuel: fuel,
                                info: size,
                            };
                            await Cars.create(doc);
                        }
                    });
                });
            }
        }
        res.send({ result: "success", message: "크롤링이 완료 되었습니다." });
    } catch (error) {
        //실패 할 경우 코드
        res.send({
            result: "fail",
            message: "크롤링에 문제가 발생했습니다",
            error: error,
        });
    }
});
module.exports = router;