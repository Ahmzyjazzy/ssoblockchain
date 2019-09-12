'use strict';
const fs = require('fs');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const organization = require('../organization');
const axios = require('axios')

const multer = require('multer');
const upload = multer(); // for parsing multipart/form-data

const saveUser = (obj) => {
    const url = `database/user.json`;
    return new Promise((resolve,reject)=>{
        fs.readFile(url, 'utf8', (err, data)=>{
            if (err){
                return false;
            } else {
                const id = new Date().getTime();                
                const users = JSON.parse(data);

                //1. generate a keypair for staff user
                const key = ec.genKeyPair();
                const privatekey = key.getPrivate('hex');
                const publickey = key.getPublic('hex');
                // const { phone, email, role } = obj;
                users.push({id, privatekey, publickey, ...obj }); 
                const json = JSON.stringify(users,null,2);

                fs.writeFile(url, json, 'utf8', (e,data)=>{
                    //get last inserted id
                    return getLastInsertedId('user')
                    .then((id)=>{ resolve(id); })
                    .catch((err)=>{ reject(err); });
                });
            }
        });
    });
}

const getLastInsertedId = (table) => {
    const url = `database/${table}.json`;
    return new Promise((resolve,reject)=>{
        fs.readFile(url, 'utf8', (err, data)=>{
            if (err){
                reject(err);
            } else {               
                const users = JSON.parse(data);
                const lastObj = users[users.length-1];
                const { id } = lastObj;
                resolve(id);
            }
        });
    });    
}

const checkUserAuth = (req, res, next) => {
    if (req.session.user) {
        if (req.session.user.usertype == "staff") {
            next();
        } else if (req.session.user.usertype == "admim") {
            next();
        } else {
            next();
        }
    } else {
        res.redirect("/");
    }
}

const saveCitizen = (url,data,citizen,res)=> {
    //add timestamp before saving
    const id = new Date().getTime();
    const citizens = JSON.parse(data); //now it an object
    const status = "pending";

    citizens.push({id, status, ...citizen}); //add some data
    const json = JSON.stringify(citizens,null,2); //convert it back to json

    fs.writeFile(url, json, 'utf8', (err,data)=>{
        return res.json({ status: 'success', message: 'Citizen successfully created, wait for 24hours of activation.', data: null });
    }); // write it back  
}

const updateCitizen = (url,data, detail,res) => {
    const db = JSON.parse(data); //now it an object
    const { id } = detail; //update id

    const updateArr = db.map((row) => row.id == id ? {...row, ...detail, status: "pending block" } : row);

    const json = JSON.stringify(updateArr,null,2);
    fs.writeFile(url, json, 'utf8', (err,data)=>{
        return res.json({ status: 'success', message: 'Staff successfully updated', data: null });
    }); // write it back   
}

const checkCitizen = (userUrl,id) => {
    return new Promise((resolve,reject)=>{
        fs.readFile(userUrl, 'utf8', (err, data)=>{
            if (err) reject(false);
            //check if the user has id, does it exist in my local db? "pending block"
            const users = JSON.parse(data);
            const exist = users.find(obj => obj.id == id && obj.status != "rejected");
            resolve(exist); 
        });
    });
}

const responseLogger = (res, code, start_time, action_type, message, action_data, status) => {
    const end_time = new Date().getTime();      
    const duration = end_time - start_time;

    const postObj = { code, action_type, duration, status, message, action_data };

    axios.post('https://ssoblockchain.herokuapp.com/api/log_action', postObj)
    .then((response) => {        
        console.log("response:=> ", { status: response.status, statusText: response.statusText, data: response.data });

        if(response.status == 200 && response.statusText == "OK" && response.data.status == "success"){
            return res.json({ status, message, data: action_data });
        }else{
            return res.json({ status, message, data: action_data });
        }
    }, (error) => {
        console.log(error);
        return res.json({ status, message, data: error });
    });
}

