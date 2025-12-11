# VS Code Remote SSH Troubleshooting Guide

## Vấn đề: "Downloading VS Code Server" treo mãi

### Nguyên nhân thường gặp:
1. VS Code server bị corrupt
2. Network connection không ổn định  
3. Disk space không đủ
4. Permission issues

### Giải pháp step-by-step:

#### 1. Kill VS Code Server (trong VS Code):
- `Ctrl+Shift+P` → `Remote-SSH: Kill VS Code Server on Host`

#### 2. Clear VS Code cache (trên server):
```bash
ssh Server_2 'rm -rf ~/.vscode-server'
```

#### 3. Tăng timeout (trong settings.json):
```json
{
    "remote.SSH.connectTimeout": 60,
    "remote.SSH.serverDownloadTimeout": 120
}
```

#### 4. Manual download (nếu cần):
```bash
ssh Server_2
wget -O- https://update.code.visualstudio.com/commit:bf9252a2fb45be6893dd8870c0bf37e2e1766d61/server-linux-x64/stable | tar -xz
```

#### 5. Check system resources:
```bash
ssh Server_2 'df -h && free -h && ps aux | head'
```

### Alternative: Force reinstall
1. Uninstall Remote SSH extension
2. Reinstall Remote SSH extension  
3. Restart VS Code
4. Try connecting again