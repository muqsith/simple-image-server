exports.getSizeFromSizeString  = function(size_str) {
    let size = {width: -1, height: -1};
    if (size_str && size_str.indexOf('x') !== -1) {
        let s = size_str.split('x');
        size.width = s[0];
        size.height = s[1];
    }
    return size;
}