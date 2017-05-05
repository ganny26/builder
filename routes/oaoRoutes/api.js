var express = require('express');


var OAODBHelper = require("./OAODBHelper");

var OAOApplicantSchema = require('../../models/OAOApplicantSchema');

var OAOPropertyDetail = require('../../models/OAOPropertyDetail');

var OAOApplicationHelper = require("./OAOApplicationHelper.js");

var OAORouter = express.Router();

var config = require("../../configFiles/DBconfigfile.json");

var device = require('express-device');
OAORouter.use(device.capture());

OAORouter.route('/sendOTP')
    .post(function (req, res) {
        try {


            OAODBHelper.getSavedRecord(req.body.application_id, function (result, success) {
               
               if (success == true && (result!==null && result!='')) {
                    console.log(result)
                    if (result[0].dob == req.body.dob) {
                        OAOApplicationHelper.genOTP(function (otp) {
                            OAOApplicationHelper.sendOTPMessage(result[0], otp);
                            OAOApplicationHelper.sendOTPMail(result[0], otp)
                            console.log(otp)
                            res.json({
                                sent: true,
                                success: true,
                                result: result[0]
                            });
                        });
                    } else {
                        console.log("inside else")
                        res.json({
                            sent: false,
                            success: false
                        });
                    }

                } else {
                    res.json({
                        sent: false,
                        success: false
                    });
                }

            })

        } catch (e) {
            console.log("error in captha")
        }
    });
OAORouter.route('/verifyOTP')
    .post(function (req, res) {
        OAOApplicationHelper.verifyOTP(req.body.otp, function (success) {
            console.log(success)
            res.json({ success: success });
        });

    });

OAORouter.route('/getDecrypted')
    .post(function (req, res) {
        OAOApplicationHelper.decrypt(req.body.app_id, function (d_appId) {
            console.log(d_appId)
            res.json({ d_appId: d_appId });
        });

    });

