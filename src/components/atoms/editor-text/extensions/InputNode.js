import { Node, mergeAttributes } from '@tiptap/core';

export const InputNode = Node.create({
    name: 'input',

    group: 'inline',

    inline: true,

    atom: true,

    draggable: false,

    isolating: true,

    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },

    addAttributes() {
        return {
            type: {
                default: 'text',
                parseHTML: element => element.getAttribute('type'),
            },
            class: {
                default: 'input input-sm input-bordered', // Clases CSS por defecto
            },
            value: {
                default: '', // Valor por defecto
                parseHTML: element => element.getAttribute('value'),
            },
            placeholder: {
                default: 'Enter value...', // Placeholder por defecto
                parseHTML: element => element.getAttribute('placeholder'),
            },
            id: {
                default: '', // ID por defecto
                parseHTML: element => element.getAttribute('id'),
            },
        };
    },

    parseHTML() {
        return [
            { tag: 'input' },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['input', mergeAttributes(HTMLAttributes)];
    },

    addCommands() {
        return {
            insertInput: (attrs) => ({ commands }) => {
                return commands.insertContent({
                    type: this.name,
                    attrs: {
                        ...attrs, // Atributos que puedes pasar dinámicamente
                    },
                });
            },
        };
    },
});

export default InputNode;
