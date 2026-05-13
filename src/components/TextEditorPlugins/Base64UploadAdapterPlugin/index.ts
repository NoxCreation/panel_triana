// ------------------------------
// Adaptador con redimensionado fiable usando createImageBitmap
// ------------------------------
class Base64UploadAdapter {
    private loader: any;

    constructor(loader: any) {
        this.loader = loader;
    }

    async upload() {
        try {
            const file = await this.loader.file;
            console.log(`📷 Original: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);

            const base64 = await this.compressImage(file);
            const base64Size = (base64.length * 0.75) / 1024 / 1024;
            console.log(`✅ Base64 final: ~${base64Size.toFixed(2)} MB (${(base64.length / 1024).toFixed(0)} KB)`);

            return { default: base64 };
        } catch (error) {
            console.error('❌ Error en upload():', error);
            throw error;
        }
    }

    abort() { }

    private async compressImage(file: File): Promise<string> {
        console.log('[compressImage] Iniciando');

        // 1. Obtener un ImageBitmap de forma eficiente
        let bitmap: ImageBitmap | null = null;
        try {
            bitmap = await createImageBitmap(file);
            console.log(`[compressImage] ImageBitmap creado: ${bitmap.width}x${bitmap.height}`);
        } catch (err) {
            console.error('[compressImage] Falló createImageBitmap, intentando método clásico', err);
            // Fallback al método clásico con Image
            return this.compressImageClassic(file);
        }

        // 2. Calcular nuevas dimensiones (ancho máximo 600px)
        const MAX_WIDTH = 600;
        let width = bitmap.width;
        let height = bitmap.height;
        if (width > MAX_WIDTH) {
            height = (height * MAX_WIDTH) / width;
            width = MAX_WIDTH;
            console.log(`[compressImage] Redimensionado: ${bitmap.width}x${bitmap.height} → ${Math.round(width)}x${Math.round(height)}`);
        } else {
            console.log(`[compressImage] Sin redimensionar (${width}x${height})`);
        }

        // 3. Dibujar en canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('No se pudo obtener contexto 2D');
        }
        ctx.drawImage(bitmap, 0, 0, width, height);

        // Liberar el bitmap (ya no lo necesitamos)
        bitmap.close();

        // 4. Generar base64 (usamos JPEG calidad 0.85, porque es JPG)
        let mimeType = 'image/jpeg';
        let quality = 0.85;
        let base64: string;
        try {
            base64 = canvas.toDataURL(mimeType, quality);
            if (!base64 || base64.length < 100) {
                throw new Error('Base64 vacío o muy corto');
            }
        } catch (err) {
            console.warn('[compressImage] Falló toDataURL con JPEG, usando PNG sin compresión', err);
            base64 = canvas.toDataURL('image/png');
        }

        console.log('[compressImage] Base64 generado correctamente');
        return base64;
    }

    // Fallback clásico (con Image) para navegadores sin createImageBitmap
    private compressImageClassic(file: File): Promise<string> {
        console.log('[compressImageClassic] Usando método clásico con Image');
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUrl = e.target?.result as string;
                const img = new Image();
                img.onload = () => {
                    try {
                        const MAX_WIDTH = 600;
                        let width = img.width;
                        let height = img.height;
                        if (width > MAX_WIDTH) {
                            height = (height * MAX_WIDTH) / width;
                            width = MAX_WIDTH;
                            console.log(`[classic] Redimensionado: ${img.width}x${img.height} → ${Math.round(width)}x${Math.round(height)}`);
                        }
                        const canvas = document.createElement('canvas');
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        if (!ctx) throw new Error('Sin contexto 2D');
                        ctx.drawImage(img, 0, 0, width, height);
                        let base64 = canvas.toDataURL('image/jpeg', 0.85);
                        if (!base64 || base64.length < 100) {
                            base64 = canvas.toDataURL('image/png');
                        }
                        resolve(base64);
                    } catch (err) {
                        reject(err);
                    }
                };
                img.onerror = (err) => {
                    console.error('[classic] Error cargando Image:', err);
                    reject(new Error('No se pudo cargar la imagen'));
                };
                img.src = dataUrl;
            };
            reader.onerror = (err) => {
                console.error('[classic] Error FileReader:', err);
                reject(new Error('No se pudo leer el archivo'));
            };
            reader.readAsDataURL(file);
        });
    }
}

// Plugin que registra el adaptador
export function Base64UploadAdapterPlugin(editor: any) {
    const fileRepository = editor.plugins.get('FileRepository');
    if (!fileRepository) {
        console.error('FileRepository no encontrado. Asegúrate de que ImageUpload está en plugins.');
        return;
    }
    fileRepository.createUploadAdapter = (loader: any) => {
        console.log('🔌 Creando adaptador base64 con createImageBitmap');
        return new Base64UploadAdapter(loader);
    };
}