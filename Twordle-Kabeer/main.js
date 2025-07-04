const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;
let targetWords = []; 
let currentGuess = '';
let currentAttempt = 0;

// fetching the 2 words using an API key
const fetchWords = async () => {
  try {
    const response = await fetch ('https://random-word-api.herokuapp.com/word?number=2&length=5');
    const words = await response.json();
    targetWords = words.map(word => word.toUpperCase());
  } catch (error) {
    console.error('Error fetching words:', error);
    return [];
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
            tile.className = 'tile'; // for checking the color
            if (currentGuess[k]) {
                tile.classList.remove('pop'); // resetting the animation
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
                // document.querySelectorAll(`.board${b+1} .tile`).forEach(tile => {
                //     tile.classList.add('solved-tile');
                // });

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
        }
        
        currentAttempt++;
        updateGuessCounter();
        currentGuess = ''; // Reseting current guess 
        updateBoards();

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















window.onload = async function() {
  await fetchWords();      // Fetch the two target words from the API
  createBoards();          // Dynamically create the two Dordle boards
  createKeyboard();        // Generate the on-screen keyboard
  updateBoards();     
  updateGuessCounter();     // Show empty tiles for the first guess
    console.log('Game initialized with target words:', targetWords);
};
