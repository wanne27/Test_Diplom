import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ProjectsService } from 'src/app/shared/services/projects.service';
import { Project } from 'src/app/shared/models/Project';
import { Component, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-internships',
  templateUrl: './internships.component.html',
  styleUrls: ['./internships.component.scss'],
})
export class InternshipsComponent implements OnInit {
  activeProjects!: Project[];

  constructor(
    private projectsService: ProjectsService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.http
      .get(
        'https://recruitifyexadel.herokuapp.com/odata/Projects/GetShortProjects'
      )
      .pipe(map((d: any) => d.value))
      .subscribe((response) => {
        this.activeProjects = response.filter((project: any) => {
          return project.isActive;
        });
      });

    // this.projectsService
    //   .getProjects(<QueryParams>{ odata: { status } })
    //   .subscribe((response) => {
    //     console.log(response);
    //     this.activeProjects = response.filter((project) => project.isActive);
    //   });
  }

  getProjectDuration(start: string | Date, end: string | Date) {
    const startDate = dayjs(start);
    const endDate = dayjs(end);
    const diff = endDate.diff(startDate, 'week');
    return diff;
  }

  getNzCollapseTitle(skillName: string) {
    return `Requirements for ${skillName}`;
  }
}
