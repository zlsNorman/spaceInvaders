//windowData
const screenHeight = window.innerHeight;
const screenWidth = window.innerWidth;

//Figures
let spaceship;
let aliens = [];
let alienInvasion = [];

//figures projectals
let shipBullets = [];
let alienBullets = [];



//mousekoordinaten
let mouseCoorX;
let mouseCoorY;
const mouseCoor = (event) =>{
    let cRect = gameArea.canvas.getBoundingClientRect();        // Gets CSS pos, and width/height
    let canvasX = Math.round(event.clientX - cRect.left);  // Subtract the 'left' of the canvas 
    let canvasY = Math.round(event.clientY - cRect.top);
    let coor = "X coords: " + canvasX + ", Y coords: " + canvasY;
    mouseCoorX = canvasX;
}

//custom GameSettings
const customeGameSettings = () =>{
    
    alienCustomBulletIntervall = parseInt(document.querySelector("#alienbulletintervall").value);
    shipCustomBulletIntervall = parseInt(document.querySelector("#shipbulletintervall").value);
    controller = document.body.querySelector(".buttonContainer .aktiv").innerText;
    inputAlienRows = parseInt(document.querySelector("#alienrows").value);
    shipSpeed = parseInt(document.querySelector("#shipspeed").value);
    alienSpeed = parseInt(document.querySelector("#alienspeed").value)/10;

}

//erstellt alle aliens
const createAliens = () => {
    const alienWidth = 20;
    const alienHeight = 20;
    const alienColumn = ~~(gameArea.canvas.width / (alienWidth*2));
    inputAlienRows = parseInt(document.querySelector("#alienrows").value);

    for(let i = 1; i<= inputAlienRows; i++){
        aliens = [...new Array(alienColumn)];
        
        for(let alienIndex in aliens){
            
            let alienX = ((gameArea.canvas.width) / alienColumn)*(parseInt(alienIndex)+1) - alienWidth;
            let alien = new component(alienWidth,alienHeight,alienX ,(10*i)+(20*(i-1)),"img/alien.png","alien");
            if(i == 1){
                //damit der gap weggelassen wird
                alien = new component(alienWidth,alienHeight,alienX ,10,"img/alien.png","alien");
            }
            aliens[alienIndex] = alien;
        }
        alienInvasion.push(aliens);
    }
}
//erstelle das raumschiff
const createSpaceship = () =>{
    const spaceshipWidth = 30;
    const spaceshipHeight = 30;
    const spaceshipX = (gameArea.canvas.width/2)-(spaceshipWidth/2);
    
    const borderGap = 10;
    const spaceshipY = (gameArea.canvas.height-spaceshipHeight-borderGap);
    spaceship = new component(spaceshipWidth,spaceshipHeight,spaceshipX,spaceshipY,"img/spaceship2.png","spaceship");
};


function startGame(){
    customeGameSettings();
    gameArea.start();

    createSpaceship();
    createAliens();
}

