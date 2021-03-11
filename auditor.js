const cmdArgs = require('command-line-args')
const SecureAmqp = require('../cllibsecureamqp').SecureAmqp
const Actor = require('../cllibsecureamqp').Actor
//const secureAmqp = require('secureamqp')

const cmdOptions = [
	{ name: 'send', alias: 's', type: String},
	{ name: 'config', alias: 'c', type: String},
	{ name: 'debug', type: Boolean}
]
const options = cmdArgs(cmdOptions)

const secureAmqp = (options.debug) ?  require('../cllibsecureamqp') : require('secureamqp')

options.config = options.config || "./config"
const config = require(options.config)
const toAddress = options.send
let domainToken = null

async function main() {
	const auditor = new Actor(config)
	await auditor.boot()
	auditor.listen("codeRed", function(event) {
		console.log("Received event: ", event)
	})
	auditor.createAbility('sign', true, function(req, res) {
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


