/*  Prototype JavaScript framework, version 1.6.0.3
 *  (c) 2005-2008 Sam Stephenson
 *
 *  Prototype is freely distributable under the terms of an MIT-style license.
 *  For details, see the Prototype web site: http://www.prototypejs.org/
 *
 *--------------------------------------------------------------------------*/

var Prototype = {
  Version: '1.6.0.3',

  Browser: {
    IE:     !!(window.attachEvent &&
      navigator.userAgent.indexOf('Opera') === -1),
    Opera:  navigator.userAgent.indexOf('Opera') > -1,
    WebKit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
    Gecko:  navigator.userAgent.indexOf('Gecko') > -1 &&
      navigator.userAgent.indexOf('KHTML') === -1,
    MobileSafari: !!navigator.userAgent.match(/Apple.*Mobile.*Safari/)
  },

  BrowserFeatures: {
    XPath: !!document.evaluate,
    SelectorsAPI: !!document.querySelector,
    ElementExtensions: !!window.HTMLElement,
    SpecificElementExtensions:
      document.createElement('div')['__proto__'] &&
      document.createElement('div')['__proto__'] !==
        document.createElement('form')['__proto__']
  },

  ScriptFragment: '<script[^>]*>([\\S\\s]*?)<\/script>',
  JSONFilter: /^\/\*-secure-([\s\S]*)\*\/\s*$/,

  emptyFunction: function() { },
  K: function(x) { return x }
};

if (Prototype.Browser.MobileSafari)
  Prototype.BrowserFeatures.SpecificElementExtensions = false;


/* Based on Alex Arnell's inheritance implementation. */
var Class = {
  create: function() {
    var parent = null, properties = $A(arguments);
    if (Object.isFunction(properties[0]))
      parent = properties.shift();

    function klass() {
      this.initialize.apply(this, arguments);
    }

    Object.extend(klass, Class.Methods);
    klass.superclass = parent;
    klass.subclasses = [];

    if (parent) {
      var subclass = function() { };
      subclass.prototype = parent.prototype;
      klass.prototype = new subclass;
      parent.subclasses.push(klass);
    }

    for (var i = 0; i < properties.length; i++)
      klass.addMethods(properties[i]);

    if (!klass.prototype.initialize)
      klass.prototype.initialize = Prototype.emptyFunction;

    klass.prototype.constructor = klass;

    return klass;
  }
};

Class.Methods = {
  addMethods: function(source) {
    var ancestor   = this.superclass && this.superclass.prototype;
    var properties = Object.keys(source);

    if (!Object.keys({ toString: true }).length)
      properties.push("toString", "valueOf");

    for (var i = 0, length = properties.length; i < length; i++) {
      var property = properties[i], value = source[property];
      if (ancestor && Object.isFunction(value) &&
          value.argumentNames().first() == "$super") {
        var method = value;
        value = (function(m) {
          return function() { return ancestor[m].apply(this, arguments) };
        })(property).wrap(method);

        value.valueOf = method.valueOf.bind(method);
        value.toString = method.toString.bind(method);
      }
      this.prototype[property] = value;
    }

    return this;
  }
};

var Abstract = { };

Object.extend = function(destination, source) {
  for (var property in source)
    destination[property] = source[property];
  return destination;
};

Object.extend(Object, {
  inspect: function(object) {
    try {
      if (Object.isUndefined(object)) return 'undefined';
      if (object === null) return 'null';
      return object.inspect ? object.inspect() : String(object);
    } catch (e) {
      if (e instanceof RangeError) return '...';
      throw e;
    }
  },

  toJSON: function(object) {
    var type = typeof object;
    switch (type) {
      case 'undefined':
      case 'function':
      case 'unknown': return;
      case 'boolean': return object.toString();
    }

    if (object === null) return 'null';
    if (object.toJSON) return object.toJSON();
    if (Object.isElement(object)) return;

    var results = [];
    for (var property in object) {
      var value = Object.toJSON(object[property]);
      if (!Object.isUndefined(value))
        results.push(property.toJSON() + ': ' + value);
    }

    return '{' + results.join(', ') + '}';
  },

  toQueryString: function(object) {
    return $H(object).toQueryString();
  },

  toHTML: function(object) {
    return object && object.toHTML ? object.toHTML() : String.interpret(object);
  },

  keys: function(object) {
    var keys = [];
    for (var property in object)
      keys.push(property);
    return keys;
  },

  values: function(object) {
    var values = [];
    for (var property in object)
      values.push(object[property]);
    return values;
  },

  clone: function(object) {
    return Object.extend({ }, object);
  },

  isElement: function(object) {
    return !!(object && object.nodeType == 1);
  },

  isArray: function(object) {
    return object != null && typeof object == "object" &&
      'splice' in object && 'join' in object;
  },

  isHash: function(object) {
    return object instanceof Hash;
  },

  isFunction: function(object) {
    return typeof object == "function";
  },

  isString: function(object) {
    return typeof object == "string";
  },

  isNumber: function(object) {
    return typeof object == "number";
  },

  isUndefined: function(object) {
    return typeof object == "undefined";
  }
});

Object.extend(Function.prototype, {
  argumentNames: function() {
    var names = this.toString().match(/^[\s\(]*function[^(]*\(([^\)]*)\)/)[1]
      .replace(/\s+/g, '').split(',');
    return names.length == 1 && !names[0] ? [] : names;
  },

  bind: function() {
    if (arguments.length < 2 && Object.isUndefined(arguments[0])) return this;
    var __method = this, args = $A(arguments), object = args.shift();
    return function() {
      return __method.apply(object, args.concat($A(arguments)));
    }
  },

  bindAsEventListener: function() {
    var __method = this, args = $A(arguments), object = args.shift();
    return function(event) {
      return __method.apply(object, [event || window.event].concat(args));
    }
  },

  curry: function() {
    if (!arguments.length) return this;
    var __method = this, args = $A(arguments);
    return function() {
      return __method.apply(this, args.concat($A(arguments)));
    }
  },

  delay: function() {
    var __method = this, args = $A(arguments), timeout = args.shift() * 1000;
    return window.setTimeout(function() {
      return __method.apply(__method, args);
    }, timeout);
  },

  defer: function() {
    var args = [0.01].concat($A(arguments));
    return this.delay.apply(this, args);
  },

  wrap: function(wrapper) {
    var __method = this;
    return function() {
      return wrapper.apply(this, [__method.bind(this)].concat($A(arguments)));
    }
  },

  methodize: function() {
    if (this._methodized) return this._methodized;
    var __method = this;
    return this._methodized = function() {
      return __method.apply(null, [this].concat($A(arguments)));
    };
  }
});

Date.prototype.toJSON = function() {
  return '"' + this.getUTCFullYear() + '-' +
    (this.getUTCMonth() + 1).toPaddedString(2) + '-' +
    this.getUTCDate().toPaddedString(2) + 'T' +
    this.getUTCHours().toPaddedString(2) + ':' +
    this.getUTCMinutes().toPaddedString(2) + ':' +
    this.getUTCSeconds().toPaddedString(2) + 'Z"';
};

var Try = {
  these: function() {
    var returnValue;

    for (var i = 0, length = arguments.length; i < length; i++) {
      var lambda = arguments[i];
      try {
        returnValue = lambda();
        break;
      } catch (e) { }
    }

    return returnValue;
  }
};

RegExp.prototype.match = RegExp.prototype.test;

RegExp.escape = function(str) {
  return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
};

/*--------------------------------------------------------------------------*/

var PeriodicalExecuter = Class.create({
  initialize: function(callback, frequency) {
    this.callback = callback;
    this.frequency = frequency;
    this.currentlyExecuting = false;

    this.registerCallback();
  },

  registerCallback: function() {
    this.timer = setInterval(this.onTimerEvent.bind(this), this.frequency * 1000);
  },

  execute: function() {
    this.callback(this);
  },

  stop: function() {
    if (!this.timer) return;
    clearInterval(this.timer);
    this.timer = null;
  },

  onTimerEvent: function() {
    if (!this.currentlyExecuting) {
      try {
        this.currentlyExecuting = true;
        this.execute();
      } finally {
        this.currentlyExecuting = false;
      }
    }
  }
});
Object.extend(String, {
  interpret: function(value) {
    return value == null ? '' : String(value);
  },
  specialChar: {
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    '\\': '\\\\'
  }
});

Object.extend(String.prototype, {
  gsub: function(pattern, replacement) {
    var result = '', source = this, match;
    replacement = arguments.callee.prepareReplacement(replacement);

    while (source.length > 0) {
      if (match = source.match(pattern)) {
        result += source.slice(0, match.index);
        result += String.interpret(replacement(match));
        source  = source.slice(match.index + match[0].length);
      } else {
        result += source, source = '';
      }
    }
    return result;
  },

  sub: function(pattern, replacement, count) {
    replacement = this.gsub.prepareReplacement(replacement);
    count = Object.isUndefined(count) ? 1 : count;

    return this.gsub(pattern, function(match) {
      if (--count < 0) return match[0];
      return replacement(match);
    });
  },

  scan: function(pattern, iterator) {
    this.gsub(pattern, iterator);
    return String(this);
  },

  truncate: function(length, truncation) {
    length = length || 30;
    truncation = Object.isUndefined(truncation) ? '...' : truncation;
    return this.length > length ?
      this.slice(0, length - truncation.length) + truncation : String(this);
  },

  strip: function() {
    return this.replace(/^\s+/, '').replace(/\s+$/, '');
  },

  stripTags: function() {
    return this.replace(/<\/?[^>]+>/gi, '');
  },

  stripScripts: function() {
    return this.replace(new RegExp(Prototype.ScriptFragment, 'img'), '');
  },

  extractScripts: function() {
    var matchAll = new RegExp(Prototype.ScriptFragment, 'img');
    var matchOne = new RegExp(Prototype.ScriptFragment, 'im');
    return (this.match(matchAll) || []).map(function(scriptTag) {
      return (scriptTag.match(matchOne) || ['', ''])[1];
    });
  },

  evalScripts: function() {
    return this.extractScripts().map(function(script) { return eval(script) });
  },

  escapeHTML: function() {
    var self = arguments.callee;
    self.text.data = this;
    return self.div.innerHTML;
  },

  unescapeHTML: function() {
    var div = new Element('div');
    div.innerHTML = this.stripTags();
    return div.childNodes[0] ? (div.childNodes.length > 1 ?
      $A(div.childNodes).inject('', function(memo, node) { return memo+node.nodeValue }) :
      div.childNodes[0].nodeValue) : '';
  },

  toQueryParams: function(separator) {
    var match = this.strip().match(/([^?#]*)(#.*)?$/);
    if (!match) return { };

    return match[1].split(separator || '&').inject({ }, function(hash, pair) {
      if ((pair = pair.split('='))[0]) {
        var key = decodeURIComponent(pair.shift());
        var value = pair.length > 1 ? pair.join('=') : pair[0];
        if (value != undefined) value = decodeURIComponent(value);

        if (key in hash) {
          if (!Object.isArray(hash[key])) hash[key] = [hash[key]];
          hash[key].push(value);
        }
        else hash[key] = value;
      }
      return hash;
    });
  },

  toArray: function() {
    return this.split('');
  },

  succ: function() {
    return this.slice(0, this.length - 1) +
      String.fromCharCode(this.charCodeAt(this.length - 1) + 1);
  },

  times: function(count) {
    return count < 1 ? '' : new Array(count + 1).join(this);
  },

  camelize: function() {
    var parts = this.split('-'), len = parts.length;
    if (len == 1) return parts[0];

    var camelized = this.charAt(0) == '-'
      ? parts[0].charAt(0).toUpperCase() + parts[0].substring(1)
      : parts[0];

    for (var i = 1; i < len; i++)
      camelized += parts[i].charAt(0).toUpperCase() + parts[i].substring(1);

    return camelized;
  },

  capitalize: function() {
    return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
  },

  underscore: function() {
    return this.gsub(/::/, '/').gsub(/([A-Z]+)([A-Z][a-z])/,'#{1}_#{2}').gsub(/([a-z\d])([A-Z])/,'#{1}_#{2}').gsub(/-/,'_').toLowerCase();
  },

  dasherize: function() {
    return this.gsub(/_/,'-');
  },

  inspect: function(useDoubleQuotes) {
    var escapedString = this.gsub(/[\x00-\x1f\\]/, function(match) {
      var character = String.specialChar[match[0]];
      return character ? character : '\\u00' + match[0].charCodeAt().toPaddedString(2, 16);
    });
    if (useDoubleQuotes) return '"' + escapedString.replace(/"/g, '\\"') + '"';
    return "'" + escapedString.replace(/'/g, '\\\'') + "'";
  },

  toJSON: function() {
    return this.inspect(true);
  },

  unfilterJSON: function(filter) {
    return this.sub(filter || Prototype.JSONFilter, '#{1}');
  },

  isJSON: function() {
    var str = this;
    if (str.blank()) return false;
    str = this.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, '');
    return (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(str);
  },

  evalJSON: function(sanitize) {
    var json = this.unfilterJSON();
    try {
      if (!sanitize || json.isJSON()) return eval('(' + json + ')');
    } catch (e) { }
    throw new SyntaxError('Badly formed JSON string: ' + this.inspect());
  },

  include: function(pattern) {
    return this.indexOf(pattern) > -1;
  },

  startsWith: function(pattern) {
    return this.indexOf(pattern) === 0;
  },

  endsWith: function(pattern) {
    var d = this.length - pattern.length;
    return d >= 0 && this.lastIndexOf(pattern) === d;
  },

  empty: function() {
    return this == '';
  },

  blank: function() {
    return /^\s*$/.test(this);
  },

  interpolate: function(object, pattern) {
    return new Template(this, pattern).evaluate(object);
  }
});

if (Prototype.Browser.WebKit || Prototype.Browser.IE) Object.extend(String.prototype, {
  escapeHTML: function() {
    return this.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  },
  unescapeHTML: function() {
    return this.stripTags().replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
  }
});

String.prototype.gsub.prepareReplacement = function(replacement) {
  if (Object.isFunction(replacement)) return replacement;
  var template = new Template(replacement);
  return function(match) { return template.evaluate(match) };
};

String.prototype.parseQuery = String.prototype.toQueryParams;

Object.extend(String.prototype.escapeHTML, {
  div:  document.createElement('div'),
  text: document.createTextNode('')
});

String.prototype.escapeHTML.div.appendChild(String.prototype.escapeHTML.text);

var Template = Class.create({
  initialize: function(template, pattern) {
    this.template = template.toString();
    this.pattern = pattern || Template.Pattern;
  },

  evaluate: function(object) {
    if (Object.isFunction(object.toTemplateReplacements))
      object = object.toTemplateReplacements();

    return this.template.gsub(this.pattern, function(match) {
      if (object == null) return '';

      var before = match[1] || '';
      if (before == '\\') return match[2];

      var ctx = object, expr = match[3];
      var pattern = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;
      match = pattern.exec(expr);
      if (match == null) return before;

      while (match != null) {
        var comp = match[1].startsWith('[') ? match[2].gsub('\\\\]', ']') : match[1];
        ctx = ctx[comp];
        if (null == ctx || '' == match[3]) break;
        expr = expr.substring('[' == match[3] ? match[1].length : match[0].length);
        match = pattern.exec(expr);
      }

      return before + String.interpret(ctx);
    });
  }
});
Template.Pattern = /(^|.|\r|\n)(#\{(.*?)\})/;

var $break = { };

var Enumerable = {
  each: function(iterator, context) {
    var index = 0;
    try {
      this._each(function(value) {
        iterator.call(context, value, index++);
      });
    } catch (e) {
      if (e != $break) throw e;
    }
    return this;
  },

  eachSlice: function(number, iterator, context) {
    var index = -number, slices = [], array = this.toArray();
    if (number < 1) return array;
    while ((index += number) < array.length)
      slices.push(array.slice(index, index+number));
    return slices.collect(iterator, context);
  },

  all: function(iterator, context) {
    iterator = iterator || Prototype.K;
    var result = true;
    this.each(function(value, index) {
      result = result && !!iterator.call(context, value, index);
      if (!result) throw $break;
    });
    return result;
  },

  any: function(iterator, context) {
    iterator = iterator || Prototype.K;
    var result = false;
    this.each(function(value, index) {
      if (result = !!iterator.call(context, value, index))
        throw $break;
    });
    return result;
  },

  collect: function(iterator, context) {
    iterator = iterator || Prototype.K;
    var results = [];
    this.each(function(value, index) {
      results.push(iterator.call(context, value, index));
    });
    return results;
  },

  detect: function(iterator, context) {
    var result;
    this.each(function(value, index) {
      if (iterator.call(context, value, index)) {
        result = value;
        throw $break;
      }
    });
    return result;
  },

  findAll: function(iterator, context) {
    var results = [];
    this.each(function(value, index) {
      if (iterator.call(context, value, index))
        results.push(value);
    });
    return results;
  },

  grep: function(filter, iterator, context) {
    iterator = iterator || Prototype.K;
    var results = [];

    if (Object.isString(filter))
      filter = new RegExp(filter);

    this.each(function(value, index) {
      if (filter.match(value))
        results.push(iterator.call(context, value, index));
    });
    return results;
  },

  include: function(object) {
    if (Object.isFunction(this.indexOf))
      if (this.indexOf(object) != -1) return true;

    var found = false;
    this.each(function(value) {
      if (value == object) {
        found = true;
        throw $break;
      }
    });
    return found;
  },

  inGroupsOf: function(number, fillWith) {
    fillWith = Object.isUndefined(fillWith) ? null : fillWith;
    return this.eachSlice(number, function(slice) {
      while(slice.length < number) slice.push(fillWith);
      return slice;
    });
  },

  inject: function(memo, iterator, context) {
    this.each(function(value, index) {
      memo = iterator.call(context, memo, value, index);
    });
    return memo;
  },

  invoke: function(method) {
    var args = $A(arguments).slice(1);
    return this.map(function(value) {
      return value[method].apply(value, args);
    });
  },

  max: function(iterator, context) {
    iterator = iterator || Prototype.K;
    var result;
    this.each(function(value, index) {
      value = iterator.call(context, value, index);
      if (result == null || value >= result)
        result = value;
    });
    return result;
  },

  min: function(iterator, context) {
    iterator = iterator || Prototype.K;
    var result;
    this.each(function(value, index) {
      value = iterator.call(context, value, index);
      if (result == null || value < result)
        result = value;
    });
    return result;
  },

  partition: function(iterator, context) {
    iterator = iterator || Prototype.K;
    var trues = [], falses = [];
    this.each(function(value, index) {
      (iterator.call(context, value, index) ?
        trues : falses).push(value);
    });
    return [trues, falses];
  },

  pluck: function(property) {
    var results = [];
    this.each(function(value) {
      results.push(value[property]);
    });
    return results;
  },

  reject: function(iterator, context) {
    var results = [];
    this.each(function(value, index) {
      if (!iterator.call(context, value, index))
        results.push(value);
    });
    return results;
  },

  sortBy: function(iterator, context) {
    return this.map(function(value, index) {
      return {
        value: value,
        criteria: iterator.call(context, value, index)
      };
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      return a < b ? -1 : a > b ? 1 : 0;
    }).pluck('value');
  },

  toArray: function() {
    return this.map();
  },

  zip: function() {
    var iterator = Prototype.K, args = $A(arguments);
    if (Object.isFunction(args.last()))
      iterator = args.pop();

    var collections = [this].concat(args).map($A);
    return this.map(function(value, index) {
      return iterator(collections.pluck(index));
    });
  },

  size: function() {
    return this.toArray().length;
  },

  inspect: function() {
    return '#<Enumerable:' + this.toArray().inspect() + '>';
  }
};

Object.extend(Enumerable, {
  map:     Enumerable.collect,
  find:    Enumerable.detect,
  select:  Enumerable.findAll,
  filter:  Enumerable.findAll,
  member:  Enumerable.include,
  entries: Enumerable.toArray,
  every:   Enumerable.all,
  some:    Enumerable.any
});
function $A(iterable) {
  if (!iterable) return [];
  if (iterable.toArray) return iterable.toArray();
  var length = iterable.length || 0, results = new Array(length);
  while (length--) results[length] = iterable[length];
  return results;
}

if (Prototype.Browser.WebKit) {
  $A = function(iterable) {
    if (!iterable) return [];
    if (!(typeof iterable === 'function' && typeof iterable.length ===
        'number' && typeof iterable.item === 'function') && iterable.toArray)
      return iterable.toArray();
    var length = iterable.length || 0, results = new Array(length);
    while (length--) results[length] = iterable[length];
    return results;
  };
}

Array.from = $A;

Object.extend(Array.prototype, Enumerable);

if (!Array.prototype._reverse) Array.prototype._reverse = Array.prototype.reverse;

Object.extend(Array.prototype, {
  _each: function(iterator) {
    for (var i = 0, length = this.length; i < length; i++)
      iterator(this[i]);
  },

  clear: function() {
    this.length = 0;
    return this;
  },

  first: function() {
    return this[0];
  },

  last: function() {
    return this[this.length - 1];
  },

  compact: function() {
    return this.select(function(value) {
      return value != null;
    });
  },

  flatten: function() {
    return this.inject([], function(array, value) {
      return array.concat(Object.isArray(value) ?
        value.flatten() : [value]);
    });
  },

  without: function() {
    var values = $A(arguments);
    return this.select(function(value) {
      return !values.include(value);
    });
  },

  reverse: function(inline) {
    return (inline !== false ? this : this.toArray())._reverse();
  },

  reduce: function() {
    return this.length > 1 ? this : this[0];
  },

  uniq: function(sorted) {
    return this.inject([], function(array, value, index) {
      if (0 == index || (sorted ? array.last() != value : !array.include(value)))
        array.push(value);
      return array;
    });
  },

  intersect: function(array) {
    return this.uniq().findAll(function(item) {
      return array.detect(function(value) { return item === value });
    });
  },

  clone: function() {
    return [].concat(this);
  },

  size: function() {
    return this.length;
  },

  inspect: function() {
    return '[' + this.map(Object.inspect).join(', ') + ']';
  },

  toJSON: function() {
    var results = [];
    this.each(function(object) {
      var value = Object.toJSON(object);
      if (!Object.isUndefined(value)) results.push(value);
    });
    return '[' + results.join(', ') + ']';
  }
});

if (Object.isFunction(Array.prototype.forEach))
  Array.prototype._each = Array.prototype.forEach;

if (!Array.prototype.indexOf) Array.prototype.indexOf = function(item, i) {
  i || (i = 0);
  var length = this.length;
  if (i < 0) i = length + i;
  for (; i < length; i++)
    if (this[i] === item) return i;
  return -1;
};

if (!Array.prototype.lastIndexOf) Array.prototype.lastIndexOf = function(item, i) {
  i = isNaN(i) ? this.length : (i < 0 ? this.length + i : i) + 1;
  var n = this.slice(0, i).reverse().indexOf(item);
  return (n < 0) ? n : i - n - 1;
};

Array.prototype.toArray = Array.prototype.clone;

function $w(string) {
  if (!Object.isString(string)) return [];
  string = string.strip();
  return string ? string.split(/\s+/) : [];
}

if (Prototype.Browser.Opera){
  Array.prototype.concat = function() {
    var array = [];
    for (var i = 0, length = this.length; i < length; i++) array.push(this[i]);
    for (var i = 0, length = arguments.length; i < length; i++) {
      if (Object.isArray(arguments[i])) {
        for (var j = 0, arrayLength = arguments[i].length; j < arrayLength; j++)
          array.push(arguments[i][j]);
      } else {
        array.push(arguments[i]);
      }
    }
    return array;
  };
}
Object.extend(Number.prototype, {
  toColorPart: function() {
    return this.toPaddedString(2, 16);
  },

  succ: function() {
    return this + 1;
  },

  times: function(iterator, context) {
    $R(0, this, true).each(iterator, context);
    return this;
  },

  toPaddedString: function(length, radix) {
    var string = this.toString(radix || 10);
    return '0'.times(length - string.length) + string;
  },

  toJSON: function() {
    return isFinite(this) ? this.toString() : 'null';
  }
});

$w('abs round ceil floor').each(function(method){
  Number.prototype[method] = Math[method].methodize();
});
function $H(object) {
  return new Hash(object);
};

var Hash = Class.create(Enumerable, (function() {

  function toQueryPair(key, value) {
    if (Object.isUndefined(value)) return key;
    return key + '=' + encodeURIComponent(String.interpret(value));
  }

  return {
    initialize: function(object) {
      this._object = Object.isHash(object) ? object.toObject() : Object.clone(object);
    },

    _each: function(iterator) {
      for (var key in this._object) {
        var value = this._object[key], pair = [key, value];
        pair.key = key;
        pair.value = value;
        iterator(pair);
      }
    },

    set: function(key, value) {
      return this._object[key] = value;
    },

    get: function(key) {
      if (this._object[key] !== Object.prototype[key])
        return this._object[key];
    },

    unset: function(key) {
      var value = this._object[key];
      delete this._object[key];
      return value;
    },

    toObject: function() {
      return Object.clone(this._object);
    },

    keys: function() {
      return this.pluck('key');
    },

    values: function() {
      return this.pluck('value');
    },

    index: function(value) {
      var match = this.detect(function(pair) {
        return pair.value === value;
      });
      return match && match.key;
    },

    merge: function(object) {
      return this.clone().update(object);
    },

    update: function(object) {
      return new Hash(object).inject(this, function(result, pair) {
        result.set(pair.key, pair.value);
        return result;
      });
    },

    toQueryString: function() {
      return this.inject([], function(results, pair) {
        var key = encodeURIComponent(pair.key), values = pair.value;

        if (values && typeof values == 'object') {
          if (Object.isArray(values))
            return results.concat(values.map(toQueryPair.curry(key)));
        } else results.push(toQueryPair(key, values));
        return results;
      }).join('&');
    },

    inspect: function() {
      return '#<Hash:{' + this.map(function(pair) {
        return pair.map(Object.inspect).join(': ');
      }).join(', ') + '}>';
    },

    toJSON: function() {
      return Object.toJSON(this.toObject());
    },

    clone: function() {
      return new Hash(this);
    }
  }
})());

Hash.prototype.toTemplateReplacements = Hash.prototype.toObject;
Hash.from = $H;
var ObjectRange = Class.create(Enumerable, {
  initialize: function(start, end, exclusive) {
    this.start = start;
    this.end = end;
    this.exclusive = exclusive;
  },

  _each: function(iterator) {
    var value = this.start;
    while (this.include(value)) {
      iterator(value);
      value = value.succ();
    }
  },

  include: function(value) {
    if (value < this.start)
      return false;
    if (this.exclusive)
      return value < this.end;
    return value <= this.end;
  }
});

var $R = function(start, end, exclusive) {
  return new ObjectRange(start, end, exclusive);
};

var Ajax = {
  getTransport: function() {
    return Try.these(
      function() {return new XMLHttpRequest()},
      function() {return new ActiveXObject('Msxml2.XMLHTTP')},
      function() {return new ActiveXObject('Microsoft.XMLHTTP')}
    ) || false;
  },

  activeRequestCount: 0
};

Ajax.Responders = {
  responders: [],

  _each: function(iterator) {
    this.responders._each(iterator);
  },

  register: function(responder) {
    if (!this.include(responder))
      this.responders.push(responder);
  },

  unregister: function(responder) {
    this.responders = this.responders.without(responder);
  },

  dispatch: function(callback, request, transport, json) {
    this.each(function(responder) {
      if (Object.isFunction(responder[callback])) {
        try {
          responder[callback].apply(responder, [request, transport, json]);
        } catch (e) { }
      }
    });
  }
};

Object.extend(Ajax.Responders, Enumerable);

Ajax.Responders.register({
  onCreate:   function() { Ajax.activeRequestCount++ },
  onComplete: function() { Ajax.activeRequestCount-- }
});

Ajax.Base = Class.create({
  initialize: function(options) {
    this.options = {
      method:       'post',
      asynchronous: true,
      contentType:  'application/x-www-form-urlencoded',
      encoding:     'UTF-8',
      parameters:   '',
      evalJSON:     true,
      evalJS:       true
    };
    Object.extend(this.options, options || { });

    this.options.method = this.options.method.toLowerCase();

    if (Object.isString(this.options.parameters))
      this.options.parameters = this.options.parameters.toQueryParams();
    else if (Object.isHash(this.options.parameters))
      this.options.parameters = this.options.parameters.toObject();
  }
});

Ajax.Request = Class.create(Ajax.Base, {
  _complete: false,

  initialize: function($super, url, options) {
    $super(options);
    this.transport = Ajax.getTransport();
    this.request(url);
  },

  request: function(url) {
    this.url = url;
    this.method = this.options.method;
    var params = Object.clone(this.options.parameters);

    if (!['get', 'post'].include(this.method)) {
      params['_method'] = this.method;
      this.method = 'post';
    }

    this.parameters = params;

    if (params = Object.toQueryString(params)) {
      if (this.method == 'get')
        this.url += (this.url.include('?') ? '&' : '?') + params;
      else if (/Konqueror|Safari|KHTML/.test(navigator.userAgent))
        params += '&_=';
    }

    try {
      var response = new Ajax.Response(this);
      if (this.options.onCreate) this.options.onCreate(response);
      Ajax.Responders.dispatch('onCreate', this, response);

      this.transport.open(this.method.toUpperCase(), this.url,
        this.options.asynchronous);

      if (this.options.asynchronous) this.respondToReadyState.bind(this).defer(1);

      this.transport.onreadystatechange = this.onStateChange.bind(this);
      this.setRequestHeaders();

      this.body = this.method == 'post' ? (this.options.postBody || params) : null;
      this.transport.send(this.body);

      /* Force Firefox to handle ready state 4 for synchronous requests */
      if (!this.options.asynchronous && this.transport.overrideMimeType)
        this.onStateChange();

    }
    catch (e) {
      this.dispatchException(e);
    }
  },

  onStateChange: function() {
    var readyState = this.transport.readyState;
    if (readyState > 1 && !((readyState == 4) && this._complete))
      this.respondToReadyState(this.transport.readyState);
  },

  setRequestHeaders: function() {
    var headers = {
      'X-Requested-With': 'XMLHttpRequest',
      'X-Prototype-Version': Prototype.Version,
      'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
    };

    if (this.method == 'post') {
      headers['Content-type'] = this.options.contentType +
        (this.options.encoding ? '; charset=' + this.options.encoding : '');

      /* Force "Connection: close" for older Mozilla browsers to work
       * around a bug where XMLHttpRequest sends an incorrect
       * Content-length header. See Mozilla Bugzilla #246651.
       */
      if (this.transport.overrideMimeType &&
          (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0,2005])[1] < 2005)
            headers['Connection'] = 'close';
    }

    if (typeof this.options.requestHeaders == 'object') {
      var extras = this.options.requestHeaders;

      if (Object.isFunction(extras.push))
        for (var i = 0, length = extras.length; i < length; i += 2)
          headers[extras[i]] = extras[i+1];
      else
        $H(extras).each(function(pair) { headers[pair.key] = pair.value });
    }

    for (var name in headers)
      this.transport.setRequestHeader(name, headers[name]);
  },

  success: function() {
    var status = this.getStatus();
    return !status || (status >= 200 && status < 300);
  },

  getStatus: function() {
    try {
      return this.transport.status || 0;
    } catch (e) { return 0 }
  },

  respondToReadyState: function(readyState) {
    var state = Ajax.Request.Events[readyState], response = new Ajax.Response(this);

    if (state == 'Complete') {
      try {
        this._complete = true;
        (this.options['on' + response.status]
         || this.options['on' + (this.success() ? 'Success' : 'Failure')]
         || Prototype.emptyFunction)(response, response.headerJSON);
      } catch (e) {
        this.dispatchException(e);
      }

      var contentType = response.getHeader('Content-type');
      if (this.options.evalJS == 'force'
          || (this.options.evalJS && this.isSameOrigin() && contentType
          && contentType.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i)))
        this.evalResponse();
    }

    try {
      (this.options['on' + state] || Prototype.emptyFunction)(response, response.headerJSON);
      Ajax.Responders.dispatch('on' + state, this, response, response.headerJSON);
    } catch (e) {
      this.dispatchException(e);
    }

    if (state == 'Complete') {
      this.transport.onreadystatechange = Prototype.emptyFunction;
    }
  },

  isSameOrigin: function() {
    var m = this.url.match(/^\s*https?:\/\/[^\/]*/);
    return !m || (m[0] == '#{protocol}//#{domain}#{port}'.interpolate({
      protocol: location.protocol,
      domain: document.domain,
      port: location.port ? ':' + location.port : ''
    }));
  },

  getHeader: function(name) {
    try {
      return this.transport.getResponseHeader(name) || null;
    } catch (e) { return null }
  },

  evalResponse: function() {
    try {
      return eval((this.transport.responseText || '').unfilterJSON());
    } catch (e) {
      this.dispatchException(e);
    }
  },

  dispatchException: function(exception) {
    (this.options.onException || Prototype.emptyFunction)(this, exception);
    Ajax.Responders.dispatch('onException', this, exception);
  }
});

Ajax.Request.Events =
  ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];

Ajax.Response = Class.create({
  initialize: function(request){
    this.request = request;
    var transport  = this.transport  = request.transport,
        readyState = this.readyState = transport.readyState;

    if((readyState > 2 && !Prototype.Browser.IE) || readyState == 4) {
      this.status       = this.getStatus();
      this.statusText   = this.getStatusText();
      this.responseText = String.interpret(transport.responseText);
      this.headerJSON   = this._getHeaderJSON();
    }

    if(readyState == 4) {
      var xml = transport.responseXML;
      this.responseXML  = Object.isUndefined(xml) ? null : xml;
      this.responseJSON = this._getResponseJSON();
    }
  },

  status:      0,
  statusText: '',

  getStatus: Ajax.Request.prototype.getStatus,

  getStatusText: function() {
    try {
      return this.transport.statusText || '';
    } catch (e) { return '' }
  },

  getHeader: Ajax.Request.prototype.getHeader,

  getAllHeaders: function() {
    try {
      return this.getAllResponseHeaders();
    } catch (e) { return null }
  },

  getResponseHeader: function(name) {
    return this.transport.getResponseHeader(name);
  },

  getAllResponseHeaders: function() {
    return this.transport.getAllResponseHeaders();
  },

  _getHeaderJSON: function() {
    var json = this.getHeader('X-JSON');
    if (!json) return null;
    json = decodeURIComponent(escape(json));
    try {
      return json.evalJSON(this.request.options.sanitizeJSON ||
        !this.request.isSameOrigin());
    } catch (e) {
      this.request.dispatchException(e);
    }
  },

  _getResponseJSON: function() {
    var options = this.request.options;
    if (!options.evalJSON || (options.evalJSON != 'force' &&
      !(this.getHeader('Content-type') || '').include('application/json')) ||
        this.responseText.blank())
          return null;
    try {
      return this.responseText.evalJSON(options.sanitizeJSON ||
        !this.request.isSameOrigin());
    } catch (e) {
      this.request.dispatchException(e);
    }
  }
});

Ajax.Updater = Class.create(Ajax.Request, {
  initialize: function($super, container, url, options) {
    this.container = {
      success: (container.success || container),
      failure: (container.failure || (container.success ? null : container))
    };

    options = Object.clone(options);
    var onComplete = options.onComplete;
    options.onComplete = (function(response, json) {
      this.updateContent(response.responseText);
      if (Object.isFunction(onComplete)) onComplete(response, json);
    }).bind(this);

    $super(url, options);
  },

  updateContent: function(responseText) {
    var receiver = this.container[this.success() ? 'success' : 'failure'],
        options = this.options;

    if (!options.evalScripts) responseText = responseText.stripScripts();

    if (receiver = $(receiver)) {
      if (options.insertion) {
        if (Object.isString(options.insertion)) {
          var insertion = { }; insertion[options.insertion] = responseText;
          receiver.insert(insertion);
        }
        else options.insertion(receiver, responseText);
      }
      else receiver.update(responseText);
    }
  }
});

Ajax.PeriodicalUpdater = Class.create(Ajax.Base, {
  initialize: function($super, container, url, options) {
    $super(options);
    this.onComplete = this.options.onComplete;

    this.frequency = (this.options.frequency || 2);
    this.decay = (this.options.decay || 1);

    this.updater = { };
    this.container = container;
    this.url = url;

    this.start();
  },

  start: function() {
    this.options.onComplete = this.updateComplete.bind(this);
    this.onTimerEvent();
  },

  stop: function() {
    this.updater.options.onComplete = undefined;
    clearTimeout(this.timer);
    (this.onComplete || Prototype.emptyFunction).apply(this, arguments);
  },

  updateComplete: function(response) {
    if (this.options.decay) {
      this.decay = (response.responseText == this.lastText ?
        this.decay * this.options.decay : 1);

      this.lastText = response.responseText;
    }
    this.timer = this.onTimerEvent.bind(this).delay(this.decay * this.frequency);
  },

  onTimerEvent: function() {
    this.updater = new Ajax.Updater(this.container, this.url, this.options);
  }
});
function $(element) {
  if (arguments.length > 1) {
    for (var i = 0, elements = [], length = arguments.length; i < length; i++)
      elements.push($(arguments[i]));
    return elements;
  }
  if (Object.isString(element))
    element = document.getElementById(element);
  return Element.extend(element);
}

if (Prototype.BrowserFeatures.XPath) {
  document._getElementsByXPath = function(expression, parentElement) {
    var results = [];
    var query = document.evaluate(expression, $(parentElement) || document,
      null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0, length = query.snapshotLength; i < length; i++)
      results.push(Element.extend(query.snapshotItem(i)));
    return results;
  };
}

/*--------------------------------------------------------------------------*/

if (!window.Node) var Node = { };

if (!Node.ELEMENT_NODE) {
  Object.extend(Node, {
    ELEMENT_NODE: 1,
    ATTRIBUTE_NODE: 2,
    TEXT_NODE: 3,
    CDATA_SECTION_NODE: 4,
    ENTITY_REFERENCE_NODE: 5,
    ENTITY_NODE: 6,
    PROCESSING_INSTRUCTION_NODE: 7,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9,
    DOCUMENT_TYPE_NODE: 10,
    DOCUMENT_FRAGMENT_NODE: 11,
    NOTATION_NODE: 12
  });
}

(function() {
  var element = this.Element;
  this.Element = function(tagName, attributes) {
    attributes = attributes || { };
    tagName = tagName.toLowerCase();
    var cache = Element.cache;
    if (Prototype.Browser.IE && attributes.name) {
      tagName = '<' + tagName + ' name="' + attributes.name + '">';
      delete attributes.name;
      return Element.writeAttribute(document.createElement(tagName), attributes);
    }
    if (!cache[tagName]) cache[tagName] = Element.extend(document.createElement(tagName));
    return Element.writeAttribute(cache[tagName].cloneNode(false), attributes);
  };
  Object.extend(this.Element, element || { });
  if (element) this.Element.prototype = element.prototype;
}).call(window);

Element.cache = { };

Element.Methods = {
  visible: function(element) {
    return $(element).style.display != 'none';
  },

  toggle: function(element) {
    element = $(element);
    Element[Element.visible(element) ? 'hide' : 'show'](element);
    return element;
  },

  hide: function(element) {
    element = $(element);
    element.style.display = 'none';
    return element;
  },

  show: function(element) {
    element = $(element);
    element.style.display = '';
    return element;
  },

  remove: function(element) {
    element = $(element);
    element.parentNode.removeChild(element);
    return element;
  },

  update: function(element, content) {
    element = $(element);
    if (content && content.toElement) content = content.toElement();
    if (Object.isElement(content)) return element.update().insert(content);
    content = Object.toHTML(content);
    element.innerHTML = content.stripScripts();
    content.evalScripts.bind(content).defer();
    return element;
  },

  replace: function(element, content) {
    element = $(element);
    if (content && content.toElement) content = content.toElement();
    else if (!Object.isElement(content)) {
      content = Object.toHTML(content);
      var range = element.ownerDocument.createRange();
      range.selectNode(element);
      content.evalScripts.bind(content).defer();
      content = range.createContextualFragment(content.stripScripts());
    }
    element.parentNode.replaceChild(content, element);
    return element;
  },

  insert: function(element, insertions) {
    element = $(element);

    if (Object.isString(insertions) || Object.isNumber(insertions) ||
        Object.isElement(insertions) || (insertions && (insertions.toElement || insertions.toHTML)))
          insertions = {bottom:insertions};

    var content, insert, tagName, childNodes;

    for (var position in insertions) {
      content  = insertions[position];
      position = position.toLowerCase();
      insert = Element._insertionTranslations[position];

      if (content && content.toElement) content = content.toElement();
      if (Object.isElement(content)) {
        insert(element, content);
        continue;
      }

      content = Object.toHTML(content);

      tagName = ((position == 'before' || position == 'after')
        ? element.parentNode : element).tagName.toUpperCase();

      childNodes = Element._getContentFromAnonymousElement(tagName, content.stripScripts());

      if (position == 'top' || position == 'after') childNodes.reverse();
      childNodes.each(insert.curry(element));

      content.evalScripts.bind(content).defer();
    }

    return element;
  },

  wrap: function(element, wrapper, attributes) {
    element = $(element);
    if (Object.isElement(wrapper))
      $(wrapper).writeAttribute(attributes || { });
    else if (Object.isString(wrapper)) wrapper = new Element(wrapper, attributes);
    else wrapper = new Element('div', wrapper);
    if (element.parentNode)
      element.parentNode.replaceChild(wrapper, element);
    wrapper.appendChild(element);
    return wrapper;
  },

  inspect: function(element) {
    element = $(element);
    var result = '<' + element.tagName.toLowerCase();
    $H({'id': 'id', 'className': 'class'}).each(function(pair) {
      var property = pair.first(), attribute = pair.last();
      var value = (element[property] || '').toString();
      if (value) result += ' ' + attribute + '=' + value.inspect(true);
    });
    return result + '>';
  },

  recursivelyCollect: function(element, property) {
    element = $(element);
    var elements = [];
    while (element = element[property])
      if (element.nodeType == 1)
        elements.push(Element.extend(element));
    return elements;
  },

  ancestors: function(element) {
    return $(element).recursivelyCollect('parentNode');
  },

  descendants: function(element) {
    return $(element).select("*");
  },

  firstDescendant: function(element) {
    element = $(element).firstChild;
    while (element && element.nodeType != 1) element = element.nextSibling;
    return $(element);
  },

  immediateDescendants: function(element) {
    if (!(element = $(element).firstChild)) return [];
    while (element && element.nodeType != 1) element = element.nextSibling;
    if (element) return [element].concat($(element).nextSiblings());
    return [];
  },

  previousSiblings: function(element) {
    return $(element).recursivelyCollect('previousSibling');
  },

  nextSiblings: function(element) {
    return $(element).recursivelyCollect('nextSibling');
  },

  siblings: function(element) {
    element = $(element);
    return element.previousSiblings().reverse().concat(element.nextSiblings());
  },

  match: function(element, selector) {
    if (Object.isString(selector))
      selector = new Selector(selector);
    return selector.match($(element));
  },

  up: function(element, expression, index) {
    element = $(element);
    if (arguments.length == 1) return $(element.parentNode);
    var ancestors = element.ancestors();
    return Object.isNumber(expression) ? ancestors[expression] :
      Selector.findElement(ancestors, expression, index);
  },

  down: function(element, expression, index) {
    element = $(element);
    if (arguments.length == 1) return element.firstDescendant();
    return Object.isNumber(expression) ? element.descendants()[expression] :
      Element.select(element, expression)[index || 0];
  },

  previous: function(element, expression, index) {
    element = $(element);
    if (arguments.length == 1) return $(Selector.handlers.previousElementSibling(element));
    var previousSiblings = element.previousSiblings();
    return Object.isNumber(expression) ? previousSiblings[expression] :
      Selector.findElement(previousSiblings, expression, index);
  },

  next: function(element, expression, index) {
    element = $(element);
    if (arguments.length == 1) return $(Selector.handlers.nextElementSibling(element));
    var nextSiblings = element.nextSiblings();
    return Object.isNumber(expression) ? nextSiblings[expression] :
      Selector.findElement(nextSiblings, expression, index);
  },

  select: function() {
    var args = $A(arguments), element = $(args.shift());
    return Selector.findChildElements(element, args);
  },

  adjacent: function() {
    var args = $A(arguments), element = $(args.shift());
    return Selector.findChildElements(element.parentNode, args).without(element);
  },

  identify: function(element) {
    element = $(element);
    var id = element.readAttribute('id'), self = arguments.callee;
    if (id) return id;
    do { id = 'anonymous_element_' + self.counter++ } while ($(id));
    element.writeAttribute('id', id);
    return id;
  },

  readAttribute: function(element, name) {
    element = $(element);
    if (Prototype.Browser.IE) {
      var t = Element._attributeTranslations.read;
      if (t.values[name]) return t.values[name](element, name);
      if (t.names[name]) name = t.names[name];
      if (name.include(':')) {
        return (!element.attributes || !element.attributes[name]) ? null :
         element.attributes[name].value;
      }
    }
    return element.getAttribute(name);
  },

  writeAttribute: function(element, name, value) {
    element = $(element);
    var attributes = { }, t = Element._attributeTranslations.write;

    if (typeof name == 'object') attributes = name;
    else attributes[name] = Object.isUndefined(value) ? true : value;

    for (var attr in attributes) {
      name = t.names[attr] || attr;
      value = attributes[attr];
      if (t.values[attr]) name = t.values[attr](element, value);
      if (value === false || value === null)
        element.removeAttribute(name);
      else if (value === true)
        element.setAttribute(name, name);
      else element.setAttribute(name, value);
    }
    return element;
  },

  getHeight: function(element) {
    return $(element).getDimensions().height;
  },

  getWidth: function(element) {
    return $(element).getDimensions().width;
  },

  classNames: function(element) {
    return new Element.ClassNames(element);
  },

  hasClassName: function(element, className) {
    if (!(element = $(element))) return;
    var elementClassName = element.className;
    return (elementClassName.length > 0 && (elementClassName == className ||
      new RegExp("(^|\\s)" + className + "(\\s|$)").test(elementClassName)));
  },

  addClassName: function(element, className) {
    if (!(element = $(element))) return;
    if (!element.hasClassName(className))
      element.className += (element.className ? ' ' : '') + className;
    return element;
  },

  removeClassName: function(element, className) {
    if (!(element = $(element))) return;
    element.className = element.className.replace(
      new RegExp("(^|\\s+)" + className + "(\\s+|$)"), ' ').strip();
    return element;
  },

  toggleClassName: function(element, className) {
    if (!(element = $(element))) return;
    return element[element.hasClassName(className) ?
      'removeClassName' : 'addClassName'](className);
  },

  cleanWhitespace: function(element) {
    element = $(element);
    var node = element.firstChild;
    while (node) {
      var nextNode = node.nextSibling;
      if (node.nodeType == 3 && !/\S/.test(node.nodeValue))
        element.removeChild(node);
      node = nextNode;
    }
    return element;
  },

  empty: function(element) {
    return $(element).innerHTML.blank();
  },

  descendantOf: function(element, ancestor) {
    element = $(element), ancestor = $(ancestor);

    if (element.compareDocumentPosition)
      return (element.compareDocumentPosition(ancestor) & 8) === 8;

    if (ancestor.contains)
      return ancestor.contains(element) && ancestor !== element;

    while (element = element.parentNode)
      if (element == ancestor) return true;

    return false;
  },

  scrollTo: function(element) {
    element = $(element);
    var pos = element.cumulativeOffset();
    window.scrollTo(pos[0], pos[1]);
    return element;
  },

  getStyle: function(element, style) {
    element = $(element);
    style = style == 'float' ? 'cssFloat' : style.camelize();
    var value = element.style[style];
    if (!value || value == 'auto') {
      var css = document.defaultView.getComputedStyle(element, null);
      value = css ? css[style] : null;
    }
    if (style == 'opacity') return value ? parseFloat(value) : 1.0;
    return value == 'auto' ? null : value;
  },

  getOpacity: function(element) {
    return $(element).getStyle('opacity');
  },

  setStyle: function(element, styles) {
    element = $(element);
    var elementStyle = element.style, match;
    if (Object.isString(styles)) {
      element.style.cssText += ';' + styles;
      return styles.include('opacity') ?
        element.setOpacity(styles.match(/opacity:\s*(\d?\.?\d*)/)[1]) : element;
    }
    for (var property in styles)
      if (property == 'opacity') element.setOpacity(styles[property]);
      else
        elementStyle[(property == 'float' || property == 'cssFloat') ?
          (Object.isUndefined(elementStyle.styleFloat) ? 'cssFloat' : 'styleFloat') :
            property] = styles[property];

    return element;
  },

  setOpacity: function(element, value) {
    element = $(element);
    element.style.opacity = (value == 1 || value === '') ? '' :
      (value < 0.00001) ? 0 : value;
    return element;
  },

  getDimensions: function(element) {
    element = $(element);
    var display = element.getStyle('display');
    if (display != 'none' && display != null) // Safari bug
      return {width: element.offsetWidth, height: element.offsetHeight};

    var els = element.style;
    var originalVisibility = els.visibility;
    var originalPosition = els.position;
    var originalDisplay = els.display;
    els.visibility = 'hidden';
    els.position = 'absolute';
    els.display = 'block';
    var originalWidth = element.clientWidth;
    var originalHeight = element.clientHeight;
    els.display = originalDisplay;
    els.position = originalPosition;
    els.visibility = originalVisibility;
    return {width: originalWidth, height: originalHeight};
  },

  makePositioned: function(element) {
    element = $(element);
    var pos = Element.getStyle(element, 'position');
    if (pos == 'static' || !pos) {
      element._madePositioned = true;
      element.style.position = 'relative';
      if (Prototype.Browser.Opera) {
        element.style.top = 0;
        element.style.left = 0;
      }
    }
    return element;
  },

  undoPositioned: function(element) {
    element = $(element);
    if (element._madePositioned) {
      element._madePositioned = undefined;
      element.style.position =
        element.style.top =
        element.style.left =
        element.style.bottom =
        element.style.right = '';
    }
    return element;
  },

  makeClipping: function(element) {
    element = $(element);
    if (element._overflow) return element;
    element._overflow = Element.getStyle(element, 'overflow') || 'auto';
    if (element._overflow !== 'hidden')
      element.style.overflow = 'hidden';
    return element;
  },

  undoClipping: function(element) {
    element = $(element);
    if (!element._overflow) return element;
    element.style.overflow = element._overflow == 'auto' ? '' : element._overflow;
    element._overflow = null;
    return element;
  },

  cumulativeOffset: function(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      element = element.offsetParent;
    } while (element);
    return Element._returnOffset(valueL, valueT);
  },

  positionedOffset: function(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      element = element.offsetParent;
      if (element) {
        if (element.tagName.toUpperCase() == 'BODY') break;
        var p = Element.getStyle(element, 'position');
        if (p !== 'static') break;
      }
    } while (element);
    return Element._returnOffset(valueL, valueT);
  },

  absolutize: function(element) {
    element = $(element);
    if (element.getStyle('position') == 'absolute') return element;

    var offsets = element.positionedOffset();
    var top     = offsets[1];
    var left    = offsets[0];
    var width   = element.clientWidth;
    var height  = element.clientHeight;

    element._originalLeft   = left - parseFloat(element.style.left  || 0);
    element._originalTop    = top  - parseFloat(element.style.top || 0);
    element._originalWidth  = element.style.width;
    element._originalHeight = element.style.height;

    element.style.position = 'absolute';
    element.style.top    = top + 'px';
    element.style.left   = left + 'px';
    element.style.width  = width + 'px';
    element.style.height = height + 'px';
    return element;
  },

  relativize: function(element) {
    element = $(element);
    if (element.getStyle('position') == 'relative') return element;

    element.style.position = 'relative';
    var top  = parseFloat(element.style.top  || 0) - (element._originalTop || 0);
    var left = parseFloat(element.style.left || 0) - (element._originalLeft || 0);

    element.style.top    = top + 'px';
    element.style.left   = left + 'px';
    element.style.height = element._originalHeight;
    element.style.width  = element._originalWidth;
    return element;
  },

  cumulativeScrollOffset: function(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.scrollTop  || 0;
      valueL += element.scrollLeft || 0;
      element = element.parentNode;
    } while (element);
    return Element._returnOffset(valueL, valueT);
  },

  getOffsetParent: function(element) {
    if (element.offsetParent) return $(element.offsetParent);
    if (element == document.body) return $(element);

    while ((element = element.parentNode) && element != document.body)
      if (Element.getStyle(element, 'position') != 'static')
        return $(element);

    return $(document.body);
  },

  viewportOffset: function(forElement) {
    var valueT = 0, valueL = 0;

    var element = forElement;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;

      if (element.offsetParent == document.body &&
        Element.getStyle(element, 'position') == 'absolute') break;

    } while (element = element.offsetParent);

    element = forElement;
    do {
      if (!Prototype.Browser.Opera || (element.tagName && (element.tagName.toUpperCase() == 'BODY'))) {
        valueT -= element.scrollTop  || 0;
        valueL -= element.scrollLeft || 0;
      }
    } while (element = element.parentNode);

    return Element._returnOffset(valueL, valueT);
  },

  clonePosition: function(element, source) {
    var options = Object.extend({
      setLeft:    true,
      setTop:     true,
      setWidth:   true,
      setHeight:  true,
      offsetTop:  0,
      offsetLeft: 0
    }, arguments[2] || { });

    source = $(source);
    var p = source.viewportOffset();

    element = $(element);
    var delta = [0, 0];
    var parent = null;
    if (Element.getStyle(element, 'position') == 'absolute') {
      parent = element.getOffsetParent();
      delta = parent.viewportOffset();
    }

    if (parent == document.body) {
      delta[0] -= document.body.offsetLeft;
      delta[1] -= document.body.offsetTop;
    }

    if (options.setLeft)   element.style.left  = (p[0] - delta[0] + options.offsetLeft) + 'px';
    if (options.setTop)    element.style.top   = (p[1] - delta[1] + options.offsetTop) + 'px';
    if (options.setWidth)  element.style.width = source.offsetWidth + 'px';
    if (options.setHeight) element.style.height = source.offsetHeight + 'px';
    return element;
  }
};

