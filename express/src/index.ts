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

const createFileMiddleware = (fileName: string) => async (req: express.Request, res: express.Response) => {
  const {chunked, size, stream = 'true'} = req.query
  const path = `${__dirname}/files/${fileName}`
  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader("Content-Disposition", `filename=${fileName}`);

  if(chunked) {
    res.setHeader("Transfer-Encoding", "chunked");
  }

  if(size) {
    const stat = fs.statSync(path);
    res.setHeader("Content-Length", stat.size)
  }

  if(stream === 'true') {
    const file = fs.createReadStream(path);
    file.pipe(res);
    return
  }

  const file = await fs.promises.readFile(path)
  res.send(file)
}

router.get(
  '/download/small-file',
  createFileMiddleware('small-file.txt')
);

router.get(
  '/download/large-file',
  createFileMiddleware('large-file.txt')
);


app.use(router);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
