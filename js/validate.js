(function($){




      // VARIABLES =============================================================================================================

      // HIDDEN ERROR MESSAGE BOXES 
      var str_ErrorClassName = 'error-input';
      var str_ErrorMsgClassName = 'error-visible';


      // HIDDEN ERROR MESSAGE BOXES 

      // Name Error
      var obj_NameError = $('<div/>', {
        'id':'name-error', 
        'class' : 'error-message', 
        html: 'Please enter your Name'
      });

      // Mail Error
      var obj_MailError = $('<div/>', {       
        'id':'mail-error', 
        'class' : 'error-message', 
        html: 'Please enter your Email Address'
      });

      // Activitie Error
      var obj_ActivitiesError = $('<div/>', { 
        'id':'activities-error', 
        'class' : 'error-message', 
        html: 'Please check a activity'
      });

      // Payment Error
      var obj_PaymentError = $('<div/>', {    
        'id':'payment-error', 
        'class' : 'error-message', 
        html: 'Please select a payment option'
      });



      // FUNCTIONS =============================================================================================================

      // Get a substring in a activity checkbox innerhtml string
      function getKeyString(str_Value, str_Divider, int_Index){
        var arr_Value = str_Value.split(str_Divider); // split at str_Divider 
        return arr_Value[int_Index].trim();
      }


      // Number.isInteger() is not supported until IE 12
      function isInt(value) {
        // Test for int
        if (Number(value) === parseInt(value, 10)) { 
          return true;
        } else {
          return false;
        }
      }


      // Validate mail value.
      function validateMail(value) {

        //Email regex from stackoverflow.com/questions/46155/validate-email-address-in-javascript
        var regex_Email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if(regex_Email.test( value )) {
          return true;
        } else {
          return false;
        }

      }


      // Validate credit card value.
      function validateCreditCard(value) {

        // Validate CC from 13 -16 charecters
        if(value.length > 12 && 17 > value.length ) {
          return true;
        } else {
          return false;
        }

      }


      // Validate zip value.
      function validateZip(value) {

        // Validate zip from 5 and check for int
        if(value.length === 5 && isInt( value ) === true ) {
          return true;
        } else {
          return false;
        }

      }


      // Validate CVV value.
      function validateCVV(value) {

        // Validate CVV from 3 and check for int
        if(value.length === 3 && isInt( value ) === true) {
          return true;
        } else {
          return false;
        }

      }


      // Toogle Error Handling
      function toggleError(obj_Field, obj_Error,  state) {
        state = typeof state !== 'undefined' ? state : false;
        var str_ErrorClassName    = 'error-input';
        var str_ErrorMsgClassName = 'error-visible';

        if(state === true) {
          $(obj_Field).addClass(str_ErrorClassName); //add class to highlight field with red border
          $(obj_Error).addClass(str_ErrorMsgClassName); //add class to fade in the error messaage
        } else {
          $(obj_Field).removeClass(str_ErrorClassName);  //reomve class to highlight field with red border
          $(obj_Error).removeClass(str_ErrorMsgClassName);  //fade out the error messaage
        }
      }

       // Toogle Error Handling
      function togglePlaceholder(obj_Field, str_Error, state = false) {

        var str_ErrorClassName    = 'error-input';

        if(state === true) {
          $(obj_Field).addClass(str_ErrorClassName);  //add class to highlight field with red border
          $(obj_Field).attr('placeholder', str_Error);  //change placeholder text
        } else {
          $(obj_Field).removeClass(str_ErrorClassName);  //reomve class to highlight field with red border
          $(obj_Field).attr('placeholder', '');  //reset placeholder text to blank
        }

      }




      // PAGE LOAD EVENT HANDLING =====================================================================================================
      
      // Get Shirt Colors
      var ary_ElementsShirtColors = $( "#color" ).children();

      // Get Activity Inputs
      var ary_ActivityItems = $( ".activities" ).find('input'); //getr activity items on load

      //Create Empty Total Fieldset
      var obj_Total = $('<fieldset/>', {'id':'total', html: '<legend>Total</legend><span id="total-value">$0</span>'}).hide();  //create total legend

      //Get Payment Options
      var ary_PaymentOptions = $( ".payment-option" ).hide(); // get and hide payment options on load


      // SET FOCUS ON FIRST ITEM
      $('#name').focus();
      
      // INSERT HIDDEN ERROR MESSAGES
      $('#name').after(obj_NameError);
      $('#mail').after(obj_MailError);
      $('.activities').find('legend').after(obj_ActivitiesError);
      $('#payment').after(obj_PaymentError);

      // SAVE & CLEAR COLOR OPTIONS FOR LATER REPOPULATION BASED ON DESIGN SELECTION
      $( "#colors-js-puns" ).hide(); // hide section becuase we are clearing options
      $( "#color" ).html(''); //clear options

      //Insert Total Section Into DOM
      $(obj_Total).insertAfter('.activities'); 



      // FIELD EVENT HANDLING  ================================================================================================


       /// NAME EVENT HANDLER
      $('#name').change(function() {
        // if valid on change then hide exsiting error borders & messages
        if($(this).val().length > 0 ) {
          toggleError($(this), obj_NameError, false); 
        }
      });


       /// MAIL EVENT HANDLER
      $('#mail').change(function() {
        // if valid on change then hide exsiting error borders & messages
        if( validateMail($(this).val()) ) {
          toggleError($(this), obj_MailError, false); 
        }
      });


      // TITLE EVENT HANDLER : ADD OTHER FIELD AFTER JOB TITLE HAS BEEN SELECTED AS OTHER
      $('#title').change(function() {
        if($('#title').val() === 'other') {
          // Add other field if the other option has been selected
          $('#title').after('<input type="text" id="other-title" name="other-title" placeholder="Your Job Role" >');
        } else {
           // Remove other field if the other option has been unselected
          $('#other-title').remove();
        }
      });


      // DESIGN EVENT HANDLER : HANDLE TSHIRT DESIGN SELECTION TO SHOW COLORS BASED ON THE DESIGN
      $('#design').change(function() {

        // Reset select box options
        $( "#color" ).html(''); 
        
        // Get select box
        const obj_DesignSelectBox = $('#design'); 

        // Get selected index
        var int_Index = obj_DesignSelectBox[0].selectedIndex;  

        // If index is greater then - IE if a theme is selected verse the defualt option
        if(int_Index > 0) {  

          var str_Value = getKeyString( obj_DesignSelectBox[0][int_Index].innerHTML , '-' , 1 );  // split design option at "-" html to get key string to compare to color options 

          // Loop options in color select box
          ary_ElementsShirtColors.each(function( index ) {

             // If the select design option string exists the current looped color option then append into the color select box
            if(this.innerHTML.indexOf(str_Value) > -1) {
              $( "#color" ).append(this); // if you are here then it is a match and append to color select box
            }

            // Show the box because there are now option aviable
            $( "#colors-js-puns" ).show();

          });

        } else {
          // Hide section becuase we have not selected a design
          $( "#colors-js-puns" ).hide();  

          // Clear color element
          $( "#color" ).html('');
        }

      });


      // ACTIVITIES EVENT HANDLER  : ACIVITY CHECKBOXES 
      $('.activities').on('change', '*', function() {

        if($(this)[0].tagName === 'INPUT') {

          var str_Name = $(this).attr('name');
          var str_Value = getKeyString( $(this).parent().text() , '—' , 1 ); // get string with out changing DOM -- Example Returns "Tuesday 9am-12pm, $100"
          var int_Price = Number(getKeyString( $(this).parent().text() , '$' , 1 ));  // get string with out changing DOM -- Example Returns "100"
          var int_PriceCurrent = $('#total-value').html().replace("$", ""); // get current price and remove dollar sign so it can be used as a int
          var int_PriceNew;

          if($(this).is(":checked")) {

            int_PriceNew = '$'+ (Number(int_PriceCurrent) + int_Price); //if checked add new price

            if ( $('#total').css('display') == 'none' ){
              $('#total').toggle();  //turn on the price if hidden
            }

            ary_ActivityItems.each(function( index ) {
              if($(this).attr('name') !== str_Name) {
                if($(this).parent().text().indexOf( str_Value ) > -1) {
                  $(this).attr("disabled", true);  //disable items at the same time
                }
              }
            });

            toggleError($(this).parent().parent().find('legend'), obj_ActivitiesError, false);

          } else {

            int_PriceNew = '$'+ (Number(int_PriceCurrent) - int_Price); //subtract price if unchecked

            ary_ActivityItems.each(function( index ) {
              $(this).attr("disabled", false);  //enable any deactive checkboxes

            });
          }
          
          $('#total-value').html(int_PriceNew); //update the price
        }
      });


       // PAYMENT EVENT HANDLER 
      $('#payment').change(function() {

        // Get payment optoon value
        var value = $(this).val(); 

        // Hide all payment otions to reset
        ary_PaymentOptions.hide(); 

         // Handle Credit Card 
        if(value == 'credit card') {
          $(ary_PaymentOptions[0]).show(); // show credit card option
          toggleError($(this), obj_PaymentError, false);
          return;
        } 

         // Handle PayPal  
        if(value == 'paypal') {
           $(ary_PaymentOptions[1]).show(); // show paypal option
           toggleError($(this), obj_PaymentError, false);
           return;
        }

        // Handle BitCoin  
        if(value == 'bitcoin') {
           $(ary_PaymentOptions[2]).show(); // show bitcoin option
           toggleError($(this), obj_PaymentError, false);
           return;
        }


      });


      // CC EVENT HANDLER 
      $('#cc-num').change(function() {
        // if valid on change then hide exsiting error borders & messages
        if( validateCreditCard( $(this).val()) === true ) {
          togglePlaceholder($(this), '', false);
        }

      });


      // ZIP EVENT HANDLER 
      $('#zip').change(function() {
        // if valid on change then hide exsiting error borders & messages
        if( validateZip($(this).val()) === true ) {
          togglePlaceholder($(this), '', false);
        }
      });


      // CVV EVENT HANDLER 
      $('#cvv').change(function() {
        // if valid on change then hide exsiting error borders & messages
        if( validateCVV( $(this).val()) === true ) {
          togglePlaceholder($(this), '', false);
        }
      });




      // SUBMIT EVENT  ================================================================================================



       // SUBMIT EVENT HANDLER 
      $( 'form' ).submit(function( event ) {
        
        // Get elements needed for validation
        var obj_Name = $('#name');
        var obj_Email = $('#mail');
        var ary_ActivitiesWrapper = $( ".activities" );
        var ary_ActivityItemsChecked = ary_ActivitiesWrapper.find('input:checked');
        var obj_Payment = $('#payment');
        var obj_CreditCard = $('#cc-num');
        var obj_Zip = $('#zip');
        var obj_CVV = $('#cvv');

        // Flag is to track errors
        var flag = 0;

        // Validate Name
        if(obj_Name.val().length === 0) {
          // Name has error incriment flag and toggle error in the interface 
          flag++;
          toggleError(obj_Name, obj_NameError, true);
        } else {
          // Name has no errors so reset any exisiting error messages
          toggleError(obj_Name, obj_NameError, false);
        }


        if( validateMail( obj_Email.val() ) === false) {
          // Mail has error incriment flag and toggle error in the interface 
          flag++; 
          toggleError(obj_Email, obj_MailError, true);
        } else {
          // Mail has no errors so reset any exisiting error messages
          toggleError(obj_Email, obj_MailError, false);
        }


        if(ary_ActivityItemsChecked.length === 0) {
          // Activities has error incriment flag and toggle error in the interface 
          flag++; 
          toggleError(ary_ActivitiesWrapper.find('legend'), obj_ActivitiesError, true);
        } else {
          // Activities has no errors so reset any exisiting error messages
          toggleError(ary_ActivitiesWrapper.find('legend'), obj_ActivitiesError, false);
        }


        if(obj_Payment.val() === 'select_method') {
          // Payment has error incriment flag and toggle error in the interface 
          toggleError(obj_Payment, obj_PaymentError, true);
        } 

        if(obj_Payment.val() === 'credit card') {
          // Payment has a selected credit card options so handle CC validation

          if( validateCreditCard( obj_CreditCard.val() ) === false ) {
            // CC Number has error incriment flag and toggle error in the interface 
            flag++;
            togglePlaceholder(obj_CreditCard, 'Please enter Credit Card', true);
          } else {
            // CC Number has no errors so reset any exisiting error messages
            togglePlaceholder(obj_CreditCard, '', false);
          }
          
          if( validateZip(obj_Zip.val()) === false ) {
            // Zip has error incriment flag and toggle error in the interface 
            flag++;
            togglePlaceholder(obj_Zip, 'Please enter Zip code', true);
          } else {
            // Zip Number has no errors so reset any exisiting error messages
            togglePlaceholder(obj_Zip, '', false);
          }
          
          if( validateCVV(obj_CVV.val()) === false ) {
            // CVV has error incriment flag and toggle error in the interface 
            flag++;
            togglePlaceholder(obj_CVV, 'Please enter CVV code', true);
          } else {
            // CVV has no errors so reset any exisiting error messages
            togglePlaceholder(obj_CVV, '', false);
          }

        }
        
        if(flag > 0) {
          // If there are flags block the submission event 
          event.preventDefault();
        }

        // If made it to here you are valid and submit

      });

    })(jQuery);