/* global userPreferences */

'use strict';

var $ = require('jquery'); // excluded and shimed

$(document).ready(() => {
    // must come first because it registers a global (ahem) singleton.
    require('./stores/metrics/mount');

    require('./components/users/mount');
    require('./components/source-tagging/mount');
    require('./components/start-page/mount');
    require('./components/sources/mount');
    require('./components/dashboard/mount');
    require('./components/extractors/mount');
    require('./components/grok-patterns/mount');
    require('./components/widgets/mount');
    require('./components/throughput/mount');
    require('./components/streams/mount');
    require('./components/node/mount');
    require('./components/navigation/mount');
    require('./components/inputs/mount');
    require('./components/outputs/mount');
    require('./components/alarmcallbacks/mount');
    require('./components/agents/mount');
    if (userPreferences.enableSmartSearch) {
        require('./components/search/mount');
    }
});
