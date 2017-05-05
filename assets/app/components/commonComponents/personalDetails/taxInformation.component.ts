import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { PersonalDetailsObject } from "../../../interfaces/personalDetails.interface";
import { ConfigDetails } from "../../../interfaces/configinterface";
import { OAOService } from "../../../services/OAO.Service"
declare var jQuery: any;
declare var Ladda
@Component({
    selector: 'taxinfo',
    templateUrl: './taxInformation.component.html'

})
export class TaxInformationComponent implements OnInit {
    tfnval = '';
    reasonval = '';
    public items: any[] = [];
  
   
    private check: boolean = false;
    private hold: boolean = false;
    public idCheck_v: String;
    public wrn_002: String;
    public wrn_003: String;
    public inf_002: String;
    public inf_003: String;
    public skip: boolean = false;
    public section_2: Boolean;
    prod_type: string
    err: string;
    prod_code: string;
    configMsg: ConfigDetails
    NA: string;
    isLoading: boolean = false;
    userExistingFlag:boolean; //chandan
    model = new PersonalDetailsObject('', '', '', '', '', '', '');
    private forwardProgressDataEVR = ['completed','completed','active','','Y','N'];
    private moveToNetBankRegDataEVR = ['completed','completed','completed','active','Y','N','Y'];
    private backwardProgressDataEVR = ['active','','','','N','Y'];

    constructor(private oaoService: OAOService, private router: Router, private route: ActivatedRoute)
     {  
        console.log("TaxInformationComponent constructor()")
        this.model=this.oaoService.getPersonalDetailsObject();
        if((this.model.exemption!=undefined || this.model.exemption!=undefined)&&(this.model.tfn==null||this.model.tfn==''||this.model.tfn==undefined)){
            console.log("inside tfn dissable")
            console.log(this.model.exemption!='0');
            this.reasonval="abc";
        }
        this.userExistingFlag=this.oaoService.getUserExistingFlag(); //chandan     
        this.NA = null;      
        this.oaoService.getConfig()
            .subscribe((data) => {
            this.configMsg = JSON.parse(JSON.stringify(data.data));
            });
    }

    tfnfunc(event: any) { // without type info
           console.log("tfnfunc()")
        this.tfnval = event.target.value;
        // this.model.exemption = '0'
        // this.err = "";
    }

    reasonfunc(event: any) { // without type info
        console.log("reasonfunc()")
        if (event.target.value == '0') {
            this.reasonval = '';
            // this.err = "";
            // this.model.exemption = '0'
        }
        else {
            this.reasonval = event.target.value;
            // this.model.exemption = '0'
            // this.err = "";
        }

    }
    clear() 
    {
        this.oaoService.setPersonalDetailsObject(null);
        this.oaoService.setLoginFlag(false);//chandan
        this.oaoService.setUserExistingFlag(false);//chandan
    }

    reload(){
         window.location.reload();
    }
    onSubmit() {
         this.isLoading=!this.isLoading;
           if (this.model.skip == false) {
            this.model.skip = false;
        } else {
            this.model.skip = true;
        }
         
        if ((this.model.tfn == null || this.model.tfn == "") && this.model.exemption == '0') {
            this.err = "err";
            return;
        } 
        else {
            this.oaoService.setPersonalDetailsObject(this.model);
            this.oaoService.OAOCreateOrUpdateApplicant(this.model)
                .subscribe(
                data => {
                    // this.oaoService.setData(data.Result);
                    this.check = true;
                    if (this.idCheck_v == "O") 
                    {
                        if(this.userExistingFlag)
                        { 
                            this.getAccno();
                        }else
                        {
                             this.showSave();
                        } 
                    } 
                    else if (this.idCheck_v == "M") 
                    {
                        if(this.model.product_code == 'EVR')
                        this.oaoService.setProgressBardata(this.forwardProgressDataEVR);

                        this.router.navigate(["../onlineIdCheck"], {relativeTo :this.route});
                    } 
                    else
                    {
                        this.getAccno();
                    }
                });
        }
    }

    showSave() {
        if (this.check == true) {
            jQuery('#onlineid-check').modal('show');
        }
    }
    updateSection() {
        if(this.model.product_code == 'EVR')
    	this.oaoService.setProgressBardata(this.backwardProgressDataEVR);
       // this.router.navigate(['../personalContactInfo'], {relativeTo: this.route});
        this.oaoService.updatesection("section_2", this.model.application_id).subscribe(
            data => {
                console.log("updated");
                this.router.navigate(["../personalContactInfo"], {relativeTo: this.route});
            }
        );
    }

    ngOnInit() {
		jQuery('input:visible:first').focus();
        jQuery('#mlogin').hide();//chandan
        
        this.oaoService.GetPropertyDetails('commonCodes', 'EXRSN')
            .subscribe(data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.items.push({
                        prop_desc: data.result[i].property_desc,
                        prop_val: data.result[i].property_value
                    })
                }
            });
     
                this.model.skip = this.skip;
        //chandan
            if(this.userExistingFlag){
                    jQuery('#reb').hide();//chandan
                    jQuery('#mlogin').show();//chandan
                    jQuery('#exemption').attr("style", "pointer-events: none;");
                    jQuery('#tfn').attr('readonly', 'true');
            }
        //chandan
                if (this.model.exemption == null) {
                    this.NA = null;
                    this.model.exemption = '0'
                }
                this.oaoService.setPersonalDetailsObject(this.model);
        //for idCheck
        this.oaoService.GetPropertyDetails('turnOnOff', 'idCheck')
            .subscribe(
            data => {
                this.idCheck_v = data.result[0].property_value;
                console.log(data)
            }
            );
        //warning message 002
        this.oaoService.GetPropertyDetails('WARN_MESSAGE', 'WRN_002')
            .subscribe(
            data => {
                this.wrn_002 = data.result[0].property_value;
            }
            );
        //warning message 003
        this.oaoService.GetPropertyDetails('WARN_MESSAGE', 'WRN_003')
            .subscribe(
            data => {
                this.wrn_003 = data.result[0].property_value;
            }
            );
        //Info message 002
        this.oaoService.GetPropertyDetails('INFO_MESSAGE', 'INF_002')
            .subscribe(
            data => {
                this.inf_002 = data.result[0].property_value;
            }
            );
             this.oaoService.GetPropertyDetails('INFO_MESSAGE', 'INF_003')
            .subscribe(
            data => {
                this.inf_003 = data.result[0].property_value;
            }
            );
    }//ngOnInit

    getAccno() 
    {
        // this.model=this.oaoService.getData();
        this.model.skip = true;
        // this.onSubmit(this.model);
        this.model.app_id = this.model.application_id;

        this.oaoService.OAOCreateOrUpdateApplicant(this.model)
            .subscribe(
            data => {
                this.oaoService.GetApplicantsDetail(this.model.application_id)
                    .subscribe(
                    data => {
                        console.log("Account Details:")
                        console.log(data.result[0])
                        this.model = data.result[0];
                        this.oaoService.setPersonalDetailsObject(this.model);
                        if (this.idCheck_v == "O") {
                            jQuery('#success').modal('show');
                        }
                        if (this.idCheck_v == "N") {
                            jQuery('#success').modal('show');
                        }
                    });
            });


        }//getAccno() 

        moveForward(){
            if(this.model.product_code == 'EVR')
            this.oaoService.setProgressBardata(this.forwardProgressDataEVR);
        }

        moveToNetBankingReg(){

            if(this.model.product_code == 'EVR')
            this.oaoService.setProgressBardata(this.moveToNetBankRegDataEVR);
        }

}