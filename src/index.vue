<template>
  <div class="ea-data-view">
    <div class="ea-data-view_control" v-if="type === 'json' || type === 'xml'">
      <el-checkbox v-model="dataNoteShow">数据注释</el-checkbox>
      <el-checkbox v-model="dataTypeShow">数据类型</el-checkbox>
    </div>
    <pre class="ea-data-view_viewport" id="res_code"></pre>
  </div>
</template>

<script>
import hljs from "highlight.js";
import {formatJson, formatXml} from "./utils/format";

export default {
  name: "easyapi-data-view",
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
    if (this.type === "json" || this.type === "xml") {
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
      if (this.type === "json" || this.type === "xml") {
        this.makeParamsNote();
        this.makeDataType();
      }
      this.resCode();
    },
  },
  methods: {
    /**
     * 计算头函数 用来缩进
     * @param prefixIndex
     */
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

    /**
     *
     */
    makeJsonEditor: function (dataArr) {
      if (!dataArr || dataArr.length === 0) {
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

      /**
       *
       */
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

      /**
       *
       */
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

    /**
     * 返回信息
     */
    resCode: function () {
      // this.clearNote();
      if (!this.responseData) {
        return;
      }
      if (this.type === "json") {
        this.resCodeDisplay = formatJson(this.responseData);
      } else if (this.type === "xml") {
        this.resCodeDisplay = formatXml(this.responseData);
      } else {
        this.resCodeDisplay = this.responseData;
      }
      setTimeout(() => {
        this.drawResCode(this.resCodeDisplay);
      }, 200);
    },

    /**
     * 绘制res body
     */
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

    /**
     * 生成数据注释,主要将数据平铺展示
     */
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

        let vals = $("#res_code").children();
        if (this.type === "json") {
          vals.each((index, el) => {
            if (el.className !== "hljs-attr") {
              let indexVal = this.dataNoteArr.find(
                (x) => vals[index - 1].innerText === '"' + x.name + '"'
              );
              if (indexVal && indexVal.description) {
                $(el).append(
                  $(`<span class="label note">${indexVal.description}</span>`)
                );
              }
            }
          });
        } else if (this.type === "xml") {
          vals.each((index, el) => {
            let indexVal = this.dataNoteArr.find(
              (x) =>
                el.innerText === "</" + x.name + ">" ||
                el.innerText === "</" + x.name + ">" + x.type
            );
            if (indexVal && indexVal.description) {
              $(el).append(
                $(`<span class="label note">${indexVal.description}</span>`)
              );
            }
          });
        }

        // let vals = $("#res_code").children("span.hljs-attr");

        // vals.each((index, el) => {
        //   let indexVal = this.dataNoteArr.find(
        //     (x) => el.innerText === '"' + x.name + '"'
        //   );
        //   if (indexVal && indexVal.description) {
        //     $(el).append(
        //       $(`<span class="label note">${indexVal.description}</span>`)
        //     );
        //   }
        // });
      } else {
        $("#res_code").find(".label.note").remove();
      }
    },

    /**
     * 生成数据注释
     */
    makeDataType: function () {
      this.dataTypeArr = [];
      var that = this;
      if (!this.commentData || this.commentData.length === 0) {
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
      if (this.dataTypeShow && (this.type === "json" || this.type === "xml")) {
        // let vals = $("#res_code").children(
        //   "span:not(.hljs-attr):not(.hljs-punctuation)"
        // );
        let vals = $("#res_code").children();
        if (this.type === "json") {
          vals.each((index, el) => {
            if (el.className !== "hljs-attr") {
              let indexVal = this.dataNoteArr.find(
                (x) => vals[index - 1].innerText === '"' + x.name + '"'
              );
              if (indexVal && indexVal.type) {
                $(el).append(
                  $(`<span class="label type">${indexVal.type}</span>`)
                );
              }
            }
            // $(el).append(
            //   $(
            //     `<span class="label type">${
            //       typeof JSON.parse(el.innerText)
            //     }</span>`
            //   )
            // );
          });
        } else if (this.type === "xml") {
          vals.each((index, el) => {
            let indexVal = this.dataNoteArr.find(
              (x) =>
                el.innerText === "</" + x.name + ">" ||
                (el.innerText === "</" + x.name + ">" + x.description
                  ? x.description
                  : "")
            );

            if (indexVal && indexVal.type) {
              if (indexVal.type === "int") {
                $(el).append(
                  $(`<span class="label type-int">${indexVal.type}</span>`)
                );
              } else if (indexVal.type === "string") {
                $(el).append(
                  $(`<span class="label type-string">${indexVal.type}</span>`)
                );
              } else {
                $(el).append(
                  $(`<span class="label type">${indexVal.type}</span>`)
                );
              }
            }
          });
          // let indexVal = this.dataNoteArr.find(
          //   (x) => vals[index].innerText === '"</' + x.name + '>"'
          // );
          // if (indexVal && indexVal.type) {
          //   $(el).append(
          //     $(`<span class="label type">${indexVal.type}</span>`)
          //   );
          // }
        }
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

          if (this.getType(val) === "object") {
            parsedVal = parseJson(val);
            // result.push(fr)
          } else if (this.getType(val) === "array") {
            parsedVal = parseArray(val);
            // result.push(fr)
          }

          let opt = {
            name: k,
            type: this.getType(val),
            description: "",
          };

          if (opt.type === "array" || opt.type === "object") {
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
          if (this.getType(val) === "object") {
            parsedVal = parseJson(val);
          } else if (this.getType(val) === "array") {
            parsedVal = parseArray(val);
          }

          let opt = {
            name: null,
            type: this.getType(val),
            description: "",
          };

          if (opt.type === "array" || opt.type === "object") {
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
          if (el.type === "array") {
            val = revertWithArray(el.childs);
          } else if (el.type === "object") {
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
          if (el.type === "array") {
            r = revertWithArray(el.childs);
          } else if (el.type === "object") {
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
.ea-data-view {
  width: 100%;
  border: 1px solid #e4e4e4;

  .ea-data-view_control {
    padding: 10px 12px;
    background: #ececec;
  }

  .ea-data-view_viewport {
    margin: 0;
    padding: 12px;
  }
}
</style>

<style lang="less">
.ea-data-view {
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

  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #11b5ca;
  }

  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
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
      // 类型颜色
      &.type {
        color: #ffffff;
        background-color: #047373;
      }

      &.type-int {
        color: #ffffff;
        background-color: #AF73B3;
      }

      &.type-string {
        color: #ffffff;
        background-color: #999999;
      }

      // 注释颜色
      &.note {
        color: #ffffff;
        background-color: #11b5ca;
      }

      &.none {
        background-color: #bbbec4 !important;
      }
    }
  }
}
</style>
