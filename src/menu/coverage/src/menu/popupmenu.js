function BranchData() {
    this.position = -1;
    this.nodeLength = -1;
    this.src = null;
    this.evalFalse = 0;
    this.evalTrue = 0;

    this.init = function(position, nodeLength, src) {
        this.position = position;
        this.nodeLength = nodeLength;
        this.src = src;
        return this;
    }

    this.ranCondition = function(result) {
        if (result)
            this.evalTrue++;
        else
            this.evalFalse++;
    };

    this.pathsCovered = function() {
        var paths = 0;
        if (this.evalTrue > 0)
          paths++;
        if (this.evalFalse > 0)
          paths++;
        return paths;
    };

    this.covered = function() {
        return this.evalTrue > 0 && this.evalFalse > 0;
    };

    this.toJSON = function() {
        return '{"position":' + this.position
            + ',"nodeLength":' + this.nodeLength
            + ',"src":' + jscoverage_quote(this.src)
            + ',"evalFalse":' + this.evalFalse
            + ',"evalTrue":' + this.evalTrue + '}';
    };

    this.message = function() {
        if (this.evalTrue === 0 && this.evalFalse === 0)
            return 'Condition never evaluated         :\t' + this.src;
        else if (this.evalTrue === 0)
            return 'Condition never evaluated to true :\t' + this.src;
        else if (this.evalFalse === 0)
            return 'Condition never evaluated to false:\t' + this.src;
        else
            return 'Condition covered';
    };
}

