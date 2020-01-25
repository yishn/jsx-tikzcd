'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
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



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};





var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();













var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

function h(type, props) {
    for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        children[_key - 2] = arguments[_key];
    }

    var getChildren = function getChildren(children) {
        return children.reduce(function (acc, child) {
            if (child instanceof Array) {
                acc.push.apply(acc, toConsumableArray(getChildren(child)));
            } else {
                acc.push(child);
            }

            return acc;
        }, []);
    };

    return {
        type: type,
        props: props || {},
        key: props && props.key,
        children: getChildren(children)
    };
}

var needWrapChars = ['"', ',', ']'];

function getDirection(_ref, _ref2) {
    var _ref4 = slicedToArray(_ref, 2),
        x1 = _ref4[0],
        y1 = _ref4[1];

    var _ref3 = slicedToArray(_ref2, 2),
        x2 = _ref3[0],
        y2 = _ref3[1];

    var dx = x2 - x1,
        dy = y2 - y1;

    var signs = [dx, dy].map(Math.sign);
    var directions = [['l', '', 'r'], ['u', '', 'd']];

    return [dx, dy].map(function (d, i) {
        return directions[i][signs[i] + 1].repeat(Math.abs(d));
    }).join('');
}

function renderEdge(vnode) {
    var co = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var _vnode$props = vnode.props,
        direction = _vnode$props.direction,
        alt = _vnode$props.alt,
        value = _vnode$props.value;

    if (direction == null) return '';

    var labelPosition = vnode.props.labelPosition || 'left';

    if (co === !alt && labelPosition !== 'inside') labelPosition = labelPosition === 'left' ? 'right' : 'left';

    var p = { left: '', right: "'", inside: ' description' }[labelPosition];

    var _ref5 = value != null && needWrapChars.some(function (c) {
        return value.includes(c);
    }) ? ['{', '}'] : ['', ''],
        _ref6 = slicedToArray(_ref5, 2),
        w1 = _ref6[0],
        w2 = _ref6[1];

    var valueArg = value != null ? '"' + w1 + value + w2 + '"' + p : null;
    var args = [direction ? '' : null, valueArg].concat(toConsumableArray(vnode.props.args || [])).filter(function (x) {
        return x != null;
    }).join(', ');

    return '\\arrow[' + direction + args + ']';
}

var Node = function Node() {};
var Edge = function Edge() {};

var Component = function () {
    function Component(props) {
        classCallCheck(this, Component);

        this.props = props;
    }

    createClass(Component, [{
        key: 'render',
        value: function render() {}
    }]);
    return Component;
}();

