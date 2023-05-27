import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges, Output, EventEmitter} from '@angular/core';
import IClip from 'src/app/models/clip.model';
import { ModalService } from 'src/app/services/modal.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipService } from 'src/app/services/clip.service';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy, OnChanges{

  @Input() activeClip:IClip | null = null;
  @Output() update = new EventEmitter()
  inSubmission = false;
  showAlert = false;
  alertMsg = 'Please Wait! Updating clip.'
  alertColor = 'blue'

  clipID = new FormControl('', {
    nonNullable: true
  })
  title = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable: true
  })
  editForm = new FormGroup({
    title: this.title,
    id: this.clipID
  })

  constructor(private modal : ModalService, private clipService : ClipService){}

  ngOnChanges(): void {
      if(!this.activeClip){
        return;
      }
      this.inSubmission = false;
      this.showAlert = false;
      this.clipID.setValue(this.activeClip.docID as string);
      this.title.setValue(this.activeClip.title);
  }

  ngOnDestroy(): void {
   this.modal.unregister('editClip');
  }

  ngOnInit(): void {
    this.modal.register('editClip')
  }

  async submit() {

    if(!this.activeClip) {
      return;
    }

    this.alertColor = 'blue';
    this.inSubmission = true;
    this.alertMsg = 'Please Wait! Updating clip.'
    this.showAlert = true;

    try {
    await this.clipService.updateClip(this.clipID.value, this.title.value);
    }
    catch(error) {
      console.log(this.clipID.value)
      console.log(error)
      this.inSubmission = false;
      this.alertColor = 'red';
      this.alertMsg = 'Something Went wrong. Try again later'
      return;
    }
    this.inSubmission = false;
    this.alertColor = 'green';
    this.alertMsg = 'Update Sucess';

    this.activeClip.title = this.title.value;
    this.update.emit(this.activeClip);
  }

}
