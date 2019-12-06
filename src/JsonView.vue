<template>
  <div class="el-json-view">
    <div class="ctrs">
      <el-checkbox v-model="dataNoteShow">数据注释</el-checkbox>
      <el-checkbox v-model="dataTypeShow">数据类型</el-checkbox>
    </div>
    <pre class="viewport" id="res_code"></pre>
  </div>
</template>

<script>
import hljs from "highlight.js";
import { formatJson } from "./utils/index";

export default {
  name: "easyapi-json-view",
  props: {
    jsonData: {},
    commentData: {}
  },
  data() {
    return {
      dataNoteShow: false,
      dataTypeShow: false,
      dataTypeArr: [],
      dataNoteArr: [],
      paramsNote: [],

      //数据格式
      dataTypes: {
        "[object Number]": "数字",
        "[object String]": "字符串",
        "[object Null]": "NULL",
        "[object Undefined]": "UNDEFINED",
        "[object Boolean]": "布尔类型",
        "[object Object]": "对象",
        "[object Array]": "数组",
        "[object Function]": "函数"
      }
    };
  },
  created() {
    this.resCode();
    this.makeParamsNote();
    this.makeDataType();
  },
  watch: {
    dataNoteShow: function() {
      this.showParamsNote();
    },
    dataTypeShow: function() {
      this.showDataType();
    }
  },
  methods: {
    // 返回信息
    resCode: function() {
      // this.clearNote();
      if (!this.jsonData) {
        return;
      }
      const jsonStr = JSON.stringify(this.jsonData);
      this.resCodeDisplay = formatJson(jsonStr);
      setTimeout(() => {
        this.drawResCode(this.resCodeDisplay);
      }, 200);
    },

    //绘制res body
    drawResCode: function(content) {
      var target = document.getElementById("res_code");
      target.textContent = content;

      hljs.highlightBlock(target);
      // this.addCodeLine();
      this.dataNoteShow = true;
      this.dataTypeShow = true;
    },

    //生成数据注释
    makeParamsNote: function() {
      this.dataNoteArr = [];

      //生成数据类型
      var makeDataNote = oj => {
        oj.forEach(el => {
          if (el.childParams && el.childParams.length) {
            this.dataNoteArr.push({
              name: el.name,
              remark: el.remark
            });
            makeDataNote(el.childParams);
          } else {
            this.dataNoteArr.push({
              name: el.name,
              remark: el.remark
            });
          }
        });
      };

      makeDataNote(this.commentData);
    },

    //显示参数注释
    showParamsNote: function() {
      if (this.dataNoteShow) {
        if (!this.dataNoteArr.length) {
          return;
        }

        let vals = $("#res_code").children("span.hljs-attr");
        vals.each((index, el) => {
          $(el).append(
            $(
              `<span class="label note">${this.dataNoteArr[index].remark}</span>`
            )
          );
        });
      } else {
        $("#res_code")
          .find(".label.note")
          .remove();
      }
    },

    //生成数据注释
    makeDataType: function() {
      this.dataTypeArr = [];

      var setDataType = oj => {
        let obj = typeof oj == "string" ? JSON.parse(oj) : oj;
        for (var key in obj) {
          if (obj[key] !== null && typeof obj[key] == "object") {
            setDataType(obj[key]);
          } else {
            this.dataTypeArr.push(Object.prototype.toString.call(obj[key]));
          }
        }
      };
      setDataType(this.resCodeDisplay);
    },

    //显示数据类型
    showDataType: function() {
      if (this.dataTypeShow) {
        let vals = $("#res_code").children("span:not(.hljs-attr)");
        vals.each((index, el) => {
          $(el).append(
            $(
              `<span class="label type">${
                this.dataTypes[this.dataTypeArr[index]]
              }</span>`
            )
          );
        });
      } else {
        $("#res_code")
          .find(".label.type")
          .remove();
      }
    },

    //清空代码注释和类型显示
    clearNote: function() {
      this.dataNoteShow = false;
      this.dataTypeShow = false;
      this.dataNoteArr = [];
      $("#res_code")
        .find(".label.note")
        .remove();

      this.dataTypeArr = [];
      $("#res_code")
        .find(".label.type")
        .remove();
    },

    jsonParse: function(jsonStr) {
      // 解析JSON
      let parseJson = json => {
        let result = [];
        let keys = Object.keys(json);
        keys.forEach((k, index) => {
          let val = json[k];
          let parsedVal = val;
          if (val === null || val === undefined) {
            val = "";
          }

          if (this.getType(val) == "object") {
            // console.debug('-- o --')
            parsedVal = parseJson(val);
            // result.push(fr)
          } else if (this.getType(val) == "array") {
            // console.debug('-- a --')
            // console.debug(val)
            parsedVal = parseArray(val);
            // result.push(fr)
          }

          let opt = {
            name: k,
            type: this.getType(val),
            description: ""
          };

          if (opt.type == "array" || opt.type == "object") {
            opt.childParams = parsedVal;
            opt.remark = null;
          } else {
            opt.childParams = null;
            opt.remark = parsedVal;
          }

          result.push(opt);
        });
        return result;
      };

      //  解析ARRAY
      let parseArray = arrayObj => {
        let result = [];
        for (let i = 0; i < arrayObj.length; ++i) {
          let val = arrayObj[i];
          let parsedVal = val;
          if (this.getType(val) == "object") {
            parsedVal = parseJson(val);
          } else if (this.getType(val) == "array") {
            parsedVal = parseArray(val);
          }

          let opt = {
            name: null,
            type: this.getType(val),
            description: ""
          };

          if (opt.type == "array" || opt.type == "object") {
            opt.childParams = parsedVal;
            opt.remark = null;
          } else {
            opt.childParams = null;
            opt.remark = parsedVal;
          }

          result.push(opt);
        }
        return result;
      };

      // --
      let parseBody = json => {
        let r = parseJson(json);
        return r;
      };

      return parseBody(jsonStr);
    },

    getType: function(obj) {
      switch (Object.prototype.toString.call(obj)) {
        case "[object Array]":
          return "array";
          break;
        case "[object Object]":
          return "object";
          break;
        default:
          return String(typeof obj).toLowerCase();
          break;
      }
    },

    makeJson: function(dataArr) {
      // 翻译JSON
      let revertWithObj = function(data) {
        let r = {};
        for (let i = 0; i < data.length; ++i) {
          let el = data[i];
          let key, val;
          key = el.name;
          if (el.type == "array") {
            val = revertWithArray(el.childParams);
          } else if (el.type == "object") {
            val = revertWithObj(el.childParams);
          } else {
            val = el.remark;
          }

          r[key] = val;
        }

        return r;
      };

      // 翻译Array
      let revertWithArray = function(data) {
        let arr = [];
        for (let i = 0; i < data.length; ++i) {
          let el = data[i];
          let r;
          if (el.type == "array") {
            r = revertWithArray(el.childParams);
          } else if (el.type == "object") {
            r = revertWithObj(el.childParams);
          } else {
            r = el.remark;
          }

          arr.push(r);
        }
        return arr;
      };

      let revertMain = function(data) {
        console.debug("--> make json <--");
        let r = revertWithObj(data);
        return r;
      };

      return revertMain(dataArr);
    }
  }
};
</script>

<style lang="less" scoped>
.el-json-view {
  width: 100%;
  border: 1px solid #e4e4e4;

  .ctrs {
    padding: 10px 12px;
    background: #ececec;
  }
  .viewport {
    margin: 0;
    padding: 12px;
  }
}
</style>

<style lang="less">
.el-json-view {
  .hljs-attr {
    display: inline-block;
    margin-bottom: 10px;
  }

  .button {
    &.to-test {
      position: absolute;
      top: 20px;
      right: 10px;
    }
  }

  .el-checkbox__label {
    color: #11b5ca !important;
  }

  .el-checkbox__inner {
    border-color: #11b5ca !important;
    background-color: #11b5ca !important;
  }

  #res_code {
    .hljs {
      background: unset !important;
      background-color: unset !important;
      border: none !important;
    }

    .label {
      margin-left: 10px;
      padding: 1px 6px;
      font-size: 0.6em;
      color: #fff;

      &.type {
        color: #a5a5a5;
        background-color: #f0f0f0;
      }

      &.note {
        background-color: #11b5ca;
      }

      &.none {
        background-color: #bbbec4 !important;
      }
    }
  }
}
</style>