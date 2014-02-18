/**
 *
 * @param content
 * @returns {string}
 */
function getUrlFromInstagramMedia(content)
{
    var start = content.indexOf('og:video" content="', 0);
    if (start == -1)
    {
        start = content.indexOf('og:image" content="', 0);
    }
    var end = content.indexOf('"', start + 19);
    return content.substring(start + 19, end);
}

/**
 *
 * @param content
 * @returns bool
 */
function getTypeFromInstagramMedia(content)
{
    if (content.indexOf('og:video" content="', 0) === -1)
        return true;
    return false;
}

$(document).ready(function() {
    var image = chrome.extension.getURL("vigram-white.png");
    var image25 = chrome.extension.getURL("vigram-white-25.png");

    $('.photo-feed').on('mouseenter', '.photo', function() {
        $( this ).find('.VigramEffect').css('width', '25px');
    });
    $('.photo-feed').on('mouseleave', '.photo', function() {
        $( this ).find('.VigramEffect').css('width', '0');
    });

    $('.photo-feed').ready(function(){
        $('.photo-wrapper').each(function(){
            var $this = $(this);
            if(($this.hasClass('Vigram')))
                return;

            var urlToMedia = $this.find('a').first().attr('href');
            $.get(urlToMedia, function(content){
                var url = getUrlFromInstagramMedia(content);
                var is_pic = getTypeFromInstagramMedia(content);
                if (!!is_pic)
                {
                    url = url.replace("s3.amazonaws", "ak.instagram");
                    url = url.replace("_6.", "_7.");
                }
                var fName = url.split("/")[3];
                $this.addClass('Vigram');
                $this.append('<a class="VigramProfileButton" href="' + url + '" download="'+fName+'" ><img class="VigramEffect" src="'+image25+'"></a>');
            });
        });
    });

    $('.photo-feed').on('DOMNodeInserted', '.photo', function(e){
        var $elem = $(e.target);
        var $children = $elem.children().first();

        if ($elem.hasClass('Vigram') || $elem.hasClass('VigramProfileButton'))
            return;

        var urlToMedia = $elem.find('a').first().attr('href');
        $.get(urlToMedia, function(content){
            var url = getUrlFromInstagramMedia(content);
            var is_pic = getTypeFromInstagramMedia(content);
            if (!!is_pic)
            {
                url = url.replace("s3.amazonaws", "ak.instagram");
                url = url.replace("_6.", "_7.");
            }
            var fName = url.split("/")[3];
            $elem.addClass('Vigram');
            $children.append('<a class="VigramProfileButton" href="' + url + '" download="'+fName+'" ><img class="VigramEffect" src="'+image25+'"></a>');
        });
    });

    if (window.location.host === 'instagram.com' && (document.URL).indexOf('/p/') !== -1)
    {
        $.get(null, function(content){
            var url = getUrlFromInstagramMedia(content);
            var fName = url.split("/")[3];
            var is_pic = getTypeFromInstagramMedia(content);
            if (is_pic)
                var text_button = chrome.i18n.getMessage("dl_button_pic");
            else
                var text_button = chrome.i18n.getMessage("dl_button_vid");
            $('.top-bar-actions').ready(function(){
                if (!($('#VigramSingleImg').length)) {
                    var topBar = $('.top-bar-home').attr('id', '');
                    topBar.children().attr('id', '');
                    $('.top-bar-actions').first().append('<li id="VigramSingleImg"><a href="' + url + '" download="'+fName+'" ><span class="img-outset"><img src="'+image+'"></span><strong>' + text_button + '</strong></a></li>');
                    $('#VigramSingleImg').animate({
                        marginTop:'0px'
                    }, 1500);
                }
            });
        });
	}
	else if (window.location.host === 'vine.co' && (document.URL).indexOf('/v/') !== -1)
	{
		var url  = $('#post').children().attr('src');
		var splittedUrl = url.split('/')[5];
		var name = splittedUrl.substring(0, splittedUrl.indexOf('.'));

        $('.user').ready(function(){
            if (!($('#VineButton').length))
            {
                var info = $('.info');
                $('.user').append('<a id="VineButton" href="' + url + '" download="'+name+'" ><img src="'+image+'"/></a>');
                info.find('h1').remove();
                $('.user').css('padding-bottom', '230px');
            }
        });
	}
});
