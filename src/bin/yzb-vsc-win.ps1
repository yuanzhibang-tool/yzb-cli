#!/usr/bin/env powershell

# get args in powershell

$user = $args[0]
$serverHost = $args[1]

# check the arg must be not null

if ($null -eq $user -or $null -eq $serverHost) {
    Write-Output "Usage: yzb-vsc-win.ps1 <user> <serverHost>"
    exit 1
}

$USER_AT_HOST = "$user@$serverHost"
$PUBKEYPATH = "$HOME\.ssh\id_rsa.pub"
$pubKey = (Get-Content "$PUBKEYPATH" | Out-String); ssh "$USER_AT_HOST" "mkdir -p ~/.ssh && chmod 700 ~/.ssh && echo '${pubKey}' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"