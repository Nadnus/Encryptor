var rsa_params = {
  name: "RSA-OAEP",
  modulusLength: 4096,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: "SHA-256"
}
function ab2b64(arrayBuffer) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer)));
}
function b642ab(base64string) {
  return Uint8Array.from(atob(base64string), c => c.charCodeAt(0));
}
//function _base64ToArrayBuffer(base64) {
//  var binary_string = window.atob(base64);
//  var len = binary_string.length;
//  var bytes = new Uint8Array(len);
//  for (var i = 0; i < len; i++) {
//      bytes[i] = binary_string.charCodeAt(i);
//  }
//  return bytes.buffer;
//}
//function _arrayBufferToBase64(buffer) {
//  var binary = '';
//  var bytes = new Uint8Array(buffer);
//  var len = bytes.byteLength;
//  for (var i = 0; i < len; i++) {
//    binary += String.fromCharCode(bytes[i]);
//  }
//  return window.btoa(binary);
//}
function ttb(rawText) {
  //Input:text; Output bits
  let encodedCiphertext = b642ab(rawText);
  return encodedCiphertext
}
function btt(thing) {
  //input:bits output text
  let ct = ab2b64(thing);                    // Fix: Use a binary to text encoding like Base64
  console.log(ct.replace(/(.{48})/g, '$1\n'));
  return ct;

}
function encrypt(info, tab) {
  rawText = info.selectionText
  const ptUtf8 = new TextEncoder().encode(rawText);

  console.log("Word " + info.selectionText + " was clicked.");
  let name = prompt("Please enter the reciever's name", "Anon");
  chrome.storage.sync.get(name, function (result) {
    var test = result[[name]];
    console.log('Value currently is ' + test)
    crypto.subtle.importKey(
      "jwk",
      test,
      rsa_params,
      true,
      ['encrypt']
    )
      .then((returned_key) => {
        crypto.subtle.encrypt(
          rsa_params,
          returned_key,
          ptUtf8
        )
          .then((encrypted_text) => {
            var stringed = btt(encrypted_text)
            var url = "data:text/html," + encodeURIComponent(stringed);
            chrome.tabs.create({
              url: url
            });
          })
      })
  });

}
function decrypt(info, tab) {
  let decoder = new TextDecoder('utf-8');
  console.log("Word " + info.selectionText + " was clicked.");
  var v = info.selectionText
  const ptUtf8 = ttb(v);
  chrome.storage.sync.get("self_pkey", function (result) {
    var key_val = result["self_pkey"]
    crypto.subtle.importKey(
      "jwk",
      key_val,
      rsa_params,
      true,
      ['decrypt']
    )
      .then((private) => {
        crypto.subtle.decrypt(
          rsa_params,
          private,
          ptUtf8
        ).then((decoded) => {
          var stringed = decoder.decode(decoded)
          var url = "data:text/html," + encodeURIComponent(stringed);
          chrome.tabs.create({
            url: url
          });
        });
      });
  });
}
function addItem(info, tab) {
  let text;
  var setObject = {};
  chrome.storage.sync.get("self_pubkey", function (result) {
    alert('Your public key will be displayed shortly, send it to your friends to be able to decrypt their messages! Remember NOT to send this to anyone who you dont want decrypting your messages, and use a secure channel for the exchange, such as whatsapp.')
    var val = result['self_pubkey'];
    var jsoned = JSON.stringify(val);
    alert(jsoned)
  })
  let person = prompt("Enter new contact name", "Anon");
  let secret = prompt("Enter their public key");
  if (person == null || person == "" || secret == null || secret == "") {
    text = "User cancelled the prompt.";
  } else {
    var new_pub = JSON.parse(secret);
    setObject[person] = new_pub;
    chrome.storage.sync.set(setObject, function () {
      console.log(person + " had his pubkey set to " + new_pub);
    });
  }
}
function readItem(info, tab) {
  let name = prompt("Please enter the desired sender", "Anon");
  chrome.storage.sync.get(name, function (result) {
    console.log('Value currently is ' + result[[name]]);
  });
}
chrome.contextMenus.create({
  title: "encrypt: %s",
  contexts: ["selection"],
  onclick: encrypt
});
chrome.contextMenus.create({
  title: "decrypt: %s",
  contexts: ["selection"],
  onclick: decrypt
});
chrome.contextMenus.create({
  title: "add: %s",
  contexts: ["selection"],
  onclick: addItem
});
chrome.contextMenus.create({
  title: "read: %s",
  contexts: ["selection"],
  onclick: readItem
});
