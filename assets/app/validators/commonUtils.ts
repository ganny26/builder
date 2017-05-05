
declare var jQuery: any;

export class CommonUtils {

    /**
     * trim white spaces on keypress
     */ 
    static trimWhiteSpacesOnKeyPress() {
        jQuery('input[type=text],input[type=email]').keyup(function () {
            jQuery(this).val(jQuery(this).val().replace(/ +?/g, ''));
        });
    }

    /**
     * trim white spaces on blur
     */
    static trimWhiteSpacesOnBlur(){
       jQuery('input[type=text]').blur(function(){
           this.value=jQuery(this).val().trim();
       })
       jQuery('input[type=email]').keyup(function(){
           jQuery(this).val(jQuery(this).val().replace(/ +?/g, ''));
       })
    }
}