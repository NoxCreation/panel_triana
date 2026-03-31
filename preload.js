// En tu archivo preload.js
const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  toggleFrame: () => ipcRenderer.send('toggle-frame'),
  showScreenAuth: () => ipcRenderer.send('show-screen-auth')
});

contextBridge.exposeInMainWorld("electron", {
  // Función para imprimir contenido
  print: (content, options) => {
    return ipcRenderer.invoke("print-content", { content, options })
  },
})
