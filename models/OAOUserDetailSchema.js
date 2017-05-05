var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OAOUserDetailSchema = new Schema({
                userId:{type: String},
                userName:{type: String},
                password: {type: String},
                title:{type: String},
                fName:{type: String},
                mName:{type: String},
                lName:{type: String},
                dob:{type: String},
                age:{type:String},
                email:{type: String},
                mobile:{type: String},
                homeAddress:{type: String},
                postalAddress:{type: String},
                TFN:{type: String},
                exemptionReason:{type: String},
                passportNumber:{type: String},
                issuingCountry:{type: String},
                colourOfCard:{type: String},
                cardNumber:{type: String},
                referenceNumber:{type: String},
                validTo:{type: String},
                StateOfDrivingLicenseRegistration:{type: String},
                licenseNumber:{type: String},
                balance:{type: Number}          
    });

module.exports = mongoose.model('OAOUserDetailSchema', OAOUserDetailSchema);
