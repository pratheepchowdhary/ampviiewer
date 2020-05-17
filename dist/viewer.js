(function () {
  'use strict';

  /**
   * Copyright 2017 The AMP HTML Authors. All Rights Reserved.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS-IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  /**
   * Logs an arbitrary list of arguments to the console using viewer-specific
   * lead-ins.
   */
  function log() {
    var var_args = Array.prototype.slice.call(arguments, 0);
    var_args.unshift('[Viewer]');
    console
    /*OK*/
    .log.apply(console, var_args);
  }

  /**
   * Copyright 2017 The AMP HTML Authors. All Rights Reserved.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS-IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  /**
   * @param {string} urlString
   * @return {*}
   */
  function parseUrl(urlString) {
    var a = document.createElement('a');
    a.href = urlString;
    return {
      href: a.href,
      protocol: a.protocol,
      host: a.host,
      hostname: a.hostname,
      port: a.port == '0' ? '' : a.port,
      pathname: a.pathname,
      search: a.search,
      hash: a.hash,
      origin: a.protocol + '//' + a.host
    };
  }

  /**
   * Copyright 2017 The AMP HTML Authors. All Rights Reserved.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS-IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * This file manages history for the Viewer.
   */

  var History =
  /*#__PURE__*/
  function () {
    /** 
     * @param {!Function} handleChangeHistoryState what to do when the history
     *  state changes.
     */
    function History(handleChangeHistoryState) {
      /** @private {!Function} */
      this.handleChangeHistoryState_ = handleChangeHistoryState;
      this.init_();
    }
    /**
     * Init the onpopstate listener.
     * @private
     */


    var _proto = History.prototype;

    _proto.init_ = function init_() {
      var _this = this;

      window.addEventListener('popstate', function (event) {
        var state = event.state;

        if (!state) {
          _this.handleChangeHistoryState_(true
          /* isLastBack */
          , false
          /* isAMP */
          );

          return;
        }

        _this.handleChangeHistoryState_(false
        /* isLastBack */
        , !!state.isAMP);
      });
    }
    /**
     * Init the onpopstate listener.
     * @param {string} url The url to push onto the Viewer history.
     */
    ;

    _proto.pushState = function pushState(url) {
      var stateData = {
        urlPath: url,
        isAMP: true
      }; // The url should have /amp/ + url added to it. For example:
      // example.com -> example.com/amp/s/www.ampproject.org
      // TODO(chenshay): Include path & query parameters.

      var parsedUrl = parseUrl(url);
      var urlStr = '/amp/';
      if (parsedUrl.protocol == 'https:') urlStr += 's/';
      urlStr += parsedUrl.host;
      history.pushState(stateData, '', urlStr);
    }
    /**
     * Go back to the previous history state.
     */
    ;

    _proto.goBack = function goBack() {
      history.back();
    }
    /**
     * Go forward to the next history state.
     */
    ;

    _proto.goForward = function goForward() {
      history.forward();
    };

    return History;
  }();

  /**
   * Copyright 2017 The AMP HTML Authors. All Rights Reserved.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS-IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const TAG = 'amp-viewer-messaging';
  const APP = '__AMPHTML__';
  /**
   * @enum {string}
   */

  const MessageType = {
    REQUEST: 'q',
    RESPONSE: 's'
  };
  /**
    * @param {*} message
    * @return {?Message}
    */

  function parseMessage(message) {
    if (typeof message != 'string') {
      return (
        /** @type {Message} */
        message
      );
    }

    if (message.charAt(0) != '{') {
      return null;
    }

    try {
      return (
        /** @type {?Message} */
        JSON.parse(
        /** @type {string} */
        message)
      );
    } catch (e) {
      return null;
    }
  }
  /**
   * @fileoverview This class is a de-facto implementation of MessagePort
   * from Channel Messaging API:
   * https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API
   */

  class WindowPortEmulator {
    /**
     * @param {!Window} win
     * @param {string} origin
     * @param {!Window} target
     */
    constructor(win, origin, target) {
      /** @const {!Window} */
      this.win = win;
      /** @private {string} */

      this.origin_ = origin;
      /** @const {!Window} */

      this.target_ = target;
    }
    /**
     * @param {string} eventType
     * @param {function(!Event):undefined} handler
     */


    addEventListener(eventType, handler) {
      this.win.addEventListener('message', e => {
        if (e.origin == this.origin_ && e.source == this.target_ && e.data.app == APP) {
          handler(e);
        }
      });
    }
    /**
     * @param {Object} data
     */


    postMessage(data) {
      this.target_.
      /*OK*/
      postMessage(data, this.origin_);
    }

    start() {}

  }
  /**
   * @fileoverview This is used in amp-viewer-integration.js for the
   * communication protocol between AMP and the viewer. In the comments, I will
   * refer to the communication as a conversation between me and Bob. The
   * messaging protocol should support both sides, but at this point I'm the
   * ampdoc and Bob is the viewer.
   */

  class Messaging {
    /**
     * Conversation (messaging protocol) between me and Bob.
     * @param {!Window} win
     * @param {!MessagePort|!WindowPortEmulator} port
     * @param {boolean} opt_isWebview
     */
    constructor(win, port, opt_isWebview) {
      /** @const {!Window} */
      this.win = win;
      /** @const @private {!MessagePort|!WindowPortEmulator} */

      this.port_ = port;
      /** @const @private */

      this.isWebview_ = !!opt_isWebview;
      /** @private {!number} */

      this.requestIdCounter_ = 0;
      /** @private {!Object<number, {resolve: function(*), reject: function(!Error)}>} */

      this.waitingForResponse_ = {};
      /**
       * A map from message names to request handlers.
       * @private {!Object<string, !RequestHandler>}
       */

      this.messageHandlers_ = {};
      /** @private {?RequestHandler} */

      this.defaultHandler_ = null;
      this.port_.addEventListener('message', this.handleMessage_.bind(this));
      this.port_.start();
    }
    /**
     * Registers a method that will handle requests sent to the specified
     * message name.
     * @param {string} messageName The name of the message to handle.
     * @param {!RequestHandler} requestHandler
     */


    registerHandler(messageName, requestHandler) {
      this.messageHandlers_[messageName] = requestHandler;
    }
    /**
     * Unregisters the handler for the specified message name.
     * @param {string} messageName The name of the message to unregister.
     */


    unregisterHandler(messageName) {
      delete this.messageHandlers_[messageName];
    }
    /**
     * @param {?RequestHandler} requestHandler
     */


    setDefaultHandler(requestHandler) {
      this.defaultHandler_ = requestHandler;
    }
    /**
     * Bob sent me a message. I need to decide if it's a new request or
     * a response to a previous 'conversation' we were having.
     * @param {!Event} event
     * @private
     */


    handleMessage_(event) {
      const message = parseMessage(event.data);

      if (!message) {
        return;
      }

      if (message.type == MessageType.REQUEST) {
        this.handleRequest_(message);
      } else if (message.type == MessageType.RESPONSE) {
        this.handleResponse_(message);
      }
    }
    /**
     * I'm sending Bob a new outgoing request.
     * @param {string} messageName
     * @param {*} messageData
     * @param {boolean} awaitResponse
     * @return {!Promise<*>|undefined}
     */


    sendRequest(messageName, messageData, awaitResponse) {
      const requestId = ++this.requestIdCounter_;
      let promise = undefined;

      if (awaitResponse) {
        promise = new Promise((resolve, reject) => {
          this.waitingForResponse_[requestId] = {
            resolve,
            reject
          };
        });
      }

      this.sendMessage_({
        app: APP,
        requestid: requestId,
        type: MessageType.REQUEST,
        name: messageName,
        data: messageData,
        rsvp: awaitResponse
      });
      return promise;
    }
    /**
     * I'm responding to a request that Bob made earlier.
     * @param {number} requestId
     * @param {string} messageName
     * @param {*} messageData
     * @private
     */


    sendResponse_(requestId, messageName, messageData) {
      this.sendMessage_({
        app: APP,
        requestid: requestId,
        type: MessageType.RESPONSE,
        name: messageName,
        data: messageData
      });
    }
    /**
     * @param {number} requestId
     * @param {string} messageName
     * @param {*} reason !Error most of time, string sometimes, * rarely.
     * @private
     */


    sendResponseError_(requestId, messageName, reason) {
      const errString = this.errorToString_(reason);
      this.logError_(TAG + ': sendResponseError_, Message name: ' + messageName, errString);
      this.sendMessage_({
        app: APP,
        requestid: requestId,
        type: MessageType.RESPONSE,
        name: messageName,
        data: null,
        error: errString
      });
    }
    /**
     * @param {Message} message
     * @private
     */


    sendMessage_(message) {
      this.port_.
      /*OK*/
      postMessage(this.isWebview_ ? JSON.stringify(message) : message);
    }
    /**
     * I'm handing an incoming request from Bob. I'll either respond normally
     * (ex: "got it Bob!") or with an error (ex: "I didn't get a word of what
     * you said!").
     * @param {Message} message
     * @private
     */


    handleRequest_(message) {
      let handler = this.messageHandlers_[message.name];

      if (!handler) {
        handler = this.defaultHandler_;
      }

      if (!handler) {
        const error = new Error('Cannot handle request because handshake is not yet confirmed!');
        error.args = message.name;
        throw error;
      }

      const promise = handler(message.name, message.data, !!message.rsvp);

      if (message.rsvp) {
        const requestId = message.requestid;

        if (!promise) {
          this.sendResponseError_(requestId, message.name, new Error('no response'));
          throw new Error('expected response but none given: ' + message.name);
        }

        promise.then(data => {
          this.sendResponse_(requestId, message.name, data);
        }, reason => {
          this.sendResponseError_(requestId, message.name, reason);
        });
      }
    }
    /**
     * I sent out a request to Bob. He responded. And now I'm handling that
     * response.
     * @param {Message} message
     * @private
     */


    handleResponse_(message) {
      const requestId = message.requestid;
      const pending = this.waitingForResponse_[requestId];

      if (pending) {
        delete this.waitingForResponse_[requestId];

        if (message.error) {
          this.logError_(TAG + ': handleResponse_ error: ', message.error);
          pending.reject(new Error(`Request ${message.name} failed: ${message.error}`));
        } else {
          pending.resolve(message.data);
        }
      }
    }
    /**
     * @param {string} state
     * @param {!Error|string} opt_data
     * @private
     */


    logError_(state, opt_data) {
      let stateStr = 'amp-messaging-error-logger: ' + state;
      const dataStr = ' data: ' + this.errorToString_(opt_data);
      stateStr += dataStr;
      this.win['viewerState'] = stateStr;
    }

    /**
     * @param {*} err !Error most of time, string sometimes, * rarely.
     * @return {string}
     * @private
     */
    errorToString_(err) {
      return err ? err.message ? err.message : String(err) : 'unknown error';
    }

  }

  /**
   * Copyright 2017 The AMP HTML Authors. All Rights Reserved.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS-IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var CHANNEL_OPEN_MSG = 'channelOpen';
  var ViewerMessaging =
  /*#__PURE__*/
  function () {
    /**
     * @param {!Window} win
     * @param {!HTMLIFrameElement} ampIframe
     * @param {string} frameOrigin
     * @param {!RequestHandler} messageHandler
     */
    function ViewerMessaging(win, ampIframe, frameOrigin, messageHandler) {
      /** @const {!Window} */
      this.win = win;
      /** @private {!HTMLIFrameElement} */

      this.ampIframe_ = ampIframe;
      /** @private {string} */

      this.frameOrigin_ = frameOrigin;
      /** @private {!RequestHandler} */

      this.messageHandler_ = messageHandler;
    }
    /**
     * @param {boolean=} opt_isHandshakePoll
     * @return {!Promise}
     */


    var _proto = ViewerMessaging.prototype;

    _proto.start = function start(opt_isHandshakePoll) {
      var _this = this;

      if (opt_isHandshakePoll) {
        /** @private {number} */
        this.pollingIntervalId_ = setInterval(this.initiateHandshake_.bind(this, this.intervalCtr), 1000); //poll every second

        return new Promise(function (resolve) {
          /** @private {!Function} */
          _this.hanshakePollPromiseResolve_ = resolve;
        });
      } else {
        return this.waitForHandshake_(this.frameOrigin_);
      }
    }
    /**
     * @private
     */
    ;

    _proto.initiateHandshake_ = function initiateHandshake_() {
      var _this2 = this;

      log('initiateHandshake_');

      if (this.ampIframe_) {
        var channel = new MessageChannel();
        var message = {
          app: APP,
          name: 'handshake-poll'
        };
        this.ampIframe_.contentWindow.
        /*OK*/
        postMessage(message, '*', [channel.port2]);

        channel.port1.onmessage = function (e) {
          var data = e.data;

          if (_this2.isChannelOpen_(data)) {
            clearInterval(_this2.pollingIntervalId_); //stop polling

            log('messaging established!');

            _this2.completeHandshake_(channel.port1, data.requestid).then(function () {
              _this2.hanshakePollPromiseResolve_();
            });
          } else {
            _this2.messageHandler_(data.name, data.data, data.rsvp);
          }
        };
      }
    }
    /**
     * @param {string} targetOrigin
     * @return {!Promise}
     * @private
     */
    ;

    _proto.waitForHandshake_ = function waitForHandshake_(targetOrigin) {
      var _this3 = this;

      log('awaitHandshake_');
      return new Promise(function (resolve) {
        var listener = function listener(e) {
          log('message!', e);
          var target = _this3.ampIframe_.contentWindow;

          if (e.origin == targetOrigin && _this3.isChannelOpen_(e.data) && (!e.source || e.source == target)) {
            log(' messaging established with ', targetOrigin);

            _this3.win.removeEventListener('message', listener);

            var port = new WindowPortEmulator(_this3.win, targetOrigin, target);

            _this3.completeHandshake_(port, e.data.requestid).then(function () {
              resolve();
            });
          }
        };

        _this3.win.addEventListener('message', listener);
      });
    }
    /**
     * @param {!MessagePort|!WindowPortEmulator} port
     * @param {string} requestId
     * @return {!Promise}
     * @private
     */
    ;

    _proto.completeHandshake_ = function completeHandshake_(port, requestId) {
      var message = {
        app: APP,
        requestid: requestId,
        type: MessageType.RESPONSE
      };
      log('posting Message', message);
      port.
      /*OK*/
      postMessage(message);
      this.messaging_ = new Messaging(this.win, port);
      this.messaging_.setDefaultHandler(this.messageHandler_);
      this.sendRequest('visibilitychange', {
        state: this.visibilityState_,
        prerenderSize: this.prerenderSize
      }, true);
      return Promise.resolve();
    };

    /**
     * @param {*} eventData
     * @return {boolean}
     * @private
     */
    _proto.isChannelOpen_ = function isChannelOpen_(eventData) {
      return eventData.app == APP && eventData.name == CHANNEL_OPEN_MSG;
    };

    /**
     * @param {string} type
     * @param {*} data
     * @param {boolean} awaitResponse
     * @return {!Promise<*>|undefined}
     */
    _proto.sendRequest = function sendRequest(type, data, awaitResponse) {
      log('sendRequest');

      if (!this.messaging_) {
        return;
      }

      return this.messaging_.sendRequest(type, data, awaitResponse);
    };

    return ViewerMessaging;
  }();

  let l = "ase art bmp blp cd5 cit cpt cr2 cut dds dib djvu egt exif gif gpl grf icns ico iff jng jpeg jpg jfif jp2 jps lbm max miff mng msp nitf ota pbm pc1 pc2 pc3 pcf pcx pdn pgm PI1 PI2 PI3 pict pct pnm pns ppm psb psd pdd psp px pxm pxr qfx raw rle sct sgi rgb int bw tga tiff tif vtf xbm xcf xpm 3dv amf ai awg cgm cdr cmx dxf e2d egt eps fs gbr odg svg stl vrml x3d sxd v2d vnd wmf emf art xar png webp jxr hdp wdp cur ecw iff lbm liff nrrd pam pcx pgf sgi rgb rgba bw int inta sid ras sun tga".split(" "),
      m = {
    isPathNameAnImage: a => l.some(b => a.endsWith(b) ? !0 : !1)
  },
      n = "### #gf $on $tf 0b 8m 8u 12u 15u 64c 075 75 085 85 91 091 096 96 abf acfm acs afm afn afs all amfm apf asf aspf atm auf b30 bco bdf bepf bez bfn bmap bmf bx bzr cbtf cct cef cff cfn cga ch4 cha chm chr chx claf collection compositefont dfont dus dzk eft eot etx euf f00 f06 f08 f09 f3f f10 f11 f12 f13 f16 fd fdb ff ffil flf fli fn3 fnb fnn fnt fnta fo1 fo2 fog fon font fonts fot frf frs ftm fxr fyi gdr gf gft glf glif glyphs gsf gxf hbf ice intellifont lepf lft lwfn mcf mcf mfd mfm mft mgf mmm mrf mtf mvec nlq ntf odttf ofm okf otf pcf pcf pfa pfb pfm pft phf pk pkt prs pss qbf qfn r8? scr sfd sff sfi sfl sfn sfo sfp sfs sif snf spd spritefont sui suit svg sxs t1c t2 tb1 tb2 tdf tfm tmf tpf ttc tte ttf type ufm ufo usl usp us? vf vf1 vf3 vfb vfm vfont vlw vmf vnf w30 wfn wnf woff woff2 xfc xfn xfr xft zfi zsu _v".split(" "),
      q = {
    isPathNameAFont: a => n.some(b => a.endsWith(b) ? !0 : !1)
  };
  var r = "undefined" !== typeof globalThis ? globalThis : "undefined" !== typeof window ? window : "undefined" !== typeof global ? global : "undefined" !== typeof self ? self : {};

  function t(a, b) {
    b = b.split(":")[0];
    a = +a;
    if (!a) return !1;

    switch (b) {
      case "http":
      case "ws":
        return 80 !== a;

      case "https":
      case "wss":
        return 443 !== a;

      case "ftp":
        return 21 !== a;

      case "gopher":
        return 70 !== a;

      case "file":
        return !1;
    }

    return 0 !== a;
  }

  var u = Object.prototype.hasOwnProperty;

  function v(a) {
    try {
      return decodeURIComponent(a.replace(/\+/g, " "));
    } catch (b) {
      return null;
    }
  }

  var w = {
    stringify: function (a, b) {
      b = b || "";
      var d = [],
          c;
      "string" !== typeof b && (b = "?");

      for (e in a) if (u.call(a, e)) {
        (c = a[e]) || null !== c && void 0 !== c && !isNaN(c) || (c = "");
        var e = encodeURIComponent(e);
        c = encodeURIComponent(c);
        null !== e && null !== c && d.push(e + "=" + c);
      }

      return d.length ? b + d.join("&") : "";
    },
    parse: function (a) {
      for (var b = /([^=?&]+)=?([^&]*)/g, d = {}, c; c = b.exec(a);) {
        var e = v(c[1]);
        c = v(c[2]);
        null === e || null === c || e in d || (d[e] = c);
      }

      return d;
    }
  },
      x = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//,
      y = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\S\s]*)/i,
      z = /^[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]+/;

  function A(a) {
    return (a ? a : "").toString().replace(z, "");
  }

  var B = [["#", "hash"], ["?", "query"], function (a) {
    return a.replace("\\", "/");
  }, ["/", "pathname"], ["@", "auth", 1], [NaN, "host", void 0, 1, 1], [/:(\d+)$/, "port", void 0, 1], [NaN, "hostname", void 0, 1, 1]],
      C = {
    hash: 1,
    query: 1
  };

  function D(a) {
    var b = ("undefined" !== typeof window ? window : "undefined" !== typeof r ? r : "undefined" !== typeof self ? self : {}).location || {};
    a = a || b;
    b = {};
    var d = typeof a,
        c;
    if ("blob:" === a.protocol) b = new E(unescape(a.pathname), {});else if ("string" === d) for (c in b = new E(a, {}), C) delete b[c];else if ("object" === d) {
      for (c in a) c in C || (b[c] = a[c]);

      void 0 === b.slashes && (b.slashes = x.test(a.href));
    }
    return b;
  }

  function F(a) {
    a = A(a);
    a = y.exec(a);
    return {
      protocol: a[1] ? a[1].toLowerCase() : "",
      slashes: !!a[2],
      rest: a[3]
    };
  }

  function E(a, b, d) {
    a = A(a);
    if (!(this instanceof E)) return new E(a, b, d);
    var c = B.slice();
    var e = typeof b;
    var k = 0;
    "object" !== e && "string" !== e && (d = b, b = null);
    d && "function" !== typeof d && (d = w.parse);
    b = D(b);
    var g = F(a || "");
    e = !g.protocol && !g.slashes;
    this.slashes = g.slashes || e && b.slashes;
    this.protocol = g.protocol || b.protocol || "";
    a = g.rest;

    for (g.slashes || (c[3] = [/(.*)/, "pathname"]); k < c.length; k++) if (g = c[k], "function" === typeof g) a = g(a);else {
      var h = g[0];
      var f = g[1];
      if (h !== h) this[f] = a;else if ("string" === typeof h) ~(h = a.indexOf(h)) && ("number" === typeof g[2] ? (this[f] = a.slice(0, h), a = a.slice(h + g[2])) : (this[f] = a.slice(h), a = a.slice(0, h)));else if (h = h.exec(a)) this[f] = h[1], a = a.slice(0, h.index);
      this[f] = this[f] || (e && g[3] ? b[f] || "" : "");
      g[4] && (this[f] = this[f].toLowerCase());
    }

    d && (this.query = d(this.query));

    if (e && b.slashes && "/" !== this.pathname.charAt(0) && ("" !== this.pathname || "" !== b.pathname)) {
      a = this.pathname;
      b = b.pathname;

      if ("" !== a) {
        b = (b || "/").split("/").slice(0, -1).concat(a.split("/"));
        a = b.length;
        d = b[a - 1];
        c = !1;

        for (k = 0; a--;) "." === b[a] ? b.splice(a, 1) : ".." === b[a] ? (b.splice(a, 1), k++) : k && (0 === a && (c = !0), b.splice(a, 1), k--);

        c && b.unshift("");
        "." !== d && ".." !== d || b.push("");
        b = b.join("/");
      }

      this.pathname = b;
    }

    t(this.port, this.protocol) || (this.host = this.hostname, this.port = "");
    this.username = this.password = "";
    this.auth && (g = this.auth.split(":"), this.username = g[0] || "", this.password = g[1] || "");
    this.origin = this.protocol && this.host && "file:" !== this.protocol ? this.protocol + "//" + this.host : "null";
    this.href = this.toString();
  }

  E.prototype = {
    set: function (a, b, d) {
      switch (a) {
        case "query":
          "string" === typeof b && b.length && (b = (d || w.parse)(b));
          this[a] = b;
          break;

        case "port":
          this[a] = b;
          t(b, this.protocol) ? b && (this.host = this.hostname + ":" + b) : (this.host = this.hostname, this[a] = "");
          break;

        case "hostname":
          this[a] = b;
          this.port && (b += ":" + this.port);
          this.host = b;
          break;

        case "host":
          this[a] = b;
          /:\d+$/.test(b) ? (b = b.split(":"), this.port = b.pop(), this.hostname = b.join(":")) : (this.hostname = b, this.port = "");
          break;

        case "protocol":
          this.protocol = b.toLowerCase();
          this.slashes = !d;
          break;

        case "pathname":
        case "hash":
          b ? (d = "pathname" === a ? "/" : "#", this[a] = b.charAt(0) !== d ? d + b : b) : this[a] = b;
          break;

        default:
          this[a] = b;
      }

      for (a = 0; a < B.length; a++) b = B[a], b[4] && (this[b[1]] = this[b[1]].toLowerCase());

      this.origin = this.protocol && this.host && "file:" !== this.protocol ? this.protocol + "//" + this.host : "null";
      this.href = this.toString();
      return this;
    },
    toString: function (a) {
      a && "function" === typeof a || (a = w.stringify);
      var b = this.protocol;
      b && ":" !== b.charAt(b.length - 1) && (b += ":");
      b += this.slashes ? "//" : "";
      this.username && (b += this.username, this.password && (b += ":" + this.password), b += "@");
      b += this.host + this.pathname;
      (a = "object" === typeof this.query ? a(this.query) : this.query) && (b += "?" !== a.charAt(0) ? "?" + a : a);
      this.hash && (b += this.hash);
      return b;
    }
  };
  E.extractProtocol = F;
  E.location = D;
  E.trimLeft = A;
  E.qs = w;
  var G = E;
  let H = /^xn--/,
      I = /[^\0-\x7E]/,
      K = /[\x2E\u3002\uFF0E\uFF61]/g,
      L = {
    overflow: "Overflow: input needs wider integers to process",
    "not-basic": "Illegal input >= 0x80 (not a basic code point)",
    "invalid-input": "Invalid input"
  },
      M = Math.floor,
      N = String.fromCharCode;

  function O(a) {
    throw new RangeError(L[a]);
  }

  function P(a, b) {
    var d = a.split("@");
    let c = "";
    1 < d.length && (c = d[0] + "@", a = d[1]);
    a = a.replace(K, ".");
    {
      a = a.split(".");
      d = [];
      let c = a.length;

      for (; c--;) d[c] = b(a[c]);

      b = d;
    }
    b = b.join(".");
    return c + b;
  }

  function Q(a) {
    let b = [],
        d = 0,
        c = a.length;

    for (; d < c;) {
      let e = a.charCodeAt(d++);

      if (55296 <= e && 56319 >= e && d < c) {
        let c = a.charCodeAt(d++);
        56320 == (c & 64512) ? b.push(((e & 1023) << 10) + (c & 1023) + 65536) : (b.push(e), d--);
      } else b.push(e);
    }

    return b;
  }

  function R(a, b) {
    return a + 22 + 75 * (26 > a) - ((0 != b) << 5);
  }

  function S(a, b, d) {
    let c = 0;
    a = d ? M(a / 700) : a >> 1;

    for (a += M(a / b); 455 < a; c += 36) a = M(a / 35);

    return M(c + 36 * a / (a + 38));
  }

  function T(a) {
    const b = [],
          d = a.length;
    let c = 0,
        e = 128,
        k = 72;
    var g = a.lastIndexOf("-");
    0 > g && (g = 0);

    for (var h = 0; h < g; ++h) 128 <= a.charCodeAt(h) && O("not-basic"), b.push(a.charCodeAt(h));

    for (g = 0 < g ? g + 1 : 0; g < d;) {
      h = c;

      for (let b = 1, e = 36;; e += 36) {
        g >= d && O("invalid-input");
        var f = a.charCodeAt(g++);
        f = 10 > f - 48 ? f - 22 : 26 > f - 65 ? f - 65 : 26 > f - 97 ? f - 97 : 36;
        (36 <= f || f > M((2147483647 - c) / b)) && O("overflow");
        c += f * b;
        const h = e <= k ? 1 : e >= k + 26 ? 26 : e - k;
        if (f < h) break;
        f = 36 - h;
        b > M(2147483647 / f) && O("overflow");
        b *= f;
      }

      f = b.length + 1;
      k = S(c - h, f, 0 == h);
      M(c / f) > 2147483647 - e && O("overflow");
      e += M(c / f);
      c %= f;
      b.splice(c++, 0, e);
    }

    return String.fromCodePoint(...b);
  }

  function U(a) {
    const b = [];
    a = Q(a);
    let d = a.length,
        c = 128,
        e = 0,
        k = 72;

    for (var g of a) 128 > g && b.push(N(g));

    let h = g = b.length;

    for (g && b.push("-"); h < d;) {
      var f = 2147483647;

      for (const b of a) b >= c && b < f && (f = b);

      const d = h + 1;
      f - c > M((2147483647 - e) / d) && O("overflow");
      e += (f - c) * d;
      c = f;

      for (const J of a) if (J < c && 2147483647 < ++e && O("overflow"), J == c) {
        var p = e;

        for (f = 36;; f += 36) {
          const a = f <= k ? 1 : f >= k + 26 ? 26 : f - k;
          if (p < a) break;
          p -= a;
          const c = 36 - a;
          b.push(N(R(a + p % c, 0)));
          p = M(p / c);
        }

        b.push(N(R(p, 0)));
        k = S(e, d, h == g);
        e = 0;
        ++h;
      }

      ++e;
      ++c;
    }

    return b.join("");
  }

  let V = {
    version: "2.1.0",
    ucs2: {
      decode: Q,
      encode: a => String.fromCodePoint(...a)
    },
    decode: T,
    encode: U,
    toASCII: function (a) {
      return P(a, function (a) {
        return I.test(a) ? "xn--" + U(a) : a;
      });
    },
    toUnicode: function (a) {
      return P(a, function (a) {
        return H.test(a) ? T(a.slice(4).toLowerCase()) : a;
      });
    }
  };

  function W(a) {
    a = new TextEncoder("utf-8").encode(a);
    return crypto.subtle.digest("SHA-256", a).then(a => {
      var b = [];
      a = new DataView(a);

      for (let c = 0; c < a.byteLength; c += 4) {
        let d = ("00000000" + a.getUint32(c).toString(16)).slice(-8);
        b.push(d);
      }

      return b = b.join("");
    });
  }

  let aa = /[A-Za-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02b8\u0300-\u0590\u0800-\u1fff\u200e\u2c00-\ufb1c\ufe00-\ufe6f\ufefd-\uffff]/,
      ba = /[\u0591-\u06ef\u06fa-\u07ff\u200f\ufb1d-\ufdff\ufe70-\ufefc]/;

  function X(a) {
    a = new G(a).hostname;
    var b = V.toUnicode(a);
    return (b = 63 >= a.length && !(aa.test(b) && ba.test(b)) && -1 != a.indexOf(".")) ? (b = V.toUnicode(a), b = b.split("-").join("--"), b = b.split(".").join("-"), b = V.toASCII(b).toLowerCase(), 63 < b.length ? Y(a) : Promise.resolve(b)) : Y(a);
  }

  function Y(a) {
    a = "undefined" !== typeof window ? W(a) : void 0;
    return a.then(a => ca("ffffffffff" + a + "000000").substr(8, Math.ceil(4 * a.length / 5)));
  }

  function ca(a) {
    let b = [];
    a.match(/.{1,2}/g).forEach((a, c) => {
      b[c] = parseInt(a, 16);
    });
    var d = b.length % 5,
        c = Math.floor(b.length / 5);
    a = [];

    if (0 != d) {
      for (var e = 0; e < 5 - d; e++) b += "\x00";

      c += 1;
    }

    for (e = 0; e < c; e++) a.push("abcdefghijklmnopqrstuvwxyz234567".charAt(b[5 * e] >> 3)), a.push("abcdefghijklmnopqrstuvwxyz234567".charAt((b[5 * e] & 7) << 2 | b[5 * e + 1] >> 6)), a.push("abcdefghijklmnopqrstuvwxyz234567".charAt((b[5 * e + 1] & 63) >> 1)), a.push("abcdefghijklmnopqrstuvwxyz234567".charAt((b[5 * e + 1] & 1) << 4 | b[5 * e + 2] >> 4)), a.push("abcdefghijklmnopqrstuvwxyz234567".charAt((b[5 * e + 2] & 15) << 1 | b[5 * e + 3] >> 7)), a.push("abcdefghijklmnopqrstuvwxyz234567".charAt((b[5 * e + 3] & 127) >> 2)), a.push("abcdefghijklmnopqrstuvwxyz234567".charAt((b[5 * e + 3] & 3) << 3 | b[5 * e + 4] >> 5)), a.push("abcdefghijklmnopqrstuvwxyz234567".charAt(b[5 * e + 4] & 31));

    c = 0;
    1 == d ? c = 6 : 2 == d ? c = 4 : 3 == d ? c = 3 : 4 == d && (c = 1);

    for (d = 0; d < c; d++) a.pop();

    for (d = 0; d < c; d++) a.push("=");

    return a.join("");
  }

  function Z(a, b) {
    let d = new G(b),
        c = da(d.pathname);
    c += "https:" === d.protocol ? "/s/" : "/";
    return X(d.toString()).then(e => {
      let k = new G(b);
      k.protocol = "https";
      e = e + "." + a;
      k.host = e;
      k.hostname = e;
      k.pathname = c + d.hostname + d.pathname;
      return k.toString();
    });
  }

  function da(a) {
    return m.isPathNameAnImage(a) ? "/i" : q.isPathNameAFont(a) ? "/r" : "/c";
  }

  var ampToolboxCacheUrl = {
    createCacheUrl: Z,
    createCurlsSubdomain: X
  };

  /**
   * Copyright 2017 The AMP HTML Authors. All Rights Reserved.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS-IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /** @private {string} The default AMP cache prefix to be used. */

  var DEFAULT_CACHE_AUTHORITY_ = 'cdn.ampproject.org';
  /**
   * The default JavaScript version to be used for AMP viewer URLs.
   * @private {string}
   */

  var DEFAULT_VIEWER_JS_VERSION_ = '0.1';
  /**
   * Constructs a Viewer cache url using these rules:
   * https://developers.google.com/amp/cache/overview
   * 
   * Example:
   * Input url 'http://ampproject.org' can return 
   * 'https://www-ampproject-org.cdn.ampproject.org/v/s/www.ampproject.org/?amp_js_v=0.1#origin=http%3A%2F%2Flocalhost%3A8000'
   * 
   * @param {string} url The complete publisher url.
   * @param {object} initParams Params containing origin, etc.
   * @param {string} opt_cacheUrlAuthority
   * @param {string} opt_viewerJsVersion
   * @return {!Promise<string>}
   * @private
   */

  function constructViewerCacheUrl(url, initParams, opt_cacheUrlAuthority, opt_viewerJsVersion) {
    return constructViewerCacheUrlOptions(url, false, initParams, opt_cacheUrlAuthority, opt_viewerJsVersion);
  }
  /**
   * Constructs a Viewer cache url using these rules:
   * https://developers.google.com/amp/cache/overview
   * 
   * Example:
   * Input url 'http://ampproject.org' can return 
   * 'https://www-ampproject-org.cdn.ampproject.org/v/s/www.ampproject.org/?amp_js_v=0.1#origin=http%3A%2F%2Flocalhost%3A8000'
   * 
   * @param {string} url The complete publisher url.
   * @param {object} initParams Params containing origin, etc.
   * @param {boolean} isNative Whether or not the url generated follows rules for native viewers (like AMPKit)
   * @param {string} opt_cacheUrlAuthority
   * @param {string} opt_viewerJsVersion
   * @return {!Promise<string>}
   * @private
   */

  function constructViewerCacheUrlOptions(url, isNative, initParams, opt_cacheUrlAuthority, opt_viewerJsVersion) {
    var parsedUrl = parseUrl(url);
    var protocolStr = parsedUrl.protocol == 'https:' ? 's/' : '';
    var viewerJsVersion = opt_viewerJsVersion ? opt_viewerJsVersion : DEFAULT_VIEWER_JS_VERSION_;
    var search = parsedUrl.search ? parsedUrl.search + '&' : '?';
    var pathType = isNative ? '/c/' : '/v/';
    var ampJSVersion = isNative ? '' : 'amp_js_v=' + viewerJsVersion;
    var urlProtocolAndHost = parsedUrl.protocol + '//' + parsedUrl.host;
    return new Promise(function (resolve) {
      constructCacheDomainUrl_(urlProtocolAndHost, opt_cacheUrlAuthority).then(function (cacheDomain) {
        resolve('https://' + cacheDomain + pathType + protocolStr + parsedUrl.host + parsedUrl.pathname + search + ampJSVersion + '#' + paramsToString_(initParams));
      });
    });
  }
  /**
   * Constructs a cache domain url. For example:
   * 
   * Input url 'http://ampproject.org'
   * will return  'https://www-ampproject-org.cdn.ampproject.org'
   * 
   * @param {string} url The complete publisher url.
   * @param {string} opt_cacheUrlAuthority
   * @return {!Promise<string>}
   * @private
   */


  function constructCacheDomainUrl_(url, opt_cacheUrlAuthority) {
    return new Promise(function (resolve) {
      var cacheUrlAuthority = opt_cacheUrlAuthority ? opt_cacheUrlAuthority : DEFAULT_CACHE_AUTHORITY_;
      ampToolboxCacheUrl.createCurlsSubdomain(url).then(function (curlsSubdomain) {
        resolve(curlsSubdomain + '.' + cacheUrlAuthority);
      });
    });
  }
  /**
   * Takes an object such as:
   * {
   *   origin: "http://localhost:8000",
   *   prerenderSize: 1
   * } 
   * and converts it to: "origin=http%3A%2F%2Flocalhost%3A8000&prerenderSize=1"
   * 
   * @param {object} params
   * @return {string}
   * @private
   */


  function paramsToString_(params) {
    var str = '';

    for (var key in params) {
      var value = params[key];

      if (value === null || value === undefined) {
        continue;
      }

      if (str.length > 0) {
        str += '&';
      }

      str += encodeURIComponent(key) + '=' + encodeURIComponent(value);
    }

    return str;
  }

  /**
   * Copyright 2017 The AMP HTML Authors. All Rights Reserved.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS-IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * This file is a Viewer for AMP Documents.
   */

  var Viewer =
  /*#__PURE__*/
  function () {
    /**
     * @param {!Element} hostElement the element to attatch the iframe to.
     * @param {string} ampDocUrl the AMP Document url.
     * @param {string} opt_referrer
     * @param {boolean|undefined} opt_prerender
     */
    function Viewer(hostElement, ampDocUrl, opt_referrer, opt_prerender) {
      /** @private {ViewerMessaging} */
      this.viewerMessaging_ = null;
      /** @private {!Element} */

      this.hostElement_ = hostElement;
      /** @private {string} */

      this.ampDocUrl_ = ampDocUrl;
      /** @private {string} */

      this.referrer_ = opt_referrer;
      /** @private {boolean|undefined} */

      this.prerender_ = opt_prerender;
      /** @private {?Element} */

      this.iframe_ = null;
      /** @private {!History} */

      this.history_ = new History(this.handleChangeHistoryState_.bind(this));
    }
    /**
     * @param {!Function} showViewer method that shows the viewer.
     * @param {!Function} hideViewer method that hides the viewer.
     * @param {!function():boolean} isViewerHidden method that determines if viewer is hidden.
     */


    var _proto = Viewer.prototype;

    _proto.setViewerShowAndHide = function setViewerShowAndHide(showViewer, hideViewer, isViewerHidden) {
      /** @private {!Function} */
      this.showViewer_ = showViewer;
      /** @private {!Function} */

      this.hideViewer_ = hideViewer;
      /** @private {!Function} */

      this.isViewerHidden_ = isViewerHidden;
    }
    /**
     * @return {boolean} true if the viewer has already been loaded.
     * @private
     */
    ;

    _proto.isLoaded_ = function isLoaded_() {
      return !!this.iframe_ && !!this.viewerMessaging_;
    }
    /**
     * Attaches the AMP Doc Iframe to the Host Element.
     */
    ;

    _proto.attach = function attach() {
      var _this = this;

      this.iframe_ = document.createElement('iframe'); // TODO (chenshay): iframe_.setAttribute('scrolling', 'no')
      // to enable the scrolling workarounds for iOS.

      this.buildIframeSrc_().then(function (ampDocCachedUrl) {
        _this.viewerMessaging_ = new ViewerMessaging(window, _this.iframe_, parseUrl(ampDocCachedUrl).origin, _this.messageHandler_.bind(_this));

        _this.viewerMessaging_.start().then(function () {
          log('this.viewerMessaging_.start() Promise resolved !!!');
        });

        _this.iframe_.src = ampDocCachedUrl;

        _this.hostElement_.appendChild(_this.iframe_);

        _this.history_.pushState(_this.ampDocUrl_);
      });
    }
    /**
     * @return {!Promise<string>}
     */
    ;

    _proto.buildIframeSrc_ = function buildIframeSrc_() {
      var _this2 = this;

      return new Promise(function (resolve) {
        constructViewerCacheUrl(_this2.ampDocUrl_, _this2.createInitParams_()).then(function (viewerCacheUrl) {
          resolve(viewerCacheUrl);
        });
      });
    }
    /**
     * Computes the init params that will be used to create the AMP Cache URL.
     * @return {object} the init params.
     * @private
     */
    ;

    _proto.createInitParams_ = function createInitParams_() {
      var parsedViewerUrl = parseUrl(window.location.href);
      var initParams = {
        'origin': parsedViewerUrl.origin,
        'cap': 'history'
      };
      if (this.referrer_) initParams['referrer'] = this.referrer_;

      if (this.prerender_) {
        initParams['visibilityState'] = 'prerender';
        initParams['prerenderSize'] = 1;
      }

      return initParams;
    }
    /**
     * Detaches the AMP Doc Iframe from the Host Element 
     * and calls the hideViewer method.
     */
    ;

    _proto.unAttach = function unAttach() {
      if (this.hideViewer_) this.hideViewer_();
      this.hostElement_.removeChild(this.iframe_);
      this.iframe_ = null;
      this.viewerMessaging_ = null;
    }
    /**
     * @param {boolean} isLastBack true if back button was hit and viewer should hide.
     * @param {boolean} isAMP true if going to AMP document.
     * @private
      */
    ;

    _proto.handleChangeHistoryState_ = function handleChangeHistoryState_(isLastBack, isAMP) {
      if (isLastBack) {
        if (this.hideViewer_) this.hideViewer_();
        return;
      }

      if (isAMP && this.showViewer_ && this.isViewerHidden_ && this.isViewerHidden_()) {
        this.showViewer_();
      }
    }
    /**
     * Place holder message handler. 
     * @param {string} name
     * @param {*} data
     * @param {boolean} rsvp
     * @return {!Promise<*>|undefined}
     * @private
     */
    ;

    _proto.messageHandler_ = function messageHandler_(name, data, rsvp) {
      log('messageHandler: ', name, data, rsvp);

      switch (name) {
        case 'pushHistory':
          this.history_.pushState(this.ampDocUrl_, data);
          return Promise.resolve();

        case 'popHistory':
          this.history_.goBack();
          return Promise.resolve();

        case 'cancelFullOverlay':
        case 'documentLoaded':
        case 'documentHeight':
        case 'prerenderComplete':
        case 'requestFullOverlay':
        case 'scroll':
          return Promise.resolve();

        default:
          return Promise.reject(name + ' Message is not supported!');
      }
    };

    return Viewer;
  }();

  window.Viewer = Viewer;

}());
