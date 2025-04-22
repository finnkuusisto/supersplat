import { Container, Element, Label } from 'pcui';

import { Events } from '../events';
import { SplatList } from './splat-list';
import sceneImportSvg from './svg/import.svg';
import sceneNewSvg from './svg/new.svg';
import { Tooltips } from './tooltips';

const createSvg = (svgString: string) => {
    const decodedStr = decodeURIComponent(svgString.substring('data:image/svg+xml,'.length));
    return new DOMParser().parseFromString(decodedStr, 'image/svg+xml').documentElement;
};

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

        const metaDataContainer = new Container({
            class: 'meta-data-container',
            height: 100
        });

        this.append(sceneHeader);
        this.append(metaDataContainer);
        this.append(new Element({
            class: 'panel-header',
            height: 20
        }));
    }
}

export { MetaPanel };
