const express = require('express')
const cookieParser = require('cookie-parser');
const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(cookieParser("my-secret-cookie"));

const cookies = {
    httpOnly: true,
    maxAge: 1000000,
    signed: true
};
// 쿠키 옵션들 웹 서버에서만, 쿠키 수명 밀리초 단위로 설정, 쿠키 암호화 결정

app.get('/', (req, res) => {
    res.cookie('mycookie', "set cookie", cookies);  // 쿠키이름, 쿠키 내용, 쿠키 옵션
    res.send('set cookie')  // 웹에 보낼 내용
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

const connect = require("./schemas/index");
connect();

const CrawlingRouter = require("./routers/crawling");
app.use("/api", CrawlingRouter);

const RegisterRouter = require('./routers/register');
app.use("/api", RegisterRouter);

const CarsRouter = require('./routers/cars');
app.use("/api", CarsRouter);

const CommentRouter = require('./routers/comment');
app.use("/api", CommentRouter);

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
})
