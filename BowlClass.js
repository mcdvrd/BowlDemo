////////////////////////////////////////////
// BowlClass
//
// Implements a bowl-scorer.
//
// Input: "x/0..9"
// Ex: x7/81....
//
// BowlScore(<initial-string>)
// getScore() - returns the current score
// addRoll(roll) - adds a new roll.
//
///////////////////////////////////////////
const GAME_SIZE = 20;

module.exports = class BowlClass {

	// Initialize with optional string
	constructor(initialScore) {

		this.rolls = '';
		this.gameOver = false;
		this.currScore = 0;
		this.gameSize = GAME_SIZE;

		if(initialScore) 
			this.rolls = initialScore;
	}

	addRoll(roll) {

		if((roll >= 0 && roll <=10) || (roll === '/') || ((roll ==='x') || (roll === 'X')))
			this.rolls += roll;
	}

	isGameOver() {
		return this.gameOver;
	}

	getScore() {

		if(this.gameOver) {
			return this.currScore;
		}

       let rollArray = []; // to hold score-input

        // convert to numeric notation and fill-in rolls
        // not yet taken.
        rollArray = this.MakeRolls(this.rolls.split(''));

        if(rollArray.length < 22) {
       
        for(var i = 0; i < (22 - rollArray.length); i++) {
          rollArray.push(0);
        }
      }

        // Init the reducer
        let frame = 1;

        /////////////////////////////////////////////////////
        // Take the filled-in array and determine the score
        // 
        let score = rollArray.reduce( (acc, cv, idx, arr) => {

            // Is the game over?
            if(frame >= 10) // we have bonus rolls
                return acc + cv; 
            else 
            if(cv === 10) {  // Strike
              frame++;
              return (acc + cv + arr[idx+1] + arr[idx+2]);
            }

            if(frame % 1 !== 0) { 

             // Second Roll of a Frame; frame is
             // the integer part only after 
             // increment: 2.5 -> 3.5 -> 3
              frame = Math.floor(++frame);

              // spare if they add to 10
              let lv = cv + arr[idx-1];

              if(lv !== 10)  // open frame: score is product
                return (acc + cv); 
              else 
                // spare frame: val = running total + next roll 
                return (acc + cv + arr[idx+1]);
            }

            frame += 0.5; // in middle of frame.

            return acc + cv; 

          }, 0); // Initialize the reducer with  0 score.

      this.currScore = score;
      return score;

    }

    ///////////////////////////////////////////
    // Makes rolls from character data.
    // Pads game out with 0's if game 
    // in-progress
    // Convert "X" and "/"" to real numbers.
    // This allows us to deal with numbers 
    // both rather thansymbols and numbers. 
    // X = 10
    // / = (x-y) => (6/) = (6,4)
    //////////////////////////////////////////
    MakeRolls(input) {

      let cnt = 0;
      let rollArray = [];

      input.forEach((roll, idx) => {

          if (roll === 'X' || roll === 'x') {
            // Always 10
            cnt+=2;
            rollArray.push(Number(10));
          } else {
            if(roll === '/') {
              // its value is 10-x
              cnt++;
              rollArray.push(Number(10 - Number(input[idx-1])));
            }
            else {
              // it is a number.
              // return it.
              cnt++;
              rollArray.push(Number(roll)) ;
            }
          }

          // If we are at game-size, check the 
          // last roll. Was it a strike or spare?
          // If so = extra frame.
          if(cnt >= GAME_SIZE ) {
            if(roll === 'X' || roll === 'x') {
              this.gameSize += 2; // extra fame
              if(this.gameSize > 24) {
                this.gameSize = 24;
              }
            }
            else 
            if(roll === '/') {
              this.gameSize += 1;
              if(this.gameSize > 21) {
                this.gameSize = 21;
              }
            }

            if(cnt >= this.gameSize) {
                  this.gameOver = true;
            }

          }
      });
      
      return rollArray;
    }
};

