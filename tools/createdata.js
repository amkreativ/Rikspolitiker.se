var jsonfile = require('jsonfile');
var _ = require('lodash');
var http = require('http');
var request = require('request');

var file = './../dataset/dataset.json';

var dataset = jsonfile.readFileSync(file);

//console.log(dataset['011731125914'].words);
var loops = 0;

var ledamoter = {};
var ledamoter1000 = {};
var ledamoter250 = {};
var ledamoter100 = {};

var partier = {
	V: {},
	S: {},
	MP: {},
	SD: {},
	C: {},
	L: {},
	M: {},
	KD: {}
}

var riksdagsAPI = 'http://data.riksdagen.se/personlista/?iid=&fnamn=&enamn=&f_ar=&kn=&parti=&valkrets=&rdlstatus=&org=&utformat=json&termlista=';

var buildDataset = function(){
	l = le.personlista.person;
	//console.log(l[0]);
	for (var i = l.length - 1; i >= 0; i--) {
		var lm = l[i];
		console.log(lm.sorteringsnamn);
	}
}

var le = null;

var getData = function(){
	request(riksdagsAPI, function (error, response, json) {
		if (!error && response.statusCode == 200) {
			console.log(json);
			var obj = JSON.parse(json);

			var output = './../dataset/ledamoter_raw.json';
			jsonfile.writeFileSync(output, obj);
			le = obj;
			buildDataset();
		}
	});
}

getData();

//console.log(dataset['011731125914'].words.length);
console.log(Object.keys(dataset['011731125914'].words).length);

for(var personID in dataset) {
	var antalOrd = 0;
	var unikaOrd = Object.keys(dataset[personID].words).length;
	var person = dataset[personID];
	var totalLangd = 0;
	var vanligasteOrdet = {ord: '', antal: 0};
	var langstaOrdet = '';
	var ordlista = [];

	var ordNummer = 0;
	//console.log(personID + '\t' + person.len + '\t' + antalOrd + '\t' + person.wordCount + '\t' + person.namn);
	for(var word in person.words) {
		//loops++;
		//console.log(person.words[word] +  '\t' + word);
		antalOrd += person.words[word];
		totalLangd += person.words[word] * word.length;
		if (word.length > langstaOrdet.length) {
			langstaOrdet = word;
		}

		if (person.words[word] > vanligasteOrdet.antal) {
			vanligasteOrdet.ord = word;
			vanligasteOrdet.antal = person.words[word];
		}
		if (word != '\\*' && word != 'kantrubrik' && word != 'mergeformat' && word != 'styleref') {
			ordlista[ordNummer] = {ord: word, antal: person.words[word]};
			ordNummer++;
		}
	}
	var sorteradOrdlista = _.sortBy(ordlista, ['antal', 'ord']).reverse();
	//console.log(sorteradOrdlista);

	//console.log(antalOrd);
	//console.log('Total ord: ' + totalWords);

	console.log(personID + '\tOrdlängd: ' + (totalLangd/antalOrd).toFixed(2)  + '\t\Tecken: ' + totalLangd + '\tUnika ord: ' + unikaOrd + '\tTotalt antal ord: ' + antalOrd + '\tVanligaste ordet: ' + vanligasteOrdet.ord + '\t' + person.namn);
	/*
	var ledamot = {
		namn: person.namn,
		ordlangd: (totalLangd/antalOrd).toFixed(2),
		tecken: totalLangd,
		unikaOrd: unikaOrd,
		antalOrd: antalOrd,
		ordlista: sorteradOrdlista
	}
	var ledamot1000 = {
		namn: person.namn,
		ordlangd: (totalLangd/antalOrd).toFixed(2),
		tecken: totalLangd,
		unikaOrd: unikaOrd,
		antalOrd: antalOrd,
		ordlista: sorteradOrdlista.slice(0, 1000)
	}
	var ledamot250 = {
		namn: person.namn,
		ordlangd: (totalLangd/antalOrd).toFixed(2),
		tecken: totalLangd,
		unikaOrd: unikaOrd,
		antalOrd: antalOrd,
		ordlista: sorteradOrdlista.slice(0, 250)
	}
	var ledamot100 = {
		namn: person.namn,
		ordlangd: (totalLangd/antalOrd).toFixed(2),
		tecken: totalLangd,
		unikaOrd: unikaOrd,
		antalOrd: antalOrd,
		ordlista: sorteradOrdlista.slice(0, 100)
	}



	ledamoter[personID] = ledamot;
	var output = './../dataset/ordkomplett/' + personID + '.json';
	jsonfile.writeFileSync(output, ledamot);

	ledamoter1000[personID] = ledamot1000;
	var output = './../dataset/ordtop1000/' + personID + '.json';
	jsonfile.writeFileSync(output, ledamot1000);

	ledamoter250[personID] = ledamot250;
	var output = './../dataset/ordtop250/' + personID + '.json';
	jsonfile.writeFileSync(output, ledamot250);

	ledamoter100[personID] = ledamot100;
	var output = './../dataset/ordtop100/' + personID + '.json';
	jsonfile.writeFileSync(output, ledamot100);
	*/
}

var writeStuff = function(){
	console.log('WRITING');
	/*
	var output = './../dataset/ledamoter_ord.json';
	jsonfile.writeFileSync(output, ledamoter);

	var output = './../dataset/ledamoter_ord1000.json';
	jsonfile.writeFileSync(output, ledamoter1000);

	var output = './../dataset/ledamoter_ord250.json';
	jsonfile.writeFileSync(output, ledamoter250);

	var output = './../dataset/ledamoter_ord100.json';
	jsonfile.writeFileSync(output, ledamoter100);
	*/
}

writeStuff();



/*
for(var word in dataset['011731125914'].words) {
	loops++;
   console.log(loops + ' ' + dataset['011731125914'].words[word] +  '\t' + word);
}
*/