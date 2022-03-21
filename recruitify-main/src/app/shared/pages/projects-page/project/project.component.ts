import { UserService } from './../../../services/user.service';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { paths } from 'src/app/app-routing.constants';
import { Project } from 'src/app/shared/models/Project';
import { ProjectsPageFacade } from '../projects-page.facade';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
  @Input() card!: Project;

  isVisible = false;

  isAdmin: boolean = this.userService.isAdmin();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectsFacade: ProjectsPageFacade,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // console.log(this.card);
  }

  showCandidates() {
    this.router.navigate([paths.candidates]);
  }
  switchStaff() {
    this.isVisible = !this.isVisible;
  }
  onEdit() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        editingId: this.card.id,
      },
      queryParamsHandling: 'merge',
    });
    this.projectsFacade.toggleCreateProjectDrawer$.next(true);
    this.projectsFacade.projectDetails$.next(this.card);
  }
}
