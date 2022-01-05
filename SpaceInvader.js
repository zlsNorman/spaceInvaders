let spaceship;
let aliens = [];
let bullets = [];
let alienBullets = [];

function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
   }
/*create the first aliens
 */
function createAliens(){
    let alienWidth = 20;
    let alienHeight = 20;
    let alienColumn = gameArea.canvas.width / (alienWidth*2);

    for(i = 1; i<= alienColumn; i++){
        let alienX = ((gameArea.canvas.width) / alienColumn)*i -alienWidth;
        aliens.push(new component(alienWidth,alienHeight,alienX ,10,"img/alien.png","alien"));
    }
}

const startGame = () => {
    gameArea.start();

    let spaceshipWidth = 30;
    let spaceshipHeight = 30;
    let spaceshipX = (gameArea.canvas.width/2)-(spaceshipWidth/2);
    
    let borderGap = 10;
    let spaceshipY = (gameArea.canvas.height-spaceshipHeight-borderGap);
    spaceship = new component(spaceshipWidth,spaceshipHeight,spaceshipX,spaceshipY,"img/spaceship2.png","spaceship");

    createAliens();
}

const gameArea = {
    /** @type {HTMLCanvasElement} */
    canvas : document.createElement("canvas"),
    start : function(){
        this.aliensAlive = false;
        this.alienDeathCount = 0;
        this.bulletIntervall = 0;
        this.bulletCount = 0;
        this.alienbulletIntervall = 0;
        this.alienBulletCount = 0;

        this.canvas.width = 500;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas,document.body.childNodes[0])
        this.interval = setInterval(updateGameArea,16);
        window.addEventListener("keydown", function (e) {
            gameArea.pressedKey = (gameArea.pressedKey || []);
            gameArea.pressedKey[e.keyCode] = true;
          });
        window.addEventListener("keyup",function(e){
            gameArea.pressedKey[e.keyCode] = false;
        })
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function(aliensAlive) {
        clearInterval(this.interval);
        let gameOver = document.createElement("div");
        if(aliensAlive){
            gameOver.innerHTML = "GAME OVER"
            gameOver.style.color = "red"
            document.body.appendChild(gameOver);
        }else{
            gameOver.innerHTML = "GEWONNEN"
            gameOver.style.color = "green"
            document.body.appendChild(gameOver);
        }
    }
}


function component(width,height,x,y,color,type){

    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    if(type == "bullet"|| type == "alienBullet"){
    }else{
        this.image = new Image();
        this.image.src = color;
        this.moveTo = "left";
    }
    
    this.alive = true;

    this.update = function(){
        if(type == "bullet" || type == "alienBullet"){
            ctx = gameArea.context;
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }else{
            ctx = gameArea.context;
            ctx.fillStyle = color;
            ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
        }
    }
    this.newPoss = function(){
        if(type == "bullet"){
            this.y += -3;
        }else if(type == "alienBullet"){
            this.y += 3;
        }else{
            this.x += this.speedX;
        }
    }
    //status is true when aliens x != 0
    this.newAlienPos = function(status,aleienX){
        let movementEaqualToDeath;
        if(gameArea.alienDeathCount == 0){
            movementEaqualToDeath = 0;
        }else{
            movementEaqualToDeath = gameArea.alienDeathCount*0.1;
        }
        if(status){
            this.x += -0.5 - movementEaqualToDeath;
            if(aleienX <= 0){
                this.moveTo = "right"
            }

        }else{
            this.x += +0.5 + movementEaqualToDeath;
            if(aleienX >= gameArea.canvas.width - this.width){
                this.moveTo = "left"
            }
        }   
    }  
}
function move(component){
    component.speedX = 0;
    if((gameArea.pressedKey && gameArea.pressedKey[37])  && component.x > 0){
        component.speedX += -5;
    }
    if((gameArea.pressedKey && gameArea.pressedKey[39]) && component.x < (gameArea.canvas.width - component.width)){
        component.speedX += 5;
    }
}
function shoot(spaceship){
    gameArea.bulletIntervall++;

    bulletWidth = 2;
    bulletHeight = 12;
    if((gameArea.bulletCount == 0 || gameArea.bulletIntervall > 60) &&(gameArea.pressedKey && gameArea.pressedKey[32])){
        gameArea.bulletIntervall = 0;
        gameArea.bulletCount++;
        bullet = new component(bulletWidth,bulletHeight,spaceship.x + (spaceship.width/2) -(bulletWidth/2), spaceship.y -spaceship.height,"red","bullet");
        bullets.push(bullet);
    }
}
function alienShoot(alien){
    gameArea.alienbulletIntervall++;

    bulletWidth = 2;
    bulletHeight = 12;
    if((gameArea.alienbBulletCount == 0 || gameArea.alienbulletIntervall > (70-gameArea.alienDeathCount))){
        gameArea.alienbulletIntervall = 0;
        gameArea.alienbBulletCount++;
        bullet = new component(bulletWidth,bulletHeight,alien.x + (alien.width/2) -(bulletWidth/2), alien.y +alien.height,"green","alienBullet");
        alienBullets.push(bullet);
    }
}

