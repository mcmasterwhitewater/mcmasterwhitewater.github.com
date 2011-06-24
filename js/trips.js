
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
