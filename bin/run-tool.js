#!/usr/bin/env node

const Tool = require(`${process.cwd()}/tool.js`);
const runTool = require('../index.js');
const validator = new (require('@koalati/results-validator'))();
const args = require('minimist')(process.argv.slice(2))
const clc = require('cli-color');

if (!('url' in args)) {
    console.log(clc.red(JSON.stringify({ error: 'Missing URL argument.' })));
    process.exit(1);
}

const executionPromise = (async () => {
	// Run the tool
	try {
		const toolResults = await runTool(Tool, args.url);
		const validationErrors = validator.checkResults(toolResults)

		if (validationErrors.length) {
			for (const error of validationErrors) {
				console.log(clc.red('Results validation error: ' + error));
			}
			process.exit(1);
		}

		console.log(clc.green('Tool ran successfully without any errors.'));
		console.log(clc.green('Here are the JSON encoded results it returned:'));
		console.log(JSON.stringify(toolResults, null, 2));
	} catch (error) {
		console.log(clc.red('An error occured while running the tool.'));
		console.log(error);
		process.exit(1);
	}
})();

executionPromise.catch((error) => {
	console.log(clc.red('An error occured during the execution.'));
	console.log(error);
	process.exit(1);
});
