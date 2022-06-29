const fs = require('fs');
const { execSync } = require("child_process");

// !拷贝必须的文件到对应的目录,包含package.json 开源协议信息以及readme.md,targetDirPath不能以/结尾
export function copyNessesaryFileToDir(targetDirPath) {
    console.log("复制package.json 开源协议信息以及readme.md");
    if (fs.existsSync('package.json')) {
        fs.copyFileSync('package.json', `${targetDirPath}/package.json`);
    }
    fs.copyFileSync('LICENSE', `${targetDirPath}/LICENSE`);
    fs.copyFileSync('NOTICE', `${targetDirPath}/NOTICE`);
    fs.copyFileSync('README.md', `${targetDirPath}/README.md`);
}

// !读取package的version信息,packageDirPath不能以/结尾,当前目录什么都不用传递
export function getPackageVersion(packageDirPath = '') {
    if (packageDirPath.length > 0) {
        packageDirPath = packageDirPath + '/';
    }
    const packageJsonContent = fs.readFileSync(`${packageDirPath}package.json`);
    let packageInfo = JSON.parse(packageJsonContent);
    return packageInfo.version;
}

export function exec(script) {
    var stdout = execSync(script);
    return stdout;
}

export function cpFile(source, target, force = true, throwError = true) {
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