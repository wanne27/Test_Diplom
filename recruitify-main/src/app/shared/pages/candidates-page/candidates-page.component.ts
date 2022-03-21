import { CandidatesFilters } from './candidates-table/candidates-table.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Candidate } from './../../models/Candidate';
import { CandidatesPageFacade } from './candidates-page.facade';
import { CandidatesTableFilters } from './filter-drawer/filter-drawer.component';
import { PrimarySkill } from '../../models/Project';

export interface candidatesQueries extends CandidatesFilters {
  id?: string;
  query?: string;
  location?: string[];
  date?: (string | Date)[];
  englishLevel?: string[];
  primarySkill?: PrimarySkill[];
  status?: string[];
  test?: number[];
  recruiter?: number[];
  entryInterview?: number[];
  mentor?: number[];
  finalInterview?: number[];
}
@Component({
  selector: 'app-candidates-page',
  templateUrl: './candidates-page.component.html',
  styleUrls: ['./candidates-page.component.scss'],
})
export class CandidatesPageComponent implements OnInit {
  searchValue = '';
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  drawerVisible = false;
  menuVisible = true;
  isLoading = false;

  filters: any = {};

  candidatesList: Candidate[] = [];
  currentProjectId = '';
  currentProjectName: string = '';

  isRecruiter: boolean = this.candidatesPageFacade.isRecruiter;

  constructor(
    public candidatesPageFacade: CandidatesPageFacade,
    private route: ActivatedRoute,
    private router: Router,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.currentProjectId = params.id;
      if (params.id) {
        this.isLoading = true;
        this.candidatesPageFacade.getAllCandidates(<candidatesQueries>{
          id: params.id,
        });
        this.candidatesPageFacade.candidatesList$.subscribe((response) => {
          this.candidatesList = response;
          this.isLoading = false;
        });
        // TODO use new endpoint to get project name
        this.candidatesPageFacade
          .getProjectData$(params.id)
          .subscribe((project) => {
            this.currentProjectName = project.name;
          });
      } else {
        this.isLoading = true;
        // this.router.navigate([paths.fof]);
        // this.message.error('Project not found!');
        this.candidatesPageFacade.candidatesList$.subscribe((response) => {
          this.candidatesList = response;
          this.isLoading = false;
        });
      }
    });
  }

  openDrawer(): void {
    this.drawerVisible = !this.drawerVisible;
  }

  applyCandidatesFilters(filters: candidatesQueries) {
    this.filters = { ...this.filters, ...filters, id: this.currentProjectId };
    this.candidatesPageFacade.getAllCandidates(this.filters);
  }

  showFiltersResults(drawerFilters: candidatesQueries) {
    this.filters = {
      ...this.filters,
      location: drawerFilters.location,
      date: drawerFilters.date,
      englishLevel: drawerFilters.englishLevel,
      primarySkill: drawerFilters.primarySkill,
      status: drawerFilters.status,
      test: drawerFilters.test,
      recruiter: drawerFilters.recruiter,
      entryInterview: drawerFilters.entryInterview,
      mentor: drawerFilters.mentor,
      finalInterview: drawerFilters.finalInterview,
    };
    this.candidatesPageFacade.getAllCandidates(this.filters);
  }

  onSearchChange(search: candidatesQueries) {
    this.filters = { ...this.filters, query: search };
    this.candidatesPageFacade.getAllCandidates(this.filters);
  }

  onSearchClear() {
    this.searchValue = '';
    this.filters = { ...this.filters, query: this.searchValue };
    this.candidatesPageFacade.getAllCandidates(this.filters);
  }
}
