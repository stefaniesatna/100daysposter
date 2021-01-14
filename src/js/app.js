import {saveByteArray, createPdf, formatQuote} from './pdf'

const backgroundColour = [
    document.getElementById("background-colour-white"),
    document.getElementById("background-colour-black"),
    document.getElementById("background-colour-pink"),
    document.getElementById("background-colour-purple"),
    document.getElementById("background-colour-yellow"),
    document.getElementById("background-colour-grey"), 
];
const customBackgroundColour = document.getElementById("colour-code");
customBackgroundColour.addEventListener("input", customBackgroundColourChanged);

const downloadButton = document.getElementById("download");
downloadButton.addEventListener("click", downloadButtonClicked);

const textColour = [
    document.getElementById("dark"),
    document.getElementById("light")
];
for (let i = 0; i < textColour.length; i++){
    textColour[i].addEventListener("change", textColourChanged);
}

const activity = document.getElementById("activity");
activity.addEventListener("keyup", updatePreviewTitleText)
activity.addEventListener("change", updatePreviewTitleText)
activity.addEventListener("paste", updatePreviewTitleText)

const quote = document.getElementById("quote");
quote.addEventListener("keyup", updatePreviewQuoteText)
quote.addEventListener("change", updatePreviewQuoteText)
quote.addEventListener("paste", updatePreviewQuoteText)


// TODO

// const quoteLength = document.getElementById("quoteLength")
// quoteLength.addEventListener("key")
// quoteLength.innerHTML = `${quote.value.length}/175`

const quoteAuthor = document.getElementById("quoteAuthor")
quoteAuthor.addEventListener("keyup", updatePreviewAuthorText)
quoteAuthor.addEventListener("change", updatePreviewAuthorText)

const size = [
    document.getElementById("a4"),
    document.getElementById("a3"),
    document.getElementById("a2"),
    document.getElementById("a1"),
    document.getElementById("a0"),
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

function updatePreviewQuoteText(){
    document.getElementById("poster-quote").textContent = formatQuote(quoteSelected())
}

function updatePreviewAuthorText(){
    document.getElementById("author").textContent = quoteAuthorSelected()
}

//--------Download
async function downloadButtonClicked(){
    const pdfBytes = await createPdf(backgroundColourSelected(), textColourSelected(), activitySelected(), quoteSelected(), quoteAuthorSelected(), sizeSelected());
    saveByteArray("poster.pdf", pdfBytes);
}

// document.getElementById("poster").style.backgroundColor = "slategrey"

