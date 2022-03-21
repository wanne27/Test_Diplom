import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { paths } from 'src/app/app-routing.constants';
import { Candidate } from './../../../models/Candidate';
import { CandidatesPageFacade } from './../candidates-page.facade';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

export interface CandidatesOrderBy {
  property: string;
  order: string;
}
export interface CandidatesFilters {
  orderBy?: CandidatesOrderBy[];
}
@Component({
  selector: 'app-candidates-table',
  templateUrl: './candidates-table.component.html',
  styleUrls: ['./candidates-table.component.scss'],
})
export class CandidatesTableComponent implements OnInit {
  @Input() candidatesList!: Candidate[];
  @Input() currentProjectId!: string;
  @Input() isLoading: boolean = false;

  @Output() onFilters: EventEmitter<CandidatesFilters> =
    new EventEmitter<CandidatesFilters>();

  paths = paths;
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  candidateStatuses: string[] = [];
  feedbackTypes: string[] = [];

  constructor(private candidatesPageFacade: CandidatesPageFacade) {
    this.candidateStatuses = this.candidatesPageFacade.candidateStatuses;
    this.feedbackTypes = this.candidatesPageFacade.feedbackTypes;
  }

  ngOnInit(): void {}

  // TODO chande feedback model.
  getFeedbackRate(candidate: Candidate, feedbackType: string) {
    if (this.currentProjectId) {
      const candidateProjectResults = candidate.projectResults.find(
        (project) => project.projectId === this.currentProjectId
      );

      const feedback = candidateProjectResults?.feedbacks.find(
        (feedback) => feedback.type === (feedbackType as any)
      );
      return feedback?.rating;
    } else {
      try {
        const feedback = candidate.projectResults[0].feedbacks.find(
          (feedback) => feedback.type === (feedbackType as any)
        );
        return feedback?.rating;
      } catch (error) {
        return null;
      }
    }
  }

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
      this.candidatesPageFacade.checkedCandidatesIdSet$.next(
        this.setOfCheckedId
      );
    } else {
      this.setOfCheckedId.delete(id);
      this.candidatesPageFacade.checkedCandidatesIdSet$.next(
        this.setOfCheckedId
      );
    }
  }

  onAllChecked(value: boolean): void {
    this.candidatesList.forEach((item) => {
      this.updateCheckedSet(item.id, value);
    });
    this.refreshCheckedStatus();
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.candidatesList.every((item) => {
      this.setOfCheckedId.has(item.id);
    });
    this.indeterminate =
      this.candidatesList.some((item) => this.setOfCheckedId.has(item.id)) &&
      !this.checked;
    this.candidatesPageFacade.checkedCandidatesIdSet$.next(this.setOfCheckedId);
  }

  onQueryParamsChange(params: NzTableQueryParams) {
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort: CandidatesOrderBy[] = sort
      .filter((item) => item.value !== null)
      .map((el) => ({
        property: el.key,
        order: el.value !== null ? el.value.slice(0, -3) : '',
      }));
    const filters: CandidatesFilters = {
      orderBy: currentSort,
    };
    this.onFilters.emit(filters);
  }

  getFormatName(name: any): string {
   return name === 'JavaScript' ? name : name.split(/(?=[A-Z])/).join(' ');
  }
}
