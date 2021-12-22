
function myFunction() {
  let text;
  chrome.storage.sync.get("self_pubkey", function (result) {
    alert('Your public key will be displayed shortly, send it to your friends to be able to decrypt their messages! Remember NOT to send this to anyone who you dont want decrypting your messages, and use a secure channel for the exchange, such as whatsapp.')
    var val = result['self_pubkey'];
    var jsoned = JSON.stringify(val);
    alert(jsoned)
  })
  //let person = prompt("Enter new contact name","Anon");
  //let secret = prompt("Enter their public key");
  //if (person == null || person == "" || secret == null || secret == "") {
  //  text = "User cancelled the prompt.";
  //} else {
  //  var new_pub = JSON.parse(secret);
  //  setObject[person] = new_pub;
  //  chrome.storage.sync.set(setObject, function () {
  //    console.log(person + " had his pubkey set to " + new_pub);
  //  });
  //}
  document.getElementById("demo").innerHTML = text;
}
document.addEventListener('DOMContentLoaded', function () {
  var checkPageButton = document.getElementById('myButton');
  checkPageButton.addEventListener('click', myFunction);
})


