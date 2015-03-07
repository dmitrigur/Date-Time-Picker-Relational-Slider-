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
	$("#a3y,#a3m,#a3d").HorecaTechDateTimePicker({
		ResultMode:"object",
		TruncateResult:true,
		LevelSet:["FullYear","Month","Date"],
		onClose:function(elm,ts,result) {
			$("#a3y").val(result.FullYear);
			$("#a3y").val(result.Month);
			$("#a3y").val(result.Date);
			$("#a3y,#a3m,#a3d").attr("ts",ts);
		}
	})
})