OAORouter.route('/Applicants')
    .post(function (req, res) {
        console.log("existing_cust_status" + req.body.existing_cust_status) //chandan
        console.log(req.device.type)
        OAODBHelper.GenerateApplicationReferenceId(req, res, function (result) {
            var app_id_ = req.body.app_id || OAOApplicationHelper.RefIdFormater(Number(result[0].app_ref_id) + 1);
            console.log(req.body)
            var Oao_product_customer_details = new OAOApplicantSchema({
                product_code:req.body.product_code,
                product_type: req.body.product_type,
                singleORjoint: req.body.singleORjoint,
                deviceType: req.device.type,
                existing_cust_status: req.body.existing_cust_status,
                title: req.body.title,
                application_id: app_id_,
                fname: req.body.fname,
                mname: req.body.mname,
                lname: req.body.lname,
                dob: req.body.dob,
                email: req.body.email,
                mobile: req.body.mobile,

                brokerid:req.body.brokerid,

                address: req.body.address,
                paddress: req.body.paddress,
                DLidState: req.body.DLidState,
                LNum: req.body.LNum,
                color: req.body.color,
                idnum: req.body.idnum,
                idstate: req.body.idstate,
                username: req.body.username,
                refnum: req.body.refnum,
                tfn: req.body.tfn,
                validTo: req.body.validTo,
                exemption: req.body.exemption,
                housenum: req.body.housenum,
                streetnum: req.body.streetnum,
                streetname: req.body.streetname,
                streettype: req.body.streettype,
                suburb: req.body.suburb,
                state: req.body.state,
                postcode: req.body.postcode,
                phousenum: req.body.phousenum,
                pstreetnum: req.body.pstreetnum,
                pstreetname: req.body.pstreetname,
                pstreettype: req.body.pstreettype,
                psuburb: req.body.psuburb,
                pstate: req.body.pstate,
                ppostcode: req.body.ppostcode,
                meidicarenum: req.body.meidicarenum,
                no_address_found_flag: req.body.no_address_found_flag,
                section_EVR: {},
                bot_fields: {},
                Mandatory_fields_EVR: [{
                    section_1_fields: [{
                        lname: true,
                        fname: true,
                        dob: true,
                        email:true,
                        mobile:true,
                        address:false,
                       
                        paddress:false

                    }],
                    section_2_fields: [{
                        tfn:false,
                        exemption:false
                    }],
                    section_3_fields: [{

                    }]
                }]
            })
            OAODBHelper.checkExistingApplicant(req, res, function (result) {
                if (!result) {
                    OAODBHelper.save(Oao_product_customer_details, function (result) {
                        OAODBHelper.UpdateApplicationReferenceIdGeneration(req, res, function (result) {

                        })
                          //Send mail for Everyday
                        var data = {
                            'fname': result.fname,
                            'lname': result.lname
                        }

                        OAOApplicationHelper.SendMail(result.email, result.application_id, data, 'SAVE_SUBMISSION', function (callbackResult) {
                            console.log('Save submission mail sent status ', JSON.stringify(callbackResult));
                        })
                        res.json({ Result: result });
                    })

                } else if (result.section_EVR[0].section_1 == false) {
                    if (req.body.fname != null) {
                        result.product_type = req.body.prod_type
                        result.singleORjoint = req.bodysingleORjoint
                        result.title = req.body.title
                        result.fname = req.body.fname
                        result.mname = req.body.mname
                        result.lname = req.body.lname
                        result.dob = req.body.dob
                        result.email = req.body.email,
                        result.brokerid=req.body.brokerid,
                        result.mobile = req.body.mobile,
                            result.address = req.body.address,
                            result.paddress = req.body.paddress,
                            result.housenum = req.body.housenum,
                            result.streetnum = req.body.streetnum,
                            result.streetname = req.body.streetname,
                            result.streettype = req.body.streettype,
                            result.suburb = req.body.suburb,
                            result.state = req.body.state,
                            result.postcode = req.body.postcode,
                            result.phousenum = req.body.phousenum,
                            result.pstreetnum = req.body.pstreetnum,
                            result.pstreetname = req.body.pstreetname,
                            result.pstreettype = req.body.pstreettype,
                            result.psuburb = req.body.psuburb,
                            result.pstate = req.body.pstate,
                            result.ppostcode = req.body.ppostcode,
                            result.postal_home_address_flag = req.body.postal_home_address_flag,
                            result.no_address_found_flag = req.body.no_address_found_flag
                        if (req.body.postal_home_address_flag == true) {
                            result.paddress = req.body.address;
                            result.pstreetname = req.body.streetname;
                            result.ppostcode = req.body.postcode;
                            result.pstate = req.body.state;

                        }
                    }
                    // result.bot_fields[0].noOfRemaindersSent=req.body.remainder,//change

                    if (req.body.address != null) {
                        result.section_EVR[0].section_1 = "true";
                         result.Mandatory_fields_EVR[0].section_1_fields[0].address = "true";
                        result.Mandatory_fields_EVR[0].section_1_fields[0].paddress = "true";
                    } else {
                        result.section_EVR[0].section_1 = "false";
                    }
                    OAODBHelper.save(result, function (result) {

                        res.status(200).json({
                            message: 'Updated message',
                            Result: result
                        });
                    })

                }
                else if (result.section_EVR[0].section_2 == false) {
                     result.tfn = req.body.tfn,
                      result.exemption = req.body.exemption
                      if ((result.tfn != null || result.exemption != null) && (req.body.skip == false || req.body.skip == 'false')) {
                        result.section_EVR[0].section_3 = "false";
						result.section_EVR[0].section_2 = "true";
                        result.Mandatory_fields_EVR[0].section_2_fields[0].tfn = "true";
                        result.Mandatory_fields_EVR[0].section_2_fields[0].exemption = "true";
                        if (req.body.bot == 'true') {
                            if (result.tfn == "No" || result.tfn == "NO" || result.tfn == "no") {
                                result.Mandatory_fields_EVR[0].section_2_fields[0].tfn = "true";
                                result.Mandatory_fields_EVR[0].section_2_fields[0].exemption = "false";
                                result.section_EVR[0].section_2 = "false";
                            } else {
                                result.section_EVR[0].section_2 = "true";
                                result.section_EVR[0].section_3 = "false";
                                result.deviceType = "bot";
                                result.application_status = "CMP";
                                OAOApplicationHelper.SendMail(result.email, result.application_id, function (callbackResult) {
                                })
                                OAOApplicationHelper.BSB_Number(function (CallBackResult) {
                                    result.bank_bsb_number = CallBackResult;
                                })
                                console.log("req.body.core_customer_id:");
                                  if(req.body.existing_cust_status!="Y")
                                    {
                                        OAOApplicationHelper.Gen_custId(function (CallBackResult) {
                                        result.core_customer_id = CallBackResult;
                                        })
                                    } else{
                                        result.core_customer_id=req.body.core_customer_id;
                                        }
                                OAOApplicationHelper.Gen_coreAcc_no(function (CallBackResult) {
                                    result.core_account_number = CallBackResult;
                                })

                            }

                        }
                    OAODBHelper.save(result, function (result) {

                        res.status(200).json({
                            message: 'Updated message',
                            Result: result
                        });
                    })
                      }else if (req.body.skip == true) {
                        console.log("in else")
                        result.section_EVR[0].section_2 = "true";
                        result.section_EVR[0].section_3 = "false";
                        result.application_status = "CMP";

                        OAOApplicationHelper.BSB_Number(function (CallBackResult) {
                            result.bank_bsb_number = CallBackResult;
                        })

                        if(req.body.existing_cust_status!="Y")
                        {
                           OAOApplicationHelper.Gen_custId(function (CallBackResult) {
                            result.core_customer_id = CallBackResult;
                         })
                         } else{
                             result.core_customer_id=req.body.core_customer_id;
                         }

                        OAOApplicationHelper.Gen_coreAcc_no(function (CallBackResult) {
                            result.core_account_number = CallBackResult;
                        })
                        //gathering data to render
                        var data = {
                            'fname': result.fname,
                            'lname': result.lname,
                            'bsb_number': result.bank_bsb_number,
                            'core_customer_id': result.core_customer_id,
                            'core_account_number': result.core_account_number,
                            'product_type': result.product_type
                        }
                        console.log('Everyday Account Data', JSON.stringify(data));
                        //final submission mail
                        OAOApplicationHelper.SendMail(result.email, result.application_id, data, 'FINAL_SUBMISSION', function (callbackResult) {
                            console.log('Everyday Account final submission mail sent', JSON.stringify(callbackResult));
                        })


                        OAODBHelper.save(result, function (result) {
                            res.status(200).json({
                                message: 'Updated message',
                                Result: result
                            });
                        })

                    }
                }
                else if (result.section_EVR[0].section_3 == false) {
                    //result.bot_fields[0].noOfRemaindersSent=req.body.remainder,//change
                   
                        result.DLidState = req.body.DLidState,
                       
                        result.LNum = req.body.LNum,
                        result.meidicarenum = req.body.meidicarenum,
                        result.color = req.body.color,
                        result.idnum = req.body.idnum,
                        result.idstate = req.body.idstate,
                        result.refnum = req.body.refnum,
                        result.validTo = req.body.validTo
                    
                    if (req.body.skip == true) {
                        console.log("in else")
                        result.section_EVR[0].section_3 = "true";
                        result.application_status = "CMP";

                        OAOApplicationHelper.BSB_Number(function (CallBackResult) {
                            result.bank_bsb_number = CallBackResult;
                        })


                       if(req.body.existing_cust_status!="Y")
                        {
                           OAOApplicationHelper.Gen_custId(function (CallBackResult) {
                            result.core_customer_id = CallBackResult;
                         })
                         } else{
                             result.core_customer_id=req.body.core_customer_id;
                         }

                        OAOApplicationHelper.Gen_coreAcc_no(function (CallBackResult) {
                            result.core_account_number = CallBackResult;
                        })
                        //gathering data to render
                        var data = {
                            'fname': result.fname,
                            'lname': result.lname,
                            'bsb_number': result.bank_bsb_number,
                            'core_customer_id': result.core_customer_id,
                            'core_account_number': result.core_account_number,
                            'product_type': result.product_type
                        }
                        console.log('Everyday Account Data', JSON.stringify(data));
                        //final submission mail
                        OAOApplicationHelper.SendMail(result.email, result.application_id, data, 'FINAL_SUBMISSION', function (callbackResult) {
                            console.log('Everyday Account final submission mail sent', JSON.stringify(callbackResult));
                        })


                        OAODBHelper.save(result, function (result) {
                            res.status(200).json({
                                message: 'Updated message',
                                Result: result
                            });
                        })

                    } else {
                        console.log("tttetstsj")
                        console.log(result);
                        OAODBHelper.save(Oao_product_customer_details, function (result) {
                            res.status(200).json({
                                message: 'Updated message',
                                Result: result
                            });
                        })
                    }
                }
                else {
                    res.status(404).json({
                        message: 'Page Not found',

                    });

                }
            })

        })
    });

