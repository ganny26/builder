import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { ConfigDetails } from "../../interfaces/configinterface";
import { PersonalDetailsObject } from "../../interfaces/personalDetails.interface";
import { OAOService } from "../../services/OAO.Service";
import { CommonUtils } from '../../validators/CommonUtils';

 declare var jQuery:any;
// declare var Ladda:any;
@Component({
    selector: 'loan-details',
    templateUrl: './loanDetails.component.html'

})
export class LoanDetailsComponent implements OnInit {
    model = new PersonalDetailsObject('', '', '', '', '', '', '');
    configMsg: ConfigDetails;
    public loanTerm: any[] = [];
    public repaymentType: any[] = [];
    isLoading:Boolean=false;
    private forwardProgressDataPRL = ['completed','active','','N','N'];
    private backwardProgressDataPRL = ['active','','','N','N'];
     public showCustomAddr:String="true";
      public paddrShow:boolean = false;
       public  street: String[] = [];
      public  state_drop: String[] = [];
              public no_address_found_flag:string;
               public addrErr=false;
    constructor(private oaoService: OAOService, private router: Router,private route: ActivatedRoute) {

        console.log("LoanDetailsComponent  constructor()")
        this.model = this.oaoService.getPersonalDetailsObject();
         if(this.model.proppostcode_m==undefined){
                    this.model.proppostcode_m="1234";
                    
                }
        console.log(this.model);

        this.oaoService.getConfig()
            .subscribe((data) => { this.configMsg = JSON.parse(JSON.stringify(data.data)); });

    }
     showCustomAddressFields(){
                                  this.addrErr=false;
                            this.showCustomAddr="";
                            this.no_address_found_flag="Y";
                            this.model.propaddress_m='';
                          
                          
                       }
                        hideaddress(){
                        this.showCustomAddr="true";
                        this.model.propaddress_m='';
                        this.no_address_found_flag="N";
                    }

