$(document).ready(function() {
	$(this).HorecaTechDateTimePicker({
		ResultMode:"object",
		TruncateResult:true,
		LevelSet:["FullYear","Month"],
		onClose:function(elm,ts,result) {
			sort=$(elm).attr("sort"),
			record=$(elm).attr("record");
			$("[param='Ybeg'][sort='"+sort+"'][record='"+record+"']").val(result.FullYear);
			$("[param='Mbeg'][sort='"+sort+"'][record='"+record+"']").val(result.Month+1);
			$("[param='Ybeg'][sort='"+sort+"'][record='"+record+"'],[param='Mbeg'][sort='"+sort+"'][record='"+record+"']").attr("ts",ts);
			$("[param='Ybeg'][sort='"+sort+"'][record='"+record+"'],[param='Mbeg'][sort='"+sort+"'][record='"+record+"']").trigger("change");
		}
	})
}
