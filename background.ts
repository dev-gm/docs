class TextDocument {
    name: string = "Untitled Document";
    readonly time_created: Date = new Date(Date.now());
    private _text: string = "";
    private _history: TextDocumentChange[] = [];

    constructor(name?: string, time_created?: Date) {
        if (name !== undefined) this.name = name;
        if (time_created !== undefined) this.time_created = time_created;
    }

    get text() {
        return this._text;
    }

    get length() {
        return this.text.length;
    }

    get history() {
        return this._history;
    }

    get last_change() {
        if (this.history.length == 0) return undefined;
        return this.history[this.history.length-1];
    }

    change(indices: [number, number], new_text: string, time?: Date) {
        if (indices[0] == this.length) this._text += new_text;
        else if (indices[0] > this.length) this._text += " ".repeat(indices[0]-this.length) + new_text;
        else this._text = this.text.substring(0, indices[0]) + new_text + this.text.substring(indices[1]+1);
        this._history.push(new TextDocumentChange(indices, new_text, time));
    }

    revert_once(): boolean {
        let last_change = this.last_change;
        if (last_change === undefined)
            return false;
        if (last_change.indices[1] == this.length) this._text = this.text.substring(0, last_change.indices[0]);
        else this._text = this.text.substring(0, last_change.indices[0]) + this.text.substring(last_change.indices[1]);
        this._history.pop();
        return true;
    }
}

class TextDocumentChange {
    readonly time: Date = new Date(Date.now());
    readonly indices: [number, number];
    readonly new_text: string;

    constructor(indices: [number, number], new_text: string, time?: Date) {
        if (time !== undefined) this.time = time;
        this.indices = indices;
        this.new_text = new_text;
    }
}
