import {Component, EventEmitter, OnInit} from '@angular/core';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import {interval, Observable, Subject} from 'rxjs';
import {BackendService} from '../backend.service';

@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.css'],
  providers: [BackendService],
})

export class WebcamComponent implements OnInit
{
  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];

  public usernameTextField: string;

  public instructionText = 'Login';

  // latest snapshot
  public webcamImage: WebcamImage = null;
  private backendService: BackendService = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();
  private token: string;

  public personOK = false;

  constructor(backendService: BackendService)
  {
    this.backendService = backendService;
  }

  public ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
      });
  }

  public usernameEntered(): void
  {
    this.instructionText = 'Logging in...';
    this.runfacedetection();
  }

  public triggerSnapshot(): void
  {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.log('username: ', this.usernameTextField);
    this.webcamImage = webcamImage;
  }

  private tryfacedetection(ms: number): void
  {
    setTimeout(() => {
      this.runfacedetection();
    }, ms);
  }

  private runfacedetection(): void
  {
    this.triggerSnapshot();
    this.backendService.sendPicture(this.webcamImage.imageAsBase64, this.usernameTextField).subscribe((responseBody) =>
    {
      const personOK: string = responseBody.body.person;
      const tokenReceived: string = responseBody.body.token;
      if (personOK === 'OK')
      {
        this.personOK = true;
        this.token = 'df43170b-92af-49f8-95cd-1343582cafc5';
        console.log('Token: ' + this.token);
        window.location.href = 'http://safety.carriersoftware.com/?Token=' + this.token;
      }
      else
      {
        this.personOK = false;
      }

      if (!this.personOK)
      {
        this.instructionText = 'Hold still!';
        this.tryfacedetection(1000);
      }
      else {
        this.instructionText = 'Okay!';
      }
    });
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }

  public get getToken(): string
  {
    return this.getToken;
  }
}
