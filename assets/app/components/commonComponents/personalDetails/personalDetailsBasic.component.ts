import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PersonalDetailsObject } from "../../../interfaces/personalDetails.interface";
import { ConfigDetails } from "../../../interfaces/configinterface";
import { OAOService } from "../../../services/OAO.Service"
import { FirstNameValidator } from "../../../validators/namevalidator"
import { FormGroup, FormControl, Validators, NgForm } from "@angular/forms";
import { Common } from '../../../validators/commonFunc';
import { DatePipe } from '@angular/common';
import { CommonUtils } from '../../../validators/CommonUtils';
declare var jQuery: any;
declare var Ladda: any;
@Component({
    selector: 'personaldetailsbasic',
    templateUrl: './personalDetailsBasic.component.html',
	providers: [DatePipe]
})
export class PersonalDetailsBasicComponent implements AfterViewInit, OnInit {
    public details: any;
    public items: number[] = [];
    public application_id: any;
    date_v = new Date();
    min_year: Number;
    max_year: Number;
    min_age: number;
     public inf_001:String
    configMsg: ConfigDetails
    test: boolean
    prod_code: string
    singleORjoint: string
    myForm: FormGroup;
    isLoading: boolean = false;
    private hold:boolean=false;
    private check:boolean=false;//to display modal
    checkDupStatus:boolean=false; //chandan
    userExistingFlag:boolean; //chandan
    public wrn_001:String;
    model = new PersonalDetailsObject('', '', '', '', '', '', '');

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

      private mode: string = 'auto';
      private  modes: Array<any> = [
            { text: 'Auto', value: 'auto' },
            { text: 'Portrait', value: 'portrait' },
            { text: 'Landscape', value: 'landscape' }];

        container: string = 'inline';
        containers: Array<any> = [
            { text: 'Inline', value: 'inline' },
            { text: 'Dialog', value: 'dialog' }];

        date: Date = null;
        minDate: Date = null;
        maxDate: Date =  new Date(this.today.getFullYear()-18, this.today.getMonth(), this.today.getDate());
        // enableDates: Array<Date> = [
        //     new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - 7),
        //     new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - 1),
        //     new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() + 5),
        //     new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() + 7),
        //     new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() + 8)
        // ];
        // disableDates: Array<Date> = [
        //     new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - 2),
        //     new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - 1),
        //     new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() + 2),
        //     new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() + 5),
        //     new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() + 9)
        // ];
        //disableWeekDays: Array<number> = [0, 6];
        private forwardProgressDataEVR = ['active','','','','N','N'];
        private backwardProgressDataEVR = ['','','','','N','Y'];
        private forwardProgressDataHML = ['active','','','N','N'];
        private backwardProgressDataHML = ['','','','N','Y'];
        private forwardProgressDataPRL = ['active','','','N','N'];
        private backwardProgressDataPRL = ['','','','N','Y'];