module.exports = function (app) {

    /** login
     * @param String code
     * @param String passkey
     */
    app.post('/api/login', function (req, res) {
        const { code, passkey } = req.body;
        const url = `database/user.json`;
        const start_time = new Date().getTime();

        try{
            fs.readFile(url, 'utf8', (err, data)=>{
                if (err){           
                    responseLogger(res, code, start_time,'login', 'Some fields are empty', err, 'error');         
                    // return res.json({ status: 'error', message: 'Some fields are empty', data: err });
                } 
                else {
                    const users = JSON.parse(data); 
                    const user = users.find( obj => obj.phone == passkey || obj.email == passkey );
                    if(user){
                        const { email, phone, name, role, id } = user;
                        const { publickey, title } = organization.find(org => org.code == code);
                        //set session
                        req.session.user = {
                            email, 
                            phone, 
                            name, 
                            role, 
                            id, 
                            orgPublickey: publickey,
                            appTitle: title,
                            appLogo: code,
                            code,
                            isAdmin: role == 'admin' ? true: false
                        }; 
                        req.session.user.expires = new Date().getTime() + 3 * 24 * 3600 * 1000;
                        responseLogger(res, code, start_time,'login', 'login successfully', user, 'success');
                        // return res.json({ status: 'success', message: 'Login successfully', data: user });
                    }else{
                        responseLogger(res, code, start_time,'login', 'Incorrect credentials', null, 'error');
                        // return res.json({ status: 'error', message: 'Incorrect credentials', data: null });
                    }         
                }
            });
        }catch(err){
            responseLogger(res, code, start_time,'login', 'An error occur', err, 'error');
            // return res.json({ status: 'error', message: 'An error occur', data: err });
        }        
    });

    /** createStaff     
     * @param String mode
     * @param Object staff
     */
    app.post('/api/createStaff', checkUserAuth, function (req, res) {
        const { mode, staff } = req.body;
        const url = `database/${mode}.json`;
        try{
            fs.readFile(url, 'utf8', (err, data)=>{
                if (err){
                    return res.json({ status: 'error', message: 'Some fields are empty', data: err });
                } 
                else {
                    //save staff as user
                    saveUser(staff).then((id)=>{
                        //add timestamp before saving
                        const sid = new Date().getTime();
                        const staffs = JSON.parse(data); //now it an object

                        staffs.push({id: sid, uid: id, ...staff}); //add some data
                        const json = JSON.stringify(staffs,null,2); //convert it back to json

                        fs.writeFile(url, json, 'utf8', (err,data)=>{
                            return res.json({ status: 'success', message: 'Staff successfully created', data: null });
                        }); // write it back 
                    }).catch((err)=>{                        
                        return res.json({ status: 'error', message: 'An error cocured', data: err });
                    });                 
                }
            });
        }catch(err){
            return res.json({ status: 'error', message: 'An error occur', data: err });
        }        
    });

    /** updateStaff    
     * @param String mode
     * @param Object detail
     */
    app.put('/api/updateStaff/', checkUserAuth, function (req, res) {
        const { mode, detail } = req.body;
        const url = `database/${mode}.json`;
        try{
            fs.readFile(url, 'utf8', (err, data)=>{
                if (err){
                    return res.json({ status: 'error', message: 'Some fields are empty', data: err });
                } 
                else {
                    const db = JSON.parse(data); //now it an object
                    const { id } = detail; //update id

                    const updateArr = db.map((row) => row.id == id ? {...row, ...detail } : row);

                    const json = JSON.stringify(updateArr,null,2);
                    fs.writeFile(url, json, 'utf8', (err,data)=>{
                        return res.json({ status: 'success', message: 'Staff successfully updated', data: null });
                    }); // write it back                 
                }
            });
        }catch(err){
            return res.json({ status: 'error', message: 'An error occur', data: err });
        }  
    });

    /** getSOne
     * @param String mode
     * @param Integer id
     */
    app.get('/api/getOne/mode=:mode&id=:id', checkUserAuth, function (req, res) {
        const { mode, id } = req.params;
        const url = `database/${mode}.json`;
        try{
            fs.readFile(url, 'utf8', (err, data)=>{
                if (err){
                    return res.json({ status: 'error', message: 'Some fields are empty', data: err });
                } 
                else {
                    //save staff as user
                    const db = JSON.parse(data); //now it an object
                    const objDt = db.find(obj => obj.id == id);
                    if(objDt){
                        return res.json({ status: 'success', message: 'Record found', data: objDt });
                    }
                    return res.json({ status: 'error', message: 'Record not found', data: null });           
                }
            });
        }catch(err){
            return res.json({ status: 'error', message: 'An error occur', data: err });
        }  
    });

    /** getAll
     * @param String mode
     */
    app.get('/api/getAll/mode=:mode', checkUserAuth, function (req, res) {
        const { mode } = req.params;
        const url = `database/${mode}.json`;
        try{
            fs.readFile(url, 'utf8', (err, data)=>{
                if (err){
                    return res.json({ status: 'error', message: 'Some fields are empty', data: err });
                } 
                else {
                    //save staff as user
                    const db = JSON.parse(data); //now it an object
                    if(db.length > 0){
                        return res.json({ status: 'success', message: 'Record found', data: db });
                    }
                    return res.json({ status: 'error', message: 'Record not found', data: null });           
                }
            });
        }catch(err){
            return res.json({ status: 'error', message: 'An error occur', data: err });
        }  
    });

    /** deleteStaff
     * @param Integer staff_id
     */
    app.delete('/api/staff', checkUserAuth, function (req, res) {
        const { staff_id } = req.body;
        const staffurl = `database/staff.json`;
        const userurl = `database/user.json`;

        try{
            fs.readFile(staffurl, 'utf8', (err, data)=>{
                if (err){
                    return res.json({ status: 'error', message: 'Some fields are empty', data: err });
                } 
                else {
                    const staffs = JSON.parse(data); 

                    const staffObj = staffs.filter((staffObj) => staffObj.id == staff_id);
                    const { uid } = staffObj; //user_id

                    const updateArr = staffs.filter((staffObj) => staffObj.id != staff_id);

                    const json = JSON.stringify(updateArr,null,2);
                    fs.writeFile(staffurl, json, 'utf8', (err,data)=>{

                        //delete user too 
                        fs.readFile(userurl, 'utf8', (err, data)=>{
                            if (err){
                                return res.json({ status: 'error', message: 'Some fields are empty', data: err });
                            } 
                            else {
                                const users = JSON.parse(data); //now it an object                       
                                const newUsers = users.filter((user) => user.id != uid);

                                const json = JSON.stringify(newUsers,null,2);
                                fs.writeFile(userurl, json, 'utf8', (err,data)=>{                                    
                                    return res.json({ status: 'success', message: 'Staff successfully deleted', data: null });
                                }); // write it back                 
                            }
                        });

                    }); // write it back                 
                }
            });
        }catch(err){
            return res.json({ status: 'error', message: 'An error occur', data: err });
        }  
    });

    /** deleteOne
     * @param String mode
     * @param Integer id
     */
    app.delete('/api/deleteOne', checkUserAuth, function (req, res) {
        const { mode, id } = req.body;
        const url = `database/${mode}.json`;

        try{
            fs.readFile(url, 'utf8', (err, data)=>{
                if (err){
                    return res.json({ status: 'error', message: 'Some fields are empty', data: err });
                } 
                else {
                    const db = JSON.parse(data); 

                    const rowObj = db.filter((o) => o.id == id);
                    const { uid } = rowObj; //user_id

                    const updateArr = db.filter((row) => row.id != id);

                    const json = JSON.stringify(updateArr,null,2);
                    fs.writeFile(url, json, 'utf8', (err,data)=>{
                        return res.json({ status: 'success', message: 'Delete operation successful', data: null });
                    }); // write it back                 
                }
            });
        }catch(err){
            return res.json({ status: 'error', message: 'An error occur', data: err });
        }  
    });

    /** Register citizen
     * @param String mode
     * @param Object citizen
     */
    app.post('/api/register', checkUserAuth, function (req, res) {
        const { mode, citizen } = req.body;
        const url = `database/${mode}.json`;
        try{
            fs.readFile(url, 'utf8', (err, data)=>{
                if (err){
                    console.log(err);
                    return res.json({ status: 'error', message: 'Some fields are empty', data: err });
                } 
                else {
                    //check if the user has id, does it exist in my local db? "pending block"
                    if(Object.keys(citizen).includes('id')){                        
                        const { id } = citizen;
                        //check if exist in local db
                        checkCitizen(url,id).then((exist)=>{
                            !exist ? saveCitizen(url,data,citizen,res) : /** for existing block*/ updateCitizen(url,data,citizen,res);
                        }).catch(e => res.json({ status: 'error', message: 'An error occur', data: e }));
                    }else{
                        saveCitizen(url,data,citizen,res);
                    }               
                }
            });
        }catch(err){
            return res.json({ status: 'error', message: 'An error occur', data: err });
        }        
    });

    /** updateCitizen  
     * @param String mode
     * @param Object detail
     */    
    app.put('/api/updateCitizen/', checkUserAuth, function (req, res) {
        const { mode, detail } = req.body;
        const url = `database/${mode}.json`;
        try{
            fs.readFile(url, 'utf8', (err, data)=>{
                if (err){
                    return res.json({ status: 'error', message: 'Some fields are empty', data: err });
                } 
                else {
                    const db = JSON.parse(data); //now it an object
                    const { id } = detail; //update id
         
                    const updateArr = db.map((row) => row.id == id ? {...row,...detail} : row);

                    const json = JSON.stringify(updateArr,null,2);
                    fs.writeFile(url, json, 'utf8', (err,data)=>{
                        return res.json({ status: 'success', message: 'Staff successfully updated', data: null });
                    }); // write it back                 
                }
            });
        }catch(err){
            return res.json({ status: 'error', message: 'An error occur', data: err });
        }  
    });

    /* upload logic start here */
    app.post('/api/upload_passport', upload.array(), function(req, res) {
        const base64Data = req.body.fileUrlstring.replace(/^data:image\/jpeg;base64,/, "");
        const fileurl = Date.now() + '.png';
        fs.writeFile(`public/uploads/${fileurl}`, base64Data, 'base64', function(err) {
            if (err) {
                return res.json({ status: 'error', message: 'Upload failed', data: err });
            }
            return res.json({ status: 'success', message: 'Upload successful', data: {fileurl} });
        });
    });

}
