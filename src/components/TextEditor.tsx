import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor,
    Essentials,
    Paragraph,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    List,
    Heading,
    Link,
    Image,
    ImageToolbar,
    ImageCaption,
    ImageStyle,
    ImageUpload,
    Alignment,
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import { useEffect, useRef } from 'react';

export default function TextEditor({ body, setBody, loading }: { body: string, setBody: (value: string) => void, loading: boolean }) {

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
                    List,
                    Heading,
                    Link,
                    Image,
                    ImageToolbar,
                    ImageCaption,
                    ImageStyle,
                    ImageUpload,
                    Alignment,
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
                        'link'
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
                initialData: body,
            }}
            disabled={loading}
            onChange={(event, editor) => {
                setBody(editor.getData());
            }}
            onReady={(editor) => {
                editorRef.current = editor;
            }}
        />
    );
}