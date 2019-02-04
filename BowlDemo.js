////////////////////////////////////////////////
// BowlDemo - Uses the BowlClass
// to demonstrate the use of the
// BowlClass.
//
//	BowlDemo <-i/t> <initialization string>
// 
//  BowlDemo -t : test
//  BowlDemo -i <init-string> : interactive
//  BowlDemo <iniy-string> : get a score
//
///////////////////////////////////////////////


var readline = require('readline');
 
// no need for babel here.
let BowlClass = require('./BowlClass');

 // Some test cases.
 // BowlDemo -t
 let cTest = [
  {
    input: 'X', 
    expect: 10
  },
  {
    input: 'Xx', 
    expect: 30
  },
  {
    input: 'xxx', 
    expect: 60
  },
  {
    input: '00x8/1/', 
    expect: 41
  },
  {
    input: '0000x7/72', 
    expect: 46
  },
  {
        input: 'XXXXXXXXXXXX',
        expect: 300
    },
    {
      input:  '90909090909090909090',
      expect: 90
    },
    {
      input:  '5/5/5/5/5/5/5/5/5/5/5',
      expect: 150
    },
    {
      input:  'X7/729/XXX236/7/3',
      expect: 168
    },
    {
      input:  '00000000000000000000',
      expect: 0
    },
    {
      input:  '10000000000000000001',
      expect: 2
    },
    {
      input:  '01273/X5/7/345400X70',
      expect: 113
    },{
      input:  'X7/90X088/06XXX81',
      expect: 167
    }
  ];


let interactive = false;
let isTesting = false;
let initialParams = '';

if(process.argv.length > 4) {
	console.log('Too many arguments. Must be: BowlDemo <-t/i> <initial>');
	process.exit(-1);
}


// Process command-line options
if (process.argv.length > 2) {
	
  let param = process.argv[2];

  // Parse any options.
  if(param.indexOf('-i') !== -1) {

      console.log('Interactive: true');
      interactive = true;

      if(process.argv[3]) {
        initialParams = process.argv[3];
      }
      } else
      if(param.indexOf('-t') !== -1) {
      // cant do both
      if(interactive !== true) isTesting = true;
      } else {
      console.log('Initializing with: ' + param);
      initialParams = param;
      }
}

if(interactive) {

	
	let inputLine = '';

	// Initialize our class
	let scorer = new BowlClass(initialParams);
	if(initialParams !== '') {

    let iscore = scorer.getScore();
		if(scorer.isGameOver()) {
      console.log('Final Score: ' + iscore);
    } else {
      console.log('Score (min): ' + iscore);
    }
	}

	if(!scorer.isGameOver()) {

      var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
      });

      rl.on('line', function(line) {
          inputLine += line;
          console.log('Input: ' + inputLine);

          line.split('').forEach((ch) => {
            scorer.addRoll(ch);
          });

          let score = scorer.getScore();

          if(scorer.isGameOver()) {
          	console.log('Final Score: ' + score);
          	rl.close();
          } else {
          	console.log('Score (min): ' + score);
          }
      });
  }
}
else
if(isTesting) {

	console.log('Test: ');
    let results = [];

    // put set of results into an array
    cTest.forEach((test) => {
        let testStr = 'Test:' + test.input + ': ';
        let scorer = new BowlClass(test.input);
        let score = scorer.getScore();
        let testRes = (score === test.expect) 
                    ? ('Passed: ' + score + ', expected: ' + test.expect) 
                    : ('Failed: ' + score + ', expected: ' + test.expect);
        results.push(testStr + ' : ' + testRes);
    });

    console.log('Test Results: ' + JSON.stringify(results, null, 2));
}
else {

	// Initialize our class
	let scorer = new BowlClass(initialParams);

	console.log('Score: ' + scorer.getScore());
}
