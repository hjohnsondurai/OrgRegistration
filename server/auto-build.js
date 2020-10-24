const { exec } = require("child_process");
const path = require('path');

module.exports = function (publicPath) {
    function clone() {
        let tmpDir = path.join(publicPath, 'tmp');
        exec("rm -rf \"" + publicPath + "\" && git clone https://github.com/hjohnsondurai/Blog --depth=1 \"" + tmpDir + "\" && cd \"" + tmpDir + "\" && npm i && npm run-script build && cd .. && cp -R ./tmp/dist/Blog/* ./ && rm -rf tmp", (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
    }

    clone();
}