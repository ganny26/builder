import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from "@angular/router";

import { PersonalDetailsObject } from "../interfaces/personalDetails.interface";
import { UserDetailsObject } from "../interfaces/userDetails.interface";
import { OAOService } from "../services/OAO.Service";


declare var jQuery: any;
@Component({
  selector: 'complete-information',
  templateUrl: './completeInformation.component.html'
})
export class CompleteInformationComponent  implements OnInit{

  private model:PersonalDetailsObject  = new PersonalDetailsObject('', '', '', '', '', '', '');

  private stepStatus: string[] = [];
  // private width1: String = '0';
  // private width2: String = '0';
  private constWidth: number = 25;
  private sectionCount: number = 4;
  
  private limit1: number = 0;
  private width1: number = 0;
  private limit2: number = -25;
  private width2: number = 0;
  private id1;
  private id2;
  private progressBarConfig;
  
 
 ascFrame1() {
    if (this.width1 >= this.limit1) {
      clearInterval(this.id1);
    } else {
      this.width1++; 
    }
  }

moveForward1() {
   this.limit1 += this.constWidth;
  this.id1 = setInterval(()=>{this.ascFrame1();}, 10);
 
}

ascFrame2() {


    if (this.width2 >= this.limit2) {
      clearInterval(this.id2);
    } 
    else {
      this.width2++; 
    }
  }

moveForward2() {
	this.limit2 += this.constWidth;
  
  
var self = this;
var ival = setInterval(ascFrame2, 25);
  function ascFrame2() {

    if (self.width2 >= self.limit2) {
      clearInterval(ival);
    } 
    else {
      self.width2++; 

    }
  }
  
}

descFrame1() {
    if (this.width1 <= this.limit1) {
      clearInterval(this.id1);
    } else {
      this.width1--; 
    }
  }


moveBack1() {
  
	this.limit1-=this.constWidth;
  this.id1 = setInterval( ()=>{ this.descFrame1(); }, 10);
  
}



 descFrame2() {

    if (this.width2 <= this.limit2) {
      clearInterval(this.id2);
    } else {

      this.width2--; 

    }

  }

moveBack2() {
  
  this.limit2 -=this.constWidth;
  if(this.width2 == 0){
    return;
  }
  var id = setInterval(() => { this.descFrame2(); }, 10);

}


   


  updateProgressBar(data: string[]){

      this.stepStatus = data;
      
      if(data[this.sectionCount] == 'Y'){
        this.moveForward1();
        this.moveForward2();
      }
      if(data[this.sectionCount + 1] == 'Y'){
        this.moveBack1();
        this.moveBack2();
      }
      
  }


  constructor(private oaoService: OAOService, private router: Router)
  {
      jQuery('#content1').css('overflow','hidden');
      console.log("CompleteInformationComponent constructor()");
      this.model=this.oaoService.getPersonalDetailsObject();
      this.oaoService.getConfigByKey(this.model.product_code)
            .subscribe((response) => {
               this.progressBarConfig = JSON.parse(JSON.stringify(response.data)); 
               this.sectionCount = Object.keys(this.progressBarConfig).length;
               this.constWidth = 100/this.sectionCount;
               this.limit2 = -1*this.constWidth;
            });
      console.log(this.model);

  }

  ngOnInit(){

    this.router.events.filter(event => event instanceof NavigationEnd).subscribe(() => {

     this.updateProgressBar(this.oaoService.getProgressBardata());

    })

  }







}
