import { Component, OnInit } from '@angular/core';
import {LoaderService} from "../../services/loader.service";

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {


  private status: string = 'None';

  constructor() {
  }

  ngOnInit() {

  }

}
