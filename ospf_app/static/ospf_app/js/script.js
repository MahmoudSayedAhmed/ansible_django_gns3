$("#ping_form").submit(function (event){
	event.preventDefault();
	var form = $(this),
		url = form.attr('action'),
		device_name = form.find('select[name="device-name"]').val(),
		csrfmiddlewaretoken = form.find('input[name="csrfmiddlewaretoken"]').val(),
		error_div = form.find('div[class="invalid-feedback"]'),
		success_div = form.find('div[class="valid-feedback"]');

	error_div.hide();
	success_div.hide();

	$.ajax({
		url: url,
		method: 'POST',
		headers: {
			'X-CSRFToken': csrfmiddlewaretoken
		},
		data: {
			'device_name': device_name,
		},
		success: function (data) {
			error_div.show();
			success_div.show();
			console.log(data);
		}

	})
});
