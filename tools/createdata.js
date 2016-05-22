// Nuvarande kodstatus: Clusterfuck/10

var jsonfile = require('jsonfile');
var _ = require('lodash');
var http = require('http');
var request = require('request');

var file = './../dataset/dataset3.json';

var dataset = jsonfile.readFileSync(file);

//console.log(dataset['011731125914'].words);
var loops = 0;

var ledamoter = {};
var ledamoter1000 = {};
var ledamoter250 = {};
var ledamoter100 = {};

var partier = {
	V: {tecken:0, antalOrd:0, unikaOrd:0, ord: {}, ordlista:[]},
	S: {tecken:0, antalOrd:0, unikaOrd:0, ord: {}, ordlista:[]},
	MP: {tecken:0, antalOrd:0, unikaOrd:0, ord: {}, ordlista:[]},
	SD: {tecken:0, antalOrd:0, unikaOrd:0, ord: {}, ordlista:[]},
	C: {tecken:0, antalOrd:0, unikaOrd:0, ord: {}, ordlista:[]},
	L: {tecken:0, antalOrd:0, unikaOrd:0, ord: {}, ordlista:[]},
	M: {tecken:0, antalOrd:0, unikaOrd:0, ord: {}, ordlista:[]},
	KD: {tecken:0, antalOrd:0, unikaOrd:0, ord: {}, ordlista:[]}
};

var aktivitet = {
	V: {},
	S: {},
	MP: {},
	SD: {},
	C: {},
	L: {},
	M: {},
	KD: {}
};

var riksdagsAPI = 'http://data.riksdagen.se/personlista/?iid=&fnamn=&enamn=&f_ar=&kn=&parti=&valkrets=&rdlstatus=&org=&utformat=json&termlista=';

var politikerLista = {};

var partiOrd = function(parti,ord){
	partier[parti].antalOrd += ord.antal;
	//console.log(parti + ' ' + ord.ord);
	if (partier[parti].ord.hasOwnProperty(ord.ord)) {
		partier[parti].ord[ord.ord] += ord.antal;
		//partier[parti].tecken += ord.ord.length * ord.antal;
	}else{
		partier[parti].ord[ord.ord] = ord.antal;
		partier[parti].unikaOrd++;
		//partier[parti].tecken = ord.ord.length * ord.antal;
	}
};

var buildDataset = function(){
	l = le.personlista.person;
	//console.log(l[0]);
	for (var i = l.length - 1; i >= 0; i--) {
		var lm = l[i];

		console.log(lm.sorteringsnamn);
		var politiker = {
			id: lm.intressent_id,
			fodd_ar: lm.fodd_ar,
			kon: lm.kon,
			efternamn: lm.efternamn,
			fornamn: lm.tilltalsnamn,
			sorteringsnamn: lm.sorteringsnamn,
			parti: lm.parti,
			valkrets: lm.valkrets,
			status: lm.status,
			bild_url_80: lm.bild_url_80,
			bild_url_192: lm.bild_url_192,
			bild_url_max: lm.bild_url_max
		};
		if (lm.personuppgift !== null) {
            for (var j = lm.personuppgift.uppgift.length - 1; j >= 0; j--) {
                if (lm.personuppgift.uppgift[j].kod === 'sv' && lm.personuppgift.uppgift[j].typ === 'titlar')
                {
                    politiker.yrke = lm.personuppgift.uppgift[j].uppgift;
                    console.log(lm.sorteringsnamn + ': ' + lm.personuppgift.uppgift[j].uppgift);
                }
            }
        }
        console.log(politiker.id);
        if (ledamoter[politiker.id] == undefined) {
        	politiker.ord = {};
        	politiker.ordlangd = 0;
        	politiker.tecken = 0;
	        politiker.antalOrd = 0;
	        politiker.unikaOrd = 0;
	        politiker.len = 0;
	        politiker.antalAnforanden = 0;
	        politiker.anforanden = [];
        }else{
        	politiker.ord = ledamoter[politiker.id].ordlista.slice(0,250);
	        politiker.ordlangd = ledamoter[politiker.id].ordlangd;
	        politiker.tecken = ledamoter[politiker.id].tecken;
	        politiker.antalOrd = ledamoter[politiker.id].antalOrd;
	        politiker.unikaOrd = ledamoter[politiker.id].unikaOrd;
	        politiker.len = ledamoter[politiker.id].len;
			politiker.antalAnforanden = ledamoter[politiker.id].anforandeCount;
			politiker.anforanden = ledamoter[politiker.id].anforanden;

	        partier[lm.parti].tecken += ledamoter[lm.intressent_id].tecken;
        }

        for (var k = politiker.ord.length - 1; k >= 0; k--) {
        	console.log(politiker.parti + ' ' + politiker.sorteringsnamn + ' ' + politiker.parti,politiker.ord[k])
        	partiOrd(politiker.parti,politiker.ord[k]);
        }

        
        politikerLista[politiker.id] = politiker;


	}
	for(var parti in partier) {
		console.log('Parti: ' + parti);
		for(var ord in partier[parti].ord){
			var ordet = {
				ord: ord,
				antal: partier[parti].ord[ord]
			};
			partier[parti].ordlista.push(ordet);
		}
		partier[parti].ordlista = _.sortBy(partier[parti].ordlista, ['antal', 'ord']).reverse().slice(0, 10000);
		partier[parti].ord = {};
		for (var m = 0; m < partier[parti].ordlista.length; m++) {
			partier[parti].ord[partier[parti].ordlista[m].ord] = m;
		}
	}

	//console.log(politikerLista);
	console.log(partier);
	var partierdoc = './../dataset/wew.json';
	jsonfile.writeFileSync(partierdoc, partier);
	var politikerdoc = './../dataset/politikerlista.json';
	jsonfile.writeFileSync(politikerdoc, politikerLista);


}

