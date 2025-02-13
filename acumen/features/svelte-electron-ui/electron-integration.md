# Electron Integration Guide

## IPC Communication

### Main Process (main.ts)
```typescript
// Handle config access
ipcMain.handle('config:get', (_, key: string) => {
  return store.get(key);
});

// Handle goose server
ipcMain.handle('goose:start', async (_, options) => {
  const [port, key] = await startGoosed(app, options.dir);
  return { port, key };
});
```

### Preload Script (preload.ts)
```typescript
contextBridge.exposeInMainWorld('appConfig', {
  get: (key: string) => ipcRenderer.invoke('config:get', key),
  set: (key: string, value: any) => ipcRenderer.invoke('config:set', key, value)
});

contextBridge.exposeInMainWorld('goose', {
  start: (options: any) => ipcRenderer.invoke('goose:start', options),
  stop: () => ipcRenderer.invoke('goose:stop')
});
```

### Svelte Usage
```typescript
// Access from any component
const secretKey = await window.appConfig.get('secretKey');
const { port, key } = await window.goose.start({ dir: projectDir });
```

## Window Management

### Creating Windows
```typescript
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  
  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile('dist/index.html');
  }
}
```

### Window State
```typescript
// Save window positions
win.on('close', () => {
  const bounds = win.getBounds();
  store.set('windowBounds', bounds);
});

// Restore window positions
const bounds = store.get('windowBounds');
if (bounds) {
  win.setBounds(bounds);
}
```

## Development vs Production
- Use Vite's dev server in development
- Load local files in production
- Handle different paths and URLs
- Enable dev tools only in development
