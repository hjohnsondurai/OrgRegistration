
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as $ from 'jquery';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';

let self;
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  countriesList = [];
  selCountry = [];
  // isOptional = false;
  stepSelIndex = 0;
  enteredOTP = "";
  genOTP = {
    code: "",
    time: null,
    timerCount: 60,
    isTimerExpired: true,
    timerStart: function () {
      var _that = this;
      self.genOTP.isTimerExpired = false;
      var refreshIntervalId = setInterval(function () {
        self.genOTP.timerCount -= 1;
        if (_that.timerCount <= 0) {
          clearInterval(refreshIntervalId);
          self.genOTP.isTimerExpired = true;
        }
      }, 1000);
    }
  }
  data = {
    personal: {
      name: "",
      gender: '',
      country: '',
      state: '',
      phone: ''
    },
    company: {
      orgLogo: '',
      name: '',
      email: '',
      jobTitle: '',
      experience: '',
      isAcceptedTerms: false
    }
  }
  stepper = {
    step1Success: false,
    step2Success: false,
    step3Success: false
  };
  constructor(private http: HttpClient, private snackBar: MatSnackBar, private ds: DataService, private router: Router) {
    this.getStatesByCountries();
    self = this;
  }

  ngOnInit(): void {
  }

  getStatesByCountries() {
    this.http.get("assets/data/statesByCountries.json").subscribe((data) => {
      this.countriesList = data["countries"];
    }, (err) => {
      console.log(err)
    });
  }
  generateOTP() {
    var digits = '0123456789';
    var otpLength = 4;
    var otp = '';
    for (let i = 1; i <= otpLength; i++) {
      var index = Math.floor(Math.random() * (digits.length));
      otp = otp + digits[index];
    }
    return otp;
  }

  sendMail() {
    this.genOTP.code = this.generateOTP();
    this.genOTP.time = new Date();
    this.genOTP.timerCount = 60;
    this.genOTP.timerStart();
    const params = {
      to: this.data.company.email,
      subject: "Registration Email Verfication OTP",
      otp: this.genOTP.code,
      username: this.data.personal.name
    }

    $.ajax({
      url: "http://localhost:1337/sendOTP",
      type: "POST",
      crossDomain: true,
      data: params,
      success: function (data) {
        const msg = (typeof data == "object") ? data?.SERVER_MESSAGE : "Unknown error..!"
        self.showMessage(msg || "Unknown error..!");
        console.log(data);
      },
      error: function (err) {
        const msg = (typeof err == "object") ? err?.SERVER_MESSAGE : "Unknown error..!"
        self.showMessage(msg || "Unknown error..!");
        console.log(err);
      }
    });
  }

  showMessage(message) {
    this.snackBar.open(message, "Hide", {
      duration: 2000,
    });
  }

  // Binded functions
  updateCountry(country) {
    this.selCountry = country;
  }

  uploadOrgLogo(event) {
    var file = event.target.files[0],
      imageType = /image.*/;

    if (!file.type.match(imageType))
      alert("Selected file is not a image type. Please select a image file");

    var reader = new FileReader();
    reader.onload = fileOnload;
    reader.readAsDataURL(file);

    // Event handler
    function fileOnload(e) {
      let dataURL = e.target.result;
      self.data.company.orgLogo = dataURL;
    }
  }

  submitPersonalDetails() {
    console.log(this.data);
    var personal = this.data.personal;
    if (personal.name == "" || personal.gender == "" || personal.country == "" || personal.state == "" || personal.phone == "") {
      this.showMessage("Please fill the required fields");
      this.stepSelIndex = 0;
    }
    else {
      this.stepSelIndex = 1;
    }

  }

  submitOriganisationDetails() {
    this.genOTP.timerCount = 60;
    var company = this.data.company;
    if (company.name == "" || company.email == "" || company.experience == "" || company.jobTitle == "" || company.orgLogo == "" || !company.isAcceptedTerms) {
      this.showMessage("Please fill the required fields");
      this.stepSelIndex = 1;
    }
    else {
      this.sendMail();
      this.stepSelIndex = 2;
    }
    console.log(this.data);
  }

  onOtpChange(data) {
    if (data.length == 4)
      this.enteredOTP = data;
  }

  verifyOPT(){
    if(this.enteredOTP.length < 4){
      this.showMessage("Enter the valid OTP");
    } else if(this.enteredOTP.toString() == this.genOTP.code.toString()) {
      this.ds.obj.saveData("Organization", this.data);
      this.router.navigateByUrl("/success");
    }
  }

}