BranchData.fromJson = function(jsonString) {
    var json = eval('(' + jsonString + ')');
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

BranchData.fromJsonObject = function(json) {
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

function buildBranchMessage(conditions) {
    var message = 'The following was not covered:';
    for (var i = 0; i < conditions.length; i++) {
        if (conditions[i] !== undefined && conditions[i] !== null && !conditions[i].covered())
          message += '\n- '+ conditions[i].message();
    }
    return message;
};

function convertBranchDataConditionArrayToJSON(branchDataConditionArray) {
    var array = [];
    var length = branchDataConditionArray.length;
    for (var condition = 0; condition < length; condition++) {
        var branchDataObject = branchDataConditionArray[condition];
        if (branchDataObject === undefined || branchDataObject === null) {
            value = 'null';
        } else {
            value = branchDataObject.toJSON();
        }
        array.push(value);
    }
    return '[' + array.join(',') + ']';
}

function convertBranchDataLinesToJSON(branchData) {
    if (branchData === undefined) {
        return '{}'
    }
    var json = '';
    for (var line in branchData) {
        if (json !== '')
            json += ','
        json += '"' + line + '":' + convertBranchDataConditionArrayToJSON(branchData[line]);
    }
    return '{' + json + '}';
}

function convertBranchDataLinesFromJSON(jsonObject) {
    if (jsonObject === undefined) {
        return {};
    }
    for (var line in jsonObject) {
        var branchDataJSON = jsonObject[line];
        if (branchDataJSON !== null) {
            for (var conditionIndex = 0; conditionIndex < branchDataJSON.length; conditionIndex ++) {
                var condition = branchDataJSON[conditionIndex];
                if (condition !== null) {
                    branchDataJSON[conditionIndex] = BranchData.fromJsonObject(condition);
                }
            }
        }
    }
    return jsonObject;
}
function jscoverage_quote(s) {
    return '"' + s.replace(/[\u0000-\u001f"\\\u007f-\uffff]/g, function (c) {
        switch (c) {
            case '\b':
                return '\\b';
            case '\f':
                return '\\f';
            case '\n':
                return '\\n';
            case '\r':
                return '\\r';
            case '\t':
                return '\\t';
            // IE doesn't support this
            /*
             case '\v':
             return '\\v';
             */
            case '"':
                return '\\"';
            case '\\':
                return '\\\\';
            default:
                return '\\u' + jscoverage_pad(c.charCodeAt(0).toString(16));
        }
    }) + '"';
}

function getArrayJSON(coverage) {
    var array = [];
    if (coverage === undefined)
        return array;

    var length = coverage.length;
    for (var line = 0; line < length; line++) {
        var value = coverage[line];
        if (value === undefined || value === null) {
            value = 'null';
        }
        array.push(value);
    }
    return array;
}

function jscoverage_serializeCoverageToJSON() {
    var json = [];
    for (var file in _$jscoverage) {
        var lineArray = getArrayJSON(_$jscoverage[file].lineData);
        var fnArray = getArrayJSON(_$jscoverage[file].functionData);

        json.push(jscoverage_quote(file) + ':{"lineData":[' + lineArray.join(',') + '],"functionData":[' + fnArray.join(',') + '],"branchData":' + convertBranchDataLinesToJSON(_$jscoverage[file].branchData) + '}');
    }
    return '{' + json.join(',') + '}';
}


function jscoverage_pad(s) {
    return '0000'.substr(s.length) + s;
}

function jscoverage_html_escape(s) {
    return s.replace(/[<>\&\"\']/g, function (c) {
        return '&#' + c.charCodeAt(0) + ';';
    });
}
try {
  if (typeof top === 'object' && top !== null && typeof top.opener === 'object' && top.opener !== null) {
    // this is a browser window that was opened from another window

    if (! top.opener._$jscoverage) {
      top.opener._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null) {
    // this is a browser window

    try {
      if (typeof top.opener === 'object' && top.opener !== null && top.opener._$jscoverage) {
        top._$jscoverage = top.opener._$jscoverage;
      }
    }
    catch (e) {}

    if (! top._$jscoverage) {
      top._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null && top._$jscoverage) {
    this._$jscoverage = top._$jscoverage;
  }
}
catch (e) {}
if (! this._$jscoverage) {
  this._$jscoverage = {};
}
if (! _$jscoverage['/menu/popupmenu.js']) {
  _$jscoverage['/menu/popupmenu.js'] = {};
  _$jscoverage['/menu/popupmenu.js'].lineData = [];
  _$jscoverage['/menu/popupmenu.js'].lineData[6] = 0;
  _$jscoverage['/menu/popupmenu.js'].lineData[7] = 0;
  _$jscoverage['/menu/popupmenu.js'].lineData[8] = 0;
  _$jscoverage['/menu/popupmenu.js'].lineData[9] = 0;
  _$jscoverage['/menu/popupmenu.js'].lineData[10] = 0;
  _$jscoverage['/menu/popupmenu.js'].lineData[19] = 0;
  _$jscoverage['/menu/popupmenu.js'].lineData[26] = 0;
  _$jscoverage['/menu/popupmenu.js'].lineData[29] = 0;
  _$jscoverage['/menu/popupmenu.js'].lineData[31] = 0;
  _$jscoverage['/menu/popupmenu.js'].lineData[32] = 0;
  _$jscoverage['/menu/popupmenu.js'].lineData[34] = 0;
  _$jscoverage['/menu/popupmenu.js'].lineData[38] = 0;
  _$jscoverage['/menu/popupmenu.js'].lineData[39] = 0;
  _$jscoverage['/menu/popupmenu.js'].lineData[45] = 0;
  _$jscoverage['/menu/popupmenu.js'].lineData[46] = 0;
  _$jscoverage['/menu/popupmenu.js'].lineData[47] = 0;
  _$jscoverage['/menu/popupmenu.js'].lineData[48] = 0;
  _$jscoverage['/menu/popupmenu.js'].lineData[49] = 0;
  _$jscoverage['/menu/popupmenu.js'].lineData[50] = 0;
  _$jscoverage['/menu/popupmenu.js'].lineData[51] = 0;
  _$jscoverage['/menu/popupmenu.js'].lineData[52] = 0;
  _$jscoverage['/menu/popupmenu.js'].lineData[67] = 0;
  _$jscoverage['/menu/popupmenu.js'].lineData[68] = 0;
  _$jscoverage['/menu/popupmenu.js'].lineData[69] = 0;
}
if (! _$jscoverage['/menu/popupmenu.js'].functionData) {
  _$jscoverage['/menu/popupmenu.js'].functionData = [];
  _$jscoverage['/menu/popupmenu.js'].functionData[0] = 0;
  _$jscoverage['/menu/popupmenu.js'].functionData[1] = 0;
  _$jscoverage['/menu/popupmenu.js'].functionData[2] = 0;
  _$jscoverage['/menu/popupmenu.js'].functionData[3] = 0;
  _$jscoverage['/menu/popupmenu.js'].functionData[4] = 0;
}
if (! _$jscoverage['/menu/popupmenu.js'].branchData) {
  _$jscoverage['/menu/popupmenu.js'].branchData = {};
  _$jscoverage['/menu/popupmenu.js'].branchData['33'] = [];
  _$jscoverage['/menu/popupmenu.js'].branchData['33'][1] = new BranchData();
  _$jscoverage['/menu/popupmenu.js'].branchData['33'][2] = new BranchData();
  _$jscoverage['/menu/popupmenu.js'].branchData['34'] = [];
  _$jscoverage['/menu/popupmenu.js'].branchData['34'][1] = new BranchData();
  _$jscoverage['/menu/popupmenu.js'].branchData['45'] = [];
  _$jscoverage['/menu/popupmenu.js'].branchData['45'][1] = new BranchData();
  _$jscoverage['/menu/popupmenu.js'].branchData['47'] = [];
  _$jscoverage['/menu/popupmenu.js'].branchData['47'][1] = new BranchData();
}
_$jscoverage['/menu/popupmenu.js'].branchData['47'][1].init(72, 8, 'rootMenu');
function visit42_47_1(result) {
  _$jscoverage['/menu/popupmenu.js'].branchData['47'][1].ranCondition(result);
  return result;
}_$jscoverage['/menu/popupmenu.js'].branchData['45'][1].init(276, 32, 'self.get(\'autoHideOnMouseLeave\')');
function visit41_45_1(result) {
  _$jscoverage['/menu/popupmenu.js'].branchData['45'][1].ranCondition(result);
  return result;
}_$jscoverage['/menu/popupmenu.js'].branchData['34'][1].init(284, 13, 'last === self');
function visit40_34_1(result) {
  _$jscoverage['/menu/popupmenu.js'].branchData['34'][1].ranCondition(result);
  return result;
}_$jscoverage['/menu/popupmenu.js'].branchData['33'][2].init(234, 28, 'cur.isMenuItem || cur.isMenu');
function visit39_33_2(result) {
  _$jscoverage['/menu/popupmenu.js'].branchData['33'][2].ranCondition(result);
  return result;
}_$jscoverage['/menu/popupmenu.js'].branchData['33'][1].init(132, 37, 'cur && (cur.isMenuItem || cur.isMenu)');
function visit38_33_1(result) {
  _$jscoverage['/menu/popupmenu.js'].branchData['33'][1].ranCondition(result);
  return result;
}_$jscoverage['/menu/popupmenu.js'].lineData[6]++;
KISSY.add(function(S, require) {
  _$jscoverage['/menu/popupmenu.js'].functionData[0]++;
  _$jscoverage['/menu/popupmenu.js'].lineData[7]++;
  var AlignExtension = require('component/extension/align');
  _$jscoverage['/menu/popupmenu.js'].lineData[8]++;
  var Shim = require('component/extension/shim');
  _$jscoverage['/menu/popupmenu.js'].lineData[9]++;
  var Menu = require('./control');
  _$jscoverage['/menu/popupmenu.js'].lineData[10]++;
  var ContentBox = require('component/extension/content-box');
  _$jscoverage['/menu/popupmenu.js'].lineData[19]++;
  return Menu.extend([ContentBox, Shim, AlignExtension], {
  getRootMenu: function() {
  _$jscoverage['/menu/popupmenu.js'].functionData[1]++;
  _$jscoverage['/menu/popupmenu.js'].lineData[26]++;
  var self = this, cur = self, last;
  _$jscoverage['/menu/popupmenu.js'].lineData[29]++;
  do {
    _$jscoverage['/menu/popupmenu.js'].lineData[31]++;
    last = cur;
    _$jscoverage['/menu/popupmenu.js'].lineData[32]++;
    cur = cur.get('parent');
  } while (visit38_33_1(cur && (visit39_33_2(cur.isMenuItem || cur.isMenu))));
  _$jscoverage['/menu/popupmenu.js'].lineData[34]++;
  return visit40_34_1(last === self) ? null : last;
}, 
  handleMouseLeaveInternal: function(e) {
  _$jscoverage['/menu/popupmenu.js'].functionData[2]++;
  _$jscoverage['/menu/popupmenu.js'].lineData[38]++;
  var self = this;
  _$jscoverage['/menu/popupmenu.js'].lineData[39]++;
  self.callSuper(e);
  _$jscoverage['/menu/popupmenu.js'].lineData[45]++;
  if (visit41_45_1(self.get('autoHideOnMouseLeave'))) {
    _$jscoverage['/menu/popupmenu.js'].lineData[46]++;
    var rootMenu = self.getRootMenu();
    _$jscoverage['/menu/popupmenu.js'].lineData[47]++;
    if (visit42_47_1(rootMenu)) {
      _$jscoverage['/menu/popupmenu.js'].lineData[48]++;
      clearTimeout(rootMenu._popupAutoHideTimer);
      _$jscoverage['/menu/popupmenu.js'].lineData[49]++;
      rootMenu._popupAutoHideTimer = setTimeout(function() {
  _$jscoverage['/menu/popupmenu.js'].functionData[3]++;
  _$jscoverage['/menu/popupmenu.js'].lineData[50]++;
  var item;
  _$jscoverage['/menu/popupmenu.js'].lineData[51]++;
  if ((item = rootMenu.get('highlightedItem'))) {
    _$jscoverage['/menu/popupmenu.js'].lineData[52]++;
    item.set('highlighted', false);
  }
}, self.get('parent').get('menuDelay') * 1000);
    }
  }
}, 
  isPopupMenu: 1, 
  handleBlurInternal: function(e) {
  _$jscoverage['/menu/popupmenu.js'].functionData[4]++;
  _$jscoverage['/menu/popupmenu.js'].lineData[67]++;
  var self = this;
  _$jscoverage['/menu/popupmenu.js'].lineData[68]++;
  self.callSuper(e);
  _$jscoverage['/menu/popupmenu.js'].lineData[69]++;
  self.hide();
}}, {
  ATTRS: {
  focusable: {
  value: false}, 
  autoHideOnMouseLeave: {}, 
  contentEl: {}, 
  visible: {
  value: false}}, 
  xclass: 'popupmenu'});
});
