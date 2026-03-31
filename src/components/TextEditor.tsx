import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor,
    Essentials,
    Paragraph,
    Bold,
    Italic,
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import { useEffect, useRef } from 'react';
// import coreTranslations from 'ckeditor5/translations/es.js';

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
                plugins: [Essentials, Paragraph, Bold, Italic],
                // translations: [ coreTranslations ],
                toolbar: ['undo', 'redo', '|', 'bold', 'italic', '|'],
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