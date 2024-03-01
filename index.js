// Game Constants & Variables

const foodSound = new Audio('food.mp3');
const gameOverSound = new Audio('wallcollide.mp3');
const moveSound = new Audio('bodycollide.mp3');
const musicSound = new Audio('gamemusic.mp3');
let speed = 5;
let score1 = 0;
let score2 = 0;
let lastPaintTime = 0;
let snakeArr1 = [{ x: 13, y: 15 }];//
let snakeArr2 = [{ x: 4, y: 15 }];//
let inputDir1 = { x: 0, y: 0 };
let inputDir2 = { x: 0, y: 0 };
let food = { x: 6, y: 7 };


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

//no change needed
function isCollide(snake) {
    // If you bump into yourself or other
    for (let i = 1; i < Math.max(snakeArr1.length,snakeArr2.length); i++) {
        if (i< snakeArr1.length &&  snakeArr1[i].x === snake[0].x && snakeArr1[i].y === snake[0].y) {
            return true;
        }
        if (i< snakeArr2.length && snakeArr2[i].x === snake[0].x && snakeArr2[i].y === snake[0].y) {
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
    if (isCollide(snakeArr1) || isCollide(snakeArr2) ) // 
    {
        gameOverSound.play();
        musicSound.pause();
        inputDir1 = { x: 0, y: 0 };
        inputDir2 = { x: 0, y: 0 };//
        alert("Game Over. Press any key to play again!");        
        
        snakeArr1 = [{ x: 13, y: 15 }];
        snakeArr2 = [{ x: 4, y: 15 }];//
        musicSound.play();
        score1=0;///////////////need score update for both
        score2=0;
        scoreBox.innerHTML = "Score1: " + score1+ " | Score2: "+score2; ////adding to update score on screen
        food = { x: 6, y: 7 };                  ////for same initial position each time
    }
    


    // If you have eaten the food, increment the score and regenerate the food
    //snake 1
    if (snakeArr1[0].y === food.y && snakeArr1[0].x === food.x) {

    
        foodSound.play();
        score1 += 1;
        // if (score > hiscoreval) {
        //     hiscoreval = score;
        //     localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
        //     hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
        // }
        scoreBox.innerHTML =  "Score1: " + score1+ " | Score2: "+score2;
        snakeArr1.unshift({ x: snakeArr1[0].x + inputDir1.x, y: snakeArr1[0].y + inputDir1.y });
        let a = 2;
        let b = 16;

        //make sure food not appear on snake //can be moved to function
        let foodx;
        let foody;
        let foodOnSnake;
        do{
            foodOnSnake=false;
            foodx=Math.round(a + (b-a)* Math.random())
            foody=Math.round(a + (b-a)* Math.random())

            for (let i = 0; i < snakeArr1.length; i++) {
                if(snakeArr1[i].x === foodx && snakeArr1[i].y === foody){
                    foodOnSnake=true;
                    break;
                }
            }
        
        }while(foodOnSnake==true);
        
        food={x:foodx,y:foody};
        //food = {x: Math.round(a + (b-a)* Math.random()), y: Math.round(a + (b-a)* Math.random())}
    }
    //snake2
    if (snakeArr2[0].y === food.y && snakeArr2[0].x === food.x) {

    
        foodSound.play();
        score2 += 1;
        // if (score > hiscoreval) {
        //     hiscoreval = score;
        //     localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
        //     hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
        // }
        scoreBox.innerHTML =  "Score1: " + score1+ " | Score2: "+score2;
        snakeArr2.unshift({ x: snakeArr2[0].x + inputDir2.x, y: snakeArr2[0].y + inputDir2.y });
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

            for (let i = 0; i < snakeArr2.length; i++) {
                if(snakeArr2[i].x === foodx && snakeArr2[i].y === foody){
                    foodOnSnake=true;
                    break;
                }
            }
        
        }while(foodOnSnake==true);
        
        food={x:foodx,y:foody};
        //food = {x: Math.round(a + (b-a)* Math.random()), y: Math.round(a + (b-a)* Math.random())}
    }


    // Moving the snake1
    for (let i = snakeArr1.length - 2; i >= 0; i--) {
        snakeArr1[i + 1] = { ...snakeArr1[i] };
    }
    snakeArr1[0].x += inputDir1.x;
    snakeArr1[0].y += inputDir1.y;
    ////////////////////////////////

    // Moving the snake2
    for (let i = snakeArr2.length - 2; i >= 0; i--) {
        snakeArr2[i + 1] = { ...snakeArr2[i] };
    }
    snakeArr2[0].x += inputDir2.x;
    snakeArr2[0].y += inputDir2.y;
    ////////////////////////////////

    // Part 2: Display the snake and Food
    // Display the snake
    const board = document.getElementById('board');
    board.innerHTML = "";
        
    snakeArr1.forEach((e, index) => {
        const snakeElement = document.createElement('div');
        
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        
        if (index === 0) {
            snakeElement.classList.add('head1');
        } else {
            snakeElement.classList.add('snake1');
        }
        board.appendChild(snakeElement);
        
        let headElement = document.querySelector('.head1');
        // Apply the rotation transformation for snake head alignment
        if(inputDir1.x==0&&inputDir1.y==-1)//up
            headElement.style.transform = 'rotate(-90deg)';
        if(inputDir1.x==0&&inputDir1.y==1)//down
            headElement.style.transform = 'rotate(90deg)';
        if(inputDir1.x==-1&&inputDir1.y==0)//left
            headElement.style.transform = 'rotate(180deg)';
        //for right default image orientation
    });
    /////////////
    snakeArr2.forEach((e, index) => {
        const snakeElement = document.createElement('div');
        
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        
        if (index === 0) {
            snakeElement.classList.add('head2');
        } else {
            snakeElement.classList.add('snake2');
        }
        board.appendChild(snakeElement);
        
        let headElement = document.querySelector('.head2');
        // Apply the rotation transformation for snake head alignment
        if(inputDir2.x==0&&inputDir2.y==-1)//up
            headElement.style.transform = 'rotate(-90deg)';
        if(inputDir2.x==0&&inputDir2.y==1)//down
            headElement.style.transform = 'rotate(90deg)';
        if(inputDir2.x==-1&&inputDir2.y==0)//left
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
            changeDirectionUp(inputDir1);
            break;

        case "ArrowDown":
            changeDirectionDown(inputDir1);
            break;

        case "ArrowLeft":
           changeDirectionLeft(inputDir1);
            break;

        case "ArrowRight":
            changeDirectionRight(inputDir1);
            break;
/////////////////////////////////////////////
        case 'w':
            changeDirectionUp(inputDir2);
            break;
        case 's':
            changeDirectionDown(inputDir2);
            break;
        case 'a':
            changeDirectionLeft(inputDir2);
            break;
        case 'd':
            changeDirectionRight(inputDir2);
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

function changeDirectionLeft(inputDir){
    if (inputDir.x !== 1) { // Prevent the snake from reversing its direction horizontally
        inputDir.x = -1;
        inputDir.y = 0;

        moveSound.play();
    }
}
function changeDirectionRight(inputDir){
    if (inputDir.x !== -1) { // Prevent the snake from reversing its direction horizontally
        inputDir.x = 1;
        inputDir.y = 0;

        moveSound.play();
    }
}
function changeDirectionUp(inputDir){
    if (inputDir.y !== 1) { // Prevent the snake from reversing its direction vertically
        inputDir.x = 0;
        inputDir.y = -1;

        moveSound.play();
    }
}
function changeDirectionDown(inputDir){
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