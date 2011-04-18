var allImages = [];
var totalNumberOfPhotos = 0;
var numberOfLoadedPhotos = 0;
if($("pictureDiv")){
  $.picasa.albums("mcmasterwhitewater", function(albums){		
        $.each(
		  albums, 
		  function(i, album) {
		    totalNumberOfPhotos+=album.numPhotos;
		    album.images(
			  function(images){
			    $.each(
				  images, 
				  function(i, image) {				     
				     allImages.push(image);
					 numberOfLoadedPhotos++;
					 if(numberOfLoadedPhotos == totalNumberOfPhotos){
					   showPicture();
					   window.setInterval(function(){
					                        showPicture();
										  },  5000);

					 }
                  }
			    );
			  }
			)						    
          }
		);	
	}
  );
}
  
function scaleImage(srcwidth, srcheight, targetwidth, targetheight) {

    var result = { width: 0, height: 0, fScaleToTargetWidth: true };

    var scaleX = targetwidth/srcwidth;
	var scaleY = targetheight/srcheight;

	var scale = Math.min(scaleX, scaleY);
	
	result.width = Math.floor(srcwidth*scale);
	result.height = Math.floor(srcheight*scale);
    result.targetleft = Math.floor((targetwidth - result.width) / 2);
    result.targettop = Math.floor((targetheight - result.height) / 2);

    return result;
}
function showPicture(){
  var image = allImages[Math.floor(Math.random()*allImages.length)];
  var imgElem = $("#picture");
  
  

    // what's the size of this image and it's parent
    var w = image.width;
    var h = image.height;
    var tw = imgElem.parent().width();
    var th = imgElem.parent().height();

    // compute the new size and offsets
    var result = scaleImage(w, h, tw, th);

    // adjust the image coordinates and size
    imgElem.attr("width", result.width);
    imgElem.attr("height", result.height);
    imgElem.css("left", result.targetleft);
    imgElem.css("top", result.targettop);
	imgElem.attr("src", image.url);
}
