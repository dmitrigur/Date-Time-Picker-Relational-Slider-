$(document).ready(function() {
	$('#a1').HorecaTechDateTimePicker({
		TruncateResult:true,
		LevelSet:["FullYear","Month"],
		onClose:function(elm,ts,result) {
			null;
		}
	})
}
