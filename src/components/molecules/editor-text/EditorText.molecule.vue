<!--
    Todo: COMPONENT MODAL PDF VIEWER REUSABLE
    ?To use this component, read carefully what it requires in order to handle the correct data and structure.

    dataEditorText: {
        dataEditor: { // properties for the editor
            setData: () => { },
            content: '',
        },
    }

-->
<template>
    <section class="editor-text-molecule">

        <ul class="editor-text-molecule__header">
            <template v-for="dataImg in arrayActions.actions">
                <li v-if="dataImg.type === 'divider'" class="editor-text-molecule__header__divider"></li>
                <IcoImg v-if="dataImg.type === 'svg' || dataImg.type === 'png'" :dataImg="dataImg" class="editor-text-molecule__header__icon" />
                <input v-if="dataImg.type === 'color'" id="input-color-editor" class="editor-text-molecule__header__input" type="color" @input="dataImg.getColor" :value="dataImg.value">
                <input v-if="dataImg.type === 'file'" id="input-file-editor" class="editor-text-molecule__header__input" type="file" accept="image/png, image/jpeg, image/jpg" @change="dataImg.getBase64" >
                <Select v-if="dataImg.type === 'select'" :dataSelect="dataImg" />
            </template>
        </ul>
            
        <article class="editor-text-molecule__editor">
            <Editor @dataEditor="getDataEditor" @sendDataEditor="getSendDataEditor" :dataEditor="dataEditorText?.dataEditor" />
        </article>

    </section>

</template>
<script setup lang="ts">
import Editor from '../../atoms/editor-text/EditorText.atom.vue';
import IcoImg from "../../atoms/img/Img.atom.vue";
import Select from "../../atoms/select/Select.atom.vue";
import { reactive, ref } from "vue";


const arrayActions: any = reactive({
    actions: []
})

const props = defineProps(['dataEditorText']);
const emits = defineEmits(['sendDataEditor'])

