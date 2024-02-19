#!/usr/bin/env powershell

# get args in powershell

$user = $args[0]
$serverHost = $args[1]
$port = $args[2]
# check the arg must be not null

if ($null -eq $user -or $null -eq $serverHost) {
    Write-Output "Usage: yzb-vsc-win.ps1 <user> <serverHost> <port>"
    exit 1
}

if ($null -eq $port) {
    $port = 22
} 

$USER_AT_HOST = "$USER_AT_HOST -p $port"

$PUBKEYPATH = "$HOME\.ssh\id_rsa.pub"
$pubKey = (Get-Content "$PUBKEYPATH" | Out-String); ssh "$USER_AT_HOST"  "mkdir -p ~/.ssh && chmod 700 ~/.ssh && echo '${pubKey}' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"