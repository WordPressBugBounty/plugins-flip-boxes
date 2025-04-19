(function($){
    'use strict';
    $(function(){
      $('.cfb_wrapper').each(function(){
        var $wrapper = $(this);
        var bootstrap  = $wrapper.data('bootstrap-status');
        var fontawesome  = $wrapper.data('fontawesome-icons');
  
        // 1) If Bootstrap is disabled: collapse the grid
        if ( bootstrap !== 'enable' ) {
          $wrapper.removeClass('flex-row');
          $wrapper.find('.cfb-box-wrapper').each(function(){
            var $box = $(this);
            // replace any flex-col-md-N with flex-col-md
            $box.attr('class',
              $box.attr('class')
                  .split(/\s+/)
                  .map(function(cls){
                    return cls.match(/^flex-col-md-\d+$/)
                      ? 'flex-col-md'
                      : cls;
                  })
                  .join(' ')
            );
          });
        }
  
        // 2) If Font‑Awesome is disabled: strip out only the <i> inside .flipbox-icon
        if ( fontawesome !== 'enable' ) {
          $wrapper.find('.flipbox-icon').children('i').remove();
        }
      });
    });
})(jQuery);
  