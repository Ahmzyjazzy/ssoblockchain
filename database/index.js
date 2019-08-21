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

                users.table.push({id, privatekey, publickey, ...obj}); 
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

module.exports = function (app) {

    /** addStaff
     * @param String code
     * @param Object staff
     * 
     */
    app.post('/api/addStaff', function (req, res) {
        const { code, staff } = req.body;
        const url = `database/${code}/staff.json`;
        console.log(code, staff, url);
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
                        return res.json({ status: 'success', message: 'An error cocured', data: err });
                    });                 
                }
            });
        }catch(err){
            return res.json({ status: 'success', message: 'An error occur', data: err });
        }        
    });

    /**
     * getStaffs
     * @param String code
     */
}