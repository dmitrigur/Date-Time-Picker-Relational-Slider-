<h2>Date Time Picker</h2>
The New Idea of inter-related wheels mechanism. as Clock.
When rolling Upper Wheel "Year", Lower Wheels "Month,Days" also rotating dependently.
This helps in positiong lowers values by rolling uppers, if not to exact, but definetaly close to. espesially for mobile apps, making time adjusting much quicker.

[Example](http://rawgit.com/dmitrigur/Date-Time-Picker-Relational-Slider-/master/example.html)

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="shortcut icon" href="favicon.ico">
    <link href="http://rawgit.com/dmitrigur/Date-Time-Picker-Relational-Slider-/master/datetimepicker.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    <script src="http://rawgit.com/dmitrigur/Date-Time-Picker-Relational-Slider-/master/datetimepicker.js"></script>
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
  </head>
  <body style="font-family: arial">
	<p>Date Time (Result type: 'time')<input id="a1"></p>
	<p>Date (Result type: 'date')<input id="a2"></p>
	<p>Date(Result type: 'object')
		<span>Y:<input id="a3y"></span>
		<span>M:<input id="a3m"></span>
		<span>D:<input id="a3d"></span>
	</p>
 </body>
</html>
