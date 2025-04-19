(function($){
    $(function(){
      // if we got a postId from PHP, target that wrapper
      var id = (window.cfbPreviewData && cfbPreviewData.postId) ? cfbPreviewData.postId : '';
      var selector = id
        ? '#flipbox-widget-' + id + ' i'
        : '.cfb_wrapper i';
  
      // remove all <i> tags inside the Flip‑Boxes container
      $( selector ).remove();
    });
})(jQuery);
  