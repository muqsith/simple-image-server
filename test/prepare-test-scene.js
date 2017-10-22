const fs = require('fs'),
    path = require('path')
    ;

let data = require('./data/sample-images.json')
    ;

function createImageFile(_data) {
    let d = _data.shift();
    if (d) {
        fs.readFile(path.resolve(__dirname, 'data' , d['name']), (err, data) => {
            fs.writeFile(d['path'], data, 'binary', (err) => {
                if (err) {
                    console.log(err);
                }
                createImageFile(_data)
            })
        });
    }
}

function prepare() {
    console.log(`###############################
        Preparing Test Data
        #######################################`);
    createImageFile(data);
}

if (require.main === module)
    prepare();
