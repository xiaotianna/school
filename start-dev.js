#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// 检测项目使用的包管理器
function detectPackageManager() {
  const rootDir = path.resolve(__dirname);
  
  if (fs.existsSync(path.join(rootDir, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  } else if (fs.existsSync(path.join(rootDir, 'yarn.lock'))) {
    return 'yarn';
  } else if (fs.existsSync(path.join(rootDir, 'package-lock.json'))) {
    return 'npm';
  }
  
  // 默认使用 npm
  return 'npm';
}

// 获取客户端命令
function getClientCommand(packageManager) {
  switch (packageManager) {
    case 'pnpm':
      return 'pnpm -F client dev -- --host 0.0.0.0 --port 5173';
    case 'yarn':
      return 'yarn workspace client dev --host 0.0.0.0 --port 5173';
    case 'npm':
    default:
      return 'npm run dev --workspace=client -- --host 0.0.0.0 --port 5173';
  }
}

// 获取服务端命令
function getServerCommand(packageManager) {
  switch (packageManager) {
    case 'pnpm':
      return 'pnpm -F server dev:server';
    case 'yarn':
      return 'yarn workspace server dev:server';
    case 'npm':
    default:
      return 'npm run dev:server --workspace=server';
  }
}

// 使用 concurrently 启动两个进程
function startDevelopment() {
  const packageManager = detectPackageManager();
  const clientCommand = getClientCommand(packageManager);
  const serverCommand = getServerCommand(packageManager);
  
  console.log(`Detected package manager: ${packageManager}`);
  console.log(`Starting client with command: ${clientCommand}`);
  console.log(`Starting server with command: ${serverCommand}`);
  
  // 使用 spawn 执行命令
  const clientProcess = spawn(clientCommand, {
    stdio: 'inherit',
    shell: true,
    cwd: process.cwd()
  });
  
  const serverProcess = spawn(serverCommand, {
    stdio: 'inherit',
    shell: true,
    cwd: process.cwd()
  });
  
  // 监听进程退出事件
  clientProcess.on('close', (code) => {
    console.log(`Client process exited with code ${code}`);
    if (!serverProcess.killed) {
      serverProcess.kill();
    }
  });
  
  serverProcess.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
    if (!clientProcess.killed) {
      clientProcess.kill();
    }
  });
  
  // 监听中断信号，确保两个进程都能被正确终止
  process.on('SIGINT', () => {
    console.log('\nShutting down both processes...');
    clientProcess.kill();
    serverProcess.kill();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('\nTerminating both processes...');
    clientProcess.kill();
    serverProcess.kill();
    process.exit(0);
  });
  
  console.log('Starting both client and server processes...');
  console.log('Client: http://localhost:5173');
  console.log('Server: http://localhost:3000');
}

startDevelopment();