var le = null;

var getData = function(){
	console.log("WEW");
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


var wordFunction = function(){
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
		
		var ledamot = {
			namn: person.namn,
			ordlangd: (totalLangd/antalOrd).toFixed(2),
			tecken: totalLangd,
			unikaOrd: unikaOrd,
			antalOrd: antalOrd,
			ordlista: sorteradOrdlista,
			len: person.len,
			antalAnforanden: person.anforandeCount,
			anforanden: person.anforanden
		}

		var ledamot1000 = {
			namn: person.namn,
			ordlangd: (totalLangd/antalOrd).toFixed(2),
			tecken: totalLangd,
			unikaOrd: unikaOrd,
			antalOrd: antalOrd,
			ordlista: sorteradOrdlista.slice(0, 1000),
			len: person.len,
			antalAnforanden: person.anforandeCount,
			anforanden: person.anforanden
		}

		var ledamot250 = {
			namn: person.namn,
			ordlangd: (totalLangd/antalOrd).toFixed(2),
			tecken: totalLangd,
			unikaOrd: unikaOrd,
			antalOrd: antalOrd,
			ordlista: sorteradOrdlista.slice(0, 250),
			len: person.len,
			antalAnforanden: person.anforandeCount,
			anforanden: person.anforanden
		}
		var ledamot100 = {
			namn: person.namn,
			ordlangd: (totalLangd/antalOrd).toFixed(2),
			tecken: totalLangd,
			unikaOrd: unikaOrd,
			antalOrd: antalOrd,
			ordlista: sorteradOrdlista.slice(0, 100),
			len: person.len,
			antalAnforanden: person.anforandeCount,
			anforanden: person.anforanden
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
		
	}
}
//console.log(dataset['011731125914'].words.length);


var writeStuff = function(){
	console.log('WRITING');
	console.log('AAA' + ledamoter);
	var output = './../dataset/ledamoter_ord.json';
	jsonfile.writeFileSync(output, ledamoter);

	console.log('AAA' + ledamoter1000);
	var output = './../dataset/ledamoter_ord1000.json';
	jsonfile.writeFileSync(output, ledamoter1000);

	console.log('AAA' + ledamoter250);
	var output = './../dataset/ledamoter_ord250.json';
	jsonfile.writeFileSync(output, ledamoter250);

	console.log('AAA' + ledamoter100);
	var output = './../dataset/ledamoter_ord100.json';
	jsonfile.writeFileSync(output, ledamoter100);
	
}

wordFunction();
getData();

writeStuff();



/*
for(var word in dataset['011731125914'].words) {
	loops++;
   console.log(loops + ' ' + dataset['011731125914'].words[word] +  '\t' + word);
}
*/