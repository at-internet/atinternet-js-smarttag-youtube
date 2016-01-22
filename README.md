# YouTube for AT Internet JavaScript SmartTag
This YouTube plugin allows you to measure YouTube players on your website tagged with AT Internet JavaScript SmartTag trackers from version 5.2.3.
The plugin offers helpers enabling the quick implementation of YouTube players tracking.

### Content
*	JavaScript plugin for [AT Internet Javascript SmartTag] from version 5.2.3.

### Get started
* Download our main library (smarttag.js) with this plugin (at-smarttag-youtube.js) and install it on your website.
* Check out the [documentation page] for an overview of the SmartTag functionalities and code examples.

### Foreword
First of all, you must download our JavaScript library from [Tag Composer].

Tag Composer allows you to configure your SmartTag:

* Set up your tagging perimeter/scope (site, domain used to write cookies, etc.).
* Select desired features via configurable plugins.

Once the library is set up, you can download it and insert it with this plugin into the source code of the HTML page to be tagged.

#### Standard tag

Tracker initialisation is done via the instantiation of a new ATInternet.Tracker.Tag object:

```
<!DOCTYPE html>
<html>
  <head lang="en">
    <meta charset="UTF-8">
    <title>My Page</title>
    <script type="text/javascript" src="http://www.site.com/smarttag.js"></script>
    <script type="text/javascript" src="http://www.site.com/at-smarttag-youtube.js"></script>
  </head>
  <body>
    <script type="text/javascript">            
      var tag = new ATInternet.Tracker.Tag();
      // your tag
    </script>
    ...
  </body>
</html>
```

#### Asynchronous tag

You can load our JavaScript library asynchronously. However, this requires an adaptation in your tagging.
Check out the [Asynchronous tag] for an overview of the functionality . 

```
<script type="text/javascript">
window.ATInternet = {
    onTrackerLoad:function(){
        window.tag = new window.ATInternet.Tracker.Tag();
        var _callback = function () {
            // your tag
        };
        // This code loads the plugin code to track media and call the '_callback' function after loading.
        ATInternet.Utils.loadScript({url: 'http://www.site.com/at-smarttag-youtube.js'}, _callback);
    }
};
(function(){      
    var at=document.createElement('script');
    at.type='text/javascript';   
    at.async=true;    
    at.src='http://www.site.com/smarttag.js';
    (document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')[0]||document.getElementsByTagName('script')[0].parentNode).insertBefore(at,null);   
})();
</script>
```

### Tagging

The different media present on the page are added to the Tracker, then user interaction information is sent.
In order to track data, you have to define some media properties as objects when YouTube players are ready as follows :

  - **_id :_** ID of the media ; **_mandatory_**.
  - **_mediaType :_** Content type (“video”, “audio” or “vpost” for post-roll video measurement) ; **_mandatory_**.
  - **_playerId :_** Player ID (to be added when using several players).
  - **_mediaLevel2 :_** Level 2 site in which the content is located.
  - **_mediaLabel :_** Name/label of content (use “::” if needed) or of a post-roll ad (do not use “::”) ; **_mandatory_**.
  - **_previousMedia :_** Name/label of content linked to a post-roll ad; **_mandatory when using “ypost” type_**.
  - **_refreshDuration :_** Refresh duration period (optional in seconds, but necessary for calculating detailed durations).
  - **_duration :_** Total duration of content in seconds (leave empty if L= “Live”). The duration must be inferior to 86400 ; **_mandatory when using a “clip”-type broadcast_**.
  - **_isEmbedded :_** On an external website ? (“true” or “false”)
  - **_broadcastMode :_** Broadcast (“live” or “clip”).
  - **_webdomain :_** URL in cases of external placements.

Example :

```javascript
var media = {
    'id': 'WlsnrBJk0HA',
    'mediaType': 'video',
    'playerId': 1,
    'mediaLevel2': '2',
    'mediaLabel': 'AT Internet - A Unique Digital analytics company',
    'previousMedia': '',
    'refreshDuration': 5,
    'duration': 89,
    'isEmbedded': false,
    'broadcastMode': 'clip',
    'webdomain': ''
};
```

