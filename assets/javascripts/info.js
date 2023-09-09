


/*
 * INFO SECTION
 */

var Info = {
    init : function(data){
        var jsonString = OpenTimestamps.json(data);
        var obj = JSON.parse(jsonString);

        // Fill labels
        $("#hash").html(obj.hash);
        $("#error").html("");
        if(obj.result=="KO"){
            $("#error").html(obj.error);
        }
        $("#digest").html(obj.hash);
        $("#type").html(obj.op);
        $("#title_digest").html(obj.hash.substring(0, 12));
        $("#table").empty()
        this.container = $("#table")

        // Print timestamp
        Info.print(obj.timestamp);
    },
    print : function(timestamp){

        if(timestamp.attestations !== undefined ){
            timestamp.attestations.forEach(function(item){
                var div = Info.printAttestation(item,item.fork);
                Info.container.append(div);
                if(item.merkle !== undefined){
                    div = Info.printMerkle(item.merkle,item.fork);
                    Info.container.append(div);
                }
            });
        }

        if(timestamp.tx !== undefined ) {
            var div = Info.printTx(timestamp.tx,timestamp.ops[0].fork);
            Info.container.append(div);
        }

        if(timestamp.ops === undefined ){
            return;
        }

        if(timestamp.ops.length > 1){
            var subdiv = Info.printFork(timestamp.fork,timestamp.ops.length);
            Info.container.append(subdiv);

            var div = document.createElement('div');
            $(div).addClass("table-i");
            $(div).append("<div class='table'></div>");
            $(div).appendTo($("#table"));
            Info.container = $(div).find('div');

        }

        if(timestamp.ops.length > 0){
            timestamp.ops.forEach(function(item){
                var div = Info.printTimestamp(item.op,item.arg,item.result,item.fork);
                Info.container.append(div);
                Info.print(item.timestamp);
            });
        }
    },
    printAttestation : function(item,fork){
        var div = document.createElement('div');
        $(div).addClass("table-i");

        var title="Attestation";
        var color="grey";
        var content = "";
        if(item.type == "BitcoinBlockHeaderAttestation") {
            title = "Bitcoin Attestation";
            content = 'Merkle root of Bitcoin block ' +
                '<strong class="hash" style="display: inline;">' + item.param + '</strong>' +
                '<a class="copy"></a>' +
                '</div>';
            color = "green";
        } else if(item.type == "LitecoinBlockHeaderAttestation"){
            title = "Litecoin Attestation";
            content = 'Merkle root of Litecoin block ' +
                '<strong class="hash" style="display: inline;">'+item.param+'</strong>' +
                '<a class="copy"></a>' +
                '</div>';
            color="gold";
        } else if(item.type == "EthereumBlockHeaderAttestation"){
            title = "Ethereum Attestation";
            content = 'Merkle root of Ethereum block ' +
                '<strong class="hash" style="display: inline;">'+item.param+'</strong>' +
                '<a class="copy"></a>' +
                '</div>';
            color="gold";
        } else if(item.type == "PendingAttestation"){
            title = "Pending Attestation";
            content = "Pending attestation: server "+"<a href=''>"+item.param+"</a>";
            color="gold";
        } else if(item.type == "UnknownAttestation"){
            title = "Unknown attestation";
            content = "Unknown Attestation: payload "+"<a href=''>"+item.param+"</a>";
            color="grey"
        }

        var first = document.createElement('div');
        $(first).addClass("table-name "+color);
        $(first).html(title);
        $(first).appendTo(div);

        var second = document.createElement('div');
        $(second).addClass("table-value table-value_copy");
        $(second).append(content);
        $(second).appendTo(div);

        return div;
    },
    printMerkle : function(merkle,fork){
        var div = document.createElement('div');
        $(div).addClass("table-i");

        var title="Merkle Root";
        var content=merkle;
        var color="purple";

        var first = document.createElement('div');
        $(first).addClass("table-name "+color);
        $(first).html(title);
        $(first).appendTo(div);

        var second = document.createElement('div');
        $(second).addClass("table-value table-value_copy");
        $(second).append('<div class="badge"></div>');
        if(fork>0) {
            $(second).find(".badge").append('<p class="step">'+fork+'</p>');
        }
        $(second).find(".badge").append('<p class="hash">'+content+'</p>');
        $(second).find(".badge").append('<a class="copy"></a>');
        $(second).appendTo(div);

        return div;
    },
    printTx : function(tx,fork){
        var div = document.createElement('div');
        $(div).addClass("table-i");

        var title="Note";
        var content=tx;
        var color="purple";

        var first = document.createElement('div');
        $(first).addClass("table-name "+color);
        $(first).html(title);
        $(first).appendTo(div);

        var second = document.createElement('div');
        $(second).addClass("table-value table-value_copy");
        $(second).append('<p>Probably a Bitcoin transaction</p>');
        $(second).append('<div class="badge"></div>');

        if(fork>0) {
            $(second).find(".badge").append('<p class="step">'+fork+'</p>');
        }
        $(second).find(".badge").append('<p class="hash">'+content+'</p>');
        $(second).find(".badge").append('<a class="copy"></a>');
        $(second).appendTo(div);

        return div;
    },
    printFork : function(fork,totfork){
        var div = document.createElement('div');
        $(div).addClass("table-i");

        var title="Fork";
        var content="Fork in " + totfork + " paths";
        var color="blue";

        var first = document.createElement('div');
        $(first).addClass("table-name "+color);
        $(first).html(title);
        $(first).appendTo(div);


        var second = document.createElement('div');
        $(second).addClass("table-value");
        if(fork>0) {
            $(second).append('<p class="step">'+fork+'</p>');
        }
        $(second).append('<p class="">'+content+'</p>');
        $(second).appendTo(div);

        return div;
    },
    printTimestamp : function(op,arg,result,fork){
        var div = document.createElement('div');
        $(div).addClass("table-i");

        var content = result;
        if(arg.length>0){
            var start = (op=="append") ? content.lastIndexOf(arg) : content.indexOf(arg);
            var end = start+arg.length;
            content = result.substring(0, start)+"<span class='green'>"+arg+"</span>"+result.substring(end, result.length)
        }
        var title = op+"("+((arg.length>0)?arg.substring(0, 6)+'...':'')+")";
        var color="purple";

        var first = document.createElement('div');
        $(first).addClass("table-name ");
        $(first).html(title);
        $(first).appendTo(div);

        var second = document.createElement('div');
        $(second).addClass("table-value");
        $(second).append('<div class="badge"></div>');
        if(fork>0) {
            $(second).find(".badge").append('<p class="step">'+fork+'</p>');
        }
        $(second).find(".badge").append('<p class="hash">'+content+'</p>');
        $(second).appendTo(div);

        return div;
    }
}


