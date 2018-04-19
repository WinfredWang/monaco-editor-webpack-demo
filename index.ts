import * as monaco from 'monaco-editor';

self['MonacoEnvironment'] = {
    getWorkerUrl: function (moduleId, label) {
        if (label === 'json') {
            return './json.worker.bundle.js';
        }
        if (label === 'css') {
            return './css.worker.bundle.js';
        }
        if (label === 'html') {
            return './html.worker.bundle.js';
        }
        if (label === 'typescript' || label === 'javascript') {
            return './ts.worker.bundle.js';
        }
        return './editor.worker.bundle.js';
    }
}

export interface Item {
    uri: string;
    value: string;
    viewState?: any;
    language?: string
}
export interface Options {
    theme: string;
}
export class CodeEditor {
    private items: Item[];
    private container: HTMLElement;
    private editor: monaco.editor.IStandaloneCodeEditor;
    private options: Options;
    private activeItem: Item;
    constructor(items: Item | Item[], container: HTMLElement, options?: Options) {
        this.items = items instanceof Array ? items : [items];
        this.container = container;
        this.initOptions(options);
        this.create(this.items[0], container);
    }
    private initOptions(options) {
        let mergeOptions: Options = options ? Object.assign({}, options) : {};
        !mergeOptions.theme && (mergeOptions.theme = "vs");

        this.options = mergeOptions;
    }
    create(item: Item, dom: HTMLElement) {
        this.dispose();
        let editor = monaco.editor.create(dom, { theme: this.options.theme, folding: true, minimap: { enabled: true } });


        this.editor = editor;
        this.addModel(item);
    }
    addModel(item: Item) {
        let uri = monaco.Uri.parse(item.uri);
        let model = monaco.editor.getModel(uri);
        if (!model) {
            model = monaco.editor.createModel(item.value, item.language, uri);
            this.editor.setModel(model);
            this.activeItem = item;
        } else {
            throw new Error('Model exist, model : ' + item.uri)
        }
    }

    setModel(item: Item) {
        this.activeItem.viewState = this.editor.saveViewState();

        let uri = monaco.Uri.parse(item.uri);
        let model = monaco.editor.getModel(uri);
        this.editor.setModel(model);
        item.viewState && this.editor.restoreViewState(item.viewState);
        this.editor.focus();
    }
    getModel(uri: string) {
        return monaco.editor.getModel(monaco.Uri.parse(uri));
    }
    setReadOnly(readOnly) {
        this.editor.updateOptions({
            readOnly: readOnly === true ? true : false
        })
    }
    getItemByUri(uri: string) {
        for (let i = 0; i < this.items.length; i++) {
            let temp = this.items[i];
            if (temp.uri == uri) {
                return temp
            }
        }
    }
    dispose() {
        if (!this.editor) return;
        let models = monaco.editor.getModels();
        models && models.forEach(model => model.dispose());
        this.editor.dispose();
    }
    resize(width, height) {
        this.editor.layout({ width: width, height: height })
    }
}


// new CodeEditor({ uri: "xx.ts", value: "class Test {}", language: "typescript" },
//  document.getElementById("container"))