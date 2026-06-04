jQuery(document).ready(function ($) {
    $('.cfb_dismiss_notice').on('click', function (event) {
        var $this = $(this);
        var wrapper = $this.parents('.cool-feedback-notice-wrapper');
        var ajaxURL = wrapper.data('ajax-url');
        var ajaxCallback = wrapper.data('ajax-callback');
        var private = wrapper.data('nonce');

        $.post(ajaxURL, { 'action': ajaxCallback, 'private': private }, function (data) {
            if ('true' === data.data.dismissed) {
                wrapper.slideUp('fast');
            }
        }, "json");

    });
});