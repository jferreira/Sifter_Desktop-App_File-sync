const { readdir } = require('node:fs/promises');
const { extname, join } = require('node:path');

const SUPPORTED_OCR_FORMATS = ['.pdf', '.doc', '.docx', 'xlsx', 'xls', '.txt', '.csv', '.json', '.eml'];

exports.deepReadDir = async (dirPath) => {
    try {
        const tree = await Promise.all(
            (
                await readdir(dirPath, { withFileTypes: true })
            ).map(async (dirent) => {
                const path = join(dirPath, dirent.name);
                if (dirent.isDirectory()) {
                    const subTree = await exports.deepReadDir(path);
                    return { type: "folder", children: subTree, name: dirent.name, path }
                }
                return { type: "file", name: dirent.name, path, children: [] };
            })
        );
        return tree;
    } catch (error) {
        return []
    }
};

exports.isFileSupportedForOcr = (path) => {
    return SUPPORTED_OCR_FORMATS.includes(extname(path).toLowerCase());
};

exports.isEml = (path) => {
    return extname(path) === '.eml';
}

exports.SUPPORTED_OCR_FORMATS = SUPPORTED_OCR_FORMATS

exports.isFormatSupported = (fileName) => SUPPORTED_OCR_FORMATS.includes(extname(fileName))

exports.isEmail = (fileName) => extname(fileName) === '.eml';
