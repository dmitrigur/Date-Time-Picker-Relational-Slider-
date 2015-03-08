<h2>Date Time Picker - JQuery plug-in</h2>
The idea is inter-related wheels mechanism. Clock like.
When rolling Upper Wheel "Year", Lower Wheels "Month,Days" also rotating dependently.
This helps in positioning lower values by rolling uppers, if not exact to, but definetaly close to desired position, making time adjusting much quicker.
Espesially usefull for mobile interfaces, where date-time adjusting rollers are commonly used.

[Example](http://rawgit.com/dmitrigur/Date-Time-Picker-Relational-Slider-/master/example.html)

	<p>Date Time (Result type: 'time')<input id="a1"></p>
	<p>Date (Result type: 'date', Field is changing on Stop & and in Progress)<input id="a2"></p>
	<p>Date (Result type: 'object', Field is changing on Stop & and on Blur)
		<a>Y:<input id="a3y"></a>
		<a>M:<input id="a3m"></a>
		<a>D:<input id="a3d"></a>
	</p>    

   <script>
	$(document).ready(function() {
		$("#a1").HorecaTechDateTimePicker({
			TruncateResult:true,
			onClose:function(elm,ts,result) {
				$(elm).val(result);
				$(elm).attr("ts",ts);
			}
		})
		$("#a2").HorecaTechDateTimePicker({
			ResultMode:"date",
			TruncateResult:true,
			LevelSet:["FullYear","Month","Date"],
			FlagOnStop:true,
			FlagInProgress:true,
			onClose:function(elm,ts,result) {
				$(elm).val(result);
				$(elm).attr("ts",ts);
			}
		})
		$("#a3y,#a3m,#a3d").each(function() {
			$(this).HorecaTechDateTimePicker({
				ResultMode:"object",
				TruncateResult:true,
				LevelSet:["FullYear","Month","Date"],
				FlagOnStop:true,
				onClose:function(elm,ts,result) {
					$("#a3y").val(result.FullYear);
					$("#a3m").val(result.Month+1);
					$("#a3d").val(result.Date);
					$("#a3y,#a3m,#a3d").attr("ts",ts);
				},
				onStop:"onClose"
			})
		})
	})    
    </script>
  </head>

