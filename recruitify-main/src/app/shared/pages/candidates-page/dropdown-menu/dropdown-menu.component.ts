import { UserService } from './../../../services/user.service';
import { CandidatesService } from './../../../services/candidates.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CandidatesPageFacade } from './../candidates-page.facade';
import { Component, Input, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.scss'],
})
export class DropdownMenuComponent implements OnInit {
  @Input() menuVisible: any;
  @Input() projectId!: string;

  selectedStatus: string = '';
  selectedReason: string = '';
  isReasonSelectVisible: boolean = false;

  testResult: string = '';
  daysForTestTask: string = '';

  setOfCandidatesId: Set<string> = new Set();

  finishTestDate!: Date;
  employeeEmail: string = '';

  constructor(
    private candidatesPageFacade: CandidatesPageFacade,
    private candidatesService: CandidatesService,
    private message: NzMessageService,
    private userService: UserService
  ) {}

  isRecruiter: boolean = this.candidatesPageFacade.isRecruiter;
  isManager: boolean = this.candidatesPageFacade.isManager;

  declineReasons: string[] = this.candidatesPageFacade.declineReasons;
  candidateStatuses: string[] = this.candidatesPageFacade.candidateStatuses;
  candidateStatusesForManager: any[] =
    this.candidatesPageFacade.candidateStatusesForManager;

  ngOnInit(): void {
    this.candidatesPageFacade.checkedCandidatesIdSet$.subscribe((response) => {
      this.setOfCandidatesId = response;
    });
  }

  onDateChange(date: Date): void {
    // console.log('onChange: ', date.toUTCString());
  }

  setReasonSelectVisibility(value: any) {
    value === 'Denied'
      ? (this.isReasonSelectVisible = true)
      : (this.isReasonSelectVisible = false);
    // console.log(value);
  }

  sendTestTask() {
    if (
      this.employeeEmail &&
      this.finishTestDate &&
      this.setOfCandidatesId.size
    ) {
      const reqBody = {
        candidatesIds: [...this.setOfCandidatesId],
        projectId: this.projectId,
        personToContactEmail: this.employeeEmail,
        testDeadlineDate: this.finishTestDate,
      };

      this.candidatesService
        .senTestTask(this.projectId, { ...reqBody })
        .subscribe((response) => {
          // console.log(response);
        });

      this.message.success('Test task has been successfully sent');

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else if (!this.setOfCandidatesId.size) {
      this.message.warning('Please choose at least one candidate');
    } else if (!this.employeeEmail && !this.finishTestDate) {
      this.message.warning('Please fill all fields');
    }
  }

  testResultSubmit() {
    if (this.setOfCandidatesId.size && this.testResult) {
      const reqBody = {
        rating: this.testResult,
        candidatesIds: [...this.setOfCandidatesId],
        projectId: this.projectId,
      };

      this.candidatesService
        .setTestResult(this.projectId, { ...reqBody })
        .subscribe((response) => {
          // console.log(response);
        });

      this.testResult = '';
      this.message.success('Test result has been successfully updated');

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else if (!this.setOfCandidatesId.size) {
      this.message.warning('Please choose at least one candidate');
    }
  }

  statusSubmit() {
    let status;
    if (this.selectedStatus === 'Accepted') {
      status = 5;
    } else if (this.selectedStatus === 'Denied') {
      status = 6;
    } else {
      status = 7;
    }

    const reqBody = {
      status: status,
      reason: this.selectedReason,
      candidatesIds: [...this.setOfCandidatesId],
      projectId: this.projectId,
    };

    // console.log(reqBody);

    this.candidatesService
      .setStatus(this.projectId, { ...reqBody })
      .subscribe((response) => {
        // console.log(response);
      });

    this.selectedStatus;
    this.selectedReason = '';
    this.isReasonSelectVisible = false;
    this.message.success('Status has been successfully updated');
  }
}
