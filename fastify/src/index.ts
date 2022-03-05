import Fastify from 'fastify'
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
	size: boolean
}

fastify.get<{Querystring: QuerystringType}>('/download/small-file', async (request, reply) => {
	const {chunked, size} = request.query
	const path = `${__dirname}/files/small-file.txt`
	const file = fs.createReadStream(path);
	reply.headers({
		"Content-Type": "application/octet-stream",
		"Content-Disposition": "filename=small-file.txt"
	})

	if(chunked) {
		reply.headers({
			"Transfer-Encoding": "chunked"
		})
	}

	if(size) {
		const stat = fs.statSync(path);
		reply.headers({
			"Content-Length": stat.size,
		})
	}

	reply.send(file)
})

fastify.get<{Querystring: QuerystringType}>('/download/large-file', async (request, reply) => {
	console.log(request.query)
	const {chunked, size} = request.query
	const path = `${__dirname}/files/large-file.txt`
	const file = fs.createReadStream(path);
	reply.headers({
		"Content-Type": "application/octet-stream",
		"Content-Disposition": "filename=large-file.txt"
	})

	if(chunked) {
		reply.headers({
			"Transfer-Encoding": "chunked"
		})
	}

	if(size) {
		const stat = fs.statSync(path);
		reply.headers({
			"Content-Length": stat.size,
		})
	}

	reply.send(file)
})

const port = process.env.PORT || 8080;

fastify.listen(port, '0.0.0.0', (err, address) => {
    if (err) throw err
})
