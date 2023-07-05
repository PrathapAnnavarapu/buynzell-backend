const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
var multer = require('multer');
const fs = require('fs')


const path = require('path');

var bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");



// for parsing application/xwww-
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
// app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
// app.use(upload.array()); 
app.use(express.static('uploads'));

const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,   
   method:['GET','POST'],       //access-control-allow-credentials:true
   optionSuccessStatus:200,
}
app.use(cors(corsOptions)) // Use this after the variable declaration 


const mysql = require('mysql')
const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'buynzell'
})

connection.connect((err)=>{
    if (err){
        console.log(err)
    }else{
        console.log("MySql DataBase is connectd")
    }
})

app.listen(4000, ()=>{
    console.log("server Running on http://localhost:4000")
})


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(__dirname+'/uploads'))
        {
            fs.mkdirSync(__dirname+'/uploads')
        }
      cb(null, './uploads'); // Set the destination folder for file uploads
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' +Date.now() + '.'+ file.mimetype.split('/')[1]); // Use the original filename
    }
  });
 

  const upload = multer({storage:storage});
 


//SignUp Post API

 app.post('/register', async (request, response)=>{
    const {firstname, email, password, accountCreatedDate} = request.body
    const hashPassword = await bcrypt.hash(password,10)
   
     connection.query(`SELECT * FROM buynzell_user_regiistration_details WHERE email_address = "${email}";`,(error, row)=>{
        if (error){
            response.send({status:400, message:`${error}`})
        }else{
            if (row.length === 0){
                connection.query(`INSERT INTO buynzell_user_regiistration_details(user_name, email_address, password,accountCreatedDate)VALUES(?,?,?,?)`,[firstname, email, hashPassword, accountCreatedDate], (error, result)=>{
                    if (error){
                       response.send({status:400, message:`${error}`})
                    }else{
                        response.send({status:200, message:"You Registered Successfully"})           
                    }
                   })
                 }
            else{
                response.send({status:400, message:"User is Already Exists"})
            }
        }
        })
    })       
    

// Login Post API
    app.post('/login', (request, response)=>{        
         const email = request.body.email;
         const password = request.body.password;
        connection.query(`SELECT * FROM buynzell_user_regiistration_details WHERE email_address = "${email}"`,async(error,row)=>{
            if (error){
                response.send({status:400, message:`${error}`})    
            }
            if (row){                             
                if (row.length >= 1){
                    await bcrypt.compare(password, row[0]['password'], (err, result) => {
                        if (err) {
                            response.send({ status: 400, message: `${error}` });
                        }
                        if (result) {                          
                            const payload = { email: email };
                            const jwtToken = jwt.sign(payload, "HELLO_MY_SECRET_TOKEN");
                            response.send({ status: 200, message: "Login Succssefully", data:row, jwtToken });
                        } else {
                            response.send({ status: 400, message: "Invalid Password" });
                        }
                    })
                }else{
                    response.send({status:400, message:"Invalid Username"})     
            }                
        }       
            
        })                              
           
    })


    //GET userRegistrationDetails
    app.get("/registerUserDetails/:customerId", (request, response)=>{
        const{customerId} = request.params
    connection.query(`SELECT * FROM buynzell_user_regiistration_details WHERE customer_id = ${customerId};`, (err, result)=>{
            if (err){                
                response.send({status: 400,message:`${err}`})                             
            }            
            else{               
                response.send({ status: 200, message:'ok', list:result})              
                                                   
            }           
        })        

    })


    //updateThUserProfileAPI
    app.put('/updateTheProfileDetails/:customerId', (request, response)=>{
        const {customerId} = request.params
        const {userName, lastName, aboutYou, phoneNumber, email, language,  webLink, whatsAppNumber, facebookLink} = request.body
        connection.query(`SELECT * FROM buynzell_user_regiistration_details WHERE customer_id = ${customerId};`, (err, result)=>{
            if (err){
                response.send({status: 400, message:`${err}`})
            } 
            if(result){
                connection.query(`UPDATE buynzell_user_regiistration_details SET user_name= '${userName}', last_name = '${lastName}', about_you='${aboutYou}',phone_number='${phoneNumber}', email_address='${email}',language='${language}',website_link='${webLink}', whatsapp_number='${whatsAppNumber}', facebook_link='${facebookLink}' WHERE customer_id = ${customerId};`, (err, result)=>{
                    if (err){
                        response.send({status: 400, message:`${err}`})
                    }else{
                        response.send({ status: 200, message: "Account Details are Updated Successfully" });
                         
                    }
        })
    }
    })
}) 