        openDatepicker() {
            this.isOpen = true;
            setTimeout(() => {
                this.isOpen = false;
            }, 1000);
        }
        /*end of md2 component */
    constructor(private oaoService: OAOService, private router: Router, private route: ActivatedRoute,private datePipe: DatePipe)
    {
        jQuery('#content1').css('overflow','hidden');
        console.log("PersonalDetailsBasic Component constructor()");
		this.oaoService.GetPropertyDetails('commonCodes', 'SAL')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.items.push(data.result[i].property_desc)
                }
            }
            );
        this.model=this.oaoService.getPersonalDetailsObject();
		if(this.model.postcode==undefined){
                    this.model.postcode="1234";
                    this.model.ppostcode="1234";
                }
             if(this.model.application_id!=undefined){
            this.hold=true;
        }   
        console.log(this.model);

        this.min_age = 0;
        this.test = false;
        this.date_v = new Date();
        this.oaoService.GetPropertyDetails('GENERIC_PROP', 'MIN_YEAR')
            .subscribe(
            data => {
                this.min_year = data.result[0].property_value;
            }
            );
        this.oaoService.GetPropertyDetails('GENERIC_PROP', 'DOB')
            .subscribe(data => {
                this.min_age = data.result[0].property_value;
                var mon = this.date_v.getMonth() + 1;
                var year = this.date_v.getFullYear() - this.min_age;
                this.max_year = year;
              });

             if(this.model.title===null || this.model.title===''){
                    this.model.title='0';
            }

        this.oaoService.getConfig()
            .subscribe((data) => { this.configMsg = JSON.parse(JSON.stringify(data.data)); });
    }

    private onSubmit()
    {
         var formatedDate = this.datePipe.transform(this.model.dob,'MM/dd/yyyy');
        this.model.dob = formatedDate;
                    console.log("onsubmit()")
                    if(this.userExistingFlag){
                        console.log("existing user directly creating appliction")
                        this.model.existing_cust_status="Y";
                        this. submitSection();
                    }
                    else{
                         this.model.existing_cust_status="N";
                        console.log("New  user ")
                        if(!this.oaoService.getCallMatchingCustomerFlag())
                        {
                            console.log("checkMatchingCustomer() called");
                            this.oaoService.checkMatchingCustomer(this.model)
                            .subscribe(data =>
                                {
                                    if(data.status){
                                        jQuery('#matching-customer-modal').modal('show');
                                     }
                                     else{
                                        this.oaoService.setCallMatchingCustomerFlag(true);
                                        this. submitSection();
                                    }
                                });    
                        }
                        else{
                            console.log("checkMatchingCustomer() not called");
                            this. submitSection();
                        }
                    }
                     
                    this.oaoService.setPersonalDetailsObject(this.model);
            }
    changeCallMatchingCustomerFlag()
    {
       this.oaoService.setCallMatchingCustomerFlag(false);
        console.log("CallMatchingCustomerFlag changed to:false")
    } 
    submitSection()
    {
        console.log("inside submit section");
        this.isLoading = !this.isLoading;
        this.model.app_id=this.model.application_id;
        this.oaoService.setPersonalDetailsObject(this.model);
                     switch(this.model.product_code){
                                case 'EVR':     this.oaoService.OAOCreateOrUpdateApplicant(this.model)
                                                    .subscribe(
                                                        data => {
                                                            this.model.application_id=data.Result.application_id;
                                                            this.oaoService.setPersonalDetailsObject(this.model);
                                                    this.check=true
                                                          if(this.hold==false)
                                                            {
                                                                this.showSave();
                                                            }
                                                        if(this.hold==true)
                                                        {
                                                            this.oaoService.setProgressBardata(this.forwardProgressDataEVR);

                                                            this.router.navigate(['../personalContactInfo'], {relativeTo:this.route});
                                                        }
                                        		});
                                                break;
                                case 'HML':    this.oaoService.OAOCreateOrUpdateHomeloanApplicant(this.model)
                                                     .subscribe(
                                                        data => {
                                                            this.model.application_id=data.Result.application_id;
                                                            this.oaoService.setPersonalDetailsObject(this.model);
                                                    // this.oaoService.setData(data.Result);
                                                    this.check=true

                                                        if(this.hold==false){
                                                        this.showSave();
                                                        }
                                                        if(this.hold==true){
                                                           // this.router.navigate(['../personalContactInfo']);
                                                        }
                                        		});
                                                break;
                                case 'PRL':    this.oaoService.OAOCreateOrUpdatePersonalloanApplicant(this.model)
                                                     .subscribe(
                                                        data => {
                                                            this.model.application_id=data.Result.application_id;
                                                            this.oaoService.setPersonalDetailsObject(this.model);
                                                    this.check=true

                                                        if(this.hold==false){
                                                        this.showSave();
                                                        }
                                                        if(this.hold==true){
                                                            //this.router.navigate(['../personalContactInfo']);
                                                    }
                                        		});
                                                break;
                                default:  console.log("Page not found");

            }
            //this.application_id=this.model.application_id;
            //localStorage.setItem('application_id',this.application_id); //for fb
        }//submitSection1


  showSave(){
                if(this.check==true){
                    jQuery('#success').modal('show');
                   }
                }

	 laddaclose(){
            this.isLoading=false;
        }


    ngOnInit()
    {
         CommonUtils.trimWhiteSpacesOnBlur();
        //for fb data
        if(this.oaoService.getFbData()==true){
            console.log("fb")
            this.model=this.oaoService.getData();
            if(this.model.title==null || this.model.title==''){
                    this.model.title='0';
            }
        }
         this.oaoService.GetPropertyDetails('INFO_MESSAGE','INF_001')
                                .subscribe(
                                    data =>{
                                         this.inf_001=data.result[0].property_value;
                                    }
                                );
           this.oaoService.GetPropertyDetails('WARN_MESSAGE','WRN_001')
                                .subscribe(
                                    data =>{
                                         this.wrn_001=data.result[0].property_value;
                                    }
                                );


         //chandan
        console.log("PersonaldetailsBasicComponent ngOnInit()")
        this.userExistingFlag=this.oaoService.getUserExistingFlag();
        if(this.userExistingFlag) //pre-populating userDetails
        {
            console.log("Existing User ");
            jQuery('#title').attr("style", "pointer-events: none;");
			 this.isDisabled=true;
            jQuery('#fname,#mname,#lname,#email,#mobile').attr('readonly', 'true');
        }
        else{
            console.log("New User")
        }
        //chandan

        this.test = true;
        

    }


    clear()
    {
        console.log("clear");
        if(this.model.product_code == 'EVR')
        this.oaoService.setProgressBardata(this.backwardProgressDataEVR);
        if(this.model.product_code == 'HML')
        this.oaoService.setProgressBardata(this.backwardProgressDataHML);
        if(this.model.product_code == 'PRL')
        this.oaoService.setProgressBardata(this.backwardProgressDataPRL);
        //this.oaoService.setUserExistingFlag(false);
        // window.location.reload();
    }
    dob_valid: number;
    dob_err: string;
    dispDate(dob: any) {
        this.model.dob = dob;
        // this.dob_valid=dob-this.min_age;
        // console.log(this.dob_valid)
        // if(this.dob_valid>=18){
        //     this.model.dob=dob;
        // }
    }
    ngAfterViewInit() {

       // jQuery('input:visible:first').focus();
          if(!this.userExistingFlag) 
        {
            jQuery('select:first').focus();
        }
        var options = {
            format: "dd/mm/yyyy",
        }
        if (jQuery('.datepicker') && jQuery('.datepicker').length) {
            jQuery('.datepicker').dateDropper(options);
        }
        jQuery('body').on('change', '#dob', function () {
            jQuery('#dob').trigger('click');
        });
    }


onClickOfPage1(){
    console.log("onClickOfPage1()");
 jQuery("#page1").animate({'marginTop':"-=45%"},"slow","linear");
}

    setForwardProgressData(){
        if(this.model.product_code == 'EVR')
        this.oaoService.setProgressBardata(this.forwardProgressDataEVR);
        if(this.model.product_code == 'HML')
        this.oaoService.setProgressBardata(this.forwardProgressDataHML);
        if(this.model.product_code == 'PRL')
        this.oaoService.setProgressBardata(this.forwardProgressDataPRL);
    }

}
