/**
 * @preserve This SDK is licensed under the MIT license (MIT)
 * Copyright (c) 2015- Applied Technologies Internet SAS (registration number B 403 261 258 - Trade and Companies Register of Bordeaux – France)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * */

/**
 * Global Namespace for YouTube Flash players
 * @class
 * @name YouTube
 * @public
 * @memberOf ATInternet
 */
ATInternet.YouTube = ATInternet.YouTube || {};

/**
 * Callbacks used to manage "onStateChange" events on YouTube Flash players
 * @object
 * @name Callbacks
 * @public
 * @memberOf ATInternet.YouTube
 */
ATInternet.YouTube.Callbacks = ATInternet.YouTube.Callbacks || {};

/**
 * List of player objects added to manage Rich Media
 * @array
 * @name PlayerObjectList
 * @public
 * @memberOf ATInternet.YouTube
 */
ATInternet.YouTube.PlayerObjectList = [];

/**
 * Delete list of player objects
 * @function
 * @name deletePlayerList
 * @public
 * @memberOf ATInternet.YouTube
 */
ATInternet.YouTube.deletePlayerList = function () {
    for (var i = 0; i < ATInternet.YouTube.PlayerObjectList.length; i++) {
        delete ATInternet.YouTube.PlayerObjectList[i];
    }
    ATInternet.YouTube.PlayerObjectList = [];
};

/**
 * Plugin used to manage Rich Media measurement on YouTube players (iFrame and Flash versions)
 * @class
 * @name YouTube
 * @public
 * @memberOf ATInternet.Tracker.Plugins
 * @param parent {Tag} Instance of the Tag used
 */
