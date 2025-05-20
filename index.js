let count = 3;
let timer = 30;
let winner = false;
let loser = false;
let powerUp = false;
let darkMode = "outline-";

function reset()
{
  const gameGrid = document.getElementById("game_grid");
  const header = document.getElementById("header");
  const status = document.getElementById("status");
  gameGrid.innerHTML = '';
  header.innerHTML = '';
  status.innerHTML = '';
  winner = false;
  loser = false;

  startUp();
  loadPokemonCards();
}

function countDown()
{
  const timerDiv = document.getElementById("timer");
  let counter = timer;
  const interval = setInterval(() => {
    counter--;
    timerDiv.textContent = counter;
    if(powerUp)
    {
      counter += 3;
      powerUp = false;
    }
    if(counter < 1 ||
       winner == true
      )
    {
      clearInterval(interval);
      if(winner == false)
      {
        lose();
      }
    }   
  }, 1000);
}

function startUp()
{
  const container = document.getElementById("header");

  const content = `
    <div class="d-flex flex-column flex-md-row p-4 gap-4 py-md-5 align-items-center justify-content-center">
    <div class="bd-example m-0 border-0">
      <ul>
        <li class="list-group-item">Number of clicks: <span id='numClicks'>0</span></li>
        <li class="list-group-item">Number of pairs left: <span id='pairsLeft'>${count}</span></li>
        <li class="list-group-item">Number of pairs matched: <span id='pairsMatched'>0</span></li>
        <li class="list-group-item">Total Number of Pairs: ${count}</li>
        <li class="list-group-item">Timer: <span id='timer'>${timer}</span></li>
      </ul  
    </div>
    <div class='container d-flex justify-content-center py-3'>
      <button class="btn btn-${darkMode}success" onclick='difficulty(3, 30), reset()'>Easy</button>
      <button class="btn btn-${darkMode}warning" onclick='difficulty(6, 25), reset()'>Medium</button>
      <button class="btn btn-${darkMode}danger" onclick='difficulty(8, 20), reset()'>Hard</button>
    </div>
    <div class='container d-flex justify-content-center py-3'>
      <button class="btn btn-${darkMode}light" onclick='start(${count}, ${timer})'>Start</button>
    </div>
    
  `
  container.insertAdjacentHTML("beforeend", content);
}

function loadPokemonCards()
{
  const container = document.getElementById("game_grid");

  const numbers = [];
  for(let c = 0; c < count; c++)
  {
    const num = Math.floor(Math.random() * 1025);
    numbers.push(num);
    numbers.push(num);
  }

  for(let i = 0; i < count * 2; i++)
  {
    const randNum = Math.floor(Math.random() * numbers.length);
    const pokeNum = numbers[randNum];
    let width = 33.33;
    if(count % 2 == 0 &&
      count > 3
      )
    {
      width = 25;
    }
    const content = `
      <div class="card1" style="width: ${width}%;">
        <img id="img${i}" class="front_face" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeNum}.png" alt="">
        <img class="back_face" src="back.webp" alt="">
      </div>
    ` 
    container.insertAdjacentHTML("beforeend", content);
    const index = numbers.indexOf(pokeNum);
    if(index > -1)
    {
      numbers.splice(index, 1);
    }
  }
  
}

async function setup () {
  let firstCard = undefined
  let secondCard = undefined
  let matches = 0;
  let matchesInARow = 0;
  let clicks = 0;
  let boardLocked = false;
  $(".card1").on(("click"), async function click() {
    if(boardLocked || loser) return;

    const clicksDiv = document.getElementById("numClicks");
    clicksDiv.textContent = ++clicks;
    $(this).toggleClass("flip");

    if (!firstCard)
    {
      firstCard = $(this).find(".front_face")[0]
      $(`#${firstCard.id}`).parent().off("click")
    }
    else 
    {
      boardLocked = true;
      secondCard = $(this).find(".front_face")[0]
      $(`#${secondCard.id}`).parent().off("click")

      console.log(firstCard, secondCard);
      if (firstCard.src == secondCard.src) 
      {
        console.log("match");
        matches++;
        matchesInARow++;
        if(matchesInARow >= 2)
        {
          powerUp = true;
        }
        const pairsLeft = document.getElementById("pairsLeft");
        const pairsMatched = document.getElementById("pairsMatched");
        pairsLeft.textContent = (count - matches);
        pairsMatched.textContent = matches;
        if(matches == count)
        {
          win();
          return winner = true;
        }
      } 
      else 
      {
        console.log("no match")
        matchesInARow = 0;
        await new Promise((resolve) => {
          setTimeout(() => {
          $(`#${firstCard.id}`).parent().toggleClass("flip")
          $(`#${secondCard.id}`).parent().toggleClass("flip")
          resolve();
        }, 1000)
        });
        $(`#${firstCard.id}`).parent().on("click", click);
        $(`#${secondCard.id}`).parent().on("click", click)
      }
      firstCard = undefined
      secondCard = undefined
      boardLocked = false;
    }
  });
}
// $(document).ready(setup)

function win()
{
  const container = document.getElementById("status");
  const content = `
    <h3 class="container d-flex justify-content-center">Congratulations! You Win!</h3>
    <div class="container d-flex justify-content-center py-3">
      <button class="btn btn-primary" onclick='reset()'>Play Again</button>
    </div>
  `
  container.insertAdjacentHTML("beforeend", content);
  document.getElementById("theme").style.display = "block";
}

function lose()
{
  loser = true;
  const container = document.getElementById("status");
  const content = `
    <h3 class="container d-flex justify-content-center">GAME OVER!</h3>
    <div class="container d-flex justify-content-center py-3">
      <button class="btn btn-primary" onclick='reset()'>Play Again</button>
    </div>
  `
  container.insertAdjacentHTML("beforeend", content);
  document.getElementById("theme").style.display = "block";
}

function start(count, timer)
{
  document.getElementById("theme").style.display = "none";
  countDown(timer);
  setup(count);
}

function difficulty(newCount, newTimer)
{
  count = newCount;
  timer = newTimer;
}

function themeSwitch()
{
  const body = document.getElementById("body");
  console.log(body.style.backgroundImage);
  if(body.style.backgroundImage == 'url("LightMode.jpg")')
  {
    body.style.backgroundImage = "url(DarkMode.jpg)";
    darkMode = "";
  }
  else
  {
    body.style.backgroundImage = "url(LightMode.jpg)";
    darkMode = "outline-";
  }
  reset();
}

startUp();
loadPokemonCards();