let gameArea = {
    canvas: document.createElement("canvas"),
    start: function(){
        //game stats
        this.alienDeathCount = 0;
        this.aliensInInvasion = 0;

        this.shipBulletIntervall = 0;
        this.shipBullets = 0;
        this.alienbulletIntervall = 0;
        this.alienBulletCount = 0;

        //canvas werte
        this.canvas.width = 800;
        this.canvas.height = 800;
        this.context = this.canvas.getContext("2d");
        this.canvas.id = "canvas"
        //document.body.insertBefore(this.canvas,document.body.childNodes[0]);
        document.body.querySelector("#game").prepend(this.canvas);
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
    stop : function() {
        clearInterval(this.interval);
        if(this.alienDeathCount != this.aliensInInvasion){
            //schiffsexplosion
            let explosionCounter = 1;
            let explosion = setInterval(()=>{
                this.context.clearRect(spaceship.x-20,spaceship.y-20,70,70);
                drawSprite(gameArea.context,"img/Explosion.png",96*explosionCounter,0,96,92,spaceship.x-20,spaceship.y-20,70,70);
                explosionCounter++;
                if(explosionCounter == 13){
                    clearInterval(explosion);
                }
            },100)
            this.context.font = "48px bold"
            this.context.fillStyle = "RED";
            this.context.fillText("GAME OVER",this.canvas.width/2 - (300/2),this.canvas.height/2,300);
        }else{
            this.context.font = "48px bold"
            this.context.fillStyle = "green";
            this.context.fillText("WIN",this.canvas.width/2 - (90/2),this.canvas.height/2,90);
            //throw new Error("kein Error Beendet nur das Programm");
        }
    },
    restart : function(){
        customeGameSettings();

        gameArea.clear();
        createSpaceship();
        spaceship;
        aliens = [];
        alienInvasion = [];

        //figures projectals
        shipBullets = [];
        alienBullets = [];
        createAliens();
    }
}

function component(width,height,x,y,color,type) {
    //eigenschaften
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.alive = true;

    if(type === "bullet"|| type === "alienBullet"){
    }else{
        this.image = new Image();
        this.image.src = color;
        this.moveTo = "left";
    }

    //funktionen
    this.update = function(){
        if(type === "bullet" || type === "alienBullet"){
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
        if(type === "bullet"){
            this.y += -3;
        }else if(type === "alienBullet"){
            this.y += 3;
        }else{
            this.x += this.speedX;
        }
    }
    //status is true when aliens x != 0
    this.newAlienPos = function(status,aleienX){
        let increasedSpeed ;
        if(gameArea.alienDeathCount === 0){
            increasedSpeed  = 0;
        }else{
            increasedSpeed  = gameArea.alienDeathCount*0.05;
        }
        if(status){
            this.x += -alienSpeed - increasedSpeed ;
            if(aleienX <= 0){
                this.moveTo = "right"
            }

        }else{
            this.x += +alienSpeed + increasedSpeed ;
            if(aleienX >= gameArea.canvas.width - this.width){
                this.moveTo = "left"
            }
        }   
    }  
}

//wird immer im intervall/Frame aufgerufen um die componenten darzustellen und zu bewegen
const updateGameArea = () => {
    gameArea.clear();

    //zeahlt die tode der Aliens
    gameArea.aliensInInvasion = alienInvasion.reduce((prev,curr) => {
        return prev + curr.length;
    },0)
    gameArea.alienDeathCount = alienInvasion.reduce((prev,curr) => {
        return prev + curr.filter((el) => {return !el.alive}).length;
        //return prev.filter((el) => {return !el.alive}).length + curr.filter((el) => {return !el.alive}).length;
    },0)
    
    score.innerHTML = gameArea.alienDeathCount;
    attacks();
    movement();
    shipCollision();
    winningGame();
}

const attacks = () => {
    //alien
    //TODO mit in die updateGameArea alienarmy.map logik ausdenken umm zu schießen aber nur die forderste reihe
    let randomAlien = Math.floor(Math.random()*(aliens.length));

    //while umtauschen mit filter der ein array zurückgibt mit den index der lebenden aus diesen dann mit random zahl eine auswählen
    //achtung kann zur dauerschleife führen
    while(!alienInvasion[alienInvasion.length-1][randomAlien].alive 
        && alienInvasion[alienInvasion.length-1].filter(el => {return el.alive}).length > 0
        && (gameArea.alienDeathCount !== gameArea.aliensInInvasion)){
        randomAlien = Math.floor(Math.random()*(aliens.length));
    }
    alienShoot(aliens[randomAlien]);
    for(let alienBullet of alienBullets){
        alienBullet.newPoss();
        alienBullet.update();
    }

    //spaceship
    shoot();
    for(let shipBullet of shipBullets){
        shipBullet.newPoss();
        shipBullet.update();
    }
}

const shoot = () =>{
    gameArea.shipBulletIntervall++;

    let bulletWidth = 2;
    let bulletHeight = 12;
    if((gameArea.shipBullets == 0 || gameArea.shipBulletIntervall > shipCustomBulletIntervall) &&(gameArea.pressedKey && gameArea.pressedKey[32])){
        gameArea.shipBulletIntervall = 0;
        gameArea.shipBullets++;
        bullet = new component(bulletWidth,bulletHeight,spaceship.x + (spaceship.width/2) -(bulletWidth/2), spaceship.y -spaceship.height,"red","bullet");
        shipBullets.push(bullet);
    }
}
const alienShoot = (alien) => {
    gameArea.alienbulletIntervall++;

    let bulletWidth = 2;
    let bulletHeight = 12;

    if((gameArea.alienbBulletCount == 0 || gameArea.alienbulletIntervall > (alienCustomBulletIntervall))){
        gameArea.alienbulletIntervall = 0;
        gameArea.alienbBulletCount++;
        bullet = new component(bulletWidth,bulletHeight,alien.x + (alien.width/2) -(bulletWidth/2), alien.y +alien.height,"green","alienBullet");
        alienBullets.push(bullet);
    }
}

//funktion die die bewegung vom spieler und aliens reguliert
const movement = () => {

    if(controller == "Tastatur"){
        moveWithKeyboard(spaceship);
    }else{
        moveWithMouse(spaceship);
    }
    for(let aliens of alienInvasion){
        for(let i = 0; i < aliens.length; i++){
            //shipBullet collision des spaceships mit aliens
            //da hier ohnehin alien durchgegangen wird.
            for(x = 0; x < shipBullets.length;x++){
                let myleft = aliens[i].x;
                let myright = aliens[i].x + (aliens[i].width);
                let mytop = aliens[i].y;
                let mybottom = aliens[i].y + (aliens[i].height);
                let otherleft = shipBullets[x].x;
                let otherright = shipBullets[x].x + (shipBullets[x].width);
                let othertop = shipBullets[x].y;
                let otherbottom = shipBullets[x].y + (shipBullets[x].height);
                
                if((mybottom < othertop) ||
                (mytop > otherbottom) ||
                (myright < otherleft) ||
                (myleft > otherright)){
                }else{
                    if(aliens[i].alive) shipBullets.splice(x,1);
                    aliens[i].alive = false;
                }
            }

            const firstAlienAlive = () => {
                let counter = 0;
                for(let i = 0;i<aliens.length;i++){
                    if(aliens[i].alive){
                        return counter;
                    }
                    else if(counter==aliens.length-1){
                        return 0;
                    }
                    counter++;
                }
            }
            const lastAlienAlive = () =>{
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
                if(aliens[firstAlienAlive()]){
                    aliens[i].newAlienPos(true,aliens[firstAlienAlive()].x)
                }
            }else{
                if(aliens[lastAlienAlive()]){
                    aliens[i].newAlienPos(false,aliens[lastAlienAlive()].x)
                }
            }
            if(aliens[i].alive){
                aliens[i].update();
            }
        }
    }

}

//bewegung durch keyboard
const moveWithKeyboard = (component)=>{
    component.speedX = 0;
    if((gameArea.pressedKey && gameArea.pressedKey[37])  && component.x > 0){
        component.speedX += -shipSpeed;
    }
    if((gameArea.pressedKey && gameArea.pressedKey[39]) && component.x < (gameArea.canvas.width - component.width)){
        component.speedX += shipSpeed;
    }
    component.newPoss();
    component.update();
}
const moveWithMouse = (component) =>{
    gameArea.canvas.addEventListener("mousemove",mouseCoor)

    component.speedX = 0;
    if(((mouseCoorX) && mouseCoorX-(component.width/2) < component.x)  && component.x > 0){
        component.speedX = -shipSpeed;
        
        if(mouseCoorX-(component.width/2) - component.x > -8){
            component.speedX = -1;
        }
    }
    if(((mouseCoorX) && mouseCoorX-(component.width/2) > component.x)  && component.x < (gameArea.canvas.width - component.width)){
        component.speedX = shipSpeed;

        if(mouseCoorX-(component.width/2) - component.x < 8){
            component.speedX = 1;
        } 
    }
    component.newPoss();
    component.update();
}

const shipCollision = (alien) =>{
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
            gameArea.stop();
        }
    }
}

const winningGame = () =>{
    if(gameArea.alienDeathCount === gameArea.aliensInInvasion){
        gameArea.stop();
    }
}

const fullscreen = ()=>{
    let el = document.getElementById('canvas');
 
           if(el.webkitRequestFullScreen) {
               el.webkitRequestFullScreen();
           }
          else {
             el.mozRequestFullScreen();
          }            
}


const drawSprite = (ctx,img,sX,sY,sW,sH,dX,dY,dW,dH) =>{
    const imageSprite = new Image();
    imageSprite.src = img;

    ctx.drawImage(imageSprite,sX,sY,sW,sH,dX,dY,dW,dH);
}

btnFullscreen.addEventListener("click",fullscreen);

btnReset.addEventListener("click",(thies)=>{
    thies.target.blur()
    gameArea.restart();
});

startGame();
