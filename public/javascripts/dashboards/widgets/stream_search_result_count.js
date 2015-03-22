function configureDialog_stream_search_result_count(callback, element) {
    configureDialog_search_result_count(callback, element);
}

function addWidget_stream_search_result_count(dashboardId, config, eventElem) {
    var params = originalUniversalSearchSettings();
    params.widgetType = "STREAM_SEARCH_RESULT_COUNT";
    params.streamId =  eventElem.data("stream-id");

    copyInto(config, params);
    addWidget(dashboardId, undefined, params);
}

function updateWidget_stream_search_result_count(widget, data) {
    updateWidget_search_result_count(widget, data);
}