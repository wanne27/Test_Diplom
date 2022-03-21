import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CandidatesPageFacade } from '../candidates-page/candidates-page.facade';
import { Candidate } from './../../models/Candidate';
import { ProfilePageFacade } from './profile-page.facade';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
  animations: [
    trigger('showPage', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('0.5s ease-in-out', style({ transform: 'translate(0%' })),
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0%)' }),
        animate('0.5s ease-in-out', style({ transform: 'translateX(-100%)' })),
      ]),
    ]),
  ],
})
export class ProfilePageComponent implements OnInit {
  candidate!: Candidate;
  projectLanguages: string[] = [];
  englishLvls: string[] = [];
  candidateStatuses: string[] = [];
  currentProjectId: string = '';
  prevProjects: any[] = [];
  isLoading = false;

  candidatesCurrentProject!: any;

  skypeLogin: string | undefined = '';
  socLinks!: any;

  testResult!: number | undefined;

  constructor(
    private profilePageFacade: ProfilePageFacade,
    private route: ActivatedRoute,
    private candidatesFacade: CandidatesPageFacade
  ) {
    this.candidateStatuses = this.candidatesFacade.candidateStatuses;
    this.projectLanguages = this.candidatesFacade.projectLanguages;
    this.englishLvls = this.candidatesFacade.englishLvls;
  }
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.currentProjectId = params.projectId;
      this.isLoading = true;
      this.profilePageFacade.getCandidateById(params.id, params.projectId);

      this.profilePageFacade.candidateData$.subscribe(
        (candidate) => {
          this.isLoading = false;
          this.candidate = candidate;
          this.setContacts(candidate);
          this.getTestResult(candidate);
        },
        () => {
          this.isLoading = false;
        }
      );
      this.profilePageFacade
        .getPrevProjects$(params.id)
        .subscribe((prevProjects) => {
          this.prevProjects = prevProjects;
        });
    });
  }

  setContacts(candidate: Candidate) {
    this.candidatesCurrentProject = candidate.projectResults[0];

    this.skypeLogin = this.candidate.contacts.find(
      (item) => item.type === 'Skype'
    )?.value;

    const candidateContactsWithoutSkype = this.candidate.contacts.filter(
      (item) => {
        return item.type !== 'Skype';
      }
    );

    this.socLinks = candidateContactsWithoutSkype.map((item) => {
      const parsedLink = item.type.split('.');
      let itemType;
      if (parsedLink.length === 3) {
        itemType = parsedLink[1];
      } else if (parsedLink.length === 2) {
        parsedLink[0] === 't'
          ? (itemType = 'telegram')
          : (itemType = parsedLink[0]);
      } else if (parsedLink[0] === 't') {
        itemType = 'Telegram';
      }
      return { type: itemType, value: item.value };
    });
  }

  getTestResult(candidate: Candidate) {
    const currentProjectResults = candidate.projectResults.find((item) => {
      return (item.projectId = this.currentProjectId);
    });
    const testResult = currentProjectResults?.feedbacks.find(
      (item) => item.type === 0
    );
    this.testResult = testResult?.rating;
  }
}
