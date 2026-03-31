import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import next from 'next';

// Configura el directorio de Next.js
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configura Next.js
const dev = false; // Inicia Next.js en producción
const appPath = path.join(__dirname);
const nextApp = next({ dev, dir: appPath });
const handle = nextApp.getRequestHandler();

function createWindow() {
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    width: 900, // 770 + 50
    height: 750, // 560 + 50
  });

  // Maximiza la ventana para que ocupe toda la pantalla
  // win.maximize();
  // Oculta la barra de menús
  win.setMenuBarVisibility(false);

  win.loadURL('http://127.0.0.1:3000/');

  return win;
}

nextApp.prepare().then(() => {
  // Configura Express
  const server = express();
  server.all('*', (req, res) => handle(req, res));

  // Inicia el servidor
  server.listen(3000, () => {
    // Abre Electron cuando el servidor esté listo
    console.log('Running');
    app.whenReady().then(() => {
      let splashWindow = createWindow();
      ipcMain.on('toggle-frame', (event) => {
        const win = BrowserWindow.getFocusedWindow();
        if (win.isFullScreen()) {
          win.setFullScreen(false);
        } else {
          win.setFullScreen(true);
        }
      });

      ipcMain.on('show-screen-auth', (event) => {
        splashWindow.close();
        const win = new BrowserWindow({
          webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
          },
          transparent: false,
          frame: true,
        });
        win.maximize();
        win.setMenuBarVisibility(false);
        win.loadURL('http://127.0.0.1:3000/auth');
      });

      ipcMain.handle("print-content", async (event, { content, options }) => {
        try {
          // Crear un archivo HTML temporal
          const tempPath = path.join(os.tmpdir(), `print-${Date.now()}.html`)

          // Crear el contenido HTML con estilos
          const htmlContent = `
            <!DOCTYPE html>
            <html>
              <head>
                <title>${options.title || "Documento"}</title>
                <style>
                  @page {
                    size: ${options.paperSize || "a4"} ${options.orientation || "portrait"};
                    margin: 10mm;
                  }
                  body {
                    font-family: Arial, sans-serif;
                    background-color: white;
                    color: black;
                    margin: 0;
                    padding: 0;
                  }
                  .print-container {
                    padding: 10mm;
                    box-sizing: border-box;
                  }
                </style>
              </head>
              <body>
                <div class="print-container">${content}</div>
              </body>
            </html>
          `
          // Escribir el archivo temporal
          fs.writeFileSync(tempPath, htmlContent)

          // Crear una ventana oculta para imprimir
          const printWin = new BrowserWindow({
            show: false,
            webPreferences: {
              nodeIntegration: false,
              contextIsolation: true,
            },
          })

          await printWin.loadFile(tempPath)

          // Imprimir y cerrar la ventana
          const success = await printWin.webContents.print({
            silent: false,
            printBackground: true,
            deviceName: "",
            margins: {
              marginType: "custom",
              top: 10,
              bottom: 10,
              left: 10,
              right: 10,
            },
          })

          printWin.close()

          // Eliminar el archivo temporal
          fs.unlinkSync(tempPath)

          return { success }
        } catch (error) {
          console.error("Error al imprimir:", error)
          return { success: false, error: error.message }
        }
      })

    });
  });
});
