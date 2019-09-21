import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { SingleplayerComponent } from './components/singleplayer/singleplayer.component';
import { GameComponent } from './components/game/game.component';
import { MultiplayerComponent } from './components/multiplayer/multiplayer.component';
import { AircraftSelectionComponent } from './components/aircraft-selection/aircraft-selection.component';
import { HighscoreComponent } from './components/highscore/highscore.component';
import {FormsModule} from "@angular/forms";
import {AngularFontAwesomeModule} from "angular-font-awesome";

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    SingleplayerComponent,
    GameComponent,
    MultiplayerComponent,
    AircraftSelectionComponent,
    HighscoreComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
