import { Component ,AfterViewInit,OnInit} from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
import {OAOService} from "../services/OAO.Service";
import { ConfigDetails } from "../interfaces/configinterface";
import { PersonalDetailsObject } from "../interfaces/personalDetails.interface";
import {checkbox} from '../interfaces/checkboxinterface';
import { UserDetailsObject } from "../interfaces/userDetails.interface"; //chandan
import { FacebookService, LoginResponse, LoginOptions, UIResponse, UIParams } from 'ng2-facebook-sdk';
import { DatePipe } from '@angular/common';
import { Observable, Subscription } from 'rxjs/Rx';
declare var google: any;
declare var googleLoaded: any;

declare var jQuery: any;
declare var moment: any;
@Component({
    selector: 'home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements AfterViewInit {
  ticks = 60;
    private timer;
     configMsg: ConfigDetails
    resend:boolean=false
    date_v:string;
    wrongDetails_v:boolean=false;
    myForm:boolean=false;
    // Subscription object
    private sub: Subscription;
  public modal = new checkbox(false,false);
  public prod: string;
  public dis_v: boolean=false;
  public img: string;
  public FbData: boolean=false;
  public userExistingFlag: boolean; //chandan
  public fName: any; //chandan
  public age: any;//chandan
  private userDetailsObject = new UserDetailsObject('', '');  //chandan
  private model= new PersonalDetailsObject('', '', '', '', '', '', ''); //chandan
  /**Initialization for md2 date component */
        isRequired = false;
        isDisabled = false;
        isOpenOnFocus = false;
        isOpen = false;
        today: Date = new Date();
        type: string = 'date';
        types: Array<any> = [
            { text: 'Date', value: 'date' },
            { text: 'Time', value: 'time' },
            { text: 'Date Time', value: 'datetime' }];

        mode: string = 'auto';
        modes: Array<any> = [
            { text: 'Auto', value: 'auto' },
            { text: 'Portrait', value: 'portrait' },
            { text: 'Landscape', value: 'landscape' }];

        container: string = 'inline';
        containers: Array<any> = [
            { text: 'Inline', value: 'inline' },
            { text: 'Dialog', value: 'dialog' }];

        date: Date = null;
        minDate: Date = null;
        maxDate: Date = null;
      

        openDatepicker() {
            this.isOpen = true;
            setTimeout(() => {
                this.isOpen = false;
            }, 1000);
        }
        /**end of md2 component */
  constructor(private oaoService: OAOService,private router: Router,private fb: FacebookService,private datePipe: DatePipe,public route: ActivatedRoute)
  {
        this.oaoService.getConfig()
            .subscribe((data) => { this.configMsg = JSON.parse(JSON.stringify(data.data)); 
            console.log(this.configMsg)});
    
    this.model= this.oaoService.getPersonalDetailsObject();
    console.log("HomeComponent constructor()");
    fb.init({
      appId: '658955644261049',
      version: 'v2.8'
    });
  }//constructor

    //facebook login
    private handleError(error) {
        console.error('Error processing action', error);
    }
    resolved(captchaResponse: string) {
    console.log(this.myForm);
    this.myForm=true;
    console.log(`Resolved captcha with response ${captchaResponse}:`);
    }
    private login() {
       console.log('Initializing Facebook');
       this.fb.login()
          .then((res: LoginResponse) => {
            console.log('Logged in', res);
         //to get profile data
         this.fb.api('/me','get', {fields:['first_name','last_name','birthday','id','email','location']})
      .then((res: any) => {
        console.log('Got the users profile', res);
        this.oaoService.setFbData(true);
        this.processFBdata(res);
      })
      .catch(this.handleError);
      })
      .catch(this.handleError);
  }

   private processFBdata(data)
    {
                  if(data.first_name==null){}else{this.model.fname=data.first_name;}
                  if(data.last_name==null){}else{this.model.lname=data.last_name;}
                  if(data.email==null){}else{this.model.email=data.email;}
                  if(data.birthday==null){}else{this.model.dob=data.birthday;}
                  if(data.location==null){}else{this.model.address=data.location;}
                    this.oaoService.setData(this.model);
                    this.FbData=this.oaoService.getFbData();
                    this.modal.aus_citizen=true;
                    this.modal.age_test=true;
                    jQuery('#savingsaccount-modal').modal('show');

    }
onSearch(appRef:string){
    console.log(appRef);
var formatedDate = this.datePipe.transform(this.date_v,'MM/dd/yyyy');
        console.log('Formated date id Check',formatedDate);
        this.date_v = formatedDate;
        if(appRef!=null && appRef!='' && appRef!=undefined &&  this.date_v!=null && this.date_v!='' && this.date_v!=undefined){
    this.oaoService.sendOTP(appRef,formatedDate).subscribe(
            data => {
                 console.log(data)
                 if(data.success==true){
                 this.model=data.result;
                 this.oaoService.setPersonalDetailsObject(this.model);
                 this.timer = Observable.timer(1000,1000);
                  this.sub = this.timer.subscribe(t => this.tickerFunc(t));
                }else{
                    this.wrongDetails_v=true;
                }
            });
        }else{
            this.wrongDetails_v=true;
        }
}
tickerFunc(tick){
        this.ticks -=1
        if(this.ticks<=0){
            this.sub.unsubscribe();
            this.resend=true
            this.ticks=60;
        }
    }
onVerify(verify:number){
    console.log(verify);
    this.oaoService.checkOTP(verify).subscribe(
            data => {
                 console.log(data)
                 if(data.success==true){
                     var sec_v= "";                     
                     var prod_t=this.model.product_code;
                     console.log(prod_t)
                     for (var i = 1; i <= this.model.no_of_section; i++) {
                         console.log(this.model);
                            var sec = "section_" + i;
                            var prod_code= "section_" + prod_t;
                            console.log(prod_code)
                            if (this.model[prod_code][0][sec] == false) {
                              console.log(sec);
                              sec_v = sec;
                              console.log(sec_v)
                              break;
                            }
                    }
                    console.log(this.configMsg)
                    console.log(this.configMsg[prod_t])
                     console.log(sec_v)
                    console.log(this.configMsg[prod_t][sec_v].route_v)
                    if(sec_v!= ""){
                     var link=this.configMsg[prod_t][sec_v].route_v;
                     let routeTo="completeInformation/"+link;
                     console.log(routeTo);
                     this.router.navigate(['/'+routeTo]);
                    }
                 }
             });
}

    private ngOnInit() //to active model and hide the buttons  while coming from login page
    {
        console.log("HomeComponent ngOnInit()");
        console.log("Checking the user type:");
        this.userExistingFlag=this.oaoService.getUserExistingFlag();
        if(this.userExistingFlag)
        {
            console.log("Existing user");
            this.GetUserDetails(); //get the all details of user by sending user name
        }
        else{
            //window.location.reload();
            console.log("New user");
        }
  }
   ngAfterViewInit(){
         this.route.params.subscribe(params => {
        let app_id = params['appid'];
		let prod_type = params['prod_type'];
		let CampID = params['CampID'];
		if(prod_type!=null && prod_type!='' && prod_type!=undefined && CampID!=null && CampID!='' && CampID!=undefined){
			console.log(prod_type+"\t"+CampID)
			this.model.campaign_id=CampID;
			this.setModalType(prod_type);
		}
		
        
    if(app_id!=null && app_id!='' && app_id!=undefined){
       
                 jQuery('#resume-modal').modal('show');
             jQuery('#appRef').val(app_id);
          
         
       } 
    }
        );
  }

  private loginFlag()
  {
      this.oaoService.setLoginFlag(true);
  }

  private GetUserDetails()
  {
      console.log("GetUserDetails()");
       this.oaoService.GetLoginUserDetails(this.oaoService.getUserDetailsObject()).subscribe(
            data => {
                var name=data.result.fName;
                name = name.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                 return letter.toUpperCase();});
                this.fName=name;
                if(parseInt(data.result.age)<18)
                {
                    jQuery('#not_eligible-modal').modal('show');
                }
                else
                {
                    this.model.title=data.result.title;
                    this.model.fname=name;         
                    this.model.mname=data.result.mName;
                    this.model.lname=data.result.lName;
                    this.model.dob=data.result.dob;
                    this.model.mobile=data.result.mobile;
                    this.model.email=data.result.email;
                    this.model.address=data.result.homeAddress;
                    this.model.paddress=data.result.postalAddress;
                    this.model.tfn=data.result.TFN;
                    this.model.exemption=data.result.exemptionReason;
                     this.model.core_customer_id=data.result.userId;
                    this.oaoService.setPersonalDetailsObject(this.model);
                    this.router.navigate(['/completeInformation']);
                }
            });
  }
//once user selected the product type(type of account)
    private setModalType(prod_code: string)
    {
        console.log("setModalType():"+prod_code);
        this.model.product_code=prod_code;
		    this.img=prod_code;
        this.oaoService.GetPropertyDetails('commonCodes','PRODUCT_TYPE')
        .subscribe(
           data =>{
              var count   =   Object.keys( data.result ).length;
              for(var i = 0; i < count; i++)
              {
                   if(data.result[i].property_value=== this.model.product_code)
                   {
                       this.model.product_type=data.result[i].property_desc;
                       this.oaoService.setPersonalDetailsObject(this.model); //setting the values
                   }
                }//for
            });
        jQuery('#savingsaccount-modal').modal('show');
    }

   private setFalse(){
        this.modal.age_test=false;
        this.modal.aus_citizen=false;
        this.dis_v=true;
        this.logout(); //chandan
    }

    private logout()
    {
        if(this.userExistingFlag)
        {
            this.oaoService.setUserExistingFlag(false);
            this.userExistingFlag=false;
            this.oaoService.logout().subscribe(
            data => {console.log(data);});
            console.log("loged out");
        }

    }

}
