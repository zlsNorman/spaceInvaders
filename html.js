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

let settingsReset = document.querySelector("#settingsReset");

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
})

settingsReset.addEventListener("click",(thies)=>{

    document.body.querySelector(".buttonContainer #btnKeyboard").click();
    document.querySelector("#alienbulletintervall").value = 70;
    document.querySelector("#shipbulletintervall").value = 80;
    document.querySelector("#alienrows").value = 2;
    document.querySelector("#shipspeed").value = 5;
    document.querySelector("#alienspeed").value = 5;
})

