/// <reference path="../../../declarations/jquery/jquery.d.ts" />

'use strict';

declare var $: any;
declare var jsRoutes: any;

import UserNotification = require("../../util/UserNotification");
import URLUtils = require("../../util/URLUtils");

interface Stream {
    id: string;
    title: string;
    description: string;
    creatorUser: string;
    createdAt: number;
}

var StreamsStore = {
    listStreams(): JQueryPromise<Array<Stream>> {
        var url = jsRoutes.controllers.api.StreamsApiController.listStreams().url;
        var promise = $.getJSON(url);
        promise.fail((jqXHR, textStatus, errorThrown) => {
            UserNotification.error("Loading streams failed with status: " + errorThrown,
                "Could not load streams.");
        });
        return promise;
    },
    removeOutput(streamId: string, outputId: string, callback: (jqXHR, textStatus, errorThrown) => void) {
        $.ajax({
            url: jsRoutes.controllers.api.StreamOutputsApiController.delete(streamId, outputId).url,
            type: 'DELETE',
            error: (jqXHR, textStatus, errorThrown) => {
                UserNotification.error("Removing output from stream failed with status: " + errorThrown,
                    "Could not remove output from stream");
            },
            success: callback
        });
    },
    addOutput(streamId: string, outputId: string, callback: (jqXHR, textStatus, errorThrown) => void) {
        $.ajax({
            url: jsRoutes.controllers.api.StreamOutputsApiController.delete(streamId, outputId).url,
            type: 'PUT',
            error: (jqXHR, textStatus, errorThrown) => {
                UserNotification.error("Adding output to stream failed with status: " + errorThrown,
                    "Could not add output to stream");
            },
            success: callback
        });
    }
};
export = StreamsStore;
