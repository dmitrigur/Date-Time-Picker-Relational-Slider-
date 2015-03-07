<h2>Date Time Picker - JQuery plug-in</h2>
The New Idea of inter-related wheels mechanism. like Clock.
When rolling Upper Wheel "Year", Lower Wheels "Month,Days" also rotating dependently.
This helps in positiong lower values by rolling uppers, if not exact to, but definetaly close to desired position, making time adjusting much quicker.
Espesially usefull for mobile interfaces, where date-time adjusting rollers are commonly used.

[Example](http://rawgit.com/dmitrigur/Date-Time-Picker-Relational-Slider-/master/example.html)

	<p>Date Time (Result type: 'time')<input id="a1"></p>
	<p>Date (Result type: 'date')<input id="a2"></p>
	<p>Date (Result type: 'object')
		<span>Y:<input id="a3y"></span>
		<span>M:<input id="a3m"></span>
		<span>D:<input id="a3d"></span>
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
				onClose:function(elm,ts,result) {
					$("#a3y").val(result.FullYear);
					$("#a3m").val(result.Month+1);
					$("#a3d").val(result.Date);
					$("#a3y,#a3m,#a3d").attr("ts",ts);
				}
			})
		})
	})    
    </script>
    

