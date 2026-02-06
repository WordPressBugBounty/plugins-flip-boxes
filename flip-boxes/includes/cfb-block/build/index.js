/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@emotion/cache/dist/emotion-cache.browser.esm.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@emotion/cache/dist/emotion-cache.browser.esm.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ createCache)
/* harmony export */ });
/* harmony import */ var _emotion_sheet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/sheet */ "./node_modules/@emotion/sheet/dist/emotion-sheet.browser.esm.js");
/* harmony import */ var stylis__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! stylis */ "./node_modules/stylis/src/Tokenizer.js");
/* harmony import */ var stylis__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! stylis */ "./node_modules/stylis/src/Utility.js");
/* harmony import */ var stylis__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! stylis */ "./node_modules/stylis/src/Enum.js");
/* harmony import */ var stylis__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! stylis */ "./node_modules/stylis/src/Serializer.js");
/* harmony import */ var stylis__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! stylis */ "./node_modules/stylis/src/Middleware.js");
/* harmony import */ var stylis__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! stylis */ "./node_modules/stylis/src/Parser.js");
/* harmony import */ var _emotion_weak_memoize__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @emotion/weak-memoize */ "./node_modules/@emotion/weak-memoize/dist/emotion-weak-memoize.esm.js");
/* harmony import */ var _emotion_memoize__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @emotion/memoize */ "./node_modules/@emotion/memoize/dist/emotion-memoize.esm.js");





var identifierWithPointTracking = function identifierWithPointTracking(begin, points, index) {
  var previous = 0;
  var character = 0;

  while (true) {
    previous = character;
    character = (0,stylis__WEBPACK_IMPORTED_MODULE_3__.peek)(); // &\f

    if (previous === 38 && character === 12) {
      points[index] = 1;
    }

    if ((0,stylis__WEBPACK_IMPORTED_MODULE_3__.token)(character)) {
      break;
    }

    (0,stylis__WEBPACK_IMPORTED_MODULE_3__.next)();
  }

  return (0,stylis__WEBPACK_IMPORTED_MODULE_3__.slice)(begin, stylis__WEBPACK_IMPORTED_MODULE_3__.position);
};

var toRules = function toRules(parsed, points) {
  // pretend we've started with a comma
  var index = -1;
  var character = 44;

  do {
    switch ((0,stylis__WEBPACK_IMPORTED_MODULE_3__.token)(character)) {
      case 0:
        // &\f
        if (character === 38 && (0,stylis__WEBPACK_IMPORTED_MODULE_3__.peek)() === 12) {
          // this is not 100% correct, we don't account for literal sequences here - like for example quoted strings
          // stylis inserts \f after & to know when & where it should replace this sequence with the context selector
          // and when it should just concatenate the outer and inner selectors
          // it's very unlikely for this sequence to actually appear in a different context, so we just leverage this fact here
          points[index] = 1;
        }

        parsed[index] += identifierWithPointTracking(stylis__WEBPACK_IMPORTED_MODULE_3__.position - 1, points, index);
        break;

      case 2:
        parsed[index] += (0,stylis__WEBPACK_IMPORTED_MODULE_3__.delimit)(character);
        break;

      case 4:
        // comma
        if (character === 44) {
          // colon
          parsed[++index] = (0,stylis__WEBPACK_IMPORTED_MODULE_3__.peek)() === 58 ? '&\f' : '';
          points[index] = parsed[index].length;
          break;
        }

      // fallthrough

      default:
        parsed[index] += (0,stylis__WEBPACK_IMPORTED_MODULE_4__.from)(character);
    }
  } while (character = (0,stylis__WEBPACK_IMPORTED_MODULE_3__.next)());

  return parsed;
};

var getRules = function getRules(value, points) {
  return (0,stylis__WEBPACK_IMPORTED_MODULE_3__.dealloc)(toRules((0,stylis__WEBPACK_IMPORTED_MODULE_3__.alloc)(value), points));
}; // WeakSet would be more appropriate, but only WeakMap is supported in IE11


var fixedElements = /* #__PURE__ */new WeakMap();
var compat = function compat(element) {
  if (element.type !== 'rule' || !element.parent || // positive .length indicates that this rule contains pseudo
  // negative .length indicates that this rule has been already prefixed
  element.length < 1) {
    return;
  }

  var value = element.value,
      parent = element.parent;
  var isImplicitRule = element.column === parent.column && element.line === parent.line;

  while (parent.type !== 'rule') {
    parent = parent.parent;
    if (!parent) return;
  } // short-circuit for the simplest case


  if (element.props.length === 1 && value.charCodeAt(0) !== 58
  /* colon */
  && !fixedElements.get(parent)) {
    return;
  } // if this is an implicitly inserted rule (the one eagerly inserted at the each new nested level)
  // then the props has already been manipulated beforehand as they that array is shared between it and its "rule parent"


  if (isImplicitRule) {
    return;
  }

  fixedElements.set(element, true);
  var points = [];
  var rules = getRules(value, points);
  var parentRules = parent.props;

  for (var i = 0, k = 0; i < rules.length; i++) {
    for (var j = 0; j < parentRules.length; j++, k++) {
      element.props[k] = points[i] ? rules[i].replace(/&\f/g, parentRules[j]) : parentRules[j] + " " + rules[i];
    }
  }
};
var removeLabel = function removeLabel(element) {
  if (element.type === 'decl') {
    var value = element.value;

    if ( // charcode for l
    value.charCodeAt(0) === 108 && // charcode for b
    value.charCodeAt(2) === 98) {
      // this ignores label
      element["return"] = '';
      element.value = '';
    }
  }
};
var ignoreFlag = 'emotion-disable-server-rendering-unsafe-selector-warning-please-do-not-use-this-the-warning-exists-for-a-reason';

var isIgnoringComment = function isIgnoringComment(element) {
  return element.type === 'comm' && element.children.indexOf(ignoreFlag) > -1;
};

var createUnsafeSelectorsAlarm = function createUnsafeSelectorsAlarm(cache) {
  return function (element, index, children) {
    if (element.type !== 'rule' || cache.compat) return;
    var unsafePseudoClasses = element.value.match(/(:first|:nth|:nth-last)-child/g);

    if (unsafePseudoClasses) {
      var isNested = !!element.parent; // in nested rules comments become children of the "auto-inserted" rule and that's always the `element.parent`
      //
      // considering this input:
      // .a {
      //   .b /* comm */ {}
      //   color: hotpink;
      // }
      // we get output corresponding to this:
      // .a {
      //   & {
      //     /* comm */
      //     color: hotpink;
      //   }
      //   .b {}
      // }

      var commentContainer = isNested ? element.parent.children : // global rule at the root level
      children;

      for (var i = commentContainer.length - 1; i >= 0; i--) {
        var node = commentContainer[i];

        if (node.line < element.line) {
          break;
        } // it is quite weird but comments are *usually* put at `column: element.column - 1`
        // so we seek *from the end* for the node that is earlier than the rule's `element` and check that
        // this will also match inputs like this:
        // .a {
        //   /* comm */
        //   .b {}
        // }
        //
        // but that is fine
        //
        // it would be the easiest to change the placement of the comment to be the first child of the rule:
        // .a {
        //   .b { /* comm */ }
        // }
        // with such inputs we wouldn't have to search for the comment at all
        // TODO: consider changing this comment placement in the next major version


        if (node.column < element.column) {
          if (isIgnoringComment(node)) {
            return;
          }

          break;
        }
      }

      unsafePseudoClasses.forEach(function (unsafePseudoClass) {
        console.error("The pseudo class \"" + unsafePseudoClass + "\" is potentially unsafe when doing server-side rendering. Try changing it to \"" + unsafePseudoClass.split('-child')[0] + "-of-type\".");
      });
    }
  };
};

var isImportRule = function isImportRule(element) {
  return element.type.charCodeAt(1) === 105 && element.type.charCodeAt(0) === 64;
};

var isPrependedWithRegularRules = function isPrependedWithRegularRules(index, children) {
  for (var i = index - 1; i >= 0; i--) {
    if (!isImportRule(children[i])) {
      return true;
    }
  }

  return false;
}; // use this to remove incorrect elements from further processing
// so they don't get handed to the `sheet` (or anything else)
// as that could potentially lead to additional logs which in turn could be overhelming to the user


var nullifyElement = function nullifyElement(element) {
  element.type = '';
  element.value = '';
  element["return"] = '';
  element.children = '';
  element.props = '';
};

var incorrectImportAlarm = function incorrectImportAlarm(element, index, children) {
  if (!isImportRule(element)) {
    return;
  }

  if (element.parent) {
    console.error("`@import` rules can't be nested inside other rules. Please move it to the top level and put it before regular rules. Keep in mind that they can only be used within global styles.");
    nullifyElement(element);
  } else if (isPrependedWithRegularRules(index, children)) {
    console.error("`@import` rules can't be after other rules. Please put your `@import` rules before your other rules.");
    nullifyElement(element);
  }
};

/* eslint-disable no-fallthrough */

function prefix(value, length) {
  switch ((0,stylis__WEBPACK_IMPORTED_MODULE_4__.hash)(value, length)) {
    // color-adjust
    case 5103:
      return stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + 'print-' + value + value;
    // animation, animation-(delay|direction|duration|fill-mode|iteration-count|name|play-state|timing-function)

    case 5737:
    case 4201:
    case 3177:
    case 3433:
    case 1641:
    case 4457:
    case 2921: // text-decoration, filter, clip-path, backface-visibility, column, box-decoration-break

    case 5572:
    case 6356:
    case 5844:
    case 3191:
    case 6645:
    case 3005: // mask, mask-image, mask-(mode|clip|size), mask-(repeat|origin), mask-position, mask-composite,

    case 6391:
    case 5879:
    case 5623:
    case 6135:
    case 4599:
    case 4855: // background-clip, columns, column-(count|fill|gap|rule|rule-color|rule-style|rule-width|span|width)

    case 4215:
    case 6389:
    case 5109:
    case 5365:
    case 5621:
    case 3829:
      return stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + value + value;
    // appearance, user-select, transform, hyphens, text-size-adjust

    case 5349:
    case 4246:
    case 4810:
    case 6968:
    case 2756:
      return stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_5__.MOZ + value + stylis__WEBPACK_IMPORTED_MODULE_5__.MS + value + value;
    // flex, flex-direction

    case 6828:
    case 4268:
      return stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_5__.MS + value + value;
    // order

    case 6165:
      return stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_5__.MS + 'flex-' + value + value;
    // align-items

    case 5187:
      return stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + value + (0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, /(\w+).+(:[^]+)/, stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + 'box-$1$2' + stylis__WEBPACK_IMPORTED_MODULE_5__.MS + 'flex-$1$2') + value;
    // align-self

    case 5443:
      return stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_5__.MS + 'flex-item-' + (0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, /flex-|-self/, '') + value;
    // align-content

    case 4675:
      return stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_5__.MS + 'flex-line-pack' + (0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, /align-content|flex-|-self/, '') + value;
    // flex-shrink

    case 5548:
      return stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_5__.MS + (0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, 'shrink', 'negative') + value;
    // flex-basis

    case 5292:
      return stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_5__.MS + (0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, 'basis', 'preferred-size') + value;
    // flex-grow

    case 6060:
      return stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + 'box-' + (0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, '-grow', '') + stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_5__.MS + (0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, 'grow', 'positive') + value;
    // transition

    case 4554:
      return stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + (0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, /([^-])(transform)/g, '$1' + stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + '$2') + value;
    // cursor

    case 6187:
      return (0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)((0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)((0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, /(zoom-|grab)/, stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + '$1'), /(image-set)/, stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + '$1'), value, '') + value;
    // background, background-image

    case 5495:
    case 3959:
      return (0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, /(image-set\([^]*)/, stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + '$1' + '$`$1');
    // justify-content

    case 4968:
      return (0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)((0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, /(.+:)(flex-)?(.*)/, stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + 'box-pack:$3' + stylis__WEBPACK_IMPORTED_MODULE_5__.MS + 'flex-pack:$3'), /s.+-b[^;]+/, 'justify') + stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + value + value;
    // (margin|padding)-inline-(start|end)

    case 4095:
    case 3583:
    case 4068:
    case 2532:
      return (0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, /(.+)-inline(.+)/, stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + '$1$2') + value;
    // (min|max)?(width|height|inline-size|block-size)

    case 8116:
    case 7059:
    case 5753:
    case 5535:
    case 5445:
    case 5701:
    case 4933:
    case 4677:
    case 5533:
    case 5789:
    case 5021:
    case 4765:
      // stretch, max-content, min-content, fill-available
      if ((0,stylis__WEBPACK_IMPORTED_MODULE_4__.strlen)(value) - 1 - length > 6) switch ((0,stylis__WEBPACK_IMPORTED_MODULE_4__.charat)(value, length + 1)) {
        // (m)ax-content, (m)in-content
        case 109:
          // -
          if ((0,stylis__WEBPACK_IMPORTED_MODULE_4__.charat)(value, length + 4) !== 45) break;
        // (f)ill-available, (f)it-content

        case 102:
          return (0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, /(.+:)(.+)-([^]+)/, '$1' + stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + '$2-$3' + '$1' + stylis__WEBPACK_IMPORTED_MODULE_5__.MOZ + ((0,stylis__WEBPACK_IMPORTED_MODULE_4__.charat)(value, length + 3) == 108 ? '$3' : '$2-$3')) + value;
        // (s)tretch

        case 115:
          return ~(0,stylis__WEBPACK_IMPORTED_MODULE_4__.indexof)(value, 'stretch') ? prefix((0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, 'stretch', 'fill-available'), length) + value : value;
      }
      break;
    // position: sticky

    case 4949:
      // (s)ticky?
      if ((0,stylis__WEBPACK_IMPORTED_MODULE_4__.charat)(value, length + 1) !== 115) break;
    // display: (flex|inline-flex)

    case 6444:
      switch ((0,stylis__WEBPACK_IMPORTED_MODULE_4__.charat)(value, (0,stylis__WEBPACK_IMPORTED_MODULE_4__.strlen)(value) - 3 - (~(0,stylis__WEBPACK_IMPORTED_MODULE_4__.indexof)(value, '!important') && 10))) {
        // stic(k)y
        case 107:
          return (0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, ':', ':' + stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT) + value;
        // (inline-)?fl(e)x

        case 101:
          return (0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, /(.+:)([^;!]+)(;|!.+)?/, '$1' + stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + ((0,stylis__WEBPACK_IMPORTED_MODULE_4__.charat)(value, 14) === 45 ? 'inline-' : '') + 'box$3' + '$1' + stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + '$2$3' + '$1' + stylis__WEBPACK_IMPORTED_MODULE_5__.MS + '$2box$3') + value;
      }

      break;
    // writing-mode

    case 5936:
      switch ((0,stylis__WEBPACK_IMPORTED_MODULE_4__.charat)(value, length + 11)) {
        // vertical-l(r)
        case 114:
          return stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_5__.MS + (0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, /[svh]\w+-[tblr]{2}/, 'tb') + value;
        // vertical-r(l)

        case 108:
          return stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_5__.MS + (0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, /[svh]\w+-[tblr]{2}/, 'tb-rl') + value;
        // horizontal(-)tb

        case 45:
          return stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_5__.MS + (0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, /[svh]\w+-[tblr]{2}/, 'lr') + value;
      }

      return stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_5__.MS + value + value;
  }

  return value;
}

var prefixer = function prefixer(element, index, children, callback) {
  if (element.length > -1) if (!element["return"]) switch (element.type) {
    case stylis__WEBPACK_IMPORTED_MODULE_5__.DECLARATION:
      element["return"] = prefix(element.value, element.length);
      break;

    case stylis__WEBPACK_IMPORTED_MODULE_5__.KEYFRAMES:
      return (0,stylis__WEBPACK_IMPORTED_MODULE_6__.serialize)([(0,stylis__WEBPACK_IMPORTED_MODULE_3__.copy)(element, {
        value: (0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(element.value, '@', '@' + stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT)
      })], callback);

    case stylis__WEBPACK_IMPORTED_MODULE_5__.RULESET:
      if (element.length) return (0,stylis__WEBPACK_IMPORTED_MODULE_4__.combine)(element.props, function (value) {
        switch ((0,stylis__WEBPACK_IMPORTED_MODULE_4__.match)(value, /(::plac\w+|:read-\w+)/)) {
          // :read-(only|write)
          case ':read-only':
          case ':read-write':
            return (0,stylis__WEBPACK_IMPORTED_MODULE_6__.serialize)([(0,stylis__WEBPACK_IMPORTED_MODULE_3__.copy)(element, {
              props: [(0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, /:(read-\w+)/, ':' + stylis__WEBPACK_IMPORTED_MODULE_5__.MOZ + '$1')]
            })], callback);
          // :placeholder

          case '::placeholder':
            return (0,stylis__WEBPACK_IMPORTED_MODULE_6__.serialize)([(0,stylis__WEBPACK_IMPORTED_MODULE_3__.copy)(element, {
              props: [(0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, /:(plac\w+)/, ':' + stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + 'input-$1')]
            }), (0,stylis__WEBPACK_IMPORTED_MODULE_3__.copy)(element, {
              props: [(0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, /:(plac\w+)/, ':' + stylis__WEBPACK_IMPORTED_MODULE_5__.MOZ + '$1')]
            }), (0,stylis__WEBPACK_IMPORTED_MODULE_3__.copy)(element, {
              props: [(0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, /:(plac\w+)/, stylis__WEBPACK_IMPORTED_MODULE_5__.MS + 'input-$1')]
            })], callback);
        }

        return '';
      });
  }
};

var defaultStylisPlugins = [prefixer];

var createCache = function createCache(options) {
  var key = options.key;

  if ( true && !key) {
    throw new Error("You have to configure `key` for your cache. Please make sure it's unique (and not equal to 'css') as it's used for linking styles to your cache.\n" + "If multiple caches share the same key they might \"fight\" for each other's style elements.");
  }

  if (key === 'css') {
    var ssrStyles = document.querySelectorAll("style[data-emotion]:not([data-s])"); // get SSRed styles out of the way of React's hydration
    // document.head is a safe place to move them to(though note document.head is not necessarily the last place they will be)
    // note this very very intentionally targets all style elements regardless of the key to ensure
    // that creating a cache works inside of render of a React component

    Array.prototype.forEach.call(ssrStyles, function (node) {
      // we want to only move elements which have a space in the data-emotion attribute value
      // because that indicates that it is an Emotion 11 server-side rendered style elements
      // while we will already ignore Emotion 11 client-side inserted styles because of the :not([data-s]) part in the selector
      // Emotion 10 client-side inserted styles did not have data-s (but importantly did not have a space in their data-emotion attributes)
      // so checking for the space ensures that loading Emotion 11 after Emotion 10 has inserted some styles
      // will not result in the Emotion 10 styles being destroyed
      var dataEmotionAttribute = node.getAttribute('data-emotion');

      if (dataEmotionAttribute.indexOf(' ') === -1) {
        return;
      }
      document.head.appendChild(node);
      node.setAttribute('data-s', '');
    });
  }

  var stylisPlugins = options.stylisPlugins || defaultStylisPlugins;

  if (true) {
    // $FlowFixMe
    if (/[^a-z-]/.test(key)) {
      throw new Error("Emotion key must only contain lower case alphabetical characters and - but \"" + key + "\" was passed");
    }
  }

  var inserted = {};
  var container;
  var nodesToHydrate = [];

  {
    container = options.container || document.head;
    Array.prototype.forEach.call( // this means we will ignore elements which don't have a space in them which
    // means that the style elements we're looking at are only Emotion 11 server-rendered style elements
    document.querySelectorAll("style[data-emotion^=\"" + key + " \"]"), function (node) {
      var attrib = node.getAttribute("data-emotion").split(' '); // $FlowFixMe

      for (var i = 1; i < attrib.length; i++) {
        inserted[attrib[i]] = true;
      }

      nodesToHydrate.push(node);
    });
  }

  var _insert;

  var omnipresentPlugins = [compat, removeLabel];

  if (true) {
    omnipresentPlugins.push(createUnsafeSelectorsAlarm({
      get compat() {
        return cache.compat;
      }

    }), incorrectImportAlarm);
  }

  {
    var currentSheet;
    var finalizingPlugins = [stylis__WEBPACK_IMPORTED_MODULE_6__.stringify,  true ? function (element) {
      if (!element.root) {
        if (element["return"]) {
          currentSheet.insert(element["return"]);
        } else if (element.value && element.type !== stylis__WEBPACK_IMPORTED_MODULE_5__.COMMENT) {
          // insert empty rule in non-production environments
          // so @emotion/jest can grab `key` from the (JS)DOM for caches without any rules inserted yet
          currentSheet.insert(element.value + "{}");
        }
      }
    } : 0];
    var serializer = (0,stylis__WEBPACK_IMPORTED_MODULE_7__.middleware)(omnipresentPlugins.concat(stylisPlugins, finalizingPlugins));

    var stylis = function stylis(styles) {
      return (0,stylis__WEBPACK_IMPORTED_MODULE_6__.serialize)((0,stylis__WEBPACK_IMPORTED_MODULE_8__.compile)(styles), serializer);
    };

    _insert = function insert(selector, serialized, sheet, shouldCache) {
      currentSheet = sheet;

      if ( true && serialized.map !== undefined) {
        currentSheet = {
          insert: function insert(rule) {
            sheet.insert(rule + serialized.map);
          }
        };
      }

      stylis(selector ? selector + "{" + serialized.styles + "}" : serialized.styles);

      if (shouldCache) {
        cache.inserted[serialized.name] = true;
      }
    };
  }

  var cache = {
    key: key,
    sheet: new _emotion_sheet__WEBPACK_IMPORTED_MODULE_0__.StyleSheet({
      key: key,
      container: container,
      nonce: options.nonce,
      speedy: options.speedy,
      prepend: options.prepend,
      insertionPoint: options.insertionPoint
    }),
    nonce: options.nonce,
    inserted: inserted,
    registered: {},
    insert: _insert
  };
  cache.sheet.hydrate(nodesToHydrate);
  return cache;
};




/***/ }),

/***/ "./node_modules/@emotion/hash/dist/emotion-hash.esm.js":
/*!*************************************************************!*\
  !*** ./node_modules/@emotion/hash/dist/emotion-hash.esm.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ murmur2)
/* harmony export */ });
/* eslint-disable */
// Inspired by https://github.com/garycourt/murmurhash-js
// Ported from https://github.com/aappleby/smhasher/blob/61a0530f28277f2e850bfc39600ce61d02b518de/src/MurmurHash2.cpp#L37-L86
function murmur2(str) {
  // 'm' and 'r' are mixing constants generated offline.
  // They're not really 'magic', they just happen to work well.
  // const m = 0x5bd1e995;
  // const r = 24;
  // Initialize the hash
  var h = 0; // Mix 4 bytes at a time into the hash

  var k,
      i = 0,
      len = str.length;

  for (; len >= 4; ++i, len -= 4) {
    k = str.charCodeAt(i) & 0xff | (str.charCodeAt(++i) & 0xff) << 8 | (str.charCodeAt(++i) & 0xff) << 16 | (str.charCodeAt(++i) & 0xff) << 24;
    k =
    /* Math.imul(k, m): */
    (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16);
    k ^=
    /* k >>> r: */
    k >>> 24;
    h =
    /* Math.imul(k, m): */
    (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16) ^
    /* Math.imul(h, m): */
    (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  } // Handle the last few bytes of the input array


  switch (len) {
    case 3:
      h ^= (str.charCodeAt(i + 2) & 0xff) << 16;

    case 2:
      h ^= (str.charCodeAt(i + 1) & 0xff) << 8;

    case 1:
      h ^= str.charCodeAt(i) & 0xff;
      h =
      /* Math.imul(h, m): */
      (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  } // Do a few final mixes of the hash to ensure the last few
  // bytes are well-incorporated.


  h ^= h >>> 13;
  h =
  /* Math.imul(h, m): */
  (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  return ((h ^ h >>> 15) >>> 0).toString(36);
}




/***/ }),

/***/ "./node_modules/@emotion/memoize/dist/emotion-memoize.esm.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@emotion/memoize/dist/emotion-memoize.esm.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ memoize)
/* harmony export */ });
function memoize(fn) {
  var cache = Object.create(null);
  return function (arg) {
    if (cache[arg] === undefined) cache[arg] = fn(arg);
    return cache[arg];
  };
}




/***/ }),

/***/ "./node_modules/@emotion/react/_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.esm.js":
/*!*****************************************************************************************************!*\
  !*** ./node_modules/@emotion/react/_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.esm.js ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ hoistNonReactStatics)
/* harmony export */ });
/* harmony import */ var hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! hoist-non-react-statics */ "./node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js");
/* harmony import */ var hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_0__);


// this file isolates this package that is not tree-shakeable
// and if this module doesn't actually contain any logic of its own
// then Rollup just use 'hoist-non-react-statics' directly in other chunks

var hoistNonReactStatics = (function (targetComponent, sourceComponent) {
  return hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_0___default()(targetComponent, sourceComponent);
});




/***/ }),

/***/ "./node_modules/@emotion/react/dist/emotion-element-c39617d8.browser.esm.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@emotion/react/dist/emotion-element-c39617d8.browser.esm.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   C: () => (/* binding */ CacheProvider),
/* harmony export */   E: () => (/* binding */ Emotion$1),
/* harmony export */   T: () => (/* binding */ ThemeContext),
/* harmony export */   _: () => (/* binding */ __unsafe_useEmotionCache),
/* harmony export */   a: () => (/* binding */ ThemeProvider),
/* harmony export */   b: () => (/* binding */ withTheme),
/* harmony export */   c: () => (/* binding */ createEmotionProps),
/* harmony export */   h: () => (/* binding */ hasOwnProperty),
/* harmony export */   i: () => (/* binding */ isBrowser),
/* harmony export */   u: () => (/* binding */ useTheme),
/* harmony export */   w: () => (/* binding */ withEmotionCache)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _emotion_cache__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @emotion/cache */ "./node_modules/@emotion/cache/dist/emotion-cache.browser.esm.js");
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _emotion_weak_memoize__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @emotion/weak-memoize */ "./node_modules/@emotion/weak-memoize/dist/emotion-weak-memoize.esm.js");
/* harmony import */ var _isolated_hnrs_dist_emotion_react_isolated_hnrs_browser_esm_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.esm.js */ "./node_modules/@emotion/react/_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.esm.js");
/* harmony import */ var _emotion_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @emotion/utils */ "./node_modules/@emotion/utils/dist/emotion-utils.browser.esm.js");
/* harmony import */ var _emotion_serialize__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @emotion/serialize */ "./node_modules/@emotion/serialize/dist/emotion-serialize.browser.esm.js");
/* harmony import */ var _emotion_use_insertion_effect_with_fallbacks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @emotion/use-insertion-effect-with-fallbacks */ "./node_modules/@emotion/use-insertion-effect-with-fallbacks/dist/emotion-use-insertion-effect-with-fallbacks.browser.esm.js");










var isBrowser = "object" !== 'undefined';
var hasOwnProperty = {}.hasOwnProperty;

var EmotionCacheContext = /* #__PURE__ */react__WEBPACK_IMPORTED_MODULE_0__.createContext( // we're doing this to avoid preconstruct's dead code elimination in this one case
// because this module is primarily intended for the browser and node
// but it's also required in react native and similar environments sometimes
// and we could have a special build just for that
// but this is much easier and the native packages
// might use a different theme context in the future anyway
typeof HTMLElement !== 'undefined' ? /* #__PURE__ */(0,_emotion_cache__WEBPACK_IMPORTED_MODULE_1__["default"])({
  key: 'css'
}) : null);

if (true) {
  EmotionCacheContext.displayName = 'EmotionCacheContext';
}

var CacheProvider = EmotionCacheContext.Provider;
var __unsafe_useEmotionCache = function useEmotionCache() {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(EmotionCacheContext);
};

var withEmotionCache = function withEmotionCache(func) {
  // $FlowFixMe
  return /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(function (props, ref) {
    // the cache will never be null in the browser
    var cache = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(EmotionCacheContext);
    return func(props, cache, ref);
  });
};

if (!isBrowser) {
  withEmotionCache = function withEmotionCache(func) {
    return function (props) {
      var cache = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(EmotionCacheContext);

      if (cache === null) {
        // yes, we're potentially creating this on every render
        // it doesn't actually matter though since it's only on the server
        // so there will only every be a single render
        // that could change in the future because of suspense and etc. but for now,
        // this works and i don't want to optimise for a future thing that we aren't sure about
        cache = (0,_emotion_cache__WEBPACK_IMPORTED_MODULE_1__["default"])({
          key: 'css'
        });
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(EmotionCacheContext.Provider, {
          value: cache
        }, func(props, cache));
      } else {
        return func(props, cache);
      }
    };
  };
}

var ThemeContext = /* #__PURE__ */react__WEBPACK_IMPORTED_MODULE_0__.createContext({});

if (true) {
  ThemeContext.displayName = 'EmotionThemeContext';
}

var useTheme = function useTheme() {
  return react__WEBPACK_IMPORTED_MODULE_0__.useContext(ThemeContext);
};

var getTheme = function getTheme(outerTheme, theme) {
  if (typeof theme === 'function') {
    var mergedTheme = theme(outerTheme);

    if ( true && (mergedTheme == null || typeof mergedTheme !== 'object' || Array.isArray(mergedTheme))) {
      throw new Error('[ThemeProvider] Please return an object from your theme function, i.e. theme={() => ({})}!');
    }

    return mergedTheme;
  }

  if ( true && (theme == null || typeof theme !== 'object' || Array.isArray(theme))) {
    throw new Error('[ThemeProvider] Please make your theme prop a plain object');
  }

  return (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_2__["default"])({}, outerTheme, theme);
};

var createCacheWithTheme = /* #__PURE__ */(0,_emotion_weak_memoize__WEBPACK_IMPORTED_MODULE_3__["default"])(function (outerTheme) {
  return (0,_emotion_weak_memoize__WEBPACK_IMPORTED_MODULE_3__["default"])(function (theme) {
    return getTheme(outerTheme, theme);
  });
});
var ThemeProvider = function ThemeProvider(props) {
  var theme = react__WEBPACK_IMPORTED_MODULE_0__.useContext(ThemeContext);

  if (props.theme !== theme) {
    theme = createCacheWithTheme(theme)(props.theme);
  }

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(ThemeContext.Provider, {
    value: theme
  }, props.children);
};
function withTheme(Component) {
  var componentName = Component.displayName || Component.name || 'Component';

  var render = function render(props, ref) {
    var theme = react__WEBPACK_IMPORTED_MODULE_0__.useContext(ThemeContext);
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(Component, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_2__["default"])({
      theme: theme,
      ref: ref
    }, props));
  }; // $FlowFixMe


  var WithTheme = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(render);
  WithTheme.displayName = "WithTheme(" + componentName + ")";
  return (0,_isolated_hnrs_dist_emotion_react_isolated_hnrs_browser_esm_js__WEBPACK_IMPORTED_MODULE_7__["default"])(WithTheme, Component);
}

var getLastPart = function getLastPart(functionName) {
  // The match may be something like 'Object.createEmotionProps' or
  // 'Loader.prototype.render'
  var parts = functionName.split('.');
  return parts[parts.length - 1];
};

var getFunctionNameFromStackTraceLine = function getFunctionNameFromStackTraceLine(line) {
  // V8
  var match = /^\s+at\s+([A-Za-z0-9$.]+)\s/.exec(line);
  if (match) return getLastPart(match[1]); // Safari / Firefox

  match = /^([A-Za-z0-9$.]+)@/.exec(line);
  if (match) return getLastPart(match[1]);
  return undefined;
};

var internalReactFunctionNames = /* #__PURE__ */new Set(['renderWithHooks', 'processChild', 'finishClassComponent', 'renderToString']); // These identifiers come from error stacks, so they have to be valid JS
// identifiers, thus we only need to replace what is a valid character for JS,
// but not for CSS.

var sanitizeIdentifier = function sanitizeIdentifier(identifier) {
  return identifier.replace(/\$/g, '-');
};

var getLabelFromStackTrace = function getLabelFromStackTrace(stackTrace) {
  if (!stackTrace) return undefined;
  var lines = stackTrace.split('\n');

  for (var i = 0; i < lines.length; i++) {
    var functionName = getFunctionNameFromStackTraceLine(lines[i]); // The first line of V8 stack traces is just "Error"

    if (!functionName) continue; // If we reach one of these, we have gone too far and should quit

    if (internalReactFunctionNames.has(functionName)) break; // The component name is the first function in the stack that starts with an
    // uppercase letter

    if (/^[A-Z]/.test(functionName)) return sanitizeIdentifier(functionName);
  }

  return undefined;
};

var typePropName = '__EMOTION_TYPE_PLEASE_DO_NOT_USE__';
var labelPropName = '__EMOTION_LABEL_PLEASE_DO_NOT_USE__';
var createEmotionProps = function createEmotionProps(type, props) {
  if ( true && typeof props.css === 'string' && // check if there is a css declaration
  props.css.indexOf(':') !== -1) {
    throw new Error("Strings are not allowed as css prop values, please wrap it in a css template literal from '@emotion/react' like this: css`" + props.css + "`");
  }

  var newProps = {};

  for (var key in props) {
    if (hasOwnProperty.call(props, key)) {
      newProps[key] = props[key];
    }
  }

  newProps[typePropName] = type; // For performance, only call getLabelFromStackTrace in development and when
  // the label hasn't already been computed

  if ( true && !!props.css && (typeof props.css !== 'object' || typeof props.css.name !== 'string' || props.css.name.indexOf('-') === -1)) {
    var label = getLabelFromStackTrace(new Error().stack);
    if (label) newProps[labelPropName] = label;
  }

  return newProps;
};

var Insertion = function Insertion(_ref) {
  var cache = _ref.cache,
      serialized = _ref.serialized,
      isStringTag = _ref.isStringTag;
  (0,_emotion_utils__WEBPACK_IMPORTED_MODULE_4__.registerStyles)(cache, serialized, isStringTag);
  (0,_emotion_use_insertion_effect_with_fallbacks__WEBPACK_IMPORTED_MODULE_6__.useInsertionEffectAlwaysWithSyncFallback)(function () {
    return (0,_emotion_utils__WEBPACK_IMPORTED_MODULE_4__.insertStyles)(cache, serialized, isStringTag);
  });

  return null;
};

var Emotion = /* #__PURE__ */withEmotionCache(function (props, cache, ref) {
  var cssProp = props.css; // so that using `css` from `emotion` and passing the result to the css prop works
  // not passing the registered cache to serializeStyles because it would
  // make certain babel optimisations not possible

  if (typeof cssProp === 'string' && cache.registered[cssProp] !== undefined) {
    cssProp = cache.registered[cssProp];
  }

  var WrappedComponent = props[typePropName];
  var registeredStyles = [cssProp];
  var className = '';

  if (typeof props.className === 'string') {
    className = (0,_emotion_utils__WEBPACK_IMPORTED_MODULE_4__.getRegisteredStyles)(cache.registered, registeredStyles, props.className);
  } else if (props.className != null) {
    className = props.className + " ";
  }

  var serialized = (0,_emotion_serialize__WEBPACK_IMPORTED_MODULE_5__.serializeStyles)(registeredStyles, undefined, react__WEBPACK_IMPORTED_MODULE_0__.useContext(ThemeContext));

  if ( true && serialized.name.indexOf('-') === -1) {
    var labelFromStack = props[labelPropName];

    if (labelFromStack) {
      serialized = (0,_emotion_serialize__WEBPACK_IMPORTED_MODULE_5__.serializeStyles)([serialized, 'label:' + labelFromStack + ';']);
    }
  }

  className += cache.key + "-" + serialized.name;
  var newProps = {};

  for (var key in props) {
    if (hasOwnProperty.call(props, key) && key !== 'css' && key !== typePropName && ( false || key !== labelPropName)) {
      newProps[key] = props[key];
    }
  }

  newProps.ref = ref;
  newProps.className = className;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(Insertion, {
    cache: cache,
    serialized: serialized,
    isStringTag: typeof WrappedComponent === 'string'
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(WrappedComponent, newProps));
});

if (true) {
  Emotion.displayName = 'EmotionCssPropInternal';
}

var Emotion$1 = Emotion;




/***/ }),

/***/ "./node_modules/@emotion/react/dist/emotion-react.browser.esm.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@emotion/react/dist/emotion-react.browser.esm.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CacheProvider: () => (/* reexport safe */ _emotion_element_c39617d8_browser_esm_js__WEBPACK_IMPORTED_MODULE_0__.C),
/* harmony export */   ClassNames: () => (/* binding */ ClassNames),
/* harmony export */   Global: () => (/* binding */ Global),
/* harmony export */   ThemeContext: () => (/* reexport safe */ _emotion_element_c39617d8_browser_esm_js__WEBPACK_IMPORTED_MODULE_0__.T),
/* harmony export */   ThemeProvider: () => (/* reexport safe */ _emotion_element_c39617d8_browser_esm_js__WEBPACK_IMPORTED_MODULE_0__.a),
/* harmony export */   __unsafe_useEmotionCache: () => (/* reexport safe */ _emotion_element_c39617d8_browser_esm_js__WEBPACK_IMPORTED_MODULE_0__._),
/* harmony export */   createElement: () => (/* binding */ jsx),
/* harmony export */   css: () => (/* binding */ css),
/* harmony export */   jsx: () => (/* binding */ jsx),
/* harmony export */   keyframes: () => (/* binding */ keyframes),
/* harmony export */   useTheme: () => (/* reexport safe */ _emotion_element_c39617d8_browser_esm_js__WEBPACK_IMPORTED_MODULE_0__.u),
/* harmony export */   withEmotionCache: () => (/* reexport safe */ _emotion_element_c39617d8_browser_esm_js__WEBPACK_IMPORTED_MODULE_0__.w),
/* harmony export */   withTheme: () => (/* reexport safe */ _emotion_element_c39617d8_browser_esm_js__WEBPACK_IMPORTED_MODULE_0__.b)
/* harmony export */ });
/* harmony import */ var _emotion_element_c39617d8_browser_esm_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./emotion-element-c39617d8.browser.esm.js */ "./node_modules/@emotion/react/dist/emotion-element-c39617d8.browser.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _emotion_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @emotion/utils */ "./node_modules/@emotion/utils/dist/emotion-utils.browser.esm.js");
/* harmony import */ var _emotion_use_insertion_effect_with_fallbacks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @emotion/use-insertion-effect-with-fallbacks */ "./node_modules/@emotion/use-insertion-effect-with-fallbacks/dist/emotion-use-insertion-effect-with-fallbacks.browser.esm.js");
/* harmony import */ var _emotion_serialize__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @emotion/serialize */ "./node_modules/@emotion/serialize/dist/emotion-serialize.browser.esm.js");
/* harmony import */ var _emotion_cache__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @emotion/cache */ "./node_modules/@emotion/cache/dist/emotion-cache.browser.esm.js");
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _emotion_weak_memoize__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @emotion/weak-memoize */ "./node_modules/@emotion/weak-memoize/dist/emotion-weak-memoize.esm.js");
/* harmony import */ var hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! hoist-non-react-statics */ "./node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js");
/* harmony import */ var hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_8__);












var pkg = {
	name: "@emotion/react",
	version: "11.11.1",
	main: "dist/emotion-react.cjs.js",
	module: "dist/emotion-react.esm.js",
	browser: {
		"./dist/emotion-react.esm.js": "./dist/emotion-react.browser.esm.js"
	},
	exports: {
		".": {
			module: {
				worker: "./dist/emotion-react.worker.esm.js",
				browser: "./dist/emotion-react.browser.esm.js",
				"default": "./dist/emotion-react.esm.js"
			},
			"import": "./dist/emotion-react.cjs.mjs",
			"default": "./dist/emotion-react.cjs.js"
		},
		"./jsx-runtime": {
			module: {
				worker: "./jsx-runtime/dist/emotion-react-jsx-runtime.worker.esm.js",
				browser: "./jsx-runtime/dist/emotion-react-jsx-runtime.browser.esm.js",
				"default": "./jsx-runtime/dist/emotion-react-jsx-runtime.esm.js"
			},
			"import": "./jsx-runtime/dist/emotion-react-jsx-runtime.cjs.mjs",
			"default": "./jsx-runtime/dist/emotion-react-jsx-runtime.cjs.js"
		},
		"./_isolated-hnrs": {
			module: {
				worker: "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.worker.esm.js",
				browser: "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.esm.js",
				"default": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.esm.js"
			},
			"import": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.cjs.mjs",
			"default": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.cjs.js"
		},
		"./jsx-dev-runtime": {
			module: {
				worker: "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.worker.esm.js",
				browser: "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.browser.esm.js",
				"default": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.esm.js"
			},
			"import": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.cjs.mjs",
			"default": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.cjs.js"
		},
		"./package.json": "./package.json",
		"./types/css-prop": "./types/css-prop.d.ts",
		"./macro": {
			types: {
				"import": "./macro.d.mts",
				"default": "./macro.d.ts"
			},
			"default": "./macro.js"
		}
	},
	types: "types/index.d.ts",
	files: [
		"src",
		"dist",
		"jsx-runtime",
		"jsx-dev-runtime",
		"_isolated-hnrs",
		"types/*.d.ts",
		"macro.*"
	],
	sideEffects: false,
	author: "Emotion Contributors",
	license: "MIT",
	scripts: {
		"test:typescript": "dtslint types"
	},
	dependencies: {
		"@babel/runtime": "^7.18.3",
		"@emotion/babel-plugin": "^11.11.0",
		"@emotion/cache": "^11.11.0",
		"@emotion/serialize": "^1.1.2",
		"@emotion/use-insertion-effect-with-fallbacks": "^1.0.1",
		"@emotion/utils": "^1.2.1",
		"@emotion/weak-memoize": "^0.3.1",
		"hoist-non-react-statics": "^3.3.1"
	},
	peerDependencies: {
		react: ">=16.8.0"
	},
	peerDependenciesMeta: {
		"@types/react": {
			optional: true
		}
	},
	devDependencies: {
		"@definitelytyped/dtslint": "0.0.112",
		"@emotion/css": "11.11.0",
		"@emotion/css-prettifier": "1.1.3",
		"@emotion/server": "11.11.0",
		"@emotion/styled": "11.11.0",
		"html-tag-names": "^1.1.2",
		react: "16.14.0",
		"svg-tag-names": "^1.1.1",
		typescript: "^4.5.5"
	},
	repository: "https://github.com/emotion-js/emotion/tree/main/packages/react",
	publishConfig: {
		access: "public"
	},
	"umd:main": "dist/emotion-react.umd.min.js",
	preconstruct: {
		entrypoints: [
			"./index.js",
			"./jsx-runtime.js",
			"./jsx-dev-runtime.js",
			"./_isolated-hnrs.js"
		],
		umdName: "emotionReact",
		exports: {
			envConditions: [
				"browser",
				"worker"
			],
			extra: {
				"./types/css-prop": "./types/css-prop.d.ts",
				"./macro": {
					types: {
						"import": "./macro.d.mts",
						"default": "./macro.d.ts"
					},
					"default": "./macro.js"
				}
			}
		}
	}
};

var jsx = function jsx(type, props) {
  var args = arguments;

  if (props == null || !_emotion_element_c39617d8_browser_esm_js__WEBPACK_IMPORTED_MODULE_0__.h.call(props, 'css')) {
    // $FlowFixMe
    return react__WEBPACK_IMPORTED_MODULE_1__.createElement.apply(undefined, args);
  }

  var argsLength = args.length;
  var createElementArgArray = new Array(argsLength);
  createElementArgArray[0] = _emotion_element_c39617d8_browser_esm_js__WEBPACK_IMPORTED_MODULE_0__.E;
  createElementArgArray[1] = (0,_emotion_element_c39617d8_browser_esm_js__WEBPACK_IMPORTED_MODULE_0__.c)(type, props);

  for (var i = 2; i < argsLength; i++) {
    createElementArgArray[i] = args[i];
  } // $FlowFixMe


  return react__WEBPACK_IMPORTED_MODULE_1__.createElement.apply(null, createElementArgArray);
};

var warnedAboutCssPropForGlobal = false; // maintain place over rerenders.
// initial render from browser, insertBefore context.sheet.tags[0] or if a style hasn't been inserted there yet, appendChild
// initial client-side render from SSR, use place of hydrating tag

var Global = /* #__PURE__ */(0,_emotion_element_c39617d8_browser_esm_js__WEBPACK_IMPORTED_MODULE_0__.w)(function (props, cache) {
  if ( true && !warnedAboutCssPropForGlobal && ( // check for className as well since the user is
  // probably using the custom createElement which
  // means it will be turned into a className prop
  // $FlowFixMe I don't really want to add it to the type since it shouldn't be used
  props.className || props.css)) {
    console.error("It looks like you're using the css prop on Global, did you mean to use the styles prop instead?");
    warnedAboutCssPropForGlobal = true;
  }

  var styles = props.styles;
  var serialized = (0,_emotion_serialize__WEBPACK_IMPORTED_MODULE_4__.serializeStyles)([styles], undefined, react__WEBPACK_IMPORTED_MODULE_1__.useContext(_emotion_element_c39617d8_browser_esm_js__WEBPACK_IMPORTED_MODULE_0__.T));

  if (!_emotion_element_c39617d8_browser_esm_js__WEBPACK_IMPORTED_MODULE_0__.i) {
    var _ref;

    var serializedNames = serialized.name;
    var serializedStyles = serialized.styles;
    var next = serialized.next;

    while (next !== undefined) {
      serializedNames += ' ' + next.name;
      serializedStyles += next.styles;
      next = next.next;
    }

    var shouldCache = cache.compat === true;
    var rules = cache.insert("", {
      name: serializedNames,
      styles: serializedStyles
    }, cache.sheet, shouldCache);

    if (shouldCache) {
      return null;
    }

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("style", (_ref = {}, _ref["data-emotion"] = cache.key + "-global " + serializedNames, _ref.dangerouslySetInnerHTML = {
      __html: rules
    }, _ref.nonce = cache.sheet.nonce, _ref));
  } // yes, i know these hooks are used conditionally
  // but it is based on a constant that will never change at runtime
  // it's effectively like having two implementations and switching them out
  // so it's not actually breaking anything


  var sheetRef = react__WEBPACK_IMPORTED_MODULE_1__.useRef();
  (0,_emotion_use_insertion_effect_with_fallbacks__WEBPACK_IMPORTED_MODULE_3__.useInsertionEffectWithLayoutFallback)(function () {
    var key = cache.key + "-global"; // use case of https://github.com/emotion-js/emotion/issues/2675

    var sheet = new cache.sheet.constructor({
      key: key,
      nonce: cache.sheet.nonce,
      container: cache.sheet.container,
      speedy: cache.sheet.isSpeedy
    });
    var rehydrating = false; // $FlowFixMe

    var node = document.querySelector("style[data-emotion=\"" + key + " " + serialized.name + "\"]");

    if (cache.sheet.tags.length) {
      sheet.before = cache.sheet.tags[0];
    }

    if (node !== null) {
      rehydrating = true; // clear the hash so this node won't be recognizable as rehydratable by other <Global/>s

      node.setAttribute('data-emotion', key);
      sheet.hydrate([node]);
    }

    sheetRef.current = [sheet, rehydrating];
    return function () {
      sheet.flush();
    };
  }, [cache]);
  (0,_emotion_use_insertion_effect_with_fallbacks__WEBPACK_IMPORTED_MODULE_3__.useInsertionEffectWithLayoutFallback)(function () {
    var sheetRefCurrent = sheetRef.current;
    var sheet = sheetRefCurrent[0],
        rehydrating = sheetRefCurrent[1];

    if (rehydrating) {
      sheetRefCurrent[1] = false;
      return;
    }

    if (serialized.next !== undefined) {
      // insert keyframes
      (0,_emotion_utils__WEBPACK_IMPORTED_MODULE_2__.insertStyles)(cache, serialized.next, true);
    }

    if (sheet.tags.length) {
      // if this doesn't exist then it will be null so the style element will be appended
      var element = sheet.tags[sheet.tags.length - 1].nextElementSibling;
      sheet.before = element;
      sheet.flush();
    }

    cache.insert("", serialized, sheet, false);
  }, [cache, serialized.name]);
  return null;
});

if (true) {
  Global.displayName = 'EmotionGlobal';
}

function css() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return (0,_emotion_serialize__WEBPACK_IMPORTED_MODULE_4__.serializeStyles)(args);
}

var keyframes = function keyframes() {
  var insertable = css.apply(void 0, arguments);
  var name = "animation-" + insertable.name; // $FlowFixMe

  return {
    name: name,
    styles: "@keyframes " + name + "{" + insertable.styles + "}",
    anim: 1,
    toString: function toString() {
      return "_EMO_" + this.name + "_" + this.styles + "_EMO_";
    }
  };
};

var classnames = function classnames(args) {
  var len = args.length;
  var i = 0;
  var cls = '';

  for (; i < len; i++) {
    var arg = args[i];
    if (arg == null) continue;
    var toAdd = void 0;

    switch (typeof arg) {
      case 'boolean':
        break;

      case 'object':
        {
          if (Array.isArray(arg)) {
            toAdd = classnames(arg);
          } else {
            if ( true && arg.styles !== undefined && arg.name !== undefined) {
              console.error('You have passed styles created with `css` from `@emotion/react` package to the `cx`.\n' + '`cx` is meant to compose class names (strings) so you should convert those styles to a class name by passing them to the `css` received from <ClassNames/> component.');
            }

            toAdd = '';

            for (var k in arg) {
              if (arg[k] && k) {
                toAdd && (toAdd += ' ');
                toAdd += k;
              }
            }
          }

          break;
        }

      default:
        {
          toAdd = arg;
        }
    }

    if (toAdd) {
      cls && (cls += ' ');
      cls += toAdd;
    }
  }

  return cls;
};

function merge(registered, css, className) {
  var registeredStyles = [];
  var rawClassName = (0,_emotion_utils__WEBPACK_IMPORTED_MODULE_2__.getRegisteredStyles)(registered, registeredStyles, className);

  if (registeredStyles.length < 2) {
    return className;
  }

  return rawClassName + css(registeredStyles);
}

var Insertion = function Insertion(_ref) {
  var cache = _ref.cache,
      serializedArr = _ref.serializedArr;
  (0,_emotion_use_insertion_effect_with_fallbacks__WEBPACK_IMPORTED_MODULE_3__.useInsertionEffectAlwaysWithSyncFallback)(function () {

    for (var i = 0; i < serializedArr.length; i++) {
      (0,_emotion_utils__WEBPACK_IMPORTED_MODULE_2__.insertStyles)(cache, serializedArr[i], false);
    }
  });

  return null;
};

var ClassNames = /* #__PURE__ */(0,_emotion_element_c39617d8_browser_esm_js__WEBPACK_IMPORTED_MODULE_0__.w)(function (props, cache) {
  var hasRendered = false;
  var serializedArr = [];

  var css = function css() {
    if (hasRendered && "development" !== 'production') {
      throw new Error('css can only be used during render');
    }

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var serialized = (0,_emotion_serialize__WEBPACK_IMPORTED_MODULE_4__.serializeStyles)(args, cache.registered);
    serializedArr.push(serialized); // registration has to happen here as the result of this might get consumed by `cx`

    (0,_emotion_utils__WEBPACK_IMPORTED_MODULE_2__.registerStyles)(cache, serialized, false);
    return cache.key + "-" + serialized.name;
  };

  var cx = function cx() {
    if (hasRendered && "development" !== 'production') {
      throw new Error('cx can only be used during render');
    }

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return merge(cache.registered, css, classnames(args));
  };

  var content = {
    css: css,
    cx: cx,
    theme: react__WEBPACK_IMPORTED_MODULE_1__.useContext(_emotion_element_c39617d8_browser_esm_js__WEBPACK_IMPORTED_MODULE_0__.T)
  };
  var ele = props.children(content);
  hasRendered = true;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(react__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(Insertion, {
    cache: cache,
    serializedArr: serializedArr
  }), ele);
});

if (true) {
  ClassNames.displayName = 'EmotionClassNames';
}

if (true) {
  var isBrowser = "object" !== 'undefined'; // #1727, #2905 for some reason Jest and Vitest evaluate modules twice if some consuming module gets mocked

  var isTestEnv = typeof jest !== 'undefined' || typeof vi !== 'undefined';

  if (isBrowser && !isTestEnv) {
    // globalThis has wide browser support - https://caniuse.com/?search=globalThis, Node.js 12 and later
    var globalContext = // $FlowIgnore
    typeof globalThis !== 'undefined' ? globalThis // eslint-disable-line no-undef
    : isBrowser ? window : __webpack_require__.g;
    var globalKey = "__EMOTION_REACT_" + pkg.version.split('.')[0] + "__";

    if (globalContext[globalKey]) {
      console.warn('You are loading @emotion/react when it is already loaded. Running ' + 'multiple instances may cause problems. This can happen if multiple ' + 'versions are used, or if multiple builds of the same version are ' + 'used.');
    }

    globalContext[globalKey] = true;
  }
}




/***/ }),

/***/ "./node_modules/@emotion/serialize/dist/emotion-serialize.browser.esm.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@emotion/serialize/dist/emotion-serialize.browser.esm.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   serializeStyles: () => (/* binding */ serializeStyles)
/* harmony export */ });
/* harmony import */ var _emotion_hash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/hash */ "./node_modules/@emotion/hash/dist/emotion-hash.esm.js");
/* harmony import */ var _emotion_unitless__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @emotion/unitless */ "./node_modules/@emotion/unitless/dist/emotion-unitless.esm.js");
/* harmony import */ var _emotion_memoize__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @emotion/memoize */ "./node_modules/@emotion/memoize/dist/emotion-memoize.esm.js");




var ILLEGAL_ESCAPE_SEQUENCE_ERROR = "You have illegal escape sequence in your template literal, most likely inside content's property value.\nBecause you write your CSS inside a JavaScript string you actually have to do double escaping, so for example \"content: '\\00d7';\" should become \"content: '\\\\00d7';\".\nYou can read more about this here:\nhttps://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#ES2018_revision_of_illegal_escape_sequences";
var UNDEFINED_AS_OBJECT_KEY_ERROR = "You have passed in falsy value as style object's key (can happen when in example you pass unexported component as computed key).";
var hyphenateRegex = /[A-Z]|^ms/g;
var animationRegex = /_EMO_([^_]+?)_([^]*?)_EMO_/g;

var isCustomProperty = function isCustomProperty(property) {
  return property.charCodeAt(1) === 45;
};

var isProcessableValue = function isProcessableValue(value) {
  return value != null && typeof value !== 'boolean';
};

var processStyleName = /* #__PURE__ */(0,_emotion_memoize__WEBPACK_IMPORTED_MODULE_2__["default"])(function (styleName) {
  return isCustomProperty(styleName) ? styleName : styleName.replace(hyphenateRegex, '-$&').toLowerCase();
});

var processStyleValue = function processStyleValue(key, value) {
  switch (key) {
    case 'animation':
    case 'animationName':
      {
        if (typeof value === 'string') {
          return value.replace(animationRegex, function (match, p1, p2) {
            cursor = {
              name: p1,
              styles: p2,
              next: cursor
            };
            return p1;
          });
        }
      }
  }

  if (_emotion_unitless__WEBPACK_IMPORTED_MODULE_1__["default"][key] !== 1 && !isCustomProperty(key) && typeof value === 'number' && value !== 0) {
    return value + 'px';
  }

  return value;
};

if (true) {
  var contentValuePattern = /(var|attr|counters?|url|element|(((repeating-)?(linear|radial))|conic)-gradient)\(|(no-)?(open|close)-quote/;
  var contentValues = ['normal', 'none', 'initial', 'inherit', 'unset'];
  var oldProcessStyleValue = processStyleValue;
  var msPattern = /^-ms-/;
  var hyphenPattern = /-(.)/g;
  var hyphenatedCache = {};

  processStyleValue = function processStyleValue(key, value) {
    if (key === 'content') {
      if (typeof value !== 'string' || contentValues.indexOf(value) === -1 && !contentValuePattern.test(value) && (value.charAt(0) !== value.charAt(value.length - 1) || value.charAt(0) !== '"' && value.charAt(0) !== "'")) {
        throw new Error("You seem to be using a value for 'content' without quotes, try replacing it with `content: '\"" + value + "\"'`");
      }
    }

    var processed = oldProcessStyleValue(key, value);

    if (processed !== '' && !isCustomProperty(key) && key.indexOf('-') !== -1 && hyphenatedCache[key] === undefined) {
      hyphenatedCache[key] = true;
      console.error("Using kebab-case for css properties in objects is not supported. Did you mean " + key.replace(msPattern, 'ms-').replace(hyphenPattern, function (str, _char) {
        return _char.toUpperCase();
      }) + "?");
    }

    return processed;
  };
}

var noComponentSelectorMessage = 'Component selectors can only be used in conjunction with ' + '@emotion/babel-plugin, the swc Emotion plugin, or another Emotion-aware ' + 'compiler transform.';

function handleInterpolation(mergedProps, registered, interpolation) {
  if (interpolation == null) {
    return '';
  }

  if (interpolation.__emotion_styles !== undefined) {
    if ( true && interpolation.toString() === 'NO_COMPONENT_SELECTOR') {
      throw new Error(noComponentSelectorMessage);
    }

    return interpolation;
  }

  switch (typeof interpolation) {
    case 'boolean':
      {
        return '';
      }

    case 'object':
      {
        if (interpolation.anim === 1) {
          cursor = {
            name: interpolation.name,
            styles: interpolation.styles,
            next: cursor
          };
          return interpolation.name;
        }

        if (interpolation.styles !== undefined) {
          var next = interpolation.next;

          if (next !== undefined) {
            // not the most efficient thing ever but this is a pretty rare case
            // and there will be very few iterations of this generally
            while (next !== undefined) {
              cursor = {
                name: next.name,
                styles: next.styles,
                next: cursor
              };
              next = next.next;
            }
          }

          var styles = interpolation.styles + ";";

          if ( true && interpolation.map !== undefined) {
            styles += interpolation.map;
          }

          return styles;
        }

        return createStringFromObject(mergedProps, registered, interpolation);
      }

    case 'function':
      {
        if (mergedProps !== undefined) {
          var previousCursor = cursor;
          var result = interpolation(mergedProps);
          cursor = previousCursor;
          return handleInterpolation(mergedProps, registered, result);
        } else if (true) {
          console.error('Functions that are interpolated in css calls will be stringified.\n' + 'If you want to have a css call based on props, create a function that returns a css call like this\n' + 'let dynamicStyle = (props) => css`color: ${props.color}`\n' + 'It can be called directly with props or interpolated in a styled call like this\n' + "let SomeComponent = styled('div')`${dynamicStyle}`");
        }

        break;
      }

    case 'string':
      if (true) {
        var matched = [];
        var replaced = interpolation.replace(animationRegex, function (match, p1, p2) {
          var fakeVarName = "animation" + matched.length;
          matched.push("const " + fakeVarName + " = keyframes`" + p2.replace(/^@keyframes animation-\w+/, '') + "`");
          return "${" + fakeVarName + "}";
        });

        if (matched.length) {
          console.error('`keyframes` output got interpolated into plain string, please wrap it with `css`.\n\n' + 'Instead of doing this:\n\n' + [].concat(matched, ["`" + replaced + "`"]).join('\n') + '\n\nYou should wrap it with `css` like this:\n\n' + ("css`" + replaced + "`"));
        }
      }

      break;
  } // finalize string values (regular strings and functions interpolated into css calls)


  if (registered == null) {
    return interpolation;
  }

  var cached = registered[interpolation];
  return cached !== undefined ? cached : interpolation;
}

function createStringFromObject(mergedProps, registered, obj) {
  var string = '';

  if (Array.isArray(obj)) {
    for (var i = 0; i < obj.length; i++) {
      string += handleInterpolation(mergedProps, registered, obj[i]) + ";";
    }
  } else {
    for (var _key in obj) {
      var value = obj[_key];

      if (typeof value !== 'object') {
        if (registered != null && registered[value] !== undefined) {
          string += _key + "{" + registered[value] + "}";
        } else if (isProcessableValue(value)) {
          string += processStyleName(_key) + ":" + processStyleValue(_key, value) + ";";
        }
      } else {
        if (_key === 'NO_COMPONENT_SELECTOR' && "development" !== 'production') {
          throw new Error(noComponentSelectorMessage);
        }

        if (Array.isArray(value) && typeof value[0] === 'string' && (registered == null || registered[value[0]] === undefined)) {
          for (var _i = 0; _i < value.length; _i++) {
            if (isProcessableValue(value[_i])) {
              string += processStyleName(_key) + ":" + processStyleValue(_key, value[_i]) + ";";
            }
          }
        } else {
          var interpolated = handleInterpolation(mergedProps, registered, value);

          switch (_key) {
            case 'animation':
            case 'animationName':
              {
                string += processStyleName(_key) + ":" + interpolated + ";";
                break;
              }

            default:
              {
                if ( true && _key === 'undefined') {
                  console.error(UNDEFINED_AS_OBJECT_KEY_ERROR);
                }

                string += _key + "{" + interpolated + "}";
              }
          }
        }
      }
    }
  }

  return string;
}

var labelPattern = /label:\s*([^\s;\n{]+)\s*(;|$)/g;
var sourceMapPattern;

if (true) {
  sourceMapPattern = /\/\*#\ssourceMappingURL=data:application\/json;\S+\s+\*\//g;
} // this is the cursor for keyframes
// keyframes are stored on the SerializedStyles object as a linked list


var cursor;
var serializeStyles = function serializeStyles(args, registered, mergedProps) {
  if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null && args[0].styles !== undefined) {
    return args[0];
  }

  var stringMode = true;
  var styles = '';
  cursor = undefined;
  var strings = args[0];

  if (strings == null || strings.raw === undefined) {
    stringMode = false;
    styles += handleInterpolation(mergedProps, registered, strings);
  } else {
    if ( true && strings[0] === undefined) {
      console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR);
    }

    styles += strings[0];
  } // we start at 1 since we've already handled the first arg


  for (var i = 1; i < args.length; i++) {
    styles += handleInterpolation(mergedProps, registered, args[i]);

    if (stringMode) {
      if ( true && strings[i] === undefined) {
        console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR);
      }

      styles += strings[i];
    }
  }

  var sourceMap;

  if (true) {
    styles = styles.replace(sourceMapPattern, function (match) {
      sourceMap = match;
      return '';
    });
  } // using a global regex with .exec is stateful so lastIndex has to be reset each time


  labelPattern.lastIndex = 0;
  var identifierName = '';
  var match; // https://esbench.com/bench/5b809c2cf2949800a0f61fb5

  while ((match = labelPattern.exec(styles)) !== null) {
    identifierName += '-' + // $FlowFixMe we know it's not null
    match[1];
  }

  var name = (0,_emotion_hash__WEBPACK_IMPORTED_MODULE_0__["default"])(styles) + identifierName;

  if (true) {
    // $FlowFixMe SerializedStyles type doesn't have toString property (and we don't want to add it)
    return {
      name: name,
      styles: styles,
      map: sourceMap,
      next: cursor,
      toString: function toString() {
        return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop).";
      }
    };
  }

  return {
    name: name,
    styles: styles,
    next: cursor
  };
};




/***/ }),

/***/ "./node_modules/@emotion/sheet/dist/emotion-sheet.browser.esm.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@emotion/sheet/dist/emotion-sheet.browser.esm.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StyleSheet: () => (/* binding */ StyleSheet)
/* harmony export */ });
/*

Based off glamor's StyleSheet, thanks Sunil ❤️

high performance StyleSheet for css-in-js systems

- uses multiple style tags behind the scenes for millions of rules
- uses `insertRule` for appending in production for *much* faster performance

// usage

import { StyleSheet } from '@emotion/sheet'

let styleSheet = new StyleSheet({ key: '', container: document.head })

styleSheet.insert('#box { border: 1px solid red; }')
- appends a css rule into the stylesheet

styleSheet.flush()
- empties the stylesheet of all its contents

*/
// $FlowFixMe
function sheetForTag(tag) {
  if (tag.sheet) {
    // $FlowFixMe
    return tag.sheet;
  } // this weirdness brought to you by firefox

  /* istanbul ignore next */


  for (var i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].ownerNode === tag) {
      // $FlowFixMe
      return document.styleSheets[i];
    }
  }
}

function createStyleElement(options) {
  var tag = document.createElement('style');
  tag.setAttribute('data-emotion', options.key);

  if (options.nonce !== undefined) {
    tag.setAttribute('nonce', options.nonce);
  }

  tag.appendChild(document.createTextNode(''));
  tag.setAttribute('data-s', '');
  return tag;
}

var StyleSheet = /*#__PURE__*/function () {
  // Using Node instead of HTMLElement since container may be a ShadowRoot
  function StyleSheet(options) {
    var _this = this;

    this._insertTag = function (tag) {
      var before;

      if (_this.tags.length === 0) {
        if (_this.insertionPoint) {
          before = _this.insertionPoint.nextSibling;
        } else if (_this.prepend) {
          before = _this.container.firstChild;
        } else {
          before = _this.before;
        }
      } else {
        before = _this.tags[_this.tags.length - 1].nextSibling;
      }

      _this.container.insertBefore(tag, before);

      _this.tags.push(tag);
    };

    this.isSpeedy = options.speedy === undefined ? "development" === 'production' : options.speedy;
    this.tags = [];
    this.ctr = 0;
    this.nonce = options.nonce; // key is the value of the data-emotion attribute, it's used to identify different sheets

    this.key = options.key;
    this.container = options.container;
    this.prepend = options.prepend;
    this.insertionPoint = options.insertionPoint;
    this.before = null;
  }

  var _proto = StyleSheet.prototype;

  _proto.hydrate = function hydrate(nodes) {
    nodes.forEach(this._insertTag);
  };

  _proto.insert = function insert(rule) {
    // the max length is how many rules we have per style tag, it's 65000 in speedy mode
    // it's 1 in dev because we insert source maps that map a single rule to a location
    // and you can only have one source map per style tag
    if (this.ctr % (this.isSpeedy ? 65000 : 1) === 0) {
      this._insertTag(createStyleElement(this));
    }

    var tag = this.tags[this.tags.length - 1];

    if (true) {
      var isImportRule = rule.charCodeAt(0) === 64 && rule.charCodeAt(1) === 105;

      if (isImportRule && this._alreadyInsertedOrderInsensitiveRule) {
        // this would only cause problem in speedy mode
        // but we don't want enabling speedy to affect the observable behavior
        // so we report this error at all times
        console.error("You're attempting to insert the following rule:\n" + rule + '\n\n`@import` rules must be before all other types of rules in a stylesheet but other rules have already been inserted. Please ensure that `@import` rules are before all other rules.');
      }
      this._alreadyInsertedOrderInsensitiveRule = this._alreadyInsertedOrderInsensitiveRule || !isImportRule;
    }

    if (this.isSpeedy) {
      var sheet = sheetForTag(tag);

      try {
        // this is the ultrafast version, works across browsers
        // the big drawback is that the css won't be editable in devtools
        sheet.insertRule(rule, sheet.cssRules.length);
      } catch (e) {
        if ( true && !/:(-moz-placeholder|-moz-focus-inner|-moz-focusring|-ms-input-placeholder|-moz-read-write|-moz-read-only|-ms-clear|-ms-expand|-ms-reveal){/.test(rule)) {
          console.error("There was a problem inserting the following rule: \"" + rule + "\"", e);
        }
      }
    } else {
      tag.appendChild(document.createTextNode(rule));
    }

    this.ctr++;
  };

  _proto.flush = function flush() {
    // $FlowFixMe
    this.tags.forEach(function (tag) {
      return tag.parentNode && tag.parentNode.removeChild(tag);
    });
    this.tags = [];
    this.ctr = 0;

    if (true) {
      this._alreadyInsertedOrderInsensitiveRule = false;
    }
  };

  return StyleSheet;
}();




/***/ }),

/***/ "./node_modules/@emotion/unitless/dist/emotion-unitless.esm.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@emotion/unitless/dist/emotion-unitless.esm.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ unitlessKeys)
/* harmony export */ });
var unitlessKeys = {
  animationIterationCount: 1,
  aspectRatio: 1,
  borderImageOutset: 1,
  borderImageSlice: 1,
  borderImageWidth: 1,
  boxFlex: 1,
  boxFlexGroup: 1,
  boxOrdinalGroup: 1,
  columnCount: 1,
  columns: 1,
  flex: 1,
  flexGrow: 1,
  flexPositive: 1,
  flexShrink: 1,
  flexNegative: 1,
  flexOrder: 1,
  gridRow: 1,
  gridRowEnd: 1,
  gridRowSpan: 1,
  gridRowStart: 1,
  gridColumn: 1,
  gridColumnEnd: 1,
  gridColumnSpan: 1,
  gridColumnStart: 1,
  msGridRow: 1,
  msGridRowSpan: 1,
  msGridColumn: 1,
  msGridColumnSpan: 1,
  fontWeight: 1,
  lineHeight: 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  tabSize: 1,
  widows: 1,
  zIndex: 1,
  zoom: 1,
  WebkitLineClamp: 1,
  // SVG-related properties
  fillOpacity: 1,
  floodOpacity: 1,
  stopOpacity: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
  strokeMiterlimit: 1,
  strokeOpacity: 1,
  strokeWidth: 1
};




/***/ }),

/***/ "./node_modules/@emotion/use-insertion-effect-with-fallbacks/dist/emotion-use-insertion-effect-with-fallbacks.browser.esm.js":
/*!***********************************************************************************************************************************!*\
  !*** ./node_modules/@emotion/use-insertion-effect-with-fallbacks/dist/emotion-use-insertion-effect-with-fallbacks.browser.esm.js ***!
  \***********************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useInsertionEffectAlwaysWithSyncFallback: () => (/* binding */ useInsertionEffectAlwaysWithSyncFallback),
/* harmony export */   useInsertionEffectWithLayoutFallback: () => (/* binding */ useInsertionEffectWithLayoutFallback)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);


var syncFallback = function syncFallback(create) {
  return create();
};

var useInsertionEffect = react__WEBPACK_IMPORTED_MODULE_0__['useInsertion' + 'Effect'] ? react__WEBPACK_IMPORTED_MODULE_0__['useInsertion' + 'Effect'] : false;
var useInsertionEffectAlwaysWithSyncFallback = useInsertionEffect || syncFallback;
var useInsertionEffectWithLayoutFallback = useInsertionEffect || react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect;




/***/ }),

/***/ "./node_modules/@emotion/utils/dist/emotion-utils.browser.esm.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@emotion/utils/dist/emotion-utils.browser.esm.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getRegisteredStyles: () => (/* binding */ getRegisteredStyles),
/* harmony export */   insertStyles: () => (/* binding */ insertStyles),
/* harmony export */   registerStyles: () => (/* binding */ registerStyles)
/* harmony export */ });
var isBrowser = "object" !== 'undefined';
function getRegisteredStyles(registered, registeredStyles, classNames) {
  var rawClassName = '';
  classNames.split(' ').forEach(function (className) {
    if (registered[className] !== undefined) {
      registeredStyles.push(registered[className] + ";");
    } else {
      rawClassName += className + " ";
    }
  });
  return rawClassName;
}
var registerStyles = function registerStyles(cache, serialized, isStringTag) {
  var className = cache.key + "-" + serialized.name;

  if ( // we only need to add the styles to the registered cache if the
  // class name could be used further down
  // the tree but if it's a string tag, we know it won't
  // so we don't have to add it to registered cache.
  // this improves memory usage since we can avoid storing the whole style string
  (isStringTag === false || // we need to always store it if we're in compat mode and
  // in node since emotion-server relies on whether a style is in
  // the registered cache to know whether a style is global or not
  // also, note that this check will be dead code eliminated in the browser
  isBrowser === false ) && cache.registered[className] === undefined) {
    cache.registered[className] = serialized.styles;
  }
};
var insertStyles = function insertStyles(cache, serialized, isStringTag) {
  registerStyles(cache, serialized, isStringTag);
  var className = cache.key + "-" + serialized.name;

  if (cache.inserted[serialized.name] === undefined) {
    var current = serialized;

    do {
      cache.insert(serialized === current ? "." + className : '', current, cache.sheet, true);

      current = current.next;
    } while (current !== undefined);
  }
};




/***/ }),

/***/ "./node_modules/@emotion/weak-memoize/dist/emotion-weak-memoize.esm.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@emotion/weak-memoize/dist/emotion-weak-memoize.esm.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ weakMemoize)
/* harmony export */ });
var weakMemoize = function weakMemoize(func) {
  // $FlowFixMe flow doesn't include all non-primitive types as allowed for weakmaps
  var cache = new WeakMap();
  return function (arg) {
    if (cache.has(arg)) {
      // $FlowFixMe
      return cache.get(arg);
    }

    var ret = func(arg);
    cache.set(arg, ret);
    return ret;
  };
};




/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/icon/index.js":
/*!******************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/icon/index.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/**
 * WordPress dependencies
 */


/** @typedef {{icon: JSX.Element, size?: number} & import('@wordpress/primitives').SVGProps} IconProps */

/**
 * Return an SVG icon.
 *
 * @param {IconProps}                                 props icon is the SVG component to render
 *                                                          size is a number specifiying the icon size in pixels
 *                                                          Other props will be passed to wrapped SVG component
 * @param {import('react').ForwardedRef<HTMLElement>} ref   The forwarded ref to the SVG element.
 *
 * @return {JSX.Element}  Icon component
 */
function Icon({
  icon,
  size = 24,
  ...props
}, ref) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.cloneElement)(icon, {
    width: size,
    height: size,
    ...props,
    ref
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(Icon));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/align-center.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/align-center.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__);

/**
 * WordPress dependencies
 */

const alignCenter = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.Path, {
  d: "M7.5 5.5h9V4h-9v1.5Zm-3.5 7h16V11H4v1.5Zm3.5 7h9V18h-9v1.5Z"
}));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (alignCenter);
//# sourceMappingURL=align-center.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/align-left.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/align-left.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__);

/**
 * WordPress dependencies
 */

const alignLeft = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.Path, {
  d: "M13 5.5H4V4h9v1.5Zm7 7H4V11h16v1.5Zm-7 7H4V18h9v1.5Z"
}));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (alignLeft);
//# sourceMappingURL=align-left.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/align-right.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/align-right.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__);

/**
 * WordPress dependencies
 */

const alignRight = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.Path, {
  d: "M11.111 5.5H20V4h-8.889v1.5ZM4 12.5h16V11H4v1.5Zm7.111 7H20V18h-8.889v1.5Z"
}));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (alignRight);
//# sourceMappingURL=align-right.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/backup.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/backup.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__);

/**
 * WordPress dependencies
 */

const backup = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.Path, {
  d: "M5.5 12h1.75l-2.5 3-2.5-3H4a8 8 0 113.134 6.35l.907-1.194A6.5 6.5 0 105.5 12zm9.53 1.97l-2.28-2.28V8.5a.75.75 0 00-1.5 0V12a.747.747 0 00.218.529l1.282-.84-1.28.842 2.5 2.5a.75.75 0 101.06-1.061z"
}));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (backup);
//# sourceMappingURL=backup.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/settings.js":
/*!************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/settings.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__);

/**
 * WordPress dependencies
 */

const settings = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.Path, {
  d: "m19 7.5h-7.628c-.3089-.87389-1.1423-1.5-2.122-1.5-.97966 0-1.81309.62611-2.12197 1.5h-2.12803v1.5h2.12803c.30888.87389 1.14231 1.5 2.12197 1.5.9797 0 1.8131-.62611 2.122-1.5h7.628z"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.Path, {
  d: "m19 15h-2.128c-.3089-.8739-1.1423-1.5-2.122-1.5s-1.8131.6261-2.122 1.5h-7.628v1.5h7.628c.3089.8739 1.1423 1.5 2.122 1.5s1.8131-.6261 2.122-1.5h2.128z"
}));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (settings);
//# sourceMappingURL=settings.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/trash.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/trash.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__);

/**
 * WordPress dependencies
 */

const trash = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.Path, {
  fillRule: "evenodd",
  clipRule: "evenodd",
  d: "M12 5.5A2.25 2.25 0 0 0 9.878 7h4.244A2.251 2.251 0 0 0 12 5.5ZM12 4a3.751 3.751 0 0 0-3.675 3H5v1.5h1.27l.818 8.997a2.75 2.75 0 0 0 2.739 2.501h4.347a2.75 2.75 0 0 0 2.738-2.5L17.73 8.5H19V7h-3.325A3.751 3.751 0 0 0 12 4Zm4.224 4.5H7.776l.806 8.861a1.25 1.25 0 0 0 1.245 1.137h4.347a1.25 1.25 0 0 0 1.245-1.137l.805-8.861Z"
}));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (trash);
//# sourceMappingURL=trash.js.map

/***/ }),

/***/ "./src/components/background-selector-control/index.js":
/*!*************************************************************!*\
  !*** ./src/components/background-selector-control/index.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/trash.js");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./editor.scss */ "./src/components/background-selector-control/editor.scss");
/* harmony import */ var _control_panel_control_index_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../control-panel-control/index.js */ "./src/components/control-panel-control/index.js");
/* harmony import */ var _toogle_group_control_index_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../toogle-group-control/index.js */ "./src/components/toogle-group-control/index.js");

/**
 * WordPress dependencies
 */







/**
 * Internal dependencies
 */



const BackgroundSelectorControl = ({
  backgroundType,
  backgroundColor,
  image,
  gradient,
  backgroundAttachment,
  backgroundRepeat,
  backgroundSize,
  focalPoint,
  changeImage,
  changeColor,
  removeImage,
  changeBackgroundType,
  changeGradient,
  changeBackgroundAttachment,
  changeBackgroundRepeat,
  changeBackgroundSize,
  changeFocalPoint,
  currentSide,
  setAttributes
}) => {
  const instanceId = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_4__.useInstanceId)(BackgroundSelectorControl);
  const id = `inspector-background-selector-control-${instanceId}`;
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    id: id,
    className: "components-base-control cfb-background-selector-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_toogle_group_control_index_js__WEBPACK_IMPORTED_MODULE_8__["default"], {
    value: backgroundType,
    options: [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Color', 'cfb-blocks'),
      value: 'color'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Image', 'cfb-blocks'),
      value: 'image'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Gradient', 'cfb-blocks'),
      value: 'gradient'
    }],
    onChange: changeBackgroundType
  }), ('color' === backgroundType || undefined === backgroundType) && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.__experimentalColorGradientControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Background Color', 'cfb-blocks'),
    colorValue: backgroundColor,
    onColorChange: v => {
      const attr = {};
      const value = 'undefined' === typeof v ? 'transparent' : v;
      attr[`${currentSide}BackgroundColor`] = value;
      setAttributes(attr);
    }
  }), 'image' === backgroundType && (image?.url ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.FocalPointPicker, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Focal point picker', 'cfb-blocks'),
    url: image.url,
    value: focalPoint,
    onDragStart: changeFocalPoint,
    onDrag: changeFocalPoint,
    onChange: changeFocalPoint
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "cfb-background-image-manage"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.MediaReplaceFlow, {
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Manage Image', 'cfb-blocks'),
    mediaURL: image.url,
    mediaId: image?.id,
    accept: "image/*",
    allowedTypes: ['image'],
    onSelect: changeImage
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.MenuItem, {
    icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_9__["default"],
    onClick: removeImage
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Clear Image', 'cfb-blocks')))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_control_panel_control_index_js__WEBPACK_IMPORTED_MODULE_7__["default"], {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Background Settings', 'cfb-blocks')
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Background Attachment', 'cfb-blocks'),
    value: backgroundAttachment,
    options: [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Scroll', 'cfb-blocks'),
      value: 'scroll'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Fixed', 'cfb-blocks'),
      value: 'fixed'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Local', 'cfb-blocks'),
      value: 'local'
    }],
    onChange: changeBackgroundAttachment
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Background Repeat', 'cfb-blocks'),
    value: backgroundRepeat,
    options: [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Repeat', 'cfb-blocks'),
      value: 'repeat'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('No-repeat', 'cfb-blocks'),
      value: 'no-repeat'
    }],
    onChange: changeBackgroundRepeat
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Background Size', 'cfb-blocks'),
    value: backgroundSize,
    options: [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Auto', 'cfb-blocks'),
      value: 'auto'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Cover', 'cfb-blocks'),
      value: 'cover'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Contain', 'cfb-blocks'),
      value: 'contain'
    }],
    onChange: changeBackgroundSize
  }))) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.MediaPlaceholder, {
    icon: "format-image",
    labels: {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Background Image', 'cfb-blocks'),
      name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('an image', 'cfb-blocks')
    },
    value: image?.id,
    onSelect: changeImage,
    accept: "image/*",
    allowedTypes: ['image']
  }))), 'gradient' === backgroundType && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.__experimentalColorGradientControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Background Gradient', 'cfb-blocks'),
    gradientValue: gradient,
    disableCustomColors: true,
    onGradientChange: changeGradient,
    clearable: false
  }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BackgroundSelectorControl);

/***/ }),

/***/ "./src/components/button-toggle-control/index.js":
/*!*******************************************************!*\
  !*** ./src/components/button-toggle-control/index.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./editor.scss */ "./src/components/button-toggle-control/editor.scss");


/**
 * WordPress dependencies.
 */



/**
 * Internal dependencies.
 */

const ButtonToggleControl = ({
  label,
  help,
  options,
  value,
  onChange,
  className
}) => {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: className
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.BaseControl, {
    label: label,
    help: help
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "cfb-block-button-toggle"
  }, options.map(option => {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
      className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('cfb-block-button-toggle__item', {
        'is-active': option.value === value
      }),
      key: option.value,
      variant: "secondary",
      label: option.label,
      "aria-current": option.value === value,
      onClick: () => onChange(option.value)
    }, option.label);
  }))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ButtonToggleControl);

/***/ }),

/***/ "./src/components/control-panel-control/index.js":
/*!*******************************************************!*\
  !*** ./src/components/control-panel-control/index.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/icon/index.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/backup.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/settings.js");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./editor.scss */ "./src/components/control-panel-control/editor.scss");


/**
 * External dependencies
 */


/**
 * WordPress dependencies
 */





/**
 * Internal dependencies
 */

const ControlPanelControl = ({
  label,
  attributes,
  setAttributes,
  resetValues,
  onClick,
  children
}) => {
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useEffect)(() => {
    for (const key in resetValues) {
      if (resetValues[key] !== attributes[key]) {
        return setActive(true);
      }
      setActive(false);
    }
  }, [attributes]);
  const instanceId = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_4__.useInstanceId)(ControlPanelControl);
  const [isActive, setActive] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)(false);
  const id = `inspector-control-panel-control-${instanceId}`;
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "cfb-control-panel-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "components-base-control__field"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "components-base-control__title"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    className: "components-base-control__label",
    htmlFor: id
  }, label), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "floating-controls"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Dropdown, {
    popoverProps: {
      placement: 'top-start'
    },
    headerTitle: label,
    expandOnMobile: true,
    renderToggle: ({
      isOpen,
      onToggle
    }) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.Fragment, null, isActive && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
      icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_icons__WEBPACK_IMPORTED_MODULE_7__["default"], {
        icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_8__["default"]
      }),
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Reset to default', 'cfb-blocks'),
      showTooltip: true,
      isTertiary: true,
      onClick: () => setAttributes({
        ...resetValues
      })
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
      id: id,
      icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_9__["default"],
      label: label,
      showTooltip: true,
      onClick: () => {
        onToggle();
        if (onClick) {
          onClick();
        }
      },
      "aria-expanded": isOpen,
      className: classnames__WEBPACK_IMPORTED_MODULE_1___default()({
        'is-active': isActive
      })
    })),
    renderContent: () => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "cfb-popover-settings"
    }, children)
  })))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ControlPanelControl);

/***/ }),

/***/ "./src/components/font-awesome-control/index.js":
/*!******************************************************!*\
  !*** ./src/components/font-awesome-control/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _fa_icons_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fa-icons.json */ "./src/components/font-awesome-control/fa-icons.json");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../helpers/helper-functions.js */ "./src/helpers/helper-functions.js");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__);







const FontAwesomeIconsList = ({
  i,
  icon,
  prefix,
  onToggle
}) => {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__.MenuItem, {
    label: i.label,
    className: classnames__WEBPACK_IMPORTED_MODULE_2___default()({
      'is-selected': i.name === icon && i.prefix === prefix
    }),
    onClick: onToggle
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("i", {
    className: classnames__WEBPACK_IMPORTED_MODULE_2___default()(i.prefix, `fa-${i.name}`, 'fa-fw')
  }));
};
const fontAwesomePicker = props => {
  var _px2;
  const label = props.label;
  const icon = props.iconObj?.name;
  const prefix = props.iconObj?.prefix;
  const setAttributes = props.setAttributes;
  const setAttr = props.attrName;
  const fontSizeLabel = props.fontSizeLabel;
  const fontSize = props.fontSize;
  const fontColorLabel = props.fontColorLabel;
  const fontColor = props.fontColor;
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
    const icons = [];
    Object.keys(_fa_icons_json__WEBPACK_IMPORTED_MODULE_1__).forEach(i => {
      Object.keys(_fa_icons_json__WEBPACK_IMPORTED_MODULE_1__[i].styles).forEach(o => {
        let prefix = '';
        switch (_fa_icons_json__WEBPACK_IMPORTED_MODULE_1__[i].styles[o]) {
          case 'brands':
            prefix = 'fab';
            break;
          case 'solid':
            prefix = 'fas';
            break;
          case 'regular':
            prefix = 'far';
            break;
          default:
            prefix = 'fas';
        }
        icons.push({
          name: i,
          unicode: _fa_icons_json__WEBPACK_IMPORTED_MODULE_1__[i].unicode,
          prefix,
          label: _fa_icons_json__WEBPACK_IMPORTED_MODULE_1__[i].label
        });
      });
    });
    setIcons(icons);
  }, []);
  const [search, setSearch] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)('');
  const [icons, setIcons] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)(null);
  const onSelectIcon = (onToggle, i) => {
    onToggle();
    const dataSet = {
      prefix: i.prefix,
      name: `fa-${i.name}`
    };
    const attr = {};
    attr[setAttr] = dataSet;
    setAttributes(attr);
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__.ToolbarGroup, {
    className: "cfb-block-icon-toolbar"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__.Dropdown, {
    key: label,
    contentClassName: "cfb-icon-picker-popover",
    popoverProps: {
      placement: 'top-start'
    },
    renderToggle: ({
      isOpen,
      onToggle
    }) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__.ToolbarButton, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Menu Icons', 'cfb-blocks'),
      className: "cfb-block-icon-picker-btn",
      showTooltip: true,
      onClick: onToggle
    }, prefix && icon ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("i", {
      className: classnames__WEBPACK_IMPORTED_MODULE_2___default()(prefix, icon, 'fa-fw')
    }) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("i", {
      className: "fas fa-clock"
    })),
    renderContent: ({
      onToggle
    }) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__.MenuGroup, {
      label: label
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__.TextControl, {
      value: search,
      onChange: e => setSearch(e)
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "cfb-fontawesome-items"
    }, icons.map((i, index) => {
      if (!search || i.name.match(search.toLowerCase()) || i.label.toLowerCase().match(search.toLowerCase())) {
        return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(FontAwesomeIconsList, {
          key: index,
          i: i,
          icon: icon,
          prefix: prefix,
          onToggle: () => onSelectIcon(onToggle, i)
        });
      }
    })))
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "cfb-fontawesome-size-setting"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    className: "cfb-fontawesome-setting-label"
  }, "Icon Size"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__.__experimentalUnitControl, {
    onChange: sizeLabel => {
      const attr = {};
      attr[fontSizeLabel] = sizeLabel;
      props.setAttributes(attr);
    },
    isUnitSelectTabbable: true,
    isResetValueOnUnitChange: true,
    value: (_px2 = (0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_4__._px)(fontSize)) !== null && _px2 !== void 0 ? _px2 : fontSize,
    units: [{
      value: 'px',
      label: 'px',
      default: 0
    }, {
      value: 'em',
      label: 'em',
      default: 0
    }]
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    className: "cfb-fontawesome-setting-label"
  }, "Icon Color"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__.ColorPalette, {
    className: "cfb-fontawesome-color-setting",
    value: fontColor,
    colors: [{
      name: 'default',
      color: fontColor
    }],
    onChange: v => {
      const attr = {};
      attr[fontColorLabel] = v;
      setAttributes(attr);
    }
  }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (fontAwesomePicker);

/***/ }),

/***/ "./src/components/index.js":
/*!*********************************!*\
  !*** ./src/components/index.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BackgroundSelectorControl: () => (/* reexport safe */ _background_selector_control_index_js__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   ButtonToggleControl: () => (/* reexport safe */ _button_toggle_control_index_js__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   ControlPanelControl: () => (/* reexport safe */ _control_panel_control_index_js__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   ToogleGroupControl: () => (/* reexport safe */ _toogle_group_control_index_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   TypographyControl: () => (/* reexport safe */ _typography_index_js__WEBPACK_IMPORTED_MODULE_4__["default"])
/* harmony export */ });
/* harmony import */ var _background_selector_control_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./background-selector-control/index.js */ "./src/components/background-selector-control/index.js");
/* harmony import */ var _button_toggle_control_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./button-toggle-control/index.js */ "./src/components/button-toggle-control/index.js");
/* harmony import */ var _control_panel_control_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./control-panel-control/index.js */ "./src/components/control-panel-control/index.js");
/* harmony import */ var _toogle_group_control_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./toogle-group-control/index.js */ "./src/components/toogle-group-control/index.js");
/* harmony import */ var _typography_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./typography/index.js */ "./src/components/typography/index.js");
/**
 * Internal dependencies
 */






/***/ }),

/***/ "./src/components/toogle-group-control/index.js":
/*!******************************************************!*\
  !*** ./src/components/toogle-group-control/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./editor.scss */ "./src/components/toogle-group-control/editor.scss");


/**
 * WordPress dependencies
 */


/**
 * Internal dependencies
 */


/**
 *	A group of buttons that actions as a toggle
 *
 * @param {import('./type').ToggleGroupControlProps} props
 * @returns {JSX.Element}
 */
const ToogleGroupControl = ({
  value,
  options,
  onChange,
  hasIcon = false
}) => {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ButtonGroup, {
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('cfb-toggle-group-control', {
      'has-icon': hasIcon
    })
  }, options?.map(option => {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      key: option?.value,
      className: "cfb-toggle-option"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      key: option?.value,
      isPrimary: value == option?.value,
      variant: value == option?.value ? 'primary' : 'secondary',
      icon: option?.icon,
      label: option?.label,
      onClick: () => onChange(option?.value),
      showTooltip: hasIcon
    }, hasIcon ? '' : option?.label));
  }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ToogleGroupControl);

/***/ }),

/***/ "./src/components/typography/font-typography.js":
/*!******************************************************!*\
  !*** ./src/components/typography/font-typography.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-select */ "./node_modules/react-select/dist/react-select.esm.js");
/* harmony import */ var _fonts_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./fonts.js */ "./src/components/typography/fonts.js");

/**
 * WordPress dependencies
 */


const {
  SelectControl
} = wp.components;

/**
 * Internal dependencies
 */

function FontFamilyControl(props) {
  const fonts = [{
    value: "",
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Default", 'cfb-block'),
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    google: false
  }, {
    value: "Arial",
    label: "Arial",
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    google: false
  }, {
    value: "Helvetica",
    label: "Helvetica",
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    google: false
  }, {
    value: "Times New Roman",
    label: "Times New Roman",
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    google: false
  }, {
    value: "Georgia",
    label: "Georgia",
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    google: false
  }];
  let fontWeight = "";

  //Push Google Fonts into stytem fonts object
  Object.keys(_fonts_js__WEBPACK_IMPORTED_MODULE_2__["default"]).map((k, v) => {
    fonts.push({
      value: k,
      label: k,
      weight: _fonts_js__WEBPACK_IMPORTED_MODULE_2__["default"][k].weight
    });
    if (k === props.fontFamily.value) {
      fontWeight = _fonts_js__WEBPACK_IMPORTED_MODULE_2__["default"][k].weight;
    }
  });

  // check if the font is a system font and then apply the font weight accordingly.
  if (fontWeight === "") {
    fontWeight = fonts[0].weight;
  }
  const fontWeightObj = [];
  fontWeight.forEach(function (item) {
    fontWeightObj.push({
      value: item,
      label: item
    });
  });
  const onFontfamilyChange = value => {
    const {
      loadGoogleFonts,
      fontFamily,
      fontWeight,
      fontSubset
    } = props;
    props.setAttributes({
      [fontFamily.label]: value.label
    });
    onLoadGoogleFonts(loadGoogleFonts, value.label);
    onFontChange(fontWeight, fontSubset, value.label);
  };
  const onFontChange = (fontWeight, fontSubset, fontFamily) => {
    let font_flag;
    let new_value;
    if (typeof _fonts_js__WEBPACK_IMPORTED_MODULE_2__["default"][fontFamily] == "object") {
      const gfontsObj = _fonts_js__WEBPACK_IMPORTED_MODULE_2__["default"][fontFamily].weight;
      if (typeof gfontsObj == "object") {
        gfontsObj.forEach(function (item) {
          if (fontWeight.value == item) {
            font_flag = false;
          } else {
            new_value = item;
            font_flag = true;
            props.setAttributes({
              [props.fontWeight.label]: new_value
            });
            return;
          }
        });
      }
    }
  };
  const onLoadGoogleFonts = (loadGoogleFonts, fontFamily) => {
    let value;
    if (fontFamily != "" && typeof _fonts_js__WEBPACK_IMPORTED_MODULE_2__["default"][fontFamily] != "object") {
      value = false;
    } else {
      value = true;
    }
    props.setAttributes({
      [loadGoogleFonts.label]: value
    });
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "cfb-block-typography-font-family-options"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    className: "cfb-block-typography-font-family-label"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Font Family", 'cfb-block')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_select__WEBPACK_IMPORTED_MODULE_3__["default"], {
    options: fonts,
    value: {
      value: props.fontFamily.value,
      label: props.fontFamily.value,
      weight: fontWeightObj
    },
    isMulti: false,
    maxMenuHeight: 300,
    onChange: onFontfamilyChange,
    className: "react-select-container",
    classNamePrefix: "react-select"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Font Weight", 'cfb-block'),
    value: props.fontWeight.value,
    onChange: value => props.setAttributes({
      [props.fontWeight.label]: value
    }),
    options: fontWeightObj
  }));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FontFamilyControl);

/***/ }),

/***/ "./src/components/typography/fontloader.js":
/*!*************************************************!*\
  !*** ./src/components/typography/fontloader.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var webfontloader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! webfontloader */ "./node_modules/webfontloader/webfontloader.js");
/* harmony import */ var webfontloader__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(webfontloader__WEBPACK_IMPORTED_MODULE_0__);
if (googlefonts === undefined) {
  var googlefonts = [];
}
const {
  Component
} = wp.element;


const statuses = {
  inactive: "inactive",
  active: "active",
  loading: "loading"
};
const noop = () => {};
class WebfontLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: undefined
    };
    this.handleLoading = () => {
      this.setState({
        status: statuses.loading
      });
    };
    this.addFont = font => {
      if (!googlefonts.includes(font)) {
        googlefonts.push(font);
      }
    };
    this.handleActive = () => {
      this.setState({
        status: statuses.active
      });
    };
    this.handleInactive = () => {
      this.setState({
        status: statuses.inactive
      });
    };
    this.loadFonts = () => {
      if (!googlefonts.includes(this.props.config.google.families[0])) {
        webfontloader__WEBPACK_IMPORTED_MODULE_0___default().load({
          ...this.props.config,
          loading: this.handleLoading,
          active: this.handleActive,
          inactive: this.handleInactive
        });
        this.addFont(this.props.config.google.families[0]);
      }
    };
  }
  componentDidMount() {
    this.loadFonts();
  }
  componentDidUpdate(prevProps, prevState) {
    const {
      onStatus,
      config
    } = this.props;
    if (prevState.status !== this.state.status) {
      onStatus(this.state.status);
    }
    if (prevProps.config !== config) {
      this.loadFonts();
    }
  }
  render() {
    const {
      children
    } = this.props;
    return children || null;
  }
}
WebfontLoader.propTypes = {
  config: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().object).isRequired,
  children: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().element),
  onStatus: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().func).isRequired
};
WebfontLoader.defaultProps = {
  onStatus: noop
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (WebfontLoader);

/***/ }),

/***/ "./src/components/typography/fonts.js":
/*!********************************************!*\
  !*** ./src/components/typography/fonts.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Google Fonts for the FontFamily component.
 */

const fonts = {};
fonts["ABeeZee"] = {
  "v": ["regular", "italic"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal", "italic"]
};
fonts["Abel"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Abhaya Libre"] = {
  "v": ["regular", "500", "600", "700", "800"],
  "subset": ["latin-ext", "sinhala", "latin"],
  "weight": ["400", "500", "600", "700", "800"],
  "i": ["normal"]
};
fonts["Abril Fatface"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Aclonica"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Acme"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Actor"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Adamina"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Advent Pro"] = {
  "v": ["100", "200", "300", "regular", "500", "600", "700"],
  "subset": ["latin-ext", "greek", "latin"],
  "weight": ["100", "200", "300", "400", "500", "600", "700"],
  "i": ["normal"]
};
fonts["Aguafina Script"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Akronim"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Aladin"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Aldrich"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Alef"] = {
  "v": ["regular", "700"],
  "subset": ["hebrew", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Alegreya"] = {
  "v": ["regular", "italic", "500", "500italic", "700", "700italic", "800", "800italic", "900", "900italic"],
  "subset": ["cyrillic", "cyrillic-ext", "greek-ext", "latin-ext", "greek", "vietnamese", "latin"],
  "weight": ["400", "500", "700", "800", "900"],
  "i": ["normal", "italic"]
};
fonts["Alegreya SC"] = {
  "v": ["regular", "italic", "500", "500italic", "700", "700italic", "800", "800italic", "900", "900italic"],
  "subset": ["cyrillic", "cyrillic-ext", "greek-ext", "latin-ext", "greek", "vietnamese", "latin"],
  "weight": ["400", "500", "700", "800", "900"],
  "i": ["normal", "italic"]
};
fonts["Alegreya Sans"] = {
  "v": ["100", "100italic", "300", "300italic", "regular", "italic", "500", "500italic", "700", "700italic", "800", "800italic", "900", "900italic"],
  "subset": ["cyrillic", "cyrillic-ext", "greek-ext", "latin-ext", "greek", "vietnamese", "latin"],
  "weight": ["100", "300", "400", "500", "700", "800", "900"],
  "i": ["normal", "italic"]
};
fonts["Alegreya Sans SC"] = {
  "v": ["100", "100italic", "300", "300italic", "regular", "italic", "500", "500italic", "700", "700italic", "800", "800italic", "900", "900italic"],
  "subset": ["cyrillic", "cyrillic-ext", "greek-ext", "latin-ext", "greek", "vietnamese", "latin"],
  "weight": ["100", "300", "400", "500", "700", "800", "900"],
  "i": ["normal", "italic"]
};
fonts["Alex Brush"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Alfa Slab One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Alice"] = {
  "v": ["regular"],
  "subset": ["cyrillic", "cyrillic-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Alike"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Alike Angular"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Allan"] = {
  "v": ["regular", "700"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Allerta"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Allerta Stencil"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Allura"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Almendra"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Almendra Display"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Almendra SC"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Amarante"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Amaranth"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Amatic SC"] = {
  "v": ["regular", "700"],
  "subset": ["cyrillic", "latin-ext", "hebrew", "vietnamese", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Amethysta"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Amiko"] = {
  "v": ["regular", "600", "700"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["400", "600", "700"],
  "i": ["normal"]
};
fonts["Amiri"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["latin-ext", "arabic", "latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Amita"] = {
  "v": ["regular", "700"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Anaheim"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Andada"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Andika"] = {
  "v": ["regular"],
  "subset": ["cyrillic", "cyrillic-ext", "latin-ext", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Angkor"] = {
  "v": ["regular"],
  "subset": ["khmer"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Annie Use Your Telescope"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Anonymous Pro"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["cyrillic", "latin-ext", "greek", "latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Antic"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Antic Didone"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Antic Slab"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Anton"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Arapey"] = {
  "v": ["regular", "italic"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal", "italic"]
};
fonts["Arbutus"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Arbutus Slab"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Architects Daughter"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Archivo"] = {
  "v": ["regular", "italic", "500", "500italic", "600", "600italic", "700", "700italic"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["400", "500", "600", "700"],
  "i": ["normal", "italic"]
};
fonts["Archivo Black"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Archivo Narrow"] = {
  "v": ["regular", "italic", "500", "500italic", "600", "600italic", "700", "700italic"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "500", "600", "700"],
  "i": ["normal", "italic"]
};
fonts["Aref Ruqaa"] = {
  "v": ["regular", "700"],
  "subset": ["arabic", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Arima Madurai"] = {
  "v": ["100", "200", "300", "regular", "500", "700", "800", "900"],
  "subset": ["latin-ext", "tamil", "vietnamese", "latin"],
  "weight": ["100", "200", "300", "400", "500", "700", "800", "900"],
  "i": ["normal"]
};
fonts["Arimo"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["cyrillic", "cyrillic-ext", "greek-ext", "latin-ext", "hebrew", "greek", "vietnamese", "latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Arizonia"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Armata"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Arsenal"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["cyrillic", "cyrillic-ext", "latin-ext", "vietnamese", "latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Artifika"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Arvo"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Arya"] = {
  "v": ["regular", "700"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Asap"] = {
  "v": ["regular", "italic", "500", "500italic", "600", "600italic", "700", "700italic"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["400", "500", "600", "700"],
  "i": ["normal", "italic"]
};
fonts["Asap Condensed"] = {
  "v": ["regular", "italic", "500", "500italic", "600", "600italic", "700", "700italic"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["400", "500", "600", "700"],
  "i": ["normal", "italic"]
};
fonts["Asar"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Asset"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Assistant"] = {
  "v": ["200", "300", "regular", "600", "700", "800"],
  "subset": ["hebrew", "latin"],
  "weight": ["200", "300", "400", "600", "700", "800"],
  "i": ["normal"]
};
fonts["Astloch"] = {
  "v": ["regular", "700"],
  "subset": ["latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Asul"] = {
  "v": ["regular", "700"],
  "subset": ["latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Athiti"] = {
  "v": ["200", "300", "regular", "500", "600", "700"],
  "subset": ["latin-ext", "thai", "vietnamese", "latin"],
  "weight": ["200", "300", "400", "500", "600", "700"],
  "i": ["normal"]
};
fonts["Atma"] = {
  "v": ["300", "regular", "500", "600", "700"],
  "subset": ["latin-ext", "bengali", "latin"],
  "weight": ["300", "400", "500", "600", "700"],
  "i": ["normal"]
};
fonts["Atomic Age"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Aubrey"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Audiowide"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Autour One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Average"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Average Sans"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Averia Gruesa Libre"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Averia Libre"] = {
  "v": ["300", "300italic", "regular", "italic", "700", "700italic"],
  "subset": ["latin"],
  "weight": ["300", "400", "700"],
  "i": ["normal", "italic"]
};
fonts["Averia Sans Libre"] = {
  "v": ["300", "300italic", "regular", "italic", "700", "700italic"],
  "subset": ["latin"],
  "weight": ["300", "400", "700"],
  "i": ["normal", "italic"]
};
fonts["Averia Serif Libre"] = {
  "v": ["300", "300italic", "regular", "italic", "700", "700italic"],
  "subset": ["latin"],
  "weight": ["300", "400", "700"],
  "i": ["normal", "italic"]
};
fonts["Bad Script"] = {
  "v": ["regular"],
  "subset": ["cyrillic", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Bahiana"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Baloo"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "devanagari", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Baloo Bhai"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "gujarati", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Baloo Bhaijaan"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "arabic", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Baloo Bhaina"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "oriya", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Baloo Chettan"] = {
  "v": ["regular"],
  "subset": ["malayalam", "latin-ext", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Baloo Da"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "vietnamese", "bengali", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Baloo Paaji"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "gurmukhi", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Baloo Tamma"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "vietnamese", "latin", "kannada"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Baloo Tammudu"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "telugu", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Baloo Thambi"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "tamil", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Balthazar"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Bangers"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Barlow"] = {
  "v": ["100", "100italic", "200", "200italic", "300", "300italic", "regular", "italic", "500", "500italic", "600", "600italic", "700", "700italic", "800", "800italic", "900", "900italic"],
  "subset": ["latin-ext", "latin"],
  "weight": ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  "i": ["normal", "italic"]
};
fonts["Barlow Condensed"] = {
  "v": ["100", "100italic", "200", "200italic", "300", "300italic", "regular", "italic", "500", "500italic", "600", "600italic", "700", "700italic", "800", "800italic", "900", "900italic"],
  "subset": ["latin-ext", "latin"],
  "weight": ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  "i": ["normal", "italic"]
};
fonts["Barlow Semi Condensed"] = {
  "v": ["100", "100italic", "200", "200italic", "300", "300italic", "regular", "italic", "500", "500italic", "600", "600italic", "700", "700italic", "800", "800italic", "900", "900italic"],
  "subset": ["latin-ext", "latin"],
  "weight": ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  "i": ["normal", "italic"]
};
fonts["Barrio"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Basic"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Battambang"] = {
  "v": ["regular", "700"],
  "subset": ["khmer"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Baumans"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Bayon"] = {
  "v": ["regular"],
  "subset": ["khmer"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Belgrano"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Bellefair"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "hebrew", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Belleza"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["BenchNine"] = {
  "v": ["300", "regular", "700"],
  "subset": ["latin-ext", "latin"],
  "weight": ["300", "400", "700"],
  "i": ["normal"]
};
fonts["Bentham"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Berkshire Swash"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Bevan"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Bigelow Rules"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Bigshot One"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Bilbo"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Bilbo Swash Caps"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["BioRhyme"] = {
  "v": ["200", "300", "regular", "700", "800"],
  "subset": ["latin-ext", "latin"],
  "weight": ["200", "300", "400", "700", "800"],
  "i": ["normal"]
};
fonts["BioRhyme Expanded"] = {
  "v": ["200", "300", "regular", "700", "800"],
  "subset": ["latin-ext", "latin"],
  "weight": ["200", "300", "400", "700", "800"],
  "i": ["normal"]
};
fonts["Biryani"] = {
  "v": ["200", "300", "regular", "600", "700", "800", "900"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["200", "300", "400", "600", "700", "800", "900"],
  "i": ["normal"]
};
fonts["Bitter"] = {
  "v": ["regular", "italic", "700"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Black And White Picture"] = {
  "v": ["regular"],
  "subset": ["korean", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Black Han Sans"] = {
  "v": ["regular"],
  "subset": ["korean", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Black Ops One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Bokor"] = {
  "v": ["regular"],
  "subset": ["khmer"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Bonbon"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Boogaloo"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Bowlby One"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Bowlby One SC"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Brawler"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Bree Serif"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Bubblegum Sans"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Bubbler One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Buda"] = {
  "v": ["300"],
  "subset": ["latin"],
  "weight": ["300"],
  "i": []
};
fonts["Buenard"] = {
  "v": ["regular", "700"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Bungee"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Bungee Hairline"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Bungee Inline"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Bungee Outline"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Bungee Shade"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Butcherman"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Butterfly Kids"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Cabin"] = {
  "v": ["regular", "italic", "500", "500italic", "600", "600italic", "700", "700italic"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["400", "500", "600", "700"],
  "i": ["normal", "italic"]
};
fonts["Cabin Condensed"] = {
  "v": ["regular", "500", "600", "700"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["400", "500", "600", "700"],
  "i": ["normal"]
};
fonts["Cabin Sketch"] = {
  "v": ["regular", "700"],
  "subset": ["latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Caesar Dressing"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Cagliostro"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Cairo"] = {
  "v": ["200", "300", "regular", "600", "700", "900"],
  "subset": ["latin-ext", "arabic", "latin"],
  "weight": ["200", "300", "400", "600", "700", "900"],
  "i": ["normal"]
};
fonts["Calligraffitti"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Cambay"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Cambo"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Candal"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Cantarell"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Cantata One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Cantora One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Capriola"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Cardo"] = {
  "v": ["regular", "italic", "700"],
  "subset": ["greek-ext", "latin-ext", "greek", "latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Carme"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Carrois Gothic"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Carrois Gothic SC"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Carter One"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Catamaran"] = {
  "v": ["100", "200", "300", "regular", "500", "600", "700", "800", "900"],
  "subset": ["latin-ext", "tamil", "latin"],
  "weight": ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  "i": ["normal"]
};
fonts["Caudex"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["greek-ext", "latin-ext", "greek", "latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Caveat"] = {
  "v": ["regular", "700"],
  "subset": ["cyrillic", "latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Caveat Brush"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Cedarville Cursive"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Ceviche One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Changa"] = {
  "v": ["200", "300", "regular", "500", "600", "700", "800"],
  "subset": ["latin-ext", "arabic", "latin"],
  "weight": ["200", "300", "400", "500", "600", "700", "800"],
  "i": ["normal"]
};
fonts["Changa One"] = {
  "v": ["regular", "italic"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal", "italic"]
};
fonts["Chango"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Chathura"] = {
  "v": ["100", "300", "regular", "700", "800"],
  "subset": ["telugu", "latin"],
  "weight": ["100", "300", "400", "700", "800"],
  "i": ["normal"]
};
fonts["Chau Philomene One"] = {
  "v": ["regular", "italic"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal", "italic"]
};
fonts["Chela One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Chelsea Market"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Chenla"] = {
  "v": ["regular"],
  "subset": ["khmer"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Cherry Cream Soda"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Cherry Swash"] = {
  "v": ["regular", "700"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Chewy"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Chicle"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Chivo"] = {
  "v": ["300", "300italic", "regular", "italic", "700", "700italic", "900", "900italic"],
  "subset": ["latin-ext", "latin"],
  "weight": ["300", "400", "700", "900"],
  "i": ["normal", "italic"]
};
fonts["Chonburi"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "thai", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Cinzel"] = {
  "v": ["regular", "700", "900"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "700", "900"],
  "i": ["normal"]
};
fonts["Cinzel Decorative"] = {
  "v": ["regular", "700", "900"],
  "subset": ["latin"],
  "weight": ["400", "700", "900"],
  "i": ["normal"]
};
fonts["Clicker Script"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Coda"] = {
  "v": ["regular", "800"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "800"],
  "i": ["normal"]
};
fonts["Coda Caption"] = {
  "v": ["800"],
  "subset": ["latin-ext", "latin"],
  "weight": ["800"],
  "i": []
};
fonts["Codystar"] = {
  "v": ["300", "regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["300", "400"],
  "i": ["normal"]
};
fonts["Coiny"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "tamil", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Combo"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Comfortaa"] = {
  "v": ["300", "regular", "700"],
  "subset": ["cyrillic", "cyrillic-ext", "latin-ext", "greek", "vietnamese", "latin"],
  "weight": ["300", "400", "700"],
  "i": ["normal"]
};
fonts["Coming Soon"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Concert One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Condiment"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Content"] = {
  "v": ["regular", "700"],
  "subset": ["khmer"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Contrail One"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Convergence"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Cookie"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Copse"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Corben"] = {
  "v": ["regular", "700"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Cormorant"] = {
  "v": ["300", "300italic", "regular", "italic", "500", "500italic", "600", "600italic", "700", "700italic"],
  "subset": ["cyrillic", "cyrillic-ext", "latin-ext", "vietnamese", "latin"],
  "weight": ["300", "400", "500", "600", "700"],
  "i": ["normal", "italic"]
};
fonts["Cormorant Garamond"] = {
  "v": ["300", "300italic", "regular", "italic", "500", "500italic", "600", "600italic", "700", "700italic"],
  "subset": ["cyrillic", "cyrillic-ext", "latin-ext", "vietnamese", "latin"],
  "weight": ["300", "400", "500", "600", "700"],
  "i": ["normal", "italic"]
};
fonts["Cormorant Infant"] = {
  "v": ["300", "300italic", "regular", "italic", "500", "500italic", "600", "600italic", "700", "700italic"],
  "subset": ["cyrillic", "cyrillic-ext", "latin-ext", "vietnamese", "latin"],
  "weight": ["300", "400", "500", "600", "700"],
  "i": ["normal", "italic"]
};
fonts["Cormorant SC"] = {
  "v": ["300", "regular", "500", "600", "700"],
  "subset": ["cyrillic", "cyrillic-ext", "latin-ext", "vietnamese", "latin"],
  "weight": ["300", "400", "500", "600", "700"],
  "i": ["normal"]
};
fonts["Cormorant Unicase"] = {
  "v": ["300", "regular", "500", "600", "700"],
  "subset": ["cyrillic", "cyrillic-ext", "latin-ext", "vietnamese", "latin"],
  "weight": ["300", "400", "500", "600", "700"],
  "i": ["normal"]
};
fonts["Cormorant Upright"] = {
  "v": ["300", "regular", "500", "600", "700"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["300", "400", "500", "600", "700"],
  "i": ["normal"]
};
fonts["Courgette"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Cousine"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["cyrillic", "cyrillic-ext", "greek-ext", "latin-ext", "hebrew", "greek", "vietnamese", "latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Coustard"] = {
  "v": ["regular", "900"],
  "subset": ["latin"],
  "weight": ["400", "900"],
  "i": ["normal"]
};
fonts["Covered By Your Grace"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Crafty Girls"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Creepster"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Crete Round"] = {
  "v": ["regular", "italic"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal", "italic"]
};
fonts["Crimson Text"] = {
  "v": ["regular", "italic", "600", "600italic", "700", "700italic"],
  "subset": ["latin"],
  "weight": ["400", "600", "700"],
  "i": ["normal", "italic"]
};
fonts["Croissant One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Crushed"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Cuprum"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["cyrillic", "cyrillic-ext", "latin-ext", "vietnamese", "latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Cute Font"] = {
  "v": ["regular"],
  "subset": ["korean", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Cutive"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Cutive Mono"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Damion"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Dancing Script"] = {
  "v": ["regular", "700"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Dangrek"] = {
  "v": ["regular"],
  "subset": ["khmer"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["David Libre"] = {
  "v": ["regular", "500", "700"],
  "subset": ["latin-ext", "hebrew", "vietnamese", "latin"],
  "weight": ["400", "500", "700"],
  "i": ["normal"]
};
fonts["Dawning of a New Day"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Days One"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Dekko"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Delius"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Delius Swash Caps"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Delius Unicase"] = {
  "v": ["regular", "700"],
  "subset": ["latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Della Respira"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Denk One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Devonshire"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Dhurjati"] = {
  "v": ["regular"],
  "subset": ["telugu", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Didact Gothic"] = {
  "v": ["regular"],
  "subset": ["cyrillic", "cyrillic-ext", "greek-ext", "latin-ext", "greek", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Diplomata"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Diplomata SC"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Do Hyeon"] = {
  "v": ["regular"],
  "subset": ["korean", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Dokdo"] = {
  "v": ["regular"],
  "subset": ["korean", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Domine"] = {
  "v": ["regular", "700"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Donegal One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Doppio One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Dorsa"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Dosis"] = {
  "v": ["200", "300", "regular", "500", "600", "700", "800"],
  "subset": ["latin-ext", "latin"],
  "weight": ["200", "300", "400", "500", "600", "700", "800"],
  "i": ["normal"]
};
fonts["Dr Sugiyama"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Duru Sans"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Dynalight"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["EB Garamond"] = {
  "v": ["regular", "italic", "500", "500italic", "600", "600italic", "700", "700italic", "800", "800italic"],
  "subset": ["cyrillic", "cyrillic-ext", "greek-ext", "latin-ext", "greek", "vietnamese", "latin"],
  "weight": ["400", "500", "600", "700", "800"],
  "i": ["normal", "italic"]
};
fonts["Eagle Lake"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["East Sea Dokdo"] = {
  "v": ["regular"],
  "subset": ["korean", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Eater"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Economica"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Eczar"] = {
  "v": ["regular", "500", "600", "700", "800"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["400", "500", "600", "700", "800"],
  "i": ["normal"]
};
fonts["El Messiri"] = {
  "v": ["regular", "500", "600", "700"],
  "subset": ["cyrillic", "arabic", "latin"],
  "weight": ["400", "500", "600", "700"],
  "i": ["normal"]
};
fonts["Electrolize"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Elsie"] = {
  "v": ["regular", "900"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "900"],
  "i": ["normal"]
};
fonts["Elsie Swash Caps"] = {
  "v": ["regular", "900"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "900"],
  "i": ["normal"]
};
fonts["Emblema One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Emilys Candy"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Encode Sans"] = {
  "v": ["100", "200", "300", "regular", "500", "600", "700", "800", "900"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  "i": ["normal"]
};
fonts["Encode Sans Condensed"] = {
  "v": ["100", "200", "300", "regular", "500", "600", "700", "800", "900"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  "i": ["normal"]
};
fonts["Encode Sans Expanded"] = {
  "v": ["100", "200", "300", "regular", "500", "600", "700", "800", "900"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  "i": ["normal"]
};
fonts["Encode Sans Semi Condensed"] = {
  "v": ["100", "200", "300", "regular", "500", "600", "700", "800", "900"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  "i": ["normal"]
};
fonts["Encode Sans Semi Expanded"] = {
  "v": ["100", "200", "300", "regular", "500", "600", "700", "800", "900"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  "i": ["normal"]
};
fonts["Engagement"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Englebert"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Enriqueta"] = {
  "v": ["regular", "700"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Erica One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Esteban"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Euphoria Script"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Ewert"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Exo"] = {
  "v": ["100", "100italic", "200", "200italic", "300", "300italic", "regular", "italic", "500", "500italic", "600", "600italic", "700", "700italic", "800", "800italic", "900", "900italic"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  "i": ["normal", "italic"]
};
fonts["Exo 2"] = {
  "v": ["100", "100italic", "200", "200italic", "300", "300italic", "regular", "italic", "500", "500italic", "600", "600italic", "700", "700italic", "800", "800italic", "900", "900italic"],
  "subset": ["cyrillic", "latin-ext", "latin"],
  "weight": ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  "i": ["normal", "italic"]
};
fonts["Expletus Sans"] = {
  "v": ["regular", "italic", "500", "500italic", "600", "600italic", "700", "700italic"],
  "subset": ["latin"],
  "weight": ["400", "500", "600", "700"],
  "i": ["normal", "italic"]
};
fonts["Fanwood Text"] = {
  "v": ["regular", "italic"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal", "italic"]
};
fonts["Farsan"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "gujarati", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Fascinate"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Fascinate Inline"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Faster One"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Fasthand"] = {
  "v": ["regular"],
  "subset": ["khmer"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Fauna One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Faustina"] = {
  "v": ["regular", "italic", "500", "500italic", "600", "600italic", "700", "700italic"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["400", "500", "600", "700"],
  "i": ["normal", "italic"]
};
fonts["Federant"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Federo"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Felipa"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Fenix"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Finger Paint"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Fira Mono"] = {
  "v": ["regular", "500", "700"],
  "subset": ["cyrillic", "cyrillic-ext", "greek-ext", "latin-ext", "greek", "latin"],
  "weight": ["400", "500", "700"],
  "i": ["normal"]
};
fonts["Fira Sans"] = {
  "v": ["100", "100italic", "200", "200italic", "300", "300italic", "regular", "italic", "500", "500italic", "600", "600italic", "700", "700italic", "800", "800italic", "900", "900italic"],
  "subset": ["cyrillic", "cyrillic-ext", "greek-ext", "latin-ext", "greek", "vietnamese", "latin"],
  "weight": ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  "i": ["normal", "italic"]
};
fonts["Fira Sans Condensed"] = {
  "v": ["100", "100italic", "200", "200italic", "300", "300italic", "regular", "italic", "500", "500italic", "600", "600italic", "700", "700italic", "800", "800italic", "900", "900italic"],
  "subset": ["cyrillic", "cyrillic-ext", "greek-ext", "latin-ext", "greek", "vietnamese", "latin"],
  "weight": ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  "i": ["normal", "italic"]
};
fonts["Fira Sans Extra Condensed"] = {
  "v": ["100", "100italic", "200", "200italic", "300", "300italic", "regular", "italic", "500", "500italic", "600", "600italic", "700", "700italic", "800", "800italic", "900", "900italic"],
  "subset": ["cyrillic", "cyrillic-ext", "greek-ext", "latin-ext", "greek", "vietnamese", "latin"],
  "weight": ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  "i": ["normal", "italic"]
};
fonts["Fjalla One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Fjord One"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Flamenco"] = {
  "v": ["300", "regular"],
  "subset": ["latin"],
  "weight": ["300", "400"],
  "i": ["normal"]
};
fonts["Flavors"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Fondamento"] = {
  "v": ["regular", "italic"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal", "italic"]
};
fonts["Fontdiner Swanky"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Forum"] = {
  "v": ["regular"],
  "subset": ["cyrillic", "cyrillic-ext", "latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Francois One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Frank Ruhl Libre"] = {
  "v": ["300", "regular", "500", "700", "900"],
  "subset": ["latin-ext", "hebrew", "latin"],
  "weight": ["300", "400", "500", "700", "900"],
  "i": ["normal"]
};
fonts["Freckle Face"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Fredericka the Great"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Fredoka One"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Freehand"] = {
  "v": ["regular"],
  "subset": ["khmer"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Fresca"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Frijole"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Fruktur"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Fugaz One"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["GFS Didot"] = {
  "v": ["regular"],
  "subset": ["greek"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["GFS Neohellenic"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["greek"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Gabriela"] = {
  "v": ["regular"],
  "subset": ["cyrillic", "cyrillic-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Gaegu"] = {
  "v": ["300", "regular", "700"],
  "subset": ["korean", "latin"],
  "weight": ["300", "400", "700"],
  "i": ["normal"]
};
fonts["Gafata"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Galada"] = {
  "v": ["regular"],
  "subset": ["bengali", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Galdeano"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Galindo"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Gamja Flower"] = {
  "v": ["regular"],
  "subset": ["korean", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Gentium Basic"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Gentium Book Basic"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Geo"] = {
  "v": ["regular", "italic"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal", "italic"]
};
fonts["Geostar"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Geostar Fill"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Germania One"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Gidugu"] = {
  "v": ["regular"],
  "subset": ["telugu", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Gilda Display"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Give You Glory"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Glass Antiqua"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Glegoo"] = {
  "v": ["regular", "700"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Gloria Hallelujah"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Goblin One"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Gochi Hand"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Gorditas"] = {
  "v": ["regular", "700"],
  "subset": ["latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Gothic A1"] = {
  "v": ["100", "200", "300", "regular", "500", "600", "700", "800", "900"],
  "subset": ["korean", "latin"],
  "weight": ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  "i": ["normal"]
};
fonts["Goudy Bookletter 1911"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Graduate"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Grand Hotel"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Gravitas One"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Great Vibes"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Griffy"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Gruppo"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Gudea"] = {
  "v": ["regular", "italic", "700"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Gugi"] = {
  "v": ["regular"],
  "subset": ["korean", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Gurajada"] = {
  "v": ["regular"],
  "subset": ["telugu", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Habibi"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Halant"] = {
  "v": ["300", "regular", "500", "600", "700"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["300", "400", "500", "600", "700"],
  "i": ["normal"]
};
fonts["Hammersmith One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Hanalei"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Hanalei Fill"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Handlee"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Hanuman"] = {
  "v": ["regular", "700"],
  "subset": ["khmer"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Happy Monkey"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Harmattan"] = {
  "v": ["regular"],
  "subset": ["arabic", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Headland One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Heebo"] = {
  "v": ["100", "300", "regular", "500", "700", "800", "900"],
  "subset": ["hebrew", "latin"],
  "weight": ["100", "300", "400", "500", "700", "800", "900"],
  "i": ["normal"]
};
fonts["Henny Penny"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Herr Von Muellerhoff"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Hi Melody"] = {
  "v": ["regular"],
  "subset": ["korean", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Hind"] = {
  "v": ["300", "regular", "500", "600", "700"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["300", "400", "500", "600", "700"],
  "i": ["normal"]
};
fonts["Hind Guntur"] = {
  "v": ["300", "regular", "500", "600", "700"],
  "subset": ["latin-ext", "telugu", "latin"],
  "weight": ["300", "400", "500", "600", "700"],
  "i": ["normal"]
};
fonts["Hind Madurai"] = {
  "v": ["300", "regular", "500", "600", "700"],
  "subset": ["latin-ext", "tamil", "latin"],
  "weight": ["300", "400", "500", "600", "700"],
  "i": ["normal"]
};
fonts["Hind Siliguri"] = {
  "v": ["300", "regular", "500", "600", "700"],
  "subset": ["latin-ext", "bengali", "latin"],
  "weight": ["300", "400", "500", "600", "700"],
  "i": ["normal"]
};
fonts["Hind Vadodara"] = {
  "v": ["300", "regular", "500", "600", "700"],
  "subset": ["latin-ext", "gujarati", "latin"],
  "weight": ["300", "400", "500", "600", "700"],
  "i": ["normal"]
};
fonts["Holtwood One SC"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Homemade Apple"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Homenaje"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["IBM Plex Mono"] = {
  "v": ["100", "100italic", "200", "200italic", "300", "300italic", "regular", "italic", "500", "500italic", "600", "600italic", "700", "700italic"],
  "subset": ["cyrillic", "cyrillic-ext", "latin-ext", "vietnamese", "latin"],
  "weight": ["100", "200", "300", "400", "500", "600", "700"],
  "i": ["normal", "italic"]
};
fonts["IBM Plex Sans"] = {
  "v": ["100", "100italic", "200", "200italic", "300", "300italic", "regular", "italic", "500", "500italic", "600", "600italic", "700", "700italic"],
  "subset": ["cyrillic", "cyrillic-ext", "latin-ext", "vietnamese", "latin"],
  "weight": ["100", "200", "300", "400", "500", "600", "700"],
  "i": ["normal", "italic"]
};
fonts["IBM Plex Sans Condensed"] = {
  "v": ["100", "100italic", "200", "200italic", "300", "300italic", "regular", "italic", "500", "500italic", "600", "600italic", "700", "700italic"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["100", "200", "300", "400", "500", "600", "700"],
  "i": ["normal", "italic"]
};
fonts["IBM Plex Serif"] = {
  "v": ["100", "100italic", "200", "200italic", "300", "300italic", "regular", "italic", "500", "500italic", "600", "600italic", "700", "700italic"],
  "subset": ["cyrillic", "cyrillic-ext", "latin-ext", "vietnamese", "latin"],
  "weight": ["100", "200", "300", "400", "500", "600", "700"],
  "i": ["normal", "italic"]
};
fonts["IM Fell DW Pica"] = {
  "v": ["regular", "italic"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal", "italic"]
};
fonts["IM Fell DW Pica SC"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["IM Fell Double Pica"] = {
  "v": ["regular", "italic"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal", "italic"]
};
fonts["IM Fell Double Pica SC"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["IM Fell English"] = {
  "v": ["regular", "italic"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal", "italic"]
};
fonts["IM Fell English SC"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["IM Fell French Canon"] = {
  "v": ["regular", "italic"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal", "italic"]
};
fonts["IM Fell French Canon SC"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["IM Fell Great Primer"] = {
  "v": ["regular", "italic"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal", "italic"]
};
fonts["IM Fell Great Primer SC"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Iceberg"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Iceland"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Imprima"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Inconsolata"] = {
  "v": ["regular", "700"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Inder"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Indie Flower"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Inika"] = {
  "v": ["regular", "700"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Inknut Antiqua"] = {
  "v": ["300", "regular", "500", "600", "700", "800", "900"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["300", "400", "500", "600", "700", "800", "900"],
  "i": ["normal"]
};
fonts["Irish Grover"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Istok Web"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["cyrillic", "cyrillic-ext", "latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Italiana"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Italianno"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Itim"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "thai", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Jacques Francois"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Jacques Francois Shadow"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Jaldi"] = {
  "v": ["regular", "700"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Jim Nightshade"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Jockey One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Jolly Lodger"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Jomhuria"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "arabic", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Josefin Sans"] = {
  "v": ["100", "100italic", "300", "300italic", "regular", "italic", "600", "600italic", "700", "700italic"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["100", "300", "400", "600", "700"],
  "i": ["normal", "italic"]
};
fonts["Josefin Slab"] = {
  "v": ["100", "100italic", "300", "300italic", "regular", "italic", "600", "600italic", "700", "700italic"],
  "subset": ["latin"],
  "weight": ["100", "300", "400", "600", "700"],
  "i": ["normal", "italic"]
};
fonts["Joti One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Jua"] = {
  "v": ["regular"],
  "subset": ["korean", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Judson"] = {
  "v": ["regular", "italic", "700"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Julee"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Julius Sans One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Junge"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Jura"] = {
  "v": ["300", "regular", "500", "600", "700"],
  "subset": ["cyrillic", "cyrillic-ext", "greek-ext", "latin-ext", "greek", "vietnamese", "latin"],
  "weight": ["300", "400", "500", "600", "700"],
  "i": ["normal"]
};
fonts["Just Another Hand"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Just Me Again Down Here"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Kadwa"] = {
  "v": ["regular", "700"],
  "subset": ["devanagari", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Kalam"] = {
  "v": ["300", "regular", "700"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["300", "400", "700"],
  "i": ["normal"]
};
fonts["Kameron"] = {
  "v": ["regular", "700"],
  "subset": ["latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Kanit"] = {
  "v": ["100", "100italic", "200", "200italic", "300", "300italic", "regular", "italic", "500", "500italic", "600", "600italic", "700", "700italic", "800", "800italic", "900", "900italic"],
  "subset": ["latin-ext", "thai", "vietnamese", "latin"],
  "weight": ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  "i": ["normal", "italic"]
};
fonts["Kantumruy"] = {
  "v": ["300", "regular", "700"],
  "subset": ["khmer"],
  "weight": ["300", "400", "700"],
  "i": ["normal"]
};
fonts["Karla"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Karma"] = {
  "v": ["300", "regular", "500", "600", "700"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["300", "400", "500", "600", "700"],
  "i": ["normal"]
};
fonts["Katibeh"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "arabic", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Kaushan Script"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Kavivanar"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "tamil", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Kavoon"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Kdam Thmor"] = {
  "v": ["regular"],
  "subset": ["khmer"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Keania One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Kelly Slab"] = {
  "v": ["regular"],
  "subset": ["cyrillic", "latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Kenia"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Khand"] = {
  "v": ["300", "regular", "500", "600", "700"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["300", "400", "500", "600", "700"],
  "i": ["normal"]
};
fonts["Khmer"] = {
  "v": ["regular"],
  "subset": ["khmer"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Khula"] = {
  "v": ["300", "regular", "600", "700", "800"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["300", "400", "600", "700", "800"],
  "i": ["normal"]
};
fonts["Kirang Haerang"] = {
  "v": ["regular"],
  "subset": ["korean", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Kite One"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Knewave"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Kosugi"] = {
  "v": ["regular"],
  "subset": ["cyrillic", "japanese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Kosugi Maru"] = {
  "v": ["regular"],
  "subset": ["cyrillic", "japanese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Kotta One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Koulen"] = {
  "v": ["regular"],
  "subset": ["khmer"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Kranky"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Kreon"] = {
  "v": ["300", "regular", "700"],
  "subset": ["latin"],
  "weight": ["300", "400", "700"],
  "i": ["normal"]
};
fonts["Kristi"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Krona One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Kumar One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "gujarati", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Kumar One Outline"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "gujarati", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Kurale"] = {
  "v": ["regular"],
  "subset": ["cyrillic", "cyrillic-ext", "latin-ext", "devanagari", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["La Belle Aurore"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Laila"] = {
  "v": ["300", "regular", "500", "600", "700"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["300", "400", "500", "600", "700"],
  "i": ["normal"]
};
fonts["Lakki Reddy"] = {
  "v": ["regular"],
  "subset": ["telugu", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Lalezar"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "arabic", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Lancelot"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Lateef"] = {
  "v": ["regular"],
  "subset": ["arabic", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Lato"] = {
  "v": ["100", "100italic", "300", "300italic", "regular", "italic", "700", "700italic", "900", "900italic"],
  "subset": ["latin-ext", "latin"],
  "weight": ["100", "300", "400", "700", "900"],
  "i": ["normal", "italic"]
};
fonts["League Script"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Leckerli One"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Ledger"] = {
  "v": ["regular"],
  "subset": ["cyrillic", "latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Lekton"] = {
  "v": ["regular", "italic", "700"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Lemon"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Lemonada"] = {
  "v": ["300", "regular", "600", "700"],
  "subset": ["latin-ext", "arabic", "vietnamese", "latin"],
  "weight": ["300", "400", "600", "700"],
  "i": ["normal"]
};
fonts["Libre Barcode 128"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Libre Barcode 128 Text"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Libre Barcode 39"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Libre Barcode 39 Extended"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Libre Barcode 39 Extended Text"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Libre Barcode 39 Text"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Libre Baskerville"] = {
  "v": ["regular", "italic", "700"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Libre Franklin"] = {
  "v": ["100", "100italic", "200", "200italic", "300", "300italic", "regular", "italic", "500", "500italic", "600", "600italic", "700", "700italic", "800", "800italic", "900", "900italic"],
  "subset": ["latin-ext", "latin"],
  "weight": ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  "i": ["normal", "italic"]
};
fonts["Life Savers"] = {
  "v": ["regular", "700"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Lilita One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Lily Script One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Limelight"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Linden Hill"] = {
  "v": ["regular", "italic"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal", "italic"]
};
fonts["Lobster"] = {
  "v": ["regular"],
  "subset": ["cyrillic", "cyrillic-ext", "latin-ext", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Lobster Two"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Londrina Outline"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Londrina Shadow"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Londrina Sketch"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Londrina Solid"] = {
  "v": ["100", "300", "regular", "900"],
  "subset": ["latin"],
  "weight": ["100", "300", "400", "900"],
  "i": ["normal"]
};
fonts["Lora"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["cyrillic", "cyrillic-ext", "latin-ext", "vietnamese", "latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Love Ya Like A Sister"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Loved by the King"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Lovers Quarrel"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Luckiest Guy"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Lusitana"] = {
  "v": ["regular", "700"],
  "subset": ["latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Lustria"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["M PLUS 1p"] = {
  "v": ["100", "300", "regular", "500", "700", "800", "900"],
  "subset": ["cyrillic", "cyrillic-ext", "greek-ext", "japanese", "latin-ext", "hebrew", "greek", "vietnamese", "latin"],
  "weight": ["100", "300", "400", "500", "700", "800", "900"],
  "i": ["normal"]
};
fonts["M PLUS Rounded 1c"] = {
  "v": ["100", "300", "regular", "500", "700", "800", "900"],
  "subset": ["cyrillic", "cyrillic-ext", "greek-ext", "japanese", "latin-ext", "hebrew", "greek", "vietnamese", "latin"],
  "weight": ["100", "300", "400", "500", "700", "800", "900"],
  "i": ["normal"]
};
fonts["Macondo"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Macondo Swash Caps"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Mada"] = {
  "v": ["200", "300", "regular", "500", "600", "700", "900"],
  "subset": ["arabic", "latin"],
  "weight": ["200", "300", "400", "500", "600", "700", "900"],
  "i": ["normal"]
};
fonts["Magra"] = {
  "v": ["regular", "700"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Maiden Orange"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Maitree"] = {
  "v": ["200", "300", "regular", "500", "600", "700"],
  "subset": ["latin-ext", "thai", "vietnamese", "latin"],
  "weight": ["200", "300", "400", "500", "600", "700"],
  "i": ["normal"]
};
fonts["Mako"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Mallanna"] = {
  "v": ["regular"],
  "subset": ["telugu", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Mandali"] = {
  "v": ["regular"],
  "subset": ["telugu", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Manuale"] = {
  "v": ["regular", "italic", "500", "500italic", "600", "600italic", "700", "700italic"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["400", "500", "600", "700"],
  "i": ["normal", "italic"]
};
fonts["Marcellus"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Marcellus SC"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Marck Script"] = {
  "v": ["regular"],
  "subset": ["cyrillic", "latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Margarine"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Markazi Text"] = {
  "v": ["regular", "500", "600", "700"],
  "subset": ["latin-ext", "arabic", "vietnamese", "latin"],
  "weight": ["400", "500", "600", "700"],
  "i": ["normal"]
};
fonts["Marko One"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Marmelad"] = {
  "v": ["regular"],
  "subset": ["cyrillic", "latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Martel"] = {
  "v": ["200", "300", "regular", "600", "700", "800", "900"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["200", "300", "400", "600", "700", "800", "900"],
  "i": ["normal"]
};
fonts["Martel Sans"] = {
  "v": ["200", "300", "regular", "600", "700", "800", "900"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["200", "300", "400", "600", "700", "800", "900"],
  "i": ["normal"]
};
fonts["Marvel"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Mate"] = {
  "v": ["regular", "italic"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal", "italic"]
};
fonts["Mate SC"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Maven Pro"] = {
  "v": ["regular", "500", "700", "900"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["400", "500", "700", "900"],
  "i": ["normal"]
};
fonts["McLaren"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Meddon"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["MedievalSharp"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Medula One"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Meera Inimai"] = {
  "v": ["regular"],
  "subset": ["tamil", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Megrim"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Meie Script"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Merienda"] = {
  "v": ["regular", "700"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Merienda One"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Merriweather"] = {
  "v": ["300", "300italic", "regular", "italic", "700", "700italic", "900", "900italic"],
  "subset": ["cyrillic", "cyrillic-ext", "latin-ext", "vietnamese", "latin"],
  "weight": ["300", "400", "700", "900"],
  "i": ["normal", "italic"]
};
fonts["Merriweather Sans"] = {
  "v": ["300", "300italic", "regular", "italic", "700", "700italic", "800", "800italic"],
  "subset": ["latin-ext", "latin"],
  "weight": ["300", "400", "700", "800"],
  "i": ["normal", "italic"]
};
fonts["Metal"] = {
  "v": ["regular"],
  "subset": ["khmer"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Metal Mania"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Metamorphous"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Metrophobic"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Michroma"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Milonga"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Miltonian"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Miltonian Tattoo"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Mina"] = {
  "v": ["regular", "700"],
  "subset": ["latin-ext", "bengali", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Miniver"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Miriam Libre"] = {
  "v": ["regular", "700"],
  "subset": ["latin-ext", "hebrew", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Mirza"] = {
  "v": ["regular", "500", "600", "700"],
  "subset": ["latin-ext", "arabic", "latin"],
  "weight": ["400", "500", "600", "700"],
  "i": ["normal"]
};
fonts["Miss Fajardose"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Mitr"] = {
  "v": ["200", "300", "regular", "500", "600", "700"],
  "subset": ["latin-ext", "thai", "vietnamese", "latin"],
  "weight": ["200", "300", "400", "500", "600", "700"],
  "i": ["normal"]
};
fonts["Modak"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Modern Antiqua"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Mogra"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "gujarati", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Molengo"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Molle"] = {
  "v": ["italic"],
  "subset": ["latin-ext", "latin"],
  "weight": [],
  "i": ["italic"]
};
fonts["Monda"] = {
  "v": ["regular", "700"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Monofett"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Monoton"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Monsieur La Doulaise"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Montaga"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Montez"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Montserrat"] = {
  "v": ["100", "100italic", "200", "200italic", "300", "300italic", "regular", "italic", "500", "500italic", "600", "600italic", "700", "700italic", "800", "800italic", "900", "900italic"],
  "subset": ["cyrillic", "cyrillic-ext", "latin-ext", "vietnamese", "latin"],
  "weight": ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  "i": ["normal", "italic"]
};
fonts["Montserrat Alternates"] = {
  "v": ["100", "100italic", "200", "200italic", "300", "300italic", "regular", "italic", "500", "500italic", "600", "600italic", "700", "700italic", "800", "800italic", "900", "900italic"],
  "subset": ["cyrillic", "cyrillic-ext", "latin-ext", "vietnamese", "latin"],
  "weight": ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  "i": ["normal", "italic"]
};
fonts["Montserrat Subrayada"] = {
  "v": ["regular", "700"],
  "subset": ["latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Moul"] = {
  "v": ["regular"],
  "subset": ["khmer"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Moulpali"] = {
  "v": ["regular"],
  "subset": ["khmer"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Mountains of Christmas"] = {
  "v": ["regular", "700"],
  "subset": ["latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Mouse Memoirs"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Mr Bedfort"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Mr Dafoe"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Mr De Haviland"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Mrs Saint Delafield"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Mrs Sheppards"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Mukta"] = {
  "v": ["200", "300", "regular", "500", "600", "700", "800"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["200", "300", "400", "500", "600", "700", "800"],
  "i": ["normal"]
};
fonts["Mukta Mahee"] = {
  "v": ["200", "300", "regular", "500", "600", "700", "800"],
  "subset": ["latin-ext", "gurmukhi", "latin"],
  "weight": ["200", "300", "400", "500", "600", "700", "800"],
  "i": ["normal"]
};
fonts["Mukta Malar"] = {
  "v": ["200", "300", "regular", "500", "600", "700", "800"],
  "subset": ["latin-ext", "tamil", "latin"],
  "weight": ["200", "300", "400", "500", "600", "700", "800"],
  "i": ["normal"]
};
fonts["Mukta Vaani"] = {
  "v": ["200", "300", "regular", "500", "600", "700", "800"],
  "subset": ["latin-ext", "gujarati", "latin"],
  "weight": ["200", "300", "400", "500", "600", "700", "800"],
  "i": ["normal"]
};
fonts["Muli"] = {
  "v": ["200", "200italic", "300", "300italic", "regular", "italic", "600", "600italic", "700", "700italic", "800", "800italic", "900", "900italic"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["200", "300", "400", "600", "700", "800", "900"],
  "i": ["normal", "italic"]
};
fonts["Mystery Quest"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["NTR"] = {
  "v": ["regular"],
  "subset": ["telugu", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Nanum Brush Script"] = {
  "v": ["regular"],
  "subset": ["korean", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Nanum Gothic"] = {
  "v": ["regular", "700", "800"],
  "subset": ["korean", "latin"],
  "weight": ["400", "700", "800"],
  "i": ["normal"]
};
fonts["Nanum Gothic Coding"] = {
  "v": ["regular", "700"],
  "subset": ["korean", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Nanum Myeongjo"] = {
  "v": ["regular", "700", "800"],
  "subset": ["korean", "latin"],
  "weight": ["400", "700", "800"],
  "i": ["normal"]
};
fonts["Nanum Pen Script"] = {
  "v": ["regular"],
  "subset": ["korean", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Neucha"] = {
  "v": ["regular"],
  "subset": ["cyrillic", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Neuton"] = {
  "v": ["200", "300", "regular", "italic", "700", "800"],
  "subset": ["latin-ext", "latin"],
  "weight": ["200", "300", "400", "700", "800"],
  "i": ["normal", "italic"]
};
fonts["New Rocker"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["News Cycle"] = {
  "v": ["regular", "700"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Niconne"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Nixie One"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Nobile"] = {
  "v": ["regular", "italic", "500", "500italic", "700", "700italic"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "500", "700"],
  "i": ["normal", "italic"]
};
fonts["Nokora"] = {
  "v": ["regular", "700"],
  "subset": ["khmer"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Norican"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Nosifer"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Nothing You Could Do"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Noticia Text"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Noto Sans"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["cyrillic", "cyrillic-ext", "greek-ext", "latin-ext", "greek", "devanagari", "vietnamese", "latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Noto Sans JP"] = {
  "v": ["100", "300", "regular", "500", "700", "900"],
  "subset": ["japanese", "latin"],
  "weight": ["100", "300", "400", "500", "700", "900"],
  "i": ["normal"]
};
fonts["Noto Sans KR"] = {
  "v": ["100", "300", "regular", "500", "700", "900"],
  "subset": ["korean", "latin"],
  "weight": ["100", "300", "400", "500", "700", "900"],
  "i": ["normal"]
};
fonts["Noto Serif"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["cyrillic", "cyrillic-ext", "greek-ext", "latin-ext", "greek", "vietnamese", "latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Noto Serif JP"] = {
  "v": ["200", "300", "regular", "500", "600", "700", "900"],
  "subset": ["japanese", "latin"],
  "weight": ["200", "300", "400", "500", "600", "700", "900"],
  "i": ["normal"]
};
fonts["Noto Serif KR"] = {
  "v": ["200", "300", "regular", "500", "600", "700", "900"],
  "subset": ["korean", "latin"],
  "weight": ["200", "300", "400", "500", "600", "700", "900"],
  "i": ["normal"]
};
fonts["Nova Cut"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Nova Flat"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Nova Mono"] = {
  "v": ["regular"],
  "subset": ["greek", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Nova Oval"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Nova Round"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Nova Script"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Nova Slim"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Nova Square"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Numans"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Nunito"] = {
  "v": ["200", "200italic", "300", "300italic", "regular", "italic", "600", "600italic", "700", "700italic", "800", "800italic", "900", "900italic"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["200", "300", "400", "600", "700", "800", "900"],
  "i": ["normal", "italic"]
};
fonts["Nunito Sans"] = {
  "v": ["200", "200italic", "300", "300italic", "regular", "italic", "600", "600italic", "700", "700italic", "800", "800italic", "900", "900italic"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["200", "300", "400", "600", "700", "800", "900"],
  "i": ["normal", "italic"]
};
fonts["Odor Mean Chey"] = {
  "v": ["regular"],
  "subset": ["khmer"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Offside"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Old Standard TT"] = {
  "v": ["regular", "italic", "700"],
  "subset": ["cyrillic", "cyrillic-ext", "latin-ext", "vietnamese", "latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Oldenburg"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Oleo Script"] = {
  "v": ["regular", "700"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Oleo Script Swash Caps"] = {
  "v": ["regular", "700"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Open Sans"] = {
  "v": ["300", "300italic", "regular", "italic", "600", "600italic", "700", "700italic", "800", "800italic"],
  "subset": ["cyrillic", "cyrillic-ext", "greek-ext", "latin-ext", "greek", "vietnamese", "latin"],
  "weight": ["300", "400", "600", "700", "800"],
  "i": ["normal", "italic"]
};
fonts["Open Sans Condensed"] = {
  "v": ["300", "300italic", "700"],
  "subset": ["cyrillic", "cyrillic-ext", "greek-ext", "latin-ext", "greek", "vietnamese", "latin"],
  "weight": ["300", "700"],
  "i": []
};
fonts["Oranienbaum"] = {
  "v": ["regular"],
  "subset": ["cyrillic", "cyrillic-ext", "latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Orbitron"] = {
  "v": ["regular", "500", "700", "900"],
  "subset": ["latin"],
  "weight": ["400", "500", "700", "900"],
  "i": ["normal"]
};
fonts["Oregano"] = {
  "v": ["regular", "italic"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal", "italic"]
};
fonts["Orienta"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Original Surfer"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Oswald"] = {
  "v": ["200", "300", "regular", "500", "600", "700"],
  "subset": ["cyrillic", "latin-ext", "vietnamese", "latin"],
  "weight": ["200", "300", "400", "500", "600", "700"],
  "i": ["normal"]
};
fonts["Over the Rainbow"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Overlock"] = {
  "v": ["regular", "italic", "700", "700italic", "900", "900italic"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "700", "900"],
  "i": ["normal", "italic"]
};
fonts["Overlock SC"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Overpass"] = {
  "v": ["100", "100italic", "200", "200italic", "300", "300italic", "regular", "italic", "600", "600italic", "700", "700italic", "800", "800italic", "900", "900italic"],
  "subset": ["latin-ext", "latin"],
  "weight": ["100", "200", "300", "400", "600", "700", "800", "900"],
  "i": ["normal", "italic"]
};
fonts["Overpass Mono"] = {
  "v": ["300", "regular", "600", "700"],
  "subset": ["latin-ext", "latin"],
  "weight": ["300", "400", "600", "700"],
  "i": ["normal"]
};
fonts["Ovo"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Oxygen"] = {
  "v": ["300", "regular", "700"],
  "subset": ["latin-ext", "latin"],
  "weight": ["300", "400", "700"],
  "i": ["normal"]
};
fonts["Oxygen Mono"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["PT Mono"] = {
  "v": ["regular"],
  "subset": ["cyrillic", "cyrillic-ext", "latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["PT Sans"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["cyrillic", "cyrillic-ext", "latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["PT Sans Caption"] = {
  "v": ["regular", "700"],
  "subset": ["cyrillic", "cyrillic-ext", "latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["PT Sans Narrow"] = {
  "v": ["regular", "700"],
  "subset": ["cyrillic", "cyrillic-ext", "latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["PT Serif"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["cyrillic", "cyrillic-ext", "latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["PT Serif Caption"] = {
  "v": ["regular", "italic"],
  "subset": ["cyrillic", "cyrillic-ext", "latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal", "italic"]
};
fonts["Pacifico"] = {
  "v": ["regular"],
  "subset": ["cyrillic", "latin-ext", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Padauk"] = {
  "v": ["regular", "700"],
  "subset": ["myanmar", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Palanquin"] = {
  "v": ["100", "200", "300", "regular", "500", "600", "700"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["100", "200", "300", "400", "500", "600", "700"],
  "i": ["normal"]
};
fonts["Palanquin Dark"] = {
  "v": ["regular", "500", "600", "700"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["400", "500", "600", "700"],
  "i": ["normal"]
};
fonts["Pangolin"] = {
  "v": ["regular"],
  "subset": ["cyrillic", "cyrillic-ext", "latin-ext", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Paprika"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Parisienne"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Passero One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Passion One"] = {
  "v": ["regular", "700", "900"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "700", "900"],
  "i": ["normal"]
};
fonts["Pathway Gothic One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Patrick Hand"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Patrick Hand SC"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Pattaya"] = {
  "v": ["regular"],
  "subset": ["cyrillic", "latin-ext", "thai", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Patua One"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Pavanam"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "tamil", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Paytone One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Peddana"] = {
  "v": ["regular"],
  "subset": ["telugu", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Peralta"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Permanent Marker"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Petit Formal Script"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Petrona"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Philosopher"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["cyrillic", "cyrillic-ext", "vietnamese", "latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Piedra"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Pinyon Script"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Pirata One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Plaster"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Play"] = {
  "v": ["regular", "700"],
  "subset": ["cyrillic", "cyrillic-ext", "latin-ext", "greek", "vietnamese", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Playball"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Playfair Display"] = {
  "v": ["regular", "italic", "700", "700italic", "900", "900italic"],
  "subset": ["cyrillic", "latin-ext", "vietnamese", "latin"],
  "weight": ["400", "700", "900"],
  "i": ["normal", "italic"]
};
fonts["Playfair Display SC"] = {
  "v": ["regular", "italic", "700", "700italic", "900", "900italic"],
  "subset": ["cyrillic", "latin-ext", "vietnamese", "latin"],
  "weight": ["400", "700", "900"],
  "i": ["normal", "italic"]
};
fonts["Podkova"] = {
  "v": ["regular", "500", "600", "700", "800"],
  "subset": ["cyrillic", "cyrillic-ext", "latin-ext", "vietnamese", "latin"],
  "weight": ["400", "500", "600", "700", "800"],
  "i": ["normal"]
};
fonts["Poiret One"] = {
  "v": ["regular"],
  "subset": ["cyrillic", "latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Poller One"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Poly"] = {
  "v": ["regular", "italic"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal", "italic"]
};
fonts["Pompiere"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Pontano Sans"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Poor Story"] = {
  "v": ["regular"],
  "subset": ["korean", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Poppins"] = {
  "v": ["100", "100italic", "200", "200italic", "300", "300italic", "regular", "italic", "500", "500italic", "600", "600italic", "700", "700italic", "800", "800italic", "900", "900italic"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  "i": ["normal", "italic"]
};
fonts["Port Lligat Sans"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Port Lligat Slab"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Pragati Narrow"] = {
  "v": ["regular", "700"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Prata"] = {
  "v": ["regular"],
  "subset": ["cyrillic", "cyrillic-ext", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Preahvihear"] = {
  "v": ["regular"],
  "subset": ["khmer"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Press Start 2P"] = {
  "v": ["regular"],
  "subset": ["cyrillic", "cyrillic-ext", "latin-ext", "greek", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Pridi"] = {
  "v": ["200", "300", "regular", "500", "600", "700"],
  "subset": ["latin-ext", "thai", "vietnamese", "latin"],
  "weight": ["200", "300", "400", "500", "600", "700"],
  "i": ["normal"]
};
fonts["Princess Sofia"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Prociono"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Prompt"] = {
  "v": ["100", "100italic", "200", "200italic", "300", "300italic", "regular", "italic", "500", "500italic", "600", "600italic", "700", "700italic", "800", "800italic", "900", "900italic"],
  "subset": ["latin-ext", "thai", "vietnamese", "latin"],
  "weight": ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  "i": ["normal", "italic"]
};
fonts["Prosto One"] = {
  "v": ["regular"],
  "subset": ["cyrillic", "latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Proza Libre"] = {
  "v": ["regular", "italic", "500", "500italic", "600", "600italic", "700", "700italic", "800", "800italic"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "500", "600", "700", "800"],
  "i": ["normal", "italic"]
};
fonts["Puritan"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Purple Purse"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Quando"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Quantico"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Quattrocento"] = {
  "v": ["regular", "700"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Quattrocento Sans"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Questrial"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Quicksand"] = {
  "v": ["300", "regular", "500", "700"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["300", "400", "500", "700"],
  "i": ["normal"]
};
fonts["Quintessential"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Qwigley"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Racing Sans One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Radley"] = {
  "v": ["regular", "italic"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal", "italic"]
};
fonts["Rajdhani"] = {
  "v": ["300", "regular", "500", "600", "700"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["300", "400", "500", "600", "700"],
  "i": ["normal"]
};
fonts["Rakkas"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "arabic", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Raleway"] = {
  "v": ["100", "100italic", "200", "200italic", "300", "300italic", "regular", "italic", "500", "500italic", "600", "600italic", "700", "700italic", "800", "800italic", "900", "900italic"],
  "subset": ["latin-ext", "latin"],
  "weight": ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  "i": ["normal", "italic"]
};
fonts["Raleway Dots"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Ramabhadra"] = {
  "v": ["regular"],
  "subset": ["telugu", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Ramaraja"] = {
  "v": ["regular"],
  "subset": ["telugu", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Rambla"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Rammetto One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Ranchers"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Rancho"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Ranga"] = {
  "v": ["regular", "700"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Rasa"] = {
  "v": ["300", "regular", "500", "600", "700"],
  "subset": ["latin-ext", "gujarati", "latin"],
  "weight": ["300", "400", "500", "600", "700"],
  "i": ["normal"]
};
fonts["Rationale"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Ravi Prakash"] = {
  "v": ["regular"],
  "subset": ["telugu", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Redressed"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Reem Kufi"] = {
  "v": ["regular"],
  "subset": ["arabic", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Reenie Beanie"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Revalia"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Rhodium Libre"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Ribeye"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Ribeye Marrow"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Righteous"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Risque"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Roboto"] = {
  "v": ["100", "100italic", "300", "300italic", "regular", "italic", "500", "500italic", "700", "700italic", "900", "900italic"],
  "subset": ["cyrillic", "cyrillic-ext", "greek-ext", "latin-ext", "greek", "vietnamese", "latin"],
  "weight": ["100", "300", "400", "500", "700", "900"],
  "i": ["normal", "italic"]
};
fonts["Roboto Condensed"] = {
  "v": ["300", "300italic", "regular", "italic", "700", "700italic"],
  "subset": ["cyrillic", "cyrillic-ext", "greek-ext", "latin-ext", "greek", "vietnamese", "latin"],
  "weight": ["300", "400", "700"],
  "i": ["normal", "italic"]
};
fonts["Roboto Mono"] = {
  "v": ["100", "100italic", "300", "300italic", "regular", "italic", "500", "500italic", "700", "700italic"],
  "subset": ["cyrillic", "cyrillic-ext", "greek-ext", "latin-ext", "greek", "vietnamese", "latin"],
  "weight": ["100", "300", "400", "500", "700"],
  "i": ["normal", "italic"]
};
fonts["Roboto Slab"] = {
  "v": ["100", "300", "regular", "700"],
  "subset": ["cyrillic", "cyrillic-ext", "greek-ext", "latin-ext", "greek", "vietnamese", "latin"],
  "weight": ["100", "300", "400", "700"],
  "i": ["normal"]
};
fonts["Rochester"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Rock Salt"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Rokkitt"] = {
  "v": ["100", "200", "300", "regular", "500", "600", "700", "800", "900"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  "i": ["normal"]
};
fonts["Romanesco"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Ropa Sans"] = {
  "v": ["regular", "italic"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal", "italic"]
};
fonts["Rosario"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Rosarivo"] = {
  "v": ["regular", "italic"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal", "italic"]
};
fonts["Rouge Script"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Rozha One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Rubik"] = {
  "v": ["300", "300italic", "regular", "italic", "500", "500italic", "700", "700italic", "900", "900italic"],
  "subset": ["cyrillic", "latin-ext", "hebrew", "latin"],
  "weight": ["300", "400", "500", "700", "900"],
  "i": ["normal", "italic"]
};
fonts["Rubik Mono One"] = {
  "v": ["regular"],
  "subset": ["cyrillic", "latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Ruda"] = {
  "v": ["regular", "700", "900"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "700", "900"],
  "i": ["normal"]
};
fonts["Rufina"] = {
  "v": ["regular", "700"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Ruge Boogie"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Ruluko"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Rum Raisin"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Ruslan Display"] = {
  "v": ["regular"],
  "subset": ["cyrillic", "latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Russo One"] = {
  "v": ["regular"],
  "subset": ["cyrillic", "latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Ruthie"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Rye"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Sacramento"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Sahitya"] = {
  "v": ["regular", "700"],
  "subset": ["devanagari", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Sail"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Saira"] = {
  "v": ["100", "200", "300", "regular", "500", "600", "700", "800", "900"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  "i": ["normal"]
};
fonts["Saira Condensed"] = {
  "v": ["100", "200", "300", "regular", "500", "600", "700", "800", "900"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  "i": ["normal"]
};
fonts["Saira Extra Condensed"] = {
  "v": ["100", "200", "300", "regular", "500", "600", "700", "800", "900"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  "i": ["normal"]
};
fonts["Saira Semi Condensed"] = {
  "v": ["100", "200", "300", "regular", "500", "600", "700", "800", "900"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  "i": ["normal"]
};
fonts["Salsa"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Sanchez"] = {
  "v": ["regular", "italic"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal", "italic"]
};
fonts["Sancreek"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Sansita"] = {
  "v": ["regular", "italic", "700", "700italic", "800", "800italic", "900", "900italic"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "700", "800", "900"],
  "i": ["normal", "italic"]
};
fonts["Sarala"] = {
  "v": ["regular", "700"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Sarina"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Sarpanch"] = {
  "v": ["regular", "500", "600", "700", "800", "900"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["400", "500", "600", "700", "800", "900"],
  "i": ["normal"]
};
fonts["Satisfy"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Sawarabi Gothic"] = {
  "v": ["regular"],
  "subset": ["cyrillic", "japanese", "latin-ext", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Sawarabi Mincho"] = {
  "v": ["regular"],
  "subset": ["japanese", "latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Scada"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["cyrillic", "cyrillic-ext", "latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Scheherazade"] = {
  "v": ["regular", "700"],
  "subset": ["arabic", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Schoolbell"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Scope One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Seaweed Script"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Secular One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "hebrew", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Sedgwick Ave"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Sedgwick Ave Display"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Sevillana"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Seymour One"] = {
  "v": ["regular"],
  "subset": ["cyrillic", "latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Shadows Into Light"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Shadows Into Light Two"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Shanti"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Share"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Share Tech"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Share Tech Mono"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Shojumaru"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Short Stack"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Shrikhand"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "gujarati", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Siemreap"] = {
  "v": ["regular"],
  "subset": ["khmer"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Sigmar One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Signika"] = {
  "v": ["300", "regular", "600", "700"],
  "subset": ["latin-ext", "latin"],
  "weight": ["300", "400", "600", "700"],
  "i": ["normal"]
};
fonts["Signika Negative"] = {
  "v": ["300", "regular", "600", "700"],
  "subset": ["latin-ext", "latin"],
  "weight": ["300", "400", "600", "700"],
  "i": ["normal"]
};
fonts["Simonetta"] = {
  "v": ["regular", "italic", "900", "900italic"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "900"],
  "i": ["normal", "italic"]
};
fonts["Sintony"] = {
  "v": ["regular", "700"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Sirin Stencil"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Six Caps"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Skranji"] = {
  "v": ["regular", "700"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Slabo 13px"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Slabo 27px"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Slackey"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Smokum"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Smythe"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Sniglet"] = {
  "v": ["regular", "800"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "800"],
  "i": ["normal"]
};
fonts["Snippet"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Snowburst One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Sofadi One"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Sofia"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Song Myung"] = {
  "v": ["regular"],
  "subset": ["korean", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Sonsie One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Sorts Mill Goudy"] = {
  "v": ["regular", "italic"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal", "italic"]
};
fonts["Source Code Pro"] = {
  "v": ["200", "300", "regular", "500", "600", "700", "900"],
  "subset": ["latin-ext", "latin"],
  "weight": ["200", "300", "400", "500", "600", "700", "900"],
  "i": ["normal"]
};
fonts["Source Sans Pro"] = {
  "v": ["200", "200italic", "300", "300italic", "regular", "italic", "600", "600italic", "700", "700italic", "900", "900italic"],
  "subset": ["cyrillic", "cyrillic-ext", "greek-ext", "latin-ext", "greek", "vietnamese", "latin"],
  "weight": ["200", "300", "400", "600", "700", "900"],
  "i": ["normal", "italic"]
};
fonts["Source Serif Pro"] = {
  "v": ["regular", "600", "700"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "600", "700"],
  "i": ["normal"]
};
fonts["Space Mono"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Special Elite"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Spectral"] = {
  "v": ["200", "200italic", "300", "300italic", "regular", "italic", "500", "500italic", "600", "600italic", "700", "700italic", "800", "800italic"],
  "subset": ["cyrillic", "latin-ext", "vietnamese", "latin"],
  "weight": ["200", "300", "400", "500", "600", "700", "800"],
  "i": ["normal", "italic"]
};
fonts["Spectral SC"] = {
  "v": ["200", "200italic", "300", "300italic", "regular", "italic", "500", "500italic", "600", "600italic", "700", "700italic", "800", "800italic"],
  "subset": ["cyrillic", "latin-ext", "vietnamese", "latin"],
  "weight": ["200", "300", "400", "500", "600", "700", "800"],
  "i": ["normal", "italic"]
};
fonts["Spicy Rice"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Spinnaker"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Spirax"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Squada One"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Sree Krushnadevaraya"] = {
  "v": ["regular"],
  "subset": ["telugu", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Sriracha"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "thai", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Stalemate"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Stalinist One"] = {
  "v": ["regular"],
  "subset": ["cyrillic", "latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Stardos Stencil"] = {
  "v": ["regular", "700"],
  "subset": ["latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Stint Ultra Condensed"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Stint Ultra Expanded"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Stoke"] = {
  "v": ["300", "regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["300", "400"],
  "i": ["normal"]
};
fonts["Strait"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Stylish"] = {
  "v": ["regular"],
  "subset": ["korean", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Sue Ellen Francisco"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Suez One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "hebrew", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Sumana"] = {
  "v": ["regular", "700"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Sunflower"] = {
  "v": ["300", "500", "700"],
  "subset": ["korean", "latin"],
  "weight": ["300", "500", "700"],
  "i": []
};
fonts["Sunshiney"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Supermercado One"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Sura"] = {
  "v": ["regular", "700"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Suranna"] = {
  "v": ["regular"],
  "subset": ["telugu", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Suravaram"] = {
  "v": ["regular"],
  "subset": ["telugu", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Suwannaphum"] = {
  "v": ["regular"],
  "subset": ["khmer"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Swanky and Moo Moo"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Syncopate"] = {
  "v": ["regular", "700"],
  "subset": ["latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Tajawal"] = {
  "v": ["200", "300", "regular", "500", "700", "800", "900"],
  "subset": ["arabic", "latin"],
  "weight": ["200", "300", "400", "500", "700", "800", "900"],
  "i": ["normal"]
};
fonts["Tangerine"] = {
  "v": ["regular", "700"],
  "subset": ["latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Taprom"] = {
  "v": ["regular"],
  "subset": ["khmer"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Tauri"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Taviraj"] = {
  "v": ["100", "100italic", "200", "200italic", "300", "300italic", "regular", "italic", "500", "500italic", "600", "600italic", "700", "700italic", "800", "800italic", "900", "900italic"],
  "subset": ["latin-ext", "thai", "vietnamese", "latin"],
  "weight": ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  "i": ["normal", "italic"]
};
fonts["Teko"] = {
  "v": ["300", "regular", "500", "600", "700"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["300", "400", "500", "600", "700"],
  "i": ["normal"]
};
fonts["Telex"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Tenali Ramakrishna"] = {
  "v": ["regular"],
  "subset": ["telugu", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Tenor Sans"] = {
  "v": ["regular"],
  "subset": ["cyrillic", "latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Text Me One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["The Girl Next Door"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Tienne"] = {
  "v": ["regular", "700", "900"],
  "subset": ["latin"],
  "weight": ["400", "700", "900"],
  "i": ["normal"]
};
fonts["Tillana"] = {
  "v": ["regular", "500", "600", "700", "800"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["400", "500", "600", "700", "800"],
  "i": ["normal"]
};
fonts["Timmana"] = {
  "v": ["regular"],
  "subset": ["telugu", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Tinos"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["cyrillic", "cyrillic-ext", "greek-ext", "latin-ext", "hebrew", "greek", "vietnamese", "latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Titan One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Titillium Web"] = {
  "v": ["200", "200italic", "300", "300italic", "regular", "italic", "600", "600italic", "700", "700italic", "900"],
  "subset": ["latin-ext", "latin"],
  "weight": ["200", "300", "400", "600", "700", "900"],
  "i": ["normal", "italic"]
};
fonts["Trade Winds"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Trirong"] = {
  "v": ["100", "100italic", "200", "200italic", "300", "300italic", "regular", "italic", "500", "500italic", "600", "600italic", "700", "700italic", "800", "800italic", "900", "900italic"],
  "subset": ["latin-ext", "thai", "vietnamese", "latin"],
  "weight": ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  "i": ["normal", "italic"]
};
fonts["Trocchi"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Trochut"] = {
  "v": ["regular", "italic", "700"],
  "subset": ["latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Trykker"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Tulpen One"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Ubuntu"] = {
  "v": ["300", "300italic", "regular", "italic", "500", "500italic", "700", "700italic"],
  "subset": ["cyrillic", "cyrillic-ext", "greek-ext", "latin-ext", "greek", "latin"],
  "weight": ["300", "400", "500", "700"],
  "i": ["normal", "italic"]
};
fonts["Ubuntu Condensed"] = {
  "v": ["regular"],
  "subset": ["cyrillic", "cyrillic-ext", "greek-ext", "latin-ext", "greek", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Ubuntu Mono"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["cyrillic", "cyrillic-ext", "greek-ext", "latin-ext", "greek", "latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Ultra"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Uncial Antiqua"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Underdog"] = {
  "v": ["regular"],
  "subset": ["cyrillic", "latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Unica One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["UnifrakturCook"] = {
  "v": ["700"],
  "subset": ["latin"],
  "weight": ["700"],
  "i": []
};
fonts["UnifrakturMaguntia"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Unkempt"] = {
  "v": ["regular", "700"],
  "subset": ["latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
fonts["Unlock"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Unna"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["VT323"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Vampiro One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Varela"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Varela Round"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "hebrew", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Vast Shadow"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Vesper Libre"] = {
  "v": ["regular", "500", "700", "900"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["400", "500", "700", "900"],
  "i": ["normal"]
};
fonts["Vibur"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Vidaloka"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Viga"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Voces"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Volkhov"] = {
  "v": ["regular", "italic", "700", "700italic"],
  "subset": ["latin"],
  "weight": ["400", "700"],
  "i": ["normal", "italic"]
};
fonts["Vollkorn"] = {
  "v": ["regular", "italic", "600", "600italic", "700", "700italic", "900", "900italic"],
  "subset": ["cyrillic", "cyrillic-ext", "latin-ext", "greek", "vietnamese", "latin"],
  "weight": ["400", "600", "700", "900"],
  "i": ["normal", "italic"]
};
fonts["Vollkorn SC"] = {
  "v": ["regular", "600", "700", "900"],
  "subset": ["cyrillic", "cyrillic-ext", "latin-ext", "vietnamese", "latin"],
  "weight": ["400", "600", "700", "900"],
  "i": ["normal"]
};
fonts["Voltaire"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Waiting for the Sunrise"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Wallpoet"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Walter Turncoat"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Warnes"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Wellfleet"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Wendy One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Wire One"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Work Sans"] = {
  "v": ["100", "200", "300", "regular", "500", "600", "700", "800", "900"],
  "subset": ["latin-ext", "latin"],
  "weight": ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  "i": ["normal"]
};
fonts["Yanone Kaffeesatz"] = {
  "v": ["200", "300", "regular", "700"],
  "subset": ["cyrillic", "latin-ext", "vietnamese", "latin"],
  "weight": ["200", "300", "400", "700"],
  "i": ["normal"]
};
fonts["Yantramanav"] = {
  "v": ["100", "300", "regular", "500", "700", "900"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["100", "300", "400", "500", "700", "900"],
  "i": ["normal"]
};
fonts["Yatra One"] = {
  "v": ["regular"],
  "subset": ["latin-ext", "devanagari", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Yellowtail"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Yeon Sung"] = {
  "v": ["regular"],
  "subset": ["korean", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Yeseva One"] = {
  "v": ["regular"],
  "subset": ["cyrillic", "cyrillic-ext", "latin-ext", "vietnamese", "latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Yesteryear"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Yrsa"] = {
  "v": ["300", "regular", "500", "600", "700"],
  "subset": ["latin-ext", "latin"],
  "weight": ["300", "400", "500", "600", "700"],
  "i": ["normal"]
};
fonts["Zeyada"] = {
  "v": ["regular"],
  "subset": ["latin"],
  "weight": ["400"],
  "i": ["normal"]
};
fonts["Zilla Slab"] = {
  "v": ["300", "300italic", "regular", "italic", "500", "500italic", "600", "600italic", "700", "700italic"],
  "subset": ["latin-ext", "latin"],
  "weight": ["300", "400", "500", "600", "700"],
  "i": ["normal", "italic"]
};
fonts["Zilla Slab Highlight"] = {
  "v": ["regular", "700"],
  "subset": ["latin-ext", "latin"],
  "weight": ["400", "700"],
  "i": ["normal"]
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (fonts);

/***/ }),

/***/ "./src/components/typography/index.js":
/*!********************************************!*\
  !*** ./src/components/typography/index.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _font_typography_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./font-typography.js */ "./src/components/typography/font-typography.js");
/* harmony import */ var _range_typography_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./range-typography.js */ "./src/components/typography/range-typography.js");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./editor.scss */ "./src/components/typography/editor.scss");

/**
 * WordPress dependencies
 */


/**
 * Internal dependencies
 */


const {
  Button,
  Dashicon
} = wp.components;


// Extend component
const {
  Component,
  Fragment
} = wp.element;
class TypographyControl extends Component {
  constructor() {
    super(...arguments);
    this.onAdvancedControlClick = this.onAdvancedControlClick.bind(this);
    this.onAdvancedControlReset = this.onAdvancedControlReset.bind(this);
    this.timeline_settings_apply;
  }
  valueupdate() {
    let valueupdates = [this.props.fontSize.value, this.props.fontFamily.value == 'Default' ? undefined : this.props.fontFamily.value, this.props.fontWeight.value, this.props.lineHeight.value];
    for (let i = 0; i < valueupdates.length; i++) {
      if (valueupdates[i] != undefined) {
        this.timeline_settings_apply = ' cp-timeline-typography_apply';
        break;
      }
      this.timeline_settings_apply = '';
    }
    ;
  }
  onAdvancedControlClick() {
    let control = true;
    let label = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Hide Advanced", 'cfb-block');
    if (this.state !== null && this.state.showAdvancedControls === true) {
      control = false;
      label = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Advanced", 'cfb-block');
    }
    this.setState({
      showAdvancedControls: control,
      showAdvancedControlsLabel: label
    });
  }
  onAdvancedControlReset() {
    const {
      setAttributes
    } = this.props;

    // Reset Font family to default.
    setAttributes({
      [this.props.fontFamily.label]: "Default"
    });
    setAttributes({
      [this.props.fontWeight.label]: undefined
    });

    // Reset Font Size to default.
    setAttributes({
      [this.props.fontSize.label]: undefined
    });

    // Reset Line Height to default.
    setAttributes({
      [this.props.lineHeight.label]: undefined
    });

    // Reset Google Fonts to default.
    setAttributes({
      [this.props.loadGoogleFonts.label]: false
    });
  }
  render() {
    this.valueupdate();
    let fontSize;
    let lineHeight;
    let fontFamily;
    let fontAdvancedControls;
    let fontTypoAdvancedControls;
    let showAdvancedFontControls;
    let resetFontAdvancedControls;
    const {
      disableFontFamily,
      disableFontSize,
      disableLineHeight,
      disableAdvancedOptions = false
    } = this.props;
    if (true !== disableFontFamily) {
      fontFamily = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_font_typography_js__WEBPACK_IMPORTED_MODULE_2__["default"], {
        ...this.props
      });
    }
    if (true !== disableLineHeight) {
      lineHeight = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_range_typography_js__WEBPACK_IMPORTED_MODULE_3__["default"], {
        size: this.props.lineHeight,
        sizeLabel: this.props.lineHeight.label,
        sizeText: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Line Height", 'cfb-block'),
        initialPosition: 0,
        defaultValue: 0,
        ...this.props
      });
    }
    if (true !== disableFontSize) {
      fontSize = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_range_typography_js__WEBPACK_IMPORTED_MODULE_3__["default"], {
        size: this.props.fontSize,
        sizeLabel: this.props.fontSize.label,
        sizeText: !this.props.fontSizeLabel ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Font Size", 'cfb-block') : this.props.fontSizeLabel,
        initialPosition: this.props.fontSize.label == 'subHeadFontSize' ? 14 : 18,
        defaultValue: 18,
        ...this.props
      });
    }
    if (true !== disableFontFamily && true !== disableFontSize) {
      fontAdvancedControls = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Button, {
        className: "cfb-block-size-btn cfb-block-typography-control-btn",
        isSmall: true,
        "aria-pressed": this.state !== null,
        onClick: this.onAdvancedControlClick
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Dashicon, {
        icon: "admin-tools"
      }));
      resetFontAdvancedControls = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "components-button is-secondary is-small",
        onClick: this.onAdvancedControlReset
      }, "Reset");
    } else {
      showAdvancedFontControls = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, fontSize, fontFamily, lineHeight);
    }
    if (this.state !== null && this.state.showAdvancedControls === true) {
      showAdvancedFontControls = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "cfb-block-typography-advanced"
      }, fontSize, fontFamily, lineHeight);
    }
    if (true !== disableFontFamily && true !== disableFontSize) {
      fontTypoAdvancedControls = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "cfb-block-typography-option-actions"
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, this.props.label), fontAdvancedControls, resetFontAdvancedControls);
    }
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `cfb-block-typography-options${this.timeline_settings_apply}`
    }, !disableAdvancedOptions && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, fontTypoAdvancedControls, showAdvancedFontControls));
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TypographyControl);

/***/ }),

/***/ "./src/components/typography/range-typography.js":
/*!*******************************************************!*\
  !*** ./src/components/typography/range-typography.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ RangeTypographyControl)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../helpers/helper-functions.js */ "./src/helpers/helper-functions.js");

/**
 * WordPress dependencies
 */


const {
  RangeControl
} = wp.components;


// Extend component
const {
  Fragment
} = wp.element;

/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
function RangeTypographyControl(props) {
  var _px2;
  let sizeTypes = props.size.value ? props.size.value.replace(/\d+/g, '').replace('.', '').replace('undefined', '') : 'px';
  const output = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)(props.sizeText),
    value: props.size.value,
    onChange: value => {
      props.setAttributes({
        [props.sizeLabel]: value + sizeTypes
      });
    },
    min: 0,
    max: 100,
    step: 'em' !== sizeTypes ? 1 : 0.1,
    beforeIcon: "editor-textcolor",
    allowReset: true,
    initialPosition: props.initialPosition,
    withInputField: false
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalUnitControl, {
    onChange: sizeLabel => props.setAttributes({
      [props.sizeLabel]: sizeLabel
    }),
    isUnitSelectTabbable: true,
    isResetValueOnUnitChange: true,
    value: (_px2 = (0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_3__._px)(props.size.value)) !== null && _px2 !== void 0 ? _px2 : props.defaultValue,
    units: [{
      value: 'px',
      label: 'px',
      default: 0
    }, {
      value: 'em',
      label: 'em',
      default: 0
    }]
  }));
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: 'cfb-block-typography-range-options'
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "cfb-block-size-type-field-tabs"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "cfb-block-responsive-control-inner"
  }, output)));
}

/***/ }),

/***/ "./src/css-handler/index.js":
/*!**********************************!*\
  !*** ./src/css-handler/index.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_3__);
/**
 * WordPress dependencies
 */




let isSavingCSS = false;
const {
  createNotice
} = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.dispatch)('core/notices');
const savePostMeta = (0,lodash__WEBPACK_IMPORTED_MODULE_1__.debounce)(async () => {
  const {
    getCurrentPostId
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.select)('core/editor');
  const postId = getCurrentPostId();
  createNotice('info', (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Saving CSS…', 'cfb-blocks'), {
    isDismissible: true,
    type: 'snackbar',
    id: 'saving-css'
  });
  await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default()({
    path: `cfb/v1/post_styles/${postId}`,
    method: 'POST'
  });
  createNotice('info', (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('CSS saved.', 'cfb-blocks'), {
    isDismissible: true,
    type: 'snackbar',
    id: 'saving-css'
  });
  isSavingCSS = false;
}, 1000);
(0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.subscribe)(() => {
  if (Boolean(window.cfbBlockGutenbergObject.isBlockEditor) && (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.select)('core/editor')) {
    const {
      isCurrentPostPublished,
      isSavingPost,
      isPublishingPost,
      isAutosavingPost
    } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.select)('core/editor');
    const isAutoSaving = isAutosavingPost();
    const isPublishing = isPublishingPost();
    const isSaving = isSavingPost();
    const postPublished = isCurrentPostPublished();
    if ((isPublishing || postPublished && isSaving) && !isAutoSaving && !isSavingCSS) {
      isSavingCSS = true;
      const blocks = wp.data.select('core/block-editor').getBlocks();
      const blockNames = Object.values(blocks).map(block => {
        return block.name;
      });
      if (blockNames.includes('cp/cool-flipbox-block')) {
        savePostMeta();
      }
    }
  }
});

/***/ }),

/***/ "./src/edit.js":
/*!*********************!*\
  !*** ./src/edit.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var hex_rgba__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! hex-rgba */ "./node_modules/hex-rgba/index.js");
/* harmony import */ var hex_rgba__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(hex_rgba__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./editor.scss */ "./src/editor.scss");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./block.json */ "./src/block.json");
/* harmony import */ var _inspector_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./inspector.js */ "./src/inspector.js");
/* harmony import */ var _helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./helpers/helper-functions.js */ "./src/helpers/helper-functions.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _components_typography_fontloader_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./components/typography/fontloader.js */ "./src/components/typography/fontloader.js");
/* harmony import */ var _helpers_block_utility_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./helpers/block-utility.js */ "./src/helpers/block-utility.js");

/**
 * External dependencies
 */




// editor style


/**
 * WordPress dependencies.
 */




/**
 * Internal dependencies
 */






const {
  attributes: defaultAttributes
} = _block_json__WEBPACK_IMPORTED_MODULE_7__;
/**
 * Flip component
 * @param props
 * @returns
 */
const Edit = ({
  attributes,
  setAttributes,
  clientId,
  isSelected
}) => {
  var _attributes$width, _attributes$height, _attributes$frontBack, _attributes$frontBack2, _attributes$backBackg, _attributes$backBackg2, _attributes$title, _attributes$descripti;
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_6__.useEffect)(() => {
    // Set Flipbox Version for free to pro migration
    setAttributes({
      cfbBlockFlipboxVersion: 'free'
    });
    const unsubscribe = (0,_helpers_block_utility_js__WEBPACK_IMPORTED_MODULE_12__.blockInit)(clientId, defaultAttributes);
    return () => unsubscribe(attributes.id);
  }, [attributes.id]);
  const [currentSide, setSide] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_6__.useState)('front');

  // const { responsiveGetAttributes } = useResponsiveAttributes( setAttributes );

  const getShadowColor = () => {
    if (attributes.boxShadowColor) {
      if (attributes.boxShadowColor.includes('#') && attributes?.boxShadowColorOpacity && 0 <= attributes.boxShadowColorOpacity) {
        return hex_rgba__WEBPACK_IMPORTED_MODULE_2___default()(attributes.boxShadowColor, attributes.boxShadowColorOpacity || 0.00001);
      }
      return attributes.boxShadowColor;
    }
    return hex_rgba__WEBPACK_IMPORTED_MODULE_2___default()('#000000', attributes.boxShadowColorOpacity !== undefined ? attributes.boxShadowColorOpacity || 0.00001 : 1);
  };
  const inlineStyles = {
    '--cfb-block-editor-flip-animation': 'back' === currentSide ? 'var(--cfb-block-flip-anim)' : 'unset',
    '--cfb-block-width': (0,lodash__WEBPACK_IMPORTED_MODULE_10__.isNumber)(attributes.width) ? (0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_9__._px)(attributes.width) : (_attributes$width = attributes?.width) !== null && _attributes$width !== void 0 ? _attributes$width : '100%',
    '--cfb-block-height': (0,lodash__WEBPACK_IMPORTED_MODULE_10__.isNumber)(attributes.height) ? (0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_9__._px)(attributes.height) : (_attributes$height = attributes?.height) !== null && _attributes$height !== void 0 ? _attributes$height : '400px',
    '--cfb-block-border-width': attributes.borderWidth !== undefined && (0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_9__.boxToCSS)((0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_9__.mergeBoxDefaultValues)((0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_9__.stringToBox)((0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_9__._px)(attributes.borderWidth)), {
      left: '1px',
      right: '1px',
      bottom: '1px',
      top: '1px'
    })),
    '--cfb-block-border-color': attributes.borderColor,
    '--cfb-block-border-radius': attributes.borderRadius !== undefined && (0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_9__.boxToCSS)((0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_9__.mergeBoxDefaultValues)((0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_9__.stringToBox)((0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_9__._px)(attributes.borderRadius)), {
      left: '10px',
      right: '10px',
      bottom: '10px',
      top: '10px'
    })),
    '--cfb-block-front-background': (0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_9__.getChoice)([['gradient' === attributes.frontBackgroundType && attributes.frontBackgroundGradient, attributes.frontBackgroundGradient], ['image' === attributes.frontBackgroundType && attributes.frontBackgroundImage?.url, `url( ${attributes.frontBackgroundImage?.url} ) ${attributes.frontBackgroundRepeat || 'repeat'} ${attributes.frontBackgroundAttachment || 'scroll'} ${Math.round((_attributes$frontBack = attributes.frontBackgroundPosition?.x) !== null && _attributes$frontBack !== void 0 ? _attributes$frontBack : 0.5 * 100)}% ${Math.round((_attributes$frontBack2 = attributes.frontBackgroundPosition?.y) !== null && _attributes$frontBack2 !== void 0 ? _attributes$frontBack2 : 0.5 * 100)}%/${attributes.frontBackgroundSize || 'auto'}`], [attributes.frontBackgroundColor]]),
    '--cfb-block-back-background': (0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_9__.getChoice)([['gradient' === attributes.backBackgroundType && attributes.backBackgroundGradient, attributes.backBackgroundGradient], ['image' === attributes.backBackgroundType && attributes.backBackgroundImage?.url, `url( ${attributes.backBackgroundImage?.url} ) ${attributes.backBackgroundRepeat || 'repeat'} ${attributes.backBackgroundAttachment || 'scroll'} ${Math.round((_attributes$backBackg = attributes.backBackgroundPosition?.x) !== null && _attributes$backBackg !== void 0 ? _attributes$backBackg : 0.5 * 100)}% ${Math.round((_attributes$backBackg2 = attributes.backBackgroundPosition?.y) !== null && _attributes$backBackg2 !== void 0 ? _attributes$backBackg2 : 0.5 * 100)}%/${attributes.backBackgroundSize || 'auto'}`], [attributes.backBackgroundColor]]),
    '--cfb-block-box-shadow': attributes.boxShadow && `${attributes.boxShadowHorizontal}px ${attributes.boxShadowVertical}px ${attributes.boxShadowBlur}px ${getShadowColor()}`,
    '--cfb-block-front-vertical-align': attributes.frontVerticalAlign,
    '--cfb-block-front-horizontal-align': attributes.frontHorizontalAlign,
    '--cfb-block-front-text-align': attributes.frontTextAlign,
    '--cfb-block-back-text-align': attributes.backTextAlign,
    '--cfb-block-back-vertical-align': attributes.backVerticalAlign,
    '--cfb-block-back-horizontal-align': attributes.backHorizontalAlign,
    '--cfb-block-front-media-width': (0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_9__._px)(attributes.frontMediaWidth),
    '--cfb-block-front-media-height': (0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_9__._px)(attributes.frontMediaHeight),
    '--cfb-block-back-media-width': (0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_9__._px)(attributes.backMediaWidth),
    '--cfb-block-back-media-height': (0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_9__._px)(attributes.backMediaHeight),
    '--cfb-block-front-icon-size': (0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_9__._px)(attributes.frontIconSize),
    '--cfb-block-back-icon-size': (0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_9__._px)(attributes.backIconSize),
    '--cfb-block-front-icon-color': (0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_9__._px)(attributes.frontIconColor),
    '--cfb-block-back-icon-color': (0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_9__._px)(attributes.backIconColor),
    '--cfb-block-padding': (0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_9__.boxToCSS)(attributes?.padding),
    '--cfb-block-padding-tablet': (0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_9__.boxToCSS)(attributes?.paddingTablet),
    '--cfb-block-padding-mobile': (0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_9__.boxToCSS)(attributes?.paddingMobile),
    '--cfb-block-front-title-font-family': attributes.frontTitleFontFamily,
    '--cfb-block-front-title-font-size': (0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_9__._px)(attributes.frontTitleFontSize),
    '--cfb-block-front-title-line-height': (0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_9__._px)(attributes.frontTitleLineHeight),
    '--cfb-block-front-title-font-weight': attributes.frontTitleFontWeight,
    '--cfb-block-back-title-font-family': attributes.backTitleFontFamily,
    '--cfb-block-back-title-font-size': (0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_9__._px)(attributes.backTitleFontSize),
    '--cfb-block-back-title-line-height': (0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_9__._px)(attributes.backTitleLineHeight),
    '--cfb-block-back-title-font-weight': attributes.backTitleFontWeight,
    '--cfb-block-front-desc-font-family': attributes.frontDescFontFamily,
    '--cfb-block-front-desc-font-size': (0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_9__._px)(attributes.frontDescFontSize),
    '--cfb-block-front-desc-line-height': (0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_9__._px)(attributes.frontDescLineHeight),
    '--cfb-block-front-desc-font-weight': attributes.frontDescFontWeight,
    '--cfb-block-back-desc-font-family': attributes.backDescFontFamily,
    '--cfb-block-back-desc-font-size': (0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_9__._px)(attributes.backDescFontSize),
    '--cfb-block-back-desc-line-height': (0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_9__._px)(attributes.backDescLineHeight),
    '--cfb-block-back-desc-font-weight': attributes.backDescFontWeight,
    '--cfb-block-title-color': attributes.titleColor,
    '--cfb-block-desc-color': attributes.descriptionColor
  };
  const [cssNodeName, setNodeCSS] = (0,_helpers_block_utility_js__WEBPACK_IMPORTED_MODULE_12__.useCSSNode)();
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_5__.useBlockProps)({
    // @ts-ignore
    id: attributes.id,
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()({
      'flipX': 'flipX' === attributes.animType,
      'flipY': 'flipY' === attributes.animType,
      'flipY-rev': 'flipY-rev' === attributes.animType,
      'flipX-rev': 'flipX-rev' === attributes.animType
    }, cssNodeName),
    style: inlineStyles
  });

  // google fonts frontTitleGoogleFont frontDescGoogleFont backTitleGoogleFont backDescGoogleFont
  // Improved code
  const googleFonts = [];
  const previousFont = [];
  ['front', 'back'].forEach(side => {
    ['Title', 'Desc'].forEach(element => {
      const attr = side + element + 'GoogleFont';
      if (attributes[attr]) {
        const fontConfig = {
          google: {
            families: [attributes[`${side + element}FontFamily`] + (attributes[`${side + element}FontWeight`] ? `:${attributes[`${side + element}FontWeight`]}` : '')]
          }
        };
        const fontfamily = fontConfig?.google?.families[0];
        if (!previousFont.includes(fontfamily)) {
          const googleFont = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_typography_fontloader_js__WEBPACK_IMPORTED_MODULE_11__["default"], {
            config: fontConfig
          });
          googleFonts.push(googleFont);
          previousFont.push(fontConfig?.google?.families[0]);
        }
      }
    });
  });
  const imageUrl = cfbBlockGutenbergObject.cfbBlockUrl + 'assets/images/flipbox-block-preview-one.gif';
  return attributes.preview ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: imageUrl,
    width: "100%"
  }) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_inspector_js__WEBPACK_IMPORTED_MODULE_8__["default"], {
    attributes: attributes,
    setAttributes: setAttributes,
    currentSide: currentSide,
    setSide: setSide
  }), googleFonts.map((googleFont, key) => {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
      key: key
    }, googleFont);
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ...blockProps
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('cfb-block-flip-inner')
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "cfb-block-flip-front"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "cfb-block-flip-content"
  }, 'image' === attributes.frontContentType && attributes.frontMedia?.url && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    className: "cfb-block-img",
    src: attributes.frontMedia?.url
  }), 'icon' === attributes.frontContentType && attributes.frontIconData && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "cfb-block-front-icon"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("i", {
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()(attributes.frontIconData?.prefix, `${attributes.frontIconData?.name}`, 'fa-fw')
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_5__.RichText, {
    className: "cfb-block-front-title",
    tagName: "h3",
    placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Enter Front Title', 'cfb-blocks'),
    value: (_attributes$title = attributes.title) !== null && _attributes$title !== void 0 ? _attributes$title : '',
    onChange: title => setAttributes({
      title
    })
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_5__.RichText, {
    className: "cfb-block-front-desc",
    tagName: "p",
    placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Placeholder for flip box content visualization. Edit with your actual information.', 'cfb-blocks'),
    value: (_attributes$descripti = attributes.description) !== null && _attributes$descripti !== void 0 ? _attributes$descripti : '',
    onChange: description => setAttributes({
      description
    })
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "cfb-block-flip-back"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "cfb-block-flip-content"
  }, 'image' === attributes.backContentType && attributes.backMedia?.url && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    className: "cfb-block-img",
    src: attributes.backMedia?.url
  }), 'icon' === attributes.backContentType && attributes.backIconData && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "cfb-block-back-icon"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("i", {
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()(attributes.backIconData?.prefix, `${attributes.backIconData?.name}`, 'fa-fw')
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_5__.InnerBlocks, {
    renderAppender: isSelected ? _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_5__.InnerBlocks.DefaultBlockAppender : undefined,
    template: [['core/heading', {
      className: 'cfb-block-back-title',
      placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Enter Back Title', 'cfb-blocks'),
      level: 3
    }], ['core/paragraph', {
      className: 'cfb-block-back-desc',
      placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Placeholder for flip box content visualization. Edit with your actual information.', 'cfb-blocks'),
      content: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Substituted default content with your back description. Enhance design effortlessly in the Flipbox Block plugin for a professional touch.', 'cfb-blocks')
    }], ['core/buttons', {
      layout: {
        type: 'flex',
        justifyContent: 'center'
      },
      className: 'is-style-outline'
    }, [['core/button', {
      className: 'is-style-fill cfb-block-back-btn is-style-outline',
      placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Button text', 'cfb-blocks'),
      text: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Read More', 'cfb-blocks'),
      textColor: 'white'
      // style: {spacing: {padding: {bottom: "var:preset|spacing|20", left: "var:preset|spacing|40", right: "var:preset|spacing|40", top: "var:preset|spacing|20"}}}
    }]]]]
  }))))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Edit);

/***/ }),

/***/ "./src/helpers/block-utility.js":
/*!**************************************!*\
  !*** ./src/helpers/block-utility.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addBlockId: () => (/* binding */ addBlockId),
/* harmony export */   blockInit: () => (/* binding */ blockInit),
/* harmony export */   getDefaultValue: () => (/* binding */ getDefaultValue),
/* harmony export */   useCSSNode: () => (/* binding */ useCSSNode)
/* harmony export */ });
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/esm-browser/v4.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__);
var _window, _window$CoolPluginsGu, _window$CoolPluginsGu2, _window$CoolPluginsGu3;
/**
 * External dependencies.
 */


/**
 * WordPress dependencies.
 */





/**
 * Initiate the global id tracker with an empty list if it is the case.
 */
(_window$CoolPluginsGu = (_window = window).CoolPluginsGutenberg) !== null && _window$CoolPluginsGu !== void 0 ? _window$CoolPluginsGu : _window.CoolPluginsGutenberg = {};
(_window$CoolPluginsGu3 = (_window$CoolPluginsGu2 = window.CoolPluginsGutenberg).blockIDs) !== null && _window$CoolPluginsGu3 !== void 0 ? _window$CoolPluginsGu3 : _window$CoolPluginsGu2.blockIDs = [];

/**
 * Utiliy function for getting the default value of the attribute.
 *
 * @param {string}   name              The block's name provided by WordPress
 * @param {string}   field             Name of the value to be returned
 * @param {Object}   defaultAttributes The default attributes of the block.
 */
const getDefaultValue = (name, field, defaultAttributes) => {
  const blockDefaults = window.CoolPluginsGutenberg.globalDefaults?.[name];
  const value = blockDefaults?.[field] ? blockDefaults?.[field] : defaultAttributes[field]?.default;
  return value;
};

/**
 * An object that keep tracking of the block instances. Is used for preventing id duplication on action like: create, duplicate, copy on editor page.
 *
 * @type {Object.<string, Set.<string>>}
 */
const localIDs = {};

/**
 * Check if the ID is inside a reusable block or a Query Loop.
 * @param {string} clientId The client id of the block.
 * @returns {boolean}
 */
const isSharedBlock = clientId => getBlockParents(clientId)?.some(id => {
  var _getBlock;
  const {
    attributes,
    name
  } = (_getBlock = getBlock(id)) !== null && _getBlock !== void 0 ? _getBlock : {};
  return 'core/query' === name || attributes?.ref;
});

/**
 * Generate an Id based on the client id of the block. If the new id is also already used, create a new one using the `uuid`.
 *
 * @param {string}       idPrefix The prefix used for generating the block id
 * @param {string}       clientId The block's client id provided by WordPress
 * @param {Set.<string>} idsList  The ids list for the current type of block
 * @returns An uniq id instance
 */
const generateUniqIdInstance = (idPrefix, clientId, idsList) => {
  const instanceId = `${idPrefix}${clientId.slice(0, 8)}`;
  if (idsList.has(instanceId)) {
    let newInstanceId = `${idPrefix}${(0,uuid__WEBPACK_IMPORTED_MODULE_4__["default"])().slice(0, 8)}`;
    while (idsList.has(newInstanceId)) {
      newInstanceId = `${idPrefix}${(0,uuid__WEBPACK_IMPORTED_MODULE_4__["default"])().slice(0, 8)}`;
    }
    return newInstanceId;
  }
  return instanceId;
};

/**
 * Generate the id prefix based on the name of the block
 *
 * @param {string} name Name of the block
 * @returns {string}
 */
const generatePrefix = name => {
  return `wp-block-${name.replace('/', '-')}-`;
};
const idGenerationStatus = {};

/**
 * THe args definition for the block id generator
 *
 * @typedef {Object} AddBlockIdProps
 * @property {Object}             attributes        The block's attributes provided by WordPress
 * @property {Function}           setAttributes     The block's attributes update function provided by WordPress
 * @property {string}             name              The block's name provided by WordPress
 * @property {string}             clientId          The block's client id provided by WordPress
 * @property {Object}             defaultAttributes The default attributes of the block.
 * @property {(string|undefined)} idPrefix          (Optional) The prefix used for generating the block id
 */

/**
 * Generate an Id for block so that it will create a conlfict with the others.
 * Prevent the duplicate Id for actions like: duplicate, copy
 *
 * @param {AddBlockIdProps} args Block informatin about clientId, attributes, etc
 * @return {Function} A function that clean up the id from the internal list tracking
 * @external addBlockId
 */
const addBlockId = args => {
  var _window$CoolPluginsGu4, _localIDs$name;
  const {
    attributes,
    setAttributes,
    clientId,
    idPrefix,
    name,
    defaultAttributes
  } = args;
  idGenerationStatus[clientId] = 'busy';

  /**
   * Create an alias for the global id tracker
   *
   * @type {Array.<string>}
   */
  const blockIDs = (_window$CoolPluginsGu4 = window.CoolPluginsGutenberg?.blockIDs) !== null && _window$CoolPluginsGu4 !== void 0 ? _window$CoolPluginsGu4 : [];
  if (attributes === undefined || setAttributes === undefined) {
    return savedId => {
      localIDs[name]?.delete(savedId);
    };
  }

  // Initialize with an empty array the id list for the given block
  (_localIDs$name = localIDs[name]) !== null && _localIDs$name !== void 0 ? _localIDs$name : localIDs[name] = new Set();

  // Check if the ID is already used. EXCLUDE the one that come from reusable blocks.
  const idIsAlreadyUsed = Boolean(attributes.id && localIDs[name].has(attributes.id));
  if (attributes.id === undefined || idIsAlreadyUsed) {
    // Auto-generate idPrefix if not provided
    const prefix = idPrefix || generatePrefix(name);
    const instanceId = generateUniqIdInstance(prefix, clientId, localIDs[name]);
    if (attributes.id === undefined) {
      // If the id is undefined, then the block is newly created, and so we need to apply the Global Defaults
      // addGlobalDefaults( attributes, setAttributes, name, defaultAttributes );

      // Save the id in all methods
      localIDs[name].add(instanceId);
      blockIDs.push(instanceId);
      setAttributes({
        id: instanceId
      });
      return savedId => {
        return savedId => {};
      };
    } else if (idIsAlreadyUsed) {
      // The block must be a copy and its is already used
      // Generate a new one and save it to `localIDs` to keep track of it in local mode.
      localIDs[name].add(instanceId);
      setAttributes({
        id: instanceId
      });
      return savedId => {};
    }
  } else {
    // No conflicts, save the current id only to keep track of it both in local and global mode.
    localIDs[name].add(attributes.id);
    blockIDs.push(attributes.id);
  }
  return savedId => {
    idGenerationStatus[clientId] = 'free';
    localIDs[name].delete(savedId || attributes?.id);
  };
};
const {
  getBlock
} = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)('core/block-editor');
const {
  getBlockParents
} = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)('core/block-editor');
const {
  updateBlockAttributes
} = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.dispatch)('core/block-editor');
const {
  getSelectedBlockClientId
} = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)('core/block-editor');

/**
 * Create the function that behaves like `setAttributes` using the client id
 *
 * @param {*} clientId The block's client id provided by WordPress
 * @returns {Function} Function that mimics `setAttributes`
 */
const updateAttrs = clientId => attr => {
  updateBlockAttributes(clientId, attr);
};

/**
 * Extract the attributes, setAttributes, and the name of the block using the data api
 *
 * @param {string} clientId The block's client id provided by WordPress
 * @returns {BlockData}
 */
const extractBlockData = clientId => {
  const block = getBlock(clientId);
  return {
    attributes: block?.attributes,
    name: block?.name
  };
};

/**
 * Generate the id attribute for the given block.
 * This function is a simple wrapper around {@link addBlockId}
 *
 * @param {string} clientId          The block's client id provided by WordPress
 * @param {Object} defaultAttributes The default attributes of the block.
 * @return {Function} A function that clean up the id from the internal list tracking
 * @example
 * import defaultAttributes from './attributes'
 * const Block = ({ clientId }) => {
 * 		useEffect(() => {
 * 			const unsubscribe = blockInit(clientId, defaultAttributes);
 * 			return () => unsubscribe( attributes.id );
 * 		}, [ attributes.id ])
 * }
 */
const blockInit = (clientId, defaultAttributes) => {
  if (undefined === idGenerationStatus[clientId]) {
    idGenerationStatus[clientId] = 'free';
  }
  return 'busy' !== idGenerationStatus[clientId] && (!isSharedBlock(clientId) || getSelectedBlockClientId() === clientId) ? addBlockId({
    clientId,
    defaultAttributes,
    setAttributes: updateAttrs(clientId),
    ...extractBlockData(clientId)
  }) : () => {};
};

/**
 * Create a Style node for handling `head` Node change when working in a Tablet, Mobile mode or in FSE Editor.
 *
 * @param {import('./blocks.js').cfbNodeCSSOptions } options The options.
 * @returns {import('./blocks.js').cfbNodeCSSReturn} The name of the node and function handler.
 */
const useCSSNode = (options = {}) => {
  const [cssList, setCSSProps] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)({
    css: [],
    media: []
  });
  const [settings, setSettings] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)({
    node: null,
    cssNodeName: ''
  });

  /**
   *	Set CSS of the node.
   *
   * The `css` and `media` have a 1-1 relationship.
   *
   * @param {string[]} css A list with CSS code.
   * @param {string[]} media A list CSS media options. One for each CSS item.
   *
   * @example Simple usage.
   *
   */
  const setNodeCSS = (css = [], media = []) => {
    setCSSProps({
      css,
      media
    });
  };
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
    var _options$selector;
    let anchor;

    // Create the CSS node.
    const n = document.createElement('style');
    n.type = 'text/css';
    n.setAttribute('data-generator', 'cfb-blocks');
    setTimeout(() => {
      // A small delay for the iFrame to properly initialize.
      anchor = parent.document.querySelector('iframe[name="editor-canvas"]')?.contentWindow.document.head || document.head;
      anchor?.appendChild(n);
    }, 500);
    setSettings({
      node: n,
      cssNodeName: (_options$selector = options?.selector) !== null && _options$selector !== void 0 ? _options$selector : `cfb-block-node-${(0,uuid__WEBPACK_IMPORTED_MODULE_4__["default"])()}`
    });
    return () => {
      anchor?.removeChild(n);
    };
  }, []);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
    if (settings.node && settings.cssNodeName && cssList.media !== undefined) {
      // Create the CSS text by combining the list of CSS items with their media..
      const text = (0,lodash__WEBPACK_IMPORTED_MODULE_0__.zip)(cssList.css, cssList.media).map(x => {
        const [css, media] = x;
        if (media) {
          return `${media} { \n\t .${settings.cssNodeName}${options?.appendToRoot ? '' : ' '}${css} }`;
        }
        return `.${settings.cssNodeName}${options?.appendToRoot ? '' : ' '}${css}`;
      }).join('\n') || '';
      settings.node.textContent = text;
    }
  }, [cssList.css, cssList.media, settings.node, settings.cssNodeName]);
  return [settings.cssNodeName, setNodeCSS, setSettings];
};

/***/ }),

/***/ "./src/helpers/helper-functions.js":
/*!*****************************************!*\
  !*** ./src/helpers/helper-functions.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _px: () => (/* binding */ _px),
/* harmony export */   _unit: () => (/* binding */ _unit),
/* harmony export */   boxToCSS: () => (/* binding */ boxToCSS),
/* harmony export */   getChoice: () => (/* binding */ getChoice),
/* harmony export */   mergeBoxDefaultValues: () => (/* binding */ mergeBoxDefaultValues),
/* harmony export */   numberToBox: () => (/* binding */ numberToBox),
/* harmony export */   removeBoxDefaultValues: () => (/* binding */ removeBoxDefaultValues),
/* harmony export */   stringToBox: () => (/* binding */ stringToBox)
/* harmony export */ });
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_date__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/date */ "@wordpress/date");
/* harmony import */ var _wordpress_date__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_date__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);




/*
 +-------------------------------- CSS Utility functions --------------------------------+
*/

/**
 * Format the value based on the given unit.
 *
 * @param {number} value
 * @param {string} unit
 * @returns {string|undefined}
 */
const _unit = (value, unit) => (0,lodash__WEBPACK_IMPORTED_MODULE_0__.isNumber)(value) ? value + unit : value;

/**
 * Format the value into a `px` unit.
 *
 * @param {any} value The value.
 * @returns {string|undefined}
 */
const _px = value => _unit(value, 'px');

/**
 * Return the value of pair [condition, value] which has the first true condition.
 *
 * @param {([bool, any]|[any])[]} arr
 * @returns {*}
 */
const getChoice = arr => {
  var _r$;
  const r = arr?.filter(x => x?.[0])?.[0];
  return (_r$ = r?.[1]) !== null && _r$ !== void 0 ? _r$ : r?.[0];
};

/**
 * Remove the default values from Box object.
 *
 * @param {import('./blocks').BoxType} box
 * @param {import('./blocks').BoxType} defaultBox
 * @return {import('./blocks').BoxType}
 */
const removeBoxDefaultValues = (box, defaultBox) => {
  if (defaultBox === undefined || (0,lodash__WEBPACK_IMPORTED_MODULE_0__.isEmpty)(defaultBox)) {
    return box;
  }
  const cleaned = (0,lodash__WEBPACK_IMPORTED_MODULE_0__.omitBy)(box, (value, key) => value === defaultBox?.[key]);
  return (0,lodash__WEBPACK_IMPORTED_MODULE_0__.isEmpty)(cleaned) ? undefined : cleaned;
};

/**
 * Merge the Box objects.
 *
 * @param {import('./blocks').BoxType?} box
 * @param {import('./blocks').BoxType?} defaultBox
 * @return {import('./blocks').BoxType}
 */
const mergeBoxDefaultValues = (box, defaultBox) => {
  return (0,lodash__WEBPACK_IMPORTED_MODULE_0__.merge)({
    left: '0px',
    right: '0px',
    bottom: '0px',
    top: '0px'
  }, defaultBox, box);
};

/**
 * Wrap a given string in a box object.
 * @param {string|any} s The value.
 * @returns {import('./blocks').BoxType|any}
 */
const stringToBox = s => {
  if (!(0,lodash__WEBPACK_IMPORTED_MODULE_0__.isString)(s)) {
    return s;
  }
  return {
    top: s,
    bottom: s,
    right: s,
    left: s
  };
};

/**
 * Make a box intro a CSS string. If it is a string, wrap it into a box.
 * @param {string|import('./blocks').BoxType | undefined} box The box.
 * @returns
 */
const boxToCSS = box => {
  if (box === undefined) {
    return undefined;
  }
  const _box = (0,lodash__WEBPACK_IMPORTED_MODULE_0__.isString)(box) ? mergeBoxDefaultValues(stringToBox(box)) : mergeBoxDefaultValues(box);
  return `${_box.top} ${_box.right} ${_box.bottom} ${_box.left}`;
};

/**
 * If the given value is a number, transform it into a Box Value with the given unit. Otherwise, return the value.
 *
 * @param {number | any} n The number to convert.
 * @param {string?} unit The unit to add.
 * @returns {import('./blocks').BoxType | any} The box value or given value.
 */
const numberToBox = (x, unit = 'px') => (0,lodash__WEBPACK_IMPORTED_MODULE_0__.isNumber)(x) ? stringToBox(_unit(x, unit)) : x;

/***/ }),

/***/ "./src/helpers/icons.js":
/*!******************************!*\
  !*** ./src/helpers/icons.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   alignBottom: () => (/* binding */ alignBottom),
/* harmony export */   alignCenter: () => (/* binding */ alignCenter),
/* harmony export */   alignTop: () => (/* binding */ alignTop)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__);

/**
 * WordPress dependencies
 */

const alignBottom = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.Path, {
  d: "M15 4H9v11h6V4zM4 18.5V20h16v-1.5H4z"
}));
const alignCenter = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.Path, {
  d: "M20 11h-5V4H9v7H4v1.5h5V20h6v-7.5h5z"
}));
const alignTop = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.Path, {
  d: "M9 20h6V9H9v11zM4 4v1.5h16V4H4z"
}));

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./block.json */ "./src/block.json");
/* harmony import */ var _edit_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./edit.js */ "./src/edit.js");
/* harmony import */ var _save_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./save.js */ "./src/save.js");
/* harmony import */ var _css_handler_index_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./css-handler/index.js */ "./src/css-handler/index.js");

/**
 * WordPress dependencies
 */


/**
 * Internal dependencies
 */

// import { flipIcon as icon } from '../../helpers/icons.js';


// css-handler to save css in post meta using api 

const {
  name
} = _block_json__WEBPACK_IMPORTED_MODULE_3__;
const iconImg = window.cfbBlockGutenbergObject.cfbBlockIcon;
const icon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
  src: iconImg,
  className: "cfb-block-dashboard-logo",
  width: "30px"
});
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__.registerBlockType)(name, {
  ..._block_json__WEBPACK_IMPORTED_MODULE_3__,
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Cool Flipbox', 'cfb-block'),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Dynamically highlight content with the animated Cool Flipbox Block.', 'cfb-block'),
  icon,
  keywords: ['flip box', 'cool flipbox', 'flipbox', 'animation'],
  edit: _edit_js__WEBPACK_IMPORTED_MODULE_4__["default"],
  save: _save_js__WEBPACK_IMPORTED_MODULE_5__["default"],
  example: {
    attributes: {
      preview: true
    }
  }
});

/***/ }),

/***/ "./src/inspector.js":
/*!**************************!*\
  !*** ./src/inspector.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/align-left.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/align-center.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/align-right.js");
/* harmony import */ var _components_font_awesome_control_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/font-awesome-control/index.js */ "./src/components/font-awesome-control/index.js");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _components_index_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/index.js */ "./src/components/index.js");
/* harmony import */ var _helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./helpers/helper-functions.js */ "./src/helpers/helper-functions.js");
/* harmony import */ var _helpers_icons_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./helpers/icons.js */ "./src/helpers/icons.js");

/**
 * External dependencies
 */



/**
 * WordPress dependencies
 */






/**
 * Internal dependencies
 */



const Inspector = ({
  attributes,
  setAttributes,
  setSide,
  currentSide
}) => {
  var _attributes, _attributes2, _attributes3, _attributes$width, _attributes$height, _attributes$padding;
  const changeBoxShadowColor = value => {
    setAttributes({
      boxShadowColor: 100 > attributes.boxShadowColorOpacity && value?.includes('var(') ? getComputedStyle(document.documentElement, null).getPropertyValue(value?.replace('var(', '')?.replace(')', '')) : value
    });
  };
  const changeBoxShadowColorOpacity = value => {
    const changes = {
      boxShadowColorOpacity: value
    };
    if (100 > value && attributes.boxShadowColor?.includes('var(')) {
      changes.boxShadowColor = getComputedStyle(document.documentElement, null).getPropertyValue(attributes.boxShadowColor.replace('var(', '').replace(')', ''));
    }
    setAttributes(changes);
  };
  const coolFlipDirectionBtn = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_index_js__WEBPACK_IMPORTED_MODULE_7__.ButtonToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Current Side', 'cfb-blocks'),
    options: [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Front', 'cfb-blocks'),
      value: 'front'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Back', 'cfb-blocks'),
      value: 'back'
    }],
    value: currentSide !== null && currentSide !== void 0 ? currentSide : 'none',
    onChange: v => {
      setSide(v);
    },
    className: "cfb-block-direction-selector"
  });
  const coolFlipboxReviewBox = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Please Share Your Valuable Feedback.", "timeline-block")
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.CardBody, {
    className: "cfb-block-review-tab"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("We hope you liked our plugin created Flipbox. Please share your valuable feedback.", "cfb-block"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: "https://wordpress.org/support/plugin/flip-boxes/reviews/#new-post",
    className: "components-button is-primary is-small",
    target: "_blank"
  }, "Rate Us", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, " \u2605\u2605\u2605\u2605\u2605"))));
  const coolFlipboxSettings = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.CardBody, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_6__.Fragment, null, coolFlipDirectionBtn, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Flip Settings', 'cfb-blocks')
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Flip Direction', 'cfb-blocks'),
    value: attributes.animType,
    options: [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Bottom to Top', 'cfb-blocks'),
      value: 'flipX'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Top to Bottom', 'cfb-blocks'),
      value: 'flipX-rev'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Left to Right', 'cfb-blocks'),
      value: 'flipY'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Right to Left', 'cfb-blocks'),
      value: 'flipY-rev'
    }],
    onChange: animType => setAttributes({
      animType
    })
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)(`${currentSide} Side Content`, 'cfb-blocks'),
    initialOpen: false
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_index_js__WEBPACK_IMPORTED_MODULE_7__.ToogleGroupControl, {
    value: (_attributes = attributes[`${currentSide}ContentType`]) !== null && _attributes !== void 0 ? _attributes : 'none',
    options: [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('None', 'cfb-blocks'),
      value: 'none'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Image', 'cfb-blocks'),
      value: 'image'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Icon', 'cfb-blocks'),
      value: 'icon'
    }],
    onChange: v => {
      const attrs = {};
      attrs[`${currentSide}ContentType`] = !(0,lodash__WEBPACK_IMPORTED_MODULE_3__.isEmpty)(v) && 'none' !== v ? v : 'none';
      if ((0,lodash__WEBPACK_IMPORTED_MODULE_3__.isEmpty)(v) || 'none' === v) {
        attrs[`${currentSide}Media`] = undefined;
      }
      setAttributes(attrs);
    }
  }), 'image' === attributes[`${currentSide}ContentType`] && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_6__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.BaseControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Media Image', 'cfb-blocks'),
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Set an image as showcase.', 'cfb-blocks')
  }, !attributes[`${currentSide}Media`]?.url ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.MediaPlaceholder, {
    labels: {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Media Image', 'cfb-blocks')
    },
    accept: "image/*",
    allowedTypes: ['image'],
    value: attributes[`${currentSide}Media`],
    onSelect: value => {
      const attr = {};
      attr[`${currentSide}Media`] = (0,lodash__WEBPACK_IMPORTED_MODULE_3__.pick)(value, ['id', 'alt', 'url']), attr[`${currentSide}MediaHeight`] = '100%', attr[`${currentSide}MediaWidth`] = (0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_8__._px)(value?.sizes?.medium?.width);
      setAttributes(attr);
    }
  }) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.BaseControl, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: attributes[`${currentSide}Media`].url,
    alt: attributes[`${currentSide}Media`].alt,
    style: {
      border: '2px solid var( --wp-admin-theme-color)',
      maxHeight: '250px'
    }
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.Button, {
    isSecondary: true,
    onClick: () => {
      const attr = {};
      attr[`${currentSide}Media`] = undefined;
      setAttributes(attr);
    }
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Remove image', 'cfb-blocks')))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.__experimentalUnitControl, {
    onChange: MediaWidth => {
      const attr = {};
      attr[`${currentSide}MediaWidth`] = MediaWidth;
      setAttributes(attr);
    },
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Media Width', 'cfb-blocks'),
    isUnitSelectTabbable: true,
    isResetValueOnUnitChange: true,
    value: (0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_8__._px)(attributes[`${currentSide}MediaWidth`])
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.__experimentalUnitControl, {
    onChange: MediaHeight => {
      const attr = {};
      attr[`${currentSide}MediaHeight`] = MediaHeight;
      setAttributes(attr);
    },
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Media Height', 'cfb-blocks'),
    isUnitSelectTabbable: true,
    isResetValueOnUnitChange: true,
    value: (0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_8__._px)(attributes[`${currentSide}MediaHeight`])
  })), 'icon' === attributes[`${currentSide}ContentType`] && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_6__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_font_awesome_control_index_js__WEBPACK_IMPORTED_MODULE_1__["default"], {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Icon Picker', 'cfb-blocks'),
    attrName: `${currentSide}IconData`,
    iconObj: attributes[`${currentSide}IconData`],
    fontSizeLabel: `${currentSide}IconSize`,
    fontSize: attributes[`${currentSide}IconSize`],
    setAttributes: setAttributes,
    fontColorLabel: [`${currentSide}IconColor`],
    fontColor: attributes[`${currentSide}IconColor`]
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)(`${currentSide} Alignment`, 'cfb-blocks'),
    initialOpen: false
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_6__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.BaseControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Vertical', 'cfb-blocks')
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_index_js__WEBPACK_IMPORTED_MODULE_7__.ToogleGroupControl, {
    options: [{
      icon: _helpers_icons_js__WEBPACK_IMPORTED_MODULE_9__.alignTop,
      value: 'flex-start'
    }, {
      icon: _helpers_icons_js__WEBPACK_IMPORTED_MODULE_9__.alignCenter,
      value: 'center'
    }, {
      icon: _helpers_icons_js__WEBPACK_IMPORTED_MODULE_9__.alignBottom,
      value: 'flex-end'
    }],
    value: (_attributes2 = attributes[`${currentSide}VerticalAlign`]) !== null && _attributes2 !== void 0 ? _attributes2 : 'center',
    onChange: value => {
      const attr = {};
      attr[`${currentSide}VerticalAlign`] = value;
      setAttributes(attr);
    }
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.BaseControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Horizontal', 'cfb-blocks')
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_index_js__WEBPACK_IMPORTED_MODULE_7__.ToogleGroupControl, {
    options: [{
      icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_10__["default"],
      value: 'flex-start'
    }, {
      icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_11__["default"],
      value: 'center'
    }, {
      icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_12__["default"],
      value: 'flex-end'
    }],
    value: (_attributes3 = attributes[`${currentSide}HorizontalAlign`]) !== null && _attributes3 !== void 0 ? _attributes3 : 'center',
    onChange: value => {
      const attr = {};
      attr[`${currentSide}HorizontalAlign`] = value;
      const valueSplit = value.split("-")?.[1];
      const textAlign = valueSplit ? valueSplit : value;
      attr[`${currentSide}TextAlign`] = textAlign;
      setAttributes(attr);
    }
  }))))));
  const coolFlipboxStyleSettings = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.CardBody, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_6__.Fragment, null, coolFlipDirectionBtn, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Container Dimensions', 'cfb-blocks')
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.__experimentalUnitControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Width', 'cfb-blocks'),
    value: (0,lodash__WEBPACK_IMPORTED_MODULE_3__.isNumber)(attributes.width) ? (0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_8__._px)(attributes.width) : (_attributes$width = attributes?.width) !== null && _attributes$width !== void 0 ? _attributes$width : '100%',
    onChange: width => setAttributes({
      width
    }),
    isUnitSelectTabbable: true,
    isResetValueOnUnitChange: true,
    allowReset: true
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.__experimentalUnitControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Height', 'cfb-blocks'),
    value: (0,lodash__WEBPACK_IMPORTED_MODULE_3__.isNumber)(attributes.height) ? (0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_8__._px)(attributes.height) : (_attributes$height = attributes?.height) !== null && _attributes$height !== void 0 ? _attributes$height : '400px',
    onChange: value => {
      const height = '' !== value ? value : 'auto';
      setAttributes({
        height
      });
    },
    isUnitSelectTabbable: true,
    isResetValueOnUnitChange: true,
    allowReset: true,
    units: [{
      default: 300,
      label: 'px',
      value: 'px'
    }, {
      default: 20,
      label: 'em',
      value: 'em'
    }, {
      default: 20,
      label: 'rem',
      value: 'rem'
    }, {
      default: 30,
      label: 'vw',
      value: 'vw'
    }, {
      default: 35,
      label: 'vh',
      value: 'vh'
    }]
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.__experimentalBoxControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Padding', 'cfb-blocks'),
    values: (_attributes$padding = attributes?.padding) !== null && _attributes$padding !== void 0 ? _attributes$padding : {
      top: '0px',
      bottom: '0px',
      left: '0px',
      right: '0px'
    },
    onChange: value => {
      let result = {};
      if ('object' === typeof value) {
        result = Object.fromEntries(Object.entries((0,lodash__WEBPACK_IMPORTED_MODULE_3__.pick)(value, ['top', 'bottom', 'left', 'right'])).filter(([_, v]) => null !== v && undefined !== v));
      }
      if ((0,lodash__WEBPACK_IMPORTED_MODULE_3__.isEmpty)(result)) {
        result = undefined;
      }
      setAttributes({
        padding: result
      });
    },
    allowReset: true
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)(`Background ${currentSide} Side`, 'cfb-blocks'),
    initialOpen: false
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_index_js__WEBPACK_IMPORTED_MODULE_7__.BackgroundSelectorControl, {
    backgroundType: attributes[`${currentSide}BackgroundType`],
    backgroundColor: attributes[`${currentSide}BackgroundColor`],
    image: attributes[`${currentSide}BackgroundImage`],
    gradient: attributes[`${currentSide}BackgroundGradient`],
    focalPoint: attributes[`${currentSide}BackgroundPosition`],
    backgroundAttachment: attributes[`${currentSide}BackgroundAttachment`],
    backgroundRepeat: attributes[`${currentSide}BackgroundRepeat`],
    backgroundSize: attributes[`${currentSide}BackgroundSize`],
    setAttributes: setAttributes,
    currentSide: currentSide,
    changeBackgroundType: value => {
      const attr = {};
      attr[`${currentSide}BackgroundType`] = value;
      setAttributes(attr);
    },
    changeImage: value => {
      const attr = {};
      attr[`${currentSide}BackgroundImage`] = (0,lodash__WEBPACK_IMPORTED_MODULE_3__.pick)(value, ['id', 'url']);
      setAttributes(attr);
    },
    removeImage: () => {
      setAttributes({
        frontBackgroundImage: undefined
      });
    },
    changeColor: value => {
      const attr = {};
      attr[`${currentSide}BackgroundColor`] = value;
      setAttributes(attr);
    },
    changeGradient: value => {
      const attr = {};
      attr[`${currentSide}BackgroundGradient`] = value;
      setAttributes(attr);
    },
    changeBackgroundAttachment: value => {
      const attr = {};
      attr[`${currentSide}BackgroundAttachment`] = value;
      setAttributes(attr);
    },
    changeBackgroundRepeat: value => {
      const attr = {};
      attr[`${currentSide}BackgroundRepeat`] = value;
      setAttributes(attr);
    },
    changeFocalPoint: value => {
      const attr = {};
      attr[`${currentSide}BackgroundPosition`] = value;
      setAttributes(attr);
    },
    changeBackgroundSize: value => {
      const attr = {};
      attr[`${currentSide}BackgroundSize`] = value;
      setAttributes(attr);
    }
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)(`Typography ${currentSide} Side`, 'cfb-blocks'),
    initialOpen: false
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_index_js__WEBPACK_IMPORTED_MODULE_7__.TypographyControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Title", 'cfb-blocks'),
    attributes: attributes,
    setAttributes: setAttributes,
    loadGoogleFonts: {
      value: attributes[`${currentSide}TitleGoogleFont`],
      label: `${currentSide}TitleGoogleFont`
    },
    fontFamily: {
      value: attributes[`${currentSide}TitleFontFamily`],
      label: `${currentSide}TitleFontFamily`
    },
    fontWeight: {
      value: attributes[`${currentSide}TitleFontWeight`],
      label: `${currentSide}TitleFontWeight`
    },
    fontSize: {
      value: attributes[`${currentSide}TitleFontSize`],
      label: `${currentSide}TitleFontSize`
    },
    lineHeight: {
      value: attributes[`${currentSide}TitleLineHeight`],
      label: `${currentSide}TitleLineHeight`
    }
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_index_js__WEBPACK_IMPORTED_MODULE_7__.TypographyControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Description", 'cfb-blocks'),
    attributes: attributes,
    setAttributes: setAttributes,
    loadGoogleFonts: {
      value: attributes[`${currentSide}DescGoogleFont`],
      label: `${currentSide}DescGoogleFont`
    },
    fontFamily: {
      value: attributes[`${currentSide}DescFontFamily`],
      label: `${currentSide}DescFontFamily`
    },
    fontWeight: {
      value: attributes[`${currentSide}DescFontWeight`],
      label: `${currentSide}DescFontWeight`
    },
    fontSize: {
      value: attributes[`${currentSide}DescFontSize`],
      label: `${currentSide}DescFontSize`
    },
    lineHeight: {
      value: attributes[`${currentSide}DescLineHeight`],
      label: `${currentSide}DescLineHeight`
    }
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.PanelColorSettings, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Color', 'cfb-blocks'),
    initialOpen: true,
    colorSettings: [{
      value: attributes.borderColor,
      onChange: borderColor => setAttributes({
        borderColor
      }),
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Border', 'cfb-blocks'),
      isShownByDefault: false
    }, {
      value: attributes.titleColor,
      onChange: titleColor => setAttributes({
        titleColor
      }),
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Title', 'cfb-blocks'),
      isShownByDefault: false
    }, {
      value: attributes.descriptionColor,
      onChange: descriptionColor => setAttributes({
        descriptionColor
      }),
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Description', 'cfb-blocks'),
      isShownByDefault: false
    }]
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Border', 'cfb-blocks'),
    initialOpen: false
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.__experimentalBoxControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Width', 'cfb-blocks'),
    values: (0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_8__.mergeBoxDefaultValues)((0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_8__.numberToBox)(attributes.borderWidth), (0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_8__.stringToBox)('1px')),
    onChange: value => {
      setAttributes({
        borderWidth: (0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_8__.removeBoxDefaultValues)(value, {
          left: '1px',
          right: '1px',
          bottom: '1px',
          top: '1px'
        })
      });
    },
    allowReset: true
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.__experimentalBoxControl, {
    id: "cfb-border-raduis-box",
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Radius', 'cfb-blocks'),
    values: (0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_8__.mergeBoxDefaultValues)((0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_8__.numberToBox)(attributes.borderRadius), (0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_8__.stringToBox)('10px')),
    onChange: value => {
      setAttributes({
        borderRadius: (0,_helpers_helper_functions_js__WEBPACK_IMPORTED_MODULE_8__.removeBoxDefaultValues)(value, {
          left: '10px',
          right: '10px',
          bottom: '10px',
          top: '10px'
        })
      });
    },
    allowReset: true
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Shadow Properties', 'cfb-blocks'),
    checked: attributes.boxShadow,
    onChange: boxShadow => setAttributes({
      boxShadow
    })
  }), attributes.boxShadow && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_6__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.__experimentalColorGradientControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Color', 'cfb-blocks'),
    colorValue: attributes.boxShadowColor,
    onColorChange: changeBoxShadowColor
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_index_js__WEBPACK_IMPORTED_MODULE_7__.ControlPanelControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Shadow Properties', 'cfb-blocks')
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Opacity', 'cfb-blocks'),
    value: attributes.boxShadowColorOpacity,
    onChange: changeBoxShadowColorOpacity,
    min: 0,
    max: 100,
    allowReset: true
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Blur', 'cfb-blocks'),
    value: attributes.boxShadowBlur,
    onChange: boxShadowBlur => setAttributes({
      boxShadowBlur
    }),
    min: 0,
    max: 100,
    allowReset: true
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Horizontal', 'cfb-blocks'),
    value: attributes.boxShadowHorizontal,
    onChange: boxShadowHorizontal => setAttributes({
      boxShadowHorizontal
    }),
    min: -100,
    max: 100,
    allowReset: true
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Vertical', 'cfb-blocks'),
    value: attributes.boxShadowVertical,
    onChange: boxShadowVertical => setAttributes({
      boxShadowVertical
    }),
    min: -100,
    max: 100,
    allowReset: true
  }))))));
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.InspectorControls, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.TabPanel, {
    className: "cfb-block-settings",
    activeClass: "active-tab",
    tabs: [{
      name: 'timeline_setting',
      title: 'Settings',
      className: 'cfb-block-tabs cfb-block-general-tab',
      content: coolFlipboxSettings
    }, {
      name: 'general_setting',
      title: 'Style',
      className: 'cfb-block-tabs  cfb-block-style-tab',
      content: coolFlipboxStyleSettings
    }]
  }, tab => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.Card, null, tab.content)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("View Cool Flipbox video", "cfb-blocks"),
    initialOpen: false
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.CardBody, {
    className: "cfb-block-demo-button"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    target: "_blank",
    className: "button button-primary",
    href: "https://www.youtube.com/watch?v=qjC_TXUJ3-w"
  }, "Watch Video"))), coolFlipboxReviewBox);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Inspector);

/***/ }),

/***/ "./src/save.js":
/*!*********************!*\
  !*** ./src/save.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.scss */ "./src/style.scss");


/**
 * WordPress dependencies.
 */


const Save = ({
  attributes
}) => {
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps.save({
    id: attributes.id,
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('anim', {
      'flipX': 'flipX' === attributes.animType,
      'flipY': 'flipY' === attributes.animType,
      'flipY-rev': 'flipY-rev' === attributes.animType,
      'flipX-rev': 'flipX-rev' === attributes.animType
    })
  });
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ...blockProps
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('cfb-block-flip-inner')
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "cfb-block-flip-front"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "cfb-block-flip-content"
  }, 'image' === attributes.frontContentType && attributes.frontMedia?.url && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    className: "cfb-block-img",
    src: attributes.frontMedia?.url
  }), 'icon' === attributes.frontContentType && attributes.frontIconData && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "cfb-block-front-icon"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("i", {
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()(attributes.frontIconData?.prefix, `${attributes.frontIconData?.name}`, 'fa-fw')
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText.Content, {
    className: "cfb-block-front-title",
    tagName: "h3",
    value: attributes.title
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText.Content, {
    className: "cfb-block-front-desc",
    tagName: "p",
    value: attributes.description
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "cfb-block-flip-back"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "cfb-block-flip-content"
  }, 'image' === attributes.backContentType && attributes.backMedia?.url && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    className: "cfb-block-img",
    src: attributes.backMedia?.url
  }), 'icon' === attributes.backContentType && attributes.backIconData && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "cfb-block-back-icon"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("i", {
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()(attributes.backIconData?.prefix, `${attributes.backIconData?.name}`, 'fa-fw')
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null)))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Save);

/***/ }),

/***/ "./node_modules/classnames/index.js":
/*!******************************************!*\
  !*** ./node_modules/classnames/index.js ***!
  \******************************************/
/***/ ((module, exports) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;
	var nativeCodeString = '[native code]';

	function classNames() {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				if (arg.length) {
					var inner = classNames.apply(null, arg);
					if (inner) {
						classes.push(inner);
					}
				}
			} else if (argType === 'object') {
				if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
					classes.push(arg.toString());
					continue;
				}

				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if ( true && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
}());


/***/ }),

/***/ "./node_modules/hex-rgba/index.js":
/*!****************************************!*\
  !*** ./node_modules/hex-rgba/index.js ***!
  \****************************************/
/***/ ((module) => {

"use strict";


function hexToRgba(hex, opacity){
  var opacity = opacity || 100;
  var hex = hex.replace('#', '');
  if(hex.length === 6) {
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);
  } else {
    var rd = hex.substring(0, 1) + hex.substring(0, 1);
    var gd = hex.substring(1, 2) + hex.substring(1, 2);
    var bd = hex.substring(2, 3) + hex.substring(2, 3);
    var r = parseInt(rd, 16);
    var g = parseInt(gd, 16);
    var b = parseInt(bd, 16);
  }

  return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + opacity / 100 + ')';
};

module.exports = hexToRgba;

/***/ }),

/***/ "./node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var reactIs = __webpack_require__(/*! react-is */ "./node_modules/hoist-non-react-statics/node_modules/react-is/index.js");

/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
var REACT_STATICS = {
  childContextTypes: true,
  contextType: true,
  contextTypes: true,
  defaultProps: true,
  displayName: true,
  getDefaultProps: true,
  getDerivedStateFromError: true,
  getDerivedStateFromProps: true,
  mixins: true,
  propTypes: true,
  type: true
};
var KNOWN_STATICS = {
  name: true,
  length: true,
  prototype: true,
  caller: true,
  callee: true,
  arguments: true,
  arity: true
};
var FORWARD_REF_STATICS = {
  '$$typeof': true,
  render: true,
  defaultProps: true,
  displayName: true,
  propTypes: true
};
var MEMO_STATICS = {
  '$$typeof': true,
  compare: true,
  defaultProps: true,
  displayName: true,
  propTypes: true,
  type: true
};
var TYPE_STATICS = {};
TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;
TYPE_STATICS[reactIs.Memo] = MEMO_STATICS;

function getStatics(component) {
  // React v16.11 and below
  if (reactIs.isMemo(component)) {
    return MEMO_STATICS;
  } // React v16.12 and above


  return TYPE_STATICS[component['$$typeof']] || REACT_STATICS;
}

var defineProperty = Object.defineProperty;
var getOwnPropertyNames = Object.getOwnPropertyNames;
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var getPrototypeOf = Object.getPrototypeOf;
var objectPrototype = Object.prototype;
function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
  if (typeof sourceComponent !== 'string') {
    // don't hoist over string (html) components
    if (objectPrototype) {
      var inheritedComponent = getPrototypeOf(sourceComponent);

      if (inheritedComponent && inheritedComponent !== objectPrototype) {
        hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
      }
    }

    var keys = getOwnPropertyNames(sourceComponent);

    if (getOwnPropertySymbols) {
      keys = keys.concat(getOwnPropertySymbols(sourceComponent));
    }

    var targetStatics = getStatics(targetComponent);
    var sourceStatics = getStatics(sourceComponent);

    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i];

      if (!KNOWN_STATICS[key] && !(blacklist && blacklist[key]) && !(sourceStatics && sourceStatics[key]) && !(targetStatics && targetStatics[key])) {
        var descriptor = getOwnPropertyDescriptor(sourceComponent, key);

        try {
          // Avoid failures from read-only properties
          defineProperty(targetComponent, key, descriptor);
        } catch (e) {}
      }
    }
  }

  return targetComponent;
}

module.exports = hoistNonReactStatics;


/***/ }),

/***/ "./node_modules/hoist-non-react-statics/node_modules/react-is/cjs/react-is.development.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/hoist-non-react-statics/node_modules/react-is/cjs/react-is.development.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */





if (true) {
  (function() {
'use strict';

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
// (unstable) APIs that have been removed. Can we remove the symbols?

var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

function isValidElementType(type) {
  return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
}

function typeOf(object) {
  if (typeof object === 'object' && object !== null) {
    var $$typeof = object.$$typeof;

    switch ($$typeof) {
      case REACT_ELEMENT_TYPE:
        var type = object.type;

        switch (type) {
          case REACT_ASYNC_MODE_TYPE:
          case REACT_CONCURRENT_MODE_TYPE:
          case REACT_FRAGMENT_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_SUSPENSE_TYPE:
            return type;

          default:
            var $$typeofType = type && type.$$typeof;

            switch ($$typeofType) {
              case REACT_CONTEXT_TYPE:
              case REACT_FORWARD_REF_TYPE:
              case REACT_LAZY_TYPE:
              case REACT_MEMO_TYPE:
              case REACT_PROVIDER_TYPE:
                return $$typeofType;

              default:
                return $$typeof;
            }

        }

      case REACT_PORTAL_TYPE:
        return $$typeof;
    }
  }

  return undefined;
} // AsyncMode is deprecated along with isAsyncMode

var AsyncMode = REACT_ASYNC_MODE_TYPE;
var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
var ContextConsumer = REACT_CONTEXT_TYPE;
var ContextProvider = REACT_PROVIDER_TYPE;
var Element = REACT_ELEMENT_TYPE;
var ForwardRef = REACT_FORWARD_REF_TYPE;
var Fragment = REACT_FRAGMENT_TYPE;
var Lazy = REACT_LAZY_TYPE;
var Memo = REACT_MEMO_TYPE;
var Portal = REACT_PORTAL_TYPE;
var Profiler = REACT_PROFILER_TYPE;
var StrictMode = REACT_STRICT_MODE_TYPE;
var Suspense = REACT_SUSPENSE_TYPE;
var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

function isAsyncMode(object) {
  {
    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
      hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

      console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
    }
  }

  return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
}
function isConcurrentMode(object) {
  return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
}
function isContextConsumer(object) {
  return typeOf(object) === REACT_CONTEXT_TYPE;
}
function isContextProvider(object) {
  return typeOf(object) === REACT_PROVIDER_TYPE;
}
function isElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}
function isForwardRef(object) {
  return typeOf(object) === REACT_FORWARD_REF_TYPE;
}
function isFragment(object) {
  return typeOf(object) === REACT_FRAGMENT_TYPE;
}
function isLazy(object) {
  return typeOf(object) === REACT_LAZY_TYPE;
}
function isMemo(object) {
  return typeOf(object) === REACT_MEMO_TYPE;
}
function isPortal(object) {
  return typeOf(object) === REACT_PORTAL_TYPE;
}
function isProfiler(object) {
  return typeOf(object) === REACT_PROFILER_TYPE;
}
function isStrictMode(object) {
  return typeOf(object) === REACT_STRICT_MODE_TYPE;
}
function isSuspense(object) {
  return typeOf(object) === REACT_SUSPENSE_TYPE;
}

exports.AsyncMode = AsyncMode;
exports.ConcurrentMode = ConcurrentMode;
exports.ContextConsumer = ContextConsumer;
exports.ContextProvider = ContextProvider;
exports.Element = Element;
exports.ForwardRef = ForwardRef;
exports.Fragment = Fragment;
exports.Lazy = Lazy;
exports.Memo = Memo;
exports.Portal = Portal;
exports.Profiler = Profiler;
exports.StrictMode = StrictMode;
exports.Suspense = Suspense;
exports.isAsyncMode = isAsyncMode;
exports.isConcurrentMode = isConcurrentMode;
exports.isContextConsumer = isContextConsumer;
exports.isContextProvider = isContextProvider;
exports.isElement = isElement;
exports.isForwardRef = isForwardRef;
exports.isFragment = isFragment;
exports.isLazy = isLazy;
exports.isMemo = isMemo;
exports.isPortal = isPortal;
exports.isProfiler = isProfiler;
exports.isStrictMode = isStrictMode;
exports.isSuspense = isSuspense;
exports.isValidElementType = isValidElementType;
exports.typeOf = typeOf;
  })();
}


/***/ }),

/***/ "./node_modules/hoist-non-react-statics/node_modules/react-is/index.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/hoist-non-react-statics/node_modules/react-is/index.js ***!
  \*****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


if (false) {} else {
  module.exports = __webpack_require__(/*! ./cjs/react-is.development.js */ "./node_modules/hoist-non-react-statics/node_modules/react-is/cjs/react-is.development.js");
}


/***/ }),

/***/ "./node_modules/memoize-one/dist/memoize-one.esm.js":
/*!**********************************************************!*\
  !*** ./node_modules/memoize-one/dist/memoize-one.esm.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ memoizeOne)
/* harmony export */ });
var safeIsNaN = Number.isNaN ||
    function ponyfill(value) {
        return typeof value === 'number' && value !== value;
    };
function isEqual(first, second) {
    if (first === second) {
        return true;
    }
    if (safeIsNaN(first) && safeIsNaN(second)) {
        return true;
    }
    return false;
}
function areInputsEqual(newInputs, lastInputs) {
    if (newInputs.length !== lastInputs.length) {
        return false;
    }
    for (var i = 0; i < newInputs.length; i++) {
        if (!isEqual(newInputs[i], lastInputs[i])) {
            return false;
        }
    }
    return true;
}

function memoizeOne(resultFn, isEqual) {
    if (isEqual === void 0) { isEqual = areInputsEqual; }
    var cache = null;
    function memoized() {
        var newArgs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            newArgs[_i] = arguments[_i];
        }
        if (cache && cache.lastThis === this && isEqual(newArgs, cache.lastArgs)) {
            return cache.lastResult;
        }
        var lastResult = resultFn.apply(this, newArgs);
        cache = {
            lastResult: lastResult,
            lastArgs: newArgs,
            lastThis: this,
        };
        return lastResult;
    }
    memoized.clear = function clear() {
        cache = null;
    };
    return memoized;
}




/***/ }),

/***/ "./src/components/background-selector-control/editor.scss":
/*!****************************************************************!*\
  !*** ./src/components/background-selector-control/editor.scss ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/components/button-toggle-control/editor.scss":
/*!**********************************************************!*\
  !*** ./src/components/button-toggle-control/editor.scss ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/components/control-panel-control/editor.scss":
/*!**********************************************************!*\
  !*** ./src/components/control-panel-control/editor.scss ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/components/toogle-group-control/editor.scss":
/*!*********************************************************!*\
  !*** ./src/components/toogle-group-control/editor.scss ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/components/typography/editor.scss":
/*!***********************************************!*\
  !*** ./src/components/typography/editor.scss ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/editor.scss":
/*!*************************!*\
  !*** ./src/editor.scss ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/style.scss":
/*!************************!*\
  !*** ./src/style.scss ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/object-assign/index.js":
/*!*********************************************!*\
  !*** ./node_modules/object-assign/index.js ***!
  \*********************************************/
/***/ ((module) => {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),

/***/ "./node_modules/prop-types/checkPropTypes.js":
/*!***************************************************!*\
  !*** ./node_modules/prop-types/checkPropTypes.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var printWarning = function() {};

if (true) {
  var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "./node_modules/prop-types/lib/ReactPropTypesSecret.js");
  var loggedTypeFailures = {};
  var has = __webpack_require__(/*! ./lib/has */ "./node_modules/prop-types/lib/has.js");

  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) { /**/ }
  };
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (true) {
    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error(
              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' +
              'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.'
            );
            err.name = 'Invariant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning(
            (componentName || 'React class') + ': type specification of ' +
            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
            'You may have forgotten to pass an argument to the type checker ' +
            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
            'shape all require an argument).'
          );
        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          printWarning(
            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
          );
        }
      }
    }
  }
}

/**
 * Resets warning cache when testing.
 *
 * @private
 */
checkPropTypes.resetWarningCache = function() {
  if (true) {
    loggedTypeFailures = {};
  }
}

module.exports = checkPropTypes;


/***/ }),

/***/ "./node_modules/prop-types/factoryWithTypeCheckers.js":
/*!************************************************************!*\
  !*** ./node_modules/prop-types/factoryWithTypeCheckers.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactIs = __webpack_require__(/*! react-is */ "./node_modules/prop-types/node_modules/react-is/index.js");
var assign = __webpack_require__(/*! object-assign */ "./node_modules/object-assign/index.js");

var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "./node_modules/prop-types/lib/ReactPropTypesSecret.js");
var has = __webpack_require__(/*! ./lib/has */ "./node_modules/prop-types/lib/has.js");
var checkPropTypes = __webpack_require__(/*! ./checkPropTypes */ "./node_modules/prop-types/checkPropTypes.js");

var printWarning = function() {};

if (true) {
  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

function emptyFunctionThatReturnsNull() {
  return null;
}

module.exports = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bigint: createPrimitiveTypeChecker('bigint'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    elementType: createElementTypeTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message, data) {
    this.message = message;
    this.data = data && typeof data === 'object' ? data: {};
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (true) {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          var err = new Error(
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
          err.name = 'Invariant Violation';
          throw err;
        } else if ( true && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            printWarning(
              'You are manually calling a React.PropTypes validation ' +
              'function for the `' + propFullName + '` prop on `' + componentName + '`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError(
          'Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'),
          {expectedType: expectedType}
        );
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!ReactIs.isValidElementType(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      if (true) {
        if (arguments.length > 1) {
          printWarning(
            'Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' +
            'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).'
          );
        } else {
          printWarning('Invalid argument supplied to oneOf, expected an array.');
        }
      }
      return emptyFunctionThatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
        var type = getPreciseType(value);
        if (type === 'symbol') {
          return String(value);
        }
        return value;
      });
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (has(propValue, key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
       true ? printWarning('Invalid argument supplied to oneOfType, expected an instance of array.') : 0;
      return emptyFunctionThatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        printWarning(
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
        );
        return emptyFunctionThatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      var expectedTypes = [];
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        var checkerResult = checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret);
        if (checkerResult == null) {
          return null;
        }
        if (checkerResult.data && has(checkerResult.data, 'expectedType')) {
          expectedTypes.push(checkerResult.data.expectedType);
        }
      }
      var expectedTypesMessage = (expectedTypes.length > 0) ? ', expected one of type [' + expectedTypes.join(', ') + ']': '';
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`' + expectedTypesMessage + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function invalidValidatorError(componentName, location, propFullName, key, type) {
    return new PropTypeError(
      (componentName || 'React class') + ': ' + location + ' type `' + propFullName + '.' + key + '` is invalid; ' +
      'it must be a function, usually from the `prop-types` package, but received `' + type + '`.'
    );
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (typeof checker !== 'function') {
          return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from props.
      var allKeys = assign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (has(shapeTypes, key) && typeof checker !== 'function') {
          return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
        }
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' + JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // falsy value can't be a Symbol
    if (!propValue) {
      return false;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),

/***/ "./node_modules/prop-types/index.js":
/*!******************************************!*\
  !*** ./node_modules/prop-types/index.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (true) {
  var ReactIs = __webpack_require__(/*! react-is */ "./node_modules/prop-types/node_modules/react-is/index.js");

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = __webpack_require__(/*! ./factoryWithTypeCheckers */ "./node_modules/prop-types/factoryWithTypeCheckers.js")(ReactIs.isElement, throwOnDirectAccess);
} else {}


/***/ }),

/***/ "./node_modules/prop-types/lib/ReactPropTypesSecret.js":
/*!*************************************************************!*\
  !*** ./node_modules/prop-types/lib/ReactPropTypesSecret.js ***!
  \*************************************************************/
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),

/***/ "./node_modules/prop-types/lib/has.js":
/*!********************************************!*\
  !*** ./node_modules/prop-types/lib/has.js ***!
  \********************************************/
/***/ ((module) => {

module.exports = Function.call.bind(Object.prototype.hasOwnProperty);


/***/ }),

/***/ "./node_modules/prop-types/node_modules/react-is/cjs/react-is.development.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/prop-types/node_modules/react-is/cjs/react-is.development.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */





if (true) {
  (function() {
'use strict';

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
// (unstable) APIs that have been removed. Can we remove the symbols?

var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

function isValidElementType(type) {
  return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
}

function typeOf(object) {
  if (typeof object === 'object' && object !== null) {
    var $$typeof = object.$$typeof;

    switch ($$typeof) {
      case REACT_ELEMENT_TYPE:
        var type = object.type;

        switch (type) {
          case REACT_ASYNC_MODE_TYPE:
          case REACT_CONCURRENT_MODE_TYPE:
          case REACT_FRAGMENT_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_SUSPENSE_TYPE:
            return type;

          default:
            var $$typeofType = type && type.$$typeof;

            switch ($$typeofType) {
              case REACT_CONTEXT_TYPE:
              case REACT_FORWARD_REF_TYPE:
              case REACT_LAZY_TYPE:
              case REACT_MEMO_TYPE:
              case REACT_PROVIDER_TYPE:
                return $$typeofType;

              default:
                return $$typeof;
            }

        }

      case REACT_PORTAL_TYPE:
        return $$typeof;
    }
  }

  return undefined;
} // AsyncMode is deprecated along with isAsyncMode

var AsyncMode = REACT_ASYNC_MODE_TYPE;
var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
var ContextConsumer = REACT_CONTEXT_TYPE;
var ContextProvider = REACT_PROVIDER_TYPE;
var Element = REACT_ELEMENT_TYPE;
var ForwardRef = REACT_FORWARD_REF_TYPE;
var Fragment = REACT_FRAGMENT_TYPE;
var Lazy = REACT_LAZY_TYPE;
var Memo = REACT_MEMO_TYPE;
var Portal = REACT_PORTAL_TYPE;
var Profiler = REACT_PROFILER_TYPE;
var StrictMode = REACT_STRICT_MODE_TYPE;
var Suspense = REACT_SUSPENSE_TYPE;
var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

function isAsyncMode(object) {
  {
    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
      hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

      console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
    }
  }

  return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
}
function isConcurrentMode(object) {
  return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
}
function isContextConsumer(object) {
  return typeOf(object) === REACT_CONTEXT_TYPE;
}
function isContextProvider(object) {
  return typeOf(object) === REACT_PROVIDER_TYPE;
}
function isElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}
function isForwardRef(object) {
  return typeOf(object) === REACT_FORWARD_REF_TYPE;
}
function isFragment(object) {
  return typeOf(object) === REACT_FRAGMENT_TYPE;
}
function isLazy(object) {
  return typeOf(object) === REACT_LAZY_TYPE;
}
function isMemo(object) {
  return typeOf(object) === REACT_MEMO_TYPE;
}
function isPortal(object) {
  return typeOf(object) === REACT_PORTAL_TYPE;
}
function isProfiler(object) {
  return typeOf(object) === REACT_PROFILER_TYPE;
}
function isStrictMode(object) {
  return typeOf(object) === REACT_STRICT_MODE_TYPE;
}
function isSuspense(object) {
  return typeOf(object) === REACT_SUSPENSE_TYPE;
}

exports.AsyncMode = AsyncMode;
exports.ConcurrentMode = ConcurrentMode;
exports.ContextConsumer = ContextConsumer;
exports.ContextProvider = ContextProvider;
exports.Element = Element;
exports.ForwardRef = ForwardRef;
exports.Fragment = Fragment;
exports.Lazy = Lazy;
exports.Memo = Memo;
exports.Portal = Portal;
exports.Profiler = Profiler;
exports.StrictMode = StrictMode;
exports.Suspense = Suspense;
exports.isAsyncMode = isAsyncMode;
exports.isConcurrentMode = isConcurrentMode;
exports.isContextConsumer = isContextConsumer;
exports.isContextProvider = isContextProvider;
exports.isElement = isElement;
exports.isForwardRef = isForwardRef;
exports.isFragment = isFragment;
exports.isLazy = isLazy;
exports.isMemo = isMemo;
exports.isPortal = isPortal;
exports.isProfiler = isProfiler;
exports.isStrictMode = isStrictMode;
exports.isSuspense = isSuspense;
exports.isValidElementType = isValidElementType;
exports.typeOf = typeOf;
  })();
}


/***/ }),

/***/ "./node_modules/prop-types/node_modules/react-is/index.js":
/*!****************************************************************!*\
  !*** ./node_modules/prop-types/node_modules/react-is/index.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


if (false) {} else {
  module.exports = __webpack_require__(/*! ./cjs/react-is.development.js */ "./node_modules/prop-types/node_modules/react-is/cjs/react-is.development.js");
}


/***/ }),

/***/ "./node_modules/react-select/dist/Select-49a62830.esm.js":
/*!***************************************************************!*\
  !*** ./node_modules/react-select/dist/Select-49a62830.esm.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   S: () => (/* binding */ Select),
/* harmony export */   a: () => (/* binding */ defaultProps),
/* harmony export */   b: () => (/* binding */ getOptionLabel$1),
/* harmony export */   c: () => (/* binding */ createFilter),
/* harmony export */   d: () => (/* binding */ defaultTheme),
/* harmony export */   g: () => (/* binding */ getOptionValue$1),
/* harmony export */   m: () => (/* binding */ mergeStyles)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/objectSpread2 */ "./node_modules/@babel/runtime/helpers/esm/objectSpread2.js");
/* harmony import */ var _babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_esm_createSuper__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/esm/createSuper */ "./node_modules/@babel/runtime/helpers/esm/createSuper.js");
/* harmony import */ var _babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/esm/toConsumableArray */ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./index-a301f526.esm.js */ "./node_modules/react-select/dist/index-a301f526.esm.js");
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @emotion/react */ "./node_modules/@emotion/react/dist/emotion-react.browser.esm.js");
/* harmony import */ var memoize_one__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! memoize-one */ "./node_modules/memoize-one/dist/memoize-one.esm.js");
/* harmony import */ var _babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @babel/runtime/helpers/esm/objectWithoutProperties */ "./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js");














function _EMOTION_STRINGIFIED_CSS_ERROR__$2() { return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop)."; }

// Assistive text to describe visual elements. Hidden for sighted users.
var _ref =  false ? 0 : {
  name: "1f43avz-a11yText-A11yText",
  styles: "label:a11yText;z-index:9999;border:0;clip:rect(1px, 1px, 1px, 1px);height:1px;width:1px;position:absolute;overflow:hidden;padding:0;white-space:nowrap;label:A11yText;",
  map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkExMXlUZXh0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFNSSIsImZpbGUiOiJBMTF5VGV4dC50c3giLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGpzeCBqc3ggKi9cbmltcG9ydCB7IGpzeCB9IGZyb20gJ0BlbW90aW9uL3JlYWN0JztcblxuLy8gQXNzaXN0aXZlIHRleHQgdG8gZGVzY3JpYmUgdmlzdWFsIGVsZW1lbnRzLiBIaWRkZW4gZm9yIHNpZ2h0ZWQgdXNlcnMuXG5jb25zdCBBMTF5VGV4dCA9IChwcm9wczogSlNYLkludHJpbnNpY0VsZW1lbnRzWydzcGFuJ10pID0+IChcbiAgPHNwYW5cbiAgICBjc3M9e3tcbiAgICAgIGxhYmVsOiAnYTExeVRleHQnLFxuICAgICAgekluZGV4OiA5OTk5LFxuICAgICAgYm9yZGVyOiAwLFxuICAgICAgY2xpcDogJ3JlY3QoMXB4LCAxcHgsIDFweCwgMXB4KScsXG4gICAgICBoZWlnaHQ6IDEsXG4gICAgICB3aWR0aDogMSxcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgcGFkZGluZzogMCxcbiAgICAgIHdoaXRlU3BhY2U6ICdub3dyYXAnLFxuICAgIH19XG4gICAgey4uLnByb3BzfVxuICAvPlxuKTtcblxuZXhwb3J0IGRlZmF1bHQgQTExeVRleHQ7XG4iXX0= */",
  toString: _EMOTION_STRINGIFIED_CSS_ERROR__$2
};
var A11yText = function A11yText(props) {
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    css: _ref
  }, props));
};
var A11yText$1 = A11yText;

var defaultAriaLiveMessages = {
  guidance: function guidance(props) {
    var isSearchable = props.isSearchable,
      isMulti = props.isMulti,
      tabSelectsValue = props.tabSelectsValue,
      context = props.context,
      isInitialFocus = props.isInitialFocus;
    switch (context) {
      case 'menu':
        return "Use Up and Down to choose options, press Enter to select the currently focused option, press Escape to exit the menu".concat(tabSelectsValue ? ', press Tab to select the option and exit the menu' : '', ".");
      case 'input':
        return isInitialFocus ? "".concat(props['aria-label'] || 'Select', " is focused ").concat(isSearchable ? ',type to refine list' : '', ", press Down to open the menu, ").concat(isMulti ? ' press left to focus selected values' : '') : '';
      case 'value':
        return 'Use left and right to toggle between focused values, press Backspace to remove the currently focused value';
      default:
        return '';
    }
  },
  onChange: function onChange(props) {
    var action = props.action,
      _props$label = props.label,
      label = _props$label === void 0 ? '' : _props$label,
      labels = props.labels,
      isDisabled = props.isDisabled;
    switch (action) {
      case 'deselect-option':
      case 'pop-value':
      case 'remove-value':
        return "option ".concat(label, ", deselected.");
      case 'clear':
        return 'All selected options have been cleared.';
      case 'initial-input-focus':
        return "option".concat(labels.length > 1 ? 's' : '', " ").concat(labels.join(','), ", selected.");
      case 'select-option':
        return isDisabled ? "option ".concat(label, " is disabled. Select another option.") : "option ".concat(label, ", selected.");
      default:
        return '';
    }
  },
  onFocus: function onFocus(props) {
    var context = props.context,
      focused = props.focused,
      options = props.options,
      _props$label2 = props.label,
      label = _props$label2 === void 0 ? '' : _props$label2,
      selectValue = props.selectValue,
      isDisabled = props.isDisabled,
      isSelected = props.isSelected,
      isAppleDevice = props.isAppleDevice;
    var getArrayIndex = function getArrayIndex(arr, item) {
      return arr && arr.length ? "".concat(arr.indexOf(item) + 1, " of ").concat(arr.length) : '';
    };
    if (context === 'value' && selectValue) {
      return "value ".concat(label, " focused, ").concat(getArrayIndex(selectValue, focused), ".");
    }
    if (context === 'menu' && isAppleDevice) {
      var disabled = isDisabled ? ' disabled' : '';
      var status = "".concat(isSelected ? ' selected' : '').concat(disabled);
      return "".concat(label).concat(status, ", ").concat(getArrayIndex(options, focused), ".");
    }
    return '';
  },
  onFilter: function onFilter(props) {
    var inputValue = props.inputValue,
      resultsMessage = props.resultsMessage;
    return "".concat(resultsMessage).concat(inputValue ? ' for search term ' + inputValue : '', ".");
  }
};

var LiveRegion = function LiveRegion(props) {
  var ariaSelection = props.ariaSelection,
    focusedOption = props.focusedOption,
    focusedValue = props.focusedValue,
    focusableOptions = props.focusableOptions,
    isFocused = props.isFocused,
    selectValue = props.selectValue,
    selectProps = props.selectProps,
    id = props.id,
    isAppleDevice = props.isAppleDevice;
  var ariaLiveMessages = selectProps.ariaLiveMessages,
    getOptionLabel = selectProps.getOptionLabel,
    inputValue = selectProps.inputValue,
    isMulti = selectProps.isMulti,
    isOptionDisabled = selectProps.isOptionDisabled,
    isSearchable = selectProps.isSearchable,
    menuIsOpen = selectProps.menuIsOpen,
    options = selectProps.options,
    screenReaderStatus = selectProps.screenReaderStatus,
    tabSelectsValue = selectProps.tabSelectsValue,
    isLoading = selectProps.isLoading;
  var ariaLabel = selectProps['aria-label'];
  var ariaLive = selectProps['aria-live'];

  // Update aria live message configuration when prop changes
  var messages = (0,react__WEBPACK_IMPORTED_MODULE_7__.useMemo)(function () {
    return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_1__["default"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_1__["default"])({}, defaultAriaLiveMessages), ariaLiveMessages || {});
  }, [ariaLiveMessages]);

  // Update aria live selected option when prop changes
  var ariaSelected = (0,react__WEBPACK_IMPORTED_MODULE_7__.useMemo)(function () {
    var message = '';
    if (ariaSelection && messages.onChange) {
      var option = ariaSelection.option,
        selectedOptions = ariaSelection.options,
        removedValue = ariaSelection.removedValue,
        removedValues = ariaSelection.removedValues,
        value = ariaSelection.value;
      // select-option when !isMulti does not return option so we assume selected option is value
      var asOption = function asOption(val) {
        return !Array.isArray(val) ? val : null;
      };

      // If there is just one item from the action then get its label
      var selected = removedValue || option || asOption(value);
      var label = selected ? getOptionLabel(selected) : '';

      // If there are multiple items from the action then return an array of labels
      var multiSelected = selectedOptions || removedValues || undefined;
      var labels = multiSelected ? multiSelected.map(getOptionLabel) : [];
      var onChangeProps = (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_1__["default"])({
        // multiSelected items are usually items that have already been selected
        // or set by the user as a default value so we assume they are not disabled
        isDisabled: selected && isOptionDisabled(selected, selectValue),
        label: label,
        labels: labels
      }, ariaSelection);
      message = messages.onChange(onChangeProps);
    }
    return message;
  }, [ariaSelection, messages, isOptionDisabled, selectValue, getOptionLabel]);
  var ariaFocused = (0,react__WEBPACK_IMPORTED_MODULE_7__.useMemo)(function () {
    var focusMsg = '';
    var focused = focusedOption || focusedValue;
    var isSelected = !!(focusedOption && selectValue && selectValue.includes(focusedOption));
    if (focused && messages.onFocus) {
      var onFocusProps = {
        focused: focused,
        label: getOptionLabel(focused),
        isDisabled: isOptionDisabled(focused, selectValue),
        isSelected: isSelected,
        options: focusableOptions,
        context: focused === focusedOption ? 'menu' : 'value',
        selectValue: selectValue,
        isAppleDevice: isAppleDevice
      };
      focusMsg = messages.onFocus(onFocusProps);
    }
    return focusMsg;
  }, [focusedOption, focusedValue, getOptionLabel, isOptionDisabled, messages, focusableOptions, selectValue, isAppleDevice]);
  var ariaResults = (0,react__WEBPACK_IMPORTED_MODULE_7__.useMemo)(function () {
    var resultsMsg = '';
    if (menuIsOpen && options.length && !isLoading && messages.onFilter) {
      var resultsMessage = screenReaderStatus({
        count: focusableOptions.length
      });
      resultsMsg = messages.onFilter({
        inputValue: inputValue,
        resultsMessage: resultsMessage
      });
    }
    return resultsMsg;
  }, [focusableOptions, inputValue, menuIsOpen, messages, options, screenReaderStatus, isLoading]);
  var isInitialFocus = (ariaSelection === null || ariaSelection === void 0 ? void 0 : ariaSelection.action) === 'initial-input-focus';
  var ariaGuidance = (0,react__WEBPACK_IMPORTED_MODULE_7__.useMemo)(function () {
    var guidanceMsg = '';
    if (messages.guidance) {
      var context = focusedValue ? 'value' : menuIsOpen ? 'menu' : 'input';
      guidanceMsg = messages.guidance({
        'aria-label': ariaLabel,
        context: context,
        isDisabled: focusedOption && isOptionDisabled(focusedOption, selectValue),
        isMulti: isMulti,
        isSearchable: isSearchable,
        tabSelectsValue: tabSelectsValue,
        isInitialFocus: isInitialFocus
      });
    }
    return guidanceMsg;
  }, [ariaLabel, focusedOption, focusedValue, isMulti, isOptionDisabled, isSearchable, menuIsOpen, messages, selectValue, tabSelectsValue, isInitialFocus]);
  var ScreenReaderText = (0,_emotion_react__WEBPACK_IMPORTED_MODULE_9__.jsx)(react__WEBPACK_IMPORTED_MODULE_7__.Fragment, null, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
    id: "aria-selection"
  }, ariaSelected), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
    id: "aria-focused"
  }, ariaFocused), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
    id: "aria-results"
  }, ariaResults), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
    id: "aria-guidance"
  }, ariaGuidance));
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_9__.jsx)(react__WEBPACK_IMPORTED_MODULE_7__.Fragment, null, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_9__.jsx)(A11yText$1, {
    id: id
  }, isInitialFocus && ScreenReaderText), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_9__.jsx)(A11yText$1, {
    "aria-live": ariaLive,
    "aria-atomic": "false",
    "aria-relevant": "additions text",
    role: "log"
  }, isFocused && !isInitialFocus && ScreenReaderText));
};
var LiveRegion$1 = LiveRegion;

var diacritics = [{
  base: 'A',
  letters: "A\u24B6\uFF21\xC0\xC1\xC2\u1EA6\u1EA4\u1EAA\u1EA8\xC3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\xC4\u01DE\u1EA2\xC5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F"
}, {
  base: 'AA',
  letters: "\uA732"
}, {
  base: 'AE',
  letters: "\xC6\u01FC\u01E2"
}, {
  base: 'AO',
  letters: "\uA734"
}, {
  base: 'AU',
  letters: "\uA736"
}, {
  base: 'AV',
  letters: "\uA738\uA73A"
}, {
  base: 'AY',
  letters: "\uA73C"
}, {
  base: 'B',
  letters: "B\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181"
}, {
  base: 'C',
  letters: "C\u24B8\uFF23\u0106\u0108\u010A\u010C\xC7\u1E08\u0187\u023B\uA73E"
}, {
  base: 'D',
  letters: "D\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779"
}, {
  base: 'DZ',
  letters: "\u01F1\u01C4"
}, {
  base: 'Dz',
  letters: "\u01F2\u01C5"
}, {
  base: 'E',
  letters: "E\u24BA\uFF25\xC8\xC9\xCA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\xCB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E"
}, {
  base: 'F',
  letters: "F\u24BB\uFF26\u1E1E\u0191\uA77B"
}, {
  base: 'G',
  letters: "G\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E"
}, {
  base: 'H',
  letters: "H\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D"
}, {
  base: 'I',
  letters: "I\u24BE\uFF29\xCC\xCD\xCE\u0128\u012A\u012C\u0130\xCF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197"
}, {
  base: 'J',
  letters: "J\u24BF\uFF2A\u0134\u0248"
}, {
  base: 'K',
  letters: "K\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2"
}, {
  base: 'L',
  letters: "L\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780"
}, {
  base: 'LJ',
  letters: "\u01C7"
}, {
  base: 'Lj',
  letters: "\u01C8"
}, {
  base: 'M',
  letters: "M\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C"
}, {
  base: 'N',
  letters: "N\u24C3\uFF2E\u01F8\u0143\xD1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4"
}, {
  base: 'NJ',
  letters: "\u01CA"
}, {
  base: 'Nj',
  letters: "\u01CB"
}, {
  base: 'O',
  letters: "O\u24C4\uFF2F\xD2\xD3\xD4\u1ED2\u1ED0\u1ED6\u1ED4\xD5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\xD6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\xD8\u01FE\u0186\u019F\uA74A\uA74C"
}, {
  base: 'OI',
  letters: "\u01A2"
}, {
  base: 'OO',
  letters: "\uA74E"
}, {
  base: 'OU',
  letters: "\u0222"
}, {
  base: 'P',
  letters: "P\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754"
}, {
  base: 'Q',
  letters: "Q\u24C6\uFF31\uA756\uA758\u024A"
}, {
  base: 'R',
  letters: "R\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782"
}, {
  base: 'S',
  letters: "S\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784"
}, {
  base: 'T',
  letters: "T\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786"
}, {
  base: 'TZ',
  letters: "\uA728"
}, {
  base: 'U',
  letters: "U\u24CA\uFF35\xD9\xDA\xDB\u0168\u1E78\u016A\u1E7A\u016C\xDC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244"
}, {
  base: 'V',
  letters: "V\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245"
}, {
  base: 'VY',
  letters: "\uA760"
}, {
  base: 'W',
  letters: "W\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72"
}, {
  base: 'X',
  letters: "X\u24CD\uFF38\u1E8A\u1E8C"
}, {
  base: 'Y',
  letters: "Y\u24CE\uFF39\u1EF2\xDD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE"
}, {
  base: 'Z',
  letters: "Z\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762"
}, {
  base: 'a',
  letters: "a\u24D0\uFF41\u1E9A\xE0\xE1\xE2\u1EA7\u1EA5\u1EAB\u1EA9\xE3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\xE4\u01DF\u1EA3\xE5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250"
}, {
  base: 'aa',
  letters: "\uA733"
}, {
  base: 'ae',
  letters: "\xE6\u01FD\u01E3"
}, {
  base: 'ao',
  letters: "\uA735"
}, {
  base: 'au',
  letters: "\uA737"
}, {
  base: 'av',
  letters: "\uA739\uA73B"
}, {
  base: 'ay',
  letters: "\uA73D"
}, {
  base: 'b',
  letters: "b\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253"
}, {
  base: 'c',
  letters: "c\u24D2\uFF43\u0107\u0109\u010B\u010D\xE7\u1E09\u0188\u023C\uA73F\u2184"
}, {
  base: 'd',
  letters: "d\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A"
}, {
  base: 'dz',
  letters: "\u01F3\u01C6"
}, {
  base: 'e',
  letters: "e\u24D4\uFF45\xE8\xE9\xEA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\xEB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD"
}, {
  base: 'f',
  letters: "f\u24D5\uFF46\u1E1F\u0192\uA77C"
}, {
  base: 'g',
  letters: "g\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F"
}, {
  base: 'h',
  letters: "h\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265"
}, {
  base: 'hv',
  letters: "\u0195"
}, {
  base: 'i',
  letters: "i\u24D8\uFF49\xEC\xED\xEE\u0129\u012B\u012D\xEF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131"
}, {
  base: 'j',
  letters: "j\u24D9\uFF4A\u0135\u01F0\u0249"
}, {
  base: 'k',
  letters: "k\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3"
}, {
  base: 'l',
  letters: "l\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747"
}, {
  base: 'lj',
  letters: "\u01C9"
}, {
  base: 'm',
  letters: "m\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F"
}, {
  base: 'n',
  letters: "n\u24DD\uFF4E\u01F9\u0144\xF1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5"
}, {
  base: 'nj',
  letters: "\u01CC"
}, {
  base: 'o',
  letters: "o\u24DE\uFF4F\xF2\xF3\xF4\u1ED3\u1ED1\u1ED7\u1ED5\xF5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\xF6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\xF8\u01FF\u0254\uA74B\uA74D\u0275"
}, {
  base: 'oi',
  letters: "\u01A3"
}, {
  base: 'ou',
  letters: "\u0223"
}, {
  base: 'oo',
  letters: "\uA74F"
}, {
  base: 'p',
  letters: "p\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755"
}, {
  base: 'q',
  letters: "q\u24E0\uFF51\u024B\uA757\uA759"
}, {
  base: 'r',
  letters: "r\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783"
}, {
  base: 's',
  letters: "s\u24E2\uFF53\xDF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B"
}, {
  base: 't',
  letters: "t\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787"
}, {
  base: 'tz',
  letters: "\uA729"
}, {
  base: 'u',
  letters: "u\u24E4\uFF55\xF9\xFA\xFB\u0169\u1E79\u016B\u1E7B\u016D\xFC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289"
}, {
  base: 'v',
  letters: "v\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C"
}, {
  base: 'vy',
  letters: "\uA761"
}, {
  base: 'w',
  letters: "w\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73"
}, {
  base: 'x',
  letters: "x\u24E7\uFF58\u1E8B\u1E8D"
}, {
  base: 'y',
  letters: "y\u24E8\uFF59\u1EF3\xFD\u0177\u1EF9\u0233\u1E8F\xFF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF"
}, {
  base: 'z',
  letters: "z\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763"
}];
var anyDiacritic = new RegExp('[' + diacritics.map(function (d) {
  return d.letters;
}).join('') + ']', 'g');
var diacriticToBase = {};
for (var i = 0; i < diacritics.length; i++) {
  var diacritic = diacritics[i];
  for (var j = 0; j < diacritic.letters.length; j++) {
    diacriticToBase[diacritic.letters[j]] = diacritic.base;
  }
}
var stripDiacritics = function stripDiacritics(str) {
  return str.replace(anyDiacritic, function (match) {
    return diacriticToBase[match];
  });
};

var memoizedStripDiacriticsForInput = (0,memoize_one__WEBPACK_IMPORTED_MODULE_10__["default"])(stripDiacritics);
var trimString = function trimString(str) {
  return str.replace(/^\s+|\s+$/g, '');
};
var defaultStringify = function defaultStringify(option) {
  return "".concat(option.label, " ").concat(option.value);
};
var createFilter = function createFilter(config) {
  return function (option, rawInput) {
    // eslint-disable-next-line no-underscore-dangle
    if (option.data.__isNew__) return true;
    var _ignoreCase$ignoreAcc = (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_1__["default"])({
        ignoreCase: true,
        ignoreAccents: true,
        stringify: defaultStringify,
        trim: true,
        matchFrom: 'any'
      }, config),
      ignoreCase = _ignoreCase$ignoreAcc.ignoreCase,
      ignoreAccents = _ignoreCase$ignoreAcc.ignoreAccents,
      stringify = _ignoreCase$ignoreAcc.stringify,
      trim = _ignoreCase$ignoreAcc.trim,
      matchFrom = _ignoreCase$ignoreAcc.matchFrom;
    var input = trim ? trimString(rawInput) : rawInput;
    var candidate = trim ? trimString(stringify(option)) : stringify(option);
    if (ignoreCase) {
      input = input.toLowerCase();
      candidate = candidate.toLowerCase();
    }
    if (ignoreAccents) {
      input = memoizedStripDiacriticsForInput(input);
      candidate = stripDiacritics(candidate);
    }
    return matchFrom === 'start' ? candidate.substr(0, input.length) === input : candidate.indexOf(input) > -1;
  };
};

var _excluded = ["innerRef"];
function DummyInput(_ref) {
  var innerRef = _ref.innerRef,
    props = (0,_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_8__["default"])(_ref, _excluded);
  // Remove animation props not meant for HTML elements
  var filteredProps = (0,_index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.r)(props, 'onExited', 'in', 'enter', 'exit', 'appear');
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_9__.jsx)("input", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    ref: innerRef
  }, filteredProps, {
    css: /*#__PURE__*/(0,_emotion_react__WEBPACK_IMPORTED_MODULE_9__.css)({
      label: 'dummyInput',
      // get rid of any default styles
      background: 0,
      border: 0,
      // important! this hides the flashing cursor
      caretColor: 'transparent',
      fontSize: 'inherit',
      gridArea: '1 / 1 / 2 / 3',
      outline: 0,
      padding: 0,
      // important! without `width` browsers won't allow focus
      width: 1,
      // remove cursor on desktop
      color: 'transparent',
      // remove cursor on mobile whilst maintaining "scroll into view" behaviour
      left: -100,
      opacity: 0,
      position: 'relative',
      transform: 'scale(.01)'
    },  false ? 0 : ";label:DummyInput;",  false ? 0 : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkR1bW15SW5wdXQudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQXlCTSIsImZpbGUiOiJEdW1teUlucHV0LnRzeCIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAanN4IGpzeCAqL1xuaW1wb3J0IHsgUmVmIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsganN4IH0gZnJvbSAnQGVtb3Rpb24vcmVhY3QnO1xuaW1wb3J0IHsgcmVtb3ZlUHJvcHMgfSBmcm9tICcuLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIER1bW15SW5wdXQoe1xuICBpbm5lclJlZixcbiAgLi4ucHJvcHNcbn06IEpTWC5JbnRyaW5zaWNFbGVtZW50c1snaW5wdXQnXSAmIHtcbiAgcmVhZG9ubHkgaW5uZXJSZWY6IFJlZjxIVE1MSW5wdXRFbGVtZW50Pjtcbn0pIHtcbiAgLy8gUmVtb3ZlIGFuaW1hdGlvbiBwcm9wcyBub3QgbWVhbnQgZm9yIEhUTUwgZWxlbWVudHNcbiAgY29uc3QgZmlsdGVyZWRQcm9wcyA9IHJlbW92ZVByb3BzKFxuICAgIHByb3BzLFxuICAgICdvbkV4aXRlZCcsXG4gICAgJ2luJyxcbiAgICAnZW50ZXInLFxuICAgICdleGl0JyxcbiAgICAnYXBwZWFyJ1xuICApO1xuXG4gIHJldHVybiAoXG4gICAgPGlucHV0XG4gICAgICByZWY9e2lubmVyUmVmfVxuICAgICAgey4uLmZpbHRlcmVkUHJvcHN9XG4gICAgICBjc3M9e3tcbiAgICAgICAgbGFiZWw6ICdkdW1teUlucHV0JyxcbiAgICAgICAgLy8gZ2V0IHJpZCBvZiBhbnkgZGVmYXVsdCBzdHlsZXNcbiAgICAgICAgYmFja2dyb3VuZDogMCxcbiAgICAgICAgYm9yZGVyOiAwLFxuICAgICAgICAvLyBpbXBvcnRhbnQhIHRoaXMgaGlkZXMgdGhlIGZsYXNoaW5nIGN1cnNvclxuICAgICAgICBjYXJldENvbG9yOiAndHJhbnNwYXJlbnQnLFxuICAgICAgICBmb250U2l6ZTogJ2luaGVyaXQnLFxuICAgICAgICBncmlkQXJlYTogJzEgLyAxIC8gMiAvIDMnLFxuICAgICAgICBvdXRsaW5lOiAwLFxuICAgICAgICBwYWRkaW5nOiAwLFxuICAgICAgICAvLyBpbXBvcnRhbnQhIHdpdGhvdXQgYHdpZHRoYCBicm93c2VycyB3b24ndCBhbGxvdyBmb2N1c1xuICAgICAgICB3aWR0aDogMSxcblxuICAgICAgICAvLyByZW1vdmUgY3Vyc29yIG9uIGRlc2t0b3BcbiAgICAgICAgY29sb3I6ICd0cmFuc3BhcmVudCcsXG5cbiAgICAgICAgLy8gcmVtb3ZlIGN1cnNvciBvbiBtb2JpbGUgd2hpbHN0IG1haW50YWluaW5nIFwic2Nyb2xsIGludG8gdmlld1wiIGJlaGF2aW91clxuICAgICAgICBsZWZ0OiAtMTAwLFxuICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoLjAxKScsXG4gICAgICB9fVxuICAgIC8+XG4gICk7XG59XG4iXX0= */")
  }));
}

var cancelScroll = function cancelScroll(event) {
  if (event.cancelable) event.preventDefault();
  event.stopPropagation();
};
function useScrollCapture(_ref) {
  var isEnabled = _ref.isEnabled,
    onBottomArrive = _ref.onBottomArrive,
    onBottomLeave = _ref.onBottomLeave,
    onTopArrive = _ref.onTopArrive,
    onTopLeave = _ref.onTopLeave;
  var isBottom = (0,react__WEBPACK_IMPORTED_MODULE_7__.useRef)(false);
  var isTop = (0,react__WEBPACK_IMPORTED_MODULE_7__.useRef)(false);
  var touchStart = (0,react__WEBPACK_IMPORTED_MODULE_7__.useRef)(0);
  var scrollTarget = (0,react__WEBPACK_IMPORTED_MODULE_7__.useRef)(null);
  var handleEventDelta = (0,react__WEBPACK_IMPORTED_MODULE_7__.useCallback)(function (event, delta) {
    if (scrollTarget.current === null) return;
    var _scrollTarget$current = scrollTarget.current,
      scrollTop = _scrollTarget$current.scrollTop,
      scrollHeight = _scrollTarget$current.scrollHeight,
      clientHeight = _scrollTarget$current.clientHeight;
    var target = scrollTarget.current;
    var isDeltaPositive = delta > 0;
    var availableScroll = scrollHeight - clientHeight - scrollTop;
    var shouldCancelScroll = false;

    // reset bottom/top flags
    if (availableScroll > delta && isBottom.current) {
      if (onBottomLeave) onBottomLeave(event);
      isBottom.current = false;
    }
    if (isDeltaPositive && isTop.current) {
      if (onTopLeave) onTopLeave(event);
      isTop.current = false;
    }

    // bottom limit
    if (isDeltaPositive && delta > availableScroll) {
      if (onBottomArrive && !isBottom.current) {
        onBottomArrive(event);
      }
      target.scrollTop = scrollHeight;
      shouldCancelScroll = true;
      isBottom.current = true;

      // top limit
    } else if (!isDeltaPositive && -delta > scrollTop) {
      if (onTopArrive && !isTop.current) {
        onTopArrive(event);
      }
      target.scrollTop = 0;
      shouldCancelScroll = true;
      isTop.current = true;
    }

    // cancel scroll
    if (shouldCancelScroll) {
      cancelScroll(event);
    }
  }, [onBottomArrive, onBottomLeave, onTopArrive, onTopLeave]);
  var onWheel = (0,react__WEBPACK_IMPORTED_MODULE_7__.useCallback)(function (event) {
    handleEventDelta(event, event.deltaY);
  }, [handleEventDelta]);
  var onTouchStart = (0,react__WEBPACK_IMPORTED_MODULE_7__.useCallback)(function (event) {
    // set touch start so we can calculate touchmove delta
    touchStart.current = event.changedTouches[0].clientY;
  }, []);
  var onTouchMove = (0,react__WEBPACK_IMPORTED_MODULE_7__.useCallback)(function (event) {
    var deltaY = touchStart.current - event.changedTouches[0].clientY;
    handleEventDelta(event, deltaY);
  }, [handleEventDelta]);
  var startListening = (0,react__WEBPACK_IMPORTED_MODULE_7__.useCallback)(function (el) {
    // bail early if no element is available to attach to
    if (!el) return;
    var notPassive = _index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.s ? {
      passive: false
    } : false;
    el.addEventListener('wheel', onWheel, notPassive);
    el.addEventListener('touchstart', onTouchStart, notPassive);
    el.addEventListener('touchmove', onTouchMove, notPassive);
  }, [onTouchMove, onTouchStart, onWheel]);
  var stopListening = (0,react__WEBPACK_IMPORTED_MODULE_7__.useCallback)(function (el) {
    // bail early if no element is available to detach from
    if (!el) return;
    el.removeEventListener('wheel', onWheel, false);
    el.removeEventListener('touchstart', onTouchStart, false);
    el.removeEventListener('touchmove', onTouchMove, false);
  }, [onTouchMove, onTouchStart, onWheel]);
  (0,react__WEBPACK_IMPORTED_MODULE_7__.useEffect)(function () {
    if (!isEnabled) return;
    var element = scrollTarget.current;
    startListening(element);
    return function () {
      stopListening(element);
    };
  }, [isEnabled, startListening, stopListening]);
  return function (element) {
    scrollTarget.current = element;
  };
}

var STYLE_KEYS = ['boxSizing', 'height', 'overflow', 'paddingRight', 'position'];
var LOCK_STYLES = {
  boxSizing: 'border-box',
  // account for possible declaration `width: 100%;` on body
  overflow: 'hidden',
  position: 'relative',
  height: '100%'
};
function preventTouchMove(e) {
  e.preventDefault();
}
function allowTouchMove(e) {
  e.stopPropagation();
}
function preventInertiaScroll() {
  var top = this.scrollTop;
  var totalScroll = this.scrollHeight;
  var currentScroll = top + this.offsetHeight;
  if (top === 0) {
    this.scrollTop = 1;
  } else if (currentScroll === totalScroll) {
    this.scrollTop = top - 1;
  }
}

// `ontouchstart` check works on most browsers
// `maxTouchPoints` works on IE10/11 and Surface
function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints;
}
var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
var activeScrollLocks = 0;
var listenerOptions = {
  capture: false,
  passive: false
};
function useScrollLock(_ref) {
  var isEnabled = _ref.isEnabled,
    _ref$accountForScroll = _ref.accountForScrollbars,
    accountForScrollbars = _ref$accountForScroll === void 0 ? true : _ref$accountForScroll;
  var originalStyles = (0,react__WEBPACK_IMPORTED_MODULE_7__.useRef)({});
  var scrollTarget = (0,react__WEBPACK_IMPORTED_MODULE_7__.useRef)(null);
  var addScrollLock = (0,react__WEBPACK_IMPORTED_MODULE_7__.useCallback)(function (touchScrollTarget) {
    if (!canUseDOM) return;
    var target = document.body;
    var targetStyle = target && target.style;
    if (accountForScrollbars) {
      // store any styles already applied to the body
      STYLE_KEYS.forEach(function (key) {
        var val = targetStyle && targetStyle[key];
        originalStyles.current[key] = val;
      });
    }

    // apply the lock styles and padding if this is the first scroll lock
    if (accountForScrollbars && activeScrollLocks < 1) {
      var currentPadding = parseInt(originalStyles.current.paddingRight, 10) || 0;
      var clientWidth = document.body ? document.body.clientWidth : 0;
      var adjustedPadding = window.innerWidth - clientWidth + currentPadding || 0;
      Object.keys(LOCK_STYLES).forEach(function (key) {
        var val = LOCK_STYLES[key];
        if (targetStyle) {
          targetStyle[key] = val;
        }
      });
      if (targetStyle) {
        targetStyle.paddingRight = "".concat(adjustedPadding, "px");
      }
    }

    // account for touch devices
    if (target && isTouchDevice()) {
      // Mobile Safari ignores { overflow: hidden } declaration on the body.
      target.addEventListener('touchmove', preventTouchMove, listenerOptions);

      // Allow scroll on provided target
      if (touchScrollTarget) {
        touchScrollTarget.addEventListener('touchstart', preventInertiaScroll, listenerOptions);
        touchScrollTarget.addEventListener('touchmove', allowTouchMove, listenerOptions);
      }
    }

    // increment active scroll locks
    activeScrollLocks += 1;
  }, [accountForScrollbars]);
  var removeScrollLock = (0,react__WEBPACK_IMPORTED_MODULE_7__.useCallback)(function (touchScrollTarget) {
    if (!canUseDOM) return;
    var target = document.body;
    var targetStyle = target && target.style;

    // safely decrement active scroll locks
    activeScrollLocks = Math.max(activeScrollLocks - 1, 0);

    // reapply original body styles, if any
    if (accountForScrollbars && activeScrollLocks < 1) {
      STYLE_KEYS.forEach(function (key) {
        var val = originalStyles.current[key];
        if (targetStyle) {
          targetStyle[key] = val;
        }
      });
    }

    // remove touch listeners
    if (target && isTouchDevice()) {
      target.removeEventListener('touchmove', preventTouchMove, listenerOptions);
      if (touchScrollTarget) {
        touchScrollTarget.removeEventListener('touchstart', preventInertiaScroll, listenerOptions);
        touchScrollTarget.removeEventListener('touchmove', allowTouchMove, listenerOptions);
      }
    }
  }, [accountForScrollbars]);
  (0,react__WEBPACK_IMPORTED_MODULE_7__.useEffect)(function () {
    if (!isEnabled) return;
    var element = scrollTarget.current;
    addScrollLock(element);
    return function () {
      removeScrollLock(element);
    };
  }, [isEnabled, addScrollLock, removeScrollLock]);
  return function (element) {
    scrollTarget.current = element;
  };
}

function _EMOTION_STRINGIFIED_CSS_ERROR__$1() { return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop)."; }
var blurSelectInput = function blurSelectInput(event) {
  var element = event.target;
  return element.ownerDocument.activeElement && element.ownerDocument.activeElement.blur();
};
var _ref2$1 =  false ? 0 : {
  name: "bp8cua-ScrollManager",
  styles: "position:fixed;left:0;bottom:0;right:0;top:0;label:ScrollManager;",
  map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNjcm9sbE1hbmFnZXIudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQW9EVSIsImZpbGUiOiJTY3JvbGxNYW5hZ2VyLnRzeCIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAanN4IGpzeCAqL1xuaW1wb3J0IHsganN4IH0gZnJvbSAnQGVtb3Rpb24vcmVhY3QnO1xuaW1wb3J0IHsgRnJhZ21lbnQsIFJlYWN0RWxlbWVudCwgUmVmQ2FsbGJhY2ssIE1vdXNlRXZlbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgdXNlU2Nyb2xsQ2FwdHVyZSBmcm9tICcuL3VzZVNjcm9sbENhcHR1cmUnO1xuaW1wb3J0IHVzZVNjcm9sbExvY2sgZnJvbSAnLi91c2VTY3JvbGxMb2NrJztcblxuaW50ZXJmYWNlIFByb3BzIHtcbiAgcmVhZG9ubHkgY2hpbGRyZW46IChyZWY6IFJlZkNhbGxiYWNrPEhUTUxFbGVtZW50PikgPT4gUmVhY3RFbGVtZW50O1xuICByZWFkb25seSBsb2NrRW5hYmxlZDogYm9vbGVhbjtcbiAgcmVhZG9ubHkgY2FwdHVyZUVuYWJsZWQ6IGJvb2xlYW47XG4gIHJlYWRvbmx5IG9uQm90dG9tQXJyaXZlPzogKGV2ZW50OiBXaGVlbEV2ZW50IHwgVG91Y2hFdmVudCkgPT4gdm9pZDtcbiAgcmVhZG9ubHkgb25Cb3R0b21MZWF2ZT86IChldmVudDogV2hlZWxFdmVudCB8IFRvdWNoRXZlbnQpID0+IHZvaWQ7XG4gIHJlYWRvbmx5IG9uVG9wQXJyaXZlPzogKGV2ZW50OiBXaGVlbEV2ZW50IHwgVG91Y2hFdmVudCkgPT4gdm9pZDtcbiAgcmVhZG9ubHkgb25Ub3BMZWF2ZT86IChldmVudDogV2hlZWxFdmVudCB8IFRvdWNoRXZlbnQpID0+IHZvaWQ7XG59XG5cbmNvbnN0IGJsdXJTZWxlY3RJbnB1dCA9IChldmVudDogTW91c2VFdmVudDxIVE1MRGl2RWxlbWVudD4pID0+IHtcbiAgY29uc3QgZWxlbWVudCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRGl2RWxlbWVudDtcbiAgcmV0dXJuIChcbiAgICBlbGVtZW50Lm93bmVyRG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJlxuICAgIChlbGVtZW50Lm93bmVyRG9jdW1lbnQuYWN0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudCkuYmx1cigpXG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTY3JvbGxNYW5hZ2VyKHtcbiAgY2hpbGRyZW4sXG4gIGxvY2tFbmFibGVkLFxuICBjYXB0dXJlRW5hYmxlZCA9IHRydWUsXG4gIG9uQm90dG9tQXJyaXZlLFxuICBvbkJvdHRvbUxlYXZlLFxuICBvblRvcEFycml2ZSxcbiAgb25Ub3BMZWF2ZSxcbn06IFByb3BzKSB7XG4gIGNvbnN0IHNldFNjcm9sbENhcHR1cmVUYXJnZXQgPSB1c2VTY3JvbGxDYXB0dXJlKHtcbiAgICBpc0VuYWJsZWQ6IGNhcHR1cmVFbmFibGVkLFxuICAgIG9uQm90dG9tQXJyaXZlLFxuICAgIG9uQm90dG9tTGVhdmUsXG4gICAgb25Ub3BBcnJpdmUsXG4gICAgb25Ub3BMZWF2ZSxcbiAgfSk7XG4gIGNvbnN0IHNldFNjcm9sbExvY2tUYXJnZXQgPSB1c2VTY3JvbGxMb2NrKHsgaXNFbmFibGVkOiBsb2NrRW5hYmxlZCB9KTtcblxuICBjb25zdCB0YXJnZXRSZWY6IFJlZkNhbGxiYWNrPEhUTUxFbGVtZW50PiA9IChlbGVtZW50KSA9PiB7XG4gICAgc2V0U2Nyb2xsQ2FwdHVyZVRhcmdldChlbGVtZW50KTtcbiAgICBzZXRTY3JvbGxMb2NrVGFyZ2V0KGVsZW1lbnQpO1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPEZyYWdtZW50PlxuICAgICAge2xvY2tFbmFibGVkICYmIChcbiAgICAgICAgPGRpdlxuICAgICAgICAgIG9uQ2xpY2s9e2JsdXJTZWxlY3RJbnB1dH1cbiAgICAgICAgICBjc3M9e3sgcG9zaXRpb246ICdmaXhlZCcsIGxlZnQ6IDAsIGJvdHRvbTogMCwgcmlnaHQ6IDAsIHRvcDogMCB9fVxuICAgICAgICAvPlxuICAgICAgKX1cbiAgICAgIHtjaGlsZHJlbih0YXJnZXRSZWYpfVxuICAgIDwvRnJhZ21lbnQ+XG4gICk7XG59XG4iXX0= */",
  toString: _EMOTION_STRINGIFIED_CSS_ERROR__$1
};
function ScrollManager(_ref) {
  var children = _ref.children,
    lockEnabled = _ref.lockEnabled,
    _ref$captureEnabled = _ref.captureEnabled,
    captureEnabled = _ref$captureEnabled === void 0 ? true : _ref$captureEnabled,
    onBottomArrive = _ref.onBottomArrive,
    onBottomLeave = _ref.onBottomLeave,
    onTopArrive = _ref.onTopArrive,
    onTopLeave = _ref.onTopLeave;
  var setScrollCaptureTarget = useScrollCapture({
    isEnabled: captureEnabled,
    onBottomArrive: onBottomArrive,
    onBottomLeave: onBottomLeave,
    onTopArrive: onTopArrive,
    onTopLeave: onTopLeave
  });
  var setScrollLockTarget = useScrollLock({
    isEnabled: lockEnabled
  });
  var targetRef = function targetRef(element) {
    setScrollCaptureTarget(element);
    setScrollLockTarget(element);
  };
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_9__.jsx)(react__WEBPACK_IMPORTED_MODULE_7__.Fragment, null, lockEnabled && (0,_emotion_react__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
    onClick: blurSelectInput,
    css: _ref2$1
  }), children(targetRef));
}

function _EMOTION_STRINGIFIED_CSS_ERROR__() { return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop)."; }
var _ref2 =  false ? 0 : {
  name: "5kkxb2-requiredInput-RequiredInput",
  styles: "label:requiredInput;opacity:0;pointer-events:none;position:absolute;bottom:0;left:0;right:0;width:100%;label:RequiredInput;",
  map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlJlcXVpcmVkSW5wdXQudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQWNJIiwiZmlsZSI6IlJlcXVpcmVkSW5wdXQudHN4Iiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBqc3gganN4ICovXG5pbXBvcnQgeyBGb2N1c0V2ZW50SGFuZGxlciwgRnVuY3Rpb25Db21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBqc3ggfSBmcm9tICdAZW1vdGlvbi9yZWFjdCc7XG5cbmNvbnN0IFJlcXVpcmVkSW5wdXQ6IEZ1bmN0aW9uQ29tcG9uZW50PHtcbiAgcmVhZG9ubHkgbmFtZT86IHN0cmluZztcbiAgcmVhZG9ubHkgb25Gb2N1czogRm9jdXNFdmVudEhhbmRsZXI8SFRNTElucHV0RWxlbWVudD47XG59PiA9ICh7IG5hbWUsIG9uRm9jdXMgfSkgPT4gKFxuICA8aW5wdXRcbiAgICByZXF1aXJlZFxuICAgIG5hbWU9e25hbWV9XG4gICAgdGFiSW5kZXg9ey0xfVxuICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgb25Gb2N1cz17b25Gb2N1c31cbiAgICBjc3M9e3tcbiAgICAgIGxhYmVsOiAncmVxdWlyZWRJbnB1dCcsXG4gICAgICBvcGFjaXR5OiAwLFxuICAgICAgcG9pbnRlckV2ZW50czogJ25vbmUnLFxuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICBib3R0b206IDAsXG4gICAgICBsZWZ0OiAwLFxuICAgICAgcmlnaHQ6IDAsXG4gICAgICB3aWR0aDogJzEwMCUnLFxuICAgIH19XG4gICAgLy8gUHJldmVudCBgU3dpdGNoaW5nIGZyb20gdW5jb250cm9sbGVkIHRvIGNvbnRyb2xsZWRgIGVycm9yXG4gICAgdmFsdWU9XCJcIlxuICAgIG9uQ2hhbmdlPXsoKSA9PiB7fX1cbiAgLz5cbik7XG5cbmV4cG9ydCBkZWZhdWx0IFJlcXVpcmVkSW5wdXQ7XG4iXX0= */",
  toString: _EMOTION_STRINGIFIED_CSS_ERROR__
};
var RequiredInput = function RequiredInput(_ref) {
  var name = _ref.name,
    onFocus = _ref.onFocus;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_9__.jsx)("input", {
    required: true,
    name: name,
    tabIndex: -1,
    "aria-hidden": "true",
    onFocus: onFocus,
    css: _ref2
    // Prevent `Switching from uncontrolled to controlled` error
    ,
    value: "",
    onChange: function onChange() {}
  });
};
var RequiredInput$1 = RequiredInput;

/// <reference types="user-agent-data-types" />

function testPlatform(re) {
  var _window$navigator$use;
  return typeof window !== 'undefined' && window.navigator != null ? re.test(((_window$navigator$use = window.navigator['userAgentData']) === null || _window$navigator$use === void 0 ? void 0 : _window$navigator$use.platform) || window.navigator.platform) : false;
}
function isIPhone() {
  return testPlatform(/^iPhone/i);
}
function isMac() {
  return testPlatform(/^Mac/i);
}
function isIPad() {
  return testPlatform(/^iPad/i) ||
  // iPadOS 13 lies and says it's a Mac, but we can distinguish by detecting touch support.
  isMac() && navigator.maxTouchPoints > 1;
}
function isIOS() {
  return isIPhone() || isIPad();
}
function isAppleDevice() {
  return isMac() || isIOS();
}

var formatGroupLabel = function formatGroupLabel(group) {
  return group.label;
};
var getOptionLabel$1 = function getOptionLabel(option) {
  return option.label;
};
var getOptionValue$1 = function getOptionValue(option) {
  return option.value;
};
var isOptionDisabled = function isOptionDisabled(option) {
  return !!option.isDisabled;
};

var defaultStyles = {
  clearIndicator: _index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.a,
  container: _index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.b,
  control: _index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.d,
  dropdownIndicator: _index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.e,
  group: _index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.g,
  groupHeading: _index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.f,
  indicatorsContainer: _index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.i,
  indicatorSeparator: _index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.h,
  input: _index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.j,
  loadingIndicator: _index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.l,
  loadingMessage: _index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.k,
  menu: _index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.m,
  menuList: _index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.n,
  menuPortal: _index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.o,
  multiValue: _index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.p,
  multiValueLabel: _index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.q,
  multiValueRemove: _index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.t,
  noOptionsMessage: _index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.u,
  option: _index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.v,
  placeholder: _index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.w,
  singleValue: _index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.x,
  valueContainer: _index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.y
};
// Merge Utility
// Allows consumers to extend a base Select with additional styles

function mergeStyles(source) {
  var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  // initialize with source styles
  var styles = (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_1__["default"])({}, source);

  // massage in target styles
  Object.keys(target).forEach(function (keyAsString) {
    var key = keyAsString;
    if (source[key]) {
      styles[key] = function (rsCss, props) {
        return target[key](source[key](rsCss, props), props);
      };
    } else {
      styles[key] = target[key];
    }
  });
  return styles;
}

var colors = {
  primary: '#2684FF',
  primary75: '#4C9AFF',
  primary50: '#B2D4FF',
  primary25: '#DEEBFF',
  danger: '#DE350B',
  dangerLight: '#FFBDAD',
  neutral0: 'hsl(0, 0%, 100%)',
  neutral5: 'hsl(0, 0%, 95%)',
  neutral10: 'hsl(0, 0%, 90%)',
  neutral20: 'hsl(0, 0%, 80%)',
  neutral30: 'hsl(0, 0%, 70%)',
  neutral40: 'hsl(0, 0%, 60%)',
  neutral50: 'hsl(0, 0%, 50%)',
  neutral60: 'hsl(0, 0%, 40%)',
  neutral70: 'hsl(0, 0%, 30%)',
  neutral80: 'hsl(0, 0%, 20%)',
  neutral90: 'hsl(0, 0%, 10%)'
};
var borderRadius = 4;
// Used to calculate consistent margin/padding on elements
var baseUnit = 4;
// The minimum height of the control
var controlHeight = 38;
// The amount of space between the control and menu */
var menuGutter = baseUnit * 2;
var spacing = {
  baseUnit: baseUnit,
  controlHeight: controlHeight,
  menuGutter: menuGutter
};
var defaultTheme = {
  borderRadius: borderRadius,
  colors: colors,
  spacing: spacing
};

var defaultProps = {
  'aria-live': 'polite',
  backspaceRemovesValue: true,
  blurInputOnSelect: (0,_index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.z)(),
  captureMenuScroll: !(0,_index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.z)(),
  classNames: {},
  closeMenuOnSelect: true,
  closeMenuOnScroll: false,
  components: {},
  controlShouldRenderValue: true,
  escapeClearsValue: false,
  filterOption: createFilter(),
  formatGroupLabel: formatGroupLabel,
  getOptionLabel: getOptionLabel$1,
  getOptionValue: getOptionValue$1,
  isDisabled: false,
  isLoading: false,
  isMulti: false,
  isRtl: false,
  isSearchable: true,
  isOptionDisabled: isOptionDisabled,
  loadingMessage: function loadingMessage() {
    return 'Loading...';
  },
  maxMenuHeight: 300,
  minMenuHeight: 140,
  menuIsOpen: false,
  menuPlacement: 'bottom',
  menuPosition: 'absolute',
  menuShouldBlockScroll: false,
  menuShouldScrollIntoView: !(0,_index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.A)(),
  noOptionsMessage: function noOptionsMessage() {
    return 'No options';
  },
  openMenuOnFocus: false,
  openMenuOnClick: true,
  options: [],
  pageSize: 5,
  placeholder: 'Select...',
  screenReaderStatus: function screenReaderStatus(_ref) {
    var count = _ref.count;
    return "".concat(count, " result").concat(count !== 1 ? 's' : '', " available");
  },
  styles: {},
  tabIndex: 0,
  tabSelectsValue: true,
  unstyled: false
};
function toCategorizedOption(props, option, selectValue, index) {
  var isDisabled = _isOptionDisabled(props, option, selectValue);
  var isSelected = _isOptionSelected(props, option, selectValue);
  var label = getOptionLabel(props, option);
  var value = getOptionValue(props, option);
  return {
    type: 'option',
    data: option,
    isDisabled: isDisabled,
    isSelected: isSelected,
    label: label,
    value: value,
    index: index
  };
}
function buildCategorizedOptions(props, selectValue) {
  return props.options.map(function (groupOrOption, groupOrOptionIndex) {
    if ('options' in groupOrOption) {
      var categorizedOptions = groupOrOption.options.map(function (option, optionIndex) {
        return toCategorizedOption(props, option, selectValue, optionIndex);
      }).filter(function (categorizedOption) {
        return isFocusable(props, categorizedOption);
      });
      return categorizedOptions.length > 0 ? {
        type: 'group',
        data: groupOrOption,
        options: categorizedOptions,
        index: groupOrOptionIndex
      } : undefined;
    }
    var categorizedOption = toCategorizedOption(props, groupOrOption, selectValue, groupOrOptionIndex);
    return isFocusable(props, categorizedOption) ? categorizedOption : undefined;
  }).filter(_index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.K);
}
function buildFocusableOptionsFromCategorizedOptions(categorizedOptions) {
  return categorizedOptions.reduce(function (optionsAccumulator, categorizedOption) {
    if (categorizedOption.type === 'group') {
      optionsAccumulator.push.apply(optionsAccumulator, (0,_babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_6__["default"])(categorizedOption.options.map(function (option) {
        return option.data;
      })));
    } else {
      optionsAccumulator.push(categorizedOption.data);
    }
    return optionsAccumulator;
  }, []);
}
function buildFocusableOptionsWithIds(categorizedOptions, optionId) {
  return categorizedOptions.reduce(function (optionsAccumulator, categorizedOption) {
    if (categorizedOption.type === 'group') {
      optionsAccumulator.push.apply(optionsAccumulator, (0,_babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_6__["default"])(categorizedOption.options.map(function (option) {
        return {
          data: option.data,
          id: "".concat(optionId, "-").concat(categorizedOption.index, "-").concat(option.index)
        };
      })));
    } else {
      optionsAccumulator.push({
        data: categorizedOption.data,
        id: "".concat(optionId, "-").concat(categorizedOption.index)
      });
    }
    return optionsAccumulator;
  }, []);
}
function buildFocusableOptions(props, selectValue) {
  return buildFocusableOptionsFromCategorizedOptions(buildCategorizedOptions(props, selectValue));
}
function isFocusable(props, categorizedOption) {
  var _props$inputValue = props.inputValue,
    inputValue = _props$inputValue === void 0 ? '' : _props$inputValue;
  var data = categorizedOption.data,
    isSelected = categorizedOption.isSelected,
    label = categorizedOption.label,
    value = categorizedOption.value;
  return (!shouldHideSelectedOptions(props) || !isSelected) && _filterOption(props, {
    label: label,
    value: value,
    data: data
  }, inputValue);
}
function getNextFocusedValue(state, nextSelectValue) {
  var focusedValue = state.focusedValue,
    lastSelectValue = state.selectValue;
  var lastFocusedIndex = lastSelectValue.indexOf(focusedValue);
  if (lastFocusedIndex > -1) {
    var nextFocusedIndex = nextSelectValue.indexOf(focusedValue);
    if (nextFocusedIndex > -1) {
      // the focused value is still in the selectValue, return it
      return focusedValue;
    } else if (lastFocusedIndex < nextSelectValue.length) {
      // the focusedValue is not present in the next selectValue array by
      // reference, so return the new value at the same index
      return nextSelectValue[lastFocusedIndex];
    }
  }
  return null;
}
function getNextFocusedOption(state, options) {
  var lastFocusedOption = state.focusedOption;
  return lastFocusedOption && options.indexOf(lastFocusedOption) > -1 ? lastFocusedOption : options[0];
}
var getFocusedOptionId = function getFocusedOptionId(focusableOptionsWithIds, focusedOption) {
  var _focusableOptionsWith;
  var focusedOptionId = (_focusableOptionsWith = focusableOptionsWithIds.find(function (option) {
    return option.data === focusedOption;
  })) === null || _focusableOptionsWith === void 0 ? void 0 : _focusableOptionsWith.id;
  return focusedOptionId || null;
};
var getOptionLabel = function getOptionLabel(props, data) {
  return props.getOptionLabel(data);
};
var getOptionValue = function getOptionValue(props, data) {
  return props.getOptionValue(data);
};
function _isOptionDisabled(props, option, selectValue) {
  return typeof props.isOptionDisabled === 'function' ? props.isOptionDisabled(option, selectValue) : false;
}
function _isOptionSelected(props, option, selectValue) {
  if (selectValue.indexOf(option) > -1) return true;
  if (typeof props.isOptionSelected === 'function') {
    return props.isOptionSelected(option, selectValue);
  }
  var candidate = getOptionValue(props, option);
  return selectValue.some(function (i) {
    return getOptionValue(props, i) === candidate;
  });
}
function _filterOption(props, option, inputValue) {
  return props.filterOption ? props.filterOption(option, inputValue) : true;
}
var shouldHideSelectedOptions = function shouldHideSelectedOptions(props) {
  var hideSelectedOptions = props.hideSelectedOptions,
    isMulti = props.isMulti;
  if (hideSelectedOptions === undefined) return isMulti;
  return hideSelectedOptions;
};
var instanceId = 1;
var Select = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(Select, _Component);
  var _super = (0,_babel_runtime_helpers_esm_createSuper__WEBPACK_IMPORTED_MODULE_5__["default"])(Select);
  // Misc. Instance Properties
  // ------------------------------

  // TODO

  // Refs
  // ------------------------------

  // Lifecycle
  // ------------------------------

  function Select(_props) {
    var _this;
    (0,_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, Select);
    _this = _super.call(this, _props);
    _this.state = {
      ariaSelection: null,
      focusedOption: null,
      focusedOptionId: null,
      focusableOptionsWithIds: [],
      focusedValue: null,
      inputIsHidden: false,
      isFocused: false,
      selectValue: [],
      clearFocusValueOnUpdate: false,
      prevWasFocused: false,
      inputIsHiddenAfterUpdate: undefined,
      prevProps: undefined,
      instancePrefix: ''
    };
    _this.blockOptionHover = false;
    _this.isComposing = false;
    _this.commonProps = void 0;
    _this.initialTouchX = 0;
    _this.initialTouchY = 0;
    _this.openAfterFocus = false;
    _this.scrollToFocusedOptionOnUpdate = false;
    _this.userIsDragging = void 0;
    _this.isAppleDevice = isAppleDevice();
    _this.controlRef = null;
    _this.getControlRef = function (ref) {
      _this.controlRef = ref;
    };
    _this.focusedOptionRef = null;
    _this.getFocusedOptionRef = function (ref) {
      _this.focusedOptionRef = ref;
    };
    _this.menuListRef = null;
    _this.getMenuListRef = function (ref) {
      _this.menuListRef = ref;
    };
    _this.inputRef = null;
    _this.getInputRef = function (ref) {
      _this.inputRef = ref;
    };
    _this.focus = _this.focusInput;
    _this.blur = _this.blurInput;
    _this.onChange = function (newValue, actionMeta) {
      var _this$props = _this.props,
        onChange = _this$props.onChange,
        name = _this$props.name;
      actionMeta.name = name;
      _this.ariaOnChange(newValue, actionMeta);
      onChange(newValue, actionMeta);
    };
    _this.setValue = function (newValue, action, option) {
      var _this$props2 = _this.props,
        closeMenuOnSelect = _this$props2.closeMenuOnSelect,
        isMulti = _this$props2.isMulti,
        inputValue = _this$props2.inputValue;
      _this.onInputChange('', {
        action: 'set-value',
        prevInputValue: inputValue
      });
      if (closeMenuOnSelect) {
        _this.setState({
          inputIsHiddenAfterUpdate: !isMulti
        });
        _this.onMenuClose();
      }
      // when the select value should change, we should reset focusedValue
      _this.setState({
        clearFocusValueOnUpdate: true
      });
      _this.onChange(newValue, {
        action: action,
        option: option
      });
    };
    _this.selectOption = function (newValue) {
      var _this$props3 = _this.props,
        blurInputOnSelect = _this$props3.blurInputOnSelect,
        isMulti = _this$props3.isMulti,
        name = _this$props3.name;
      var selectValue = _this.state.selectValue;
      var deselected = isMulti && _this.isOptionSelected(newValue, selectValue);
      var isDisabled = _this.isOptionDisabled(newValue, selectValue);
      if (deselected) {
        var candidate = _this.getOptionValue(newValue);
        _this.setValue((0,_index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.B)(selectValue.filter(function (i) {
          return _this.getOptionValue(i) !== candidate;
        })), 'deselect-option', newValue);
      } else if (!isDisabled) {
        // Select option if option is not disabled
        if (isMulti) {
          _this.setValue((0,_index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.B)([].concat((0,_babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_6__["default"])(selectValue), [newValue])), 'select-option', newValue);
        } else {
          _this.setValue((0,_index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.C)(newValue), 'select-option');
        }
      } else {
        _this.ariaOnChange((0,_index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.C)(newValue), {
          action: 'select-option',
          option: newValue,
          name: name
        });
        return;
      }
      if (blurInputOnSelect) {
        _this.blurInput();
      }
    };
    _this.removeValue = function (removedValue) {
      var isMulti = _this.props.isMulti;
      var selectValue = _this.state.selectValue;
      var candidate = _this.getOptionValue(removedValue);
      var newValueArray = selectValue.filter(function (i) {
        return _this.getOptionValue(i) !== candidate;
      });
      var newValue = (0,_index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.D)(isMulti, newValueArray, newValueArray[0] || null);
      _this.onChange(newValue, {
        action: 'remove-value',
        removedValue: removedValue
      });
      _this.focusInput();
    };
    _this.clearValue = function () {
      var selectValue = _this.state.selectValue;
      _this.onChange((0,_index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.D)(_this.props.isMulti, [], null), {
        action: 'clear',
        removedValues: selectValue
      });
    };
    _this.popValue = function () {
      var isMulti = _this.props.isMulti;
      var selectValue = _this.state.selectValue;
      var lastSelectedValue = selectValue[selectValue.length - 1];
      var newValueArray = selectValue.slice(0, selectValue.length - 1);
      var newValue = (0,_index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.D)(isMulti, newValueArray, newValueArray[0] || null);
      _this.onChange(newValue, {
        action: 'pop-value',
        removedValue: lastSelectedValue
      });
    };
    _this.getFocusedOptionId = function (focusedOption) {
      return getFocusedOptionId(_this.state.focusableOptionsWithIds, focusedOption);
    };
    _this.getFocusableOptionsWithIds = function () {
      return buildFocusableOptionsWithIds(buildCategorizedOptions(_this.props, _this.state.selectValue), _this.getElementId('option'));
    };
    _this.getValue = function () {
      return _this.state.selectValue;
    };
    _this.cx = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return _index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.E.apply(void 0, [_this.props.classNamePrefix].concat(args));
    };
    _this.getOptionLabel = function (data) {
      return getOptionLabel(_this.props, data);
    };
    _this.getOptionValue = function (data) {
      return getOptionValue(_this.props, data);
    };
    _this.getStyles = function (key, props) {
      var unstyled = _this.props.unstyled;
      var base = defaultStyles[key](props, unstyled);
      base.boxSizing = 'border-box';
      var custom = _this.props.styles[key];
      return custom ? custom(base, props) : base;
    };
    _this.getClassNames = function (key, props) {
      var _this$props$className, _this$props$className2;
      return (_this$props$className = (_this$props$className2 = _this.props.classNames)[key]) === null || _this$props$className === void 0 ? void 0 : _this$props$className.call(_this$props$className2, props);
    };
    _this.getElementId = function (element) {
      return "".concat(_this.state.instancePrefix, "-").concat(element);
    };
    _this.getComponents = function () {
      return (0,_index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.F)(_this.props);
    };
    _this.buildCategorizedOptions = function () {
      return buildCategorizedOptions(_this.props, _this.state.selectValue);
    };
    _this.getCategorizedOptions = function () {
      return _this.props.menuIsOpen ? _this.buildCategorizedOptions() : [];
    };
    _this.buildFocusableOptions = function () {
      return buildFocusableOptionsFromCategorizedOptions(_this.buildCategorizedOptions());
    };
    _this.getFocusableOptions = function () {
      return _this.props.menuIsOpen ? _this.buildFocusableOptions() : [];
    };
    _this.ariaOnChange = function (value, actionMeta) {
      _this.setState({
        ariaSelection: (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_1__["default"])({
          value: value
        }, actionMeta)
      });
    };
    _this.onMenuMouseDown = function (event) {
      if (event.button !== 0) {
        return;
      }
      event.stopPropagation();
      event.preventDefault();
      _this.focusInput();
    };
    _this.onMenuMouseMove = function (event) {
      _this.blockOptionHover = false;
    };
    _this.onControlMouseDown = function (event) {
      // Event captured by dropdown indicator
      if (event.defaultPrevented) {
        return;
      }
      var openMenuOnClick = _this.props.openMenuOnClick;
      if (!_this.state.isFocused) {
        if (openMenuOnClick) {
          _this.openAfterFocus = true;
        }
        _this.focusInput();
      } else if (!_this.props.menuIsOpen) {
        if (openMenuOnClick) {
          _this.openMenu('first');
        }
      } else {
        if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
          _this.onMenuClose();
        }
      }
      if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
        event.preventDefault();
      }
    };
    _this.onDropdownIndicatorMouseDown = function (event) {
      // ignore mouse events that weren't triggered by the primary button
      if (event && event.type === 'mousedown' && event.button !== 0) {
        return;
      }
      if (_this.props.isDisabled) return;
      var _this$props4 = _this.props,
        isMulti = _this$props4.isMulti,
        menuIsOpen = _this$props4.menuIsOpen;
      _this.focusInput();
      if (menuIsOpen) {
        _this.setState({
          inputIsHiddenAfterUpdate: !isMulti
        });
        _this.onMenuClose();
      } else {
        _this.openMenu('first');
      }
      event.preventDefault();
    };
    _this.onClearIndicatorMouseDown = function (event) {
      // ignore mouse events that weren't triggered by the primary button
      if (event && event.type === 'mousedown' && event.button !== 0) {
        return;
      }
      _this.clearValue();
      event.preventDefault();
      _this.openAfterFocus = false;
      if (event.type === 'touchend') {
        _this.focusInput();
      } else {
        setTimeout(function () {
          return _this.focusInput();
        });
      }
    };
    _this.onScroll = function (event) {
      if (typeof _this.props.closeMenuOnScroll === 'boolean') {
        if (event.target instanceof HTMLElement && (0,_index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.G)(event.target)) {
          _this.props.onMenuClose();
        }
      } else if (typeof _this.props.closeMenuOnScroll === 'function') {
        if (_this.props.closeMenuOnScroll(event)) {
          _this.props.onMenuClose();
        }
      }
    };
    _this.onCompositionStart = function () {
      _this.isComposing = true;
    };
    _this.onCompositionEnd = function () {
      _this.isComposing = false;
    };
    _this.onTouchStart = function (_ref2) {
      var touches = _ref2.touches;
      var touch = touches && touches.item(0);
      if (!touch) {
        return;
      }
      _this.initialTouchX = touch.clientX;
      _this.initialTouchY = touch.clientY;
      _this.userIsDragging = false;
    };
    _this.onTouchMove = function (_ref3) {
      var touches = _ref3.touches;
      var touch = touches && touches.item(0);
      if (!touch) {
        return;
      }
      var deltaX = Math.abs(touch.clientX - _this.initialTouchX);
      var deltaY = Math.abs(touch.clientY - _this.initialTouchY);
      var moveThreshold = 5;
      _this.userIsDragging = deltaX > moveThreshold || deltaY > moveThreshold;
    };
    _this.onTouchEnd = function (event) {
      if (_this.userIsDragging) return;

      // close the menu if the user taps outside
      // we're checking on event.target here instead of event.currentTarget, because we want to assert information
      // on events on child elements, not the document (which we've attached this handler to).
      if (_this.controlRef && !_this.controlRef.contains(event.target) && _this.menuListRef && !_this.menuListRef.contains(event.target)) {
        _this.blurInput();
      }

      // reset move vars
      _this.initialTouchX = 0;
      _this.initialTouchY = 0;
    };
    _this.onControlTouchEnd = function (event) {
      if (_this.userIsDragging) return;
      _this.onControlMouseDown(event);
    };
    _this.onClearIndicatorTouchEnd = function (event) {
      if (_this.userIsDragging) return;
      _this.onClearIndicatorMouseDown(event);
    };
    _this.onDropdownIndicatorTouchEnd = function (event) {
      if (_this.userIsDragging) return;
      _this.onDropdownIndicatorMouseDown(event);
    };
    _this.handleInputChange = function (event) {
      var prevInputValue = _this.props.inputValue;
      var inputValue = event.currentTarget.value;
      _this.setState({
        inputIsHiddenAfterUpdate: false
      });
      _this.onInputChange(inputValue, {
        action: 'input-change',
        prevInputValue: prevInputValue
      });
      if (!_this.props.menuIsOpen) {
        _this.onMenuOpen();
      }
    };
    _this.onInputFocus = function (event) {
      if (_this.props.onFocus) {
        _this.props.onFocus(event);
      }
      _this.setState({
        inputIsHiddenAfterUpdate: false,
        isFocused: true
      });
      if (_this.openAfterFocus || _this.props.openMenuOnFocus) {
        _this.openMenu('first');
      }
      _this.openAfterFocus = false;
    };
    _this.onInputBlur = function (event) {
      var prevInputValue = _this.props.inputValue;
      if (_this.menuListRef && _this.menuListRef.contains(document.activeElement)) {
        _this.inputRef.focus();
        return;
      }
      if (_this.props.onBlur) {
        _this.props.onBlur(event);
      }
      _this.onInputChange('', {
        action: 'input-blur',
        prevInputValue: prevInputValue
      });
      _this.onMenuClose();
      _this.setState({
        focusedValue: null,
        isFocused: false
      });
    };
    _this.onOptionHover = function (focusedOption) {
      if (_this.blockOptionHover || _this.state.focusedOption === focusedOption) {
        return;
      }
      var options = _this.getFocusableOptions();
      var focusedOptionIndex = options.indexOf(focusedOption);
      _this.setState({
        focusedOption: focusedOption,
        focusedOptionId: focusedOptionIndex > -1 ? _this.getFocusedOptionId(focusedOption) : null
      });
    };
    _this.shouldHideSelectedOptions = function () {
      return shouldHideSelectedOptions(_this.props);
    };
    _this.onValueInputFocus = function (e) {
      e.preventDefault();
      e.stopPropagation();
      _this.focus();
    };
    _this.onKeyDown = function (event) {
      var _this$props5 = _this.props,
        isMulti = _this$props5.isMulti,
        backspaceRemovesValue = _this$props5.backspaceRemovesValue,
        escapeClearsValue = _this$props5.escapeClearsValue,
        inputValue = _this$props5.inputValue,
        isClearable = _this$props5.isClearable,
        isDisabled = _this$props5.isDisabled,
        menuIsOpen = _this$props5.menuIsOpen,
        onKeyDown = _this$props5.onKeyDown,
        tabSelectsValue = _this$props5.tabSelectsValue,
        openMenuOnFocus = _this$props5.openMenuOnFocus;
      var _this$state = _this.state,
        focusedOption = _this$state.focusedOption,
        focusedValue = _this$state.focusedValue,
        selectValue = _this$state.selectValue;
      if (isDisabled) return;
      if (typeof onKeyDown === 'function') {
        onKeyDown(event);
        if (event.defaultPrevented) {
          return;
        }
      }

      // Block option hover events when the user has just pressed a key
      _this.blockOptionHover = true;
      switch (event.key) {
        case 'ArrowLeft':
          if (!isMulti || inputValue) return;
          _this.focusValue('previous');
          break;
        case 'ArrowRight':
          if (!isMulti || inputValue) return;
          _this.focusValue('next');
          break;
        case 'Delete':
        case 'Backspace':
          if (inputValue) return;
          if (focusedValue) {
            _this.removeValue(focusedValue);
          } else {
            if (!backspaceRemovesValue) return;
            if (isMulti) {
              _this.popValue();
            } else if (isClearable) {
              _this.clearValue();
            }
          }
          break;
        case 'Tab':
          if (_this.isComposing) return;
          if (event.shiftKey || !menuIsOpen || !tabSelectsValue || !focusedOption ||
          // don't capture the event if the menu opens on focus and the focused
          // option is already selected; it breaks the flow of navigation
          openMenuOnFocus && _this.isOptionSelected(focusedOption, selectValue)) {
            return;
          }
          _this.selectOption(focusedOption);
          break;
        case 'Enter':
          if (event.keyCode === 229) {
            // ignore the keydown event from an Input Method Editor(IME)
            // ref. https://www.w3.org/TR/uievents/#determine-keydown-keyup-keyCode
            break;
          }
          if (menuIsOpen) {
            if (!focusedOption) return;
            if (_this.isComposing) return;
            _this.selectOption(focusedOption);
            break;
          }
          return;
        case 'Escape':
          if (menuIsOpen) {
            _this.setState({
              inputIsHiddenAfterUpdate: false
            });
            _this.onInputChange('', {
              action: 'menu-close',
              prevInputValue: inputValue
            });
            _this.onMenuClose();
          } else if (isClearable && escapeClearsValue) {
            _this.clearValue();
          }
          break;
        case ' ':
          // space
          if (inputValue) {
            return;
          }
          if (!menuIsOpen) {
            _this.openMenu('first');
            break;
          }
          if (!focusedOption) return;
          _this.selectOption(focusedOption);
          break;
        case 'ArrowUp':
          if (menuIsOpen) {
            _this.focusOption('up');
          } else {
            _this.openMenu('last');
          }
          break;
        case 'ArrowDown':
          if (menuIsOpen) {
            _this.focusOption('down');
          } else {
            _this.openMenu('first');
          }
          break;
        case 'PageUp':
          if (!menuIsOpen) return;
          _this.focusOption('pageup');
          break;
        case 'PageDown':
          if (!menuIsOpen) return;
          _this.focusOption('pagedown');
          break;
        case 'Home':
          if (!menuIsOpen) return;
          _this.focusOption('first');
          break;
        case 'End':
          if (!menuIsOpen) return;
          _this.focusOption('last');
          break;
        default:
          return;
      }
      event.preventDefault();
    };
    _this.state.instancePrefix = 'react-select-' + (_this.props.instanceId || ++instanceId);
    _this.state.selectValue = (0,_index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.H)(_props.value);
    // Set focusedOption if menuIsOpen is set on init (e.g. defaultMenuIsOpen)
    if (_props.menuIsOpen && _this.state.selectValue.length) {
      var focusableOptionsWithIds = _this.getFocusableOptionsWithIds();
      var focusableOptions = _this.buildFocusableOptions();
      var optionIndex = focusableOptions.indexOf(_this.state.selectValue[0]);
      _this.state.focusableOptionsWithIds = focusableOptionsWithIds;
      _this.state.focusedOption = focusableOptions[optionIndex];
      _this.state.focusedOptionId = getFocusedOptionId(focusableOptionsWithIds, focusableOptions[optionIndex]);
    }
    return _this;
  }
  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(Select, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.startListeningComposition();
      this.startListeningToTouch();
      if (this.props.closeMenuOnScroll && document && document.addEventListener) {
        // Listen to all scroll events, and filter them out inside of 'onScroll'
        document.addEventListener('scroll', this.onScroll, true);
      }
      if (this.props.autoFocus) {
        this.focusInput();
      }

      // Scroll focusedOption into view if menuIsOpen is set on mount (e.g. defaultMenuIsOpen)
      if (this.props.menuIsOpen && this.state.focusedOption && this.menuListRef && this.focusedOptionRef) {
        (0,_index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.I)(this.menuListRef, this.focusedOptionRef);
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this$props6 = this.props,
        isDisabled = _this$props6.isDisabled,
        menuIsOpen = _this$props6.menuIsOpen;
      var isFocused = this.state.isFocused;
      if (
      // ensure focus is restored correctly when the control becomes enabled
      isFocused && !isDisabled && prevProps.isDisabled ||
      // ensure focus is on the Input when the menu opens
      isFocused && menuIsOpen && !prevProps.menuIsOpen) {
        this.focusInput();
      }
      if (isFocused && isDisabled && !prevProps.isDisabled) {
        // ensure select state gets blurred in case Select is programmatically disabled while focused
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          isFocused: false
        }, this.onMenuClose);
      } else if (!isFocused && !isDisabled && prevProps.isDisabled && this.inputRef === document.activeElement) {
        // ensure select state gets focused in case Select is programatically re-enabled while focused (Firefox)
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          isFocused: true
        });
      }

      // scroll the focused option into view if necessary
      if (this.menuListRef && this.focusedOptionRef && this.scrollToFocusedOptionOnUpdate) {
        (0,_index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.I)(this.menuListRef, this.focusedOptionRef);
        this.scrollToFocusedOptionOnUpdate = false;
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.stopListeningComposition();
      this.stopListeningToTouch();
      document.removeEventListener('scroll', this.onScroll, true);
    }

    // ==============================
    // Consumer Handlers
    // ==============================
  }, {
    key: "onMenuOpen",
    value: function onMenuOpen() {
      this.props.onMenuOpen();
    }
  }, {
    key: "onMenuClose",
    value: function onMenuClose() {
      this.onInputChange('', {
        action: 'menu-close',
        prevInputValue: this.props.inputValue
      });
      this.props.onMenuClose();
    }
  }, {
    key: "onInputChange",
    value: function onInputChange(newValue, actionMeta) {
      this.props.onInputChange(newValue, actionMeta);
    }

    // ==============================
    // Methods
    // ==============================
  }, {
    key: "focusInput",
    value: function focusInput() {
      if (!this.inputRef) return;
      this.inputRef.focus();
    }
  }, {
    key: "blurInput",
    value: function blurInput() {
      if (!this.inputRef) return;
      this.inputRef.blur();
    }

    // aliased for consumers
  }, {
    key: "openMenu",
    value: function openMenu(focusOption) {
      var _this2 = this;
      var _this$state2 = this.state,
        selectValue = _this$state2.selectValue,
        isFocused = _this$state2.isFocused;
      var focusableOptions = this.buildFocusableOptions();
      var openAtIndex = focusOption === 'first' ? 0 : focusableOptions.length - 1;
      if (!this.props.isMulti) {
        var selectedIndex = focusableOptions.indexOf(selectValue[0]);
        if (selectedIndex > -1) {
          openAtIndex = selectedIndex;
        }
      }

      // only scroll if the menu isn't already open
      this.scrollToFocusedOptionOnUpdate = !(isFocused && this.menuListRef);
      this.setState({
        inputIsHiddenAfterUpdate: false,
        focusedValue: null,
        focusedOption: focusableOptions[openAtIndex],
        focusedOptionId: this.getFocusedOptionId(focusableOptions[openAtIndex])
      }, function () {
        return _this2.onMenuOpen();
      });
    }
  }, {
    key: "focusValue",
    value: function focusValue(direction) {
      var _this$state3 = this.state,
        selectValue = _this$state3.selectValue,
        focusedValue = _this$state3.focusedValue;

      // Only multiselects support value focusing
      if (!this.props.isMulti) return;
      this.setState({
        focusedOption: null
      });
      var focusedIndex = selectValue.indexOf(focusedValue);
      if (!focusedValue) {
        focusedIndex = -1;
      }
      var lastIndex = selectValue.length - 1;
      var nextFocus = -1;
      if (!selectValue.length) return;
      switch (direction) {
        case 'previous':
          if (focusedIndex === 0) {
            // don't cycle from the start to the end
            nextFocus = 0;
          } else if (focusedIndex === -1) {
            // if nothing is focused, focus the last value first
            nextFocus = lastIndex;
          } else {
            nextFocus = focusedIndex - 1;
          }
          break;
        case 'next':
          if (focusedIndex > -1 && focusedIndex < lastIndex) {
            nextFocus = focusedIndex + 1;
          }
          break;
      }
      this.setState({
        inputIsHidden: nextFocus !== -1,
        focusedValue: selectValue[nextFocus]
      });
    }
  }, {
    key: "focusOption",
    value: function focusOption() {
      var direction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'first';
      var pageSize = this.props.pageSize;
      var focusedOption = this.state.focusedOption;
      var options = this.getFocusableOptions();
      if (!options.length) return;
      var nextFocus = 0; // handles 'first'
      var focusedIndex = options.indexOf(focusedOption);
      if (!focusedOption) {
        focusedIndex = -1;
      }
      if (direction === 'up') {
        nextFocus = focusedIndex > 0 ? focusedIndex - 1 : options.length - 1;
      } else if (direction === 'down') {
        nextFocus = (focusedIndex + 1) % options.length;
      } else if (direction === 'pageup') {
        nextFocus = focusedIndex - pageSize;
        if (nextFocus < 0) nextFocus = 0;
      } else if (direction === 'pagedown') {
        nextFocus = focusedIndex + pageSize;
        if (nextFocus > options.length - 1) nextFocus = options.length - 1;
      } else if (direction === 'last') {
        nextFocus = options.length - 1;
      }
      this.scrollToFocusedOptionOnUpdate = true;
      this.setState({
        focusedOption: options[nextFocus],
        focusedValue: null,
        focusedOptionId: this.getFocusedOptionId(options[nextFocus])
      });
    }
  }, {
    key: "getTheme",
    value:
    // ==============================
    // Getters
    // ==============================

    function getTheme() {
      // Use the default theme if there are no customisations.
      if (!this.props.theme) {
        return defaultTheme;
      }
      // If the theme prop is a function, assume the function
      // knows how to merge the passed-in default theme with
      // its own modifications.
      if (typeof this.props.theme === 'function') {
        return this.props.theme(defaultTheme);
      }
      // Otherwise, if a plain theme object was passed in,
      // overlay it with the default theme.
      return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_1__["default"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_1__["default"])({}, defaultTheme), this.props.theme);
    }
  }, {
    key: "getCommonProps",
    value: function getCommonProps() {
      var clearValue = this.clearValue,
        cx = this.cx,
        getStyles = this.getStyles,
        getClassNames = this.getClassNames,
        getValue = this.getValue,
        selectOption = this.selectOption,
        setValue = this.setValue,
        props = this.props;
      var isMulti = props.isMulti,
        isRtl = props.isRtl,
        options = props.options;
      var hasValue = this.hasValue();
      return {
        clearValue: clearValue,
        cx: cx,
        getStyles: getStyles,
        getClassNames: getClassNames,
        getValue: getValue,
        hasValue: hasValue,
        isMulti: isMulti,
        isRtl: isRtl,
        options: options,
        selectOption: selectOption,
        selectProps: props,
        setValue: setValue,
        theme: this.getTheme()
      };
    }
  }, {
    key: "hasValue",
    value: function hasValue() {
      var selectValue = this.state.selectValue;
      return selectValue.length > 0;
    }
  }, {
    key: "hasOptions",
    value: function hasOptions() {
      return !!this.getFocusableOptions().length;
    }
  }, {
    key: "isClearable",
    value: function isClearable() {
      var _this$props7 = this.props,
        isClearable = _this$props7.isClearable,
        isMulti = _this$props7.isMulti;

      // single select, by default, IS NOT clearable
      // multi select, by default, IS clearable
      if (isClearable === undefined) return isMulti;
      return isClearable;
    }
  }, {
    key: "isOptionDisabled",
    value: function isOptionDisabled(option, selectValue) {
      return _isOptionDisabled(this.props, option, selectValue);
    }
  }, {
    key: "isOptionSelected",
    value: function isOptionSelected(option, selectValue) {
      return _isOptionSelected(this.props, option, selectValue);
    }
  }, {
    key: "filterOption",
    value: function filterOption(option, inputValue) {
      return _filterOption(this.props, option, inputValue);
    }
  }, {
    key: "formatOptionLabel",
    value: function formatOptionLabel(data, context) {
      if (typeof this.props.formatOptionLabel === 'function') {
        var _inputValue = this.props.inputValue;
        var _selectValue = this.state.selectValue;
        return this.props.formatOptionLabel(data, {
          context: context,
          inputValue: _inputValue,
          selectValue: _selectValue
        });
      } else {
        return this.getOptionLabel(data);
      }
    }
  }, {
    key: "formatGroupLabel",
    value: function formatGroupLabel(data) {
      return this.props.formatGroupLabel(data);
    }

    // ==============================
    // Mouse Handlers
    // ==============================
  }, {
    key: "startListeningComposition",
    value:
    // ==============================
    // Composition Handlers
    // ==============================

    function startListeningComposition() {
      if (document && document.addEventListener) {
        document.addEventListener('compositionstart', this.onCompositionStart, false);
        document.addEventListener('compositionend', this.onCompositionEnd, false);
      }
    }
  }, {
    key: "stopListeningComposition",
    value: function stopListeningComposition() {
      if (document && document.removeEventListener) {
        document.removeEventListener('compositionstart', this.onCompositionStart);
        document.removeEventListener('compositionend', this.onCompositionEnd);
      }
    }
  }, {
    key: "startListeningToTouch",
    value:
    // ==============================
    // Touch Handlers
    // ==============================

    function startListeningToTouch() {
      if (document && document.addEventListener) {
        document.addEventListener('touchstart', this.onTouchStart, false);
        document.addEventListener('touchmove', this.onTouchMove, false);
        document.addEventListener('touchend', this.onTouchEnd, false);
      }
    }
  }, {
    key: "stopListeningToTouch",
    value: function stopListeningToTouch() {
      if (document && document.removeEventListener) {
        document.removeEventListener('touchstart', this.onTouchStart);
        document.removeEventListener('touchmove', this.onTouchMove);
        document.removeEventListener('touchend', this.onTouchEnd);
      }
    }
  }, {
    key: "renderInput",
    value:
    // ==============================
    // Renderers
    // ==============================
    function renderInput() {
      var _this$props8 = this.props,
        isDisabled = _this$props8.isDisabled,
        isSearchable = _this$props8.isSearchable,
        inputId = _this$props8.inputId,
        inputValue = _this$props8.inputValue,
        tabIndex = _this$props8.tabIndex,
        form = _this$props8.form,
        menuIsOpen = _this$props8.menuIsOpen,
        required = _this$props8.required;
      var _this$getComponents = this.getComponents(),
        Input = _this$getComponents.Input;
      var _this$state4 = this.state,
        inputIsHidden = _this$state4.inputIsHidden,
        ariaSelection = _this$state4.ariaSelection;
      var commonProps = this.commonProps;
      var id = inputId || this.getElementId('input');

      // aria attributes makes the JSX "noisy", separated for clarity
      var ariaAttributes = (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_1__["default"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_1__["default"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_1__["default"])({
        'aria-autocomplete': 'list',
        'aria-expanded': menuIsOpen,
        'aria-haspopup': true,
        'aria-errormessage': this.props['aria-errormessage'],
        'aria-invalid': this.props['aria-invalid'],
        'aria-label': this.props['aria-label'],
        'aria-labelledby': this.props['aria-labelledby'],
        'aria-required': required,
        role: 'combobox',
        'aria-activedescendant': this.isAppleDevice ? undefined : this.state.focusedOptionId || ''
      }, menuIsOpen && {
        'aria-controls': this.getElementId('listbox')
      }), !isSearchable && {
        'aria-readonly': true
      }), this.hasValue() ? (ariaSelection === null || ariaSelection === void 0 ? void 0 : ariaSelection.action) === 'initial-input-focus' && {
        'aria-describedby': this.getElementId('live-region')
      } : {
        'aria-describedby': this.getElementId('placeholder')
      });
      if (!isSearchable) {
        // use a dummy input to maintain focus/blur functionality
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(DummyInput, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
          id: id,
          innerRef: this.getInputRef,
          onBlur: this.onInputBlur,
          onChange: _index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.J,
          onFocus: this.onInputFocus,
          disabled: isDisabled,
          tabIndex: tabIndex,
          inputMode: "none",
          form: form,
          value: ""
        }, ariaAttributes));
      }
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(Input, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
        autoCapitalize: "none",
        autoComplete: "off",
        autoCorrect: "off",
        id: id,
        innerRef: this.getInputRef,
        isDisabled: isDisabled,
        isHidden: inputIsHidden,
        onBlur: this.onInputBlur,
        onChange: this.handleInputChange,
        onFocus: this.onInputFocus,
        spellCheck: "false",
        tabIndex: tabIndex,
        form: form,
        type: "text",
        value: inputValue
      }, ariaAttributes));
    }
  }, {
    key: "renderPlaceholderOrValue",
    value: function renderPlaceholderOrValue() {
      var _this3 = this;
      var _this$getComponents2 = this.getComponents(),
        MultiValue = _this$getComponents2.MultiValue,
        MultiValueContainer = _this$getComponents2.MultiValueContainer,
        MultiValueLabel = _this$getComponents2.MultiValueLabel,
        MultiValueRemove = _this$getComponents2.MultiValueRemove,
        SingleValue = _this$getComponents2.SingleValue,
        Placeholder = _this$getComponents2.Placeholder;
      var commonProps = this.commonProps;
      var _this$props9 = this.props,
        controlShouldRenderValue = _this$props9.controlShouldRenderValue,
        isDisabled = _this$props9.isDisabled,
        isMulti = _this$props9.isMulti,
        inputValue = _this$props9.inputValue,
        placeholder = _this$props9.placeholder;
      var _this$state5 = this.state,
        selectValue = _this$state5.selectValue,
        focusedValue = _this$state5.focusedValue,
        isFocused = _this$state5.isFocused;
      if (!this.hasValue() || !controlShouldRenderValue) {
        return inputValue ? null : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(Placeholder, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
          key: "placeholder",
          isDisabled: isDisabled,
          isFocused: isFocused,
          innerProps: {
            id: this.getElementId('placeholder')
          }
        }), placeholder);
      }
      if (isMulti) {
        return selectValue.map(function (opt, index) {
          var isOptionFocused = opt === focusedValue;
          var key = "".concat(_this3.getOptionLabel(opt), "-").concat(_this3.getOptionValue(opt));
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(MultiValue, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
            components: {
              Container: MultiValueContainer,
              Label: MultiValueLabel,
              Remove: MultiValueRemove
            },
            isFocused: isOptionFocused,
            isDisabled: isDisabled,
            key: key,
            index: index,
            removeProps: {
              onClick: function onClick() {
                return _this3.removeValue(opt);
              },
              onTouchEnd: function onTouchEnd() {
                return _this3.removeValue(opt);
              },
              onMouseDown: function onMouseDown(e) {
                e.preventDefault();
              }
            },
            data: opt
          }), _this3.formatOptionLabel(opt, 'value'));
        });
      }
      if (inputValue) {
        return null;
      }
      var singleValue = selectValue[0];
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(SingleValue, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
        data: singleValue,
        isDisabled: isDisabled
      }), this.formatOptionLabel(singleValue, 'value'));
    }
  }, {
    key: "renderClearIndicator",
    value: function renderClearIndicator() {
      var _this$getComponents3 = this.getComponents(),
        ClearIndicator = _this$getComponents3.ClearIndicator;
      var commonProps = this.commonProps;
      var _this$props10 = this.props,
        isDisabled = _this$props10.isDisabled,
        isLoading = _this$props10.isLoading;
      var isFocused = this.state.isFocused;
      if (!this.isClearable() || !ClearIndicator || isDisabled || !this.hasValue() || isLoading) {
        return null;
      }
      var innerProps = {
        onMouseDown: this.onClearIndicatorMouseDown,
        onTouchEnd: this.onClearIndicatorTouchEnd,
        'aria-hidden': 'true'
      };
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(ClearIndicator, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
        innerProps: innerProps,
        isFocused: isFocused
      }));
    }
  }, {
    key: "renderLoadingIndicator",
    value: function renderLoadingIndicator() {
      var _this$getComponents4 = this.getComponents(),
        LoadingIndicator = _this$getComponents4.LoadingIndicator;
      var commonProps = this.commonProps;
      var _this$props11 = this.props,
        isDisabled = _this$props11.isDisabled,
        isLoading = _this$props11.isLoading;
      var isFocused = this.state.isFocused;
      if (!LoadingIndicator || !isLoading) return null;
      var innerProps = {
        'aria-hidden': 'true'
      };
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(LoadingIndicator, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
        innerProps: innerProps,
        isDisabled: isDisabled,
        isFocused: isFocused
      }));
    }
  }, {
    key: "renderIndicatorSeparator",
    value: function renderIndicatorSeparator() {
      var _this$getComponents5 = this.getComponents(),
        DropdownIndicator = _this$getComponents5.DropdownIndicator,
        IndicatorSeparator = _this$getComponents5.IndicatorSeparator;

      // separator doesn't make sense without the dropdown indicator
      if (!DropdownIndicator || !IndicatorSeparator) return null;
      var commonProps = this.commonProps;
      var isDisabled = this.props.isDisabled;
      var isFocused = this.state.isFocused;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(IndicatorSeparator, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
        isDisabled: isDisabled,
        isFocused: isFocused
      }));
    }
  }, {
    key: "renderDropdownIndicator",
    value: function renderDropdownIndicator() {
      var _this$getComponents6 = this.getComponents(),
        DropdownIndicator = _this$getComponents6.DropdownIndicator;
      if (!DropdownIndicator) return null;
      var commonProps = this.commonProps;
      var isDisabled = this.props.isDisabled;
      var isFocused = this.state.isFocused;
      var innerProps = {
        onMouseDown: this.onDropdownIndicatorMouseDown,
        onTouchEnd: this.onDropdownIndicatorTouchEnd,
        'aria-hidden': 'true'
      };
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(DropdownIndicator, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
        innerProps: innerProps,
        isDisabled: isDisabled,
        isFocused: isFocused
      }));
    }
  }, {
    key: "renderMenu",
    value: function renderMenu() {
      var _this4 = this;
      var _this$getComponents7 = this.getComponents(),
        Group = _this$getComponents7.Group,
        GroupHeading = _this$getComponents7.GroupHeading,
        Menu = _this$getComponents7.Menu,
        MenuList = _this$getComponents7.MenuList,
        MenuPortal = _this$getComponents7.MenuPortal,
        LoadingMessage = _this$getComponents7.LoadingMessage,
        NoOptionsMessage = _this$getComponents7.NoOptionsMessage,
        Option = _this$getComponents7.Option;
      var commonProps = this.commonProps;
      var focusedOption = this.state.focusedOption;
      var _this$props12 = this.props,
        captureMenuScroll = _this$props12.captureMenuScroll,
        inputValue = _this$props12.inputValue,
        isLoading = _this$props12.isLoading,
        loadingMessage = _this$props12.loadingMessage,
        minMenuHeight = _this$props12.minMenuHeight,
        maxMenuHeight = _this$props12.maxMenuHeight,
        menuIsOpen = _this$props12.menuIsOpen,
        menuPlacement = _this$props12.menuPlacement,
        menuPosition = _this$props12.menuPosition,
        menuPortalTarget = _this$props12.menuPortalTarget,
        menuShouldBlockScroll = _this$props12.menuShouldBlockScroll,
        menuShouldScrollIntoView = _this$props12.menuShouldScrollIntoView,
        noOptionsMessage = _this$props12.noOptionsMessage,
        onMenuScrollToTop = _this$props12.onMenuScrollToTop,
        onMenuScrollToBottom = _this$props12.onMenuScrollToBottom;
      if (!menuIsOpen) return null;

      // TODO: Internal Option Type here
      var render = function render(props, id) {
        var type = props.type,
          data = props.data,
          isDisabled = props.isDisabled,
          isSelected = props.isSelected,
          label = props.label,
          value = props.value;
        var isFocused = focusedOption === data;
        var onHover = isDisabled ? undefined : function () {
          return _this4.onOptionHover(data);
        };
        var onSelect = isDisabled ? undefined : function () {
          return _this4.selectOption(data);
        };
        var optionId = "".concat(_this4.getElementId('option'), "-").concat(id);
        var innerProps = {
          id: optionId,
          onClick: onSelect,
          onMouseMove: onHover,
          onMouseOver: onHover,
          tabIndex: -1,
          role: 'option',
          'aria-selected': _this4.isAppleDevice ? undefined : isSelected // is not supported on Apple devices
        };

        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(Option, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
          innerProps: innerProps,
          data: data,
          isDisabled: isDisabled,
          isSelected: isSelected,
          key: optionId,
          label: label,
          type: type,
          value: value,
          isFocused: isFocused,
          innerRef: isFocused ? _this4.getFocusedOptionRef : undefined
        }), _this4.formatOptionLabel(props.data, 'menu'));
      };
      var menuUI;
      if (this.hasOptions()) {
        menuUI = this.getCategorizedOptions().map(function (item) {
          if (item.type === 'group') {
            var _data = item.data,
              options = item.options,
              groupIndex = item.index;
            var groupId = "".concat(_this4.getElementId('group'), "-").concat(groupIndex);
            var headingId = "".concat(groupId, "-heading");
            return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(Group, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
              key: groupId,
              data: _data,
              options: options,
              Heading: GroupHeading,
              headingProps: {
                id: headingId,
                data: item.data
              },
              label: _this4.formatGroupLabel(item.data)
            }), item.options.map(function (option) {
              return render(option, "".concat(groupIndex, "-").concat(option.index));
            }));
          } else if (item.type === 'option') {
            return render(item, "".concat(item.index));
          }
        });
      } else if (isLoading) {
        var message = loadingMessage({
          inputValue: inputValue
        });
        if (message === null) return null;
        menuUI = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(LoadingMessage, commonProps, message);
      } else {
        var _message = noOptionsMessage({
          inputValue: inputValue
        });
        if (_message === null) return null;
        menuUI = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(NoOptionsMessage, commonProps, _message);
      }
      var menuPlacementProps = {
        minMenuHeight: minMenuHeight,
        maxMenuHeight: maxMenuHeight,
        menuPlacement: menuPlacement,
        menuPosition: menuPosition,
        menuShouldScrollIntoView: menuShouldScrollIntoView
      };
      var menuElement = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(_index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.M, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, menuPlacementProps), function (_ref4) {
        var ref = _ref4.ref,
          _ref4$placerProps = _ref4.placerProps,
          placement = _ref4$placerProps.placement,
          maxHeight = _ref4$placerProps.maxHeight;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(Menu, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, menuPlacementProps, {
          innerRef: ref,
          innerProps: {
            onMouseDown: _this4.onMenuMouseDown,
            onMouseMove: _this4.onMenuMouseMove
          },
          isLoading: isLoading,
          placement: placement
        }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(ScrollManager, {
          captureEnabled: captureMenuScroll,
          onTopArrive: onMenuScrollToTop,
          onBottomArrive: onMenuScrollToBottom,
          lockEnabled: menuShouldBlockScroll
        }, function (scrollTargetRef) {
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(MenuList, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
            innerRef: function innerRef(instance) {
              _this4.getMenuListRef(instance);
              scrollTargetRef(instance);
            },
            innerProps: {
              role: 'listbox',
              'aria-multiselectable': commonProps.isMulti,
              id: _this4.getElementId('listbox')
            },
            isLoading: isLoading,
            maxHeight: maxHeight,
            focusedOption: focusedOption
          }), menuUI);
        }));
      });

      // positioning behaviour is almost identical for portalled and fixed,
      // so we use the same component. the actual portalling logic is forked
      // within the component based on `menuPosition`
      return menuPortalTarget || menuPosition === 'fixed' ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(MenuPortal, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
        appendTo: menuPortalTarget,
        controlElement: this.controlRef,
        menuPlacement: menuPlacement,
        menuPosition: menuPosition
      }), menuElement) : menuElement;
    }
  }, {
    key: "renderFormField",
    value: function renderFormField() {
      var _this5 = this;
      var _this$props13 = this.props,
        delimiter = _this$props13.delimiter,
        isDisabled = _this$props13.isDisabled,
        isMulti = _this$props13.isMulti,
        name = _this$props13.name,
        required = _this$props13.required;
      var selectValue = this.state.selectValue;
      if (required && !this.hasValue() && !isDisabled) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(RequiredInput$1, {
          name: name,
          onFocus: this.onValueInputFocus
        });
      }
      if (!name || isDisabled) return;
      if (isMulti) {
        if (delimiter) {
          var value = selectValue.map(function (opt) {
            return _this5.getOptionValue(opt);
          }).join(delimiter);
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("input", {
            name: name,
            type: "hidden",
            value: value
          });
        } else {
          var input = selectValue.length > 0 ? selectValue.map(function (opt, i) {
            return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("input", {
              key: "i-".concat(i),
              name: name,
              type: "hidden",
              value: _this5.getOptionValue(opt)
            });
          }) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("input", {
            name: name,
            type: "hidden",
            value: ""
          });
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", null, input);
        }
      } else {
        var _value = selectValue[0] ? this.getOptionValue(selectValue[0]) : '';
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("input", {
          name: name,
          type: "hidden",
          value: _value
        });
      }
    }
  }, {
    key: "renderLiveRegion",
    value: function renderLiveRegion() {
      var commonProps = this.commonProps;
      var _this$state6 = this.state,
        ariaSelection = _this$state6.ariaSelection,
        focusedOption = _this$state6.focusedOption,
        focusedValue = _this$state6.focusedValue,
        isFocused = _this$state6.isFocused,
        selectValue = _this$state6.selectValue;
      var focusableOptions = this.getFocusableOptions();
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(LiveRegion$1, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
        id: this.getElementId('live-region'),
        ariaSelection: ariaSelection,
        focusedOption: focusedOption,
        focusedValue: focusedValue,
        isFocused: isFocused,
        selectValue: selectValue,
        focusableOptions: focusableOptions,
        isAppleDevice: this.isAppleDevice
      }));
    }
  }, {
    key: "render",
    value: function render() {
      var _this$getComponents8 = this.getComponents(),
        Control = _this$getComponents8.Control,
        IndicatorsContainer = _this$getComponents8.IndicatorsContainer,
        SelectContainer = _this$getComponents8.SelectContainer,
        ValueContainer = _this$getComponents8.ValueContainer;
      var _this$props14 = this.props,
        className = _this$props14.className,
        id = _this$props14.id,
        isDisabled = _this$props14.isDisabled,
        menuIsOpen = _this$props14.menuIsOpen;
      var isFocused = this.state.isFocused;
      var commonProps = this.commonProps = this.getCommonProps();
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(SelectContainer, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
        className: className,
        innerProps: {
          id: id,
          onKeyDown: this.onKeyDown
        },
        isDisabled: isDisabled,
        isFocused: isFocused
      }), this.renderLiveRegion(), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(Control, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
        innerRef: this.getControlRef,
        innerProps: {
          onMouseDown: this.onControlMouseDown,
          onTouchEnd: this.onControlTouchEnd
        },
        isDisabled: isDisabled,
        isFocused: isFocused,
        menuIsOpen: menuIsOpen
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(ValueContainer, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
        isDisabled: isDisabled
      }), this.renderPlaceholderOrValue(), this.renderInput()), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(IndicatorsContainer, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonProps, {
        isDisabled: isDisabled
      }), this.renderClearIndicator(), this.renderLoadingIndicator(), this.renderIndicatorSeparator(), this.renderDropdownIndicator())), this.renderMenu(), this.renderFormField());
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      var prevProps = state.prevProps,
        clearFocusValueOnUpdate = state.clearFocusValueOnUpdate,
        inputIsHiddenAfterUpdate = state.inputIsHiddenAfterUpdate,
        ariaSelection = state.ariaSelection,
        isFocused = state.isFocused,
        prevWasFocused = state.prevWasFocused,
        instancePrefix = state.instancePrefix;
      var options = props.options,
        value = props.value,
        menuIsOpen = props.menuIsOpen,
        inputValue = props.inputValue,
        isMulti = props.isMulti;
      var selectValue = (0,_index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.H)(value);
      var newMenuOptionsState = {};
      if (prevProps && (value !== prevProps.value || options !== prevProps.options || menuIsOpen !== prevProps.menuIsOpen || inputValue !== prevProps.inputValue)) {
        var focusableOptions = menuIsOpen ? buildFocusableOptions(props, selectValue) : [];
        var focusableOptionsWithIds = menuIsOpen ? buildFocusableOptionsWithIds(buildCategorizedOptions(props, selectValue), "".concat(instancePrefix, "-option")) : [];
        var focusedValue = clearFocusValueOnUpdate ? getNextFocusedValue(state, selectValue) : null;
        var focusedOption = getNextFocusedOption(state, focusableOptions);
        var focusedOptionId = getFocusedOptionId(focusableOptionsWithIds, focusedOption);
        newMenuOptionsState = {
          selectValue: selectValue,
          focusedOption: focusedOption,
          focusedOptionId: focusedOptionId,
          focusableOptionsWithIds: focusableOptionsWithIds,
          focusedValue: focusedValue,
          clearFocusValueOnUpdate: false
        };
      }
      // some updates should toggle the state of the input visibility
      var newInputIsHiddenState = inputIsHiddenAfterUpdate != null && props !== prevProps ? {
        inputIsHidden: inputIsHiddenAfterUpdate,
        inputIsHiddenAfterUpdate: undefined
      } : {};
      var newAriaSelection = ariaSelection;
      var hasKeptFocus = isFocused && prevWasFocused;
      if (isFocused && !hasKeptFocus) {
        // If `value` or `defaultValue` props are not empty then announce them
        // when the Select is initially focused
        newAriaSelection = {
          value: (0,_index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_11__.D)(isMulti, selectValue, selectValue[0] || null),
          options: selectValue,
          action: 'initial-input-focus'
        };
        hasKeptFocus = !prevWasFocused;
      }

      // If the 'initial-input-focus' action has been set already
      // then reset the ariaSelection to null
      if ((ariaSelection === null || ariaSelection === void 0 ? void 0 : ariaSelection.action) === 'initial-input-focus') {
        newAriaSelection = null;
      }
      return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_1__["default"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_1__["default"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_1__["default"])({}, newMenuOptionsState), newInputIsHiddenState), {}, {
        prevProps: props,
        ariaSelection: newAriaSelection,
        prevWasFocused: hasKeptFocus
      });
    }
  }]);
  return Select;
}(react__WEBPACK_IMPORTED_MODULE_7__.Component);
Select.defaultProps = defaultProps;




/***/ }),

/***/ "./node_modules/react-select/dist/index-a301f526.esm.js":
/*!**************************************************************!*\
  !*** ./node_modules/react-select/dist/index-a301f526.esm.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ isMobileDevice),
/* harmony export */   B: () => (/* binding */ multiValueAsValue),
/* harmony export */   C: () => (/* binding */ singleValueAsValue),
/* harmony export */   D: () => (/* binding */ valueTernary),
/* harmony export */   E: () => (/* binding */ classNames),
/* harmony export */   F: () => (/* binding */ defaultComponents),
/* harmony export */   G: () => (/* binding */ isDocumentElement),
/* harmony export */   H: () => (/* binding */ cleanValue),
/* harmony export */   I: () => (/* binding */ scrollIntoView),
/* harmony export */   J: () => (/* binding */ noop),
/* harmony export */   K: () => (/* binding */ notNullish),
/* harmony export */   L: () => (/* binding */ handleInputChange),
/* harmony export */   M: () => (/* binding */ MenuPlacer),
/* harmony export */   a: () => (/* binding */ clearIndicatorCSS),
/* harmony export */   b: () => (/* binding */ containerCSS),
/* harmony export */   c: () => (/* binding */ components),
/* harmony export */   d: () => (/* binding */ css$1),
/* harmony export */   e: () => (/* binding */ dropdownIndicatorCSS),
/* harmony export */   f: () => (/* binding */ groupHeadingCSS),
/* harmony export */   g: () => (/* binding */ groupCSS),
/* harmony export */   h: () => (/* binding */ indicatorSeparatorCSS),
/* harmony export */   i: () => (/* binding */ indicatorsContainerCSS),
/* harmony export */   j: () => (/* binding */ inputCSS),
/* harmony export */   k: () => (/* binding */ loadingMessageCSS),
/* harmony export */   l: () => (/* binding */ loadingIndicatorCSS),
/* harmony export */   m: () => (/* binding */ menuCSS),
/* harmony export */   n: () => (/* binding */ menuListCSS),
/* harmony export */   o: () => (/* binding */ menuPortalCSS),
/* harmony export */   p: () => (/* binding */ multiValueCSS),
/* harmony export */   q: () => (/* binding */ multiValueLabelCSS),
/* harmony export */   r: () => (/* binding */ removeProps),
/* harmony export */   s: () => (/* binding */ supportsPassiveEvents),
/* harmony export */   t: () => (/* binding */ multiValueRemoveCSS),
/* harmony export */   u: () => (/* binding */ noOptionsMessageCSS),
/* harmony export */   v: () => (/* binding */ optionCSS),
/* harmony export */   w: () => (/* binding */ placeholderCSS),
/* harmony export */   x: () => (/* binding */ css),
/* harmony export */   y: () => (/* binding */ valueContainerCSS),
/* harmony export */   z: () => (/* binding */ isTouchCapable)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/objectSpread2 */ "./node_modules/@babel/runtime/helpers/esm/objectSpread2.js");
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @emotion/react */ "./node_modules/@emotion/react/dist/emotion-react.browser.esm.js");
/* harmony import */ var _babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/esm/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/esm/objectWithoutProperties */ "./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var _babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/esm/typeof */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/esm/taggedTemplateLiteral */ "./node_modules/@babel/runtime/helpers/esm/taggedTemplateLiteral.js");
/* harmony import */ var _babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/esm/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _floating_ui_dom__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @floating-ui/dom */ "./node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs");
/* harmony import */ var use_isomorphic_layout_effect__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! use-isomorphic-layout-effect */ "./node_modules/use-isomorphic-layout-effect/dist/use-isomorphic-layout-effect.browser.esm.js");













var _excluded$4 = ["className", "clearValue", "cx", "getStyles", "getClassNames", "getValue", "hasValue", "isMulti", "isRtl", "options", "selectOption", "selectProps", "setValue", "theme"];
// ==============================
// NO OP
// ==============================

var noop = function noop() {};

// ==============================
// Class Name Prefixer
// ==============================

/**
 String representation of component state for styling with class names.

 Expects an array of strings OR a string/object pair:
 - className(['comp', 'comp-arg', 'comp-arg-2'])
   @returns 'react-select__comp react-select__comp-arg react-select__comp-arg-2'
 - className('comp', { some: true, state: false })
   @returns 'react-select__comp react-select__comp--some'
*/
function applyPrefixToName(prefix, name) {
  if (!name) {
    return prefix;
  } else if (name[0] === '-') {
    return prefix + name;
  } else {
    return prefix + '__' + name;
  }
}
function classNames(prefix, state) {
  for (var _len = arguments.length, classNameList = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    classNameList[_key - 2] = arguments[_key];
  }
  var arr = [].concat(classNameList);
  if (state && prefix) {
    for (var key in state) {
      if (state.hasOwnProperty(key) && state[key]) {
        arr.push("".concat(applyPrefixToName(prefix, key)));
      }
    }
  }
  return arr.filter(function (i) {
    return i;
  }).map(function (i) {
    return String(i).trim();
  }).join(' ');
}
// ==============================
// Clean Value
// ==============================

var cleanValue = function cleanValue(value) {
  if (isArray(value)) return value.filter(Boolean);
  if ((0,_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_4__["default"])(value) === 'object' && value !== null) return [value];
  return [];
};

// ==============================
// Clean Common Props
// ==============================

var cleanCommonProps = function cleanCommonProps(props) {
  //className
  props.className;
    props.clearValue;
    props.cx;
    props.getStyles;
    props.getClassNames;
    props.getValue;
    props.hasValue;
    props.isMulti;
    props.isRtl;
    props.options;
    props.selectOption;
    props.selectProps;
    props.setValue;
    props.theme;
    var innerProps = (0,_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_3__["default"])(props, _excluded$4);
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({}, innerProps);
};

// ==============================
// Get Style Props
// ==============================

var getStyleProps = function getStyleProps(props, name, classNamesState) {
  var cx = props.cx,
    getStyles = props.getStyles,
    getClassNames = props.getClassNames,
    className = props.className;
  return {
    css: getStyles(name, props),
    className: cx(classNamesState !== null && classNamesState !== void 0 ? classNamesState : {}, getClassNames(name, props), className)
  };
};

// ==============================
// Handle Input Change
// ==============================

function handleInputChange(inputValue, actionMeta, onInputChange) {
  if (onInputChange) {
    var _newValue = onInputChange(inputValue, actionMeta);
    if (typeof _newValue === 'string') return _newValue;
  }
  return inputValue;
}

// ==============================
// Scroll Helpers
// ==============================

function isDocumentElement(el) {
  return [document.documentElement, document.body, window].indexOf(el) > -1;
}

// Normalized Scroll Top
// ------------------------------

function normalizedHeight(el) {
  if (isDocumentElement(el)) {
    return window.innerHeight;
  }
  return el.clientHeight;
}

// Normalized scrollTo & scrollTop
// ------------------------------

function getScrollTop(el) {
  if (isDocumentElement(el)) {
    return window.pageYOffset;
  }
  return el.scrollTop;
}
function scrollTo(el, top) {
  // with a scroll distance, we perform scroll on the element
  if (isDocumentElement(el)) {
    window.scrollTo(0, top);
    return;
  }
  el.scrollTop = top;
}

// Get Scroll Parent
// ------------------------------

function getScrollParent(element) {
  var style = getComputedStyle(element);
  var excludeStaticParent = style.position === 'absolute';
  var overflowRx = /(auto|scroll)/;
  if (style.position === 'fixed') return document.documentElement;
  for (var parent = element; parent = parent.parentElement;) {
    style = getComputedStyle(parent);
    if (excludeStaticParent && style.position === 'static') {
      continue;
    }
    if (overflowRx.test(style.overflow + style.overflowY + style.overflowX)) {
      return parent;
    }
  }
  return document.documentElement;
}

// Animated Scroll To
// ------------------------------

/**
  @param t: time (elapsed)
  @param b: initial value
  @param c: amount of change
  @param d: duration
*/
function easeOutCubic(t, b, c, d) {
  return c * ((t = t / d - 1) * t * t + 1) + b;
}
function animatedScrollTo(element, to) {
  var duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 200;
  var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : noop;
  var start = getScrollTop(element);
  var change = to - start;
  var increment = 10;
  var currentTime = 0;
  function animateScroll() {
    currentTime += increment;
    var val = easeOutCubic(currentTime, start, change, duration);
    scrollTo(element, val);
    if (currentTime < duration) {
      window.requestAnimationFrame(animateScroll);
    } else {
      callback(element);
    }
  }
  animateScroll();
}

// Scroll Into View
// ------------------------------

function scrollIntoView(menuEl, focusedEl) {
  var menuRect = menuEl.getBoundingClientRect();
  var focusedRect = focusedEl.getBoundingClientRect();
  var overScroll = focusedEl.offsetHeight / 3;
  if (focusedRect.bottom + overScroll > menuRect.bottom) {
    scrollTo(menuEl, Math.min(focusedEl.offsetTop + focusedEl.clientHeight - menuEl.offsetHeight + overScroll, menuEl.scrollHeight));
  } else if (focusedRect.top - overScroll < menuRect.top) {
    scrollTo(menuEl, Math.max(focusedEl.offsetTop - overScroll, 0));
  }
}

// ==============================
// Get bounding client object
// ==============================

// cannot get keys using array notation with DOMRect
function getBoundingClientObj(element) {
  var rect = element.getBoundingClientRect();
  return {
    bottom: rect.bottom,
    height: rect.height,
    left: rect.left,
    right: rect.right,
    top: rect.top,
    width: rect.width
  };
}

// ==============================
// Touch Capability Detector
// ==============================

function isTouchCapable() {
  try {
    document.createEvent('TouchEvent');
    return true;
  } catch (e) {
    return false;
  }
}

// ==============================
// Mobile Device Detector
// ==============================

function isMobileDevice() {
  try {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  } catch (e) {
    return false;
  }
}

// ==============================
// Passive Event Detector
// ==============================

// https://github.com/rafgraph/detect-it/blob/main/src/index.ts#L19-L36
var passiveOptionAccessed = false;
var options = {
  get passive() {
    return passiveOptionAccessed = true;
  }
};
// check for SSR
var w = typeof window !== 'undefined' ? window : {};
if (w.addEventListener && w.removeEventListener) {
  w.addEventListener('p', noop, options);
  w.removeEventListener('p', noop, false);
}
var supportsPassiveEvents = passiveOptionAccessed;
function notNullish(item) {
  return item != null;
}
function isArray(arg) {
  return Array.isArray(arg);
}
function valueTernary(isMulti, multiValue, singleValue) {
  return isMulti ? multiValue : singleValue;
}
function singleValueAsValue(singleValue) {
  return singleValue;
}
function multiValueAsValue(multiValue) {
  return multiValue;
}
var removeProps = function removeProps(propsObj) {
  for (var _len2 = arguments.length, properties = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    properties[_key2 - 1] = arguments[_key2];
  }
  var propsMap = Object.entries(propsObj).filter(function (_ref) {
    var _ref2 = (0,_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(_ref, 1),
      key = _ref2[0];
    return !properties.includes(key);
  });
  return propsMap.reduce(function (newProps, _ref3) {
    var _ref4 = (0,_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(_ref3, 2),
      key = _ref4[0],
      val = _ref4[1];
    newProps[key] = val;
    return newProps;
  }, {});
};

var _excluded$3 = ["children", "innerProps"],
  _excluded2$1 = ["children", "innerProps"];
function getMenuPlacement(_ref) {
  var preferredMaxHeight = _ref.maxHeight,
    menuEl = _ref.menuEl,
    minHeight = _ref.minHeight,
    preferredPlacement = _ref.placement,
    shouldScroll = _ref.shouldScroll,
    isFixedPosition = _ref.isFixedPosition,
    controlHeight = _ref.controlHeight;
  var scrollParent = getScrollParent(menuEl);
  var defaultState = {
    placement: 'bottom',
    maxHeight: preferredMaxHeight
  };

  // something went wrong, return default state
  if (!menuEl || !menuEl.offsetParent) return defaultState;

  // we can't trust `scrollParent.scrollHeight` --> it may increase when
  // the menu is rendered
  var _scrollParent$getBoun = scrollParent.getBoundingClientRect(),
    scrollHeight = _scrollParent$getBoun.height;
  var _menuEl$getBoundingCl = menuEl.getBoundingClientRect(),
    menuBottom = _menuEl$getBoundingCl.bottom,
    menuHeight = _menuEl$getBoundingCl.height,
    menuTop = _menuEl$getBoundingCl.top;
  var _menuEl$offsetParent$ = menuEl.offsetParent.getBoundingClientRect(),
    containerTop = _menuEl$offsetParent$.top;
  var viewHeight = isFixedPosition ? window.innerHeight : normalizedHeight(scrollParent);
  var scrollTop = getScrollTop(scrollParent);
  var marginBottom = parseInt(getComputedStyle(menuEl).marginBottom, 10);
  var marginTop = parseInt(getComputedStyle(menuEl).marginTop, 10);
  var viewSpaceAbove = containerTop - marginTop;
  var viewSpaceBelow = viewHeight - menuTop;
  var scrollSpaceAbove = viewSpaceAbove + scrollTop;
  var scrollSpaceBelow = scrollHeight - scrollTop - menuTop;
  var scrollDown = menuBottom - viewHeight + scrollTop + marginBottom;
  var scrollUp = scrollTop + menuTop - marginTop;
  var scrollDuration = 160;
  switch (preferredPlacement) {
    case 'auto':
    case 'bottom':
      // 1: the menu will fit, do nothing
      if (viewSpaceBelow >= menuHeight) {
        return {
          placement: 'bottom',
          maxHeight: preferredMaxHeight
        };
      }

      // 2: the menu will fit, if scrolled
      if (scrollSpaceBelow >= menuHeight && !isFixedPosition) {
        if (shouldScroll) {
          animatedScrollTo(scrollParent, scrollDown, scrollDuration);
        }
        return {
          placement: 'bottom',
          maxHeight: preferredMaxHeight
        };
      }

      // 3: the menu will fit, if constrained
      if (!isFixedPosition && scrollSpaceBelow >= minHeight || isFixedPosition && viewSpaceBelow >= minHeight) {
        if (shouldScroll) {
          animatedScrollTo(scrollParent, scrollDown, scrollDuration);
        }

        // we want to provide as much of the menu as possible to the user,
        // so give them whatever is available below rather than the minHeight.
        var constrainedHeight = isFixedPosition ? viewSpaceBelow - marginBottom : scrollSpaceBelow - marginBottom;
        return {
          placement: 'bottom',
          maxHeight: constrainedHeight
        };
      }

      // 4. Forked beviour when there isn't enough space below

      // AUTO: flip the menu, render above
      if (preferredPlacement === 'auto' || isFixedPosition) {
        // may need to be constrained after flipping
        var _constrainedHeight = preferredMaxHeight;
        var spaceAbove = isFixedPosition ? viewSpaceAbove : scrollSpaceAbove;
        if (spaceAbove >= minHeight) {
          _constrainedHeight = Math.min(spaceAbove - marginBottom - controlHeight, preferredMaxHeight);
        }
        return {
          placement: 'top',
          maxHeight: _constrainedHeight
        };
      }

      // BOTTOM: allow browser to increase scrollable area and immediately set scroll
      if (preferredPlacement === 'bottom') {
        if (shouldScroll) {
          scrollTo(scrollParent, scrollDown);
        }
        return {
          placement: 'bottom',
          maxHeight: preferredMaxHeight
        };
      }
      break;
    case 'top':
      // 1: the menu will fit, do nothing
      if (viewSpaceAbove >= menuHeight) {
        return {
          placement: 'top',
          maxHeight: preferredMaxHeight
        };
      }

      // 2: the menu will fit, if scrolled
      if (scrollSpaceAbove >= menuHeight && !isFixedPosition) {
        if (shouldScroll) {
          animatedScrollTo(scrollParent, scrollUp, scrollDuration);
        }
        return {
          placement: 'top',
          maxHeight: preferredMaxHeight
        };
      }

      // 3: the menu will fit, if constrained
      if (!isFixedPosition && scrollSpaceAbove >= minHeight || isFixedPosition && viewSpaceAbove >= minHeight) {
        var _constrainedHeight2 = preferredMaxHeight;

        // we want to provide as much of the menu as possible to the user,
        // so give them whatever is available below rather than the minHeight.
        if (!isFixedPosition && scrollSpaceAbove >= minHeight || isFixedPosition && viewSpaceAbove >= minHeight) {
          _constrainedHeight2 = isFixedPosition ? viewSpaceAbove - marginTop : scrollSpaceAbove - marginTop;
        }
        if (shouldScroll) {
          animatedScrollTo(scrollParent, scrollUp, scrollDuration);
        }
        return {
          placement: 'top',
          maxHeight: _constrainedHeight2
        };
      }

      // 4. not enough space, the browser WILL NOT increase scrollable area when
      // absolutely positioned element rendered above the viewport (only below).
      // Flip the menu, render below
      return {
        placement: 'bottom',
        maxHeight: preferredMaxHeight
      };
    default:
      throw new Error("Invalid placement provided \"".concat(preferredPlacement, "\"."));
  }
  return defaultState;
}

// Menu Component
// ------------------------------

function alignToControl(placement) {
  var placementToCSSProp = {
    bottom: 'top',
    top: 'bottom'
  };
  return placement ? placementToCSSProp[placement] : 'bottom';
}
var coercePlacement = function coercePlacement(p) {
  return p === 'auto' ? 'bottom' : p;
};
var menuCSS = function menuCSS(_ref2, unstyled) {
  var _objectSpread2;
  var placement = _ref2.placement,
    _ref2$theme = _ref2.theme,
    borderRadius = _ref2$theme.borderRadius,
    spacing = _ref2$theme.spacing,
    colors = _ref2$theme.colors;
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])((_objectSpread2 = {
    label: 'menu'
  }, (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_6__["default"])(_objectSpread2, alignToControl(placement), '100%'), (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_6__["default"])(_objectSpread2, "position", 'absolute'), (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_6__["default"])(_objectSpread2, "width", '100%'), (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_6__["default"])(_objectSpread2, "zIndex", 1), _objectSpread2), unstyled ? {} : {
    backgroundColor: colors.neutral0,
    borderRadius: borderRadius,
    boxShadow: '0 0 0 1px hsla(0, 0%, 0%, 0.1), 0 4px 11px hsla(0, 0%, 0%, 0.1)',
    marginBottom: spacing.menuGutter,
    marginTop: spacing.menuGutter
  });
};
var PortalPlacementContext = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_7__.createContext)(null);

// NOTE: internal only
var MenuPlacer = function MenuPlacer(props) {
  var children = props.children,
    minMenuHeight = props.minMenuHeight,
    maxMenuHeight = props.maxMenuHeight,
    menuPlacement = props.menuPlacement,
    menuPosition = props.menuPosition,
    menuShouldScrollIntoView = props.menuShouldScrollIntoView,
    theme = props.theme;
  var _ref3 = (0,react__WEBPACK_IMPORTED_MODULE_7__.useContext)(PortalPlacementContext) || {},
    setPortalPlacement = _ref3.setPortalPlacement;
  var ref = (0,react__WEBPACK_IMPORTED_MODULE_7__.useRef)(null);
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_7__.useState)(maxMenuHeight),
    _useState2 = (0,_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(_useState, 2),
    maxHeight = _useState2[0],
    setMaxHeight = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_7__.useState)(null),
    _useState4 = (0,_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(_useState3, 2),
    placement = _useState4[0],
    setPlacement = _useState4[1];
  var controlHeight = theme.spacing.controlHeight;
  (0,use_isomorphic_layout_effect__WEBPACK_IMPORTED_MODULE_9__["default"])(function () {
    var menuEl = ref.current;
    if (!menuEl) return;

    // DO NOT scroll if position is fixed
    var isFixedPosition = menuPosition === 'fixed';
    var shouldScroll = menuShouldScrollIntoView && !isFixedPosition;
    var state = getMenuPlacement({
      maxHeight: maxMenuHeight,
      menuEl: menuEl,
      minHeight: minMenuHeight,
      placement: menuPlacement,
      shouldScroll: shouldScroll,
      isFixedPosition: isFixedPosition,
      controlHeight: controlHeight
    });
    setMaxHeight(state.maxHeight);
    setPlacement(state.placement);
    setPortalPlacement === null || setPortalPlacement === void 0 ? void 0 : setPortalPlacement(state.placement);
  }, [maxMenuHeight, menuPlacement, menuPosition, menuShouldScrollIntoView, minMenuHeight, setPortalPlacement, controlHeight]);
  return children({
    ref: ref,
    placerProps: (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({}, props), {}, {
      placement: placement || coercePlacement(menuPlacement),
      maxHeight: maxHeight
    })
  });
};
var Menu = function Menu(props) {
  var children = props.children,
    innerRef = props.innerRef,
    innerProps = props.innerProps;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, getStyleProps(props, 'menu', {
    menu: true
  }), {
    ref: innerRef
  }, innerProps), children);
};
var Menu$1 = Menu;

// ==============================
// Menu List
// ==============================

var menuListCSS = function menuListCSS(_ref4, unstyled) {
  var maxHeight = _ref4.maxHeight,
    baseUnit = _ref4.theme.spacing.baseUnit;
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({
    maxHeight: maxHeight,
    overflowY: 'auto',
    position: 'relative',
    // required for offset[Height, Top] > keyboard scroll
    WebkitOverflowScrolling: 'touch'
  }, unstyled ? {} : {
    paddingBottom: baseUnit,
    paddingTop: baseUnit
  });
};
var MenuList = function MenuList(props) {
  var children = props.children,
    innerProps = props.innerProps,
    innerRef = props.innerRef,
    isMulti = props.isMulti;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, getStyleProps(props, 'menuList', {
    'menu-list': true,
    'menu-list--is-multi': isMulti
  }), {
    ref: innerRef
  }, innerProps), children);
};

// ==============================
// Menu Notices
// ==============================

var noticeCSS = function noticeCSS(_ref5, unstyled) {
  var _ref5$theme = _ref5.theme,
    baseUnit = _ref5$theme.spacing.baseUnit,
    colors = _ref5$theme.colors;
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({
    textAlign: 'center'
  }, unstyled ? {} : {
    color: colors.neutral40,
    padding: "".concat(baseUnit * 2, "px ").concat(baseUnit * 3, "px")
  });
};
var noOptionsMessageCSS = noticeCSS;
var loadingMessageCSS = noticeCSS;
var NoOptionsMessage = function NoOptionsMessage(_ref6) {
  var _ref6$children = _ref6.children,
    children = _ref6$children === void 0 ? 'No options' : _ref6$children,
    innerProps = _ref6.innerProps,
    restProps = (0,_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_3__["default"])(_ref6, _excluded$3);
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, getStyleProps((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({}, restProps), {}, {
    children: children,
    innerProps: innerProps
  }), 'noOptionsMessage', {
    'menu-notice': true,
    'menu-notice--no-options': true
  }), innerProps), children);
};
var LoadingMessage = function LoadingMessage(_ref7) {
  var _ref7$children = _ref7.children,
    children = _ref7$children === void 0 ? 'Loading...' : _ref7$children,
    innerProps = _ref7.innerProps,
    restProps = (0,_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_3__["default"])(_ref7, _excluded2$1);
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, getStyleProps((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({}, restProps), {}, {
    children: children,
    innerProps: innerProps
  }), 'loadingMessage', {
    'menu-notice': true,
    'menu-notice--loading': true
  }), innerProps), children);
};

// ==============================
// Menu Portal
// ==============================

var menuPortalCSS = function menuPortalCSS(_ref8) {
  var rect = _ref8.rect,
    offset = _ref8.offset,
    position = _ref8.position;
  return {
    left: rect.left,
    position: position,
    top: offset,
    width: rect.width,
    zIndex: 1
  };
};
var MenuPortal = function MenuPortal(props) {
  var appendTo = props.appendTo,
    children = props.children,
    controlElement = props.controlElement,
    innerProps = props.innerProps,
    menuPlacement = props.menuPlacement,
    menuPosition = props.menuPosition;
  var menuPortalRef = (0,react__WEBPACK_IMPORTED_MODULE_7__.useRef)(null);
  var cleanupRef = (0,react__WEBPACK_IMPORTED_MODULE_7__.useRef)(null);
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_7__.useState)(coercePlacement(menuPlacement)),
    _useState6 = (0,_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(_useState5, 2),
    placement = _useState6[0],
    setPortalPlacement = _useState6[1];
  var portalPlacementContext = (0,react__WEBPACK_IMPORTED_MODULE_7__.useMemo)(function () {
    return {
      setPortalPlacement: setPortalPlacement
    };
  }, []);
  var _useState7 = (0,react__WEBPACK_IMPORTED_MODULE_7__.useState)(null),
    _useState8 = (0,_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(_useState7, 2),
    computedPosition = _useState8[0],
    setComputedPosition = _useState8[1];
  var updateComputedPosition = (0,react__WEBPACK_IMPORTED_MODULE_7__.useCallback)(function () {
    if (!controlElement) return;
    var rect = getBoundingClientObj(controlElement);
    var scrollDistance = menuPosition === 'fixed' ? 0 : window.pageYOffset;
    var offset = rect[placement] + scrollDistance;
    if (offset !== (computedPosition === null || computedPosition === void 0 ? void 0 : computedPosition.offset) || rect.left !== (computedPosition === null || computedPosition === void 0 ? void 0 : computedPosition.rect.left) || rect.width !== (computedPosition === null || computedPosition === void 0 ? void 0 : computedPosition.rect.width)) {
      setComputedPosition({
        offset: offset,
        rect: rect
      });
    }
  }, [controlElement, menuPosition, placement, computedPosition === null || computedPosition === void 0 ? void 0 : computedPosition.offset, computedPosition === null || computedPosition === void 0 ? void 0 : computedPosition.rect.left, computedPosition === null || computedPosition === void 0 ? void 0 : computedPosition.rect.width]);
  (0,use_isomorphic_layout_effect__WEBPACK_IMPORTED_MODULE_9__["default"])(function () {
    updateComputedPosition();
  }, [updateComputedPosition]);
  var runAutoUpdate = (0,react__WEBPACK_IMPORTED_MODULE_7__.useCallback)(function () {
    if (typeof cleanupRef.current === 'function') {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    if (controlElement && menuPortalRef.current) {
      cleanupRef.current = (0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_11__.autoUpdate)(controlElement, menuPortalRef.current, updateComputedPosition, {
        elementResize: 'ResizeObserver' in window
      });
    }
  }, [controlElement, updateComputedPosition]);
  (0,use_isomorphic_layout_effect__WEBPACK_IMPORTED_MODULE_9__["default"])(function () {
    runAutoUpdate();
  }, [runAutoUpdate]);
  var setMenuPortalElement = (0,react__WEBPACK_IMPORTED_MODULE_7__.useCallback)(function (menuPortalElement) {
    menuPortalRef.current = menuPortalElement;
    runAutoUpdate();
  }, [runAutoUpdate]);

  // bail early if required elements aren't present
  if (!appendTo && menuPosition !== 'fixed' || !computedPosition) return null;

  // same wrapper element whether fixed or portalled
  var menuWrapper = (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({
    ref: setMenuPortalElement
  }, getStyleProps((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({}, props), {}, {
    offset: computedPosition.offset,
    position: menuPosition,
    rect: computedPosition.rect
  }), 'menuPortal', {
    'menu-portal': true
  }), innerProps), children);
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)(PortalPlacementContext.Provider, {
    value: portalPlacementContext
  }, appendTo ? /*#__PURE__*/(0,react_dom__WEBPACK_IMPORTED_MODULE_8__.createPortal)(menuWrapper, appendTo) : menuWrapper);
};

// ==============================
// Root Container
// ==============================

var containerCSS = function containerCSS(_ref) {
  var isDisabled = _ref.isDisabled,
    isRtl = _ref.isRtl;
  return {
    label: 'container',
    direction: isRtl ? 'rtl' : undefined,
    pointerEvents: isDisabled ? 'none' : undefined,
    // cancel mouse events when disabled
    position: 'relative'
  };
};
var SelectContainer = function SelectContainer(props) {
  var children = props.children,
    innerProps = props.innerProps,
    isDisabled = props.isDisabled,
    isRtl = props.isRtl;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, getStyleProps(props, 'container', {
    '--is-disabled': isDisabled,
    '--is-rtl': isRtl
  }), innerProps), children);
};

// ==============================
// Value Container
// ==============================

var valueContainerCSS = function valueContainerCSS(_ref2, unstyled) {
  var spacing = _ref2.theme.spacing,
    isMulti = _ref2.isMulti,
    hasValue = _ref2.hasValue,
    controlShouldRenderValue = _ref2.selectProps.controlShouldRenderValue;
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({
    alignItems: 'center',
    display: isMulti && hasValue && controlShouldRenderValue ? 'flex' : 'grid',
    flex: 1,
    flexWrap: 'wrap',
    WebkitOverflowScrolling: 'touch',
    position: 'relative',
    overflow: 'hidden'
  }, unstyled ? {} : {
    padding: "".concat(spacing.baseUnit / 2, "px ").concat(spacing.baseUnit * 2, "px")
  });
};
var ValueContainer = function ValueContainer(props) {
  var children = props.children,
    innerProps = props.innerProps,
    isMulti = props.isMulti,
    hasValue = props.hasValue;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, getStyleProps(props, 'valueContainer', {
    'value-container': true,
    'value-container--is-multi': isMulti,
    'value-container--has-value': hasValue
  }), innerProps), children);
};

// ==============================
// Indicator Container
// ==============================

var indicatorsContainerCSS = function indicatorsContainerCSS() {
  return {
    alignItems: 'center',
    alignSelf: 'stretch',
    display: 'flex',
    flexShrink: 0
  };
};
var IndicatorsContainer = function IndicatorsContainer(props) {
  var children = props.children,
    innerProps = props.innerProps;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, getStyleProps(props, 'indicatorsContainer', {
    indicators: true
  }), innerProps), children);
};

var _templateObject;
var _excluded$2 = ["size"],
  _excluded2 = ["innerProps", "isRtl", "size"];
function _EMOTION_STRINGIFIED_CSS_ERROR__() { return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop)."; }

// ==============================
// Dropdown & Clear Icons
// ==============================
var _ref2 =  false ? 0 : {
  name: "tj5bde-Svg",
  styles: "display:inline-block;fill:currentColor;line-height:1;stroke:currentColor;stroke-width:0;label:Svg;",
  map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGljYXRvcnMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQXlCSSIsImZpbGUiOiJpbmRpY2F0b3JzLnRzeCIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAanN4IGpzeCAqL1xuaW1wb3J0IHsgUmVhY3ROb2RlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsganN4LCBrZXlmcmFtZXMgfSBmcm9tICdAZW1vdGlvbi9yZWFjdCc7XG5cbmltcG9ydCB7XG4gIENvbW1vblByb3BzQW5kQ2xhc3NOYW1lLFxuICBDU1NPYmplY3RXaXRoTGFiZWwsXG4gIEdyb3VwQmFzZSxcbn0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgZ2V0U3R5bGVQcm9wcyB9IGZyb20gJy4uL3V0aWxzJztcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBEcm9wZG93biAmIENsZWFyIEljb25zXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuY29uc3QgU3ZnID0gKHtcbiAgc2l6ZSxcbiAgLi4ucHJvcHNcbn06IEpTWC5JbnRyaW5zaWNFbGVtZW50c1snc3ZnJ10gJiB7IHNpemU6IG51bWJlciB9KSA9PiAoXG4gIDxzdmdcbiAgICBoZWlnaHQ9e3NpemV9XG4gICAgd2lkdGg9e3NpemV9XG4gICAgdmlld0JveD1cIjAgMCAyMCAyMFwiXG4gICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICBmb2N1c2FibGU9XCJmYWxzZVwiXG4gICAgY3NzPXt7XG4gICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcbiAgICAgIGZpbGw6ICdjdXJyZW50Q29sb3InLFxuICAgICAgbGluZUhlaWdodDogMSxcbiAgICAgIHN0cm9rZTogJ2N1cnJlbnRDb2xvcicsXG4gICAgICBzdHJva2VXaWR0aDogMCxcbiAgICB9fVxuICAgIHsuLi5wcm9wc31cbiAgLz5cbik7XG5cbmV4cG9ydCB0eXBlIENyb3NzSWNvblByb3BzID0gSlNYLkludHJpbnNpY0VsZW1lbnRzWydzdmcnXSAmIHsgc2l6ZT86IG51bWJlciB9O1xuZXhwb3J0IGNvbnN0IENyb3NzSWNvbiA9IChwcm9wczogQ3Jvc3NJY29uUHJvcHMpID0+IChcbiAgPFN2ZyBzaXplPXsyMH0gey4uLnByb3BzfT5cbiAgICA8cGF0aCBkPVwiTTE0LjM0OCAxNC44NDljLTAuNDY5IDAuNDY5LTEuMjI5IDAuNDY5LTEuNjk3IDBsLTIuNjUxLTMuMDMwLTIuNjUxIDMuMDI5Yy0wLjQ2OSAwLjQ2OS0xLjIyOSAwLjQ2OS0xLjY5NyAwLTAuNDY5LTAuNDY5LTAuNDY5LTEuMjI5IDAtMS42OTdsMi43NTgtMy4xNS0yLjc1OS0zLjE1MmMtMC40NjktMC40NjktMC40NjktMS4yMjggMC0xLjY5N3MxLjIyOC0wLjQ2OSAxLjY5NyAwbDIuNjUyIDMuMDMxIDIuNjUxLTMuMDMxYzAuNDY5LTAuNDY5IDEuMjI4LTAuNDY5IDEuNjk3IDBzMC40NjkgMS4yMjkgMCAxLjY5N2wtMi43NTggMy4xNTIgMi43NTggMy4xNWMwLjQ2OSAwLjQ2OSAwLjQ2OSAxLjIyOSAwIDEuNjk4elwiIC8+XG4gIDwvU3ZnPlxuKTtcbmV4cG9ydCB0eXBlIERvd25DaGV2cm9uUHJvcHMgPSBKU1guSW50cmluc2ljRWxlbWVudHNbJ3N2ZyddICYgeyBzaXplPzogbnVtYmVyIH07XG5leHBvcnQgY29uc3QgRG93bkNoZXZyb24gPSAocHJvcHM6IERvd25DaGV2cm9uUHJvcHMpID0+IChcbiAgPFN2ZyBzaXplPXsyMH0gey4uLnByb3BzfT5cbiAgICA8cGF0aCBkPVwiTTQuNTE2IDcuNTQ4YzAuNDM2LTAuNDQ2IDEuMDQzLTAuNDgxIDEuNTc2IDBsMy45MDggMy43NDcgMy45MDgtMy43NDdjMC41MzMtMC40ODEgMS4xNDEtMC40NDYgMS41NzQgMCAwLjQzNiAwLjQ0NSAwLjQwOCAxLjE5NyAwIDEuNjE1LTAuNDA2IDAuNDE4LTQuNjk1IDQuNTAyLTQuNjk1IDQuNTAyLTAuMjE3IDAuMjIzLTAuNTAyIDAuMzM1LTAuNzg3IDAuMzM1cy0wLjU3LTAuMTEyLTAuNzg5LTAuMzM1YzAgMC00LjI4Ny00LjA4NC00LjY5NS00LjUwMnMtMC40MzYtMS4xNyAwLTEuNjE1elwiIC8+XG4gIDwvU3ZnPlxuKTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBEcm9wZG93biAmIENsZWFyIEJ1dHRvbnNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5leHBvcnQgaW50ZXJmYWNlIERyb3Bkb3duSW5kaWNhdG9yUHJvcHM8XG4gIE9wdGlvbiA9IHVua25vd24sXG4gIElzTXVsdGkgZXh0ZW5kcyBib29sZWFuID0gYm9vbGVhbixcbiAgR3JvdXAgZXh0ZW5kcyBHcm91cEJhc2U8T3B0aW9uPiA9IEdyb3VwQmFzZTxPcHRpb24+XG4+IGV4dGVuZHMgQ29tbW9uUHJvcHNBbmRDbGFzc05hbWU8T3B0aW9uLCBJc011bHRpLCBHcm91cD4ge1xuICAvKiogVGhlIGNoaWxkcmVuIHRvIGJlIHJlbmRlcmVkIGluc2lkZSB0aGUgaW5kaWNhdG9yLiAqL1xuICBjaGlsZHJlbj86IFJlYWN0Tm9kZTtcbiAgLyoqIFByb3BzIHRoYXQgd2lsbCBiZSBwYXNzZWQgb24gdG8gdGhlIGNoaWxkcmVuLiAqL1xuICBpbm5lclByb3BzOiBKU1guSW50cmluc2ljRWxlbWVudHNbJ2RpdiddO1xuICAvKiogVGhlIGZvY3VzZWQgc3RhdGUgb2YgdGhlIHNlbGVjdC4gKi9cbiAgaXNGb2N1c2VkOiBib29sZWFuO1xuICBpc0Rpc2FibGVkOiBib29sZWFuO1xufVxuXG5jb25zdCBiYXNlQ1NTID0gPFxuICBPcHRpb24sXG4gIElzTXVsdGkgZXh0ZW5kcyBib29sZWFuLFxuICBHcm91cCBleHRlbmRzIEdyb3VwQmFzZTxPcHRpb24+XG4+KFxuICB7XG4gICAgaXNGb2N1c2VkLFxuICAgIHRoZW1lOiB7XG4gICAgICBzcGFjaW5nOiB7IGJhc2VVbml0IH0sXG4gICAgICBjb2xvcnMsXG4gICAgfSxcbiAgfTpcbiAgICB8IERyb3Bkb3duSW5kaWNhdG9yUHJvcHM8T3B0aW9uLCBJc011bHRpLCBHcm91cD5cbiAgICB8IENsZWFySW5kaWNhdG9yUHJvcHM8T3B0aW9uLCBJc011bHRpLCBHcm91cD4sXG4gIHVuc3R5bGVkOiBib29sZWFuXG4pOiBDU1NPYmplY3RXaXRoTGFiZWwgPT4gKHtcbiAgbGFiZWw6ICdpbmRpY2F0b3JDb250YWluZXInLFxuICBkaXNwbGF5OiAnZmxleCcsXG4gIHRyYW5zaXRpb246ICdjb2xvciAxNTBtcycsXG4gIC4uLih1bnN0eWxlZFxuICAgID8ge31cbiAgICA6IHtcbiAgICAgICAgY29sb3I6IGlzRm9jdXNlZCA/IGNvbG9ycy5uZXV0cmFsNjAgOiBjb2xvcnMubmV1dHJhbDIwLFxuICAgICAgICBwYWRkaW5nOiBiYXNlVW5pdCAqIDIsXG4gICAgICAgICc6aG92ZXInOiB7XG4gICAgICAgICAgY29sb3I6IGlzRm9jdXNlZCA/IGNvbG9ycy5uZXV0cmFsODAgOiBjb2xvcnMubmV1dHJhbDQwLFxuICAgICAgICB9LFxuICAgICAgfSksXG59KTtcblxuZXhwb3J0IGNvbnN0IGRyb3Bkb3duSW5kaWNhdG9yQ1NTID0gYmFzZUNTUztcbmV4cG9ydCBjb25zdCBEcm9wZG93bkluZGljYXRvciA9IDxcbiAgT3B0aW9uLFxuICBJc011bHRpIGV4dGVuZHMgYm9vbGVhbixcbiAgR3JvdXAgZXh0ZW5kcyBHcm91cEJhc2U8T3B0aW9uPlxuPihcbiAgcHJvcHM6IERyb3Bkb3duSW5kaWNhdG9yUHJvcHM8T3B0aW9uLCBJc011bHRpLCBHcm91cD5cbikgPT4ge1xuICBjb25zdCB7IGNoaWxkcmVuLCBpbm5lclByb3BzIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICB7Li4uZ2V0U3R5bGVQcm9wcyhwcm9wcywgJ2Ryb3Bkb3duSW5kaWNhdG9yJywge1xuICAgICAgICBpbmRpY2F0b3I6IHRydWUsXG4gICAgICAgICdkcm9wZG93bi1pbmRpY2F0b3InOiB0cnVlLFxuICAgICAgfSl9XG4gICAgICB7Li4uaW5uZXJQcm9wc31cbiAgICA+XG4gICAgICB7Y2hpbGRyZW4gfHwgPERvd25DaGV2cm9uIC8+fVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuZXhwb3J0IGludGVyZmFjZSBDbGVhckluZGljYXRvclByb3BzPFxuICBPcHRpb24gPSB1bmtub3duLFxuICBJc011bHRpIGV4dGVuZHMgYm9vbGVhbiA9IGJvb2xlYW4sXG4gIEdyb3VwIGV4dGVuZHMgR3JvdXBCYXNlPE9wdGlvbj4gPSBHcm91cEJhc2U8T3B0aW9uPlxuPiBleHRlbmRzIENvbW1vblByb3BzQW5kQ2xhc3NOYW1lPE9wdGlvbiwgSXNNdWx0aSwgR3JvdXA+IHtcbiAgLyoqIFRoZSBjaGlsZHJlbiB0byBiZSByZW5kZXJlZCBpbnNpZGUgdGhlIGluZGljYXRvci4gKi9cbiAgY2hpbGRyZW4/OiBSZWFjdE5vZGU7XG4gIC8qKiBQcm9wcyB0aGF0IHdpbGwgYmUgcGFzc2VkIG9uIHRvIHRoZSBjaGlsZHJlbi4gKi9cbiAgaW5uZXJQcm9wczogSlNYLkludHJpbnNpY0VsZW1lbnRzWydkaXYnXTtcbiAgLyoqIFRoZSBmb2N1c2VkIHN0YXRlIG9mIHRoZSBzZWxlY3QuICovXG4gIGlzRm9jdXNlZDogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNvbnN0IGNsZWFySW5kaWNhdG9yQ1NTID0gYmFzZUNTUztcbmV4cG9ydCBjb25zdCBDbGVhckluZGljYXRvciA9IDxcbiAgT3B0aW9uLFxuICBJc011bHRpIGV4dGVuZHMgYm9vbGVhbixcbiAgR3JvdXAgZXh0ZW5kcyBHcm91cEJhc2U8T3B0aW9uPlxuPihcbiAgcHJvcHM6IENsZWFySW5kaWNhdG9yUHJvcHM8T3B0aW9uLCBJc011bHRpLCBHcm91cD5cbikgPT4ge1xuICBjb25zdCB7IGNoaWxkcmVuLCBpbm5lclByb3BzIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICB7Li4uZ2V0U3R5bGVQcm9wcyhwcm9wcywgJ2NsZWFySW5kaWNhdG9yJywge1xuICAgICAgICBpbmRpY2F0b3I6IHRydWUsXG4gICAgICAgICdjbGVhci1pbmRpY2F0b3InOiB0cnVlLFxuICAgICAgfSl9XG4gICAgICB7Li4uaW5uZXJQcm9wc31cbiAgICA+XG4gICAgICB7Y2hpbGRyZW4gfHwgPENyb3NzSWNvbiAvPn1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gU2VwYXJhdG9yXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZXhwb3J0IGludGVyZmFjZSBJbmRpY2F0b3JTZXBhcmF0b3JQcm9wczxcbiAgT3B0aW9uID0gdW5rbm93bixcbiAgSXNNdWx0aSBleHRlbmRzIGJvb2xlYW4gPSBib29sZWFuLFxuICBHcm91cCBleHRlbmRzIEdyb3VwQmFzZTxPcHRpb24+ID0gR3JvdXBCYXNlPE9wdGlvbj5cbj4gZXh0ZW5kcyBDb21tb25Qcm9wc0FuZENsYXNzTmFtZTxPcHRpb24sIElzTXVsdGksIEdyb3VwPiB7XG4gIGlzRGlzYWJsZWQ6IGJvb2xlYW47XG4gIGlzRm9jdXNlZDogYm9vbGVhbjtcbiAgaW5uZXJQcm9wcz86IEpTWC5JbnRyaW5zaWNFbGVtZW50c1snc3BhbiddO1xufVxuXG5leHBvcnQgY29uc3QgaW5kaWNhdG9yU2VwYXJhdG9yQ1NTID0gPFxuICBPcHRpb24sXG4gIElzTXVsdGkgZXh0ZW5kcyBib29sZWFuLFxuICBHcm91cCBleHRlbmRzIEdyb3VwQmFzZTxPcHRpb24+XG4+KFxuICB7XG4gICAgaXNEaXNhYmxlZCxcbiAgICB0aGVtZToge1xuICAgICAgc3BhY2luZzogeyBiYXNlVW5pdCB9LFxuICAgICAgY29sb3JzLFxuICAgIH0sXG4gIH06IEluZGljYXRvclNlcGFyYXRvclByb3BzPE9wdGlvbiwgSXNNdWx0aSwgR3JvdXA+LFxuICB1bnN0eWxlZDogYm9vbGVhblxuKTogQ1NTT2JqZWN0V2l0aExhYmVsID0+ICh7XG4gIGxhYmVsOiAnaW5kaWNhdG9yU2VwYXJhdG9yJyxcbiAgYWxpZ25TZWxmOiAnc3RyZXRjaCcsXG4gIHdpZHRoOiAxLFxuICAuLi4odW5zdHlsZWRcbiAgICA/IHt9XG4gICAgOiB7XG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogaXNEaXNhYmxlZCA/IGNvbG9ycy5uZXV0cmFsMTAgOiBjb2xvcnMubmV1dHJhbDIwLFxuICAgICAgICBtYXJnaW5Cb3R0b206IGJhc2VVbml0ICogMixcbiAgICAgICAgbWFyZ2luVG9wOiBiYXNlVW5pdCAqIDIsXG4gICAgICB9KSxcbn0pO1xuXG5leHBvcnQgY29uc3QgSW5kaWNhdG9yU2VwYXJhdG9yID0gPFxuICBPcHRpb24sXG4gIElzTXVsdGkgZXh0ZW5kcyBib29sZWFuLFxuICBHcm91cCBleHRlbmRzIEdyb3VwQmFzZTxPcHRpb24+XG4+KFxuICBwcm9wczogSW5kaWNhdG9yU2VwYXJhdG9yUHJvcHM8T3B0aW9uLCBJc011bHRpLCBHcm91cD5cbikgPT4ge1xuICBjb25zdCB7IGlubmVyUHJvcHMgfSA9IHByb3BzO1xuICByZXR1cm4gKFxuICAgIDxzcGFuXG4gICAgICB7Li4uaW5uZXJQcm9wc31cbiAgICAgIHsuLi5nZXRTdHlsZVByb3BzKHByb3BzLCAnaW5kaWNhdG9yU2VwYXJhdG9yJywge1xuICAgICAgICAnaW5kaWNhdG9yLXNlcGFyYXRvcic6IHRydWUsXG4gICAgICB9KX1cbiAgICAvPlxuICApO1xufTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBMb2FkaW5nXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuY29uc3QgbG9hZGluZ0RvdEFuaW1hdGlvbnMgPSBrZXlmcmFtZXNgXG4gIDAlLCA4MCUsIDEwMCUgeyBvcGFjaXR5OiAwOyB9XG4gIDQwJSB7IG9wYWNpdHk6IDE7IH1cbmA7XG5cbmV4cG9ydCBjb25zdCBsb2FkaW5nSW5kaWNhdG9yQ1NTID0gPFxuICBPcHRpb24sXG4gIElzTXVsdGkgZXh0ZW5kcyBib29sZWFuLFxuICBHcm91cCBleHRlbmRzIEdyb3VwQmFzZTxPcHRpb24+XG4+KFxuICB7XG4gICAgaXNGb2N1c2VkLFxuICAgIHNpemUsXG4gICAgdGhlbWU6IHtcbiAgICAgIGNvbG9ycyxcbiAgICAgIHNwYWNpbmc6IHsgYmFzZVVuaXQgfSxcbiAgICB9LFxuICB9OiBMb2FkaW5nSW5kaWNhdG9yUHJvcHM8T3B0aW9uLCBJc011bHRpLCBHcm91cD4sXG4gIHVuc3R5bGVkOiBib29sZWFuXG4pOiBDU1NPYmplY3RXaXRoTGFiZWwgPT4gKHtcbiAgbGFiZWw6ICdsb2FkaW5nSW5kaWNhdG9yJyxcbiAgZGlzcGxheTogJ2ZsZXgnLFxuICB0cmFuc2l0aW9uOiAnY29sb3IgMTUwbXMnLFxuICBhbGlnblNlbGY6ICdjZW50ZXInLFxuICBmb250U2l6ZTogc2l6ZSxcbiAgbGluZUhlaWdodDogMSxcbiAgbWFyZ2luUmlnaHQ6IHNpemUsXG4gIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnLFxuICAuLi4odW5zdHlsZWRcbiAgICA/IHt9XG4gICAgOiB7XG4gICAgICAgIGNvbG9yOiBpc0ZvY3VzZWQgPyBjb2xvcnMubmV1dHJhbDYwIDogY29sb3JzLm5ldXRyYWwyMCxcbiAgICAgICAgcGFkZGluZzogYmFzZVVuaXQgKiAyLFxuICAgICAgfSksXG59KTtcblxuaW50ZXJmYWNlIExvYWRpbmdEb3RQcm9wcyB7XG4gIGRlbGF5OiBudW1iZXI7XG4gIG9mZnNldDogYm9vbGVhbjtcbn1cbmNvbnN0IExvYWRpbmdEb3QgPSAoeyBkZWxheSwgb2Zmc2V0IH06IExvYWRpbmdEb3RQcm9wcykgPT4gKFxuICA8c3BhblxuICAgIGNzcz17e1xuICAgICAgYW5pbWF0aW9uOiBgJHtsb2FkaW5nRG90QW5pbWF0aW9uc30gMXMgZWFzZS1pbi1vdXQgJHtkZWxheX1tcyBpbmZpbml0ZTtgLFxuICAgICAgYmFja2dyb3VuZENvbG9yOiAnY3VycmVudENvbG9yJyxcbiAgICAgIGJvcmRlclJhZGl1czogJzFlbScsXG4gICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcbiAgICAgIG1hcmdpbkxlZnQ6IG9mZnNldCA/ICcxZW0nIDogdW5kZWZpbmVkLFxuICAgICAgaGVpZ2h0OiAnMWVtJyxcbiAgICAgIHZlcnRpY2FsQWxpZ246ICd0b3AnLFxuICAgICAgd2lkdGg6ICcxZW0nLFxuICAgIH19XG4gIC8+XG4pO1xuXG5leHBvcnQgaW50ZXJmYWNlIExvYWRpbmdJbmRpY2F0b3JQcm9wczxcbiAgT3B0aW9uID0gdW5rbm93bixcbiAgSXNNdWx0aSBleHRlbmRzIGJvb2xlYW4gPSBib29sZWFuLFxuICBHcm91cCBleHRlbmRzIEdyb3VwQmFzZTxPcHRpb24+ID0gR3JvdXBCYXNlPE9wdGlvbj5cbj4gZXh0ZW5kcyBDb21tb25Qcm9wc0FuZENsYXNzTmFtZTxPcHRpb24sIElzTXVsdGksIEdyb3VwPiB7XG4gIC8qKiBQcm9wcyB0aGF0IHdpbGwgYmUgcGFzc2VkIG9uIHRvIHRoZSBjaGlsZHJlbi4gKi9cbiAgaW5uZXJQcm9wczogSlNYLkludHJpbnNpY0VsZW1lbnRzWydkaXYnXTtcbiAgLyoqIFRoZSBmb2N1c2VkIHN0YXRlIG9mIHRoZSBzZWxlY3QuICovXG4gIGlzRm9jdXNlZDogYm9vbGVhbjtcbiAgaXNEaXNhYmxlZDogYm9vbGVhbjtcbiAgLyoqIFNldCBzaXplIG9mIHRoZSBjb250YWluZXIuICovXG4gIHNpemU6IG51bWJlcjtcbn1cbmV4cG9ydCBjb25zdCBMb2FkaW5nSW5kaWNhdG9yID0gPFxuICBPcHRpb24sXG4gIElzTXVsdGkgZXh0ZW5kcyBib29sZWFuLFxuICBHcm91cCBleHRlbmRzIEdyb3VwQmFzZTxPcHRpb24+XG4+KHtcbiAgaW5uZXJQcm9wcyxcbiAgaXNSdGwsXG4gIHNpemUgPSA0LFxuICAuLi5yZXN0UHJvcHNcbn06IExvYWRpbmdJbmRpY2F0b3JQcm9wczxPcHRpb24sIElzTXVsdGksIEdyb3VwPikgPT4ge1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIHsuLi5nZXRTdHlsZVByb3BzKFxuICAgICAgICB7IC4uLnJlc3RQcm9wcywgaW5uZXJQcm9wcywgaXNSdGwsIHNpemUgfSxcbiAgICAgICAgJ2xvYWRpbmdJbmRpY2F0b3InLFxuICAgICAgICB7XG4gICAgICAgICAgaW5kaWNhdG9yOiB0cnVlLFxuICAgICAgICAgICdsb2FkaW5nLWluZGljYXRvcic6IHRydWUsXG4gICAgICAgIH1cbiAgICAgICl9XG4gICAgICB7Li4uaW5uZXJQcm9wc31cbiAgICA+XG4gICAgICA8TG9hZGluZ0RvdCBkZWxheT17MH0gb2Zmc2V0PXtpc1J0bH0gLz5cbiAgICAgIDxMb2FkaW5nRG90IGRlbGF5PXsxNjB9IG9mZnNldCAvPlxuICAgICAgPExvYWRpbmdEb3QgZGVsYXk9ezMyMH0gb2Zmc2V0PXshaXNSdGx9IC8+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuIl19 */",
  toString: _EMOTION_STRINGIFIED_CSS_ERROR__
};
var Svg = function Svg(_ref) {
  var size = _ref.size,
    props = (0,_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_3__["default"])(_ref, _excluded$2);
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)("svg", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({
    height: size,
    width: size,
    viewBox: "0 0 20 20",
    "aria-hidden": "true",
    focusable: "false",
    css: _ref2
  }, props));
};
var CrossIcon = function CrossIcon(props) {
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)(Svg, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({
    size: 20
  }, props), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)("path", {
    d: "M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"
  }));
};
var DownChevron = function DownChevron(props) {
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)(Svg, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({
    size: 20
  }, props), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)("path", {
    d: "M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"
  }));
};

// ==============================
// Dropdown & Clear Buttons
// ==============================

var baseCSS = function baseCSS(_ref3, unstyled) {
  var isFocused = _ref3.isFocused,
    _ref3$theme = _ref3.theme,
    baseUnit = _ref3$theme.spacing.baseUnit,
    colors = _ref3$theme.colors;
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({
    label: 'indicatorContainer',
    display: 'flex',
    transition: 'color 150ms'
  }, unstyled ? {} : {
    color: isFocused ? colors.neutral60 : colors.neutral20,
    padding: baseUnit * 2,
    ':hover': {
      color: isFocused ? colors.neutral80 : colors.neutral40
    }
  });
};
var dropdownIndicatorCSS = baseCSS;
var DropdownIndicator = function DropdownIndicator(props) {
  var children = props.children,
    innerProps = props.innerProps;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, getStyleProps(props, 'dropdownIndicator', {
    indicator: true,
    'dropdown-indicator': true
  }), innerProps), children || (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)(DownChevron, null));
};
var clearIndicatorCSS = baseCSS;
var ClearIndicator = function ClearIndicator(props) {
  var children = props.children,
    innerProps = props.innerProps;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, getStyleProps(props, 'clearIndicator', {
    indicator: true,
    'clear-indicator': true
  }), innerProps), children || (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)(CrossIcon, null));
};

// ==============================
// Separator
// ==============================

var indicatorSeparatorCSS = function indicatorSeparatorCSS(_ref4, unstyled) {
  var isDisabled = _ref4.isDisabled,
    _ref4$theme = _ref4.theme,
    baseUnit = _ref4$theme.spacing.baseUnit,
    colors = _ref4$theme.colors;
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({
    label: 'indicatorSeparator',
    alignSelf: 'stretch',
    width: 1
  }, unstyled ? {} : {
    backgroundColor: isDisabled ? colors.neutral10 : colors.neutral20,
    marginBottom: baseUnit * 2,
    marginTop: baseUnit * 2
  });
};
var IndicatorSeparator = function IndicatorSeparator(props) {
  var innerProps = props.innerProps;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)("span", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, innerProps, getStyleProps(props, 'indicatorSeparator', {
    'indicator-separator': true
  })));
};

// ==============================
// Loading
// ==============================

var loadingDotAnimations = (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.keyframes)(_templateObject || (_templateObject = (0,_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_5__["default"])(["\n  0%, 80%, 100% { opacity: 0; }\n  40% { opacity: 1; }\n"])));
var loadingIndicatorCSS = function loadingIndicatorCSS(_ref5, unstyled) {
  var isFocused = _ref5.isFocused,
    size = _ref5.size,
    _ref5$theme = _ref5.theme,
    colors = _ref5$theme.colors,
    baseUnit = _ref5$theme.spacing.baseUnit;
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({
    label: 'loadingIndicator',
    display: 'flex',
    transition: 'color 150ms',
    alignSelf: 'center',
    fontSize: size,
    lineHeight: 1,
    marginRight: size,
    textAlign: 'center',
    verticalAlign: 'middle'
  }, unstyled ? {} : {
    color: isFocused ? colors.neutral60 : colors.neutral20,
    padding: baseUnit * 2
  });
};
var LoadingDot = function LoadingDot(_ref6) {
  var delay = _ref6.delay,
    offset = _ref6.offset;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)("span", {
    css: /*#__PURE__*/(0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.css)({
      animation: "".concat(loadingDotAnimations, " 1s ease-in-out ").concat(delay, "ms infinite;"),
      backgroundColor: 'currentColor',
      borderRadius: '1em',
      display: 'inline-block',
      marginLeft: offset ? '1em' : undefined,
      height: '1em',
      verticalAlign: 'top',
      width: '1em'
    },  false ? 0 : ";label:LoadingDot;",  false ? 0 : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGljYXRvcnMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQW1RSSIsImZpbGUiOiJpbmRpY2F0b3JzLnRzeCIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAanN4IGpzeCAqL1xuaW1wb3J0IHsgUmVhY3ROb2RlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsganN4LCBrZXlmcmFtZXMgfSBmcm9tICdAZW1vdGlvbi9yZWFjdCc7XG5cbmltcG9ydCB7XG4gIENvbW1vblByb3BzQW5kQ2xhc3NOYW1lLFxuICBDU1NPYmplY3RXaXRoTGFiZWwsXG4gIEdyb3VwQmFzZSxcbn0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgZ2V0U3R5bGVQcm9wcyB9IGZyb20gJy4uL3V0aWxzJztcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBEcm9wZG93biAmIENsZWFyIEljb25zXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuY29uc3QgU3ZnID0gKHtcbiAgc2l6ZSxcbiAgLi4ucHJvcHNcbn06IEpTWC5JbnRyaW5zaWNFbGVtZW50c1snc3ZnJ10gJiB7IHNpemU6IG51bWJlciB9KSA9PiAoXG4gIDxzdmdcbiAgICBoZWlnaHQ9e3NpemV9XG4gICAgd2lkdGg9e3NpemV9XG4gICAgdmlld0JveD1cIjAgMCAyMCAyMFwiXG4gICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICBmb2N1c2FibGU9XCJmYWxzZVwiXG4gICAgY3NzPXt7XG4gICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcbiAgICAgIGZpbGw6ICdjdXJyZW50Q29sb3InLFxuICAgICAgbGluZUhlaWdodDogMSxcbiAgICAgIHN0cm9rZTogJ2N1cnJlbnRDb2xvcicsXG4gICAgICBzdHJva2VXaWR0aDogMCxcbiAgICB9fVxuICAgIHsuLi5wcm9wc31cbiAgLz5cbik7XG5cbmV4cG9ydCB0eXBlIENyb3NzSWNvblByb3BzID0gSlNYLkludHJpbnNpY0VsZW1lbnRzWydzdmcnXSAmIHsgc2l6ZT86IG51bWJlciB9O1xuZXhwb3J0IGNvbnN0IENyb3NzSWNvbiA9IChwcm9wczogQ3Jvc3NJY29uUHJvcHMpID0+IChcbiAgPFN2ZyBzaXplPXsyMH0gey4uLnByb3BzfT5cbiAgICA8cGF0aCBkPVwiTTE0LjM0OCAxNC44NDljLTAuNDY5IDAuNDY5LTEuMjI5IDAuNDY5LTEuNjk3IDBsLTIuNjUxLTMuMDMwLTIuNjUxIDMuMDI5Yy0wLjQ2OSAwLjQ2OS0xLjIyOSAwLjQ2OS0xLjY5NyAwLTAuNDY5LTAuNDY5LTAuNDY5LTEuMjI5IDAtMS42OTdsMi43NTgtMy4xNS0yLjc1OS0zLjE1MmMtMC40NjktMC40NjktMC40NjktMS4yMjggMC0xLjY5N3MxLjIyOC0wLjQ2OSAxLjY5NyAwbDIuNjUyIDMuMDMxIDIuNjUxLTMuMDMxYzAuNDY5LTAuNDY5IDEuMjI4LTAuNDY5IDEuNjk3IDBzMC40NjkgMS4yMjkgMCAxLjY5N2wtMi43NTggMy4xNTIgMi43NTggMy4xNWMwLjQ2OSAwLjQ2OSAwLjQ2OSAxLjIyOSAwIDEuNjk4elwiIC8+XG4gIDwvU3ZnPlxuKTtcbmV4cG9ydCB0eXBlIERvd25DaGV2cm9uUHJvcHMgPSBKU1guSW50cmluc2ljRWxlbWVudHNbJ3N2ZyddICYgeyBzaXplPzogbnVtYmVyIH07XG5leHBvcnQgY29uc3QgRG93bkNoZXZyb24gPSAocHJvcHM6IERvd25DaGV2cm9uUHJvcHMpID0+IChcbiAgPFN2ZyBzaXplPXsyMH0gey4uLnByb3BzfT5cbiAgICA8cGF0aCBkPVwiTTQuNTE2IDcuNTQ4YzAuNDM2LTAuNDQ2IDEuMDQzLTAuNDgxIDEuNTc2IDBsMy45MDggMy43NDcgMy45MDgtMy43NDdjMC41MzMtMC40ODEgMS4xNDEtMC40NDYgMS41NzQgMCAwLjQzNiAwLjQ0NSAwLjQwOCAxLjE5NyAwIDEuNjE1LTAuNDA2IDAuNDE4LTQuNjk1IDQuNTAyLTQuNjk1IDQuNTAyLTAuMjE3IDAuMjIzLTAuNTAyIDAuMzM1LTAuNzg3IDAuMzM1cy0wLjU3LTAuMTEyLTAuNzg5LTAuMzM1YzAgMC00LjI4Ny00LjA4NC00LjY5NS00LjUwMnMtMC40MzYtMS4xNyAwLTEuNjE1elwiIC8+XG4gIDwvU3ZnPlxuKTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBEcm9wZG93biAmIENsZWFyIEJ1dHRvbnNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5leHBvcnQgaW50ZXJmYWNlIERyb3Bkb3duSW5kaWNhdG9yUHJvcHM8XG4gIE9wdGlvbiA9IHVua25vd24sXG4gIElzTXVsdGkgZXh0ZW5kcyBib29sZWFuID0gYm9vbGVhbixcbiAgR3JvdXAgZXh0ZW5kcyBHcm91cEJhc2U8T3B0aW9uPiA9IEdyb3VwQmFzZTxPcHRpb24+XG4+IGV4dGVuZHMgQ29tbW9uUHJvcHNBbmRDbGFzc05hbWU8T3B0aW9uLCBJc011bHRpLCBHcm91cD4ge1xuICAvKiogVGhlIGNoaWxkcmVuIHRvIGJlIHJlbmRlcmVkIGluc2lkZSB0aGUgaW5kaWNhdG9yLiAqL1xuICBjaGlsZHJlbj86IFJlYWN0Tm9kZTtcbiAgLyoqIFByb3BzIHRoYXQgd2lsbCBiZSBwYXNzZWQgb24gdG8gdGhlIGNoaWxkcmVuLiAqL1xuICBpbm5lclByb3BzOiBKU1guSW50cmluc2ljRWxlbWVudHNbJ2RpdiddO1xuICAvKiogVGhlIGZvY3VzZWQgc3RhdGUgb2YgdGhlIHNlbGVjdC4gKi9cbiAgaXNGb2N1c2VkOiBib29sZWFuO1xuICBpc0Rpc2FibGVkOiBib29sZWFuO1xufVxuXG5jb25zdCBiYXNlQ1NTID0gPFxuICBPcHRpb24sXG4gIElzTXVsdGkgZXh0ZW5kcyBib29sZWFuLFxuICBHcm91cCBleHRlbmRzIEdyb3VwQmFzZTxPcHRpb24+XG4+KFxuICB7XG4gICAgaXNGb2N1c2VkLFxuICAgIHRoZW1lOiB7XG4gICAgICBzcGFjaW5nOiB7IGJhc2VVbml0IH0sXG4gICAgICBjb2xvcnMsXG4gICAgfSxcbiAgfTpcbiAgICB8IERyb3Bkb3duSW5kaWNhdG9yUHJvcHM8T3B0aW9uLCBJc011bHRpLCBHcm91cD5cbiAgICB8IENsZWFySW5kaWNhdG9yUHJvcHM8T3B0aW9uLCBJc011bHRpLCBHcm91cD4sXG4gIHVuc3R5bGVkOiBib29sZWFuXG4pOiBDU1NPYmplY3RXaXRoTGFiZWwgPT4gKHtcbiAgbGFiZWw6ICdpbmRpY2F0b3JDb250YWluZXInLFxuICBkaXNwbGF5OiAnZmxleCcsXG4gIHRyYW5zaXRpb246ICdjb2xvciAxNTBtcycsXG4gIC4uLih1bnN0eWxlZFxuICAgID8ge31cbiAgICA6IHtcbiAgICAgICAgY29sb3I6IGlzRm9jdXNlZCA/IGNvbG9ycy5uZXV0cmFsNjAgOiBjb2xvcnMubmV1dHJhbDIwLFxuICAgICAgICBwYWRkaW5nOiBiYXNlVW5pdCAqIDIsXG4gICAgICAgICc6aG92ZXInOiB7XG4gICAgICAgICAgY29sb3I6IGlzRm9jdXNlZCA/IGNvbG9ycy5uZXV0cmFsODAgOiBjb2xvcnMubmV1dHJhbDQwLFxuICAgICAgICB9LFxuICAgICAgfSksXG59KTtcblxuZXhwb3J0IGNvbnN0IGRyb3Bkb3duSW5kaWNhdG9yQ1NTID0gYmFzZUNTUztcbmV4cG9ydCBjb25zdCBEcm9wZG93bkluZGljYXRvciA9IDxcbiAgT3B0aW9uLFxuICBJc011bHRpIGV4dGVuZHMgYm9vbGVhbixcbiAgR3JvdXAgZXh0ZW5kcyBHcm91cEJhc2U8T3B0aW9uPlxuPihcbiAgcHJvcHM6IERyb3Bkb3duSW5kaWNhdG9yUHJvcHM8T3B0aW9uLCBJc011bHRpLCBHcm91cD5cbikgPT4ge1xuICBjb25zdCB7IGNoaWxkcmVuLCBpbm5lclByb3BzIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICB7Li4uZ2V0U3R5bGVQcm9wcyhwcm9wcywgJ2Ryb3Bkb3duSW5kaWNhdG9yJywge1xuICAgICAgICBpbmRpY2F0b3I6IHRydWUsXG4gICAgICAgICdkcm9wZG93bi1pbmRpY2F0b3InOiB0cnVlLFxuICAgICAgfSl9XG4gICAgICB7Li4uaW5uZXJQcm9wc31cbiAgICA+XG4gICAgICB7Y2hpbGRyZW4gfHwgPERvd25DaGV2cm9uIC8+fVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuZXhwb3J0IGludGVyZmFjZSBDbGVhckluZGljYXRvclByb3BzPFxuICBPcHRpb24gPSB1bmtub3duLFxuICBJc011bHRpIGV4dGVuZHMgYm9vbGVhbiA9IGJvb2xlYW4sXG4gIEdyb3VwIGV4dGVuZHMgR3JvdXBCYXNlPE9wdGlvbj4gPSBHcm91cEJhc2U8T3B0aW9uPlxuPiBleHRlbmRzIENvbW1vblByb3BzQW5kQ2xhc3NOYW1lPE9wdGlvbiwgSXNNdWx0aSwgR3JvdXA+IHtcbiAgLyoqIFRoZSBjaGlsZHJlbiB0byBiZSByZW5kZXJlZCBpbnNpZGUgdGhlIGluZGljYXRvci4gKi9cbiAgY2hpbGRyZW4/OiBSZWFjdE5vZGU7XG4gIC8qKiBQcm9wcyB0aGF0IHdpbGwgYmUgcGFzc2VkIG9uIHRvIHRoZSBjaGlsZHJlbi4gKi9cbiAgaW5uZXJQcm9wczogSlNYLkludHJpbnNpY0VsZW1lbnRzWydkaXYnXTtcbiAgLyoqIFRoZSBmb2N1c2VkIHN0YXRlIG9mIHRoZSBzZWxlY3QuICovXG4gIGlzRm9jdXNlZDogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNvbnN0IGNsZWFySW5kaWNhdG9yQ1NTID0gYmFzZUNTUztcbmV4cG9ydCBjb25zdCBDbGVhckluZGljYXRvciA9IDxcbiAgT3B0aW9uLFxuICBJc011bHRpIGV4dGVuZHMgYm9vbGVhbixcbiAgR3JvdXAgZXh0ZW5kcyBHcm91cEJhc2U8T3B0aW9uPlxuPihcbiAgcHJvcHM6IENsZWFySW5kaWNhdG9yUHJvcHM8T3B0aW9uLCBJc011bHRpLCBHcm91cD5cbikgPT4ge1xuICBjb25zdCB7IGNoaWxkcmVuLCBpbm5lclByb3BzIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICB7Li4uZ2V0U3R5bGVQcm9wcyhwcm9wcywgJ2NsZWFySW5kaWNhdG9yJywge1xuICAgICAgICBpbmRpY2F0b3I6IHRydWUsXG4gICAgICAgICdjbGVhci1pbmRpY2F0b3InOiB0cnVlLFxuICAgICAgfSl9XG4gICAgICB7Li4uaW5uZXJQcm9wc31cbiAgICA+XG4gICAgICB7Y2hpbGRyZW4gfHwgPENyb3NzSWNvbiAvPn1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gU2VwYXJhdG9yXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZXhwb3J0IGludGVyZmFjZSBJbmRpY2F0b3JTZXBhcmF0b3JQcm9wczxcbiAgT3B0aW9uID0gdW5rbm93bixcbiAgSXNNdWx0aSBleHRlbmRzIGJvb2xlYW4gPSBib29sZWFuLFxuICBHcm91cCBleHRlbmRzIEdyb3VwQmFzZTxPcHRpb24+ID0gR3JvdXBCYXNlPE9wdGlvbj5cbj4gZXh0ZW5kcyBDb21tb25Qcm9wc0FuZENsYXNzTmFtZTxPcHRpb24sIElzTXVsdGksIEdyb3VwPiB7XG4gIGlzRGlzYWJsZWQ6IGJvb2xlYW47XG4gIGlzRm9jdXNlZDogYm9vbGVhbjtcbiAgaW5uZXJQcm9wcz86IEpTWC5JbnRyaW5zaWNFbGVtZW50c1snc3BhbiddO1xufVxuXG5leHBvcnQgY29uc3QgaW5kaWNhdG9yU2VwYXJhdG9yQ1NTID0gPFxuICBPcHRpb24sXG4gIElzTXVsdGkgZXh0ZW5kcyBib29sZWFuLFxuICBHcm91cCBleHRlbmRzIEdyb3VwQmFzZTxPcHRpb24+XG4+KFxuICB7XG4gICAgaXNEaXNhYmxlZCxcbiAgICB0aGVtZToge1xuICAgICAgc3BhY2luZzogeyBiYXNlVW5pdCB9LFxuICAgICAgY29sb3JzLFxuICAgIH0sXG4gIH06IEluZGljYXRvclNlcGFyYXRvclByb3BzPE9wdGlvbiwgSXNNdWx0aSwgR3JvdXA+LFxuICB1bnN0eWxlZDogYm9vbGVhblxuKTogQ1NTT2JqZWN0V2l0aExhYmVsID0+ICh7XG4gIGxhYmVsOiAnaW5kaWNhdG9yU2VwYXJhdG9yJyxcbiAgYWxpZ25TZWxmOiAnc3RyZXRjaCcsXG4gIHdpZHRoOiAxLFxuICAuLi4odW5zdHlsZWRcbiAgICA/IHt9XG4gICAgOiB7XG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogaXNEaXNhYmxlZCA/IGNvbG9ycy5uZXV0cmFsMTAgOiBjb2xvcnMubmV1dHJhbDIwLFxuICAgICAgICBtYXJnaW5Cb3R0b206IGJhc2VVbml0ICogMixcbiAgICAgICAgbWFyZ2luVG9wOiBiYXNlVW5pdCAqIDIsXG4gICAgICB9KSxcbn0pO1xuXG5leHBvcnQgY29uc3QgSW5kaWNhdG9yU2VwYXJhdG9yID0gPFxuICBPcHRpb24sXG4gIElzTXVsdGkgZXh0ZW5kcyBib29sZWFuLFxuICBHcm91cCBleHRlbmRzIEdyb3VwQmFzZTxPcHRpb24+XG4+KFxuICBwcm9wczogSW5kaWNhdG9yU2VwYXJhdG9yUHJvcHM8T3B0aW9uLCBJc011bHRpLCBHcm91cD5cbikgPT4ge1xuICBjb25zdCB7IGlubmVyUHJvcHMgfSA9IHByb3BzO1xuICByZXR1cm4gKFxuICAgIDxzcGFuXG4gICAgICB7Li4uaW5uZXJQcm9wc31cbiAgICAgIHsuLi5nZXRTdHlsZVByb3BzKHByb3BzLCAnaW5kaWNhdG9yU2VwYXJhdG9yJywge1xuICAgICAgICAnaW5kaWNhdG9yLXNlcGFyYXRvcic6IHRydWUsXG4gICAgICB9KX1cbiAgICAvPlxuICApO1xufTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBMb2FkaW5nXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuY29uc3QgbG9hZGluZ0RvdEFuaW1hdGlvbnMgPSBrZXlmcmFtZXNgXG4gIDAlLCA4MCUsIDEwMCUgeyBvcGFjaXR5OiAwOyB9XG4gIDQwJSB7IG9wYWNpdHk6IDE7IH1cbmA7XG5cbmV4cG9ydCBjb25zdCBsb2FkaW5nSW5kaWNhdG9yQ1NTID0gPFxuICBPcHRpb24sXG4gIElzTXVsdGkgZXh0ZW5kcyBib29sZWFuLFxuICBHcm91cCBleHRlbmRzIEdyb3VwQmFzZTxPcHRpb24+XG4+KFxuICB7XG4gICAgaXNGb2N1c2VkLFxuICAgIHNpemUsXG4gICAgdGhlbWU6IHtcbiAgICAgIGNvbG9ycyxcbiAgICAgIHNwYWNpbmc6IHsgYmFzZVVuaXQgfSxcbiAgICB9LFxuICB9OiBMb2FkaW5nSW5kaWNhdG9yUHJvcHM8T3B0aW9uLCBJc011bHRpLCBHcm91cD4sXG4gIHVuc3R5bGVkOiBib29sZWFuXG4pOiBDU1NPYmplY3RXaXRoTGFiZWwgPT4gKHtcbiAgbGFiZWw6ICdsb2FkaW5nSW5kaWNhdG9yJyxcbiAgZGlzcGxheTogJ2ZsZXgnLFxuICB0cmFuc2l0aW9uOiAnY29sb3IgMTUwbXMnLFxuICBhbGlnblNlbGY6ICdjZW50ZXInLFxuICBmb250U2l6ZTogc2l6ZSxcbiAgbGluZUhlaWdodDogMSxcbiAgbWFyZ2luUmlnaHQ6IHNpemUsXG4gIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnLFxuICAuLi4odW5zdHlsZWRcbiAgICA/IHt9XG4gICAgOiB7XG4gICAgICAgIGNvbG9yOiBpc0ZvY3VzZWQgPyBjb2xvcnMubmV1dHJhbDYwIDogY29sb3JzLm5ldXRyYWwyMCxcbiAgICAgICAgcGFkZGluZzogYmFzZVVuaXQgKiAyLFxuICAgICAgfSksXG59KTtcblxuaW50ZXJmYWNlIExvYWRpbmdEb3RQcm9wcyB7XG4gIGRlbGF5OiBudW1iZXI7XG4gIG9mZnNldDogYm9vbGVhbjtcbn1cbmNvbnN0IExvYWRpbmdEb3QgPSAoeyBkZWxheSwgb2Zmc2V0IH06IExvYWRpbmdEb3RQcm9wcykgPT4gKFxuICA8c3BhblxuICAgIGNzcz17e1xuICAgICAgYW5pbWF0aW9uOiBgJHtsb2FkaW5nRG90QW5pbWF0aW9uc30gMXMgZWFzZS1pbi1vdXQgJHtkZWxheX1tcyBpbmZpbml0ZTtgLFxuICAgICAgYmFja2dyb3VuZENvbG9yOiAnY3VycmVudENvbG9yJyxcbiAgICAgIGJvcmRlclJhZGl1czogJzFlbScsXG4gICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcbiAgICAgIG1hcmdpbkxlZnQ6IG9mZnNldCA/ICcxZW0nIDogdW5kZWZpbmVkLFxuICAgICAgaGVpZ2h0OiAnMWVtJyxcbiAgICAgIHZlcnRpY2FsQWxpZ246ICd0b3AnLFxuICAgICAgd2lkdGg6ICcxZW0nLFxuICAgIH19XG4gIC8+XG4pO1xuXG5leHBvcnQgaW50ZXJmYWNlIExvYWRpbmdJbmRpY2F0b3JQcm9wczxcbiAgT3B0aW9uID0gdW5rbm93bixcbiAgSXNNdWx0aSBleHRlbmRzIGJvb2xlYW4gPSBib29sZWFuLFxuICBHcm91cCBleHRlbmRzIEdyb3VwQmFzZTxPcHRpb24+ID0gR3JvdXBCYXNlPE9wdGlvbj5cbj4gZXh0ZW5kcyBDb21tb25Qcm9wc0FuZENsYXNzTmFtZTxPcHRpb24sIElzTXVsdGksIEdyb3VwPiB7XG4gIC8qKiBQcm9wcyB0aGF0IHdpbGwgYmUgcGFzc2VkIG9uIHRvIHRoZSBjaGlsZHJlbi4gKi9cbiAgaW5uZXJQcm9wczogSlNYLkludHJpbnNpY0VsZW1lbnRzWydkaXYnXTtcbiAgLyoqIFRoZSBmb2N1c2VkIHN0YXRlIG9mIHRoZSBzZWxlY3QuICovXG4gIGlzRm9jdXNlZDogYm9vbGVhbjtcbiAgaXNEaXNhYmxlZDogYm9vbGVhbjtcbiAgLyoqIFNldCBzaXplIG9mIHRoZSBjb250YWluZXIuICovXG4gIHNpemU6IG51bWJlcjtcbn1cbmV4cG9ydCBjb25zdCBMb2FkaW5nSW5kaWNhdG9yID0gPFxuICBPcHRpb24sXG4gIElzTXVsdGkgZXh0ZW5kcyBib29sZWFuLFxuICBHcm91cCBleHRlbmRzIEdyb3VwQmFzZTxPcHRpb24+XG4+KHtcbiAgaW5uZXJQcm9wcyxcbiAgaXNSdGwsXG4gIHNpemUgPSA0LFxuICAuLi5yZXN0UHJvcHNcbn06IExvYWRpbmdJbmRpY2F0b3JQcm9wczxPcHRpb24sIElzTXVsdGksIEdyb3VwPikgPT4ge1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIHsuLi5nZXRTdHlsZVByb3BzKFxuICAgICAgICB7IC4uLnJlc3RQcm9wcywgaW5uZXJQcm9wcywgaXNSdGwsIHNpemUgfSxcbiAgICAgICAgJ2xvYWRpbmdJbmRpY2F0b3InLFxuICAgICAgICB7XG4gICAgICAgICAgaW5kaWNhdG9yOiB0cnVlLFxuICAgICAgICAgICdsb2FkaW5nLWluZGljYXRvcic6IHRydWUsXG4gICAgICAgIH1cbiAgICAgICl9XG4gICAgICB7Li4uaW5uZXJQcm9wc31cbiAgICA+XG4gICAgICA8TG9hZGluZ0RvdCBkZWxheT17MH0gb2Zmc2V0PXtpc1J0bH0gLz5cbiAgICAgIDxMb2FkaW5nRG90IGRlbGF5PXsxNjB9IG9mZnNldCAvPlxuICAgICAgPExvYWRpbmdEb3QgZGVsYXk9ezMyMH0gb2Zmc2V0PXshaXNSdGx9IC8+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuIl19 */")
  });
};
var LoadingIndicator = function LoadingIndicator(_ref7) {
  var innerProps = _ref7.innerProps,
    isRtl = _ref7.isRtl,
    _ref7$size = _ref7.size,
    size = _ref7$size === void 0 ? 4 : _ref7$size,
    restProps = (0,_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_3__["default"])(_ref7, _excluded2);
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, getStyleProps((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({}, restProps), {}, {
    innerProps: innerProps,
    isRtl: isRtl,
    size: size
  }), 'loadingIndicator', {
    indicator: true,
    'loading-indicator': true
  }), innerProps), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)(LoadingDot, {
    delay: 0,
    offset: isRtl
  }), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)(LoadingDot, {
    delay: 160,
    offset: true
  }), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)(LoadingDot, {
    delay: 320,
    offset: !isRtl
  }));
};

var css$1 = function css(_ref, unstyled) {
  var isDisabled = _ref.isDisabled,
    isFocused = _ref.isFocused,
    _ref$theme = _ref.theme,
    colors = _ref$theme.colors,
    borderRadius = _ref$theme.borderRadius,
    spacing = _ref$theme.spacing;
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({
    label: 'control',
    alignItems: 'center',
    cursor: 'default',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    minHeight: spacing.controlHeight,
    outline: '0 !important',
    position: 'relative',
    transition: 'all 100ms'
  }, unstyled ? {} : {
    backgroundColor: isDisabled ? colors.neutral5 : colors.neutral0,
    borderColor: isDisabled ? colors.neutral10 : isFocused ? colors.primary : colors.neutral20,
    borderRadius: borderRadius,
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: isFocused ? "0 0 0 1px ".concat(colors.primary) : undefined,
    '&:hover': {
      borderColor: isFocused ? colors.primary : colors.neutral30
    }
  });
};
var Control = function Control(props) {
  var children = props.children,
    isDisabled = props.isDisabled,
    isFocused = props.isFocused,
    innerRef = props.innerRef,
    innerProps = props.innerProps,
    menuIsOpen = props.menuIsOpen;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({
    ref: innerRef
  }, getStyleProps(props, 'control', {
    control: true,
    'control--is-disabled': isDisabled,
    'control--is-focused': isFocused,
    'control--menu-is-open': menuIsOpen
  }), innerProps, {
    "aria-disabled": isDisabled || undefined
  }), children);
};
var Control$1 = Control;

var _excluded$1 = ["data"];
var groupCSS = function groupCSS(_ref, unstyled) {
  var spacing = _ref.theme.spacing;
  return unstyled ? {} : {
    paddingBottom: spacing.baseUnit * 2,
    paddingTop: spacing.baseUnit * 2
  };
};
var Group = function Group(props) {
  var children = props.children,
    cx = props.cx,
    getStyles = props.getStyles,
    getClassNames = props.getClassNames,
    Heading = props.Heading,
    headingProps = props.headingProps,
    innerProps = props.innerProps,
    label = props.label,
    theme = props.theme,
    selectProps = props.selectProps;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, getStyleProps(props, 'group', {
    group: true
  }), innerProps), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)(Heading, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, headingProps, {
    selectProps: selectProps,
    theme: theme,
    getStyles: getStyles,
    getClassNames: getClassNames,
    cx: cx
  }), label), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", null, children));
};
var groupHeadingCSS = function groupHeadingCSS(_ref2, unstyled) {
  var _ref2$theme = _ref2.theme,
    colors = _ref2$theme.colors,
    spacing = _ref2$theme.spacing;
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({
    label: 'group',
    cursor: 'default',
    display: 'block'
  }, unstyled ? {} : {
    color: colors.neutral40,
    fontSize: '75%',
    fontWeight: 500,
    marginBottom: '0.25em',
    paddingLeft: spacing.baseUnit * 3,
    paddingRight: spacing.baseUnit * 3,
    textTransform: 'uppercase'
  });
};
var GroupHeading = function GroupHeading(props) {
  var _cleanCommonProps = cleanCommonProps(props);
    _cleanCommonProps.data;
    var innerProps = (0,_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_3__["default"])(_cleanCommonProps, _excluded$1);
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, getStyleProps(props, 'groupHeading', {
    'group-heading': true
  }), innerProps));
};
var Group$1 = Group;

var _excluded = ["innerRef", "isDisabled", "isHidden", "inputClassName"];
var inputCSS = function inputCSS(_ref, unstyled) {
  var isDisabled = _ref.isDisabled,
    value = _ref.value,
    _ref$theme = _ref.theme,
    spacing = _ref$theme.spacing,
    colors = _ref$theme.colors;
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({
    visibility: isDisabled ? 'hidden' : 'visible',
    // force css to recompute when value change due to @emotion bug.
    // We can remove it whenever the bug is fixed.
    transform: value ? 'translateZ(0)' : ''
  }, containerStyle), unstyled ? {} : {
    margin: spacing.baseUnit / 2,
    paddingBottom: spacing.baseUnit / 2,
    paddingTop: spacing.baseUnit / 2,
    color: colors.neutral80
  });
};
var spacingStyle = {
  gridArea: '1 / 2',
  font: 'inherit',
  minWidth: '2px',
  border: 0,
  margin: 0,
  outline: 0,
  padding: 0
};
var containerStyle = {
  flex: '1 1 auto',
  display: 'inline-grid',
  gridArea: '1 / 1 / 2 / 3',
  gridTemplateColumns: '0 min-content',
  '&:after': (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({
    content: 'attr(data-value) " "',
    visibility: 'hidden',
    whiteSpace: 'pre'
  }, spacingStyle)
};
var inputStyle = function inputStyle(isHidden) {
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({
    label: 'input',
    color: 'inherit',
    background: 0,
    opacity: isHidden ? 0 : 1,
    width: '100%'
  }, spacingStyle);
};
var Input = function Input(props) {
  var cx = props.cx,
    value = props.value;
  var _cleanCommonProps = cleanCommonProps(props),
    innerRef = _cleanCommonProps.innerRef,
    isDisabled = _cleanCommonProps.isDisabled,
    isHidden = _cleanCommonProps.isHidden,
    inputClassName = _cleanCommonProps.inputClassName,
    innerProps = (0,_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_3__["default"])(_cleanCommonProps, _excluded);
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, getStyleProps(props, 'input', {
    'input-container': true
  }), {
    "data-value": value || ''
  }), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)("input", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({
    className: cx({
      input: true
    }, inputClassName),
    ref: innerRef,
    style: inputStyle(isHidden),
    disabled: isDisabled
  }, innerProps)));
};
var Input$1 = Input;

var multiValueCSS = function multiValueCSS(_ref, unstyled) {
  var _ref$theme = _ref.theme,
    spacing = _ref$theme.spacing,
    borderRadius = _ref$theme.borderRadius,
    colors = _ref$theme.colors;
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({
    label: 'multiValue',
    display: 'flex',
    minWidth: 0
  }, unstyled ? {} : {
    backgroundColor: colors.neutral10,
    borderRadius: borderRadius / 2,
    margin: spacing.baseUnit / 2
  });
};
var multiValueLabelCSS = function multiValueLabelCSS(_ref2, unstyled) {
  var _ref2$theme = _ref2.theme,
    borderRadius = _ref2$theme.borderRadius,
    colors = _ref2$theme.colors,
    cropWithEllipsis = _ref2.cropWithEllipsis;
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({
    overflow: 'hidden',
    textOverflow: cropWithEllipsis || cropWithEllipsis === undefined ? 'ellipsis' : undefined,
    whiteSpace: 'nowrap'
  }, unstyled ? {} : {
    borderRadius: borderRadius / 2,
    color: colors.neutral80,
    fontSize: '85%',
    padding: 3,
    paddingLeft: 6
  });
};
var multiValueRemoveCSS = function multiValueRemoveCSS(_ref3, unstyled) {
  var _ref3$theme = _ref3.theme,
    spacing = _ref3$theme.spacing,
    borderRadius = _ref3$theme.borderRadius,
    colors = _ref3$theme.colors,
    isFocused = _ref3.isFocused;
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({
    alignItems: 'center',
    display: 'flex'
  }, unstyled ? {} : {
    borderRadius: borderRadius / 2,
    backgroundColor: isFocused ? colors.dangerLight : undefined,
    paddingLeft: spacing.baseUnit,
    paddingRight: spacing.baseUnit,
    ':hover': {
      backgroundColor: colors.dangerLight,
      color: colors.danger
    }
  });
};
var MultiValueGeneric = function MultiValueGeneric(_ref4) {
  var children = _ref4.children,
    innerProps = _ref4.innerProps;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", innerProps, children);
};
var MultiValueContainer = MultiValueGeneric;
var MultiValueLabel = MultiValueGeneric;
function MultiValueRemove(_ref5) {
  var children = _ref5.children,
    innerProps = _ref5.innerProps;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({
    role: "button"
  }, innerProps), children || (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)(CrossIcon, {
    size: 14
  }));
}
var MultiValue = function MultiValue(props) {
  var children = props.children,
    components = props.components,
    data = props.data,
    innerProps = props.innerProps,
    isDisabled = props.isDisabled,
    removeProps = props.removeProps,
    selectProps = props.selectProps;
  var Container = components.Container,
    Label = components.Label,
    Remove = components.Remove;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)(Container, {
    data: data,
    innerProps: (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({}, getStyleProps(props, 'multiValue', {
      'multi-value': true,
      'multi-value--is-disabled': isDisabled
    })), innerProps),
    selectProps: selectProps
  }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)(Label, {
    data: data,
    innerProps: (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({}, getStyleProps(props, 'multiValueLabel', {
      'multi-value__label': true
    })),
    selectProps: selectProps
  }, children), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)(Remove, {
    data: data,
    innerProps: (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({}, getStyleProps(props, 'multiValueRemove', {
      'multi-value__remove': true
    })), {}, {
      'aria-label': "Remove ".concat(children || 'option')
    }, removeProps),
    selectProps: selectProps
  }));
};
var MultiValue$1 = MultiValue;

var optionCSS = function optionCSS(_ref, unstyled) {
  var isDisabled = _ref.isDisabled,
    isFocused = _ref.isFocused,
    isSelected = _ref.isSelected,
    _ref$theme = _ref.theme,
    spacing = _ref$theme.spacing,
    colors = _ref$theme.colors;
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({
    label: 'option',
    cursor: 'default',
    display: 'block',
    fontSize: 'inherit',
    width: '100%',
    userSelect: 'none',
    WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'
  }, unstyled ? {} : {
    backgroundColor: isSelected ? colors.primary : isFocused ? colors.primary25 : 'transparent',
    color: isDisabled ? colors.neutral20 : isSelected ? colors.neutral0 : 'inherit',
    padding: "".concat(spacing.baseUnit * 2, "px ").concat(spacing.baseUnit * 3, "px"),
    // provide some affordance on touch devices
    ':active': {
      backgroundColor: !isDisabled ? isSelected ? colors.primary : colors.primary50 : undefined
    }
  });
};
var Option = function Option(props) {
  var children = props.children,
    isDisabled = props.isDisabled,
    isFocused = props.isFocused,
    isSelected = props.isSelected,
    innerRef = props.innerRef,
    innerProps = props.innerProps;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, getStyleProps(props, 'option', {
    option: true,
    'option--is-disabled': isDisabled,
    'option--is-focused': isFocused,
    'option--is-selected': isSelected
  }), {
    ref: innerRef,
    "aria-disabled": isDisabled
  }, innerProps), children);
};
var Option$1 = Option;

var placeholderCSS = function placeholderCSS(_ref, unstyled) {
  var _ref$theme = _ref.theme,
    spacing = _ref$theme.spacing,
    colors = _ref$theme.colors;
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({
    label: 'placeholder',
    gridArea: '1 / 1 / 2 / 3'
  }, unstyled ? {} : {
    color: colors.neutral50,
    marginLeft: spacing.baseUnit / 2,
    marginRight: spacing.baseUnit / 2
  });
};
var Placeholder = function Placeholder(props) {
  var children = props.children,
    innerProps = props.innerProps;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, getStyleProps(props, 'placeholder', {
    placeholder: true
  }), innerProps), children);
};
var Placeholder$1 = Placeholder;

var css = function css(_ref, unstyled) {
  var isDisabled = _ref.isDisabled,
    _ref$theme = _ref.theme,
    spacing = _ref$theme.spacing,
    colors = _ref$theme.colors;
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({
    label: 'singleValue',
    gridArea: '1 / 1 / 2 / 3',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }, unstyled ? {} : {
    color: isDisabled ? colors.neutral40 : colors.neutral80,
    marginLeft: spacing.baseUnit / 2,
    marginRight: spacing.baseUnit / 2
  });
};
var SingleValue = function SingleValue(props) {
  var children = props.children,
    isDisabled = props.isDisabled,
    innerProps = props.innerProps;
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({}, getStyleProps(props, 'singleValue', {
    'single-value': true,
    'single-value--is-disabled': isDisabled
  }), innerProps), children);
};
var SingleValue$1 = SingleValue;

var components = {
  ClearIndicator: ClearIndicator,
  Control: Control$1,
  DropdownIndicator: DropdownIndicator,
  DownChevron: DownChevron,
  CrossIcon: CrossIcon,
  Group: Group$1,
  GroupHeading: GroupHeading,
  IndicatorsContainer: IndicatorsContainer,
  IndicatorSeparator: IndicatorSeparator,
  Input: Input$1,
  LoadingIndicator: LoadingIndicator,
  Menu: Menu$1,
  MenuList: MenuList,
  MenuPortal: MenuPortal,
  LoadingMessage: LoadingMessage,
  NoOptionsMessage: NoOptionsMessage,
  MultiValue: MultiValue$1,
  MultiValueContainer: MultiValueContainer,
  MultiValueLabel: MultiValueLabel,
  MultiValueRemove: MultiValueRemove,
  Option: Option$1,
  Placeholder: Placeholder$1,
  SelectContainer: SelectContainer,
  SingleValue: SingleValue$1,
  ValueContainer: ValueContainer
};
var defaultComponents = function defaultComponents(props) {
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({}, components), props.components);
};




/***/ }),

/***/ "./node_modules/react-select/dist/react-select.esm.js":
/*!************************************************************!*\
  !*** ./node_modules/react-select/dist/react-select.esm.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NonceProvider: () => (/* binding */ NonceProvider),
/* harmony export */   components: () => (/* reexport safe */ _index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_5__.c),
/* harmony export */   createFilter: () => (/* reexport safe */ _Select_49a62830_esm_js__WEBPACK_IMPORTED_MODULE_3__.c),
/* harmony export */   "default": () => (/* binding */ StateManagedSelect$1),
/* harmony export */   defaultTheme: () => (/* reexport safe */ _Select_49a62830_esm_js__WEBPACK_IMPORTED_MODULE_3__.d),
/* harmony export */   mergeStyles: () => (/* reexport safe */ _Select_49a62830_esm_js__WEBPACK_IMPORTED_MODULE_3__.m),
/* harmony export */   useStateManager: () => (/* reexport safe */ _useStateManager_7e1e8489_esm_js__WEBPACK_IMPORTED_MODULE_0__.u)
/* harmony export */ });
/* harmony import */ var _useStateManager_7e1e8489_esm_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./useStateManager-7e1e8489.esm.js */ "./node_modules/react-select/dist/useStateManager-7e1e8489.esm.js");
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Select_49a62830_esm_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Select-49a62830.esm.js */ "./node_modules/react-select/dist/Select-49a62830.esm.js");
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @emotion/react */ "./node_modules/@emotion/react/dist/emotion-element-c39617d8.browser.esm.js");
/* harmony import */ var _emotion_cache__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @emotion/cache */ "./node_modules/@emotion/cache/dist/emotion-cache.browser.esm.js");
/* harmony import */ var _index_a301f526_esm_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./index-a301f526.esm.js */ "./node_modules/react-select/dist/index-a301f526.esm.js");
/* harmony import */ var _babel_runtime_helpers_objectSpread2__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/objectSpread2 */ "./node_modules/@babel/runtime/helpers/esm/objectSpread2.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @babel/runtime/helpers/objectWithoutProperties */ "./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_createSuper__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @babel/runtime/helpers/createSuper */ "./node_modules/@babel/runtime/helpers/esm/createSuper.js");
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @babel/runtime/helpers/taggedTemplateLiteral */ "./node_modules/@babel/runtime/helpers/esm/taggedTemplateLiteral.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_17__);
/* harmony import */ var use_isomorphic_layout_effect__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! use-isomorphic-layout-effect */ "./node_modules/use-isomorphic-layout-effect/dist/use-isomorphic-layout-effect.browser.esm.js");


























var StateManagedSelect = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_2__.forwardRef)(function (props, ref) {
  var baseSelectProps = (0,_useStateManager_7e1e8489_esm_js__WEBPACK_IMPORTED_MODULE_0__.u)(props);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(_Select_49a62830_esm_js__WEBPACK_IMPORTED_MODULE_3__.S, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({
    ref: ref
  }, baseSelectProps));
});
var StateManagedSelect$1 = StateManagedSelect;

var NonceProvider = (function (_ref) {
  var nonce = _ref.nonce,
    children = _ref.children,
    cacheKey = _ref.cacheKey;
  var emotionCache = (0,react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(function () {
    return (0,_emotion_cache__WEBPACK_IMPORTED_MODULE_4__["default"])({
      key: cacheKey,
      nonce: nonce
    });
  }, [cacheKey, nonce]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(_emotion_react__WEBPACK_IMPORTED_MODULE_19__.C, {
    value: emotionCache
  }, children);
});




/***/ }),

/***/ "./node_modules/react-select/dist/useStateManager-7e1e8489.esm.js":
/*!************************************************************************!*\
  !*** ./node_modules/react-select/dist/useStateManager-7e1e8489.esm.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   u: () => (/* binding */ useStateManager)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/objectSpread2 */ "./node_modules/@babel/runtime/helpers/esm/objectSpread2.js");
/* harmony import */ var _babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/esm/objectWithoutProperties */ "./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);





var _excluded = ["defaultInputValue", "defaultMenuIsOpen", "defaultValue", "inputValue", "menuIsOpen", "onChange", "onInputChange", "onMenuClose", "onMenuOpen", "value"];
function useStateManager(_ref) {
  var _ref$defaultInputValu = _ref.defaultInputValue,
    defaultInputValue = _ref$defaultInputValu === void 0 ? '' : _ref$defaultInputValu,
    _ref$defaultMenuIsOpe = _ref.defaultMenuIsOpen,
    defaultMenuIsOpen = _ref$defaultMenuIsOpe === void 0 ? false : _ref$defaultMenuIsOpe,
    _ref$defaultValue = _ref.defaultValue,
    defaultValue = _ref$defaultValue === void 0 ? null : _ref$defaultValue,
    propsInputValue = _ref.inputValue,
    propsMenuIsOpen = _ref.menuIsOpen,
    propsOnChange = _ref.onChange,
    propsOnInputChange = _ref.onInputChange,
    propsOnMenuClose = _ref.onMenuClose,
    propsOnMenuOpen = _ref.onMenuOpen,
    propsValue = _ref.value,
    restSelectProps = (0,_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_2__["default"])(_ref, _excluded);
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(propsInputValue !== undefined ? propsInputValue : defaultInputValue),
    _useState2 = (0,_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState, 2),
    stateInputValue = _useState2[0],
    setStateInputValue = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(propsMenuIsOpen !== undefined ? propsMenuIsOpen : defaultMenuIsOpen),
    _useState4 = (0,_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState3, 2),
    stateMenuIsOpen = _useState4[0],
    setStateMenuIsOpen = _useState4[1];
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(propsValue !== undefined ? propsValue : defaultValue),
    _useState6 = (0,_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState5, 2),
    stateValue = _useState6[0],
    setStateValue = _useState6[1];
  var onChange = (0,react__WEBPACK_IMPORTED_MODULE_3__.useCallback)(function (value, actionMeta) {
    if (typeof propsOnChange === 'function') {
      propsOnChange(value, actionMeta);
    }
    setStateValue(value);
  }, [propsOnChange]);
  var onInputChange = (0,react__WEBPACK_IMPORTED_MODULE_3__.useCallback)(function (value, actionMeta) {
    var newValue;
    if (typeof propsOnInputChange === 'function') {
      newValue = propsOnInputChange(value, actionMeta);
    }
    setStateInputValue(newValue !== undefined ? newValue : value);
  }, [propsOnInputChange]);
  var onMenuOpen = (0,react__WEBPACK_IMPORTED_MODULE_3__.useCallback)(function () {
    if (typeof propsOnMenuOpen === 'function') {
      propsOnMenuOpen();
    }
    setStateMenuIsOpen(true);
  }, [propsOnMenuOpen]);
  var onMenuClose = (0,react__WEBPACK_IMPORTED_MODULE_3__.useCallback)(function () {
    if (typeof propsOnMenuClose === 'function') {
      propsOnMenuClose();
    }
    setStateMenuIsOpen(false);
  }, [propsOnMenuClose]);
  var inputValue = propsInputValue !== undefined ? propsInputValue : stateInputValue;
  var menuIsOpen = propsMenuIsOpen !== undefined ? propsMenuIsOpen : stateMenuIsOpen;
  var value = propsValue !== undefined ? propsValue : stateValue;
  return (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({}, restSelectProps), {}, {
    inputValue: inputValue,
    menuIsOpen: menuIsOpen,
    onChange: onChange,
    onInputChange: onInputChange,
    onMenuClose: onMenuClose,
    onMenuOpen: onMenuOpen,
    value: value
  });
}




/***/ }),

/***/ "./node_modules/use-isomorphic-layout-effect/dist/use-isomorphic-layout-effect.browser.esm.js":
/*!****************************************************************************************************!*\
  !*** ./node_modules/use-isomorphic-layout-effect/dist/use-isomorphic-layout-effect.browser.esm.js ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);


var index =  react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect ;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (index);


/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/regex.js":
/*!*****************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/regex.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/rng.js":
/*!***************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/rng.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rng)
/* harmony export */ });
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
    // find the complete implementation of crypto (msCrypto) on IE11.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/stringify.js":
/*!*********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/stringify.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/esm-browser/validate.js");

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__["default"])(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stringify);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/v4.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/v4.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rng.js */ "./node_modules/uuid/dist/esm-browser/rng.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/esm-browser/stringify.js");



function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_0__["default"])(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__["default"])(rnds);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v4);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/validate.js":
/*!********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/validate.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _regex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regex.js */ "./node_modules/uuid/dist/esm-browser/regex.js");


function validate(uuid) {
  return typeof uuid === 'string' && _regex_js__WEBPACK_IMPORTED_MODULE_0__["default"].test(uuid);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (validate);

/***/ }),

/***/ "./node_modules/webfontloader/webfontloader.js":
/*!*****************************************************!*\
  !*** ./node_modules/webfontloader/webfontloader.js ***!
  \*****************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_RESULT__;/* Web Font Loader v1.6.28 - (c) Adobe Systems, Google. License: Apache 2.0 */(function(){function aa(a,b,c){return a.call.apply(a.bind,arguments)}function ba(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function p(a,b,c){p=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?aa:ba;return p.apply(null,arguments)}var q=Date.now||function(){return+new Date};function ca(a,b){this.a=a;this.o=b||a;this.c=this.o.document}var da=!!window.FontFace;function t(a,b,c,d){b=a.c.createElement(b);if(c)for(var e in c)c.hasOwnProperty(e)&&("style"==e?b.style.cssText=c[e]:b.setAttribute(e,c[e]));d&&b.appendChild(a.c.createTextNode(d));return b}function u(a,b,c){a=a.c.getElementsByTagName(b)[0];a||(a=document.documentElement);a.insertBefore(c,a.lastChild)}function v(a){a.parentNode&&a.parentNode.removeChild(a)}
function w(a,b,c){b=b||[];c=c||[];for(var d=a.className.split(/\s+/),e=0;e<b.length;e+=1){for(var f=!1,g=0;g<d.length;g+=1)if(b[e]===d[g]){f=!0;break}f||d.push(b[e])}b=[];for(e=0;e<d.length;e+=1){f=!1;for(g=0;g<c.length;g+=1)if(d[e]===c[g]){f=!0;break}f||b.push(d[e])}a.className=b.join(" ").replace(/\s+/g," ").replace(/^\s+|\s+$/,"")}function y(a,b){for(var c=a.className.split(/\s+/),d=0,e=c.length;d<e;d++)if(c[d]==b)return!0;return!1}
function ea(a){return a.o.location.hostname||a.a.location.hostname}function z(a,b,c){function d(){m&&e&&f&&(m(g),m=null)}b=t(a,"link",{rel:"stylesheet",href:b,media:"all"});var e=!1,f=!0,g=null,m=c||null;da?(b.onload=function(){e=!0;d()},b.onerror=function(){e=!0;g=Error("Stylesheet failed to load");d()}):setTimeout(function(){e=!0;d()},0);u(a,"head",b)}
function A(a,b,c,d){var e=a.c.getElementsByTagName("head")[0];if(e){var f=t(a,"script",{src:b}),g=!1;f.onload=f.onreadystatechange=function(){g||this.readyState&&"loaded"!=this.readyState&&"complete"!=this.readyState||(g=!0,c&&c(null),f.onload=f.onreadystatechange=null,"HEAD"==f.parentNode.tagName&&e.removeChild(f))};e.appendChild(f);setTimeout(function(){g||(g=!0,c&&c(Error("Script load timeout")))},d||5E3);return f}return null};function B(){this.a=0;this.c=null}function C(a){a.a++;return function(){a.a--;D(a)}}function E(a,b){a.c=b;D(a)}function D(a){0==a.a&&a.c&&(a.c(),a.c=null)};function F(a){this.a=a||"-"}F.prototype.c=function(a){for(var b=[],c=0;c<arguments.length;c++)b.push(arguments[c].replace(/[\W_]+/g,"").toLowerCase());return b.join(this.a)};function G(a,b){this.c=a;this.f=4;this.a="n";var c=(b||"n4").match(/^([nio])([1-9])$/i);c&&(this.a=c[1],this.f=parseInt(c[2],10))}function fa(a){return H(a)+" "+(a.f+"00")+" 300px "+I(a.c)}function I(a){var b=[];a=a.split(/,\s*/);for(var c=0;c<a.length;c++){var d=a[c].replace(/['"]/g,"");-1!=d.indexOf(" ")||/^\d/.test(d)?b.push("'"+d+"'"):b.push(d)}return b.join(",")}function J(a){return a.a+a.f}function H(a){var b="normal";"o"===a.a?b="oblique":"i"===a.a&&(b="italic");return b}
function ga(a){var b=4,c="n",d=null;a&&((d=a.match(/(normal|oblique|italic)/i))&&d[1]&&(c=d[1].substr(0,1).toLowerCase()),(d=a.match(/([1-9]00|normal|bold)/i))&&d[1]&&(/bold/i.test(d[1])?b=7:/[1-9]00/.test(d[1])&&(b=parseInt(d[1].substr(0,1),10))));return c+b};function ha(a,b){this.c=a;this.f=a.o.document.documentElement;this.h=b;this.a=new F("-");this.j=!1!==b.events;this.g=!1!==b.classes}function ia(a){a.g&&w(a.f,[a.a.c("wf","loading")]);K(a,"loading")}function L(a){if(a.g){var b=y(a.f,a.a.c("wf","active")),c=[],d=[a.a.c("wf","loading")];b||c.push(a.a.c("wf","inactive"));w(a.f,c,d)}K(a,"inactive")}function K(a,b,c){if(a.j&&a.h[b])if(c)a.h[b](c.c,J(c));else a.h[b]()};function ja(){this.c={}}function ka(a,b,c){var d=[],e;for(e in b)if(b.hasOwnProperty(e)){var f=a.c[e];f&&d.push(f(b[e],c))}return d};function M(a,b){this.c=a;this.f=b;this.a=t(this.c,"span",{"aria-hidden":"true"},this.f)}function N(a){u(a.c,"body",a.a)}function O(a){return"display:block;position:absolute;top:-9999px;left:-9999px;font-size:300px;width:auto;height:auto;line-height:normal;margin:0;padding:0;font-variant:normal;white-space:nowrap;font-family:"+I(a.c)+";"+("font-style:"+H(a)+";font-weight:"+(a.f+"00")+";")};function P(a,b,c,d,e,f){this.g=a;this.j=b;this.a=d;this.c=c;this.f=e||3E3;this.h=f||void 0}P.prototype.start=function(){var a=this.c.o.document,b=this,c=q(),d=new Promise(function(d,e){function f(){q()-c>=b.f?e():a.fonts.load(fa(b.a),b.h).then(function(a){1<=a.length?d():setTimeout(f,25)},function(){e()})}f()}),e=null,f=new Promise(function(a,d){e=setTimeout(d,b.f)});Promise.race([f,d]).then(function(){e&&(clearTimeout(e),e=null);b.g(b.a)},function(){b.j(b.a)})};function Q(a,b,c,d,e,f,g){this.v=a;this.B=b;this.c=c;this.a=d;this.s=g||"BESbswy";this.f={};this.w=e||3E3;this.u=f||null;this.m=this.j=this.h=this.g=null;this.g=new M(this.c,this.s);this.h=new M(this.c,this.s);this.j=new M(this.c,this.s);this.m=new M(this.c,this.s);a=new G(this.a.c+",serif",J(this.a));a=O(a);this.g.a.style.cssText=a;a=new G(this.a.c+",sans-serif",J(this.a));a=O(a);this.h.a.style.cssText=a;a=new G("serif",J(this.a));a=O(a);this.j.a.style.cssText=a;a=new G("sans-serif",J(this.a));a=
O(a);this.m.a.style.cssText=a;N(this.g);N(this.h);N(this.j);N(this.m)}var R={D:"serif",C:"sans-serif"},S=null;function T(){if(null===S){var a=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent);S=!!a&&(536>parseInt(a[1],10)||536===parseInt(a[1],10)&&11>=parseInt(a[2],10))}return S}Q.prototype.start=function(){this.f.serif=this.j.a.offsetWidth;this.f["sans-serif"]=this.m.a.offsetWidth;this.A=q();U(this)};
function la(a,b,c){for(var d in R)if(R.hasOwnProperty(d)&&b===a.f[R[d]]&&c===a.f[R[d]])return!0;return!1}function U(a){var b=a.g.a.offsetWidth,c=a.h.a.offsetWidth,d;(d=b===a.f.serif&&c===a.f["sans-serif"])||(d=T()&&la(a,b,c));d?q()-a.A>=a.w?T()&&la(a,b,c)&&(null===a.u||a.u.hasOwnProperty(a.a.c))?V(a,a.v):V(a,a.B):ma(a):V(a,a.v)}function ma(a){setTimeout(p(function(){U(this)},a),50)}function V(a,b){setTimeout(p(function(){v(this.g.a);v(this.h.a);v(this.j.a);v(this.m.a);b(this.a)},a),0)};function W(a,b,c){this.c=a;this.a=b;this.f=0;this.m=this.j=!1;this.s=c}var X=null;W.prototype.g=function(a){var b=this.a;b.g&&w(b.f,[b.a.c("wf",a.c,J(a).toString(),"active")],[b.a.c("wf",a.c,J(a).toString(),"loading"),b.a.c("wf",a.c,J(a).toString(),"inactive")]);K(b,"fontactive",a);this.m=!0;na(this)};
W.prototype.h=function(a){var b=this.a;if(b.g){var c=y(b.f,b.a.c("wf",a.c,J(a).toString(),"active")),d=[],e=[b.a.c("wf",a.c,J(a).toString(),"loading")];c||d.push(b.a.c("wf",a.c,J(a).toString(),"inactive"));w(b.f,d,e)}K(b,"fontinactive",a);na(this)};function na(a){0==--a.f&&a.j&&(a.m?(a=a.a,a.g&&w(a.f,[a.a.c("wf","active")],[a.a.c("wf","loading"),a.a.c("wf","inactive")]),K(a,"active")):L(a.a))};function oa(a){this.j=a;this.a=new ja;this.h=0;this.f=this.g=!0}oa.prototype.load=function(a){this.c=new ca(this.j,a.context||this.j);this.g=!1!==a.events;this.f=!1!==a.classes;pa(this,new ha(this.c,a),a)};
function qa(a,b,c,d,e){var f=0==--a.h;(a.f||a.g)&&setTimeout(function(){var a=e||null,m=d||null||{};if(0===c.length&&f)L(b.a);else{b.f+=c.length;f&&(b.j=f);var h,l=[];for(h=0;h<c.length;h++){var k=c[h],n=m[k.c],r=b.a,x=k;r.g&&w(r.f,[r.a.c("wf",x.c,J(x).toString(),"loading")]);K(r,"fontloading",x);r=null;if(null===X)if(window.FontFace){var x=/Gecko.*Firefox\/(\d+)/.exec(window.navigator.userAgent),xa=/OS X.*Version\/10\..*Safari/.exec(window.navigator.userAgent)&&/Apple/.exec(window.navigator.vendor);
X=x?42<parseInt(x[1],10):xa?!1:!0}else X=!1;X?r=new P(p(b.g,b),p(b.h,b),b.c,k,b.s,n):r=new Q(p(b.g,b),p(b.h,b),b.c,k,b.s,a,n);l.push(r)}for(h=0;h<l.length;h++)l[h].start()}},0)}function pa(a,b,c){var d=[],e=c.timeout;ia(b);var d=ka(a.a,c,a.c),f=new W(a.c,b,e);a.h=d.length;b=0;for(c=d.length;b<c;b++)d[b].load(function(b,d,c){qa(a,f,b,d,c)})};function ra(a,b){this.c=a;this.a=b}
ra.prototype.load=function(a){function b(){if(f["__mti_fntLst"+d]){var c=f["__mti_fntLst"+d](),e=[],h;if(c)for(var l=0;l<c.length;l++){var k=c[l].fontfamily;void 0!=c[l].fontStyle&&void 0!=c[l].fontWeight?(h=c[l].fontStyle+c[l].fontWeight,e.push(new G(k,h))):e.push(new G(k))}a(e)}else setTimeout(function(){b()},50)}var c=this,d=c.a.projectId,e=c.a.version;if(d){var f=c.c.o;A(this.c,(c.a.api||"https://fast.fonts.net/jsapi")+"/"+d+".js"+(e?"?v="+e:""),function(e){e?a([]):(f["__MonotypeConfiguration__"+
d]=function(){return c.a},b())}).id="__MonotypeAPIScript__"+d}else a([])};function sa(a,b){this.c=a;this.a=b}sa.prototype.load=function(a){var b,c,d=this.a.urls||[],e=this.a.families||[],f=this.a.testStrings||{},g=new B;b=0;for(c=d.length;b<c;b++)z(this.c,d[b],C(g));var m=[];b=0;for(c=e.length;b<c;b++)if(d=e[b].split(":"),d[1])for(var h=d[1].split(","),l=0;l<h.length;l+=1)m.push(new G(d[0],h[l]));else m.push(new G(d[0]));E(g,function(){a(m,f)})};function ta(a,b){a?this.c=a:this.c=ua;this.a=[];this.f=[];this.g=b||""}var ua="https://fonts.googleapis.com/css";function va(a,b){for(var c=b.length,d=0;d<c;d++){var e=b[d].split(":");3==e.length&&a.f.push(e.pop());var f="";2==e.length&&""!=e[1]&&(f=":");a.a.push(e.join(f))}}
function wa(a){if(0==a.a.length)throw Error("No fonts to load!");if(-1!=a.c.indexOf("kit="))return a.c;for(var b=a.a.length,c=[],d=0;d<b;d++)c.push(a.a[d].replace(/ /g,"+"));b=a.c+"?family="+c.join("%7C");0<a.f.length&&(b+="&subset="+a.f.join(","));0<a.g.length&&(b+="&text="+encodeURIComponent(a.g));return b};function ya(a){this.f=a;this.a=[];this.c={}}
var za={latin:"BESbswy","latin-ext":"\u00e7\u00f6\u00fc\u011f\u015f",cyrillic:"\u0439\u044f\u0416",greek:"\u03b1\u03b2\u03a3",khmer:"\u1780\u1781\u1782",Hanuman:"\u1780\u1781\u1782"},Aa={thin:"1",extralight:"2","extra-light":"2",ultralight:"2","ultra-light":"2",light:"3",regular:"4",book:"4",medium:"5","semi-bold":"6",semibold:"6","demi-bold":"6",demibold:"6",bold:"7","extra-bold":"8",extrabold:"8","ultra-bold":"8",ultrabold:"8",black:"9",heavy:"9",l:"3",r:"4",b:"7"},Ba={i:"i",italic:"i",n:"n",normal:"n"},
Ca=/^(thin|(?:(?:extra|ultra)-?)?light|regular|book|medium|(?:(?:semi|demi|extra|ultra)-?)?bold|black|heavy|l|r|b|[1-9]00)?(n|i|normal|italic)?$/;
function Da(a){for(var b=a.f.length,c=0;c<b;c++){var d=a.f[c].split(":"),e=d[0].replace(/\+/g," "),f=["n4"];if(2<=d.length){var g;var m=d[1];g=[];if(m)for(var m=m.split(","),h=m.length,l=0;l<h;l++){var k;k=m[l];if(k.match(/^[\w-]+$/)){var n=Ca.exec(k.toLowerCase());if(null==n)k="";else{k=n[2];k=null==k||""==k?"n":Ba[k];n=n[1];if(null==n||""==n)n="4";else var r=Aa[n],n=r?r:isNaN(n)?"4":n.substr(0,1);k=[k,n].join("")}}else k="";k&&g.push(k)}0<g.length&&(f=g);3==d.length&&(d=d[2],g=[],d=d?d.split(","):
g,0<d.length&&(d=za[d[0]])&&(a.c[e]=d))}a.c[e]||(d=za[e])&&(a.c[e]=d);for(d=0;d<f.length;d+=1)a.a.push(new G(e,f[d]))}};function Ea(a,b){this.c=a;this.a=b}var Fa={Arimo:!0,Cousine:!0,Tinos:!0};Ea.prototype.load=function(a){var b=new B,c=this.c,d=new ta(this.a.api,this.a.text),e=this.a.families;va(d,e);var f=new ya(e);Da(f);z(c,wa(d),C(b));E(b,function(){a(f.a,f.c,Fa)})};function Ga(a,b){this.c=a;this.a=b}Ga.prototype.load=function(a){var b=this.a.id,c=this.c.o;b?A(this.c,(this.a.api||"https://use.typekit.net")+"/"+b+".js",function(b){if(b)a([]);else if(c.Typekit&&c.Typekit.config&&c.Typekit.config.fn){b=c.Typekit.config.fn;for(var e=[],f=0;f<b.length;f+=2)for(var g=b[f],m=b[f+1],h=0;h<m.length;h++)e.push(new G(g,m[h]));try{c.Typekit.load({events:!1,classes:!1,async:!0})}catch(l){}a(e)}},2E3):a([])};function Ha(a,b){this.c=a;this.f=b;this.a=[]}Ha.prototype.load=function(a){var b=this.f.id,c=this.c.o,d=this;b?(c.__webfontfontdeckmodule__||(c.__webfontfontdeckmodule__={}),c.__webfontfontdeckmodule__[b]=function(b,c){for(var g=0,m=c.fonts.length;g<m;++g){var h=c.fonts[g];d.a.push(new G(h.name,ga("font-weight:"+h.weight+";font-style:"+h.style)))}a(d.a)},A(this.c,(this.f.api||"https://f.fontdeck.com/s/css/js/")+ea(this.c)+"/"+b+".js",function(b){b&&a([])})):a([])};var Y=new oa(window);Y.a.c.custom=function(a,b){return new sa(b,a)};Y.a.c.fontdeck=function(a,b){return new Ha(b,a)};Y.a.c.monotype=function(a,b){return new ra(b,a)};Y.a.c.typekit=function(a,b){return new Ga(b,a)};Y.a.c.google=function(a,b){return new Ea(b,a)};var Z={load:p(Y.load,Y)}; true?!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(){return Z}).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):0;}());


/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = window["React"];

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = window["ReactDOM"];

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = window["lodash"];

/***/ }),

/***/ "@wordpress/api-fetch":
/*!**********************************!*\
  !*** external ["wp","apiFetch"] ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["apiFetch"];

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/compose":
/*!*********************************!*\
  !*** external ["wp","compose"] ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["compose"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/date":
/*!******************************!*\
  !*** external ["wp","date"] ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["date"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "@wordpress/primitives":
/*!************************************!*\
  !*** external ["wp","primitives"] ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["primitives"];

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _arrayLikeToArray)
/* harmony export */ });
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _arrayWithHoles)
/* harmony export */ });
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _arrayWithoutHoles)
/* harmony export */ });
/* harmony import */ var _arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayLikeToArray.js */ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js");

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(arr);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _assertThisInitialized)
/* harmony export */ });
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _classCallCheck)
/* harmony export */ });
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/createClass.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/createClass.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _createClass)
/* harmony export */ });
/* harmony import */ var _toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toPropertyKey.js */ "./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js");

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, (0,_toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__["default"])(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/createSuper.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/createSuper.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _createSuper)
/* harmony export */ });
/* harmony import */ var _getPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _isNativeReflectConstruct_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isNativeReflectConstruct.js */ "./node_modules/@babel/runtime/helpers/esm/isNativeReflectConstruct.js");
/* harmony import */ var _possibleConstructorReturn_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./possibleConstructorReturn.js */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");



function _createSuper(Derived) {
  var hasNativeReflectConstruct = (0,_isNativeReflectConstruct_js__WEBPACK_IMPORTED_MODULE_1__["default"])();
  return function _createSuperInternal() {
    var Super = (0,_getPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = (0,_getPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return (0,_possibleConstructorReturn_js__WEBPACK_IMPORTED_MODULE_2__["default"])(this, result);
  };
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/defineProperty.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _defineProperty)
/* harmony export */ });
/* harmony import */ var _toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toPropertyKey.js */ "./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js");

function _defineProperty(obj, key, value) {
  key = (0,_toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__["default"])(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/extends.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/extends.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _extends)
/* harmony export */ });
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _getPrototypeOf)
/* harmony export */ });
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/inherits.js":
/*!*************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/inherits.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _inherits)
/* harmony export */ });
/* harmony import */ var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js");

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) (0,_setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(subClass, superClass);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/isNativeReflectConstruct.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/isNativeReflectConstruct.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _isNativeReflectConstruct)
/* harmony export */ });
function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/iterableToArray.js":
/*!********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/iterableToArray.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _iterableToArray)
/* harmony export */ });
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _iterableToArrayLimit)
/* harmony export */ });
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js":
/*!********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _nonIterableRest)
/* harmony export */ });
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _nonIterableSpread)
/* harmony export */ });
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/objectSpread2.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/objectSpread2.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _objectSpread2)
/* harmony export */ });
/* harmony import */ var _defineProperty_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./defineProperty.js */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");

function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
      (0,_defineProperty_js__WEBPACK_IMPORTED_MODULE_0__["default"])(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _objectWithoutProperties)
/* harmony export */ });
/* harmony import */ var _objectWithoutPropertiesLoose_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./objectWithoutPropertiesLoose.js */ "./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js");

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = (0,_objectWithoutPropertiesLoose_js__WEBPACK_IMPORTED_MODULE_0__["default"])(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _objectWithoutPropertiesLoose)
/* harmony export */ });
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _possibleConstructorReturn)
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _assertThisInitialized_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./assertThisInitialized.js */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");


function _possibleConstructorReturn(self, call) {
  if (call && ((0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return (0,_assertThisInitialized_js__WEBPACK_IMPORTED_MODULE_1__["default"])(self);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _setPrototypeOf)
/* harmony export */ });
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/slicedToArray.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _slicedToArray)
/* harmony export */ });
/* harmony import */ var _arrayWithHoles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayWithHoles.js */ "./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js");
/* harmony import */ var _iterableToArrayLimit_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./iterableToArrayLimit.js */ "./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js");
/* harmony import */ var _unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./unsupportedIterableToArray.js */ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js");
/* harmony import */ var _nonIterableRest_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nonIterableRest.js */ "./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js");




function _slicedToArray(arr, i) {
  return (0,_arrayWithHoles_js__WEBPACK_IMPORTED_MODULE_0__["default"])(arr) || (0,_iterableToArrayLimit_js__WEBPACK_IMPORTED_MODULE_1__["default"])(arr, i) || (0,_unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(arr, i) || (0,_nonIterableRest_js__WEBPACK_IMPORTED_MODULE_3__["default"])();
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/taggedTemplateLiteral.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/taggedTemplateLiteral.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _taggedTemplateLiteral)
/* harmony export */ });
function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }
  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _toConsumableArray)
/* harmony export */ });
/* harmony import */ var _arrayWithoutHoles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayWithoutHoles.js */ "./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js");
/* harmony import */ var _iterableToArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./iterableToArray.js */ "./node_modules/@babel/runtime/helpers/esm/iterableToArray.js");
/* harmony import */ var _unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./unsupportedIterableToArray.js */ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js");
/* harmony import */ var _nonIterableSpread_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nonIterableSpread.js */ "./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js");




function _toConsumableArray(arr) {
  return (0,_arrayWithoutHoles_js__WEBPACK_IMPORTED_MODULE_0__["default"])(arr) || (0,_iterableToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(arr) || (0,_unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(arr) || (0,_nonIterableSpread_js__WEBPACK_IMPORTED_MODULE_3__["default"])();
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/toPrimitive.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toPrimitive.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ toPrimitive)
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");

function toPrimitive(t, r) {
  if ("object" != (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ toPropertyKey)
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _toPrimitive_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./toPrimitive.js */ "./node_modules/@babel/runtime/helpers/esm/toPrimitive.js");


function toPropertyKey(t) {
  var i = (0,_toPrimitive_js__WEBPACK_IMPORTED_MODULE_1__["default"])(t, "string");
  return "symbol" == (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(i) ? i : String(i);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/typeof.js":
/*!***********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/typeof.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _typeof)
/* harmony export */ });
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _unsupportedIterableToArray)
/* harmony export */ });
/* harmony import */ var _arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayLikeToArray.js */ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js");

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(o, minLen);
}

/***/ }),

/***/ "./node_modules/@floating-ui/core/dist/floating-ui.core.mjs":
/*!******************************************************************!*\
  !*** ./node_modules/@floating-ui/core/dist/floating-ui.core.mjs ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrow: () => (/* binding */ arrow),
/* harmony export */   autoPlacement: () => (/* binding */ autoPlacement),
/* harmony export */   computePosition: () => (/* binding */ computePosition),
/* harmony export */   detectOverflow: () => (/* binding */ detectOverflow),
/* harmony export */   flip: () => (/* binding */ flip),
/* harmony export */   hide: () => (/* binding */ hide),
/* harmony export */   inline: () => (/* binding */ inline),
/* harmony export */   limitShift: () => (/* binding */ limitShift),
/* harmony export */   offset: () => (/* binding */ offset),
/* harmony export */   rectToClientRect: () => (/* reexport safe */ _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect),
/* harmony export */   shift: () => (/* binding */ shift),
/* harmony export */   size: () => (/* binding */ size)
/* harmony export */ });
/* harmony import */ var _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @floating-ui/utils */ "./node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs");



function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement);
  const alignmentAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentAxis)(placement);
  const alignLength = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAxisLength)(alignmentAxis);
  const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
  const isVertical = sideAxis === 'y';
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case 'top':
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case 'bottom':
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case 'right':
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case 'left':
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch ((0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement)) {
    case 'start':
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case 'end':
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a reference element when it is given a certain positioning strategy.
 *
 * This export does not have any `platform` interface logic. You will need to
 * write one for the platform you are using Floating UI with.
 */
const computePosition = async (reference, floating, config) => {
  const {
    placement = 'bottom',
    strategy = 'absolute',
    middleware = [],
    platform
  } = config;
  const validMiddleware = middleware.filter(Boolean);
  const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));
  let rects = await platform.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let middlewareData = {};
  let resetCount = 0;
  for (let i = 0; i < validMiddleware.length; i++) {
    const {
      name,
      fn
    } = validMiddleware[i];
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform,
      elements: {
        reference,
        floating
      }
    });
    x = nextX != null ? nextX : x;
    y = nextY != null ? nextY : y;
    middlewareData = {
      ...middlewareData,
      [name]: {
        ...middlewareData[name],
        ...data
      }
    };
    if (reset && resetCount <= 50) {
      resetCount++;
      if (typeof reset === 'object') {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x,
          y
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i = -1;
      continue;
    }
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};

/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary on each side.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */
async function detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x,
    y,
    platform,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = 'clippingAncestors',
    rootBoundary = 'viewport',
    elementContext = 'floating',
    altBoundary = false,
    padding = 0
  } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
  const paddingObject = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getPaddingObject)(padding);
  const altContext = elementContext === 'floating' ? 'reference' : 'floating';
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(await platform.getClippingRect({
    element: ((_await$platform$isEle = await (platform.isElement == null ? void 0 : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || (await (platform.getDocumentElement == null ? void 0 : platform.getDocumentElement(elements.floating))),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === 'floating' ? {
    ...rects.floating,
    x,
    y
  } : rects.reference;
  const offsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(elements.floating));
  const offsetScale = (await (platform.isElement == null ? void 0 : platform.isElement(offsetParent))) ? (await (platform.getScale == null ? void 0 : platform.getScale(offsetParent))) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  };
  const elementClientRect = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow = options => ({
  name: 'arrow',
  options,
  async fn(state) {
    const {
      x,
      y,
      placement,
      rects,
      platform,
      elements,
      middlewareData
    } = state;
    // Since `element` is required, we don't Partial<> the type.
    const {
      element,
      padding = 0
    } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state) || {};
    if (element == null) {
      return {};
    }
    const paddingObject = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getPaddingObject)(padding);
    const coords = {
      x,
      y
    };
    const axis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentAxis)(placement);
    const length = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAxisLength)(axis);
    const arrowDimensions = await platform.getDimensions(element);
    const isYAxis = axis === 'y';
    const minProp = isYAxis ? 'top' : 'left';
    const maxProp = isYAxis ? 'bottom' : 'right';
    const clientProp = isYAxis ? 'clientHeight' : 'clientWidth';
    const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
    const startDiff = coords[axis] - rects.reference[axis];
    const arrowOffsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(element));
    let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;

    // DOM platform can return `window` as the `offsetParent`.
    if (!clientSize || !(await (platform.isElement == null ? void 0 : platform.isElement(arrowOffsetParent)))) {
      clientSize = elements.floating[clientProp] || rects.floating[length];
    }
    const centerToReference = endDiff / 2 - startDiff / 2;

    // If the padding is large enough that it causes the arrow to no longer be
    // centered, modify the padding so that it is centered.
    const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
    const minPadding = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(paddingObject[minProp], largestPossiblePadding);
    const maxPadding = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(paddingObject[maxProp], largestPossiblePadding);

    // Make sure the arrow doesn't overflow the floating element if the center
    // point is outside the floating element's bounds.
    const min$1 = minPadding;
    const max = clientSize - arrowDimensions[length] - maxPadding;
    const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
    const offset = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.clamp)(min$1, center, max);

    // If the reference is small enough that the arrow's padding causes it to
    // to point to nothing for an aligned placement, adjust the offset of the
    // floating element itself. To ensure `shift()` continues to take action,
    // a single reset is performed when this is true.
    const shouldAddOffset = !middlewareData.arrow && (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) != null && center != offset && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
    const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max : 0;
    return {
      [axis]: coords[axis] + alignmentOffset,
      data: {
        [axis]: offset,
        centerOffset: center - offset - alignmentOffset,
        ...(shouldAddOffset && {
          alignmentOffset
        })
      },
      reset: shouldAddOffset
    };
  }
});

function getPlacementList(alignment, autoAlignment, allowedPlacements) {
  const allowedPlacementsSortedByAlignment = alignment ? [...allowedPlacements.filter(placement => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) === alignment), ...allowedPlacements.filter(placement => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) !== alignment)] : allowedPlacements.filter(placement => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement) === placement);
  return allowedPlacementsSortedByAlignment.filter(placement => {
    if (alignment) {
      return (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) === alignment || (autoAlignment ? (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAlignmentPlacement)(placement) !== placement : false);
    }
    return true;
  });
}
/**
 * Optimizes the visibility of the floating element by choosing the placement
 * that has the most space available automatically, without needing to specify a
 * preferred placement. Alternative to `flip`.
 * @see https://floating-ui.com/docs/autoPlacement
 */
const autoPlacement = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'autoPlacement',
    options,
    async fn(state) {
      var _middlewareData$autoP, _middlewareData$autoP2, _placementsThatFitOnE;
      const {
        rects,
        middlewareData,
        placement,
        platform,
        elements
      } = state;
      const {
        crossAxis = false,
        alignment,
        allowedPlacements = _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.placements,
        autoAlignment = true,
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const placements$1 = alignment !== undefined || allowedPlacements === _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.placements ? getPlacementList(alignment || null, autoAlignment, allowedPlacements) : allowedPlacements;
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const currentIndex = ((_middlewareData$autoP = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP.index) || 0;
      const currentPlacement = placements$1[currentIndex];
      if (currentPlacement == null) {
        return {};
      }
      const alignmentSides = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentSides)(currentPlacement, rects, await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating)));

      // Make `computeCoords` start from the right place.
      if (placement !== currentPlacement) {
        return {
          reset: {
            placement: placements$1[0]
          }
        };
      }
      const currentOverflows = [overflow[(0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(currentPlacement)], overflow[alignmentSides[0]], overflow[alignmentSides[1]]];
      const allOverflows = [...(((_middlewareData$autoP2 = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP2.overflows) || []), {
        placement: currentPlacement,
        overflows: currentOverflows
      }];
      const nextPlacement = placements$1[currentIndex + 1];

      // There are more placements to check.
      if (nextPlacement) {
        return {
          data: {
            index: currentIndex + 1,
            overflows: allOverflows
          },
          reset: {
            placement: nextPlacement
          }
        };
      }
      const placementsSortedByMostSpace = allOverflows.map(d => {
        const alignment = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(d.placement);
        return [d.placement, alignment && crossAxis ?
        // Check along the mainAxis and main crossAxis side.
        d.overflows.slice(0, 2).reduce((acc, v) => acc + v, 0) :
        // Check only the mainAxis.
        d.overflows[0], d.overflows];
      }).sort((a, b) => a[1] - b[1]);
      const placementsThatFitOnEachSide = placementsSortedByMostSpace.filter(d => d[2].slice(0,
      // Aligned placements should not check their opposite crossAxis
      // side.
      (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(d[0]) ? 2 : 3).every(v => v <= 0));
      const resetPlacement = ((_placementsThatFitOnE = placementsThatFitOnEachSide[0]) == null ? void 0 : _placementsThatFitOnE[0]) || placementsSortedByMostSpace[0][0];
      if (resetPlacement !== placement) {
        return {
          data: {
            index: currentIndex + 1,
            overflows: allOverflows
          },
          reset: {
            placement: resetPlacement
          }
        };
      }
      return {};
    }
  };
};

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const flip = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'flip',
    options,
    async fn(state) {
      var _middlewareData$arrow, _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform,
        elements
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = 'bestFit',
        fallbackAxisSideDirection = 'none',
        flipAlignment = true,
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);

      // If a reset by the arrow was caused due to an alignment offset being
      // added, we should skip any logic now since `flip()` has already done its
      // work.
      // https://github.com/floating-ui/floating-ui/issues/2549#issuecomment-1719601643
      if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
      const isBasePlacement = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(initialPlacement) === initialPlacement;
      const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [(0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositePlacement)(initialPlacement)] : (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getExpandedPlacements)(initialPlacement));
      if (!specifiedFallbackPlacements && fallbackAxisSideDirection !== 'none') {
        fallbackPlacements.push(...(0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAxisPlacements)(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements = [initialPlacement, ...fallbackPlacements];
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const sides = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentSides)(placement, rects, rtl);
        overflows.push(overflow[sides[0]], overflow[sides[1]]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];

      // One or more sides is overflowing.
      if (!overflows.every(side => side <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements[nextIndex];
        if (nextPlacement) {
          // Try next placement and re-run the lifecycle.
          return {
            data: {
              index: nextIndex,
              overflows: overflowsData
            },
            reset: {
              placement: nextPlacement
            }
          };
        }

        // First, find the candidates that fit on the mainAxis side of overflow,
        // then find the placement that fits the best on the main crossAxis side.
        let resetPlacement = (_overflowsData$filter = overflowsData.filter(d => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;

        // Otherwise fallback.
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case 'bestFit':
              {
                var _overflowsData$map$so;
                const placement = (_overflowsData$map$so = overflowsData.map(d => [d.placement, d.overflows.filter(overflow => overflow > 0).reduce((acc, overflow) => acc + overflow, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$map$so[0];
                if (placement) {
                  resetPlacement = placement;
                }
                break;
              }
            case 'initialPlacement':
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};

function getSideOffsets(overflow, rect) {
  return {
    top: overflow.top - rect.height,
    right: overflow.right - rect.width,
    bottom: overflow.bottom - rect.height,
    left: overflow.left - rect.width
  };
}
function isAnySideFullyClipped(overflow) {
  return _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.sides.some(side => overflow[side] >= 0);
}
/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
const hide = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'hide',
    options,
    async fn(state) {
      const {
        rects
      } = state;
      const {
        strategy = 'referenceHidden',
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      switch (strategy) {
        case 'referenceHidden':
          {
            const overflow = await detectOverflow(state, {
              ...detectOverflowOptions,
              elementContext: 'reference'
            });
            const offsets = getSideOffsets(overflow, rects.reference);
            return {
              data: {
                referenceHiddenOffsets: offsets,
                referenceHidden: isAnySideFullyClipped(offsets)
              }
            };
          }
        case 'escaped':
          {
            const overflow = await detectOverflow(state, {
              ...detectOverflowOptions,
              altBoundary: true
            });
            const offsets = getSideOffsets(overflow, rects.floating);
            return {
              data: {
                escapedOffsets: offsets,
                escaped: isAnySideFullyClipped(offsets)
              }
            };
          }
        default:
          {
            return {};
          }
      }
    }
  };
};

function getBoundingRect(rects) {
  const minX = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(...rects.map(rect => rect.left));
  const minY = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(...rects.map(rect => rect.top));
  const maxX = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(...rects.map(rect => rect.right));
  const maxY = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(...rects.map(rect => rect.bottom));
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}
function getRectsByLine(rects) {
  const sortedRects = rects.slice().sort((a, b) => a.y - b.y);
  const groups = [];
  let prevRect = null;
  for (let i = 0; i < sortedRects.length; i++) {
    const rect = sortedRects[i];
    if (!prevRect || rect.y - prevRect.y > prevRect.height / 2) {
      groups.push([rect]);
    } else {
      groups[groups.length - 1].push(rect);
    }
    prevRect = rect;
  }
  return groups.map(rect => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(getBoundingRect(rect)));
}
/**
 * Provides improved positioning for inline reference elements that can span
 * over multiple lines, such as hyperlinks or range selections.
 * @see https://floating-ui.com/docs/inline
 */
const inline = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'inline',
    options,
    async fn(state) {
      const {
        placement,
        elements,
        rects,
        platform,
        strategy
      } = state;
      // A MouseEvent's client{X,Y} coords can be up to 2 pixels off a
      // ClientRect's bounds, despite the event listener being triggered. A
      // padding of 2 seems to handle this issue.
      const {
        padding = 2,
        x,
        y
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const nativeClientRects = Array.from((await (platform.getClientRects == null ? void 0 : platform.getClientRects(elements.reference))) || []);
      const clientRects = getRectsByLine(nativeClientRects);
      const fallback = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(getBoundingRect(nativeClientRects));
      const paddingObject = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getPaddingObject)(padding);
      function getBoundingClientRect() {
        // There are two rects and they are disjoined.
        if (clientRects.length === 2 && clientRects[0].left > clientRects[1].right && x != null && y != null) {
          // Find the first rect in which the point is fully inside.
          return clientRects.find(rect => x > rect.left - paddingObject.left && x < rect.right + paddingObject.right && y > rect.top - paddingObject.top && y < rect.bottom + paddingObject.bottom) || fallback;
        }

        // There are 2 or more connected rects.
        if (clientRects.length >= 2) {
          if ((0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement) === 'y') {
            const firstRect = clientRects[0];
            const lastRect = clientRects[clientRects.length - 1];
            const isTop = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement) === 'top';
            const top = firstRect.top;
            const bottom = lastRect.bottom;
            const left = isTop ? firstRect.left : lastRect.left;
            const right = isTop ? firstRect.right : lastRect.right;
            const width = right - left;
            const height = bottom - top;
            return {
              top,
              bottom,
              left,
              right,
              width,
              height,
              x: left,
              y: top
            };
          }
          const isLeftSide = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement) === 'left';
          const maxRight = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(...clientRects.map(rect => rect.right));
          const minLeft = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(...clientRects.map(rect => rect.left));
          const measureRects = clientRects.filter(rect => isLeftSide ? rect.left === minLeft : rect.right === maxRight);
          const top = measureRects[0].top;
          const bottom = measureRects[measureRects.length - 1].bottom;
          const left = minLeft;
          const right = maxRight;
          const width = right - left;
          const height = bottom - top;
          return {
            top,
            bottom,
            left,
            right,
            width,
            height,
            x: left,
            y: top
          };
        }
        return fallback;
      }
      const resetRects = await platform.getElementRects({
        reference: {
          getBoundingClientRect
        },
        floating: elements.floating,
        strategy
      });
      if (rects.reference.x !== resetRects.reference.x || rects.reference.y !== resetRects.reference.y || rects.reference.width !== resetRects.reference.width || rects.reference.height !== resetRects.reference.height) {
        return {
          reset: {
            rects: resetRects
          }
        };
      }
      return {};
    }
  };
};

// For type backwards-compatibility, the `OffsetOptions` type was also
// Derivable.
async function convertValueToCoords(state, options) {
  const {
    placement,
    platform,
    elements
  } = state;
  const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
  const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
  const alignment = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement);
  const isVertical = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement) === 'y';
  const mainAxisMulti = ['left', 'top'].includes(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);

  // eslint-disable-next-line prefer-const
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === 'number' ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: 0,
    crossAxis: 0,
    alignmentAxis: null,
    ...rawValue
  };
  if (alignment && typeof alignmentAxis === 'number') {
    crossAxis = alignment === 'end' ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
const offset = function (options) {
  if (options === void 0) {
    options = 0;
  }
  return {
    name: 'offset',
    options,
    async fn(state) {
      var _middlewareData$offse, _middlewareData$arrow;
      const {
        x,
        y,
        placement,
        middlewareData
      } = state;
      const diffCoords = await convertValueToCoords(state, options);

      // If the placement is the same and the arrow caused an alignment offset
      // then we don't need to change the positioning coordinates.
      if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      return {
        x: x + diffCoords.x,
        y: y + diffCoords.y,
        data: {
          ...diffCoords,
          placement
        }
      };
    }
  };
};

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const shift = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'shift',
    options,
    async fn(state) {
      const {
        x,
        y,
        placement
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: _ref => {
            let {
              x,
              y
            } = _ref;
            return {
              x,
              y
            };
          }
        },
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const coords = {
        x,
        y
      };
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const crossAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)((0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement));
      const mainAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAxis)(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === 'y' ? 'top' : 'left';
        const maxSide = mainAxis === 'y' ? 'bottom' : 'right';
        const min = mainAxisCoord + overflow[minSide];
        const max = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.clamp)(min, mainAxisCoord, max);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === 'y' ? 'top' : 'left';
        const maxSide = crossAxis === 'y' ? 'bottom' : 'right';
        const min = crossAxisCoord + overflow[minSide];
        const max = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.clamp)(min, crossAxisCoord, max);
      }
      const limitedCoords = limiter.fn({
        ...state,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y
        }
      };
    }
  };
};
/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
const limitShift = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    options,
    fn(state) {
      const {
        x,
        y,
        placement,
        rects,
        middlewareData
      } = state;
      const {
        offset = 0,
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const coords = {
        x,
        y
      };
      const crossAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement);
      const mainAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAxis)(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      const rawOffset = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(offset, state);
      const computedOffset = typeof rawOffset === 'number' ? {
        mainAxis: rawOffset,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...rawOffset
      };
      if (checkMainAxis) {
        const len = mainAxis === 'y' ? 'height' : 'width';
        const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
        const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
        if (mainAxisCoord < limitMin) {
          mainAxisCoord = limitMin;
        } else if (mainAxisCoord > limitMax) {
          mainAxisCoord = limitMax;
        }
      }
      if (checkCrossAxis) {
        var _middlewareData$offse, _middlewareData$offse2;
        const len = mainAxis === 'y' ? 'width' : 'height';
        const isOriginSide = ['top', 'left'].includes((0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement));
        const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
        const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
        if (crossAxisCoord < limitMin) {
          crossAxisCoord = limitMin;
        } else if (crossAxisCoord > limitMax) {
          crossAxisCoord = limitMax;
        }
      }
      return {
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      };
    }
  };
};

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
const size = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'size',
    options,
    async fn(state) {
      const {
        placement,
        rects,
        platform,
        elements
      } = state;
      const {
        apply = () => {},
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
      const alignment = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement);
      const isYAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement) === 'y';
      const {
        width,
        height
      } = rects.floating;
      let heightSide;
      let widthSide;
      if (side === 'top' || side === 'bottom') {
        heightSide = side;
        widthSide = alignment === ((await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating))) ? 'start' : 'end') ? 'left' : 'right';
      } else {
        widthSide = side;
        heightSide = alignment === 'end' ? 'top' : 'bottom';
      }
      const overflowAvailableHeight = height - overflow[heightSide];
      const overflowAvailableWidth = width - overflow[widthSide];
      const noShift = !state.middlewareData.shift;
      let availableHeight = overflowAvailableHeight;
      let availableWidth = overflowAvailableWidth;
      if (isYAxis) {
        const maximumClippingWidth = width - overflow.left - overflow.right;
        availableWidth = alignment || noShift ? (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(overflowAvailableWidth, maximumClippingWidth) : maximumClippingWidth;
      } else {
        const maximumClippingHeight = height - overflow.top - overflow.bottom;
        availableHeight = alignment || noShift ? (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(overflowAvailableHeight, maximumClippingHeight) : maximumClippingHeight;
      }
      if (noShift && !alignment) {
        const xMin = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.left, 0);
        const xMax = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.right, 0);
        const yMin = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.top, 0);
        const yMax = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.bottom, 0);
        if (isYAxis) {
          availableWidth = width - 2 * (xMin !== 0 || xMax !== 0 ? xMin + xMax : (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.left, overflow.right));
        } else {
          availableHeight = height - 2 * (yMin !== 0 || yMax !== 0 ? yMin + yMax : (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.top, overflow.bottom));
        }
      }
      await apply({
        ...state,
        availableWidth,
        availableHeight
      });
      const nextDimensions = await platform.getDimensions(elements.floating);
      if (width !== nextDimensions.width || height !== nextDimensions.height) {
        return {
          reset: {
            rects: true
          }
        };
      }
      return {};
    }
  };
};




/***/ }),

/***/ "./node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs":
/*!****************************************************************!*\
  !*** ./node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrow: () => (/* reexport safe */ _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.arrow),
/* harmony export */   autoPlacement: () => (/* reexport safe */ _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.autoPlacement),
/* harmony export */   autoUpdate: () => (/* binding */ autoUpdate),
/* harmony export */   computePosition: () => (/* binding */ computePosition),
/* harmony export */   detectOverflow: () => (/* reexport safe */ _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.detectOverflow),
/* harmony export */   flip: () => (/* reexport safe */ _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.flip),
/* harmony export */   getOverflowAncestors: () => (/* reexport safe */ _floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getOverflowAncestors),
/* harmony export */   hide: () => (/* reexport safe */ _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.hide),
/* harmony export */   inline: () => (/* reexport safe */ _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.inline),
/* harmony export */   limitShift: () => (/* reexport safe */ _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.limitShift),
/* harmony export */   offset: () => (/* reexport safe */ _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.offset),
/* harmony export */   platform: () => (/* binding */ platform),
/* harmony export */   shift: () => (/* reexport safe */ _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.shift),
/* harmony export */   size: () => (/* reexport safe */ _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.size)
/* harmony export */ });
/* harmony import */ var _floating_ui_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @floating-ui/utils */ "./node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs");
/* harmony import */ var _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @floating-ui/core */ "./node_modules/@floating-ui/core/dist/floating-ui.core.mjs");
/* harmony import */ var _floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @floating-ui/utils/dom */ "./node_modules/@floating-ui/utils/dom/dist/floating-ui.utils.dom.mjs");






function getCssDimensions(element) {
  const css = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getComputedStyle)(element);
  // In testing environments, the `width` and `height` properties are empty
  // strings for SVG elements, returning NaN. Fallback to `0` in this case.
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_2__.round)(width) !== offsetWidth || (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_2__.round)(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}

function unwrapElement(element) {
  return !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.isElement)(element) ? element.contextElement : element;
}

function getScale(element) {
  const domElement = unwrapElement(element);
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(domElement)) {
    return (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_2__.createCoords)(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $
  } = getCssDimensions(domElement);
  let x = ($ ? (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_2__.round)(rect.width) : rect.width) / width;
  let y = ($ ? (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_2__.round)(rect.height) : rect.height) / height;

  // 0, NaN, or Infinity should always fallback to 1.

  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y
  };
}

const noOffsets = /*#__PURE__*/(0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_2__.createCoords)(0);
function getVisualOffsets(element) {
  const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getWindow)(element);
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.isWebKit)() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  if (!floatingOffsetParent || isFixed && floatingOffsetParent !== (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getWindow)(element)) {
    return false;
  }
  return isFixed;
}

function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_2__.createCoords)(1);
  if (includeScale) {
    if (offsetParent) {
      if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.isElement)(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_2__.createCoords)(0);
  let x = (clientRect.left + visualOffsets.x) / scale.x;
  let y = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getWindow)(domElement);
    const offsetWin = offsetParent && (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.isElement)(offsetParent) ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getWindow)(offsetParent) : offsetParent;
    let currentIFrame = win.frameElement;
    while (currentIFrame && offsetParent && offsetWin !== win) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getComputedStyle)(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += left;
      y += top;
      currentIFrame = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getWindow)(currentIFrame).frameElement;
    }
  }
  return (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_2__.rectToClientRect)({
    width,
    height,
    x,
    y
  });
}

function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isOffsetParentAnElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(offsetParent);
  const documentElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getDocumentElement)(offsetParent);
  if (offsetParent === documentElement) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_2__.createCoords)(1);
  const offsets = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_2__.createCoords)(0);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && strategy !== 'fixed') {
    if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getNodeName)(offsetParent) !== 'body' || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.isOverflowElement)(documentElement)) {
      scroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getNodeScroll)(offsetParent);
    }
    if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y
  };
}

function getClientRects(element) {
  return Array.from(element.getClientRects());
}

function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  return getBoundingClientRect((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getDocumentElement)(element)).left + (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getNodeScroll)(element).scrollLeft;
}

// Gets the entire size of the scrollable document area, even extending outside
// of the `<html>` and `<body>` rect bounds if horizontally scrollable.
function getDocumentRect(element) {
  const html = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getDocumentElement)(element);
  const scroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getNodeScroll)(element);
  const body = element.ownerDocument.body;
  const width = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_2__.max)(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_2__.max)(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y = -scroll.scrollTop;
  if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getComputedStyle)(body).direction === 'rtl') {
    x += (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_2__.max)(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}

function getViewportRect(element, strategy) {
  const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getWindow)(element);
  const html = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getDocumentElement)(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.isWebKit)();
    if (!visualViewportBased || visualViewportBased && strategy === 'fixed') {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x,
    y
  };
}

// Returns the inner client rect, subtracting scrollbars if present.
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === 'fixed');
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(element) ? getScale(element) : (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_2__.createCoords)(1);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;
  return {
    width,
    height,
    x,
    y
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === 'viewport') {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === 'document') {
    rect = getDocumentRect((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getDocumentElement)(element));
  } else if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.isElement)(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      ...clippingAncestor,
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y
    };
  }
  return (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_2__.rectToClientRect)(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
  const parentNode = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getParentNode)(element);
  if (parentNode === stopNode || !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.isElement)(parentNode) || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.isLastTraversableNode)(parentNode)) {
    return false;
  }
  return (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getComputedStyle)(parentNode).position === 'fixed' || hasFixedPositionAncestor(parentNode, stopNode);
}

// A "clipping ancestor" is an `overflow` element with the characteristic of
// clipping (or hiding) child elements. This returns all clipping ancestors
// of the given element up the tree.
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getOverflowAncestors)(element, [], false).filter(el => (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.isElement)(el) && (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getNodeName)(el) !== 'body');
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getComputedStyle)(element).position === 'fixed';
  let currentNode = elementIsFixed ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getParentNode)(element) : element;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  while ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.isElement)(currentNode) && !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.isLastTraversableNode)(currentNode)) {
    const computedStyle = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getComputedStyle)(currentNode);
    const currentNodeIsContaining = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.isContainingBlock)(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === 'fixed') {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === 'static' && !!currentContainingBlockComputedStyle && ['absolute', 'fixed'].includes(currentContainingBlockComputedStyle.position) || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.isOverflowElement)(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
    if (shouldDropCurrentNode) {
      // Drop non-containing blocks.
      result = result.filter(ancestor => ancestor !== currentNode);
    } else {
      // Record last containing block for next iteration.
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getParentNode)(currentNode);
  }
  cache.set(element, result);
  return result;
}

// Gets the maximum area that the element is visible in due to any number of
// clipping ancestors.
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === 'clippingAncestors' ? getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
    accRect.top = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_2__.max)(rect.top, accRect.top);
    accRect.right = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_2__.min)(rect.right, accRect.right);
    accRect.bottom = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_2__.min)(rect.bottom, accRect.bottom);
    accRect.left = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_2__.max)(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
}

function getDimensions(element) {
  return getCssDimensions(element);
}

function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(offsetParent);
  const documentElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getDocumentElement)(offsetParent);
  const isFixed = strategy === 'fixed';
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_2__.createCoords)(0);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getNodeName)(offsetParent) !== 'body' || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.isOverflowElement)(documentElement)) {
      scroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getNodeScroll)(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

function getTrueOffsetParent(element, polyfill) {
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(element) || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getComputedStyle)(element).position === 'fixed') {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  return element.offsetParent;
}

// Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.
function getOffsetParent(element, polyfill) {
  const window = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getWindow)(element);
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(element)) {
    return window;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.isTableElement)(offsetParent) && (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getComputedStyle)(offsetParent).position === 'static') {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getNodeName)(offsetParent) === 'html' || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getNodeName)(offsetParent) === 'body' && (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getComputedStyle)(offsetParent).position === 'static' && !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.isContainingBlock)(offsetParent))) {
    return window;
  }
  return offsetParent || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getContainingBlock)(element) || window;
}

const getElementRects = async function (_ref) {
  let {
    reference,
    floating,
    strategy
  } = _ref;
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  return {
    reference: getRectRelativeToOffsetParent(reference, await getOffsetParentFn(floating), strategy),
    floating: {
      x: 0,
      y: 0,
      ...(await getDimensionsFn(floating))
    }
  };
};

function isRTL(element) {
  return (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getComputedStyle)(element).direction === 'rtl';
}

const platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement: _floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement: _floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.isElement,
  isRTL
};

// https://samthor.au/2021/observing-dom/
function observeMove(element, onMove) {
  let io = null;
  let timeoutId;
  const root = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getDocumentElement)(element);
  function cleanup() {
    clearTimeout(timeoutId);
    io && io.disconnect();
    io = null;
  }
  function refresh(skip, threshold) {
    if (skip === void 0) {
      skip = false;
    }
    if (threshold === void 0) {
      threshold = 1;
    }
    cleanup();
    const {
      left,
      top,
      width,
      height
    } = element.getBoundingClientRect();
    if (!skip) {
      onMove();
    }
    if (!width || !height) {
      return;
    }
    const insetTop = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_2__.floor)(top);
    const insetRight = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_2__.floor)(root.clientWidth - (left + width));
    const insetBottom = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_2__.floor)(root.clientHeight - (top + height));
    const insetLeft = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_2__.floor)(left);
    const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
    const options = {
      rootMargin,
      threshold: (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_2__.max)(0, (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_2__.min)(1, threshold)) || 1
    };
    let isFirstUpdate = true;
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;
      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }
        if (!ratio) {
          timeoutId = setTimeout(() => {
            refresh(false, 1e-7);
          }, 100);
        } else {
          refresh(false, ratio);
        }
      }
      isFirstUpdate = false;
    }

    // Older browsers don't support a `document` as the root and will throw an
    // error.
    try {
      io = new IntersectionObserver(handleObserve, {
        ...options,
        // Handle <iframe>s
        root: root.ownerDocument
      });
    } catch (e) {
      io = new IntersectionObserver(handleObserve, options);
    }
    io.observe(element);
  }
  refresh(true);
  return cleanup;
}

/**
 * Automatically updates the position of the floating element when necessary.
 * Should only be called when the floating element is mounted on the DOM or
 * visible on the screen.
 * @returns cleanup function that should be invoked when the floating element is
 * removed from the DOM or hidden from the screen.
 * @see https://floating-ui.com/docs/autoUpdate
 */
function autoUpdate(reference, floating, update, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === 'function',
    layoutShift = typeof IntersectionObserver === 'function',
    animationFrame = false
  } = options;
  const referenceEl = unwrapElement(reference);
  const ancestors = ancestorScroll || ancestorResize ? [...(referenceEl ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getOverflowAncestors)(referenceEl) : []), ...(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_1__.getOverflowAncestors)(floating)] : [];
  ancestors.forEach(ancestor => {
    ancestorScroll && ancestor.addEventListener('scroll', update, {
      passive: true
    });
    ancestorResize && ancestor.addEventListener('resize', update);
  });
  const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
  let reobserveFrame = -1;
  let resizeObserver = null;
  if (elementResize) {
    resizeObserver = new ResizeObserver(_ref => {
      let [firstEntry] = _ref;
      if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
        // Prevent update loops when using the `size` middleware.
        // https://github.com/floating-ui/floating-ui/issues/1740
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        reobserveFrame = requestAnimationFrame(() => {
          resizeObserver && resizeObserver.observe(floating);
        });
      }
      update();
    });
    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }
    resizeObserver.observe(floating);
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && (nextRefRect.x !== prevRefRect.x || nextRefRect.y !== prevRefRect.y || nextRefRect.width !== prevRefRect.width || nextRefRect.height !== prevRefRect.height)) {
      update();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update();
  return () => {
    ancestors.forEach(ancestor => {
      ancestorScroll && ancestor.removeEventListener('scroll', update);
      ancestorResize && ancestor.removeEventListener('resize', update);
    });
    cleanupIo && cleanupIo();
    resizeObserver && resizeObserver.disconnect();
    resizeObserver = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a reference element when it is given a certain CSS positioning
 * strategy.
 */
const computePosition = (reference, floating, options) => {
  // This caches the expensive `getClippingElementAncestors` function so that
  // multiple lifecycle resets re-use the same result. It only lives for a
  // single call. If other functions become expensive, we can add them as well.
  const cache = new Map();
  const mergedOptions = {
    platform,
    ...options
  };
  const platformWithCache = {
    ...mergedOptions.platform,
    _c: cache
  };
  return (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.computePosition)(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};




/***/ }),

/***/ "./node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs":
/*!********************************************************************!*\
  !*** ./node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   alignments: () => (/* binding */ alignments),
/* harmony export */   clamp: () => (/* binding */ clamp),
/* harmony export */   createCoords: () => (/* binding */ createCoords),
/* harmony export */   evaluate: () => (/* binding */ evaluate),
/* harmony export */   expandPaddingObject: () => (/* binding */ expandPaddingObject),
/* harmony export */   floor: () => (/* binding */ floor),
/* harmony export */   getAlignment: () => (/* binding */ getAlignment),
/* harmony export */   getAlignmentAxis: () => (/* binding */ getAlignmentAxis),
/* harmony export */   getAlignmentSides: () => (/* binding */ getAlignmentSides),
/* harmony export */   getAxisLength: () => (/* binding */ getAxisLength),
/* harmony export */   getExpandedPlacements: () => (/* binding */ getExpandedPlacements),
/* harmony export */   getOppositeAlignmentPlacement: () => (/* binding */ getOppositeAlignmentPlacement),
/* harmony export */   getOppositeAxis: () => (/* binding */ getOppositeAxis),
/* harmony export */   getOppositeAxisPlacements: () => (/* binding */ getOppositeAxisPlacements),
/* harmony export */   getOppositePlacement: () => (/* binding */ getOppositePlacement),
/* harmony export */   getPaddingObject: () => (/* binding */ getPaddingObject),
/* harmony export */   getSide: () => (/* binding */ getSide),
/* harmony export */   getSideAxis: () => (/* binding */ getSideAxis),
/* harmony export */   max: () => (/* binding */ max),
/* harmony export */   min: () => (/* binding */ min),
/* harmony export */   placements: () => (/* binding */ placements),
/* harmony export */   rectToClientRect: () => (/* binding */ rectToClientRect),
/* harmony export */   round: () => (/* binding */ round),
/* harmony export */   sides: () => (/* binding */ sides)
/* harmony export */ });
const sides = ['top', 'right', 'bottom', 'left'];
const alignments = ['start', 'end'];
const placements = /*#__PURE__*/sides.reduce((acc, side) => acc.concat(side, side + "-" + alignments[0], side + "-" + alignments[1]), []);
const min = Math.min;
const max = Math.max;
const round = Math.round;
const floor = Math.floor;
const createCoords = v => ({
  x: v,
  y: v
});
const oppositeSideMap = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
const oppositeAlignmentMap = {
  start: 'end',
  end: 'start'
};
function clamp(start, value, end) {
  return max(start, min(value, end));
}
function evaluate(value, param) {
  return typeof value === 'function' ? value(param) : value;
}
function getSide(placement) {
  return placement.split('-')[0];
}
function getAlignment(placement) {
  return placement.split('-')[1];
}
function getOppositeAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}
function getAxisLength(axis) {
  return axis === 'y' ? 'height' : 'width';
}
function getSideAxis(placement) {
  return ['top', 'bottom'].includes(getSide(placement)) ? 'y' : 'x';
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === 'x' ? alignment === (rtl ? 'end' : 'start') ? 'right' : 'left' : alignment === 'start' ? 'bottom' : 'top';
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.replace(/start|end/g, alignment => oppositeAlignmentMap[alignment]);
}
function getSideList(side, isStart, rtl) {
  const lr = ['left', 'right'];
  const rl = ['right', 'left'];
  const tb = ['top', 'bottom'];
  const bt = ['bottom', 'top'];
  switch (side) {
    case 'top':
    case 'bottom':
      if (rtl) return isStart ? rl : lr;
      return isStart ? lr : rl;
    case 'left':
    case 'right':
      return isStart ? tb : bt;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === 'start', rtl);
  if (alignment) {
    list = list.map(side => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, side => oppositeSideMap[side]);
}
function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}
function getPaddingObject(padding) {
  return typeof padding !== 'number' ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  return {
    ...rect,
    top: rect.y,
    left: rect.x,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  };
}




/***/ }),

/***/ "./node_modules/@floating-ui/utils/dom/dist/floating-ui.utils.dom.mjs":
/*!****************************************************************************!*\
  !*** ./node_modules/@floating-ui/utils/dom/dist/floating-ui.utils.dom.mjs ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getComputedStyle: () => (/* binding */ getComputedStyle),
/* harmony export */   getContainingBlock: () => (/* binding */ getContainingBlock),
/* harmony export */   getDocumentElement: () => (/* binding */ getDocumentElement),
/* harmony export */   getNearestOverflowAncestor: () => (/* binding */ getNearestOverflowAncestor),
/* harmony export */   getNodeName: () => (/* binding */ getNodeName),
/* harmony export */   getNodeScroll: () => (/* binding */ getNodeScroll),
/* harmony export */   getOverflowAncestors: () => (/* binding */ getOverflowAncestors),
/* harmony export */   getParentNode: () => (/* binding */ getParentNode),
/* harmony export */   getWindow: () => (/* binding */ getWindow),
/* harmony export */   isContainingBlock: () => (/* binding */ isContainingBlock),
/* harmony export */   isElement: () => (/* binding */ isElement),
/* harmony export */   isHTMLElement: () => (/* binding */ isHTMLElement),
/* harmony export */   isLastTraversableNode: () => (/* binding */ isLastTraversableNode),
/* harmony export */   isNode: () => (/* binding */ isNode),
/* harmony export */   isOverflowElement: () => (/* binding */ isOverflowElement),
/* harmony export */   isShadowRoot: () => (/* binding */ isShadowRoot),
/* harmony export */   isTableElement: () => (/* binding */ isTableElement),
/* harmony export */   isWebKit: () => (/* binding */ isWebKit)
/* harmony export */ });
function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || '').toLowerCase();
  }
  // Mocked nodes in testing environments may not be instances of Node. By
  // returning `#document` an infinite loop won't occur.
  // https://github.com/floating-ui/floating-ui/issues/2317
  return '#document';
}
function getWindow(node) {
  var _node$ownerDocument;
  return (node == null ? void 0 : (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
  return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
  // Browsers without `ShadowRoot` support.
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !['inline', 'contents'].includes(display);
}
function isTableElement(element) {
  return ['table', 'td', 'th'].includes(getNodeName(element));
}
function isContainingBlock(element) {
  const webkit = isWebKit();
  const css = getComputedStyle(element);

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  return css.transform !== 'none' || css.perspective !== 'none' || (css.containerType ? css.containerType !== 'normal' : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== 'none' : false) || !webkit && (css.filter ? css.filter !== 'none' : false) || ['transform', 'perspective', 'filter'].some(value => (css.willChange || '').includes(value)) || ['paint', 'layout', 'strict', 'content'].some(value => (css.contain || '').includes(value));
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else {
      currentNode = getParentNode(currentNode);
    }
  }
  return null;
}
function isWebKit() {
  if (typeof CSS === 'undefined' || !CSS.supports) return false;
  return CSS.supports('-webkit-backdrop-filter', 'none');
}
function isLastTraversableNode(node) {
  return ['html', 'body', '#document'].includes(getNodeName(node));
}
function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.pageXOffset,
    scrollTop: element.pageYOffset
  };
}
function getParentNode(node) {
  if (getNodeName(node) === 'html') {
    return node;
  }
  const result =
  // Step into the shadow DOM of the parent of a slotted node.
  node.assignedSlot ||
  // DOM Element detected.
  node.parentNode ||
  // ShadowRoot detected.
  isShadowRoot(node) && node.host ||
  // Fallback.
  getDocumentElement(node);
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  if (traverseIframes === void 0) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], win.frameElement && traverseIframes ? getOverflowAncestors(win.frameElement) : []);
  }
  return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
}




/***/ }),

/***/ "./node_modules/stylis/src/Enum.js":
/*!*****************************************!*\
  !*** ./node_modules/stylis/src/Enum.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CHARSET: () => (/* binding */ CHARSET),
/* harmony export */   COMMENT: () => (/* binding */ COMMENT),
/* harmony export */   COUNTER_STYLE: () => (/* binding */ COUNTER_STYLE),
/* harmony export */   DECLARATION: () => (/* binding */ DECLARATION),
/* harmony export */   DOCUMENT: () => (/* binding */ DOCUMENT),
/* harmony export */   FONT_FACE: () => (/* binding */ FONT_FACE),
/* harmony export */   FONT_FEATURE_VALUES: () => (/* binding */ FONT_FEATURE_VALUES),
/* harmony export */   IMPORT: () => (/* binding */ IMPORT),
/* harmony export */   KEYFRAMES: () => (/* binding */ KEYFRAMES),
/* harmony export */   LAYER: () => (/* binding */ LAYER),
/* harmony export */   MEDIA: () => (/* binding */ MEDIA),
/* harmony export */   MOZ: () => (/* binding */ MOZ),
/* harmony export */   MS: () => (/* binding */ MS),
/* harmony export */   NAMESPACE: () => (/* binding */ NAMESPACE),
/* harmony export */   PAGE: () => (/* binding */ PAGE),
/* harmony export */   RULESET: () => (/* binding */ RULESET),
/* harmony export */   SUPPORTS: () => (/* binding */ SUPPORTS),
/* harmony export */   VIEWPORT: () => (/* binding */ VIEWPORT),
/* harmony export */   WEBKIT: () => (/* binding */ WEBKIT)
/* harmony export */ });
var MS = '-ms-'
var MOZ = '-moz-'
var WEBKIT = '-webkit-'

var COMMENT = 'comm'
var RULESET = 'rule'
var DECLARATION = 'decl'

var PAGE = '@page'
var MEDIA = '@media'
var IMPORT = '@import'
var CHARSET = '@charset'
var VIEWPORT = '@viewport'
var SUPPORTS = '@supports'
var DOCUMENT = '@document'
var NAMESPACE = '@namespace'
var KEYFRAMES = '@keyframes'
var FONT_FACE = '@font-face'
var COUNTER_STYLE = '@counter-style'
var FONT_FEATURE_VALUES = '@font-feature-values'
var LAYER = '@layer'


/***/ }),

/***/ "./node_modules/stylis/src/Middleware.js":
/*!***********************************************!*\
  !*** ./node_modules/stylis/src/Middleware.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   middleware: () => (/* binding */ middleware),
/* harmony export */   namespace: () => (/* binding */ namespace),
/* harmony export */   prefixer: () => (/* binding */ prefixer),
/* harmony export */   rulesheet: () => (/* binding */ rulesheet)
/* harmony export */ });
/* harmony import */ var _Enum_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Enum.js */ "./node_modules/stylis/src/Enum.js");
/* harmony import */ var _Utility_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utility.js */ "./node_modules/stylis/src/Utility.js");
/* harmony import */ var _Tokenizer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Tokenizer.js */ "./node_modules/stylis/src/Tokenizer.js");
/* harmony import */ var _Serializer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Serializer.js */ "./node_modules/stylis/src/Serializer.js");
/* harmony import */ var _Prefixer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Prefixer.js */ "./node_modules/stylis/src/Prefixer.js");






/**
 * @param {function[]} collection
 * @return {function}
 */
function middleware (collection) {
	var length = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.sizeof)(collection)

	return function (element, index, children, callback) {
		var output = ''

		for (var i = 0; i < length; i++)
			output += collection[i](element, index, children, callback) || ''

		return output
	}
}

/**
 * @param {function} callback
 * @return {function}
 */
function rulesheet (callback) {
	return function (element) {
		if (!element.root)
			if (element = element.return)
				callback(element)
	}
}

/**
 * @param {object} element
 * @param {number} index
 * @param {object[]} children
 * @param {function} callback
 */
function prefixer (element, index, children, callback) {
	if (element.length > -1)
		if (!element.return)
			switch (element.type) {
				case _Enum_js__WEBPACK_IMPORTED_MODULE_1__.DECLARATION: element.return = (0,_Prefixer_js__WEBPACK_IMPORTED_MODULE_2__.prefix)(element.value, element.length, children)
					return
				case _Enum_js__WEBPACK_IMPORTED_MODULE_1__.KEYFRAMES:
					return (0,_Serializer_js__WEBPACK_IMPORTED_MODULE_3__.serialize)([(0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_4__.copy)(element, {value: (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(element.value, '@', '@' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT)})], callback)
				case _Enum_js__WEBPACK_IMPORTED_MODULE_1__.RULESET:
					if (element.length)
						return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.combine)(element.props, function (value) {
							switch ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.match)(value, /(::plac\w+|:read-\w+)/)) {
								// :read-(only|write)
								case ':read-only': case ':read-write':
									return (0,_Serializer_js__WEBPACK_IMPORTED_MODULE_3__.serialize)([(0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_4__.copy)(element, {props: [(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /:(read-\w+)/, ':' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MOZ + '$1')]})], callback)
								// :placeholder
								case '::placeholder':
									return (0,_Serializer_js__WEBPACK_IMPORTED_MODULE_3__.serialize)([
										(0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_4__.copy)(element, {props: [(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /:(plac\w+)/, ':' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + 'input-$1')]}),
										(0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_4__.copy)(element, {props: [(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /:(plac\w+)/, ':' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MOZ + '$1')]}),
										(0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_4__.copy)(element, {props: [(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /:(plac\w+)/, _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + 'input-$1')]})
									], callback)
							}

							return ''
						})
			}
}

/**
 * @param {object} element
 * @param {number} index
 * @param {object[]} children
 */
function namespace (element) {
	switch (element.type) {
		case _Enum_js__WEBPACK_IMPORTED_MODULE_1__.RULESET:
			element.props = element.props.map(function (value) {
				return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.combine)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_4__.tokenize)(value), function (value, index, children) {
					switch ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(value, 0)) {
						// \f
						case 12:
							return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.substr)(value, 1, (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.strlen)(value))
						// \0 ( + > ~
						case 0: case 40: case 43: case 62: case 126:
							return value
						// :
						case 58:
							if (children[++index] === 'global')
								children[index] = '', children[++index] = '\f' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.substr)(children[index], index = 1, -1)
						// \s
						case 32:
							return index === 1 ? '' : value
						default:
							switch (index) {
								case 0: element = value
									return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.sizeof)(children) > 1 ? '' : value
								case index = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.sizeof)(children) - 1: case 2:
									return index === 2 ? value + element + element : value + element
								default:
									return value
							}
					}
				})
			})
	}
}


/***/ }),

/***/ "./node_modules/stylis/src/Parser.js":
/*!*******************************************!*\
  !*** ./node_modules/stylis/src/Parser.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   comment: () => (/* binding */ comment),
/* harmony export */   compile: () => (/* binding */ compile),
/* harmony export */   declaration: () => (/* binding */ declaration),
/* harmony export */   parse: () => (/* binding */ parse),
/* harmony export */   ruleset: () => (/* binding */ ruleset)
/* harmony export */ });
/* harmony import */ var _Enum_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Enum.js */ "./node_modules/stylis/src/Enum.js");
/* harmony import */ var _Utility_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utility.js */ "./node_modules/stylis/src/Utility.js");
/* harmony import */ var _Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Tokenizer.js */ "./node_modules/stylis/src/Tokenizer.js");




/**
 * @param {string} value
 * @return {object[]}
 */
function compile (value) {
	return (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.dealloc)(parse('', null, null, null, [''], value = (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.alloc)(value), 0, [0], value))
}

/**
 * @param {string} value
 * @param {object} root
 * @param {object?} parent
 * @param {string[]} rule
 * @param {string[]} rules
 * @param {string[]} rulesets
 * @param {number[]} pseudo
 * @param {number[]} points
 * @param {string[]} declarations
 * @return {object}
 */
function parse (value, root, parent, rule, rules, rulesets, pseudo, points, declarations) {
	var index = 0
	var offset = 0
	var length = pseudo
	var atrule = 0
	var property = 0
	var previous = 0
	var variable = 1
	var scanning = 1
	var ampersand = 1
	var character = 0
	var type = ''
	var props = rules
	var children = rulesets
	var reference = rule
	var characters = type

	while (scanning)
		switch (previous = character, character = (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.next)()) {
			// (
			case 40:
				if (previous != 108 && (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.charat)(characters, length - 1) == 58) {
					if ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.indexof)(characters += (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.delimit)(character), '&', '&\f'), '&\f') != -1)
						ampersand = -1
					break
				}
			// " ' [
			case 34: case 39: case 91:
				characters += (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.delimit)(character)
				break
			// \t \n \r \s
			case 9: case 10: case 13: case 32:
				characters += (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.whitespace)(previous)
				break
			// \
			case 92:
				characters += (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.escaping)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.caret)() - 1, 7)
				continue
			// /
			case 47:
				switch ((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.peek)()) {
					case 42: case 47:
						;(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.append)(comment((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.commenter)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.next)(), (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.caret)()), root, parent), declarations)
						break
					default:
						characters += '/'
				}
				break
			// {
			case 123 * variable:
				points[index++] = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(characters) * ampersand
			// } ; \0
			case 125 * variable: case 59: case 0:
				switch (character) {
					// \0 }
					case 0: case 125: scanning = 0
					// ;
					case 59 + offset: if (ampersand == -1) characters = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(characters, /\f/g, '')
						if (property > 0 && ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(characters) - length))
							(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.append)(property > 32 ? declaration(characters + ';', rule, parent, length - 1) : declaration((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(characters, ' ', '') + ';', rule, parent, length - 2), declarations)
						break
					// @ ;
					case 59: characters += ';'
					// { rule/at-rule
					default:
						;(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.append)(reference = ruleset(characters, root, parent, index, offset, rules, points, type, props = [], children = [], length), rulesets)

						if (character === 123)
							if (offset === 0)
								parse(characters, root, reference, reference, props, rulesets, length, points, children)
							else
								switch (atrule === 99 && (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.charat)(characters, 3) === 110 ? 100 : atrule) {
									// d l m s
									case 100: case 108: case 109: case 115:
										parse(value, reference, reference, rule && (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.append)(ruleset(value, reference, reference, 0, 0, rules, points, type, rules, props = [], length), children), rules, children, length, points, rule ? props : children)
										break
									default:
										parse(characters, reference, reference, reference, [''], children, 0, points, children)
								}
				}

				index = offset = property = 0, variable = ampersand = 1, type = characters = '', length = pseudo
				break
			// :
			case 58:
				length = 1 + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(characters), property = previous
			default:
				if (variable < 1)
					if (character == 123)
						--variable
					else if (character == 125 && variable++ == 0 && (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.prev)() == 125)
						continue

				switch (characters += (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.from)(character), character * variable) {
					// &
					case 38:
						ampersand = offset > 0 ? 1 : (characters += '\f', -1)
						break
					// ,
					case 44:
						points[index++] = ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(characters) - 1) * ampersand, ampersand = 1
						break
					// @
					case 64:
						// -
						if ((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.peek)() === 45)
							characters += (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.delimit)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.next)())

						atrule = (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.peek)(), offset = length = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(type = characters += (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.identifier)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.caret)())), character++
						break
					// -
					case 45:
						if (previous === 45 && (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(characters) == 2)
							variable = 0
				}
		}

	return rulesets
}

/**
 * @param {string} value
 * @param {object} root
 * @param {object?} parent
 * @param {number} index
 * @param {number} offset
 * @param {string[]} rules
 * @param {number[]} points
 * @param {string} type
 * @param {string[]} props
 * @param {string[]} children
 * @param {number} length
 * @return {object}
 */
function ruleset (value, root, parent, index, offset, rules, points, type, props, children, length) {
	var post = offset - 1
	var rule = offset === 0 ? rules : ['']
	var size = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.sizeof)(rule)

	for (var i = 0, j = 0, k = 0; i < index; ++i)
		for (var x = 0, y = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.substr)(value, post + 1, post = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.abs)(j = points[i])), z = value; x < size; ++x)
			if (z = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.trim)(j > 0 ? rule[x] + ' ' + y : (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(y, /&\f/g, rule[x])))
				props[k++] = z

	return (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.node)(value, root, parent, offset === 0 ? _Enum_js__WEBPACK_IMPORTED_MODULE_2__.RULESET : type, props, children, length)
}

/**
 * @param {number} value
 * @param {object} root
 * @param {object?} parent
 * @return {object}
 */
function comment (value, root, parent) {
	return (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.node)(value, root, parent, _Enum_js__WEBPACK_IMPORTED_MODULE_2__.COMMENT, (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.from)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.char)()), (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.substr)(value, 2, -2), 0)
}

/**
 * @param {string} value
 * @param {object} root
 * @param {object?} parent
 * @param {number} length
 * @return {object}
 */
function declaration (value, root, parent, length) {
	return (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.node)(value, root, parent, _Enum_js__WEBPACK_IMPORTED_MODULE_2__.DECLARATION, (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.substr)(value, 0, length), (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.substr)(value, length + 1, -1), length)
}


/***/ }),

/***/ "./node_modules/stylis/src/Prefixer.js":
/*!*********************************************!*\
  !*** ./node_modules/stylis/src/Prefixer.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   prefix: () => (/* binding */ prefix)
/* harmony export */ });
/* harmony import */ var _Enum_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Enum.js */ "./node_modules/stylis/src/Enum.js");
/* harmony import */ var _Utility_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utility.js */ "./node_modules/stylis/src/Utility.js");



/**
 * @param {string} value
 * @param {number} length
 * @param {object[]} children
 * @return {string}
 */
function prefix (value, length, children) {
	switch ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.hash)(value, length)) {
		// color-adjust
		case 5103:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + 'print-' + value + value
		// animation, animation-(delay|direction|duration|fill-mode|iteration-count|name|play-state|timing-function)
		case 5737: case 4201: case 3177: case 3433: case 1641: case 4457: case 2921:
		// text-decoration, filter, clip-path, backface-visibility, column, box-decoration-break
		case 5572: case 6356: case 5844: case 3191: case 6645: case 3005:
		// mask, mask-image, mask-(mode|clip|size), mask-(repeat|origin), mask-position, mask-composite,
		case 6391: case 5879: case 5623: case 6135: case 4599: case 4855:
		// background-clip, columns, column-(count|fill|gap|rule|rule-color|rule-style|rule-width|span|width)
		case 4215: case 6389: case 5109: case 5365: case 5621: case 3829:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + value
		// tab-size
		case 4789:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MOZ + value + value
		// appearance, user-select, transform, hyphens, text-size-adjust
		case 5349: case 4246: case 4810: case 6968: case 2756:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MOZ + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + value + value
		// writing-mode
		case 5936:
			switch ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(value, length + 11)) {
				// vertical-l(r)
				case 114:
					return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /[svh]\w+-[tblr]{2}/, 'tb') + value
				// vertical-r(l)
				case 108:
					return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /[svh]\w+-[tblr]{2}/, 'tb-rl') + value
				// horizontal(-)tb
				case 45:
					return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /[svh]\w+-[tblr]{2}/, 'lr') + value
				// default: fallthrough to below
			}
		// flex, flex-direction, scroll-snap-type, writing-mode
		case 6828: case 4268: case 2903:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + value + value
		// order
		case 6165:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + 'flex-' + value + value
		// align-items
		case 5187:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /(\w+).+(:[^]+)/, _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + 'box-$1$2' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + 'flex-$1$2') + value
		// align-self
		case 5443:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + 'flex-item-' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /flex-|-self/g, '') + (!(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.match)(value, /flex-|baseline/) ? _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + 'grid-row-' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /flex-|-self/g, '') : '') + value
		// align-content
		case 4675:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + 'flex-line-pack' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /align-content|flex-|-self/g, '') + value
		// flex-shrink
		case 5548:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, 'shrink', 'negative') + value
		// flex-basis
		case 5292:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, 'basis', 'preferred-size') + value
		// flex-grow
		case 6060:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + 'box-' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, '-grow', '') + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, 'grow', 'positive') + value
		// transition
		case 4554:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /([^-])(transform)/g, '$1' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$2') + value
		// cursor
		case 6187:
			return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /(zoom-|grab)/, _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$1'), /(image-set)/, _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$1'), value, '') + value
		// background, background-image
		case 5495: case 3959:
			return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /(image-set\([^]*)/, _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$1' + '$`$1')
		// justify-content
		case 4968:
			return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /(.+:)(flex-)?(.*)/, _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + 'box-pack:$3' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + 'flex-pack:$3'), /s.+-b[^;]+/, 'justify') + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + value
		// justify-self
		case 4200:
			if (!(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.match)(value, /flex-|baseline/)) return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + 'grid-column-align' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.substr)(value, length) + value
			break
		// grid-template-(columns|rows)
		case 2592: case 3360:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, 'template-', '') + value
		// grid-(row|column)-start
		case 4384: case 3616:
			if (children && children.some(function (element, index) { return length = index, (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.match)(element.props, /grid-\w+-end/) })) {
				return ~(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.indexof)(value + (children = children[length].value), 'span') ? value : (_Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, '-start', '') + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + 'grid-row-span:' + (~(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.indexof)(children, 'span') ? (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.match)(children, /\d+/) : +(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.match)(children, /\d+/) - +(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.match)(value, /\d+/)) + ';')
			}
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, '-start', '') + value
		// grid-(row|column)-end
		case 4896: case 4128:
			return (children && children.some(function (element) { return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.match)(element.props, /grid-\w+-start/) })) ? value : _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, '-end', '-span'), 'span ', '') + value
		// (margin|padding)-inline-(start|end)
		case 4095: case 3583: case 4068: case 2532:
			return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /(.+)-inline(.+)/, _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$1$2') + value
		// (min|max)?(width|height|inline-size|block-size)
		case 8116: case 7059: case 5753: case 5535:
		case 5445: case 5701: case 4933: case 4677:
		case 5533: case 5789: case 5021: case 4765:
			// stretch, max-content, min-content, fill-available
			if ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.strlen)(value) - 1 - length > 6)
				switch ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(value, length + 1)) {
					// (m)ax-content, (m)in-content
					case 109:
						// -
						if ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(value, length + 4) !== 45)
							break
					// (f)ill-available, (f)it-content
					case 102:
						return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /(.+:)(.+)-([^]+)/, '$1' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$2-$3' + '$1' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MOZ + ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(value, length + 3) == 108 ? '$3' : '$2-$3')) + value
					// (s)tretch
					case 115:
						return ~(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.indexof)(value, 'stretch') ? prefix((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, 'stretch', 'fill-available'), length, children) + value : value
				}
			break
		// grid-(column|row)
		case 5152: case 5920:
			return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /(.+?):(\d+)(\s*\/\s*(span)?\s*(\d+))?(.*)/, function (_, a, b, c, d, e, f) { return (_Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + a + ':' + b + f) + (c ? (_Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + a + '-span:' + (d ? e : +e - +b)) + f : '') + value })
		// position: sticky
		case 4949:
			// stick(y)?
			if ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(value, length + 6) === 121)
				return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, ':', ':' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT) + value
			break
		// display: (flex|inline-flex|grid|inline-grid)
		case 6444:
			switch ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(value, (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(value, 14) === 45 ? 18 : 11)) {
				// (inline-)?fle(x)
				case 120:
					return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /(.+:)([^;\s!]+)(;|(\s+)?!.+)?/, '$1' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(value, 14) === 45 ? 'inline-' : '') + 'box$3' + '$1' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$2$3' + '$1' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + '$2box$3') + value
				// (inline-)?gri(d)
				case 100:
					return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, ':', ':' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS) + value
			}
			break
		// scroll-margin, scroll-margin-(top|right|bottom|left)
		case 5719: case 2647: case 2135: case 3927: case 2391:
			return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, 'scroll-', 'scroll-snap-') + value
	}

	return value
}


/***/ }),

/***/ "./node_modules/stylis/src/Serializer.js":
/*!***********************************************!*\
  !*** ./node_modules/stylis/src/Serializer.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   serialize: () => (/* binding */ serialize),
/* harmony export */   stringify: () => (/* binding */ stringify)
/* harmony export */ });
/* harmony import */ var _Enum_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Enum.js */ "./node_modules/stylis/src/Enum.js");
/* harmony import */ var _Utility_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utility.js */ "./node_modules/stylis/src/Utility.js");



/**
 * @param {object[]} children
 * @param {function} callback
 * @return {string}
 */
function serialize (children, callback) {
	var output = ''
	var length = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.sizeof)(children)

	for (var i = 0; i < length; i++)
		output += callback(children[i], i, children, callback) || ''

	return output
}

/**
 * @param {object} element
 * @param {number} index
 * @param {object[]} children
 * @param {function} callback
 * @return {string}
 */
function stringify (element, index, children, callback) {
	switch (element.type) {
		case _Enum_js__WEBPACK_IMPORTED_MODULE_1__.LAYER: if (element.children.length) break
		case _Enum_js__WEBPACK_IMPORTED_MODULE_1__.IMPORT: case _Enum_js__WEBPACK_IMPORTED_MODULE_1__.DECLARATION: return element.return = element.return || element.value
		case _Enum_js__WEBPACK_IMPORTED_MODULE_1__.COMMENT: return ''
		case _Enum_js__WEBPACK_IMPORTED_MODULE_1__.KEYFRAMES: return element.return = element.value + '{' + serialize(element.children, callback) + '}'
		case _Enum_js__WEBPACK_IMPORTED_MODULE_1__.RULESET: element.value = element.props.join(',')
	}

	return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.strlen)(children = serialize(element.children, callback)) ? element.return = element.value + '{' + children + '}' : ''
}


/***/ }),

/***/ "./node_modules/stylis/src/Tokenizer.js":
/*!**********************************************!*\
  !*** ./node_modules/stylis/src/Tokenizer.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   alloc: () => (/* binding */ alloc),
/* harmony export */   caret: () => (/* binding */ caret),
/* harmony export */   char: () => (/* binding */ char),
/* harmony export */   character: () => (/* binding */ character),
/* harmony export */   characters: () => (/* binding */ characters),
/* harmony export */   column: () => (/* binding */ column),
/* harmony export */   commenter: () => (/* binding */ commenter),
/* harmony export */   copy: () => (/* binding */ copy),
/* harmony export */   dealloc: () => (/* binding */ dealloc),
/* harmony export */   delimit: () => (/* binding */ delimit),
/* harmony export */   delimiter: () => (/* binding */ delimiter),
/* harmony export */   escaping: () => (/* binding */ escaping),
/* harmony export */   identifier: () => (/* binding */ identifier),
/* harmony export */   length: () => (/* binding */ length),
/* harmony export */   line: () => (/* binding */ line),
/* harmony export */   next: () => (/* binding */ next),
/* harmony export */   node: () => (/* binding */ node),
/* harmony export */   peek: () => (/* binding */ peek),
/* harmony export */   position: () => (/* binding */ position),
/* harmony export */   prev: () => (/* binding */ prev),
/* harmony export */   slice: () => (/* binding */ slice),
/* harmony export */   token: () => (/* binding */ token),
/* harmony export */   tokenize: () => (/* binding */ tokenize),
/* harmony export */   tokenizer: () => (/* binding */ tokenizer),
/* harmony export */   whitespace: () => (/* binding */ whitespace)
/* harmony export */ });
/* harmony import */ var _Utility_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utility.js */ "./node_modules/stylis/src/Utility.js");


var line = 1
var column = 1
var length = 0
var position = 0
var character = 0
var characters = ''

/**
 * @param {string} value
 * @param {object | null} root
 * @param {object | null} parent
 * @param {string} type
 * @param {string[] | string} props
 * @param {object[] | string} children
 * @param {number} length
 */
function node (value, root, parent, type, props, children, length) {
	return {value: value, root: root, parent: parent, type: type, props: props, children: children, line: line, column: column, length: length, return: ''}
}

/**
 * @param {object} root
 * @param {object} props
 * @return {object}
 */
function copy (root, props) {
	return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.assign)(node('', null, null, '', null, null, 0), root, {length: -root.length}, props)
}

/**
 * @return {number}
 */
function char () {
	return character
}

/**
 * @return {number}
 */
function prev () {
	character = position > 0 ? (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(characters, --position) : 0

	if (column--, character === 10)
		column = 1, line--

	return character
}

/**
 * @return {number}
 */
function next () {
	character = position < length ? (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(characters, position++) : 0

	if (column++, character === 10)
		column = 1, line++

	return character
}

/**
 * @return {number}
 */
function peek () {
	return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(characters, position)
}

/**
 * @return {number}
 */
function caret () {
	return position
}

/**
 * @param {number} begin
 * @param {number} end
 * @return {string}
 */
function slice (begin, end) {
	return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.substr)(characters, begin, end)
}

/**
 * @param {number} type
 * @return {number}
 */
function token (type) {
	switch (type) {
		// \0 \t \n \r \s whitespace token
		case 0: case 9: case 10: case 13: case 32:
			return 5
		// ! + , / > @ ~ isolate token
		case 33: case 43: case 44: case 47: case 62: case 64: case 126:
		// ; { } breakpoint token
		case 59: case 123: case 125:
			return 4
		// : accompanied token
		case 58:
			return 3
		// " ' ( [ opening delimit token
		case 34: case 39: case 40: case 91:
			return 2
		// ) ] closing delimit token
		case 41: case 93:
			return 1
	}

	return 0
}

/**
 * @param {string} value
 * @return {any[]}
 */
function alloc (value) {
	return line = column = 1, length = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.strlen)(characters = value), position = 0, []
}

/**
 * @param {any} value
 * @return {any}
 */
function dealloc (value) {
	return characters = '', value
}

/**
 * @param {number} type
 * @return {string}
 */
function delimit (type) {
	return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.trim)(slice(position - 1, delimiter(type === 91 ? type + 2 : type === 40 ? type + 1 : type)))
}

/**
 * @param {string} value
 * @return {string[]}
 */
function tokenize (value) {
	return dealloc(tokenizer(alloc(value)))
}

/**
 * @param {number} type
 * @return {string}
 */
function whitespace (type) {
	while (character = peek())
		if (character < 33)
			next()
		else
			break

	return token(type) > 2 || token(character) > 3 ? '' : ' '
}

/**
 * @param {string[]} children
 * @return {string[]}
 */
function tokenizer (children) {
	while (next())
		switch (token(character)) {
			case 0: (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.append)(identifier(position - 1), children)
				break
			case 2: ;(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.append)(delimit(character), children)
				break
			default: ;(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.append)((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.from)(character), children)
		}

	return children
}

/**
 * @param {number} index
 * @param {number} count
 * @return {string}
 */
function escaping (index, count) {
	while (--count && next())
		// not 0-9 A-F a-f
		if (character < 48 || character > 102 || (character > 57 && character < 65) || (character > 70 && character < 97))
			break

	return slice(index, caret() + (count < 6 && peek() == 32 && next() == 32))
}

/**
 * @param {number} type
 * @return {number}
 */
function delimiter (type) {
	while (next())
		switch (character) {
			// ] ) " '
			case type:
				return position
			// " '
			case 34: case 39:
				if (type !== 34 && type !== 39)
					delimiter(character)
				break
			// (
			case 40:
				if (type === 41)
					delimiter(type)
				break
			// \
			case 92:
				next()
				break
		}

	return position
}

/**
 * @param {number} type
 * @param {number} index
 * @return {number}
 */
function commenter (type, index) {
	while (next())
		// //
		if (type + character === 47 + 10)
			break
		// /*
		else if (type + character === 42 + 42 && peek() === 47)
			break

	return '/*' + slice(index, position - 1) + '*' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.from)(type === 47 ? type : next())
}

/**
 * @param {number} index
 * @return {string}
 */
function identifier (index) {
	while (!token(peek()))
		next()

	return slice(index, position)
}


/***/ }),

/***/ "./node_modules/stylis/src/Utility.js":
/*!********************************************!*\
  !*** ./node_modules/stylis/src/Utility.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   abs: () => (/* binding */ abs),
/* harmony export */   append: () => (/* binding */ append),
/* harmony export */   assign: () => (/* binding */ assign),
/* harmony export */   charat: () => (/* binding */ charat),
/* harmony export */   combine: () => (/* binding */ combine),
/* harmony export */   from: () => (/* binding */ from),
/* harmony export */   hash: () => (/* binding */ hash),
/* harmony export */   indexof: () => (/* binding */ indexof),
/* harmony export */   match: () => (/* binding */ match),
/* harmony export */   replace: () => (/* binding */ replace),
/* harmony export */   sizeof: () => (/* binding */ sizeof),
/* harmony export */   strlen: () => (/* binding */ strlen),
/* harmony export */   substr: () => (/* binding */ substr),
/* harmony export */   trim: () => (/* binding */ trim)
/* harmony export */ });
/**
 * @param {number}
 * @return {number}
 */
var abs = Math.abs

/**
 * @param {number}
 * @return {string}
 */
var from = String.fromCharCode

/**
 * @param {object}
 * @return {object}
 */
var assign = Object.assign

/**
 * @param {string} value
 * @param {number} length
 * @return {number}
 */
function hash (value, length) {
	return charat(value, 0) ^ 45 ? (((((((length << 2) ^ charat(value, 0)) << 2) ^ charat(value, 1)) << 2) ^ charat(value, 2)) << 2) ^ charat(value, 3) : 0
}

/**
 * @param {string} value
 * @return {string}
 */
function trim (value) {
	return value.trim()
}

/**
 * @param {string} value
 * @param {RegExp} pattern
 * @return {string?}
 */
function match (value, pattern) {
	return (value = pattern.exec(value)) ? value[0] : value
}

/**
 * @param {string} value
 * @param {(string|RegExp)} pattern
 * @param {string} replacement
 * @return {string}
 */
function replace (value, pattern, replacement) {
	return value.replace(pattern, replacement)
}

/**
 * @param {string} value
 * @param {string} search
 * @return {number}
 */
function indexof (value, search) {
	return value.indexOf(search)
}

/**
 * @param {string} value
 * @param {number} index
 * @return {number}
 */
function charat (value, index) {
	return value.charCodeAt(index) | 0
}

/**
 * @param {string} value
 * @param {number} begin
 * @param {number} end
 * @return {string}
 */
function substr (value, begin, end) {
	return value.slice(begin, end)
}

/**
 * @param {string} value
 * @return {number}
 */
function strlen (value) {
	return value.length
}

/**
 * @param {any[]} value
 * @return {number}
 */
function sizeof (value) {
	return value.length
}

/**
 * @param {any} value
 * @param {any[]} array
 * @return {any}
 */
function append (value, array) {
	return array.push(value), value
}

/**
 * @param {string[]} array
 * @param {function} callback
 * @return {string}
 */
function combine (array, callback) {
	return array.map(callback).join('')
}


/***/ }),

/***/ "./src/block.json":
/*!************************!*\
  !*** ./src/block.json ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":2,"name":"cp/cool-flipbox-block","title":"Cool Flipbox Block","category":"widgets","description":"Dynamically highlight content with the animated Cool Flipbox Block.","keywords":["flip box","cool flipbox","flipbox","animation"],"textdomain":"cfb-block","attributes":{"id":{"type":"string"},"title":{"type":"string","default":"Front Title Here"},"description":{"type":"string","default":"Replaced default content. Elevate design effortlessly with Flipbox Block for a professional touch."},"animType":{"type":"string","default":"flipY"},"width":{"type":["number","string"]},"widthTablet":{"type":["string"]},"widthMobile":{"type":["string"]},"height":{"type":["number","string"]},"heightTablet":{"type":["string"]},"heightMobile":{"type":["string"]},"padding":{"type":["number","object"]},"paddingTablet":{"type":"object"},"paddingMobile":{"type":"object"},"borderWidth":{"type":["number","object"]},"borderColor":{"type":"string"},"borderRadius":{"type":["number","object"]},"frontVerticalAlign":{"type":"string"},"frontHorizontalAlign":{"type":"string"},"frontTextAlign":{"type":"string"},"backVerticalAlign":{"type":"string"},"backHorizontalAlign":{"type":"string"},"backTextAlign":{"type":"string"},"frontMedia":{"type":"object"},"frontMediaWidth":{"type":["number","string"]},"frontMediaHeight":{"type":["number","string"]},"frontBackgroundImage":{"type":"object"},"frontBackgroundType":{"type":"string","default":"color"},"frontBackgroundColor":{"type":"string","default":"#0693E3"},"frontBackgroundGradient":{"type":"string"},"frontBackgroundPosition":{"type":"object"},"frontBackgroundRepeat":{"type":"string"},"frontBackgroundAttachment":{"type":"string"},"frontBackgroundSize":{"type":"string"},"backMedia":{"type":"object"},"backMediaWidth":{"type":["number","string"]},"backMediaHeight":{"type":["number","string"]},"backBackgroundImage":{"type":"object"},"backBackgroundType":{"type":"string","default":"gradient"},"backBackgroundColor":{"type":"string"},"backBackgroundGradient":{"type":"string","default":"linear-gradient(135deg,rgb(6,147,227) 0%,rgb(0,180,216) 100%)"},"backBackgroundPosition":{"type":"object"},"backBackgroundRepeat":{"type":"string"},"backBackgroundSize":{"type":"string"},"backBackgroundAttachment":{"type":"string"},"boxShadow":{"type":"boolean","default":false},"boxShadowColor":{"type":"string","default":"#000000"},"boxShadowColorOpacity":{"type":"number","default":50},"boxShadowBlur":{"type":"number","default":5},"boxShadowHorizontal":{"type":"number","default":0},"boxShadowVertical":{"type":"number","default":0},"titleColor":{"type":"string","default":"#ffffff"},"descriptionColor":{"type":"string","default":"#ffffff"},"frontContentType":{"type":"string","default":"icon"},"backContentType":{"type":"string"},"//titleFontSize":{"type":["number","string"]},"//descriptionFontSize":{"type":["number","string"]},"frontTitleFontSize":{"type":["number","string"]},"frontTitleFontFamily":{"type":"string"},"frontTitleFontWeight":{"type":["number","string"]},"frontTitleLineHeight":{"type":["number","string"]},"frontDescFontSize":{"type":["number","string"]},"frontDescFontFamily":{"type":"string"},"frontDescFontWeight":{"type":["number","string"]},"frontDescLineHeight":{"type":["number","string"]},"frontTitleGoogleFont":{"type":"boolean","default":false},"frontDescGoogleFont":{"type":"boolean","default":false},"backTitleFontSize":{"type":["number","string"]},"backTitleFontFamily":{"type":"string"},"backTitleFontWeight":{"type":["number","string"]},"backTitleLineHeight":{"type":["number","string"]},"backDescFontSize":{"type":["number","string"]},"backDescFontFamily":{"type":"string"},"backDescFontWeight":{"type":["number","string"]},"backDescLineHeight":{"type":["number","string"]},"backTitleGoogleFont":{"type":"boolean","default":false},"backDescGoogleFont":{"type":"boolean","default":false},"frontIconData":{"type":"object","default":{"name":"fa-clock","prefix":"fas"}},"frontIconSize":{"type":["number","string"]},"frontIconColor":{"type":"string","default":"#ffffff"},"backIconData":{"type":"object","default":{"name":"fa-clock","prefix":"fas"}},"backIconSize":{"type":["number","string"]},"backIconColor":{"type":"string"},"preview":{"type":"boolean","default":false},"cfbBlockFlipboxVersion":{"type":"string"}},"editorStyle":"cfb-block-editor","style":"cfb-block-style"}');

/***/ }),

/***/ "./src/components/font-awesome-control/fa-icons.json":
/*!***********************************************************!*\
  !*** ./src/components/font-awesome-control/fa-icons.json ***!
  \***********************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"500px":{"styles":["brands"],"unicode":"f26e","label":"500px"},"accessible-icon":{"styles":["brands"],"unicode":"f368","label":"Accessible Icon"},"accusoft":{"styles":["brands"],"unicode":"f369","label":"Accusoft"},"acquisitions-incorporated":{"styles":["brands"],"unicode":"f6af","label":"Acquisitions Incorporated"},"ad":{"styles":["solid"],"unicode":"f641","label":"Ad"},"address-book":{"styles":["solid","regular"],"unicode":"f2b9","label":"Address Book"},"address-card":{"styles":["solid","regular"],"unicode":"f2bb","label":"Address Card"},"adjust":{"styles":["solid"],"unicode":"f042","label":"adjust"},"adn":{"styles":["brands"],"unicode":"f170","label":"App.net"},"adversal":{"styles":["brands"],"unicode":"f36a","label":"Adversal"},"affiliatetheme":{"styles":["brands"],"unicode":"f36b","label":"affiliatetheme"},"air-freshener":{"styles":["solid"],"unicode":"f5d0","label":"Air Freshener"},"airbnb":{"styles":["brands"],"unicode":"f834","label":"Airbnb"},"algolia":{"styles":["brands"],"unicode":"f36c","label":"Algolia"},"align-center":{"styles":["solid"],"unicode":"f037","label":"align-center"},"align-justify":{"styles":["solid"],"unicode":"f039","label":"align-justify"},"align-left":{"styles":["solid"],"unicode":"f036","label":"align-left"},"align-right":{"styles":["solid"],"unicode":"f038","label":"align-right"},"alipay":{"styles":["brands"],"unicode":"f642","label":"Alipay"},"allergies":{"styles":["solid"],"unicode":"f461","label":"Allergies"},"amazon":{"styles":["brands"],"unicode":"f270","label":"Amazon"},"amazon-pay":{"styles":["brands"],"unicode":"f42c","label":"Amazon Pay"},"ambulance":{"styles":["solid"],"unicode":"f0f9","label":"ambulance"},"american-sign-language-interpreting":{"styles":["solid"],"unicode":"f2a3","label":"American Sign Language Interpreting"},"amilia":{"styles":["brands"],"unicode":"f36d","label":"Amilia"},"anchor":{"styles":["solid"],"unicode":"f13d","label":"Anchor"},"android":{"styles":["brands"],"unicode":"f17b","label":"Android"},"angellist":{"styles":["brands"],"unicode":"f209","label":"AngelList"},"angle-double-down":{"styles":["solid"],"unicode":"f103","label":"Angle Double Down"},"angle-double-left":{"styles":["solid"],"unicode":"f100","label":"Angle Double Left"},"angle-double-right":{"styles":["solid"],"unicode":"f101","label":"Angle Double Right"},"angle-double-up":{"styles":["solid"],"unicode":"f102","label":"Angle Double Up"},"angle-down":{"styles":["solid"],"unicode":"f107","label":"angle-down"},"angle-left":{"styles":["solid"],"unicode":"f104","label":"angle-left"},"angle-right":{"styles":["solid"],"unicode":"f105","label":"angle-right"},"angle-up":{"styles":["solid"],"unicode":"f106","label":"angle-up"},"angry":{"styles":["solid","regular"],"unicode":"f556","label":"Angry Face"},"angrycreative":{"styles":["brands"],"unicode":"f36e","label":"Angry Creative"},"angular":{"styles":["brands"],"unicode":"f420","label":"Angular"},"ankh":{"styles":["solid"],"unicode":"f644","label":"Ankh"},"app-store":{"styles":["brands"],"unicode":"f36f","label":"App Store"},"app-store-ios":{"styles":["brands"],"unicode":"f370","label":"iOS App Store"},"apper":{"styles":["brands"],"unicode":"f371","label":"Apper Systems AB"},"apple":{"styles":["brands"],"unicode":"f179","label":"Apple"},"apple-alt":{"styles":["solid"],"unicode":"f5d1","label":"Fruit Apple"},"apple-pay":{"styles":["brands"],"unicode":"f415","label":"Apple Pay"},"archive":{"styles":["solid"],"unicode":"f187","label":"Archive"},"archway":{"styles":["solid"],"unicode":"f557","label":"Archway"},"arrow-alt-circle-down":{"styles":["solid","regular"],"unicode":"f358","label":"Alternate Arrow Circle Down"},"arrow-alt-circle-left":{"styles":["solid","regular"],"unicode":"f359","label":"Alternate Arrow Circle Left"},"arrow-alt-circle-right":{"styles":["solid","regular"],"unicode":"f35a","label":"Alternate Arrow Circle Right"},"arrow-alt-circle-up":{"styles":["solid","regular"],"unicode":"f35b","label":"Alternate Arrow Circle Up"},"arrow-circle-down":{"styles":["solid"],"unicode":"f0ab","label":"Arrow Circle Down"},"arrow-circle-left":{"styles":["solid"],"unicode":"f0a8","label":"Arrow Circle Left"},"arrow-circle-right":{"styles":["solid"],"unicode":"f0a9","label":"Arrow Circle Right"},"arrow-circle-up":{"styles":["solid"],"unicode":"f0aa","label":"Arrow Circle Up"},"arrow-down":{"styles":["solid"],"unicode":"f063","label":"arrow-down"},"arrow-left":{"styles":["solid"],"unicode":"f060","label":"arrow-left"},"arrow-right":{"styles":["solid"],"unicode":"f061","label":"arrow-right"},"arrow-up":{"styles":["solid"],"unicode":"f062","label":"arrow-up"},"arrows-alt":{"styles":["solid"],"unicode":"f0b2","label":"Alternate Arrows"},"arrows-alt-h":{"styles":["solid"],"unicode":"f337","label":"Alternate Arrows Horizontal"},"arrows-alt-v":{"styles":["solid"],"unicode":"f338","label":"Alternate Arrows Vertical"},"artstation":{"styles":["brands"],"unicode":"f77a","label":"Artstation"},"assistive-listening-systems":{"styles":["solid"],"unicode":"f2a2","label":"Assistive Listening Systems"},"asterisk":{"styles":["solid"],"unicode":"f069","label":"asterisk"},"asymmetrik":{"styles":["brands"],"unicode":"f372","label":"Asymmetrik, Ltd."},"at":{"styles":["solid"],"unicode":"f1fa","label":"At"},"atlas":{"styles":["solid"],"unicode":"f558","label":"Atlas"},"atlassian":{"styles":["brands"],"unicode":"f77b","label":"Atlassian"},"atom":{"styles":["solid"],"unicode":"f5d2","label":"Atom"},"audible":{"styles":["brands"],"unicode":"f373","label":"Audible"},"audio-description":{"styles":["solid"],"unicode":"f29e","label":"Audio Description"},"autoprefixer":{"styles":["brands"],"unicode":"f41c","label":"Autoprefixer"},"avianex":{"styles":["brands"],"unicode":"f374","label":"avianex"},"aviato":{"styles":["brands"],"unicode":"f421","label":"Aviato"},"award":{"styles":["solid"],"unicode":"f559","label":"Award"},"aws":{"styles":["brands"],"unicode":"f375","label":"Amazon Web Services (AWS)"},"baby":{"styles":["solid"],"unicode":"f77c","label":"Baby"},"baby-carriage":{"styles":["solid"],"unicode":"f77d","label":"Baby Carriage"},"backspace":{"styles":["solid"],"unicode":"f55a","label":"Backspace"},"backward":{"styles":["solid"],"unicode":"f04a","label":"backward"},"bacon":{"styles":["solid"],"unicode":"f7e5","label":"Bacon"},"bacteria":{"styles":["solid"],"unicode":"e059","label":"Bacteria"},"bacterium":{"styles":["solid"],"unicode":"e05a","label":"Bacterium"},"bahai":{"styles":["solid"],"unicode":"f666","label":"Bahá\'í"},"balance-scale":{"styles":["solid"],"unicode":"f24e","label":"Balance Scale"},"balance-scale-left":{"styles":["solid"],"unicode":"f515","label":"Balance Scale (Left-Weighted)"},"balance-scale-right":{"styles":["solid"],"unicode":"f516","label":"Balance Scale (Right-Weighted)"},"ban":{"styles":["solid"],"unicode":"f05e","label":"ban"},"band-aid":{"styles":["solid"],"unicode":"f462","label":"Band-Aid"},"bandcamp":{"styles":["brands"],"unicode":"f2d5","label":"Bandcamp"},"barcode":{"styles":["solid"],"unicode":"f02a","label":"barcode"},"bars":{"styles":["solid"],"unicode":"f0c9","label":"Bars"},"baseball-ball":{"styles":["solid"],"unicode":"f433","label":"Baseball Ball"},"basketball-ball":{"styles":["solid"],"unicode":"f434","label":"Basketball Ball"},"bath":{"styles":["solid"],"unicode":"f2cd","label":"Bath"},"battery-empty":{"styles":["solid"],"unicode":"f244","label":"Battery Empty"},"battery-full":{"styles":["solid"],"unicode":"f240","label":"Battery Full"},"battery-half":{"styles":["solid"],"unicode":"f242","label":"Battery 1/2 Full"},"battery-quarter":{"styles":["solid"],"unicode":"f243","label":"Battery 1/4 Full"},"battery-three-quarters":{"styles":["solid"],"unicode":"f241","label":"Battery 3/4 Full"},"battle-net":{"styles":["brands"],"unicode":"f835","label":"Battle.net"},"bed":{"styles":["solid"],"unicode":"f236","label":"Bed"},"beer":{"styles":["solid"],"unicode":"f0fc","label":"beer"},"behance":{"styles":["brands"],"unicode":"f1b4","label":"Behance"},"behance-square":{"styles":["brands"],"unicode":"f1b5","label":"Behance Square"},"bell":{"styles":["solid","regular"],"unicode":"f0f3","label":"bell"},"bell-slash":{"styles":["solid","regular"],"unicode":"f1f6","label":"Bell Slash"},"bezier-curve":{"styles":["solid"],"unicode":"f55b","label":"Bezier Curve"},"bible":{"styles":["solid"],"unicode":"f647","label":"Bible"},"bicycle":{"styles":["solid"],"unicode":"f206","label":"Bicycle"},"biking":{"styles":["solid"],"unicode":"f84a","label":"Biking"},"bimobject":{"styles":["brands"],"unicode":"f378","label":"BIMobject"},"binoculars":{"styles":["solid"],"unicode":"f1e5","label":"Binoculars"},"biohazard":{"styles":["solid"],"unicode":"f780","label":"Biohazard"},"birthday-cake":{"styles":["solid"],"unicode":"f1fd","label":"Birthday Cake"},"bitbucket":{"styles":["brands"],"unicode":"f171","label":"Bitbucket"},"bitcoin":{"styles":["brands"],"unicode":"f379","label":"Bitcoin"},"bity":{"styles":["brands"],"unicode":"f37a","label":"Bity"},"black-tie":{"styles":["brands"],"unicode":"f27e","label":"Font Awesome Black Tie"},"blackberry":{"styles":["brands"],"unicode":"f37b","label":"BlackBerry"},"blender":{"styles":["solid"],"unicode":"f517","label":"Blender"},"blender-phone":{"styles":["solid"],"unicode":"f6b6","label":"Blender Phone"},"blind":{"styles":["solid"],"unicode":"f29d","label":"Blind"},"blog":{"styles":["solid"],"unicode":"f781","label":"Blog"},"blogger":{"styles":["brands"],"unicode":"f37c","label":"Blogger"},"blogger-b":{"styles":["brands"],"unicode":"f37d","label":"Blogger B"},"bluetooth":{"styles":["brands"],"unicode":"f293","label":"Bluetooth"},"bluetooth-b":{"styles":["brands"],"unicode":"f294","label":"Bluetooth"},"bold":{"styles":["solid"],"unicode":"f032","label":"bold"},"bolt":{"styles":["solid"],"unicode":"f0e7","label":"Lightning Bolt"},"bomb":{"styles":["solid"],"unicode":"f1e2","label":"Bomb"},"bone":{"styles":["solid"],"unicode":"f5d7","label":"Bone"},"bong":{"styles":["solid"],"unicode":"f55c","label":"Bong"},"book":{"styles":["solid"],"unicode":"f02d","label":"book"},"book-dead":{"styles":["solid"],"unicode":"f6b7","label":"Book of the Dead"},"book-medical":{"styles":["solid"],"unicode":"f7e6","label":"Medical Book"},"book-open":{"styles":["solid"],"unicode":"f518","label":"Book Open"},"book-reader":{"styles":["solid"],"unicode":"f5da","label":"Book Reader"},"bookmark":{"styles":["solid","regular"],"unicode":"f02e","label":"bookmark"},"bootstrap":{"styles":["brands"],"unicode":"f836","label":"Bootstrap"},"border-all":{"styles":["solid"],"unicode":"f84c","label":"Border All"},"border-none":{"styles":["solid"],"unicode":"f850","label":"Border None"},"border-style":{"styles":["solid"],"unicode":"f853","label":"Border Style"},"bowling-ball":{"styles":["solid"],"unicode":"f436","label":"Bowling Ball"},"box":{"styles":["solid"],"unicode":"f466","label":"Box"},"box-open":{"styles":["solid"],"unicode":"f49e","label":"Box Open"},"box-tissue":{"styles":["solid"],"unicode":"e05b","label":"Tissue Box"},"boxes":{"styles":["solid"],"unicode":"f468","label":"Boxes"},"braille":{"styles":["solid"],"unicode":"f2a1","label":"Braille"},"brain":{"styles":["solid"],"unicode":"f5dc","label":"Brain"},"bread-slice":{"styles":["solid"],"unicode":"f7ec","label":"Bread Slice"},"briefcase":{"styles":["solid"],"unicode":"f0b1","label":"Briefcase"},"briefcase-medical":{"styles":["solid"],"unicode":"f469","label":"Medical Briefcase"},"broadcast-tower":{"styles":["solid"],"unicode":"f519","label":"Broadcast Tower"},"broom":{"styles":["solid"],"unicode":"f51a","label":"Broom"},"brush":{"styles":["solid"],"unicode":"f55d","label":"Brush"},"btc":{"styles":["brands"],"unicode":"f15a","label":"BTC"},"buffer":{"styles":["brands"],"unicode":"f837","label":"Buffer"},"bug":{"styles":["solid"],"unicode":"f188","label":"Bug"},"building":{"styles":["solid","regular"],"unicode":"f1ad","label":"Building"},"bullhorn":{"styles":["solid"],"unicode":"f0a1","label":"bullhorn"},"bullseye":{"styles":["solid"],"unicode":"f140","label":"Bullseye"},"burn":{"styles":["solid"],"unicode":"f46a","label":"Burn"},"buromobelexperte":{"styles":["brands"],"unicode":"f37f","label":"Büromöbel-Experte GmbH & Co. KG."},"bus":{"styles":["solid"],"unicode":"f207","label":"Bus"},"bus-alt":{"styles":["solid"],"unicode":"f55e","label":"Bus Alt"},"business-time":{"styles":["solid"],"unicode":"f64a","label":"Business Time"},"buy-n-large":{"styles":["brands"],"unicode":"f8a6","label":"Buy n Large"},"buysellads":{"styles":["brands"],"unicode":"f20d","label":"BuySellAds"},"calculator":{"styles":["solid"],"unicode":"f1ec","label":"Calculator"},"calendar":{"styles":["solid","regular"],"unicode":"f133","label":"Calendar"},"calendar-alt":{"styles":["solid","regular"],"unicode":"f073","label":"Alternate Calendar"},"calendar-check":{"styles":["solid","regular"],"unicode":"f274","label":"Calendar Check"},"calendar-day":{"styles":["solid"],"unicode":"f783","label":"Calendar with Day Focus"},"calendar-minus":{"styles":["solid","regular"],"unicode":"f272","label":"Calendar Minus"},"calendar-plus":{"styles":["solid","regular"],"unicode":"f271","label":"Calendar Plus"},"calendar-times":{"styles":["solid","regular"],"unicode":"f273","label":"Calendar Times"},"calendar-week":{"styles":["solid"],"unicode":"f784","label":"Calendar with Week Focus"},"camera":{"styles":["solid"],"unicode":"f030","label":"camera"},"camera-retro":{"styles":["solid"],"unicode":"f083","label":"Retro Camera"},"campground":{"styles":["solid"],"unicode":"f6bb","label":"Campground"},"canadian-maple-leaf":{"styles":["brands"],"unicode":"f785","label":"Canadian Maple Leaf"},"candy-cane":{"styles":["solid"],"unicode":"f786","label":"Candy Cane"},"cannabis":{"styles":["solid"],"unicode":"f55f","label":"Cannabis"},"capsules":{"styles":["solid"],"unicode":"f46b","label":"Capsules"},"car":{"styles":["solid"],"unicode":"f1b9","label":"Car"},"car-alt":{"styles":["solid"],"unicode":"f5de","label":"Alternate Car"},"car-battery":{"styles":["solid"],"unicode":"f5df","label":"Car Battery"},"car-crash":{"styles":["solid"],"unicode":"f5e1","label":"Car Crash"},"car-side":{"styles":["solid"],"unicode":"f5e4","label":"Car Side"},"caravan":{"styles":["solid"],"unicode":"f8ff","label":"Caravan"},"caret-down":{"styles":["solid"],"unicode":"f0d7","label":"Caret Down"},"caret-left":{"styles":["solid"],"unicode":"f0d9","label":"Caret Left"},"caret-right":{"styles":["solid"],"unicode":"f0da","label":"Caret Right"},"caret-square-down":{"styles":["solid","regular"],"unicode":"f150","label":"Caret Square Down"},"caret-square-left":{"styles":["solid","regular"],"unicode":"f191","label":"Caret Square Left"},"caret-square-right":{"styles":["solid","regular"],"unicode":"f152","label":"Caret Square Right"},"caret-square-up":{"styles":["solid","regular"],"unicode":"f151","label":"Caret Square Up"},"caret-up":{"styles":["solid"],"unicode":"f0d8","label":"Caret Up"},"carrot":{"styles":["solid"],"unicode":"f787","label":"Carrot"},"cart-arrow-down":{"styles":["solid"],"unicode":"f218","label":"Shopping Cart Arrow Down"},"cart-plus":{"styles":["solid"],"unicode":"f217","label":"Add to Shopping Cart"},"cash-register":{"styles":["solid"],"unicode":"f788","label":"Cash Register"},"cat":{"styles":["solid"],"unicode":"f6be","label":"Cat"},"cc-amazon-pay":{"styles":["brands"],"unicode":"f42d","label":"Amazon Pay Credit Card"},"cc-amex":{"styles":["brands"],"unicode":"f1f3","label":"American Express Credit Card"},"cc-apple-pay":{"styles":["brands"],"unicode":"f416","label":"Apple Pay Credit Card"},"cc-diners-club":{"styles":["brands"],"unicode":"f24c","label":"Diner\'s Club Credit Card"},"cc-discover":{"styles":["brands"],"unicode":"f1f2","label":"Discover Credit Card"},"cc-jcb":{"styles":["brands"],"unicode":"f24b","label":"JCB Credit Card"},"cc-mastercard":{"styles":["brands"],"unicode":"f1f1","label":"MasterCard Credit Card"},"cc-paypal":{"styles":["brands"],"unicode":"f1f4","label":"Paypal Credit Card"},"cc-stripe":{"styles":["brands"],"unicode":"f1f5","label":"Stripe Credit Card"},"cc-visa":{"styles":["brands"],"unicode":"f1f0","label":"Visa Credit Card"},"centercode":{"styles":["brands"],"unicode":"f380","label":"Centercode"},"centos":{"styles":["brands"],"unicode":"f789","label":"Centos"},"certificate":{"styles":["solid"],"unicode":"f0a3","label":"certificate"},"chair":{"styles":["solid"],"unicode":"f6c0","label":"Chair"},"chalkboard":{"styles":["solid"],"unicode":"f51b","label":"Chalkboard"},"chalkboard-teacher":{"styles":["solid"],"unicode":"f51c","label":"Chalkboard Teacher"},"charging-station":{"styles":["solid"],"unicode":"f5e7","label":"Charging Station"},"chart-area":{"styles":["solid"],"unicode":"f1fe","label":"Area Chart"},"chart-bar":{"styles":["solid","regular"],"unicode":"f080","label":"Bar Chart"},"chart-line":{"styles":["solid"],"unicode":"f201","label":"Line Chart"},"chart-pie":{"styles":["solid"],"unicode":"f200","label":"Pie Chart"},"check":{"styles":["solid"],"unicode":"f00c","label":"Check"},"check-circle":{"styles":["solid","regular"],"unicode":"f058","label":"Check Circle"},"check-double":{"styles":["solid"],"unicode":"f560","label":"Double Check"},"check-square":{"styles":["solid","regular"],"unicode":"f14a","label":"Check Square"},"cheese":{"styles":["solid"],"unicode":"f7ef","label":"Cheese"},"chess":{"styles":["solid"],"unicode":"f439","label":"Chess"},"chess-bishop":{"styles":["solid"],"unicode":"f43a","label":"Chess Bishop"},"chess-board":{"styles":["solid"],"unicode":"f43c","label":"Chess Board"},"chess-king":{"styles":["solid"],"unicode":"f43f","label":"Chess King"},"chess-knight":{"styles":["solid"],"unicode":"f441","label":"Chess Knight"},"chess-pawn":{"styles":["solid"],"unicode":"f443","label":"Chess Pawn"},"chess-queen":{"styles":["solid"],"unicode":"f445","label":"Chess Queen"},"chess-rook":{"styles":["solid"],"unicode":"f447","label":"Chess Rook"},"chevron-circle-down":{"styles":["solid"],"unicode":"f13a","label":"Chevron Circle Down"},"chevron-circle-left":{"styles":["solid"],"unicode":"f137","label":"Chevron Circle Left"},"chevron-circle-right":{"styles":["solid"],"unicode":"f138","label":"Chevron Circle Right"},"chevron-circle-up":{"styles":["solid"],"unicode":"f139","label":"Chevron Circle Up"},"chevron-down":{"styles":["solid"],"unicode":"f078","label":"chevron-down"},"chevron-left":{"styles":["solid"],"unicode":"f053","label":"chevron-left"},"chevron-right":{"styles":["solid"],"unicode":"f054","label":"chevron-right"},"chevron-up":{"styles":["solid"],"unicode":"f077","label":"chevron-up"},"child":{"styles":["solid"],"unicode":"f1ae","label":"Child"},"chrome":{"styles":["brands"],"unicode":"f268","label":"Chrome"},"chromecast":{"styles":["brands"],"unicode":"f838","label":"Chromecast"},"church":{"styles":["solid"],"unicode":"f51d","label":"Church"},"circle":{"styles":["solid","regular"],"unicode":"f111","label":"Circle"},"circle-notch":{"styles":["solid"],"unicode":"f1ce","label":"Circle Notched"},"city":{"styles":["solid"],"unicode":"f64f","label":"City"},"clinic-medical":{"styles":["solid"],"unicode":"f7f2","label":"Medical Clinic"},"clipboard":{"styles":["solid","regular"],"unicode":"f328","label":"Clipboard"},"clipboard-check":{"styles":["solid"],"unicode":"f46c","label":"Clipboard with Check"},"clipboard-list":{"styles":["solid"],"unicode":"f46d","label":"Clipboard List"},"clock":{"styles":["solid","regular"],"unicode":"f017","label":"Clock"},"clone":{"styles":["solid","regular"],"unicode":"f24d","label":"Clone"},"closed-captioning":{"styles":["solid","regular"],"unicode":"f20a","label":"Closed Captioning"},"cloud":{"styles":["solid"],"unicode":"f0c2","label":"Cloud"},"cloud-download-alt":{"styles":["solid"],"unicode":"f381","label":"Alternate Cloud Download"},"cloud-meatball":{"styles":["solid"],"unicode":"f73b","label":"Cloud with (a chance of) Meatball"},"cloud-moon":{"styles":["solid"],"unicode":"f6c3","label":"Cloud with Moon"},"cloud-moon-rain":{"styles":["solid"],"unicode":"f73c","label":"Cloud with Moon and Rain"},"cloud-rain":{"styles":["solid"],"unicode":"f73d","label":"Cloud with Rain"},"cloud-showers-heavy":{"styles":["solid"],"unicode":"f740","label":"Cloud with Heavy Showers"},"cloud-sun":{"styles":["solid"],"unicode":"f6c4","label":"Cloud with Sun"},"cloud-sun-rain":{"styles":["solid"],"unicode":"f743","label":"Cloud with Sun and Rain"},"cloud-upload-alt":{"styles":["solid"],"unicode":"f382","label":"Alternate Cloud Upload"},"cloudflare":{"styles":["brands"],"unicode":"e07d","label":"Cloudflare"},"cloudscale":{"styles":["brands"],"unicode":"f383","label":"cloudscale.ch"},"cloudsmith":{"styles":["brands"],"unicode":"f384","label":"Cloudsmith"},"cloudversify":{"styles":["brands"],"unicode":"f385","label":"cloudversify"},"cocktail":{"styles":["solid"],"unicode":"f561","label":"Cocktail"},"code":{"styles":["solid"],"unicode":"f121","label":"Code"},"code-branch":{"styles":["solid"],"unicode":"f126","label":"Code Branch"},"codepen":{"styles":["brands"],"unicode":"f1cb","label":"Codepen"},"codiepie":{"styles":["brands"],"unicode":"f284","label":"Codie Pie"},"coffee":{"styles":["solid"],"unicode":"f0f4","label":"Coffee"},"cog":{"styles":["solid"],"unicode":"f013","label":"cog"},"cogs":{"styles":["solid"],"unicode":"f085","label":"cogs"},"coins":{"styles":["solid"],"unicode":"f51e","label":"Coins"},"columns":{"styles":["solid"],"unicode":"f0db","label":"Columns"},"comment":{"styles":["solid","regular"],"unicode":"f075","label":"comment"},"comment-alt":{"styles":["solid","regular"],"unicode":"f27a","label":"Alternate Comment"},"comment-dollar":{"styles":["solid"],"unicode":"f651","label":"Comment Dollar"},"comment-dots":{"styles":["solid","regular"],"unicode":"f4ad","label":"Comment Dots"},"comment-medical":{"styles":["solid"],"unicode":"f7f5","label":"Alternate Medical Chat"},"comment-slash":{"styles":["solid"],"unicode":"f4b3","label":"Comment Slash"},"comments":{"styles":["solid","regular"],"unicode":"f086","label":"comments"},"comments-dollar":{"styles":["solid"],"unicode":"f653","label":"Comments Dollar"},"compact-disc":{"styles":["solid"],"unicode":"f51f","label":"Compact Disc"},"compass":{"styles":["solid","regular"],"unicode":"f14e","label":"Compass"},"compress":{"styles":["solid"],"unicode":"f066","label":"Compress"},"compress-alt":{"styles":["solid"],"unicode":"f422","label":"Alternate Compress"},"compress-arrows-alt":{"styles":["solid"],"unicode":"f78c","label":"Alternate Compress Arrows"},"concierge-bell":{"styles":["solid"],"unicode":"f562","label":"Concierge Bell"},"confluence":{"styles":["brands"],"unicode":"f78d","label":"Confluence"},"connectdevelop":{"styles":["brands"],"unicode":"f20e","label":"Connect Develop"},"contao":{"styles":["brands"],"unicode":"f26d","label":"Contao"},"cookie":{"styles":["solid"],"unicode":"f563","label":"Cookie"},"cookie-bite":{"styles":["solid"],"unicode":"f564","label":"Cookie Bite"},"copy":{"styles":["solid","regular"],"unicode":"f0c5","label":"Copy"},"copyright":{"styles":["solid","regular"],"unicode":"f1f9","label":"Copyright"},"cotton-bureau":{"styles":["brands"],"unicode":"f89e","label":"Cotton Bureau"},"couch":{"styles":["solid"],"unicode":"f4b8","label":"Couch"},"cpanel":{"styles":["brands"],"unicode":"f388","label":"cPanel"},"creative-commons":{"styles":["brands"],"unicode":"f25e","label":"Creative Commons"},"creative-commons-by":{"styles":["brands"],"unicode":"f4e7","label":"Creative Commons Attribution"},"creative-commons-nc":{"styles":["brands"],"unicode":"f4e8","label":"Creative Commons Noncommercial"},"creative-commons-nc-eu":{"styles":["brands"],"unicode":"f4e9","label":"Creative Commons Noncommercial (Euro Sign)"},"creative-commons-nc-jp":{"styles":["brands"],"unicode":"f4ea","label":"Creative Commons Noncommercial (Yen Sign)"},"creative-commons-nd":{"styles":["brands"],"unicode":"f4eb","label":"Creative Commons No Derivative Works"},"creative-commons-pd":{"styles":["brands"],"unicode":"f4ec","label":"Creative Commons Public Domain"},"creative-commons-pd-alt":{"styles":["brands"],"unicode":"f4ed","label":"Alternate Creative Commons Public Domain"},"creative-commons-remix":{"styles":["brands"],"unicode":"f4ee","label":"Creative Commons Remix"},"creative-commons-sa":{"styles":["brands"],"unicode":"f4ef","label":"Creative Commons Share Alike"},"creative-commons-sampling":{"styles":["brands"],"unicode":"f4f0","label":"Creative Commons Sampling"},"creative-commons-sampling-plus":{"styles":["brands"],"unicode":"f4f1","label":"Creative Commons Sampling +"},"creative-commons-share":{"styles":["brands"],"unicode":"f4f2","label":"Creative Commons Share"},"creative-commons-zero":{"styles":["brands"],"unicode":"f4f3","label":"Creative Commons CC0"},"credit-card":{"styles":["solid","regular"],"unicode":"f09d","label":"Credit Card"},"critical-role":{"styles":["brands"],"unicode":"f6c9","label":"Critical Role"},"crop":{"styles":["solid"],"unicode":"f125","label":"crop"},"crop-alt":{"styles":["solid"],"unicode":"f565","label":"Alternate Crop"},"cross":{"styles":["solid"],"unicode":"f654","label":"Cross"},"crosshairs":{"styles":["solid"],"unicode":"f05b","label":"Crosshairs"},"crow":{"styles":["solid"],"unicode":"f520","label":"Crow"},"crown":{"styles":["solid"],"unicode":"f521","label":"Crown"},"crutch":{"styles":["solid"],"unicode":"f7f7","label":"Crutch"},"css3":{"styles":["brands"],"unicode":"f13c","label":"CSS 3 Logo"},"css3-alt":{"styles":["brands"],"unicode":"f38b","label":"Alternate CSS3 Logo"},"cube":{"styles":["solid"],"unicode":"f1b2","label":"Cube"},"cubes":{"styles":["solid"],"unicode":"f1b3","label":"Cubes"},"cut":{"styles":["solid"],"unicode":"f0c4","label":"Cut"},"cuttlefish":{"styles":["brands"],"unicode":"f38c","label":"Cuttlefish"},"d-and-d":{"styles":["brands"],"unicode":"f38d","label":"Dungeons & Dragons"},"d-and-d-beyond":{"styles":["brands"],"unicode":"f6ca","label":"D&D Beyond"},"dailymotion":{"styles":["brands"],"unicode":"e052","label":"dailymotion"},"dashcube":{"styles":["brands"],"unicode":"f210","label":"DashCube"},"database":{"styles":["solid"],"unicode":"f1c0","label":"Database"},"deaf":{"styles":["solid"],"unicode":"f2a4","label":"Deaf"},"deezer":{"styles":["brands"],"unicode":"e077","label":"Deezer"},"delicious":{"styles":["brands"],"unicode":"f1a5","label":"Delicious"},"democrat":{"styles":["solid"],"unicode":"f747","label":"Democrat"},"deploydog":{"styles":["brands"],"unicode":"f38e","label":"deploy.dog"},"deskpro":{"styles":["brands"],"unicode":"f38f","label":"Deskpro"},"desktop":{"styles":["solid"],"unicode":"f108","label":"Desktop"},"dev":{"styles":["brands"],"unicode":"f6cc","label":"DEV"},"deviantart":{"styles":["brands"],"unicode":"f1bd","label":"deviantART"},"dharmachakra":{"styles":["solid"],"unicode":"f655","label":"Dharmachakra"},"dhl":{"styles":["brands"],"unicode":"f790","label":"DHL"},"diagnoses":{"styles":["solid"],"unicode":"f470","label":"Diagnoses"},"diaspora":{"styles":["brands"],"unicode":"f791","label":"Diaspora"},"dice":{"styles":["solid"],"unicode":"f522","label":"Dice"},"dice-d20":{"styles":["solid"],"unicode":"f6cf","label":"Dice D20"},"dice-d6":{"styles":["solid"],"unicode":"f6d1","label":"Dice D6"},"dice-five":{"styles":["solid"],"unicode":"f523","label":"Dice Five"},"dice-four":{"styles":["solid"],"unicode":"f524","label":"Dice Four"},"dice-one":{"styles":["solid"],"unicode":"f525","label":"Dice One"},"dice-six":{"styles":["solid"],"unicode":"f526","label":"Dice Six"},"dice-three":{"styles":["solid"],"unicode":"f527","label":"Dice Three"},"dice-two":{"styles":["solid"],"unicode":"f528","label":"Dice Two"},"digg":{"styles":["brands"],"unicode":"f1a6","label":"Digg Logo"},"digital-ocean":{"styles":["brands"],"unicode":"f391","label":"Digital Ocean"},"digital-tachograph":{"styles":["solid"],"unicode":"f566","label":"Digital Tachograph"},"directions":{"styles":["solid"],"unicode":"f5eb","label":"Directions"},"discord":{"styles":["brands"],"unicode":"f392","label":"Discord"},"discourse":{"styles":["brands"],"unicode":"f393","label":"Discourse"},"disease":{"styles":["solid"],"unicode":"f7fa","label":"Disease"},"divide":{"styles":["solid"],"unicode":"f529","label":"Divide"},"dizzy":{"styles":["solid","regular"],"unicode":"f567","label":"Dizzy Face"},"dna":{"styles":["solid"],"unicode":"f471","label":"DNA"},"dochub":{"styles":["brands"],"unicode":"f394","label":"DocHub"},"docker":{"styles":["brands"],"unicode":"f395","label":"Docker"},"dog":{"styles":["solid"],"unicode":"f6d3","label":"Dog"},"dollar-sign":{"styles":["solid"],"unicode":"f155","label":"Dollar Sign"},"dolly":{"styles":["solid"],"unicode":"f472","label":"Dolly"},"dolly-flatbed":{"styles":["solid"],"unicode":"f474","label":"Dolly Flatbed"},"donate":{"styles":["solid"],"unicode":"f4b9","label":"Donate"},"door-closed":{"styles":["solid"],"unicode":"f52a","label":"Door Closed"},"door-open":{"styles":["solid"],"unicode":"f52b","label":"Door Open"},"dot-circle":{"styles":["solid","regular"],"unicode":"f192","label":"Dot Circle"},"dove":{"styles":["solid"],"unicode":"f4ba","label":"Dove"},"download":{"styles":["solid"],"unicode":"f019","label":"Download"},"draft2digital":{"styles":["brands"],"unicode":"f396","label":"Draft2digital"},"drafting-compass":{"styles":["solid"],"unicode":"f568","label":"Drafting Compass"},"dragon":{"styles":["solid"],"unicode":"f6d5","label":"Dragon"},"draw-polygon":{"styles":["solid"],"unicode":"f5ee","label":"Draw Polygon"},"dribbble":{"styles":["brands"],"unicode":"f17d","label":"Dribbble"},"dribbble-square":{"styles":["brands"],"unicode":"f397","label":"Dribbble Square"},"dropbox":{"styles":["brands"],"unicode":"f16b","label":"Dropbox"},"drum":{"styles":["solid"],"unicode":"f569","label":"Drum"},"drum-steelpan":{"styles":["solid"],"unicode":"f56a","label":"Drum Steelpan"},"drumstick-bite":{"styles":["solid"],"unicode":"f6d7","label":"Drumstick with Bite Taken Out"},"drupal":{"styles":["brands"],"unicode":"f1a9","label":"Drupal Logo"},"dumbbell":{"styles":["solid"],"unicode":"f44b","label":"Dumbbell"},"dumpster":{"styles":["solid"],"unicode":"f793","label":"Dumpster"},"dumpster-fire":{"styles":["solid"],"unicode":"f794","label":"Dumpster Fire"},"dungeon":{"styles":["solid"],"unicode":"f6d9","label":"Dungeon"},"dyalog":{"styles":["brands"],"unicode":"f399","label":"Dyalog"},"earlybirds":{"styles":["brands"],"unicode":"f39a","label":"Earlybirds"},"ebay":{"styles":["brands"],"unicode":"f4f4","label":"eBay"},"edge":{"styles":["brands"],"unicode":"f282","label":"Edge Browser"},"edge-legacy":{"styles":["brands"],"unicode":"e078","label":"Edge Legacy Browser"},"edit":{"styles":["solid","regular"],"unicode":"f044","label":"Edit"},"egg":{"styles":["solid"],"unicode":"f7fb","label":"Egg"},"eject":{"styles":["solid"],"unicode":"f052","label":"eject"},"elementor":{"styles":["brands"],"unicode":"f430","label":"Elementor"},"ellipsis-h":{"styles":["solid"],"unicode":"f141","label":"Horizontal Ellipsis"},"ellipsis-v":{"styles":["solid"],"unicode":"f142","label":"Vertical Ellipsis"},"ello":{"styles":["brands"],"unicode":"f5f1","label":"Ello"},"ember":{"styles":["brands"],"unicode":"f423","label":"Ember"},"empire":{"styles":["brands"],"unicode":"f1d1","label":"Galactic Empire"},"envelope":{"styles":["solid","regular"],"unicode":"f0e0","label":"Envelope"},"envelope-open":{"styles":["solid","regular"],"unicode":"f2b6","label":"Envelope Open"},"envelope-open-text":{"styles":["solid"],"unicode":"f658","label":"Envelope Open-text"},"envelope-square":{"styles":["solid"],"unicode":"f199","label":"Envelope Square"},"envira":{"styles":["brands"],"unicode":"f299","label":"Envira Gallery"},"equals":{"styles":["solid"],"unicode":"f52c","label":"Equals"},"eraser":{"styles":["solid"],"unicode":"f12d","label":"eraser"},"erlang":{"styles":["brands"],"unicode":"f39d","label":"Erlang"},"ethereum":{"styles":["brands"],"unicode":"f42e","label":"Ethereum"},"ethernet":{"styles":["solid"],"unicode":"f796","label":"Ethernet"},"etsy":{"styles":["brands"],"unicode":"f2d7","label":"Etsy"},"euro-sign":{"styles":["solid"],"unicode":"f153","label":"Euro Sign"},"evernote":{"styles":["brands"],"unicode":"f839","label":"Evernote"},"exchange-alt":{"styles":["solid"],"unicode":"f362","label":"Alternate Exchange"},"exclamation":{"styles":["solid"],"unicode":"f12a","label":"exclamation"},"exclamation-circle":{"styles":["solid"],"unicode":"f06a","label":"Exclamation Circle"},"exclamation-triangle":{"styles":["solid"],"unicode":"f071","label":"Exclamation Triangle"},"expand":{"styles":["solid"],"unicode":"f065","label":"Expand"},"expand-alt":{"styles":["solid"],"unicode":"f424","label":"Alternate Expand"},"expand-arrows-alt":{"styles":["solid"],"unicode":"f31e","label":"Alternate Expand Arrows"},"expeditedssl":{"styles":["brands"],"unicode":"f23e","label":"ExpeditedSSL"},"external-link-alt":{"styles":["solid"],"unicode":"f35d","label":"Alternate External Link"},"external-link-square-alt":{"styles":["solid"],"unicode":"f360","label":"Alternate External Link Square"},"eye":{"styles":["solid","regular"],"unicode":"f06e","label":"Eye"},"eye-dropper":{"styles":["solid"],"unicode":"f1fb","label":"Eye Dropper"},"eye-slash":{"styles":["solid","regular"],"unicode":"f070","label":"Eye Slash"},"facebook":{"styles":["brands"],"unicode":"f09a","label":"Facebook"},"facebook-f":{"styles":["brands"],"unicode":"f39e","label":"Facebook F"},"facebook-messenger":{"styles":["brands"],"unicode":"f39f","label":"Facebook Messenger"},"facebook-square":{"styles":["brands"],"unicode":"f082","label":"Facebook Square"},"fan":{"styles":["solid"],"unicode":"f863","label":"Fan"},"fantasy-flight-games":{"styles":["brands"],"unicode":"f6dc","label":"Fantasy Flight-games"},"fast-backward":{"styles":["solid"],"unicode":"f049","label":"fast-backward"},"fast-forward":{"styles":["solid"],"unicode":"f050","label":"fast-forward"},"faucet":{"styles":["solid"],"unicode":"e005","label":"Faucet"},"fax":{"styles":["solid"],"unicode":"f1ac","label":"Fax"},"feather":{"styles":["solid"],"unicode":"f52d","label":"Feather"},"feather-alt":{"styles":["solid"],"unicode":"f56b","label":"Alternate Feather"},"fedex":{"styles":["brands"],"unicode":"f797","label":"FedEx"},"fedora":{"styles":["brands"],"unicode":"f798","label":"Fedora"},"female":{"styles":["solid"],"unicode":"f182","label":"Female"},"fighter-jet":{"styles":["solid"],"unicode":"f0fb","label":"fighter-jet"},"figma":{"styles":["brands"],"unicode":"f799","label":"Figma"},"file":{"styles":["solid","regular"],"unicode":"f15b","label":"File"},"file-alt":{"styles":["solid","regular"],"unicode":"f15c","label":"Alternate File"},"file-archive":{"styles":["solid","regular"],"unicode":"f1c6","label":"Archive File"},"file-audio":{"styles":["solid","regular"],"unicode":"f1c7","label":"Audio File"},"file-code":{"styles":["solid","regular"],"unicode":"f1c9","label":"Code File"},"file-contract":{"styles":["solid"],"unicode":"f56c","label":"File Contract"},"file-csv":{"styles":["solid"],"unicode":"f6dd","label":"File CSV"},"file-download":{"styles":["solid"],"unicode":"f56d","label":"File Download"},"file-excel":{"styles":["solid","regular"],"unicode":"f1c3","label":"Excel File"},"file-export":{"styles":["solid"],"unicode":"f56e","label":"File Export"},"file-image":{"styles":["solid","regular"],"unicode":"f1c5","label":"Image File"},"file-import":{"styles":["solid"],"unicode":"f56f","label":"File Import"},"file-invoice":{"styles":["solid"],"unicode":"f570","label":"File Invoice"},"file-invoice-dollar":{"styles":["solid"],"unicode":"f571","label":"File Invoice with US Dollar"},"file-medical":{"styles":["solid"],"unicode":"f477","label":"Medical File"},"file-medical-alt":{"styles":["solid"],"unicode":"f478","label":"Alternate Medical File"},"file-pdf":{"styles":["solid","regular"],"unicode":"f1c1","label":"PDF File"},"file-powerpoint":{"styles":["solid","regular"],"unicode":"f1c4","label":"Powerpoint File"},"file-prescription":{"styles":["solid"],"unicode":"f572","label":"File Prescription"},"file-signature":{"styles":["solid"],"unicode":"f573","label":"File Signature"},"file-upload":{"styles":["solid"],"unicode":"f574","label":"File Upload"},"file-video":{"styles":["solid","regular"],"unicode":"f1c8","label":"Video File"},"file-word":{"styles":["solid","regular"],"unicode":"f1c2","label":"Word File"},"fill":{"styles":["solid"],"unicode":"f575","label":"Fill"},"fill-drip":{"styles":["solid"],"unicode":"f576","label":"Fill Drip"},"film":{"styles":["solid"],"unicode":"f008","label":"Film"},"filter":{"styles":["solid"],"unicode":"f0b0","label":"Filter"},"fingerprint":{"styles":["solid"],"unicode":"f577","label":"Fingerprint"},"fire":{"styles":["solid"],"unicode":"f06d","label":"fire"},"fire-alt":{"styles":["solid"],"unicode":"f7e4","label":"Alternate Fire"},"fire-extinguisher":{"styles":["solid"],"unicode":"f134","label":"fire-extinguisher"},"firefox":{"styles":["brands"],"unicode":"f269","label":"Firefox"},"firefox-browser":{"styles":["brands"],"unicode":"e007","label":"Firefox Browser"},"first-aid":{"styles":["solid"],"unicode":"f479","label":"First Aid"},"first-order":{"styles":["brands"],"unicode":"f2b0","label":"First Order"},"first-order-alt":{"styles":["brands"],"unicode":"f50a","label":"Alternate First Order"},"firstdraft":{"styles":["brands"],"unicode":"f3a1","label":"firstdraft"},"fish":{"styles":["solid"],"unicode":"f578","label":"Fish"},"fist-raised":{"styles":["solid"],"unicode":"f6de","label":"Raised Fist"},"flag":{"styles":["solid","regular"],"unicode":"f024","label":"flag"},"flag-checkered":{"styles":["solid"],"unicode":"f11e","label":"flag-checkered"},"flag-usa":{"styles":["solid"],"unicode":"f74d","label":"United States of America Flag"},"flask":{"styles":["solid"],"unicode":"f0c3","label":"Flask"},"flickr":{"styles":["brands"],"unicode":"f16e","label":"Flickr"},"flipboard":{"styles":["brands"],"unicode":"f44d","label":"Flipboard"},"flushed":{"styles":["solid","regular"],"unicode":"f579","label":"Flushed Face"},"fly":{"styles":["brands"],"unicode":"f417","label":"Fly"},"folder":{"styles":["solid","regular"],"unicode":"f07b","label":"Folder"},"folder-minus":{"styles":["solid"],"unicode":"f65d","label":"Folder Minus"},"folder-open":{"styles":["solid","regular"],"unicode":"f07c","label":"Folder Open"},"folder-plus":{"styles":["solid"],"unicode":"f65e","label":"Folder Plus"},"font":{"styles":["solid"],"unicode":"f031","label":"font"},"font-awesome":{"styles":["brands"],"unicode":"f2b4","label":"Font Awesome"},"font-awesome-alt":{"styles":["brands"],"unicode":"f35c","label":"Alternate Font Awesome"},"font-awesome-flag":{"styles":["brands"],"unicode":"f425","label":"Font Awesome Flag"},"font-awesome-logo-full":{"styles":["regular","solid","brands"],"unicode":"f4e6","label":"Font Awesome Full Logo"},"fonticons":{"styles":["brands"],"unicode":"f280","label":"Fonticons"},"fonticons-fi":{"styles":["brands"],"unicode":"f3a2","label":"Fonticons Fi"},"football-ball":{"styles":["solid"],"unicode":"f44e","label":"Football Ball"},"fort-awesome":{"styles":["brands"],"unicode":"f286","label":"Fort Awesome"},"fort-awesome-alt":{"styles":["brands"],"unicode":"f3a3","label":"Alternate Fort Awesome"},"forumbee":{"styles":["brands"],"unicode":"f211","label":"Forumbee"},"forward":{"styles":["solid"],"unicode":"f04e","label":"forward"},"foursquare":{"styles":["brands"],"unicode":"f180","label":"Foursquare"},"free-code-camp":{"styles":["brands"],"unicode":"f2c5","label":"freeCodeCamp"},"freebsd":{"styles":["brands"],"unicode":"f3a4","label":"FreeBSD"},"frog":{"styles":["solid"],"unicode":"f52e","label":"Frog"},"frown":{"styles":["solid","regular"],"unicode":"f119","label":"Frowning Face"},"frown-open":{"styles":["solid","regular"],"unicode":"f57a","label":"Frowning Face With Open Mouth"},"fulcrum":{"styles":["brands"],"unicode":"f50b","label":"Fulcrum"},"funnel-dollar":{"styles":["solid"],"unicode":"f662","label":"Funnel Dollar"},"futbol":{"styles":["solid","regular"],"unicode":"f1e3","label":"Futbol"},"galactic-republic":{"styles":["brands"],"unicode":"f50c","label":"Galactic Republic"},"galactic-senate":{"styles":["brands"],"unicode":"f50d","label":"Galactic Senate"},"gamepad":{"styles":["solid"],"unicode":"f11b","label":"Gamepad"},"gas-pump":{"styles":["solid"],"unicode":"f52f","label":"Gas Pump"},"gavel":{"styles":["solid"],"unicode":"f0e3","label":"Gavel"},"gem":{"styles":["solid","regular"],"unicode":"f3a5","label":"Gem"},"genderless":{"styles":["solid"],"unicode":"f22d","label":"Genderless"},"get-pocket":{"styles":["brands"],"unicode":"f265","label":"Get Pocket"},"gg":{"styles":["brands"],"unicode":"f260","label":"GG Currency"},"gg-circle":{"styles":["brands"],"unicode":"f261","label":"GG Currency Circle"},"ghost":{"styles":["solid"],"unicode":"f6e2","label":"Ghost"},"gift":{"styles":["solid"],"unicode":"f06b","label":"gift"},"gifts":{"styles":["solid"],"unicode":"f79c","label":"Gifts"},"git":{"styles":["brands"],"unicode":"f1d3","label":"Git"},"git-alt":{"styles":["brands"],"unicode":"f841","label":"Git Alt"},"git-square":{"styles":["brands"],"unicode":"f1d2","label":"Git Square"},"github":{"styles":["brands"],"unicode":"f09b","label":"GitHub"},"github-alt":{"styles":["brands"],"unicode":"f113","label":"Alternate GitHub"},"github-square":{"styles":["brands"],"unicode":"f092","label":"GitHub Square"},"gitkraken":{"styles":["brands"],"unicode":"f3a6","label":"GitKraken"},"gitlab":{"styles":["brands"],"unicode":"f296","label":"GitLab"},"gitter":{"styles":["brands"],"unicode":"f426","label":"Gitter"},"glass-cheers":{"styles":["solid"],"unicode":"f79f","label":"Glass Cheers"},"glass-martini":{"styles":["solid"],"unicode":"f000","label":"Martini Glass"},"glass-martini-alt":{"styles":["solid"],"unicode":"f57b","label":"Alternate Glass Martini"},"glass-whiskey":{"styles":["solid"],"unicode":"f7a0","label":"Glass Whiskey"},"glasses":{"styles":["solid"],"unicode":"f530","label":"Glasses"},"glide":{"styles":["brands"],"unicode":"f2a5","label":"Glide"},"glide-g":{"styles":["brands"],"unicode":"f2a6","label":"Glide G"},"globe":{"styles":["solid"],"unicode":"f0ac","label":"Globe"},"globe-africa":{"styles":["solid"],"unicode":"f57c","label":"Globe with Africa shown"},"globe-americas":{"styles":["solid"],"unicode":"f57d","label":"Globe with Americas shown"},"globe-asia":{"styles":["solid"],"unicode":"f57e","label":"Globe with Asia shown"},"globe-europe":{"styles":["solid"],"unicode":"f7a2","label":"Globe with Europe shown"},"gofore":{"styles":["brands"],"unicode":"f3a7","label":"Gofore"},"golf-ball":{"styles":["solid"],"unicode":"f450","label":"Golf Ball"},"goodreads":{"styles":["brands"],"unicode":"f3a8","label":"Goodreads"},"goodreads-g":{"styles":["brands"],"unicode":"f3a9","label":"Goodreads G"},"google":{"styles":["brands"],"unicode":"f1a0","label":"Google Logo"},"google-drive":{"styles":["brands"],"unicode":"f3aa","label":"Google Drive"},"google-pay":{"styles":["brands"],"unicode":"e079","label":"Google Pay"},"google-play":{"styles":["brands"],"unicode":"f3ab","label":"Google Play"},"google-plus":{"styles":["brands"],"unicode":"f2b3","label":"Google Plus"},"google-plus-g":{"styles":["brands"],"unicode":"f0d5","label":"Google Plus G"},"google-plus-square":{"styles":["brands"],"unicode":"f0d4","label":"Google Plus Square"},"google-wallet":{"styles":["brands"],"unicode":"f1ee","label":"Google Wallet"},"gopuram":{"styles":["solid"],"unicode":"f664","label":"Gopuram"},"graduation-cap":{"styles":["solid"],"unicode":"f19d","label":"Graduation Cap"},"gratipay":{"styles":["brands"],"unicode":"f184","label":"Gratipay (Gittip)"},"grav":{"styles":["brands"],"unicode":"f2d6","label":"Grav"},"greater-than":{"styles":["solid"],"unicode":"f531","label":"Greater Than"},"greater-than-equal":{"styles":["solid"],"unicode":"f532","label":"Greater Than Equal To"},"grimace":{"styles":["solid","regular"],"unicode":"f57f","label":"Grimacing Face"},"grin":{"styles":["solid","regular"],"unicode":"f580","label":"Grinning Face"},"grin-alt":{"styles":["solid","regular"],"unicode":"f581","label":"Alternate Grinning Face"},"grin-beam":{"styles":["solid","regular"],"unicode":"f582","label":"Grinning Face With Smiling Eyes"},"grin-beam-sweat":{"styles":["solid","regular"],"unicode":"f583","label":"Grinning Face With Sweat"},"grin-hearts":{"styles":["solid","regular"],"unicode":"f584","label":"Smiling Face With Heart-Eyes"},"grin-squint":{"styles":["solid","regular"],"unicode":"f585","label":"Grinning Squinting Face"},"grin-squint-tears":{"styles":["solid","regular"],"unicode":"f586","label":"Rolling on the Floor Laughing"},"grin-stars":{"styles":["solid","regular"],"unicode":"f587","label":"Star-Struck"},"grin-tears":{"styles":["solid","regular"],"unicode":"f588","label":"Face With Tears of Joy"},"grin-tongue":{"styles":["solid","regular"],"unicode":"f589","label":"Face With Tongue"},"grin-tongue-squint":{"styles":["solid","regular"],"unicode":"f58a","label":"Squinting Face With Tongue"},"grin-tongue-wink":{"styles":["solid","regular"],"unicode":"f58b","label":"Winking Face With Tongue"},"grin-wink":{"styles":["solid","regular"],"unicode":"f58c","label":"Grinning Winking Face"},"grip-horizontal":{"styles":["solid"],"unicode":"f58d","label":"Grip Horizontal"},"grip-lines":{"styles":["solid"],"unicode":"f7a4","label":"Grip Lines"},"grip-lines-vertical":{"styles":["solid"],"unicode":"f7a5","label":"Grip Lines Vertical"},"grip-vertical":{"styles":["solid"],"unicode":"f58e","label":"Grip Vertical"},"gripfire":{"styles":["brands"],"unicode":"f3ac","label":"Gripfire, Inc."},"grunt":{"styles":["brands"],"unicode":"f3ad","label":"Grunt"},"guilded":{"styles":["brands"],"unicode":"e07e","label":"Guilded"},"guitar":{"styles":["solid"],"unicode":"f7a6","label":"Guitar"},"gulp":{"styles":["brands"],"unicode":"f3ae","label":"Gulp"},"h-square":{"styles":["solid"],"unicode":"f0fd","label":"H Square"},"hacker-news":{"styles":["brands"],"unicode":"f1d4","label":"Hacker News"},"hacker-news-square":{"styles":["brands"],"unicode":"f3af","label":"Hacker News Square"},"hackerrank":{"styles":["brands"],"unicode":"f5f7","label":"Hackerrank"},"hamburger":{"styles":["solid"],"unicode":"f805","label":"Hamburger"},"hammer":{"styles":["solid"],"unicode":"f6e3","label":"Hammer"},"hamsa":{"styles":["solid"],"unicode":"f665","label":"Hamsa"},"hand-holding":{"styles":["solid"],"unicode":"f4bd","label":"Hand Holding"},"hand-holding-heart":{"styles":["solid"],"unicode":"f4be","label":"Hand Holding Heart"},"hand-holding-medical":{"styles":["solid"],"unicode":"e05c","label":"Hand Holding Medical Cross"},"hand-holding-usd":{"styles":["solid"],"unicode":"f4c0","label":"Hand Holding US Dollar"},"hand-holding-water":{"styles":["solid"],"unicode":"f4c1","label":"Hand Holding Water"},"hand-lizard":{"styles":["solid","regular"],"unicode":"f258","label":"Lizard (Hand)"},"hand-middle-finger":{"styles":["solid"],"unicode":"f806","label":"Hand with Middle Finger Raised"},"hand-paper":{"styles":["solid","regular"],"unicode":"f256","label":"Paper (Hand)"},"hand-peace":{"styles":["solid","regular"],"unicode":"f25b","label":"Peace (Hand)"},"hand-point-down":{"styles":["solid","regular"],"unicode":"f0a7","label":"Hand Pointing Down"},"hand-point-left":{"styles":["solid","regular"],"unicode":"f0a5","label":"Hand Pointing Left"},"hand-point-right":{"styles":["solid","regular"],"unicode":"f0a4","label":"Hand Pointing Right"},"hand-point-up":{"styles":["solid","regular"],"unicode":"f0a6","label":"Hand Pointing Up"},"hand-pointer":{"styles":["solid","regular"],"unicode":"f25a","label":"Pointer (Hand)"},"hand-rock":{"styles":["solid","regular"],"unicode":"f255","label":"Rock (Hand)"},"hand-scissors":{"styles":["solid","regular"],"unicode":"f257","label":"Scissors (Hand)"},"hand-sparkles":{"styles":["solid"],"unicode":"e05d","label":"Hand Sparkles"},"hand-spock":{"styles":["solid","regular"],"unicode":"f259","label":"Spock (Hand)"},"hands":{"styles":["solid"],"unicode":"f4c2","label":"Hands"},"hands-helping":{"styles":["solid"],"unicode":"f4c4","label":"Helping Hands"},"hands-wash":{"styles":["solid"],"unicode":"e05e","label":"Hands Wash"},"handshake":{"styles":["solid","regular"],"unicode":"f2b5","label":"Handshake"},"handshake-alt-slash":{"styles":["solid"],"unicode":"e05f","label":"Handshake Alternate Slash"},"handshake-slash":{"styles":["solid"],"unicode":"e060","label":"Handshake Slash"},"hanukiah":{"styles":["solid"],"unicode":"f6e6","label":"Hanukiah"},"hard-hat":{"styles":["solid"],"unicode":"f807","label":"Hard Hat"},"hashtag":{"styles":["solid"],"unicode":"f292","label":"Hashtag"},"hat-cowboy":{"styles":["solid"],"unicode":"f8c0","label":"Cowboy Hat"},"hat-cowboy-side":{"styles":["solid"],"unicode":"f8c1","label":"Cowboy Hat Side"},"hat-wizard":{"styles":["solid"],"unicode":"f6e8","label":"Wizard\'s Hat"},"hdd":{"styles":["solid","regular"],"unicode":"f0a0","label":"HDD"},"head-side-cough":{"styles":["solid"],"unicode":"e061","label":"Head Side Cough"},"head-side-cough-slash":{"styles":["solid"],"unicode":"e062","label":"Head Side-cough-slash"},"head-side-mask":{"styles":["solid"],"unicode":"e063","label":"Head Side Mask"},"head-side-virus":{"styles":["solid"],"unicode":"e064","label":"Head Side Virus"},"heading":{"styles":["solid"],"unicode":"f1dc","label":"heading"},"headphones":{"styles":["solid"],"unicode":"f025","label":"headphones"},"headphones-alt":{"styles":["solid"],"unicode":"f58f","label":"Alternate Headphones"},"headset":{"styles":["solid"],"unicode":"f590","label":"Headset"},"heart":{"styles":["solid","regular"],"unicode":"f004","label":"Heart"},"heart-broken":{"styles":["solid"],"unicode":"f7a9","label":"Heart Broken"},"heartbeat":{"styles":["solid"],"unicode":"f21e","label":"Heartbeat"},"helicopter":{"styles":["solid"],"unicode":"f533","label":"Helicopter"},"highlighter":{"styles":["solid"],"unicode":"f591","label":"Highlighter"},"hiking":{"styles":["solid"],"unicode":"f6ec","label":"Hiking"},"hippo":{"styles":["solid"],"unicode":"f6ed","label":"Hippo"},"hips":{"styles":["brands"],"unicode":"f452","label":"Hips"},"hire-a-helper":{"styles":["brands"],"unicode":"f3b0","label":"HireAHelper"},"history":{"styles":["solid"],"unicode":"f1da","label":"History"},"hive":{"styles":["brands"],"unicode":"e07f","label":"Hive Blockchain Network"},"hockey-puck":{"styles":["solid"],"unicode":"f453","label":"Hockey Puck"},"holly-berry":{"styles":["solid"],"unicode":"f7aa","label":"Holly Berry"},"home":{"styles":["solid"],"unicode":"f015","label":"home"},"hooli":{"styles":["brands"],"unicode":"f427","label":"Hooli"},"hornbill":{"styles":["brands"],"unicode":"f592","label":"Hornbill"},"horse":{"styles":["solid"],"unicode":"f6f0","label":"Horse"},"horse-head":{"styles":["solid"],"unicode":"f7ab","label":"Horse Head"},"hospital":{"styles":["solid","regular"],"unicode":"f0f8","label":"hospital"},"hospital-alt":{"styles":["solid"],"unicode":"f47d","label":"Alternate Hospital"},"hospital-symbol":{"styles":["solid"],"unicode":"f47e","label":"Hospital Symbol"},"hospital-user":{"styles":["solid"],"unicode":"f80d","label":"Hospital with User"},"hot-tub":{"styles":["solid"],"unicode":"f593","label":"Hot Tub"},"hotdog":{"styles":["solid"],"unicode":"f80f","label":"Hot Dog"},"hotel":{"styles":["solid"],"unicode":"f594","label":"Hotel"},"hotjar":{"styles":["brands"],"unicode":"f3b1","label":"Hotjar"},"hourglass":{"styles":["solid","regular"],"unicode":"f254","label":"Hourglass"},"hourglass-end":{"styles":["solid"],"unicode":"f253","label":"Hourglass End"},"hourglass-half":{"styles":["solid"],"unicode":"f252","label":"Hourglass Half"},"hourglass-start":{"styles":["solid"],"unicode":"f251","label":"Hourglass Start"},"house-damage":{"styles":["solid"],"unicode":"f6f1","label":"Damaged House"},"house-user":{"styles":["solid"],"unicode":"e065","label":"House User"},"houzz":{"styles":["brands"],"unicode":"f27c","label":"Houzz"},"hryvnia":{"styles":["solid"],"unicode":"f6f2","label":"Hryvnia"},"html5":{"styles":["brands"],"unicode":"f13b","label":"HTML 5 Logo"},"hubspot":{"styles":["brands"],"unicode":"f3b2","label":"HubSpot"},"i-cursor":{"styles":["solid"],"unicode":"f246","label":"I Beam Cursor"},"ice-cream":{"styles":["solid"],"unicode":"f810","label":"Ice Cream"},"icicles":{"styles":["solid"],"unicode":"f7ad","label":"Icicles"},"icons":{"styles":["solid"],"unicode":"f86d","label":"Icons"},"id-badge":{"styles":["solid","regular"],"unicode":"f2c1","label":"Identification Badge"},"id-card":{"styles":["solid","regular"],"unicode":"f2c2","label":"Identification Card"},"id-card-alt":{"styles":["solid"],"unicode":"f47f","label":"Alternate Identification Card"},"ideal":{"styles":["brands"],"unicode":"e013","label":"iDeal"},"igloo":{"styles":["solid"],"unicode":"f7ae","label":"Igloo"},"image":{"styles":["solid","regular"],"unicode":"f03e","label":"Image"},"images":{"styles":["solid","regular"],"unicode":"f302","label":"Images"},"imdb":{"styles":["brands"],"unicode":"f2d8","label":"IMDB"},"inbox":{"styles":["solid"],"unicode":"f01c","label":"inbox"},"indent":{"styles":["solid"],"unicode":"f03c","label":"Indent"},"industry":{"styles":["solid"],"unicode":"f275","label":"Industry"},"infinity":{"styles":["solid"],"unicode":"f534","label":"Infinity"},"info":{"styles":["solid"],"unicode":"f129","label":"Info"},"info-circle":{"styles":["solid"],"unicode":"f05a","label":"Info Circle"},"innosoft":{"styles":["brands"],"unicode":"e080","label":"Innosoft"},"instagram":{"styles":["brands"],"unicode":"f16d","label":"Instagram"},"instagram-square":{"styles":["brands"],"unicode":"e055","label":"Instagram Square"},"instalod":{"styles":["brands"],"unicode":"e081","label":"InstaLOD"},"intercom":{"styles":["brands"],"unicode":"f7af","label":"Intercom"},"internet-explorer":{"styles":["brands"],"unicode":"f26b","label":"Internet-explorer"},"invision":{"styles":["brands"],"unicode":"f7b0","label":"InVision"},"ioxhost":{"styles":["brands"],"unicode":"f208","label":"ioxhost"},"italic":{"styles":["solid"],"unicode":"f033","label":"italic"},"itch-io":{"styles":["brands"],"unicode":"f83a","label":"itch.io"},"itunes":{"styles":["brands"],"unicode":"f3b4","label":"iTunes"},"itunes-note":{"styles":["brands"],"unicode":"f3b5","label":"Itunes Note"},"java":{"styles":["brands"],"unicode":"f4e4","label":"Java"},"jedi":{"styles":["solid"],"unicode":"f669","label":"Jedi"},"jedi-order":{"styles":["brands"],"unicode":"f50e","label":"Jedi Order"},"jenkins":{"styles":["brands"],"unicode":"f3b6","label":"Jenkis"},"jira":{"styles":["brands"],"unicode":"f7b1","label":"Jira"},"joget":{"styles":["brands"],"unicode":"f3b7","label":"Joget"},"joint":{"styles":["solid"],"unicode":"f595","label":"Joint"},"joomla":{"styles":["brands"],"unicode":"f1aa","label":"Joomla Logo"},"journal-whills":{"styles":["solid"],"unicode":"f66a","label":"Journal of the Whills"},"js":{"styles":["brands"],"unicode":"f3b8","label":"JavaScript (JS)"},"js-square":{"styles":["brands"],"unicode":"f3b9","label":"JavaScript (JS) Square"},"jsfiddle":{"styles":["brands"],"unicode":"f1cc","label":"jsFiddle"},"kaaba":{"styles":["solid"],"unicode":"f66b","label":"Kaaba"},"kaggle":{"styles":["brands"],"unicode":"f5fa","label":"Kaggle"},"key":{"styles":["solid"],"unicode":"f084","label":"key"},"keybase":{"styles":["brands"],"unicode":"f4f5","label":"Keybase"},"keyboard":{"styles":["solid","regular"],"unicode":"f11c","label":"Keyboard"},"keycdn":{"styles":["brands"],"unicode":"f3ba","label":"KeyCDN"},"khanda":{"styles":["solid"],"unicode":"f66d","label":"Khanda"},"kickstarter":{"styles":["brands"],"unicode":"f3bb","label":"Kickstarter"},"kickstarter-k":{"styles":["brands"],"unicode":"f3bc","label":"Kickstarter K"},"kiss":{"styles":["solid","regular"],"unicode":"f596","label":"Kissing Face"},"kiss-beam":{"styles":["solid","regular"],"unicode":"f597","label":"Kissing Face With Smiling Eyes"},"kiss-wink-heart":{"styles":["solid","regular"],"unicode":"f598","label":"Face Blowing a Kiss"},"kiwi-bird":{"styles":["solid"],"unicode":"f535","label":"Kiwi Bird"},"korvue":{"styles":["brands"],"unicode":"f42f","label":"KORVUE"},"landmark":{"styles":["solid"],"unicode":"f66f","label":"Landmark"},"language":{"styles":["solid"],"unicode":"f1ab","label":"Language"},"laptop":{"styles":["solid"],"unicode":"f109","label":"Laptop"},"laptop-code":{"styles":["solid"],"unicode":"f5fc","label":"Laptop Code"},"laptop-house":{"styles":["solid"],"unicode":"e066","label":"Laptop House"},"laptop-medical":{"styles":["solid"],"unicode":"f812","label":"Laptop Medical"},"laravel":{"styles":["brands"],"unicode":"f3bd","label":"Laravel"},"lastfm":{"styles":["brands"],"unicode":"f202","label":"last.fm"},"lastfm-square":{"styles":["brands"],"unicode":"f203","label":"last.fm Square"},"laugh":{"styles":["solid","regular"],"unicode":"f599","label":"Grinning Face With Big Eyes"},"laugh-beam":{"styles":["solid","regular"],"unicode":"f59a","label":"Laugh Face with Beaming Eyes"},"laugh-squint":{"styles":["solid","regular"],"unicode":"f59b","label":"Laughing Squinting Face"},"laugh-wink":{"styles":["solid","regular"],"unicode":"f59c","label":"Laughing Winking Face"},"layer-group":{"styles":["solid"],"unicode":"f5fd","label":"Layer Group"},"leaf":{"styles":["solid"],"unicode":"f06c","label":"leaf"},"leanpub":{"styles":["brands"],"unicode":"f212","label":"Leanpub"},"lemon":{"styles":["solid","regular"],"unicode":"f094","label":"Lemon"},"less":{"styles":["brands"],"unicode":"f41d","label":"Less"},"less-than":{"styles":["solid"],"unicode":"f536","label":"Less Than"},"less-than-equal":{"styles":["solid"],"unicode":"f537","label":"Less Than Equal To"},"level-down-alt":{"styles":["solid"],"unicode":"f3be","label":"Alternate Level Down"},"level-up-alt":{"styles":["solid"],"unicode":"f3bf","label":"Alternate Level Up"},"life-ring":{"styles":["solid","regular"],"unicode":"f1cd","label":"Life Ring"},"lightbulb":{"styles":["solid","regular"],"unicode":"f0eb","label":"Lightbulb"},"line":{"styles":["brands"],"unicode":"f3c0","label":"Line"},"link":{"styles":["solid"],"unicode":"f0c1","label":"Link"},"linkedin":{"styles":["brands"],"unicode":"f08c","label":"LinkedIn"},"linkedin-in":{"styles":["brands"],"unicode":"f0e1","label":"LinkedIn In"},"linode":{"styles":["brands"],"unicode":"f2b8","label":"Linode"},"linux":{"styles":["brands"],"unicode":"f17c","label":"Linux"},"lira-sign":{"styles":["solid"],"unicode":"f195","label":"Turkish Lira Sign"},"list":{"styles":["solid"],"unicode":"f03a","label":"List"},"list-alt":{"styles":["solid","regular"],"unicode":"f022","label":"Alternate List"},"list-ol":{"styles":["solid"],"unicode":"f0cb","label":"list-ol"},"list-ul":{"styles":["solid"],"unicode":"f0ca","label":"list-ul"},"location-arrow":{"styles":["solid"],"unicode":"f124","label":"location-arrow"},"lock":{"styles":["solid"],"unicode":"f023","label":"lock"},"lock-open":{"styles":["solid"],"unicode":"f3c1","label":"Lock Open"},"long-arrow-alt-down":{"styles":["solid"],"unicode":"f309","label":"Alternate Long Arrow Down"},"long-arrow-alt-left":{"styles":["solid"],"unicode":"f30a","label":"Alternate Long Arrow Left"},"long-arrow-alt-right":{"styles":["solid"],"unicode":"f30b","label":"Alternate Long Arrow Right"},"long-arrow-alt-up":{"styles":["solid"],"unicode":"f30c","label":"Alternate Long Arrow Up"},"low-vision":{"styles":["solid"],"unicode":"f2a8","label":"Low Vision"},"luggage-cart":{"styles":["solid"],"unicode":"f59d","label":"Luggage Cart"},"lungs":{"styles":["solid"],"unicode":"f604","label":"Lungs"},"lungs-virus":{"styles":["solid"],"unicode":"e067","label":"Lungs Virus"},"lyft":{"styles":["brands"],"unicode":"f3c3","label":"lyft"},"magento":{"styles":["brands"],"unicode":"f3c4","label":"Magento"},"magic":{"styles":["solid"],"unicode":"f0d0","label":"magic"},"magnet":{"styles":["solid"],"unicode":"f076","label":"magnet"},"mail-bulk":{"styles":["solid"],"unicode":"f674","label":"Mail Bulk"},"mailchimp":{"styles":["brands"],"unicode":"f59e","label":"Mailchimp"},"male":{"styles":["solid"],"unicode":"f183","label":"Male"},"mandalorian":{"styles":["brands"],"unicode":"f50f","label":"Mandalorian"},"map":{"styles":["solid","regular"],"unicode":"f279","label":"Map"},"map-marked":{"styles":["solid"],"unicode":"f59f","label":"Map Marked"},"map-marked-alt":{"styles":["solid"],"unicode":"f5a0","label":"Alternate Map Marked"},"map-marker":{"styles":["solid"],"unicode":"f041","label":"map-marker"},"map-marker-alt":{"styles":["solid"],"unicode":"f3c5","label":"Alternate Map Marker"},"map-pin":{"styles":["solid"],"unicode":"f276","label":"Map Pin"},"map-signs":{"styles":["solid"],"unicode":"f277","label":"Map Signs"},"markdown":{"styles":["brands"],"unicode":"f60f","label":"Markdown"},"marker":{"styles":["solid"],"unicode":"f5a1","label":"Marker"},"mars":{"styles":["solid"],"unicode":"f222","label":"Mars"},"mars-double":{"styles":["solid"],"unicode":"f227","label":"Mars Double"},"mars-stroke":{"styles":["solid"],"unicode":"f229","label":"Mars Stroke"},"mars-stroke-h":{"styles":["solid"],"unicode":"f22b","label":"Mars Stroke Horizontal"},"mars-stroke-v":{"styles":["solid"],"unicode":"f22a","label":"Mars Stroke Vertical"},"mask":{"styles":["solid"],"unicode":"f6fa","label":"Mask"},"mastodon":{"styles":["brands"],"unicode":"f4f6","label":"Mastodon"},"maxcdn":{"styles":["brands"],"unicode":"f136","label":"MaxCDN"},"mdb":{"styles":["brands"],"unicode":"f8ca","label":"Material Design for Bootstrap"},"medal":{"styles":["solid"],"unicode":"f5a2","label":"Medal"},"medapps":{"styles":["brands"],"unicode":"f3c6","label":"MedApps"},"medium":{"styles":["brands"],"unicode":"f23a","label":"Medium"},"medium-m":{"styles":["brands"],"unicode":"f3c7","label":"Medium M"},"medkit":{"styles":["solid"],"unicode":"f0fa","label":"medkit"},"medrt":{"styles":["brands"],"unicode":"f3c8","label":"MRT"},"meetup":{"styles":["brands"],"unicode":"f2e0","label":"Meetup"},"megaport":{"styles":["brands"],"unicode":"f5a3","label":"Megaport"},"meh":{"styles":["solid","regular"],"unicode":"f11a","label":"Neutral Face"},"meh-blank":{"styles":["solid","regular"],"unicode":"f5a4","label":"Face Without Mouth"},"meh-rolling-eyes":{"styles":["solid","regular"],"unicode":"f5a5","label":"Face With Rolling Eyes"},"memory":{"styles":["solid"],"unicode":"f538","label":"Memory"},"mendeley":{"styles":["brands"],"unicode":"f7b3","label":"Mendeley"},"menorah":{"styles":["solid"],"unicode":"f676","label":"Menorah"},"mercury":{"styles":["solid"],"unicode":"f223","label":"Mercury"},"meteor":{"styles":["solid"],"unicode":"f753","label":"Meteor"},"microblog":{"styles":["brands"],"unicode":"e01a","label":"Micro.blog"},"microchip":{"styles":["solid"],"unicode":"f2db","label":"Microchip"},"microphone":{"styles":["solid"],"unicode":"f130","label":"microphone"},"microphone-alt":{"styles":["solid"],"unicode":"f3c9","label":"Alternate Microphone"},"microphone-alt-slash":{"styles":["solid"],"unicode":"f539","label":"Alternate Microphone Slash"},"microphone-slash":{"styles":["solid"],"unicode":"f131","label":"Microphone Slash"},"microscope":{"styles":["solid"],"unicode":"f610","label":"Microscope"},"microsoft":{"styles":["brands"],"unicode":"f3ca","label":"Microsoft"},"minus":{"styles":["solid"],"unicode":"f068","label":"minus"},"minus-circle":{"styles":["solid"],"unicode":"f056","label":"Minus Circle"},"minus-square":{"styles":["solid","regular"],"unicode":"f146","label":"Minus Square"},"mitten":{"styles":["solid"],"unicode":"f7b5","label":"Mitten"},"mix":{"styles":["brands"],"unicode":"f3cb","label":"Mix"},"mixcloud":{"styles":["brands"],"unicode":"f289","label":"Mixcloud"},"mixer":{"styles":["brands"],"unicode":"e056","label":"Mixer"},"mizuni":{"styles":["brands"],"unicode":"f3cc","label":"Mizuni"},"mobile":{"styles":["solid"],"unicode":"f10b","label":"Mobile Phone"},"mobile-alt":{"styles":["solid"],"unicode":"f3cd","label":"Alternate Mobile"},"modx":{"styles":["brands"],"unicode":"f285","label":"MODX"},"monero":{"styles":["brands"],"unicode":"f3d0","label":"Monero"},"money-bill":{"styles":["solid"],"unicode":"f0d6","label":"Money Bill"},"money-bill-alt":{"styles":["solid","regular"],"unicode":"f3d1","label":"Alternate Money Bill"},"money-bill-wave":{"styles":["solid"],"unicode":"f53a","label":"Wavy Money Bill"},"money-bill-wave-alt":{"styles":["solid"],"unicode":"f53b","label":"Alternate Wavy Money Bill"},"money-check":{"styles":["solid"],"unicode":"f53c","label":"Money Check"},"money-check-alt":{"styles":["solid"],"unicode":"f53d","label":"Alternate Money Check"},"monument":{"styles":["solid"],"unicode":"f5a6","label":"Monument"},"moon":{"styles":["solid","regular"],"unicode":"f186","label":"Moon"},"mortar-pestle":{"styles":["solid"],"unicode":"f5a7","label":"Mortar Pestle"},"mosque":{"styles":["solid"],"unicode":"f678","label":"Mosque"},"motorcycle":{"styles":["solid"],"unicode":"f21c","label":"Motorcycle"},"mountain":{"styles":["solid"],"unicode":"f6fc","label":"Mountain"},"mouse":{"styles":["solid"],"unicode":"f8cc","label":"Mouse"},"mouse-pointer":{"styles":["solid"],"unicode":"f245","label":"Mouse Pointer"},"mug-hot":{"styles":["solid"],"unicode":"f7b6","label":"Mug Hot"},"music":{"styles":["solid"],"unicode":"f001","label":"Music"},"napster":{"styles":["brands"],"unicode":"f3d2","label":"Napster"},"neos":{"styles":["brands"],"unicode":"f612","label":"Neos"},"network-wired":{"styles":["solid"],"unicode":"f6ff","label":"Wired Network"},"neuter":{"styles":["solid"],"unicode":"f22c","label":"Neuter"},"newspaper":{"styles":["solid","regular"],"unicode":"f1ea","label":"Newspaper"},"nimblr":{"styles":["brands"],"unicode":"f5a8","label":"Nimblr"},"node":{"styles":["brands"],"unicode":"f419","label":"Node.js"},"node-js":{"styles":["brands"],"unicode":"f3d3","label":"Node.js JS"},"not-equal":{"styles":["solid"],"unicode":"f53e","label":"Not Equal"},"notes-medical":{"styles":["solid"],"unicode":"f481","label":"Medical Notes"},"npm":{"styles":["brands"],"unicode":"f3d4","label":"npm"},"ns8":{"styles":["brands"],"unicode":"f3d5","label":"NS8"},"nutritionix":{"styles":["brands"],"unicode":"f3d6","label":"Nutritionix"},"object-group":{"styles":["solid","regular"],"unicode":"f247","label":"Object Group"},"object-ungroup":{"styles":["solid","regular"],"unicode":"f248","label":"Object Ungroup"},"octopus-deploy":{"styles":["brands"],"unicode":"e082","label":"Octopus Deploy"},"odnoklassniki":{"styles":["brands"],"unicode":"f263","label":"Odnoklassniki"},"odnoklassniki-square":{"styles":["brands"],"unicode":"f264","label":"Odnoklassniki Square"},"oil-can":{"styles":["solid"],"unicode":"f613","label":"Oil Can"},"old-republic":{"styles":["brands"],"unicode":"f510","label":"Old Republic"},"om":{"styles":["solid"],"unicode":"f679","label":"Om"},"opencart":{"styles":["brands"],"unicode":"f23d","label":"OpenCart"},"openid":{"styles":["brands"],"unicode":"f19b","label":"OpenID"},"opera":{"styles":["brands"],"unicode":"f26a","label":"Opera"},"optin-monster":{"styles":["brands"],"unicode":"f23c","label":"Optin Monster"},"orcid":{"styles":["brands"],"unicode":"f8d2","label":"ORCID"},"osi":{"styles":["brands"],"unicode":"f41a","label":"Open Source Initiative"},"otter":{"styles":["solid"],"unicode":"f700","label":"Otter"},"outdent":{"styles":["solid"],"unicode":"f03b","label":"Outdent"},"page4":{"styles":["brands"],"unicode":"f3d7","label":"page4 Corporation"},"pagelines":{"styles":["brands"],"unicode":"f18c","label":"Pagelines"},"pager":{"styles":["solid"],"unicode":"f815","label":"Pager"},"paint-brush":{"styles":["solid"],"unicode":"f1fc","label":"Paint Brush"},"paint-roller":{"styles":["solid"],"unicode":"f5aa","label":"Paint Roller"},"palette":{"styles":["solid"],"unicode":"f53f","label":"Palette"},"palfed":{"styles":["brands"],"unicode":"f3d8","label":"Palfed"},"pallet":{"styles":["solid"],"unicode":"f482","label":"Pallet"},"paper-plane":{"styles":["solid","regular"],"unicode":"f1d8","label":"Paper Plane"},"paperclip":{"styles":["solid"],"unicode":"f0c6","label":"Paperclip"},"parachute-box":{"styles":["solid"],"unicode":"f4cd","label":"Parachute Box"},"paragraph":{"styles":["solid"],"unicode":"f1dd","label":"paragraph"},"parking":{"styles":["solid"],"unicode":"f540","label":"Parking"},"passport":{"styles":["solid"],"unicode":"f5ab","label":"Passport"},"pastafarianism":{"styles":["solid"],"unicode":"f67b","label":"Pastafarianism"},"paste":{"styles":["solid"],"unicode":"f0ea","label":"Paste"},"patreon":{"styles":["brands"],"unicode":"f3d9","label":"Patreon"},"pause":{"styles":["solid"],"unicode":"f04c","label":"pause"},"pause-circle":{"styles":["solid","regular"],"unicode":"f28b","label":"Pause Circle"},"paw":{"styles":["solid"],"unicode":"f1b0","label":"Paw"},"paypal":{"styles":["brands"],"unicode":"f1ed","label":"Paypal"},"peace":{"styles":["solid"],"unicode":"f67c","label":"Peace"},"pen":{"styles":["solid"],"unicode":"f304","label":"Pen"},"pen-alt":{"styles":["solid"],"unicode":"f305","label":"Alternate Pen"},"pen-fancy":{"styles":["solid"],"unicode":"f5ac","label":"Pen Fancy"},"pen-nib":{"styles":["solid"],"unicode":"f5ad","label":"Pen Nib"},"pen-square":{"styles":["solid"],"unicode":"f14b","label":"Pen Square"},"pencil-alt":{"styles":["solid"],"unicode":"f303","label":"Alternate Pencil"},"pencil-ruler":{"styles":["solid"],"unicode":"f5ae","label":"Pencil Ruler"},"penny-arcade":{"styles":["brands"],"unicode":"f704","label":"Penny Arcade"},"people-arrows":{"styles":["solid"],"unicode":"e068","label":"People Arrows"},"people-carry":{"styles":["solid"],"unicode":"f4ce","label":"People Carry"},"pepper-hot":{"styles":["solid"],"unicode":"f816","label":"Hot Pepper"},"perbyte":{"styles":["brands"],"unicode":"e083","label":"PerByte"},"percent":{"styles":["solid"],"unicode":"f295","label":"Percent"},"percentage":{"styles":["solid"],"unicode":"f541","label":"Percentage"},"periscope":{"styles":["brands"],"unicode":"f3da","label":"Periscope"},"person-booth":{"styles":["solid"],"unicode":"f756","label":"Person Entering Booth"},"phabricator":{"styles":["brands"],"unicode":"f3db","label":"Phabricator"},"phoenix-framework":{"styles":["brands"],"unicode":"f3dc","label":"Phoenix Framework"},"phoenix-squadron":{"styles":["brands"],"unicode":"f511","label":"Phoenix Squadron"},"phone":{"styles":["solid"],"unicode":"f095","label":"Phone"},"phone-alt":{"styles":["solid"],"unicode":"f879","label":"Alternate Phone"},"phone-slash":{"styles":["solid"],"unicode":"f3dd","label":"Phone Slash"},"phone-square":{"styles":["solid"],"unicode":"f098","label":"Phone Square"},"phone-square-alt":{"styles":["solid"],"unicode":"f87b","label":"Alternate Phone Square"},"phone-volume":{"styles":["solid"],"unicode":"f2a0","label":"Phone Volume"},"photo-video":{"styles":["solid"],"unicode":"f87c","label":"Photo Video"},"php":{"styles":["brands"],"unicode":"f457","label":"PHP"},"pied-piper":{"styles":["brands"],"unicode":"f2ae","label":"Pied Piper Logo"},"pied-piper-alt":{"styles":["brands"],"unicode":"f1a8","label":"Alternate Pied Piper Logo (Old)"},"pied-piper-hat":{"styles":["brands"],"unicode":"f4e5","label":"Pied Piper Hat (Old)"},"pied-piper-pp":{"styles":["brands"],"unicode":"f1a7","label":"Pied Piper PP Logo (Old)"},"pied-piper-square":{"styles":["brands"],"unicode":"e01e","label":"Pied Piper Square Logo (Old)"},"piggy-bank":{"styles":["solid"],"unicode":"f4d3","label":"Piggy Bank"},"pills":{"styles":["solid"],"unicode":"f484","label":"Pills"},"pinterest":{"styles":["brands"],"unicode":"f0d2","label":"Pinterest"},"pinterest-p":{"styles":["brands"],"unicode":"f231","label":"Pinterest P"},"pinterest-square":{"styles":["brands"],"unicode":"f0d3","label":"Pinterest Square"},"pizza-slice":{"styles":["solid"],"unicode":"f818","label":"Pizza Slice"},"place-of-worship":{"styles":["solid"],"unicode":"f67f","label":"Place of Worship"},"plane":{"styles":["solid"],"unicode":"f072","label":"plane"},"plane-arrival":{"styles":["solid"],"unicode":"f5af","label":"Plane Arrival"},"plane-departure":{"styles":["solid"],"unicode":"f5b0","label":"Plane Departure"},"plane-slash":{"styles":["solid"],"unicode":"e069","label":"Plane Slash"},"play":{"styles":["solid"],"unicode":"f04b","label":"play"},"play-circle":{"styles":["solid","regular"],"unicode":"f144","label":"Play Circle"},"playstation":{"styles":["brands"],"unicode":"f3df","label":"PlayStation"},"plug":{"styles":["solid"],"unicode":"f1e6","label":"Plug"},"plus":{"styles":["solid"],"unicode":"f067","label":"plus"},"plus-circle":{"styles":["solid"],"unicode":"f055","label":"Plus Circle"},"plus-square":{"styles":["solid","regular"],"unicode":"f0fe","label":"Plus Square"},"podcast":{"styles":["solid"],"unicode":"f2ce","label":"Podcast"},"poll":{"styles":["solid"],"unicode":"f681","label":"Poll"},"poll-h":{"styles":["solid"],"unicode":"f682","label":"Poll H"},"poo":{"styles":["solid"],"unicode":"f2fe","label":"Poo"},"poo-storm":{"styles":["solid"],"unicode":"f75a","label":"Poo Storm"},"poop":{"styles":["solid"],"unicode":"f619","label":"Poop"},"portrait":{"styles":["solid"],"unicode":"f3e0","label":"Portrait"},"pound-sign":{"styles":["solid"],"unicode":"f154","label":"Pound Sign"},"power-off":{"styles":["solid"],"unicode":"f011","label":"Power Off"},"pray":{"styles":["solid"],"unicode":"f683","label":"Pray"},"praying-hands":{"styles":["solid"],"unicode":"f684","label":"Praying Hands"},"prescription":{"styles":["solid"],"unicode":"f5b1","label":"Prescription"},"prescription-bottle":{"styles":["solid"],"unicode":"f485","label":"Prescription Bottle"},"prescription-bottle-alt":{"styles":["solid"],"unicode":"f486","label":"Alternate Prescription Bottle"},"print":{"styles":["solid"],"unicode":"f02f","label":"print"},"procedures":{"styles":["solid"],"unicode":"f487","label":"Procedures"},"product-hunt":{"styles":["brands"],"unicode":"f288","label":"Product Hunt"},"project-diagram":{"styles":["solid"],"unicode":"f542","label":"Project Diagram"},"pump-medical":{"styles":["solid"],"unicode":"e06a","label":"Pump Medical"},"pump-soap":{"styles":["solid"],"unicode":"e06b","label":"Pump Soap"},"pushed":{"styles":["brands"],"unicode":"f3e1","label":"Pushed"},"puzzle-piece":{"styles":["solid"],"unicode":"f12e","label":"Puzzle Piece"},"python":{"styles":["brands"],"unicode":"f3e2","label":"Python"},"qq":{"styles":["brands"],"unicode":"f1d6","label":"QQ"},"qrcode":{"styles":["solid"],"unicode":"f029","label":"qrcode"},"question":{"styles":["solid"],"unicode":"f128","label":"Question"},"question-circle":{"styles":["solid","regular"],"unicode":"f059","label":"Question Circle"},"quidditch":{"styles":["solid"],"unicode":"f458","label":"Quidditch"},"quinscape":{"styles":["brands"],"unicode":"f459","label":"QuinScape"},"quora":{"styles":["brands"],"unicode":"f2c4","label":"Quora"},"quote-left":{"styles":["solid"],"unicode":"f10d","label":"quote-left"},"quote-right":{"styles":["solid"],"unicode":"f10e","label":"quote-right"},"quran":{"styles":["solid"],"unicode":"f687","label":"Quran"},"r-project":{"styles":["brands"],"unicode":"f4f7","label":"R Project"},"radiation":{"styles":["solid"],"unicode":"f7b9","label":"Radiation"},"radiation-alt":{"styles":["solid"],"unicode":"f7ba","label":"Alternate Radiation"},"rainbow":{"styles":["solid"],"unicode":"f75b","label":"Rainbow"},"random":{"styles":["solid"],"unicode":"f074","label":"random"},"raspberry-pi":{"styles":["brands"],"unicode":"f7bb","label":"Raspberry Pi"},"ravelry":{"styles":["brands"],"unicode":"f2d9","label":"Ravelry"},"react":{"styles":["brands"],"unicode":"f41b","label":"React"},"reacteurope":{"styles":["brands"],"unicode":"f75d","label":"ReactEurope"},"readme":{"styles":["brands"],"unicode":"f4d5","label":"ReadMe"},"rebel":{"styles":["brands"],"unicode":"f1d0","label":"Rebel Alliance"},"receipt":{"styles":["solid"],"unicode":"f543","label":"Receipt"},"record-vinyl":{"styles":["solid"],"unicode":"f8d9","label":"Record Vinyl"},"recycle":{"styles":["solid"],"unicode":"f1b8","label":"Recycle"},"red-river":{"styles":["brands"],"unicode":"f3e3","label":"red river"},"reddit":{"styles":["brands"],"unicode":"f1a1","label":"reddit Logo"},"reddit-alien":{"styles":["brands"],"unicode":"f281","label":"reddit Alien"},"reddit-square":{"styles":["brands"],"unicode":"f1a2","label":"reddit Square"},"redhat":{"styles":["brands"],"unicode":"f7bc","label":"Redhat"},"redo":{"styles":["solid"],"unicode":"f01e","label":"Redo"},"redo-alt":{"styles":["solid"],"unicode":"f2f9","label":"Alternate Redo"},"registered":{"styles":["solid","regular"],"unicode":"f25d","label":"Registered Trademark"},"remove-format":{"styles":["solid"],"unicode":"f87d","label":"Remove Format"},"renren":{"styles":["brands"],"unicode":"f18b","label":"Renren"},"reply":{"styles":["solid"],"unicode":"f3e5","label":"Reply"},"reply-all":{"styles":["solid"],"unicode":"f122","label":"reply-all"},"replyd":{"styles":["brands"],"unicode":"f3e6","label":"replyd"},"republican":{"styles":["solid"],"unicode":"f75e","label":"Republican"},"researchgate":{"styles":["brands"],"unicode":"f4f8","label":"Researchgate"},"resolving":{"styles":["brands"],"unicode":"f3e7","label":"Resolving"},"restroom":{"styles":["solid"],"unicode":"f7bd","label":"Restroom"},"retweet":{"styles":["solid"],"unicode":"f079","label":"Retweet"},"rev":{"styles":["brands"],"unicode":"f5b2","label":"Rev.io"},"ribbon":{"styles":["solid"],"unicode":"f4d6","label":"Ribbon"},"ring":{"styles":["solid"],"unicode":"f70b","label":"Ring"},"road":{"styles":["solid"],"unicode":"f018","label":"road"},"robot":{"styles":["solid"],"unicode":"f544","label":"Robot"},"rocket":{"styles":["solid"],"unicode":"f135","label":"rocket"},"rocketchat":{"styles":["brands"],"unicode":"f3e8","label":"Rocket.Chat"},"rockrms":{"styles":["brands"],"unicode":"f3e9","label":"Rockrms"},"route":{"styles":["solid"],"unicode":"f4d7","label":"Route"},"rss":{"styles":["solid"],"unicode":"f09e","label":"rss"},"rss-square":{"styles":["solid"],"unicode":"f143","label":"RSS Square"},"ruble-sign":{"styles":["solid"],"unicode":"f158","label":"Ruble Sign"},"ruler":{"styles":["solid"],"unicode":"f545","label":"Ruler"},"ruler-combined":{"styles":["solid"],"unicode":"f546","label":"Ruler Combined"},"ruler-horizontal":{"styles":["solid"],"unicode":"f547","label":"Ruler Horizontal"},"ruler-vertical":{"styles":["solid"],"unicode":"f548","label":"Ruler Vertical"},"running":{"styles":["solid"],"unicode":"f70c","label":"Running"},"rupee-sign":{"styles":["solid"],"unicode":"f156","label":"Indian Rupee Sign"},"rust":{"styles":["brands"],"unicode":"e07a","label":"Rust"},"sad-cry":{"styles":["solid","regular"],"unicode":"f5b3","label":"Crying Face"},"sad-tear":{"styles":["solid","regular"],"unicode":"f5b4","label":"Loudly Crying Face"},"safari":{"styles":["brands"],"unicode":"f267","label":"Safari"},"salesforce":{"styles":["brands"],"unicode":"f83b","label":"Salesforce"},"sass":{"styles":["brands"],"unicode":"f41e","label":"Sass"},"satellite":{"styles":["solid"],"unicode":"f7bf","label":"Satellite"},"satellite-dish":{"styles":["solid"],"unicode":"f7c0","label":"Satellite Dish"},"save":{"styles":["solid","regular"],"unicode":"f0c7","label":"Save"},"schlix":{"styles":["brands"],"unicode":"f3ea","label":"SCHLIX"},"school":{"styles":["solid"],"unicode":"f549","label":"School"},"screwdriver":{"styles":["solid"],"unicode":"f54a","label":"Screwdriver"},"scribd":{"styles":["brands"],"unicode":"f28a","label":"Scribd"},"scroll":{"styles":["solid"],"unicode":"f70e","label":"Scroll"},"sd-card":{"styles":["solid"],"unicode":"f7c2","label":"Sd Card"},"search":{"styles":["solid"],"unicode":"f002","label":"Search"},"search-dollar":{"styles":["solid"],"unicode":"f688","label":"Search Dollar"},"search-location":{"styles":["solid"],"unicode":"f689","label":"Search Location"},"search-minus":{"styles":["solid"],"unicode":"f010","label":"Search Minus"},"search-plus":{"styles":["solid"],"unicode":"f00e","label":"Search Plus"},"searchengin":{"styles":["brands"],"unicode":"f3eb","label":"Searchengin"},"seedling":{"styles":["solid"],"unicode":"f4d8","label":"Seedling"},"sellcast":{"styles":["brands"],"unicode":"f2da","label":"Sellcast"},"sellsy":{"styles":["brands"],"unicode":"f213","label":"Sellsy"},"server":{"styles":["solid"],"unicode":"f233","label":"Server"},"servicestack":{"styles":["brands"],"unicode":"f3ec","label":"Servicestack"},"shapes":{"styles":["solid"],"unicode":"f61f","label":"Shapes"},"share":{"styles":["solid"],"unicode":"f064","label":"Share"},"share-alt":{"styles":["solid"],"unicode":"f1e0","label":"Alternate Share"},"share-alt-square":{"styles":["solid"],"unicode":"f1e1","label":"Alternate Share Square"},"share-square":{"styles":["solid","regular"],"unicode":"f14d","label":"Share Square"},"shekel-sign":{"styles":["solid"],"unicode":"f20b","label":"Shekel Sign"},"shield-alt":{"styles":["solid"],"unicode":"f3ed","label":"Alternate Shield"},"shield-virus":{"styles":["solid"],"unicode":"e06c","label":"Shield Virus"},"ship":{"styles":["solid"],"unicode":"f21a","label":"Ship"},"shipping-fast":{"styles":["solid"],"unicode":"f48b","label":"Shipping Fast"},"shirtsinbulk":{"styles":["brands"],"unicode":"f214","label":"Shirts in Bulk"},"shoe-prints":{"styles":["solid"],"unicode":"f54b","label":"Shoe Prints"},"shopify":{"styles":["brands"],"unicode":"e057","label":"Shopify"},"shopping-bag":{"styles":["solid"],"unicode":"f290","label":"Shopping Bag"},"shopping-basket":{"styles":["solid"],"unicode":"f291","label":"Shopping Basket"},"shopping-cart":{"styles":["solid"],"unicode":"f07a","label":"shopping-cart"},"shopware":{"styles":["brands"],"unicode":"f5b5","label":"Shopware"},"shower":{"styles":["solid"],"unicode":"f2cc","label":"Shower"},"shuttle-van":{"styles":["solid"],"unicode":"f5b6","label":"Shuttle Van"},"sign":{"styles":["solid"],"unicode":"f4d9","label":"Sign"},"sign-in-alt":{"styles":["solid"],"unicode":"f2f6","label":"Alternate Sign In"},"sign-language":{"styles":["solid"],"unicode":"f2a7","label":"Sign Language"},"sign-out-alt":{"styles":["solid"],"unicode":"f2f5","label":"Alternate Sign Out"},"signal":{"styles":["solid"],"unicode":"f012","label":"signal"},"signature":{"styles":["solid"],"unicode":"f5b7","label":"Signature"},"sim-card":{"styles":["solid"],"unicode":"f7c4","label":"SIM Card"},"simplybuilt":{"styles":["brands"],"unicode":"f215","label":"SimplyBuilt"},"sink":{"styles":["solid"],"unicode":"e06d","label":"Sink"},"sistrix":{"styles":["brands"],"unicode":"f3ee","label":"SISTRIX"},"sitemap":{"styles":["solid"],"unicode":"f0e8","label":"Sitemap"},"sith":{"styles":["brands"],"unicode":"f512","label":"Sith"},"skating":{"styles":["solid"],"unicode":"f7c5","label":"Skating"},"sketch":{"styles":["brands"],"unicode":"f7c6","label":"Sketch"},"skiing":{"styles":["solid"],"unicode":"f7c9","label":"Skiing"},"skiing-nordic":{"styles":["solid"],"unicode":"f7ca","label":"Skiing Nordic"},"skull":{"styles":["solid"],"unicode":"f54c","label":"Skull"},"skull-crossbones":{"styles":["solid"],"unicode":"f714","label":"Skull & Crossbones"},"skyatlas":{"styles":["brands"],"unicode":"f216","label":"skyatlas"},"skype":{"styles":["brands"],"unicode":"f17e","label":"Skype"},"slack":{"styles":["brands"],"unicode":"f198","label":"Slack Logo"},"slack-hash":{"styles":["brands"],"unicode":"f3ef","label":"Slack Hashtag"},"slash":{"styles":["solid"],"unicode":"f715","label":"Slash"},"sleigh":{"styles":["solid"],"unicode":"f7cc","label":"Sleigh"},"sliders-h":{"styles":["solid"],"unicode":"f1de","label":"Horizontal Sliders"},"slideshare":{"styles":["brands"],"unicode":"f1e7","label":"Slideshare"},"smile":{"styles":["solid","regular"],"unicode":"f118","label":"Smiling Face"},"smile-beam":{"styles":["solid","regular"],"unicode":"f5b8","label":"Beaming Face With Smiling Eyes"},"smile-wink":{"styles":["solid","regular"],"unicode":"f4da","label":"Winking Face"},"smog":{"styles":["solid"],"unicode":"f75f","label":"Smog"},"smoking":{"styles":["solid"],"unicode":"f48d","label":"Smoking"},"smoking-ban":{"styles":["solid"],"unicode":"f54d","label":"Smoking Ban"},"sms":{"styles":["solid"],"unicode":"f7cd","label":"SMS"},"snapchat":{"styles":["brands"],"unicode":"f2ab","label":"Snapchat"},"snapchat-ghost":{"styles":["brands"],"unicode":"f2ac","label":"Snapchat Ghost"},"snapchat-square":{"styles":["brands"],"unicode":"f2ad","label":"Snapchat Square"},"snowboarding":{"styles":["solid"],"unicode":"f7ce","label":"Snowboarding"},"snowflake":{"styles":["solid","regular"],"unicode":"f2dc","label":"Snowflake"},"snowman":{"styles":["solid"],"unicode":"f7d0","label":"Snowman"},"snowplow":{"styles":["solid"],"unicode":"f7d2","label":"Snowplow"},"soap":{"styles":["solid"],"unicode":"e06e","label":"Soap"},"socks":{"styles":["solid"],"unicode":"f696","label":"Socks"},"solar-panel":{"styles":["solid"],"unicode":"f5ba","label":"Solar Panel"},"sort":{"styles":["solid"],"unicode":"f0dc","label":"Sort"},"sort-alpha-down":{"styles":["solid"],"unicode":"f15d","label":"Sort Alphabetical Down"},"sort-alpha-down-alt":{"styles":["solid"],"unicode":"f881","label":"Alternate Sort Alphabetical Down"},"sort-alpha-up":{"styles":["solid"],"unicode":"f15e","label":"Sort Alphabetical Up"},"sort-alpha-up-alt":{"styles":["solid"],"unicode":"f882","label":"Alternate Sort Alphabetical Up"},"sort-amount-down":{"styles":["solid"],"unicode":"f160","label":"Sort Amount Down"},"sort-amount-down-alt":{"styles":["solid"],"unicode":"f884","label":"Alternate Sort Amount Down"},"sort-amount-up":{"styles":["solid"],"unicode":"f161","label":"Sort Amount Up"},"sort-amount-up-alt":{"styles":["solid"],"unicode":"f885","label":"Alternate Sort Amount Up"},"sort-down":{"styles":["solid"],"unicode":"f0dd","label":"Sort Down (Descending)"},"sort-numeric-down":{"styles":["solid"],"unicode":"f162","label":"Sort Numeric Down"},"sort-numeric-down-alt":{"styles":["solid"],"unicode":"f886","label":"Alternate Sort Numeric Down"},"sort-numeric-up":{"styles":["solid"],"unicode":"f163","label":"Sort Numeric Up"},"sort-numeric-up-alt":{"styles":["solid"],"unicode":"f887","label":"Alternate Sort Numeric Up"},"sort-up":{"styles":["solid"],"unicode":"f0de","label":"Sort Up (Ascending)"},"soundcloud":{"styles":["brands"],"unicode":"f1be","label":"SoundCloud"},"sourcetree":{"styles":["brands"],"unicode":"f7d3","label":"Sourcetree"},"spa":{"styles":["solid"],"unicode":"f5bb","label":"Spa"},"space-shuttle":{"styles":["solid"],"unicode":"f197","label":"Space Shuttle"},"speakap":{"styles":["brands"],"unicode":"f3f3","label":"Speakap"},"speaker-deck":{"styles":["brands"],"unicode":"f83c","label":"Speaker Deck"},"spell-check":{"styles":["solid"],"unicode":"f891","label":"Spell Check"},"spider":{"styles":["solid"],"unicode":"f717","label":"Spider"},"spinner":{"styles":["solid"],"unicode":"f110","label":"Spinner"},"splotch":{"styles":["solid"],"unicode":"f5bc","label":"Splotch"},"spotify":{"styles":["brands"],"unicode":"f1bc","label":"Spotify"},"spray-can":{"styles":["solid"],"unicode":"f5bd","label":"Spray Can"},"square":{"styles":["solid","regular"],"unicode":"f0c8","label":"Square"},"square-full":{"styles":["solid"],"unicode":"f45c","label":"Square Full"},"square-root-alt":{"styles":["solid"],"unicode":"f698","label":"Alternate Square Root"},"squarespace":{"styles":["brands"],"unicode":"f5be","label":"Squarespace"},"stack-exchange":{"styles":["brands"],"unicode":"f18d","label":"Stack Exchange"},"stack-overflow":{"styles":["brands"],"unicode":"f16c","label":"Stack Overflow"},"stackpath":{"styles":["brands"],"unicode":"f842","label":"Stackpath"},"stamp":{"styles":["solid"],"unicode":"f5bf","label":"Stamp"},"star":{"styles":["solid","regular"],"unicode":"f005","label":"Star"},"star-and-crescent":{"styles":["solid"],"unicode":"f699","label":"Star and Crescent"},"star-half":{"styles":["solid","regular"],"unicode":"f089","label":"star-half"},"star-half-alt":{"styles":["solid"],"unicode":"f5c0","label":"Alternate Star Half"},"star-of-david":{"styles":["solid"],"unicode":"f69a","label":"Star of David"},"star-of-life":{"styles":["solid"],"unicode":"f621","label":"Star of Life"},"staylinked":{"styles":["brands"],"unicode":"f3f5","label":"StayLinked"},"steam":{"styles":["brands"],"unicode":"f1b6","label":"Steam"},"steam-square":{"styles":["brands"],"unicode":"f1b7","label":"Steam Square"},"steam-symbol":{"styles":["brands"],"unicode":"f3f6","label":"Steam Symbol"},"step-backward":{"styles":["solid"],"unicode":"f048","label":"step-backward"},"step-forward":{"styles":["solid"],"unicode":"f051","label":"step-forward"},"stethoscope":{"styles":["solid"],"unicode":"f0f1","label":"Stethoscope"},"sticker-mule":{"styles":["brands"],"unicode":"f3f7","label":"Sticker Mule"},"sticky-note":{"styles":["solid","regular"],"unicode":"f249","label":"Sticky Note"},"stop":{"styles":["solid"],"unicode":"f04d","label":"stop"},"stop-circle":{"styles":["solid","regular"],"unicode":"f28d","label":"Stop Circle"},"stopwatch":{"styles":["solid"],"unicode":"f2f2","label":"Stopwatch"},"stopwatch-20":{"styles":["solid"],"unicode":"e06f","label":"Stopwatch 20"},"store":{"styles":["solid"],"unicode":"f54e","label":"Store"},"store-alt":{"styles":["solid"],"unicode":"f54f","label":"Alternate Store"},"store-alt-slash":{"styles":["solid"],"unicode":"e070","label":"Alternate Store Slash"},"store-slash":{"styles":["solid"],"unicode":"e071","label":"Store Slash"},"strava":{"styles":["brands"],"unicode":"f428","label":"Strava"},"stream":{"styles":["solid"],"unicode":"f550","label":"Stream"},"street-view":{"styles":["solid"],"unicode":"f21d","label":"Street View"},"strikethrough":{"styles":["solid"],"unicode":"f0cc","label":"Strikethrough"},"stripe":{"styles":["brands"],"unicode":"f429","label":"Stripe"},"stripe-s":{"styles":["brands"],"unicode":"f42a","label":"Stripe S"},"stroopwafel":{"styles":["solid"],"unicode":"f551","label":"Stroopwafel"},"studiovinari":{"styles":["brands"],"unicode":"f3f8","label":"Studio Vinari"},"stumbleupon":{"styles":["brands"],"unicode":"f1a4","label":"StumbleUpon Logo"},"stumbleupon-circle":{"styles":["brands"],"unicode":"f1a3","label":"StumbleUpon Circle"},"subscript":{"styles":["solid"],"unicode":"f12c","label":"subscript"},"subway":{"styles":["solid"],"unicode":"f239","label":"Subway"},"suitcase":{"styles":["solid"],"unicode":"f0f2","label":"Suitcase"},"suitcase-rolling":{"styles":["solid"],"unicode":"f5c1","label":"Suitcase Rolling"},"sun":{"styles":["solid","regular"],"unicode":"f185","label":"Sun"},"superpowers":{"styles":["brands"],"unicode":"f2dd","label":"Superpowers"},"superscript":{"styles":["solid"],"unicode":"f12b","label":"superscript"},"supple":{"styles":["brands"],"unicode":"f3f9","label":"Supple"},"surprise":{"styles":["solid","regular"],"unicode":"f5c2","label":"Hushed Face"},"suse":{"styles":["brands"],"unicode":"f7d6","label":"Suse"},"swatchbook":{"styles":["solid"],"unicode":"f5c3","label":"Swatchbook"},"swift":{"styles":["brands"],"unicode":"f8e1","label":"Swift"},"swimmer":{"styles":["solid"],"unicode":"f5c4","label":"Swimmer"},"swimming-pool":{"styles":["solid"],"unicode":"f5c5","label":"Swimming Pool"},"symfony":{"styles":["brands"],"unicode":"f83d","label":"Symfony"},"synagogue":{"styles":["solid"],"unicode":"f69b","label":"Synagogue"},"sync":{"styles":["solid"],"unicode":"f021","label":"Sync"},"sync-alt":{"styles":["solid"],"unicode":"f2f1","label":"Alternate Sync"},"syringe":{"styles":["solid"],"unicode":"f48e","label":"Syringe"},"table":{"styles":["solid"],"unicode":"f0ce","label":"table"},"table-tennis":{"styles":["solid"],"unicode":"f45d","label":"Table Tennis"},"tablet":{"styles":["solid"],"unicode":"f10a","label":"tablet"},"tablet-alt":{"styles":["solid"],"unicode":"f3fa","label":"Alternate Tablet"},"tablets":{"styles":["solid"],"unicode":"f490","label":"Tablets"},"tachometer-alt":{"styles":["solid"],"unicode":"f3fd","label":"Alternate Tachometer"},"tag":{"styles":["solid"],"unicode":"f02b","label":"tag"},"tags":{"styles":["solid"],"unicode":"f02c","label":"tags"},"tape":{"styles":["solid"],"unicode":"f4db","label":"Tape"},"tasks":{"styles":["solid"],"unicode":"f0ae","label":"Tasks"},"taxi":{"styles":["solid"],"unicode":"f1ba","label":"Taxi"},"teamspeak":{"styles":["brands"],"unicode":"f4f9","label":"TeamSpeak"},"teeth":{"styles":["solid"],"unicode":"f62e","label":"Teeth"},"teeth-open":{"styles":["solid"],"unicode":"f62f","label":"Teeth Open"},"telegram":{"styles":["brands"],"unicode":"f2c6","label":"Telegram"},"telegram-plane":{"styles":["brands"],"unicode":"f3fe","label":"Telegram Plane"},"temperature-high":{"styles":["solid"],"unicode":"f769","label":"High Temperature"},"temperature-low":{"styles":["solid"],"unicode":"f76b","label":"Low Temperature"},"tencent-weibo":{"styles":["brands"],"unicode":"f1d5","label":"Tencent Weibo"},"tenge":{"styles":["solid"],"unicode":"f7d7","label":"Tenge"},"terminal":{"styles":["solid"],"unicode":"f120","label":"Terminal"},"text-height":{"styles":["solid"],"unicode":"f034","label":"text-height"},"text-width":{"styles":["solid"],"unicode":"f035","label":"Text Width"},"th":{"styles":["solid"],"unicode":"f00a","label":"th"},"th-large":{"styles":["solid"],"unicode":"f009","label":"th-large"},"th-list":{"styles":["solid"],"unicode":"f00b","label":"th-list"},"the-red-yeti":{"styles":["brands"],"unicode":"f69d","label":"The Red Yeti"},"theater-masks":{"styles":["solid"],"unicode":"f630","label":"Theater Masks"},"themeco":{"styles":["brands"],"unicode":"f5c6","label":"Themeco"},"themeisle":{"styles":["brands"],"unicode":"f2b2","label":"ThemeIsle"},"thermometer":{"styles":["solid"],"unicode":"f491","label":"Thermometer"},"thermometer-empty":{"styles":["solid"],"unicode":"f2cb","label":"Thermometer Empty"},"thermometer-full":{"styles":["solid"],"unicode":"f2c7","label":"Thermometer Full"},"thermometer-half":{"styles":["solid"],"unicode":"f2c9","label":"Thermometer 1/2 Full"},"thermometer-quarter":{"styles":["solid"],"unicode":"f2ca","label":"Thermometer 1/4 Full"},"thermometer-three-quarters":{"styles":["solid"],"unicode":"f2c8","label":"Thermometer 3/4 Full"},"think-peaks":{"styles":["brands"],"unicode":"f731","label":"Think Peaks"},"thumbs-down":{"styles":["solid","regular"],"unicode":"f165","label":"thumbs-down"},"thumbs-up":{"styles":["solid","regular"],"unicode":"f164","label":"thumbs-up"},"thumbtack":{"styles":["solid"],"unicode":"f08d","label":"Thumbtack"},"ticket-alt":{"styles":["solid"],"unicode":"f3ff","label":"Alternate Ticket"},"tiktok":{"styles":["brands"],"unicode":"e07b","label":"TikTok"},"times":{"styles":["solid"],"unicode":"f00d","label":"Times"},"times-circle":{"styles":["solid","regular"],"unicode":"f057","label":"Times Circle"},"tint":{"styles":["solid"],"unicode":"f043","label":"tint"},"tint-slash":{"styles":["solid"],"unicode":"f5c7","label":"Tint Slash"},"tired":{"styles":["solid","regular"],"unicode":"f5c8","label":"Tired Face"},"toggle-off":{"styles":["solid"],"unicode":"f204","label":"Toggle Off"},"toggle-on":{"styles":["solid"],"unicode":"f205","label":"Toggle On"},"toilet":{"styles":["solid"],"unicode":"f7d8","label":"Toilet"},"toilet-paper":{"styles":["solid"],"unicode":"f71e","label":"Toilet Paper"},"toilet-paper-slash":{"styles":["solid"],"unicode":"e072","label":"Toilet Paper Slash"},"toolbox":{"styles":["solid"],"unicode":"f552","label":"Toolbox"},"tools":{"styles":["solid"],"unicode":"f7d9","label":"Tools"},"tooth":{"styles":["solid"],"unicode":"f5c9","label":"Tooth"},"torah":{"styles":["solid"],"unicode":"f6a0","label":"Torah"},"torii-gate":{"styles":["solid"],"unicode":"f6a1","label":"Torii Gate"},"tractor":{"styles":["solid"],"unicode":"f722","label":"Tractor"},"trade-federation":{"styles":["brands"],"unicode":"f513","label":"Trade Federation"},"trademark":{"styles":["solid"],"unicode":"f25c","label":"Trademark"},"traffic-light":{"styles":["solid"],"unicode":"f637","label":"Traffic Light"},"trailer":{"styles":["solid"],"unicode":"e041","label":"Trailer"},"train":{"styles":["solid"],"unicode":"f238","label":"Train"},"tram":{"styles":["solid"],"unicode":"f7da","label":"Tram"},"transgender":{"styles":["solid"],"unicode":"f224","label":"Transgender"},"transgender-alt":{"styles":["solid"],"unicode":"f225","label":"Alternate Transgender"},"trash":{"styles":["solid"],"unicode":"f1f8","label":"Trash"},"trash-alt":{"styles":["solid","regular"],"unicode":"f2ed","label":"Alternate Trash"},"trash-restore":{"styles":["solid"],"unicode":"f829","label":"Trash Restore"},"trash-restore-alt":{"styles":["solid"],"unicode":"f82a","label":"Alternative Trash Restore"},"tree":{"styles":["solid"],"unicode":"f1bb","label":"Tree"},"trello":{"styles":["brands"],"unicode":"f181","label":"Trello"},"trophy":{"styles":["solid"],"unicode":"f091","label":"trophy"},"truck":{"styles":["solid"],"unicode":"f0d1","label":"truck"},"truck-loading":{"styles":["solid"],"unicode":"f4de","label":"Truck Loading"},"truck-monster":{"styles":["solid"],"unicode":"f63b","label":"Truck Monster"},"truck-moving":{"styles":["solid"],"unicode":"f4df","label":"Truck Moving"},"truck-pickup":{"styles":["solid"],"unicode":"f63c","label":"Truck Side"},"tshirt":{"styles":["solid"],"unicode":"f553","label":"T-Shirt"},"tty":{"styles":["solid"],"unicode":"f1e4","label":"TTY"},"tumblr":{"styles":["brands"],"unicode":"f173","label":"Tumblr"},"tumblr-square":{"styles":["brands"],"unicode":"f174","label":"Tumblr Square"},"tv":{"styles":["solid"],"unicode":"f26c","label":"Television"},"twitch":{"styles":["brands"],"unicode":"f1e8","label":"Twitch"},"twitter":{"styles":["brands"],"unicode":"f099","label":"Twitter"},"twitter-square":{"styles":["brands"],"unicode":"f081","label":"Twitter Square"},"typo3":{"styles":["brands"],"unicode":"f42b","label":"Typo3"},"uber":{"styles":["brands"],"unicode":"f402","label":"Uber"},"ubuntu":{"styles":["brands"],"unicode":"f7df","label":"Ubuntu"},"uikit":{"styles":["brands"],"unicode":"f403","label":"UIkit"},"umbraco":{"styles":["brands"],"unicode":"f8e8","label":"Umbraco"},"umbrella":{"styles":["solid"],"unicode":"f0e9","label":"Umbrella"},"umbrella-beach":{"styles":["solid"],"unicode":"f5ca","label":"Umbrella Beach"},"uncharted":{"styles":["brands"],"unicode":"e084","label":"Uncharted Software"},"underline":{"styles":["solid"],"unicode":"f0cd","label":"Underline"},"undo":{"styles":["solid"],"unicode":"f0e2","label":"Undo"},"undo-alt":{"styles":["solid"],"unicode":"f2ea","label":"Alternate Undo"},"uniregistry":{"styles":["brands"],"unicode":"f404","label":"Uniregistry"},"unity":{"styles":["brands"],"unicode":"e049","label":"Unity 3D"},"universal-access":{"styles":["solid"],"unicode":"f29a","label":"Universal Access"},"university":{"styles":["solid"],"unicode":"f19c","label":"University"},"unlink":{"styles":["solid"],"unicode":"f127","label":"unlink"},"unlock":{"styles":["solid"],"unicode":"f09c","label":"unlock"},"unlock-alt":{"styles":["solid"],"unicode":"f13e","label":"Alternate Unlock"},"unsplash":{"styles":["brands"],"unicode":"e07c","label":"Unsplash"},"untappd":{"styles":["brands"],"unicode":"f405","label":"Untappd"},"upload":{"styles":["solid"],"unicode":"f093","label":"Upload"},"ups":{"styles":["brands"],"unicode":"f7e0","label":"UPS"},"usb":{"styles":["brands"],"unicode":"f287","label":"USB"},"user":{"styles":["solid","regular"],"unicode":"f007","label":"User"},"user-alt":{"styles":["solid"],"unicode":"f406","label":"Alternate User"},"user-alt-slash":{"styles":["solid"],"unicode":"f4fa","label":"Alternate User Slash"},"user-astronaut":{"styles":["solid"],"unicode":"f4fb","label":"User Astronaut"},"user-check":{"styles":["solid"],"unicode":"f4fc","label":"User Check"},"user-circle":{"styles":["solid","regular"],"unicode":"f2bd","label":"User Circle"},"user-clock":{"styles":["solid"],"unicode":"f4fd","label":"User Clock"},"user-cog":{"styles":["solid"],"unicode":"f4fe","label":"User Cog"},"user-edit":{"styles":["solid"],"unicode":"f4ff","label":"User Edit"},"user-friends":{"styles":["solid"],"unicode":"f500","label":"User Friends"},"user-graduate":{"styles":["solid"],"unicode":"f501","label":"User Graduate"},"user-injured":{"styles":["solid"],"unicode":"f728","label":"User Injured"},"user-lock":{"styles":["solid"],"unicode":"f502","label":"User Lock"},"user-md":{"styles":["solid"],"unicode":"f0f0","label":"Doctor"},"user-minus":{"styles":["solid"],"unicode":"f503","label":"User Minus"},"user-ninja":{"styles":["solid"],"unicode":"f504","label":"User Ninja"},"user-nurse":{"styles":["solid"],"unicode":"f82f","label":"Nurse"},"user-plus":{"styles":["solid"],"unicode":"f234","label":"User Plus"},"user-secret":{"styles":["solid"],"unicode":"f21b","label":"User Secret"},"user-shield":{"styles":["solid"],"unicode":"f505","label":"User Shield"},"user-slash":{"styles":["solid"],"unicode":"f506","label":"User Slash"},"user-tag":{"styles":["solid"],"unicode":"f507","label":"User Tag"},"user-tie":{"styles":["solid"],"unicode":"f508","label":"User Tie"},"user-times":{"styles":["solid"],"unicode":"f235","label":"Remove User"},"users":{"styles":["solid"],"unicode":"f0c0","label":"Users"},"users-cog":{"styles":["solid"],"unicode":"f509","label":"Users Cog"},"users-slash":{"styles":["solid"],"unicode":"e073","label":"Users Slash"},"usps":{"styles":["brands"],"unicode":"f7e1","label":"United States Postal Service"},"ussunnah":{"styles":["brands"],"unicode":"f407","label":"us-Sunnah Foundation"},"utensil-spoon":{"styles":["solid"],"unicode":"f2e5","label":"Utensil Spoon"},"utensils":{"styles":["solid"],"unicode":"f2e7","label":"Utensils"},"vaadin":{"styles":["brands"],"unicode":"f408","label":"Vaadin"},"vector-square":{"styles":["solid"],"unicode":"f5cb","label":"Vector Square"},"venus":{"styles":["solid"],"unicode":"f221","label":"Venus"},"venus-double":{"styles":["solid"],"unicode":"f226","label":"Venus Double"},"venus-mars":{"styles":["solid"],"unicode":"f228","label":"Venus Mars"},"vest":{"styles":["solid"],"unicode":"e085","label":"vest"},"vest-patches":{"styles":["solid"],"unicode":"e086","label":"vest-patches"},"viacoin":{"styles":["brands"],"unicode":"f237","label":"Viacoin"},"viadeo":{"styles":["brands"],"unicode":"f2a9","label":"Viadeo"},"viadeo-square":{"styles":["brands"],"unicode":"f2aa","label":"Viadeo Square"},"vial":{"styles":["solid"],"unicode":"f492","label":"Vial"},"vials":{"styles":["solid"],"unicode":"f493","label":"Vials"},"viber":{"styles":["brands"],"unicode":"f409","label":"Viber"},"video":{"styles":["solid"],"unicode":"f03d","label":"Video"},"video-slash":{"styles":["solid"],"unicode":"f4e2","label":"Video Slash"},"vihara":{"styles":["solid"],"unicode":"f6a7","label":"Vihara"},"vimeo":{"styles":["brands"],"unicode":"f40a","label":"Vimeo"},"vimeo-square":{"styles":["brands"],"unicode":"f194","label":"Vimeo Square"},"vimeo-v":{"styles":["brands"],"unicode":"f27d","label":"Vimeo"},"vine":{"styles":["brands"],"unicode":"f1ca","label":"Vine"},"virus":{"styles":["solid"],"unicode":"e074","label":"Virus"},"virus-slash":{"styles":["solid"],"unicode":"e075","label":"Virus Slash"},"viruses":{"styles":["solid"],"unicode":"e076","label":"Viruses"},"vk":{"styles":["brands"],"unicode":"f189","label":"VK"},"vnv":{"styles":["brands"],"unicode":"f40b","label":"VNV"},"voicemail":{"styles":["solid"],"unicode":"f897","label":"Voicemail"},"volleyball-ball":{"styles":["solid"],"unicode":"f45f","label":"Volleyball Ball"},"volume-down":{"styles":["solid"],"unicode":"f027","label":"Volume Down"},"volume-mute":{"styles":["solid"],"unicode":"f6a9","label":"Volume Mute"},"volume-off":{"styles":["solid"],"unicode":"f026","label":"Volume Off"},"volume-up":{"styles":["solid"],"unicode":"f028","label":"Volume Up"},"vote-yea":{"styles":["solid"],"unicode":"f772","label":"Vote Yea"},"vr-cardboard":{"styles":["solid"],"unicode":"f729","label":"Cardboard VR"},"vuejs":{"styles":["brands"],"unicode":"f41f","label":"Vue.js"},"walking":{"styles":["solid"],"unicode":"f554","label":"Walking"},"wallet":{"styles":["solid"],"unicode":"f555","label":"Wallet"},"warehouse":{"styles":["solid"],"unicode":"f494","label":"Warehouse"},"watchman-monitoring":{"styles":["brands"],"unicode":"e087","label":"Watchman Monitoring"},"water":{"styles":["solid"],"unicode":"f773","label":"Water"},"wave-square":{"styles":["solid"],"unicode":"f83e","label":"Square Wave"},"waze":{"styles":["brands"],"unicode":"f83f","label":"Waze"},"weebly":{"styles":["brands"],"unicode":"f5cc","label":"Weebly"},"weibo":{"styles":["brands"],"unicode":"f18a","label":"Weibo"},"weight":{"styles":["solid"],"unicode":"f496","label":"Weight"},"weight-hanging":{"styles":["solid"],"unicode":"f5cd","label":"Hanging Weight"},"weixin":{"styles":["brands"],"unicode":"f1d7","label":"Weixin (WeChat)"},"whatsapp":{"styles":["brands"],"unicode":"f232","label":"What\'s App"},"whatsapp-square":{"styles":["brands"],"unicode":"f40c","label":"What\'s App Square"},"wheelchair":{"styles":["solid"],"unicode":"f193","label":"Wheelchair"},"whmcs":{"styles":["brands"],"unicode":"f40d","label":"WHMCS"},"wifi":{"styles":["solid"],"unicode":"f1eb","label":"WiFi"},"wikipedia-w":{"styles":["brands"],"unicode":"f266","label":"Wikipedia W"},"wind":{"styles":["solid"],"unicode":"f72e","label":"Wind"},"window-close":{"styles":["solid","regular"],"unicode":"f410","label":"Window Close"},"window-maximize":{"styles":["solid","regular"],"unicode":"f2d0","label":"Window Maximize"},"window-minimize":{"styles":["solid","regular"],"unicode":"f2d1","label":"Window Minimize"},"window-restore":{"styles":["solid","regular"],"unicode":"f2d2","label":"Window Restore"},"windows":{"styles":["brands"],"unicode":"f17a","label":"Windows"},"wine-bottle":{"styles":["solid"],"unicode":"f72f","label":"Wine Bottle"},"wine-glass":{"styles":["solid"],"unicode":"f4e3","label":"Wine Glass"},"wine-glass-alt":{"styles":["solid"],"unicode":"f5ce","label":"Alternate Wine Glas"},"wix":{"styles":["brands"],"unicode":"f5cf","label":"Wix"},"wizards-of-the-coast":{"styles":["brands"],"unicode":"f730","label":"Wizards of the Coast"},"wodu":{"styles":["brands"],"unicode":"e088","label":"Wodu"},"wolf-pack-battalion":{"styles":["brands"],"unicode":"f514","label":"Wolf Pack Battalion"},"won-sign":{"styles":["solid"],"unicode":"f159","label":"Won Sign"},"wordpress":{"styles":["brands"],"unicode":"f19a","label":"WordPress Logo"},"wordpress-simple":{"styles":["brands"],"unicode":"f411","label":"Wordpress Simple"},"wpbeginner":{"styles":["brands"],"unicode":"f297","label":"WPBeginner"},"wpexplorer":{"styles":["brands"],"unicode":"f2de","label":"WPExplorer"},"wpforms":{"styles":["brands"],"unicode":"f298","label":"WPForms"},"wpressr":{"styles":["brands"],"unicode":"f3e4","label":"wpressr"},"wrench":{"styles":["solid"],"unicode":"f0ad","label":"Wrench"},"x-ray":{"styles":["solid"],"unicode":"f497","label":"X-Ray"},"xbox":{"styles":["brands"],"unicode":"f412","label":"Xbox"},"xing":{"styles":["brands"],"unicode":"f168","label":"Xing"},"xing-square":{"styles":["brands"],"unicode":"f169","label":"Xing Square"},"y-combinator":{"styles":["brands"],"unicode":"f23b","label":"Y Combinator"},"yahoo":{"styles":["brands"],"unicode":"f19e","label":"Yahoo Logo"},"yammer":{"styles":["brands"],"unicode":"f840","label":"Yammer"},"yandex":{"styles":["brands"],"unicode":"f413","label":"Yandex"},"yandex-international":{"styles":["brands"],"unicode":"f414","label":"Yandex International"},"yarn":{"styles":["brands"],"unicode":"f7e3","label":"Yarn"},"yelp":{"styles":["brands"],"unicode":"f1e9","label":"Yelp"},"yen-sign":{"styles":["solid"],"unicode":"f157","label":"Yen Sign"},"yin-yang":{"styles":["solid"],"unicode":"f6ad","label":"Yin Yang"},"yoast":{"styles":["brands"],"unicode":"f2b1","label":"Yoast"},"youtube":{"styles":["brands"],"unicode":"f167","label":"YouTube"},"youtube-square":{"styles":["brands"],"unicode":"f431","label":"YouTube Square"},"zhihu":{"styles":["brands"],"unicode":"f63f","label":"Zhihu"}}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"index": 0,
/******/ 			"./style-index": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunkcfb_block"] = globalThis["webpackChunkcfb_block"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-index"], () => (__webpack_require__("./src/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map