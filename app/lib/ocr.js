const { isFileSupportedForOcr, isEmail } = require("./utils");
const { getText } = require('any-text');

function sanitize(str) {
    return str
        .replace(/\s@\S+\s/g, ' ') // remove words starting with \
        .replace(/\s\s+/g, ' ') // trim spaces
        .replace(/(\r\n|\n|\r)/gm, ". "); // remove new lines, cariage return
}

async function Ocr(filePath) {
    try {
        if (!isFileSupportedForOcr(filePath)) {
            return null;
        }

        if (isEmail(filePath)) {
            // handle eml files here
            return null
        }

        let data = await getText(filePath);
        data = sanitize(data);

        return {
            type: "document",
            path: filePath,
            text: data,
        }
    } catch (error) {
        console.log(error);
        return null
    }
}

exports.Ocr = Ocr;