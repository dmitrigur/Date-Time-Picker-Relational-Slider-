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
	$("#a3").HorecaTechDateTimePicker({
		ResultMode:"object",
		TruncateResult:true,
		LevelSet:["FullYear","Month"],
		onClose:function(elm,ts,result) {
			$(elm).val(result.FullYear+" / "+result.Month);
			$(elm).attr("ts",ts);
		}
	})
})
