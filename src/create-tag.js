const fs = require('fs');
const { execSync } = require("child_process");

function getPackageVersion() {
    const packageJsonContent = fs.readFileSync("package.json");
    let packageInfo = JSON.parse(packageJsonContent);
    return packageInfo.version;
}

console.log(`开始-版本号更新并新建远程tag!`);
let version = getPackageVersion();
packageJson = null;
console.log(`源版本信息:${version}`);
let stdout = execSync('npm version patch');
version = getPackageVersion();
console.log(`当前版本信息:${version}`);

stdout = execSync('git push');
console.log(`创建tag分支:v${version}`);
// stdout = execSync(`git tag -a "v${version}" -m "auto release ${version}"`);
console.log(`同步远程tag!`);
stdout = execSync('git push origin --tags');
console.log(`完成-版本号更新并新建远程tag!`);


