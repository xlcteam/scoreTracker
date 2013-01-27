window.scaling1 = 0;
window.scaling2 = 0;

function scoreTracker()
{
    this.teamA = 'Robot';
    this.teamB = 'Human';
    this.scoreA = 0;
    this.scoreB = 0;

    this.mins = 20;
    this.secs = 0;
    this.halftime = 1;
    this.finished = false;
}

scoreTracker.prototype.syncMatch = function (){
  //TODO
}

scoreTracker.prototype.teamAGoal = function (){
    if (window.scaling1) return false;
    else {
	    this.scoreA++;
	    $("#team1").html(this.scoreA);
	    if(document.forms['effects'][0].checked) {
	        window.scaling1 = 1;
		    $("#team1").effect("scale", { percent: 150}, 500)
			           .effect("scale", { percent: (100 / (150 / 100))}, 1000, function(){
	                          window.scaling1 = 0;
	                    });
	    }
    }
}

scoreTracker.prototype.teamBGoal = function (){
	if (window.scaling2) return false;
	else {
		this.scoreB++;
		$("#team2").html(this.scoreB);
		if(document.forms['effects'][0].checked) {
			window.scaling2 = 1;
			$("#team2").effect("scale", { percent: 150}, 500)
				       .effect("scale", { percent: 100 / (150 / 100)}, 1000, function(){
											    window.scaling2 = 0;
			            });
		}
	}
}

scoreTracker.prototype.teamADown = function (){
    if (this.scoreA <= 0){
		this.scoreA = 0;
		return false;	
	}else {
		if (window.scaling1) return false;
		else {		
			this.scoreA--;
			$("#team1").html(this.scoreA);
			if(document.forms['effects'][0].checked) {
				window.scaling1 = 1;	
                //soundPlay("whistle");
				$("#team1").effect("scale", { percent: 150}, 500)
		             	   .effect("scale", { percent: Math.ceil(100 / (150 / 100))}, 1000, function(){
                    	                            window.scaling1 = 0;
						    });
			}
		}
	}
}

scoreTracker.prototype.teamBDown = function (){
	if (this.scoreB <= 0){
		this.scoreB = 0;
		return false;	
	}else{
		if (window.scaling2) return false;
		else {
			this.scoreB--;
			$("#team2").html(this.scoreB);
			if(document.forms['effects'][0].checked) {
				window.scaling2 = 1;
                soundPlay("whistle");
				$("#team2").effect("scale", { percent: 150}, 500)
				           .effect("scale", { percent: Math.ceil(100 / (150 / 100))}, 1000, function(){
													window.scaling2 = 0
							});
			}
		}
	}
}

scoreTracker.prototype.resetScore = function (){
    this.scoreA = 0;
    this.scoreB = 0;
    $('#team1').html(this.scoreA);
    $('#team2').html(this.scoreB);
}


// stopwatch
scoreTracker.prototype.toggle = function (){
    if ($("#startAll").is(':visible')){
        $('#startAll').hide();
    }  

    if ($("#btnStart").html() == "Start" || $("#btnStart").html() == "Resume"){
        $("#btnStart").html('Pause')
	    $("#time").stopwatch({formatter: this.format, updateInterval: 50})
                    .stopwatch('start');
        return;
    } else if ($("#btnStart").html() == "Pause"){
        $("#btnStart").html("Resume");
	    $("#time").stopwatch().stopwatch('stop');
	    return;
    }
}

scoreTracker.prototype.startMatch = function (){
    $('#startAll').hide();
    this.toggle();
}

scoreTracker.prototype.toggleHalf = function (){
    $('#startAll').html('2.');
	toggle();
}

scoreTracker.prototype.resetTime = function (){
	if ($("#btnStart").html() == "Resume" || $("#btnStart").html() == "Pause") {
        $("#time").stopwatch().stopwatch('stop');		
        $("#time").stopwatch().stopwatch('reset');
        $("#time").html("00:00,00");
        $("#btnStart").html("Start");
    }
    if ($("#startAll").is(':hidden')){
        $('#startText').html("Start match");
        $('#startAll').show();
    }else {
        $('#startText').html("Start match");
    }

	halftimeNumber = document.getElementById("halftime"); 
	if ($("#halftime").html() == "2."){
		$("#btnStart").html("1.");
	} 
    this.halftime = 1;
	
    return;
}

scoreTracker.prototype.newTime = function (){
	var inpMins = $('#fmins').val();
	var inpSecs = $('#fsecs').val();
	
	this.mins = inpMins;
	this.secs = inpSecs;
    $('.saved').fadeIn(200).delay(500).fadeOut(200);

	return false;
}


scoreTracker.prototype.format = function (millis){
    function pad2(number) {
        return (number < 10 ? '0' : '') + number;
    }
                                      
    var seconds, minutes;                                              
    minutes = Math.floor(millis / 60000);                              
    millis %= 60000;                                                   
    seconds = Math.floor(millis / 1000);                               
    millis = Math.floor(millis % 1000);                                
    millis = Math.floor(millis / 10);
		
    if (this.halftime == 1 && minutes >= this.mins / 2){
        if (seconds >= this.secs / 2){
			$("#time").stopwatch().stopwatch('stop');
            this.toggleHalf();
            this.halftime = 2;
            $('#startText').html("Start 2nd half");
            $('#startAll').show();			
        }				
    }else if (this.halftime == 2 && minutes >= this.mins){
        if (seconds >= this.secs){
            $("#time").stopwatch().stopwatch('stop');        
            $.idleTimer('destroy');
            this.finished = true;

            //spaghetti unbind code
            $(".element1").unbind("mouseover", fill1);
            $(".element1").unbind("mouseout", unfill1);
            $(".element2").unbind("mouseover", fill2);
            $(".element2").unbind("mouseout", unfill2);
            $(".element3").unbind("mouseover", fill3);
            $(".element3").unbind("mouseout", unfill3);
            $(".leftBckg").unbind("mouseover", fill1);
            $(".leftBckg").unbind("mouseout", unfill1);
            $(".rightBckg").unbind("mouseover", fill2);
            $(".rightBckg").unbind("mouseout", unfill2);
            $(".startBckg").unbind("mouseover", fill3);
            $(".startBckg").unbind("mouseout", unfill3);


            $(".startBckg, .leftBckg, .rightBckg").fadeIn("fast");
            $(".startBckg, .leftBckg, .rightBckg").css('opacity', '0.7');
            $(".startBckg, .leftBckg, .rightBckg").css('background', '#0042AB');
            this.showD();
        }
    }
    return [pad2(minutes), pad2(seconds)].join(':') + ',' + pad2(millis);
}

scoreTracker.prototype.showD = function () {
	$('#dialogMain').show();    
	$("#dialog").dialog({ buttons: {
        "Send results": function() { 
            var df = confirm("Are you sure to send results?");
            if(df){
                $.post(window.update_url, 
                        {action: 'finish', 
                        team1goals: $('#team1').text(),
                        team2goals: $('#team2').text(),},
                    function(data) {
                        $(this).dialog("close"); 
                        $('#dialogMain').hide();
                        window.location = window.back_url; 
                    }
                );
            }else{
                return;
            }
        }	
      }
	});
	$('#dname').html($('#name1').text());
	$('#d2name').html($('#name2').text());
	$('#dgoals').val($('#team1').text());
	$('#d2goals').val($('#team2').text());
}
