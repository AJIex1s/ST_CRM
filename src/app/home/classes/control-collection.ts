import { ComponentRef } from "@angular/core";
import { ControlComponentBase } from "./control-component";

export class ControlComponentRefCollection {
    private items: ComponentRef<ControlComponentBase>[];
    constructor() {
        this.items = [];
    }
    add(item: ComponentRef<ControlComponentBase>) {
        this.items.push(item);
    }
    remove(item: ComponentRef<ControlComponentBase>) {
        let index = this.items.indexOf(item);
        if (index > -1)
            this.items.splice(index, 1);
        item.destroy();
    }
    removeAt(index: number) {
        let item: ComponentRef<ControlComponentBase>;
        let items: ComponentRef<ControlComponentBase>[];
        if (index > -1) {
            items = this.items.splice(index, 1);
            item = items.length > 0 ? item[0] : null;
        }
        if (item)
            item.destroy();
    }
    insertAt(item: ComponentRef<ControlComponentBase>, index: number) {
        this.items.splice(index, 0, item);
    }
    forEach(proc: (item: ComponentRef<ControlComponentBase>) => void) {
        this.items.forEach(item => proc(item));
    }
    get(index: number) {
        return this.items[index];
    }
}