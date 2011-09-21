function playVideo( uri){    
    $.fancybox({	  
	  'showCloseButton'     : false,
      'padding'             : 0,
      'autoScale'           : false,
      'transitionIn'        : 'none',
      'transitionOut'       : 'none',
      //'title'               : title,
      'width'               : 680,
      'height'              : 495,
      'href'                : uri,
      'type'                : 'swf',    
      'swf'                 : {'allowfullscreen':'true'} // <-- flashvars here
     });
  }
	
  function onPlayListLoaded(playListJsonData, playListId, playListTitle, updated, divToPopulate){    
	var videoThumbHtml = '';
	var numberOfVisibleVideos = 6;
	for(var j=0, videos=playListJsonData.feed.entry, numOfVideos = videos.length;j<numOfVideos;j++){
	  var video=videos[j];
	  var videoTitle = video.title.$t;
	  var thumbNail = video.media$group.media$thumbnail[0];
	  var videoId = video.media$group.yt$videoid.$t;			
	  var videoUrl = "http://www.youtube.com/v/"+videoId;
	  var scrollingDisabledHtml = '';
	  if(numberOfVisibleVideos >= numOfVideos)
	    scrollingDisabledHtml = 'disabled="disabled"';			
	    videoThumbHtml = videoThumbHtml + '<li><a href="#" onclick="playVideo(\''+videoUrl+'\')"><div><img src="'+thumbNail.url+'" class="carausele_img"/><br/><span class="carausele_img_text">'+videoTitle+'</span></div></a></li>';			
	}	
      
	divToPopulate.append($('<span>'+playListTitle+"(last updated: "+updated+")"+'</span><div><button id="prev'+playListId+'" class="carousele_previous"' + scrollingDisabledHtml + '>&lt;&lt;</button><div id="carousele'+playListId+'" class="carousele_strip"><ul>'+videoThumbHtml+'</ul></div><button class="carousele_next" id="next'+playListId+'" ' + scrollingDisabledHtml + '>&gt;&gt;</button></div><div class="clear"></div>'));
	$("#carousele"+playListId).jCarouselLite({
      btnNext: "#next"+playListId,
      btnPrev: "#prev"+playListId,
      visible: numberOfVisibleVideos,
      speed: 0 //remove slide effect
    });
  }	
  
  function loadVideoPlaylists(divToPopulate){
    //load list of playlists
    $.ajax({
      url: "https://gdata.youtube.com/feeds/api/users/mcmasterwhitewater/playlists?v=2&orderby=updated&alt=json-in-script&fields=entry(title,yt:playlistId,updated)",
      dataType: 'jsonp',
      success: function(playListsJsonData){    
        for(var i=0, playLists=playListsJsonData.feed.entry, numOfPlayLists = playLists.length;i<numOfPlayLists;i++){
	      var playList = playLists[i];
	      var playListTitle = playList.title.$t;
	      var playListId=playList.yt$playlistId.$t;
	    
	      var playListKeyData = {
	        plId: playListId,
		    plTitle: playListTitle,
		    updated: parseISO8601DateInLocalTZ(playList.updated.$t),
		    handler: function(playListJsonData){		  
		      onPlayListLoaded(playListJsonData, this.plId, this.plTitle, this.updated, divToPopulate);
		    }
	      }
	    
		  //load playlist contents
	      $.ajax({
	        url: "http://gdata.youtube.com/feeds/api/playlists/"+playListId+"?v=2&orderby=published&fields=entry(title,media:group(media:thumbnail,yt:videoid))&alt=json-in-script",
	    	dataType: 'jsonp',
	    	success: $.proxy(playListKeyData.handler, playListKeyData)
	      });
	  
	    }
      }
    });			
  }