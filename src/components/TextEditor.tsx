import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor,
    Essentials,
    Paragraph,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Heading,
    Link,
    Image,
    ImageToolbar,
    ImageCaption,
    ImageStyle,
    ImageUpload,
    Alignment,
    List,
    ListProperties,
    ImageResize,
    MediaEmbed,
    /* InsertMediaEmbedButton, */
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import { useEffect, useRef } from 'react';
import { Base64UploadAdapterPlugin } from './TextEditorPlugins/Base64UploadAdapterPlugin';

export default function TextEditor({ body, setBody, loading }: { body: string; setBody: (value: string) => void; loading: boolean }) {
    const editorRef = useRef<ClassicEditor | null>(null);

    useEffect(() => {
        if (editorRef.current) {
            const currentData = editorRef.current.getData();
            if (currentData !== body) {
                editorRef.current.setData(body);
            }
        }
    }, [body]);

    return (
        <CKEditor
            editor={ClassicEditor}
            config={{
                licenseKey: 'GPL',
                plugins: [
                    Essentials,
                    Paragraph,
                    Bold,
                    Italic,
                    Underline,
                    Strikethrough,
                    Heading,
                    Link,
                    Image,
                    ImageToolbar,
                    ImageCaption,
                    ImageStyle,
                    ImageUpload,
                    Alignment,
                    List,
                    ListProperties,
                    Base64UploadAdapterPlugin,
                    ImageResize,
                    MediaEmbed
                ],
                toolbar: {
                    items: [
                        'undo', 'redo',
                        '|',
                        'heading',
                        '|',
                        'bold', 'italic', 'underline', 'strikethrough',
                        '|',
                        'bulletedList', 'numberedList',
                        '|',
                        'alignment',
                        '|',
                        'link',
                        '|',
                        'insertImage',
                        'insertMediaEmbed',
                    ],
                },
                heading: {
                    options: [
                        { model: 'paragraph', title: 'Párrafo', class: 'ck-heading_paragraph' },
                        { model: 'heading1', view: 'h1', title: 'Título 1', class: 'ck-heading_heading1' },
                        { model: 'heading2', view: 'h2', title: 'Título 2', class: 'ck-heading_heading2' },
                        { model: 'heading3', view: 'h3', title: 'Título 3', class: 'ck-heading_heading3' },
                    ]
                },
                alignment: {
                    options: ['left', 'center', 'right', 'justify'],
                },
                image: {
                    toolbar: [
                        'imageTextAlternative',
                        'toggleImageCaption',
                        '|',
                        'imageStyle:alignLeft',
                        'imageStyle:alignCenter',
                        'imageStyle:alignRight',
                        'imageStyle:alignBlock',
                        '|',
                        'resizeImage'
                    ],
                    styles: [
                        // Imagen alineada a la izquierda (flotante)
                        {
                            name: 'alignLeft',
                            title: 'Alinear a la izquierda',
                            icon: 'left',
                            className: 'image-style-align-left',
                            isDefault: false
                        },
                        // Imagen centrada (no flotante, con margen automático)
                        {
                            name: 'alignCenter',
                            title: 'Centrar',
                            icon: 'center',
                            className: 'image-style-align-center',
                            isDefault: true   // Este será el estilo por defecto (sin flotar, centrado)
                        },
                        // Imagen alineada a la derecha (flotante) - mantiene la clase original 'image-style-side'
                        {
                            name: 'alignRight',
                            title: 'Alinear a la derecha',
                            icon: 'right',
                            className: 'image-style-side',   // ← la clase que ya usas en tu CSS
                            isDefault: false
                        },
                        // Imagen en bloque (ocupa todo el ancho, sin flotar)
                        {
                            name: 'alignBlock',
                            title: 'Ancho completo',
                            icon: 'full',
                            className: 'image-style-block',
                            isDefault: false
                        }
                    ] as any,
                    upload: { types: ['png', 'jpeg', 'jpg', 'gif', 'bmp', 'webp'] },
                    resizeOptions: [
                        {
                            name: 'resizeImage:original',
                            value: null,
                            label: 'Original'
                        },
                        {
                            name: 'resizeImage:50',
                            value: '50',
                            label: '50%'
                        },
                        {
                            name: 'resizeImage:75',
                            value: '75',
                            label: '75%'
                        }
                    ],
                },
                initialData: body,
                mediaEmbed: {
                    previewsInData: true,
                    extraProviders: [
                        {
                            name: 'tiktok',
                            url: /^https:\/\/(www\.)?tiktok\.com\/.*\/video\/\d+/,
                            html: (match) => {
                                const videoId = match[0].split('/video/')[1];
                                return `<iframe src="https://www.tiktok.com/embed/v2/${videoId}" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`;
                            }
                        }
                    ]
                }
            }}
            disabled={loading}
            onChange={(event, editor) => {
                const data = editor.getData();
                setBody(data);
            }}
            onReady={(editor) => {
                editorRef.current = editor;
                console.log('✅ Editor listo');
            }}
        />
    );
}