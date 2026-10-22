$taskNode = Get-Command node -ErrorAction SilentlyContinue
if (-not $taskNode) { throw 'Node.js is required to start the local preview.' }
Set-Location -LiteralPath $PSScriptRoot
& $taskNode.Source (Join-Path $PSScriptRoot 'server.cjs')
