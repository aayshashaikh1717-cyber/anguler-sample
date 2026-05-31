import { Component, OnInit, signal, computed, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AsPipe } from '../../shared/helper/as.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSelectModule, MatRadioModule, MatDatepickerModule, MatNativeDateModule, MatSlideToggleModule, MatChipsModule, MatProgressBarModule, AsPipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {

  readonly FormControl = FormControl;
  form0!: FormGroup;
  form1!: FormGroup;
  form2!: FormGroup;
  isSubmitted = signal(false);
  submitPayload = signal<Record<string, unknown>>({});

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {

    // ── Basic information
    this.form0 = this.fb.group({
      empId: ['', []],
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', []],
      dob: ['', []],
    });

    // ── Role & department
    this.form1 = this.fb.group({
      dept: ['', []],
      role: ['', []],
      office: ['', []],
      employment: ['', []],
      remote: ['', []],
      joinDate: ['', [Validators.required]],
    });

    // ── Notes
    this.form2 = this.fb.group({
      skills: ['', []],
      notes: ['', []],
    });

      this.form0.valueChanges.subscribe(() => this.cdr.markForCheck());
    this.form1.valueChanges.subscribe(() => this.cdr.markForCheck());
    this.form2.valueChanges.subscribe(() => this.cdr.markForCheck());
  }

  getErrorMessage(control: FormControl): string {
    if (!control.errors || !control.touched) return '';
    if (control.errors['required']) return 'This field is required.';
    if (control.errors['email']) return 'Enter a valid email address.';
    if (control.errors['minlength']) return `Minimum ${control.errors['minlength'].requiredLength} characters.`;
    if (control.errors['maxlength']) return `Maximum ${control.errors['maxlength'].requiredLength} characters.`;
    return 'Invalid value.';
  }

  submit(): void {
    const allForms = [this.form0, this.form1, this.form2];
    allForms.forEach(f => f.markAllAsTouched());
    if (allForms.every(f => f.valid)) {
      const payload: Record<string, unknown> = {};
      payload['basicInformation'] = this.form0.getRawValue();
      payload['roleDepartment'] = this.form1.getRawValue();
      payload['notes'] = this.form2.getRawValue();
      this.submitPayload.set(payload);
      console.log(payload)
      this.isSubmitted.set(true);
    }
  }

  reset(): void {
    [this.form0, this.form1, this.form2].forEach(f => f.reset());
    this.isSubmitted.set(false);
    
  }
}