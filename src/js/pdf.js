import { PDFDocument, StandardFonts, rgb, degrees, grayscale, PageSizes, drawLine } from 'pdf-lib'

export function saveByteArray(name, byte) {
    var blob = new Blob([byte], { type: "application/pdf" });
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = name;
    link.download = fileName;
    link.click();
};

export async function createPdf(backgroundColor, textColour, quote, quoteAuthor) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage(PageSizes.A4)
    quote = formatQuote(quote)

    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    page.setFont(helveticaFont)

    const { width, height } = page.getSize();


    // Draw a rectangle covering the whole page to set the background colour
    page.drawRectangle({
        x: 0,
        y: 0,
        width: width,
        height: height,
        color: hexToRgb(backgroundColor),
    })

    //====GRID

    // Draw a rectangle to outline the 100-days big square
    let squareSize = width * 0.8
    let bigRectangleX = (width - squareSize) / 2;
    let bigRectangleY = (height - squareSize) / 2
    page.drawRectangle({
        x: bigRectangleX,
        y: bigRectangleY,
        width: squareSize,
        height: squareSize,
        borderColor: hexToRgb(textColour),
        borderWidth: 2,
    })

    // Draw a grid of numbers 1-100
    let littleSquareSize = squareSize / 10;
    let littleSquareX = (width - squareSize) / 2
    let littleSquareY = ((height - squareSize) / 2) + 9 * littleSquareSize
    
    for (let i = 0; i < 10; i++){
        for (let j = 0; j < 10; j++){

            let posDifX = j * littleSquareSize;
            let posDifY = -1 * (i * littleSquareSize);
            
            // Draw little squares
            page.drawRectangle({
                x: littleSquareX + posDifX,
                y: littleSquareY + posDifY,
                width: squareSize / 10,
                height: squareSize / 10, 
                borderColor: hexToRgb(textColour),
                borderWidth: 2,
            })

            // Draw numbers in the middle of the little squares
            let number = (10 * i + j + 1).toString();
            let numberSize = 18;
            let numberWidth = helveticaFont.widthOfTextAtSize(number, numberSize);
            let numberHeight = helveticaFont.heightAtSize(numberSize) - 6
            let numberX = littleSquareX + (littleSquareSize / 2) - (numberWidth / 2);
            let numberY = littleSquareY + (littleSquareSize / 2) - (numberHeight / 2);

            page.drawText(number, {
                x: numberX + posDifX,
                y: numberY + posDifY,
                size: numberSize,
                color: hexToRgb(textColour)
            });
        }
    }

    //========

    // Draw title
    let titleTextHeight = 36;
    let titleTextWidth = helveticaFont.widthOfTextAtSize("100 days of code", titleTextHeight);
    let titleX = centerText(titleTextWidth, width)
    let titleY = bigRectangleY + littleSquareSize * 10 + (titleTextHeight)
    page.drawText("100 days of code", {
        x: titleX,
        y: titleY,
        size: titleTextHeight,
        color: hexToRgb(textColour)
    });

    // Draw four quote illustrative rectangles
    const quoteBoxStartX = bigRectangleX + littleSquareSize;
    const quoteBoxEndX = bigRectangleX + littleSquareSize * 9;
    const quoteBoxWidth = quoteBoxEndX - quoteBoxStartX;

    // Variables to draw a quote
    let quoteTextHeight = 14
    let quoteLines = splitText(quote, helveticaFont, quoteTextHeight, quoteBoxWidth)
    let quoteY = bigRectangleY - (littleSquareSize / 2) - quoteTextHeight
    let quoteLinesNum = 4;

    // Draw rectangles for quote
    for (let i = 0; i < quoteLinesNum; i++){
        page.drawRectangle({
            x: quoteBoxStartX,
            y: quoteY - (i * quoteTextHeight),
            width: quoteBoxWidth,
            height: quoteTextHeight, 
            borderColor: hexToRgb(textColour),
            borderWidth: 2,
        })
    }

    // Draw quote 
    for (let i = 0; i < quoteLinesNum; i++){
        let quoteTextWidth = helveticaFont.widthOfTextAtSize(quoteLines[i], quoteTextHeight);
        let quoteX = centerText(quoteTextWidth, width);

        page.drawText(quoteLines[i], {
            x: quoteX,
            y: quoteY - (i * quoteTextHeight),
            size: quoteTextHeight,
            color: hexToRgb(textColour)
        });
    }

    const pdfBytes = await pdfDoc.save()
    return pdfBytes;
}

// Function to convert colours 
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    let r = parseInt(result[1], 16)
    let g = parseInt(result[2], 16)
    let b = parseInt(result[3], 16)

    return rgb(r / 255, g / 255, b / 255)
}

// Function that returns X position for centered text given text width and parent width
function centerText(textWidth, parentWidth){
    let x = (parentWidth - textWidth) / 2
    return x;
}

// Function to split text such that the quote wraps into multiple lines
function splitText(text, font, textSize, parentWidth){
    let lines = [];
    let str = text;
    

    for (let i = 0; i < 4; i++){
        // Initialize / reinitialize remaining string
        let cutOffStr = ""
        let textWidth = font.widthOfTextAtSize(str, textSize)

        while (textWidth > parentWidth){
            // Find the last word 
            let lastSpaceIndex = str.lastIndexOf(" ");

            // Add the last word substring to the cut off string
            cutOffStr = str.substring(lastSpaceIndex, str.length) + cutOffStr

            // Remove last word from the string
            str = str.substring(0, lastSpaceIndex);

            textWidth = font.widthOfTextAtSize(str, textSize);
        }
        console.log(cutOffStr)
        lines.push(str)

        // Reassign str to the remaining string 
        str = cutOffStr;

    }

    console.log(lines)
    return lines;
}

// Function to remove whitespace at the beginning and end of the quote and add doublequotes
function formatQuote(text){
    let formatedQuoteArr = text.trim().split("")
    if (formatedQuoteArr[0] !== "\""){
        formatedQuoteArr.unshift("\"")
    }
    if (formatedQuoteArr[formatedQuoteArr.length - 1] !== "\""){
        formatedQuoteArr.push("\"")
    }

    return formatedQuoteArr.join("")
}

// Function to remove whitespace at the beginning and end of the author
function formatAuthor(text){
    let author = text;
    author.trim()
    return author;
}