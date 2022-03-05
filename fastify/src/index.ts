import Fastify, { RouteHandlerMethod } from 'fastify'
import fs from "fs";

const fastifyOption =
	process.env.HTTP2 === 'false' ?
		{ logger: true } :
		{
			http2: true,
			logger: true
		}

console.log(fastifyOption)
const fastify = Fastify(fastifyOption)

fastify.get('/echo', async (request, reply) => {
  reply.type('application/json').code(200)
  return {echo: 'hoge'}
})

type QuerystringType = {
	chunked: boolean,
	size: boolean,
	stream: string
}

const createFileMiddleware: (fileName:string) => RouteHandlerMethod = (fileName: string) => async (request, reply) => {
  const {chunked, size, stream = 'true'} = request.query as QuerystringType
  const path = `${__dirname}/files/${fileName}`
  reply.header("Content-Type", "application/octet-stream");
  reply.header("Content-Disposition", `filename=${fileName}`);

  if(chunked) {
    reply.header("Transfer-Encoding", "chunked");
  }

  if(size) {
    const stat = fs.statSync(path);
    reply.header("Content-Length", stat.size)
  }

  if(stream === 'true') {
    const file = fs.createReadStream(path);
    reply.send(file)
    return
  }

  const file = await fs.promises.readFile(path)
  reply.send(file)
}


fastify.get('/download/small-file', createFileMiddleware('small-file.txt'))

fastify.get('/download/large-file', createFileMiddleware('large-file.txt'))

const port = process.env.PORT || 8080;

fastify.listen(port, '0.0.0.0', (err, address) => {
    if (err) throw err
})
