import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { LoanReason } from "../../interfaces/loanReason.interface";
import { ConfigDetails } from "../../interfaces/configinterface";
import { PersonalDetailsObject } from "../../interfaces/personalDetails.interface";
import { OAOService } from "../../services/OAO.Service"
// declare var jQuery:any;
// declare var Ladda:any;
@Component({
    selector: 'personalLoan',
    templateUrl: './personalLoan.component.html'

})
export class PersonalLoanComponent implements OnInit {
    model = new PersonalDetailsObject('', '', '', '', '', '', '');
    public application_id: any;
    prod_type: string
    prod_code: string
    configMsg: ConfigDetails;
    public loanTerm: any[] = [];
    public repaymentType: any[] = [];
    public loanreason = [];
    public loan_reason_v=new LoanReason(false,false,false,false,false,false,false);
    isLoading:Boolean=false;

    private forwardProgressDataPRL = ['completed','completed','active','Y','N'];
    private backwardProgressDataPRL = ['completed','active','','N','Y'];

    constructor(private oaoService: OAOService, private router: Router,private route: ActivatedRoute){
        this.model.frequencyType = "Monthly";
        console.log("PersonalLoanComponent  constructor()")
        this.model=this.oaoService.getPersonalDetailsObject();
        console.log(this.model);
        if(typeof this.model.loanreason!="undefined"){
             this.loan_reason_v=this.model.loanreason;
        }
        this.oaoService.getConfig()
            .subscribe((data) => { this.configMsg = JSON.parse(JSON.stringify(data.data)); });
    }
    ngOnInit() {
                if (this.model.frequencyType == null) {
                    this.model.frequencyType = "Monthly";
                }
                if (this.model.loanterm == null) {
                    this.model.loanterm = '0'
                }
                if (this.model.repaymenttype == null) {
                    this.model.repaymenttype = '0'
                }
                // if(this.model.loanreason.length>0){
                // this.loan_reason_v = this.model.loanreason[0];
				// }
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
    }

    onSubmit() {
        this.isLoading=!this.isLoading;
        this.model.loanreason = this.loan_reason_v;
        if((!String( this.model.amtborrow).match(/\./g) || String( this.model.amtborrow).match(/\./g)) && String( this.model.amtborrow).match(/\,/g) ){
        var amtborrow =  this.model.amtborrow.replace(/\,/g,"");
         this.model.amtborrow=amtborrow;
        }

        console.log( this.model);
        this.oaoService.setProgressBardata(this.forwardProgressDataPRL);
        this.oaoService.OAOCreateOrUpdatePersonalloanApplicant( this.model)
            .subscribe(
            data => {
                console.log("sample" + data);
                this.router.navigate(['../incomeExpense'],{relativeTo:this.route});
            }
            );

    }
    // setReason(reason: string, check: any) {
    //     var loan = {
    //         'reason': reason
    //     };
    //     if (check == true) {
    //         this.loanreason.push(loan);
    //     } else {
    //         for (var i = 0; i < this.loanreason.length; i++) {
    //             if (this.loanreason[i]['reason'] == reason) {
    //                 this.loanreason.splice(i, 1);
    //             }
    //         }

    //     }


    // }
    updateSection() {
                this.oaoService.setProgressBardata(this.backwardProgressDataPRL);
                this.router.navigate(['../personalContactInfo'],{relativeTo:this.route});
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

   revert(oldvalue:any,var_v: any){
        var tmpOldvalue;
       if(oldvalue!=null && String(oldvalue).match(/\,/g)){
        tmpOldvalue=oldvalue.replace(/\,/g,'');
        console.log(tmpOldvalue);
        this.model[var_v]=tmpOldvalue.substr(0,tmpOldvalue.length-3);
        console.log(this.model[var_v]);
        }
    }


}