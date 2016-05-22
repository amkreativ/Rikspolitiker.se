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
			
			ledamoter[id].words[currentWord.word] = currentWord.count;
			//console.log('NY: ' + ledamoter[id].words[currentWord.word].word);
		}else{
			//console.log('REPEAT: ' + ledamoter[id].words[currentWord.word].count);
			//console.log(ledamoter[id].words[currentWord.word] + ' ' + currentWord.count);
			ledamoter[id].words[currentWord.word] = currentWord.count + ledamoter[id].words[currentWord.word];
			ledamoter[id].totalWords = currentWord.count + ledamoter[id].totalWords;

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
		var file = './../dataset/dataset3.json';
		var spooky = ledamoter;
		jsonfile.writeFileSync(file, spooky);
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
				ledamoter[meme.anforande.intressent_id] = {namn: meme.anforande.talare, len: 0, totalWords: 0, wordCount: 0, words: {}, anforandeCount: 0, anforanden:[]};
				console.log("DOOT");
			}
			//addWords(meme.anforande.intressent_id, frekvens);
			ledamoter[meme.anforande.intressent_id].len += meme.anforande.anforandetext.length;
			ledamoter[meme.anforande.intressent_id].anforandeCount++;
			ledamoter[meme.anforande.intressent_id].anforanden.push({id: meme.anforande.dok_id, dok_datum: meme.anforande.dok_datum, subid:  currentSub, titel: meme.anforande.dok_titel, rubrik: meme.anforande.avsnittsrubrik, aktivitet: meme.anforande.kammaraktivitet, underrubrik: meme.anforande.underrubrik, replik: meme.anforande.replik});

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
