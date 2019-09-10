import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainMenuComponent} from "./components/main-menu/main-menu.component";
import {SingleplayerComponent} from "./components/singleplayer/singleplayer.component";


const routes: Routes = [
  { path: '', component: MainMenuComponent},
  { path: 'singleplayer', component: SingleplayerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