#### Tagging with Flash YouTube player

```
<!-- 1. This code loads the main AT Internet library. -->
<script type="text/javascript" src="http://www.site.com/smarttag.js"></script>

<!-- 2. This code loads the plugin code to track media. -->
<script type="text/javascript" src="http://www.site.com/at-smarttag-youtube.js"></script>

<!-- 3. This code loads the Flash Player API code synchronously. -->
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js"></script>

<!-- 4. The <object> (and video player) will replace this <div> tag. -->
<div id="ytapiplayer1">
    You need Flash player 8+ and JavaScript enabled to view this video.
</div>
```
```javascript
// 5. Tracker initialisation
var tag = new ATInternet.Tracker.Tag();

// 6. This function creates an <object> (and YouTube player)
//    after the API code downloads.
var params = {allowScriptAccess: 'always'};
var atts = {id: 'myytplayer1'};
swfobject.embedSWF('http://www.youtube.com/v/WlsnrBJk0HA?version=3&enablejsapi=1&playerapiid=myytplayer1',
    'ytapiplayer1', '425', '356', '8', null, null, params, atts);

// 7. This function initializes Rich Media measurement
//    when players are ready.
function onYouTubePlayerReady(playerId) {
    // Get player object
    var player = tag.youTube.getFlashPlayer(playerId);
    if (player) {
        var mediaList = [];
        if (playerId === 'myytplayer1') {
            var media = {
                'id': 'WlsnrBJk0HA',
                'mediaType': 'video',
                'playerId': 1,
                'mediaLevel2': '2',
                'mediaLabel': 'AT Internet - A Unique Digital analytics company',
                'previousMedia': '',
                'refreshDuration': 5,
                'duration': 89,
                'isEmbedded': false,
                'broadcastMode': 'clip',
                'webdomain': ''
            };
            mediaList.push(media);
        }
        if (mediaList.length > 0) {
            // Add media properties to player mediaList
            player.mediaList = mediaList;
            // Call init method to launch process
            tag.youTube.init(player);
        }
    }
}
```
    
#### Tagging with iFrame YouTube player

```
<!-- 1. This code loads the main AT Internet library. -->
<script type="text/javascript" src="http://www.site.com/smarttag.js"></script>

<!-- 2. This code loads the plugin code to track media. -->
<script type="text/javascript" src="http://www.site.com/at-smarttag-youtube.js"></script>

<!-- 3. The <iframe> (and video player) will replace this <div> tag. -->
<div id="player"></div>
```
```javascript
// 4. Tracker initialisation
var tag = new ATInternet.Tracker.Tag();

// 5. This code loads the IFrame Player API code asynchronously.
var script = document.createElement('script');
script.src = 'https://www.youtube.com/iframe_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(script, firstScriptTag);

// 6. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        events: {
            'onReady': onPlayerReady
        }
    });
}

// 7. This function initializes Rich Media measurement
//    when players are ready.
function onPlayerReady(event) {
    // Get player object
    var player = event.target;
    if (player) {
        var media1 = {
            'id': 'xijt_1qlHGU',
            'mediaType': 'audio',
            'playerId': 1,
            'mediaLevel2': '2',
            'mediaLabel': 'Passez à l\'Agile Analytics - AT Internet',
            'previousMedia': '',
            'refreshDuration': 5,
            'duration': 3052,
            'isEmbedded': false,
            'broadcastMode': 'clip',
            'webdomain': ''
        };
        var media2 = {
            'id': 'WlsnrBJk0HA',
            'mediaType': 'video',
            'playerId': 1,
            'mediaLevel2': '2',
            'mediaLabel': 'AT Internet - A Unique Digital analytics company',
            'previousMedia': '',
            'refreshDuration': 5,
            'duration': 89,
            'isEmbedded': false,
            'broadcastMode': 'clip',
            'webdomain': ''
        };
        var media3 = {
            'id': '0tjRknu0RRA',
            'mediaType': 'video',
            'playerId': 1,
            'mediaLevel2': '2',
            'mediaLabel': 'Meet AT Internet\'s Analytics Suite',
            'previousMedia': '',
            'refreshDuration': 5,
            'duration': 135,
            'isEmbedded': false,
            'broadcastMode': 'clip',
            'webdomain': ''
        };
        player.loadPlaylist(['WlsnrBJk0HA', 'xijt_1qlHGU', '0tjRknu0RRA'], 0, 0, 'small');
        player.setShuffle(true);
        var mediaList = [];
        // Add media properties to player mediaList
        mediaList.push(media1, media2, media3);
        player.mediaList = mediaList;
        // Call init method to launch process
        tag.youTube.init(player);
    }
}
```

