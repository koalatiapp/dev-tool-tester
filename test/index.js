const path = require('path');
const assert = require('assert');
const runTool = require('..');
const Tool = require('./tool.js');
const testFileName = path.join(__dirname, 'sample.html');
const inexistingFileName = path.join(__dirname, '404.html');

describe('runTool function', async () => {
    it('Should fail if provided an invalid Tool argument', async () => {
        assert.rejects(async function() {
            await runTool({}, `file:${testFileName}`);
        });
    });

    it('Should fail if provided an non-existing filename', async () => {
        assert.rejects(async function() {
            await runTool({}, `file:${inexistingFileName}`);
        });
    });

    it('Should receive the expected results from the test tool\'s execution', async () => {
        const results = await runTool(Tool, `file:${testFileName}`);
        const expectedResults = [
            {
                uniqueName: 'meta-title',
                title: 'Page title',
                weight: 1,
                score: 0,
                snippets: ['test page']
            }
        ];
        
        assert.deepStrictEqual(results, expectedResults);
    });
});