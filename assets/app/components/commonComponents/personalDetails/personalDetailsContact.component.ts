import { Component ,AfterViewInit,OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router'

import { google } from "../../../interfaces/configinterface";
import { ConfigDetails } from "../../../interfaces/configinterface";
import { OAOService } from "../../../services/OAO.Service"
import { FirstNameValidator } from "../../../validators/namevalidator"
import { FormGroup, FormControl, Validators, NgForm } from "@angular/forms";
import { Common } from '../../../validators/commonFunc';
import { DatePipe } from '@angular/common';
import { PersonalDetailsObject } from "../../../interfaces/personalDetails.interface";
import { CommonUtils } from '../../../validators/CommonUtils';




declare var jQuery:any;
declare var Ladda
@Component({
    selector: 'personaldetailscontact',
    templateUrl: './personalDetailsContact.component.html'

})
export class PersonalDetailsContactComponent implements AfterViewInit,OnInit{
    public application_id:any;

        private check:boolean=false;//to display modal
        private hold:boolean=false;
        public  state_drop: String[] = [];
        public  street: String[] = [];
        public showAddress:String="true"
        public showCustomAddr:String="true"
        public showCustomPAddr:String="true"
        public inf_001:String
        public wrn_001:String
        configMsg:ConfigDetails
       isLoading: boolean = false;
	   public paddrShow:boolean = false;
       public addrErr=false;
       public paddrErr=false;
        public no_address_found_flag:string

        model = new PersonalDetailsObject('','','','','','','');
        userExistingFlag:boolean; //chandan  //No changes in html page
        checkDupStatus:boolean=false; //chandan
        private forwardProgressDataEVR = ['completed','active','','','Y','N'];
        private backwardProgressDataEVR = ['active','','','','N','N'];

        private forwardProgressDataHML = ['completed','active','','Y','N'];
        private backwardProgressDataHML = ['active','','','N','N'];

        private forwardProgressDataPRL = ['completed','active','','Y','N'];
        private backwardProgressDataPRL = ['active','','','N','N'];

            constructor(private oaoService:OAOService,private router: Router, private route: ActivatedRoute)
            {
                console.log("PersonalDetailsContactComponent  constructor()")
                this.model=this.oaoService.getPersonalDetailsObject();
				   if(this.model.postcode==undefined){
                    this.model.postcode="1234";
                    
                }
				   if(this.model.ppostcode==undefined){
                   
                    this.model.ppostcode="1234";
                }
                console.log(this.oaoService.getPersonalDetailsObject())
                this.no_address_found_flag="N";
                this.userExistingFlag=this.oaoService.getUserExistingFlag(); //chandan
                this.oaoService.getConfig()
                        .subscribe((data) => {this.configMsg=JSON.parse(JSON.stringify(data.data));});

            }

        onSubmit(){
                    console.log("onsubmit()")
                    if(this.userExistingFlag){
                        console.log("existing user directly creating appliction")
                        this. submitSection();
                    }
                    else{
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
            }
    changeCallMatchingCustomerFlag()
    {
       this.oaoService.setCallMatchingCustomerFlag(false);
        console.log("CallMatchingCustomerFlag changed to:false")
    } 
    submitSection()
    {
        this.isLoading = !this.isLoading;
        this.model.no_address_found_flag=this.no_address_found_flag;
               
                   if(this.model.postcode!=null && this.model.postcode!='1234' && (this.model.housenum!=undefined || this.model.housenum!=null)){
                       this.addrErr=false;
                       if(this.no_address_found_flag=='Y'){
             this.model.address=this.model.streetnum+" "+ this.model.streetname+" "+ this.model.suburb+" "+ this.model.state+" "+ this.model.postcode;
            }
        }else{
            this.isLoading=false
                this.addrErr=true;
                return
            }
        
        
                   if((this.model.ppostcode!=null && this.model.ppostcode!='1234') || this.model.postal_home_address_flag==true){
                        this.paddrErr=false;
                        if(this.paddrShow==true && this.model.postal_home_address_flag==false){
             this.model.paddress=this.model.pstreetnum+" "+ this.model.pstreetname+" "+ this.model.psuburb+" "+ this.model.pstate+" "+ this.model.ppostcode;
            }
        }
            else{
                this.isLoading=false
                this.paddrErr=true;
                return
            }
        
           if( this.model.postal_home_address_flag==true){
                this.paddrErr=false;
            this.model.phousenum=this.model.housenum;
            this.model.pstreetnum=this.model.streetnum;
            this.model.paddress=this.model.address;
            this.model.pstreetname=this.model.streetname;
            this.model.ppostcode=this.model.postcode;
            this.model.pstate=this.model.state;
           }
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
                                                            this.router.navigate(["../taxInformation"], {relativeTo:this.route});
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
                                                            this.oaoService.setProgressBardata(this.forwardProgressDataHML);
                                                            this.router.navigate(['../propertyDetails'], {relativeTo:this.route});
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
                                                            this.oaoService.setProgressBardata(this.forwardProgressDataPRL);
                                                            this.router.navigate(['../personalLoanDetails'], {relativeTo:this.route});
                                                    }
                                        		});
                                                break;
                                default:  console.log("Page not found");

            }
            //this.application_id=this.model.application_id;
            //localStorage.setItem('application_id',this.application_id); //for fb
        }//submitSection1

                    // getAddress(str:google){
                    //     this.model.address=str.formatted_address;
                    // }
                    showCustomAddressFields(){
                         this.addrErr=false;
                            this.showCustomAddr="";
                            this.no_address_found_flag="Y";
                            this.model.address='';
                            this.model.streettype='';
                            this.model.suburb='';
                       }
                    showCustomPostalAddressFields(){
                         this.paddrErr=false;
                            this.showCustomPAddr="";
                            this.no_address_found_flag="Y";
							this.paddrShow=true;
                            this.model.paddress='';
                            this.model.pstreettype='';
                            this.model.psuburb='';
                    }
                    hideaddress(){
                        this.showCustomAddr="true";
                        this.model.address='';
                        this.no_address_found_flag="N";
                    }
                    hidePaddress(){
                        this.showCustomPAddr="true";
                        this.paddrShow=false;
                        this.model.paddress='';
                        this.no_address_found_flag="N";
                    }

                showSave(){
                if(this.check==true){
                     this.router.navigate(["../taxInformation"], {relativeTo:this.route});
                   }
                }


                   ngAfterViewInit(){
                            var saveFlag=false;
                            jQuery(".saveClose").click(function() {
                                    saveFlag=true;
                                   });
                   }


            ngOnInit(){
                 CommonUtils.trimWhiteSpacesOnBlur();
                    this.isLoading =false;
                    this.showAddress=""
                    this.hold=true;
                        jQuery('input:visible:first').focus();
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
                        this.oaoService.GetPropertyDetails('commonCodes','STATE')
                                .subscribe(
                                            data =>{
                                                var count   =   Object.keys( data.result ).length;
                                                    for(var i = 0; i < count; i++){
                                                        this.state_drop.push(data.result[i].property_desc)
                                                    }
                                            }
                                );
                        this.oaoService.GetPropertyDetails('commonCodes','STREET_TYPE')
                                .subscribe(
                                            data =>{
                                                var count   =   Object.keys( data.result ).length;
                                                    for(var i = 0; i < count; i++){
                                                        this.street.push(data.result[i].property_desc)
                                                    }
                                            }
                                );


                 //for fb data
                if (this.oaoService.getFbData() == true) {
                    this.model = this.oaoService.getData();
                }
                 if(this.model.address!=null || this.model.paddress!=null){
                       this.showAddress=""
                       this.hold=true;
                }
                      }

         updateSection(){
             if(this.model.product_code == 'EVR')
             this.oaoService.setProgressBardata(this.backwardProgressDataEVR);

              if(this.model.product_code == 'HML')
             this.oaoService.setProgressBardata(this.backwardProgressDataHML);

              if(this.model.product_code == 'PRL')
             this.oaoService.setProgressBardata(this.backwardProgressDataPRL);
             
            //   this.router.navigate(["../personalBasicInfo"], {relativeTo:this.route});
            this.oaoService.updatesection("section_1",this.model.application_id).subscribe(
                                    data =>{
                                        console.log(data);
                                         console.log("updated");
                                         this.router.navigate(["../personalBasicInfo"], {relativeTo:this.route});
                                    });

        }


		 laddaclose(){
            this.isLoading=false;
        }

}
