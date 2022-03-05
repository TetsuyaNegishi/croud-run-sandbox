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
  '/download/small-file/normal',
  (req: express.Request, res: express.Response) => {
		const path = `${__dirname}/files/small-file.txt`
    const file = fs.createReadStream(path);
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", "filename=small-file.txt");
    file.pipe(res);
  }
);

router.get(
  '/download/small-file/chunked',
  (req: express.Request, res: express.Response) => {
		const path = `${__dirname}/files/small-file.txt`
    const file = fs.createReadStream(path);
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", "filename=small-file.txt");
    res.setHeader("Transfer-Encoding", "chunked");
    file.pipe(res);
  }
);

router.get(
  '/download/small-file/size-and-chunked',
  (req: express.Request, res: express.Response) => {
		const path = `${__dirname}/files/small-file.txt`
    const file = fs.createReadStream(path);
    const stat = fs.statSync(path);
    res.setHeader("Content-Length", stat.size);
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", "filename=small-file.txt");
    res.setHeader("Transfer-Encoding", "chunked");
    file.pipe(res);
  }
);

router.get(
  '/download/large-file/normal',
  (req: express.Request, res: express.Response) => {
		const path = `${__dirname}/files/large-file.txt`
    const file = fs.createReadStream(path);
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", "filename=large-file.txt");
    file.pipe(res);
  }
);

router.get(
  '/download/large-file/chunked',
  (req: express.Request, res: express.Response) => {
		const path = `${__dirname}/files/large-file.txt`
    const file = fs.createReadStream(path);
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", "filename=large-file.txt");
    res.setHeader("Transfer-Encoding", "chunked");
    file.pipe(res);
  }
);

router.get(
  '/download/large-file/size-and-chunked',
  (req: express.Request, res: express.Response) => {
		const path = `${__dirname}/files/large-file.txt`
    const file = fs.createReadStream(path);
    const stat = fs.statSync(path);
    res.setHeader("Content-Length", stat.size);
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", "filename=large-file.txt");
    res.setHeader("Transfer-Encoding", "chunked");
    file.pipe(res);
  }
);

app.use(router);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
