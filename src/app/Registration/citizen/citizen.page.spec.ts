import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CitizenPage } from './citizen.page';

describe('CitizenPage', () => {
  let component: CitizenPage;
  let fixture: ComponentFixture<CitizenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitizenPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CitizenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
