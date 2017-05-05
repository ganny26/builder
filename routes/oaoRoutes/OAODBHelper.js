var OAOApplicantSchema = require('../../models/OAOApplicantSchema');
var OAOSequenceGenerator = require('../../models/OAOSequenceGenerator');
var OAOPropertyDetail = require('../../models/OAOPropertyDetail');

module.exports = {

//INSERT OR UPDATE APPLICANTS RECORD 
    save:function(dataSave,callback){
        dataSave.save(function (err,result) {
            if (err) {
                return callback(err);
            }
             return callback(result);
        });
    },


// VALIDATION
    validation:function(req,res,callback){
        var postal_home_address_flag    =   req.body.postal_home_address_flag;
        var no_address_found_flag       =   req.body.no_address_found_flag;
     
     // first name 
     if(req.body.fname=="")
     {
        req.check('fname', 'ddd').notEmpty();
     }else if((req.body.fname).length < 3 || (req.body.fname) > 45)
     {
        req.check('fname', 'name must be with spacified range (3, 45)').len(3,45);
     }else if(re.test(req.body.fname)==false)
     {
        req.check('fname', 'Must contain letter and apostrophe').matches(/^[a-zA-Z '.-]+$/,'i');       
     }
        
    
    // Middle name 
        req.check('mname', 'Must contain letter and apostrophe').matches(/^[a-zA-Z '.-]+$/,'i');       
        req.check('mname', 'name must be with spacified range (3, 45)').len(3,45);
        req.check('mname', 'middle name can not be blank').notEmpty();
        
    // Last name
        req.check('mname', 'Must contain letter and apostrophe').matches(/^[a-zA-Z '.-]+$/,'i');       
        req.check('mname', 'last name must be with spacified range (3, 45)').len(3,45);
        req.check('lname', 'last name can not be blank').notEmpty();

    // date of birth
        req.check('dob', 'date of birth must be in [ YYYY-MM-DD ]').isDate({format: 'YYYY-MM-DD'})
        req.check('dob', 'date of birth can not be blank').notEmpty();

    // Email ID
        req.check('email', 'email id can not be blank').isEmail();

    //Mobile Number
        req.check('mobile', 'Mobile number must be in +61434653192').isMobilePhone('en-AU');
        req.check('mobile', 'Mobile number can not be blank').notEmpty()

    // address
        req.check('address', 'A valid address is required').notEmpty();
        if(postal_home_address_flag=='N')
        {
            req.check('paddress', 'A valid address is required').notEmpty();
        }
        
        if(no_address_found_flag=='N')
        {
            req.check('postcode', 'A valid address is required').notEmpty();
            req.check('ppostcode', 'A valid address is required').notEmpty();
        }
       

        var status = req.validationErrors();
        return callback(status);
    },

//CHECK FOR EXISTING APPLICANT IN DATABASE

    checkExistingApplicant:function(req,res,callback){
        OAOApplicantSchema.findOne({application_id:req.body.app_id},function(err,result){
          return callback(result);
        })
    },


//GENERATE APPLICATION REFERENCE ID
    GenerateApplicationReferenceId:function(req,res,callback){
        OAOSequenceGenerator.find(function(err,result){
            if(err)
            {
                return err;
            }
            return callback(result);
        })
    },

//UPDATING APPLICATION REFERENCE ID EVERY APPLICATION SUBMITTED

    UpdateApplicationReferenceIdGeneration:function(req,res,callback){
         OAOSequenceGenerator.find(function(err,result){
       OAOSequenceGenerator.findOneAndUpdate({ "_id": "58bcf123f36d2837b81098ff"},{app_ref_id:Number(result[0].app_ref_id)+1},function(err,result){
            if(err){
                return err;
            }
            return callback(result)
        })
         })
    },

//UPDATING SECTION ON BACK
    UpdateApplication:function(app_id,section,callback){
        var section="section_EVR[0]."+section;
        console.log(section)
       OAOApplicantSchema.findOneAndUpdate({ "application_id": app_id},{$set:{section_EVR:{"section_2":false}}},function(err,result){
            if(err){
                console.log(err)
                return err;
            }
            console.log(result)
            return callback(result)
        })
         
    },

//RESETTING APPLICATION REFERENCE ID EVERY DAY

    ResetApplicationReferenceId:function(req,res,callback){
         OAOSequenceGenerator.find(function(err,result){
        OAOSequenceGenerator.findOneAndUpdate({ "_id": "58bcf123f36d2837b81098ff"},{app_ref:0},function(err,result){
            if(err){
                return err;
            }
            return callback(result)
        })
         })
    },

getDropboxContent:function(PropertyType,Property,callback){
         OAOPropertyDetail.find({property_type:PropertyType,property:Property},function(err,result){
            if(err){
                return callback(err);
            }
                return callback(result);
        })
    },

    getMessages:function(PropertyType,callback){
         OAOPropertyDetail.find({property_type:PropertyType},function(err,result){
            if(err){
                return callback(err);
            }
                return callback(result);
        })
    },

    saveDropboxContent:function(dropBoxRecord,callback){
        dropBoxRecord.save(function (err,result) {
            if (err) {
                return callback(err);
            }
             return callback(result);
        });
    },

    getApplicantsRecord:function(ApplicaionID,callback){
        OAOApplicantSchema.find({application_id:ApplicaionID},function(err,result){
             if(err){
                return callback(err);
            }
                return callback(result);
           
        })
    },
    //GET SAVED RECORD 
     getSavedRecord:function(ApplicaionID,callback){
        OAOApplicantSchema.find({application_id:ApplicaionID,application_status:'SAV'},function(err,result){
             if(err){
                return callback(err,success=false);
            }
                return callback(result,success=true);
           
        })
    }      

};