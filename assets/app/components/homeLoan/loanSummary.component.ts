import { Component ,AfterViewInit,OnInit} from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
import { ConfigDetails } from "../../interfaces/configinterface";
import { PersonalDetailsObject } from "../../interfaces/personalDetails.interface";
import { OAOService } from "../../services/OAO.Service";

// declare var jQuery:any;
// declare var Ladda:any;
@Component({
    selector: 'loan-summary',
    templateUrl: './loanSummary.component.html'
    
})
export class LoanSummaryComponent {
    model = new PersonalDetailsObject('', '', '', '', '', '', '');

    isLoading: Boolean = false;
    public emiamount: any;
    public months: any;
    public repaymentamount: string;
    public amtbrrow: string;
    public estvalue_v;
    public cc_estvalue_v;
    public pl_estvalue_v;
    public cl_estvalue_v;
    public sl_estvalue_v;
    public o_estvalue_v;

    private forwardProgressDataPRL = ['completed','completed','active','Y','N'];
    private backwardProgressDataPRL = ['active','','','N','N'];
    constructor(private oaoService: OAOService, private router: Router,private route: ActivatedRoute) {
        console.log("LoanSummaryComponent  constructor()")
        this.model = this.oaoService.getPersonalDetailsObject();
        console.log(this.model);

    }
    ngOnInit() {
                this.emi();
                var formatter = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'AUD',
                    minimumFractionDigits: 2,
                });
                if (this.model.estvalue == null)
                { this.estvalue_v = 0 }
                else { this.estvalue_v = parseInt(this.model.estvalue) }
                if (this.model.cc_estvalue == null)
                { this.cc_estvalue_v = 0 }
                else { this.cc_estvalue_v = parseInt(this.model.cc_estvalue) }
                if (this.model.pl_estvalue == null)
                { this.pl_estvalue_v = 0 }
                else { this.pl_estvalue_v = parseInt(this.model.pl_estvalue) }
                if (this.model.cl_estvalue == null)
                { this.cl_estvalue_v = 0 }
                else { this.cl_estvalue_v = parseInt(this.model.cl_estvalue) }
                if (this.model.sl_estvalue == null)
                { this.sl_estvalue_v = 0 }
                else { this.sl_estvalue_v = parseInt(this.model.sl_estvalue) }
                if (this.model.o_estvalue == null)
                { this.o_estvalue_v = 0 }
                else { this.o_estvalue_v = parseInt(this.model.o_estvalue) }
                this.amtbrrow = formatter.format(parseInt(this.model.amtborrow+this.estvalue_v+this.cc_estvalue_v+this. pl_estvalue_v +this.cl_estvalue_v +this.sl_estvalue_v+this. o_estvalue_v));
            }


    onSubmit() {
        this.oaoService.setPersonalDetailsObject(this.model);
        this.isLoading = !this.isLoading;
        if(this.model.product_code == 'HML')
            this.oaoService.setProgressBardata(this.forwardProgressDataPRL);
        this.router.navigate(['../incomeExpense'], {relativeTo:this.route});
    }
     updateSection(){
          if(this.model.product_code == 'HML')
            this.oaoService.setProgressBardata(this.backwardProgressDataPRL);
            this.oaoService.updatesection("section_2",this.model.application_id).subscribe(
                                    data =>{
                                        console.log(data);
                                        console.log("updated");
                                        this.router.navigate(['../loanDetails'], {relativeTo:this.route});
                                    }
                                );
        }

        emi(){
           this.emiamount= this.model.amtborrow;
            this.months= parseInt(this.model.loanterm) *12;
            var r=3.89/(12*100);
            // this.repaymentamount = Math.floor((this.emiamount * r *Math.pow((1+r),this.months))/(Math.pow((1+r),this.months)-1));
             var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'AUD',
            minimumFractionDigits: 2,
        });
        this.repaymentamount = formatter.format( Math.floor((this.emiamount * r *Math.pow((1+r),this.months))/(Math.pow((1+r),this.months)-1)));
            console.log(this.repaymentamount)
        }
}