import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '@/app/core/services/auth.service';
import { User } from '@/app/core/models/user.model';

@Component({
    selector: 'app-layout',
    imports: [RouterLink, RouterOutlet],
    templateUrl: './layout.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {
  currentUser: User | null = null;
  unreadMessages = 0;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    // Load unread messages count
    this.loadUnreadMessages();
  }

  loadUnreadMessages(): void {
    // TODO: Implement messages service
    this.unreadMessages = 0;
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
    }
  }

  isActiveRoute(route: string): boolean {
    return this.router.url.includes(route);
  }

}
