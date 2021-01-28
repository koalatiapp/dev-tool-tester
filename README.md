# Functional testing and debugging helper library for Koalati Tools

[![NPM version of @koalati/dev-tool-tester](https://img.shields.io/npm/v/@koalati/dev-tool-tester)](https://www.npmjs.com/package/@koalati/dev-tool-tester)

This package allows you to easily build functional test for Koalati tools using both local files and remote web pages.

It also includes a utility executable to help Koalati tool developers run and debug their tools straight from the command line.


## Getting started

If you have built your tool with the [Koalati's Tool Template](https://github.com/koalatiapp/tool-template), this package is already specified as a dev dependency.

If you have started your tool from scratch, start by adding this package as a dev dependency:
```
npm i @koalati/dev-tool-tester --save-dev
```


### Using `runTool()` for functional tests
To get started with your functional tests, simply require the package's `runTool` function in your script and provide the two following parameters:
- `Tool`: your tool's class
- `url`: the URL (or path to local file) you want to test your tool with

Here's a sample code snippet for a test located in the tool's `/test/` directory, which also contains a `sample.html` file for testing purposes:
```js
const path = require('path');
const assert = require('assert');
const runTool = require('@koalati/dev-tool-tester');
const Tool = require('../tool.js');
const testFileName = path.join(__dirname, 'sample.html');

describe('my tool', async () => {
    it('Should receive the expected results from the test tool\'s execution', async () => {
        const results = await runTool(Tool, `file:${testFileName}`);
        const expectedResults = [
			// ...
        ];
        
        assert.deepStrictEqual(results, expectedResults);
    });
});
```


### Running and debugging your tools from the command line
If you want to run and/or debug a Koalati tool you're working on from the command line, simply navigation to that tool's directory and run the following command:

```bash
npx @koalati/dev-tool-tester --url="https://koalati.com/"
```

Your tool will be executed on the page provided with the `--url` argument, and the results will be displayed in your terminal.

If any errors occur, either during your tool's execution or because your tool's results are deemed invalid, an error message will appear to help you debug it.

## Testing with local files
Both the utility executable accept local filepaths as an URL, in addition to supporting remote URLs. This can be especially useful for unit / functional tests that are bundled with your tool.