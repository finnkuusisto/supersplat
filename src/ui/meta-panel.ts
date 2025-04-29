import { Container, Element, Label } from 'pcui';

import { Events } from '../events';
import { MetadataList } from './metadata-list';
import { Tooltips } from './tooltips';

class MetaPanel extends Container {
    constructor(events: Events, tooltips: Tooltips, args = {}) {
        args = {
            ...args,
            id: 'meta-panel',
            class: 'panel'
        };

        super(args);

        // stop pointer events bubbling
        ['pointerdown', 'pointerup', 'pointermove', 'wheel', 'dblclick'].forEach((eventName) => {
            this.dom.addEventListener(eventName, (event: Event) => event.stopPropagation());
        });

        const sceneHeader = new Container({
            class: 'panel-header'
        });

        const sceneIcon = new Label({
            text: '🛈',
            class: 'panel-header-icon'
        });

        const sceneLabel = new Label({
            text: 'Metadata Panel',
            class: 'panel-header-label'
        });

        sceneHeader.append(sceneIcon);
        sceneHeader.append(sceneLabel);

        const metadataList = new MetadataList(events);
        const metadataContainer = new Container({
            class: 'metadata-container'
        });
        metadataContainer.append(metadataList);

        this.append(sceneHeader);
        this.append(metadataContainer);
        this.append(new Element({
            class: 'panel-header',
            height: 20
        }));
    }
}

export { MetaPanel };
