import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Common } from "../../validators/commonFunc";
import { ConfigDetails } from "../../interfaces/configinterface";
import { PersonalDetailsObject } from "../../interfaces/personalDetails.interface";
import { OAOService } from "../../services/OAO.Service";
import { CommonUtils } from '../../validators/CommonUtils';

declare var jQuery: any;
// declare var Ladda:any;
@Component({
    selector: 'property-details',
    templateUrl: './propertyDetails.component.html'

})
export class PropertyDetailsComponent implements OnInit {
    public application_id: any;
    configMsg: ConfigDetails;
    model = new PersonalDetailsObject('', '', '', '', '', '', '');
    public propType: any[] = [];
      public showCustomAddr:String="true";
      public paddrShow:boolean = false;
      public  street: String[] = [];
      public  state_drop: String[] = [];
              public no_address_found_flag:string;
               public addrErr=false;
      
    isLoading: boolean = false;
    private forwardProgressDataPRL = ['completed','active','','N','N'];
    private backwardProgressDataPRL = ['active','','','N','Y'];

    constructor(private oaoService: OAOService, private router: Router,private route: ActivatedRoute) {
        console.log("PropertyDetailsComponent  constructor()")
        this.model = this.oaoService.getPersonalDetailsObject();
         if(this.model.proppostcode==undefined){
                    this.model.proppostcode="1234";
                    
                }
        console.log(this.model);
    }
     showCustomAddressFields(){
                                  this.addrErr=false;
                            this.showCustomAddr="";
                            this.no_address_found_flag="Y";
                            this.model.propaddr='';
                            this.model.propstreettype='';
                            this.model.propsuburb='';
                          
                       }
    ngOnInit() {
         CommonUtils.trimWhiteSpacesOnBlur();
        jQuery('input:visible:first').focus();
        if (this.model.loantype == null) {
            this.model.loantype = "REFINANCE";
        }
        if (this.model.ownership == null) {
            this.model.ownership = "OWNER OCCUPIER";
        }
        if (this.model.proptype == null) {
            this.model.proptype = '0';
        }

        this.oaoService.getConfig()
            .subscribe((data) => {
            this.configMsg = JSON.parse(JSON.stringify(data.data));
                console.log(this.configMsg)
            });

        this.oaoService.GetPropertyDetails('commonCodes', 'PROP_TYPE')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.propType.push({
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
        this.isLoading = !this.isLoading;
        this.model.app_id = this.model.application_id;
        if ((!String(this.model.payoutbal).match(/\./g) || String(this.model.payoutbal).match(/\./g)) && String(this.model.payoutbal).match(/\,/g)) {
            var payoutbal = this.model.payoutbal.replace(/\,/g, "");
            this.model.payoutbal = payoutbal;
        }
        if ((!String(this.model.rentalincome).match(/\./g) || String(this.model.rentalincome).match(/\./g)) && String(this.model.rentalincome).match(/\,/g)) {
            var rentalincome = this.model.rentalincome.replace(/\,/g, "");
            this.model.rentalincome = rentalincome;
        }
        if ((!String(this.model.purchaseprice).match(/\./g) || String(this.model.purchaseprice).match(/\./g)) && String(this.model.purchaseprice).match(/\,/g)) {
            var purchaseprice = this.model.purchaseprice.replace(/\,/g, "");
            this.model.purchaseprice = purchaseprice;
        }
             this.model.no_address_found_flag=this.no_address_found_flag;
               console.log("***************************"+this.model.prophousenum);
            
                   if(this.model.proppostcode!=null && this.model.proppostcode!='1234' && (this.model.prophousenum!=undefined || this.model.prophousenum!=null)){
                       this.addrErr=false;
                       if(this.no_address_found_flag=='Y'){
             this.model.propaddr=this.model.propstreetnum+" "+ this.model.propstreetname+" "+ this.model.propsuburb+" "+ this.model.propstate+" "+ this.model.proppostcode;
            }
                   
        }else{
                this.isLoading=false
                this.addrErr=true;
                return
            }
       

        console.log("updated" + this.model);
        console.log(this.model);
         this.oaoService.setPersonalDetailsObject(this.model);

         if(this.model.product_code == 'HML')
            this.oaoService.setProgressBardata(this.forwardProgressDataPRL);

        this.oaoService.OAOCreateOrUpdateHomeloanApplicant(this.model)
            .subscribe(
            data => {
                console.log("sample" + data);
                

                this.router.navigate(['../loanDetails'], {relativeTo:this.route});
            }
            );


    }//onSubmit

    updateSection() {

        if(this.model.product_code == 'HML')
        this.oaoService.setProgressBardata(this.backwardProgressDataPRL);

        this.oaoService.updatesection("section_1", this.model.application_id).subscribe(
            data => {
                console.log(data);
                console.log("updated");
                this.router.navigate(['../personalContactInfo'], {relativeTo:this.route});
            }
        );
    }

    clear(radio_var: any) {
        switch (radio_var) {
            case 'REFINANCE': this.model.property = '';
                break;
            case 'NEW PURCHASE': this.model.property = 'Yes';
                this.model.payoutbal = '';
                break;
            case 'OWNEROCCUPIER': this.model.rentalincome = null;
                break;
        }
    }
    AmountFormatter(amountvalue: any, var_v: any) {
        if (typeof amountvalue != 'undefined' && amountvalue != null && amountvalue != '') {
            console.log("asd " + amountvalue + " " + var_v)
            var formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'AUD',
                minimumFractionDigits: 2,
            });
            
            var finalString = formatter.format(amountvalue);
            finalString = finalString.replace('A$', '');
            this.model[var_v] = finalString.replace('$', '');
        } else {
            this.model[var_v] = "0.0";
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
       hideaddress(){
                        this.showCustomAddr="true";
                        this.model.address='';
                        this.no_address_found_flag="N";
                    }

}