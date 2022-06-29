const fs = require('fs');
const { execSync } = require("child_process");
const archiver = require('archiver');
const packageJson = require('../package.json');
var path = require('path');
const fse = require('fs-extra');

function zipDirectory(sourceDir, outPath) {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const stream = fs.createWriteStream(outPath);

    return new Promise((resolve, reject) => {
        archive
            .directory(sourceDir, false)
            .on('error', err => reject(err))
            .pipe(stream)
            ;

        stream.on('close', () => resolve());
        archive.finalize();
    });
}

function copyFileSync(source, target) {

    var targetFile = target;

    // If target is a directory, a new file with the same name will be created
    if (fs.existsSync(target)) {
        if (fs.lstatSync(target).isDirectory()) {
            targetFile = path.join(target, path.basename(source));
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync(source, target) {
    var files = [];

    // Check if folder needs to be created or integrated
    var targetFolder = path.join(target, path.basename(source));
    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder);
    }

    // Copy
    if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source);
        files.forEach(function (file) {
            var curSource = path.join(source, file);
            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, targetFolder);
            } else {
                copyFileSync(curSource, targetFolder);
            }
        });
    }
}

// !删除dist文件夹和package文件
console.log("开始打包extension!");
console.log("删除输出目录!");
fs.rmSync('dist', { recursive: true, force: true });
fs.rmSync('package', { recursive: true, force: true });
console.log("复制src到dist!");
fs.mkdirSync('dist');
fse.copySync('src', 'dist');
// !复制package.json 开源协议信息以及readme.md
console.log("复制package.json 开源协议信息以及readme.md");
fs.copyFileSync('package.json', 'dist/package.json');
fs.copyFileSync('LICENSE', 'dist/LICENSE');
fs.copyFileSync('NOTICE', 'dist/NOTICE');
fs.copyFileSync('README.md', 'dist/README.md');

// !只安装运行依赖
console.log("安装运行依赖!");
stdout = execSync('cd dist && npm install --omit=dev');
// !创建package目录
console.log("创建package目录!");
fs.mkdirSync('package');
// !获取生成extension压缩包名称
const extensionZipFileName = `package/${packageJson.name}_${packageJson.version}.zip`;
// !压缩extension.zip
console.log("创建extension压缩包!");
zipDirectory('dist', extensionZipFileName).then(() => {
    console.log(`打包成功,打包文件路径:${extensionZipFileName}!`);
}).catch((error) => {
    console.log(`打包失败`);
    console.error(error);
});

// rm -rf dist;npm run tsc; cp package.json dist/package.json; cd dist; npm install --omit=dev;