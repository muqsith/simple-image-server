
const Promise = require("bluebird")
    ;

exports.dummyPromise = function(_timeout = 500, success = true) {
    return (
        new Promise((resolve, reject) => {
            if (success) {
                setTimeout(() => {
                    resolve();
                }, _timeout);
            } else {
                setTimeout(() => {
                    reject();
                }, _timeout);
            }
        })
    );
}