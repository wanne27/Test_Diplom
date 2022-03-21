import { paths } from 'src/app/app-routing.constants';
import { ProjectsService } from 'src/app/shared/services/projects.service';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CandidatesService } from './../../shared/services/candidates.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { EnumToArrayPipe } from 'src/app/shared/pipes/enumToArray.pipe';
import { FillFormFacade } from './fill-form.facade';
import { PrimarySkill } from 'src/app/shared/models/Project';

@Component({
  selector: 'app-fill-form',
  templateUrl: './fill-form.component.html',
  styleUrls: ['./fill-form.component.scss'],
  providers: [FillFormFacade, EnumToArrayPipe],
})
export class FillFormComponent implements OnInit {
  bestTimeToContact: number[] = this.fillFormFacade.bestTimeToContact;
  currentProjectSkills!: PrimarySkill[];
  currentProjectId!: string;
  englishLevel$: Observable<any>;
  isLoading: boolean = false;

  goingToExadelError: boolean = false;
  projectLanguageError: boolean = false;
  isAnyErrorInForm: boolean = false;
  requestError: boolean = false;

  contactFields: number[] = [];

  candidateForm = this.fb.group({
    name: ['', Validators.required],
    surname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    skype: ['', Validators.required],
    phoneNumber: ['', [Validators.required, Validators.pattern('[0-9]{12}')]],
    city: ['', Validators.required],
    country: ['', Validators.required],
    englishLevel: ['', Validators.required],
    projectLanguage: ['', Validators.required],
    primarySkillId: ['', Validators.required],
    goingToExadel: ['', Validators.required],
    additionalInfo: [''],
    additionalQuestions: [''],
    currentJob: [''],
    certificates: [''],
    bestTimeToConnect: [[], Validators.required],
    contacts: this.fb.group({
      contact0: [''],
      contact1: [''],
      contact2: [''],
      contact3: [''],
      contact4: [''],
    }),
  });

  constructor(
    private fb: FormBuilder,
    private fillFormFacade: FillFormFacade,
    private route: ActivatedRoute,
    private router: Router,
    private candidatesService: CandidatesService,
    private message: NzMessageService,
    private http: HttpClient,
    private projectsService: ProjectsService
  ) {
    this.englishLevel$ = fillFormFacade.englishLevel$;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.currentProjectId = params.id;
      // this.projectsService.getProjectById(params.id).subscribe((response) => {
      //   this.currentProjectSkills = response.primarySkills;
      // });

      // TODO: move to projects.service
      this.http
        .get(
          'https://recruitifyexadel.herokuapp.com/odata/Projects/GetShortProjects'
        )
        .pipe(map((d: any) => d.value))
        .subscribe((response) => {
          const currentProject = response.find((project: any) => {
            return project.id === params.id;
          });
          this.currentProjectSkills = currentProject.primarySkills;
        });
    });
  }

  onAddClick() {
    if (this.contactFields.length < 4) {
      this.contactFields.push(1);
    }
  }

  submitForm() {
    this.candidateForm.controls.goingToExadel.errors
      ? (this.goingToExadelError = true)
      : (this.goingToExadelError = false);
    this.candidateForm.controls.projectLanguage.errors
      ? (this.projectLanguageError = true)
      : (this.projectLanguageError = false);

    const candidateToSend = this.fillFormFacade.createCandidateObjToSend(
      this.candidateForm
    );

    if (this.candidateForm.valid) {
      this.isLoading = true;
      this.candidatesService
        .createCandidate$(candidateToSend, this.currentProjectId)
        .subscribe(
          (response) => {
            this.isLoading = false;
            this.router.navigate([paths.finish]);
            this.candidateForm.reset();
          },
          () => {
            this.requestError = true;
            this.message.error('Something went wrong :(');
            this.isLoading = false;
          }
        );
    } else {
      Object.values(this.candidateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
          this.isAnyErrorInForm = true;
        }
      });
    }
  }
}
