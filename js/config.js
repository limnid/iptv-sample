var Api = {
	KEY: 'HdqEcBgTea5A7QVnfWDb',
	BASE: 'https://mover.uz/api/v1',
	ME: '/me',
	CATEGORIES: '/categories',
	VIDEO: '/video'
};

var Config = {
    MAX_RIGHT_STEP: 2,
    MAX_DOWN_STEP: 1
};

var StbEvent = {
    END: 1,
    AUDIO_INFO: 2,
    START: 4,
    NOT_FOUND: 5,
    DUAL_MONO: 6,
    VIDEO_INFO: 7,
    SUBTITLE_ERROR: 8,
    HDMI_CONNECTED: 0x20,
    HDMI_OFF: 0x21,
    RECORD_ERROR: 0x23,
    RTP_ERROR: 0x81
};

var Keyboard = {
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    LEFT: 37,
    EXIT: 27,
    BACK: 8,
    OK: 13,
    RED: 112,
    GREEN: 113,
    YELLOW: 114,
    BLUE: 115
};

var EventTypes = {
    UP: "upArrow",
    fadeOut_PANEL: "fadeOut_panel",
    DOWN: "downArrow",
    NEXT: "nextArrow",
    SELECT_SECTION: "select_section",
    SELECT_ITEM: "select_item",
    PREV: "prevArrow",
    REFRESH: "refresh",
    KEY_UP: "keyup",
    KEY_DOWN: "keydown",
    CONTINUE: "continue",
    PAUSE: "pause",
    STB_EVENT: "onStbEvent",
    STOP: "stop"
};