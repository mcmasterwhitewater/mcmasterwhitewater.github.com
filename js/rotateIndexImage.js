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

    var result = { width: 0, height: 0};

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
    
    var albumImageParam = allImages[Math.floor(Math.random()*allImages.length)];
	var pictureDiv = $("#pictureDiv");
	// what's the size of this image and the div this image will be placed in
    var w = albumImageParam.width;
    var h = albumImageParam.height;
    var tw = pictureDiv.width();
    var th = pictureDiv.height();

    // compute the new size and offsets
    var result = scaleImage(w, h, tw, th);
	var imgElem = $("#picture");
	var newImage = new Image();
	// adjust the image coordinates and size
    $(newImage).css("display", 'none')		   
		   .load(
		     function(){			   
			   if(imgElem){			     
			     imgElem.fadeOut(1000, 
			                     function(){
								   $(this).remove();
								   pictureDiv.append(newImage);
								   $(newImage).attr("id", "picture")
	                                          .attr({"width": result.width, "height": result.height})		   
                                              .css({"left": result.targetleft, "top": result.targettop})
						                      .fadeIn(1000, 
											          function(){	
										                window.setTimeout(showPicture, 5000);
										              }
													 );
								 }
								);			   
			   }
			 }
		   )
	       .attr("src", albumImageParam.url);
}

