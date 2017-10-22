
exports.success = {
    status: 'ok'
};

exports.error = {
    status: 'error'
};

exports.returnSuccess = function(message) {
    return Object.assign({message}, exports.success);
}

exports.returnError = function(message) {
    return Object.assign({message}, exports.error);
}
