const cmdArgs = require('command-line-args')
//const secureAmqp = require('secureamqp')

const cmdOptions = [
	{ name: 'config', alias: 'c', type: String},
	{ name: 'debug', type: Boolean}
]
const options = cmdArgs(cmdOptions)

const Actor = (options.debug) ?  require('../cllibsecureamqp').Actor : require('secureamqp').Actor

options.config = options.config || "./config"
const config = require(options.config)
let domainToken = null

async function main() {
	const auditor = new Actor(config)
	await auditor.boot()
	auditor.listenToEvent("codeRed", function(event) {
		console.log("Received event: ", event)
	})
	auditor.createAbility('sign', false, function(req, res) {
		console.log("Auditor received signing request: ", req.msg)
		// Do auditor magic

		const request = req.msg
		console.log(request)
		// Sign request
		///const token = auditor.secureAmqp.signedToken(request)
		const token = auditor.sign(request)
		res.send(token, 200)
	})

}

main()


