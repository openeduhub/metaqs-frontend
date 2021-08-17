import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetaWidgetComponent } from './meta-widget.component';

describe('MetaWidgetComponent', () => {
    let component: MetaWidgetComponent;
    let fixture: ComponentFixture<MetaWidgetComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MetaWidgetComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MetaWidgetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
