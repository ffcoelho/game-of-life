import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { UniverseComponent } from './universe/universe.component';
import { MenuComponent } from './ui/menu/menu.component';
import { IconComponent } from './ui/icon/icon.component';
import { InputComponent } from './ui/input/input.component';
import { ButtonComponent } from './ui/button/button.component';
import { ModalComponent } from './ui/modal/modal.component';
import { PopupComponent } from './ui/popup/popup.component';
import { StartScreenComponent } from './start-screen/start-screen.component';

@NgModule({
  declarations: [
    AppComponent,
    UniverseComponent,
    MenuComponent,
    IconComponent,
    InputComponent,
    ButtonComponent,
    ModalComponent,
    PopupComponent,
    StartScreenComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
