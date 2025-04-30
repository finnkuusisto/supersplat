import { Container, Label, Element as PcuiElement } from 'pcui';

import { Element, ElementType } from '../element';
import { Events } from '../events';
import { Splat } from 'src/splat';


class MetadataItem extends Container {
    getName: () => string;
    setName: (value: string) => void;
    getSelected: () => boolean;
    setSelected: (value: boolean) => void;
    destroy: () => void;

    constructor(splat: Splat, args = {}) {
        args = {
            ...args,
            class: ['metadata-item', 'visible']
        };

        super(args);

        const text = new Label({
            class: 'metadata-item-text',
            text: splat.name
        });

        // check for metadata comments
        const comments = splat.asset._resources[0].comments;
        for (let i = 0; i < comments.length; i++) {
            const cmt = comments[i];
            if (cmt.startsWith("METADATA ")) {
                const mdata = JSON.parse(cmt.slice(9));
                text.value = JSON.stringify(mdata);
                break;
            }
        }

        this.append(text);

        this.getName = () => {
            return text.value;
        };

        this.setName = (value: string) => {
            text.value = value;
        };

        this.getSelected = () => {
            return this.class.contains('selected');
        };

        this.setSelected = (value: boolean) => {
            if (value !== this.selected) {
                if (value) {
                    this.class.add('selected');
                    this.emit('select', this);
                } else {
                    this.class.remove('selected');
                    this.emit('unselect', this);
                }
            }
        };

    }

    set name(value: string) {
        this.setName(value);
    }

    get name() {
        return this.getName();
    }

    set selected(value) {
        this.setSelected(value);
    }

    get selected() {
        return this.getSelected();
    }

}

class MetadataList extends Container {
    constructor(events: Events, args = {}) {
        args = {
            ...args,
            class: 'metadata-list'
        };

        super(args);

        const items = new Map<Splat, MetadataItem>();

        events.on('scene.elementAdded', (element: Element) => {
            if (element.type === ElementType.splat) {
                const splat = element as Splat;
                const item = new MetadataItem(splat);
                this.append(item);
                items.set(splat, item);
            }
        });

        events.on('scene.elementRemoved', (element: Element) => {
            if (element.type === ElementType.splat) {
                const splat = element as Splat;
                const item = items.get(splat);
                if (item) {
                    this.remove(item);
                    items.delete(splat);
                }
            }
        });

        events.on('selection.changed', (selection: Splat) => {
            items.forEach((value, key) => {
                value.selected = key === selection;
            });
        });

        events.on('splat.name', (splat: Splat) => {
            const item = items.get(splat);
            if (item) {
                item.name = splat.name;
            }
        });

    }

    protected _onAppendChild(element: PcuiElement): void {
        super._onAppendChild(element);

        if (element instanceof MetadataItem) {
            element.on('click', () => {
                this.emit('click', element);
            });

        }
    }

    protected _onRemoveChild(element: PcuiElement): void {
        if (element instanceof MetadataItem) {
            element.unbind('click');
            element.unbind('removeClicked');
        }

        super._onRemoveChild(element);
    }
}

export { MetadataList, MetadataItem };