// OAO HOMELOAN Applicants

OAORouter.route('/HomeLoanApplicants')
    .post(function (req, res) {
        OAODBHelper.GenerateApplicationReferenceId(req, res, function (result) {

            var app_id_ = req.body.app_id || OAOApplicationHelper.RefIdFormater(Number(result[0].app_ref_id) + 1);
            console.log("body" + req.body)

            console.log(req.body)
            var Oao_product_customer_details = new OAOApplicantSchema({
                product_code:req.body.product_code,
                product_type: req.body.product_type,
                deviceType: req.device.type,
                title: req.body.title,
                existing_cust_status: req.body.existing_cust_status,
                singleORjoint: req.body.singleORjoint,
                application_id: app_id_,
                fname: req.body.fname,
                mname: req.body.mname,
                lname: req.body.lname,
                dob: req.body.dob,
                email: req.body.email,
                mobile: req.body.mobile,
                  brokerid:req.body.brokerid,
                address: req.body.address,
                paddress: req.body.paddress,
                DLidState: req.body.DLidState,
                LNum: req.body.LNum,
                color: req.body.color,
                idnum: req.body.idnum,
                idstate: req.body.idstate,
                username: req.body.username,
                refnum: req.body.refnum,
                tfn: req.body.tfn,
                validTo: req.body.validTo,
                exemption: req.body.exemption,
                housenum: req.body.housenum,
                streetnum: req.body.streetnum,
                streetname: req.body.streetname,
                streettype: req.body.streettype,
                suburb: req.body.suburb,
                state: req.body.state,
                postcode: req.body.postcode,
                phousenum: req.body.phousenum,
                pstreetnum: req.body.pstreetnum,
                pstreetname: req.body.pstreetname,
                pstreettype: req.body.pstreettype,
                psuburb: req.body.psuburb,
                pstate: req.body.pstate,
                ppostcode: req.body.ppostcode,
                meidicarenum: req.body.meidicarenum,
                loantype: req.body.loantype,
                property: req.body.property,
                proptype: req.body.proptype,
                payoutbal: req.body.payoutbal,
                propaddr: req.body.propaddr,
                purchaseprice: req.body.purchaseprice,
                amtborrow: req.body.amtborrow,
                loanterm: req.body.loanterm,
                frequencyType: req.body.frequencyType,
                repaymenttype: req.body.repaymenttype,
                interesttype: req.body.interesttype,
                fixedper: req.body.fixedper,
                variableper: req.body.variableper,
                consolidateMortage: req.body.consolidateMortage,
                estvalue: req.body.estvalue,
                propaddress_m: req.body.propaddress_m,
                finInstitution: req.body.finInstitution,
                consolidateotherMortage: req.body.consolidateotherMortage,
                cc_estvalue: req.body.cc_estvalue,
                cc_finInstitution: req.body.cc_finInstitution,
                pl_estvalue: req.body.pl_estvalue,
                pl_finInstitution: req.body.pl_finInstitution,
                cl_estvalue: req.body.cl_estvalue,
                cl_finInstitution: req.body.cl_finInstitution,
                sl_estvalue: req.body.sl_estvalue,
                sl_finInstitution: req.body.sl_finInstitution,
                o_estvalue: req.body.o_estvalue,
                o_finInstitution: req.body.o_finInstitution,
                ownership: req.body.ownership,
                rentalincome: req.body.rentalincome,
                no_address_found_flag: req.body.no_address_found_flag,

				prophousenum:req.body.prophousenum,
				propstreetnum:req.body.propstreetnum,
				propstreetname:req.body.propstreetname,
				propstreettype:req.body.propstreettype,
				propsuburb:req.body.propsuburb,
				propstate:req.body.propstate,
				proppostcode:req.body.proppostcode,
 
	prophousenum_m:req.body.prophousenum_m,
				propstreetnum_m:req.body.propstreetnum_m,
				propstreetname_m:req.body.propstreetname_m,
				propstreettype_m:req.body.propstreettype_m,
				propsuburb_m:req.body.propsuburb_m,
				propstate_m:req.body.propstate_m,
				proppostcode_m:req.body.proppostcode_m,

                employed: req.body.employed,
                employer: req.body.employer,
                service: req.body.service,
                companyName: req.body.companyName,
                yearsEstablished: req.body.yearsEstablished,
                earnPerMonth: req.body.earnPerMonth,
                monthlyLivingExpenses: req.body.monthlyLivingExpenses,

                assets: req.body.assets,
                Liabilities: req.body.Liabilities,
                section_HML: {},
                bot_fields: {},
                Mandatory_fields_HML: [{
                    section_1_fields: [{
                        lanme: true,
                        fname: true,
                        dob: true,
                        email: true,
                        mobile: true,

                        address:false,
                        paddress:false
                    }],
                    section_2_fields: [{
                        loantype: false,
                        property: false,
                        proptype: false,
                        payoutbal: false,
                        propaddr: false,
                        purchaseprice: false,
                        ownership: false,
                        amtborrow: false,
                        loanterm: false,
                        frequencyType: false,
                        interesttype: false,
                        fixedper: false,
                        variableper: false,
                        repaymenttype: false,
                        estvalue: false,
                        propaddress_m: false,
						
						prophousenum:false,
						propstreetnum:false,
						propstreetname:false,
						propstreettype:false,
						propsuburb:false,
						propstate:false,
						proppostcode:false,
 
						prophousenum_m:false,
						propstreetnum_m:false,
						propstreetname_m:false,
						propstreettype_m:false,
						propsuburb_m:false,
						propstate_m:false,
						proppostcode_m:false,
 
                        finInstitution: false
                    }],
                    section_3_fields: [{
                        employed: false,
                        employer: false,
                        service: false,
                        companyName: false,
                        yearsEstablished: false,
                        earnPerMonth: false,
                        monthlyLivingExpenses: false
                    }]
                }]
            })

            console.log("sample result" + Oao_product_customer_details);
            OAODBHelper.checkExistingApplicant(req, res, function (result) {
                if (!result) {
                    OAODBHelper.save(Oao_product_customer_details, function (result) {
                        OAODBHelper.UpdateApplicationReferenceIdGeneration(req, res, function (result) {

                        })
                        //gathering data 
                        var data = {
                            'fname': result.fname,
                            'lname': result.lname,
                            'product_type': result.product_type
                        }
                        console.log('Home Loan Application data', JSON.stringify(data));
                        OAOApplicationHelper.SendMail(result.email, result.application_id, data, 'SAVE_SUBMISSION', function (callbackResult) {
                            console.log('Home loan submission mail status', JSON.stringify(callbackResult));
                        })
                        res.json({ Result: result });
                    })

                } else if (result.section_HML[0].section_1 == false) {
                    if (req.body.fname != null) {
                        result.product_type = req.body.prod_type
                        result.singleORjoint = req.bodysingleORjoint
                        result.title = req.body.title
                        result.fname = req.body.fname
                        result.mname = req.body.mname
                        result.lname = req.body.lname
                        result.dob = req.body.dob
                        result.email = req.body.email,
                           result.brokerid=req.body.brokerid,
                            result.mobile = req.body.mobile
                    }
                    else {
                            result.address = req.body.address,
                            result.paddress = req.body.paddress,
                            result.housenum = req.body.housenum,
                            result.streetnum = req.body.streetnum,
                            result.streetname = req.body.streetname,
                            result.streettype = req.body.streettype,
                            result.suburb = req.body.suburb,
                            result.state = req.body.state,
                            result.postcode = req.body.postcode,
                            result.phousenum = req.body.phousenum,
                            result.pstreetnum = req.body.pstreetnum,
                            result.pstreetname = req.body.pstreetname,
                            result.pstreettype = req.body.pstreettype,
                            result.psuburb = req.body.psuburb,
                            result.pstate = req.body.pstate,
                            result.ppostcode = req.body.ppostcode,
							result.prophousenum=req.body.prophousenum,
							result.propstreetnum=req.body.propstreetnum,
							result.propstreettype=req.body.propstreettype,
							result.propstreetname=req.body.propstreetname,
							result.propsuburb=req.body.propsuburb,
							result.propstate=req.body.propstate,
							result.proppostcode=req.body.proppostcode,
                            result.postal_home_address_flag = req.body.postal_home_address_flag,
                            result.no_address_found_flag = req.body.no_address_found_flag
                        if (req.body.postal_home_address_flag == true) {
                            result.paddress = req.body.address;
                            result.pstreetname = req.body.streetname;
                            result.ppostcode = req.body.postcode;
                            result.pstate = req.body.state;

                        }
                    }
                    // result.bot_fields[0].noOfRemaindersSent=req.body.remainder,//change

                    if (req.body.address != null) {
						result.address=req.body.address;
                        result.section_HML[0].section_1 = "true";
                        result.Mandatory_fields_HML[0].section_1_fields[0].address = "true";
                        result.Mandatory_fields_HML[0].section_1_fields[0].paddress = "true";
                    } else {
                        result.section_HML[0].section_1 = "false";
                    }
                    OAODBHelper.save(result, function (result) {

                        res.status(200).json({
                            message: 'Updated message',
                            Result: result
                        });
                    })

                }
                else if (result.section_HML[0].section_2 == false) {
                    console.log("enter of section 2");
                    if (req.body.loantype != null) {
                        result.loantype = req.body.loantype,
                            result.property = req.body.property,
                            result.proptype = req.body.proptype,
                            result.payoutbal = req.body.payoutbal,
                            result.propaddr = req.body.propaddr,
                            result.purchaseprice = req.body.purchaseprice,
                            result.ownership = req.body.ownership,
                            result.rentalincome = req.body.rentalincome,
							 result.prophousenum = req.body.prophousenum,
                            result.propstreetnum = req.body.propstreetnum,
                            result.propstreetname = req.body.propstreetname,
                            result.propstreettype = req.body.propstreettype,
                            result.propsuburb = req.body.propsuburb,
                            result.propstate = req.body.propstate,
                            result.proppostcode = req.body.proppostcode
                    }
                    else {
                        result.amtborrow = req.body.amtborrow,
                            result.loanterm = req.body.loanterm,
                            result.frequencyType = req.body.frequencyType,
                            result.interesttype = req.body.interesttype,
                            result.fixedper = req.body.fixedper,
                            result.variableper = req.body.variableper,
                            result.repaymenttype = req.body.repaymenttype,
                            result.estvalue = req.body.estvalue,
                            result.propaddress_m = req.body.propaddress_m,
                            result.finInstitution = req.body.finInstitution,
                            result.consolidateMortage = req.body.consolidateMortage,

                            result.prophousenum_m = req.body.prophousenum_m,
                            result.propstreetnum_m = req.body.propstreetnum_m,
                            result.propstreetname_m = req.body.propstreetname_m,
                            result.propstreettype_m = req.body.propstreettype_m,
                            result.propsuburb_m = req.body.propsuburb_m,
                            result.propstate_m = req.body.propstate_m,
                            result.proppostcode_m = req.body.proppostcode_m,
                            
                            result.consolidateotherMortage = req.body.consolidateotherMortage,
                            result.cc_estvalue = req.body.cc_estvalue,
                            result.cc_finInstitution = req.body.cc_finInstitution,
                            result.pl_estvalue = req.body.pl_estvalue,
                            result.pl_finInstitution = req.body.pl_finInstitution,
                            result.cl_estvalue = req.body.cl_estvalue,
                            result.cl_finInstitution = req.body.cl_finInstitution,
                            result.sl_estvalue = req.body.sl_estvalue,
                            result.sl_finInstitution = req.body.sl_finInstitution,
                            result.o_estvalue = req.body.o_estvalue,
                            result.o_finInstitution = req.body.o_finInstitution

                    }


                    console.log("2nd section result" + result);
                    if (req.body.loantype != null || req.body.proptype != null) {
                         result.propaddress_m = req.body.propaddress_m;
                         result.prophousenum_m = req.body.prophousenum_m;
                            result.propstreetnum_m = req.body.propstreetnum_m;
                            result.propstreetname_m = req.body.propstreetname_m;
                            result.propstreettype_m = req.body.propstreettype_m;
                            result.propsuburb_m = req.body.propsuburb_m;
                            result.propstate_m = req.body.propstate_m;
                            result.proppostcode_m = req.body.proppostcode_m;
                        result.section_HML[0].section_2 = "false";

                        
                        OAODBHelper.save(result, function (result) {

                            res.status(200).json({
                                message: 'Updated message',
                                Result: result
                            });
                        })
                    } else {
                        result.section_HML[0].section_2 = "true";
                        result.Mandatory_fields_HML[0].section_2_fields[0].loantype = "true";
                        result.Mandatory_fields_HML[0].section_2_fields[0].property = "true";
                        result.Mandatory_fields_HML[0].section_2_fields[0].proptype = "true";
                        result.Mandatory_fields_HML[0].section_2_fields[0].payoutbal = "true";
                        result.Mandatory_fields_HML[0].section_2_fields[0].propaddr = "true";
                        result.Mandatory_fields_HML[0].section_2_fields[0].purchaseprice = "true";
                        result.Mandatory_fields_HML[0].section_2_fields[0].ownership = "true";
                        result.Mandatory_fields_HML[0].section_2_fields[0].amtborrow = "true";
                        result.Mandatory_fields_HML[0].section_2_fields[0].loanterm = "true";
                        result.Mandatory_fields_HML[0].section_2_fields[0].frequencyType = "true";
                        result.Mandatory_fields_HML[0].section_2_fields[0].interesttype = "true";
                        result.Mandatory_fields_HML[0].section_2_fields[0].fixedper = "true";
                        result.Mandatory_fields_HML[0].section_2_fields[0].variableper = "true";
                        result.Mandatory_fields_HML[0].section_2_fields[0].repaymenttype = "true";
                        result.Mandatory_fields_HML[0].section_2_fields[0].estvalue = "true";
                        result.Mandatory_fields_HML[0].section_2_fields[0].propaddress_m = "true";
                        result.Mandatory_fields_HML[0].section_2_fields[0].finInstitution = "true";
                        OAODBHelper.save(result, function (result) {

                            res.status(200).json({
                                message: 'Updated message',
                                Result: result
                            });
                        })
                    }


                }
                else if (result.section_HML[0].section_3 == false) {
                    // result.bot_fields[0].noOfRemaindersSent=req.body.remainder,//change
                    if (req.body.employed != null) {
                        result.employed = req.body.employed,
                            result.employer = req.body.employer,
                            result.service = req.body.service,
                            result.companyName = req.body.companyName,
                            result.yearsEstablished = req.body.yearsEstablished,
                            result.earnPerMonth = req.body.earnPerMonth,
                            result.monthlyLivingExpenses = req.body.monthlyLivingExpenses
                        if (req.body.asset_liability == true) {
                            result.assets = req.body.assets,
                                result.Liabilities = req.body.Liabilities
                        }
                    } else if (req.body.LNum != null) {
                        result.DLidState = req.body.DLidState,
                            result.LNum = req.body.LNum,
                            result.meidicarenum = req.body.meidicarenum,
                            result.color = req.body.color,
                            result.idnum = req.body.idnum,
                            result.idstate = req.body.idstate,
                            result.refnum = req.body.refnum,
                            result.validTo = req.body.validTo
                    }
                    console.log("in sec 3" + result)
                    if (req.body.employed != null && req.body.LNum == null && req.body.skip == false) {
                        console.log("in if sec 3")
                        result.section_HML[0].section_3 = "false";
                        OAODBHelper.save(result, function (result) {
                            res.status(200).json({
                                message: 'Updated message',
                                Result: result
                            });
                        })

                    }
                    else if (req.body.skip == true) {

                        result.section_HML[0].section_3 = "true";
                        result.application_status = "CMP";

                        result.Mandatory_fields_HML[0].section_3_fields[0].employed == "true",
                            result.Mandatory_fields_HML[0].section_3_fields[0].employer = "true",
                            result.Mandatory_fields_HML[0].section_3_fields[0].service = "true",
                            result.Mandatory_fields_HML[0].section_3_fields[0].companyName = "true",
                            result.Mandatory_fields_HML[0].section_3_fields[0].yearsEstablished = "true",
                            result.Mandatory_fields_HML[0].section_3_fields[0].earnPerMonth = "true",
                            result.Mandatory_fields_HML[0].section_3_fields[0].monthlyLivingExpenses = "true"
                        //gathering data for Home Loan
                        var data = {
                            'fname': result.fname,
                            'lname': result.lname,
                            'product_type': result.product_type
                        }
                        console.log('Final Data', JSON.stringify(data));
                        //sending mail for home loan final submission
                        OAOApplicationHelper.SendMail(result.email, result.application_id, data, 'FINAL_SUBMISSION', function (callbackResult) {
                            console.log('Home Loan Final submission mail status', JSON.stringify(callbackResult));
                        })

                        OAODBHelper.save(result, function (result) {
                            res.status(200).json({
                                message: 'Updated message',
                                Result: result
                            });
                        })

                    }
                }
                else {
                    res.status(404).json({
                        message: 'Page Not found',

                    });

                }
            })

        })
    });

