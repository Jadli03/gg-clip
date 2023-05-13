import { Component, Input, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() modalID = '';

  constructor(protected modal: ModalService, public el: ElementRef) { }



  ngOnInit(): void {
    document.body.appendChild(this.el.nativeElement)
  }

  closeModal() {
    this.modal.toggleModel(this.modalID);
  }
  ngOnDestroy(): void {
    document.body.removeChild(this.el.nativeElement)
  }


}
