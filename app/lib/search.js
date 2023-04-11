const elasticlunr = require('elasticlunr');
const { writeFileSync, existsSync, readFileSync } = require('fs');


class Search {
    constructor() {
        this._index = elasticlunr(function () {
            this.addField('type')
            this.addField('text')
            this.addField('filename')
            this.setRef('path')
        });

        this.loadIndexFromFile()
    }

    loadIndexFromFile() {
        if (existsSync(`${__dirname}/searchIndex.json`)) {
            const raw = readFileSync(`${__dirname}/searchIndex.json`);
            this._index = elasticlunr.Index.load(JSON.parse(raw));
        }
    }

    addDoc(data) {
        this._index.addDoc({
            type: data.type,
            path: data.path,
            text: data.text,
            filename: data.filename
        })
    }

    saveIndexToFile() {
        const serializedIndex = this._index.toJSON();
        writeFileSync(`${__dirname}/searchIndex.json`, JSON.stringify(serializedIndex));
    }

    search(term) {
        const result = this._index.search(term, {
            fields: {
                text: {
                    boost: 2,
                    expand: true
                },
                filename: {
                    boost: 1
                }
            },
            // expand: true
        })

        const docs = result.map((rec, i) => {
            const doc = this._index.documentStore.getDoc(rec.ref);
            return {
                ...doc,
                term,
                key: i
            }
        });

        return docs
    }
}

exports.search = new Search();