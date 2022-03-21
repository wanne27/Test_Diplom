import { Component, Input, OnChanges, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import { Feedback, FeedbackTab } from 'src/app/shared/models/Feedback';
import { UserService } from 'src/app/shared/services/user.service';
import { CandidatesPageFacade } from '../../candidates-page/candidates-page.facade';

@Component({
  selector: 'app-profile-feedbacks',
  templateUrl: './profile-feedbacks.component.html',
  styleUrls: ['./profile-feedbacks.component.scss'],
})
export class ProfileFeedbacksComponent implements OnInit, OnChanges {
  @Input() feedbacks!: Feedback[];
  @Input() projectId: string | undefined;

  feedbackTypes: string[] = [];
  isModalVisible = false;
  tabs: FeedbackTab[] = [
    { label: 'Recruiter', value: 'Interview' },
    { label: 'Entry interview', value: 'TechInterviewOneStep' },
    { label: 'Final interview', value: 'TechInterviewSecondStep' },
    { label: 'Mentor', value: 'Mentor' },
  ];

  constructor(
    private candidatesFacade: CandidatesPageFacade,
    private userService: UserService
  ) {
    this.feedbackTypes = this.candidatesFacade.feedbackTypes;
  }

  toggleModal(visible: boolean) {
    this.isModalVisible = visible;
  }

  onEdit(tabData: FeedbackTab) {
    this.toggleModal(true);
    this.candidatesFacade.editingFeedback$.next({
      feedbackText: tabData.textFeedback!,
      feedbackType: tabData.type!,
      rating: tabData.rating!,
    });
  }

  ngOnInit(): void {}

  canEdit(feedbackType: string): boolean {
    if (!this.projectId) {
      return false;
    }
    switch (feedbackType) {
      case 'Interview':
        return this.userService.checkRoleInProject(
          this.projectId,
          'Interviewer'
        );

      case 'TechInterviewOneStep' || 'TechInterviewSecondStep':
        return this.userService.checkRoleInProject(
          this.projectId,
          'Interviewer'
        );

      case 'Mentor':
        return this.userService.checkRoleInProject(this.projectId, 'Mentor');

      default:
        return false;
    }
  }

  addButtonVisible(): boolean {
    if (this.projectId) {
      const isMentor = this.userService.checkRoleInProject(
        this.projectId,
        'Mentor'
      );
      const isInterviewer = this.userService.checkRoleInProject(
        this.projectId,
        'Interviewer'
      );
      const isRecruiter = this.userService.checkRoleInProject(
        this.projectId,
        'Recruiter'
      );
      return isMentor || isInterviewer || isRecruiter;
    }
    return false;
  }

  ngOnChanges(): void {
    if (this.feedbacks.length > 0) {
      this.feedbacks.forEach((feedback) => {
        this.tabs.forEach((tab, index) => {
          if (this.feedbackTypes[feedback.type!] === tab.value) {
            Object.assign(this.tabs[index], {
              ...feedback,
              createdOn: dayjs(feedback.createdOn).format('DD.MM.YYYY'),
              createdTime: dayjs(feedback.createdOn).format('HH:mm'),
            });
          }
        });
      });
    }
  }
}
