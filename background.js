 

var crypto = crypto.subtle;
var rsa_params = {
  name: "RSA-OAEP",
  modulusLength: 4096,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: "SHA-256"
}
chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason == "install") {
    console.log("This is a first install!");
    firstTime();

  } else if (details.reason == "update") {
    var thisVersion = chrome.runtime.getManifest().version;
    console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    
  }
});
function firstTime() {
  const ptUtf8 = new TextEncoder().encode('rawText');
  let keyPair = window.crypto.subtle.generateKey(
    rsa_params,
    true,
    ["encrypt", "decrypt"]
  ).then(function (key) {
    //returns a keypair object
    console.log(key);
    console.log(key.publicKey);
    console.log(key.privateKey);
    crypto.subtle.encrypt(
      rsa_params,
      key.publicKey,
      ptUtf8
    ).then((encrypted)=>{
      crypto.subtle.decrypt(
        rsa_params,
        key.privateKey,
        encrypted
      )
    })
    crypto.subtle.exportKey('jwk', key.privateKey).then((exported_priv) => {
      var setObject = {};
      setObject['self_pkey'] = exported_priv;
      var val_test = JSON.stringify(exported_priv);
      var key_test = JSON.parse(val_test);
      
      chrome.storage.sync.set(setObject, function () {
        console.log('Priv is set to ' + key_test);
      });
    })
    crypto.subtle.exportKey('jwk', key.publicKey).then((exported_pub) => {
      var setObject = {};
      setObject['self_pubkey'] = exported_pub;
      chrome.storage.sync.set(setObject, function () {
        console.log('Pub is set to ' + exported_pub);
      });
    })
  })
    .catch(function (err) {
      console.error(err);
    });
}