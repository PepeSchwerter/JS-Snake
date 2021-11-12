//random apple 
function genApple(width, height){
    while(true){
        let apple = {
            x : Math.floor(Math.random()*width),
            y : Math.floor(Math.random()*height)
        }
        //verify if the apple is not inside the snake
        if(!selfCollision(apple, snake, true)){
            return apple
        }
    }
}

//check self collision
function selfCollision(block, snake, apple = false){
    let begin = 1;
    //for apple-snake collision
    if(apple){
        let begin = 0; 
    }
    for(let i = begin; i < snake.length; i++){
        if(snake[i].x == block.x && snake[i].y == block.y){
            return true;
        }
    }
    return false;
}

//generate final score text
function finalScoreDisplay(score){
    if(score > localStorage.snakeHighScore){
        return "New Highscore: " + score + "!"
    }
    return "Your Score: " + score + "\n Highscore: " + localStorage.snakeHighScore;
}

function togglePause(){
    if(uiState === 1){
        changeUiState(2);
    }
    else {
        changeUiState(1);
        lastTime = new Date().getTime(); 
        window.requestAnimationFrame(gameLoop);
    }
}

//game over
function gameOver(){ 
    obtainedScore.innerText = finalScoreDisplay(score);
    
    if(score > localStorage.snakeHighScore){
        localStorage.snakeHighScore = score;
    }
    changeUiState(3);
    ctx.clearRect(0, 0, width*box, height*box);
}

//game init
function gameInit(){
    changeUiState(1);
    snakeInit();
    apple = genApple(width, height);
    score = 0;
    d = "";
    lastTime = new Date().getTime(); 
    window.requestAnimationFrame(gameLoop);
}

//snake init
function snakeInit(){
    snake = [];
    snake[0] =  {
        x : Math.floor(Math.random()*width),
        y : Math.floor(Math.random()*height)
    }
}

//ui state managment
function changeUiState(state) {
    ui.classList.toggle(uiStateClasses[uiState]);
    ui.classList.toggle(uiStateClasses[state]);
    uiState = state;
}

//units
const box          = 32;
const width        = 18;
const height       = 18;
//fps managment
const fps          = 7;
const interval     = 1000/fps;
let lastTime     = 0;
let delta        = 0;

const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

//local storage highscore
if (!localStorage.snakeHighScore){
    localStorage.snakeHighScore = 0;
}

//background drawing
const cvs_bg = document.getElementById("bg");
const ctx_bg = cvs_bg.getContext("2d");

for(let i = 0; i < height; i++){
    for(let j = 0; j < width; j++){
        if((j+i) % 2){
            ctx_bg.fillStyle = "#60a832";
        }
        else{
            ctx_bg.fillStyle = "#58a12a";
        }
        ctx_bg.fillRect(j*box, i*box, box, box);
    }
}


let snake;
let apple;
let score;
const scoreSpan = document.querySelector(".score");

//controls
let d; //direction
document.addEventListener("keydown", direction);

function direction(event){
    if(uiState === 1){
        if(event.keyCode == 37 && d != "RIGHT"){
            d = "LEFT";
        }
        else if(event.keyCode == 38 && d != "DOWN"){
            d = "UP";
        }
        else if(event.keyCode == 39 && d != "LEFT"){
            d = "RIGHT";
        }
        else if(event.keyCode == 40 && d != "UP"){
            d = "DOWN";
        } 
    }
    
    //pause button
    if(event.keyCode == 32 && (uiState === 1 || uiState === 2)){
        togglePause();
    }  
}



//game loop
function gameLoop(time){
    delta = (time-lastTime);

    if(delta > interval) { //fps control
        //UPDATING
        
        //old head pos
        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

        //direction 
        if(d == "LEFT"){
            snakeX -= 1;
            snakeX = (snakeX+width)%width;
        }
        if(d == "UP"){
            snakeY -= 1;
            snakeY = (snakeY+height)%height;
        }
        if(d == "RIGHT"){
            snakeX += 1;
            snakeX %= width;
        }
        if(d == "DOWN"){
            snakeY += 1;
            snakeY %= height;
        } 
        
        //apple collision
        if(snakeX == apple.x && snakeY == apple.y) {
            score++;
            apple = genApple(width, height);
        } 
        else {
            //remove tail
            snake.pop();
        }

        //new head
        snake.unshift({
            x : snakeX,
            y : snakeY
        });

        ctx.clearRect(0, 0, width*box, height*box);
        //DRAWING
        
        for(let i = 0; i < snake.length; i++){
            ctx.fillStyle = (i == 0)? "#BBB" : "#FFF";
            ctx.fillRect(snake[i].x*box,snake[i].y*box,box,box)
        }
        //apple
        ctx.fillStyle = "red";
        ctx.fillRect(apple.x*box,apple.y*box,box,box);
        //score
        scoreSpan.innerText = score;

        //game over
        if(selfCollision({x: snakeX, y: snakeY}, snake)){
            gameOver();
        }
    }
    if(uiState === 1 ){
        lastTime = time - (delta % interval);
        window.requestAnimationFrame(gameLoop);
    }
}


const ui = document.querySelector(".ui");
const play = document.querySelector(".play");
const resume = document.querySelector(".resume");
const obtainedScore = document.querySelector(".obtainedScore");
//0: mainMenu, 1: game, 2: pause, 3: gameOver
let uiState = 0;
let uiStateClasses = {
    0: "mainMenu",
    1: "inGame",
    2: "pauseMenu",
    3: "inGameOver",
}

//play button logic
play.addEventListener("click",() => {
    //game loop 
    gameInit();
})

//resume button logic
resume.addEventListener("click", () => {
    togglePause();
}) 


