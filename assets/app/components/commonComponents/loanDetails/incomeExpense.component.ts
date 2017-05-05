import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { ConfigDetails } from "../../../interfaces/configinterface";
import { PersonalDetailsObject } from "../../../interfaces/personalDetails.interface";
import { OAOService } from "../../../services/OAO.Service"
import { CommonUtils } from '../../../validators/CommonUtils';
declare var jQuery: any;
// declare var Ladda:any;
@Component({
    selector: 'income-expense',
    templateUrl: './incomeExpense.component.html'

})
export class IncomeExpenseComponent {
    model = new PersonalDetailsObject('', '', '', '', '', '', '');
    configMsg: ConfigDetails;
    isLoading:Boolean=false;
    private forwardProgressDataHML = ['completed','completed','active','N','N'];
    private backwardProgressDataHML = ['completed','active','','N','Y'];

    private forwardProgressDataPRL = ['completed','completed','active','N','N'];
    private backwardProgressDataPRL = ['completed','active','','N','Y'];

    constructor(private oaoService: OAOService, private router: Router,private route: ActivatedRoute) {
        console.log("IncomeExpenseComponent  constructor()")
        this.model=this.oaoService.getPersonalDetailsObject();
        console.log(this.model);
        this.oaoService.getConfig()
            .subscribe((data) => { this.configMsg = JSON.parse(JSON.stringify(data.data)); });
    }
    ngOnInit() {
         CommonUtils.trimWhiteSpacesOnBlur();
        jQuery('input:visible:first').focus();
                if (this.model.employed == null) {
                    this.model.employed = "EMPLOYED";
                }
    }

    onSubmit() {
        this.isLoading=!this.isLoading;
        this.model.skip = false;
         if ((!String(this.model.earnPerMonth).match(/\./g) || String(this.model.earnPerMonth).match(/\./g)) && String(this.model.earnPerMonth).match(/\,/g)) {
            var earnPerMonth = this.model.earnPerMonth.replace(/\,/g, "");
            this.model.earnPerMonth = earnPerMonth;
         }
          if ((!String(this.model.monthlyLivingExpenses).match(/\./g) || String(this.model.monthlyLivingExpenses).match(/\./g)) && String(this.model.monthlyLivingExpenses).match(/\,/g)) {
            var monthlyLivingExpenses = this.model.monthlyLivingExpenses.replace(/\,/g, "");
            this.model.monthlyLivingExpenses = monthlyLivingExpenses;
         }
        
        this.oaoService.setPersonalDetailsObject(this.model);
        switch (this.model.product_code) {
            case 'HML': this.oaoService.setProgressBardata(this.forwardProgressDataHML);
                        this.oaoService.OAOCreateOrUpdateHomeloanApplicant(this.model)
                        .subscribe(
                        data => {
                            console.log("sample" + data);
                            this.router.navigate(['../assets'],{relativeTo:this.route});
                        }
                        );
                        break;
            case 'PRL': this.oaoService.setProgressBardata(this.forwardProgressDataPRL);
                        this.oaoService.OAOCreateOrUpdatePersonalloanApplicant(this.model)
                            .subscribe(
                            data => {
                                console.log("sample" + data);
                                this.router.navigate(['../assets'],{relativeTo:this.route});
                            }
                            );
                            break;
            default: console.log("Page not found");

        }
    }


    updateSection() {
        this.oaoService.updatesection("section_2", this.model.application_id).subscribe(
            data => {
                console.log(data);
                console.log("updated");
                switch (this.model.product_code) {

                    case 'HML': this.oaoService.setProgressBardata(this.backwardProgressDataHML);
                                this.router.navigate(['../loanSummary'], {relativeTo:this.route});
                                break;
                    case 'PRL': this.oaoService.setProgressBardata(this.backwardProgressDataPRL);
                                this.router.navigate(['../personalLoanDetails'], {relativeTo:this.route});
                                break;
                    default: console.log("Page not found");

                }
            }
        );
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