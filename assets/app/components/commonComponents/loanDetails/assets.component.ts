import { Component, OnInit } from '@angular/core';
import { Router ,ActivatedRoute} from '@angular/router';
import { Assetdetails } from "../../../interfaces/assetsInterface";
import { ConfigDetails } from "../../../interfaces/configinterface";
import { PersonalDetailsObject } from "../../../interfaces/personalDetails.interface";
import { OAOService } from "../../../services/OAO.Service";
import { CommonUtils } from '../../../validators/CommonUtils';
declare var jQuery: any;
@Component({
    selector: 'assets',
    templateUrl: 'assets.component.html'
})
export class AssetsComponent implements OnInit {
    model = new PersonalDetailsObject('', '', '', '', '', '', '');
    Assets: Assetdetails;
    liability_tab: boolean = false;
    public MaxLimit: Number;
    public assetsLength: Number;
    public LiabilitiesLength: Number;
    public assetsDetails: any;
    public LiabilitiesArray: any;

    public assetType: any[] = [];
    public liabilityType: any[] = [];
    public freqType: any[] = [];

    public application_id: any;
    public wrn_002: String;
    public inf_004: String;
    configMsg: ConfigDetails
  
    public idCheck_v: String;
    public inf_loan: string;
    finalSend: PersonalDetailsObject;
    isLoading:Boolean=false;
    userExistingFlag:boolean=false; //chandan 
    private forwardProgressDataHML = ['completed','completed','active','N','N'];
    private backwardProgressDataHML = ['completed','completed','active','N','N'];

    private forwardProgressDataPRL = ['completed','completed','active','N','N'];
    private backwardProgressDataPRL = ['completed','completed','active','N','N'];

    constructor(private oaoService: OAOService, private router: Router,private route:ActivatedRoute) {
        console.log("AssetsComponent  constructor()")
        this.model=this.oaoService.getPersonalDetailsObject();
        console.log(this.model);

        this.userExistingFlag=this.oaoService.getUserExistingFlag(); //chandan
        this.assetsDetails = [];
        this.LiabilitiesArray = [];
        this.model.assettype = "0";
        this.model.Liabilitiestype = "0";
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
     
                console.log("assets check")
                console.log(this.model.Liabilities);
                console.log(this.model.assets);
               
                if(this.model.assets!=undefined ){
                    this.assetsDetails = this.model.assets
                }
                if(this.model.Liabilities!=undefined ){
                     this.LiabilitiesArray = this.model.Liabilities
                }
                if (this.model.assettype == null) {
                    this.model.assettype = '0'
                }
                if (this.model.Liabilitiestype == null) {
                    this.model.Liabilitiestype = '0'
                }
                if (this.model.Payment_Frequency == null) {
                    this.model.Payment_Frequency = '0'
                }
        // this.Assets = new Assetdetails('','');


        this.oaoService.GetPropertyDetails('GENERIC_PROP', 'ASSET_LIABILITY_MAX')
            .subscribe(
            data => {
                //console.log(data.result[0].property_value);
                this.MaxLimit = data.result[0].property_value;
            }
            );
    }



    onSubmit() {
          console.log("onSubmit()")
        var assets = {
            'assettype': this.model.assettype,
            'assetvalue':  this.model.assetvalue
        };
        var assetvalue =  this.model.assetvalue.replace(/\,/g, "");
         this.model.assetvalue = assetvalue;
        if (this.assetsLength <= this.MaxLimit) {
            this.assetsDetails.push(assets);
        }
        this.model.assets=this.assetsDetails;
        this.assetsLength = this.assetsDetails.length;
        this.model.assettype="0";
        this.model.assetvalue=null;
        this.oaoService.setPersonalDetailsObject(this.model);
    }
    onSubmitLiabilitiesDetails() {
          console.log("onSubmitLiabilitiesDetails()")
        var Liabilities = {
            'Liabilitiestype':  this.model.Liabilitiestype,
            'Payable_Amount':  this.model.Payable_Amount,
            'Payment_Frequency':  this.model.Payment_Frequency,
            'Balance_Pending':  this.model.Balance_Pending,
            'Financial_Institution':  this.model.Financial_Institution
        };
        var Payable_Amount =  this.model.Payable_Amount.replace(/\,/g, "");
         this.model.Payable_Amount = Payable_Amount;
        var Balance_Pending =  this.model.Balance_Pending.replace(/\,/g, "");
         this.model.Balance_Pending = Balance_Pending;
        if (this.LiabilitiesLength <= this.MaxLimit) {
            this.LiabilitiesArray.push(Liabilities);
        }
        this.model.Liabilities=this.LiabilitiesArray;
        this.LiabilitiesLength = this.LiabilitiesArray.length;
        this.model.Liabilitiestype="0";
        this.model.Payable_Amount=null;
        this.model.Payment_Frequency=null;
        this.model.Balance_Pending=null;
        this.model.Financial_Institution=null;
    this.oaoService.setPersonalDetailsObject(this.model);
    }
    onSubmitMain() {
         console.log("onSubmitMain()")
         this.isLoading=!this.isLoading;
        this.model.asset_liability = true;
        this.model.skip = false;
          console.log(this.model);
         //this.oaoService.setPersonalDetailsObject(this.model);
        //chandan
        if(this.userExistingFlag){ 
           // jQuery('#mlogin').show();//chandan
            this.successAccount();
        }else{
           
            console.log(this.model);
        switch (this.model.product_code) {
            case 'HML': this.oaoService.setProgressBardata(this.forwardProgressDataHML);                       
                        this.oaoService.OAOCreateOrUpdateHomeloanApplicant(this.model)
                        .subscribe(
                        data => {
                            console.log(data);
                            if (this.idCheck_v == "O") {
                                    this.showSave();
                            } else if (this.idCheck_v == "M") {
                                this.router.navigate(['../onlineIdCheck'], {relativeTo:this.route});
                            } else {
                                this.successAccount();
                            }
                        }
                        );
                        break;
            case 'PRL': this.oaoService.setProgressBardata(this.forwardProgressDataPRL);
                    this.oaoService.OAOCreateOrUpdatePersonalloanApplicant(this.model)
                     .subscribe(
                     data => {
                        console.log(data);
                        if (this.idCheck_v == "O") {
                                this.showSave(); 
                        } else if (this.idCheck_v == "M") {
                            this.router.navigate(['../onlineIdCheck'], {relativeTo:this.route});
                        } else {
                        
                            this.successAccount();
                    }
                }
                );
                break;
            default: console.log("Page not found");
        }

    }//else

    }
    showSave() {
        jQuery('#onlineid-check').modal('show');

    }
    public inf_code: string = '';

