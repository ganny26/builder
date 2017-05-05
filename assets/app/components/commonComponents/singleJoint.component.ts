import { Component } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { PersonalDetailsObject } from "../../interfaces/personalDetails.interface";
import { OAOService } from "../../services/OAO.Service"

declare var jQuery: any;
@Component({
  selector: 'single-joint',
  templateUrl: './singleJoint.component.html'
})
export class SingleJointComponent {

  private forwardProgressDataEVR = ['active','','','','Y','N'];
  private forwardProgressDataHML = ['active','','','Y','N'];
  private forwardProgressDataPRL = ['active','','','Y','N'];
  
    model = new PersonalDetailsObject('', '', '', '', '', '', '');
   name:string;
   constructor(private oaoService: OAOService,private router: Router, private route : ActivatedRoute)
    {
        console.log("SingleJointComponent constructor()");
        this.model=this.oaoService.getPersonalDetailsObject();
        console.log(this.model);
        if( this.model.fname!=""){
           this.name="Hi.."+this.model.fname;
        }
    }
  setSingleOrJoint(single_joint: string) 
  {
    
    this.model.singleORjoint=single_joint;
    this.oaoService.setPersonalDetailsObject(this.model);
    console.log(this.oaoService.getPersonalDetailsObject());
    if(this.model.product_code == 'EVR')
    this.oaoService.setProgressBardata(this.forwardProgressDataEVR);

    if(this.model.product_code == 'HML')
    this.oaoService.setProgressBardata(this.forwardProgressDataHML);

    if(this.model.product_code == 'PRL')
    this.oaoService.setProgressBardata(this.forwardProgressDataPRL);

    this.router.navigate(["../personalBasicInfo"], {relativeTo:this.route});
   
  }
}
