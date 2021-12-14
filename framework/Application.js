const http = require('http')
const EventEmitter = require('events')

module.exports = class Application {
	constructor() {
		this.emitter = new EventEmitter();
		this.server = this._createServer();
		this.middlewares = [];
	}

	use(middleware) {
		this.middlewares.push(middleware)
	}

	addRouter(router) {
		Object.keys(router.endpoints).forEach(path => {
			const endpoint = router.endpoints[path]
			Object.keys(endpoint).forEach(method => {

				this.emitter.on(this._getRouteMaks(path, method), (req, res) => {
					const handler = endpoint[method]
					handler(req, res)
					this.middlewares.forEach(middleware => middleware(req, res))
				})
			})
		})

	}

	listen(port, callback) {
		this.server.listen(port, callback)
	}

	_createServer() {
		return http.createServer((req, res) => {
			const emitted = this.emitter.emit(this._getRouteMaks(req.url, req.method), req, res)
			if (!emitted) {
				res.end()
			}
		})
	}

	_getRouteMaks(path, method) {
		return `[${path}]:[${method}]`
	}
}