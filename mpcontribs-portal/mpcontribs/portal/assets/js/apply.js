import 'jquery-form';
import 'jquery-validation';
import 'czmore';

function prepareRequest(formData, jqForm, options) {
    $('#apply-button').addClass('is-loading');
    $('#apply-response').addClass('is-hidden');
    var start = 6;
    var nrefs = parseInt(formData.splice(start, 1)[0]['value']);
    if (nrefs < 1) {
        $('#apply-response .message-body').html('Please add references.');
        $('#apply-response').removeClass('is-hidden');
        return false;
    }
    var urls = {name: 'urls', value: {}};
    for (var i = 0; i < nrefs; i++) {
        var key_url = formData.splice(start+i, 2);
        urls['value'][key_url[0]['value']] = key_url[1]['value'];
    }
    formData.push(urls);
    return true;
}

function processJson(data) { // 'data' is the json object returned from the server
    var msg = `Thank you for submitting your project application. Please check your inbox for an
    e-mail asking you to subscribe for MPContribs notifications. Once your e-mail address is
    confirmed we will notify you if/when your project has been accepted for dissemination.`
    $('#apply-response .message-body').html(msg);
    $('#apply-response').removeClass('is-danger').addClass('is-success').removeClass('is-hidden');
    $('#apply-button').removeClass('is-loading');
}

function processError(data) {
    $('#apply-response .message-body').html(data.responseText);
    $('#apply-response').removeClass('is-success').addClass('is-danger').removeClass('is-hidden');
    $('#apply-button').removeClass('is-loading');
}

$(document).ready(function () {

    $.validator.addMethod("alphanumeric", function(value, element) {
        return this.optional(element) || /^[\w_]+$/i.test(value);
    }, "Please use letters, numbers, and underscores only.");

    $('#apply-form').validate({
        rules: {
            project: {alphanumeric: true}, url_1: {url: true, required: true},
            url_2: {url: true}, url_3: {url: true}, url_4: {url: true}, url_5: {url: true}
        },
        highlight: function (element) {
            $(element).parent().children().removeClass('is-success').addClass('is-danger');
        },
        unhighlight: function (element) {
            $(element).parent().children().removeClass('is-danger').addClass('is-success');
        },
        errorElement: 'p', errorClass: 'help',
        errorPlacement: function(error, element) { element.parent().append(error); },
        submitHandler: function(form) { $(form).ajaxSubmit({
            beforeSubmit: prepareRequest, success: processJson, error: processError,
            url: window.api['host'] + 'projects/', headers: window.api['headers'],
            type: 'POST', dataType: 'json', requestFormat: 'json'
        }); }
    });

    $("#czContainer").czMore({max: 5, styleOverride: true});
    $('.btnPlus').click();
});
