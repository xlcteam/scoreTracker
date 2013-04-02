function scoreTracker(options)
{
    $this = this;
    $this.team = 'Robot';
    $this.final_score = 0;;

    $this.finished = false;
    $this.back_url = options['back_url'];
    $this.update_url = options['update_url'];

    $this.scores = {
        'try' : {
            'room1' : 0,
            'room2' : 0,
            'room3' : 0,
            'ramp'  : 0,
            'hallway':0,
            'victim': 0,
        },
        'each' : {
            'gap' : 0,
            'obstacle': 0,
            'speed_bump': 0,
            'intersection': 0,
        }
    };

    $this.scoresheet = {
        'try' : {
            'room1' : {1 : 60, 2 : 40, 3 : 20},
            'room2' : {1 : 60, 2 : 40, 3 : 20},
            'room3' : {1 : 60, 2 : 40, 3 : 20},
            'ramp'  : {1 : 30, 2 : 20, 3 : 10},
            'hallway':{1 : 30, 2 : 20, 3 : 10},
            'victim': {1 : 60, 2 : 40, 3 : 20},      
        },
        'each' : {
            'gap' : 10,
            'obstacle': 10,
            'speed_bump': 5,
            'intersection': 10,
        }
    }
}

scoreTracker.prototype = { 
    syncPerf: function (){
    },

    addTry: function (Try, string){
        if ($this.scores["try"][string] < 3){
            $this.scores["try"][string]++;
            $(Try).html($this.scores["try"][string] + '. <span style="font-size: 50%;">try<span>');
        } else {
            $this.scores["try"][string] = 4;
            $(Try).html("-----");
        }
    },

    rmTry: function (Try, string){
        if ($this.scores["try"][string] > 0){
            $this.scores["try"][string]--;
            $(Try).html($this.scores["try"][string] + '. <span style="font-size: 50%;">try<span>');  
        } 
    },

    addEach: function (Each, string){
        $this.scores["each"][string]++;
        $(Each).html($this.scores["each"][string] + '<span style="font-size: 50%;">x</span>');              
    }, 

    rmEach: function (Each, string){
        if ($this.scores["each"][string] > 0)
            $this.scores["each"][string]--;
        $(Each).html($this.scores["each"][string] + '<span style="font-size: 50%;">x</span>');  
    },

    resetScore: function (){
        $this.score = 0;
        
    },


    // stopwatch
    toggle: function (){
        if ($("#startAll").is(':visible')){
            $('#startAll').hide();
        }  

        if ($("#btnStart").html() == "Start" || $("#btnStart").html() == "Resume"){
            $("#btnStart").html('Pause')
	        $("#time").stopwatch({formatter: $this.format, updateInterval: 50})
                        .stopwatch('start');
            return;
        } else if ($("#btnStart").html() == "Pause"){
            $("#btnStart").html("Resume");
	        $("#time").stopwatch().stopwatch('stop');
	        return;
        }
    },

    startPerf: function (){
        $this.syncPerf(); // marks the match as started
        $('#startAll').hide();
        $this.toggle();
    },

    toggleHalf: function (){
        $('#halftime').html('2.');
	    $this.toggle();
    },

    resetTime: function (){
	    if ($("#btnStart").html() == "Resume" || $("#btnStart").html() == "Pause") {
            $("#time").stopwatch().stopwatch('stop');		
            $("#time").stopwatch().stopwatch('reset');
            $("#time").html("00:00,00");
            $("#btnStart").html("Start");
        }
        if ($("#startAll").is(':hidden')){
            $('#startText').html("Start round");
            $('#startAll').show();
        }else {
            $('#startText').html("Start round");
        }

	
        return;
    },

    newTime: function (){
	    var inpMins = $('#fmins').val();
	    var inpSecs = $('#fsecs').val();
	
        $this.mins = inpMins;
        $this.secs = inpSecs;
        $('.saved').fadeIn(200).delay(500).fadeOut(200);
        
        return false;
    },


    format: function (millis){
        function pad2(number) {
            return (number < 10 ? '0' : '') + number;
        }
                                          
        var seconds, minutes;                                              
        minutes = Math.floor(millis / 60000);                              
        millis %= 60000;                                                   
        seconds = Math.floor(millis / 1000);                               
        millis = Math.floor(millis % 1000);                                
        millis = Math.floor(millis / 10);
		
        if ($this.halftime == 1 && minutes >= $this.mins / 2){
            if (seconds >= $this.secs / 2){
			    $("#time").stopwatch().stopwatch('stop');
                $this.toggleHalf();
                $this.halftime = 2;
                $('#startText').html("Start 2nd half");
                $('#startAll').show();
                $this.playWhistle();	
            }				
        }else if ($this.halftime == 2 && minutes >= $this.mins){
            if (seconds >= $this.secs){
                $("#time").stopwatch().stopwatch('stop');        
                $.idleTimer('destroy');
                $this.finished = true;

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
                $(".startBckg, .leftBckg, .rightBckg").css('background', '#000000');
                $(".startText, .goalRText, .goalLText").hide();
                $this.playWhistle();
                $this.showD();
            }
        }
        return [pad2(minutes), pad2(seconds)].join(':') + ',' + pad2(millis);
    },

    showD: function () {
	    $('#dialogMain').show();    
	    $("#dialog").dialog({ 
            buttons: {
            "Send results": function() {
                var df = confirm("Are you sure you want to save these results?");

                if (df)
                    $('#dialogForm').submit();  
                else 
                    return;

                }	
            },
            width: 550,
            height: 435
        });

        for (x in $this.scores["try"]){
            $('#' + x).val($this.scores["try"][x]);
        }

        for (y in $this.scores["each"]){
            $('#' + y).val($this.scores["each"][y]);
        }

        $this.scoreCount();
        $('#time_dialog').val($('#time').html());
    },

    scoreCount: function (){
        $this.final_score = 0;
        for (x in $this.scores["try"]){
            if ($this.scores["try"][x] > 0 && $this.scores["try"][x] < 4)
                $this.final_score += $this.scoresheet['try'][x][$this.scores["try"][x]];
        }
        for (y in $this.scores["each"]){
            $this.final_score += $this.scores["each"][y] * $this.scoresheet['each'][y];
        }

        $('#points_dialog').val($this.final_score);
    },

    recount: function () {
        for (x in $this.scores["try"]){
            $this.scores["try"][x] = $('#' + x).val();
        }

        for (y in $this.scores["each"]){
            $this.scores["each"][y] = $('#' + y).val();
        }
        $this.scoreCount();
    }
}
