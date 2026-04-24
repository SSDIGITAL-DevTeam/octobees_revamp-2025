'use client'

import { CKEditor } from '@ckeditor/ckeditor5-react'
import {
    ClassicEditor,
    Essentials,
    Paragraph,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Heading,
    FontColor,
    FontBackgroundColor,
    FontFamily,
    FontSize,
    Alignment,
    List,
    Indent,
    IndentBlock,
    BlockQuote,
    CodeBlock,
    Link,
    Image,
    ImageUpload,
    ImageToolbar,
    ImageCaption,
    ImageStyle,
    ImageResize,
    ImageInsert,
    Table,
    TableToolbar,
    MediaEmbed,
    RemoveFormat,
    Undo,
    FileRepository,
    AutoImage,
    PasteFromOffice,
} from 'ckeditor5'

import 'ckeditor5/ckeditor5.css'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_API_URL || ''

/**
 * Custom upload adapter for CKEditor 5.
 * Integrates with existing backend: POST /blog/upload-content-image
 */
// Custom upload adapter plugin is now defined inside the component

interface CKEditorComponentProps {
    value: string
    onChange: (data: string) => void
    uploadUrl?: string
}

export default function CKEditorComponent({
    value,
    onChange,
    uploadUrl = '/blog/upload-content-image'
}: CKEditorComponentProps) {
    // Define the upload adapter inline so it can capture uploadUrl
    function uploadAdapterPlugin(editor: any) {
        editor.plugins.get('FileRepository').createUploadAdapter = (
            loader: any,
        ) => {
            return {
                upload: () =>
                    loader.file.then(
                        (file: File) =>
                            new Promise((resolve, reject) => {
                                const xhr = new XMLHttpRequest()
                                xhr.open(
                                    'POST',
                                    `${API_URL}${uploadUrl}`,
                                    true,
                                )
                                xhr.withCredentials = true

                                xhr.addEventListener('load', () => {
                                    if (xhr.status < 200 || xhr.status >= 300) {
                                        return reject(
                                            `Upload failed (${xhr.status})`,
                                        )
                                    }
                                    try {
                                        const response = JSON.parse(
                                            xhr.responseText,
                                        )
                                        // Save as relative path or absolute path
                                        // It's safer to store relative path /uploads/filename so the rendering side handles absolute domain
                                        const imageUrl = IMAGE_BASE_URL ? `${IMAGE_BASE_URL}/${response.url}` : `/uploads/${response.url}`
                                        resolve({ default: imageUrl })
                                    } catch {
                                        reject('Invalid server response')
                                    }
                                })

                                xhr.addEventListener('error', () =>
                                    reject('Upload failed'),
                                )
                                xhr.addEventListener('abort', () =>
                                    reject('Upload aborted'),
                                )

                                if (xhr.upload) {
                                    xhr.upload.addEventListener(
                                        'progress',
                                        (evt) => {
                                            if (evt.lengthComputable) {
                                                loader.uploadTotal = evt.total
                                                loader.uploaded = evt.loaded
                                            }
                                        },
                                    )
                                }

                                const formData = new FormData()
                                formData.append('image', file)
                                xhr.send(formData)
                            }),
                    ),
                abort: () => {},
            }
        }
    }

    return (
        <CKEditor
            editor={ClassicEditor}
            data={value}
            onChange={(_event: any, editor: any) => {
                const data = editor.getData()
                onChange(data)
            }}
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
                    FontColor,
                    FontBackgroundColor,
                    FontFamily,
                    FontSize,
                    Alignment,
                    List,
                    Indent,
                    IndentBlock,
                    BlockQuote,
                    CodeBlock,
                    Link,
                    Image,
                    ImageUpload,
                    ImageToolbar,
                    ImageCaption,
                    ImageStyle,
                    ImageResize,
                    ImageInsert,
                    Table,
                    TableToolbar,
                    MediaEmbed,
                    RemoveFormat,
                    Undo,
                    FileRepository,
                    AutoImage,
                    PasteFromOffice,
                ],
                extraPlugins: [uploadAdapterPlugin],
                toolbar: {
                    items: [
                        'undo',
                        'redo',
                        '|',
                        'heading',
                        '|',
                        'bold',
                        'italic',
                        'underline',
                        'strikethrough',
                        '|',
                        'fontSize',
                        'fontFamily',
                        'fontColor',
                        'fontBackgroundColor',
                        '|',
                        'alignment',
                        '|',
                        'bulletedList',
                        'numberedList',
                        'outdent',
                        'indent',
                        '|',
                        'blockQuote',
                        'codeBlock',
                        '|',
                        'link',
                        'insertImage',
                        'insertTable',
                        'mediaEmbed',
                        '|',
                        'removeFormat',
                    ],
                    shouldNotGroupWhenFull: true,
                },
                heading: {
                    options: [
                        {
                            model: 'paragraph' as const,
                            title: 'Paragraph',
                            class: 'ck-heading_paragraph',
                        },
                        {
                            model: 'heading1' as const,
                            view: 'h1',
                            title: 'Heading 1',
                            class: 'ck-heading_heading1',
                        },
                        {
                            model: 'heading2' as const,
                            view: 'h2',
                            title: 'Heading 2',
                            class: 'ck-heading_heading2',
                        },
                        {
                            model: 'heading3' as const,
                            view: 'h3',
                            title: 'Heading 3',
                            class: 'ck-heading_heading3',
                        },
                        {
                            model: 'heading4' as const,
                            view: 'h4',
                            title: 'Heading 4',
                            class: 'ck-heading_heading4',
                        },
                        {
                            model: 'heading5' as const,
                            view: 'h5',
                            title: 'Heading 5',
                            class: 'ck-heading_heading5',
                        },
                        {
                            model: 'heading6' as const,
                            view: 'h6',
                            title: 'Heading 6',
                            class: 'ck-heading_heading6',
                        },
                    ],
                },
                image: {
                    toolbar: [
                        'imageTextAlternative',
                        'toggleImageCaption',
                        '|',
                        'imageStyle:inline',
                        'imageStyle:block',
                        'imageStyle:side',
                        '|',
                        'resizeImage',
                    ],
                    upload: {
                        types: ['jpeg', 'png', 'gif', 'webp'],
                    },
                },
                table: {
                    contentToolbar: [
                        'tableColumn',
                        'tableRow',
                        'mergeTableCells',
                    ],
                },
            }}
        />
    )
}
