var allImages = [];
var totalNumberOfPhotos = 0;
var numberOfLoadedPhotos = 0;
if ($("pictureDiv")) {
    $.picasa.albums("mcmasterwhitewater", function (albums) {
        $.each(
        albums, function (i, album) {
            totalNumberOfPhotos += album.numPhotos;
            album.images(

            function (images) {
                $.each(
                images, function (i, image) {
                    allImages.push(image);
                    numberOfLoadedPhotos++;
                    if (numberOfLoadedPhotos == totalNumberOfPhotos) {
                        swapPictures();
                    }
                });
            })
        });
    });
}

function scaleImage(srcwidth, srcheight, targetwidth, targetheight) {

    var result = {
        width: 0,
        height: 0
    };

    var scaleX = targetwidth / srcwidth;
    var scaleY = targetheight / srcheight;

    var scale = Math.min(scaleX, scaleY);

    result.width = Math.floor(srcwidth * scale);
    result.height = Math.floor(srcheight * scale);
    result.targetleft = Math.floor((targetwidth - result.width) / 2);
    result.targettop = Math.floor((targetheight - result.height) / 2);

    return result;
}

function swapPictures() {

    var albumImageParam = allImages[Math.floor(Math.random() * allImages.length)];
    var pictureDiv = $("#pictureDiv");

    // what's the size of this image and the div this image will be placed in
    var w = albumImageParam.width;
    var h = albumImageParam.height;
    var tw = pictureDiv.width();
    var th = pictureDiv.height();

    // compute the new size and offsets
    var result = scaleImage(w, h, tw, th);

    var newImage = $(new Image());
	var showPicture = function(){
	               pictureDiv.append(newImage);
                    $(newImage).attr("id", "picture").attr({
                        "width": result.width,
                        "height": result.height
                    }).css({
					    "position": "relative",
                        "left": result.targetleft,
                        "top": result.targettop
                    }).fadeIn(1000, function () {
                        window.setTimeout(swapPictures, 5000);
                    });
	}
    // load new image
    $(newImage).css("display", 'none').load(
    function () {
        var images = pictureDiv.children("img");
        if (images && images.length > 0) {
            images.each(function () {
                var oldImage = $(this)
                oldImage.fadeOut(1000, function () {
                    $(this).remove();
					showPicture();
     
                });
            })
        }else{
		  showPicture();
		}

    }).attr("src", albumImageParam.url);
}