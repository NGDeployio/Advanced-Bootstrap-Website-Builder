$('document').ready(function() {

    $.get("assets/components/config.json", function(response) {
        var components = response["components"];
        var i = 0;
        var j = -1;
        var load_file = function(url) {
            $.get(url, function(res) {
              
                    if (url.indexOf('attributesForm') > -1) {
                        $('.top-container').append(res);
                    }
                    else {
                        $('.elements').append(res);
                    }
                    if (j === components.length - 1) {
                        makeDraggable();
                    }
                    if (i >= components.length - 1) {

                        if (typeof (components[++j]) !== "undefined") {
                            load_file("assets/components/attributesForm/" + components[j] + ".html");
                        }
                    }
                    if (typeof (components[++i]) !== "undefined") {
                        load_file("assets/components/elements/" + components[i] + ".html");
                    }
              
            });
        };
        load_file("assets/components/elements/" + components[i] + ".html");
        function makeDraggable() {
            $(".sortable").sortable();
            $(".draggable").draggable({
                helper: 'clone',
                stop: function(e, t) {
                    if ($(this).draggable('widget').attr('id') === 'grid') {
                        var grid = gridSystemGenerator($($(this).draggable('widget').children()[1]));
                        if (grid) {
                            grid.appendTo($('.sortable').not('.column'));
                            $('.sortable').delegate('#close-grid', 'click', function(){
                                $(this).next().remove();
                                $(this).remove();
                            });
                        }
                    }
                    else if ($('#html-container').children().length>0){
                        var dragged_clone = $(this).draggable('widget').clone();
                        dragged_clone.popover({
                            html: true,
                            content: function() {
                                return $("#popover-" + $(this).attr('id')).html();
                            }
                        });
                        $('.sortable.column').on('mouseover', function(event) {
                            if (dragged_clone) {
                                dragged_clone.appendTo($(this));
                            }
                            dragged_clone = null;
                        });
                        $('.sortable.column').delegate('button#saveattr', 'click', function(e) {
                            e.preventDefault();
                            var field = $($(this).parents().find('.arrow')[0]).parent().prev();
                            var field_label = $(this).closest('form').find('#label').val();
                            var field_css = $(this).closest('form').find('#inputsize').val();
                            var field_placeholder = $(this).closest('form').find('#placeholder').val();
                            var field_id = $(this).closest('form').find('#id').val();
                            var field_style = $(this).closest('form').find('#field-style').val();
                            $(field.children()[1]).attr('id', field_id).attr('class', field_css).attr('placeholder', field_placeholder);
                            $('.draggable').popover('hide');
                            $(field.children()[0]).text(field_label);
                            field.children().each(function(){
                                $(this).attr('style',field_style);
                            });
                        });
                        $('.sortable.column').delegate('button#cancel', 'click', function(e) {
                            e.preventDefault();
                            $('.draggable').popover('hide');
                        });
                        $('.sortable.column').delegate('button#remove', 'click', function(e) {
                            e.preventDefault();
                            //$('.draggable').popover('hide');
                            var field = $($(this).parents().find('.arrow')[0]).parent().prev();
                            field.remove();
                             $(this).closest('.popover').hide();
                             e.stopPropagation();
                             e.stopImmediatePropagation();
                        });
                    }
                    else{
                        alert('Elements can only be dragged on grids, Please drag a grid first !');
                    }

                }
            });
            function gridSystemGenerator(details) {
                var e = 0;
                var t = '<div class="container"><a id="close-grid" class="remove label label-important"><i class="icon-remove icon-white"></i>Remove</a><div class="row-fluid clearfix">';
                var n = details.val().split(" ", 12);
                $.each(n, function(n, r) {
                    if (!isNaN(parseInt(r))) {
                        e = e + parseInt(r);
                        t += '<div class="span' + r + ' column sortable"></div>';
                    }
                });
                t += '</div></div>';
                if (e == 12) {
                    return $(t);
                }
                else
                {
                    alert("Total grid column size must be equal to 12");
                    return false;
                }

            }
        }
    });
    $('#download-html').click(function() {
        var blob = new Blob([$('#html-container').html()], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "output.html");
    });

});
