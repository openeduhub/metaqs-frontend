import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeEntryComponent } from './node-entry.component';

describe('NodeEntryComponent', () => {
    let component: NodeEntryComponent;
    let fixture: ComponentFixture<NodeEntryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NodeEntryComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NodeEntryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
