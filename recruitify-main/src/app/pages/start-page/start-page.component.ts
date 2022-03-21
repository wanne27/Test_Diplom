import { paths } from 'src/app/app-routing.constants';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss'],
})
export class StartPageComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  goToInternships() {
    this.router.navigate([paths.internships]);
  }
}
