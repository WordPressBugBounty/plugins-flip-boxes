jQuery(document).ready(function($) {
  'use strict';
  // Initialize all existing pickers
  $('.fontawesome-icon-select').iconpicker({ hideOnSelect: true });

  // Re‑initialize any pickers in newly‑added group rows
  $(document).on('cmb2_add_row', function(event, newRow) {
    // newRow is the <div> that CMB2 just added
    $(newRow).find('.fontawesome-icon-select')
             .iconpicker({ hideOnSelect: true });
  });
});
