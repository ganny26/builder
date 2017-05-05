import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PersonalDetailsObject } from "../../interfaces/personalDetails.interface";
import { ConfigDetails } from "../../interfaces/configinterface";
import { OAOService } from "../../services/OAO.Service"

declare var jQuery: any;
declare var Ladda
@Component({
    selector: 'onlineidcheck',
    templateUrl: './onlineIdCheck.component.html',
	providers: [DatePipe]

})
export class OnlineIdCheckComponent implements OnInit {
    model = new PersonalDetailsObject('', '', '', '', '', '', '');
    public items: any[] = [];
    public cardColor: any[] = [];
    public state: any[] = [];
    private check: boolean = false;
    idCheck_v: String;
    public inf_002: String;
    public inf_006: String;
    public inf_007: String;
    public passport_check: String;
     public DL_check: String;
      public Medicare_check: String;
    max_year: Number;
    public inf_003: String;
    public wrn_002: String;
    application_id: any;
    configMsg: ConfigDetails
    prod_type: string;
    prod_code: string;
    public inf_loan: string;
    date_v = new Date();
     isLoading: boolean = false;
	 
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
        maxDate: Date = this.today;


        enableDates: Array<Date> = [
            new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - 7),
            new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - 1),
            new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() + 5),
            new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() + 7),
            new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() + 8)
        ];
        disableDates: Array<Date> = [
            new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - 2),
            new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - 1),
            new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() + 2),
            new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() + 5),
            new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() + 9)
        ];
        disableWeekDays: Array<number> = [0, 6];
        private forwardProgressDataEVR = ['completed','completed','completed','active','Y','N'];
        private backwardProgressDataEVR = ['completed','active','','','N','Y'];

        private forwardProgressDataHML = ['completed','completed','active','Y','N'];
        private backwardProgressDataHML = ['completed','completed','active','N','N'];

        private forwardProgressDataPRL = ['completed','completed','active','Y','N'];
        private backwardProgressDataPRL = ['completed', 'completed', 'active','N','N'];
       

        openDatepicker() {
            this.isOpen = true;
            setTimeout(() => {
                this.isOpen = false;
            }, 1000);
        }
        /**end of md2 component */
		
    constructor(private oaoService: OAOService, private router: Router,private datePipe: DatePipe, private route: ActivatedRoute) {
                
                console.log("OnlineIdCheckComponent constructor()")
                this.model=this.oaoService.getPersonalDetailsObject();
                console.log(this.oaoService.getPersonalDetailsObject())
                this.prod_code=this.model.product_code;
                
        this.max_year = 0;
        this.oaoService.getConfig()
            .subscribe((data) => {
            this.configMsg = JSON.parse(JSON.stringify(data.data));
            }
            );



    }
 onidcheck() {
     
     console.log("onidcheck()");
         this.isLoading = !this.isLoading;
        
         this.model.skip = true;
		//  var formatedDate = this.datePipe.transform(this.model.validTo,'MM/dd/yyyy');
        //  console.log('Formated date id Check',formatedDate);
        //  this.model.validTo = formatedDate;

         console.log("Rajath")
    

                this.oaoService.onlineIdcheck(this.model)
                    .subscribe(
                    data => {
                         if(data.pass=="success" || data.dl=="success"|| data.mc=="success")
                         {
                            this.passport_check=data.pass
                            this.DL_check=data.dl
                            this.Medicare_check=data.mc
                            jQuery('#onlineidcheck').modal('show');
                        }
                        else if(data.server=="error"){
                             jQuery('#servererror').modal('show');
                        }
                         else
                         {
                            this.passport_check="passport not verified"
                            this.DL_check="Dl not verified"
                            this.Medicare_check="medicare not verified"
                                jQuery('#error').modal('show');
                         }
                    }
                    );
 }

    onSubmit() {
        this.model.skip = true;
        //  this.oaoService.OAOCreateOrUpdateApplicant(formRecord)
        //         .subscribe(
        //             data => {
        // 		// this.oaoService.setData(data.Result);
        //             console.log("data"+JSON.stringify(data));
        //             if(this.prod_code=='EVR'){
        //                     this.check=true;
        //                     this.showSave();
        //                 }else{
        //                      this.successLoan();
        //                 }
        // 			});


        switch (this.model.product_code) {

            case 'EVR': this.oaoService.OAOCreateOrUpdateApplicant(this.model)
                .subscribe(
                data => {
                    // this.oaoService.setData(data.Result);
                    this.check = true;
                    this.showSave();
                }
                );
                break;
            case 'HML': this.oaoService.OAOCreateOrUpdateHomeloanApplicant(this.model)
                .subscribe(
                data => {
                    // this.oaoService.setData(data.Result);
                    this.successLoan();
                }
                );
                break;
            case 'PRL': this.oaoService.OAOCreateOrUpdatePersonalloanApplicant(this.model)
                .subscribe(
                data => {
                    // this.oaoService.setData(data.Result);
                    this.successLoan();
                }
                );
                break;
            default: console.log("Page not found");

        }
    }


    showSave() {
        if (this.check == true) {
            this.oaoService.GetApplicantsDetail(this.model.application_id)
                .subscribe(
                data => {
                    this.model = data.result[0];
                    localStorage.clear();
                    jQuery('#success-1').modal('show');
                });

        }
    }
    public inf_code: string = '';
    successLoan() {
        if (this.model.product_code == 'HML') {
            this.inf_code = 'INF_004'
        } else {
            this.inf_code = 'INF_005'
        }
        //Info message 004
        this.oaoService.GetPropertyDetails('INFO_MESSAGE', this.inf_code)
            .subscribe(
            data => {
                this.inf_loan = data.result[0].property_value;
                jQuery('#success_loan').modal('show');
            }
            );

    }

    ngOnInit() {
        
                if (this.model.idstate == null) {
                    this.model.idstate = '0';
                }
                if (this.model.color == null) {
                    this.model.color = '0';
                }
                if (this.model.DLidState == null) {
                    this.model.DLidState = '0';
                }
       

        this.oaoService.GetPropertyDetails('commonCodes', 'COUNTRY')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.items.push({
                        prop_desc: data.result[i].property_desc,
                        prop_val: data.result[i].property_value
                    })
                }
                this.items.sort();
            }
            )

        this.oaoService.GetPropertyDetails('commonCodes', 'CRDCLR')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.cardColor.push({
                        prop_desc: data.result[i].property_desc,
                        prop_val: data.result[i].property_value
                    })
                }
            }
            )

        this.oaoService.GetPropertyDetails('commonCodes', 'STATE')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.state.push({
                        prop_desc: data.result[i].property_desc,
                        prop_val: data.result[i].property_value
                    })
                }
            }
            );

        this.oaoService.GetPropertyDetails('turnOnOff', 'idCheck')
            .subscribe(
            data => {
            this.idCheck_v = data.result[0].property_value
                console.log(this.idCheck_v)
            }
            );
        //Info message 003
        this.oaoService.GetPropertyDetails('INFO_MESSAGE', 'INF_003')
            .subscribe(
            data => {
                this.inf_003 = data.result[0].property_value;
            }
            );
        //Info message 002
        this.oaoService.GetPropertyDetails('INFO_MESSAGE', 'INF_002')
            .subscribe(
            data => {
                this.inf_002 = data.result[0].property_value;
            }
            );
         //Info message 006
        this.oaoService.GetPropertyDetails('INFO_MESSAGE', 'INF_006')
            .subscribe(
            data => {
                this.inf_006 = data.result[0].property_value;
            }
            );
         //Info message 007
        this.oaoService.GetPropertyDetails('INFO_MESSAGE', 'INF_007')
            .subscribe(
            data => {
                this.inf_007 = data.result[0].property_value;
            }
            );
        this.oaoService.GetPropertyDetails('GENERIC_PROP', 'VALID_TO_MEDI')
            .subscribe(
            data => {
                this.max_year = data.result[0].property_value;
                console.log(this.max_year);
            }
            );

         this.oaoService.GetPropertyDetails('WARN_MESSAGE', 'WRN_002')
            .subscribe(
            data => {
                this.wrn_002 = data.result[0].property_value;
            }
            );

    }//ngOnInit

    getAccno() {
        console.log("in acc")
        // this.model=this.oaoService.getData();
        this.model.skip = true;
        // this.onSubmit(this.model);
        this.model.app_id = this.model.application_id;

        console.log(this.model)
        this.oaoService.OAOCreateOrUpdateApplicant(this.model)
            .subscribe(
            data => {
                // this.oaoService.setData(data.Result);
                //  this.model=this.oaoService.getData();
                this.oaoService.GetApplicantsDetail(this.model.app_id)
                    .subscribe(
                    data => {
                        this.model = data.result[0];
                        //localStorage.clear();
                        jQuery('#success').modal('show');
                    });

            }
            );


    }


    updateSection() {
         this.oaoService.updatesection("section_3",this.model.application_id).subscribe(
            data => {
        
                switch (this.model.product_code) {

                    case 'EVR': this.oaoService.setProgressBardata(this.backwardProgressDataEVR);
                                this.router.navigate(["../taxInformation"], {relativeTo: this.route});
                                break;
                    case 'HML': this.oaoService.setProgressBardata(this.backwardProgressDataHML);
                                this.router.navigate(['../assets'],{relativeTo:this.route});
                                  break;
                    case 'PRL': this.oaoService.setProgressBardata(this.backwardProgressDataPRL);
                                this.router.navigate(['../assets'],{relativeTo:this.route});
                                 break;
                    default: console.log("Page not found");

                } 

    });
    }

    dispDate(validto: any) {
        this.model.validTo = validto;
    }
    ngAfterViewInit() {

        var mon = this.date_v.getMonth() + 1;
        var year = this.date_v.getFullYear();
        this.model.validTo = this.date_v.getDate() + "/" + mon + "/" + year;
        var options = {
            format: "dd/mm/yyyy"
        }
        if (jQuery('.datepicker') && jQuery('.datepicker').length) {
            jQuery('.datepicker').dateDropper(options);
        }
        jQuery('body').on('change', '#validTo', function () {
            jQuery('#validTo').trigger('click');
        });
    }
    clear() {
        window.location.reload();
        localStorage.clear();
    }

    back(){
        this.isLoading=false;
    }
    

    moveForward(){
        if(this.model.product_code === 'EVR')
        this.oaoService.setProgressBardata(this.forwardProgressDataEVR);

        if(this.model.product_code === 'HML')
        this.oaoService.setProgressBardata(this.forwardProgressDataHML);

        if(this.model.product_code === 'PRL')
        this.oaoService.setProgressBardata(this.forwardProgressDataPRL);
    }
}