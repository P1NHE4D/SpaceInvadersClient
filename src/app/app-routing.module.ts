import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainMenuComponent} from "./components/main-menu/main-menu.component";
import {SingleplayerComponent} from "./components/singleplayer/singleplayer.component";
import {MultiplayerComponent} from "./components/multiplayer/multiplayer.component";


const routes: Routes = [
  { path: '', component: MainMenuComponent},
  { path: 'singleplayer', component: SingleplayerComponent},
  { path: 'multiplayer', component: MultiplayerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
