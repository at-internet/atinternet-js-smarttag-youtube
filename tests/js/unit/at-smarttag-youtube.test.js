describe('[plugin] players YouTube :', function () {
    'use strict';
    var tag, plugin;
    var YouTube = ATInternet.Tracker.Plugins.YouTube;
    var media = {
        'id': 'mGalEx6ufUw',
        'mediaType': 'video',
        'playerId': 1,
        'mediaLevel2': '2',
        'mediaLabel': 'Andrea',
        'previousMedia': '',
        'refreshDuration': 5,
        'duration': 73,
        'isEmbedded': true,
        'broadcastMode': 'clip',
        'webdomain': ''
    };
    beforeEach(function () {
        tag = new Tag();
        plugin = new YouTube(tag);
    });
    describe('Namespaces, objects, methods and properties : ', function () {
        it('Should create a YouTube namespace on ATInternet', function () {
            expect(ATInternet.YouTube).to.exist;
        });
        it('Should create a Callbacks object on YouTube namespace', function () {
            expect(ATInternet.YouTube.Callbacks).to.exist;
        });
        it('Should create a PlayerObjectList array on YouTube namespace', function () {
            expect(ATInternet.YouTube.PlayerObjectList).to.exist;
        });
        it('Should contain a function "deletePlayerList"', function () {
            expect(ATInternet.YouTube).to.have.property('deletePlayerList')
                .that.is.a('function');
        });
        it('Should contain a main youTube object', function () {
            expect(tag.youTube).to.be.an('object');
        });
        it('Should contain a function "getFlashPlayer"', function () {
            expect(tag.youTube).to.have.property('getFlashPlayer')
                .that.is.a('function');
        });
        it('Should contain a function "init"', function () {
            expect(tag.youTube).to.have.property('init')
                .that.is.a('function');
        });
        it('Should contain a function "PlayerObject"', function () {
            expect(plugin).to.have.property('PlayerObject')
                .that.is.a('function');
        });
        it('Should contain a prototype function "addListeners"', function () {
            expect(plugin.PlayerObject.prototype).to.have.property('addListeners')
                .that.is.a('function');
        });
        it('Should contain a prototype function "fire"', function () {
            expect(plugin.PlayerObject.prototype).to.have.property('fire')
                .that.is.a('function');
        });
        it('Should contain a function "_initPlayerProperties"', function () {
            expect(plugin).to.have.property('_initPlayerProperties')
                .that.is.a('function');
        });
        it('Should contain a function "_forceStopAction"', function () {
            expect(plugin).to.have.property('_forceStopAction')
                .that.is.a('function');
        });
    });
    describe('Execution :', function () {
        describe('getFlashPlayer :', function () {
            it('Should get a null object by default', function () {
                expect(tag.youTube.getFlashPlayer()).to.equal(null);
            });
            it('Should get a reference of existing object', function () {
                var obj = document.createElement('object');
                obj.id = 'playerId';
                document.body.appendChild(obj);
                expect(tag.youTube.getFlashPlayer('playerId')).to.not.equal(null);
                document.body.removeChild(obj);
            });
            it('Should get a reference of existing embedded object', function () {
                var emb = document.createElement('embed');
                emb.id = 'playerId';
                document.body.appendChild(emb);
                expect(tag.youTube.getFlashPlayer('playerId')).to.not.equal(null);
                document.body.removeChild(emb);
            });
            it('Should not get a reference of existing embedded object with bad ID', function () {
                var emb = document.createElement('embed');
                emb.id = 'playerId';
                document.body.appendChild(emb);
                expect(tag.youTube.getFlashPlayer('playerBadId')).to.equal(null);
                document.body.removeChild(emb);
            });
            it('Should get a reference of existing object even if getElementById method is undefined', function () {
                var obj = document.createElement('object');
                obj.id = 'playerId';
                document.body.appendChild(obj);
                document.getElementById = undefined;
                expect(tag.youTube.getFlashPlayer('playerId')).to.not.equal(null);
                document.body.removeChild(obj);
            });
        });
        describe('init :', function () {
            it('Should not add a null object in the player list', function () {
                ATInternet.YouTube.deletePlayerList();
                tag.youTube.init(null);
                expect(ATInternet.YouTube.PlayerObjectList).to.be.empty;
            });
            it('Should add an empty object in the player list', function () {
                ATInternet.YouTube.deletePlayerList();
                tag.youTube.init({});
                expect(ATInternet.YouTube.PlayerObjectList).to.have.length(1);
            });
        });
        it('Should add media properties if player Flash object (with id property) with mediaList is added', function () {
            ATInternet.YouTube.deletePlayerList();
            tag.youTube.init({
                mediaList: [],
                id: 'playerId',
                // Simulate YouTube API
                addEventListener: function () {
                    ATInternet.YouTube.Callbacks.playerId(YT.PlayerState.UNSTARTED);
                },
                // Simulate YouTube API
                getPlaylist: function () {
                    return null;
                }
                ,
                getPlaylistIndex: function () {
                    return 0;
                }
            });
            expect(ATInternet.YouTube.PlayerObjectList[0]).to.have.deep.property('player')
                .that.is.an('object');
            expect(ATInternet.YouTube.PlayerObjectList[0].player).to.have.deep.property('mediaList')
                .that.is.an('array')
                .that.is.empty;
            expect(ATInternet.YouTube.PlayerObjectList[0].player).to.have.deep.property('currentIndex', 0);
            expect(ATInternet.YouTube.PlayerObjectList[0].player).to.have.deep.property('oldIndex', 0);
            expect(ATInternet.YouTube.PlayerObjectList[0].player).to.have.deep.property('newIndex', 0);
            expect(ATInternet.YouTube.PlayerObjectList[0].player).to.have.deep.property('oldState', YT.PlayerState.UNSTARTED);
            expect(ATInternet.YouTube.PlayerObjectList[0].player).to.have.deep.property('newState', YT.PlayerState.UNSTARTED);
            expect(ATInternet.YouTube.PlayerObjectList[0].player).to.have.deep.property('action', null);
            expect(ATInternet.YouTube.PlayerObjectList[0].player).to.have.deep.property('currentMedia', null);
            expect(ATInternet.YouTube.PlayerObjectList[0].player).to.have.deep.property('isBuffering', false);
            expect(ATInternet.YouTube.PlayerObjectList[0].player).to.have.deep.property('hit')
                .that.is.a('function');
            expect(ATInternet.YouTube.PlayerObjectList[0]).to.have.deep.property('addListeners')
                .that.is.a('function');
        });
        it('Should add media properties if player iFrame object with mediaList is added', function () {
            ATInternet.YouTube.deletePlayerList();
            tag.youTube.init({
                mediaList: [],
                // Simulate YouTube API
                addEventListener: function (event, callback) {
                    callback({data: YT.PlayerState.UNSTARTED});
                },
                // Simulate YouTube API
                getPlaylist: function () {
                    return null;
                },
                getPlaylistIndex: function () {
                    return 0;
                }
            });
            expect(ATInternet.YouTube.PlayerObjectList[0]).to.have.deep.property('player')
                .that.is.an('object');
            expect(ATInternet.YouTube.PlayerObjectList[0].player).to.have.deep.property('mediaList')
                .that.is.an('array')
                .that.is.empty;
            expect(ATInternet.YouTube.PlayerObjectList[0].player).to.have.deep.property('currentIndex', 0);
            expect(ATInternet.YouTube.PlayerObjectList[0].player).to.have.deep.property('oldIndex', 0);
            expect(ATInternet.YouTube.PlayerObjectList[0].player).to.have.deep.property('newIndex', 0);
            expect(ATInternet.YouTube.PlayerObjectList[0].player).to.have.deep.property('oldState', YT.PlayerState.UNSTARTED);
            expect(ATInternet.YouTube.PlayerObjectList[0].player).to.have.deep.property('newState', YT.PlayerState.UNSTARTED);
            expect(ATInternet.YouTube.PlayerObjectList[0].player).to.have.deep.property('action', null);
            expect(ATInternet.YouTube.PlayerObjectList[0].player).to.have.deep.property('currentMedia', null);
            expect(ATInternet.YouTube.PlayerObjectList[0].player).to.have.deep.property('isBuffering', false);
            expect(ATInternet.YouTube.PlayerObjectList[0].player).to.have.deep.property('hit')
                .that.is.a('function');
            expect(ATInternet.YouTube.PlayerObjectList[0]).to.have.deep.property('addListeners')
                .that.is.a('function');
        });
        it('Should force newState to YT.PlayerState.ENDED value when changing from YT.PlayerState.UNSTARTED to YT.PlayerState.BUFFERING states:', function () {
            ATInternet.YouTube.deletePlayerList();
            tag.youTube.init({
                mediaList: [],
                // Simulate YouTube API
                addEventListener: function (event, callback) {
                    callback({data: YT.PlayerState.UNSTARTED});
                },
                // Simulate YouTube API
                getPlaylist: function () {
                    return null;
                },
                getPlaylistIndex: function () {
                    return 0;
                }
            });
            // Change player state in order to update new state
            // case YT.PlayerState.UNSTARTED + '.' + YT.PlayerState.BUFFERING:
            ATInternet.YouTube.PlayerObjectList[0].fire(YT.PlayerState.BUFFERING);
            expect(ATInternet.YouTube.PlayerObjectList[0].player).to.have.deep.property('newState', YT.PlayerState.ENDED);
        });
        describe('Should execute addListeners, fire and hit methods with a valid player object :', function () {
            it('Should send a "play" action with buffering', function () {
                ATInternet.YouTube.deletePlayerList();
                tag.youTube.init({
                    mediaList: [media],
                    addEventListener: function (event, callback) {
                        callback({data: YT.PlayerState.UNSTARTED});
                    },
                    getPlaylist: function () {
                        return null;
                    },
                    getPlaylistIndex: function () {
                        return 0;
                    }
                });
                // Change player state in order to send a 'play' action with buffering
                // case YT.PlayerState.ENDED + '.' + YT.PlayerState.BUFFERING:
                ATInternet.YouTube.PlayerObjectList[0].fire(YT.PlayerState.ENDED);
                ATInternet.YouTube.PlayerObjectList[0].fire(YT.PlayerState.BUFFERING);
                expect(ATInternet.YouTube.PlayerObjectList[0].player).to.have.deep.property('action', 'play');
                expect(tag.addObject).to.deep.equal(media);
                expect(tag.sendObject).to.deep.equal({
                    'action': 'play',
                    'playerId': 1,
                    'mediaLabel': 'Andrea',
                    'isBuffering': true
                });
                // case YT.PlayerState.PAUSED + '.' + YT.PlayerState.BUFFERING:
                ATInternet.YouTube.PlayerObjectList[0].fire(YT.PlayerState.PAUSED);
                ATInternet.YouTube.PlayerObjectList[0].fire(YT.PlayerState.BUFFERING);
                expect(ATInternet.YouTube.PlayerObjectList[0].player).to.have.deep.property('action', 'play');
                expect(tag.addObject).to.deep.equal(media);
                expect(tag.sendObject).to.deep.equal({
                    'action': 'play',
                    'playerId': 1,
                    'mediaLabel': 'Andrea',
                    'isBuffering': true
                });
            });
            it('Should send a "play" action', function () {
                ATInternet.YouTube.deletePlayerList();
                tag.youTube.init({
                    mediaList: [media],
                    addEventListener: function (event, callback) {
                        callback({data: YT.PlayerState.UNSTARTED});
                    },
                    getPlaylist: function () {
                        return null;
                    },
                    getPlaylistIndex: function () {
                        return 0;
                    }
                });
                // Change player state in order to send a 'play' action
                // case YT.PlayerState.UNSTARTED + '.' + YT.PlayerState.PLAYING:
                ATInternet.YouTube.PlayerObjectList[0].fire(YT.PlayerState.UNSTARTED);
                ATInternet.YouTube.PlayerObjectList[0].fire(YT.PlayerState.PLAYING);
                expect(ATInternet.YouTube.PlayerObjectList[0].player).to.have.deep.property('action', 'play');
                expect(tag.addObject).to.deep.equal(media);
                expect(tag.sendObject).to.deep.equal({
                    'action': 'play',
                    'playerId': 1,
                    'mediaLabel': 'Andrea',
                    'isBuffering': false
                });
                // case YT.PlayerState.ENDED + '.' + YT.PlayerState.PLAYING:
                ATInternet.YouTube.PlayerObjectList[0].fire(YT.PlayerState.ENDED);
                ATInternet.YouTube.PlayerObjectList[0].fire(YT.PlayerState.PLAYING);
                expect(ATInternet.YouTube.PlayerObjectList[0].player).to.have.deep.property('action', 'play');
                expect(tag.addObject).to.deep.equal(media);
                expect(tag.sendObject).to.deep.equal({
                    'action': 'play',
                    'playerId': 1,
                    'mediaLabel': 'Andrea',
                    'isBuffering': false
                });
                // case YT.PlayerState.PAUSED + '.' + YT.PlayerState.PLAYING:
                ATInternet.YouTube.PlayerObjectList[0].fire(YT.PlayerState.PAUSED);
                ATInternet.YouTube.PlayerObjectList[0].fire(YT.PlayerState.PLAYING);
                expect(ATInternet.YouTube.PlayerObjectList[0].player).to.have.deep.property('action', 'play');
                expect(tag.addObject).to.deep.equal(media);
                expect(tag.sendObject).to.deep.equal({
                    'action': 'play',
                    'playerId': 1,
                    'mediaLabel': 'Andrea',
                    'isBuffering': false
                });
            });
            it('Should send an "info" action', function () {
                ATInternet.YouTube.deletePlayerList();
                tag.youTube.init({
                    mediaList: [media],
                    addEventListener: function (event, callback) {
                        callback({data: YT.PlayerState.ENDED});
                    },
                    getPlaylist: function () {
                        return null;
                    },
                    getPlaylistIndex: function () {
                        return 0;
                    }
                });
                // Change player state in order to send an 'info' action
                // case YT.PlayerState.BUFFERING + '.' + YT.PlayerState.PLAYING:
                ATInternet.YouTube.PlayerObjectList[0].fire(YT.PlayerState.BUFFERING);
                ATInternet.YouTube.PlayerObjectList[0].fire(YT.PlayerState.PLAYING);
                expect(ATInternet.YouTube.PlayerObjectList[0].player).to.have.deep.property('action', 'info');
                expect(tag.addObject).to.deep.equal(media);
                expect(tag.sendObject).to.deep.equal({
                    'action': 'info',
                    'playerId': 1,
                    'mediaLabel': 'Andrea',
                    'isBuffering': false
                });
            });
            it('Should send an "info" action with buffering', function () {
                ATInternet.YouTube.deletePlayerList();
                tag.youTube.init({
                    mediaList: [media],
                    addEventListener: function (event, callback) {
                        callback({data: YT.PlayerState.UNSTARTED});
                    },
                    getPlaylist: function () {
                        return null;
                    },
                    getPlaylistIndex: function () {
                        return 0;
                    }
                });
                // Change player state in order to send an 'info' action with buffering
                // case YT.PlayerState.PLAYING + '.' + YT.PlayerState.BUFFERING:
                ATInternet.YouTube.PlayerObjectList[0].fire(YT.PlayerState.PLAYING);
                ATInternet.YouTube.PlayerObjectList[0].fire(YT.PlayerState.BUFFERING);
                expect(ATInternet.YouTube.PlayerObjectList[0].player).to.have.deep.property('action', 'info');
                expect(tag.addObject).to.deep.equal(media);
                expect(tag.sendObject).to.deep.equal({
                    'action': 'info',
                    'playerId': 1,
                    'mediaLabel': 'Andrea',
                    'isBuffering': true
                });
            });
            it('Should send a "pause" action', function () {
                ATInternet.YouTube.deletePlayerList();
                tag.youTube.init({
                    mediaList: [media],
                    addEventListener: function (event, callback) {
                        callback({data: YT.PlayerState.UNSTARTED});
                    },
                    getPlaylist: function () {
                        return null;
                    },
                    getPlaylistIndex: function () {
                        return 0;
                    }
                });
                // Change player state in order to send a 'pause' action
                // case YT.PlayerState.PLAYING + '.' + YT.PlayerState.PAUSED:
                ATInternet.YouTube.PlayerObjectList[0].fire(YT.PlayerState.PLAYING);
                ATInternet.YouTube.PlayerObjectList[0].fire(YT.PlayerState.PAUSED);
                expect(ATInternet.YouTube.PlayerObjectList[0].player).to.have.deep.property('action', 'pause');
                expect(tag.addObject).to.deep.equal(media);
                expect(tag.sendObject).to.deep.equal({
                    'action': 'pause',
                    'playerId': 1,
                    'mediaLabel': 'Andrea',
                    'isBuffering': false
                });
                // case YT.PlayerState.BUFFERING + '.' + YT.PlayerState.PAUSED:
                ATInternet.YouTube.PlayerObjectList[0].fire(YT.PlayerState.BUFFERING);
                ATInternet.YouTube.PlayerObjectList[0].fire(YT.PlayerState.PAUSED);
                expect(ATInternet.YouTube.PlayerObjectList[0].player).to.have.deep.property('action', 'pause');
                expect(tag.addObject).to.deep.equal(media);
                expect(tag.sendObject).to.deep.equal({
                    'action': 'pause',
                    'playerId': 1,
                    'mediaLabel': 'Andrea',
                    'isBuffering': false
                });
            });
            it('Should send a "stop" action', function () {
                ATInternet.YouTube.deletePlayerList();
                tag.youTube.init({
                    mediaList: [media],
                    addEventListener: function (event, callback) {
                        callback({data: YT.PlayerState.UNSTARTED});
                    },
                    getPlaylist: function () {
                        return null;
                    },
                    getPlaylistIndex: function () {
                        return 0;
                    }
                });
                // Change player state in order to send an 'info' action
                // case YT.PlayerState.PLAYING + '.' + YT.PlayerState.ENDED:
                ATInternet.YouTube.PlayerObjectList[0].fire(YT.PlayerState.PLAYING);
                ATInternet.YouTube.PlayerObjectList[0].fire(YT.PlayerState.ENDED);
                expect(ATInternet.YouTube.PlayerObjectList[0].player).to.have.deep.property('action', 'stop');
                expect(tag.addObject).to.deep.equal(media);
                expect(tag.sendObject).to.deep.equal({
                    'action': 'stop',
                    'playerId': 1,
                    'mediaLabel': 'Andrea',
                    'isBuffering': false
                });
                // case YT.PlayerState.PAUSED + '.' + YT.PlayerState.ENDED:
                ATInternet.YouTube.PlayerObjectList[0].fire(YT.PlayerState.PAUSED);
                ATInternet.YouTube.PlayerObjectList[0].fire(YT.PlayerState.ENDED);
                expect(ATInternet.YouTube.PlayerObjectList[0].player).to.have.deep.property('action', 'stop');
                expect(tag.addObject).to.deep.equal(media);
                expect(tag.sendObject).to.deep.equal({
                    'action': 'stop',
                    'playerId': 1,
                    'mediaLabel': 'Andrea',
                    'isBuffering': false
                });
                // case YT.PlayerState.BUFFERING + '.' + YT.PlayerState.ENDED:
                ATInternet.YouTube.PlayerObjectList[0].fire(YT.PlayerState.BUFFERING);
                ATInternet.YouTube.PlayerObjectList[0].fire(YT.PlayerState.ENDED);
                expect(ATInternet.YouTube.PlayerObjectList[0].player).to.have.deep.property('action', 'stop');
                expect(tag.addObject).to.deep.equal(media);
                expect(tag.sendObject).to.deep.equal({
                    'action': 'stop',
                    'playerId': 1,
                    'mediaLabel': 'Andrea',
                    'isBuffering': false
                });
            });
            it('Should force a "stop" action on change of media index', function () {
                ATInternet.YouTube.deletePlayerList();
                var media2 = {
                    'id': 'WlsnrBJk0HA',
                    'mediaType': 'video',
                    'playerId': 6,
                    'mediaLevel2': '2',
                    'mediaLabel': 'AT Internet - A Unique Digital analytics company',
                    'previousMedia': '',
                    'refreshDuration': 5,
                    'duration': 89,
                    'isEmbedded': false,
                    'broadcastMode': 'clip',
                    'webdomain': ''
                };
                tag.youTube.init({
                    mediaList: [media, media2],
                    addEventListener: function (event, callback) {
                        callback({data: YT.PlayerState.UNSTARTED});
                    },
                    getPlaylist: function () {
                        return [media.id, media2.id];
                    },
                    getPlaylistIndex: function () {
                        return 0;
                    }
                });
                // Change player state in order to send a 'play' action
                // case YT.PlayerState.UNSTARTED + '.' + YT.PlayerState.PLAYING:
                ATInternet.YouTube.PlayerObjectList[0].fire(YT.PlayerState.UNSTARTED);
                ATInternet.YouTube.PlayerObjectList[0].fire(YT.PlayerState.PLAYING);
                expect(ATInternet.YouTube.PlayerObjectList[0].player).to.have.deep.property('action', 'play');
                // Change media index in order to force a 'stop' action on old media
                ATInternet.YouTube.PlayerObjectList[0].player.getPlaylistIndex = function () {
                    return 1;
                };
                // Force a 'pause' action
                ATInternet.YouTube.PlayerObjectList[0].fire(YT.PlayerState.PAUSED);
                // Get 'stop' action instead of 'pause' action
                expect(ATInternet.YouTube.PlayerObjectList[0].player).to.have.deep.property('action', 'stop');
                expect(tag.addObject).to.deep.equal(media);
                expect(tag.sendObject).to.deep.equal({
                    'action': 'stop',
                    'playerId': 1,
                    'mediaLabel': 'Andrea',
                    'isBuffering': false
                });
            });
            it('Should not send a "stop" action if media ID does not exist', function () {
                ATInternet.YouTube.deletePlayerList();
                var media2 = {
                    'id': 'WlsnrBJk0HA',
                    'mediaType': 'video',
                    'playerId': 6,
                    'mediaLevel2': '2',
                    'mediaLabel': 'AT Internet - A Unique Digital analytics company',
                    'previousMedia': '',
                    'refreshDuration': 5,
                    'duration': 89,
                    'isEmbedded': false,
                    'broadcastMode': 'clip',
                    'webdomain': ''
                };
                tag.youTube.init({
                    mediaList: [media, media2],
                    addEventListener: function (event, callback) {
                        callback({data: YT.PlayerState.UNSTARTED});
                    },
                    getPlaylist: function () {
                        return ['badID', media2.id];
                    },
                    getPlaylistIndex: function () {
                        return 0;
                    }
                });
                // Change player state in order to send a 'play' action
                // case YT.PlayerState.UNSTARTED + '.' + YT.PlayerState.PLAYING:
                ATInternet.YouTube.PlayerObjectList[0].fire(YT.PlayerState.UNSTARTED);
                ATInternet.YouTube.PlayerObjectList[0].fire(YT.PlayerState.PLAYING);
                expect(ATInternet.YouTube.PlayerObjectList[0].player).to.have.deep.property('action', 'play');
                // Change media index in order to force a 'stop' action on old media
                ATInternet.YouTube.PlayerObjectList[0].player.getPlaylistIndex = function () {
                    return 1;
                };
                // Force a 'pause' action
                ATInternet.YouTube.PlayerObjectList[0].fire(YT.PlayerState.PAUSED);
                // Get 'stop' action instead of 'pause' action
                expect(ATInternet.YouTube.PlayerObjectList[0].player).to.have.deep.property('action', 'stop');
                // currentMedia is null
                expect(tag.addObject).to.deep.equal({});
                expect(tag.sendObject).to.deep.equal({});
            });
        });
    })
    ;
})
;