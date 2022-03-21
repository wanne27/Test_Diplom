import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { FeedbackSelectRole as FeedbackSelects } from 'src/app/shared/models/AddFeedbackSelectRoles';
import { Feedback } from 'src/app/shared/models/Feedback';
import { UserRole } from 'src/app/shared/models/UserRole';
import { UserService } from 'src/app/shared/services/user.service';
import { CandidatesPageFacade } from '../../candidates-page/candidates-page.facade';
import { ProfilePageFacade } from '../profile-page.facade';

@Component({
  selector: 'app-add-feedback-modal',
  templateUrl: './add-feedback-modal.component.html',
  styleUrls: ['./add-feedback-modal.component.scss'],
})
export class AddFeedbackModalComponent implements OnInit, OnDestroy {
  @Input() visible: boolean = false;
  @Output() toggleModal = new EventEmitter<boolean>();
  @Input() feedbacks!: Feedback[];

  editing: boolean = false;
  candidateId: string = '';
  projectId: string = '';
  form: FormGroup;
  feedbackSelects: FeedbackSelects[] = [];
  subscriptions: Subscription[] = [];
  isFeedbackSubmitting = false;

  constructor(
    private candidatesFacade: CandidatesPageFacade,
    private userService: UserService,
    private profilePageFacade: ProfilePageFacade,
    private route: ActivatedRoute,
    private message: NzMessageService
  ) {
    this.form = new FormGroup({
      rating: new FormControl(null, Validators.required),
      textFeedback: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500),
      ]),
      type: new FormControl('', Validators.required),
    });
  }

  onClose() {
    this.toggleModal.emit(false);
    this.editing = false;
    this.candidatesFacade.editingFeedback$.next(null);
    this.form.reset();
  }

  isDisabled(feedbackType: number) {
    let result = false;
    for (let i = 0; i < this.feedbacks.length; i++) {
      const element = this.feedbacks[i];
      if (element.type === feedbackType) {
        result = true;
        return result;
      }
    }
    return result;
  }

  onSubmit() {
    for (const i in this.form.controls) {
      if (this.form.controls.hasOwnProperty(i)) {
        this.form.controls[i].markAsDirty();
        this.form.controls[i].updateValueAndValidity();
      }
    }

    if (this.form.valid) {
      this.isFeedbackSubmitting = true;
      this.candidatesFacade
        .createFeedback$({
          ...this.form.value,
          candidateId: this.candidateId,
          projectId: this.projectId,
        })
        .subscribe(
          (data) => {
            this.message.success('Feedback successfully added');
            this.isFeedbackSubmitting = false;
            this.toggleModal.emit(false);
            this.profilePageFacade.getCandidateById(
              this.candidateId,
              this.projectId
            );
          },
          () => {
            this.message.error('Something went wrong');
            this.isFeedbackSubmitting = false;
          }
        );
    }

    // this.onClose()
  }
  ngOnInit(): void {
    this.subscriptions.push(
      this.candidatesFacade.editingFeedback$
        .pipe(filter((f) => !!f))
        .subscribe((data) => {
          if (data) {
            this.form.patchValue({ ...data, textFeedback: data.feedbackText });
          }
        })
    );

    this.subscriptions.push(
      this.route.params.subscribe((params) => {
        this.candidateId = params.id;
        this.projectId = params.projectId;

        const currentProjectRoles = this.userService.getProjectRoles(
          params.projectId
        );

        currentProjectRoles?.forEach((role) => {
          if (role === UserRole.interviewer) {
            this.feedbackSelects.push(
              { feedbackName: 'Entry Interview', type: 2 },
              { feedbackName: 'Final Interview', type: 3 }
            );
          }
          if (role === UserRole.mentor) {
            this.feedbackSelects.push({
              feedbackName: 'Mentor feedback',
              type: 4,
              // feedbackType: 4,
            });
          }
          if (role === UserRole.recruiter) {
            this.feedbackSelects.push({
              feedbackName: 'Recruiter feedback',
              type: 1,
            });
          }
        });
      })
    );
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
