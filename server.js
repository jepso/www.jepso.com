var express = require('express');
var server = express.createServer();

server.use(express.static(__dirname));
/*

server.use(function(req,res, next){
	var url = require('url').parse(req.url);
	if(!/\./g.test(url.pathname) && url.pathname.substr(url.pathname.length - 1, 1) !== "/"){
		url.pathname += "/";
		var newPath = url.pathname + (url.search||"");
		res.redirect(newPath, 301);
	} else {
		next();
	}
});
server.use(function(req, res, next){
	var url = require('url').parse(req.url);
	if(/\./g.test(url.pathname)) return next();
	var pathname = url.pathname + "index.html";
	if(!(/^[\w\/]*\.\w*$/g.test(pathname))) return next(new Error(pathname + " is not a valid path name"));
	require('path').exists(pathname, function(exists){
		if (exists){
			res.sendFile(pathname);
		} else {
			next();
		}
	})
});
*/
var port = process.env.PORT || 8080;
server.listen(port)