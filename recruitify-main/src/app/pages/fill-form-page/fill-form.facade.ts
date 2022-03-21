// import { FillFormComponent } from './fill-form.component';
import { Injectable } from '@angular/core';
import { Validators, FormGroup } from '@angular/forms';
import { Observable, of, BehaviorSubject } from 'rxjs';
// import { FillFormServices } from 'src/app/services/fill-form.service';
import { EnglishLevel } from 'src/app/shared/models/EnglishLevel';
import { ProjectsService } from 'src/app/shared/services/projects.service';

@Injectable()
export class FillFormFacade {
  bestTimeToContact: number[] = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  primarySkills$!: Observable<any>;

  constructor(private projectsService: ProjectsService) {}

  get englishLevel$(): Observable<any> {
    return of(Object.entries(EnglishLevel));
  }

  getPrimarySkills$(id: string): Observable<any> {
    this.projectsService.getProjectById(id);
    return of([
      {
        id: 'aeb0e468-3774-11ec-83d4-97dbf3c3f8eb',
        name: '.Net',
        description: 'OOP, Design patterns, SQL, ASP.NET',
        testLink: 'https://exadel.com/tests/net',
      },
      {
        id: '9ff9ab3e-3775-11ec-92f5-134491be8f5a',
        name: 'QA',
        description: 'CSS, HTML, Java Script',
        testLink: 'https://exadel.com/tests/qa',
      },
    ]);
  }

  createCandidateObjToSend(candidateForm: FormGroup) {
    const { contact0, contact1, contact2, contact3, contact4 } =
      candidateForm.value.contacts;

    const linksArrWithoutEmpty = [
      contact0,
      contact1,
      contact2,
      contact3,
      contact4,
    ].filter((link) => link);

    const linksArrToSend = linksArrWithoutEmpty.map((link) => {
      try {
        const contactUrlHost = new URL(link).host || '';
        return { type: contactUrlHost, value: link };
      } catch (error) {
        return { type: '', value: link };
      }
    });

    const skypeToSend = {
      type: 'Skype',
      value: candidateForm.value.skype,
    };

    const contactsArrToSend = [...linksArrToSend, skypeToSend];
    const locationObjToSend = {
      city: candidateForm.value.city,
      country: candidateForm.value.country,
    };

    const candidateToSend = {
      ...candidateForm.value,
      contacts: contactsArrToSend,
      location: locationObjToSend,
    };

    delete candidateToSend.skype;
    delete candidateToSend.city;
    delete candidateToSend.country;

    return candidateToSend;
  }
}