function getDataEditor(editor: any) {
    
    arrayActions.actions = [
        {
            id: '',
            name: 'icon undo',
            class: 'button-img icon',
            src: '/icon-undo.svg',
            type: 'svg',
            alt: 'undo',
            onClick: () => {
                editor.chain().focus().undo().run()
            }
        },
        {
            id: '',
            name: 'icon redo',
            class: 'button-img icon',
            src: '/icon-redo.svg',
            type: 'svg',
            alt: 'redo',
            onClick: () => {
                editor.chain().focus().redo().run()
            }
        },
        {
            type: 'divider',
        },
        {
            id: '',
            name: 'icon blockquote',
            class: 'button-img icon',
            src: '/icon-blockquote.svg',
            type: 'svg',
            alt: 'blockquote',
            isActive: () => editor.isActive('blockquote'),
            onClick: () => {
                editor.chain().focus().toggleBlockquote().run()
            }
        },
        {
            id: '',
            name: 'icon bullet list',
            class: 'button-img icon',
            src: '/icon-bullet-list.svg',
            type: 'svg',
            alt: 'bullet list',
            isActive: () => editor.isActive('bulletList'),
            onClick: () => {
                editor.chain().focus().toggleBulletList().run()
            }
        },
        {
            id: '',
            name: 'icon ordered list',
            class: 'button-img icon',
            src: '/icon-ordered-list.svg',
            type: 'svg',
            alt: 'ordered list',
            isActive: () => editor.isActive('orderedList'),
            onClick: () => {
                editor.chain().focus().toggleOrderedList().run()
            }
        },
        {
            id: '',
            name: 'icon Heading 1',
            class: 'button-img icon',
            src: '/icon-heading1.svg',
            type: 'svg',
            alt: 'Heading 1',
            isActive: () => editor.isActive('heading', { level: 1 }),
            onClick: () => {
                editor.chain().focus().toggleHeading({ level: 1 }).run()
            },

        },
        {
            id: '',
            name: 'icon Heading 2',
            class: 'button-img icon',
            src: '/icon-heading2.svg',
            type: 'svg',
            alt: 'Heading 2',
            isActive: () => editor.isActive('heading', { level: 2 }),
            onClick: () => {
                editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
        },
        {
            id: '',
            name: 'icon Heading 3',
            class: 'button-img icon',
            src: '/icon-heading3.svg',
            type: 'svg',
            alt: 'Heading 3',
            isActive: () => editor.isActive('heading', { level: 3 }),
            onClick: () => {
                editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
        },
        {
            id: '',
            name: 'icon paragrahp',
            class: 'button-img icon',
            src: '/icon-paragraph.svg',
            type: 'svg',
            alt: 'paragraph',
            isActive: () => editor.isActive('paragraph'),
            onClick: () => {
                editor.chain().focus().setParagraph().run()
            }
        },
        {
            id: '',
            name: 'icon code block',
            class: 'button-img icon',
            src: '/icon-code-block.svg',
            type: 'svg',
            alt: 'code block',
            isActive: () => editor.isActive('codeBlock'),
            onClick: () => {
                editor.chain().focus().toggleCodeBlock().run()
            }
        },
        {
            id: '',
            name: 'icon horizontal rule',
            class: 'button-img icon',
            src: '/icon-horizontal-rule.svg',
            type: 'svg',
            alt: 'horizontal rule',
            isActive: () => editor.isActive('horizontalRule'),
            onClick: () => {
                editor.chain().focus().setHorizontalRule().run()
            }
        },
        {
            type: 'divider',
        },
        {
            id: '',
            name: 'icon Bold',
            class: 'button-img icon',
            src: '/icon-bold.svg',
            type: 'svg',
            alt: 'Bold',
            isActive: () => editor.isActive('bold'),
            onClick: () => {
                editor.chain().focus().toggleBold().run()
            }
        },
        {
            id: '',
            name: 'icon italic',
            class: 'button-img icon',
            src: '/icon-italic.svg',
            type: 'svg',
            alt: 'italic',
            isActive: () => editor.isActive('italic'),
            onClick: () => {
                editor.chain().focus().toggleItalic().run()
            }
        },
        {
            id: '',
            name: 'icon strike',
            class: 'button-img icon',
            src: '/icon-strike.svg',
            type: 'svg',
            alt: 'strike',
            isActive: () => editor.isActive('strike'),
            onClick: () => {
                editor.chain().focus().toggleStrike().run()
            }
        },
        {
            id: '',
            name: 'icon underline',
            class: 'button-img icon',
            src: '/icon-underline.svg',
            type: 'svg',
            alt: 'underline',
            isActive: () => editor.isActive('underline'),
            onClick: () => {
                editor.chain().focus().toggleUnderline().run()
            }
        },
        {
            id: '',
            name: 'icon code line',
            class: 'button-img icon',
            src: '/icon-code-line.svg',
            type: 'svg',
            alt: 'CodeLine',
            isActive: () => editor.isActive('code'),
            onClick: () => {
                editor.chain().focus().toggleCode().run()
            }
        },
        {
            id: '',
            name: 'icon Highlight',
            class: 'button-img icon',
            src: '/icon-highlight.svg',
            type: 'svg',
            alt: 'Highlight',
            isActive: () => editor.isActive('highlight'),
            onClick: () => {
                editor.chain().focus().toggleHighlight().run()
            }
        },
        {
            type: 'divider',
        },
        {
            id: '',
            name: 'icon text align left',
            class: 'button-img icon',
            src: '/icon-text-aling-left.svg',
            type: 'svg',
            alt: 'text align left',
            isActive: () => editor.isActive({ textAlign: 'left' }),
            onClick: () => {
                editor.chain().focus().setTextAlign('left').run()
            }
        },
        {
            id: '',
            name: 'icon text aling cente',
            class: 'button-img icon',
            src: '/icon-text-aling-center.svg',
            type: 'svg',
            alt: 'text aling center',
            isActive: () => editor.isActive({ textAlign: 'center' }),
            onClick: () => {
                editor.chain().focus().setTextAlign('center').run()
            }
        },
        {
            id: '',
            name: 'icon text aling right',
            class: 'button-img icon',
            src: '/icon-text-aling-right.svg',
            type: 'svg',
            alt: 'text aling right',
            isActive: () => editor.isActive({ textAlign: 'right' }),
            onClick: () => {
                editor.chain().focus().setTextAlign('right').run()
            }
        },
        {
            id: '',
            name: 'icon text align justify',
            class: 'button-img icon',
            src: '/icon-text-aling-justify.svg',
            type: 'svg',
            alt: 'text aling justify',
            isActive: () => editor.isActive({ textAlign: 'justify' }),
            onClick: () => {
                editor.chain().focus().setTextAlign('justify').run()
            }
        },
        {
            type: 'divider',
        },
        {
            type: 'file',
            getBase64: (event:any) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                        let base64 = reader.result;
                        editor.commands.setImage({
                            src: base64,
                            title: file.name,
                        })
                    };
                    reader.onerror = (error) => {
                        console.error('Error: ', error);
                    };
                }
            }
        },
        {
            id: '',
            name: 'icon add image',
            class: 'button-img icon',
            src: '/icon-add-image.svg',
            type: 'svg',
            alt: 'add image',
            onClick: () => {
                const inputFileEditor:any = document.getElementById('input-file-editor');
                inputFileEditor.click();
            }
        },
        {
            type: 'divider',
        },
        {
            id: '',
            name: 'icon insert table',
            class: 'button-img icon',
            src: '/icon-add-table.svg',
            type: 'svg',
            alt: 'insert table',
            isActive: () => editor.isActive('table'),
            onClick: () => {
                if (!editor.isActive('table')) {
                    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()               
                }
            }
        },
        {
            id: '',
            name: 'icon remove table',
            class: 'button-img icon',
            src: '/icon-table-remove.svg',
            type: 'svg',
            alt: 'remove table',
            isActive: () => !editor.isActive('table'),
            onClick: () => {
                editor.commands.deleteTable()
            }
        },
        {
            id: '',
            name: 'icon add column before',
            class: 'button-img icon',
            src: '/icon-add-column-before.svg',
            type: 'svg',
            alt: 'add column before',
            isActive: () => !editor.isActive('table'),
            onClick: () => {
                editor.commands.addColumnBefore()
            }
        },
        {
            id: '',
            name: 'icon add column after',
            class: 'button-img icon',
            src: '/icon-add-column-after.svg',
            type: 'svg',
            alt: 'add column after',
            isActive: () => !editor.isActive('table'),
            onClick: () => {
                editor.commands.addColumnAfter()
            }
        },
        {
            id: '',
            name: 'icon delete column',
            class: 'button-img icon',
            src: '/icon-column-remove.svg',
            type: 'svg',
            alt: 'delete column',
            isActive: () => !editor.isActive('table'),
            onClick: () => {
                editor.commands.deleteColumn()
            }
        },
        {
            id: '',
            name: 'icon add row before',
            class: 'button-img icon',
            src: '/icon-add-row-before.svg',
            type: 'svg',
            alt: 'add row before',
            isActive: () => !editor.isActive('table'),
            onClick: () => {
                editor.commands.addRowBefore()
            }
        },
        {
            id: '',
            name: 'icon add row after',
            class: 'button-img icon',
            src: '/icon-add-row-after.svg',
            type: 'svg',
            alt: 'add row after',
            isActive: () => !editor.isActive('table'),
            onClick: () => {
                editor.commands.addRowAfter()
            }
        },
        {
            id: '',
            name: 'icon row remove',
            class: 'button-img icon',
            src: '/icon-row-remove.svg',
            type: 'svg',
            alt: 'row remove',
            isActive: () => !editor.isActive('table'),
            onClick: () => {
                editor.commands.deleteRow()
            }
        },
        {
            id: '',
            name: 'icon table merge cells',
            class: 'button-img icon',
            src: '/icon-table-merge-cells.svg',
            type: 'svg',
            alt: 'table merge cells',
            isActive: () => !editor.isActive('table'),
            onClick: () => {
                editor.commands.mergeCells()
            }
        },
        {
            id: '',
            name: 'icon table split cell',
            class: 'button-img icon',
            src: '/icon-table-split-cell.svg',
            type: 'svg',
            alt: 'table split cells',
            isActive: () => !editor.isActive('table'),
            onClick: () => {
                editor.commands.splitCell()
            }
        },
        {
            id: '',
            name: 'icon table header column',
            class: 'button-img icon',
            src: '/icon-table-header-column.svg',
            type: 'svg',
            alt: 'table header column',
            isActive: () => !editor.isActive('table'),
            onClick: () => {
                editor.commands.toggleHeaderColumn()
            }
        },
        {
            id: '',
            name: 'icon table header row',
            class: 'button-img icon',
            src: '/icon-table-header-row.svg',
            type: 'svg',
            alt: 'table header row',
            isActive: () => !editor.isActive('table'),
            onClick: () => {
                editor.commands.toggleHeaderRow()
            }
        },
        {
            id: '',
            name: 'icon table header cell',
            class: 'button-img icon',
            src: '/icon-table-header-cell.svg',
            type: 'svg',
            alt: 'table header cell',
            isActive: () => !editor.isActive('table'),
            onClick: () => {
                editor.commands.toggleHeaderCell()
            }
        },
        {
            type: 'divider',
        },
        {
            type: 'color',
            value: editor.getAttributes('textStyle').color,
            getColor: (event:any) => {
                editor.commands.setColor(event.target.value)
            }
        },
        {
            id: '',
            name: 'icon add palette color',
            class: 'button-img icon',
            src: '/icon-add-palette-color.svg',
            type: 'svg',
            alt: 'add palette color',
            onClick: () => {
                const inputColorEditor:any = document.getElementById('input-color-editor');
                inputColorEditor.click();
            }
        },
        {
            id: '',
            name: 'icon remove palette color',
            class: 'button-img icon',
            src: '/icon-remove-palette-color.svg',
            type: 'svg',
            alt: 'remove palette color',
            isActive: () => !editor.isActive('textStyle'),
            onClick: () => {
                editor.commands.unsetColor();
            }
        },
        {
            type: 'divider',
        },
        {
            type: 'select',
            id:'',
            name:'',
            className: '',
            disabled: false,
            onChange: (event:any) => {
                editor.chain().focus().setFontFamily(event.target.value).run()
            },
            placeholder : 'Font Family',
            model : '',
            required : false,
            options : [
                {
                    value : 'Comic Sans MS, Comic Sans',
                    label :'Comic Sans MS, Comic Sans'
                },
                {
                    value : 'serif',
                    label :'serif'
                }
            ]
        },
        {
            id: '',
            name: 'icon remove fontfamily',
            class: 'button-img icon',
            src: '/icon-remove-fontfamily.svg',
            type: 'svg',
            alt: 'remove fontfamily',
            isActive: () => !editor.isActive('textStyle'),
            onClick: () => {
                editor.commands.unsetFontFamily()
            }
        }
    ]

}

function getSendDataEditor(data: any) {
    emits('sendDataEditor', data)
}


</script>
<style scoped src="./EditorText.molecule.scss"></style>