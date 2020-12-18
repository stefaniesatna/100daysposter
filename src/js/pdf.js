import { PDFDocument, StandardFonts, rgb, degrees, grayscale, PageSizes } from 'pdf-lib'

export function saveByteArray(name, byte) {
    var blob = new Blob([byte], { type: "application/pdf" });
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = name;
    link.download = fileName;
    link.click();
};

export async function createPdf(backgroundColor) {
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

    // Draw a rectangle to outline the 100-days squares
    let squareSize = width * 0.8
    page.drawRectangle({
        x: (width - squareSize) / 2,
        y: (height - squareSize) / 2,
        width: squareSize,
        height: squareSize,
        borderColor: hexToRgb("#000000"),
        borderWidth: 2,
    })

    // Draw a little square
    let littleSquareSize = squareSize / 10
    page.drawRectangle({
        x: (width - squareSize) / 2,
        y: ((height - squareSize) / 2) + 9 * littleSquareSize,
        width: squareSize / 10,
        height: squareSize /10, 
        borderColor: hexToRgb("#000000"),
        borderWidth: 2,
    })

    // Draw a number in the middle of the little square
    let number = "1"
    let numberSize = 28
    let numberWidth = helveticaFont.widthOfTextAtSize(number, numberSize);
    let numberHeight = helveticaFont.heightAtSize(numberSize) - 6
    page.drawText(number, {
        y: ((height - squareSize - numberHeight) / 2) + 9.5 * littleSquareSize,
        x: ((width - squareSize - numberWidth) / 2) + 0.5 * littleSquareSize,
        size: numberSize
    });

    //========

    // For positioning in the centre of the document we need to get the width of the text
    let textWidth = helveticaFont.widthOfTextAtSize("100 days of code", 36);
    page.drawText("100 days of code", {
        y: height - 100,
        x: (width - textWidth) / 2,
        size: 36
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