//ends HOMELOAN


// OAO PERSONALLOAN Applicants

OAORouter.route('/PersonalLoanApplicants')
    .post(function (req, res) {
        OAODBHelper.GenerateApplicationReferenceId(req, res, function (result) {

            var app_id_ = req.body.app_id || OAOApplicationHelper.RefIdFormater(Number(result[0].app_ref_id) + 1);
            console.log("body" + req.body)

            console.log(req.body)
            var Oao_product_customer_details = new OAOApplicantSchema({
                product_code:req.body.product_code,
                product_type: req.body.product_type,
                singleORjoint: req.body.singleORjoint,
                existing_cust_status: req.body.existing_cust_status,
                title: req.body.title,
                application_id: app_id_,
                deviceType: req.device.type,
                fname: req.body.fname,
                mname: req.body.mname,
                lname: req.body.lname,
                dob: req.body.dob,
                email: req.body.email,
                brokerid:req.body.brokerid,
                mobile: req.body.mobile,
                address: req.body.address,
                paddress: req.body.paddress,
                DLidState: req.body.DLidState,
                LNum: req.body.LNum,
                color: req.body.color,
                idnum: req.body.idnum,
                idstate: req.body.idstate,
                username: req.body.username,
                refnum: req.body.refnum,
                tfn: req.body.tfn,
                validTo: req.body.validTo,
                exemption: req.body.exemption,
                housenum: req.body.housenum,
                streetnum: req.body.streetnum,
                streetname: req.body.streetname,
                streettype: req.body.streettype,
                suburb: req.body.suburb,
                state: req.body.state,
                postcode: req.body.postcode,
                phousenum: req.body.phousenum,
                pstreetnum: req.body.pstreetnum,
                pstreetname: req.body.pstreetname,
                pstreettype: req.body.pstreettype,
                psuburb: req.body.psuburb,
                pstate: req.body.pstate,
                ppostcode: req.body.ppostcode,
                meidicarenum: req.body.meidicarenum,

                loanreason: req.body.loanreason,

                amtborrow: req.body.amtborrow,
                loanterm: req.body.loanterm,
                frequencyType: req.body.frequencyType,
                no_address_found_flag: req.body.no_address_found_flag,

                employed: req.body.employed,
                employer: req.body.employer,
                service: req.body.service,
                companyName: req.body.companyName,
                yearsEstablished: req.body.yearsEstablished,
                earnPerMonth: req.body.earnPerMonth,
                monthlyLivingExpenses: req.body.monthlyLivingExpenses,

                assets: req.body.assets,
                Liabilities: req.body.Liabilities,
                section_PRL: {},
                bot_fields: {},
                Mandatory_fields_PRL: [{
                    section_1_fields: [{
                        lname: true,
                        fname: true,
                        dob: true,
                        email: true,
                        mobile: true,
                        address:false,
                        paddress:false
                    }],
                    section_2_fields: [{
                        amtborrow: false,
                        loanterm: false,
                        frequencyType: false,
                        loanreason: false
                    }],
                    section_3_fields: [{
                        employed: false,
                        employer: false,
                        service: false,
                        companyName: false,
                        yearsEstablished: false,
                        earnPerMonth: false,
                        monthlyLivingExpenses: false
                    }]
                }]
            })

            console.log("sample result" + Oao_product_customer_details);
            OAODBHelper.checkExistingApplicant(req, res, function (result) {
                if (!result) {
                    OAODBHelper.save(Oao_product_customer_details, function (result) {
                        OAODBHelper.UpdateApplicationReferenceIdGeneration(req, res, function (result) {

                        })
                        var data = {
                                'fname': result.fname,
                                'lname': result.lname,
                                'product_type': result.product_type
                            }
                            console.log('Personal Load Account data', JSON.stringify(data));
                            //sending mail after save submission
                            OAOApplicationHelper.SendMail(result.email, result.application_id, data, 'SAVE_SUBMISSION', function (callbackResult) {
                                console.log('Personal load account save mail sendt status', JSON.stringify(callbackResult));
                            })
                        res.json({ Result: result });
                    })

                } else if (result.section_PRL[0].section_1 == false) {
                    if (req.body.fname != null) {
                        result.product_type = req.body.product_type
                        result.singleORjoint = req.body.singleORjoint
                        result.title = req.body.title
                        result.fname = req.body.fname
                        result.mname = req.body.mname
                        result.lname = req.body.lname
                           result.brokerid=req.body.brokerid
                        result.dob = req.body.dob
                    result.email = req.body.email,
                        result.mobile = req.body.mobile
                    }
                    else {
                        result.address = req.body.address,
                        result.paddress = req.body.paddress,
                        result.housenum = req.body.housenum,
                        result.streetnum = req.body.streetnum,
                        result.streetname = req.body.streetname,
                        result.streettype = req.body.streettype,
                        result.suburb = req.body.suburb,
                        result.state = req.body.state,
                        result.postcode = req.body.postcode,
                        result.phousenum = req.body.phousenum,
                        result.pstreetnum = req.body.pstreetnum,
                        result.pstreetname = req.body.pstreetname,
                        result.pstreettype = req.body.pstreettype,
                        result.psuburb = req.body.psuburb,
                        result.pstate = req.body.pstate,
                        result.ppostcode = req.body.ppostcode,
                        result.postal_home_address_flag = req.body.postal_home_address_flag,
                        result.no_address_found_flag = req.body.no_address_found_flag
                        if (req.body.postal_home_address_flag == true) {
                            result.paddress = req.body.address;
                            result.pstreetname = req.body.streetname;
                            result.ppostcode = req.body.postcode;
                            result.pstate = req.body.state;

                        }
                    }
                    // result.bot_fields[0].noOfRemaindersSent=req.body.remainder,//change

                    if (req.body.address != null) {
                        result.section_PRL[0].section_1 = "true";
                        result.Mandatory_fields_PRL[0].section_1_fields[0].address = "true";
                        result.Mandatory_fields_PRL[0].section_1_fields[0].paddress = "true";
                    } else {
                        result.section_PRL[0].section_1 = "false";
                    }
                    OAODBHelper.save(result, function (result) {

                        res.status(200).json({
                            message: 'Updated message',
                            Result: result
                        });
                    })
                }
                else if (result.section_PRL[0].section_2 == false) {
                    console.log("enter of section 2");
                    if (req.body.amtborrow != null) {
                        result.amtborrow = req.body.amtborrow,
                            result.loanterm = req.body.loanterm,
                            result.frequencyType = req.body.frequencyType,
                            result.loanreason = req.body.loanreason

                    }


                    console.log("2nd section result" + result);
                    if (req.body.amtborrow != null) {

                        result.section_PRL[0].section_2 = "true";
                        result.Mandatory_fields_PRL[0].section_2_fields[0].amtborrow = "true";
                        result.Mandatory_fields_PRL[0].section_2_fields[0].loanterm = "true";
                        result.Mandatory_fields_PRL[0].section_2_fields[0].frequencyType = "true";
                        console.log("success condtion in section 2" + result);
                        OAODBHelper.save(result, function (result) {
                            

                            res.status(200).json({
                                message: 'Updated message',
                                Result: result
                            });
                        })
                    } else {
                        console.log("false constion");
                        result.section_PRL[0].section_2 = "false";
                        OAODBHelper.save(result, function (result) {

                            res.status(200).json({
                                message: 'Updated message',
                                Result: result
                            });
                        })
                    }


                }
                else if (result.section_PRL[0].section_3 == false) {
                    // result.bot_fields[0].noOfRemaindersSent=req.body.remainder,//change
                    if (req.body.employed != null) {
                        result.employed = req.body.employed,
                            result.employer = req.body.employer,
                            result.service = req.body.service,
                            result.companyName = req.body.companyName,
                            result.yearsEstablished = req.body.yearsEstablished,
                            result.earnPerMonth = req.body.earnPerMonth,
                            result.monthlyLivingExpenses = req.body.monthlyLivingExpenses
                        if (req.body.asset_liability == true) {
                            result.assets = req.body.assets,
                                result.Liabilities = req.body.Liabilities
                        }
                    } else if (req.body.LNum != null) {
                        result.DLidState = req.body.DLidState,
                            result.LNum = req.body.LNum,
                            result.meidicarenum = req.body.meidicarenum,
                            result.color = req.body.color,
                            result.idnum = req.body.idnum,
                            result.idstate = req.body.idstate,
                            result.refnum = req.body.refnum,
                            result.validTo = req.body.validTo

                    }
                    console.log("in sec 3" + result)
                    if (req.body.employed != null || req.body.monthlyLivingExpenses != '' && req.body.LNum == null && req.body.skip == false) {
                        console.log("in if sec 3")
                        result.section_PRL[0].section_3 = "false";
                        OAODBHelper.save(result, function (result) {
                            res.status(200).json({
                                message: 'Updated message',
                                Result: result
                            });
                        })

                    }
                    else if (req.body.skip == true) {

                        result.section_PRL[0].section_3 = "true";
                        result.application_status = "CMP";

                        result.Mandatory_fields_PRL[0].section_3_fields[0].employed == "true",
                            result.Mandatory_fields_PRL[0].section_3_fields[0].employer = "true",
                            result.Mandatory_fields_PRL[0].section_3_fields[0].service = "true",
                            result.Mandatory_fields_PRL[0].section_3_fields[0].companyName = "true",
                            result.Mandatory_fields_PRL[0].section_3_fields[0].yearsEstablished = "true",
                            result.Mandatory_fields_PRL[0].section_3_fields[0].earnPerMonth = "true",
                            result.Mandatory_fields_PRL[0].section_3_fields[0].monthlyLivingExpenses = "true"
                        //final submission data

                        var data = {
                            'fname': result.fname,
                            'lname': result.lname,
                            'product_type': result.product_type
                        }
                        console.log('Personal account load data', JSON.stringify(data));
                        OAOApplicationHelper.SendMail(result.email, result.application_id, data, 'FINAL_SUBMISSION', function (callbackResult) {
                            console.log('Personal account loan final submission mail status', JSON.stringify(callbackResult));
                        })
                        OAODBHelper.save(result, function (result) {
                            res.status(200).json({
                                message: 'Updated message',
                                Result: result
                            });
                        })

                    }
                }
                else {
                    res.status(404).json({
                        message: 'Page Not found',

                    });

                }
            })

        })
    });