Element.Methods.identify.counter = 1;

Object.extend(Element.Methods, {
  getElementsBySelector: Element.Methods.select,
  childElements: Element.Methods.immediateDescendants
});

Element._attributeTranslations = {
  write: {
    names: {
      className: 'class',
      htmlFor:   'for'
    },
    values: { }
  }
};

if (Prototype.Browser.Opera) {
  Element.Methods.getStyle = Element.Methods.getStyle.wrap(
    function(proceed, element, style) {
      switch (style) {
        case 'left': case 'top': case 'right': case 'bottom':
          if (proceed(element, 'position') === 'static') return null;
        case 'height': case 'width':
          if (!Element.visible(element)) return null;

          var dim = parseInt(proceed(element, style), 10);

          if (dim !== element['offset' + style.capitalize()])
            return dim + 'px';

          var properties;
          if (style === 'height') {
            properties = ['border-top-width', 'padding-top',
             'padding-bottom', 'border-bottom-width'];
          }
          else {
            properties = ['border-left-width', 'padding-left',
             'padding-right', 'border-right-width'];
          }
          return properties.inject(dim, function(memo, property) {
            var val = proceed(element, property);
            return val === null ? memo : memo - parseInt(val, 10);
          }) + 'px';
        default: return proceed(element, style);
      }
    }
  );

  Element.Methods.readAttribute = Element.Methods.readAttribute.wrap(
    function(proceed, element, attribute) {
      if (attribute === 'title') return element.title;
      return proceed(element, attribute);
    }
  );
}

else if (Prototype.Browser.IE) {
  Element.Methods.getOffsetParent = Element.Methods.getOffsetParent.wrap(
    function(proceed, element) {
      element = $(element);
      try { element.offsetParent }
      catch(e) { return $(document.body) }
      var position = element.getStyle('position');
      if (position !== 'static') return proceed(element);
      element.setStyle({ position: 'relative' });
      var value = proceed(element);
      element.setStyle({ position: position });
      return value;
    }
  );

  $w('positionedOffset viewportOffset').each(function(method) {
    Element.Methods[method] = Element.Methods[method].wrap(
      function(proceed, element) {
        element = $(element);
        try { element.offsetParent }
        catch(e) { return Element._returnOffset(0,0) }
        var position = element.getStyle('position');
        if (position !== 'static') return proceed(element);
        var offsetParent = element.getOffsetParent();
        if (offsetParent && offsetParent.getStyle('position') === 'fixed')
          offsetParent.setStyle({ zoom: 1 });
        element.setStyle({ position: 'relative' });
        var value = proceed(element);
        element.setStyle({ position: position });
        return value;
      }
    );
  });

  Element.Methods.cumulativeOffset = Element.Methods.cumulativeOffset.wrap(
    function(proceed, element) {
      try { element.offsetParent }
      catch(e) { return Element._returnOffset(0,0) }
      return proceed(element);
    }
  );

  Element.Methods.getStyle = function(element, style) {
    element = $(element);
    style = (style == 'float' || style == 'cssFloat') ? 'styleFloat' : style.camelize();
    var value = element.style[style];
    if (!value && element.currentStyle) value = element.currentStyle[style];

    if (style == 'opacity') {
      if (value = (element.getStyle('filter') || '').match(/alpha\(opacity=(.*)\)/))
        if (value[1]) return parseFloat(value[1]) / 100;
      return 1.0;
    }

    if (value == 'auto') {
      if ((style == 'width' || style == 'height') && (element.getStyle('display') != 'none'))
        return element['offset' + style.capitalize()] + 'px';
      return null;
    }
    return value;
  };

  Element.Methods.setOpacity = function(element, value) {
    function stripAlpha(filter){
      return filter.replace(/alpha\([^\)]*\)/gi,'');
    }
    element = $(element);
    var currentStyle = element.currentStyle;
    if ((currentStyle && !currentStyle.hasLayout) ||
      (!currentStyle && element.style.zoom == 'normal'))
        element.style.zoom = 1;

    var filter = element.getStyle('filter'), style = element.style;
    if (value == 1 || value === '') {
      (filter = stripAlpha(filter)) ?
        style.filter = filter : style.removeAttribute('filter');
      return element;
    } else if (value < 0.00001) value = 0;
    style.filter = stripAlpha(filter) +
      'alpha(opacity=' + (value * 100) + ')';
    return element;
  };

  Element._attributeTranslations = {
    read: {
      names: {
        'class': 'className',
        'for':   'htmlFor'
      },
      values: {
        _getAttr: function(element, attribute) {
          return element.getAttribute(attribute, 2);
        },
        _getAttrNode: function(element, attribute) {
          var node = element.getAttributeNode(attribute);
          return node ? node.value : "";
        },
        _getEv: function(element, attribute) {
          attribute = element.getAttribute(attribute);
          return attribute ? attribute.toString().slice(23, -2) : null;
        },
        _flag: function(element, attribute) {
          return $(element).hasAttribute(attribute) ? attribute : null;
        },
        style: function(element) {
          return element.style.cssText.toLowerCase();
        },
        title: function(element) {
          return element.title;
        }
      }
    }
  };

  Element._attributeTranslations.write = {
    names: Object.extend({
      cellpadding: 'cellPadding',
      cellspacing: 'cellSpacing'
    }, Element._attributeTranslations.read.names),
    values: {
      checked: function(element, value) {
        element.checked = !!value;
      },

      style: function(element, value) {
        element.style.cssText = value ? value : '';
      }
    }
  };

  Element._attributeTranslations.has = {};

  $w('colSpan rowSpan vAlign dateTime accessKey tabIndex ' +
      'encType maxLength readOnly longDesc frameBorder').each(function(attr) {
    Element._attributeTranslations.write.names[attr.toLowerCase()] = attr;
    Element._attributeTranslations.has[attr.toLowerCase()] = attr;
  });

  (function(v) {
    Object.extend(v, {
      href:        v._getAttr,
      src:         v._getAttr,
      type:        v._getAttr,
      action:      v._getAttrNode,
      disabled:    v._flag,
      checked:     v._flag,
      readonly:    v._flag,
      multiple:    v._flag,
      onload:      v._getEv,
      onunload:    v._getEv,
      onclick:     v._getEv,
      ondblclick:  v._getEv,
      onmousedown: v._getEv,
      onmouseup:   v._getEv,
      onmouseover: v._getEv,
      onmousemove: v._getEv,
      onmouseout:  v._getEv,
      onfocus:     v._getEv,
      onblur:      v._getEv,
      onkeypress:  v._getEv,
      onkeydown:   v._getEv,
      onkeyup:     v._getEv,
      onsubmit:    v._getEv,
      onreset:     v._getEv,
      onselect:    v._getEv,
      onchange:    v._getEv
    });
  })(Element._attributeTranslations.read.values);
}

else if (Prototype.Browser.Gecko && /rv:1\.8\.0/.test(navigator.userAgent)) {
  Element.Methods.setOpacity = function(element, value) {
    element = $(element);
    element.style.opacity = (value == 1) ? 0.999999 :
      (value === '') ? '' : (value < 0.00001) ? 0 : value;
    return element;
  };
}

else if (Prototype.Browser.WebKit) {
  Element.Methods.setOpacity = function(element, value) {
    element = $(element);
    element.style.opacity = (value == 1 || value === '') ? '' :
      (value < 0.00001) ? 0 : value;

    if (value == 1)
      if(element.tagName.toUpperCase() == 'IMG' && element.width) {
        element.width++; element.width--;
      } else try {
        var n = document.createTextNode(' ');
        element.appendChild(n);
        element.removeChild(n);
      } catch (e) { }

    return element;
  };

  Element.Methods.cumulativeOffset = function(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      if (element.offsetParent == document.body)
        if (Element.getStyle(element, 'position') == 'absolute') break;

      element = element.offsetParent;
    } while (element);

    return Element._returnOffset(valueL, valueT);
  };
}

if (Prototype.Browser.IE || Prototype.Browser.Opera) {
  Element.Methods.update = function(element, content) {
    element = $(element);

    if (content && content.toElement) content = content.toElement();
    if (Object.isElement(content)) return element.update().insert(content);

    content = Object.toHTML(content);
    var tagName = element.tagName.toUpperCase();

    if (tagName in Element._insertionTranslations.tags) {
      $A(element.childNodes).each(function(node) { element.removeChild(node) });
      Element._getContentFromAnonymousElement(tagName, content.stripScripts())
        .each(function(node) { element.appendChild(node) });
    }
    else element.innerHTML = content.stripScripts();

    content.evalScripts.bind(content).defer();
    return element;
  };
}

if ('outerHTML' in document.createElement('div')) {
  Element.Methods.replace = function(element, content) {
    element = $(element);

    if (content && content.toElement) content = content.toElement();
    if (Object.isElement(content)) {
      element.parentNode.replaceChild(content, element);
      return element;
    }

    content = Object.toHTML(content);
    var parent = element.parentNode, tagName = parent.tagName.toUpperCase();

    if (Element._insertionTranslations.tags[tagName]) {
      var nextSibling = element.next();
      var fragments = Element._getContentFromAnonymousElement(tagName, content.stripScripts());
      parent.removeChild(element);
      if (nextSibling)
        fragments.each(function(node) { parent.insertBefore(node, nextSibling) });
      else
        fragments.each(function(node) { parent.appendChild(node) });
    }
    else element.outerHTML = content.stripScripts();

    content.evalScripts.bind(content).defer();
    return element;
  };
}

Element._returnOffset = function(l, t) {
  var result = [l, t];
  result.left = l;
  result.top = t;
  return result;
};

Element._getContentFromAnonymousElement = function(tagName, html) {
  var div = new Element('div'), t = Element._insertionTranslations.tags[tagName];
  if (t) {
    div.innerHTML = t[0] + html + t[1];
    t[2].times(function() { div = div.firstChild });
  } else div.innerHTML = html;
  return $A(div.childNodes);
};

Element._insertionTranslations = {
  before: function(element, node) {
    element.parentNode.insertBefore(node, element);
  },
  top: function(element, node) {
    element.insertBefore(node, element.firstChild);
  },
  bottom: function(element, node) {
    element.appendChild(node);
  },
  after: function(element, node) {
    element.parentNode.insertBefore(node, element.nextSibling);
  },
  tags: {
    TABLE:  ['<table>',                '</table>',                   1],
    TBODY:  ['<table><tbody>',         '</tbody></table>',           2],
    TR:     ['<table><tbody><tr>',     '</tr></tbody></table>',      3],
    TD:     ['<table><tbody><tr><td>', '</td></tr></tbody></table>', 4],
    SELECT: ['<select>',               '</select>',                  1]
  }
};

(function() {
  Object.extend(this.tags, {
    THEAD: this.tags.TBODY,
    TFOOT: this.tags.TBODY,
    TH:    this.tags.TD
  });
}).call(Element._insertionTranslations);

Element.Methods.Simulated = {
  hasAttribute: function(element, attribute) {
    attribute = Element._attributeTranslations.has[attribute] || attribute;
    var node = $(element).getAttributeNode(attribute);
    return !!(node && node.specified);
  }
};

Element.Methods.ByTag = { };

Object.extend(Element, Element.Methods);

if (!Prototype.BrowserFeatures.ElementExtensions &&
    document.createElement('div')['__proto__']) {
  window.HTMLElement = { };
  window.HTMLElement.prototype = document.createElement('div')['__proto__'];
  Prototype.BrowserFeatures.ElementExtensions = true;
}

Element.extend = (function() {
  if (Prototype.BrowserFeatures.SpecificElementExtensions)
    return Prototype.K;

  var Methods = { }, ByTag = Element.Methods.ByTag;

  var extend = Object.extend(function(element) {
    if (!element || element._extendedByPrototype ||
        element.nodeType != 1 || element == window) return element;

    var methods = Object.clone(Methods),
      tagName = element.tagName.toUpperCase(), property, value;

    if (ByTag[tagName]) Object.extend(methods, ByTag[tagName]);

    for (property in methods) {
      value = methods[property];
      if (Object.isFunction(value) && !(property in element))
        element[property] = value.methodize();
    }

    element._extendedByPrototype = Prototype.emptyFunction;
    return element;

  }, {
    refresh: function() {
      if (!Prototype.BrowserFeatures.ElementExtensions) {
        Object.extend(Methods, Element.Methods);
        Object.extend(Methods, Element.Methods.Simulated);
      }
    }
  });

  extend.refresh();
  return extend;
})();

Element.hasAttribute = function(element, attribute) {
  if (element.hasAttribute) return element.hasAttribute(attribute);
  return Element.Methods.Simulated.hasAttribute(element, attribute);
};

Element.addMethods = function(methods) {
  var F = Prototype.BrowserFeatures, T = Element.Methods.ByTag;

  if (!methods) {
    Object.extend(Form, Form.Methods);
    Object.extend(Form.Element, Form.Element.Methods);
    Object.extend(Element.Methods.ByTag, {
      "FORM":     Object.clone(Form.Methods),
      "INPUT":    Object.clone(Form.Element.Methods),
      "SELECT":   Object.clone(Form.Element.Methods),
      "TEXTAREA": Object.clone(Form.Element.Methods)
    });
  }

  if (arguments.length == 2) {
    var tagName = methods;
    methods = arguments[1];
  }

  if (!tagName) Object.extend(Element.Methods, methods || { });
  else {
    if (Object.isArray(tagName)) tagName.each(extend);
    else extend(tagName);
  }

  function extend(tagName) {
    tagName = tagName.toUpperCase();
    if (!Element.Methods.ByTag[tagName])
      Element.Methods.ByTag[tagName] = { };
    Object.extend(Element.Methods.ByTag[tagName], methods);
  }

  function copy(methods, destination, onlyIfAbsent) {
    onlyIfAbsent = onlyIfAbsent || false;
    for (var property in methods) {
      var value = methods[property];
      if (!Object.isFunction(value)) continue;
      if (!onlyIfAbsent || !(property in destination))
        destination[property] = value.methodize();
    }
  }

  function findDOMClass(tagName) {
    var klass;
    var trans = {
      "OPTGROUP": "OptGroup", "TEXTAREA": "TextArea", "P": "Paragraph",
      "FIELDSET": "FieldSet", "UL": "UList", "OL": "OList", "DL": "DList",
      "DIR": "Directory", "H1": "Heading", "H2": "Heading", "H3": "Heading",
      "H4": "Heading", "H5": "Heading", "H6": "Heading", "Q": "Quote",
      "INS": "Mod", "DEL": "Mod", "A": "Anchor", "IMG": "Image", "CAPTION":
      "TableCaption", "COL": "TableCol", "COLGROUP": "TableCol", "THEAD":
      "TableSection", "TFOOT": "TableSection", "TBODY": "TableSection", "TR":
      "TableRow", "TH": "TableCell", "TD": "TableCell", "FRAMESET":
      "FrameSet", "IFRAME": "IFrame"
    };
    if (trans[tagName]) klass = 'HTML' + trans[tagName] + 'Element';
    if (window[klass]) return window[klass];
    klass = 'HTML' + tagName + 'Element';
    if (window[klass]) return window[klass];
    klass = 'HTML' + tagName.capitalize() + 'Element';
    if (window[klass]) return window[klass];

    window[klass] = { };
    window[klass].prototype = document.createElement(tagName)['__proto__'];
    return window[klass];
  }

  if (F.ElementExtensions) {
    copy(Element.Methods, HTMLElement.prototype);
    copy(Element.Methods.Simulated, HTMLElement.prototype, true);
  }

  if (F.SpecificElementExtensions) {
    for (var tag in Element.Methods.ByTag) {
      var klass = findDOMClass(tag);
      if (Object.isUndefined(klass)) continue;
      copy(T[tag], klass.prototype);
    }
  }

  Object.extend(Element, Element.Methods);
  delete Element.ByTag;

  if (Element.extend.refresh) Element.extend.refresh();
  Element.cache = { };
};

