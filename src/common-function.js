const fs = require('fs');
const { execSync } = require("child_process");
const archiver = require('archiver');

// !拷贝必须的文件到对应的目录,包含package.json 开源协议信息以及readme.md,targetDirPath不能以/结尾
function copyNessesaryDistFileToDir(targetDirPath) {
    console.log("复制package.json 开源协议信息以及readme.md");
    cpFile('package.json', `${targetDirPath}/package.json`, true, false)
    cpFile('LICENSE', `${targetDirPath}/LICENSE`, true, false)
    cpFile('NOTICE', `${targetDirPath}/NOTICE`, true, false)
    cpFile('README.md', `${targetDirPath}/README.md`, true, false)
}

// !读取package的version信息,packageDirPath不能以/结尾,当前目录什么都不用传递
function getPackageVersion(packageDirPath = '') {
    if (packageDirPath.length > 0) {
        packageDirPath = packageDirPath + '/';
    }
    const packageJsonContent = fs.readFileSync(`${packageDirPath}package.json`);
    let packageInfo = JSON.parse(packageJsonContent);
    return packageInfo.version;
}

function exec(script) {
    var stdout = execSync(script);
    return stdout;
}

function cpFile(source, target, force = true, throwError = true) {
    if (force) {
        fs.rmSync(target, { force: true });
    }
    try {
        fs.copyFileSync(source, target);
    } catch (error) {
        if (throwError) {
            throw error;
        }
    }
}

function zipDirectory(sourceDir, outPath) {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const stream = fs.createWriteStream(outPath);
    return new Promise((resolve, reject) => {
        archive
            .directory(sourceDir, false)
            .on('error', err => reject(err))
            .pipe(stream);
        stream.on('close', () => resolve());
        archive.finalize();
    });
}


module.exports = {
    exec, getPackageVersion, copyNessesaryDistFileToDir, cpFile, zipDirectory
}