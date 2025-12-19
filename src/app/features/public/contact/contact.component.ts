import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '@/app/core/services/notification.service';
import { environment } from '@/environments/environment';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  profile: any = {};
  contact: any = {};
  submitted = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private notificationService: NotificationService
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
    this.loadContact();
  }

  get f() { return this.contactForm.controls; }

  loadProfile(): void {
    this.http.get(`${environment.apiUrl}/profile`).subscribe({
      next: (data) => {
        this.profile = data;
      },
      error: () => {
        this.profile = {
          namaToko: 'Gaafisto',
          alamatToko: 'Jl. Example No. 123',
          kotaToko: 'Jakarta',
          provinsiToko: 'DKI Jakarta',
          kodePos: '12345'
        };
      }
    });
  }

  loadContact(): void {
    this.http.get(`${environment.apiUrl}/contact`).subscribe({
      next: (data) => {
        this.contact = data;
      },
      error: () => {
        this.contact = {
          sms: '+62 819-1516-7962',
          telpon: '+62 21 1234567',
          wa: '+62 819-1516-7962',
          email: 'info@gaafisto.com',
          facebook: 'https://facebook.com/gaafisto',
          twitter: 'https://twitter.com/gaafisto',
          instagram: 'https://instagram.com/gaafisto',
          youtube: 'https://youtube.com/gaafisto'
        };
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.contactForm.invalid) {
      return;
    }

    this.loading = true;

    this.http.post(`${environment.apiUrl}/contact/send`, this.contactForm.value).subscribe({
      next: () => {
        this.notificationService.success('Message sent successfully! We will contact you soon.');
        this.contactForm.reset();
        this.submitted = false;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notificationService.error('Failed to send message. Please try again.');
      }
    });
  }

}