document.viewport = {
  getDimensions: function() {
    var dimensions = { }, B = Prototype.Browser;
    $w('width height').each(function(d) {
      var D = d.capitalize();
      if (B.WebKit && !document.evaluate) {
        dimensions[d] = self['inner' + D];
      } else if (B.Opera && parseFloat(window.opera.version()) < 9.5) {
        dimensions[d] = document.body['client' + D]
      } else {
        dimensions[d] = document.documentElement['client' + D];
      }
    });
    return dimensions;
  },

  getWidth: function() {
    return this.getDimensions().width;
  },

  getHeight: function() {
    return this.getDimensions().height;
  },

  getScrollOffsets: function() {
    return Element._returnOffset(
      window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
      window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop);
  }
};
/* Portions of the Selector class are derived from Jack Slocum's DomQuery,
 * part of YUI-Ext version 0.40, distributed under the terms of an MIT-style
 * license.  Please see http://www.yui-ext.com/ for more information. */

var Selector = Class.create({
  initialize: function(expression) {
    this.expression = expression.strip();

    if (this.shouldUseSelectorsAPI()) {
      this.mode = 'selectorsAPI';
    } else if (this.shouldUseXPath()) {
      this.mode = 'xpath';
      this.compileXPathMatcher();
    } else {
      this.mode = "normal";
      this.compileMatcher();
    }

  },

  shouldUseXPath: function() {
    if (!Prototype.BrowserFeatures.XPath) return false;

    var e = this.expression;

    if (Prototype.Browser.WebKit &&
     (e.include("-of-type") || e.include(":empty")))
      return false;

    if ((/(\[[\w-]*?:|:checked)/).test(e))
      return false;

    return true;
  },

  shouldUseSelectorsAPI: function() {
    if (!Prototype.BrowserFeatures.SelectorsAPI) return false;

    if (!Selector._div) Selector._div = new Element('div');

    try {
      Selector._div.querySelector(this.expression);
    } catch(e) {
      return false;
    }

    return true;
  },

  compileMatcher: function() {
    var e = this.expression, ps = Selector.patterns, h = Selector.handlers,
        c = Selector.criteria, le, p, m;

    if (Selector._cache[e]) {
      this.matcher = Selector._cache[e];
      return;
    }

    this.matcher = ["this.matcher = function(root) {",
                    "var r = root, h = Selector.handlers, c = false, n;"];

    while (e && le != e && (/\S/).test(e)) {
      le = e;
      for (var i in ps) {
        p = ps[i];
        if (m = e.match(p)) {
          this.matcher.push(Object.isFunction(c[i]) ? c[i](m) :
            new Template(c[i]).evaluate(m));
          e = e.replace(m[0], '');
          break;
        }
      }
    }

    this.matcher.push("return h.unique(n);\n}");
    eval(this.matcher.join('\n'));
    Selector._cache[this.expression] = this.matcher;
  },

  compileXPathMatcher: function() {
    var e = this.expression, ps = Selector.patterns,
        x = Selector.xpath, le, m;

    if (Selector._cache[e]) {
      this.xpath = Selector._cache[e]; return;
    }

    this.matcher = ['.//*'];
    while (e && le != e && (/\S/).test(e)) {
      le = e;
      for (var i in ps) {
        if (m = e.match(ps[i])) {
          this.matcher.push(Object.isFunction(x[i]) ? x[i](m) :
            new Template(x[i]).evaluate(m));
          e = e.replace(m[0], '');
          break;
        }
      }
    }

    this.xpath = this.matcher.join('');
    Selector._cache[this.expression] = this.xpath;
  },

  findElements: function(root) {
    root = root || document;
    var e = this.expression, results;

    switch (this.mode) {
      case 'selectorsAPI':
        if (root !== document) {
          var oldId = root.id, id = $(root).identify();
          e = "#" + id + " " + e;
        }

        results = $A(root.querySelectorAll(e)).map(Element.extend);
        root.id = oldId;

        return results;
      case 'xpath':
        return document._getElementsByXPath(this.xpath, root);
      default:
       return this.matcher(root);
    }
  },

  match: function(element) {
    this.tokens = [];

    var e = this.expression, ps = Selector.patterns, as = Selector.assertions;
    var le, p, m;

    while (e && le !== e && (/\S/).test(e)) {
      le = e;
      for (var i in ps) {
        p = ps[i];
        if (m = e.match(p)) {
          if (as[i]) {
            this.tokens.push([i, Object.clone(m)]);
            e = e.replace(m[0], '');
          } else {
            return this.findElements(document).include(element);
          }
        }
      }
    }

    var match = true, name, matches;
    for (var i = 0, token; token = this.tokens[i]; i++) {
      name = token[0], matches = token[1];
      if (!Selector.assertions[name](element, matches)) {
        match = false; break;
      }
    }

    return match;
  },

  toString: function() {
    return this.expression;
  },

  inspect: function() {
    return "#<Selector:" + this.expression.inspect() + ">";
  }
});

Object.extend(Selector, {
  _cache: { },

  xpath: {
    descendant:   "//*",
    child:        "/*",
    adjacent:     "/following-sibling::*[1]",
    laterSibling: '/following-sibling::*',
    tagName:      function(m) {
      if (m[1] == '*') return '';
      return "[local-name()='" + m[1].toLowerCase() +
             "' or local-name()='" + m[1].toUpperCase() + "']";
    },
    className:    "[contains(concat(' ', @class, ' '), ' #{1} ')]",
    id:           "[@id='#{1}']",
    attrPresence: function(m) {
      m[1] = m[1].toLowerCase();
      return new Template("[@#{1}]").evaluate(m);
    },
    attr: function(m) {
      m[1] = m[1].toLowerCase();
      m[3] = m[5] || m[6];
      return new Template(Selector.xpath.operators[m[2]]).evaluate(m);
    },
    pseudo: function(m) {
      var h = Selector.xpath.pseudos[m[1]];
      if (!h) return '';
      if (Object.isFunction(h)) return h(m);
      return new Template(Selector.xpath.pseudos[m[1]]).evaluate(m);
    },
    operators: {
      '=':  "[@#{1}='#{3}']",
      '!=': "[@#{1}!='#{3}']",
      '^=': "[starts-with(@#{1}, '#{3}')]",
      '$=': "[substring(@#{1}, (string-length(@#{1}) - string-length('#{3}') + 1))='#{3}']",
      '*=': "[contains(@#{1}, '#{3}')]",
      '~=': "[contains(concat(' ', @#{1}, ' '), ' #{3} ')]",
      '|=': "[contains(concat('-', @#{1}, '-'), '-#{3}-')]"
    },
    pseudos: {
      'first-child': '[not(preceding-sibling::*)]',
      'last-child':  '[not(following-sibling::*)]',
      'only-child':  '[not(preceding-sibling::* or following-sibling::*)]',
      'empty':       "[count(*) = 0 and (count(text()) = 0)]",
      'checked':     "[@checked]",
      'disabled':    "[(@disabled) and (@type!='hidden')]",
      'enabled':     "[not(@disabled) and (@type!='hidden')]",
      'not': function(m) {
        var e = m[6], p = Selector.patterns,
            x = Selector.xpath, le, v;

        var exclusion = [];
        while (e && le != e && (/\S/).test(e)) {
          le = e;
          for (var i in p) {
            if (m = e.match(p[i])) {
              v = Object.isFunction(x[i]) ? x[i](m) : new Template(x[i]).evaluate(m);
              exclusion.push("(" + v.substring(1, v.length - 1) + ")");
              e = e.replace(m[0], '');
              break;
            }
          }
        }
        return "[not(" + exclusion.join(" and ") + ")]";
      },
      'nth-child':      function(m) {
        return Selector.xpath.pseudos.nth("(count(./preceding-sibling::*) + 1) ", m);
      },
      'nth-last-child': function(m) {
        return Selector.xpath.pseudos.nth("(count(./following-sibling::*) + 1) ", m);
      },
      'nth-of-type':    function(m) {
        return Selector.xpath.pseudos.nth("position() ", m);
      },
      'nth-last-of-type': function(m) {
        return Selector.xpath.pseudos.nth("(last() + 1 - position()) ", m);
      },
      'first-of-type':  function(m) {
        m[6] = "1"; return Selector.xpath.pseudos['nth-of-type'](m);
      },
      'last-of-type':   function(m) {
        m[6] = "1"; return Selector.xpath.pseudos['nth-last-of-type'](m);
      },
      'only-of-type':   function(m) {
        var p = Selector.xpath.pseudos; return p['first-of-type'](m) + p['last-of-type'](m);
      },
      nth: function(fragment, m) {
        var mm, formula = m[6], predicate;
        if (formula == 'even') formula = '2n+0';
        if (formula == 'odd')  formula = '2n+1';
        if (mm = formula.match(/^(\d+)$/)) // digit only
          return '[' + fragment + "= " + mm[1] + ']';
        if (mm = formula.match(/^(-?\d*)?n(([+-])(\d+))?/)) { // an+b
          if (mm[1] == "-") mm[1] = -1;
          var a = mm[1] ? Number(mm[1]) : 1;
          var b = mm[2] ? Number(mm[2]) : 0;
          predicate = "[((#{fragment} - #{b}) mod #{a} = 0) and " +
          "((#{fragment} - #{b}) div #{a} >= 0)]";
          return new Template(predicate).evaluate({
            fragment: fragment, a: a, b: b });
        }
      }
    }
  },

  criteria: {
    tagName:      'n = h.tagName(n, r, "#{1}", c);      c = false;',
    className:    'n = h.className(n, r, "#{1}", c);    c = false;',
    id:           'n = h.id(n, r, "#{1}", c);           c = false;',
    attrPresence: 'n = h.attrPresence(n, r, "#{1}", c); c = false;',
    attr: function(m) {
      m[3] = (m[5] || m[6]);
      return new Template('n = h.attr(n, r, "#{1}", "#{3}", "#{2}", c); c = false;').evaluate(m);
    },
    pseudo: function(m) {
      if (m[6]) m[6] = m[6].replace(/"/g, '\\"');
      return new Template('n = h.pseudo(n, "#{1}", "#{6}", r, c); c = false;').evaluate(m);
    },
    descendant:   'c = "descendant";',
    child:        'c = "child";',
    adjacent:     'c = "adjacent";',
    laterSibling: 'c = "laterSibling";'
  },

  patterns: {
    laterSibling: /^\s*~\s*/,
    child:        /^\s*>\s*/,
    adjacent:     /^\s*\+\s*/,
    descendant:   /^\s/,

    tagName:      /^\s*(\*|[\w\-]+)(\b|$)?/,
    id:           /^#([\w\-\*]+)(\b|$)/,
    className:    /^\.([\w\-\*]+)(\b|$)/,
    pseudo:
/^:((first|last|nth|nth-last|only)(-child|-of-type)|empty|checked|(en|dis)abled|not)(\((.*?)\))?(\b|$|(?=\s|[:+~>]))/,
    attrPresence: /^\[((?:[\w]+:)?[\w]+)\]/,
    attr:         /\[((?:[\w-]*:)?[\w-]+)\s*(?:([!^$*~|]?=)\s*((['"])([^\4]*?)\4|([^'"][^\]]*?)))?\]/
  },

  assertions: {
    tagName: function(element, matches) {
      return matches[1].toUpperCase() == element.tagName.toUpperCase();
    },

    className: function(element, matches) {
      return Element.hasClassName(element, matches[1]);
    },

    id: function(element, matches) {
      return element.id === matches[1];
    },

    attrPresence: function(element, matches) {
      return Element.hasAttribute(element, matches[1]);
    },

    attr: function(element, matches) {
      var nodeValue = Element.readAttribute(element, matches[1]);
      return nodeValue && Selector.operators[matches[2]](nodeValue, matches[5] || matches[6]);
    }
  },

  handlers: {
    concat: function(a, b) {
      for (var i = 0, node; node = b[i]; i++)
        a.push(node);
      return a;
    },

    mark: function(nodes) {
      var _true = Prototype.emptyFunction;
      for (var i = 0, node; node = nodes[i]; i++)
        node._countedByPrototype = _true;
      return nodes;
    },

    unmark: function(nodes) {
      for (var i = 0, node; node = nodes[i]; i++)
        node._countedByPrototype = undefined;
      return nodes;
    },

    index: function(parentNode, reverse, ofType) {
      parentNode._countedByPrototype = Prototype.emptyFunction;
      if (reverse) {
        for (var nodes = parentNode.childNodes, i = nodes.length - 1, j = 1; i >= 0; i--) {
          var node = nodes[i];
          if (node.nodeType == 1 && (!ofType || node._countedByPrototype)) node.nodeIndex = j++;
        }
      } else {
        for (var i = 0, j = 1, nodes = parentNode.childNodes; node = nodes[i]; i++)
          if (node.nodeType == 1 && (!ofType || node._countedByPrototype)) node.nodeIndex = j++;
      }
    },

    unique: function(nodes) {
      if (nodes.length == 0) return nodes;
      var results = [], n;
      for (var i = 0, l = nodes.length; i < l; i++)
        if (!(n = nodes[i])._countedByPrototype) {
          n._countedByPrototype = Prototype.emptyFunction;
          results.push(Element.extend(n));
        }
      return Selector.handlers.unmark(results);
    },

    descendant: function(nodes) {
      var h = Selector.handlers;
      for (var i = 0, results = [], node; node = nodes[i]; i++)
        h.concat(results, node.getElementsByTagName('*'));
      return results;
    },

    child: function(nodes) {
      var h = Selector.handlers;
      for (var i = 0, results = [], node; node = nodes[i]; i++) {
        for (var j = 0, child; child = node.childNodes[j]; j++)
          if (child.nodeType == 1 && child.tagName != '!') results.push(child);
      }
      return results;
    },

    adjacent: function(nodes) {
      for (var i = 0, results = [], node; node = nodes[i]; i++) {
        var next = this.nextElementSibling(node);
        if (next) results.push(next);
      }
      return results;
    },

    laterSibling: function(nodes) {
      var h = Selector.handlers;
      for (var i = 0, results = [], node; node = nodes[i]; i++)
        h.concat(results, Element.nextSiblings(node));
      return results;
    },

    nextElementSibling: function(node) {
      while (node = node.nextSibling)
        if (node.nodeType == 1) return node;
      return null;
    },

    previousElementSibling: function(node) {
      while (node = node.previousSibling)
        if (node.nodeType == 1) return node;
      return null;
    },

    tagName: function(nodes, root, tagName, combinator) {
      var uTagName = tagName.toUpperCase();
      var results = [], h = Selector.handlers;
      if (nodes) {
        if (combinator) {
          if (combinator == "descendant") {
            for (var i = 0, node; node = nodes[i]; i++)
              h.concat(results, node.getElementsByTagName(tagName));
            return results;
          } else nodes = this[combinator](nodes);
          if (tagName == "*") return nodes;
        }
        for (var i = 0, node; node = nodes[i]; i++)
          if (node.tagName.toUpperCase() === uTagName) results.push(node);
        return results;
      } else return root.getElementsByTagName(tagName);
    },

    id: function(nodes, root, id, combinator) {
      var targetNode = $(id), h = Selector.handlers;
      if (!targetNode) return [];
      if (!nodes && root == document) return [targetNode];
      if (nodes) {
        if (combinator) {
          if (combinator == 'child') {
            for (var i = 0, node; node = nodes[i]; i++)
              if (targetNode.parentNode == node) return [targetNode];
          } else if (combinator == 'descendant') {
            for (var i = 0, node; node = nodes[i]; i++)
              if (Element.descendantOf(targetNode, node)) return [targetNode];
          } else if (combinator == 'adjacent') {
            for (var i = 0, node; node = nodes[i]; i++)
              if (Selector.handlers.previousElementSibling(targetNode) == node)
                return [targetNode];
          } else nodes = h[combinator](nodes);
        }
        for (var i = 0, node; node = nodes[i]; i++)
          if (node == targetNode) return [targetNode];
        return [];
      }
      return (targetNode && Element.descendantOf(targetNode, root)) ? [targetNode] : [];
    },

    className: function(nodes, root, className, combinator) {
      if (nodes && combinator) nodes = this[combinator](nodes);
      return Selector.handlers.byClassName(nodes, root, className);
    },

    byClassName: function(nodes, root, className) {
      if (!nodes) nodes = Selector.handlers.descendant([root]);
      var needle = ' ' + className + ' ';
      for (var i = 0, results = [], node, nodeClassName; node = nodes[i]; i++) {
        nodeClassName = node.className;
        if (nodeClassName.length == 0) continue;
        if (nodeClassName == className || (' ' + nodeClassName + ' ').include(needle))
          results.push(node);
      }
      return results;
    },

    attrPresence: function(nodes, root, attr, combinator) {
      if (!nodes) nodes = root.getElementsByTagName("*");
      if (nodes && combinator) nodes = this[combinator](nodes);
      var results = [];
      for (var i = 0, node; node = nodes[i]; i++)
        if (Element.hasAttribute(node, attr)) results.push(node);
      return results;
    },

    attr: function(nodes, root, attr, value, operator, combinator) {
      if (!nodes) nodes = root.getElementsByTagName("*");
      if (nodes && combinator) nodes = this[combinator](nodes);
      var handler = Selector.operators[operator], results = [];
      for (var i = 0, node; node = nodes[i]; i++) {
        var nodeValue = Element.readAttribute(node, attr);
        if (nodeValue === null) continue;
        if (handler(nodeValue, value)) results.push(node);
      }
      return results;
    },

    pseudo: function(nodes, name, value, root, combinator) {
      if (nodes && combinator) nodes = this[combinator](nodes);
      if (!nodes) nodes = root.getElementsByTagName("*");
      return Selector.pseudos[name](nodes, value, root);
    }
  },

  pseudos: {
    'first-child': function(nodes, value, root) {
      for (var i = 0, results = [], node; node = nodes[i]; i++) {
        if (Selector.handlers.previousElementSibling(node)) continue;
          results.push(node);
      }
      return results;
    },
    'last-child': function(nodes, value, root) {
      for (var i = 0, results = [], node; node = nodes[i]; i++) {
        if (Selector.handlers.nextElementSibling(node)) continue;
          results.push(node);
      }
      return results;
    },
    'only-child': function(nodes, value, root) {
      var h = Selector.handlers;
      for (var i = 0, results = [], node; node = nodes[i]; i++)
        if (!h.previousElementSibling(node) && !h.nextElementSibling(node))
          results.push(node);
      return results;
    },
    'nth-child':        function(nodes, formula, root) {
      return Selector.pseudos.nth(nodes, formula, root);
    },
    'nth-last-child':   function(nodes, formula, root) {
      return Selector.pseudos.nth(nodes, formula, root, true);
    },
    'nth-of-type':      function(nodes, formula, root) {
      return Selector.pseudos.nth(nodes, formula, root, false, true);
    },
    'nth-last-of-type': function(nodes, formula, root) {
      return Selector.pseudos.nth(nodes, formula, root, true, true);
    },
    'first-of-type':    function(nodes, formula, root) {
      return Selector.pseudos.nth(nodes, "1", root, false, true);
    },
    'last-of-type':     function(nodes, formula, root) {
      return Selector.pseudos.nth(nodes, "1", root, true, true);
    },
    'only-of-type':     function(nodes, formula, root) {
      var p = Selector.pseudos;
      return p['last-of-type'](p['first-of-type'](nodes, formula, root), formula, root);
    },

    getIndices: function(a, b, total) {
      if (a == 0) return b > 0 ? [b] : [];
      return $R(1, total).inject([], function(memo, i) {
        if (0 == (i - b) % a && (i - b) / a >= 0) memo.push(i);
        return memo;
      });
    },

    nth: function(nodes, formula, root, reverse, ofType) {
      if (nodes.length == 0) return [];
      if (formula == 'even') formula = '2n+0';
      if (formula == 'odd')  formula = '2n+1';
      var h = Selector.handlers, results = [], indexed = [], m;
      h.mark(nodes);
      for (var i = 0, node; node = nodes[i]; i++) {
        if (!node.parentNode._countedByPrototype) {
          h.index(node.parentNode, reverse, ofType);
          indexed.push(node.parentNode);
        }
      }
      if (formula.match(/^\d+$/)) { // just a number
        formula = Number(formula);
        for (var i = 0, node; node = nodes[i]; i++)
          if (node.nodeIndex == formula) results.push(node);
      } else if (m = formula.match(/^(-?\d*)?n(([+-])(\d+))?/)) { // an+b
        if (m[1] == "-") m[1] = -1;
        var a = m[1] ? Number(m[1]) : 1;
        var b = m[2] ? Number(m[2]) : 0;
        var indices = Selector.pseudos.getIndices(a, b, nodes.length);
        for (var i = 0, node, l = indices.length; node = nodes[i]; i++) {
          for (var j = 0; j < l; j++)
            if (node.nodeIndex == indices[j]) results.push(node);
        }
      }
      h.unmark(nodes);
      h.unmark(indexed);
      return results;
    },

    'empty': function(nodes, value, root) {
      for (var i = 0, results = [], node; node = nodes[i]; i++) {
        if (node.tagName == '!' || node.firstChild) continue;
        results.push(node);
      }
      return results;
    },

    'not': function(nodes, selector, root) {
      var h = Selector.handlers, selectorType, m;
      var exclusions = new Selector(selector).findElements(root);
      h.mark(exclusions);
      for (var i = 0, results = [], node; node = nodes[i]; i++)
        if (!node._countedByPrototype) results.push(node);
      h.unmark(exclusions);
      return results;
    },

    'enabled': function(nodes, value, root) {
      for (var i = 0, results = [], node; node = nodes[i]; i++)
        if (!node.disabled && (!node.type || node.type !== 'hidden'))
          results.push(node);
      return results;
    },

    'disabled': function(nodes, value, root) {
      for (var i = 0, results = [], node; node = nodes[i]; i++)
        if (node.disabled) results.push(node);
      return results;
    },

    'checked': function(nodes, value, root) {
      for (var i = 0, results = [], node; node = nodes[i]; i++)
        if (node.checked) results.push(node);
      return results;
    }
  },

  operators: {
    '=':  function(nv, v) { return nv == v; },
    '!=': function(nv, v) { return nv != v; },
    '^=': function(nv, v) { return nv == v || nv && nv.startsWith(v); },
    '$=': function(nv, v) { return nv == v || nv && nv.endsWith(v); },
    '*=': function(nv, v) { return nv == v || nv && nv.include(v); },
    '$=': function(nv, v) { return nv.endsWith(v); },
    '*=': function(nv, v) { return nv.include(v); },
    '~=': function(nv, v) { return (' ' + nv + ' ').include(' ' + v + ' '); },
    '|=': function(nv, v) { return ('-' + (nv || "").toUpperCase() +
     '-').include('-' + (v || "").toUpperCase() + '-'); }
  },

  split: function(expression) {
    var expressions = [];
    expression.scan(/(([\w#:.~>+()\s-]+|\*|\[.*?\])+)\s*(,|$)/, function(m) {
      expressions.push(m[1].strip());
    });
    return expressions;
  },

  matchElements: function(elements, expression) {
    var matches = $$(expression), h = Selector.handlers;
    h.mark(matches);
    for (var i = 0, results = [], element; element = elements[i]; i++)
      if (element._countedByPrototype) results.push(element);
    h.unmark(matches);
    return results;
  },

  findElement: function(elements, expression, index) {
    if (Object.isNumber(expression)) {
      index = expression; expression = false;
    }
    return Selector.matchElements(elements, expression || '*')[index || 0];
  },

  findChildElements: function(element, expressions) {
    expressions = Selector.split(expressions.join(','));
    var results = [], h = Selector.handlers;
    for (var i = 0, l = expressions.length, selector; i < l; i++) {
      selector = new Selector(expressions[i].strip());
      h.concat(results, selector.findElements(element));
    }
    return (l > 1) ? h.unique(results) : results;
  }
});

if (Prototype.Browser.IE) {
  Object.extend(Selector.handlers, {
    concat: function(a, b) {
      for (var i = 0, node; node = b[i]; i++)
        if (node.tagName !== "!") a.push(node);
      return a;
    },

    unmark: function(nodes) {
      for (var i = 0, node; node = nodes[i]; i++)
        node.removeAttribute('_countedByPrototype');
      return nodes;
    }
  });
}

function $$() {
  return Selector.findChildElements(document, $A(arguments));
}
var Form = {
  reset: function(form) {
    $(form).reset();
    return form;
  },

  serializeElements: function(elements, options) {
    if (typeof options != 'object') options = { hash: !!options };
    else if (Object.isUndefined(options.hash)) options.hash = true;
    var key, value, submitted = false, submit = options.submit;

    var data = elements.inject({ }, function(result, element) {
      if (!element.disabled && element.name) {
        key = element.name; value = $(element).getValue();
        if (value != null && element.type != 'file' && (element.type != 'submit' || (!submitted &&
            submit !== false && (!submit || key == submit) && (submitted = true)))) {
          if (key in result) {
            if (!Object.isArray(result[key])) result[key] = [result[key]];
            result[key].push(value);
          }
          else result[key] = value;
        }
      }
      return result;
    });

    return options.hash ? data : Object.toQueryString(data);
  }
};

Form.Methods = {
  serialize: function(form, options) {
    return Form.serializeElements(Form.getElements(form), options);
  },

  getElements: function(form) {
    return $A($(form).getElementsByTagName('*')).inject([],
      function(elements, child) {
        if (Form.Element.Serializers[child.tagName.toLowerCase()])
          elements.push(Element.extend(child));
        return elements;
      }
    );
  },

  getInputs: function(form, typeName, name) {
    form = $(form);
    var inputs = form.getElementsByTagName('input');

    if (!typeName && !name) return $A(inputs).map(Element.extend);

    for (var i = 0, matchingInputs = [], length = inputs.length; i < length; i++) {
      var input = inputs[i];
      if ((typeName && input.type != typeName) || (name && input.name != name))
        continue;
      matchingInputs.push(Element.extend(input));
    }

    return matchingInputs;
  },

  disable: function(form) {
    form = $(form);
    Form.getElements(form).invoke('disable');
    return form;
  },

  enable: function(form) {
    form = $(form);
    Form.getElements(form).invoke('enable');
    return form;
  },

  findFirstElement: function(form) {
    var elements = $(form).getElements().findAll(function(element) {
      return 'hidden' != element.type && !element.disabled;
    });
    var firstByIndex = elements.findAll(function(element) {
      return element.hasAttribute('tabIndex') && element.tabIndex >= 0;
    }).sortBy(function(element) { return element.tabIndex }).first();

    return firstByIndex ? firstByIndex : elements.find(function(element) {
      return ['input', 'select', 'textarea'].include(element.tagName.toLowerCase());
    });
  },

  focusFirstElement: function(form) {
    form = $(form);
    form.findFirstElement().activate();
    return form;
  },

  request: function(form, options) {
    form = $(form), options = Object.clone(options || { });

    var params = options.parameters, action = form.readAttribute('action') || '';
    if (action.blank()) action = window.location.href;
    options.parameters = form.serialize(true);

    if (params) {
      if (Object.isString(params)) params = params.toQueryParams();
      Object.extend(options.parameters, params);
    }

    if (form.hasAttribute('method') && !options.method)
      options.method = form.method;

    return new Ajax.Request(action, options);
  }
};

/*--------------------------------------------------------------------------*/

Form.Element = {
  focus: function(element) {
    $(element).focus();
    return element;
  },

  select: function(element) {
    $(element).select();
    return element;
  }
};

Form.Element.Methods = {
  serialize: function(element) {
    element = $(element);
    if (!element.disabled && element.name) {
      var value = element.getValue();
      if (value != undefined) {
        var pair = { };
        pair[element.name] = value;
        return Object.toQueryString(pair);
      }
    }
    return '';
  },

  getValue: function(element) {
    element = $(element);
    var method = element.tagName.toLowerCase();
    return Form.Element.Serializers[method](element);
  },

  setValue: function(element, value) {
    element = $(element);
    var method = element.tagName.toLowerCase();
    Form.Element.Serializers[method](element, value);
    return element;
  },

  clear: function(element) {
    $(element).value = '';
    return element;
  },

  present: function(element) {
    return $(element).value != '';
  },

  activate: function(element) {
    element = $(element);
    try {
      element.focus();
      if (element.select && (element.tagName.toLowerCase() != 'input' ||
          !['button', 'reset', 'submit'].include(element.type)))
        element.select();
    } catch (e) { }
    return element;
  },

  disable: function(element) {
    element = $(element);
    element.disabled = true;
    return element;
  },

  enable: function(element) {
    element = $(element);
    element.disabled = false;
    return element;
  }
};

/*--------------------------------------------------------------------------*/

var Field = Form.Element;
var $F = Form.Element.Methods.getValue;

/*--------------------------------------------------------------------------*/

Form.Element.Serializers = {
  input: function(element, value) {
    switch (element.type.toLowerCase()) {
      case 'checkbox':
      case 'radio':
        return Form.Element.Serializers.inputSelector(element, value);
      default:
        return Form.Element.Serializers.textarea(element, value);
    }
  },

  inputSelector: function(element, value) {
    if (Object.isUndefined(value)) return element.checked ? element.value : null;
    else element.checked = !!value;
  },

  textarea: function(element, value) {
    if (Object.isUndefined(value)) return element.value;
    else element.value = value;
  },

  select: function(element, value) {
    if (Object.isUndefined(value))
      return this[element.type == 'select-one' ?
        'selectOne' : 'selectMany'](element);
    else {
      var opt, currentValue, single = !Object.isArray(value);
      for (var i = 0, length = element.length; i < length; i++) {
        opt = element.options[i];
        currentValue = this.optionValue(opt);
        if (single) {
          if (currentValue == value) {
            opt.selected = true;
            return;
          }
        }
        else opt.selected = value.include(currentValue);
      }
    }
  },

  selectOne: function(element) {
    var index = element.selectedIndex;
    return index >= 0 ? this.optionValue(element.options[index]) : null;
  },

  selectMany: function(element) {
    var values, length = element.length;
    if (!length) return null;

    for (var i = 0, values = []; i < length; i++) {
      var opt = element.options[i];
      if (opt.selected) values.push(this.optionValue(opt));
    }
    return values;
  },

  optionValue: function(opt) {
    return Element.extend(opt).hasAttribute('value') ? opt.value : opt.text;
  }
};

/*--------------------------------------------------------------------------*/

Abstract.TimedObserver = Class.create(PeriodicalExecuter, {
  initialize: function($super, element, frequency, callback) {
    $super(callback, frequency);
    this.element   = $(element);
    this.lastValue = this.getValue();
  },

  execute: function() {
    var value = this.getValue();
    if (Object.isString(this.lastValue) && Object.isString(value) ?
        this.lastValue != value : String(this.lastValue) != String(value)) {
      this.callback(this.element, value);
      this.lastValue = value;
    }
  }
});

Form.Element.Observer = Class.create(Abstract.TimedObserver, {
  getValue: function() {
    return Form.Element.getValue(this.element);
  }
});

Form.Observer = Class.create(Abstract.TimedObserver, {
  getValue: function() {
    return Form.serialize(this.element);
  }
});

/*--------------------------------------------------------------------------*/

Abstract.EventObserver = Class.create({
  initialize: function(element, callback) {
    this.element  = $(element);
    this.callback = callback;

    this.lastValue = this.getValue();
    if (this.element.tagName.toLowerCase() == 'form')
      this.registerFormCallbacks();
    else
      this.registerCallback(this.element);
  },

  onElementEvent: function() {
    var value = this.getValue();
    if (this.lastValue != value) {
      this.callback(this.element, value);
      this.lastValue = value;
    }
  },

  registerFormCallbacks: function() {
    Form.getElements(this.element).each(this.registerCallback, this);
  },

  registerCallback: function(element) {
    if (element.type) {
      switch (element.type.toLowerCase()) {
        case 'checkbox':
        case 'radio':
          Event.observe(element, 'click', this.onElementEvent.bind(this));
          break;
        default:
          Event.observe(element, 'change', this.onElementEvent.bind(this));
          break;
      }
    }
  }
});

Form.Element.EventObserver = Class.create(Abstract.EventObserver, {
  getValue: function() {
    return Form.Element.getValue(this.element);
  }
});

Form.EventObserver = Class.create(Abstract.EventObserver, {
  getValue: function() {
    return Form.serialize(this.element);
  }
});
if (!window.Event) var Event = { };

Object.extend(Event, {
  KEY_BACKSPACE: 8,
  KEY_TAB:       9,
  KEY_RETURN:   13,
  KEY_ESC:      27,
  KEY_LEFT:     37,
  KEY_UP:       38,
  KEY_RIGHT:    39,
  KEY_DOWN:     40,
  KEY_DELETE:   46,
  KEY_HOME:     36,
  KEY_END:      35,
  KEY_PAGEUP:   33,
  KEY_PAGEDOWN: 34,
  KEY_INSERT:   45,

  cache: { },

  relatedTarget: function(event) {
    var element;
    switch(event.type) {
      case 'mouseover': element = event.fromElement; break;
      case 'mouseout':  element = event.toElement;   break;
      default: return null;
    }
    return Element.extend(element);
  }
});

Event.Methods = (function() {
  var isButton;

  if (Prototype.Browser.IE) {
    var buttonMap = { 0: 1, 1: 4, 2: 2 };
    isButton = function(event, code) {
      return event.button == buttonMap[code];
    };

  } else if (Prototype.Browser.WebKit) {
    isButton = function(event, code) {
      switch (code) {
        case 0: return event.which == 1 && !event.metaKey;
        case 1: return event.which == 1 && event.metaKey;
        default: return false;
      }
    };

  } else {
    isButton = function(event, code) {
      return event.which ? (event.which === code + 1) : (event.button === code);
    };
  }

  return {
    isLeftClick:   function(event) { return isButton(event, 0) },
    isMiddleClick: function(event) { return isButton(event, 1) },
    isRightClick:  function(event) { return isButton(event, 2) },

    element: function(event) {
      event = Event.extend(event);

      var node          = event.target,
          type          = event.type,
          currentTarget = event.currentTarget;

      if (currentTarget && currentTarget.tagName) {
        if (type === 'load' || type === 'error' ||
          (type === 'click' && currentTarget.tagName.toLowerCase() === 'input'
            && currentTarget.type === 'radio'))
              node = currentTarget;
      }
      if (node.nodeType == Node.TEXT_NODE) node = node.parentNode;
      return Element.extend(node);
    },

    findElement: function(event, expression) {
      var element = Event.element(event);
      if (!expression) return element;
      var elements = [element].concat(element.ancestors());
      return Selector.findElement(elements, expression, 0);
    },

    pointer: function(event) {
      var docElement = document.documentElement,
      body = document.body || { scrollLeft: 0, scrollTop: 0 };
      return {
        x: event.pageX || (event.clientX +
          (docElement.scrollLeft || body.scrollLeft) -
          (docElement.clientLeft || 0)),
        y: event.pageY || (event.clientY +
          (docElement.scrollTop || body.scrollTop) -
          (docElement.clientTop || 0))
      };
    },

    pointerX: function(event) { return Event.pointer(event).x },
    pointerY: function(event) { return Event.pointer(event).y },

    stop: function(event) {
      Event.extend(event);
      event.preventDefault();
      event.stopPropagation();
      event.stopped = true;
    }
  };
})();

Event.extend = (function() {
  var methods = Object.keys(Event.Methods).inject({ }, function(m, name) {
    m[name] = Event.Methods[name].methodize();
    return m;
  });

  if (Prototype.Browser.IE) {
    Object.extend(methods, {
      stopPropagation: function() { this.cancelBubble = true },
      preventDefault:  function() { this.returnValue = false },
      inspect: function() { return "[object Event]" }
    });

    return function(event) {
      if (!event) return false;
      if (event._extendedByPrototype) return event;

      event._extendedByPrototype = Prototype.emptyFunction;
      var pointer = Event.pointer(event);
      Object.extend(event, {
        target: event.srcElement,
        relatedTarget: Event.relatedTarget(event),
        pageX:  pointer.x,
        pageY:  pointer.y
      });
      return Object.extend(event, methods);
    };

  } else {
    Event.prototype = Event.prototype || document.createEvent("HTMLEvents")['__proto__'];
    Object.extend(Event.prototype, methods);
    return Prototype.K;
  }
})();

Object.extend(Event, (function() {
  var cache = Event.cache;

  function getEventID(element) {
    if (element._prototypeEventID) return element._prototypeEventID[0];
    arguments.callee.id = arguments.callee.id || 1;
    return element._prototypeEventID = [++arguments.callee.id];
  }

  function getDOMEventName(eventName) {
    if (eventName && eventName.include(':')) return "dataavailable";
    return eventName;
  }

  function getCacheForID(id) {
    return cache[id] = cache[id] || { };
  }

  function getWrappersForEventName(id, eventName) {
    var c = getCacheForID(id);
    return c[eventName] = c[eventName] || [];
  }

  function createWrapper(element, eventName, handler) {
    var id = getEventID(element);
    var c = getWrappersForEventName(id, eventName);
    if (c.pluck("handler").include(handler)) return false;

    var wrapper = function(event) {
      if (!Event || !Event.extend ||
        (event.eventName && event.eventName != eventName))
          return false;

      Event.extend(event);
      handler.call(element, event);
    };

    wrapper.handler = handler;
    c.push(wrapper);
    return wrapper;
  }

  function findWrapper(id, eventName, handler) {
    var c = getWrappersForEventName(id, eventName);
    return c.find(function(wrapper) { return wrapper.handler == handler });
  }

  function destroyWrapper(id, eventName, handler) {
    var c = getCacheForID(id);
    if (!c[eventName]) return false;
    c[eventName] = c[eventName].without(findWrapper(id, eventName, handler));
  }

  function destroyCache() {
    for (var id in cache)
      for (var eventName in cache[id])
        cache[id][eventName] = null;
  }


  if (window.attachEvent) {
    window.attachEvent("onunload", destroyCache);
  }

  if (Prototype.Browser.WebKit) {
    window.addEventListener('unload', Prototype.emptyFunction, false);
  }

  return {
    observe: function(element, eventName, handler) {
      element = $(element);
      var name = getDOMEventName(eventName);

      var wrapper = createWrapper(element, eventName, handler);
      if (!wrapper) return element;

      if (element.addEventListener) {
        element.addEventListener(name, wrapper, false);
      } else {
        element.attachEvent("on" + name, wrapper);
      }

      return element;
    },

    stopObserving: function(element, eventName, handler) {
      element = $(element);
      var id = getEventID(element), name = getDOMEventName(eventName);

      if (!handler && eventName) {
        getWrappersForEventName(id, eventName).each(function(wrapper) {
          element.stopObserving(eventName, wrapper.handler);
        });
        return element;

      } else if (!eventName) {
        Object.keys(getCacheForID(id)).each(function(eventName) {
          element.stopObserving(eventName);
        });
        return element;
      }

      var wrapper = findWrapper(id, eventName, handler);
      if (!wrapper) return element;

      if (element.removeEventListener) {
        element.removeEventListener(name, wrapper, false);
      } else {
        element.detachEvent("on" + name, wrapper);
      }

      destroyWrapper(id, eventName, handler);

      return element;
    },

    fire: function(element, eventName, memo) {
      element = $(element);
      if (element == document && document.createEvent && !element.dispatchEvent)
        element = document.documentElement;

      var event;
      if (document.createEvent) {
        event = document.createEvent("HTMLEvents");
        event.initEvent("dataavailable", true, true);
      } else {
        event = document.createEventObject();
        event.eventType = "ondataavailable";
      }

      event.eventName = eventName;
      event.memo = memo || { };

      if (document.createEvent) {
        element.dispatchEvent(event);
      } else {
        element.fireEvent(event.eventType, event);
      }

      return Event.extend(event);
    }
  };
})());

Object.extend(Event, Event.Methods);

Element.addMethods({
  fire:          Event.fire,
  observe:       Event.observe,
  stopObserving: Event.stopObserving
});

Object.extend(document, {
  fire:          Element.Methods.fire.methodize(),
  observe:       Element.Methods.observe.methodize(),
  stopObserving: Element.Methods.stopObserving.methodize(),
  loaded:        false
});

(function() {
  /* Support for the DOMContentLoaded event is based on work by Dan Webb,
     Matthias Miller, Dean Edwards and John Resig. */

  var timer;

  function fireContentLoadedEvent() {
    if (document.loaded) return;
    if (timer) window.clearInterval(timer);
    document.fire("dom:loaded");
    document.loaded = true;
  }

  if (document.addEventListener) {
    if (Prototype.Browser.WebKit) {
      timer = window.setInterval(function() {
        if (/loaded|complete/.test(document.readyState))
          fireContentLoadedEvent();
      }, 0);

      Event.observe(window, "load", fireContentLoadedEvent);

    } else {
      document.addEventListener("DOMContentLoaded",
        fireContentLoadedEvent, false);
    }

  } else {
    document.write("<script id=__onDOMContentLoaded defer src=//:><\/script>");
    $("__onDOMContentLoaded").onreadystatechange = function() {
      if (this.readyState == "complete") {
        this.onreadystatechange = null;
        fireContentLoadedEvent();
      }
    };
  }
})();
/*------------------------------- DEPRECATED -------------------------------*/

Hash.toQueryString = Object.toQueryString;

var Toggle = { display: Element.toggle };

Element.Methods.childOf = Element.Methods.descendantOf;

var Insertion = {
  Before: function(element, content) {
    return Element.insert(element, {before:content});
  },

  Top: function(element, content) {
    return Element.insert(element, {top:content});
  },

  Bottom: function(element, content) {
    return Element.insert(element, {bottom:content});
  },

  After: function(element, content) {
    return Element.insert(element, {after:content});
  }
};

var $continue = new Error('"throw $continue" is deprecated, use "return" instead');

var Position = {
  includeScrollOffsets: false,

  prepare: function() {
    this.deltaX =  window.pageXOffset
                || document.documentElement.scrollLeft
                || document.body.scrollLeft
                || 0;
    this.deltaY =  window.pageYOffset
                || document.documentElement.scrollTop
                || document.body.scrollTop
                || 0;
  },

  within: function(element, x, y) {
    if (this.includeScrollOffsets)
      return this.withinIncludingScrolloffsets(element, x, y);
    this.xcomp = x;
    this.ycomp = y;
    this.offset = Element.cumulativeOffset(element);

    return (y >= this.offset[1] &&
            y <  this.offset[1] + element.offsetHeight &&
            x >= this.offset[0] &&
            x <  this.offset[0] + element.offsetWidth);
  },

  withinIncludingScrolloffsets: function(element, x, y) {
    var offsetcache = Element.cumulativeScrollOffset(element);

    this.xcomp = x + offsetcache[0] - this.deltaX;
    this.ycomp = y + offsetcache[1] - this.deltaY;
    this.offset = Element.cumulativeOffset(element);

    return (this.ycomp >= this.offset[1] &&
            this.ycomp <  this.offset[1] + element.offsetHeight &&
            this.xcomp >= this.offset[0] &&
            this.xcomp <  this.offset[0] + element.offsetWidth);
  },

  overlap: function(mode, element) {
    if (!mode) return 0;
    if (mode == 'vertical')
      return ((this.offset[1] + element.offsetHeight) - this.ycomp) /
        element.offsetHeight;
    if (mode == 'horizontal')
      return ((this.offset[0] + element.offsetWidth) - this.xcomp) /
        element.offsetWidth;
  },


  cumulativeOffset: Element.Methods.cumulativeOffset,

  positionedOffset: Element.Methods.positionedOffset,

  absolutize: function(element) {
    Position.prepare();
    return Element.absolutize(element);
  },

  relativize: function(element) {
    Position.prepare();
    return Element.relativize(element);
  },

  realOffset: Element.Methods.cumulativeScrollOffset,

  offsetParent: Element.Methods.getOffsetParent,

  page: Element.Methods.viewportOffset,

  clone: function(source, target, options) {
    options = options || { };
    return Element.clonePosition(target, source, options);
  }
};

/*--------------------------------------------------------------------------*/

if (!document.getElementsByClassName) document.getElementsByClassName = function(instanceMethods){
  function iter(name) {
    return name.blank() ? null : "[contains(concat(' ', @class, ' '), ' " + name + " ')]";
  }

  instanceMethods.getElementsByClassName = Prototype.BrowserFeatures.XPath ?
  function(element, className) {
    className = className.toString().strip();
    var cond = /\s/.test(className) ? $w(className).map(iter).join('') : iter(className);
    return cond ? document._getElementsByXPath('.//*' + cond, element) : [];
  } : function(element, className) {
    className = className.toString().strip();
    var elements = [], classNames = (/\s/.test(className) ? $w(className) : null);
    if (!classNames && !className) return elements;

    var nodes = $(element).getElementsByTagName('*');
    className = ' ' + className + ' ';

    for (var i = 0, child, cn; child = nodes[i]; i++) {
      if (child.className && (cn = ' ' + child.className + ' ') && (cn.include(className) ||
          (classNames && classNames.all(function(name) {
            return !name.toString().blank() && cn.include(' ' + name + ' ');
          }))))
        elements.push(Element.extend(child));
    }
    return elements;
  };

  return function(className, parentElement) {
    return $(parentElement || document.body).getElementsByClassName(className);
  };
}(Element.Methods);

/*--------------------------------------------------------------------------*/

Element.ClassNames = Class.create();
Element.ClassNames.prototype = {
  initialize: function(element) {
    this.element = $(element);
  },

  _each: function(iterator) {
    this.element.className.split(/\s+/).select(function(name) {
      return name.length > 0;
    })._each(iterator);
  },

  set: function(className) {
    this.element.className = className;
  },

  add: function(classNameToAdd) {
    if (this.include(classNameToAdd)) return;
    this.set($A(this).concat(classNameToAdd).join(' '));
  },

  remove: function(classNameToRemove) {
    if (!this.include(classNameToRemove)) return;
    this.set($A(this).without(classNameToRemove).join(' '));
  },

  toString: function() {
    return $A(this).join(' ');
  }
};

Object.extend(Element.ClassNames.prototype, Enumerable);

/*--------------------------------------------------------------------------*/

Element.addMethods();
/**
  main namespace for the library
*/
var Siesta = {};

/**
  By default the framework is not packaged.
  This setting will be overriden by sprockets
  when requiring the next script
*/
Siesta.isPackaged = false;
Siesta.isPackaged = true;

/**
  main namespace for the framework
*/
Siesta.Framework = {};

/**
  constants

*/
Siesta.Constants = {};
Siesta.Constants.SUCCESS = "success";
Siesta.Constants.FAILURE = "failure";

/**
  Checks if one function is defined in the
  runtime.
  - fn : Lambda function wrapping the symbol
         to check.
*/
Siesta.defined = function(fn) {
  try {
    fn();
    return true;
  } catch(ex) {
    return false;
  }
};


/**
  Tests if we are executing under Rhino
*/
Siesta.isRhino = function() {
    return Siesta.defined(function(){gc});
};

/**
  Returns the current path in the browser till the last '/' (not included)
*/
Siesta.currentPath = function() {
        return location.href.split("/").slice(0,-1).join("/");
};


/**
  generic load of scripts it should load
  with the Rhino 'load' function or with
  the javascript framework in the browser
  - scriptPath : path to the script to load.
*/
Siesta.load = function(scriptPath)  {
    if(Siesta.isRhino()) {
	load(scriptPath);
    } else {
        var thePath = "";
        for(i = 0; i<arguments.length; i++) {
            if(i!=0) {
                thePath = thePath.concat("/").concat(arguments[i]);
            } else {
                thePath = thePath.concat(arguments[i]);
            }
        }
        var e = document.createElement("script");
        e.src = thePath;
        e.type="text/javascript";
        document.getElementsByTagName("head")[0].appendChild(e);
    }
};

/**
  load scripts from the path specified from the initial base directory
  - scriptPath : path to the script to load.
*/
Siesta.loadFromBase = function(scriptPath)  {
    if(Siesta.isRhino()) {
	load(scriptPath);
    } else {
        var thePath = "/";
        try{
            var thePath = Siesta.basePath();
        }catch(e) {}
        for(i = 0; i<arguments.length; i++) {
            thePath = thePath.concat("/").concat(arguments[i]);
        }
        var e = document.createElement("script");
        e.src = thePath;
        e.type="text/javascript";
        document.getElementsByTagName("head")[0].appendChild(e);
    }
};

/**
  Allow the enumeration of object methods in Rhino
*/
/*
Object.prototype.methods = function() {
    var ms = [];
    counter = 0;
    for(var i in this) {
        ms[counter] = i;
        if(Siesta.isRhino()) {
            print(counter+": "+i);
        }
        counter++;
    }

    ms;
}
*/

/**
 *  Let's load microtype if we are in
 *  Rhino to have basic class support.
 *  If we're in a browser, Prototype
 *  will be loaded.
 */
if(Siesta.isRhino()) {
    load("microtype.js");
}

/**
 *  Registers a new namespace in the javascript
 *  runtime.
 */
Siesta.registerNamespace = function() {
    var nsPath = "";
    for (var i=0; i<arguments.length; i++) {
        var ns = arguments[i];
        if(nsPath != "") {
            nsPath = nsPath + ".";
        }
        var nsPath = nsPath + ns;
        try {
            var res = eval(nsPath);
            if(res == null) {
                throw new Exception();
            }
        } catch(e) {
            eval(nsPath + " = {};");
        }
    }
}

/**
 *  Namespace object definition.
 *  Stores a name and url for the namespace.
 */
Siesta.Framework.Namespace = Class.create();
Siesta.Framework.Namespace.prototype = {

    /**
     *  Builds a new namespace.
     *
     *  @arguments
     *  - name: the name of the namespace.
     *  - uri: the uri of this namespace.
     */
    initialize: function(name,uri) {
        this.name = name;
        this.uri = uri;
        this.__type = 'namespace';
    }
};

/**
 *  Uri object definition.
 *  Stores a a Uri for the namespace.
 */
Siesta.Framework.Uri = Class.create();
Siesta.Framework.Uri.prototype = {

    /**
     *  Builds a new Uri object.
     *
     *  @arguments
     *  - namespace: optional prefix of a namespace.
     *  - value: mandatory value for the URI.
     *
     *  @throws
     *  - an exception is thrown if no value or namespace and value are given.
     */
    initialize: function() {
        if(arguments.length == 2) {
            this.namespace = arguments[0];
            this.value = arguments[1];
        } else if(arguments.length == 1) {
            this.value = arguments[0];
            this.namespace = null;
        } else {
            throw new Error("Trying to create null Siesta.Framework.Uri");
        }
        this.__type = 'uri';
    },

    /**
     * Human readable representation of this URI
     */
    toString: function() {
        if(this.namespace == null) {
            return this.value;
        } else {
            return this.namespace + this.value;
        }
    }
};

/**
 *  BlankNode object definition.
 */
Siesta.Framework.BlankNode = Class.create();
Siesta.Framework.BlankNode.prototype = {

    /**
     *  Builds a new BlankNode object.
     *
     *  @arguments
     *  - identifier: the identifier of the blank node.
     *
     */
    initialize: function(identifier) {
        if(identifier == null) {
            throw new Error("Trying to create a Siesta.Framework.BlankNode with a null identifier");
        }

        this.value = identifier;
        this.__type = 'blanknode';
    },

    /**
     * Human readable representation of this URI
     */
    toString: function() {
        return "_:"+this.value;
    }
};


/**
 *  Literal object definition.
 */
Siesta.Framework.Literal = Class.create();
Siesta.Framework.Literal.prototype = {

    /**
     *  Builds a new Literal object.
     *
     *  @arguments
     *  - object with the following fields:
     *    - value: mandator value for the literal.
     *    - language: optional language for the literal.
     *    - type: optional Siesta.framework.Uri for the type.
     *
     *  @throws
     *  - an exception is thrown if no value or namespace and value are given.
     */
    initialize: function(options) {
        if(options.value == null) {
            throw new Error("Trying to create null Siesta.Framework.Literal");


        } else if(arguments.length == 1) {

            this.value = options.value;
            this.language = options.language;
            this.type = options.type

        } else {

            throw new Error("Trying to set up the type of Siesta.Framework.Literal with a more than one argument");

        }
        this.__type = 'literal';
    },

    /**
     * Human readable representation of this URI
     */
    toString: function() {
        var str = '"'+this.value+'"';
        if(this.type != null) {
            str = str+"^^"+this.type.toString();
        }
        if(this.language != null) {
            str = str+"@"+this.language;
        }

        return str;
    }
};

/**
 *  Triple object definition to
 *  be shared between drivers
 *
 *  A Siesta triple is basically a container for
 *  the subject, predicate and object of the
 *  triple.
 */
Siesta.Framework.Triple = Class.create();
Siesta.Framework.Triple.prototype = {
    /**
     * Builds a new Triple.
     * Every argument is optional.
     *
     * @arguments:
     * - subject: the subject of the triple.
     * - predicate: the predicate of the triple.
     * - object: the object of the triple.
     */
    initialize: function() {
        if(arguments.length == 3) {
            this.subject = arguments[0];
            this.predicate = arguments[1];
            this.object = arguments[2];
        } else if(arguments.length == 2) {
            this.subject = arguments[0];
            this.predicate = arguments[1];
            this.object = null;
        } else if(arguments.length == 1) {
            this.subject = arguments[0];
            this.predicate = null;
            this.object = null;
        } else {
            this.subject = null;
            this.predicate = null;
            this.object = null;
        }
        this.__type = 'triple';
    },

    /**
     * Test if subject, predicate and object
     * are set for this triple.
     *
     * @returns Bool
     */
    isValid: function() {
        return (this.subject != null &&
                this.predicate != null &&
                this.object != null)
    },

    /**
     *  Human readable representation of this triple.
     */
    toString: function() {
        return "("+this.subject+","+this.predicate+","+this.object+")";
    }
};

/**
 *  Graph object definition to
 *  be shared between drivers
 *
 *  A Siesta graph is basically a container of triples,
 *  each driver must manipulate this graph and
 *  transform it to their native representation.
 */
Siesta.Framework.Graph = Class.create();
Siesta.Framework.Graph.prototype = {
    initialize: function() {

        this.namespaces = {};

        this.invNamespaces = {};

        this.triples = {};

        this.triplesCache = [];

        this.baseUri = null;

    },

    /**
     *  Adds a new namespace to this graph.
     *
     *  @arguments
     *  - aNamespace: the namespace to be added
     */
    addNamespace: function(aNamespace /* Siesta.Framework.Namespace */) {
        this.namespaces[aNamespace.name] = aNamespace.uri;
        this.invNamespaces[aNamespace.uri] = aNamespace.name;
    },

    /**
     *  Adds one triple to the index
     *
     *  @arguments
     *  - aTriple: the triple to be added.
     */
    addTriple: function(aTriple /* Siesta.Framework.Triple */) {

        if(aTriple.__type != 'triple') {
            throw "Trying to add something different of a Siesta.Framework.Triple to a Siesta.Framework.Graph";
        } else {

            var wasInserted = this.__addTripleByObject(aTriple,
                this.__addTripleByPredicate(aTriple,
                this.__addTripleBySubject(aTriple)));
            if(wasInserted == true) {
                this.triplesCache.push(aTriple);
            }
        }
    },

    /**
     *  Returns all the triples stored in the graph as an array.
     */
    triplesArray: function() {
        return this.triplesCache;
    },

    /*
     *  Private methods
     */

    /**
     *  Looks in the subject index of the triple hash.
     *
     *  @arguments:
     *  - aTriple: the triple to insert.
     *
     *  @returns:
     *  - a hash for the triples with the same predicate than the triple to store.
     */
    __addTripleBySubject: function(aTriple /* Siesta.Framework.Triple */) {
        var identifier = null;

        switch(aTriple.subject.__type) {
        case 'uri':
            identifier = this.__normalizeUri(aTriple.subject);
            break;
        case 'blanknode':
            identifier = aTriple.subject.value;
            break;
        case 'literal':
            identifier = this.__normalizeLiteral(aTriple.subject);
            break;
        }

        if(this.triples[identifier] == null) {
            this.triples[identifier] = {};
        }
        return this.triples[identifier];

    },

    /**
     *  Looks in the predicate index of the triple hash.
     *
     *  @arguments:
     *  - aTriple: the triple to insert.
     *  - predicates: a hash with the predicates for the triples with the same subject
     *
     *  @returns:
     *  - a hash for the triples with the same predicate than the triple to store.
     */
    __addTripleByPredicate: function(aTriple /* Siesta.Framework.Triple */,predicates) {
        var identifier = null;

        switch(aTriple.predicate.__type) {
        case 'uri':
            identifier = this.__normalizeUri(aTriple.predicate);
            break;
        case 'blanknode':
            identifier = aTriple.predicate.value;
            break;
        case 'literal':
            identifier = this.__normalizeLiteral(aTriple.predicate);
            break;
        }

        if(predicates[identifier] == null) {
            predicates[identifier] = {};
        }
        return predicates[identifier];

    },

    /**
     *  Looks in the object index of the triple hash.
     *
     *  @argument aTriple: the triple to insert.
     *  @argument objects: a hash with the objects for the triples with the same subject
     *
     *  @returns true if the triple is inserted, false if it was already inserted
     */
    __addTripleByObject: function(aTriple /* Siesta.Framework.Triple */,objects) {
        var identifier = null;

        switch(aTriple.object.__type) {
        case 'uri':
            identifier = this.__normalizeUri(aTriple.object);
            break;
        case 'blanknode':
            identifier = aTriple.object.value;
            break;
        case 'literal':
            identifier = this.__normalizeLiteral(aTriple.object);
            break;
        }

        if(objects[identifier] == null) {
            objects[identifier] = aTriple;
            return true;
        } else {
            return false;
        }

    },

    /**
     *  Generates a String key for this URI expanding the possible namespace
     *  of the URI if it is registered in the namespaces of the graph
     *
     *  @arguments aUri: a Siesta.Framework.Uri to be normalized.
     *
     *  @returns a String normalized for this URI.
     */
    __normalizeUri: function(aUri /* Siesta.Framework.Uri */) {
        if(aUri.namespace == null) {
            return aUri.value;
        } else {
            if(this.namespaces[aUri.namespace] != null) {
                return this.namespaces[aUri.namespace] + aUri.value;
            } else {
                return aUri.namespace + aUri.value;
            }
        }
    },

    /**
     *  Generates a String key for this literal expanding the possible type
     *  URI if its namespace is registered in the namespaces of the graph
     *
     *  @argument aLiteral: a Siesta.Framework.Literal to be normalized.
     *
     *  @returns a String normalized for this literal.
     */
    __normalizeLiteral: function(aLiteral /* Siesta.Framework.Literal */) {
        var str = '"'+aLiteral.value+'"';
        if(aLiteral.type != null) {
            str = str+"^^"+this.__normalizeUri(aLiteral.type);
        }
        if(aLiteral.language != null) {
            str = str+"@"+aLiteral.language;
        }

        return str;
    }


};

/*                                              Utils                                                         */

Siesta.registerNamespace("Siesta","Utils");

Siesta.Utils.Sequentializer = Class.create();
/**
  @class Siesta.Utils.Network.SequentialRemoteRequester

  Helper class for easing the creation of sequential asynchronous calls.
*/
Siesta.Utils.Sequentializer.prototype = {
    /**
     * @constructor
     *
     * Builds a new requester.
     */
    initialize: function() {
        this._requestsQueue = [];
        this._finishedCallback = null;
    },

    /**
     * Adds a remote request to the queue of requests.
     *
     * @argument remoteRequest, function containing the invocation
     */
    addRemoteRequest: function(remoteRequest) {
        this._requestsQueue.push(remoteRequest);
    },

    /**
     * Adds a remote request to the queue of requests and passes the argument to it.
     * The callback function must accept one parameter.
     *
     * @argument remoteRequest, function containing the invocation.
     * @argument env, the environment to pass to the function.
     */
    addRemoteRequestWithEnv: function(remoteRequest,env) {
        this._requestsQueue.push(function(){ remoteRequest(env) });
    },

    /**
     * Sets the function that will be optionally invoked
     * when all the requests have been processed.
     *
     * @argument callback, the function to be invoked.
     */
    finishedCallback: function(callback) {
        this._finishedCallback = callback;
    },

    /**
     * This funcition must be invoked in the callbacks of the remote requests
     * callbacks to notify the request has finished.
     */
    notifyRequestFinished: function() {
        this._nextRequest();
    },

    /**
     * Starts the processing of the requests.
     */
    start: function() {
        this._nextRequest();
    },

    _nextRequest: function() {
        if(this._requestsQueue.length == 0) {
            this._finishedCallback();
        } else {
            (this._requestsQueue.pop())();
        }
    }
};

/*                                              Model Layer                                                   */

/**
  Capitalize function
*/
String.prototype.capitalize = function(){ //v1.0
    return this.replace(/\w+/g, function(a){
        return a.charAt(0).toUpperCase() + a.substr(1).toLowerCase();
    });
};

Siesta.registerNamespace("Siesta","Model");
Siesta.registerNamespace("Siesta","Model","Repositories");
Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
Siesta.Model.Repositories.schemas = new Siesta.Framework.Graph();
Siesta.Model.Repositories.data = new Siesta.Framework.Graph();


Siesta.registerNamespace("Siesta","Services");


/**
 Callback function for registering of services if AJAX used

 @argumet serviceDescription: the text with the description of the service in any format.
*/
Siesta.Services.onRegisteredServiceAjax = function(serviceDescription) {

};

Siesta.Services.chooseFormaterFor = function(document) {
    var format = Siesta.Framework.Common.determineFormat(document);
    var formater = null;

    if(format == "xml") {
        formater = Siesta.Formats.Xml;
    } else if(format == "turtle") {
        formater = Siesta.Formats.Turtle;
    }

    return formater;
};

Siesta.Services.TRIPLET_CHANGE_EVENT = "TRIPLET_CHANGE_EVENT";

/**
  Parses a new doc and add the parsed triplets to the provided repository.

  @argument doc, to be parsed in a valid format: N3, XML, JSON...
  @argument repository, the repository where the triplets will be added.

  @returns throw a Siesta.Services.TRIPLET_CHANGE_EVENT with an object message including the repository \
where the triplets have been added an the graph from the document.
 */
Siesta.Services.parseAndAddToRepository = function(doc,repository) {
    var  formater = Siesta.Services.chooseFormaterFor(doc);

    var parsedGraph = formater.parseDoc("",doc);
    for(_i=0; _i< parsedGraph.triplesArray().length; _i++) {
        repository.addTriple(parsedGraph.triplesArray()[_i]);
    }

    var resp = {
        repository: repository,
        parsedGraph: parsedGraph
    };

    Siesta.Events.notifyEvent(this,Siesta.Services.TRIPLET_CHANGE_EVENT,resp);
};

/**
 Callback function for registering of services if JSONP used

 @argumet serviceDescription: the text with the description of the service in any format.
*/
Siesta.Services.onRegisteredServiceJsonp = function(serviceDescription) {
    try {
        var format = Siesta.Framework.Common.determineFormat(serviceDescription);
        var formater = null;

        if(format == "xml") {
            formater = Siesta.Formats.Xml;
        } else if(format == "turtle") {
            formater = Siesta.Formats.Turtle;
        }

        var parsedGraph = formater.parseDoc("",serviceDescription);
        for(_i=0; _i< parsedGraph.triplesArray().length; _i++) {
            Siesta.Model.Repositories.services.addTriple(parsedGraph.triplesArray()[_i]);
        }

        for(_f=0; _f<Siesta.Services.serviceRegistrationCallbacks.length; _f++) {
            serviceRegistrationCallbacks[_f].call(Siesta.Constants.SUCCESS,parsedGraph);
        }
    } catch(e) {
        for(_f=0; _f<Siesta.Services.serviceRegistrationCallbacks.length; _f++) {
            serviceRegistrationCallbacks[_f].call(Siesta.Constants.FAILURE,e);
        }
    }
};

/**
  Starts the registrations of a service.
  The user must provide the URL of the service and the network transport mechanism to retrieve
  the service: "ajax" or "jsonp" are valid transport mechanisms.
  If "jsonp" is chosen as the transport mechanism, and additional parameter is accepted with
  the value for the callback function parameter, if none is provided 'callback' will be used.


   @argument serviceUrl: URL of the service
   @argument networkTransport: transport mechanism, 'ajax' or 'jsonp' are valid
   @argument callback (optional): an optional third parameter with the name used for the callback parameter if jsonp is used as mechanim.
*/
Siesta.Services.registerService = function(serviceUrl, networkTransport /*, callback (optional)*/) {
    if(networkTransport == "jsonp") {
        var callbackParam = arguments[2] || "callback";
        Siesta.Network.jsonpRequest(serviceUrl,callbackParam, "Siesta.Services.onRegisteredServiceJsonp");
    } else if(networkTransport == "ajax"){
        throw new Error("not implemented yet");
    } else {
        throw new Error("uknown transport: "+networkTransport);
    }
};

Siesta.Services.serviceRegistrationCallbacks = [];
/**
  Registers a function that will be notified with success or failure after
  a service registration trial.

  @argument callback: the function to be notified, it must receive two arguments, a status and a value.
*/
Siesta.Services.addServiceRegistrationCallback = function(callback) {
    Siesta.Services.serviceRegistrationCallbacks.push(callback);
}

Siesta.registerNamespace("Siesta","Framework","Common");
/**
  Try to determine the format of the test passed as a parameter.

  @argument documentText: the text to be checked.

  @returns "turtle" or "xml"

  @throws Error if no format can be determined.
*/
Siesta.Framework.Common.determineFormat = function(documentText) {
    if(documentText.indexOf("<rdf:RDF") != -1 ||
       documentText.indexOf("<?xml") != -1 ) {
        return "xml";
    } else if(documentText.indexOf("@prefix") != -1 ||
              documentText.indexOf(".") != -1) {
        return "turtle";
    } else {
        throw new Error("Unknown format");
    }
};

Siesta.Services.RestfulOperationInputParameter = Class.create();
/**
  @class Siesta.Services.RestfulOperationInputParameter

  An input parameter for a hRESTS operation of a hRESTS service.
*/
Siesta.Services.RestfulOperationInputParameter.prototype = {
    /**
     * @constructor
     *
     * Initiates a new RestfulOperationInputParameter object with the
     * the data associated to the URI passed as an
     * argument in the constructor.
     *
     * Triplets are looked up in the Siesta.Model.Repositories.services repository,
     * they must have been retrieved first via a callo to Siesta.Services.registerService.
     *
     * @see Siesta.Services.registerService
     *
     * @argument parameterUri: input message URI (blank node identifier), a Siesta.Framework.Uri object, a Siesta.Framework.BlankNode or a String
     */
    initialize: function(parameterUri) {
        this.uri = parameterUri;
        this.uriInQuery = this.uri;
        if(parameterUri.__type == 'uri') {
            this.uri = uri.toString();
            this.uriInQuery = "<"+this.uri+">";
        } else if(parameterUri.__type == 'blanknode') {
            this.uri = uri.toString();
            this.uriInQuery = this.uri;
        }

        this._type = null;
        this._parameterName = null;
    },

    type: function() {
        if(this._type != null) {
            return this._type;
        } else {
            var query = "SELECT ?type WHERE {  " + this.uriInQuery + " <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "?type } ";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            if(result.length != 1) {
                throw new Error("Error retrieving the type for the input parameter "+this.uri);
            } else {
                this._type = result[0].type.value
            }
            return this._type;
        }
    },

    parameterName: function() {
        if(this._parameterName != null) {
            return this._parameterName;
        } else {
            var query = "SELECT ?name WHERE {  " + this.uriInQuery + " <http://www.wsmo.org/ns/hrests#parameterName> " + "?name } ";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            if(result.length != 1) {
                throw new Error("Error retrieving the parameterName for the input parameter "+this.uri);
            } else {
                this._parameterName = result[0].name.value
            }
            return this._parameterName;
        }
    }
};

Siesta.Services.RestfulOperationInputMessage = Class.create();
/**
  @class Siesta.Services.RestfulOperationInputMessage

  An input message for a hRESTS operation of a hRESTS service.
*/
Siesta.Services.RestfulOperationInputMessage.prototype = {
    /**
     * @constructor
     *
     * Initiates a new RestfulOperationInputMessage object with the
     * the data associated to the URI passed as an
     * argument in the constructor.
     *
     * Triplets are looked up in the Siesta.Model.Repositories.services repository,
     * they must have been retrieved first via a callo to Siesta.Services.registerService.
     *
     * @see Siesta.Services.registerService
     *
     * @argument messageUri: input message URI (blank node identifier), a Siesta.Framework.Uri object, a Siesta.Framework.BlankNode or a String
     */
    initialize: function(messageUri) {
        this.uri = messageUri;
        this.uriInQuery = this.uri;
        if(messageUri.__type == 'uri') {
            this.uri = uri.toString();
            this.uriInQuery = "<"+this.uri+">";
        } else if(messageUri.__type == 'blanknode') {
            this.uri = uri.toString();
            this.uriInQuery = this.uri;
        }

        this._modelReference = null;
        this._loweringSchemaMapping = null;
        this.loweringSchemaMappingContent = null;
        this.connected = false;
        this._model = null;
        this_transportMechanism = null;
    },

    modelReference: function() {
        if(this._modelReference != null) {
            return this._modelReference;
        } else {

            var query = "SELECT ?model WHERE {  " + this.uriInQuery + " <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "<http://www.wsmo.org/ns/wsmo-lite#Message> . ";
            query = query + this.uriInQuery +" <http://www.w3.org/ns/sawsdl#modelReference> ?model }";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            if(result.length != 1) {
                throw new Error("Error retrieving the modelReference for the input message "+this.uri);
            } else {
/*
                var found = false;
                for(_i=0; _i<result.length; _i++) {
                    if(result[_i].id.toString() == this.uriInQuery) {
                        found = true;
                        this._modelReference = result[0].model.value;
                        break;
                    }
                }
                if(!found) {
                    throw new Error("Error retrieving the modelReference for the input message "+this.uri);
                }
*/
                this._modelReference = result[0].model.value
            }
            return this._modelReference;
        }
    },

    loweringSchemaMapping: function() {
        if(this._loweringSchemaMapping != null) {
            return this._loweringSchemaMapping;
        } else {
            var query = "SELECT ?schema WHERE {  " + this.uriInQuery + " <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "<http://www.wsmo.org/ns/wsmo-lite#Message> . ";
            query = query + this.uriInQuery +" <http://www.w3.org/ns/sawsdl#loweringSchemaMapping> ?schema }";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            if(result.length != 1) {
                throw new Error("Error retrieving the loweringSchemaMapping for the input message "+this.uri);
            } else {
                this._loweringSchemaMapping = result[0].schema.value
            }
            return this._loweringSchemaMapping;
        }
    },

    model: function() {
        if(this._model != null) {
            return this._model;
        } else {
            if(this.modelReference() != null) {
                this._model = new Siesta.Model.Schema(this.modelReference());
            }
        }
    },

    /**
       Retrieves all the remote references of this message.

       @returns The method sends the event: EVENT_MESSAGE_LOADED
    */
    connect: function(mechanism) {
        this._transportMechanism = mechanism;
        if(this.connected == false) {
            if(this.model() == null) {
                try {
                    if(mechanism == "jsonp") {
                        var callback = "callback";
                        if(arguments.length == 2) {
                            callback = arguments[1];
                        }
                        var that = this;
                        Siesta.Network.jsonpRequestForFunction(this.modelReference(),callback,function(resp){
                            Siesta.Services.parseAndAddToRepository(resp,Siesta.Model.Repositories.schemas);
                            that.model();

                            that._retrieveLoweringSchemaMapping(that._transportMechanism);
                        });
                    } else {

                    }
                } catch(e) { _retrieveLoweringSchemaMapping(mechanism); }
            } else {
                _retrieveLoweringSchemaMapping(mechanism);
            }
        }
    },


    EVENT_MESSAGE_LOADED: "EVENT_MESSAGE_LOADED",


    _retrieveLoweringSchemaMapping: function(mechanism) {
        if(this.connected == false) {
            this.connected = true;
            if(this.loweringSchemaMappingContent == null) {
                try {
                    if(mechanism == "jsonp") {
                        var callback = "callback";
                        if(arguments.length == 2) {
                            callback = arguments[1];
                        }
                        var that = this;
                        Siesta.Network.jsonpRequestForFunction(this.loweringSchemaMapping(),callback,function(res){
                            that.loweringSchemaMappingContent = res;
                            Siesta.Events.notifyEvent(that,that.EVENT_MESSAGE_LOADED,that);
                        });
                    } else {

                    }
                } catch(e) {  Siesta.Events.notifyEvent(this,this.EVENT_MESSAGE_LOADED,this); }
            }
        } else {
            Siesta.Events.notifyEvent(this,this.EVENT_MESSAGE_LOADED,this);
        }
    }
};

Siesta.Services.RestfulOperationOutputMessage = Class.create();
/**
  @class Siesta.Services.RestfulOperationOutputMessage

  An input message for a hRESTS operation of a hRESTS service.
*/
Siesta.Services.RestfulOperationOutputMessage.prototype = {
    /**
     * @constructor
     *
     * Initiates a new RestfulOperationOutputMessage object with the
     * the data associated to the URI passed as an
     * argument in the constructor.
     *
     * Triplets are looked up in the Siesta.Model.Repositories.services repository,
     * they must have been retrieved first via a callo to Siesta.Services.registerService.
     *
     * @see Siesta.Services.registerService
     *
     * @argument messageUri: input message URI (blank node identifier), a Siesta.Framework.Uri object, a Siesta.Framework.BlankNode or a String
     */
    initialize: function(messageUri) {
        this.uri = messageUri;
        this.uriInQuery = this.uri;
        if(messageUri.__type == 'uri') {
            this.uri = uri.toString();
            this.uriInQuery = "<"+this.uri+">";
        } else if(messageUri.__type == 'blanknode') {
            this.uri = uri.toString();
            this.uriInQuery = this.uri;
        }

        this._modelReference = null;
        this._liftingSchemaMapping = null;
        this.liftingSchemaMappingContent = null;
        this.connected = false;
    },

    modelReference: function() {
        if(this._modelReference != null) {
            return this._modelReference;
        } else {

            var query = "SELECT ?model WHERE {  " + this.uriInQuery + " <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "<http://www.wsmo.org/ns/wsmo-lite#Message> . ";
            query = query + this.uriInQuery +" <http://www.w3.org/ns/sawsdl#modelReference> ?model }";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            if(result.length != 1) {
                throw new Error("Error retrieving the modelReference for the input message "+this.uri);
            } else {
/*
                var found = false;
                for(_i=0; _i<result.length; _i++) {
                    if(result[_i].id.toString() == this.uriInQuery) {
                        found = true;
                        this._modelReference = result[0].model.value;
                        break;
                    }
                }
                if(!found) {
                    throw new Error("Error retrieving the modelReference for the input message "+this.uri);
                }
*/
                this._modelReference = result[0].model.value
            }
            return this._modelReference;
        }
    },

    /**
      Retrieves the liftinSchemaMapping for this message.

      @returns the URL of the schema mapping
    */
    liftingSchemaMapping: function() {
        if(this._liftingSchemaMapping != null) {
            if(this._liftingSchemaMapping == 0) {
                return null;
            } else {
                return this._liftingSchemaMapping;
            }
        } else {
            var query = "SELECT ?schema WHERE {  " + this.uriInQuery + " <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "<http://www.wsmo.org/ns/wsmo-lite#Message> . ";
            query = query + this.uriInQuery +" <http://www.w3.org/ns/sawsdl#liftingSchemaMapping> ?schema }";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            if(result.length != 1) {
                 this._liftingSchemaMapping = 0; // this is to avoid continously quering the repository in case of no liftingSchema
            } else {
                this._liftingSchemaMapping = result[0].schema.value
            }
            return this._liftingSchemaMapping;
        }
    },


    EVENT_CONNECTED: "EVENT_OUTPUT_MESSAGE_CONNECTED",


    connect: function(mechanism) {
        if(this.connected == false) {
            this.connected = true;
            if(this.liftingSchemaMappingContent == null) {
                try {
                    if(mechanism == "jsonp") {
                        var callback = "callback";
                        if(arguments.length == 2) {
                            callback = arguments[1];
                        }
                        var that = this;
                        Siesta.Network.jsonpRequestForFunction(this.liftingSchemaMapping(),callback,function(res){
                            that.liftingSchemaMappingContent = res;
                            Siesta.Events.notifyEvent(that,that.EVENT_CONNECTED,that);
                        });
                    } else {
                    }
                } catch(e) {  Siesta.Events.notifyEvent(this,this.EVENT_CONNECTED,this); }
            }
        } else {
            Siesta.Events.notifyEvent(this,this.EVENT_CONNECTED,this);
        }
    }
};

Siesta.Services.RestfulOperation = Class.create();
/**
  @class Siesta.Services.RestfulOperation

  A hRESTS operation of a hRESTS service.
*/
Siesta.Services.RestfulOperation.prototype = {
    /**
     * @constructor
     *
     * Initiates a new RestfulOperation object with the
     * the data associated to the URI passed as an
     * argument in the constructor.
     *
     * Triplets are looked up in the Siesta.Model.Repositories.services repository,
     * they must have been retrieved first via a callo to Siesta.Services.registerService.
     *
     * @see Siesta.Services.registerService
     *
     * @argument operationUri: operation location URI, a Siesta.Framework.Uri object or a String
     */
    initialize: function(operationUri) {
        this.uri = operationUri;
        if(operationUri.__type == 'uri') {
            this.uri = uri.toString();
        }

        this._label = null;
        this._method = null;
        this._address = null;
        this._inputMessages = null;
        this._inputParameters = null;
        this._outputMessage = null;
        this.connected = false;
        this._addressAttributes = null;
    },

    label: function() {
        if(this._label != null) {
            return this._label;
        } else {
            var query = "SELECT ?text WHERE { <"+this.uri+"> " + "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "<http://www.wsmo.org/ns/wsmo-lite#Operation> . ";
            query = query + "<"+this.uri+"> <http://www.w3.org/2000/01/rdf-schema#label> ?text }";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            if(result.length != 1) {
                this._label = "";
            } else {
                this._label = result[0].text.value;
            }
            return this._label;
        }
    },

    method: function() {
        if(this._method != null) {
            return this._method;
        } else {
            var query = "SELECT ?method WHERE { <"+this.uri+"> " + "<http://www.wsmo.org/ns/hrests#hasMethod> " + "?method } ";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            if(result.length != 1) {
                throw new Error("Error retrieving the method associated to the operation "+this.uri);
            } else {
                this._method = result[0].method.value;
                return this._method;
            }
        }
    },

    address: function() {
        if(this._address != null) {
            return this._address;
        } else {
            var query = "SELECT ?address WHERE { <"+this.uri+"> " + "<http://www.wsmo.org/ns/hrests#hasAddress> " + "?address } ";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            if(result.length != 1) {
                throw new Error("Error retrieving the address associated to the operation "+this.uri);
            } else {
                this._address = result[0].address.value;
                return this._address;
            }
        }
    },

    _parsingAddressPatterRegExOut: /\{[\w%]+\}/g,

    _parsingAddressPatternRegExIn: /[^\{\}]+/,

    /**
      Parses the address of the operation retrieving the list of prameters
      from the address.

      @returns the list of parsed parameters
    */
    addressAttributes: function() {
        var theAddress = this.address();
        if(this._addressAttributes == null) {
            this._addressAttributes = [];

            var finished = false;
            while(!finished) {
                var attribute = this._parsingAddressPatterRegExOut.exec(theAddress);
                if(attribute != null) {
                    this._addressAttributes.push(this._parsingAddressPatternRegExIn.exec(attribute)[0]);
                } else {
                    finished = true;
                }
            }
        }
        return this._addressAttributes;
    },

    /**
      Returns an array of RestfulOperationInputMessages object with all the
      input messages associated to this operation.

      @returns An array of RestulOperationInputMessages objects
    */
    inputMessages: function() {
        if(this._inputMessages != null) {
            return this._inputMessages;
        } else {
            var query = "SELECT ?message WHERE { <"+this.uri+"> " + "<http://www.wsmo.org/ns/wsmo-lite#hasInputMessage> " + "?message } ";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            this._inputMessages = [];

            for(_i=0; _i<result.length; _i++) {
                var msg = new Siesta.Services.RestfulOperationInputMessage(result[_i].message.toString());
                this._inputMessages.push(msg);
            }

            return this._inputMessages;
        }
    },


    /**
      Returns the RestfulOperationOutputMessage object associated
      to this operation.

      @returns A RestulOperationOutputMessage objects or null if no output message is associated.
    */
    outputMessage: function() {
        if(this._outputMessage != null) {
            return this._outputMessage;
        } else {
            var query = "SELECT ?message WHERE { <"+this.uri+"> " + "<http://www.wsmo.org/ns/wsmo-lite#hasOutputMessage> " + "?message } ";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            for(_i=0; _i<result.length; _i++) {
                var msg = new Siesta.Services.RestfulOperationOutputMessage(result[_i].message.toString());
                this._outputMessage = msg;
            }

            return this._outputMessage;
        }
    },


    /**
      Returns an array of RestfulOperationInputParameter object with all the
      input messages associated to this operation.

      @returns An array of RestulOperationInputMessages objects
    */
    inputParameters: function() {
        if(this._inputParameters != null) {
            return this._inputParameters;
        } else {
            var query = "SELECT ?parameter WHERE { <"+this.uri+"> " + "<http://www.wsmo.org/ns/hrests#hasInputParameter> " + "?parameter } ";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            this._inputParameters = [];

            for(_i=0; _i<result.length; _i++) {
                var msg = new Siesta.Services.RestfulOperationInputParameter(result[_i].parameter.toString());
                this._inputParameters.push(msg);
            }

            return this._inputParameters;
        }
    },

    connect: function(mechanism) {
        var that = this;
        if(that.connected == false) {
            var sequentializer = new Siesta.Utils.Sequentializer();

            for(var _i=0; _i<that.inputMessages().length; _i++) {
                sequentializer.addRemoteRequestWithEnv(function(message){
                    Siesta.Events.addListener(message,message.EVENT_MESSAGE_LOADED,that,function(event,msg) {
                        Siesta.Events.removeListener(message,message.EVENT_MESSAGE_LOADED,that);
                        sequentializer.notifyRequestFinished();
                    });
                    message.connect(mechanism);
                },that.inputMessages()[_i]);
            }

            var outputMessage = this.outputMessage();
            if(outputMessage != null) {
                sequentializer.addRemoteRequest(function(){
                    Siesta.Events.addListener(outputMessage,outputMessage.EVENT_CONNECTED,that,function(event,msg) {
                        Siesta.Events.removeListener(outputMessage,outputMessage.EVENT_CONNECTED,that);
                        sequentializer.notifyRequestFinished();
                    });
                    outputMessage.connect(mechanism);
                });
            }

            sequentializer.finishedCallback(function() {

                that.connected = true;
                Siesta.Events.notifyEvent(that,that.EVENT_CONNECTED,that);
            });

            sequentializer.start();
        }
    },

    consume: function(mechanism,graph) {
        if(this.connected == false) {
            throw "Unable to consume a disconnected service";
        }

        var loweredParametersMap = {};
        var inputMsgs = this.inputMessages();
        for(var _i=0; _i<inputMsgs.length; _i++) {
            var inputMsg = inputMsgs[_i];
            var result = Siesta.Sparql.query(graph,inputMsg.loweringSchemaMappingContent);
            for(var v in result[0]) {
                if((typeof result[0][v]) == "object") {
                    loweredParametersMap[v] = result[0][v];
                }
            }
        }
        var theAddress = this.address();
        for(var _i=0; _i<this.addressAttributes().length; _i++) {
            var theAttr = this.addressAttributes()[_i];
            var theAttrInAddress = "{"+ theAttr +"}";

            theAddress = theAddress.replace(theAttrInAddress,encodeURIComponent(loweredParametersMap[theAttr].value));
        }

        if(mechanism == "jsonp") {
            var that = this;
            if(theAddress.indexOf("?") != -1) {
                theAddress = theAddress + "&_method=" + this.method().toLowerCase();
            } else {
                theAddress = theAddress + "?_method=" + this.method().toLowerCase();
            }
            Siesta.Network.jsonpRequestForFunction(theAddress,"callback",function(resp) {
                Siesta.Services.parseAndAddToRepository(resp,Siesta.Model.Repositories.data);
                Siesta.Events.notifyEvent(that,that.EVENT_CONSUMED,that);
            });
        } else {
        }
    },


    EVENT_CONNECTED: "EVENT_OPERATION_CONNECTED",

    EVENT_CONSUMED: "CONSUMED_OPERATON_EVENT"
};

Siesta.Services.RestfulService = Class.create();
/**
  @class Siesta.Services.RestfulService

  A Semantic Restful hRESTS service.
*/
Siesta.Services.RestfulService.prototype = {
    /**
     * @constructor
     *
     * Initiates a new RestfulService object with the
     * the data associated to the URI passed as an
     * argument in the constructor.
     *
     * Triplets are looked up in the Siesta.Model.Repositories.services repository,
     * they must have been retrieved first via a callo to Siesta.Services.registerService.
     *
     * @see Siesta.Services.registerService
     *
     * @argument serviceuri: Service location URI, a Siesta.Framework.Uri object or a String
     */
    initialize: function(serviceUri ) {
        this.uri = serviceUri;
        if(serviceUri.__type == 'uri') {
            this.uri = uri.toString();
        }

        this._operations = null;
        this._operationsUris = null;

        this._modelReference = null;
        this.connected = false;
        this._model = null;
    },

    modelReference: function() {
        if(this._modelReference != null) {
            return this._modelReference;
        } else {
            var query = "SELECT ?reference WHERE { <"+this.uri+"> " + "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "<http://www.wsmo.org/ns/wsmo-lite#Service> . ";
            query = query + "<"+this.uri+"> <http://www.w3.org/ns/sawsdl#modelReference> ?reference }";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            if(result.length != 1) {
                this._modelReference = null;
            } else {
                this._modelReference = result[0].reference.value;
            }
            return this._modelReference;
        }
    },

    isDefinedBy: function() {
        if(this._modelReference != null) {
            return this._modelReference;
        } else {
            var query = "SELECT ?defined WHERE { <"+this.uri+"> " + "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "<http://www.wsmo.org/ns/wsmo-lite#Service> . ";
            query = query + "<"+this.uri+"> <http://www.w3.org/2000/01/rdf-schema#isDefinedBy> ?defined }";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            if(result.length != 1) {
                throw new Error("Error retrieving rdfs#isDefinedBy for <"+this.uri+"> uri. Found "+result.length+" results instead of 1");
            } else {
                this._modelReference = result[0].defined.value;
                return this._modelReference;
            }
        }
    },

    operationsUris: function() {
        if(this._operationsUris != null) {
            return this._operationsUris;
        } else {
            this._operationsUris = [];

            var query = "SELECT ?operation WHERE { <"+this.uri+"> " + "<http://www.wsmo.org/ns/wsmo-lite#hasOperation> " + "?operation } ";


            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            for(var _i=0; _i<result.length; _i++) {
                this._operationsUris.push(result[_i].operation.value);
            }
            return this._operationsUris;
        }
    },

    operations: function() {
        if(this._operations != null) {
            return this._operations;
        } else {
            this._operations = [];
            var opsUris = this.operationsUris();

            for(_i=0; _i<opsUris.length; _i++) {
                var opName = opsUris[_i];
                this._operations.push(new Siesta.Services.RestfulOperation(opName));
            }

            return this._operations;
        }
    },

    model: function() {
        if(this._model != null) {
            return this._model;
        } else {
            if(this.modelReference() != null) {
                this._model = new Siesta.Model.Schema(this.modelReference());
            }
        }
    },

    /**
      Retrieves all the external resources for this service: model, lowering and lifting operations, etc.

      @returns nothing
    */
    connect: function(mechanism) {
        if(this.connected == false) {

            var that = this;
            var sequentializer = new Siesta.Utils.Sequentializer();

            if(this.model() == null) {
                try {
                    if(mechanism == "jsonp") {
                        var callback = "callback";
                        if(arguments.length == 2) {
                            callback = arguments[1];
                        }
                        sequentializer.addRemoteRequest(function(){
                            Siesta.Network.jsonpRequestForFunction(that.modelReference(),callback,function(resp){

                                Siesta.Services.parseAndAddToRepository(resp,Siesta.Model.Repositories.schemas);
                                that.model();
                                sequentializer.notifyRequestFinished();
                            });
                        });
                    } else {

                    }
                } catch(e) { }
            }

            for(var _i=0; _i<this.operations().length; _i++){

                /*
                var f = (function (theOperation) { return function () {
                    Siesta.Events.addListener(theOperation,theOperation.EVENT_CONNECTED,that,function(event,op) {

                        Siesta.Events.removeListener(theOperation,theOperation.EVENT_CONNECTED,that);
                        sequentializer.notifyRequestFinished();
                    });
                    theOperation.connect(mechanism);
                }})(this.operations()[_i]);
                sequentializer.addRemoteRequest(f);
                */
                sequentializer.addRemoteRequestWithEnv(function(theOperation) {

                    Siesta.Events.addListener(theOperation,theOperation.EVENT_CONNECTED,that,function(event,op) {
                        Siesta.Events.removeListener(theOperation,theOperation.EVENT_CONNECTED,that);
                        sequentializer.notifyRequestFinished();
                    });
                    theOperation.connect(mechanism);
                }, this.operations()[_i]);
            }

            sequentializer.finishedCallback(function() {
                that.connected = true;
                Siesta.Events.notifyEvent(that,that.EVENT_SERVICE_LOADED,that);
            });

            sequentializer.start();
        }
    },

    _retryConnectModel: function(resp) {
        Siesta.Services.parseAndAddToRepository(resp,Siesta.Model.Repositories.schemas);
        this.model();

        Siesta.Events.notifyEvent(this,this.EVENT_SERVICE_LOADED,this);
    },

    EVENT_SERVICE_LOADED: "EVENT_SERVICE_LOADED"
};

Siesta.Model.Schema = Class.create();
/**
  @class Siesta.Model.Schema

  A RDF model schema.
*/
Siesta.Model.Schema.prototype = {
    /**
     * @constructor
     *
     * Initiates a new model schema object with the
     * the data associated to the URI passed as an
     * argument in the constructor.
     *
     * Triplets are looked up in the Siesta.Model.Repositories.schemas repository,
     * they must have been retrieved before initating the schema object.
     *
     * @argument serviceuri: Schema URI: a Siesta.Framework.Uri object or a String
     */
    initialize: function(schemaUri ) {
        this.uri = schemaUri;
        if(schemaUri.__type == 'uri') {
            this.uri = uri.toString();
        }

        this._type = null;
        this._properties = null;
    },

    /**
      Retrieves the type of this model schema.

      @returns The URI of the type associated to this schema model
    */
    type: function() {
        if(this._type != null) {
            return this._type;
        } else {
            var query = "SELECT ?type WHERE { <"+this.uri+"> " + "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "?type }";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.schemas,query);

            if(result.length != 1) {
                throw new Error("Error retrieving rdfs#type for <"+this.uri+"> uri. Found "+result.length+" results instead of 1");
            } else {
                this._type = result[0].type.value;
                return this._type;
            }
        }
    },

    /**
      Retrieves all the properties associated to this schema URI by a rdfs:domain predicate.

      @returns A hash of URIs -> range for the properties of the model schema.
    */
    properties: function() {
        if(this._properties != null) {
            return this._properties;
        } else {
            var query = "SELECT ?prop ?range WHERE { ?prop  <http://www.w3.org/2000/01/rdf-schema#domain> <"+ this.uri +"> . ?prop <http://www.w3.org/2000/01/rdf-schema#range> ?range}";
            var result = Siesta.Sparql.query(Siesta.Model.Repositories.schemas,query);

            this._properties = [];

            for(_i=0; _i<result.length; _i++) {
                var prop = {};
                prop['uri'] = result[_i].prop.value;
                prop['range'] = result[_i].range.value;

                this._properties.push(prop);
            }
            return this._properties;
        }
    },
};

Siesta.Model.Instance = Class.create();
/**
  @class Siesta.Model.Instance

  A RDF instance of some model.
*/
Siesta.Model.Instance.prototype = {
    /**
     * @constructor
     *
     * Initiates a new instance model with the URI andvalues
     * provided in the constructor.
     *
     * @argument schema: Siesta.Model.Schema for the instance.
     * @argument uri: instance URI, it can be null.
     * @argument properties: values for the properties of the instance
     */
    initialize: function(schema, uri, properties ) {
        this._schema = schema;
        this.uri = uri;
        this._properties = properties;
        this._graph = null;
        for(var p in properties) {
            this[p] = properties[p];
        }
    },

    toGraph: function() {
        if(this._graph == null) {
            this._graph = new  Siesta.Framework.Graph();
            if(this.uri == null) {
                this.uri = "_:0";
            }
            var subject = new Siesta.Framework.Uri(this.uri);
            for(var _i=0; _i<this._schema.properties().length; _i++) {
                var prop = this._schema.properties()[_i];
                var found = null;
                var foundUri = null;
                for(var p in this._properties) {
                    var pindex = prop.uri.indexOf(p);
                    if(pindex != -1 && (pindex + p.length) == prop.uri.length) {
                        found = p;
                        foundUri = prop.uri;
                        break;
                    }
                }

                if(found != null) {
                    this._graph.addTriple(new Siesta.Framework.Triple(new Siesta.Framework.Uri(this.uri),
                                                                      new Siesta.Framework.Uri(foundUri),
                                                                      new Siesta.Framework.Literal({value: this._properties[found]})));
                }
            }
        }
        return this._graph;
    }
};

/**
  Events manager
*/
Siesta.Events = {
    eventsDictionary: {},

    addListener: function(sender,notification,receiver,method) {
        if(this.eventsDictionary[sender] == undefined) {
            this.eventsDictionary[sender] = {};
        }

        if(this.eventsDictionary[sender][notification] == undefined) {
            this.eventsDictionary[sender][notification] = [];
        }

        this.eventsDictionary[sender][notification].push([receiver,method]);
    },

    removeListener: function(sender,notification,receiver) {
        if(this.eventsDictionary[sender] != undefined) {
            if(this.eventsDictionary[sender][notification] != undefined) {
                var found = null;
                for(_i=0; _i < this.eventsDictionary[sender][notification].length; _i++) {
                    if(this.eventsDictionary[sender][notification][_i][0] == receiver) {
                        found = _i;
                        break;
                    }
                }
                if(found != null) {
                    this.eventsDictionary[sender][notification].splice(_i,1);
                }

                if(this.eventsDictionary[sender][notification].length == 0) {
                }
            }
        }
    },

    notifyEvent: function(sender,notification,data) {
        if(this.eventsDictionary[sender] != undefined) {
            if(this.eventsDictionary[sender][notification] != undefined) {
                var found = null;
                for(_i=0; _i < this.eventsDictionary[sender][notification].length; _i++) {
                    var obj = this.eventsDictionary[sender][notification][_i][0];
                    this.eventsDictionary[sender][notification][_i][1].call(obj,notification,data);
                }
            }
        }
    },

    notifyEventAndDelete: function(sender,nofitication,data) {
        if(this.eventsDictionary[sender] != undefined) {
            if(this.eventsDictionary[sender][notification] != undefined) {
                var found = null;
                for(_i=0; _i < this.eventsDictionary[sender][notification].length; _i++) {
                    var obj = this.eventsDictionary[sender][notification][_i][0];
                    this.eventsDictionary[sender][notification][_i][1].call(obj,notification,data);
                }
            }
            delete this.eventsDictionary[sender][notification];
        }
    }
};

/*                            Framework configuration and initalization                                       */
Siesta.registerNamespace("Siesta","Sparql");
Siesta.registerNamespace("Siesta","Formats","Turtle");
Siesta.registerNamespace("Siesta","Formats","Xml");

Siesta.defineConfiguration = function(theConfiguration) {
    Siesta.Configuration = theConfiguration;
    Siesta.loadFrameworks();
}

Siesta.loadConfiguration = function(basePath) {
   /**
     Returns the current URL till the last '/' (not included) in th URL:
     - http://test.com/scripts/my_script.js -> http://test.com/scripts
   */
    Siesta.basePath = function() {
        return basePath;
    };

    Siesta.load(Siesta.basePath(),"configuration.js");
};

Siesta.loadFrameworks = function() {
    debugger;
    Siesta.remainingFrameworks = {};
    Siesta.remainingFrameworks["sparql"] = true;
    Siesta.remainingFrameworks["formats/turtle"] = true;
    Siesta.remainingFrameworks["formats/xml"] = true;
    Siesta.remainingFrameworks["network"] = true;

    if(!Siesta.isPackaged) {
        if(Siesta.Configuration.drivers != null) {
            for(_i=0; _i< Siesta.Configuration.drivers.length; _i++) {
                var path = "libs/drivers/"+Siesta.Configuration.drivers[_i]+"/load.js";
                Siesta.loadFromBase(path);
            }
        }


        Siesta.loadFromBase("libs/drivers/"+Siesta.Configuration.sparql+"/sparql/query.js");
        Siesta.loadFromBase("libs/drivers/"+Siesta.Configuration.formats.turtle+"/formats/turtle.js"); //turtle
        Siesta.loadFromBase("libs/drivers/"+Siesta.Configuration.formats.xml+"/formats/xml.js"); //xml
        Siesta.loadFromBase("libs/drivers/"+Siesta.Configuration.network+"/network.js"); //xml
    }
};

Siesta.WhenInitiatedScripts = [];

Siesta.onFrameworkInitiated = function(f) {
    Siesta.WhenInitiatedScripts.push(f);
};

Siesta.defineConfiguration({
    drivers: ["hercules","oat","prototype"],
    sparql: "Hercules",
    formats: {
        turtle: "Hercules",
        xml: "OAT"
    },
    network: "Prototype"
});

Siesta.registerFramework = function(key) {
    debugger;
    Siesta.remainingFrameworks[key] = false;

    var notReady = false;

    notReady = notReady || Siesta.remainingFrameworks["sparql"];
    notReady = notReady || Siesta.remainingFrameworks["formats/turtle"];
    notReady = notReady || Siesta.remainingFrameworks["formats/xml"];
    notReady = notReady || Siesta.remainingFrameworks["network"];

    if(key == "sparql") {
        Siesta.Sparql = eval("Siesta.Drivers."+Siesta.Configuration.sparql+".Sparql");
    } else if(key == "formats/turtle") {
        Siesta.Formats.Turtle = eval("Siesta.Drivers."+Siesta.Configuration.formats.turtle+".Formats.Turtle");
    } else if(key == "formats/xml") {
        Siesta.Formats.Xml = eval("Siesta.Drivers."+Siesta.Configuration.formats.xml+".Formats.Xml");
    } else if(key == "network") {
        Siesta.Network = eval("Siesta.Drivers."+Siesta.Configuration.network+".Network");
    }

    if(!notReady) {
        for(_i=0; _i< Siesta.WhenInitiatedScripts.length; _i++) {
            Siesta.WhenInitiatedScripts[_i].call();
        }
    }
}
if (! Arielworks) var Arielworks = {};
if (! Arielworks.Util) Arielworks.Util = {};
if (! Arielworks.Parser) Arielworks.Parser = {};
if (! Arielworks.Parser.RecursiveDescentParser) Arielworks.Parser.RecursiveDescentParser = {};
if (! Arielworks.Hercules) Arielworks.Hercules = {};
if (! Arielworks.Hercules.Rdf) Arielworks.Hercules.Rdf = {};
if (! Arielworks.Hercules.Rdf.Datatype) Arielworks.Hercules.Rdf.Datatype = {};
if (! Arielworks.Hercules.Rdf.Datatype.Xsd) Arielworks.Hercules.Rdf.Datatype.Xsd = {};
if (! Arielworks.Hercules.Sparql) Arielworks.Hercules.Sparql = {};
if (! Arielworks.Hercules.Serialized) Arielworks.Hercules.Serialized = {};
if (! Arielworks.Hercules.Serialized.Turtle) Arielworks.Hercules.Serialized.Turtle = {};

Arielworks.Hercules.turtleToGraph = function(baseUri,turtleDoc) {
    var turtleParser = new Arielworks.Parser.RecursiveDescentParser.Parser();
    turtleParser.setRuleSet(Arielworks.Hercules.Serialized.Turtle.Parser.RULE_SET);
    turtleParser.setWhiteSpaceRule(Arielworks.Hercules.Serialized.Turtle.Parser.WHITE_SPACE_RULE);
    turtleParser.compileRuleSet();
    var action = new Arielworks.Hercules.Serialized.Turtle.Turtle_1_0(baseUri);
    var ret = turtleParser.parse(turtleDoc, Arielworks.Hercules.Serialized.Turtle.Parser.START_RULE, action);

    return action;
}

Arielworks.Util.Class = {
  create: function(initializer) {
      var obj = function() {
          if (! this.___initialized) {
              this.___initialized = true;
              Arielworks.Util.Class.__callInitializers(this, this.constructor);
              this.___extendingStack = Array.apply(null, this.constructor.___extendingStack); // copy
          } else {
              var now = this.___extendingStack.shift();
          }

          if (this.___extendingStack[0].prototype.___constructor) {
              this.___extendingStack[0].prototype.___constructor.apply(this, arguments);
          }

          if (now) this.___extendingStack.unshift(now);
      };

      obj.___managed = true;
      obj.___initializer = initializer;
      obj.prototype.instanceOf = Arielworks.Util.Class.__instanceOfCall;
      obj.prototype.kindOf = Arielworks.Util.Class.__kindOfCall;
      obj.___extendingStack = [obj];
      obj.prototype.___mixin = Arielworks.Util.Class.__mixinCall;

      return obj;
  },

  extend: function(superClass, mixin1/*, mixin2, mixin3...*/, initializer) {
      var hasInitializer = arguments[arguments.length - 1].___managed != true;
      var subClass = Arielworks.Util.Class.create(hasInitializer ? arguments[arguments.length - 1] : undefined);
      var dontCallConstructor = function() {};
      dontCallConstructor.prototype = superClass.prototype;
      subClass.prototype =  new dontCallConstructor();
      subClass.prototype.constructor = subClass;

      subClass.prototype.___super = superClass;
      subClass.___super = superClass;
      subClass.___extendingStack = Array.apply(null, superClass.___extendingStack);
      subClass.___extendingStack.unshift(subClass);


      var drops = {};
      for (property in subClass) if (subClass.hasOwnProperty(property)) drops[property] = true;
      for (property in superClass) if (superClass.hasOwnProperty(property)) {
          if (drops[property] !== true) subClass[property] = superClass[property];
      }


      subClass.___mixin = [];
      for (var i = 1; i < arguments.length - (hasInitializer ? 1 : 0); i++) {
          var mixin = arguments[i];
          subClass.___mixin.push(mixin);
          for (property in mixin) if (drops[property] !== true && ! Object.prototype.hasOwnProperty(property)) {
              subClass[property] = mixin[property];
          }
      }
      return subClass;
  },

  __instanceOfCall: function(klass) {
      return this.constructor == klass;
  },

   __kindOfCall: function(klass) {
       Arielworks.Util.Class.__kindOfClassChain(this.constructor, klass);
  },

  __kindOfClassChain: function(about, to) {
      if (about == to) return true;

      var mixin = about.___mixin;
      for (var i = 0; i < mixin.length; i++) {
          if (Arielworks.Util.Class.__kindOfCallMixin(mixin[i], to)) return true;
      }

      if (about.__super) return Arielworks.Util.Class.__kindOfClassChain(about.__super, to);

      return false;
  },

  __callInitializers: function(object, klass) {
      var chainStack = [];
      var currentClass = klass;
      while (currentClass) {
          chainStack.push(currentClass);
          currentClass = currentClass.___super;
      }
      while (currentClass = chainStack.pop()) {
          if (currentClass.___mixin) {
              for (var i = 0; i < currentClass.___mixin.length; i++) {
                  Arielworks.Util.Class.__callInitializers(object, currentClass.___mixin[i]);
              }
          }
          if (currentClass.___initializer) {
              currentClass.___initializer.apply(object);
          }
      }
  },

  __mixinCall: function(num, arg) {
      var mixinClass = this.___extendingStack[0].___mixin[num]
      var ___constructor = mixinClass.prototype.___constructor;
      var tempExtendingStack = this.___extendingStack;
      this.___extendingStack = Array.apply(null, mixinClass.___extendingStack);
      Array.prototype.shift.apply(arguments)
      if (___constructor) ___constructor.apply(this, arguments);
      this.___extendingStack = tempExtendingStack;
  }
};


Arielworks.Util.argToArray = function(from) {
    var to = new Array(from.length)
    for(var i = 0; i < from.length; i ++) to[i] = from[i];
    return to;
};




var Class = {
    create: function() {
        return function() {
            if (this.___constructor) {
                this.___constructor.apply(this, arguments);
            }
        }
    },

    extend: function(superClass) {
        var subClass = Class.create();
        var _constructor = subClass.prototype.constructor;
        subClass.prototype =  new superClass();
        subClass.prototype.constructor = _constructor;
        subClass.prototype.___constructor = undefined;
        subClass.prototype.___super = superClass;
        subClass.___super = superClass;
        var dropList = ["prototype", "___super", "___constructor"];
        for (property in subClass) {
            dropList.push(property);
        }
        for (property in superClass) {
            var drop = false;
            for (var i = 0; i < dropList.length; i++) {
                if (dropList[i] == property) {
                    drop = true;
                    break;
                }
            }
            if (! drop) {
                subClass[property] = superClass[property];
            }
        }
        return subClass;
    }
};


Arielworks.Hercules.Rdf.RDF_NAMESPACE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
Arielworks.Hercules.Rdf.RDF_COLLECTION_FIRST = Arielworks.Hercules.Rdf.RDF_NAMESPACE + "first";
Arielworks.Hercules.Rdf.RDF_COLLECTION_REST = Arielworks.Hercules.Rdf.RDF_NAMESPACE + "rest";
Arielworks.Hercules.Rdf.RDF_COLLECTION_NIL = Arielworks.Hercules.Rdf.RDF_NAMESPACE + "nil";
Arielworks.Hercules.Rdf.RDF_TYPE = Arielworks.Hercules.Rdf.RDF_NAMESPACE + "type";



/**
 * An abstract Class for RDF Resource.
 * @abstract
 */
Arielworks.Hercules.Rdf.Resource = Arielworks.Util.Class.create();

/**
 * Constructs an instance.
 * @param value The value which is hold by the instance
 */
Arielworks.Hercules.Rdf.Resource.prototype.___constructor = function(/*string*/ value) {
    this.value = value;
};

/**
 * Sets the value of the instance.
 * @param value The value of the instance.
 */
Arielworks.Hercules.Rdf.Resource.prototype.setValue = function(/*string*/ value) {
    this.value = value;
};

/**
 * Returns the value of the instance.
 * @return The value of the instance. "undefined" will be returned when not be set.
 */
Arielworks.Hercules.Rdf.Resource.prototype.getValue = function() {
    return this.value;
};

/**
 * Returns whether the given object is equals to the instance.
 * Equality is deceided by comparing their values, not by "==" operator.
 * This method will be overrided by child classes. e.g.) PlainLiteral checks their value of LanguageTag.
 * @param to An instance compared for.
 * @return bool
 */
Arielworks.Hercules.Rdf.Resource.prototype.equals = function(/*Arielworks.Hercules.Rdf.Resource*/ to) {
    if(this instanceof Arielworks.Hercules.Sparql.BlankNode && to instanceof Arielworks.Hercules.Rdf.BlankNode) {
        return this.value == to.value;
    } else {
        return (to instanceof this.constructor && this.value == to.value);
    }
};




/**
 * A Class for the IRI Reference Resource.
 */
Arielworks.Hercules.Rdf.RdfUriRef = Arielworks.Util.Class.extend(Arielworks.Hercules.Rdf.Resource);


/**
 * Constructs an instance.
 * @param uriString The uri value of the instance without any delimiters. e.g.) http://www.arielworks.net/, not <http://www.arielworks.net/>
 */
Arielworks.Hercules.Rdf.RdfUriRef.prototype.___constructor = function(/*string*/ uriString) {
    this.___super(this.constructor.normalize(uriString));
};

Arielworks.Hercules.Rdf.RdfUriRef.normalize = function(uriString) {

    var percentRegex = /(%(?!3A|2F|3F|23|5B|5D|40|21|24|26|27|28|29|2A|2B|2C|3B|3D|25)[0-9A-F]{2})+/g;
    uriString = uriString.replace(percentRegex, function() {
        return decodeURIComponent(arguments[0]);
    });
    return uriString;
};

Arielworks.Hercules.Rdf.RdfUriRef.COMPONENT_REGEX = componentsRegExp = /^([^:\/?#]+:)?(\/\/[^\/?#]*)?([^?#]*)(\?[^#]*)?(#.*)?$/;
Arielworks.Hercules.Rdf.RdfUriRef.resolveUriRef = function(baseUri, uriRef) {
    var bComp = baseUri.match(Arielworks.Hercules.Rdf.RdfUriRef.COMPONENT_REGEX);
    bComp.shift();
    var rComp = uriRef.match(Arielworks.Hercules.Rdf.RdfUriRef.COMPONENT_REGEX);
    rComp.shift();

    if (rComp[0]) {
        bComp.splice(0, 5, rComp[0], rComp[1], Arielworks.Hercules.Rdf.RdfUriRef.__removeDotSegments(rComp[2]), rComp[3], rComp[4]);
    } else {
        if (! bComp || ! bComp[1]) throw "Given Base URI is not a valid Absolute URI." //@TODO
        if(rComp[1]) {
            bComp.splice(1, 4, rComp[1], Arielworks.Hercules.Rdf.RdfUriRef.__removeDotSegments(rComp[2]), rComp[3], rComp[4]);
        } else if (rComp[2] == "") {
            if (rComp[3]) {
                bComp.splice(3, 2, rComp[3], rComp[4]);
            } else {
                bComp.splice(4, 1, rComp[4]);
            }
        } else if (rComp[2][0] == "/") {
            bComp.splice(2, 3, Arielworks.Hercules.Rdf.RdfUriRef.__removeDotSegments(rComp[2]), rComp[3], rComp[4]);
        } else {
            bComp.splice(2, 3, Arielworks.Hercules.Rdf.RdfUriRef.__removeDotSegments(Arielworks.Hercules.Rdf.RdfUriRef.__merge(bComp[2], rComp[2])), rComp[3], rComp[4]);
        }
    }

    return bComp.join("");
};

Arielworks.Hercules.Rdf.RdfUriRef.__removeDotSegments = function(path) {
    var segments = path.split("/");
    var resultStack = [];
    for (var i = 0; i < segments.length; i++) {
        if (i == 0) {
            if (segments[i] == "." || segments[i] == ".." || segments == "") resultStack.push("");
            else resultStack.push(segments[i]);
        } else if (i == segments.length - 1) {
            if (segments[i] == "..") {
                var top = resultStack.pop();
                if (top === "") resultStack.push(top);
            }

            if (segments[i] == "." || segments[i] == ".." || segments == "") resultStack.push("");
            else resultStack.push(segments[i]);
        } else {
            if (segments[i] == "." || segments[i] == "") continue;
            else if (segments[i] == "..") {
                var top = resultStack.pop();
                if (top === "") resultStack.push(top);
            }
            else resultStack.push(segments[i]);
        }
    }
    return resultStack.join("/");
};

Arielworks.Hercules.Rdf.RdfUriRef.__merge = function(base, relative) {
    base = base.substring(0, base.lastIndexOf("/"));
    return base + "/" + relative;
};


/**
 * An abstract class for the RDF literal.
 * @abstract
 */
Arielworks.Hercules.Rdf.Literal = Arielworks.Util.Class.extend(Arielworks.Hercules.Rdf.Resource);





/**
 * A class for the Plain Literal.
 * The Plain Literal is the Literal without datatypes and has optionally language tags.
 */
Arielworks.Hercules.Rdf.PlainLiteral = Arielworks.Util.Class.extend(Arielworks.Hercules.Rdf.Literal);

/**
 * Constructs an instance
 * @param value The value of the instance.
 * @param languageTag The optional language tag for the instance. e.g.) en-US
 */
Arielworks.Hercules.Rdf.PlainLiteral.prototype.___constructor = function(/*string*/ value, /*string*/ languageTag) {
    this.languageTag = languageTag;
    this.___super(value);
};

/**
 * Sets the language tag of the instnace.
 * @param language The language tag to set. e.g.) en-US
 */
Arielworks.Hercules.Rdf.PlainLiteral.prototype.setLanguageTag = function(languageTag) {
    this.languageTag = languageTag;
};

/**
 * Returns the language tag of the instance.
 * @return The language tag of the instance. "undefined" will be returned when not be set.
 */
Arielworks.Hercules.Rdf.PlainLiteral.prototype.getLanguageTag = function () {
    return this.languageTag;
};

/**
 * Returns whether the given object is equals to the instance.
 * Equality is deceided by comparing their values and language tags, not by "==" operator.
 * Note: One of pair of literals has the language tag and the other doesn't have, the method will reuturn "false"
 * e.g.) "Hercules"@en-US is NOT equal to "Hercules"
 * see also: http://www.w3.org/TR/2004/REC-rdf-concepts-20040210/#section-Literal-Equality
 * @param to An instance compared for.
 * @return bool
 */
Arielworks.Hercules.Rdf.PlainLiteral.prototype.equals = function(to) {
    return (to instanceof this.constructor && this.value == to.value && this.languageTag == to.languageTag);
};





/**
 * A class for the Typed Literal.
 * The Typed Literal is the Literal with datatypes like xsd:integer.
 */
Arielworks.Hercules.Rdf.TypedLiteral = Arielworks.Util.Class.extend(Arielworks.Hercules.Rdf.Literal);

/**
 * Constructs an instance.
 * @param value the value of the instance.
 * @datatypeIri The absolute IRI of the datatype of the instance.
 */
Arielworks.Hercules.Rdf.TypedLiteral.prototype.___constructor = function(value, datatypeIri) {
    this.datatypeIri = datatypeIri;
    this.___super(value)
};

/**
 * Sets the datatype of the instnace.
 * @param datatypeIri The datatype iri to set.
 */
Arielworks.Hercules.Rdf.TypedLiteral.prototype.setDataTypeIri = function(datatypeIri) {
    this.datatypeIri = datatypeIri;
};

/**
 * Returns the datatype IRI of the instance.
 * @return The dattype IRI of the instance. "undefined" will be returned when not be set.
 */
Arielworks.Hercules.Rdf.TypedLiteral.prototype.getDataTypeIri = function () {
    return this.datatypeIri;
};

/**
 * Returns whether the given object is equals to the instance.
 * Equality is deceided by comparing their values and language tags, not by "==" operator.
 * @param to An instance compared for.
 * @return bool
 */
Arielworks.Hercules.Rdf.TypedLiteral.prototype.equals = function(to) {
    return (to instanceof this.constructor && this.value == to.value && this.datatypeIri == to.datatypeIri);
};





/**
 * A Class for the Blank Node.
 */
Arielworks.Hercules.Rdf.BlankNode = Arielworks.Util.Class.extend(Arielworks.Hercules.Rdf.Resource);

/**
 * Constructs an instance.
 * @param id The id of the blank node instance to identifer.
 */
Arielworks.Hercules.Rdf.BlankNode.prototype.___constructor = function(/*string*/ id) {
    this.___super(id);
};






/**
 * A class for the Triple.
 */
Arielworks.Hercules.Rdf.Triple = Arielworks.Util.Class.extend(Arielworks.Hercules.Rdf.Resource);

/**
 * Constructs an instance.
 * @param subject The subject of the triple
 * @param predicate The predicate of the triple
 * @param object The object of the triple
 */
Arielworks.Hercules.Rdf.Triple.prototype.___constructor = function(/*Arielworks.Hercules.Rdf.Resource*/ subject, /*Arielworks.Hercules.Rdf.Resource*/ predicate, /*Arielworks.Hercules.Rdf.Resource*/ object) {
    /*
    if (subject instanceof Arielworks.Hercules.Rdf.Literal) throw ""; //TODO
    if (! (predicate instanceof Arielworks.Hercules.Rdf.RdfUriRef)) throw ""; //TODO
    */

    this.subject = subject;
    this.predicate = predicate;
    this.object = object;

    this.___super();
};

/**
 * Sets the subject of the instance.
 * @param subject An instance of _RD.Resource to set
 */
Arielworks.Hercules.Rdf.Triple.prototype.setSubject = function(/*Arielworks.Hercules.Rdf.Resource*/ subject) {
     this.subject = subject;
};

/**
 * Sets the predicate of the instance.
 * @param predicate An instance of _RD.Resource to set
 */
Arielworks.Hercules.Rdf.Triple.prototype.setPredicate = function(/*Arielworks.Hercules.Rdf.Resource*/ predicate) {
    this.predicate = predicate;
};

/**
 * Sets the object of the instance.
 * @param object An instance of _RD.Resource to set
 */
Arielworks.Hercules.Rdf.Triple.prototype.setObject = function(/*Arielworks.Hercules.Rdf.Resource*/ object) {
    this.object = object;
};

/**
 * Returns the subject of the instance.
 * @return Arielworks.Hercules.Rdf.Resource The subject of the instance.
 */
Arielworks.Hercules.Rdf.Triple.prototype.getSubject = function() {
    return this.subject;
};

/**
 * Returns the predicate of the instance.
 * @return Arielworks.Hercules.Rdf.Resource The predicate of the instance.
 */

Arielworks.Hercules.Rdf.Triple.prototype.getPredicate = function() {
    return this.predicate;
};

/**
 * Returns the object of the instance.
 * @return Arielworks.Hercules.Rdf.Resource The object of the instance.
 */

Arielworks.Hercules.Rdf.Triple.prototype.getObject = function() {
    return this.object;
};

/**
 * Returns whether the given object is equals to the instance.
 * Triples are considered as same when subject, predicate and object of the triples are equal.
 * @param to An instance compared for.
 * @return bool
 */
Arielworks.Hercules.Rdf.Triple.prototype.equals = function(to) {
    return (to instanceof this.constructor) && this.subject.equals(to.subject) && this.predicate.equals(to.predicate) && this.object.equals(to.object);
}









Arielworks.Hercules.Rdf.Graph = Arielworks.Util.Class.create();

Arielworks.Hercules.Rdf.Graph.prototype.___constructor = function() {
    this.tripleList = [];
    this.triples = {};
    this.resourceCount = 0;
    this.blankNodeCount = 0;
    this.blankNodes = {};
    this.rdfUriRdfs = {};
    this.plainLiterals = {};
    this.typedLiterals = {};
};


Arielworks.Hercules.Rdf.Graph.prototype.addTriple = function(subject, predicate, object) {
    if (subject.graph != this) throw ""; //TODO
    if (predicate.graph != this) throw ""; //TODO
    if (object.graph != this) throw ""; //TODO

    var sId = subject.resourceId;
    var pId = predicate.resourceId;
    var oId = object.resourceId;
    if (! this.triples[sId]) this.triples[sId] = {};
    if (! this.triples[sId][pId]) this.triples[sId][pId] = {};
    if (! this.triples[sId][pId][oId]) this.triples[sId][pId][oId] = 0;
    if (++this.triples[sId][pId][oId] == 1) {
        this.tripleList.push(new Arielworks.Hercules.Rdf.Triple(subject, predicate, object));
    }

    return this;
};

Arielworks.Hercules.Rdf.Graph.prototype.getRdfUriRef = function(/*string*/ uri) {
    var normalized = Arielworks.Hercules.Rdf.RdfUriRefInGraph.normalize(uri);
    if (! this.rdfUriRdfs[normalized]) this.rdfUriRdfs[normalized] = new Arielworks.Hercules.Rdf.RdfUriRefInGraph(this, this.resourceCount++, uri);
    return this.rdfUriRdfs[normalized];
};

Arielworks.Hercules.Rdf.Graph.prototype.getPlainLiteral = function(/*string*/ value, languageTag) {
    if (! this.plainLiterals[value]) this.plainLiterals[value] = {};
    if (! this.plainLiterals[value][languageTag]) this.plainLiterals[value][languageTag] = new Arielworks.Hercules.Rdf.PlainLiteralInGraph(this, this.resourceCount++, value, languageTag);
    return this.plainLiterals[value][languageTag];
};

Arielworks.Hercules.Rdf.Graph.prototype.getTypedLiteral = function(/*string*/ value, datatypeIri) {
    if (! this.typedLiterals[value]) this.typedLiterals[value] = {};
    if (! this.typedLiterals[value][datatypeIri]) this.typedLiterals[value][datatypeIri] = new Arielworks.Hercules.Rdf.TypedLiteralInGraph(this, this.resourceCount++, value, datatypeIri);
    return this.typedLiterals[value][datatypeIri];
};

Arielworks.Hercules.Rdf.Graph.prototype.getBlankNode = function(/*string*/ id) {
    if (! id) {
        return new  Arielworks.Hercules.Rdf.BlankNodeInGraph(this, this.resourceCount++, this.blankNodeCount++);
    } else {
        if (! this.blankNodes[id]) this.blankNodes[id] = new Arielworks.Hercules.Rdf.BlankNodeInGraph(this, this.resourceCount++, this.blankNodeCount++);
        return this.blankNodes[id];
    }
};

Arielworks.Hercules.Rdf.Graph.prototype.clearBlankNodeId = function() {
    this.blankNodes = {};
    return this;
};



/**

 */

Arielworks.Hercules.Rdf.ResourceInGraph = Arielworks.Util.Class.create(function() {
    this.graph;
    this.resourceId;
});

Arielworks.Hercules.Rdf.ResourceInGraph.prototype.___constructor = function(graph, resourceId) {
    this.graph = graph;
    this.resourceId = resourceId;
};


Arielworks.Hercules.Rdf.ResourceInSubject = Arielworks.Util.Class.create(function() {
});

Arielworks.Hercules.Rdf.ResourceInSubject.prototype.addProperty = function(predicate, object) {
    this.graph.addTriple(this, predicate, object);
    return this;
};

Arielworks.Hercules.Rdf.ResourceInObject = Arielworks.Util.Class.create(function() {
});

Arielworks.Hercules.Rdf.ResourceInObject.prototype.addReverseProperty = function(predicate, subject) {
    this.graph.addTriple(subject, predicate, this);
    return this;
};




Arielworks.Hercules.Rdf.RdfUriRefInGraph = Arielworks.Util.Class.extend(Arielworks.Hercules.Rdf.RdfUriRef, Arielworks.Hercules.Rdf.ResourceInGraph, Arielworks.Hercules.Rdf.ResourceInObject);

Arielworks.Hercules.Rdf.RdfUriRefInGraph.prototype.___constructor = function(graph, resourceId, uriString) {
    this.___super(uriString);
    this.___mixin(0, graph, resourceId);
};

Arielworks.Hercules.Rdf.PlainLiteralInGraph = Arielworks.Util.Class.extend(Arielworks.Hercules.Rdf.PlainLiteral, Arielworks.Hercules.Rdf.ResourceInGraph);

Arielworks.Hercules.Rdf.PlainLiteralInGraph.prototype.___constructor = function(graph, resourceId, /*string*/ value, /*string*/ languageTag) {
    this.___super(value, languageTag);
    this.___mixin(0, graph, resourceId);
};

Arielworks.Hercules.Rdf.TypedLiteralInGraph = Arielworks.Util.Class.extend(Arielworks.Hercules.Rdf.TypedLiteral, Arielworks.Hercules.Rdf.ResourceInGraph);

Arielworks.Hercules.Rdf.TypedLiteralInGraph.prototype.___constructor = function(graph, resourceId, /*string*/ value, /*string*/ datatypeIri) {
    this.___super(value, datatypeIri);
    this.___mixin(0, graph, resourceId);
};

Arielworks.Hercules.Rdf.BlankNodeInGraph = Arielworks.Util.Class.extend(Arielworks.Hercules.Rdf.BlankNode, Arielworks.Hercules.Rdf.ResourceInGraph, Arielworks.Hercules.Rdf.ResourceInObject);

Arielworks.Hercules.Rdf.BlankNodeInGraph.prototype.___constructor = function(graph, resourceId, id) {
    this.___super(id);
    this.___mixin(0, graph, resourceId);
};
Arielworks.Parser.RecursiveDescentParser.Parser = Class.create();

Arielworks.Parser.RecursiveDescentParser.Parser.prototype.___constructor = function() {
    this.ruleSet;
    this.isCompiled = false;
    this.compiledRules;
    this.whiteSpaceRule = /\s*/m;

    this.initializeRuleSet();
};

Arielworks.Parser.RecursiveDescentParser.Parser.prototype.addRule = function(name, expression) {
    this.ruleSet[name] = expression;
    this.isCompiled = false;
};

Arielworks.Parser.RecursiveDescentParser.Parser.prototype.initializeRuleSet = function() {
    this.ruleSet = {};
};

Arielworks.Parser.RecursiveDescentParser.Parser.prototype.setRuleSet = function(ruleSet) {
    this.ruleSet = ruleSet;
    this.isCompiled = false;
};

Arielworks.Parser.RecursiveDescentParser.Parser.prototype.setWhiteSpaceRule = function(regExp) {
    this.whiteSpaceRule = regExp;
};

Arielworks.Parser.RecursiveDescentParser.Parser.prototype.getWhiteSpaceRule = function() {
    return this.whiteSpaceRule;
};

Arielworks.Parser.RecursiveDescentParser.Parser.prototype.parse = function(input, startRule, actions) {
    if (! this.isCompiled) {
        this.compileRuleSet();
    }
    var context = new Arielworks.Parser.RecursiveDescentParser.Context(this, input, actions);
    context.__skipWhiteSpace();
        var r = this.compiledRules[startRule].descend(context);
    if (context.hasRemaing()) {
        throw startRule;
    }


    return r;
};

Arielworks.Parser.RecursiveDescentParser.Parser.prototype.compileRuleSet = function() {
    this.compiledRules = {};
    for (var name in this.ruleSet) {
        var syntax = this.__resolveSugar(this.ruleSet[name]);
        if(typeof syntax != "function") {
            if (typeof(syntax) == "string") {
                this.compiledRules[name] = new Arielworks.Parser.RecursiveDescentParser.SequentialExpression();
                this.ruleSet[name] = [syntax];
            } else if (syntax instanceof Object) {
                this.compiledRules[name] = this.__createExpressionInstance(syntax);
            } else {
                throw "SyntaxError"
            }
            this.compiledRules[name].setName(name);
            this.compiledRules[name].setCallee(name);
        }
    }

    for (var name in this.ruleSet) {
        if(typeof this.__resolveSugar(this.ruleSet[name]) != "function") {
            this.__compileSyntax(this.ruleSet[name], this.compiledRules[name]);
        }
    }

    this.isCompiled = true;
};

Arielworks.Parser.RecursiveDescentParser.Parser.prototype.__compileSyntax = function(syntax, exp) {
    syntax = this.__resolveSugar(syntax);
    if (typeof(syntax) == "string") {
        return this.compiledRules[syntax];
    }

    if (! exp) {
        if (syntax instanceof Object) {
            exp = this.__createExpressionInstance(syntax);
        }
    }

    var element;
    if (syntax["Sequential"]) {
        element = new Array();
        for (var i = 0; i < syntax["Sequential"].length; i++) element.push(this.__compileSyntax(syntax["Sequential"][i]));
    } else if (syntax["Or"]) {
        element = new Array();
        for (var i = 0; i < syntax["Or"].length; i++) element.push(this.__compileSyntax(syntax["Or"][i]));
    }
    else if (syntax["OneOrNothing"]) element = this.__compileSyntax(syntax["OneOrNothing"]);
    else if (syntax["ZeroOrMore"]) element = this.__compileSyntax(syntax["ZeroOrMore"]);
    else if (syntax["OneOrMore"]) element = this.__compileSyntax(syntax["OneOrMore"]);
    else if (syntax["TerminalString"]) element = syntax["TerminalString"];
    else if (syntax["TerminalRegExp"]) element = syntax["TerminalRegExp"];
    else throw "SyntaxError";


    exp.setElement(element);

    if (syntax["callee"]) exp.setCallee(syntax["callee"]);

    return exp;
};

Arielworks.Parser.RecursiveDescentParser.Parser.prototype.__createExpressionInstance = function(syntax) {
    if(typeof syntax == "function") {

    } else {
        if (syntax["Sequential"]) return new Arielworks.Parser.RecursiveDescentParser.SequentialExpression();
        else if (syntax["Or"]) return new Arielworks.Parser.RecursiveDescentParser.OrExpression();
        else if (syntax["TerminalString"]) return new Arielworks.Parser.RecursiveDescentParser.TerminalString();
        else if (syntax["TerminalRegExp"]) return new Arielworks.Parser.RecursiveDescentParser.TerminalRegExp();
        else if (syntax["OneOrNothing"]) return new Arielworks.Parser.RecursiveDescentParser.OneOrNothingExpression();
        else if (syntax["ZeroOrMore"]) return new Arielworks.Parser.RecursiveDescentParser.ZeroOrMoreExpression();
        else if (syntax["OneOrMore"]) return new Arielworks.Parser.RecursiveDescentParser.OneOrMoreExpression();
        else throw "SyntaxError";
    }
};

Arielworks.Parser.RecursiveDescentParser.Parser.prototype.__resolveSugar = function (syntax) {
    if (syntax instanceof Array) {
        return {Sequential: syntax};
    } else if (syntax instanceof RegExp) {
        return Arielworks.Parser.RecursiveDescentParser.Parser.$re(syntax);
    } else {
        return syntax;
    }
};


Arielworks.Parser.RecursiveDescentParser.Parser.seq = function() {
    return {Sequential: Arielworks.Util.argToArray(arguments)};
};

Arielworks.Parser.RecursiveDescentParser.Parser.or = function() {
    return {Or: Arielworks.Util.argToArray(arguments)};
};

Arielworks.Parser.RecursiveDescentParser.Parser.$ = function() {
    return {TerminalString: arguments[0]}
};

Arielworks.Parser.RecursiveDescentParser.Parser.$re = function() {
    return {TerminalRegExp: arguments[0]}
};

Arielworks.Parser.RecursiveDescentParser.Parser.n = function() {
    return {OneOrNothing: arguments.length == 1 ? arguments[0] : Arielworks.Util.argToArray(arguments)};
};

Arielworks.Parser.RecursiveDescentParser.Parser.z = function() {
    return {ZeroOrMore: arguments.length == 1 ? arguments[0] : Arielworks.Util.argToArray(arguments)};
};

Arielworks.Parser.RecursiveDescentParser.Parser.o = function() {
    return {OneOrMore: arguments.length == 1 ? arguments[0] : Arielworks.Util.argToArray(arguments)};
};



Arielworks.Parser.RecursiveDescentParser.Context = Class.create();

Arielworks.Parser.RecursiveDescentParser.Context.prototype.___constructor = function(parser, input, actions) {
    this.parser = parser;
    this.actions = actions;
    this.input = input;
    this.stack = [];
    this.position = 0;
};

Arielworks.Parser.RecursiveDescentParser.Context.prototype.__skipWhiteSpace = function() {
    var s = this.input.substring(this.position).match(this.parser.getWhiteSpaceRule());
    if (s) this.position += s[0].length;
};

Arielworks.Parser.RecursiveDescentParser.Context.prototype.matchHead = function(str) {
    return this.input.substring(this.position, this.position + str.length) == str ? str : false;
};

Arielworks.Parser.RecursiveDescentParser.Context.prototype.matchRegExp = function(regExp) {
    var r = this.input.substring(this.position).match(regExp);
    if (r) {
        return r;
    } else {
        return false;
    }
};

Arielworks.Parser.RecursiveDescentParser.Context.prototype.proceed = function(length) {
    var r = this.input.substring(this.position, this.position + length);
    this.position += length;
    this.__skipWhiteSpace();
    return r;
};

Arielworks.Parser.RecursiveDescentParser.Context.prototype.hasRemaing = function() {
    return this.input.length < this.position;
}



Arielworks.Parser.RecursiveDescentParser.Expression = Class.create();

Arielworks.Parser.RecursiveDescentParser.Expression.prototype.___constructor = function(element, name, callee) {
    this.setElement(element);
    this.setCallee(callee || name);
    this.setName(name);
};

Arielworks.Parser.RecursiveDescentParser.Expression.prototype.setElement = function(element) {
    this.element = element;
};

Arielworks.Parser.RecursiveDescentParser.Expression.prototype.setCallee = function(callee) {
    this.callee = callee;
};

Arielworks.Parser.RecursiveDescentParser.Expression.prototype.setName = function(name) {
    this.name = name;
};

Arielworks.Parser.RecursiveDescentParser.Expression.prototype.descend = function(context) {
    if (this.name) context.stack.push(this);

    var preR;
    if (context.actions["_" + this.callee]) var preR = (context.actions["_" + this.callee])(context);

    if (context.actions[this.callee]) {
        var r = (context.actions[this.callee])(this.__doDescend(context), context, preR);
    } else {
        var r = this.__doDescend(context);
    }
    if (this.name) context.stack.pop(this);

    return r;
};

Arielworks.Parser.RecursiveDescentParser.Expression.prototype.lookahead = function(context) {
    var x = this.__doLookahead(context);

    return x;
};




Arielworks.Parser.RecursiveDescentParser.SequentialExpression = Class.extend(Arielworks.Parser.RecursiveDescentParser.Expression);

Arielworks.Parser.RecursiveDescentParser.SequentialExpression.prototype.___constructor = function() {
    Arielworks.Parser.RecursiveDescentParser.SequentialExpression.___super.prototype.___constructor.apply(this, arguments);
};

Arielworks.Parser.RecursiveDescentParser.SequentialExpression.prototype.__doDescend = function(context) {
    var r = new Array(this.element.length);
    for (var i = 0; i < this.element.length; i++) {
        r[i] = this.element[i].descend(context);
    }
    return r;
};

Arielworks.Parser.RecursiveDescentParser.SequentialExpression.prototype.__doLookahead = function(context) {
    return this.element[0].lookahead(context);
};




Arielworks.Parser.RecursiveDescentParser.OrExpression = Class.extend(Arielworks.Parser.RecursiveDescentParser.Expression);

Arielworks.Parser.RecursiveDescentParser.OrExpression.prototype.___constructor = function() {
    Arielworks.Parser.RecursiveDescentParser.OrExpression.___super.prototype.___constructor.apply(this, arguments);
};

Arielworks.Parser.RecursiveDescentParser.OrExpression.prototype.__doDescend = function(context) {
    var r = new Array(this.element.length);
    var found = false;
    for (var i = 0; i < this.element.length; i++) {
        if (this.element[i].lookahead(context)) {
            r[i] = this.element[i].descend(context);
            found = true;
            break;
        }
    }

    if (found) {
        return r;
    } else {
        throw new Error("Or");
    }
};

Arielworks.Parser.RecursiveDescentParser.OrExpression.prototype.__doLookahead = function(context) {
    for (var i = 0; i < this.element.length; i++) {
        if (this.element[i].lookahead(context)) {
            return true;
        }
    }
    return false;
};




Arielworks.Parser.RecursiveDescentParser.OneOrNothingExpression = Class.extend(Arielworks.Parser.RecursiveDescentParser.Expression);

Arielworks.Parser.RecursiveDescentParser.OneOrNothingExpression.prototype.___constructor = function() {
    Arielworks.Parser.RecursiveDescentParser.OneOrNothingExpression.___super.prototype.___constructor.apply(this, arguments);
};

Arielworks.Parser.RecursiveDescentParser.OneOrNothingExpression.prototype.__doDescend = function(context) {
    var r;
    if (this.element.lookahead(context)) {
        r = this.element.descend(context);
    }
    return r;
};

Arielworks.Parser.RecursiveDescentParser.OneOrNothingExpression.prototype.__doLookahead = function(context) {
    return true;
};




Arielworks.Parser.RecursiveDescentParser.ZeroOrMoreExpression = Class.extend(Arielworks.Parser.RecursiveDescentParser.Expression);

Arielworks.Parser.RecursiveDescentParser.ZeroOrMoreExpression.prototype.___constructor = function() {
    Arielworks.Parser.RecursiveDescentParser.ZeroOrMoreExpression.___super.prototype.___constructor.apply(this, arguments);
};

Arielworks.Parser.RecursiveDescentParser.ZeroOrMoreExpression.prototype.__doDescend = function(context) {
    var r = [];
    while (this.element.lookahead(context)) {
        r.push(this.element.descend(context));
    }
    return r;
};

Arielworks.Parser.RecursiveDescentParser.ZeroOrMoreExpression.prototype.__doLookahead = function(context) {
    return true;
};




Arielworks.Parser.RecursiveDescentParser.OneOrMoreExpression = Class.extend(Arielworks.Parser.RecursiveDescentParser.Expression);

Arielworks.Parser.RecursiveDescentParser.OneOrMoreExpression.prototype.___constructor = function() {
    Arielworks.Parser.RecursiveDescentParser.OneOrMoreExpression.___super.prototype.___constructor.apply(this, arguments);
};

Arielworks.Parser.RecursiveDescentParser.OneOrMoreExpression.prototype.__doDescend = function(context) {
    var r = [];
    if (this.element.lookahead(context)) {
        r.push(this.element.descend(context));
    } else {
        throw "OneOrMore";
    }

    while (this.element.lookahead(context)) {
        r.push(this.element.descend(context));
    }
    return r;
};

Arielworks.Parser.RecursiveDescentParser.OneOrMoreExpression.prototype.__doLookahead = function(context) {
    return this.element.lookahead(context);
};




Arielworks.Parser.RecursiveDescentParser.TerminalString = Class.extend(Arielworks.Parser.RecursiveDescentParser.Expression);

Arielworks.Parser.RecursiveDescentParser.TerminalString.prototype.___constructor = function() {
    Arielworks.Parser.RecursiveDescentParser.TerminalString.___super.prototype.___constructor.apply(this, arguments);
};

Arielworks.Parser.RecursiveDescentParser.TerminalString.prototype.__doDescend = function(context) {
    var m;
    if (m = context.matchHead(this.element)) {
        r = context.proceed(m.length);
        return r;
    } else {
        throw "TerminalString";
    }
};

Arielworks.Parser.RecursiveDescentParser.TerminalString.prototype.__doLookahead = function(context) {
    return context.matchHead(this.element);
};




Arielworks.Parser.RecursiveDescentParser.TerminalRegExp = Class.extend(Arielworks.Parser.RecursiveDescentParser.Expression);

Arielworks.Parser.RecursiveDescentParser.TerminalRegExp.prototype.___constructor = function() {
    Arielworks.Parser.RecursiveDescentParser.TerminalRegExp.___super.prototype.___constructor.apply(this, arguments);
};

Arielworks.Parser.RecursiveDescentParser.TerminalRegExp.prototype.__doDescend = function(context) {
    var m;
    if (m = context.matchRegExp(this.element)) {
        context.proceed(m[0].length);
        return m;
    } else {
        throw "TerminalRegExp";
    }
};

Arielworks.Parser.RecursiveDescentParser.TerminalRegExp.prototype.__doLookahead = function(context) {
    return context.matchRegExp(this.element);
};

Arielworks.Hercules.Serialized.Turtle.Parser = Class.create();
Arielworks.Hercules.Serialized.Turtle.Parser.XSD_NAMESPACE = "http://www.w3.org/2001/XMLSchema#";
Arielworks.Hercules.Serialized.Turtle.Parser.XSD_INTEGER = Arielworks.Hercules.Serialized.Turtle.Parser.XSD_NAMESPACE + "integer";
Arielworks.Hercules.Serialized.Turtle.Parser.XSD_DECIMAL = Arielworks.Hercules.Serialized.Turtle.Parser.XSD_NAMESPACE + "decimal";
Arielworks.Hercules.Serialized.Turtle.Parser.XSD_DOUBLE = Arielworks.Hercules.Serialized.Turtle.Parser.XSD_NAMESPACE + "double";
Arielworks.Hercules.Serialized.Turtle.Parser.XSD_BOOLEAN = Arielworks.Hercules.Serialized.Turtle.Parser.XSD_NAMESPACE + "boolean";
/*
Arielworks.Hercules.Serialized.Turtle.serialize = function(graph) {
    for (var i = 0; i < graph.tripleList.length; i++) {
        var currentTriple = graph.tripleList[i]

    }
}

Arielworks.Hercules.Serialized.Turtle.serializeTerm = function(term) {
    if (term instanceof Arielworks.Hercules.Rdf.RdfUriRef) {
        return "<" + term.value.replace(">", "\\>") + ">";
    } else if (term instanceof Arielworks.Hercules.Rdf.PlainLiteral) {
        return term.value + (term.languageTag ? ""term.languageTag : "");
    } else if (term instanceof Arielworks.Hercules.Rdf.TypedLiteral) {
        return term.value + (term.languageTag ? term.languageTag : "");
    }
}
*/with(Arielworks.Parser.RecursiveDescentParser.Parser) {
    Arielworks.Hercules.Serialized.Turtle.Parser.WHITE_SPACE_RULE = /^(?:[\u0020\u0009\u000D\u000A]*|#.*?$)*/m;
    Arielworks.Hercules.Serialized.Turtle.Parser.START_RULE = "turtleDoc";
    Arielworks.Hercules.Serialized.Turtle.Parser.RULE_SET = {
        "turtleDoc" : z("statement"),
        "statement" : [or("directive", "triples"), $('.')],
        "directive" : or("prefixID", "base"),
        "prefixID" : [$('@prefix'), n("PREFIX_NAME"), $(':'), "URI_REF"],
        "base" : [$('@base'), "URI_REF"],
        "triples" : ["subject", "predicateObjectList"],
        "predicateObjectList" : ["verb", "objectList", z($(';'), "verb", "objectList"), n($(';'))],
        "objectList" : ["object", z($(','), "object")],
        "verb" : or("predicate", $('a')),
        "subject" : or("resource", "blank"),
        "predicate" : "resource",
        "object" : or("resource", "blank", "literal"),
        "literal" : or(["quotedString", n(or("LANGUAGE_TAG", [$('^^'), "resource"]))], "DOUBLE", "DECIMAL", "INTEGER", "bool"),
        "INTEGER" : /^[-+]?[0-9]+/,
        "DOUBLE" : /^[-+]?(?:[0-9]+\.[0-9]*|\.[0-9]+|[0-9]+)[eE][-+]?[0-9]+/,
        "DECIMAL" : /^[-+]?(?:[0-9]+\.[0-9]*|\.[0-9]+)/,
        "EXPONENT" : /^[eE][-+]?[0-9]+/,
        "bool" : or($('true'), $('false')),
        "blank" : or("NODE_ID", [$('['), or($(']'), ["predicateObjectList", $(']')])], "collection"),
        "itemList" : o("object"),
        "collection" : [$('('), n("itemList"), $(')')],
        "ws" : /^[\u0009\u000A\u000D\u0020]/,
        "resource" : or("URI_REF", "QNAME"),
        "NODE_ID" : /^_:([A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD0-9\u00B7\u0300-\u036F\u203F-\u2040-]*)/,
        "QNAME" : /^([A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD0-9\u00B7\u0300-\u036F\u203F-\u2040-]*)?:([A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD0-9\u00B7\u0300-\u036F\u203F-\u2040-]*)?/,
        "URI_REF" : /^<((?:\\u[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\U[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\\\|[\u0020-\u003D\u003F-\u005B\u005D-\uFFFF]|\\t|\\n|\\r|\\>)*)>/,
        "LANGUAGE_TAG" : /^@([a-z]+(?:-[a-z0-9])*)/,
        "NAME_START_CHAR" : /^[A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/,
        "NAME_CHAR" : /^[A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD0-9\u00B7\u0300-\u036F\u203F-\u2040-]/,
        "NAME" : /^[A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD0-9\u00B7\u0300-\u036F\u203F-\u2040-]*/,
        "PREFIX_NAME" : /^[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD0-9\u00B7\u0300-\u036F\u203F-\u2040-]*/,
        "RELATIVE_URI" : /^(?:\\u[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\U[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\\\|[\u0020-\u003D\u003F-\u005B\u005D-\uFFFF]|\\t|\\n|\\r|\\>)*/,
        "quotedString" : or("LONG_STRING", "STRING"),
        "STRING" : /^"((?:\\u[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\U[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\\\|[\u0020-\u0021\u0023-\u005B\u005D-\uFFFF]|\\t|\\n|\\r|\\")*)"/,
        "LONG_STRING" : /^"""((?:\\u[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\U[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\\\|[\u0020-\u005B\u005D-\uFFFF\u0009\u000A\u000D]|\\t|\\n|\\r|\\")*)"""/,
        "CHARACTER" : /^(?:\\u[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\U[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\\\|[\u0020-\u005B\u005D-\uFFFF])/,
        "ECHARACTER" : /^(?:\\u[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\U[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\\\|[\u0020-\u005B\u005D-\uFFFF]|\\t|\\n|\\r)/,
        "HEX" : /^[\u0030-\u0039\u0041-\u0046]/,
        "UCHARACTER" : /^(?:\\u[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\U[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\\\|[\u0020-\u003D\u003F-\u005B\u005D-\uFFFF]|\\t|\\n|\\r|\\>)/,
        "SCHARACTER" : /^(?:\\u[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\U[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\\\|[\u0020-\u0021\u0023-\u005B\u005D-\uFFFF]|\\t|\\n|\\r|\\")/,
        "LCHARACTER" : /^(?:\\u[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\U[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\\\|[\u0020-\u005B\u005D-\uFFFF\t\n\r\u0009\u000A\u000D]|\\")/
    };
}
Arielworks.Hercules.Serialized.Turtle.Turtle_1_0 = Class.create();

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.ECHARACTER_ESCAPE_REGX = /\\([\\tnruU])([\u0030-\u0039\u0041-\u0046]{8}|[\u0030-\u0039\u0041-\u0046]{4})?/g;
Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.UCHARACTER_ESCAPE_REGX = /\\([\\tnruU>])([\u0030-\u0039\u0041-\u0046]{8}|[\u0030-\u0039\u0041-\u0046]{4})?/g
Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.SCHARACTER_ESCAPE_REGX = /\\([\\tnruU"])([\u0030-\u0039\u0041-\u0046]{8}|[\u0030-\u0039\u0041-\u0046]{4})?/g //"comment to fix color hilighting of the editor

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.___constructor = function(baseUri) {
    this.graph = new Arielworks.Hercules.Rdf.Graph();
    this.nameSpace = {};
    this.defaultNameSpace = "";
    this.baseUri = Arielworks.Hercules.Rdf.RdfUriRef.normalize(baseUri);
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.__registerNameSpace = function(prefix, uri) {
    if (!prefix || prefix == "") {
        this.defaultNameSpace = uri;
    } else {
        this.nameSpace[prefix] = uri;
    }
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.__resolvePrefiexName = function(prefix, local) {
    if (!prefix || prefix == "") {
        return this.defaultNameSpace + local;
    } else {
        return this.nameSpace[prefix] + local;
    }
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.__resolveRelativeIri = function(uri) {
    return Arielworks.Hercules.Rdf.RdfUriRef.resolveUriRef(this.baseUri, uri);
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.__unescapeEcharacterCallback  = function(whole, e, hexs) {
    switch (e) {
      case "u" :
        return String.fromCharCode(parseInt(hexs, 16));
      case "U" :
        return String.fromCharCode(parseInt(hexs, 16));
      case "t" :
        return String.fromCharCode(0x0009);
      case "n" :
        return String.fromCharCode(0x000A);
      case "r" :
        return String.fromCharCode(0x000D);
      case "\"" :
        return String.fromCharCode(0x0022);
      case ">" :
        return String.fromCharCode(0x003E);
      case "\\" :
        return String.fromCharCode(0x005E);
      }
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.prefixID = function(r) {
    this.__registerNameSpace(r[1], r[3]);
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.base = function(r) {
    this.baseUri = r[1];
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.triples = function(r) {
    for (var i = 0; i < r[1].length; i += 2) {
        for (var j = 0; j < r[1][i + 1].length; j++) {
            this.graph.addTriple(r[0], r[1][i], r[1][i + 1][j]);
        }
    }
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.predicateObjectList = function(r) {
    var o = [r[0], r[1]];
    for (var i = 0; i < r[2].length; i++) {
        o.push(r[2][i][1]);
        o.push(r[2][i][2]);
    }
    return o;
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.objectList = function(r) {
    var o = [r[0]];
    for (var i = 0; i < r[1].length; i++) {
        o.push(r[1][i][1]);
    }
    return o;
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.verb = function(r) {
    if (r[0]) return r[0];
    else if (r[1]) return this.graph.getRdfUriRef(Arielworks.Hercules.Rdf.RDF_TYPE);
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.subject = function(r) {
    if(r[0]) return r[0]
    else if (r[1]) return r[1];
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.predicate = function(r) {
    return r[0];
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.object = function(r) {
    if(r[0]) return r[0];
    else if (r[1]) return r[1];
    else if (r[2]) return r[2];
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.literal = function(r) {
    if (r[0]) {
        if (r[0][1]) {
            if(r[0][1][0]) {
                var o = this.graph.getPlainLiteral(r[0][0], r[0][1][0]);
            } else if (r[0][1][1]) {
                var o = this.graph.getTypedLiteral(r[0][0], r[0][1][1][1].getValue());
            }
        } else {
            var o = this.graph.getPlainLiteral(r[0][0]);
        }
    } else if (r[1]) {
        var o = this.graph.getTypedLiteral(r[1], Arielworks.Hercules.Serialized.Turtle.Parser.XSD_DOUBLE);
    } else if (r[2]) {
        var o = this.graph.getTypedLiteral(r[1], Arielworks.Hercules.Serialized.Turtle.Parser.XSD_DECIMAL);
    } else if (r[3]) {
        var o = this.graph.getTypedLiteral(r[1], Arielworks.Hercules.Serialized.Turtle.Parser.XSD_INTEGER);
    } else if (r[4]) {
        var o = this.graph.getTypedLiteral(r[1], Arielworks.Hercules.Serialized.Turtle.Parser.XSD_BOOLEAN);
    }
    return o;
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.INTEGER = function(r) {
    return r[0];
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.DOUBLE = function(r) {
    return r[0];
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.DECIMAL = function(r) {
    return r[0];
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.bool = function(r) {
    if (r[0]) return r[0];
    else if (r[1]) return r[1];
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.blank = function(r) {
    if (r[0]) {
        return this.graph.getBlankNode(r[0]);
    } else if (r[1]) {
        if (r[1][1][0]) {
            return this.graph.getBlankNode();
        } else if (r[1][1][1]) {
            var o = this.graph.getBlankNode();
            for (var i = 0; i < r[1][1][1][0].length; i += 2) {
                for (var j = 0; j < r[1][1][1][0][i + 1].length; j++) {
                    this.graph.addTriple(o, r[1][1][1][0][i], r[1][1][1][0][i + 1][j]);
                }
            }
            return o;
        }
    } else if (r[2]) {
        var o = this.graph.getBlankNode();
        var subject = o;
        for (var i = 0; i < r[2].length; i++) {
            this.graph.addTriple(subject, this.graph.getRdfUriRef(Arielworks.Hercules.Rdf.RDF_COLLECTION_FIRST), r[2][i]);
            if (i < (r[2].length - 1)) {
                var object = this.graph.getBlankNode();
            } else {
                var object = this.graph.getRdfUriRef(Arielworks.Hercules.Rdf.RDF_COLLECTION_NIL);
            }
            this.graph.addTriple(subject, this.graph.getRdfUriRef(Arielworks.Hercules.Rdf.RDF_COLLECTION_REST), object);
            subject = object;
        }
        return o;
    }
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.itemList = function(r) {
    return r;
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.collection = function(r) {
    if (r[1]) {
        return r[1];
    } else {
        return [];
    }
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.resource = function(r) {
    if (r[0]) {
        return this.graph.getRdfUriRef(this.__resolveRelativeIri(r[0]));
    } else if(r[1]) {
        return this.graph.getRdfUriRef(this.__resolvePrefiexName(r[1]["prefix"], r[1]["local"]));
    }
}


Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.NODE_ID = function(r) {
    return r[1];
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.QNAME = function(r) {
    return {"prefix" : r[1], "local" : r[2]};
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.URI_REF = function(r) {
    return r[1].replace(this.constructor.UCHARACTER_ESCAPE_REGX, this.__unescapeEcharacterCallback);
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.LANGUAGE_TAG = function(r) {
    return r[1];
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.PREFIX_NAME = function(r) {
    return r[0];
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.quotedString = function(r) {
    if (r[0]) return r[0];
    else if (r[1]) return r[1];
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.STRING = function(r) {
    return r[1].replace(this.constructor.SCHARACTER_ESCAPE_REGX, this.__unescapeEcharacterCallback);
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.LONG_STRING = function(r) {
    return r[1].replace(this.constructor.SCHARACTER_ESCAPE_REGX, this.__unescapeEcharacterCallback);
};
Arielworks.Hercules.Sparql.ResultSet = Class.create();

Arielworks.Hercules.Sparql.ResultSet.prototype.___constructor = function(variableList) {
    this.variableList = variableList || [];
    this.length = 0;
};

/**
 * Returns an array of the variable names in the result set.
 * @return Array<string>
 */
Arielworks.Hercules.Sparql.ResultSet.prototype.getVariableList = function() {
    return this.variableList;
};

Arielworks.Hercules.Sparql.ResultSet.prototype.push = function(result) {
    this[this.length++] = result;
};



Arielworks.Hercules.Sparql.Variable = Arielworks.Util.Class.extend(Arielworks.Hercules.Rdf.Resource);
Arielworks.Hercules.Sparql.Variable.prototype.___constructor =  function(/*string*/ value) {
    this.___super(value);
};

Arielworks.Hercules.Sparql.Variable.prototype.toTableName = function() {
    return this.value;
};

Arielworks.Hercules.Sparql.BlankNode = Arielworks.Util.Class.extend(Arielworks.Hercules.Sparql.Variable);
Arielworks.Hercules.Sparql.BlankNode.prototype.___constructor =  function(/*string*/ value) {
    this.___super(value);
};

Arielworks.Hercules.Sparql.BlankNode.prototype.toTableName = function() {
    return "[" + this.value + "]";
};

Arielworks.Hercules.Sparql.VariableBindingTable = Class.create();

/**
 * TODO: Temporary class
 */
Arielworks.Hercules.Sparql.VariableBindingTable.prototype.___constructor = function(cloneOriginal) {
    this.table = {};

    if (cloneOriginal) for (var name in cloneOriginal.table) if (cloneOriginal.table.hasOwnProperty(name)) {
        this.table[name] = cloneOriginal.table[name];
    }
};

Arielworks.Hercules.Sparql.VariableBindingTable.prototype.bindAndClone = function(variables) {
    var cloned = new Arielworks.Hercules.Sparql.VariableBindingTable(this);
    for (var i = 0; i < variables.length; i += 2) {
        var key = variables[i].toTableName();
        var value = variables[i + 1];
        if (cloned.table[key] && ! cloned.table[key].equals(value)) {
            return false;
        } else {
            cloned.table[key] = value;
        }
    }
    return cloned;
};



Arielworks.Hercules.Sparql.MatchingResult = Class.create();

Arielworks.Hercules.Sparql.MatchingResult.prototype.___constructor = function(pattern) {
    this.pattern = pattern;
};


Arielworks.Hercules.Sparql.TripleMatchingResult = Class.extend(Arielworks.Hercules.Sparql.MatchingResult);

Arielworks.Hercules.Sparql.TripleMatchingResult.prototype.___constructor = function(pattern) {
    Arielworks.Hercules.Sparql.TripleMatchingResult.___super.prototype.___constructor.apply(this, arguments);
    this.resultList = [];
    this.isSubjectVariable = this.pattern.subject instanceof Arielworks.Hercules.Sparql.Variable;
    this.isPredicateVariable = this.pattern.predicate instanceof Arielworks.Hercules.Sparql.Variable;
    this.isObjectVariable = this.pattern.object instanceof Arielworks.Hercules.Sparql.Variable;
};

Arielworks.Hercules.Sparql.TripleMatchingResult.prototype.add = function(triple) {
    this.resultList.push(triple);
};

Arielworks.Hercules.Sparql.TripleMatchingResult.prototype.bindVariableRecursive = function(matchingResultListStack, depth, position, currentVariableTable, resultVariableTableList) {
    var pattern = this.pattern;
    var resultList = this.resultList;
    var resultListLength = resultList.length;
    var nextMatchingResult = matchingResultListStack[depth][position + 1];
    var isSubjectVariable = this.isSubjectVariable;
    var isPredicateVariable = this.isPredicateVariable;
    var isObjectVariable = this.isObjectVariable;

    for (var i = 0; i <resultListLength; i++) {
        var currentResult = resultList[i]
        var variabiles = [];

        if (isSubjectVariable) {
            variabiles.push(pattern.subject);
            variabiles.push(currentResult.subject);
        }
        if (isPredicateVariable) {
            variabiles.push(pattern.predicate);
            variabiles.push(currentResult.predicate);
        }
        if (isObjectVariable) {
            variabiles.push(pattern.object);
            variabiles.push(currentResult.object);
        }

        var newTable  = currentVariableTable.bindAndClone(variabiles);
        if (newTable != false) {
            if (nextMatchingResult) {
                nextMatchingResult.bindVariableRecursive(matchingResultList, position + 1, newTable, resultVariableTableList);
            } else {
                resultListener.report(newTable);
            }
        }
    }
};

Arielworks.Hercules.Sparql.TripleMatchingResult.prototype.bindVariableAllOpations = function(currentVariableTableList) {
    var pattern = this.pattern;
    var resultList = this.resultList;
    var resultListLength = resultList.length;
    var isSubjectVariable = this.isSubjectVariable;
    var isPredicateVariable = this.isPredicateVariable;
    var isObjectVariable = this.isObjectVariable;

    var currentVariableTableListLength = currentVariableTableList.length;
    var resultVariableTableList = [];

    for (var i = 0; i <resultListLength; i++) {
        var currentResult = resultList[i];
        var variabiles = [];

        if (isSubjectVariable) {
            variabiles.push(pattern.subject);
            variabiles.push(currentResult.subject);
        }
        if (isPredicateVariable) {
            variabiles.push(pattern.predicate);
            variabiles.push(currentResult.predicate);
        }
        if (isObjectVariable) {
            variabiles.push(pattern.object);
            variabiles.push(currentResult.object);
        }

        for (var j = 0; j < currentVariableTableListLength; j++) {
            var newTable = currentVariableTableList[j].bindAndClone(variabiles);
            if (newTable != false) resultVariableTableList.push(newTable);
        }
    }

    return resultVariableTableList;
};


Arielworks.Hercules.Sparql.GraphMatchingResult = Class.extend(Arielworks.Hercules.Sparql.MatchingResult);

Arielworks.Hercules.Sparql.GraphMatchingResult.prototype.___constructor = function(pattern) {
    Arielworks.Hercules.Sparql.GraphMatchingResult.___super.prototype.___constructor.apply(this, arguments);
    this.resultList = [];
};

Arielworks.Hercules.Sparql.GraphMatchingResult.prototype.add = function(matchingResult) {
    this.resultList.push(matchingResult);
};

Arielworks.Hercules.Sparql.GraphMatchingResult.prototype.bindVariableRecursive = function(matchingResultList, position, currentVariableTable, resultListener) {
    var resultList = this.resultList;
    var resultListLength = resultList.length;
    var clonedTable = new Arielworks.Hercules.Sparql.VariableBindingTable(currentVariableTable);
    this.resultList[0].bindVariableRecursive(this.resultList, position, clonedTable, this);
};

Arielworks.Hercules.Sparql.GraphMatchingResult.prototype.bindVariableAllOpations = function(currentVariableTableList) {
    var resultList = this.resultList;
    var resultListLength = resultList.length;
    for (var i = 0; i< resultListLength; i++) {
        currentVariableTableList = resultList[i].bindVariableAllOpations(currentVariableTableList);
    }
    return currentVariableTableList;
};


Arielworks.Hercules.Sparql.UnionMatchingResult = Class.extend(Arielworks.Hercules.Sparql.MatchingResult);
Arielworks.Hercules.Sparql.UnionMatchingResult.prototype.___constructor = function(pattern) {
    Arielworks.Hercules.Sparql.GraphMatchingResult.___super.prototype.___constructor.apply(this, arguments);
    this.resultList = [];
};

Arielworks.Hercules.Sparql.UnionMatchingResult.prototype.add = function(matchingResult) {
    this.resultList.push(matchingResult);
};

Arielworks.Hercules.Sparql.UnionMatchingResult.prototype.bindVariableAllOpations = function(currentVariableTableList) {
    var resultList = this.resultList;
    var resultListLength = resultList.length;

    var currentVariableTableListLength = currentVariableTableList.length
    var resultVariableTableList = [];
    for (var i = 0; i < resultListLength; i++) {
        resultVariableTableList = resultVariableTableList.concat(resultList[i].bindVariableAllOpations(currentVariableTableList));
    }
    return resultVariableTableList;
};





Arielworks.Hercules.Sparql.Pattern = Class.create();
Arielworks.Hercules.Sparql.Pattern.prototype.___constructor = function() {
};

Arielworks.Hercules.Sparql.TriplePattern = Class.extend(Arielworks.Hercules.Sparql.Pattern);
Arielworks.Hercules.Sparql.TriplePattern.prototype.___constructor = function(subject, predicate, object) {
    this.subject = subject;
    this.predicate = predicate;
    this.object = object;
    this.variableCount = 0;

    if (this.subject instanceof Arielworks.Hercules.Sparql.Variable) this.variableCount++;
    if (this.predicate instanceof Arielworks.Hercules.Sparql.Variable) this.variableCount++;
    if (this.object instanceof Arielworks.Hercules.Sparql.Variable) this.variableCount++;
};

Arielworks.Hercules.Sparql.TriplePattern.prototype.match = function(targetGraph) {
    var result = new Arielworks.Hercules.Sparql.TripleMatchingResult(this);

    var targetGraphLength = targetGraph.length;
    var subject = this.subject;
    var predicate = this.predicate;
    var object = this.object;
    var isNotSubjectVariable = (! (subject instanceof Arielworks.Hercules.Sparql.Variable) ||  (subject instanceof Arielworks.Hercules.Sparql.BlankNode) );
    var isNotPredicateVariable = (! (predicate instanceof Arielworks.Hercules.Sparql.Variable) ||  (subject instanceof Arielworks.Hercules.Sparql.BlankNode) );
    var isNotObjectVariable = (! (object instanceof Arielworks.Hercules.Sparql.Variable ||  (subject instanceof Arielworks.Hercules.Sparql.BlankNode) ));

    for (var i = 0;  i < targetGraphLength; i++) {
        var targetTriple = targetGraph[i];
        if (isNotSubjectVariable && ! subject.equals(targetTriple.subject)) continue;
        if (isNotPredicateVariable && ! predicate.equals(targetTriple.predicate)) continue;
        if (isNotObjectVariable && ! object.equals(targetTriple.object)) continue;
        result.add(targetTriple);
    }

    return result;
};



Arielworks.Hercules.Sparql.GraphPattern = Class.extend(Arielworks.Hercules.Sparql.Pattern);

Arielworks.Hercules.Sparql.GraphPattern.prototype.___constructor = function() {
    this.patternList = [];
};

Arielworks.Hercules.Sparql.GraphPattern.prototype.addPattern = function(/*Arielworks.Hercules.Sparql.Pattern*/ pattern) {
    this.patternList.push(pattern);
};

Arielworks.Hercules.Sparql.GraphPattern.prototype.match = function(targetGraph) {
    var matchingResult = new Arielworks.Hercules.Sparql.GraphMatchingResult(this);
    for (var i = 0; i < this.patternList.length; i++) {
        matchingResult.add(this.patternList[i].match(targetGraph));
    }
    return matchingResult;
};


Arielworks.Hercules.Sparql.UnionPattern = Class.extend(Arielworks.Hercules.Sparql.Pattern);
Arielworks.Hercules.Sparql.UnionPattern.prototype.___constructor = function() {
    this.patternList = [];
};

Arielworks.Hercules.Sparql.UnionPattern.prototype.addPattern = function(/*Arielworks.Hercules.Sparql.GraphPattern*/ pattern) {
    this.patternList.push(pattern);
};

Arielworks.Hercules.Sparql.UnionPattern.prototype.match = function(targetGraph) {
    var matchingResult = new Arielworks.Hercules.Sparql.UnionMatchingResult(this);
    for (var i = 0; i < this.patternList.length; i++) {
        matchingResult.add(this.patternList[i].match(targetGraph));
    }
    return matchingResult;
};



Arielworks.Hercules.Sparql.Engine = Class.create();

Arielworks.Hercules.Sparql.Engine.prototype.___constructor = function(graph) {
    this.graph = graph;
    this.parser;
};

Arielworks.Hercules.Sparql.Engine.prototype.prepare = function(queryString) {
    if (! this.parser) {
        this.parser = new Arielworks.Parser.RecursiveDescentParser.Parser();
        this.parser.setRuleSet(Arielworks.Hercules.Sparql.Engine.RULE_SET);
        this.parser.setWhiteSpaceRule(Arielworks.Hercules.Sparql.Engine.WHITE_SPACE_RULE);
        this.parser.compileRuleSet();
    };

    var action = new Arielworks.Hercules.Sparql.SparqlAction_1_0(this);
    var query = this.parser.parse(queryString, Arielworks.Hercules.Sparql.Engine.START_RULE, action);
    return query;
};

Arielworks.Hercules.Sparql.Engine.prototype.getTriplePattern = function(subject, predicate, object) {
    return new Arielworks.Hercules.Sparql.TriplePattern(subject, predicate, object);
};


Arielworks.Hercules.Sparql.Query = Class.create();

Arielworks.Hercules.Sparql.Query.prototype.___constructor = function(engine) {
    this.engine = engine;
    this.namespaceList = {};
};



Arielworks.Hercules.Sparql.Query.prototype.getTriplePattern = function(subject, predicate, object) {
    return this.engine.getTriplePattern(subject, predicate, object);
};

Arielworks.Hercules.Sparql.Query.prototype.getRdfUriRef = function(/*string*/ uri) {
    return new Arielworks.Hercules.Rdf.RdfUriRef(uri);
};

Arielworks.Hercules.Sparql.Query.prototype.getPlainLiteral = function(/*string*/ value, languageTag) {
    return new Arielworks.Hercules.Rdf.PlainLiteral(value, languageTag);
};

Arielworks.Hercules.Sparql.Query.prototype.getTypedLiteral = function(/*string*/ value, datatypeIri) {
    return new Arielworks.Hercules.Rdf.TypedLiteral(value, datatypeIri);
};

Arielworks.Hercules.Sparql.Query.prototype.getBlankNode = function(/*string*/ id) {
    return new Arielworks.Hercules.Sparql.BlankNode(id);
};

Arielworks.Hercules.Sparql.Query.prototype.getVariable = function(name) {
    if (! this.variableHash[name]) {
        this.variableHash[name] = new Arielworks.Hercules.Sparql.Variable(name);
        this.variableList.push(name);
    }
    return this.variableHash[name];
};



Arielworks.Hercules.Sparql.SelectQuery = Class.extend(Arielworks.Hercules.Sparql.Query);

Arielworks.Hercules.Sparql.SelectQuery.prototype.___constructor = function() {
    Arielworks.Hercules.Sparql.SparqlQuery.___super.prototype.___constructor.apply(this, arguments);
    this.duplicateSolution = "DEFAULT";
};

Arielworks.Hercules.Sparql.SelectQuery.prototype.___constructor = function() {
    Arielworks.Hercules.Sparql.SelectQuery.___super.prototype.___constructor.apply(this, arguments);
    this.variableHash = {};
    this.variableList = [];
    this.isAllVariableSelected = false;
    this.resultVariableList = [];
    this.rootPattern;
};


Arielworks.Hercules.Sparql.SelectQuery.prototype.registerResultVariable = function(variableName) {
    this.resultVariableList.push(variableName);
};

Arielworks.Hercules.Sparql.SelectQuery.prototype.setIsAllVariableSelected = function(isAllVariableSelected) {
    this.isAllVariableSelected = isAllVariableSelected;
}

Arielworks.Hercules.Sparql.SelectQuery.prototype.addTriplePattern = function(pattern) {
    this.rootPattern.addTriplePattern(pattern);
};

Arielworks.Hercules.Sparql.SelectQuery.prototype.setDuplicateSolution = function(name) {
    this.duplicateSolution = name;
};

Arielworks.Hercules.Sparql.SelectQuery.prototype.setRootPattern = function(pattern) {
    this.rootPattern = pattern;
};

Arielworks.Hercules.Sparql.SelectQuery.prototype.execute = function() {


    var matchingResult = this.rootPattern.match(this.engine.graph);


/*
    matchingResultList.sort(function(a, b) {
        if (a.resultList.getLength() > b.resultList.getLength()) {
            return true;
        } else if (a.resultList.getLength() == b.resultList.getLength()) {
            if (a instanceof Arielworks.Hercules.Sparql.Variable) return true;
            else if (b instanceof Arielworks.Hercules.Sparql.Variable) return false;
            else if (a.pattern.variableCount > b.pattern.variableCount) return true;
        } else {
            return false;
        }
    });
*/
    var variableBindingTableList = matchingResult.bindVariableAllOpations([new Arielworks.Hercules.Sparql.VariableBindingTable()]);

    var variableBindingTableListLength = variableBindingTableList.length;
    var resultVariableList = this.isAllVariableSelected ? this.variableList : this.resultVariableList;
    var resultVariableListLength = resultVariableList.length;
    var resultSet = new Arielworks.Hercules.Sparql.ResultSet(resultVariableList);
    for (var i = 0; i < variableBindingTableListLength; i++) {
        var result = {};
        var currentVariableBindingTable = variableBindingTableList[i].table;
        for (var j = 0; j < resultVariableListLength; j++) {
            result[resultVariableList[j]] = currentVariableBindingTable[resultVariableList[j]];
        }
        resultSet.push(result);
    }



    return resultSet;
};
with(Arielworks.Parser.RecursiveDescentParser.Parser) {
    Arielworks.Hercules.Sparql.Engine.WHITE_SPACE_RULE = /^([\u0020\u0009\u000D\u000A]*|#.*?$)*/m;
    Arielworks.Hercules.Sparql.Engine.START_RULE = "Query";
    Arielworks.Hercules.Sparql.Engine.RULE_SET = {
        "Query": ["Prologue", or("SelectQuery", "ConstructQuery", "DescribeQuery", "AskQuery")],
        "Prologue": [n("BaseDecl"), z("PrefixDecl")],
        "BaseDecl": [$('BASE'), "IRI_REF"],
        "PrefixDecl": [$('PREFIX'), "PNAME_NS", "IRI_REF"],
        "SelectQuery": [$('SELECT'), n(or($('DISTINCT'), $('REDUCED'))), or(o("Var"), $('*')), z("DatasetClause"), "WhereClause", "SolutionModifier"],
        "ConstructQuery": [$('CONSTRUCT'), "ConstructTemplate", z("DatasetClause"), "WhereClause", "SolutionModifier"],
        "DescribeQuery": [$('DESCRIBE'), or(o("VarOrIRIref"), $('*')), z("DatasetClause"), n("WhereClause"), "SolutionModifier"],
        "AskQuery": [$('ASK'), z("DatasetClause"), "WhereClause"],
        "DatasetClause": [$('FROM'), or("DefaultGraphClause", "NamedGraphClause")],
        "DefaultGraphClause": "SourceSelector",
        "NamedGraphClause": [$('NAMED'), "SourceSelector"],
        "SourceSelector": "IRIref",
        "WhereClause": [n($('WHERE')), "GroupGraphPattern"],
        "SolutionModifier": [n("OrderClause"), n("LimitOffsetClauses")],
        "LimitOffsetClauses": or(["LimitClause", n("OffsetClause")],["OffsetClause", n("LimitClause")]),
        "OrderClause": [$('ORDER'), $('BY'), o("OrderCondition")],
        "OrderCondition": or([or($('ASC'), $('DESC')), "BrackettedExpression"], or("Constraint", "Var")),
        "LimitClause": [$('LIMIT'), "INTEGER"],
        "OffsetClause": [$('OFFSET'), "INTEGER"],
        "GroupGraphPattern": [$('{'), n("TriplesBlock"), z(or( "GraphPatternNotTriples", "Filter"), n($('.')), n("TriplesBlock")), $('}')],
        "TriplesBlock": ["TriplesSameSubject", n($('.'), n("TriplesBlock"))],
        "GraphPatternNotTriples": or("OptionalGraphPattern", "GroupOrUnionGraphPattern", "GraphGraphPattern"),
        "OptionalGraphPattern": [$('OPTIONAL'), "GroupGraphPattern"],
        "GraphGraphPattern": [$('GRAPH'), "VarOrIRIref", "GroupGraphPattern"],
        "GroupOrUnionGraphPattern": ["GroupGraphPattern", z($('UNION'), "GroupGraphPattern")],
        "Filter": [$('FILTER'), "Constraint"],
        "Constraint": or("BrackettedExpression", "BuiltInCall", "FunctionCall"),
        "FunctionCall": ["IRIref", "ArgList"],
        "ArgList": or("NIL", [$('('), "Expression", z($(','), "Expression"), $(')')]),
        "ConstructTemplate": [$('{'), n("ConstructTriples"), $('}')],
        "ConstructTriples": ["TriplesSameSubject", n($('.'), n("ConstructTriples"))],
        "TriplesSameSubject": or(["VarOrTerm", "PropertyListNotEmpty"],["TriplesNode", "PropertyList"]),
        "PropertyListNotEmpty": ["Verb", "ObjectList", z($(';'), n("Verb", "ObjectList"))],
        "PropertyList": n("PropertyListNotEmpty"),
        "ObjectList": ["Object", z($(','), "Object")],
        "Object": "GraphNode",
        "Verb": or("VarOrIRIref", $('a')),
        "TriplesNode": or("Collection", "BlankNodePropertyList"),
        "BlankNodePropertyList": [$('['), "PropertyListNotEmpty", $(']')],
        "Collection": [$('('), o("GraphNode"), $(')')],
        "GraphNode": or("VarOrTerm", "TriplesNode"),
        "VarOrTerm": or("Var", "GraphTerm"),
        "VarOrIRIref": or("Var", "IRIref"),
        "Var": or("VAR1", "VAR2"),
        "GraphTerm": or("IRIref", "RDFLiteral", "NumericLiteral", "BooleanLiteral", "BlankNode", "NIL"),
        "Expression": "ConditionalOrExpression",
        "ConditionalOrExpression": ["ConditionalAndExpression", z($('||'), "ConditionalAndExpression")],
        "ConditionalAndExpression": ["ValueLogical", z($('&&'), "ValueLogical" )],
        "ValueLogical": "RelationalExpression",
        "RelationalExpression": ["NumericExpression", n(or([$('='), "NumericExpression"], [$('!='), "NumericExpression"], [$('<'), "NumericExpression"], [$('>'), "NumericExpression"], [$('<='), "NumericExpression"], [$('>='), "NumericExpression" ]))],
        "NumericExpression": "AdditiveExpression",
        "AdditiveExpression": ["MultiplicativeExpression", z(or([$('+'), "MultiplicativeExpression"], [$('-'), "MultiplicativeExpression"], "NumericLiteralPositive", "NumericLiteralNegative"))],
        "MultiplicativeExpression": ["UnaryExpression", z(or([$('*'), "UnaryExpression"], [$('/'), "UnaryExpression"]))],
        "UnaryExpression": or([$('!'), "PrimaryExpression"], [$('+'), "PrimaryExpression"], [$('-'), "PrimaryExpression"], "PrimaryExpression"),
        "PrimaryExpression": or("BrackettedExpression", "BuiltInCall", "IRIrefOrFunction", "RDFLiteral", "NumericLiteral", "BooleanLiteral", "Var"),
        "BrackettedExpression": [$('('), "Expression", $(')')],
        "BuiltInCall": or([$('STR'), $('('), "Expression", $(')')], [$('LANG'), $('('), "Expression", $(')')], [$('LANGMATCHES'), $('('), "Expression", $(','), "Expression", $(')')], [$('DATATYPE'), $('('), "Expression", $(')')], [$('BOUND'), $('('), "Var", $(')')], [$('sameTerm'), $('('), "Expression", $(','), "Expression", $(')')], [$('isIRI'), $('('), "Expression", $(')')], [$('isURI'), $('('), "Expression", $(')')], [$('isBLANK'), $('('), "Expression", $(')')], [$('isLITERAL'), $('('), "Expression", $(')')], "RegexExpression"),
        "RegexExpression": [$('REGEX'), $('('), "Expression", $(','), "Expression", n($(','), "Expression"), $(')')],
        "IRIrefOrFunction": ["IRIref", n("ArgList")],
        "RDFLiteral": ["String", n(or("LANGTAG", [$('^^'), "IRIref"]))],
        "NumericLiteral": or("NumericLiteralUnsigned", "NumericLiteralPositive", "NumericLiteralNegative"),
        "NumericLiteralUnsigned": or("DOUBLE", "DECIMAL", "INTEGER"),
        "NumericLiteralPositive": or("DOUBLE_POSITIVE", "DECIMAL_POSITIVE", "INTEGER_POSITIVE"),
        "NumericLiteralNegative": or("DOUBLE_NEGATIVE", "DECIMAL_NEGATIVE", "INTEGER_NEGATIVE"),
        "BooleanLiteral": or($('true'), $('false')),
        "String": or("STRING_LITERAL_LONG1", "STRING_LITERAL_LONG2", "STRING_LITERAL1", "STRING_LITERAL2"),
        "IRIref": or("IRI_REF", "PrefixedName"),
        "PrefixedName": or("PNAME_LN", "PNAME_NS"),
        "BlankNode": or("BLANK_NODE_LABEL", "ANON"),
        "IRI_REF": /^<((?:[^<>"{}])*)>/,
        "PNAME_NS": /^([A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD](?:[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040.-]*[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040-])?)?:/,
        "PNAME_LN": /^([A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD](?:[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040.-]*[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040-])?)?:([A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9](?:[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040.-]*[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040-])?)/,
        "BLANK_NODE_LABEL": /^_:([A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9](?:[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040.-]*[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040-])?)/,
        "VAR1": /^\?([A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9][A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040]*)/,
        "VAR2": /^\$([A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9][A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040]*)/,
        "LANGTAG": /^@([a-zA-Z]+(?:-[a-zA-Z0-9]+)*)/,
        "INTEGER": /^[0-9]+/,
        "DECIMAL": /^(?:[0-9]+\.[0-9]*|\.[0-9]+)/,
        "DOUBLE": /^(?:[0-9]+\.[0-9]*[eE][+-]?[0-9]+|\.[0-9]+[eE][+-]?[0-9]+|[0-9]+[eE][+-]?[0-9]+)/,
        "INTEGER_POSITIVE": /^\+(?:[0-9]+)/,
        "DECIMAL_POSITIVE": /^\+(?:[0-9]+\.[0-9]*|\.[0-9]+)/,
        "DOUBLE_POSITIVE":  /^\+(?:[0-9]+\.[0-9]*[eE][+-]?[0-9]+|\.[0-9]+[eE][+-]?[0-9]+|[0-9]+[eE][+-]?[0-9]+)/,
        "INTEGER_NEGATIVE": /^-[0-9]+/,
        "DECIMAL_NEGATIVE": /^-(?:[0-9]+\.[0-9]*|\.[0-9]+)/,
        "DOUBLE_NEGATIVE": /^-(?:[0-9]+\.[0-9]*[eE][+-]?[0-9]+|\.[0-9]+[eE][+-]?[0-9]+|[0-9]+[eE][+-]?[0-9]+)/,
        "EXPONENT": /^[eE][+-]?[0-9]+/,
        "STRING_LITERAL1": /^'((?:[^\u0027\u005C\u000A\u000D]|\\[tbnrf\\"'])*)'/,
        "STRING_LITERAL2": /^"((?:[^\u0022\u005C\u000A\u000D]|\\[tbnrf\\"'])*)"/,
        "STRING_LITERAL_LONG1": /^'''((?:(?:'|'')?(?:[^'\\]|\\[tbnrf\\"']))*)'''/,
        "STRING_LITERAL_LONG2": /^"""((?:(?:"|"")?(?:[^"\\]|\\[tbnrf\\"']))*)"""/,
        "ECHAR":  /^\\[tbnrf\\"']/,
        "NIL": /^\([\u0020\u0009\u000D\u000A]*\)/,
        "WS": /^[\u0020\u0009\u000D\u000A]/,
        "ANON": /^\[[\u0020\u0009\u000D\u000A]*\]/,
        "PN_CHARS_BASE": /^[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/,
        "PN_CHARS_U": /^[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_]/,
        "VARNAME": /^[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9][A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040]*/,
        "PN_CHARS": /^[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040=]/,
        "PN_PREFIX": /^[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD](?:[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040.-]*[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040-])?/,
        "PN_LOCAL": /^[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9](?:[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040.-]*[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040-])?/
    };
}
Arielworks.Hercules.Sparql.SparqlAction_1_0 = Class.create();

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.___constructor = function(engine) {
    this.engine = engine;
    this.query;
    this.graphStack = [];
    this.namespaceList = {};
    this.baseIri;
    this.blankNodes = {};
    this.blankNodeCount = 0;
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.__registerNamespace = function(prefix, uri) {
    this.namespaceList[prefix] = uri;
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.__resolvePrefiexName = function(prefix, local) {
    if (! this.namespaceList[prefix]) throw "Prefix " + prefix + " is not decreared.";
    return this.namespaceList[prefix] + local;
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.__setBaseIri = function(uri) {
    this.baseIri = uri;
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.__resolveIriRef = function(iri) {
    return Arielworks.Hercules.Rdf.RdfUriRef.resolveUriRef(this.baseIri, iri);
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.__getBlankNode = function(name) {
    if (! name || name == "") return this.query.getBlankNode(this.blankNodeCount++);
    if (! this.blankNodes[name]){
       this.blankNodeCount++
       this.blankNodes[name] = this.query.getBlankNode(name);
    }
    return this.blankNodes[name];
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.Query = function(r) {
    for (var i = 0; i < r[1].length; i++) if (r[1][i]) return r[1][i];
}

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.BaseDecl = function(r) {
    this.__setBaseIri(r[1][1]);
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.PrefixDecl = function(r) {
    this.__registerNamespace(r[1][1], r[2][1]);
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype._SelectQuery = function(r) {
    this.query = new Arielworks.Hercules.Sparql.SelectQuery(this.engine);
};
Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.SelectQuery = function(r) {
    if (r[1]) {
        if (r[1][0]) this.query.setDuplicateSolution(r[1][0]);
        else if (r[1][1]) this.query.setDuplicateSolution(r[1][1]);
    }
    if (r[2][1]) {
        this.query.setIsAllVariableSelected(true);
    } else {
        for (var i = 0; i < r[2][0].length; i++) {
            this.query.registerResultVariable(r[2][0][i]);
        }
    }

    if (r[3]) {
    }

    this.query.setRootPattern(r[4]);

    return this.query;
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.DatasetClause = function(r) {
    throw "Dataset is NOT supported.";
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.WhereClause = function (r) {
    return r[1];
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype._GroupGraphPattern = function(r) {
    this.graphStack.unshift(new Arielworks.Hercules.Sparql.GraphPattern());
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.GroupGraphPattern = function(r) {
    var o = this.graphStack[0];
    if (r[1]) {
        for (var i = 0; i < r[1].length; i++) o.addPattern(r[1][i]);
    }

    for (var i = 0; i < r[2].length; i++) {
        if (r[2][i][0][0]) {
            o.addPattern(r[2][i][0][0]);
        } else if (r[2][i][0][1]) {
            throw "NOT IMPLEMENTED YET"; //TODO
        }
        if (r[2][i][2]) {
            for (var j = 0; j < r[2][i][2].length; j++) o.addPattern(r[2][i][2][j]);
        }
    }
    this.graphStack.shift();
    return o;
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.TriplesBlock = function(r) {
    var o = [];
    for (var i = 0; i < r[0].length; i++) o.push(r[0][i]);
    if (r[1] && r[1][1]) {
        for (var i = 0; i < r[1][1].length; i++) o.push(r[1][1][i]);
    }
    return o;
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.GraphPatternNotTriples = function(r) {
    if (r[0]) {
    } else if (r[1]) {
        return r[1];
    } else if (r[2]) {
        throw "GRAPH pattern is not supported";
    }

};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.GroupOrUnionGraphPattern = function(r) {

    var patternList = [r[0]];
    for (var i = 0; i < r[1].length; i++) patternList.push(r[1][i][1]);

    if (patternList.length > 1) {
        var union = new Arielworks.Hercules.Sparql.UnionPattern();
        for (var i = 0; i < patternList.length; i++) {
            union.addPattern(patternList[i]);
        }
        return union;
    } else {
        return patternList[0];
    }
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.TriplesSameSubject = function(r) {
    if (r[0]) {
        var o = [];
        for (var i = 0; i < r[0][1].length; i++) {
            for (var j = 0; j < r[0][1][i][1].length; j++) {
                o.push(this.query.getTriplePattern(r[0][0], r[0][1][i][0], r[0][1][i][1][j]));
            }
        }
        return o;
    } else if (r[1]) {
        var o  = [];
        for (var i = 0; i < r[1][1].length; i++) {
            for (var j = 0; j < r[1][1][i][1].length; j++) {
                o.push(this.query.getTriplePattern(r[1][0], r[1][1][i][0], r[1][1][i][1][j]));
            }
        }
        return o;
    }
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.PropertyListNotEmpty = function(r) {
    var o = [];
    o.push([r[0], r[1]]);
    for (var i = 0; i < r[2].length; i++) {
        if(r[2][i][1]) o.push([r[2][i][1][0], r[2][i][1][1]]);
    }
    return o;
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.PropertyList = function(r) {
    return r;
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.ObjectList = function(r) {
    var o = [];
    o.push(r[0]);
    for (var i = 0; i <r[1].length; i++) o.push(r[1][i][1]);
    return o;
};


Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.Object = function(r) {
    return r[0];
}


Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.TriplesNode = function(r) {
    if (r[0]) {
    } else if (r[1]) {
        var o = this.__getBlankNode();
        for (var i = 0; i < r[1].length; i++) {
            for(var j = 0; j < r[1][i][1].length; j++) {
                this.graphStack[0].addPattern(this.query.getTriplePattern(o, r[1][i][0], r[1][i][1][j]));
            }
        }
        return o;
    };
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.BlankNodePropertyList = function(r) {
    return r[1];
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.GraphNode = function(r) {
    if (r[0]) return r[0];
    else if (r[1]) return r[1];
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.VarOrTerm = function(r) {
    if (r[0]) return this.query.getVariable(r[0]);
    else if (r[1]) return r[1];

};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.VarOrIRIref = function(r) {
    if (r[0]) return this.query.getVariable(r[0]);
    else if (r[1]) return r[1];
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.Var = function(r) {
    return r[0] ? r[0][1] : r[1][1];
};




Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.Verb = function(r) {
    if (r[0]) return r[0];
    else if (r[1]) return this.query.getRdfUriRef(Arielworks.Hercules.Rdf.RDF_TYPE);
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.GraphTerm = function(r) {
    for (var i = 0; i < r.length; i++) if (r[i]) return r[i];
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.RDFLiteral = function(r) {
    if (r[1]) {
        if (r[1][0]) return this.query.getPlainLiteral(r[0], r[1][0]);
        else if (r[1][1]) return Arielworks.Hercules.Rdf.TypedLiteral(r[0], r[1][1][1].getValue());
    } else {
        return this.query.getPlainLiteral(r[0]);
    }
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.String = function(r) {
    for (var i = 0; i < r.length; i++) if (r[i]) return r[i][1];
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.IRIref = function(r) {
    if (r[0]) {
        return this.query.getRdfUriRef(r[0][1]);
    } else {
        if (r[1][0]) {
            return this.query.getRdfUriRef(this.__resolvePrefiexName(r[1][0][1], r[1][0][2]));
        } else if (r[1][1]) {
            return this.query.getRdfUriRef(this.__resolvePrefiexName(r[1][1][1], ""));
        } else {
        }
    }
};


Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.BlankNode = function(r) {
    if (r[0]) {
        return this.__getBlankNode(r[0][1]);
    } else if (r[1]) {
        return this.__getBlankNode();
    }
};


Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.LANGTAG = function(r) {
    return r[1];
};
OAT = {};

OAT.Loader = {featureLoaded: function() {}};

OAT.RDFData = {
	DISABLE_HTML:1,
	DISABLE_DEREFERENCE:2,
	DISABLE_BOOKMARK:4,
	DISABLE_FILTER:8
}

OAT.RDF = {
	ignoredAttributes:["about","nodeID","ID","parseType"],
	toTriples:function(xmlDoc,url) {
		var triples = [];
		var root = xmlDoc.documentElement;
		if (!root || !root.childNodes) { return triples; }
		var bnodePrefix = "_:" + Math.round(1000*Math.random()) + "_";
		var bnodeCount = 0;

		var u = url || "";
		u = u.match(/^[^#]+/);
		u = u? u[0] : "";
		var idPrefix = u + "#";

		function getAtt(obj,att) {
			if (att in obj) { return obj[att]; }
			return false;
		}

		function processNode(node,isPredicateNode) {
			/* get info about node */
			var attribs = OAT.Xml.getLocalAttributes(node);
			/* try to get description from node header */
			var subj = getAtt(attribs,"about");
			var id1 = getAtt(attribs,"nodeID");
			var id2 = getAtt(attribs,"ID");
			/* no subject in triplet */
			if (!subj) {
				/* try construct it from ids */
				if (id1) {
					subj = idPrefix+id1;
				} else if (id2) {
					subj = idPrefix+id2;
				} else {
					/* create anonymous subject */
					subj = bnodePrefix+bnodeCount;
					bnodeCount++;
				}
			}
			/* now we have a subject */

			/* handle literals ? */
			if (OAT.Xml.localName(node) != "Description" && !isPredicateNode) { /* add 'type' where needed */
				var pred = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
				var obj = node.namespaceURI + OAT.Xml.localName(node);
				triples.push([subj,pred,obj,0]); /* 0 - literal, 1 - reference */
			}

			/* for each of our own attributes, push a reference triplet into the graph */
			for (var i=0;i<node.attributes.length;i++) {
				var a = node.attributes[i];
				var local = OAT.Xml.localName(a);
			    if (OAT.RDF.ignoredAttributes.find(function(attr){ return attr == local}) == undefined ) {
					var pred = a.namespaceURI+OAT.Xml.localName(a);
					var obj = a.nodeValue;
					triples.push([subj,pred,obj,1]);
			    }
			} /* for all attributes */

			/* for each of our children create triplets based on their type */
			for (var i=0;i<node.childNodes.length;i++) if (node.childNodes[i].nodeType == 1) {
				var n = node.childNodes[i];
				var nattribs = OAT.Xml.getLocalAttributes(n);
				var pred = n.namespaceURI+OAT.Xml.localName(n);
				if (getAtt(nattribs,"resource") != "") { /* link via id */
					var obj = getAtt(nattribs,"resource");
					if (obj[0] == "#") { obj = idPrefix + obj.substring(1); }
					triples.push([subj,pred,obj,1]);
				} else if (getAtt(nattribs,"nodeID") != "") { /* link via id */
					/* recurse */
					var obj = processNode(n,true);
					triples.push([subj,pred,obj,1]);
				} else if (getAtt(nattribs,"ID") != "") { /* link via id */
					/* recurse */
					var obj = processNode(n,true);
					triples.push([subj,pred,obj,1]);
				} else {
					var children = [];
					for (var j=0;j<n.childNodes.length;j++) if (n.childNodes[j].nodeType == 1) {
						children.push(n.childNodes[j]);
					}
					/* now what those children mean: */
					if (children.length == 0) { /* no children nodes - take text content */
						var obj = OAT.Xml.textValue(n);
						triples.push([subj,pred,obj,0]);
					} else if (children.length == 1) { /* one child - it is a standalone subject */
						var obj = processNode(children[0]);
						triples.push([subj,pred,obj,1]);
					} else if (getAtt(nattribs,"parseType") == "Collection") { /* multiple children - each is a standalone node */
						for (var j=0;j<children.length;j++) {
							var obj = processNode(children[j]);
							triples.push([subj,pred,obj,1]);
						}
					} else { /* multiple children - each is a pred-obj pair */
						var obj = processNode(n,true);
						triples.push([subj,pred,obj,1]);
					} /* multiple children */
				}
			} /* for all subnodes */
			return subj;
		} /* process node */

		for (var i=0;i<root.childNodes.length;i++) {
			var node = root.childNodes[i];
			if (node.nodeType == 1) { processNode(node); }
		}
		return triples;
	}
} /* OAT.RDF */
OAT.Loader.featureLoaded("rdf");

OAT.Browser = {
    isIE:function() {
        return (window.attachEvent && navigator.userAgent.indexOf('Opera') === -1);
    }
};

OAT.Xml = {
	textValue:function(elem) {
		/*
			gecko: textContent
			ie: text
			safari: .nodeValue of first child
		*/
		if (!elem) { return; }
		if (document.implementation && document.implementation.createDocument) {
			var result = elem.textContent;
			/* safari hack */
			if (typeof(result) == "undefined") {
				result = elem.firstChild;
				return (result ? result.nodeValue : "");
			}
			return result;
		} else if (window.ActiveXObject) {
			return elem.text;
		} else {
			alert("Ooops - no XML parser available");
			return false;
		}
	},

	localName:function(elem) {
		if (!elem) { return; }
	        if (OAT.Browser.isIE()) {
			return elem.baseName;
		} else {
			return elem.localName;
		}
	},

	createXmlDoc:function(string) {
		if (document.implementation && document.implementation.createDocument) {
			if (!string) { return document.implementation.createDocument("","",null); }
			var parser = new DOMParser();
			try {
				var xml = parser.parseFromString(string, "text/xml");
			} catch(e) {
				alert('XML parsing error. Either the XML file is not well-formed or your browser sucks.');
			}
			return xml;
		} else if (window.ActiveXObject) {
			var xml = new ActiveXObject("Microsoft.XMLDOM");
			if (!string) { return xml; }
			xml.loadXML(string);
			if (xml.parseError.errorCode) {
				alert('IE XML ERROR: '+xml.parseError.reason+' ('+xml.parseError.errorCode+')');
				return false;
			}
			return xml;
		} else {
			alert("Ooops - no XML parser available");
			return false;
		}
		return false;
	},

	newXmlDoc:function() {
		if (document.implementation && document.implementation.createDocument) {
			var xml = document.implementation.createDocument("","",null);
			return xml;
		} else if (window.ActiveXObject) {
			var xml = new ActiveXObject("Microsoft.XMLDOM")
			return xml;
		} else {
			alert("Ooops - no XML parser available");
			return false;
		}
		return false;
	},

	serializeXmlDoc:function(xmlDoc) {
		if (document.implementation && document.implementation.createDocument) {
			var ser = new XMLSerializer();
			var s = ser.serializeToString(xmlDoc);
			return s;
		} else if (window.ActiveXObject) {
			var s = xmlDoc.xml;
			return s;
		} else {
			alert("Ooops - no XML parser available");
			return false;
		}
		return false;
	},

	transformXSLT:function(xmlDoc,xslDoc,paramsArray) {
		if (document.implementation && document.implementation.createDocument) {
			var xslProc = new XSLTProcessor();
			if (paramsArray) for (var i=0;i<paramsArray.length;i++) {
				var param = paramsArray[i];
				xslProc.setParameter(param[0],param[1],param[2]);
			}
			xslProc.importStylesheet(xslDoc);
			var result = xslProc.transformToDocument(xmlDoc);
			return result;
		} else if (window.ActiveXObject) {
			/* new solution with parameters */
			var freeXslDoc = new ActiveXObject("MSXML2.FreeThreadedDOMDocument");
			freeXslDoc.load(xslDoc);
			var template = new ActiveXObject("MSXML2.XSLTemplate");
			template.stylesheet = freeXslDoc;
			var proc = template.createProcessor();
			proc.input = xmlDoc;
			if (paramsArray) for (var i=0;i<paramsArray.length;i++) {
				var param = paramsArray[i];
				proc.addParameter(param[1],param[2]);
			}
			proc.transform();
			var result = proc.output;
			var rDoc = OAT.Xml.createXmlDoc(result);
			return rDoc;
		} else {
			alert("Ooops - no XSL parser available");
			return false;
		}
	},

	getElementsByLocalName:function(elem,tagName) {
		var result = [];
		var elems = elem;
		if (!elem) { return result; }
		if (!(elems instanceof Array)) { elems = [elem]; }
		for (var i=0;i<elems.length;i++) {
			var all = elems[i].getElementsByTagName("*");
			for (var j=0;j<all.length;j++)
				if (all[j].localName == tagName || all[j].baseName == tagName) { result.push(all[j]); }
		}
		return result;
	},

	childElements:function(elem) {
		var result = [];
		if (!elem) { return result; }
		var all = elem.getElementsByTagName("*");
		for (var i=0;i<all.length;i++) {
			if (all[i].parentNode == elem) { result.push(all[i]); }
		}
		return result;
	},

	getLocalAttribute:function(elm,localName) {
		var all = elm.attributes;
		for (var i=0;i<elm.attributes.length;i++) {
			if (elm.attributes[i].localName == localName || elm.attributes[i].baseName == localName) { return elm.attributes[i].nodeValue; }
		}
		return false;
	},

	getLocalAttributes:function(elm) {
		var obj = {};
		if(!elm) { return obj; }
		for (var i=0;i<elm.attributes.length;i++) {
			var att = elm.attributes[i];
			var ln = att.localName;
			var key = ln ? ln : att.baseName;
			obj[key] = att.nodeValue;
		}
		return obj;
	},

	xpath:function(xmlDoc,xpath,nsObject) {
		var result = [];
		function resolver(prefix) {
			var b = " ";
			if (prefix in nsObject) { return nsObject[prefix]; }
			if (b in nsObject) { return nsObject[" "]; } /* default ns */
			return ""; /* fallback; should not happen */
		}
		if (document.evaluate) {
			var it = xmlDoc.evaluate(xpath,xmlDoc,resolver,XPathResult.ANY_TYPE,null);
			var node;
			while ((node = it.iterateNext())) {	result.push(node); }
			return result;
		} else if (window.ActiveXObject) {
			var tmp = xmlDoc.selectNodes(xpath);
			for (var i=0;i<tmp.length;i++) { result.push(tmp[i]); }
			return result;
		} else {
			alert("Ooops - no XML parser available");
			return false;
		}
	},

	removeDefaultNamespace:function(xmlText) {
		var xml = xmlText.replace(/xmlns="[^"]*"/g,"");
		return xml;
	}/*,

	escape:OAT.Dom.toSafeXML,
	unescape:OAT.Dom.fromSafeXML*/
}
Siesta.registerNamespace("Siesta","Drivers","Hercules","Sparql");

/**
 *  Queries a Siesta.Framework.Graph of triples with a certain
 *  SPARQL query passed as a reference.
 *
 *  @arguments:
 *  - graph: a Siesta.Framework.Graph containing Siesta.Framework.Triples.
 *  - sparqlQuery: a string containing a SPARQL query.
 *
 *  @returns:
 *  - A set of result bindings containing Siesta.Framework references.
 */
Siesta.Drivers.Hercules.Sparql.query = function (/* Siesta.Framework.Graph */ graph,
                                                 /* String */ sparqlQuery) {

    var hg = new Arielworks.Hercules.Rdf.Graph();

    var ts = graph.triplesArray();

    for(var i=0; i<ts.length; i++) {
        var t = ts[i];
        hg.addTriple(Siesta.Drivers.Hercules.__parseSiestaReference(hg,t.subject,graph),
                     Siesta.Drivers.Hercules.__parseSiestaReference(hg,t.predicate,graph),
                     Siesta.Drivers.Hercules.__parseSiestaReference(hg,t.object,graph));
    }

    var engine = new Arielworks.Hercules.Sparql.Engine(hg.tripleList);
    var query = engine.prepare(sparqlQuery);
    var results = query.execute();
    var resultVariables = results.getVariableList();

    var toReturn = [];

    for(var i=0; i< results.length; i++) {
        var result  = results[i];
        var toAdd = {}
        for(j=0; j<resultVariables.length; j++) {
            toAdd[resultVariables[j]] = Siesta.Drivers.Hercules.__parseReference(results[i][resultVariables[j]]);
        }
        toReturn.push(toAdd);
    }

    return toReturn;
};


/**
 *  Transforms a Siesta.Framework object into its Hercules equivalent.
 *
 *  @arguments:
 *  - graph: a Hercules graph where the built reference will be inserted.
 *  - reference: a Siesta reference.
 *
 *  @returns:
 *  - a Hercules equivalent reference.
 *
 *  @throws:
 *  - an exception if the reference passed is of unknown type.
 */
Siesta.Drivers.Hercules.__parseSiestaReference = function(/* Arielworks.Hercules.Graph */ graph,
                                                          /* Siesta.Framework.* */ reference,
                                                          /* Siesta.Framework.Graph */ siestaGraph) {
    if(reference.__type == 'uri') {
        return graph.getRdfUriRef(siestaGraph.__normalizeUri(reference));
    } else if(reference.__type == 'literal') {
        if(reference.type != null) {
            return graph.getTypedLiteral(reference.value,
                                         siestaGraph.__normalizeUri(reference.type));
        } else if(reference.language != null) {
            return graph.getPlainLiteral(reference.value,
                                         reference.language);
        } else {
            return graph.getTypedLiteral(reference.value,
                                         siestaGraph.__normalizeUri(new Siesta.Framework.Uri("http://www.w3.org/2000/01/rdf-schema#Literal")));
        }
    } else if(reference.__type == 'blanknode') {
        var blankId = reference.value;
        if(typeof blankId == "number") {
            blankId = ""+blankId;
        }
        return graph.getBlankNode(blankId);
    } else {
        throw new Exception("Uknown type for Siesta resource");
    }
};


Siesta.registerFramework("sparql");
Siesta.registerNamespace("Siesta","Drivers","Hercules","Formats","Turtle");


/**
 *  Parses a Turtle enconded RDF document and returns a
 *  Siesta.Framework.Graph of Siesta.Framework.Triple objects
 *  with the RDF triples encoded in the Turtle document
 *
 *  @arguments
 *  - baseUri: the URI of the document to be parsed.
 *  - doc: a String containing the Turtle document.
 *
 *  @returns
 *  - Siesta.Framework.Graph
 */
Siesta.Drivers.Hercules.Formats.Turtle.parseDoc = function(baseUri, doc /* turtle document string */) {
    var turtleParser = new Arielworks.Parser.RecursiveDescentParser.Parser();
    turtleParser.setRuleSet(Arielworks.Hercules.Serialized.Turtle.Parser.RULE_SET);
    turtleParser.setWhiteSpaceRule(Arielworks.Hercules.Serialized.Turtle.Parser.WHITE_SPACE_RULE);
    turtleParser.compileRuleSet();
    var action = new Arielworks.Hercules.Serialized.Turtle.Turtle_1_0(baseUri);
    turtleParser.parse(doc, Arielworks.Hercules.Serialized.Turtle.Parser.START_RULE, action);

    var parsedTriples = action.graph.tripleList;

    var graph = new Siesta.Framework.Graph();
    graph.baseUri = baseUri;

    for(var i=0; i<parsedTriples.length; i++) {
        var triple = new Siesta.Framework.Triple(Siesta.Drivers.Hercules.__parseReference(parsedTriples[i].subject),
                                                 Siesta.Drivers.Hercules.__parseReference(parsedTriples[i].predicate),
                                                 Siesta.Drivers.Hercules.__parseReference(parsedTriples[i].object));
        graph.addTriple(triple);
    }

    return graph;
};


/**
 *  Parses a Hercules reference into a Siesta reference
 *
 *  @arguments:
 *  - reference: some kind of Hercules reference
 *
 *  @returns:
 *  - the equivalente Siesta.Framework reference
 */
Siesta.Drivers.Hercules.__parseReference = function(reference) {
    if(reference instanceof Arielworks.Hercules.Rdf.RdfUriRef.prototype.constructor) {

        return new Siesta.Framework.Uri(reference.value);

    } else if(reference instanceof Arielworks.Hercules.Rdf.TypedLiteral.prototype.constructor) {

        return new Siesta.Framework.Literal({value: reference.value,
                                             type: new Siesta.Framework.Uri(reference.datatypeIri)});

    } else if(reference instanceof Arielworks.Hercules.Rdf.PlainLiteral.prototype.constructor) {

        return new Siesta.Framework.Literal({value: reference.value,
                                             language:  reference.languageTag});

    } else if(reference instanceof Arielworks.Hercules.Rdf.BlankNode.prototype.constructor) {
        return new Siesta.Framework.BlankNode(reference.value);

    } else {
        throw new Exception("Parsing Hercules unknown reference");
    }
};

Siesta.registerFramework("formats/turtle");
Siesta.registerNamespace("Siesta","Drivers","OAT","Formats","Xml");

Siesta.Drivers.OAT.Formats.Xml.parseDoc = function(baseUri, doc /* RDF/XML document string */) {

    var xmlDoc = OAT.Xml.createXmlDoc(doc);
    var parsedTriples = OAT.RDF.toTriples(testDoc,baseUri);

    var graph = new Siesta.Framework.Graph();
    graph.baseUri = baseUri;

    for(var i=0; i<parsedTriples.length; i++) {
        var triple = new Siesta.Framework.Triple(Siesta.Drivers.OAT.__parseReference(baseUri,parsedTriples[i][0]),
                                                 Siesta.Drivers.OAT.__parseReference(baseUri,parsedTriples[i][1]),
                                                 Siesta.Drivers.OAT.__parseReference(baseUri,parsedTriples[i][2]));
        graph.addTriple(triple);
    }

    return graph;
}

/**
 *  Parses a String containing a reference as it has been
 *  parsed by OAT.
 *
 *  @arguments:
 *  - reference: some kind of OAT parsed reference
 *
 *  @returns:
 *  - the equivalente Siesta.Framework reference
 */
Siesta.Drivers.OAT.__parseReference = function(baseUri,reference) {
    if(reference.indexOf("http") == 0) {

        return new Siesta.Framework.Uri(reference);

    } else if(reference.indexOf("#") == 0) {

        return new Siesta.Framework.Uri(baseUri+reference);

    } else if(reference.indexOf("_:") == 0) {

        return new Siesta.Framework.BlankNode(reference);

    } else {

        return new Siesta.Framework.Literal({value: reference});

    }
};

Siesta.registerFramework("formats/xml");
Siesta.registerNamespace("Siesta","Drivers","Prototype","Network");

Siesta.Drivers.Prototype.Network.jsonpRequest = function(request,callbackParameterName,callbackName) {
    if(request.indexOf("?")!=-1) {
        request = request+"&"+callbackParameterName+"="+callbackName;
    } else {
        request = request+"?"+callbackParameterName+"="+callbackName;
    }

    var node = document.createElement('script');
    node.type = 'text/javascript';
    node.src = request;

    var head = document.getElementsByTagName('head')[0];
    head.appendChild(node);
};

Siesta.Drivers.Prototype.Network.jsonpRequestForFunction = function(request,callbackParameterName,callbackFunction) {

    var tmpIdentifier = "siesta_func_jsonp_callback_"+(new Date()).getTime();

    eval(tmpIdentifier+" = function(resp){ callbackFunction(resp); };");

    if(request.indexOf("?")!=-1) {
        request = request+"&"+callbackParameterName+"="+tmpIdentifier;
    } else {
        request = request+"?"+callbackParameterName+"="+tmpIdentifier;
    }

    var node = document.createElement('script');
    node.type = 'text/javascript';
    node.src = request;

    var head = document.getElementsByTagName('head')[0];
    head.appendChild(node);
};

Siesta.Drivers.Prototype.Network.jsonpRequestForMethod = function(request,callbackParameterName,callbackObject,callbackFunction) {

    var tmpIdentifier = "siesta_func_jsonp_callback_"+(new Date()).getTime();

    eval(tmpIdentifier+" = function(resp){ callbackFunction.call(callbackObject,resp); };");

    if(request.indexOf("?")!=-1) {
        request = request+"&"+callbackParameterName+"="+tmpIdentifier;
    } else {
        request = request+"?"+callbackParameterName+"="+tmpIdentifier;
    }

    var node = document.createElement('script');
    node.type = 'text/javascript';
    node.src = request;

    var head = document.getElementsByTagName('head')[0];
    head.appendChild(node);
};


Siesta.Drivers.Prototype.Network.ajaxRequestForFunction = function(request,httpMethod,headers,callbackFunction) {
    new Ajax.Request(request,
                     { method:httpMethod,
                       requestHeaders: headers,
                       evalJS: false,
                       evalJSON: false,
                       onSuccess: function(transport) {
                           callbackFunction(transport.responseText);
                       },
                       onFailure: function(transport) {
                           callbackFunction(Siesta.Constants.FAILURE);
                       } });

};

Siesta.Drivers.Prototype.Network.ajaxRequestForMethod = function(request,method,headers,callbackObject,callbackFunction) {
    new Ajax.Request(request,
                     { method:httpMethod,
                       requestHeaders: headers,
                       evalJS: false,
                       evalJSON: false,
                       onSuccess: function(transport) {
                           callbackFunction.call(callbackObject,transport.responseText);
                       },
                       onFailure: function(transport) {
                           callbackFunction.call(callbackObject,Siesta.Constants.FAILURE);
                       } });

};


Siesta.registerFramework("network");
