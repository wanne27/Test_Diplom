import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DragulaModule } from 'ng2-dragula';

import { SharedRoutingModule } from './shared-routing.module';

//facades
import { CalendarPageFacade } from './pages/calendar-page/calendar-page.facade';
import { ProfilePageFacade } from './pages/profile-page/profile-page.facade';
import { CandidatesPageFacade } from './pages/candidates-page/candidates-page.facade';
import { ProjectsPageFacade } from './pages/projects-page/projects-page.facade';
import { InternshipsFacade } from './pages/internships/internships.facade';

//services
import { CandidatesService } from './services/candidates.service';
import { ProjectsService } from './services/projects.service';
import { UserService } from './services/user.service';

//components
import { SharedComponent } from './shared.component';
import { RatingStarsComponent } from './components/rating-stars/rating-stars.component';
import { CandidatesPageComponent } from './pages/candidates-page/candidates-page.component';
import { ProjectsPageComponent } from './pages/projects-page/projects-page.component';
import { ProjectsListComponent } from './pages/projects-page/projects-list/projects-list.component';
import { ProjectComponent } from './pages/projects-page/project/project.component';
import { ParticipantsComponent } from './pages/projects-page/participants/participants.component';
import { CreateProjectComponent } from './components/create-project/create-project.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { FourOFourComponent } from './pages/four-o-four/four-o-four.component';
import { CalendarPageComponent } from './pages/calendar-page/calendar-page.component';

//pipes
import { SearchPipe } from './pipes/search.pipe';

//nz-modules
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { PrimarySkillInputComponent } from './components/create-project/primary-skill-input/primary-skill-input.component';
import { FilterDrawerComponent } from './pages/candidates-page/filter-drawer/filter-drawer.component';
import { DropdownMenuComponent } from './pages/candidates-page/dropdown-menu/dropdown-menu.component';
import { InternshipsComponent } from './pages/internships/internships.component';
import { EnumToArrayPipe } from './pipes/enumToArray.pipe';
import { CandidatesTableComponent } from './pages/candidates-page/candidates-table/candidates-table.component';
import { ProjectFiltersComponent } from './pages/projects-page/project-filters/project-filters.component';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { CalendarForInterviewersComponent } from './pages/calendar-page/calendar-for-interviewers/calendar-for-interviewers.component';
import { TimeLineComponent } from './pages/calendar-page/time-line/time-line.component';
import { CalendarItemDirective } from './directives/calendar-item.directive';
import { TimeGridItemComponent } from './pages/calendar-page/time-grid-item/time-grid-item.component';
import { CalendarForRecruitersComponent } from './pages/calendar-page/calendar-for-recruiters/calendar-for-recruiters.component';
import { TimeGridRowComponent } from './pages/calendar-page/time-grid-row/time-grid-row.component';
import { CandidatesGridComponent } from './pages/calendar-page/candidates-grid/candidates-grid.component';
import { CandidateService } from './services/candidate.service';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { InterviewersDropTableComponent } from './pages/calendar-page/interviewers-drop-table/interviewers-drop-table.component';
import { SkillsTabsetComponent } from './pages/calendar-page/skills-tabset/skills-tabset.component';
import { ProfileFeedbacksComponent } from './pages/profile-page/profile-feedbacks/profile-feedbacks.component';
import { AddFeedbackModalComponent } from './pages/profile-page/add-feedback-modal/add-feedback-modal.component';
import { SendEmailModalComponent } from './pages/candidates-page/send-email-modal/send-email-modal.component';
import { FinishPageComponent } from './pages/finish-page/finish-page.component';
import { DropItemComponent } from './pages/calendar-page/drop-item/drop-item.component';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';

@NgModule({
  declarations: [
    SharedComponent,
    RatingStarsComponent,
    ProjectsPageComponent,
    ProjectsListComponent,
    ProjectComponent,
    ParticipantsComponent,
    CreateProjectComponent,
    ProfilePageComponent,
    FourOFourComponent,
    CalendarPageComponent,
    CandidatesPageComponent,
    SearchPipe,
    PrimarySkillInputComponent,
    FilterDrawerComponent,
    DropdownMenuComponent,
    InternshipsComponent,
    EnumToArrayPipe,
    CandidatesTableComponent,
    ProjectFiltersComponent,
    CalendarForInterviewersComponent,
    TimeLineComponent,
    CalendarItemDirective,
    TimeGridItemComponent,
    CalendarForRecruitersComponent,
    TimeGridRowComponent,
    CandidatesGridComponent,
    InterviewersDropTableComponent,
    SkillsTabsetComponent,
    ProfileFeedbacksComponent,
    AddFeedbackModalComponent,
    SendEmailModalComponent,
    FinishPageComponent,
    DropItemComponent,
  ],
  imports: [
    NzBreadCrumbModule,
    CommonModule,
    SharedRoutingModule,
    FormsModule,
    NzRateModule,
    NzIconModule,
    NzButtonModule,
    NzCardModule,
    ReactiveFormsModule,
    NzTableModule,
    NzGridModule,
    NzInputModule,
    NzCheckboxModule,
    NzModalModule,
    NzFormModule,
    NzSelectModule,
    NzDatePickerModule,
    NzSwitchModule,
    BrowserAnimationsModule,
    NzDropDownModule,
    NzResultModule,
    BrowserAnimationsModule,
    NzRadioModule,
    NzDrawerModule,
    NzCollapseModule,
    NzTabsModule,
    NzPopoverModule,
    NzSpaceModule,
    NzEmptyModule,
    NzTypographyModule,
    NzDividerModule,
    NzRadioModule,
    NzPopconfirmModule,
    DragulaModule.forRoot(),
    NzSpinModule,
    NzTagModule,
    NzInputNumberModule,
  ],
  exports: [RatingStarsComponent, EnumToArrayPipe],
  providers: [
    CandidatesService,
    ProfilePageComponent,
    CandidatesPageFacade,
    CalendarPageFacade,
    ProfilePageFacade,
    ProjectsService,
    ProjectsPageFacade,
    UserService,
    CandidateService,
    InternshipsFacade,
  ],
})
export class SharedModule {}
