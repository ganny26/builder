import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { PersonalDetailsObject } from "../interfaces/personalDetails.interface";
import { UserDetailsObject } from "../interfaces/userDetails.interface"; //chandan
@Injectable()
export class OAOService
{
   private baseURL:String = "http://localhost:3000";
   // private baseURL:String = "http://192.168.1.203:3000";
    data:PersonalDetailsObject;
   
    userExistingFlag:boolean; //chandan
    loginFlag:boolean=false;//chandan
    userDetailsObject = new UserDetailsObject('', '');  //chandan
    personalDetailsObject= new PersonalDetailsObject('', '', '', '', '', '', ''); //chandan

    callMatchingCustomerFlag:boolean=false;

    progressBardata: string[] = ['','','','',''];

    constructor(private http: Http) {}


	//-------------onlineIdcheck----------------
      onlineIdcheck(user: PersonalDetailsObject) {
        const body = JSON.stringify(user);
        console.log("onlineIdcheck"+body);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(`${this.baseURL}/idcheck/onlineidcheck`, body, {headers: headers})
            .map((response: Response) => response.json())
    }
    //------------------By Rajath-------------

//chandan
    setPersonalDetailsObject(personalDetailsObject:PersonalDetailsObject){
        this.personalDetailsObject=personalDetailsObject;
    }
    getPersonalDetailsObject(){
        return this.personalDetailsObject;
    }
    setUserDetailsObject(userDetailsObject:UserDetailsObject){
       // console.log("service setUserDeatils()")
        this.userDetailsObject=userDetailsObject;
    }
    getUserDetailsObject(){
        //console.log("service getUserDetailsObject()");
        return this.userDetailsObject;
    }

    setUserExistingFlag(userExistingFlag:boolean){
        this.userExistingFlag=userExistingFlag;
    }
    getUserExistingFlag(){
        return this.userExistingFlag;
    }

    Login(user:UserDetailsObject)
    {
        const body = JSON.stringify(user);
       // console.log("service Login()"+body);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(`${this.baseURL}/loginAPI/login`, body, {headers: headers})
            .map((response: Response) => response.json())
    }

    GetLoginUserDetails(user:UserDetailsObject)
    {
        const body = JSON.stringify(user);
       // console.log("service GetUserDetails()"+body);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(`${this.baseURL}/loginAPI/getLoginUserDetails`, body, {headers: headers})
            .map((response: Response) => response.json())
    }

    setLoginFlag(loginFlag:boolean){
        this.loginFlag=loginFlag;
    }
    getLoginFlag(){
        return this.loginFlag;
    }

    registerInternetBanking(user:UserDetailsObject)
    {
        const body = JSON.stringify(user);
       // console.log("service registerInternetBanking()"+body);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(`${this.baseURL}/loginAPI/regIntBanking`, body, {headers: headers})
            .map((response: Response) => response.json());
    }

    logout(){
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.get(`${this.baseURL}/loginAPI/logout`, {headers: headers})
            .map((response: Response) => response.json());
    }
    setCallMatchingCustomerFlag(callMatchingCustomerFlag:boolean){
        this.callMatchingCustomerFlag=callMatchingCustomerFlag;
    }
    getCallMatchingCustomerFlag(){
        return this.callMatchingCustomerFlag;
    }
    checkMatchingCustomer(user:PersonalDetailsObject){
        const body = JSON.stringify(user);
        //console.log("service registerInternetBanking()"+body);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(`${this.baseURL}/loginAPI/checkDup`, body, {headers: headers})
            .map((response: Response) => response.json());
    }
//chandan

     OAOCreateOrUpdateApplicant(user: PersonalDetailsObject) {
        const body = JSON.stringify(user);
        console.log("service"+body);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(`${this.baseURL}/api/Applicants`, body, {headers: headers})
            .map((response: Response) => response.json())
    }
    OAOCreateOrUpdateHomeloanApplicant(user: PersonalDetailsObject) {
        const body = JSON.stringify(user);
        console.log("service"+body);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(`${this.baseURL}/api/HomeLoanApplicants`, body, {headers: headers})
            .map((response: Response) => response.json())
    }
    OAOCreateOrUpdatePersonalloanApplicant(user: PersonalDetailsObject) {
        const body = JSON.stringify(user);
        console.log("service"+body);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(`${this.baseURL}/api/PersonalLoanApplicants`, body, {headers: headers})
            .map((response: Response) => response.json())
    }

    GetPropertyDetails(PropertyType:String,Property:String){
         return this.http.get(`${this.baseURL}/api/PropertyDetails/`+PropertyType+'/'+Property)
            .map((response: Response) => response.json())
    }

      GetApplicantsDetail(Applicants_id:String){
        // console.log("apppp"+Applicants_id);
         return this.http.get(`${this.baseURL}/api/ApplicantsRecord/`+Applicants_id)
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    setData(data:PersonalDetailsObject){
        this.data=data;
    }
    getData(){
        return this.data;
    }
    getConfig(){
     return this.http.get(`${this.baseURL}/api/getConfig`)
            .map((response: Response) => response.json())
    
    }

    getConfigByKey(key: string){
        return this.http.get(`${this.baseURL}/api/getConfig/${key}`)
            .map((response: Response) => response.json())
    }
    prod_code:string
    updatesection(section:String,app_id:String){
       
        this.prod_code= this.personalDetailsObject.product_code;
        return this.http.get(`${this.baseURL}/api/UpdateSection/`+app_id+'/'+section+'/'+this.prod_code)
            .map((response: Response) => response.json())
    }

    setFb:boolean=false;
    setFbData(set:boolean){
        this.setFb=set;
    }
    getFbData(){
        return this.setFb;
    }

    setProgressBardata(data: string[]){
        this.progressBardata = data;
    }

     getProgressBardata(){
        return this.progressBardata;
    }
//OTP
    sendOTP(appRef:string,dob:string){
        const body = JSON.stringify({application_id:appRef,dob:dob});
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(`${this.baseURL}/api/sendOTP`, body, {headers: headers})
            .map((response: Response) => response.json())
    }
    checkOTP(otp:number){
        const body = JSON.stringify({otp:otp});
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(`${this.baseURL}/api/verifyOTP`, body, {headers: headers})
            .map((response: Response) => response.json())
    }

} 
