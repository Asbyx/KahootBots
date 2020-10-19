const Kahoot = require("kahoot.js-updated");
const client = new Kahoot();
log("Kahoot joined !");


var ans = [0, 1, 2, 3], bots = []; //ans: contains all possible answers


//12 characters max for the names
var names = [];
var name = "Not the Bot"

function Bot(pin, name){
	this.client = new Kahoot();
	this.client.join(pin, name);

	this.name = name;
	this.question;
	this.score = 0;

	this.vote = function(vote){ //answer the content of ans[vote], if undefined, select a random among the ans list
		if(vote != undefined) {
			this.question.answer(ans[vote]);
		} else {
			this.question.answer(ans[Math.floor( Math.random()*ans.length )]);
		}
	}

	this.client.on("QuestionStart", question => {
		this.question = question;
		ans = [0, 1, 2, 3]; //The duplication of the affectation is needed, if a bot get disconnected, the ans has to be at his default value 
	});

	this.client.on("QuestionEnd", obj => {
		this.score = obj.totalScore;
		if(obj.isCorrect) log("yoohhoo !");
	});
}


//CONSOLE INTERRACTIONS
const process = require('process');
const rl = require('readline').createInterface(process.stdin, process.stdout);

rl.on("line", (str) => { //event = when somthing is send to the console, what we wrote is get in a string
	if(str.includes("bots")) { //creates bots, syntaxe: botsPIN (PIN must have 7 digits)

		let nbr = 100;
		let current = 0;

		let interval = setInterval(() => {
			if(names.length === 0) bots.push(new Bot(str.substr(str.length - 7, str.length - 1), (name + (bots.length+1) )));
			current++;
			if(current >= nbr){
				clearInterval(interval);
			}
		}, 50);


		log("Current numbers of bots in game: "+ bots.length);
	}


	if(str.includes("nope")) { //excludes answers: syntaxe: 2 nope, 2nope to exclude answer 2 (answers :0, 1, 2, 3)
		let pop = str.substr(0, 1);

		for(var i = 0; i < ans.length; i++){
			if(ans[i] == pop) ans.splice(i, 1);
		}

		log(" ans: "+ans);		
	}

	if(str.includes("add")) { //add a possible answer syntaxe: addNEW_ANSWER
		ans.push(str.substr(3, str.length - 1));

		log(" ans: "+ans);		
	}	


	if(str.includes("vote")) { //make all the bots vote. If you want all the bots to vote 1 answer: syntaxe vote3
		bots.sort(function(a, b) {return (a.score - b.score);});

		let nbr = bots.length;
		let current = 0;

		let interval = setInterval(() => {
			if(str.length == 4){
				//bots[i].vote();
				bots[current].vote(current%(ans.length));
			} else {
				bots[current].vote(str.substr(str.length - 1, str.length - 1));
			}	

			current++;
			if(current >= nbr){
				clearInterval(interval);
			}
		}, 25);
	}


	if(str.includes("exit")) { //kill the script
		process.exit();
	}

	if(str.includes("log")){//log what the bots list contains and the numbers of bots
		for(var i = 0; i < bots.length; i++){
			log(i+": "+bots[i]);
		}
		log("Numbers of bots : "+bots.length);
	}
});
//END OF CONSOLE INTERRACTIONS



//A log function, same as console.log() but shorter to write :)
function log(s){
	console.log("CONSOLE: "+s);
}
