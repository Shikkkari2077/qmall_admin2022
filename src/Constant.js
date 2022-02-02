module.exports = {
    getAPI: function () {
        // return "http://www.qmallapp.com/api";


        //Production
        // return "https://qmallapp.com/api";
       
        //New Server
        // return "http://qmallprod.infoware.xyz/api"
        
        //Test-Server
       return 'http://qmall.infoware.xyz'   
    },
    getDefaultCurrrency: function () {
        return "KWD";
    }
}