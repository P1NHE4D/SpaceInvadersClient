import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { SingleplayerComponent } from './components/singleplayer/singleplayer.component';
import { GameComponent } from './components/game/game.component';
import { MultiplayerComponent } from './components/multiplayer/multiplayer.component';

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    SingleplayerComponent,
    GameComponent,
    MultiplayerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
