import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { paths } from 'src/app/app-routing.constants';

@Component({
  templateUrl: './four-o-four.component.html',
  styleUrls: ['./four-o-four.component.scss'],
})
export class FourOFourComponent implements OnInit {
  constructor(private router: Router) {}
  handleClick() {
    this.router.navigate([paths.projects]);
  }
  ngOnInit(): void {}
}
