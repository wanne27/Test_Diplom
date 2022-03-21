import { CandidatesPageFacade } from './../candidates-page.facade';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-send-email-modal',
  templateUrl: './send-email-modal.component.html',
  styleUrls: ['./send-email-modal.component.scss'],
})
export class SendEmailModalComponent implements OnInit {
  isModalVisible!: boolean;
  emailTemplate = 'here will be editable email template';

  constructor(private candidatesPageFacade: CandidatesPageFacade) {}

  ngOnInit(): void {
    this.candidatesPageFacade.isEmailModalVisible$.subscribe(
      (response) => (this.isModalVisible = response)
    );
  }

  handleCancel(): void {
    // console.log('Button cancel clicked!');
    this.isModalVisible = false;
  }

  sendEmail() {
    // console.log('Send Email!');
    this.isModalVisible = false;
  }
}
