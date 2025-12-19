import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  profile: any = {};
  contact: any = {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadContact();
  }

  loadProfile(): void {
    this.http.get(`${environment.apiUrl}/profile`).subscribe({
      next: (data) => {
        this.profile = data;
      },
      error: () => {
        // Set default values
        this.profile = {
          namaToko: 'Gaafisto',
          tentangToko: 'Your trusted online toy store with the best collection of action figures, building sets, model kits, and video games.',
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
        // Set default values
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

}
