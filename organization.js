const organization = {

    nimc: {
        privatekey: 'a74e7ef3b3988256c4a2fed9236f156036ec4449208cf899418df36197d61a30',
        publickey: '045d1a613251321403e4b6cf3983fbc4960fd7cd343e4e974a0a9cd5a8201b81524a91191c49a6c7ad5051481a1310e093f2972832eb3d8d7e2655d3ae1119fa10',
    },
    nis: {
        privatekey: '9460091587f8c0dea5e2deec79cdc3a7e2aff1fdab3fc53263422239325517a0',
        publickey: '042b37fcecf909429c7472aa3da4da530f28b9a6a9deeb01ab1d91c015b886b19d53897ca1aa329608ce19d4aa4f7146906495b7e19ffc0707169aab827d867b29'
    },
    frsc: {
        privatekey: '527957fed5d777def18beddc6acf5aa185790eb15772377fd640a918caf882cf',
        publickey: '0462ab5899ac7c7793458d375d3776a7d42c41d4654180e7521d1661a31165a4626e6f978fc7bd2bfb29d93ce2e6fafee92bd50384703ec58abd86ce1163dbe6f5'
    },
    cbn: { 
        privatekey: '9bce57aff836bbf41e6327356dca2f4a0840dc23f0306cfd096b965ce91bf052',
        publickey: '04658786ec3a66313a2a2aee4c1d9167c571ce63177698f92003a02537967248cfecb9e243001cc4610b84563e45f073a78b6feaf4addae71467a135e3cce7da67' 
    },
    gtbank: { 
        privatekey: '79dbb40b5c40c14c1ac5557227af6e85abcb0662a2e12f4240c29dc7eb75f1a6',
        publickey: '0428d0fe891f63f1401433d602c52e9e67603d75ffe4d83cd83ba357a8ba326cca0223998a6515ab121138f504a75d02c0d0f9bd04c5ed2faca406f2c8b5262106' 
    },
    uba: { 
        privatekey: 'a5e42942a464f8d1a71ae0f41212639fd03d9baee47613547b73c47d9ed07654',
        publickey: '04a24209e965a73789a1302d06d76aa09a5cdeb55c4929361d4eb7f79f1456893ca49c293cffb89ad4343300b4da19a2e9978eb4c95f982806fbc4649ef7a75df0' 
    },
    polaris: { 
        privatekey: '167fba9d854e4d0a329ef5a729aeba21bd2f4e37100fbfb5899b37ea016d46b6',
        publickey: '0430eea7f983fc5ddf791377ec07ec7bc0600f4a13c7f9091d65e5c50346e4d378dfeed7b76d448c3805f9483dd3fbf3835364ff4c88e811e80ef1fb88edb841ba' 
    },
    firstbank: { 
        privatekey: 'a4a220b3ce54f271a7d25e6c476b4f81991d345095d938aa939ac2a2f0601def',
        publickey: '044dde4176a22e2a64f056f470f5e4090e3e9b6e48f4173fb01a3da922b94daef5ba883e301564ab41c2ac726afe0681cf458d884a35b45fa9ec5092050d2f98a7' 
    },
    unionbank: { 
        privatekey: 'c5a6e3d9ccc7cc1bd0ac008d0fa547acd0ea15a6ec73f8f776c62d3d215a34',
        publickey: '04267e4a8933d2eb91c896bd9664f888ef5d2e6e133ba5f91e2d41f9811f506aee0f25cf6fb268666580b6b763557e956d82f7a16c04254d10d89ea66999b7eb3c' 
    }
    
}

let orgArr = new Array();
Object.keys(organization).forEach((item,i)=>{
	let newObj = {};
	newObj.code = item;
	newObj.privatekey = organization[item].privatekey;
	newObj.publickey = organization[item].publickey;
	orgArr.push(newObj);
});

module.exports = orgArr