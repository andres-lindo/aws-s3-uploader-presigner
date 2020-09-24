document.getElementById('fileinput').addEventListener('change', function () {
    for (var i = 0; i < this.files.length; i++) {
        var file = this.files[i];
        /* console.group("File " + i);
        console.log("name : " + file.name);
        console.log("size : " + file.size);
        console.log("type : " + file.type);
        console.log("date : " + file.lastModified);
        console.groupEnd(); */
    }
}, false);

/* document.getElementById('upload').addEventListener('click', function () {

    document.getElementById('upload').disabled = true;

    var file = document.getElementById('fileinput').files[0]
    var error = document.getElementById('error');
    var resultUrl = document.getElementById('resultUrl');

    error.innerHTML = "";
    resultUrl.href = "";
    resultUrl.innerHTML = "";

    var url = 'https://l4df7ait27.execute-api.us-east-1.amazonaws.com/prod/upload';
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    xhr.open("POST", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log(xhr.responseText); // handle response.
            resultUrl.innerHTML = xhr.responseText;
            resultUrl.href = xhr.responseText;
            file.value = "";
        }
        if (xhr.readyState == 4 && xhr.status != 200) {
            console.log(xhr.responseText); // handle response.
            error.innerHTML = xhr.responseText;
        }
        document.getElementById('upload').disabled = false;
    };
    fd.append("upload_file", file);
    xhr.setRequestHeader("file-ext", file.name.split('.').pop());
    xhr.send(fd);
}, false);
 */
document.getElementById('upload').addEventListener('click', function () {

    toggleButton(true);
    var error = document.getElementById('error');
    var resultUrl = document.getElementById('resultUrl');

    error.innerHTML = "";
    resultUrl.href = "";
    resultUrl.innerHTML = "";

    var file = document.getElementById('fileinput').files[0]
    var fileName = Date.now() + "." + file.name.split('.').pop()
    var url = 'https://n0dcfnbx3j.execute-api.us-east-1.amazonaws.com/prod/signer';
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            //console.log(JSON.parse(xhr.responseText).upload_url);
            uploadFile(JSON.parse(xhr.responseText).signed_url, file, fileName);
        }
    };
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.setRequestHeader("file-name", fileName);
    xhr.setRequestHeader("method", "PUT");
    xhr.send();
}, false);

function uploadFile(signedUrl, file, fileName) {

    var xhr = new XMLHttpRequest();
    xhr.open('PUT', signedUrl, true);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.onreadystatechange = function () {
        //console.log(xhr.response);
        if (xhr.readyState == 4 && xhr.status == 200) {
            getSignedUrl(file, fileName)
        }
    }

    xhr.onerror = () => {
        error.innerHTML = xhr.responseText;
    };
    xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
            var percent = Math.round((event.loaded / event.total) * 100)
            //console.log(percent);
            document.getElementById('upload').innerHTML = percent + " %";
        }
    };
    xhr.send(file);
}

function getSignedUrl(file, fileName) {
    var url = 'https://n0dcfnbx3j.execute-api.us-east-1.amazonaws.com/prod/signer';
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.onreadystatechange = function () {
        console.log(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == 200) {
            resultUrl.innerHTML = JSON.parse(xhr.responseText).signed_url;
            resultUrl.href = JSON.parse(xhr.responseText).signed_url;
            file.value = "";
        }
        if (xhr.readyState == 4 && xhr.status != 200) {
            error.innerHTML = xhr.responseText;
        }
        toggleButton(false);
    };
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.setRequestHeader("file-name", fileName);
    xhr.setRequestHeader("method", "GET");
    xhr.send();
}

function toggleButton(disabled) {
    document.getElementById('upload').disabled = disabled;
}




