$(document).ready(function() {

    $("div.xtrc-select-message").sampleMessageLoader({
        subcontainer: $('div.subcontainer', $('div.xtrc-select-message')),
        selector: $('div.manual-selector', $('div.xtrc-select-message')),
        message: $('div.xtrc-message', $('div.xtrc-select-message')),
        spinner: $('div.spinner', $('div.xtrc-select-message')),
        recentButton: $('button.xtrc-load-recent', $('div.subcontainer', $('div.xtrc-select-message'))),
        selectorButton: $('button.xtrc-load-manual', $('div.subcontainer', $('div.xtrc-select-message')))
    });

    $("div.xtrc-message").on("click", "dt.xtrc-message-field", function() {
        var field = $(this).attr("data-field");
        var value = $(this).attr("data-value");
        var message = $("div.xtrc-message");
        var messageId = message.data("id");
        var messageIndex = message.data("index");

        $(".xtrc-select-message").remove();

        var wizard = $(".xtrc-wizard");
        $(".xtrc-wizard-field", wizard).html(field);
        $(".xtrc-wizard-example", wizard).html(htmlEscape(value));

        $("input[name=field]", wizard).val(field);
        $("input[name=example_id]", wizard).val(messageId);
        $("input[name=example_index]", wizard).val(messageIndex);
        wizard.show();
    });

    // Try regular expression against example.
    $(".xtrc-try-regex").on("click", function() {
        var button = $(this);

        button.html("<i class='fa fa-refresh fa-spin'></i> Trying...");
        $.ajax({
            url: appPrefixed('/a/tools/regex_test'),
            data: {
                "string":URI.encode($("#xtrc-example").text()),
                "regex":$("#regex_value").val()
            },
            success: function(matchResult) {
                if (matchResult.finds) {
                    if (matchResult.match != null) {
                        highlightMatchResult(matchResult);
                    } else {
                        showWarning("Regular expression does not contain any matcher group to extract.");
                    }
                } else {
                    showWarning("Regular expression did not match.");
                }
            },
            error: function() {
                showError("Could not try regular expression. Make sure that it is valid.");
            },
            complete: function() {
                button.html("Try!");
            }
        });
    });

    function trySubstring(e) {
        var button = e;

        var warningText = "We were not able to run the substring extraction. Please check index boundaries.";

        var beginIndex = $("#begin_index").val();
        var endIndex = $("#end_index").val();

        if (parseInt(beginIndex) == parseInt(endIndex)) {
            highlightMatchResult({"match": {"start":parseInt(beginIndex), "end":parseInt(endIndex)}});
            return;
        }

        button.html("<i class='fa fa-refresh fa-spin'></i> Trying...");
        $.ajax({
            url: appPrefixed('/a/tools/substring_test'),
            data: {
                "string":$("#xtrc-example").text(),
                "start":beginIndex,
                "end":endIndex
            },
            success: function(result) {
                if(result.successful) {
                    highlightMatchResult(result);
                } else {
                    showWarning(warningText);
                }
            },
            error: function() {
                showError(warningText);
            },
            complete: function() {
                button.html("Try!");
            }
        });
    }

    // Try substring against example.
    $(".xtrc-try-substring").on("click", function() {
        var beginIndex = $("#begin_index");
        var endIndex = $("#end_index");
        var maxLength = $("#xtrc-example").text().length;

        if (parseInt(beginIndex.val()) < 0) {
            beginIndex.val(0);
        }
        if (parseInt(endIndex.val()) < 0) {
            endIndex.val(0);
        }
        if (parseInt(beginIndex.val()) > parseInt(endIndex.val())) {
            beginIndex.val(endIndex.val());
        }
        if (parseInt(endIndex.val()) > maxLength) {
            endIndex.val(maxLength);
        }
        trySubstring($(this));
    });

    // Try split&index against example.
    $(".xtrc-try-splitandindex").on("click", function() {
        var button = $(this);

        var warningText = "We were not able to run the split&index extraction. Please check your parameters.";

        button.html("<i class='fa fa-refresh fa-spin'></i> Trying...");
        $.ajax({
            url: appPrefixed('/a/tools/split_and_index_test'),
            data: {
                "string":$("#xtrc-example").text(),
                "split_by":$("#split_by").val(),
                "index":$("#index").val()
            },
            success: function(result) {
                if(result.successful) {
                    highlightMatchResult(result);
                } else {
                    showWarning(warningText);
                }
            },
            error: function() {
                showError(warningText);
            },
            complete: function() {
                button.html("Try!");
            }
        });
    });

    function highlightMatchResult(result) {
        var example = $("#xtrc-example");
        var start = result.match.start;
        var end = result.match.end;

        // Set to original content first, so we can do this multiple times.
        example.html($("#xtrc-original-example").html());

        var exampleContent = $("<div/>").html(example.html()).text(); // ZOMG JS. this is how you unescape HTML entities.
        var highlightedElement = $("<span/>").addClass("xtrc-hl");

        // We ensure all parts of the example are escaped
        var textBeforeHighlight = htmlEscape(exampleContent.slice(0, start));
        var highlightedText = htmlEscape(exampleContent.slice(start, end));
        var textAfterHighlight = htmlEscape(exampleContent.slice(end));

        example.html(textBeforeHighlight);
        highlightedElement.html(highlightedText);
        example.append(highlightedElement);
        example.append(textAfterHighlight);
    }

    // Try grok against example.
    $(".xtrc-try-grok").on("click", function() {
        var button = $(this);

        var warningText = "We were not able to run the grok extraction. Please check your parameters.";

        button.html("<i class='fa fa-refresh fa-spin'></i> Trying...");
        $.ajax({
            url: appPrefixed('/a/tools/grok_test'),
            data: {
                "string":$("#xtrc-example").text(),
                "pattern":$("#grok_pattern").val()
            },
            success: function(result) {
                if(result.finds) {
                    showGrokMatches(result);
                } else {
                    showWarning(warningText);
                }
            },
            error: function() {
                showError(warningText);
            },
            complete: function() {
                button.html("Try!");
            }
        });
    });

    function showGrokMatches(result) {
        var fields = $("#grok-matches");
        
        var matchesHtml = "<dl>";
        for (var i = 0; i < result.matches.length; i++) {
            matchesHtml += "<dt>" + htmlEscape(result.matches[i].name) +"</dt>";
            matchesHtml += "<dd>" + htmlEscape(result.matches[i].value) +"</dd>";

        }
        matchesHtml += "</dl>";
        
        fields.html(matchesHtml);
    }
    
    // Add converter button.
    $("#add-converter-fields button").on("click", function() {
        var type = $("#add-converter").val();

        var converter = $(".xtrc-converter-" + type);

        converter.show();
        converter.find(':checkbox').attr("checked", "checked");
        return false;
    });

    // Only allow alphanum and underscores as target_field values. Messages in graylog2-server will just ignore others.
    $("#target_field").on("keyup", function(event){
        var str = $(this).val();
        if(str != "") {
            var regex = /^[A-Za-z0-9_]+$/;
            if (!regex.test(str)) {
                $(this).val(str.slice(0,-1));
                return false;
            }
        }
    });

    // Show extractor details.
    $(".extractor-show-details, .xtrc-exception-bubble").on("click", function() {
        var extractorId = $(this).attr("data-extractor-id");
        $(".extractor-details-" + extractorId).toggle();
    });

    function activateCheckedConditionTypeForm(input) {
        switch(input.val()) {
            case "none":
                noConditionTypeChecked();
                break;
            case "string":
                stringConditionTypeChecked();
                break;
            case "regex":
                regexConditionTypeChecked();
                break;
            default:
                console.error("Invalid condition type");
        }
    }

    function noConditionTypeChecked() {
        $("#condition-value-input").hide();
    }

    function stringConditionTypeChecked() {
        var fieldContainer = $("#condition-value-input");
        $(".try-xtrc-condition").hide();
        $("#try-xtrc-condition-result").hide();
        fieldContainer.show();
        $("input", fieldContainer).attr("placeholder", "");
        $("label", fieldContainer).html("Field must include this string:");
    }

    function regexConditionTypeChecked() {
        var div = $("#condition-value-input");
        div.show();
        $("input", div).attr("placeholder", "^\d{3,}");
        $("label", div).html("Field must match this regular expression:");
        $(".try-xtrc-condition").show();
    }

    // If we are editing an extractor, we want to show the form for the selected condition type
    var checkedConditionType = $(".extractor-form input[name='condition_type']:checked");
    if (checkedConditionType.length !== 0) {
        activateCheckedConditionTypeForm(checkedConditionType);
    }

    $(".extractor-form input[name='condition_type']").on("change", function(event) {
        activateCheckedConditionTypeForm($(event.target));
    });

    // Try regex conditions.
    $(".try-xtrc-condition").on("click", function() {
        var button = $(this);

        button.html("<i class='fa fa-refresh fa-spin'></i> Trying...");
        $.ajax({
            url: appPrefixed('/a/tools/regex_test'),
            data: {
                "string":$("#xtrc-example").text(),
                "regex":$("#condition_value").val()
            },
            success: function(matchResult) {
                var resultMsg = $("#try-xtrc-condition-result");
                resultMsg.removeClass("success-match");
                resultMsg.removeClass("fail-match");
                if(matchResult.finds) {
                    resultMsg.html("Matches! Extractor would run against this example.");
                    resultMsg.addClass("success-match");
                } else {
                    resultMsg.html("Does not match! Extractor would not run.");
                    resultMsg.addClass("fail-match");
                }

                resultMsg.show();
            },
            error: function() {
                showError("Could not try regular expression. Make sure that it is valid.");
            },
            complete: function() {
                button.html("Try!");
            }
        });
    });

    // Ordering
    $(".xtrc-list-drag").sortable({
        handle: ".xtrc-order-handle",
        axis: "y",
        opacity: 0.6,
        scroll: true,
        cursor: "move",
        tolerance: "intersect",
        containment: "parent",
        start: function(event, ui) {
            ui.item.toggleClass("xtrc-order-active");
        },
        stop: function(event, ui) {
            ui.item.toggleClass("xtrc-order-active");
        },
        update: function(event, ui) {
            var sorted = $(this).sortable("toArray");
            var inputPersistId = $(this).attr("data-input-persist-id");
            var body = {
                order: sorted
            };

            $.ajax({
                url: appPrefixed('/a/system/inputs/' + inputPersistId + '/extractors/order'),
                type: "POST",
                data: JSON.stringify(body),
                processData: false,
                contentType: 'application/json',
                success: function() {
                    showSuccess("Extractor positions updated.")
                },
                error: function() {
                    showError("Could not update extractor order. Please try again.");
                }
            });

        }
    });

    // Extractor export formatting.
    if($(".extractor-json").size() > 0) {
        var formatted = JSON.stringify(JSON.parse($(".extractor-json").val()), null, 2);
        $(".extractor-json").val(formatted);
    }

});