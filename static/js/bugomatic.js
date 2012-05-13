function getURLParameter(name) {
    var rv = (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1];
    return rv ? decodeURI(rv) : rv;
}
 
function BugOMatic(scripts_path) {
    this._version = getURLParameter('v');
    this._scripts_path = scripts_path;
    this.start = function() {
        if (this._version) {
            var version = this._version;
            console.log("Going to bug for v"+this._version);
            $.ajax({
                url: this._scripts_path + '/bugs' + this._version + '.js',
                dataType: "script",
                async: false,
                success: function(data) {
                    console.log("Bugs for v"+version+" loaded");
                },
                error: function(data) {
                    console.log("Upss... there seems to be a problem loading bugs for v"+version+". Is that even a version?");
                }
            });
        } else {
            console.log("Nothing to bug");
        }
    };
};
