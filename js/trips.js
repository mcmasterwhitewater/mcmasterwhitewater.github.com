function toVisibleDateRange(startDate, endDate){  
  var month_names=["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  if(!endDate)endDate = startDate;
  if(endDate.getHours()==0 &&endDate.getMinutes()==0 &&endDate.getSeconds()==0)
    endDate = new Date(endDate.getTime()-24*3600000);
  if(startDate.getFullYear()==endDate.getFullYear()){
	if(startDate.getMonth()==endDate.getMonth()){
	  if(startDate.getDate()==endDate.getDate()){	 
	    return month_names[startDate.getMonth()]+ " "+startDate.getDate()+",  "+startDate.getFullYear();	  
	  }else{
	    return month_names[startDate.getMonth()]+ " "+startDate.getDate()+" - "+endDate.getDate()+",  "+startDate.getFullYear();	  
	  }	  
	}else{
	  return month_names[startDate.getMonth()]+ " "+startDate.getDate()+" - "+ month_names[startDate.getMonth()]+ " "+endDate.getDate()+",  "+startDate.getFullYear();	  
	}
  }else{
	return month_names[startDate.getMonth()]+ " "+startDate.getDate()+",  "+startDate.getFullYear()+" - "+month_names[endDate.getMonth()]+ " "+endDate.getDate()+",  "+endDate.getFullYear();
  }
	
  
}

function parseISO8601DateInLocalTZ(dateString){
    var chunks = dateString.split("T");
	var dateString = chunks[0];
	var dateChunks = dateString.split("-");
	var timeString = "00:00:00";
	if(chunks.length == 2){
	  timeString = chunks[1].split(".")[0];
	}
	var timeChunks = timeString.split(":");
	return new Date(dateChunks[0], dateChunks[1]-1, dateChunks[2], timeChunks[0], timeChunks[1], timeChunks[2]);
	
}

function intToTwoDigitString(month){  
  if(month <10)return "0" + month;
  else return month + "";
}

// Converts carriage returns 
// to <BR> for display in HTML
function replaceCarriageReturnsWithBR(input){ 

  var output = "";
  for (var i = 0; i < input.length; i++) {
    
    if(input.charCodeAt(i) == 10) {      
      output += "<BR/>";
    } else {
      if (input.charCodeAt(i) != 13)output += input.charAt(i);
    }
  }
  return output;
}

//parameter should be id pointing to the parent div
function generateTripHtml(parent){
  var today = new Date();
  var aWeekAgo = new Date(today.getTime()-7*24*3600000);
  var startSearchDate=aWeekAgo.getFullYear()+"-"+intToTwoDigitString(aWeekAgo.getMonth()+1)+"-"+intToTwoDigitString(aWeekAgo.getDate());
  var endSearchDate=today.getFullYear()+"-12-31";  
  var calendarRequest = "https://www.google.com/calendar/feeds/fp364lokq7fjtbqvesb2b7fgnc%40group.calendar.google.com/public/full?callback=?&alt=jsonc&orderby=starttime&singleevents=true&sortorder=a&start-min="+startSearchDate+"&start-max="+endSearchDate;
  

  $.ajax({
    url:calendarRequest,
	dataType:"json",	
    success:function(response){
	  
      var tripsHtml = "";
      for(var i=0;i<response.data.items.length;i++) {
	    var calendarItem = response.data.items[i]
	    tripsHtml=tripsHtml+"<h2>"+calendarItem.title+"</h2>";
	    tripsHtml=tripsHtml+"<p>Date(s): "+toVisibleDateRange(parseISO8601DateInLocalTZ(calendarItem.when[0].start), parseISO8601DateInLocalTZ(calendarItem.when[0].end))+"</p>";	  
	    tripsHtml=tripsHtml+"<p>"+replaceCarriageReturnsWithBR(calendarItem.details)+"</p>";	  
	    if(calendarItem.location)tripsHtml = tripsHtml+"<a target='_blank' href='http://maps.google.com/maps?q="+calendarItem.location+"'>Map</a>"

		tripsHtml+="<br><br>";
      }
	  $(parent).append(tripsHtml);    
    }
  });
}
