var printer = require('./index');

var targetUrl = 'https://en.wikipedia.org/wiki/Neutrino_oscillation';
var output = 'example-output.pdf';

async function testPrint(){
	
	var filename = await printer.print({
		targetURL: targetUrl, 
		output: output,
		logs: true,
		resetCache: false,
		customStyle: "#toc{ display: none; }", // Hide the TOC in printing.
		landscape: false,
		scale: 1,
		margin: { top: '1in', right: '1in', bottom: '1in', left: '1in'}
	});

	console.log(filename, 'printed.');
}

testPrint();