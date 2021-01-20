import {saveByteArray, createPdf, formatQuote} from './pdf'
import { validateHTMLColorName,  validateHTMLColorHex} from "validate-color";
import { arrayAsString } from 'pdf-lib';

const backgroundColour = [
    document.getElementById("background-colour-white"),
    document.getElementById("background-colour-black"),
    document.getElementById("background-colour-pink"),
    document.getElementById("background-colour-purple"),
    document.getElementById("background-colour-yellow"),
    document.getElementById("background-colour-grey"), 
];

const someError = document.getElementById("someError")
const customBackgroundColour = document.getElementById("colour-code");

customBackgroundColour.addEventListener("focus", () => {
    customBackgroundColourChanged();
});

customBackgroundColour.addEventListener("keyup", () => {
    customBackgroundColourChanged();
    hideError();
});

customBackgroundColour.addEventListener("change", () => {
    customBackgroundColourChanged();
    displayError();
});

customBackgroundColour.addEventListener("paste", () => {
    customBackgroundColourChanged();
    displayError();
});

// If custom background colour has a valid colour, keep "focused" styling
customBackgroundColour.addEventListener("blur", () => {
    if (isValidColour(customBackgroundColour.value)){
        customBackgroundColour.classList.add("colour-code-selected")
    }
});

/* If a user has focused custom colour, but left it empty and now is out of focus
with no colour selected, default to white */
[customBackgroundColour, ...backgroundColour].forEach(item => {
    item.addEventListener('focusout', () => {
      if (backgroundColourSelected() === ""){
          backgroundColour[0].checked = true
      }
    })
})

function isValidColour(text){
    // Add a hashtag if it's not starting with one
    let arr = text.split("")
    if (arr[0] !== "#"){
        arr.unshift("#")
    }
    return validateHTMLColorHex(arr.join(""));
}

function displayError() {
    if (someError.classList.contains("hidden") && 
        !isValidColour(customBackgroundColour.value )){
            someError.classList.remove("hidden")
    }
};

function hideError() {
    if (isValidColour(customBackgroundColour.value) && !someError.classList.contains("hidden")){
        someError.classList.add("hidden")
    }
}


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
    customBackgroundColour.classList.remove("colour-code-selected")
}

for (let i = 0; i < backgroundColour.length; i++){
    backgroundColour[i].addEventListener("change", backgroundColourChanged)
}

function backgroundColourSelected(){
    let colourSelected = ""
    if (customBackgroundColour.value !== "") {
        colourSelected = customBackgroundColour.value
        return colourSelected;
    }
    for (let i = 0; i < backgroundColour.length; i++){
        if (backgroundColour[i].checked){
            colourSelected = backgroundColour[i].value
            return colourSelected;
        }
    }
    return colourSelected;
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
