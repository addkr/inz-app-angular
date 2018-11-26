import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NursePanelComponent } from './nurse-panel.component';

describe('NursePanelComponent', () => {
  let component: NursePanelComponent;
  let fixture: ComponentFixture<NursePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NursePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NursePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
