'use strict';
const fs = require('fs');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const saveUser = (code,obj) => {
    const url = `database/${code}/user.json`;
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
                const { phone, email, role } = obj;
                users.table.push({id, privatekey, publickey, phone, email, role }); 
                const json = JSON.stringify(users);

                fs.writeFile(url, json, 'utf8', (e,data)=>{
                    //get last inserted id
                    return getLastInsertedId(code,'user')
                    .then((id)=>{ resolve(id); })
                    .catch((err)=>{ reject(err); });
                });
            }
        });
    });
}

const getLastInsertedId = (code,table) => {
    const url = `database/${code}/${table}.json`;
    return new Promise((resolve,reject)=>{
        fs.readFile(url, 'utf8', (err, data)=>{
            if (err){
                reject(err);
            } else {               
                const users = JSON.parse(data);
                const lastObj = users.table[users.table.length-1];
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
        res.render('/', {
            title: 'Sign In',
        });
    }
}

module.exports = function (app) {

    /** login
     * @param String code
     * @param Object staff
     * 
     */
    app.post('/api/login', function (req, res) {
        const { code, passkey } = req.body;
        const url = `database/${code}/user.json`;

        try{
            fs.readFile(url, 'utf8', (err, data)=>{
                if (err){
                    console.log(err);
                    return res.json({ status: 'error', message: 'Some fields are empty', data: err });
                } 
                else {
                    const users = JSON.parse(data); 
                    const user = users.table.find( obj => obj.phone == passkey || obj.email == passkey );
                    if(user){
                        const { email, phone, name, role, id, publickey } = user;
                        //set session
                        req.session.user = {
                            email, 
                            phone, 
                            name, 
                            role, 
                            id, 
                            publickey,
                            isAdmin: role == 'admin' ? true: false
                        }; 
                        req.session.user.expires = new Date().getTime() + 3 * 24 * 3600 * 1000;
                        return res.json({ status: 'success', message: 'Login successfully', data: user });
                    }else{
                        return res.json({ status: 'error', message: 'Incorrect credentials', data: null });
                    }         
                }
            });
        }catch(err){
            return res.json({ status: 'error', message: 'An error occur', data: err });
        }        
    });

    /** addStaff
     * @param String code
     * @param Object staff
     * 
     */
    app.post('/api/create', checkUserAuth, function (req, res) {
        const { code, mode, staff } = req.body;
        const url = `database/${code}/${mode}.json`;
        try{
            fs.readFile(url, 'utf8', (err, data)=>{
                if (err){
                    console.log(err);
                    return res.json({ status: 'error', message: 'Some fields are empty', data: err });
                } 
                else {
                    //save staff as user
                    saveUser(code,staff).then((id)=>{
                        //add timestamp before saving
                        const sid = new Date().getTime();
                        const staffs = JSON.parse(data); //now it an object

                        staffs.table.push({id: sid, uid: id, ...staff}); //add some data
                        const json = JSON.stringify(staffs); //convert it back to json

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

    /**
     * getStaff
     * @param String code
     */
    app.get('/api/getOne/mode:=:mode&code=:code&id=:id', checkUserAuth, function (req, res) {
        const { code, mode, id } = req.params;
        const url = `database/${code}/${mode}.json`;
        try{
            fs.readFile(url, 'utf8', (err, data)=>{
                if (err){
                    console.log(err);
                    return res.json({ status: 'error', message: 'Some fields are empty', data: err });
                } 
                else {
                    //save staff as user
                    const staffs = JSON.parse(data); //now it an object
                    const staffObj = staffs.table.find(obj => obj.id == id);
                    if(staffObj){
                        return res.json({ status: 'success', message: 'Record found', data: staffObj });
                    }
                    return res.json({ status: 'error', message: 'Record not found', data: null });           
                }
            });
        }catch(err){
            return res.json({ status: 'error', message: 'An error occur', data: err });
        }  
    });

    /**
     * getAllStaff
     * @param String code
     */
    app.get('/api/getAll/mode=:mode&code=:code', checkUserAuth, function (req, res) {
        const { code, mode } = req.params;
        const url = `database/${code}/${mode}.json`;
        try{
            fs.readFile(url, 'utf8', (err, data)=>{
                if (err){
                    console.log(err);
                    return res.json({ status: 'error', message: 'Some fields are empty', data: err });
                } 
                else {
                    //save staff as user
                    const db = JSON.parse(data); //now it an object
                    if(db.table.length > 0){
                        return res.json({ status: 'success', message: 'Record found', data: db.table });
                    }
                    return res.json({ status: 'error', message: 'Record not found', data: null });           
                }
            });
        }catch(err){
            return res.json({ status: 'error', message: 'An error occur', data: err });
        }  
    });

    /**
     * updateOne                                                                                                           
     * @param String code
     * @param Object staff
     */
    app.put('/api/updateOne/', checkUserAuth, function (req, res) {
        const { code, mode, staff } = req.body;
        const url = `database/${code}/${mode}.json`;
        try{
            fs.readFile(url, 'utf8', (err, data)=>{
                if (err){
                    console.log(err);
                    return res.json({ status: 'error', message: 'Some fields are empty', data: err });
                } 
                else {
                    //save staff as user
                    //add timestamp before saving
                    const staffs = JSON.parse(data); //now it an object
                    const { id, name, phone, email, role } = staff; //update staff id

                    const updateArr = staffs.table.map((staffObj) => staffObj.id == id ? {...staffObj, name, phone, email, role} : staffObj);
                    staffs.table = updateArr;

                    const json = JSON.stringify(staffs);
                    fs.writeFile(url, json, 'utf8', (err,data)=>{
                        return res.json({ status: 'success', message: 'Staff successfully created', data: null });
                    }); // write it back                 
                }
            });
        }catch(err){
            return res.json({ status: 'error', message: 'An error occur', data: err });
        }  
    });

    /**
     * deletStaff
     * @param Integer staff_id
     */
    app.delete('/api/staff', checkUserAuth, function (req, res) {
        const { code, staff_id } = req.body;
        const staffurl = `database/${code}/staff.json`;
        const userurl = `database/${code}/user.json`;

        try{
            fs.readFile(staffurl, 'utf8', (err, data)=>{
                if (err){
                    console.log(err);
                    return res.json({ status: 'error', message: 'Some fields are empty', data: err });
                } 
                else {
                    //save staff as user
                    //add timestamp before saving
                    const staffs = JSON.parse(data); //now it an object

                    const staffObj = staffs.table.filter((staffObj) => staffObj.id == staff_id);
                    const { uid } = staffObj; //user_id

                    const updateArr = staffs.table.filter((staffObj) => staffObj.id != staff_id);
                    staffs.table = updateArr;

                    const json = JSON.stringify(staffs);
                    fs.writeFile(url, json, 'utf8', (err,data)=>{

                        //delete user too 
                        fs.readFile(userurl, 'utf8', (err, data)=>{
                            if (err){
                                console.log(err);
                                return res.json({ status: 'error', message: 'Some fields are empty', data: err });
                            } 
                            else {
                                const users = JSON.parse(data); //now it an object                       
                                const newUsers = users.table.filter((user) => user.id != uid);
                                staffs.table = newUsers;

                                const json = JSON.stringify(staffs);
                                fs.writeFile(url, json, 'utf8', (err,data)=>{                                    
                                    return res.json({ status: 'success', message: 'Staff successfully created', data: null });
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

    /**
     * Register citizen
     */
    app.post('/api/register', checkUserAuth, function (req, res) {
        const { code, mode, citizen } = req.body;
        const url = `database/${code}/${mode}.json`;

        console.log(citizen);
        
        try{
            fs.readFile(url, 'utf8', (err, data)=>{
                if (err){
                    console.log(err);
                    return res.json({ status: 'error', message: 'Some fields are empty', data: err });
                } 
                else {
                    //add timestamp before saving
                    const id = new Date().getTime();
                    const citizens = JSON.parse(data); //now it an object
                    const status = "pending";

                    citizens.table.push({id, status, ...citizen}); //add some data
                    const json = JSON.stringify(citizens); //convert it back to json

                    fs.writeFile(url, json, 'utf8', (err,data)=>{
                        return res.json({ status: 'success', message: 'Citizen successfully created, wait for 24hours of activation.', data: null });
                    }); // write it back                 
                }
            });
        }catch(err){
            return res.json({ status: 'error', message: 'An error occur', data: err });
        }        
    });
}