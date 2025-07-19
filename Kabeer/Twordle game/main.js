const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;
let targetWords = []; 
let currentGuess = '';
let currentAttempt = 0;

// fetching the 2 words using an API key
// const fetchWords = async () => {
//   try {
//     const response = await fetch ('https://random-word-api.herokuapp.com/word?number=2&length=5');
//     const words = await response.json();
//     targetWords = words.map(word => word.toUpperCase());
//   } catch (error) {
//     console.error('Error fetching words:', error);
//     return [];
//   }
// };

// Production words list due to lack of API key 
const PRODUCTION_WORDS = [
  "ABOUT", "ABOVE", "ABUSE", "ACTOR", "ACUTE", "ADMIT", "ADOPT", "ADULT", "AFTER", "AGAIN",
  "AGENT", "AGREE", "AHEAD", "ALARM", "ALBUM", "ALERT", "ALIEN", "ALIGN", "ALIKE", "ALIVE", 
  "ALLOW", "ALONE", "ALONG", "ALTER", "ANGEL", "ANGER", "ANGLE", "ANGRY", "APART", "APPLE",
  "APPLY", "ARENA", "ARGUE", "ARISE", "ARRAY", "ASIDE", "ASSET", "AUDIO", "AUDIT", "AVOID",
  "AWARD", "AWARE", "BADLY", "BASIC", "BEACH", "BEGAN", "BEGIN", "BEING", "BELOW", "BENCH",
  "BILLY", "BIRTH", "BLACK", "BLAME", "BLANK", "BLIND", "BLOCK", "BLOOD", "BOARD", "BOOST",
  "BOOTH", "BOUND", "BRAIN", "BRAND", "BREAD", "BREAK", "BREED", "BRIEF", "BRING", "BROAD",
  "BROKE", "BROWN", "BUILD", "BUILT", "BUYER", "CABLE", "CARRY", "CATCH", "CAUSE", "CHAIN",
  "CHAIR", "CHAOS", "CHART", "CHASE", "CHEAP", "CHECK", "CHEST", "CHIEF", "CHILD", "CHINA",
  "CHOSE", "CIVIL", "CLAIM", "CLASS", "CLEAN", "CLEAR", "CLICK", "CLIMB", "CLOCK", "CLOSE",
  "COACH", "COAST", "COULD", "COUNT", "COURT", "COVER", "CRAFT", "CRASH", "CRAZY", "CREAM",
  "CRIME", "CROSS", "CROWD", "CROWN", "CRUDE", "CURVE", "CYCLE", "DAILY", "DANCE", "DATED",
  "DEALT", "DEATH", "DEBUT", "DELAY", "DEPTH", "DOING", "DOUBT", "DOZEN", "DRAFT", "DRAMA",
  "DRANK", "DRAWN", "DREAM", "DRESS", "DRILL", "DRINK", "DRIVE", "DROVE", "DYING", "EAGER",
  "EARLY", "EARTH", "EIGHT", "ELITE", "EMPTY", "ENEMY", "ENJOY", "ENTER", "ENTRY", "EQUAL",
  "ERROR", "EVENT", "EVERY", "EXACT", "EXIST", "EXTRA", "FAITH", "FALSE", "FAULT", "FIBER",
  "FIELD", "FIFTH", "FIFTY", "FIGHT", "FINAL", "FIRST", "FIXED", "FLASH", "FLEET", "FLOOR",
  "FLUID", "FOCUS", "FORCE", "FORTH", "FORTY", "FORUM", "FOUND", "FRAME", "FRANK", "FRAUD",
  "FRESH", "FRONT", "FRUIT", "FULLY", "FUNNY", "GIANT", "GIVEN", "GLASS", "GLOBE", "GOING",
  "GRACE", "GRADE", "GRAIN", "GRAND", "GRANT", "GRASS", "GRAVE", "GREAT", "GREEN", "GROSS",
  "GROUP", "GROWN", "GUARD", "GUESS", "GUEST", "GUIDE", "HAPPY", "HEART", "HEAVY", "HENCE",
  "HORSE", "HOTEL", "HOUSE", "HUMAN", "IDEAL", "IMAGE", "INDEX", "INNER", "INPUT", "ISSUE",
  "JAPAN", "JIMMY", "JOINT", "JONES", "JUDGE", "KNOWN", "LABEL", "LARGE", "LASER", "LATER",
  "LAUGH", "LAYER", "LEARN", "LEASE", "LEAST", "LEAVE", "LEGAL", "LEVEL", "LEWIS", "LIGHT",
  "LIMIT", "LINKS", "LIVES", "LOCAL", "LOOSE", "LOWER", "LUCKY", "LUNCH", "LYING", "MAGIC",
  "MAJOR", "MAKER", "MARCH", "MARIA", "MATCH", "MAYBE", "MAYOR", "MEANT", "MEDIA", "METAL",
  "MIGHT", "MINOR", "MINUS", "MIXED", "MODEL", "MONEY", "MONTH", "MORAL", "MOTOR", "MOUNT",
  "MOUSE", "MOUTH", "MOVED", "MOVIE", "MUSIC", "NEEDS", "NEVER", "NEWLY", "NIGHT", "NOISE",
  "NORTH", "NOTED", "NOVEL", "NURSE", "OCCUR", "OCEAN", "OFFER", "OFTEN", "ORDER", "OTHER",
  "OUGHT", "PAINT", "PANEL", "PAPER", "PARTY", "PEACE", "PETER", "PHASE", "PHONE", "PHOTO",
  "PIANO", "PIECE", "PILOT", "PITCH", "PLACE", "PLAIN", "PLANE", "PLANT", "PLATE", "POINT",
  "POUND", "POWER", "PRESS", "PRICE", "PRIDE", "PRIME", "PRINT", "PRIOR", "PRIZE", "PROOF",
  "PROUD", "PROVE", "QUEEN", "QUICK", "QUIET", "QUITE", "RADIO", "RAISE", "RANGE", "RAPID",
  "RATIO", "REACH", "READY", "REALM", "REBEL", "REFER", "RELAX", "REPLY", "RIGHT", "RIVAL",
  "RIVER", "ROBIN", "ROGER", "ROMAN", "ROUGH", "ROUND", "ROUTE", "ROYAL", "RURAL", "SCALE",
  "SCENE", "SCOPE", "SCORE", "SENSE", "SERVE", "SEVEN", "SHALL", "SHAPE", "SHARE", "SHARP",
  "SHEET", "SHELF", "SHELL", "SHIFT", "SHINE", "SHIRT", "SHOCK", "SHOOT", "SHORT", "SHOWN",
  "SIGHT", "SILLY", "SINCE", "SIXTH", "SIXTY", "SIZED", "SKILL", "SLEEP", "SLIDE", "SMALL",
  "SMART", "SMILE", "SMITH", "SMOKE", "SOLID", "SOLVE", "SORRY", "SOUND", "SOUTH", "SPACE",
  "SPARE", "SPEAK", "SPEED", "SPEND", "SPENT", "SPLIT", "SPOKE", "SPORT", "STAFF", "STAGE",
  "STAKE", "STAND", "START", "STATE", "STEAM", "STEEL", "STEEP", "STEER", "STICK", "STILL",
  "STOCK", "STONE", "STOOD", "STORE", "STORM", "STORY", "STRIP", "STUCK", "STUDY", "STUFF",
  "STYLE", "SUGAR", "SUITE", "SUPER", "SWEET", "TABLE", "TAKEN", "TASTE", "TAXES", "TEACH",
  "TEAMS", "TEETH", "TERRY", "THANK", "THEFT", "THEIR", "THEME", "THERE", "THESE", "THICK",
  "THING", "THINK", "THIRD", "THOSE", "THREE", "THREW", "THROW", "THUMB", "TIGHT", "TIRED",
  "TITLE", "TODAY", "TOPIC", "TOTAL", "TOUCH", "TOUGH", "TOWER", "TRACK", "TRADE", "TRAIN",
  "TREAT", "TREND", "TRIAL", "TRIBE", "TRICK", "TRIED", "TRIES", "TRUCK", "TRULY", "TRUNK",
  "TRUST", "TRUTH", "TWICE", "TWIST", "TYLER", "UNDER", "UNDUE", "UNION", "UNITY", "UNTIL",
  "UPPER", "UPSET", "URBAN", "USAGE", "USUAL", "VALUE", "VIDEO", "VIRUS", "VISIT", "VITAL",
  "VOCAL", "VOICE", "WASTE", "WATCH", "WATER", "WHEEL", "WHERE", "WHICH", "WHILE", "WHITE",
  "WHOLE", "WHOSE", "WOMAN", "WOMEN", "WORLD", "WORRY", "WORSE", "WORST", "WORTH", "WOULD",
  "WRITE", "WRONG", "WROTE", "YOUNG", "YOUTH"
];

