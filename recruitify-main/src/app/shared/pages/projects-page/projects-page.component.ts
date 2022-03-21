import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Project } from '../../models/Project';
import { ProjectsFilters } from './project-filters/project-filters.component';
import { ProjectsPageFacade } from './projects-page.facade';

export interface ProjectsQueries extends ProjectsFilters {
  query?: string;
}

@Component({
  selector: 'app-projects-page',
  templateUrl: './projects-page.component.html',
  styleUrls: ['./projects-page.component.scss'],
})
export class ProjectsPageComponent implements OnInit {
  isLoading = false;
  isFiltersVisible: boolean = false;
  searchText: string = '';
  filters: any = {};
  subscription: Subscription | null = null;

  isAdmin: boolean = this.userService.isAdmin();

  constructor(
    public projectsPageFacade: ProjectsPageFacade,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.projectsPageFacade.getProjectsList();
    this.subscription = this.projectsPageFacade.projectListLoading$.subscribe(
      (value) => {
        this.isLoading = value;
      }
    );
  }

  toggleFiltersVisible(isVisible: boolean) {
    this.isFiltersVisible = isVisible;
  }

  handleToggle(isVisible: boolean): void {
    this.projectsPageFacade.toggleCreateProjectDrawer$.next(isVisible);
  }

  applyProjectsFilters(filters: ProjectsFilters) {
    this.filters = { ...this.filters, ...filters };
    this.projectsPageFacade.getProjectsList(this.filters);
  }

  onSearchChange(search: ProjectsQueries) {
    this.filters = { ...this.filters, query: search };
    this.projectsPageFacade.getProjectsList(this.filters);
  }
  onProjectListChange() {
    this.projectsPageFacade.getProjectsList(this.filters);
  }

  onSearchClear() {
    this.searchText = '';
    this.filters = { ...this.filters, query: this.searchText };
    this.projectsPageFacade.getProjectsList(this.filters);
  }
}
