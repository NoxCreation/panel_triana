# Proyecto FITTEXX

Panel y Backend API del proyecto FITTEXX. Posee todos los recursos para manipular los datos de la aplicación de FITTEXX.

> Copyrigth 2025 Paola

## Documentación Swagguer

En **VS Code** instalar las extensiones 

1. 42crunch.vscode-openapi: Para que ayude escribiendo el YML de la documentación
2. arjun.swagger-viewer: Visualiza en el VS el preview de como se va a ver lo que escribes en el YML

> ULR: [/api-doc/v1](http://127.0.0.1:3000/api-doc/v1)

## Prisma ORM

Se usa Prisma como ORM. En /prisma/schema.prisma están todos los modelos. Cuando se necesite hacer alguna migración debe ejecutar lo siguiente:

```bash
   yarn migrate
```

## Videos de Prueba

> [PEXEL](https://www.pexels.com/search/videos/vertical/)

## FFmpef

Para el funcionamiento del editor de video, es necesario descargar el [FFmpeg Core](https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd/ffmpeg-core.wasm) y ponerlo en la carpeta public a consumir en local, ya que fue excluido del repositorio por su peso.

[MAS INFORMACION](https://ffmpegwasm.netlify.app/docs/getting-started/usage)

## MINIO

Para el funcionamiento del panel es necesario vincularlo con el servidor S3 [MinIO](https://www.min.io/). Para ello se levanta con el siguiente docker-compose:

```docker
version: '3.7'
services:
   minio:
      image: minio/minio
      container_name: minio
      ports:
         - "9000:9000"       # S3 API
         - "9001:9001"       # Admin UI
      volumes:
         - ./minio-data:/data
      environment:
         MINIO_ROOT_USER: admin
         MINIO_ROOT_PASSWORD: admin123
      command: server /data --console-address ":9001"
      networks:
         default:
         ipv4_address: X.X.X.X

   networks:
   default:
      driver: bridge
      name: network_me
      external: true
```

En las variables de entorno "Configuracion MINIO" debe agregar todos los parámetros de configuración. En el panel en todo momento se debe garantizar la depuración de las medias que se suben. Hablamos de si se edita alguna media, debe sustituirse la que ya existe, si se elimina, se debe eliminar también del s3 etc... En NOX tenemos servido en esta URL (http://194.163.45.115:9001/login).
   
