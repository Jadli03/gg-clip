import { Component } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';
import {AngularFireAuth} from '@angular/fire/compat/auth'
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  constructor(protected modal: ModalService, protected auth: AuthService, private afAuth: AngularFireAuth) {}

  openModal(event: Event) { 
    event.preventDefault();
    this.modal.toggleModel('auth');
  }

  async logout(event: Event) { 
    event.preventDefault();
    await this.afAuth.signOut();
  }
}
