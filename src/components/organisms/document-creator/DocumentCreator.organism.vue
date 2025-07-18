<!-- 
        Developed by: Andres Diaz - @diazcc
        TODO:    PLEASE, BEFORE MODIFY THIS DOCUMENT, ASK FOR DEVELEPER


    dataDocumentCreator:{
        setDataPage:()=>{},
    }
    and get value array content pages 

-->
<template>
    <section class="document-creator">
        <ul class="document-creator__header">
            <template v-for="action in arrayActions.actions">
                <li v-if="action.type === 'divider'" class="document-creator__header__divider"></li>
                <ImgAtom v-if="action.type === 'svg' || action.type === 'png'" :dataImg="action"
                    class="document-creator__header__icon" />
                <input v-if="action.type === 'color'" id="input-color-editor" class="document-creator__header__input"
                    type="color" @input="action.getColor" :value="action.value">
                <input v-if="action.type === 'file'" id="input-file-editor" class="document-creator__header__input"
                    type="file" accept="image/png, image/jpeg, image/jpg" @change="action.getBase64">
                <SelectAtom v-if="action.type === 'select'" :dataSelect="action" />
                <PopupMenuMolecule v-if="action.type === 'menu'" :dataPopupMenu="action"
                    @optionSelected="getOptionSelected" />
            </template>
        </ul>
        <div class="document-creator__body">
            <nav
                :class="'document-creator__body__pages-list document-creator__body__pages-list--' + (statePagesList && 'active')">

                <ul class="document-creator__body__pages-list__container">
                    <li class="document-creator__body__pages-list__container__page" v-for="(page, index) in pages"
                        @click="scrollToPage(index + 1)">
                        {{ index + 1 }}
                    </li>

                </ul>
                <a class="document-creator__body__pages-list__close" @click="validateOpenPagesLists">
                    <img src="/icon-list.svg">
                </a>
            </nav>
            <article class="document-creator__body__container">
                <section class="document-creator__body__container__page" v-for="(page, index) in pages"
                    :key="page.page">
                    <DocumentCreatorPageMolecule @sendDataEditor="getSendDataEditor" :dataDocumentCreatorPage="page"
                        @getDataBodyPage="selectPage(index, $event)" />
                    <nav class="document-creator__body__container__page__direct-action-page">
                        <button
                            class="document-creator__body__container__page__direct-action-page__action document-creator__body__container__page__direct-action-page__action-delete"
                            v-if="index > 0" @click="deletePage(index)">
                            x
                        </button>
                        <button
                            class="document-creator__body__container__page__direct-action-page__action document-creator__body__container__page__direct-action-page__action-add"
                            @click="addNewPage">
                            +
                        </button>
                    </nav>
                </section>
            </article>

        </div>

    </section>
</template>
<script setup lang="ts">
import { reactive, ref, Ref } from 'vue';
import Editor from '../../atoms/editor-text/EditorText.atom.vue';
import ImgAtom from '../../atoms/img/Img.atom.vue';
import SelectAtom from '../../atoms/select/Select.atom.vue';
import DocumentCreatorPageMolecule from '../../molecules/document-creator-page/DocumentCreatorPage.molecule.vue';
import { nextTick } from 'vue';
import PopupMenuMolecule from '../../molecules/popup-menu/PopupMenu.molecule.vue';
const currentPage = ref<number>(0);
const currentEditor = ref<any>(null);
const statePagesList: Ref<boolean> = ref(false);
let validatorPosition: number = 0;
const dataPopupMenu: any = reactive({
    title: '',
    icon: '',
    options: [
        {
            name: '',
            icon: '',
            state: false,
            setOption: () => { }
        },
    ]
});
const pages: Ref<any[]> = ref([{
    page: 1,
    dataDocumentCreatorPageBody: {
        dataEditor: {
            setData: () => { },
            content: ''
        },
    },
    actions: []

}])
const arrayActions: any = reactive({
    actions: []
})

const props = defineProps(['dataDocumentCreator']);
const emits = defineEmits(['sendDataEditor'])
props.dataDocumentCreator.setDataPage = () => {
    pages.value.map((response: any) => { //This is called for them index position, be care move this structure, this is called
        response.dataDocumentCreatorPageBody.dataEditor.setData();
    });
}
function getSendDataEditor(data: any) {
    pages.value[validatorPosition].dataDocumentCreatorPageBody.dataEditor.content = data;
    validatorPosition++;
    if (validatorPosition == pages.value.length) {
        emits('sendDataEditor', pages.value);
        validatorPosition = 0;
    }
}

function addNewPage() {

    const newPage = {
        page: pages.value[pages.value.length - 1].page + 1,
        dataDocumentCreatorPageBody: {
            dataEditor: {
                setData: () => { },
                content: '',
                id: pages.value[pages.value.length]?.page + 1,
            },
        }
    };
    pages.value.push(newPage);
    scrollToLastPage();

}
function deletePage(index: number) {
    pages.value.splice(index, 1)

}

function selectPage(index: number, editor: any): void {
    currentPage.value = index;
    currentEditor.value = editor;
    updateActions(editor);
}
async function scrollToLastPage() {
    await nextTick(() => {
        setTimeout(async () => {
            const element = await document.getElementById('document-creator-page-' + (pages.value.length));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            } else {

            }

        }, 300);
    });

}
async function scrollToPage(pageNumber: any) {
    await nextTick(() => {
        const element = document.getElementById('document-creator-page-' + pageNumber);
        if (element) {
            element.scrollIntoView();
        } else {
        }
    });
}
function getOptionSelected(option: string) {
}


function validateOpenPagesLists() {
    statePagesList.value = !statePagesList.value;
}

