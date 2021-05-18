import { Subscription } from 'rxjs';
import { AuthService } from './../auth/auth.service';
import { Component, OnDestroy, OnInit } from "@angular/core";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']

})
export class HeaderComponent implements OnInit, OnDestroy {

  authenticated = false;
  private authListenerSubs: Subscription;

  constructor(private authService: AuthService) {}

  onLogout() {
    this.authService.logout();
  }

  ngOnInit() {
    this.authenticated = this.authService.getAuthStatus();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated=>{
      this.authenticated=isAuthenticated;
    });
  }
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