//UPDATE the profilePicture URL API
app.put('/updateTheProfilePicture/:customerId', upload.single('profilePic'), (request, response)=>{
    const {customerId} = request.params
    const profilePicUrl = request.file.filename
    console.log(profilePicUrl)
    
        

    connection.query(`SELECT * FROM buynzell_user_regiistration_details WHERE customer_id = ${customerId};`, (err, result)=>{
        if (err){
            response.send({status: 400, message:`${err}`})
        } 
        if(result){
            connection.query(`UPDATE buynzell_user_regiistration_details SET profile_image_url='${profilePicUrl}' WHERE customer_id = ${customerId};`, (err, result)=>{
                if (err){
                    response.send({status: 400, message:`${err}`})
                }else{
                    response.send({ status: 200, message: "Profile Photo Upaded Successfully" });
                     
                }
    })
}
})
}) 


//UPDATE The BannerImageURLAPI
app.put('/updateTheBannerImage/:customerId', upload.single('bannerImage'), (request, response)=>{
    const {customerId} = request.params
    const bannerImageUrl = request.file.filename
       

    connection.query(`SELECT * FROM buynzell_user_regiistration_details WHERE customer_id = ${customerId};`, (err, result)=>{
        if (err){
            response.send({status: 400, message:`${err}`})
        } 
        if(result){
            connection.query(`UPDATE buynzell_user_regiistration_details SET bannerImage_url='${bannerImageUrl}' WHERE customer_id = ${customerId};`, (err, result)=>{
                if (err){
                    response.send({status: 400, message:`${err}`})
                }else{
                    response.send({ status: 200, message: "Banner Image Upaded Successfully" });
                     
                }
    })
}
})
}) 


//updateTheActivePageCount
 app.put('/updateTheActivePageCount/:customerId', (request, response)=>{
    const {customerId} = request.params
    const {activePageStep} = request.body
    connection.query(`SELECT * FROM buynzell_user_regiistration_details WHERE customer_id = ${customerId};`, (err, result)=>{
        if (err){
            response.send({status: 400, message:`${err}`})
        } 
        if(result){
            connection.query(`UPDATE buynzell_user_regiistration_details SET active_page_step = '${activePageStep}' WHERE customer_id = ${customerId};`, (err, result)=>{
                if (err){
                    response.send({status: 400, message:`${err}`})
                }else{
                    response.send({ status: 200, message: "Account Details are Updated Successfully" });                     
                }
    })
}
})
})



// updatePasswordAPI
app.put('/updatePassword', async(request, response)=>{
    const {email, newPassword} = request.body
    const newhashPassword = await bcrypt.hash(newPassword,10)
    
    connection.query(`SELECT * FROM buynzell_user_regiistration_details WHERE email_address = '${email}';`, (err, result)=>{
        if (err){
            response.send({status: 400, message:`${err}`})
        } 
        if(result){
            connection.query(`UPDATE buynzell_user_regiistration_details SET password = '${newhashPassword}' WHERE email_address = '${email}';`, (err, result)=>{
                if (err){
                    response.send({status: 400, message:`${err}`})
                }else{
                    response.send({ status: 200, message:"Your Password is Updated Successfully" });

                }
            
    })
}
})
})


    //Delete userAccount API    
        app.delete("/Delete/:username", (request, response)=>{
        const {username} = request.params
       
        connection.query(`SELECT * FROM buynzell_user_regiistration_details WHERE user_name = "${username}";`, (err, result)=>{
        if (err){
            response.send({ status: 400, message: `${err}` });              
        }   
        if (result){
            if (result.length >= 1){
                connection.query(`DELETE FROM buynzell_user_regiistration_details where user_name = "${username}";`, async(error,row)=>{
                    if (error){
                        response.send({ status: 400, message: `${error}` });
                    }else{                       
                        response.send({ status: 200, message: "Account Details are Deleted Successfully" });                                                            
                    }      
                })
            }
        }     
             
    })               

})


