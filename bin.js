#! /usr/bin/env node
var shell = require("shelljs");
var fs = require('fs');

var wantedRemote = process.argv[2];

var walkDirs = (cwd) => {
  var paths = fs.readdirSync(cwd)
                .filter(p => {
                  try {
                    return p.charAt(0) !== '.' && fs.statSync(cwd + '/' + p).isDirectory();
                  } catch(e) {
                    console.log(e);
                  }
                })
                .reduce((acc, p) => {
                  var fullPath = cwd + '/' + p;
                  if (fs.existsSync(fullPath + '/' + '.git')) {
                    acc.gitDirs = acc.gitDirs.concat(p);
                  } else {
                    acc.others = acc.others.concat(p);
                  }
                  return acc;
                }, {gitDirs: [], others: []});

  paths.gitDirs.forEach(p => {
    var fullPath = cwd + '/' + p;
    shell.exec("git config --get remote.origin.url",
               { cwd: fullPath, silent: true },
               (code, stdout, stderr) => {
                  if (wantedRemote === stdout.replace(/^\s+|\s+$/g, '')) {
                    console.log(fullPath);
                  }
                });
  });

  paths.others.forEach(p => { walkDirs(cwd + '/' + p) });
}

walkDirs(process.cwd());