function updateActions(editor: any): void {
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
            type: 'menu',
            icon: '/icon-bullet-list.svg',
            options: [
                {
                    icon: '/icon-bullet-list.svg',
                    state: editor.isActive('bulletList'),
                    setOption: () => {
                        editor.chain().focus().toggleBulletList().run()
                    }
                },
                {
                    icon: '/icon-ordered-list.svg',
                    state: editor.isActive('orderedList'),
                    setOption: () => {
                        editor.chain().focus().toggleOrderedList().run()
                    }
                },
            ]
        },
        {
            type: 'menu',
            icon: '/icon-text-aling-left.svg',
            options: [
                {
                    icon: '/icon-text-aling-left.svg',
                    state: editor.isActive({ textAlign: 'left' }),
                    setOption: () => {
                        editor.chain().focus().setTextAlign('left').run()
                    }
                },
                {
                    icon: '/icon-text-aling-center.svg',
                    state: editor.isActive({ textAlign: 'center' }),
                    setOption: () => {
                        editor.chain().focus().setTextAlign('center').run()
                    }
                },
                {
                    icon: '/icon-text-aling-right.svg',
                    state: editor.isActive({ textAlign: 'right' }),
                    setOption: () => {
                        editor.chain().focus().setTextAlign('right').run()
                    }
                },
                {
                    icon: '/icon-text-aling-justify.svg',
                    state: editor.isActive({ textAlign: 'justify' }),
                    setOption: () => {
                        editor.chain().focus().setTextAlign('justify').run()
                    }
                },
            ]
        },
        {
            type: 'divider',
        },
        {
            type: 'menu',
            icon: '/font-size.svg',
            options: [
                {
                    icon: '/icon-heading1.svg',
                    state: editor.isActive('heading', { level: 1 }),
                    setOption: () => {
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                },
                {
                    icon: '/icon-heading1.svg',
                    state: editor.isActive('heading', { level: 2 }),
                    setOption: () => {
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                },
                {
                    icon: '/icon-heading3.svg',
                    state: editor.isActive('heading', { level: 3 }),
                    setOption: () => {
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                },
            ]
        },
        {
            type: 'color',
            value: editor.getAttributes('textStyle').color,
            getColor: (event: any) => {
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
                const inputColorEditor: any = document.getElementById('input-color-editor');
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
            onClick: () => editor.chain().focus().setHorizontalRule().run()
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
            type: 'file',
            getBase64: (event: any) => {
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
                        console.log('Error: ', error);
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
                const inputFileEditor: any = document.getElementById('input-file-editor');
                inputFileEditor.click();
            }
        },
        {
            type: 'divider',
        },
        {
            type: 'menu',
            icon: '/icon-add-table.svg',
            options: [
                {
                    icon: '/icon-add-table.svg',
                    state: editor.isActive('table'),
                    setOption: () => {
                        if (!editor.isActive('table')) {
                            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
                        }
                    }
                },
                {
                    icon: '/icon-table-remove.svg',
                    state: !editor.isActive('table'),
                    setOption: () => {
                        editor.commands.deleteTable();
                    }
                },
                {
                    icon: '/icon-add-column-before.svg',
                    state: !editor.isActive('table'),
                    setOption: () => {
                        editor.commands.addColumnBefore();
                    }
                },
                {
                    icon: '/icon-add-column-after.svg',
                    state: !editor.isActive('table'),
                    setOption: () => {
                        editor.commands.addColumnAfter();
                    }
                },
                {
                    icon: '/icon-column-remove.svg',
                    state: !editor.isActive('table'),
                    setOption: () => {
                        editor.commands.deleteColumn();
                    }
                },
                {
                    icon: '/icon-add-row-before.svg',
                    state: !editor.isActive('table'),
                    setOption: () => {
                        editor.commands.addRowBefore();
                    }
                },
                {
                    icon: '/icon-add-row-after.svg',
                    state: !editor.isActive('table'),
                    setOption: () => {
                        editor.commands.addRowAfter();
                    }
                },
                {
                    icon: '/icon-row-remove.svg',
                    state: !editor.isActive('table'),
                    setOption: () => {
                        editor.commands.deleteRow();
                    }
                },
                {
                    icon: '/icon-table-merge-cells.svg',
                    state: !editor.isActive('table'),
                    setOption: () => {
                        editor.commands.mergeCells();
                    }
                },
                {
                    icon: '/icon-table-split-cell.svg',
                    state: !editor.isActive('table'),
                    setOption: () => {
                        editor.commands.splitCell();
                    }
                },
                {
                    icon: '/icon-table-header-column.svg',
                    state: !editor.isActive('table'),
                    setOption: () => {
                        editor.commands.toggleHeaderColumn();
                    }
                },
                {
                    icon: '/icon-table-header-row.svg',
                    state: !editor.isActive('table'),
                    setOption: () => {
                        editor.commands.toggleHeaderRow();
                    }
                },
                {
                    icon: '/icon-table-header-cell.svg',
                    state: !editor.isActive('table'),
                    setOption: () => {
                        editor.commands.toggleHeaderCell();
                    }
                }
            ]
        }
        ,
        {
            type: 'divider',
        },
        
        {
            type: 'select',
            id: '',
            name: '',
            className: '',
            disabled: false,
            onChange: (event: any) => {
                editor.chain().focus().setFontFamily(event.target.value).run()
            },
            placeholder: 'Font Family',
            model: '',
            required: false,
            options: [
                {
                    value: 'Comic Sans MS, Comic Sans',
                    label: 'Comic Sans MS, Comic Sans'
                },
                {
                    value: 'serif',
                    label: 'serif'
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
        },

    ]

}




</script>
<style scoped src="./DocumentCreator.organism.scss"></style>