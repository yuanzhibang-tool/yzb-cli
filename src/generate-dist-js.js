const fs = require('fs');
const fse = require('fs-extra');

// !删除dist文件夹和package文件
console.log("开始准备发布npm包!");
console.log("删除输出目录!");
fs.rmSync('dist', { recursive: true, force: true });
console.log("复制src到dist!");
fs.mkdirSync('dist');
fse.copySync('src', 'dist');
// !复制package.json 开源协议信息以及readme.md
console.log("复制package.json 开源协议信息以及readme.md");
fs.copyFileSync('package.json', 'dist/package.json');
fs.copyFileSync('LICENSE', 'dist/LICENSE');
fs.copyFileSync('NOTICE', 'dist/NOTICE');
fs.copyFileSync('README.md', 'dist/README.md');

