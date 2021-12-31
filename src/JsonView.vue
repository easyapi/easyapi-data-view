<template>
  <div class="ea-json-view">
    <div class="ea-json-view_control" v-if="type === 0">
      <el-checkbox v-model="dataNoteShow">数据注释</el-checkbox>
      <el-checkbox v-model="dataTypeShow">数据类型</el-checkbox>
    </div>
    <pre class="ea-json-view_viewport" id="res_code"></pre>
  </div>
</template>

<script>
import hljs from "highlight.js";
import { formatJson } from "./utils/index";

export default {
  name: "easyapi-json-view",
  props: {
    commentData: {},
    responseData: {},
    type: {},
  },
  data() {
    return {
      dataNoteShow: false,
      dataTypeShow: false,
      dataTypeArr: [],
      dataNoteArr: [],
      paramsNote: [],

      // jsonData: {},

      //数据格式
      dataTypes: {
        "[object Number]": "数字",
        "[object String]": "字符串",
        "[object Null]": "NULL",
        "[object Undefined]": "UNDEFINED",
        "[object Boolean]": "布尔类型",
        "[object Object]": "对象",
        "[object Array]": "数组",
        "[object Function]": "函数",
      },
    };
  },
  created() {
    if (this.type === 0) {
      this.makeParamsNote();
      this.makeDataType();
    }
    this.resCode();
  },
  watch: {
    dataNoteShow: function () {
      this.showParamsNote();
    },
    dataTypeShow: function () {
      this.showDataType();
    },
    commentData: function () {
      if (this.type === 0) {
        this.makeParamsNote();
        this.makeDataType();
      }
      this.resCode();
    },
  },
  methods: {
    formateXml() {
      let text = this.responseData;
      let that = this;
      //使用replace去空格
      text =
        "\n" +
        text
          .replace(/(<\w+)(\s.*?>)/g, function ($0, name, props) {
            return name + " " + props.replace(/\s+(\w+=)/g, " $1");
          })
          .replace(/>\s*?</g, ">\n<");
      //处理注释
      text = text
        .replace(/\n/g, "\r")
        .replace(/<!--(.+?)-->/g, function ($0, text) {
          var ret = "<!--" + escape(text) + "-->";
          return ret;
        })
        .replace(/\r/g, "\n");
      //调整格式  以压栈方式递归调整缩进
      var rgx =
        /\n(<(([^\?]).+?)(?:\s|\s*?>|\s*?(\/)>)(?:.*?(?:(?:(\/)>)|(?:<(\/)\2>)))?)/gm;
      var nodeStack = [];
      var output = text.replace(
        rgx,
        function (
          $0,
          all,
          name,
          isBegin,
          isCloseFull1,
          isCloseFull2,
          isFull1,
          isFull2
        ) {
          var isClosed =
            isCloseFull1 == "/" ||
            isCloseFull2 == "/" ||
            isFull1 == "/" ||
            isFull2 == "/";
          var prefix = "";
          if (isBegin == "!") {
            //!开头
            prefix = that.setPrefix(nodeStack.length);
          } else {
            if (isBegin != "/") {
              ///开头
              prefix = that.setPrefix(nodeStack.length);
              if (!isClosed) {
                //非关闭标签
                nodeStack.push(name);
              }
            } else {
              nodeStack.pop(); //弹栈
              prefix = that.setPrefix(nodeStack.length);
            }
          }
          var ret = "\n" + prefix + all;
          return ret;
        }
      );
      var prefixSpace = -1;
      var outputText = output.substring(1);
      //还原注释内容
      outputText = outputText
        .replace(/\n/g, "\r")
        .replace(/(\s*)<!--(.+?)-->/g, function ($0, prefix, text) {
          if (prefix.charAt(0) == "\r") prefix = prefix.substring(1);
          text = unescape(text).replace(/\r/g, "\n");
          var ret =
            "\n" + prefix + "<!--" + text.replace(/^\s*/gm, prefix) + "-->";
          return ret;
        });
      outputText = outputText.replace(/\s+$/g, "").replace(/\r/g, "\r\n");
      return outputText;
    },

    //计算头函数 用来缩进
    setPrefix(prefixIndex) {
      var result = "";
      var span = "    "; //缩进长度
      var output = [];
      for (var i = 0; i < prefixIndex; ++i) {
        output.push(span);
      }
      result = output.join("");
      return result;
    },

    makeJsonEditor: function (dataArr) {
      if (!dataArr || dataArr.length == 0) {
        return [];
      }
      const revertWithObj = function (data) {
        let r = {};
        for (let i = 0; i < data.length; ++i) {
          let el = data[i];
          let key, val;
          key = el.name;
          if (el.type === "array") {
            val = revertWithArray(el.childs);
          } else if (el.type === "object") {
            val = revertWithObj(el.childs);
          } else {
            val = el.demo;
          }

          r[key] = val;
        }
        return r;
      };

      const revertWithArray = function (data) {
        let arr = [];
        for (let i = 0; i < data.length; ++i) {
          let el = data[i];
          let r;
          if (el.type === "array") {
            r = revertWithArray(el.childs);
          } else if (el.type === "object") {
            r = revertWithObj(el.childs);
          } else {
            r = el.demo;
          }

          arr.push(r);
        }
        return arr;
      };

      const revertMain = function (data) {
        if (data[0].type === "array") {
          return revertWithArray(data[0].childs);
        } else if (data[0].type === "object") {
          return revertWithObj(data[0].childs);
        }
        return revertWithObj(data);
      };
      return revertMain(dataArr);
    },

    // 返回信息
    resCode: function () {
      // this.clearNote();
      if (!this.responseData) {
        return;
      }
      // const jsonStr = JSON.stringify(this.jsonData);
      if(this.type === 0){
        this.resCodeDisplay = formatJson(this.responseData);
      }else if(this.type === 1){
        this.resCodeDisplay = this.formateXml(this.responseData);
      }else{
        this.resCodeDisplay = this.responseData;
      }
      setTimeout(() => {
        this.drawResCode(this.resCodeDisplay);
      }, 200);
    },

    //绘制res body
    drawResCode: function (content) {
      var target = document.getElementById("res_code");
      target.textContent = content;

      hljs.highlightElement(target);
      // this.addCodeLine();
      if (this.dataNoteShow) {
        this.showParamsNote();
      }
      if (this.dataTypeShow) {
        this.showDataType();
      }

      this.dataNoteShow = true;
      this.dataTypeShow = true;
    },

    //生成数据注释,主要将数据平铺展示
    makeParamsNote: function () {
      this.dataNoteArr = [];

      //生成数据类型
      var makeDataNote = (oj, indexNum) => {
        oj.forEach((el) => {
          if (el.childs && el.childs.length) {
            //根节点不显示
            if (
              !(indexNum == 0 && (el.type === "array" || el.type === "object"))
            ) {
              this.dataNoteArr.push({
                name: el.name,
                description: el.description,
                type: el.type,
              });
            }
            //如果当前是数组，但是数组下的元素不是object，则跳出
            if (el.type === "array" && el.childs[0].type !== "object") {
              return;
            } else if (el.type === "array" && el.childs[0].type === "object") {
              makeDataNote(el.childs[0].childs, indexNum + 1);
            } else {
              makeDataNote(el.childs, indexNum + 1);
            }
          } else {
            this.dataNoteArr.push({
              name: el.name,
              description: el.description,
              type: el.type,
            });
          }
        });
      };

      makeDataNote(this.commentData, 0);
    },

    //显示参数注释
    showParamsNote: function () {
      if (this.dataNoteShow) {
        if (!this.dataNoteArr.length) {
          return;
        }

        let vals = $("#res_code").children("span.hljs-attr");

        vals.each((index, el) => {
          let indexVal = this.dataNoteArr.find(
            (x) => el.innerText === '"' + x.name + '"'
          );
          if (indexVal && indexVal.description) {
            $(el).append(
              $(`<span class="label note">${indexVal.description}</span>`)
            );
          }
        });
      } else {
        $("#res_code").find(".label.note").remove();
      }
    },

    //生成数据注释
    makeDataType: function () {
      this.dataTypeArr = [];
      var that = this;
      if (!this.commentData || this.commentData.length == 0) {
        return [];
      }
      const revertWithObj = function (data) {
        let r = {};
        for (let i = 0; i < data.length; ++i) {
          let el = data[i];
          if (el.type === "array") {
            revertWithArray(el.childs);
          } else if (el.type === "object") {
            revertWithObj(el.childs);
          } else {
            that.dataTypeArr.push(el.type);
          }
        }
        return;
      };

      const revertWithArray = function (data) {
        for (let i = 0; i < data.length; ++i) {
          let el = data[i];
          if (el.type === "array") {
            revertWithArray(el.childs);
          } else if (el.type === "object") {
            revertWithObj(el.childs);
          } else {
            that.dataTypeArr.push(el.type);
          }
        }
        return;
      };

      const revertMain = function (data) {
        if (data[0].type === "array") {
          return revertWithArray(data[0].childs);
        } else if (data[0].type === "object") {
          return revertWithObj(data[0].childs);
        }
        return revertWithObj(data);
      };
      return revertMain(this.commentData);

      // var setDataType = (oj) => {
      //   let obj = typeof oj == "string" ? JSON.parse(oj) : oj;
      //   for (var key in obj) {
      //     if (obj[key] !== null && typeof obj[key] == "object") {
      //       setDataType(obj[key]);
      //     } else {
      //       this.dataTypeArr.push(Object.prototype.toString.call(obj[key]));
      //     }
      //   }
      // };
      // setDataType(this.resCodeDisplay);
    },

    //显示数据类型
    showDataType: function () {
      if (this.dataTypeShow && this.type === 0) {
        let vals = $("#res_code").children(
          "span:not(.hljs-attr):not(.hljs-punctuation)"
        );
        vals.each((index, el) => {
          $(el).append(
            $(
              `<span class="label type">${
                // this.dataTypes[this.dataTypeArr[index]]
                typeof JSON.parse(el.innerText)
              }</span>`
            )
          );
        });
      } else {
        $("#res_code").find(".label.type").remove();
      }
    },

    //清空代码注释和类型显示
    clearNote: function () {
      this.dataNoteShow = false;
      this.dataTypeShow = false;
      this.dataNoteArr = [];
      $("#res_code").find(".label.note").remove();

      this.dataTypeArr = [];
      $("#res_code").find(".label.type").remove();
    },

    jsonParse: function (jsonStr) {
      // 解析JSON
      let parseJson = (json) => {
        let result = [];
        let keys = Object.keys(json);
        keys.forEach((k, index) => {
          let val = json[k];
          let parsedVal = val;
          if (val === null || val === undefined) {
            val = "";
          }

          if (this.getType(val) == "object") {
            parsedVal = parseJson(val);
            // result.push(fr)
          } else if (this.getType(val) == "array") {
            parsedVal = parseArray(val);
            // result.push(fr)
          }

          let opt = {
            name: k,
            type: this.getType(val),
            description: "",
          };

          if (opt.type == "array" || opt.type == "object") {
            opt.childs = parsedVal;
            opt.description = null;
          } else {
            opt.childs = null;
            opt.description = parsedVal;
          }

          result.push(opt);
        });
        return result;
      };

      //  解析ARRAY
      let parseArray = (arrayObj) => {
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
            description: "",
          };

          if (opt.type == "array" || opt.type == "object") {
            opt.childs = parsedVal;
            opt.description = null;
          } else {
            opt.childs = null;
            opt.description = parsedVal;
          }

          result.push(opt);
        }
        return result;
      };

      // --
      let parseBody = (json) => {
        return parseJson(json);
      };

      return parseBody(jsonStr);
    },

    getType: function (obj) {
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

    makeJson: function (dataArr) {
      // 翻译JSON
      let revertWithObj = function (data) {
        let r = {};
        for (let i = 0; i < data.length; ++i) {
          let el = data[i];
          let key, val;
          key = el.name;
          if (el.type == "array") {
            val = revertWithArray(el.childs);
          } else if (el.type == "object") {
            val = revertWithObj(el.childs);
          } else {
            val = el.description;
          }

          r[key] = val;
        }

        return r;
      };

      // 翻译Array
      let revertWithArray = function (data) {
        let arr = [];
        for (let i = 0; i < data.length; ++i) {
          let el = data[i];
          let r;
          if (el.type == "array") {
            r = revertWithArray(el.childs);
          } else if (el.type == "object") {
            r = revertWithObj(el.childs);
          } else {
            r = el.description;
          }

          arr.push(r);
        }
        return arr;
      };

      let revertMain = function (data) {
        return revertWithObj(data);
      };

      return revertMain(dataArr);
    },
    //将树状图平铺
    // treeToTile() {
    //   this.renderDataRows = [];
    //   const expanded = (data) => {
    //     if (data && data.length > 0) {
    //       data
    //         .filter((d) => d)
    //         .forEach((e) => {
    //           this.renderDataRows.push(e);
    //           expanded(e["childs"]);
    //         });
    //     }
    //   };
    //   expanded(this.renderData);
    // },
  },
};
</script>

<style lang="less" scoped>
.ea-json-view {
  width: 100%;
  border: 1px solid #e4e4e4;

  .ea-json-view_control {
    padding: 10px 12px;
    background: #ececec;
  }
  .ea-json-view_viewport {
    margin: 0;
    padding: 12px;
  }
}
</style>

<style lang="less">
.ea-json-view {
  .hljs-attr {
    display: inline-block;
    margin-bottom: 5px;
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
      margin-left: 5px;
      padding: 1px 5px;
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
