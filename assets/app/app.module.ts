import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { routing } from "./app.routing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from '@angular/http';
import { LaddaModule } from 'angular2-ladda';
import { Md2Module } from 'md2';
import { DatePipe } from '@angular/common';
import {GooglePlaceModule} from 'ng2-google-place-autocomplete';
import { FacebookModule } from 'ng2-facebook-sdk';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MedicareValidator} from './validators/medicare_validator';
import { SplitValidator } from './validators/fixedandvariable';
import { FirstNameValidator } from './validators/namevalidator';
import { MobileNumberValidator } from './validators/mob_number';
import { EmailValidator } from './validators/email_validator';
import { TFNValidator } from './validators/tfnvalidator';
import { PassportValidator } from './validators/passport_validator';
import { DrivingLicenceValidator } from './validators/Driving_licence_validator';
import { dobvalidator } from './validators/dob_validator';
import { Common } from './validators/commonFunc';

import { AppComponent } from "./app.component";
import {OAOService} from "./services/OAO.Service";
import { oaoHeaderComponent } from "./components/commonComponents/headerFooter/oaoHeader.component";
import { oaoFooterComponent } from "./components/commonComponents/headerFooter/oaoFooter.component";

import { LoginComponent } from "./components/commonComponents/loginDetails/login.component";
import { LogoutComponent } from "./components/commonComponents/loginDetails/logout.component";
import { DashboardComponent } from "./components/commonComponents/loginDetails/dashboard.component";
import { HomeComponent } from "./components/home.component";
import { SingleJointComponent } from "./components/commonComponents/SingleJoint.component";
import { PersonalDetailsBasicComponent } from "./components/commonComponents/personalDetails/personalDetailsBasic.component";
import { PersonalDetailsContactComponent } from "./components/commonComponents/personalDetails/personalDetailsContact.component";
import { TaxInformationComponent } from "./components/commonComponents/personalDetails/taxInformation.component";
import { PasswordSetupComponent } from "./components/commonComponents/passwordSetup.component";
import { OnlineIdCheckComponent } from "./components/commonComponents/onlineIdCheck.component";
import { CompleteInformationComponent } from "./components/completeInformation.component";

import { AssetsComponent } from "./components/commonComponents/loanDetails/assets.component";
import { IncomeExpenseComponent } from "./components/commonComponents/loanDetails/incomeExpense.component";
import { PropertyDetailsComponent } from "./components/homeLoan/propertyDetails.component";
import { LoanDetailsComponent } from "./components/homeLoan/loanDetails.component";
import { LoanSummaryComponent } from "./components/homeLoan/loanSummary.component";
import { PersonalLoanComponent } from "./components/personalLoan/personalLoan.component";
import { RecaptchaModule } from 'ng-recaptcha';

//Pipes
import {ObjectToArray} from "./pipes/objectToArray.pipe";

@NgModule({
    declarations:
        [
            AppComponent,
            oaoHeaderComponent,
            oaoFooterComponent,

            LoginComponent,
			LogoutComponent,
            DashboardComponent,
            HomeComponent,
            SingleJointComponent,
            PersonalDetailsBasicComponent,
            PersonalDetailsContactComponent,
            TaxInformationComponent,
            PasswordSetupComponent,
            OnlineIdCheckComponent,

            AssetsComponent,
            IncomeExpenseComponent,
            PropertyDetailsComponent,
            LoanDetailsComponent,
            LoanSummaryComponent,
            PersonalLoanComponent,

            FirstNameValidator,
            MobileNumberValidator,
            EmailValidator,
            PassportValidator,
            DrivingLicenceValidator,
            dobvalidator,
            SplitValidator,
            TFNValidator,
            MedicareValidator,
            CompleteInformationComponent,

            ObjectToArray
		] ,
    imports: [
        RecaptchaModule.forRoot(),
        BrowserModule,
        BrowserAnimationsModule,
        routing,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        FacebookModule,
        GooglePlaceModule,
		Md2Module.forRoot() ,
        LaddaModule.forRoot({
            style: "contract",
            spinnerSize: 40,
            spinnerColor: "grey",
            spinnerLines: 12
        })
        ] ,
    providers:[OAOService,Common,DatePipe],
    bootstrap: [AppComponent]
})
export class AppModule {}
