export class PersonalDetailsObject {
    constructor(
        public product_type:string,
        public singleORjoint:string,
        public title:string,
        public fname: string,
        public mname: string,
        public lname: string,
        public dob: string,
        public email?: string,
        public mobile?: string,
        public no_of_section?:any,
		public campaign_id?:any,
       
        public section_EVR?:any,
        public section_HML?:any,
        public section_PRL?:any,
        public tfn?: string,
        public DLidState?: string,
        public LNum?: string,
        public color?: string,
        public idnum?: string,
        public idstate?: string,
        public refnum?: string,
        public validTo?: string,
        public exemption?: string,
        public housenum?: string,
        public streetnum?: string,
        public streetname?: string,
        public streettype?: string,
        public suburb?: string,
        public state?: string,
        public postcode?: string,
        public address?: string,
        public phousenum?: string,
        public pstreetnum?: string,
        public pstreetname?: string,
        public pstreettype?: string,
        public psuburb?: string,
        public pstate?: string,
        public ppostcode?: string,
        public paddress?: string,
        public app_id?:String,
        public application_id?:String,
        public meidicarenum?:String,  
        public core_account_number?:String,
        public core_customer_id?:Number,
        public bank_bsb_number?:String,         
        public postal_home_address_flag?:Boolean,
        public no_address_found_flag?:string,
        public skip?:boolean,

        //for home loan
        public loantype?:string,
        public property?:string,
        public proptype?:string,
        public payoutbal?:string,
        public propaddr?:string,
        public purchaseprice?:string,
        public amtborrow?:string,
        public loanterm?:string,
        public frequencyType?:string,
        // public loanterm_n?:string,
        public repaymenttype?:string,
        public interesttype?:string,
        public fixedper?:string,
        public variableper?:string,
        public consolidateMortage?:boolean,
        public estvalue?:string,
        public propaddress_m?:string,
        public finInstitution?:string,
        public consolidateotherMortage?:boolean,
        public cc_estvalue?:string,
        public cc_finInstitution?:string,
        public pl_estvalue?:string,
        public pl_finInstitution?:string,
        public cl_estvalue?:string,
        public cl_finInstitution?:string,
        public sl_estvalue?:string,
        public sl_finInstitution?:string,
        public o_estvalue?:string,
        public o_finInstitution?:string,
        public employed?:string,
        public employer?:string,
        public service?:string,
        public companyName?:string,
        public yearsEstablished?:string,
        public earnPerMonth?:string,
        public monthlyLivingExpenses?:string,
        public ownership?:string,
        public assettype?:string,
        public assetvalue?:string,
        public Liabilitiestype?:string,
        public Payable_Amount?:string,
        public Payment_Frequency?:string,
        public Balance_Pending?:string,
        public Financial_Institution?:string,
        public rentalincome?:string,
        public assets?:any,
        public Liabilities?:any,
        public asset_liability?:boolean,
        
        //for personal loan
        public loanreason?:any,
        public existing_cust_status?:string, //chandan
      
        public userName?:string, //chandan
        public product_code?:string,
         
         //for home loan 
         public prophousenum?: string,
        public propstreetnum?: string,
        public propstreetname?: string,
        public propstreettype?: string,
        public propsuburb?: string,
        public propstate?: string,
        public proppostcode?: string,

        public brokerid?:string,

         public prophousenum_m?: string,
        public propstreetnum_m?: string,
        public propstreetname_m?: string,
        public propstreettype_m?: string,
        public propsuburb_m?: string,
        public propstate_m?: string,
        public proppostcode_m?: string        
    ){  
        this.product_code=product_code;//chandan
        this.userName=userName;//chandan
   
        this.existing_cust_status=existing_cust_status;//chandan
        this.no_of_section=no_of_section;
        this.section_EVR=section_EVR;
        this.section_HML=section_HML;
        this.section_PRL=section_PRL;
        this.product_type=product_type;
        this.singleORjoint=singleORjoint;
        this.fname=fname;
        this.mname=mname;
        this.lname=lname;
        this.dob=dob;
        this.email=email;
        this.mobile=mobile;
        this.tfn=tfn;
        this.DLidState=DLidState;
        this.LNum=LNum;
        this.color=color;
        this.idnum=idnum;
        this.idstate=idstate;
        this.refnum=refnum;
        this.validTo=validTo;
        this.exemption=exemption;
        this.housenum=housenum
        this.streetnum=streetnum
        this.streetname=streetname
        this.streettype=streettype
        this.suburb=suburb
        this.state=state
        this.postcode=postcode
        this.address=address
        this.phousenum=phousenum
        this.pstreetnum=pstreetnum
        this.pstreetname=pstreetname
        this.pstreettype=pstreettype
        this.psuburb=psuburb
        this.pstate=pstate
        this.ppostcode=ppostcode
        this.paddress=paddress
        this.app_id=app_id
        this.application_id=application_id
        this.meidicarenum=meidicarenum
        this.core_customer_id=core_customer_id
        this.core_account_number=core_account_number
        this.bank_bsb_number=bank_bsb_number
        this.postal_home_address_flag=postal_home_address_flag
        this.no_address_found_flag=no_address_found_flag
        this.skip=skip
        this.title=title

        //for home loan
        this.loantype=loantype
        this.property=property
        this.proptype=proptype
        this.payoutbal=payoutbal
        this.propaddr=propaddr
        this.purchaseprice=purchaseprice
        this.amtborrow=amtborrow
        this.loanterm=loanterm
        this.frequencyType=frequencyType



        this.prophousenum=prophousenum
        this.proppostcode=proppostcode
        this.propstate=propstate
        this.propstreetname=propstate
        this.propstreetnum=propstreetnum
        this.propstreettype=propstreettype
        this.propsuburb=propsuburb


        this.prophousenum_m=prophousenum_m
        this.proppostcode_m=proppostcode_m
        this.propstate_m=propstate_m
        this.propstreetname_m=propstate_m
        this.propstreetnum_m=propstreetnum_m
        this.propstreettype_m=propstreettype_m
        this.propsuburb_m=propsuburb_m
        
        // this.loanterm_n=loanterm_n
        this.repaymenttype=repaymenttype
        this.interesttype=interesttype
        this.fixedper=fixedper
        this.variableper=variableper
        this.consolidateMortage=consolidateMortage
        this.estvalue=estvalue
        this.propaddress_m=propaddress_m
        this.finInstitution=finInstitution
        this.consolidateotherMortage=consolidateotherMortage
        this.cc_estvalue=cc_estvalue
        this.cc_finInstitution=cc_finInstitution
        this.pl_estvalue=pl_estvalue
        this.pl_finInstitution=pl_finInstitution
        this.cl_estvalue=cl_estvalue
        this.cl_finInstitution=cl_finInstitution
        this.sl_estvalue=sl_estvalue
        this.sl_finInstitution=sl_finInstitution
        this.o_estvalue=o_estvalue
        this.o_finInstitution=o_finInstitution
        this.employed=employed
        this.employer=employer
        this.service=service
        this.companyName=companyName
        this.yearsEstablished=yearsEstablished
        this.earnPerMonth=earnPerMonth
        this.monthlyLivingExpenses=monthlyLivingExpenses
        this.ownership=ownership
        this.assettype=assettype
        this.assetvalue=assetvalue
        this.Liabilitiestype=Liabilitiestype
        this.Payable_Amount
        this. Payment_Frequency
        this. Balance_Pending
        this. Financial_Institution
        this.rentalincome=rentalincome
        this.assets=assets
        this.Liabilities=Liabilities
        this.asset_liability=asset_liability
        this.loanreason=loanreason

        this.brokerid=brokerid
        
    }
}