const fetchWords = async () => {
  try {
    // Shuffle the array and pick 2 random words
    const shuffled = [...PRODUCTION_WORDS].sort(() => 0.5 - Math.random());
    const selectedWords = shuffled.slice(0, 2);
    targetWords = selectedWords.map(word => word.toUpperCase());
    console.log('Game initialized with target words:', targetWords);
  } catch (error) {
    console.error('Error selecting words:', error);
    // Ultimate fallback
    targetWords = ['ABOUT', 'WORLD'];
  }
};



const updateGuessCounter = () => {
    document.getElementById('guess-counter').textContent = ` Guess # ${currentAttempt + 1} of ${MAX_ATTEMPTS}`;
}

// Function to create the game boards
const createBoards = (words) => {
    try {
        for(let b = 0 ; b < 2 ; b++) {
            const board = document.getElementById(`board${b+1}`);
            board.innerHTML = '' ;
            //for tiles
            for(let j = 0 ; j < MAX_ATTEMPTS; j++) {
                for(let i = 0 ; i < WORD_LENGTH; i++) {
                const tile = document.createElement('div');
                tile.className = `tile board${b+1}`;
                tile.id  = `tile-${b+1}-${i+1}-${j+1}`;
                board.appendChild(tile);
            }
        }
        }
    } catch (error) {
        console.error('Error creating boards:', error);
    }
}

