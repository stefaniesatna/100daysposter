console.log("something")
const backgroundColour = [
    document.getElementById("background-colour-white"),
    document.getElementById("background-colour-black"),
    document.getElementById("background-colour-orange"),
    document.getElementById("background-colour-green"), 
];
const customBackgroundColour = document.getElementById("colour-code");
customBackgroundColour.addEventListener("input", clearColourSelection);

const downloadButton = document.getElementById("download");
downloadButton.addEventListener("click", downloadButtonClicked);

const textColour = [
    document.getElementById("dark"),
    document.getElementById("light")
];

const quote = document.getElementById("quote");

function backgroundColourChanged() {
    customBackgroundColour.value = "";
}

for (let i = 0; i < backgroundColour.length; i++){
    backgroundColour[i].addEventListener("change", backgroundColourChanged)
}
function whatColourIsSelected(){
    if (customBackgroundColour.value !== "") {
        return customBackgroundColour.value;
    }
    for (let i = 0; i < backgroundColour.length; i++){
        if (backgroundColour[i].checked){
            return backgroundColour[i].value;
        }
    }
}

function clearColourSelection(){
    for (let i = 0; i < backgroundColour.length; i++){
        if (backgroundColour[i].checked){
            backgroundColour[i].checked = false;
        }
    }
}

//--------Download
function downloadButtonClicked(){
    console.log(whatColourIsSelected());
}