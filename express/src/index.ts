import express from "express";
import fs from "fs";

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router: express.Router = express.Router();

router.get(
  '/echo',
  (req: express.Request, res: express.Response) => {
		res.json({echo: 'hoge'})
  }
);

router.get(
  '/download/small-file',
  (req: express.Request, res: express.Response) => {
    const {chunked, size} = req.query
		const path = `${__dirname}/files/small-file.txt`
    const file = fs.createReadStream(path);
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", "filename=small-file.txt");

    if(chunked) {
      res.setHeader("Transfer-Encoding", "chunked");
    }

    if(size) {
      const stat = fs.statSync(path);
      res.setHeader("Content-Length", stat.size)
    }
    file.pipe(res);
  }
);

router.get(
  '/download/large-file',
  (req: express.Request, res: express.Response) => {
    const {chunked, size} = req.query
		const path = `${__dirname}/files/large-file.txt`
    const file = fs.createReadStream(path);
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", "filename=large-file.txt");

    if(chunked) {
      res.setHeader("Transfer-Encoding", "chunked");
    }

    if(size) {
      const stat = fs.statSync(path);
      res.setHeader("Content-Length", stat.size)
    }
    file.pipe(res);
  }
);

app.use(router);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