var Diagram = function (_Component) {
    inherits(Diagram, _Component);

    function Diagram(props) {
        classCallCheck(this, Diagram);

        var _this = possibleConstructorReturn(this, (Diagram.__proto__ || Object.getPrototypeOf(Diagram)).call(this, props));

        var getChildren = function getChildren(vnode) {
            return vnode.children.reduce(function (acc, v) {
                if (v == null) return acc;

                if ([Node, Edge].includes(v.type)) {
                    acc.push(v);
                } else {
                    acc.push.apply(acc, toConsumableArray(getChildren(v)));
                }

                return acc;
            }, []);
        };

        var children = getChildren(_this.props);

        _this.nodes = children.reduce(function (acc, v) {
            if (v.type !== Node || !v.key || !v.props.position) return acc;

            if (!(v.key in acc)) acc[v.key] = v;else acc[v.key] = _extends({}, acc[v.key], {
                props: _extends({}, acc[v.key].props, v.props)
            });

            return acc;
        }, {});

        _this.edges = children.reduce(function (acc, v) {
            if (v.type !== Edge || !v.props.from || !v.props.to) return acc;

            var _ref7 = !props.co ? ['from', 'to'] : ['to', 'from'],
                _ref8 = slicedToArray(_ref7, 2),
                from = _ref8[0],
                to = _ref8[1];

            if (!(v.props[from] in acc)) acc[v.props[from]] = [];

            acc[v.props[from]].push(_extends({}, v, {
                props: _extends({}, v.props, {
                    direction: getDirection(_this.nodes[v.props[from]].props.position, _this.nodes[v.props[to]].props.position)
                })
            }));

            return acc;
        }, {});
        return _this;
    }

    createClass(Diagram, [{
        key: 'getBounds',
        value: function getBounds() {
            var _this2 = this;

            return Object.keys(this.nodes).map(function (key) {
                return _this2.nodes[key].props.position;
            }).reduce(function (_ref9, _ref10) {
                var _ref12 = slicedToArray(_ref9, 4),
                    minX = _ref12[0],
                    maxX = _ref12[1],
                    minY = _ref12[2],
                    maxY = _ref12[3];

                var _ref11 = slicedToArray(_ref10, 2),
                    x = _ref11[0],
                    y = _ref11[1];

                return [Math.min(minX, x), Math.max(maxX, x), Math.min(minY, y), Math.max(maxY, y)];
            }, [Infinity, -Infinity, Infinity, -Infinity]);
        }
    }, {
        key: 'toArray',
        value: function toArray$$1() {
            var _getBounds = this.getBounds(),
                _getBounds2 = slicedToArray(_getBounds, 4),
                minX = _getBounds2[0],
                maxX = _getBounds2[1],
                minY = _getBounds2[2],
                maxY = _getBounds2[3];

            if (minX > maxX || minY > maxY) return [];

            var diagram = Array(maxY - minY + 1).fill().map(function (_) {
                return Array(maxX - minX + 1).fill(null);
            });

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.keys(this.nodes)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var key = _step.value;

                    var _nodes$key$props$posi = slicedToArray(this.nodes[key].props.position, 2),
                        x = _nodes$key$props$posi[0],
                        y = _nodes$key$props$posi[1];

                    diagram[y - minY][x - minX] = {
                        node: this.nodes[key],
                        edges: this.edges[key] || []
                    };
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return diagram;
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this,
                _ref15;

            var options = this.props.options == null ? '' : '[' + this.props.options + ']';

            var cells = this.toArray().map(function (entries) {
                return entries.map(function (entry) {
                    return entry == null ? '' : [function () {
                        var value = entry.node.props.value || '';

                        var _ref13 = value.trim() === '' || needWrapChars.some(function (c) {
                            return value.includes(c);
                        }) ? ['{', '}'] : ['', ''],
                            _ref14 = slicedToArray(_ref13, 2),
                            w1 = _ref14[0],
                            w2 = _ref14[1];

                        return '' + w1 + value + w2;
                    }()].concat(toConsumableArray(entry.edges.map(function (e) {
                        return renderEdge(e, _this3.props.co);
                    }))).join(' ');
                });
            });

            if ((_ref15 = []).concat.apply(_ref15, toConsumableArray(cells)).every(function (x) {
                return x === '';
            })) {
                cells = cells.map(function (row) {
                    return row.map(function (_) {
                        return '{}';
                    });
                });
            }

            if (this.props.align && cells.length > 0) {
                var _loop = function _loop(j) {
                    var maxLength = Math.max.apply(Math, toConsumableArray(cells.map(function (entries) {
                        return entries[j].length;
                    })));
                    for (var i = 0; i < cells.length; i++) {
                        cells[i][j] = cells[i][j].padEnd(maxLength, ' ');
                    }
                };

                for (var j = 0; j < cells[0].length; j++) {
                    _loop(j);
                }
            }

            return ['\\begin{tikzcd}' + options, cells.map(function (entries) {
                return entries.join(' & ');
            }).join(' \\\\\n'), '\\end{tikzcd}'].join('\n');
        }
    }]);
    return Diagram;
}(Component);

function resolveComponents(vnode) {
    if (vnode == null) return null;

    if (![Diagram, Node, Edge].includes(vnode.type)) {
        var props = _extends({}, vnode.props, { children: vnode.children });

        if ('render' in vnode.type.prototype) {
            return resolveComponents(new vnode.type(props).render());
        } else {
            return resolveComponents(vnode.type(props));
        }
    }

    return _extends({}, vnode, {
        children: vnode.children.map(function (x) {
            return resolveComponents(x);
        })
    });
}

function renderToDiagram(vnode) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var co = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var diagramNode = resolveComponents(vnode);

    if (diagramNode == null || diagramNode.type !== Diagram) return null;

    return new Diagram(_extends({}, diagramNode.props, {
        co: co !== !!diagramNode.props.co,
        align: options.align ? options.align : false,
        children: diagramNode.children
    }));
}

function render(vnode) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var co = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    return renderToDiagram(vnode, options, co).render();
}

function corender(vnode) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return render(vnode, options, true);
}

exports.h = h;
exports.render = render;
exports.corender = corender;
exports.renderToDiagram = renderToDiagram;
exports.Component = Component;
exports.Diagram = Diagram;
exports.Node = Node;
exports.Edge = Edge;
//# sourceMappingURL=jsx-tikzcd.js.map
