var path = require('path');
var fs = require('fs');


module.exports = Mkdirs;

function Mkdirs(dirname, mode, callback){
    fs.exists(dirname, function (exists){
        if(exists){
            callback(null);
        } else {
            console.log(path.dirname(dirname));
            Mkdirs(path.dirname(dirname), mode, function (){
                fs.mkdir(dirname, mode, callback);
            });
        }
    });
}