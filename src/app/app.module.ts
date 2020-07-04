import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { UniverseComponent } from './universe/universe.component';
import { MenuComponent } from './ui/menu/menu.component';
import { PatternsComponent } from './patterns/patterns.component';
import { IconComponent } from './ui/icon/icon.component';
import { InputComponent } from './ui/input/input.component';
import { ButtonComponent } from './ui/button/button.component';
import { ModalComponent } from './ui/modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    UniverseComponent,
    PatternsComponent,
    MenuComponent,
    IconComponent,
    InputComponent,
    ButtonComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
