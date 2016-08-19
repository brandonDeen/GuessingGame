var guessData;
var scores;
var random;
var MAX = 1000001;
var MIN = 1;


$(document).ready(function(){
	scores = loadScores()
	displayScoreboard(scores);

	guessData = loadGuessData();

	random = getRandom();
	console.log(random);

	appendRules();

	$('#showHideRules').on('click', function(){
		$('#rules').toggle();
	});

});

function appendRules(){
	$("#rules").append(
			"<p>You have 20 turns to guess a random number between 1 and 1,000,000 (inclusive).</p>"
			+"<p>Once you guess it or you run out of turns, I will try and guess the number.</p>"
			+"<p>Whoever guesses the random number the least number of guesses wins.</p>"
			+"<br><br><p>Oh yeah, I will keep score in the browser in case you wanna come back and play some more!.</p>"
		);
}

function storeScores(scores){
	localStorage.setItem('guessingGameScores', JSON.stringify(scores));
}

function loadScores(){
	var scores = JSON.parse( localStorage.getItem('guessingGameScores') );
	if(scores == null){
		scores = { player: 0, ai: 0, draw: 0 };
		storeScores(scores);
	}
	console.log(scores);
	
	return scores;
}

function resetGuessData(){
	guessData = { userGuesses: [], aiGuesses: [] };
	storeGuessData(guessData);
	return guessData;
}

function storeGuessData(data){
	localStorage.setItem('guessData', JSON.stringify(data));
	console.log("STORING: " + JSON.stringify(data));
}

function loadGuessData(){
	var data = JSON.parse( localStorage.getItem('guessData') );
	if( data == null ){
		data = resetGuessData();
	}

	return data;
}

function displayScoreboard(scores){
	$('#playerScore').append(scores['player']);
	$('#draws').append(scores['draw']);
	$('#aiScore').append(scores['ai']);
}

function submitGuess(){
	var guess = parseInt( $('#userGuessInput').val(), 10 );
	//is this a duplicate guess?
	if(guessData.userGuesses.indexOf(guess) != -1){
		alert('You already guessed that');
	}else if(guess === NaN || guess.toString() == 'NaN'){
		alert('Invalid Guess')
	}else{
		//update guessData
		guessData.userGuesses.push(guess);
		console.log(guessData);
		if(guessData.userGuesses.length >= 20){
			$('#playerGuesses').append("<p>Out of Guesses</p>")
			runAI();
		}		
		//did user guess correctly?
		else if(guess == random){
			displayGuess(guess, "You Guessed It!!!", true);
			runAI();
		}
		else if(guess < random){
				displayGuess(guess, "Too Low", true);
		}
		else if(guess > random){
				displayGuess(guess, "Too High", true);
		}
	}
}

function displayGuess(guess, hiOrLo, isUser){
	var sectionID = isUser ? '#playerGuesses' : '#aiGuesses';
	$(sectionID).append("<p>" + guess + " - " + hiOrLo + "</p>");
	console.log(sectionID + ' ' + guess)
}

function clearGuesses(){
	$('#playerGuesses').empty();
	$('#aiGuesses').empty();
}

function updateScore(){
	var val = guessData.userGuesses.length - guessData.aiGuesses.length
	if( val > 0 ){
		//user lost
		scores.ai++;
	}else if( val < 0 ){
		//user won
		scores.player++;
	} else{
		//draw
		scores.draw++;
	}
	//update scores in local storage
	storeScores(scores);
	//empty scoreboard
	$("#scoreboard").empty();
	//reload scoreboard
	displayScoreboard(scores);
}

function runAI(){
	var hi = MAX-1;
	var lo = MIN;
	var aiGuess = parseInt( (hi + lo) / 2 );

	//ai guesses
	for(var i=0; i<20; i++){
		var hiOrLo = '';	
		if( aiGuess > random ){
			hiOrLo = "Too High"
			hi = aiGuess-1;
		}
		else if(aiGuess < random){
			hiOrLo = "Too Low"
			lo = aiGuess+1;
		}
		else if( aiGuess == random ){
			hiOrLo = 'I Guessed It!!!'
			i=20;
		}
		guessData.aiGuesses.push(aiGuess);
		displayGuess(aiGuess, hiOrLo,false);
		aiGuess = parseInt( (hi+lo)/2 );
	}
	updateScore();

	// display play again button
	$('#game').append("<button id='playagain' class='btn btn-primary' onclick='playAgain()'>Play Again?</button>")
}

function playAgain(){
	//reset guessData
	guessData = resetGuessData();
	//reset random
	random = getRandom();
	//clear guesses
	clearGuesses();
}

function getRandom(){
	return parseInt( Math.random() * 1000000);
}