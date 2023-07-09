import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask} from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { last, switchMap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app'
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';
import { FfmpegService } from 'src/app/services/ffmpeg.service';
import { combineLatest, forkJoin} from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnDestroy{

  isDragover = false;
  nextStep = false;
  showAlert = false;
  alertColor = 'blue';
  alertMsg = 'Please wait! Your clip is being uploaded';
  inSubmission = false;
  percentage = 0;
  showPercent = false;
  user: firebase.User | null = null;
  task?: AngularFireUploadTask
  screenshots:string[] = []
  selectedScreenshot = ''
  screenshotTask?: AngularFireUploadTask;
  title = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable: true
  })
  uploadForm = new FormGroup({
    title: this.title
  })

  file: File | null = null;

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipService: ClipService,
    private router: Router,
    protected ffmpeg: FfmpegService) {
    auth.user.subscribe(user => this.user = user);
    this.ffmpeg.init();
  }
  ngOnDestroy(): void {
    this.task?.cancel();
  }

  async storeFile($event: Event) {
    if(this.ffmpeg.isRunning) {
      return;
    }
    this.isDragover = false;
    this.file =  ($event as DragEvent).dataTransfer ? 
    ($event as DragEvent).dataTransfer?.files.item(0) ?? null : 
    ($event.target as HTMLInputElement).files?.item(0) ?? null;
    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }

    this.screenshots = await this.ffmpeg.getScreenshots(this.file);
    this.selectedScreenshot = this.screenshots[0]
    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''))
    this.nextStep = true;
  }

  async uploadFile() {
    this.uploadForm.disable();
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! Your clip is being uploaded';
    this.inSubmission = true;
    this.showPercent = true;

    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`
    const screenshotBlob = await this.ffmpeg.BlobFromURL(this.selectedScreenshot);
    const screenshotPath = `screenshots/${clipFileName}.png`
    this.task = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath);
    this.screenshotTask = this.storage.upload(
      screenshotPath,
       screenshotBlob);
    const screenshotRef = this.storage.ref(screenshotPath)
    combineLatest([
      this.task.percentageChanges(),
      this.screenshotTask.percentageChanges()
  ]).subscribe(progress => {
     const [clipProgress, screenshotProgress] = progress;

     if(!clipProgress || !screenshotProgress) {
      return;
     }
     const total = clipProgress + screenshotProgress;

      this.percentage = total as number / 200;
    })

    forkJoin([this.task.snapshotChanges(),
    this.screenshotTask.snapshotChanges()]).pipe(
      switchMap(() => forkJoin([clipRef.getDownloadURL(), screenshotRef.getDownloadURL()]))
    ).subscribe({
      next: async (urls) => {
        const [clipURL, screenshotURL] = urls;
        const clip = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          title: this.title.value,
          fileName: `${clipFileName}.mp4`,
          url : clipURL,
          screenshotURL,
          screenshotFileName: `${clipFileName}.png`,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }
        const clipDocumentRef = await this.clipService.createClip(clip)
        this.alertColor = 'green';
        this.alertMsg = "Clip Uploaded"
        this.showPercent = false;
        setTimeout(() => { 
          this.router.navigate([
            'clip', clipDocumentRef.id
          ])
        },1000)
      },
      error: (error) => {
        this.uploadForm.enable()
        this.alertColor = 'red';
        this.alertMsg = "Clip Upload failed"
        this.showPercent = false;
        this.inSubmission = true;
        this.showPercent = false;
      }
    })
  }

}
