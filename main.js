const Kahoot = require("kahoot.js-updated");
const client = new Kahoot();
log("Kahoot joined !");


var ans = [0, 1, 2, 3], bots = []; //contient les réponse possibles


//15 characters max for the names
var names = [];
var name = "Eugène Bot"

function Bot(pin, name){
	this.client = new Kahoot();
	this.client.join(pin, name);

	this.name = name;
	this.question;

	this.vote = function(vote){ //fonction de vote, avec paramètre: le vote est le paramètre, sans paramètre: choix aléatoire parmis le tableau ans
		if(vote != undefined) {
			this.question.answer(vote);
		} else {
			this.question.answer(ans[Math.floor( Math.random()*ans.length )]);
		}
	}

	this.client.on("QuestionStart", question => {
		this.question = question;
		ans = [0, 1, 2, 3]; //duplication obligée: si un bot meure les autres doivent quand même update
	});
}


//INTERRACTIONS TERMINALES
const process = require('process');
const rl = require('readline').createInterface(process.stdin, process.stdout);

rl.on("line", (str) => { //event = quand on rentre qqch dans la console, il récupère ce qu'on a écrit sous forme de string
	if(str.includes("createBots")) { //créer des bots, syntaxe: createBotsPIN (le PIN doit contenir 7 chiffres)
		//bot = new Bot(str.substr(str.length - 7, str.length - 1), "bot"); 
		for(var i = 0; i < 30; i++){
			if(names.length === 0) bots.push(new Bot(str.substr(str.length - 7, str.length - 1), (name + (bots.length+1) )));
		}
	}


	if(str.includes("nope")) { //pour exclure des réponses: syntaxe: 2 nope, 2nope pour retirer la réponse 3
		let pop = str.substr(0, 1);

		for(var i = 0; i < ans.length; i++){
			if(ans[i] == pop) ans.splice(i, 1);
		}

		log(" ans: "+ans);		
	}


	if(str.includes("vote")) { //fais voter tous les bots, pour que tous les bots votent 1 seule réponse -> vote2
		//bot.vote(str.substr(str.length - 1, str.length - 1));
			for(var i = 0; i < bots.length; i++){
				if(str.substr(str.length - 1, str.length - 1) == "e"){
					bots[i].vote();
				} else {
					bots[i].vote(str.substr(str.length - 1, str.length - 1));
				}
			}
	}


	if(str.includes("exit")) { //arrete le script
		process.exit();
	}

	if(str.includes("log")){// log les bots
		for(var i = 0; i < bots.length; i++){
			log(i+": "+bots[i]);
		}
	}
});
//FIN DES INTERRACTIONS TERMINALES



//fonction de log dans la console
function log(s){
	console.log("CONSOLE: "+s);
}
