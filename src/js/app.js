import {saveByteArray, createPdf, formatQuote} from './pdf'
import { validateHTMLColorName,  validateHTMLColorHex} from "validate-color";

const backgroundColour = [
    document.getElementById("background-colour-white"),
    document.getElementById("background-colour-black"),
    document.getElementById("background-colour-pink"),
    document.getElementById("background-colour-purple"),
    document.getElementById("background-colour-yellow"),
    document.getElementById("background-colour-grey"), 
];

const colourError = document.getElementById("colourError")
const customBackgroundColour = document.getElementById("colour-code");

customBackgroundColour.addEventListener("keyup", () => {
    customBackgroundColourChanged();
    displayError();
})

customBackgroundColour.addEventListener("change", () => {
    customBackgroundColourChanged();
    displayError();
})

customBackgroundColour.addEventListener("paste", () => {
    customBackgroundColourChanged();
    displayError();
})

function isValidColour(text){
    return validateHTMLColorHex(text);
}

function displayError() {
    if (colourError.classList.contains("hidden") && !isValidColour(customBackgroundColour.value)){
        colourError.classList.remove("hidden")
    }
    else if (isValidColour(customBackgroundColour.value) && !colourError.classList.contains("hidden")){
        colourError.classList.add("hidden")
    }
};


const downloadButton = document.getElementById("download");
downloadButton.addEventListener("click", downloadButtonClicked);

const textColour = [
    document.getElementById("dark"),
    document.getElementById("light")
];
for (let i = 0; i < textColour.length; i++){
    textColour[i].addEventListener("change", textColourChanged);
}

const nerd = document.getElementById("nerd")
nerd.addEventListener("change", updatePreviewNerdNumbering)

const activity = document.getElementById("activity");
activity.addEventListener("keyup", updatePreviewTitleText)
activity.addEventListener("change", updatePreviewTitleText)
activity.addEventListener("paste", updatePreviewTitleText)

const maxCharsQuote = 160;
const quoteLength = document.getElementById('quoteLength');
const quote = document.getElementById("quote");

quote.addEventListener("keyup", () => {
    updateQuoteCount();
    updatePreviewQuoteText();
})

quote.addEventListener("change", () => {
    updateQuoteCount();
    updatePreviewQuoteText();
})

quote.addEventListener("paste", () => {
    updateQuoteCount();
    updatePreviewQuoteText();
})

function updateQuoteCount() {
    quoteLength.innerHTML = `${quote.value.length}/${maxCharsQuote}`;
};

const quoteAuthor = document.getElementById("quoteAuthor")
quoteAuthor.addEventListener("keyup", updatePreviewAuthorText)
quoteAuthor.addEventListener("change", updatePreviewAuthorText)

const size = [
    document.getElementById("a4"),
    document.getElementById("letter"),
]

function backgroundColourChanged() {
    updatePreviewBackgroundColour()
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

function customBackgroundColourChanged(){
    for (let i = 0; i < backgroundColour.length; i++){
        if (backgroundColour[i].checked){
            backgroundColour[i].checked = false;
        }
    }
    updatePreviewBackgroundColour()
}

function textColourChanged(){
    updatePreviewTextColour()
}

/**
 * Returns the selected text colour as a string
 */
function textColourSelected(){
    for (let i = 0; i < textColour.length; i++){
        if (textColour[i].checked){
            return textColour[i].value;
        }
    }
}

function nerdSelected(){
    if (nerd.checked){
        return 1;
    }
    else {
        return 0;
    }
}

function activitySelected(){
    return activity.value;
}

function quoteSelected(){
    return quote.value;
}

function quoteAuthorSelected(){
    return quoteAuthor.value;
}

function sizeSelected(){
    for (let i = 0; i < size.length; i++){
        if (size[i].checked){
            return size[i].value;
        }
    }
}

function updatePreviewBackgroundColour(){
    document.getElementById("poster").style.backgroundColor = backgroundColourSelected()
}

function updatePreviewTextColour(){
    document.getElementById("poster-quote").style.color = textColourSelected()
    document.getElementById("author").style.color = textColourSelected()
    document.getElementById("poster-title").style.color = textColourSelected()

    let paths = document.getElementsByTagName("path")
    for (let path of paths) {
        path.setAttribute("stroke", textColourSelected())
    }   

    let text = document.getElementsByTagName("text")
    for (let t of text) {
        t.setAttribute("fill", textColourSelected())
    }
}

function updatePreviewTitleText(){
    document.getElementById("poster-title").textContent = "100 DAYS OF " + activitySelected()
}

function updatePreviewNerdNumbering(){
    let tspans = document.getElementsByTagName("tspan")
    for (let i = 0; i < tspans.length; i++) {
        tspans[i].innerHTML = parseInt((i + 1 - nerdSelected()), 10)
    }
}

function updatePreviewQuoteText(){
    document.getElementById("poster-quote").textContent = formatQuote(quoteSelected())
}

function updatePreviewAuthorText(){
    document.getElementById("author").textContent = quoteAuthorSelected()
}

//--------Download
async function downloadButtonClicked(){
    const pdfBytes = await createPdf(backgroundColourSelected(), textColourSelected(), nerdSelected(), activitySelected(), quoteSelected(), quoteAuthorSelected(), sizeSelected());
    saveByteArray("poster.pdf", pdfBytes);
}

// document.getElementById("poster").style.backgroundColor = "slategrey"
