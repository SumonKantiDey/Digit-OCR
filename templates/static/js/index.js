    var flag = false,
        prevX,
        prevY,
        currX = 0,
        currY = 0,
        strokeColor = "black",
        drawWidth = 10;

    function init() 
    {
        canvas = document.getElementById('can');
        ctx = canvas.getContext("2d");

        canvas.addEventListener("mousemove", function (e) 
        {
            if(flag)
            {
                prevX = currX;
                prevY = currY;
                currX = e.clientX - canvas.offsetLeft;
                currY = e.clientY - canvas.offsetTop;
                draw();
            }
        }, false);

        canvas.addEventListener("mousedown", function (e) 
        {
            currX = e.clientX - canvas.offsetLeft;  //Sets start position for drawing
            currY = e.clientY - canvas.offsetTop;
            flag = true;
        }, false);

        canvas.addEventListener("mouseup", function (e) 
        {
            flag = false;
        }, false);

        canvas.addEventListener("mouseout", function (e) 
        {
            flag = false;
        }, false);
    }

    function draw() 
    {
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(currX, currY);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = drawWidth;
        ctx.stroke();
        ctx.arc(currX, currY, drawWidth/2, 0, 2*Math.PI)
        ctx.fill();
        ctx.closePath();
    }

    function erase() 
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function submitImg() 
    {
        var dataURL = canvas.toDataURL("image/png");
        var blob = dataURItoBlob(dataURL);
        var formData = new FormData();
        formData.append('imageSub',blob);
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            //deal with response, errors.
        }
        request.open("POST", "/uploadimage", true);
        request.send(formData);
    }

    function dataURItoBlob(dataURI) {   // convert base64 to raw binary data held in a string
        var byteString = atob(dataURI.split(',')[1]);   // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]  // separate out the mime component
        var ab = new ArrayBuffer(byteString.length);    // write the bytes of the string to an ArrayBuffer
        var ia = new Uint8Array(ab);    // create a view into the buffer
        for (var i = 0; i < byteString.length; i++) // set the bytes of the buffer to the correct values
        {
            ia[i] = byteString.charCodeAt(i);
        }
        var blob = new Blob([ab], {type: mimeString});  // write the ArrayBuffer to a blob, and you're done
        return blob;
    }