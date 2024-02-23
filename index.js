// Game Constants & Variables
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('food.mp3');
const gameOverSound = new Audio('wallcollide.mp3');
const moveSound = new Audio('bodycollide.mp3');
const musicSound = new Audio('gamemusic.mp3');
let speed = 5;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };

let eatingAnimationFlag=0;
function toggleMute() {
    if (musicSound.muted) {
        musicSound.muted = false;
        document.getElementById('mute').textContent = 'Mute';
    } else {
        musicSound.muted = true;
        document.getElementById('mute').textContent = 'Unmute';
    }
}


// Game Functions
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // If you bump into yourself 
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    // If you bump into the wall
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }
    return false;
}

function gameEngine() {
    // Part 1: Updating the snake array & Food
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        alert("Game Over. Press any key to play again!");        
        
        snakeArr = [{ x: 13, y: 15 }];
        musicSound.play();
        score = 0;
        scoreBox.innerHTML = "Score: " + score; ////adding to update score on screen
        food = { x: 6, y: 7 };                  ////for same initial position each time
    }

    ///////////////////////////////////////////////////////////////////////////////////
    //If snake about to eat food
    if (snakeArr[0].y +2*inputDir.y === food.y && snakeArr[0].x + 2*inputDir.x === food.x)
    {
        //for snake bg image of open mouth
        eatingAnimationFlag++;
        setTimeout(()=>{eatingAnimationFlag--;},200)
    }
    //////////////////////////////////////////////////////////////////////////////////////


    // If you have eaten the food, increment the score and regenerate the food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {

        ////////////////////////////////////////////////////////////////////////////////////////////////
        //for snake bg image of open mouth
        eatingAnimationFlag++;
        setTimeout(()=>{eatingAnimationFlag--;},500)
        ////////////////////////////////////////////////////////////////////////////////////////////////////

        foodSound.play();
        score += 1;
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
        }
        scoreBox.innerHTML = "Score: " + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        let a = 2;
        let b = 16;

        //make sure food not appear on snake
        let foodx;
        let foody;
        let foodOnSnake;
        do{
            foodOnSnake=false;
            foodx=Math.round(a + (b-a)* Math.random())
            foody=Math.round(a + (b-a)* Math.random())

            for (let i = 0; i < snakeArr.length; i++) {
                if(snakeArr[i].x === foodx && snakeArr[i].y === foody){
                    foodOnSnake=true;
                    break;
                }
            }
        
        }while(foodOnSnake==true);
        
        food={x:foodx,y:foody};
        //food = {x: Math.round(a + (b-a)* Math.random()), y: Math.round(a + (b-a)* Math.random())}
    }

    // Moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2: Display the snake and Food
    // Display the snake
    const board = document.getElementById('board');
    board.innerHTML = "";
        
    snakeArr.forEach((e, index) => {
        const snakeElement = document.createElement('div');
        
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        
        if (index === 0) {
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
        
        //give bg image to snake head based on flag
        //If about to or eaten food
        let headElement = document.querySelector('.head');
        if(eatingAnimationFlag==0)
                headElement.style.backgroundImage = "url('/1.png')";
        else
                headElement.style.backgroundImage = "url('/2.png')";

        // Apply the rotation transformation for snake head alignment
        if(inputDir.x==0&&inputDir.y==-1)//up
            headElement.style.transform = 'rotate(-90deg)';
        if(inputDir.x==0&&inputDir.y==1)//down
            headElement.style.transform = 'rotate(90deg)';
        if(inputDir.x==-1&&inputDir.y==0)//left
            headElement.style.transform = 'rotate(180deg)';
        //for right default image orientation
    });

    // Display the food
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}


window.addEventListener('keydown', e => {
    // moveSound.play();//moved to direction functions
    switch (e.key) {
        case "ArrowUp":
            changeDirectionUp();
            break;

        case "ArrowDown":
            changeDirectionDown();
            break;

        case "ArrowLeft":
           changeDirectionLeft();
            break;

        case "ArrowRight":
            changeDirectionRight();
            break;

        default:
            break;
    }

    
});


//use board instead of whole window
board.addEventListener("pointerdown",e=>{
    initialX=e.clientX;
    initialY=e.clientY;
})
board.addEventListener("pointerup",e=>{
    finalX=e.clientX;
    finalY=e.clientY;

    let changeX=finalX-initialX;
    let changeY=finalY-initialY;

    if(Math.abs(changeX)>Math.abs(changeY))
    {
        if(changeX<0)
        {    
            console.log("left");
            changeDirectionLeft();
        }
        
        else
        {
            console.log("right");
            changeDirectionRight();
        } 
    }
    else
    {
        if(changeY<0)
        {
            console.log("up");
            changeDirectionUp();
        }    
        
        else
        {
            console.log("down");
            changeDirectionDown();
        }
    }     

})

function changeDirectionLeft(){
    if (inputDir.x !== 1) { // Prevent the snake from reversing its direction horizontally
        inputDir.x = -1;
        inputDir.y = 0;

        moveSound.play();
    }
}
function changeDirectionRight(){
    if (inputDir.x !== -1) { // Prevent the snake from reversing its direction horizontally
        inputDir.x = 1;
        inputDir.y = 0;

        moveSound.play();
    }
}
function changeDirectionUp(){
    if (inputDir.y !== 1) { // Prevent the snake from reversing its direction vertically
        inputDir.x = 0;
        inputDir.y = -1;

        moveSound.play();
    }
}
function changeDirectionDown(){
    if (inputDir.y !== -1) { // Prevent the snake from reversing its direction vertically
        inputDir.x = 0;
        inputDir.y = 1;

        moveSound.play();
    }
}

  

// Main logic starts here
musicSound.play();
let hiscore = localStorage.getItem("hiscore");
if (hiscore === null) {
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval))
} else {
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "HiScore: " + hiscore;
}

window.requestAnimationFrame(main);
