let image = {
    _id: String,
    user: String,
    name: String,
    filename:String,
    mimetype: String,
    path: String,
    encoding: String,
    size: Number,
    height: Number,
    width: Number,
    url:String
};

module.exports = {
    getNewImage : function() {
        return Object.assign({}, {
            user: '',
            name: '',
            filename: '',
            mimetype: '',
            path: '',
            encoding: '',
            size: 0,
            height: 0,
            width: 0,
            url:''
        });
    }
};

