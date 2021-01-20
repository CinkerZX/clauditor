const cmdArgs = require('command-line-args')
//const secureAmqp = require('../cllibsecureamqp')
const secureAmqp = require('secureamqp')

const cmdOptions = [
	{ name: 'send', alias: 's', type: String},
	{ name: 'config', alias: 'c', type: String}
]
const options = cmdArgs(cmdOptions)
options.config = options.config || "./config"
const config = require(options.config)
const toAddress = options.send
let domainToken = null

async function main() {
	await secureAmqp.init(config)
	const myAddress = secureAmqp.getMyAddress()
	const myId = secureAmqp.id
	console.log("Actor address: ", myAddress)
	console.log("Actor keys: ", secureAmqp.keys())
	
	// Sign my Id by domain
	secureAmqp.callFunction(config.domain, ".f.signActorId", myId, null, function(res) {
		const token = res.msg
		const verify = secureAmqp.verifyToken(token)
		const decoded = secureAmqp.decodeToken(res.msg)
		if(verify) {
			console.log("Received domain token: ", token)
			domainToken = token
		}
	})

	// Subscribe to all events
	secureAmqp.subscribeEvent('*', function(e) { 
		console.log("Received event: ", e)
		// Do something
	})

	// Sign requests
	secureAmqp.registerFunction('.f.sign', null, function(req, res) {
		console.log("Auditor received signing request: ", req.msg)
		// Do auditor magic

		// Add the domain authorization for this actor
		const request = req.msg
		request.domainToken = domainToken
		// Sign request
		const token = secureAmqp.signedToken(request)
		res.send(token)
	})
}

main()


