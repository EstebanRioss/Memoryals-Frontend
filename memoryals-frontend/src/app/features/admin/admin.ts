import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Aside } from './aside/aside';

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, RouterModule, CommonModule, Aside],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class Admin {

}
