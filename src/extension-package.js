const fs = require('fs');
const { execSync } = require("child_process");
const archiver = require('archiver');
const packageJson = require('../package.json');

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

// !删除package文件
fs.rmSync('package', { recursive: true, force: true });
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