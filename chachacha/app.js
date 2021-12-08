const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

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
