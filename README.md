# SSOBLOCKCHAIN

# How to setup a new organization

- 1. Create a branch from a complete working branch e.g master
- 2. Name the branch the abbr/code of the new organization e.g nis for Nigeria Immigration Service
- 3. Open the directory for register.hbs and customize the form to fit your new organization spec
- 4. In the register.hbs, scroll down to the script part and Change all occurence of **code** 
    in the api endpoints to your organization abbr/code
- 5. Repeat step 4 for manage.hbs file
- 6. Open the database folder in the root and create a folder that match your organization abbr/code
- 7. In step 6 above, create the following json file into the new created organization folder
    - citizen.json
    - staff.json
    - user.json
- 8. In each created json files, create a sample json of below format
    ``` { "table": [] } ```
- 9. Add your organization logo.png file in the format organizatin abbr/code .png e.g nimc.png
    in the public/asset/img/ directory
- 10. Open index.hbs and change the img src to your newly added logo e.g 
    ``` <img src="asset/img/nimc.png" class="img-fluid" alt=""> ```
- 11. Wrapping up!!! you need to create a sample admin to logon to your new organization.
    - Add the following as an object to your user.json
    ``` {
      "id": 1566372467084,
      "privatekey": "ab2f7e4cc6dd1bf8f30607b438a8a2e435f9c093372d25b28cf17c3153b64ece",
      "publickey": "049cc22cb857d06740c877b3826b3a53c79b1f4401bd80a5ddbe49c3365bd6f690e104691a9ad3d07a25e07155ccc0c9561d1552ab76e07d4de7954a15d94e2be1",
      "name": "Ahmed Olanrewaju",
      "phone": "08093570289",
      "email": "olanrewaju@samplemail.com",
      "role": "admin"
    } 
    ```
    - Add the following as an object to your staff.json
    ```
    {
      "id": 1566372467219,
      "uid": 1566372467084,
      "name": "Ahmed Olanrewaju",
      "phone": "08093570289",
      "email": "olanrewaju@samplemail.com",
      "role": "admin"
    },
    ```
 - 12. Wow!!! You are a genius. Now start the development server and login with the **admin phone number**.   