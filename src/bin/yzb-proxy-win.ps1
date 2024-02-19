#!/usr/bin/env powershell

# get args in powershell

$proxy = $args[0]

# check the arg must be not null

if ($null -eq $user -or $null -eq $serverHost) {
    Write-Output "Usage: yzb-proxy.ps1 proxy_url"
    exit 1
}

# 设置git代理
git config --global http.proxy $1
git config --global https.proxy $1

# 设置npm代理
npm config set proxy $1
npm config set https-proxy $1