function updateGameArea() {
    //zählt die tode der Aliens
    gameArea.alienDeathCount = 0;
    for(let i = 0; i<aliens.length; i++){
        if(!aliens[i].alive){
            gameArea.alienDeathCount++
        }
    }
    
    let randomNumber = Math.floor(Math.random()*(aliens.length));
    gameArea.clear();
    shoot(spaceship);
    while(aliens[randomNumber].alive == false){
        randomNumber = Math.floor(Math.random()*(aliens.length));
    }
    alienShoot(aliens[randomNumber]);
    for(i = 0; i < bullets.length; i++){
        bullets[i].newPoss();
        bullets[i].update();
    }
    for(i = 0; i < alienBullets.length; i++){
        alienBullets[i].newPoss();
        alienBullets[i].update();
    }
    move(spaceship);
    spaceship.newPoss();
    spaceship.update();

    gameArea.aliensAlive = false;
    durch =false;
    for(i = 0; i < aliens.length; i++){
        for(x = 0; x < bullets.length;x++){
            let myleft = aliens[i].x;
            let myright = aliens[i].x + (aliens[i].width);
            let mytop = aliens[i].y;
            let mybottom = aliens[i].y + (aliens[i].height);
            let otherleft = bullets[x].x;
            let otherright = bullets[x].x + (bullets[x].width);
            let othertop = bullets[x].y;
            let otherbottom = bullets[x].y + (bullets[x].height);
            

            if((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)){
            }else{
                aliens[i].alive = false;
            }
        }
        
        let firstAlienAlive = () =>{
            let counter = 0;
            for(let i = 0;i<aliens.length;i++){
                if(aliens[i].alive){
                    return counter;
                }
                if(counter==aliens.length-1){
                    return 0;
                }
                counter++;
            }
        }
        let lastAlienAlive = () =>{
            let counter = aliens.length-1;
            for(let i = (aliens.length-1);i!=0;i--){
                if(aliens[i].alive){
                    return counter;
                }
                if(counter==0){
                    return aliens.length-1;
                }
                counter--;
            }
        }
        if(aliens[0].moveTo == "left"){
            aliens[i].newAlienPos(true,aliens[firstAlienAlive()].x);
        }else{
            aliens[i].newAlienPos(false,aliens[lastAlienAlive()].x);
        }
        if(aliens[i].alive){
            aliens[i].update();
            gameArea.aliensAlive = true;
        }
        durch = true;
    }
    for(x = 0; x < alienBullets.length;x++){
        let myleft = spaceship.x;
        let myright = spaceship.x + (spaceship.width);
        let mytop = spaceship.y;
        let mybottom = spaceship.y + (spaceship.height);
        let otherleft = alienBullets[x].x;
        let otherright = alienBullets[x].x + (alienBullets[x].width);
        let othertop = alienBullets[x].y;
        let otherbottom = alienBullets[x].y + (alienBullets[x].height);
        

        if((mybottom < othertop) ||
        (mytop > otherbottom) ||
        (myright < otherleft) ||
        (myleft > otherright)){
        }else{
            gameArea.stop(gameArea.aliensAlive);
        }
    }
    if(!gameArea.aliensAlive && durch){
        gameArea.stop(gameArea.aliensAlive);
    }
}
startGame();