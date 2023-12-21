import {Component, OnInit} from '@angular/core';
import {AuthorizationService} from "./authorization-service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'amplify-app3';
  private auth: AuthorizationService;
  canCreateArbitrage = false;
  canShowArbitrage = false;

  constructor(auth: AuthorizationService) {
    this.auth = auth;
  }

  async ngOnInit() {
    this.canCreateArbitrage = await this.auth.isPermitted("Arbitrage", "Create");
    this.canShowArbitrage = await this.auth.isPermitted("Arbitrage", "Read");
  }

}
