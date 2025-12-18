import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@/app/core/services/auth.service';
import { NotificationService } from '@/app/core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (response) => {
        this.notificationService.success('Login successful!');
        
        if (response.user.role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else if (response.user.role === 'seller') {
          this.router.navigate(['/user/dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        this.loading = false;
        this.notificationService.error(error.error?.message || 'Login failed');
      }
    });
  }

}
