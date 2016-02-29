#! /usr/bin/env node
var shell = require("shelljs");
var fs = require('fs');
var resolvePath  = require('path').resolve;
var joinPath  = require('path').join;

var wantedRemote = process.argv[2];

var walkDirs = (cwd) => {
  var paths = fs.readdirSync(cwd).filter(p => p.charAt(0) !== '.');
  paths.forEach(path => {
    var fullPath = cwd + '/' + path;
    try {
      if(fs.statSync(fullPath).isDirectory()) {
        if (fs.existsSync(fullPath + '/' + '.git')) {
          shell.exec("git config --get remote.origin.url",
                    { cwd: fullPath, silent: true },
                    (code, stdout, stderr) => {
                      if (wantedRemote === stdout.replace(/^\s+|\s+$/g, '')) {
                        console.log(fullPath);
                      }
                    });
        } else {
          walkDirs(fullPath);
        }
      }
    } catch(e) {
      console.log('error checking' + fullPath);
    }
  });
}

walkDirs(process.cwd());
