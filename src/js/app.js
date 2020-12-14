import {saveByteArray, createPdf} from './pdf'

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

const size = [
    document.getElementById("a4"),
    document.getElementById("a3"),
    document.getElementById("a2"),
    document.getElementById("a1"),
    document.getElementById("a0"),
]

function backgroundColourChanged() {
    customBackgroundColour.value = "";
}

for (let i = 0; i < backgroundColour.length; i++){
    backgroundColour[i].addEventListener("change", backgroundColourChanged)
}
function backgroundColourSelected(){
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

function textColourSelected(){
    for (let i = 0; i < textColour.length; i++){
        if (textColour[i].checked){
            return textColour[i].value;
        }
    }
}

function sizeSelected(){
    for (let i = 0; i < size.length; i++){
        if (size[i].checked){
            return size[i].value;
        }
    }
}

//--------Download
async function downloadButtonClicked(){
    const pdfBytes = await createPdf(backgroundColourSelected())
    saveByteArray("poster.pdf", pdfBytes)
}