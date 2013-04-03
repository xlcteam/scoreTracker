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
            'room1' : 1,
            'room2' : 1,
            'room3' : 1,
            'ramp'  : 1,
            'hallway':1,
            'victim': 1,
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
        if ($this.scores["try"][string] > 1){
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
        $this.final_score = 0;

        for (i in $this.scores["try"]){
            $this.scores["try"][i] = 0;
            $("#Try" + $this.scores["try"][i]).html("0. <span style='font-size: 50%;'>try<span>")
        }
        for (j in $this.scores["each"]){
            $this.scores["each"][i] = 0;
            $("#Each" + this.scores["each"][i]).html('0 <span style="font-size: 50%;">x</span>');  
        }
        
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
            if ($this.scores["try"][x] == 4){
                $('#' + x).val("---");
            } else {
                $('#' + x).val($this.scores["try"][x]);
            }        
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
            if ($this.scores["try"][x] == '' ||
                    $this.scores["try"][x] == '---'){
                $this.scores["try"][x] = 4;
            }else {
                $this.scores["try"][x] = $('#' + x).val();
            }        
        }

        for (y in $this.scores["each"]){
            $this.scores["each"][y] = $('#' + y).val();
        }
        $this.scoreCount();
    }
}
