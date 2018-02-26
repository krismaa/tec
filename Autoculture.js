Autoculture = {
    settings: {
        autostart: false,
        towns: {}
    },
    town: null,
    iTown: null,
    interval: null,
    init: function() {
        ConsoleLog.Log('Initialize Autoculture', 2);
        Autoculture['initButton']()
    },
    initButton: function() {
        ModuleManager['initButtons']('Autoculture', ModuleManager['modules'].Autoculture)
    },
    setSettings: function(_0xe051x1) {
        if (_0xe051x1 != '' && _0xe051x1 != null) {
            $['extend'](Autoculture['settings'], JSON['parse'](_0xe051x1))
        }
    },
    checkAvailable: function(_0xe051x2) {
        var _0xe051x3 = {
            party: false,
            triumph: false,
            theater: false
        };
        var _0xe051x4 = ITowns['towns'][_0xe051x2]['buildings']()['attributes'];
        var _0xe051x5 = ITowns['towns'][_0xe051x2]['resources']();
        if (_0xe051x4['academy'] >= 30 && _0xe051x5['wood'] >= 15000 && _0xe051x5['stone'] >= 18000 && _0xe051x5['iron'] >= 15000) {
            _0xe051x3['party'] = true
        }
        ;if (_0xe051x4['theater'] == 1 && _0xe051x5['wood'] >= 10000 && _0xe051x5['stone'] >= 12000 && _0xe051x5['iron'] >= 10000) {
            _0xe051x3['theater'] = true
        }
        ;if (MM['getModelByNameAndPlayerId']('PlayerKillpoints')['getUnusedPoints']() >= 300) {
            _0xe051x3['triumph'] = true
        }
        ;return _0xe051x3
    },
    checkReady: function(_0xe051x6) {
        var _0xe051x7 = ITowns['towns'][_0xe051x6['id']];
        if (_0xe051x7['hasConqueror']()) {
            return false
        }
        ;if (!ModuleManager['modules']['Autoculture']['isOn']) {
            return false
        }
        ;if (_0xe051x6['modules']['Autoculture']['isReadyTime'] >= Timestamp['now']()) {
            return _0xe051x6['modules']['Autoculture']['isReadyTime']
        }
        ;if (Autoculture['settings']['towns'][_0xe051x6['id']] !== undefined && (Autoculture['settings']['towns'][_0xe051x6['id']]['party'] && Autoculture['checkAvailable'](_0xe051x6['id'])['party'] || Autoculture['settings']['towns'][_0xe051x6['id']]['triumph'] && Autoculture['checkAvailable'](_0xe051x6['id'])['triumph'] || Autoculture['settings']['towns'][_0xe051x6['id']]['theater'] && Autoculture['checkAvailable'](_0xe051x6['id'])['theater'])) {
            return true
        }
        ;return false
    },
    startCulture: function(_0xe051x6) {
        if (Autoculture['isPauzed']) {
            return false
        }
        ;if (!ModuleManager['modules']['Autoculture']['isOn']) {
            Autoculture['finished'](0);
            return false
        }
        ;Autoculture['town'] = _0xe051x6;
        Autoculture['iTown'] = ITowns['towns'][Autoculture['town']['id']];
        if (ModuleManager['currentTown'] != Autoculture['town']['key']) {
            ConsoleLog.Log(Autoculture['town']['name'] + ' move to town.', 2);
            DataExchanger['switch_town'](Autoculture['town']['id'], function() {
                if (Autoculture['isPauzed']) {
                    return false
                }
                ;ModuleManager['currentTown'] = Autoculture['town']['key'];
                Autoculture['start']()
            })
        } else {
            Autoculture['start']()
        }
    },
    start: function() {
        Autoculture['interval'] = setTimeout(function() {
            if (Autoculture['settings']['towns'][Autoculture['town']['id']] !== undefined) {
                ConsoleLog.Log(Autoculture['town']['name'] + ' getting event information.', 2);
                DataExchanger['building_place'](Autoculture['town']['id'], function(_0xe051x8) {
                    if (Autoculture['isPauzed']) {
                        return false
                    }
                    ;var _0xe051x9 = [];
                    _0xe051x9['push']({
                        name: 'triumph',
                        waiting: 19200,
                        element: $(_0xe051x8['plain']['html'])['find']('#place_triumph')
                    });
                    _0xe051x9['push']({
                        name: 'party',
                        waiting: 57600,
                        element: $(_0xe051x8['plain']['html'])['find']('#place_party')
                    });
                    _0xe051x9['push']({
                        name: 'theater',
                        waiting: 285120,
                        element: $(_0xe051x8['plain']['html'])['find']('#place_theater')
                    });
                    var _0xe051xa = false;
                    var _0xe051xb = 0;
                    var _0xe051xc = 300;
                    var _0xe051xd = function(_0xe051xe) {
                        if (_0xe051xb == 3) {
                            if (!_0xe051xa) {
                                ConsoleLog.Log(Autoculture['town']['name'] + ' not ready yet.', 2)
                            }
                            ;Autoculture['finished'](_0xe051xc);
                            return false
                        }
                        ;if (_0xe051xe['name'] == 'triumph' && (!Autoculture['settings']['towns'][Autoculture['town']['id']]['triumph'] || !Autoculture['checkAvailable'](Autoculture['town']['id'])['triumph'] || MM['getModelByNameAndPlayerId']('PlayerKillpoints')['getUnusedPoints']() < 300)) {
                            _0xe051xb++;
                            _0xe051xd(_0xe051x9[_0xe051xb]);
                            return false
                        } else {
                            if (_0xe051xe['name'] == 'party' && (!Autoculture['settings']['towns'][Autoculture['town']['id']]['party'] || !Autoculture['checkAvailable'](Autoculture['town']['id'])['party'])) {
                                _0xe051xb++;
                                _0xe051xd(_0xe051x9[_0xe051xb]);
                                return false
                            } else {
                                if (_0xe051xe['name'] == 'theater' && (!Autoculture['settings']['towns'][Autoculture['town']['id']]['theater'] || !Autoculture['checkAvailable'](Autoculture['town']['id'])['theater'])) {
                                    _0xe051xb++;
                                    _0xe051xd(_0xe051x9[_0xe051xb]);
                                    return false
                                }
                            }
                        }
                        ;if (_0xe051xe['element']['find']('#countdown_' + _0xe051xe['name'])['length']) {
                            var _0xe051xf = Autobot['timeToSeconds'](_0xe051xe['element']['find']('#countdown_' + _0xe051xe['name'])['html']());
                            if (_0xe051xc == 300) {
                                _0xe051xc = _0xe051xf
                            } else {
                                if (_0xe051xc > _0xe051xf) {
                                    _0xe051xc = _0xe051xf
                                }
                            }
                            ;_0xe051xb++;
                            _0xe051xd(_0xe051x9[_0xe051xb]);
                            return false
                        } else {
                            if (_0xe051xe['element']['find']('.button, .button_new')['data']('enabled') != '1') {
                                _0xe051xb++;
                                _0xe051xd(_0xe051x9[_0xe051xb]);
                                return false
                            } else {
                                if (_0xe051xe['element']['find']('.button, .button_new')['data']('enabled') == '1') {
                                    Autoculture['interval'] = setTimeout(function() {
                                        _0xe051xa = true;
                                        Autoculture['startCelebration'](_0xe051xe, function(_0xe051x10) {
                                            if (Autoculture['isPauzed']) {
                                                return false
                                            }
                                            ;if (_0xe051xc == 300) {
                                                _0xe051xc = _0xe051x10
                                            } else {
                                                if (_0xe051xc >= _0xe051x10) {
                                                    _0xe051xc = _0xe051x10
                                                }
                                            }
                                            ;_0xe051xb++;
                                            _0xe051xd(_0xe051x9[_0xe051xb])
                                        })
                                    }, (_0xe051xb + 1) * Autobot['randomize'](1000, 2000));
                                    return false
                                }
                            }
                        }
                        ;_0xe051xb++;
                        _0xe051xd(_0xe051x9[_0xe051xb])
                    };
                    _0xe051xd(_0xe051x9[_0xe051xb])
                })
            }
        }, Autobot['randomize'](2000, 4000))
    },
    startCelebration: function(_0xe051xe, _0xe051x11) {
        DataExchanger['start_celebration'](Autoculture['town']['id'], _0xe051xe['name'], function(_0xe051x8) {
            if (Autoculture['isPauzed']) {
                return false
            }
            ;var _0xe051x12 = 0;
            if (_0xe051x8['json']['error'] == undefined) {
                var _0xe051x13 = {};
                NotificationLoader['recvNotifyData'](_0xe051x8['json'], false);
                $['each'](_0xe051x8['json']['notifications'], function(_0xe051x14, _0xe051x15) {
                    if (_0xe051x15['subject'] == 'Celebration') {
                        _0xe051x13 = JSON['parse'](_0xe051x15['param_str'])
                    }
                });
                if (Autoculture['town']['id'] == Game['townId']) {
                    var _0xe051x16 = GPWindowMgr['getByType'](GPWindowMgr.TYPE_BUILDING);
                    for (var _0xe051x17 = 0; _0xe051x16['length'] > _0xe051x17; _0xe051x17++) {
                        _0xe051x16[_0xe051x17]['getHandler']()['refresh']()
                    }
                }
                ;if (_0xe051x13['Celebration'] != undefined) {
                    ConsoleLog.Log('<span style="color: #fff;">' + PopupFactory['texts'][_0xe051x13['Celebration']['celebration_type']] + ' is started.</span>', 2);
                    _0xe051x12 = _0xe051x13['Celebration']['finished_at'] - Timestamp['now']()
                }
            } else {
                ConsoleLog.Log(Autoculture['town']['name'] + ' ' + _0xe051x8['json']['error'], 2)
            }
            ;_0xe051x11(_0xe051x12)
        })
    },
    pauze: function() {
        clearInterval(Autoculture['interval']);
        Autoculture['isPauzed'] = true
    },
    finished: function(_0xe051x12) {
        if (Autoculture['isPauzed']) {
            return false
        }
        ;Autoculture['town']['modules']['Autoculture']['isReadyTime'] = Timestamp['now']() + _0xe051x12;
        Autoculture['town']['modules']['Autoculture']['isFinished'] = true;
        ModuleManager['Queue']['next']()
    },
    contentSettings: function() {
        var _0xe051x18 = '<ul class="game_list"><li class="even">';
        _0xe051x18 += '<div class="towninfo small tag_header col w80 h25" id="header_town"></div>';
        _0xe051x18 += '<div class="towninfo small tag_header col w40" id="header_island"> Island</div>';
        _0xe051x18 += '<div class="towninfo small tag_header col w35" id="header_wood"><div class="col header wood"></div></div>';
        _0xe051x18 += '<div class="towninfo small tag_header col w40" id="header_stone"><div class="col header stone"></div></div>';
        _0xe051x18 += '<div class="towninfo small tag_header col w40" id="header_iron"><div class="col header iron"></div></div>';
        _0xe051x18 += '<div class="towninfo small tag_header col w35" id="header_free_pop"><div class="col header free_pop"></div></div>';
        _0xe051x18 += '<div class="towninfo small tag_header col w40" id="header_storage"><div class="col header storage"></div></div>';
        _0xe051x18 += '<div class="towninfo small tag_header col w50" id="header_storage"><div class="col header celebration party"></div></div>';
        _0xe051x18 += '<div class="towninfo small tag_header col w50" id="header_storage"><div class="col header celebration triumph"></div></div>';
        _0xe051x18 += '<div class="towninfo small tag_header col w50" id="header_storage"><div class="col header celebration theater"></div></div>';
        _0xe051x18 += '<div style="clear:both;"></div>';
        _0xe051x18 += '</li></ul><div id="bot_townsoverview_table_wrapper">';
        _0xe051x18 += '<ul class="game_list scroll_content">';
        var _0xe051x17 = 0;
        $['each'](ModuleManager['playerTowns'], function(_0xe051x19, _0xe051x6) {
            var _0xe051x1a = ITowns['towns'][_0xe051x6['id']];
            var _0xe051x1b = _0xe051x1a['getIslandCoordinateX']();
            var _0xe051x1c = _0xe051x1a['getIslandCoordinateY']();
            var _0xe051x1d = _0xe051x1a['resources']();
            _0xe051x18 += '<li class="' + (_0xe051x17 % 2 ? 'even' : 'odd') + ' bottom" id="ov_town_' + _0xe051x1a['id'] + '">';
            _0xe051x18 += '<div class="towninfo small townsoverview col w80">';
            _0xe051x18 += '<div>';
            _0xe051x18 += '<span><a href="#' + _0xe051x1a['getLinkFragment']() + '" class="gp_town_link">' + _0xe051x1a['name'] + '</a></span><br>';
            _0xe051x18 += '<span>(' + _0xe051x1a['getPoints']() + ' Ptn.)</span>';
            _0xe051x18 += '</div></div>';
            _0xe051x18 += '<div class="towninfo small townsoverview col w40">';
            _0xe051x18 += '<div>';
            _0xe051x18 += '<span>' + _0xe051x1b + ',' + _0xe051x1c + '</span>';
            _0xe051x18 += '</div>';
            _0xe051x18 += '</div>';
            _0xe051x18 += '<div class="towninfo small townsoverview col w40">';
            _0xe051x18 += '<div class="wood' + (_0xe051x1d['wood'] == _0xe051x1d['storage'] ? ' town_storage_full' : '') + '">';
            _0xe051x18 += _0xe051x1d['wood'];
            _0xe051x18 += '</div>';
            _0xe051x18 += '</div>';
            _0xe051x18 += '<div class="towninfo small townsoverview col w40">';
            _0xe051x18 += '<div class="stone' + (_0xe051x1d['stone'] == _0xe051x1d['storage'] ? ' town_storage_full' : '') + '">';
            _0xe051x18 += _0xe051x1d['stone'];
            _0xe051x18 += '</div>';
            _0xe051x18 += '</div>';
            _0xe051x18 += '<div class="towninfo small townsoverview col w40">';
            _0xe051x18 += '<div class="iron' + (_0xe051x1d['iron'] == _0xe051x1d['storage'] ? ' town_storage_full' : '') + '">';
            _0xe051x18 += _0xe051x1d['iron'];
            _0xe051x18 += '</div>';
            _0xe051x18 += '</div>';
            _0xe051x18 += '<div class="towninfo small townsoverview col w35">';
            _0xe051x18 += '<div>';
            _0xe051x18 += '<span class="town_population_count">' + _0xe051x1d['population'] + '</span>';
            _0xe051x18 += '</div>';
            _0xe051x18 += '</div>';
            _0xe051x18 += '<div class="towninfo small townsoverview col w40">';
            _0xe051x18 += '<div>';
            _0xe051x18 += '<span class="storage">' + _0xe051x1d['storage'] + '</span>';
            _0xe051x18 += '</div>';
            _0xe051x18 += '</div>';
            _0xe051x18 += '<div class="towninfo small townsoverview col w50">';
            _0xe051x18 += '<div class="culture_party_row" id="culture_party_' + _0xe051x1a['id'] + '">';
            _0xe051x18 += '</div>';
            _0xe051x18 += '</div>';
            _0xe051x18 += '<div class="towninfo small townsoverview col w50">';
            _0xe051x18 += '<div class="culture_triumph_row" id="culture_triumph_' + _0xe051x1a['id'] + '">';
            _0xe051x18 += '</div>';
            _0xe051x18 += '</div>';
            _0xe051x18 += '<div class="towninfo small townsoverview col w50">';
            _0xe051x18 += '<div class="culture_theater_row" id="culture_theater_' + _0xe051x1a['id'] + '">';
            _0xe051x18 += '</div>';
            _0xe051x18 += '</div>';
            _0xe051x18 += '<div style="clear:both;"></div>';
            _0xe051x18 += '</li>';
            _0xe051x17++
        });
        _0xe051x18 += '</ul></div>';
        _0xe051x18 += '<div class="game_list_footer">';
        _0xe051x18 += '<div id="bot_culture_settings"></div>';
        _0xe051x18 += '</div>';
        var _0xe051x1e = {};
        function _0xe051x1f(_0xe051x20) {
            var _0xe051x21 = $(_0xe051x20 + ' .checkbox_new');
            if (!_0xe051x1e[_0xe051x20]) {
                _0xe051x21['addClass']('checked');
                _0xe051x21['find']('input[type="checkbox"]')['prop']('checked', true);
                _0xe051x1e[_0xe051x20] = true
            } else {
                _0xe051x21['removeClass']('checked');
                _0xe051x21['find']('input[type="checkbox"]')['prop']('checked', false);
                _0xe051x1e[_0xe051x20] = false
            }
        }
        var _0xe051x22 = $(_0xe051x18);
        _0xe051x22['find']('.celebration.party')['mousePopup'](new MousePopup('Auto ' + PopupFactory['texts']['party']))['on']('click', function() {
            _0xe051x1f('.culture_party_row')
        });
        _0xe051x22['find']('.celebration.triumph')['mousePopup'](new MousePopup('Auto ' + PopupFactory['texts']['triumph']))['on']('click', function() {
            _0xe051x1f('.culture_triumph_row')
        });
        _0xe051x22['find']('.celebration.theater')['mousePopup'](new MousePopup('Auto ' + PopupFactory['texts']['theater']))['on']('click', function() {
            _0xe051x1f('.culture_theater_row')
        });
        $['each'](ModuleManager['playerTowns'], function(_0xe051x19, _0xe051x6) {
            _0xe051x22['find']('#culture_party_' + _0xe051x6['id'])['html'](FormBuilder['checkbox']({
                "\x69\x64": 'bot_culture_party_' + _0xe051x6['id'],
                "\x6E\x61\x6D\x65": 'bot_culture_party_' + _0xe051x6['id'],
                "\x63\x68\x65\x63\x6B\x65\x64": _0xe051x6['id']in Autoculture['settings']['towns'] ? Autoculture['settings']['towns'][_0xe051x6['id']]['party'] : false,
                "\x64\x69\x73\x61\x62\x6C\x65\x64": !Autoculture['checkAvailable'](_0xe051x6['id'])['party']
            }));
            _0xe051x22['find']('#culture_triumph_' + _0xe051x6['id'])['html'](FormBuilder['checkbox']({
                "\x69\x64": 'bot_culture_triumph_' + _0xe051x6['id'],
                "\x6E\x61\x6D\x65": 'bot_culture_triumph_' + _0xe051x6['id'],
                "\x63\x68\x65\x63\x6B\x65\x64": _0xe051x6['id']in Autoculture['settings']['towns'] ? Autoculture['settings']['towns'][_0xe051x6['id']]['triumph'] : false,
                "\x64\x69\x73\x61\x62\x6C\x65\x64": !Autoculture['checkAvailable'](_0xe051x6['id'])['triumph']
            }));
            _0xe051x22['find']('#culture_theater_' + _0xe051x6['id'])['html'](FormBuilder['checkbox']({
                "\x69\x64": 'bot_culture_theater_' + _0xe051x6['id'],
                "\x6E\x61\x6D\x65": 'bot_culture_theater_' + _0xe051x6['id'],
                "\x63\x68\x65\x63\x6B\x65\x64": _0xe051x6['id']in Autoculture['settings']['towns'] ? Autoculture['settings']['towns'][_0xe051x6['id']]['theater'] : false,
                "\x64\x69\x73\x61\x62\x6C\x65\x64": !Autoculture['checkAvailable'](_0xe051x6['id'])['theater']
            }))
        });
        _0xe051x22['find']('#bot_culture_settings')['append'](FormBuilder['button']({
            name: 'Save',
            style: 'float: left;'
        })['on']('click', function() {
            var _0xe051x23 = $('#bot_townsoverview_table_wrapper input')['serializeObject']();
            $['each'](ModuleManager['playerTowns'], function(_0xe051x19, _0xe051x6) {
                Autoculture['settings']['towns'][_0xe051x6['id']] = {
                    party: false,
                    triumph: false,
                    theater: false
                }
            });
            $['each'](_0xe051x23, function(_0xe051x19, _0xe051x24) {
                if (_0xe051x19['indexOf']('bot_culture_party_') >= 0) {
                    Autoculture['settings']['towns'][_0xe051x19['replace']('bot_culture_party_', '')]['party'] = (_0xe051x24 != undefined)
                } else {
                    if (_0xe051x19['indexOf']('bot_culture_triumph_') >= 0) {
                        Autoculture['settings']['towns'][_0xe051x19['replace']('bot_culture_triumph_', '')]['triumph'] = (_0xe051x24 != undefined)
                    } else {
                        if (_0xe051x19['indexOf']('bot_culture_theater_') >= 0) {
                            Autoculture['settings']['towns'][_0xe051x19['replace']('bot_culture_theater_', '')]['theater'] = (_0xe051x24 != undefined)
                        }
                    }
                }
            });
            Autoculture['settings']['autostart'] = $('#autoculture_autostart')['prop']('checked');
            DataExchanger.Auth('saveCulture', {
                player_id: Autobot['Account']['player_id'],
                world_id: Autobot['Account']['world_id'],
                csrfToken: Autobot['Account']['csrfToken'],
                autoculture_settings: Autobot['stringify'](Autoculture['settings'])
            }, Autoculture['callbackSave'])
        }))['append'](FormBuilder['checkbox']({
            "\x74\x65\x78\x74": 'AutoStart AutoCulture.',
            "\x69\x64": 'autoculture_autostart',
            "\x6E\x61\x6D\x65": 'autoculture_autostart',
            "\x63\x68\x65\x63\x6B\x65\x64": Autoculture['settings']['autostart']
        }));
        return FormBuilder['gameWrapper']('AutoCulture', 'bot_townsoverview', _0xe051x22, 'margin-bottom:9px;')
    },
    callbackSave: function() {
        ConsoleLog.Log('Settings saved', 2);
        HumanMessage['success']('The settings were saved!')
    }
}
