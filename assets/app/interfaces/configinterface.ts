export class ConfigDetails {
    constructor(
        public name: string,
        public dob: string,
        public email: string,
        public mobile: string,
        public refnumber:string,
        public address?: string,
        public passportNum?: string,
        public dlNum?: string,
        public required_v?:string,
        public EVR?:any
        
    ){
        this.name=name;
        this.address=address;
        this.passportNum=passportNum;
        this.refnumber=refnumber;
        this.dob=dob;
        this.email=email;
        this.mobile=mobile;
        this.dlNum=dlNum;
        this.required_v=required_v;
        this.EVR=EVR;
        
    }
}

export class google{
    constructor(
        public address_components: string,
        public formatted_address: string
      
    ){
        this.address_components=address_components;
        this.formatted_address=formatted_address;
        
        
    }
}