// making the OnScreen keyboard
const createKeyboard = () => {
    try {
        const keyRows = [
                        'QWERTYUIOP'.split(''),
                        'ASDFGHJKL'.split(''),
                        ['ENTER',...'ZXCVBNM'.split(''),'BACKSPACE']
                    ];

        const keyboard = document.getElementById('keyboard');
        keyboard.innerHTML = ''; 

        keyRows.forEach(keyRow => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'keyboard-row';
            keyRow.forEach(key => {
                const btn = document.createElement('button');
                if(key === 'BACKSPACE'){
                    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16" aria-label="Backspace">
                    <path d="M5.83 5.146a.5.5 0 0 0 0 .708L7.975 8l-2.147 2.146a.5.5 0 0 0 .707.708l2.147-2.147 2.146 2.147a.5.5 0 0 0 .707-.708L9.39 8l2.146-2.146a.5.5 0 0 0-.707-.708L8.683 7.293 6.536 5.146a.5.5 0 0 0-.707 0z"/>
                    <path d="M13.683 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-7.08a2 2 0 0 1-1.519-.698L.241 8.65a1 1 0 0 1 0-1.302L5.084 1.7A2 2 0 0 1 6.603 1zm-7.08 1a1 1 0 0 0-.76.35L1 8l4.844 5.65a1 1 0 0 0 .759.35h7.08a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z"/>
                    </svg>`;
                } else {
                    btn.textContent = key; 
                }
                btn.className = 'key' + (key === 'ENTER' || key === 'BACKSPACE' ? ' special' : '');
                btn.addEventListener('click', () => {
                    if (key === 'ENTER' || key === 'BACKSPACE') {
                        handleSpecialKeyPress(key);
                      } else {
                        handleKeyPress(key);
                      }
                });
                rowDiv.appendChild(btn);
            
            })
            keyboard.appendChild(rowDiv);
        });
    } catch (error) {
    console.error('Error creating keyboard:', error);
    }
}

//handing the key press

const handleKeyPress = (key) => {
    try {
        if(BoardSolved[0] && BoardSolved[1]) return;

        if(currentGuess.length < WORD_LENGTH) {
            currentGuess += key;
            updateBoards();
        }
    } catch (error) {
        console.error('Error handling key press:', error);
    }
}

const handleSpecialKeyPress = (key) => {
    try {
        if(key === 'BACKSPACE') {
            currentGuess = currentGuess.slice(0,-1);
            updateBoards();
        } else if ( key === 'ENTER') {
            if( currentGuess.length === WORD_LENGTH) {
                submitGuess();
            } else {
                ShowPopup('Please enter a valid guess of 5 letters.');
            }
    }
    } catch (error) {
        console.error('Error handling special key press:', error);
    }
}

//enabling keyboard input
document.addEventListener('keydown', (event) => {
    const key = event.key.toUpperCase();
    if(key.match(/^[A-Z]$/)) {
        handleKeyPress(key);
    } else if (key === 'BACKSPACE') {
        handleSpecialKeyPress('BACKSPACE');
    } else if (key === 'ENTER') {
        handleSpecialKeyPress('ENTER');
    }
});

// give up functionality
document.getElementById('giveUpBtn').addEventListener('click', () => {
    Endgame('You gave up! The words were: ' + targetWords.join(' and '));
    BoardSolved = [true, true]; // Marking both boards as solved
});

// new game functionality
document.getElementById('new-game-btn').addEventListener('click', () => {
    window.location.reload();
});

const showhints = async () => {
    try {
        const defs = await Promise.all([
            fetchdefinition(targetWords[0]),
            fetchdefinition(targetWords[1])
        ]);

        let msg = `Hint 1: ${defs[0] || "No definition found."}
                   Hint 2: ${defs[1] || "No definition found."}`;
        ShowPopup(msg);

    } catch (error) {
        ShowPopup('Error fetching hints. Please try again later.');
        console.error('Error showing hints:', error);
    }
};

const fetchdefinition = async (word) => {
        try {
          const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
          if (!res.ok) return null;
          const data = await res.json();

          for (const meaning of data[0]?.meanings || []) {
            for (const defObj of meaning.definitions) {
              if (defObj.definition) return defObj.definition;
            }
          }
          return null;
        } catch {
          return null;
        }
      }
      

//hint btn functionality
document.getElementById('hint-btn').addEventListener('click', showhints);

const updateBoards = ()=> {
    for (let board = 0 ; board < 2 ; board++) {
        if (BoardSolved[board]) continue; // Skip if the board is already solved
        for(let k = 0 ; k < WORD_LENGTH ; k++) {
            const tile = document.getElementById(`tile-${board+1}-${k+1}-${currentAttempt+1}`);
            tile.textContent = currentGuess[k] || '';
            tile.classList.remove('pop');
            tile.classList.remove('flip');
            if (currentGuess[k]) {
                tile.classList.add('pop');
              }
    }
 }
}

//bg-music 
const audio = document.getElementById('bg-music');
const btn = document.getElementById('toggle-music');
audio.volume = 0.5; // reducing the initial volume
audio.muted = true;
btn.innerHTML = '<img src="assets/mute.svg" alt="Unmute Music" class="icon" style="width: 20px; height: 20px;">';

btn.onclick = function() {
  if (audio.muted) {
    audio.muted = false;
    audio.play();
    btn.innerHTML = '<img src="assets/unmute.svg" alt="Mute Music" class="icon" style="width: 20px; height: 20px;">';
  } else {
    audio.muted = true;
    btn.innerHTML = '<img src="assets/mute.svg" alt="Unmute Music" class="icon" style="width: 20px; height: 20px;">';
  }
};

const checkGuess = (guess, targetWord) => {
    const feedback = Array(WORD_LENGTH).fill('absent');
    const targetWordArray = targetWord.split('');
    const guessArray = guess.split('');
    
    // making the green tile
    for(let i = 0 ; i < WORD_LENGTH; i++) {
        if(guessArray[i] === targetWordArray[i]) {
            feedback[i] = 'correct';
            targetWordArray[i] = null; // Mark as used
        }
    }

    //making the yellow tile
    for(let i = 0 ; i < WORD_LENGTH; i++) {
        if(feedback[i] === 'correct') continue;
        const index = targetWordArray.indexOf(guessArray[i]);
        if(index !== -1) {
            feedback[i] = 'present';
            targetWordArray[index] = null; // Mark as used
        }
        
    }
    return feedback;
}

let BoardSolved = [false, false];

const submitGuess = () => {
    try {
        for(let b = 0 ; b < 2 ; b++) {

            if(BoardSolved[b]) continue;

            const feedback = checkGuess(currentGuess.toUpperCase() , targetWords[b]);

            for(let i = 0 ; i < WORD_LENGTH; i++) {
                const tile = document.getElementById(`tile-${b+1}-${i+1}-${currentAttempt+1}`);
                tile.classList.remove('flip');
                
                // setting gap bw each tile flipping
                setTimeout(() => {
                    tile.classList.add(feedback[i]);
                    tile.classList.add('flip');
                  }, i * 400);         
               }

                if (feedback.every( f => f === 'correct' )){
                BoardSolved[b] = true;
                document.getElementById(`board${b+1}`).classList.add('solved');

                if(BoardSolved[0] && BoardSolved[1]) {
                    Endgame(`Congratulations! You solved both words: ${targetWords.join(' and ')}`,true);
                } else {
                    ShowPopup(`You solved word ${b+1}!`);
                }
               } 

                if (currentAttempt === MAX_ATTEMPTS - 1) {
                Endgame(`Game Over! The words were: ${targetWords.join(' and ')}`);
                BoardSolved[b] = true; // Marking the board as solved
                document.getElementById(`board${b+1}`).classList.add('solved');
                }

                const totalAnimationTime = (WORD_LENGTH - 1) * 400 + 600; // Last tile starts + animation duration
                setTimeout(() => {
                    console.log(`[TIMING] About to count green tiles after attempt ${currentAttempt}`);
                    const greenCount = countGreenTiles();
                    console.log(`[SPEED CHECK] greenTiles: ${greenCount}`);
                    changeSpeed();
                }, totalAnimationTime + 100); // Extra 100ms buffer
        }
        
        currentAttempt++;
        updateGuessCounter();
        currentGuess = ''; // Reseting current guess 
        updateBoards();

        // Wait until all flips are done before counting green tiles
        setTimeout(() => {
            changeSpeed();
            console.log(`[SPEED CHECK] greenTiles: ${countGreenTiles()}`);
        }, totalAnimationTime + 100); // Added extra 100ms buffer to ensure all animations complete

    } catch (error) {
        console.error('Error submitting guess:', error);
    }
}

const ShowPopup =(message) => {
   const popUp = document.createElement('div');
   popUp.className = 'popup';
   popUp.textContent = message;
   document.body.appendChild(popUp);

   popUp.classList.add('show');

    setTimeout(() => {
         popUp.remove('show');
    }, 3500);

}

let gameOver = false;

const Endgame = (message,isWin = false) => {
    gameOver = true;
    ShowPopup(message);

    // confetti effect using a js library
    if (isWin) {
        confetti({
          particleCount: 180,
          spread: 90,
          origin: { y: 0.6 }
        });
    }
    document.removeEventListener('keydown', handleKeyPress);
    document.removeEventListener('keydown', handleSpecialKeyPress);
}

//timer functionality
// let word = '';

const countUniqueLetters = (word) => {
    let wordString = String(word);
      if (typeof wordString !== 'string') return 0;
    let unique = [];
    for (let char of wordString) {
        if(!unique.includes(char)){
            unique.push(char);
        }
    }
    return unique.length;
}

const getBaseTime = (avgDifficulty) => {
    if (avgDifficulty <= 3) return 90; // Easy
    if (avgDifficulty <= 5) return 75; // Medium
    return 60; // Hard
};

let timerSpeed = 1;
let timerInterval;
let lastUpdate = Date.now();

let baseTime;
let timeLeft = baseTime;

function getCurrentInterval() {
    return 1000 / timerSpeed; 
}

const startTimer = () => {
  if (timerInterval) clearInterval(timerInterval);
  lastUpdate = Date.now();
  timerInterval = setInterval(timerTick, 50);
};

const updateTimer = () => {
  const timerLabel = document.getElementById('timer-label');
  timerLabel.textContent = Math.ceil(timeLeft);
};

const timerTick = () => {
  if (gameOver || timeLeft <= 0) {
    clearInterval(timerInterval);
    return;
  }
  let now = Date.now();
  let elapsed = (now - lastUpdate) / 1000; // seconds
  lastUpdate = now;
  timeLeft -= elapsed * timerSpeed;
  if (timeLeft < 0) timeLeft = 0;
  updateTimer();
  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    Endgame(`Time's up! The words were: ${targetWords.join(' and ')}`);
  }
};


const countGreenTiles = () => {
    let total = 0;
    for (let b = 0; b < 2; b++) {
        const tiles = document.querySelectorAll(`.board${b + 1} .tile.correct`);
        console.log(`Board ${b+1} green tiles:`, tiles);
        total += tiles.length;
    }
    console.log(`Total green tiles: ${total}`);
    return total;
};


const changeSpeed = () => {
    const greenTiles = countGreenTiles();
    const newSpeed = Math.min(1 + greenTiles * 0.5, 5); // Max 5x speed
    console.log(`Timer speed changed from ${timerSpeed} to ${newSpeed} (${greenTiles} green tiles)`);
    timerSpeed = newSpeed;
};

window.onload = async function() {
  await fetchWords();      
  createBoards();          
  createKeyboard();        
  updateBoards();     
  updateGuessCounter();  
    console.log('Game initialized with target words:', targetWords);
let difficulty1 = countUniqueLetters(targetWords[0]);
let difficulty2 = countUniqueLetters(targetWords[1]);
let avgDifficulty = Math.floor((difficulty1 + difficulty2) / 2);

 baseTime = getBaseTime(avgDifficulty);
 timeLeft = baseTime;
 startTimer();       
    
};