#### Tagging with asynchronous tag and iFrame YouTube player

```
<!-- 1. The <iframe> (and video player) will replace this <div> tag. -->
<div id="player"></div>
```
```javascript
// 2. Declare the ATInternet callback 
window.ATInternet = {
    onTrackerLoad: function () {
        // Tracker initialisation
        window.tag = new window.ATInternet.Tracker.Tag();
        // This function loads the IFrame Player API code asynchronously.
        var _callback = function () {
            var script = document.createElement('script');
            script.src = 'https://www.youtube.com/iframe_api';
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
        };
        // This code loads the plugin code to track media and call the '_callback' function after loading.
        ATInternet.Utils.loadScript({url: 'http://www.site.com/at-smarttag-youtube.js'}, _callback);
    }
};

// 3. This code loads the main AT Internet library.
(function () {
    var at = document.createElement('script');
    at.type = 'text/javascript';
    at.async = true;
    at.src = 'http://www.site.com/smarttag.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0] || document.getElementsByTagName('script')[0].parentNode).insertBefore(at, null);
})();

// 4. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        events: {
            'onReady': onPlayerReady
        }
    });
}

// 5. This function initializes Rich Media measurement
//    when players are ready.
function onPlayerReady(event) {
    // Get player object
    var player = event.target;
    if (player) {
        var media1 = {
            'id': 'xijt_1qlHGU',
            'mediaType': 'audio',
            'playerId': 1,
            'mediaLevel2': '2',
            'mediaLabel': 'Passez à l\'Agile Analytics - AT Internet',
            'previousMedia': '',
            'refreshDuration': 5,
            'duration': 3052,
            'isEmbedded': false,
            'broadcastMode': 'clip',
            'webdomain': ''
        };
        var media2 = {
            'id': 'WlsnrBJk0HA',
            'mediaType': 'video',
            'playerId': 1,
            'mediaLevel2': '2',
            'mediaLabel': 'AT Internet - A Unique Digital analytics company',
            'previousMedia': '',
            'refreshDuration': 5,
            'duration': 89,
            'isEmbedded': false,
            'broadcastMode': 'clip',
            'webdomain': ''
        };
        var media3 = {
            'id': '0tjRknu0RRA',
            'mediaType': 'video',
            'playerId': 1,
            'mediaLevel2': '2',
            'mediaLabel': 'Meet AT Internet\'s Analytics Suite',
            'previousMedia': '',
            'refreshDuration': 5,
            'duration': 135,
            'isEmbedded': false,
            'broadcastMode': 'clip',
            'webdomain': ''
        };
        player.loadPlaylist(['WlsnrBJk0HA', 'xijt_1qlHGU', '0tjRknu0RRA'], 0, 0, 'small');
        player.setShuffle(true);
        var mediaList = [];
        // Add media properties to player mediaList
        mediaList.push(media1, media2, media3);
        player.mediaList = mediaList;
        // Call init method to launch process
        tag.youTube.init(player);
    }
}
```

### License
MIT

[documentation page]: <http://developers.atinternet-solutions.com/javascript-en/getting-started-javascript-en/tracker-initialisation-javascript-en/>
[Tag Composer]: <https://apps.atinternet-solutions.com/TagComposer/>
[Asynchronous tag]: <http://developers.atinternet-solutions.com/javascript-en/advanced-features-javascript-en/asynchronous-tag-javascript-en/>
[AT Internet Javascript SmartTag]: <http://developers.atinternet-solutions.com/javascript-en/getting-started-javascript-en/tracker-initialisation-javascript-en/>

   
   

