import { PDFDocument, StandardFonts, rgb, degrees, grayscale, PageSizes, drawLine } from 'pdf-lib'

export function saveByteArray(name, byte) {
    var blob = new Blob([byte], { type: "application/pdf" });
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = name;
    link.download = fileName;
    link.click();
};

export async function createPdf(backgroundColor, textColour, quote) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage(PageSizes.A4)

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
    page.drawRectangle({
        x: (width - squareSize) / 2,
        y: (height - squareSize) / 2,
        width: squareSize,
        height: squareSize,
        borderColor: hexToRgb(textColour),
        borderWidth: 2,
    })

    // Draw a grid of numbers 1-100
    for (let i = 0; i < 10; i++){
        for (let j = 0; j < 10; j++){
            let littleSquareSize = squareSize / 10
            let littleSquareX = (width - squareSize) / 2
            let littleSquareY = ((height - squareSize) / 2) + 9 * littleSquareSize

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

    // For positioning in the centre of the document we need to get the width of the text

    // Draw title
    let titleTextWidth = helveticaFont.widthOfTextAtSize("100 days of code", 36);
    page.drawText("100 days of code", {
        y: height - 100,
        x: (width - titleTextWidth) / 2,
        size: 36,
        color: hexToRgb(textColour)
    });

    // Draw quote
    let quoteTextWidth = helveticaFont.widthOfTextAtSize(quote, 18);
    page.drawText(quote, {
        y: height - 750,
        x: (width - quoteTextWidth) / 2,
        size: 18,
        color: hexToRgb(textColour)
    });

    const pdfBytes = await pdfDoc.save()
    return pdfBytes;
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    let r = parseInt(result[1], 16)
    let g = parseInt(result[2], 16)
    let b = parseInt(result[3], 16)

    return rgb(r / 255, g / 255, b / 255)
}