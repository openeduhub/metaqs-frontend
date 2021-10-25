import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetaScoreComponent } from './meta-score.component';

describe('MetaScoreComponent', () => {
  let component: MetaScoreComponent;
  let fixture: ComponentFixture<MetaScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetaScoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetaScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