//ends PERSONALLOAN


OAORouter.get('/getConfig', function (req, res) {
    res.json({ data: config });
});

OAORouter.get('/getConfig/:key', function(req, res) {
    res.json({ data: config[req.params.key] });
});

OAORouter.route('/PropertyDetails/:PropertyType/:Property')
    .get(function (req, res) {
        var PropertyType = req.params.PropertyType;
        var Property = req.params.Property;
        OAODBHelper.getDropboxContent(PropertyType, Property, function (result) {
            res.json({ result: result });
        })
    });

OAORouter.route('/saveProprtyDetails')
    .post(function (req, res) {
        var oAOPropertyDetail = new OAOPropertyDetail({
            property_type: req.body.p_type,
            property: req.body.property,
            property_value: req.body.p_value,
            property_desc: req.body.desc
        });
        OAODBHelper.saveDropboxContent(oAOPropertyDetail, function (result) {
            if (!result) {
                return res.json({ result: "no record found" });
            }
            res.json({ result: result });
        })

    });
OAORouter.route('/ErrorMessages/:PropertyType')
    .get(function (req, res) {
        var PropertyType = req.params.PropertyType;
        OAODBHelper.getMessages(PropertyType, function (result) {
            res.json({ result: result });
        })
    });
OAORouter.route('/applicationReferenceIdGeneration')
    .get(function (req, res) {
        // OAODBHelper.GenerateApplicationReferenceId(req,res,function(result){
        //     res.json({result:result});
        // })
        //  OAODBHelper.updateApplicationReferenceIdGeneration(req,res,function(result){
        //     res.json({result:result});
        // });
        OAODBHelper.UpdateApplicationReferenceIdGeneration(req, res, function (result) {
            res.json({ resss: result });
        })
    });
