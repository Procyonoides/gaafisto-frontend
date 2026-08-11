import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@/app/core/services/auth.service';
import { NotificationService } from '@/app/core/services/notification.service';
import { User } from '@/app/core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: User | null = null;
  loading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.authService.getMe().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          gender: user.gender
        });
      },
      error: () => {
        this.notificationService.error('Failed to load profile');
      }
    });
  }

  get f() {
    return this.profileForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.profileForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.updateProfile(this.profileForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.notificationService.success('Profile updated successfully');
      },
      error: () => {
        this.loading = false;
        this.notificationService.error('Failed to update profile');
      }
    });
  }

}
