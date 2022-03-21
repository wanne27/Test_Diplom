import { Component, OnInit, Input } from '@angular/core';
import { Project } from 'src/app/shared/models/Project';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss'],
})
export class ProjectsListComponent implements OnInit {
  @Input() projects: Project[] | null = [];
  @Input() loading: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