OAORouter.route('/CoreAccountNumber')
    .get(function (req, res) {
        OAOApplicationHelper.RefIdFormater(function (result) {
            res.json({ result: result });
        })
    });
OAORouter.route('/ApplicantsRecord/:Applicants_id')
    .get(function (req, res) {
        var Applicants_id = req.params.Applicants_id;
        OAODBHelper.getApplicantsRecord(Applicants_id, function (result) {
            if (result == "") {
                res.json({ result: "no result" });
            }
            else {
                res.json({ result: result });
            }

        })
    });
OAORouter.route('/UpdateSection/:Applicants_id/:section/:prod_type')
    .get(function (req, res) {
        app_id = req.params.Applicants_id;
        section = req.params.section;
        prod_type = "section_" + req.params.prod_type;
        OAODBHelper.getApplicantsRecord(app_id, function (result) {
            console.log("from section::::::::" + result);
            if (result == "") {
                res.json({ result: "no result" });
            }
            else {
                if (result[0][prod_type][0][section] == true) {
                    result[0][prod_type][0][section] = 'false';
                }

                OAODBHelper.save(result[0], function (result) {
                    console.log(result)
                    res.status(200).json({
                        message: 'Updated message',
                        Result: result
                    });
                })
            }

        })

    })

OAORouter.route('/validation')
    .post(function (req, res) {
        OAODBHelper.validation(req, res, function (result) {
            res.json({ result: result });
        })
    });



module.exports = OAORouter;