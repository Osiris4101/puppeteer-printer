

var printer = require('./index');
var targetUrl = 'https://en.wikipedia.org/wiki/Neutrino_oscillation';
var outputPDF = 'example-output.pdf';
var outputMHTML = 'EXAMPLE-OUTPUT.MHTML';
var outputPNG = 'example-output.png';
var outputDefault = 'example-output.default';
var outputs = [outputMHTML, outputPNG, outputPDF, outputDefault]; 

async function printCall(target, name, format){
	
	var filename = await printer.print({
		targetURL: target, 
		output: name,
		logs: false,
		resetCache: false,
		customStyle: "#toc{ display: none; }", // Hide the TOC in printing.
		landscape: false,
		scale: 1,
		printFormat: format,
		margin: { top: '1in', right: '1in', bottom: '1in', left: '1in'}
	});

	console.log(filename, 'printed.');
}

async function test(){
	
	for (var i = 0; i < outputs.length; i++) {
		var val = outputs[i];
		waitingURLPrintingTask = i + 1 < outputs.length;
		await printCall(targetUrl, val, val.substr(val.lastIndexOf('.') + 1));
   	}

}

test();