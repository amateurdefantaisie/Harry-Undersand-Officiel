function createLink(){

let username=document.getElementById("username").value;

let link=window.location.origin+"/anonymous/ask.html?user="+username;

document.getElementById("result").innerHTML=

`
Ton lien :

<a href="${link}">${link}</a>

`;

}



function sendMessage(){

let params=new URLSearchParams(window.location.search);

let user=params.get("user");

let message=document.getElementById("message").value;

fetch("https://tonfirebase.firebaseio.com/messages.json",{

method:"POST",

body:JSON.stringify({

user:user,

message:message,

date:Date.now()

})

}).then(()=>{

alert("Message envoyé !")

})

}
