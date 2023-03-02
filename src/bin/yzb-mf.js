#!/usr/bin/env node
// merge-release-front-end-project 将release包拷贝到同一个用以管理释放版本的repo
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const fs = require('fs');
const path = require('path');
const { execSync } = require("child_process");

const argv = yargs(hideBin(process.argv)).argv;

const cwd = argv['cwd'];
try {
    process.chdir(cwd);
    console.log('New directory: ' + process.cwd());
}
catch (err) {
    console.err('chdir: ' + err);
}

const project = argv['project'];
const domain = argv['domain'];
const version = argv['version'];
const contentPath = argv['path'];

try {
    process.chdir('/tmp');
    console.log('New directory: ' + process.cwd());
}
catch (err) {
    console.log('chdir: ' + err);
}

function copyContentPath(contentPath, project) {
    try {
        const oldContentPath = `./project/${project}/content`
        fs.rmdirSync(oldContentPath);
    } catch (error) {
    }

    try {
        const oldContentPath = path.join(__dirname, `./project/${project}`)
        fs.mkdirSync(oldContentPath, { recursive: true });
    } catch (error) {
    }

    try {
        const oldContentPath = path.join(__dirname, `./project/${project}/content`)
        fs.cpSync(contentPath, oldContentPath, { recursive: true });
    } catch (error) {
        console.error(error);
    }

    try {
        const oldContentPath = `./project/${project}/info.json`
        fs.rmdirSync(oldContentPath);
    } catch (error) {
    }

    try {
        const oldContentPath = `./project/${project}/info.json`
        const info = {
            version,
            domain
        };
        fs.writeFileSync(oldContentPath, JSON.stringify(info));
    } catch (error) {
        console.error(error);
    }
}

function copyAndCommitAndCreateMergeRequest(contentPath, project, version) {
    const branchName = `update/${project}/version/${version}`;
    execSync('git checkout develop');
    execSync(`git checkout -b ${branchName}`);
    copyContentPath(contentPath, project);
    execSync('git add .');
    execSync(`git commit -m 'update ${update} version:${version}'`);
    execSync(`git push --set-upstream origin ${branchName}`)
    execSync(`git push -o merge_request.create -o merge_request.target=develop -o merge_request.remove_source_branch`)
    execSync('git checkout develop');
    execSync(`git branch --delete ${branchName}`);
}

copyAndCommitAndCreateMergeRequest(contentPath, project);