import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { UniverseComponent } from './universe/universe.component';
import { MenuComponent } from './ui/menu/menu.component';
import { IconComponent } from './ui/icon/icon.component';
import { InputComponent } from './ui/input/input.component';
import { ButtonComponent } from './ui/button/button.component';

@NgModule({
  declarations: [
    AppComponent,
    UniverseComponent,
    MenuComponent,
    IconComponent,
    InputComponent,
    ButtonComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
