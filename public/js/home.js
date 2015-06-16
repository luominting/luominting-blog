$(function(){
	$('#summernote').summernote();
	//发表文章
	$('.add-article').click(function(){
		var title = $('.title').val(),
			content = $('#summernote').code(),
			tag1 = $('.tag1').val(),
			tag2 = $('.tag2').val(),
			tag3 = $('.tag3').val();

		$.ajax({
			url:'/article/add',
			type:'POST',
			data:{
				title:title,
				content:content,
				tag1:tag1,
				tag2:tag2,
				tag3:tag3
			},
			success:function(data){
				var code = data.code,
					msg = data.msg;
				if(code == 0 || code == 1){
					sweetAlert(msg, "", "error");
				}else if(code == 2){
					sweetAlert({
						title: msg,
						type: "success",
					}, function(){
					  	location.href = '/';
					});
				}
			},
			error:function(){
				sweetAlert("发表失败，请重试！", "", "error");
			}

		});
	});
});
