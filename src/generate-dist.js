const fs = require('fs');
const fse = require('fs-extra');
const { copyNessesaryDistFileToDir, exec } = require('./common-function');

function generateDistFileJs() {
    // !删除dist文件夹和package文件
    console.log("开始准备发布npm包!");
    console.log("删除输出目录!");
    fs.rmSync('dist', { recursive: true, force: true });
    console.log("复制src到dist!");
    fs.mkdirSync('dist');
    fse.copySync('src', 'dist');
    // !复制package.json 开源协议信息以及readme.md
    copyNessesaryDistFileToDir('dist')
}

function generateDistFileTs() {
    // !删除dist文件夹和package文件
    console.log("开始准备发布npm包!");
    console.log("删除输出目录!");
    fs.rmSync('dist', { recursive: true, force: true });
    console.log("编译ts!");
    var stdout = exec('npm run tsc');
    // !复制package.json 开源协议信息以及readme.md
    copyNessesaryDistFileToDir('dist')
}

module.exports = {
    generateDistFileJs, generateDistFileTs
}