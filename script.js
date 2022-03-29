// Global constants
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence
const nextclueHoldTime = 1000;
//Global Variables; code creates 3 variables in the global scope
var pattern = [];
var clueLength = 10;
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
var guessCounter = 0;
var clueHoldTime = 1000;
var errors = 0;
let timer = null;
var timeBeg = 100;
var timeEnd = 0;


function startGame() {
  progress = 0;
  errors = 0;
  gamePlaying = true;
  context.resume();
  pattern = []; 
  clueHoldTime = 1000;
  timeBeg = 100;
  timeEnd = 0;
  for (var i = 0; i < clueLength; i++) {
    pattern.push(patternRand(5));
  }
  console.log("pattern: " + pattern);
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

function stopGame() {
  progress = 0;
  gamePlaying = false;
  clearTimeout(timer);
  document.getElementById("timer").innerHTML = "Countdown: 0s";
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

function patternRand(max) {
  return Math.floor(Math.random() * Math.floor(max) + 1);
}
// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 204.5,
};

function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  context.resume();
  tonePlaying = true;
  setTimeout(function () {
    stopTone();
  }, len);
}

function startTone(btn) {
  if (!tonePlaying) {
    context.resume();
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    context.resume();
    tonePlaying = true;
  }
}

function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);

function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit");
}

function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit");
}

function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence() {
  context.resume();
  guessCounter = 0;
  clueHoldTime -= 80;
  let delay = nextClueWaitTime; 
  for (let i = 0; i <= progress; i++) {
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]); 
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
  clearInterval(timer);
  timeEnd = timeBeg;
  timer = setInterval(time, 1000);
}

function loseGame() {
  stopGame();
  alert("Game Over. You have lost.");
}

function WinGame() {
  stopGame();
  alert("You Won ! You are a memory wizard.");
}

function guess(btn) {
  console.log("user guessed: " + btn);
  if (!gamePlaying) {
    return;
  }
  if (pattern[guessCounter] == btn) {
    if (guessCounter == progress) {
      if (progress == pattern.length - 1) {
        WinGame();
      } else {
        progress++;
        playClueSequence();
      }
    } else {
      guessCounter++;
    }
  } else {
    errors++;
    if (errors == 3) {
      loseGame();
    } else {
      alert("Guesses remaining: " + (3 - errors));
      playClueSequence();
    }
  }
}

function resetTime() {
  clearTimeout(timer);
  timeEnd = 0;
  document.getElementById("timer").innerHTML = "Countdown: 0s";
}

function time() {
  if (timeEnd > 0) {
    timeBeg--;
    document.getElementById("timer").innerHTML = "Countdown: " + timeBeg + "s";
  } else {
    loseGame();
  }
}