    ngOnInit() {
           CommonUtils.trimWhiteSpacesOnBlur();
        jQuery('input:visible:first').focus();
                if (this.model.frequencyType == null || this.model.interesttype == null) {
                    this.model.frequencyType = "Monthly";
                    this.model.interesttype = "FIXED";
                }
                if (this.model.loanterm == null) {
                    this.model.loanterm = '0';
                }
                if (this.model.repaymenttype == null) {
                    this.model.repaymenttype = '0';
                }

        this.oaoService.GetPropertyDetails('commonCodes', 'LOAN_TERM')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.loanTerm.push({
                        prop_desc: data.result[i].property_desc,
                        prop_val: data.result[i].property_value
                    })
                }
            }
            );
        this.oaoService.GetPropertyDetails('commonCodes', 'REPAYMENT_TYPE')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.repaymentType.push({
                        prop_desc: data.result[i].property_desc,
                        prop_val: data.result[i].property_value
                    })
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

         this.oaoService.GetPropertyDetails('commonCodes','STATE')
                                .subscribe(
                                            data =>{
                                                var count   =   Object.keys( data.result ).length;
                                                    for(var i = 0; i < count; i++){
                                                        this.state_drop.push(data.result[i].property_desc)
                                                    }
                                            }
                                );
    }

    onSubmit() {
        this.isLoading=!this.isLoading;
        if ((!String(this.model.amtborrow).match(/\./g) || String(this.model.amtborrow).match(/\./g)) && String(this.model.amtborrow).match(/\,/g)) {
            var amtborrow = this.model.amtborrow.replace(/\,/g, "");
            this.model.amtborrow = amtborrow;
        }
        if (this.model.consolidateMortage == true) {
            if ((!String(this.model.estvalue).match(/\./g) || String(this.model.estvalue).match(/\./g)) && String(this.model.estvalue).match(/\,/g)) {
                var estvalue = this.model.estvalue.replace(/\,/g, "");
                this.model.estvalue = estvalue;
            }
              this.model.no_address_found_flag=this.no_address_found_flag;
               console.log("***************************"+this.model.prophousenum_m);
           // alert("Proppostcode_m: "+this.model.proppostcode_m+" prophousenum_m: "+this.model.prophousenum_m);
                   if(this.model.proppostcode_m!=null && this.model.proppostcode_m!='1234' && (this.model.prophousenum_m!=undefined || this.model.prophousenum_m!=null)){
                       this.addrErr=false;
                       if(this.no_address_found_flag=='Y'){
             this.model.propaddress_m=this.model.propstreetnum_m+" "+ this.model.propstreetname_m+" "+ this.model.propsuburb_m+" "+ this.model.propstate_m+" "+ this.model.proppostcode_m;
            }
                   
        }else{
                this.isLoading=false
                this.addrErr=true;
                return
            }
        }
        if (this.model.consolidateotherMortage == true) {
            if ((!String(this.model.cc_estvalue).match(/\./g) || String(this.model.cc_estvalue).match(/\./g)) && String(this.model.cc_estvalue).match(/\,/g)) {
                var cc_estvalue = this.model.cc_estvalue.replace(/\,/g, "");
                this.model.cc_estvalue = cc_estvalue;
            }
            if ((!String(this.model.pl_estvalue).match(/\./g) || String(this.model.pl_estvalue).match(/\./g)) && String(this.model.pl_estvalue).match(/\,/g)) {
                var pl_estvalue = this.model.pl_estvalue.replace(/\,/g, "");
                this.model.pl_estvalue = pl_estvalue;
            }
            if ((!String(this.model.cl_estvalue).match(/\./g) || String(this.model.cl_estvalue).match(/\./g)) && String(this.model.cl_estvalue).match(/\,/g)) {
                var cl_estvalue = this.model.cl_estvalue.replace(/\,/g, "");
                this.model.cl_estvalue = cl_estvalue;
            }
            if ((!String(this.model.sl_estvalue).match(/\./g) || String(this.model.sl_estvalue).match(/\./g)) && String(this.model.sl_estvalue).match(/\,/g)) {
                var sl_estvalue = this.model.sl_estvalue.replace(/\,/g, "");
                this.model.sl_estvalue = sl_estvalue;
            }
            if ((!String(this.model.o_estvalue).match(/\./g) || String(this.model.o_estvalue).match(/\./g)) && String(this.model.o_estvalue).match(/\,/g)) {
                var o_estvalue = this.model.o_estvalue.replace(/\,/g, "");
                this.model.o_estvalue = o_estvalue;
            }

        }

        this.oaoService.setPersonalDetailsObject(this.model);
        console.log(this.model);
        
         if(this.model.product_code == 'HML')
            this.oaoService.setProgressBardata(this.forwardProgressDataPRL);

        this.oaoService.OAOCreateOrUpdateHomeloanApplicant(this.model)
            .subscribe(
            data => {
                console.log("sample" + data);
                this.router.navigate(['../loanSummary'],{relativeTo:this.route});
            }
            );

    }
    updateSection() {

           if(this.model.product_code == 'HML')
            this.oaoService.setProgressBardata(this.backwardProgressDataPRL);

        this.oaoService.updatesection("section_2", this.model.application_id).subscribe(
            data => {
                console.log(data);
                console.log("updated");
                this.router.navigate(['../propertyDetails'],{relativeTo:this.route});
            }
        );
    }
    percentage_var: any
    checkPercentage() {

        this.percentage_var = 100 - parseInt(this.model.fixedper);
        this.model.variableper = this.percentage_var;

    }
    clear(radio_var: any) {
        switch (radio_var) {
            case 'FIXED': this.model.fixedper = '';
                this.model.variableper = ''
                break;
            case 'VARIABLE': this.model.fixedper = '';
                this.model.variableper = ''
                break;
        }
    }
    clearCheckbox(checkbox_var: any, cond: boolean) {
        switch (checkbox_var) {
            case 'consolidateMortage': if (cond == false) {
                this.model.estvalue = '';
                this.model.finInstitution = '';
                this.model.propaddress_m = '';
            }
                break;
            case 'consolidateotherMortage':
                break;
            default: console.log("ewfjk")
        }
    }
    AmountFormatter(amountvalue: any, var_v: any) {
     if( typeof amountvalue != 'undefined' && amountvalue!=null && amountvalue!=''  ){
            console.log("asd "+amountvalue+" "+var_v)
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
    }else{
         this.model[var_v]="0.0";
    }
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