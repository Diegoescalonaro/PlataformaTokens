/*  Fichero JavaScript para funciones basicas implementadas con la API: waves-api */

/* - - - - Variables - - - - */

var account = null;
var transferData={};

// Inicializo constante Waves, para llamar a funciones de waves-api
const Waves = WavesAPI.create(WavesAPI.MAINNET_CONFIG);     
console.log(Waves);

/* - - - - Funciones - - - - */

  function login(){

        	// DESOCULTA MODAL CON INFO DE CUENTA
        	document.getElementById("modaloculto").classList.remove("invisible");

          // Restaura cuenta desde Seed y guarda en sessionStorage
          account = Waves.Seed.fromExistingPhrase(document.getElementById("seed").value);
          console.log("Se ha iniciado sesion en:"+account.address);
          // Lo guardo en variable local del navegador (cookies)
          sessionStorage.setItem("Account",account);

          var info = document.getElementById("info");
          var transacciones = document.getElementById("transacciones");
          var balanceTEFTOK = document.getElementById("balanceTEFTOK");

          info.innerHTML = "<li><b>Direccion: </b>" +account.address +"<br></li>";
          transacciones.innerHTML = "";
          
          Waves.API.Node.addresses.balance(account.address)
            .then((PromiseValue) => {
            console.log("Balance Waves: "+PromiseValue.balance);
            info.innerHTML += "<li><b> Waves: </b>"+PromiseValue.balance+"<br></li>";
          });

         Waves.API.Node.assets.balance(account.address,"AFUG6HXViGfAnobd41H1sAeASUEmjF7dHsgt5K1XFcfM").then((value) => {
            console.log("Balance TEFTOK: "+value.balance/1000);
            sessionStorage.setItem("Balance",value.balance);
            balanceTEFTOK.innerHTML = sessionStorage.getItem("Balance")/1000+" TEFTOK";

            info.innerHTML += "<li><b> TEFTOK: </b>"+value.balance/1000+"<br></li>";
          });

          Waves.API.Node.transactions.getList(account.address,100).then((txs) => {
            console.log(txs);
            transacciones.innerHTML += "<hr>Ultimas Transacciones <br>";
            for(i=0; i<9; i++){
              transacciones.innerHTML += ""+txs[i].id+"<br>";
            }
          });
        
        }
  

  function envio(){

        	var destino = document.getElementById("destino").value;
        	var cantidad = document.getElementById("cantidad").value;


			    console.log(Waves.config.get());

          var timestamp1 = Date.now();

          transferData = {
            	// An arbitrary address; mine, in this example
            	recipient: destino,
            
            	// ID of a token, or WAVES
            	assetId: 'AFUG6HXViGfAnobd41H1sAeASUEmjF7dHsgt5K1XFcfM', //TEFTOK
            	// The real amount is the given number divided by 10^(precision of the token)
            	amount: cantidad,
            	// The same rules for these two fields
            	feeAssetId: 'WAVES',
            	fee: 100000,
            	// 140 bytes of data (it's allowed to use Uint8Array here)
            	attachment: '', // SI PONGO ALGO DA FALLO: INVALID SIGNATURE
            	version:1,
            	timestamp: timestamp1
          }; 

         	console.log(transferData);
         	console.log("Transacción de TEFTOK a la direccion:"+destino)

         	Waves.API.Node.transactions.broadcast('transfer', transferData, account.keyPair).then((responseData) => {
            console.log(responseData);
          	});
          

     }

/*
          getSignature();

          transferData = {
            // An arbitrary address; mine, in this example
            recipient: '3P6onwAhnS1e63sFjN2PCKuRsxdHJuF6Qna',
            senderPublicKey: "UiJxp3iR8AcCYVxaijFQbbGL2Hp4MSBPge6emBfqCEs",
            // ID of a token, or WAVES
            assetId: 'AFUG6HXViGfAnobd41H1sAeASUEmjF7dHsgt5K1XFcfM', //TEFTOK
            // The real amount is the given number divided by 10^(precision of the token)
            amount: 1000,
            // The same rules for these two fields
            feeAssetId: "",
            fee: 100000,
            // 140 bytes of data (it's allowed to use Uint8Array here)
            attachment: 'Probando',
            timestamp: timestamp1,
            signature: signature

          };

          /*transferData = { assetId: "AFUG6HXViGfAnobd41H1sAeASUEmjF7dHsgt5K1XFcfM", feeAssetId: "", senderPublicKey: "UiJxp3iR8AcCYVxaijFQbbGL2Hp4MSBPge6emBfqCEs", recipient: "3P6onwAhnS1e63sFjN2PCKuRsxdHJuF6Qna", amount: 1000, fee: 100000, timestamp: 1532419918476, attachment: "ETSLMqFmwRg", signature: "2E54gAosSAM2eRmjvfErXspHk6SLfY4CxbsHE97AyeU7WbFmoQ9hxboCZXVLobbuedhaYsPJxxZcCrtrt6QidSHE"} */


          /*fetch("https://nodes.wavesnodes.com/assets/broadcast/transfer",
              {
              headers:{
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                    },
              method: "POST",
              body: transferData
              })
              .then((response) => {
                  console.log(response);
                })
              .catch((error) => {
                  console.log(error);
                });
              
            var http = new XMLHttpRequest();
            var url = "https://nodes.wavesnodes.com/transactions/broadcast";
            http.open("POST",url,true);
            http.setRequestHeader("Content-Type", "application/json");
            
            http.onreadystatechange = function() {
              if(http.readyState == 4 && http.status == 200) { 
              //aqui obtienes la respuesta de tu peticion
            alert(http.responseText);
            }
              }
            http.send(transferData);
		

        }

        var ret="";

        function JSONToArray(json){ 
              var str = JSON.stringify(json, null, 0);
              ret = new Uint8Array(str.length);
              for (var i = 0; i < str.length; i++) {
                  ret[i] = str.charCodeAt(i);
              }
              return ret;
          }

        var signature = "";
        function getSignature(){

          JSONToArray(transferData);
          signature = wavesSignatureGenerator.utils.crypto.buildTransactionSignature(ret, account.keyPair.privateKey);
          console.log(signature);
        }

        //https://nodes.wavesnodes.com

        */