    successAccount() {
        this.model.skip = true;
        console.log(this.model);
        switch (this.model.product_code) {
            case 'HML': this.oaoService.OAOCreateOrUpdateHomeloanApplicant(this.model)
                .subscribe(
                data => {
                    console.log(data);
                    this.oaoService.GetPropertyDetails('INFO_MESSAGE', 'INF_004')
                        .subscribe(
                        data => {
                            this.inf_loan = data.result[0].property_value;
                            jQuery('#success').modal('show');
                        }
                        );

                }
                );
                break;
            case 'PRL': this.oaoService.OAOCreateOrUpdatePersonalloanApplicant(this.model)
                .subscribe(
                data => {
                    console.log(data);
                    localStorage.clear();
                    this.oaoService.GetPropertyDetails('INFO_MESSAGE', 'INF_005')
                        .subscribe(
                        data => {
                            this.inf_loan = data.result[0].property_value;
                            jQuery('#success').modal('show');
                        }
                        );

                }
                );
                break;
            default: console.log("Page not found");

        }


    }
    updateSection() {

        if(this.model.product_code == 'HML')
        this.oaoService.setProgressBardata(this.backwardProgressDataHML);

        if(this.model.product_code == 'PRL')
        this.oaoService.setProgressBardata(this.backwardProgressDataPRL);

        this.oaoService.updatesection("section_3", this.model.application_id).subscribe(
            data => {
                console.log(data);
                console.log("updated");
                this.router.navigate(['../incomeExpense'],{relativeTo:this.route});
            }
        );
    }

    deleteassets(index) {
        this.assetsDetails.splice(index, 1);
        this.assetsLength = this.assetsDetails.length;


    }
    deleteLiabilities(index) {
        this.LiabilitiesArray.splice(index, 1);
        this.LiabilitiesLength = this.LiabilitiesArray.length;

    }

    ngOnInit() {
         CommonUtils.trimWhiteSpacesOnBlur();
         jQuery('#assettype').focus();
        //jQuery('#mlogin').hide();

        this.assetsLength = this.assetsDetails.length;
        this.LiabilitiesLength = this.LiabilitiesArray.length;
        console.log(this.LiabilitiesLength);
        this.oaoService.GetPropertyDetails('commonCodes', 'ASSET_TYPE')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.assetType.push({
                        prop_desc: data.result[i].property_desc,
                        prop_val: data.result[i].property_value
                    })
                }
            }
            );
        this.oaoService.GetPropertyDetails('commonCodes', 'LIABILITY_TYPE')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.liabilityType.push({
                        prop_desc: data.result[i].property_desc,
                        prop_val: data.result[i].property_value
                    })
                }
            }
            );
        this.oaoService.GetPropertyDetails('commonCodes', 'FREQ_TYPE')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.freqType.push({
                        prop_desc: data.result[i].property_desc,
                        prop_val: data.result[i].property_value
                    })
                }
            }
            );
    }
    clear() {
        window.location.reload();
        localStorage.clear();
    }
   
    addClass() {
        jQuery('#assettype').blur();
        jQuery('#Liabilitiestype').focus();
        this.liability_tab = true
    }
    moveToAssets(){
        this.liability_tab = false;
    }
    AmountFormatter(amountvalue: any, var_v: any) {
        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'AUD',
            minimumFractionDigits: 2,
        });
        //     this.testmodel[var_v]="";
        //  this.testmodel[var_v]=amountvalue;
        var finalString = formatter.format(amountvalue);
		finalString = finalString.replace('A$','');
        this.model[var_v] = finalString.replace('$','');
    }

    revert(oldvalue: any, var_v: any) {
        var tmpOldvalue;
        if (oldvalue != null && String(oldvalue).match(/\,/g)) {
            tmpOldvalue = oldvalue.replace(/\,/g, '');
            console.log(tmpOldvalue);
            this.model[var_v] = tmpOldvalue.substr(0, tmpOldvalue.length - 3);
            console.log(this.model[var_v]);
        }
    }

}