class TextDocument {
    private _locked: boolean = false;
    private _name: string = "Untitled Document";
    readonly time_created: Date = new Date(Date.now());
    private _text: string = "";
    private _history: TextDocumentChange[] = [];

    constructor(name?: string, time_created?: Date) {
        if (name !== undefined)
            this.name = name;
        if (time_created !== undefined)
            this.time_created = time_created;
    }

    get locked() {
        return this._locked;
    }

    get name() {
        return this._name;
    }

    set name(name: string) {
        if (!this.locked)
            this._name = name;
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

    change(indices: [number, number], new_text: string, time?: Date): boolean { // takes in info for a change, does the change, and documents it
        if (this.locked)
            return false;
        this._locked = true;
        if (indices[0] == this.length)
            this._text += new_text; // |0|1|2|3| + new@(4, 8)
        else if (indices[0] > this.length)
            this._text += " ".repeat(indices[0]-this.length) + new_text; // |0|1|2|3| + "  "(len=2) + new@(6, 10)
        else
            this._text = this.text.substring(0, indices[0]) + new_text + this.text.substring(indices[1]+1); // |0| + new@(1, 3) + |3|
        this._history.push(new TextDocumentChange(indices, new_text, this, time));
        this._locked = false;
        return true;
    }

    revertOnce(): boolean { // reverts to last documented change, returns true if last change exists and false if last change doesn't
        let last_change = this.last_change;
        if (last_change === undefined || this.locked)
            return false;
        this._locked = true;
        if (last_change.indices[1] == this.length)
            this._text = this.text.substring(0, last_change.indices[0]);
        else
            this._text = this.text.substring(0, last_change.indices[0]) + last_change.original_text + this.text.substring(last_change.indices[1]);
        this._history.pop();
        this._locked = false;
        return true;
    }

    revert(times: number): number { // does revert_once {times} number of times, returns number of times reverted (or until revert_once == false)
        for (var i=0; i<times && this.revertOnce(); ++i);
        return i;
    }
}

class TextDocumentChange {
    readonly time: Date = new Date(Date.now());
    readonly indices: [number, number];
    readonly original_text: string | null = null; // original text, to document any text that the new text writes over. if the indices are outside original string, then null
    readonly new_text: string;

    constructor(indices: [number, number], new_text: string, document: TextDocument, time?: Date) {
        if (time !== undefined)
            this.time = time;
        if (indices[0] < document.length && indices[1] <= document.length)
            this.original_text = document.text.substring(indices[0], indices[1]);
        this.indices = indices;
        this.new_text = new_text;
    }
}

export { TextDocument, TextDocumentChange };