//usedCarsBrandsDropdownListGetAPI
app.get("/usedCarsBrandsList", (request, response)=>{
    connection.query(`SELECT DISTINCT brand FROM used_cars_brands_list;`, (err, result)=>{
            if (err){                
                response.send({status: 400,message:`${err}`})                             
            }            
            else{               
                response.send({ status: 200, message:'ok', list:result})              
                                                   
            }           
        })        

    })


                
//usedCarsModelsDropdownListGetAPI
       app.get("/usedCarsModelsList/:brand", (request, response)=>{
        const {brand} = request.params
    connection.query(`SELECT * FROM used_cars_brands_list WHERE brand = '${brand}';`, (err, result)=>{
            if (err){                
                response.send({status: 400,message:`${err}`})                             
            }            
            else{               
                response.send({ status: 200, message:'ok', data:result})  
            }           
        })        

    })



    // PostPaymentCardDetailsAPI
    app.post('/paymentCardDetails', async (request, response)=>{
        const { custmoerId, payThrough, categoryOfGateway,  nameOnCard, cardNumber, expiryDate, cvv,  saveCardDetailsStatus} = request.body
       
    
         connection.query(`SELECT * FROM saved_payment_crads WHERE card_number = "${cardNumber}";`,(error, row)=>{
            if (error){
                response.send({status:400, message:`${error}`})
            }else{
                if (row.length === 0){
                    connection.query(`INSERT INTO saved_payment_crads(customer_id, pay_through,  name_on_card, card_number, cvv, save_card_details_status, category_of_gateway, expiry_date )VALUES(?,?,?,?,?,?,?,?)`,[custmoerId, payThrough, nameOnCard, cardNumber,  cvv,  saveCardDetailsStatus, categoryOfGateway, expiryDate], (error, result)=>{
                        if (error){
                           response.send({status:400, message:`${error}`})
                        }else{
                            response.send({status:200, message:"Your card details are Saved Successfully"})           
                        }
                       })
                     }
                else{
                    response.send({status:400, message:"This Card Details are Already Exists"})
                }
            }
            })
        })    
        
        

        //GetSavedCardDetailsAPI
        app.get("/SavedCardsList/:customerId", (request, response)=>{
            const {customerId} = request.params
           
        connection.query(`SELECT * FROM saved_payment_crads WHERE customer_id = ${customerId};`, (err, result)=>{
                if (err){                
                    response.send({status: 400,message:`${err}`})                             
                }            
                if (result){        
                    connection.query(`SELECT * FROM saved_payment_crads WHERE customer_id = ${customerId} ORDER BY card_id DESC  LIMIT 3;`, (err, result)=>{       
                        if (err){                
                            response.send({status: 400,message:`${err}`})                             
                        } else{   
                        response.send({ status: 200, message:'ok', cardsList:result})  
                   
                }           
            })
        }        
    
        })
    })




    //DELETEsavedcardDetails
    app.delete("/Delete/SavedCard/:cardNumber", (request, response)=>{
        const {cardNumber} = request.params     
        
        connection.query(`SELECT * FROM saved_payment_crads WHERE card_number = '${cardNumber}';`, (err, result)=>{
        if (err){
            response.send({ status: 400, message: `${err}` });              
        }   
        if (result){
            if (result.length >= 1){
                connection.query(`DELETE FROM saved_payment_crads where card_number = '${cardNumber}';`, async(error,row)=>{
                    if (error){
                        response.send({ status: 400, message: `${error}` });
                    }else{                       
                        response.send({ status: 200, message: "Card Details are Deleted Successfully" });                                                            
                    }      
                })
            }
        }     
             
    })               

})




  
    // POSTthepostAdPhotosAPI 
    app.put('/api/upload/:listingId', upload.array('file[]'), (req, res) => {
        const {listingId} = req.params
        const imageFile = req.files.map((each)=> each.filename)
             
        

        // if (!req.files.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        //     res.send({ msg:'Only image files (jpg, jpeg, png) are allowed!'});
        // }

        if (!imageFile) {
            res.status(400).json({ error: 'No image file provided' });
            return;
            }else{           
                connection.query(`UPDATE post_ad_details SET photos = '${imageFile}' WHERE listing_id = '${listingId}';`, (error, result) => {
                    if (error){
                        res.send({ status: 400, message: `${error}` });
                    }else{                       
                        res.send({ status: 200, message: "Photos are updated Successfully" });                                                            
                    }  
                })
            } 
            })
            
            
            
            
            
            
            //POSTthepostAdDetails API 
        app.post('/PostAdDetails', async (request, response)=>{
           const postAdDetails = request.body         
            
            const {customerId, listingId,category,subCategory,adPostedDate,brand,model,yearOfRegistration,kmDriven,title,description,noOfOwners,fuelType,steeringOption,horsePower,noOfDoors,noOfCylinders,noOfSeats,insurenceValidityUpto,exteriorColor,interiorColor,price} = postAdDetails[0]
            const {lati, long, name, email, phoneNumber,city, region, country, showContactInformation} = postAdDetails[1]
            const {planValidityDays, isSelectFeatureInCategory, isSelectFeatureInSearchResults,activeMemberShipPackage,discountCouponDetails,totalAmount,adCurrentStatus} = postAdDetails[2]
           
            connection.query(`INSERT INTO post_ad_details(customer_id, listing_id, category, sub_category, ad_posted_date, brand, model, year_of_registration, km_driven, title, description, no_of_owners, fuel_type, steering_option, horse_power, no_od_doors, no_of_cylinders, no_of_seats, insurence_validity_upto, exterior_color, interior_color, price, latitude, longitude, name, email, phone_number, city, region, country, show_contact_information, plan_validity_days, is_select_featureIn_category, is_select_feature_in_search_results, active_membership_package, discount_coupon_details, total_amount, ad_current_status)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [customerId, listingId, category, subCategory, adPostedDate, brand, model, yearOfRegistration, kmDriven, title, description, noOfOwners, fuelType, steeringOption, horsePower, noOfDoors, noOfCylinders, noOfSeats, insurenceValidityUpto, exteriorColor, interiorColor, price, lati, long, name, email, phoneNumber, city, region, country, showContactInformation, planValidityDays, isSelectFeatureInCategory, isSelectFeatureInSearchResults, activeMemberShipPackage, discountCouponDetails,totalAmount, adCurrentStatus], 
                (error, result)=>{     
                if (error){  
                    response.send({status:400, message:`${error}`})
                }
                if (result){
                    response.send({status:200, message:"Your ad Posted Successfully"})
                }
        })
    })
            
               

    //GETthepostedADDetails
    app.get("/GetPostAdDetails", (request, response)=>{    
        connection.query(`SELECT * FROM post_ad_details;`, (err, result)=>{       
                    if (err){                
                        response.send({status: 400,message:`${err}`})                             
                    } else{   
                    response.send({ status: 200, message:'ok', adsList:result})  
               
            }           
        })      
})



//GET PostAdListItemDetailsAPI

app.get("/GetPostAdListItemDetails/:postAdId", (request, response)=>{ 
    const {postAdId} = request.params
    
    connection.query(`SELECT * FROM post_ad_details WHERE post_ad_id = ${postAdId};`, (err, result)=>{
        if (err){                
            response.send({status: 400,message:`${err}`})                             
        }  
    if (result){
    connection.query(`SELECT * FROM post_ad_details INNER JOIN buynzell_user_regiistration_details ON post_ad_details.customer_id = buynzell_user_regiistration_details.customer_id WHERE post_ad_id = ${postAdId}`, (err, result)=>{       
                if (err){                
                    response.send({status: 400,message:`${err}`})                             
                } else{   
                response.send({ status: 200, message:'ok', adListItemsDetails:result}) 
        }           
    })    
}      
})
})




//GET ALLPostedAdsDetailsThroughCustomerWiseforShowinSellerDetails
app.get("/GetSellerAllPostedAdsDetails/:customerId", (request, response)=>{ 
    const {customerId} = request.params
    
    connection.query(`SELECT * FROM post_ad_details WHERE post_ad_id = ${customerId};`, (err, result)=>{
        if (err){                
            response.send({status: 400,message:`${err}`})                             
        }  
    if (result){
    connection.query(`SELECT * FROM post_ad_details NATURAL JOIN buynzell_user_regiistration_details WHERE customer_id = ${customerId}`, (err, result)=>{       
                if (err){                
                    response.send({status: 400,message:`${err}`})                             
                } else{   
                response.send({ status: 200, message:'ok', adListItemsDetails:result}) 
        }           
    })    
}      
})
})



//GetMyAdsListAPI
app.get("/GetMyPostAdDetails/:customerId", (request, response)=>{ 
    const {customerId} = request.params
    
    connection.query(`SELECT * FROM post_ad_details WHERE customer_id = ${customerId};`, (err, result)=>{
        if (err){                
            response.send({status: 400,message:`${err}`})                             
        }  
    if (result){
    connection.query(`SELECT * FROM post_ad_details WHERE customer_id = ${customerId}`, (err, result)=>{       
                if (err){                
                    response.send({status: 400,message:`${err}`})                             
                } else{   
                response.send({ status: 200, message:'ok', adListItemsDetails:result}) 
        }           
    })
}      
})
})


//DELETEPostAdDetails
app.delete("/Delete-postAdDetails/:postAdId", (request, response)=>{
    const {postAdId} = request.params  
  
    
    connection.query(`SELECT * FROM post_ad_details WHERE post_ad_id = ${postAdId};`, (err, result)=>{
    if (err){
        response.send({ status: 400, message: `${err}` });              
    }   
    if (result){
        if (result.length >= 1){
            connection.query(`DELETE FROM post_ad_details where post_ad_id = ${postAdId};`, async(error,row)=>{
                if (error){
                    response.send({ status: 400, message: `${error}` });
                }else{                       
                    response.send({ status: 200, message: "Your Ad is Deleted Successfully" });                                                            
                }      
            })
        }
    }    
         
})               

})





  


        












    
// get API
    //      app.get("/userDetails/:id", (request, response)=>{
    //         const {id} = request.params
    //      connection.query(`SELECT * FROM registration WHERE id = "${id}";`, (err, result)=>{
    //         if (err){
    //             response.status(400)
    //             response.send(err)               
    //         }            
    //         else{
    //             response.status(200)
    //             response.send(result)   
                                                   
    //         }           
    //     })                 

    // })
    

    // const authenticateToken = async (request, response, next) => {
    //     const authHeader = request.headers["authorization"];
    //     let jwtToken;
    //     if (authHeader !== undefined) {
    //       jwtToken = authHeader.split(" ")[1];
    //     }
    //     if (jwtToken === undefined) {
    //       response.status(401);
    //       response.send("Invalid JWT Token");
    //     } else {
    //       jwt.verify(jwtToken, "HELLO_MY_SECRET_TOKEN", async (error, payload) => {
    //         if (error) {
    //           response.status(401);
    //           response.send("Invalid JWT Token");
    //         } else {
    //           request.email = payload.email;
    //           next();
    //         }
    //       });
    //     }
    //   };