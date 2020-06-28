import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { UniverseComponent } from './universe/universe.component';
import { MenuComponent } from './menu/menu.component';
import { IconComponent } from './ui/icon/icon.component';
import { ButtonComponent } from './ui/button/button.component';

@NgModule({
  declarations: [
    AppComponent,
    UniverseComponent,
    MenuComponent,
    IconComponent,
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
