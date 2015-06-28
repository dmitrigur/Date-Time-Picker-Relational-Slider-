<h2>Date Time Picker - JQuery plug-in</h2>
The idea is an inter-related wheels mechanism. Clock like. For example, when rolling upper wheel "Year", lower wheels "Month, Days" also rotating dependently. This helps in positioning lower values by rolling uppers, if not exact to, but definitely close to desired position, making time adjusting much quicker. Especially useful for mobile interfaces, where date-time adjusting rollers are commonly used.

Functionality: 

1.Dragging wheels resulting fine adjusting

2.Clicking on desired value outside the bar resulting shifting current timestamp to clicked value, lower values are intact. 

3.Clicking on bar truncating current timestamp to clicked value

4.On mousewheel event resulting shifting current timestamp by fixed interval (years: by 5; months: by 3; days: by 7; hours: by 3; minutes: by 5; seconds: by 5)

Possible callback functions:

onClose - when user clicks Done Button

onCancel - when picker blurred 

onStop - when wheels stopped rotating 

inProgress - constantly calling while wheels are rotating

parameters of callback: 

0.pointer to element; 

1.result Unix timestamp in millisecond;

2.result according to “ResultType” option value (date - date string, time - date-time string, object - separated values for FullYear, Month, Date, Hours, Minutes, Seconds)


<h2> 
[Example](http://rawgit.com/dmitrigur/Date-Time-Picker-Relational-Slider-/master/example.html)
</h2>

	<p>Date Time (Result type: 'time')<input id="a1"></p>
	<p>Date (Result type: 'date', Input is changing on Stop & in Progress)<input id="a2"></p>
	<p>Date (Result type: 'object', Inputs are changing on Stop & on Blur)
		Y:<input id="a3y">
		M:<input id="a3m">
		D:<input id="a3d">
	</p> 
	
	<script>
		$(document).ready(function() {
			$("#a1").HorecaTechDateTimePicker({
				TruncateResult:true,
				onClose:function(elm,ts,result) {
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

