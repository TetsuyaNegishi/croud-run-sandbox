import Fastify from 'fastify'
import fs from "fs";

const fastify = Fastify({
    logger: true
})

fastify.get('/echo', async (request, reply) => {
  reply.type('application/json').code(200)
  return {echo: 'hoge'}
})

fastify.get('/download/small-file/normal', async (request, reply) => {
	const path = `${__dirname}/files/small-file.txt`
	const file = fs.createReadStream(path);
	reply.headers({
		"Content-Type": "application/octet-stream",
		"Content-Disposition": "filename=small-file.txt"
	})
	reply.send(file)
})

fastify.get('/download/small-file/chunked', async (request, reply) => {
	const path = `${__dirname}/files/small-file.txt`
	const file = fs.createReadStream(path);
	reply.headers({
		"Content-Type": "application/octet-stream",
		"Content-Disposition": "filename=small-file.txt",
		"Transfer-Encoding": "chunked"
	})
	reply.send(file)
})

fastify.get('/download/small-file/size-and-chunked', async (request, reply) => {
	const path = `${__dirname}/files/small-file.txt`
	const file = fs.createReadStream(path);
	const stat = fs.statSync(path);
	reply.headers({
		"Content-Length": stat.size,
		"Content-Type": "application/octet-stream",
		"Content-Disposition": "filename=small-file.txt",
		"Transfer-Encoding": "chunked"
	})
	reply.send(file)
})

fastify.get('/download/large-file/normal', async (request, reply) => {
	const path = `${__dirname}/files/large-file.txt`
	const file = fs.createReadStream(path);
	reply.headers({
		"Content-Type": "application/octet-stream",
		"Content-Disposition": "filename=large-file.txt"
	})
	reply.send(file)
})

fastify.get('/download/large-file/chunked', async (request, reply) => {
	const path = `${__dirname}/files/large-file.txt`
	const file = fs.createReadStream(path);
	reply.headers({
		"Content-Type": "application/octet-stream",
		"Content-Disposition": "filename=large-file.txt",
		"Transfer-Encoding": "chunked"
	})
	reply.send(file)
})

fastify.get('/download/large-file/size-and-chunked', async (request, reply) => {
	const path = `${__dirname}/files/large-file.txt`
	const file = fs.createReadStream(path);
	const stat = fs.statSync(path);
	reply.headers({
		"Content-Length": stat.size,
		"Content-Type": "application/octet-stream",
		"Content-Disposition": "filename=large-file.txt",
		"Transfer-Encoding": "chunked"
	})
	reply.send(file)
})

const port = process.env.PORT || 8080;

fastify.listen(port, (err, address) => {
    if (err) throw err
})
