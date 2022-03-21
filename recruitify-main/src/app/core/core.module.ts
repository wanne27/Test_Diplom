import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { LoginPageComponent } from '../pages/login-page/login-page.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { HeaderComponent } from './components/header/header.component';
import { MainLayoutFacade } from './main-layout/main-layout.facade';

import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

@NgModule({
  declarations: [MainLayoutComponent, LoginPageComponent, HeaderComponent],
  imports: [
    CommonModule,
    RouterModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzTypographyModule,
    FormsModule,
    NzGridModule,
    ReactiveFormsModule,
    NzDropDownModule,
    NzSelectModule,
    NzRadioModule,
    NzPopconfirmModule,
    NzPopoverModule,
  ],
  providers: [MainLayoutFacade],
})
export class CoreModule {}
