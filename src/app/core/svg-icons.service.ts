import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

declare let require: (path: string) => string;

const ICONS = [
    'child',
    'tree',
    'types/audio',
    'types/exercise',
    'types/image',
    'types/lesson_planning',
    'types/total',
    'types/video',
    'types/worksheet',
];


@Injectable({ providedIn: 'root' })
export class SvgIconsService {
    private initialized = false;

    constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {}

    init(): void {
        if (this.initialized) {
            return;
        }
        for (const icon of ICONS) {
            this.matIconRegistry.addSvgIconLiteral(
                icon,
                this.domSanitizer.bypassSecurityTrustHtml(
                    require('!svg-inline-loader?classPrefix!src/assets/svg/' + icon + '.svg'),
                ),
            );
        }
        this.initialized = true;
    }
}
