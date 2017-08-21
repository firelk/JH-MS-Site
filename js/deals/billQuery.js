

$(function(){

	$('li').click(function(){
		var selectMonth=$(this).find('.billDetialNumberMode span').html();
		location.href='/deals/billCycle?selectMonth='+selectMonth;
	});

});