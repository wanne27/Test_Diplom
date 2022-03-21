import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-primary-skill-input',
  templateUrl: './primary-skill-input.component.html',
  styleUrls: ['./primary-skill-input.component.scss'],
})
export class PrimarySkillInputComponent implements OnInit, OnDestroy {
  @Input()
  form!: FormGroup;
  @Input()
  index!: number;

  @Output()
  onPrimarySkillRemove = new EventEmitter<number>();

  isInitiallyActive: boolean = true;
  private subscriptions: Subscription[] = [];
  constructor(private route: ActivatedRoute) {}

  remove($event: MouseEvent) {
    $event.stopPropagation();
    this.onPrimarySkillRemove.emit();
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.queryParams.subscribe((params) => {
        this.isInitiallyActive = !params.editingId;
      })
    );
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
