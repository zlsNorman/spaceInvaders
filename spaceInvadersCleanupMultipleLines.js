let spaceship;
let aliens = [];
let alienarmy = [];

//TODO bullets in einem array (Mehrdemensional)
let bullets = [];
let alienBullets = [];

/*create the first aliens
 */
const createAliens = () => {
    let alienWidth = 20;
    let alienHeight = 20;
    let alienColumn = ~~(gameArea.canvas.width / (alienWidth*2));

    
    for(let i = 1; i<=2; i++){
        aliens = [...new Array(alienColumn)].map((el , index) =>{
            let alienX = ((gameArea.canvas.width) / alienColumn)*(index+1) - alienWidth;
            let alien = new component(alienWidth,alienHeight,alienX ,10*i+20,"img/alien.png","alien");
            if(i == 1){
                alien = new component(alienWidth,alienHeight,alienX ,10,"img/alien.png","alien");
            }
            alien.animation();
            return alien;
        })
        alienarmy.push(aliens);
    }
    console.log(alienarmy)

}
const createSpaceship = () =>{
    let spaceshipWidth = 30;
    let spaceshipHeight = 30;
    let spaceshipX = (gameArea.canvas.width/2)-(spaceshipWidth/2);
    
    let borderGap = 10;
    let spaceshipY = (gameArea.canvas.height-spaceshipHeight-borderGap);
    spaceship = new component(spaceshipWidth,spaceshipHeight,spaceshipX,spaceshipY,"img/spaceship2.png","spaceship");
};

const startGame = () => {
    gameArea.start();

    createSpaceship();
    createAliens();
}

const gameArea = {
    /** @type {HTMLCanvasElement} */
    canvas : document.createElement("canvas"),
    start : function(){
        this.alienDeathCount = 0;
        this.aliensCount = 0;
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
    stop : function() {
        clearInterval(this.interval);
        aliens.map((el)=>{
            clearInterval(el.animationInterval);
        })
        if(this.alienDeathCount != this.aliensCount){
            this.context.font = "48px bold"
            this.context.fillStyle = "RED";
            this.context.fillText("GAME OVER",this.canvas.width/2 - (300/2),this.canvas.height/2,300);
        }else{
            this.context.font = "48px bold"
            this.context.fillStyle = "green";
            this.context.fillText("WIN",this.canvas.width/2 - (90/2),this.canvas.height/2,90);
            //throw new Error("kein Error Beendet nur das Programm");
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
    if(type === "bullet"|| type === "alienBullet"){
    }else{
        this.image = new Image();
        this.image.src = color;
        this.moveTo = "left";
    }
    
    this.alive = true;
    
    this.animation = function(){
        this.animationInterval = setInterval( () => {
            if(!this.image.src.includes(color)){
                this.image.src =  color;
            }else{
                this.image.src = "img/alien2.png";
            }
        }, 1000);
    };

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
        let movementEaqualToDeath;
        if(gameArea.alienDeathCount === 0){
            movementEaqualToDeath = 0;
        }else{
            movementEaqualToDeath = gameArea.alienDeathCount*0.05;
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
const moveWithKeyboard = (component)=>{
    component.speedX = 0;
    if((gameArea.pressedKey && gameArea.pressedKey[37])  && component.x > 0){
        component.speedX += -5;
    }
    if((gameArea.pressedKey && gameArea.pressedKey[39]) && component.x < (gameArea.canvas.width - component.width)){
        component.speedX += 5;
    }
    component.newPoss();
    component.update();
}
const shoot = (spaceship) =>{
    gameArea.bulletIntervall++;

    bulletWidth = 2;
    bulletHeight = 12;
    if((gameArea.bulletCount == 0 || gameArea.bulletIntervall > 0) &&(gameArea.pressedKey && gameArea.pressedKey[32])){
        gameArea.bulletIntervall = 0;
        gameArea.bulletCount++;
        bullet = new component(bulletWidth,bulletHeight,spaceship.x + (spaceship.width/2) -(bulletWidth/2), spaceship.y -spaceship.height,"red","bullet");
        bullets.push(bullet);
    }
}
const alienShoot = (alien) => {
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

const attacks = () => {
    //alien
    //TODO mit in die updateGameArea alienarmy.map logik ausdenken umm zu schießen aber nur die forderste reihe
    let randomAlien = Math.floor(Math.random()*(aliens.length));

    while(!alienarmy[alienarmy.length-1][randomAlien].alive 
        && alienarmy[alienarmy.length-1].filter(el => {return el.alive}).length > 0
        && (gameArea.alienDeathCount !== gameArea.aliensCount)){
        randomAlien = Math.floor(Math.random()*(aliens.length));
    }
    alienShoot(aliens[randomAlien]);
    alienBullets.map((el)=>{
        el.newPoss();
        el.update();
    })

    //spaceship
    shoot(spaceship);
    bullets.map((el)=>{
        el.newPoss();
        el.update();
    })
}

function updateGameArea() {

    gameArea.clear();
    //zählt die tode der Aliens
    gameArea.aliensCount = alienarmy.reduce((prev,curr)=>{
        return prev.length + curr.length;
    });
/*     gameArea.alienDeathCount = (aliens.filter((el) => {
        return !el.alive ;
    }).length); */
    gameArea.alienDeathCount = alienarmy.reduce((prev,curr)=>{
        return prev.filter((el) => {return !el.alive}).length + curr.filter((el) => {return !el.alive}).length;
    });

    attacks();
    moveWithKeyboard(spaceship);
    
    alienarmy.map((aliens,index)=>{
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
                    bullets.splice(x,1);
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
                if(aliens[firstAlienAlive()]){
                    aliens[i].newAlienPos(true,aliens[firstAlienAlive()].x)
                }
            }else{
                if(aliens[lastAlienAlive()]){
                    aliens[i].newAlienPos(false,aliens[lastAlienAlive()].x)
                }
            }
            /* alienarmy.map((el,index)=>{
                //TODO ÄNDERN FALLS WIEDER ANDERS
                if(alienarmy[index][i].alive){
                    alienarmy[index][i].update();
                }
            }) */
            if(aliens[i].alive){
                aliens[i].update();
            }
        }
        
    });
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
    winningGame();
}

const winningGame = () =>{
    if(gameArea.alienDeathCount === gameArea.aliensCount){
        gameArea.stop();
    }
}
startGame();