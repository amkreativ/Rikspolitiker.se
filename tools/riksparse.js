//var request = require('request');
var jsonfile = require('jsonfile');
var fileExists = require('file-exists');
var _ = require('lodash');
var freq = require('freq');
var striptags = require('striptags');


var folders = [
	{folder: './../data/anforande-201415/', start: 'H209'},
	{folder: './../data/anforande-201516/', start: 'H309'},

];

var folder = './../data/anforande-201415/';
var start = 'H209';
/*
var folder = './../data/anforande-201516/';
var
*/

var theLoop = function(){
	for (var i = Things.length - 1; i >= 0; i--) {
		Things[i]
	}
}

var currentIndex = 1;

var currentSub = 1;

var resetIndex = function(){
	currentIndex = 1;
}

var resetSub = function(){
	currentSub = 1;
}

/*
jsonfile.readFileSync(currentFile, function(err, obj) {
  console.dir(obj);
})
*/

var running = true;

var baliCount = 0;

var conseqFails = 0;

var ledamoter = {};
//console.log(fileExists('/index.html'));

//console.log(jsonfile.readFileSync(currentFile));

var addWords = function(id, wordlist){
	for (var i = wordlist.length - 1; i >= 0; i--) {
		//if (ledamoter.) {}
		var currentWord = wordlist[i];
		//console.log(ledamoter[id].words[currentWord.word] + ' ' + ledamoter[id].words[currentWord.word].count);
		//console.log(currentWord);
		if (!ledamoter[id].words.hasOwnProperty(currentWord.word)) {
			
			ledamoter[id].words[currentWord.word] = currentWord.count
			//console.log('NY: ' + ledamoter[id].words[currentWord.word].word);
		}else{
			//console.log('REPEAT: ' + ledamoter[id].words[currentWord.word].count);
			//console.log(ledamoter[id].words[currentWord.word] + ' ' + currentWord.count);
			ledamoter[id].words[currentWord.word] = currentWord.count + ledamoter[id].words[currentWord.word];

		}
	}
}

var words = function(object, wordlist){
	var newObject = object;
	for (var i = wordlist.length - 1; i >= 0; i--) {
		var currentWord = wordlist[i];
		if (!object.hasOwnProperty(currentWord.word)) {
			//ledamoter[id].words[currentWord.word] = currentWord.count
			newObject[currentWord.word] = currentWord.count;
		}else{
			newObject[currentWord.word] = currentWord.count + object[currentWord.word];
		}

	}
	return newObject;
}

var loops = 0;

var writeStuff = function(){
	console.log('WRITING');
		var file = './../dataset/dataset.json';
		var spooky = ledamoter;
		jsonfile.writeFileSync(file, spooky);
}

var wew = function(){

}

for (var i = folders.length - 1; i >= 0; i--) {
	while(running === true){
		loops++;
		console.log(loops);
		
		var currentFile = folders[i].folder + folders[i].start + currentIndex + '-' + currentSub + '.json';
		console.log('Does ' + currentFile + ' exist?');
		if (fileExists(currentFile)) {
			var meme = jsonfile.readFileSync(currentFile);
			console.log(meme.anforande.talare + '\t\t\t\t\t' +  meme.anforande.avsnittsrubrik);
			currentSub++;
			conseqFails = 0;
			//running = false;
			var cleantext = striptags(meme.anforande.anforandetext);
			var frekvens = freq(cleantext);


			if (!ledamoter.hasOwnProperty(meme.anforande.intressent_id)) {
				//ledamoter[meme.anforande.intressent_id] = 0;
				ledamoter[meme.anforande.intressent_id] = {namn: meme.anforande.talare, len: 0, wordCount: 0, words: {} };
				console.log("DOOT");
			}
			//addWords(meme.anforande.intressent_id, frekvens);
			ledamoter[meme.anforande.intressent_id].len += meme.anforande.anforandetext.length;

			var newWords = words(ledamoter[meme.anforande.intressent_id].words, frekvens);
			ledamoter[meme.anforande.intressent_id].words = newWords;
			ledamoter[meme.anforande.intressent_id].wordCount = Object.keys(ledamoter[meme.anforande.intressent_id].words).length;

			//console.log(ledamoter[meme.anforande.intressent_id].words);
		}else{
			conseqFails++;
			currentIndex++;
			resetSub();
		}
		if (conseqFails === 5) {
			running = false;
			
		}

		
	}
	running = true;
	loops = 0;
	resetIndex();

}
writeStuff();
/*
while(running === true){
	loops++;
	console.log(loops);
	//console.log(jsonfile.readFileSync(currentFile).avsnittsrubrik);
	var currentFile = folders[1].folder + folders[1].start + currentIndex + '-' + currentSub + '.json';
	//console.log('Does ' + currentFile + ' exist?');
	if (fileExists(currentFile)) {
		var meme = jsonfile.readFileSync(currentFile);
		//console.log(meme.anforande.talare + '\t\t\t\t\t' +  meme.anforande.avsnittsrubrik);
		currentSub++;
		conseqFails = 0;
		//running = false;
		var cleantext = striptags(meme.anforande.anforandetext);
		var frekvens = freq(cleantext);


		if (!ledamoter.hasOwnProperty(meme.anforande.intressent_id)) {
			//ledamoter[meme.anforande.intressent_id] = 0;
			ledamoter[meme.anforande.intressent_id] = {namn: meme.anforande.talare, len: 0, wordCount: 0, words: {} };
			console.log("DOOT");
		}
		//addWords(meme.anforande.intressent_id, frekvens);
		ledamoter[meme.anforande.intressent_id].len += meme.anforande.anforandetext.length;

		var newWords = words(ledamoter[meme.anforande.intressent_id].words, frekvens);
		ledamoter[meme.anforande.intressent_id].words = newWords;
		ledamoter[meme.anforande.intressent_id].wordCount = Object.keys(ledamoter[meme.anforande.intressent_id].words).length;

		//console.log(ledamoter[meme.anforande.intressent_id].words);
	}else{
		conseqFails++;
		currentIndex++;
		resetSub();
	}
	if (conseqFails === 5) {
		running = false;
		writeStuff();
	}

	
}
*/

//Object.keys(obj).length

/*
var loops = 0;

while(running === true){
	loops ++;
	var currentFile = folder + start + currentIndex + '-' + currentSub + '.json';

	if (fileExists(currentFile)) {

	}else{
		conseqFails++;
		currentIndex++;
		resetSub();
	}
	if (conseqFails === 5) {
		running = false;
	}
}
*/


console.log('Bali: ' + baliCount + ' anföranden.');
//console.log(ledamoter);
console.log(Object.keys(ledamoter).length);
var file2 = './data4.json';
console.log(ledamoter['0760500234712'].words);
jsonfile.writeFileSync(file2, ledamoter['0760500234712'].words);
var wewlad = JSON.stringify(ledamoter);
//console.log(wewlad);


//console.log(JSON.stringify(ledamoter));

//var file = './data2.json';
//console.log("WAIT!");
/*
setTimeout(function(){
	jsonfile.writeFile(file, ledamoter, function(err) {
		console.log(err);
		console.log("DONE!");
	});
}, 10000);
*/