//html Elemente
const btnFullscreen = document.body.querySelector("#fullscreen");
const btnReset = document.body.querySelector("#reset");
const score = document.body.querySelector("#gameScore")
const buttonContainer = document.body.querySelector(".buttonContainer");
let controller = document.body.querySelector(".buttonContainer .aktiv").innerText;
let alienCustomBulletIntervall = parseInt(document.querySelector("#alienbulletintervall").value);
let shipCustomBulletIntervall = parseInt(document.querySelector("#shipbulletintervall").value);
let inputAlienRows = parseInt(document.querySelector("#alienrows").value);
let shipSpeed = parseInt(document.querySelector("#shipspeed").value);
let alienSpeed = parseInt(document.querySelector("#alienspeed").value)/10;
let bulletspeed = parseInt(document.querySelector("#bulletspeed").value);

let obstaclesAmount = parseInt(document.querySelector("#obstaclesAmount").value);
let obstaclesValue = parseInt(document.querySelector("#obstaclesValue").value);

let settingsReset = document.querySelector("#settingsReset");
let btnAutoshooting = document.querySelector("#btnAutoshooting");
let isAutoschooting = false;

buttonContainer.addEventListener("click",(thies)=>{

    let container = thies.currentTarget;
    let containerButtons = Array.from(container.querySelectorAll("button"));

    let element = thies.target;
    if(element.classList.contains("aktiv")){

    }else{
        containerButtons.map((el)=>{
            el.classList.remove("aktiv")
        })
        element.classList.add("aktiv")
        //controller = element.innerText;
    }

    if(thies.target.id == "btnHandy"){
        document.querySelector("#btnAutoshooting").classList.add("aktiv")
    }
})

btnAutoshooting.addEventListener("click",(thies)=>{
    if(thies.currentTarget.classList.contains("aktiv")){
        thies.currentTarget.classList.remove("aktiv")
    }else{
        thies.currentTarget.classList.add("aktiv")
    }
})

settingsReset.addEventListener("click",(thies)=>{
    btnAutoshooting.classList.remove("aktiv");
    document.body.querySelector(".buttonContainer #btnKeyboard").click();
    document.querySelector("#alienbulletintervall").value = 60;
    document.querySelector("#shipbulletintervall").value = 60;
    document.querySelector("#alienrows").value = 2;
    document.querySelector("#shipspeed").value = 5;
    document.querySelector("#alienspeed").value = 5;
    document.querySelector("#bulletspeed").value = 4;

    document.querySelector("#obstaclesAmount").value = 20;
    document.querySelector("#obstaclesValue").value = 3;

})

const setLocalStorage = () =>{

    let settings = {
        alienrows: inputAlienRows,
        alienbulletintervall: alienCustomBulletIntervall,
        shipbulletintervall: shipCustomBulletIntervall,
        alienspeed: alienSpeed*10,
        shipspeed: shipSpeed,
        bulletspeed: bulletspeed,
        obstaclesamount: obstaclesAmount,
        obstaclesvalue: obstaclesValue,
    }
    localStorage.setItem("settings",JSON.stringify(settings))
}

if(localStorage.getItem("settings")){
    let storageSettings = JSON.parse(localStorage.getItem("settings"));
    console.log(storageSettings);

    document.querySelector("#alienbulletintervall").value = storageSettings.alienbulletintervall;
    document.querySelector("#shipbulletintervall").value = storageSettings.shipbulletintervall;
    document.querySelector("#alienrows").value = storageSettings.alienrows;
    document.querySelector("#shipspeed").value = storageSettings.shipspeed;
    document.querySelector("#alienspeed").value = storageSettings.alienspeed;
    document.querySelector("#bulletspeed").value = storageSettings.bulletspeed;

    document.querySelector("#obstaclesAmount").value = storageSettings.obstaclesamount;
    document.querySelector("#obstaclesValue").value = storageSettings.obstaclesvalue;
}