import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RoutineSafetyPage } from './routine-safety.page';

describe('RoutineSafetyPage', () => {
  let component: RoutineSafetyPage;
  let fixture: ComponentFixture<RoutineSafetyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutineSafetyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RoutineSafetyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
