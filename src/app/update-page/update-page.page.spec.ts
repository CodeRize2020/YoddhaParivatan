import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UpdatePagePage } from './update-page.page';

describe('UpdatePagePage', () => {
  let component: UpdatePagePage;
  let fixture: ComponentFixture<UpdatePagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatePagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdatePagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