/*
 * EXTENDS ARRAY
 */
Array.prototype.remove = Array.prototype.remove || function(val){
    var i = this.length;
    while(i--){
        if (this[i] === val){
            this.splice(i,1);
        }
    }
};

/*
 * COMMON FUNCTIONS
 */
// Human file size
function humanFileSize(bytes, si) {
	var thresh = si ? 1000 : 1024;
	if (Math.abs(bytes) < thresh) {
		return bytes + ' B';
	}
	var units = si
		? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
		: ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
	var u = -1;
	do {
		bytes /= thresh;
		++u;
	} while (Math.abs(bytes) >= thresh && u < units.length - 1);
	return bytes.toFixed(1) + ' ' + units[u];
}

// Download file
function download(filename, text) {
	var blob = new Blob([text], {type: "octet/stream"});

	saveAs(blob, filename + (Proof.isValid(filename) ? '' : '.ots') );
}

function string2Bin(str) {
	var result = [];
	for (var i = 0; i < str.length; i++) {
		result.push(str.charCodeAt(i));
	}
	return result;
}
function bin2String(array) {
	return String.fromCharCode.apply(String, array);
}

function ascii2hex(str) {
	var arr = [];
	for (var i = 0, l = str.length; i < l; i ++) {
		var hex = Number(str.charCodeAt(i)).toString(16);
		if (hex<0x10) {
			arr.push("0" + hex);
		} else {
			arr.push(hex);
		}
	}
	return arr.join('');
}

function hex2ascii(hexx) {
	var hex = hexx.toString();//force conversion
	var str = '';
	for (var i = 0; i < hex.length; i += 2)
		str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
	return str;
}

function bytesToHex (bytes) {
	const hex = [];
	for (var i = 0; i < bytes.length; i++) {
		hex.push((bytes[i] >>> 4).toString(16));
		hex.push((bytes[i] & 0xF).toString(16));
	}
	return hex.join('');
};

function hexToBytes(hex) {
	const bytes = [];
	for (var c = 0; c < hex.length; c += 2) {
		bytes.push(parseInt(hex.substr(c, 2), 16));
	}
	return bytes;
};

function upperFirstLetter(string){
	return string[0].toUpperCase() + string.substr(1);
}


// get parameters
function getParameterByName(name, url) {
	if (!url) {
		url = window.location.href;
	}
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}


/*
 * STATUS ALERT MESSAGES
 */

function message(title, text, cssClass, showInfo){
	$('#statuses').attr('class','statuses '+cssClass);
    $('#statuses .statuses-title').html(title);
    $('#statuses .statuses-description').html(text);
    message_info(showInfo);
    $('#statuses').show();
}

function message_info(showInfo){
    if(showInfo != undefined && showInfo == true){
        $('#statuses .statuses-info').show();
    } else if(showInfo != undefined && showInfo == false){
        $('#statuses .statuses-info').hide();
    }
}

function verifying(text){
    message("VERIFICANDO", text, 'statuses_hashing', true);
}
function stamping(text){
    message("FIRMANDO", text, 'statuses_hashing', false);
}
function hashing(text){
    message("HASHEANDO", text, 'statuses_hashing', false);
}
function success(text){
    message("FINALIZADO", text, 'statuses_success');
}
function failure(text){
    message("FALLO EN LA FIRMA", text, 'statuses_failure');
}
function warning(text){
    message("A LA ESPERA", text, 'statuses_warning');
}

/* Clipboard */
var clipboard = new Clipboard('.copy', {
    text: function(event) {
        var text = $(event).parent().find(".hash").html();
        console.log(text);

        $(".clipboard-copy")
          .css('display','block')
          .find('.badge-copy .hash')
          .html(text);

        setTimeout(function(){
          $(".clipboard-copy").css('display','none');
        },3000)
        return text;
    }
})

// Agrega un evento de clic al botón de "Firmar"
$("#signButton").on("click", function () {
    var input = document.getElementById("stamped_input");
    if (input.files.length > 0) {
        var file = input.files[0];
        var reader = new FileReader();

        reader.onload = function (e) {
            var fileData = e.target.result;
            var filename = file.name;

            // Aquí puedes realizar la firma del archivo y obtener el resultado

            // Simulación de firma (reemplaza esto con tu lógica de firma real)
            var signatureData = "EjemploDeFirmaDigital";

            // Genera el nombre de archivo de salida .ots
            var otsFilename = filename + ".ots";

            // Descarga el archivo .ots
            download(otsFilename, signatureData);
        };

        reader.readAsDataURL(file);
    }
});
