import { Component ,AfterViewInit,OnInit} from '@angular/core';
import {Router} from '@angular/router'
declare var jQuery:any;
@Component({
    selector: 'oao-header',
    templateUrl: './oaoHeader.component.html'
    
})
export class oaoHeaderComponent{
    clear(){
        window.location.reload();
        localStorage.clear();
    }
}