ATInternet.Tracker.Plugins.YouTube = function (parent) {
    'use strict';
    var _this = this;

    /**
     * Force a stop action on media change in playlist
     * @memberOf ATInternet.Tracker.Plugins.YouTube#
     * @function
     * @name _forceStopAction
     * @param player {object} player object
     * @return {boolean}
     * @private
     */
    var _forceStopAction = function (player) {
        var stop;
        stop = !!(player.oldIndex !== player.newIndex && player.action !== null && player.action !== 'stop');
        return stop;
    };

    /**
     * Initialize player properties on state change event
     * @memberOf ATInternet.Tracker.Plugins.YouTube#
     * @function
     * @name _initPlayerProperties
     * @param player {object} player object
     * @param newState {number} new state event
     * @private
     */
    var _initPlayerProperties = function (player, newState) {
        // We get the media index with 'getPlaylistIndex' method from YouTube API
        player.oldIndex = player.newIndex;
        var playList = player.getPlaylist();
        if (playList !== null) {
            player.newIndex = player.getPlaylistIndex();
        }
        else {
            player.newIndex = 0;
        }
        player.oldState = player.newState;
        player.newState = newState;
        player.currentIndex = player.newIndex;
    };

    /**
     * Main object
     * @memberOf ATInternet.Tracker.Plugins.YouTube#
     * @object
     * @name youTube
     * @public
     */
    parent.youTube = {};

    /**
     * Get Flash player reference object
     * @memberOf ATInternet.Tracker.Plugins.YouTube#
     * @function
     * @name getFlashPlayer
     * @param playerId {string} player ID
     * @public
     */
    parent.youTube.getFlashPlayer = function (playerId) {
        var player = null;
        if (typeof document.getElementById !== 'function') {
            document.getElementById = function (id) {
                return document.all[id];
            };
        }
        var embed = document.getElementsByTagName('EMBED');
        for (var i = 0; i < embed.length; i++) {
            if (embed[i].id === playerId) {
                player = embed[i];
                break;
            }
        }
        if (!player) {
            player = document.getElementById(playerId);
        }
        return player;
    };

    /**
     * Initialize process
     * @memberOf ATInternet.Tracker.Plugins.YouTube#
     * @function
     * @name init
     * @param player {object} player object
     * @public
     */
    parent.youTube.init = function (player) {
        if (player) {
            ATInternet.YouTube.PlayerObjectList.push(new PlayerObject(player));
        }
    };

    /**
     * Create a utility object to manage Rich Media functionality
     * @memberOf ATInternet.Tracker.Plugins.YouTube#
     * @class
     * @name PlayerObject
     * @param player {object} player object
     * @private
     */
    var PlayerObject = function (player) {
        if (player.mediaList) {
            var _this = this;
            _this.player = player;
            _this.player.currentIndex = 0;
            _this.player.oldIndex = 0;
            _this.player.newIndex = 0;
            _this.player.oldState = YT.PlayerState.UNSTARTED;
            _this.player.newState = YT.PlayerState.UNSTARTED;
            _this.player.action = null;
            _this.player.currentMedia = null;
            _this.player.isBuffering = false;
            // Create Rich Media Tags in order to send hit
            _this.player.hit = function () {
                var _player = this;
                if (_player.currentMedia === null) {
                    var playList = _player.getPlaylist();
                    if (playList !== null) {
                        var mediaId = playList[_player.currentIndex];
                        for (var i = 0; i < _player.mediaList.length; i++) {
                            if (mediaId === _player.mediaList[i].id) {
                                _player.currentMedia = _player.mediaList[i];
                                break;
                            }
                        }
                    }
                    else {
                        _player.currentMedia = _player.mediaList[0];
                    }
                }
                // Rich Media Tags
                if (_player.currentMedia !== null) {
                    parent.richMedia.add(_player.currentMedia);
                    parent.richMedia.send({
                        'action': _player.action,
                        'playerId': _player.currentMedia.playerId,
                        'mediaLabel': _player.currentMedia.mediaLabel,
                        'isBuffering': _player.isBuffering
                    });
                }
                // We delete media properties on change of media index
                if (_player.oldIndex !== _player.newIndex) {
                    _player.currentMedia = null;
                }
                _player.isBuffering = false;
            };
            _this.addListeners();
        }
    };

    /**
     * Manage 'onStateChange' events
     * @memberOf ATInternet.Tracker.Plugins.YouTube#
     * @function
     * @name addListeners
     * @private
     */
    PlayerObject.prototype.addListeners = function () {
        var _this = this;
        var _fire = function (event) {
            _this.fire(event);
        };
        // For Flash players
        if (typeof _this.player.id === 'string') {
            // Callbacks must be globals, public and declared as strings
            ATInternet.YouTube.Callbacks[_this.player.id] = _fire;
            _this.player.addEventListener('onStateChange', 'ATInternet.YouTube.Callbacks.' + _this.player.id);
        }
        else { // For iFrame players
            _this.player.addEventListener('onStateChange', function (event) {
                _fire(event.data);
            });
        }
    };

    /**
     * Define Rich Media action on player state change event
     * @memberOf ATInternet.Tracker.Plugins.YouTube#
     * @function
     * @name fire
     * @param newState {number} new state event
     * @public
     */
    PlayerObject.prototype.fire = function (newState) {
        var _player = this.player;
        var _hit = false;
        _initPlayerProperties(_player, newState);
        switch (_player.oldState + '.' + _player.newState) {
            case YT.PlayerState.ENDED + '.' + YT.PlayerState.BUFFERING:
            case YT.PlayerState.PAUSED + '.' + YT.PlayerState.BUFFERING:
                _player.action = 'play';
                _player.isBuffering = true;
                _hit = true;
                break;
            case YT.PlayerState.UNSTARTED + '.' + YT.PlayerState.PLAYING:
            case YT.PlayerState.ENDED + '.' + YT.PlayerState.PLAYING:
            case YT.PlayerState.PAUSED + '.' + YT.PlayerState.PLAYING:
                _player.action = 'play';
                _hit = true;
                break;
            case YT.PlayerState.BUFFERING + '.' + YT.PlayerState.PLAYING:
                _player.action = 'info';
                _hit = true;
                break;
            case YT.PlayerState.PLAYING + '.' + YT.PlayerState.BUFFERING:
                _player.action = 'info';
                _player.isBuffering = true;
                _hit = true;
                break;
            case YT.PlayerState.PLAYING + '.' + YT.PlayerState.PAUSED:
            case YT.PlayerState.BUFFERING + '.' + YT.PlayerState.PAUSED:
                _player.action = 'pause';
                _hit = true;
                break;
            case YT.PlayerState.PLAYING + '.' + YT.PlayerState.ENDED:
            case YT.PlayerState.PAUSED + '.' + YT.PlayerState.ENDED:
            case YT.PlayerState.BUFFERING + '.' + YT.PlayerState.ENDED:
                _player.action = 'stop';
                _hit = true;
                break;
            case YT.PlayerState.UNSTARTED + '.' + YT.PlayerState.BUFFERING:
                _player.newState = YT.PlayerState.ENDED;
                break;
        }
        // There is no 'YT.PlayerState.ENDED' event triggered on media change in playlist
        // We have to manage this transition in order to force a 'stop' action for old media before measuring new one
        var _stop = _forceStopAction(_player);
        if (_stop) {
            _player.currentIndex = _player.oldIndex;
            _player.oldState = YT.PlayerState.ENDED;
            _player.newState = YT.PlayerState.ENDED;
            _player.action = 'stop';
            _player.isBuffering = false;
            _hit = true;
        }
        // We send hit
        if (_hit) {
            _player.hit();
        }
    };
    /* @if test */
    _this._initPlayerProperties = _initPlayerProperties;
    _this._forceStopAction = _forceStopAction;
    _this.PlayerObject = PlayerObject;
    /* @endif */
};
ATInternet.Tracker.addPlugin('YouTube');