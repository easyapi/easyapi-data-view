<template>
  <div class="ea-data-view">
    <div class="ea-data-view_control" v-if="type === 'json' || type === 'xml'">
      <el-checkbox v-model="ifShowDescription">数据注释</el-checkbox>
      <el-checkbox v-model="ifShowType">数据类型</el-checkbox>
    </div>
    <pre class="ea-data-view_viewport" id="response"></pre>
  </div>
</template>

<script>
import hljs from "highlight.js";
import {formatJson, formatXml} from "./utils/format";

export default {
  name: "easyapi-data-view",
  props: {
    commentData: [],//注释数据
    responseData: [],//返回内容
    type: "",//类型（json/xml）
  },
  data() {
    return {
      ifShowDescription: false,//是否显示数据注释
      ifShowType: false,//是否显示数据类型
      typeList: [],
      descriptionList: [],
    };
  },
  created() {
    if (this.type === "json" || this.type === "xml") {
      this.makeDescriptionList();
      this.makeTypeList();
    }
    this.response();
  },
  watch: {
    ifShowDescription: function () {
      this.showDescription();
    },
    ifShowType: function () {
      this.showType();
    },
    commentData: function () {
      if (this.type === "json" || this.type === "xml") {
        this.makeDescriptionList();
        this.makeTypeList();
      }
      this.response();
    },
  },
  methods: {
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
    response: function () {
      // this.clean();
      if (!this.responseData) {
        return;
      }
      let formatData
      if (this.type === "json") {
        formatData = formatJson(this.responseData);
      } else if (this.type === "xml") {
        formatData = formatXml(this.responseData);
      } else {
        formatData = this.responseData;
      }
      setTimeout(() => {
        this.drawResCode(formatData);
      }, 200);
    },

    /**
     * 绘制res body
     */
    drawResCode: function (content) {
      let target = document.getElementById("response");
      target.textContent = content;

      hljs.highlightElement(target);
      // this.addCodeLine();
      if (this.ifShowDescription) {
        this.showDescription();
      }
      if (this.ifShowType) {
        this.showType();
      }

      this.ifShowDescription = true;
      this.ifShowType = true;
    },

    /**
     * 生成数据注释
     * 主要将数据平铺展示
     */
    makeDescriptionList: function () {
      this.descriptionList = [];
      //生成数据类型
      let makeDescriptionList = (oj, indexNum) => {
        oj.forEach((el) => {
          if (el.childs && el.childs.length) {
            //根节点不显示
            if (!(indexNum === 0 && (el.type === "array" || el.type === "object"))) {
              this.descriptionList.push({
                name: el.name,
                description: el.description,
                type: el.type,
              });
            }
            //如果当前是数组，但是数组下的元素不是object，则跳出
            if (el.type === "array" && el.childs[0].type !== "object") {
              return;
            } else if (el.type === "array" && el.childs[0].type === "object") {
              makeDescriptionList(el.childs[0].childs, indexNum + 1);
            } else {
              makeDescriptionList(el.childs, indexNum + 1);
            }
          } else {
            this.descriptionList.push({
              name: el.name,
              description: el.description,
              type: el.type,
            });
          }
        });
      };
      makeDescriptionList(this.commentData, 0);
    },

    /**
     * 显示数据类型
     */
    showType: function () {
      if (!this.ifShowType || (this.type !== "json" && this.type !== "xml")) {
        $("#response").find(".label.type").remove();
        return;
      }
      let children = $("#response").children();
      if (this.type === "json") {
        children.each((index, el) => {
          if (el.className !== "hljs-attr") {
            this.descriptionList.find(
              (x) => console.log(children[index].innerText, x.name)
            );
            let result = this.descriptionList.find(
              (x) => children[index].innerText === '"' + x.name + '"'
            );
            if (result && result.type) {
              $(el).append($(`<span class="label type">${result.type}</span>`));
            }
          }
        });
      } else if (this.type === "xml") {
        children.each((index, el) => {
          let result = this.descriptionList.find(
            (x) => {
              el.innerText === "</" + x.name + ">" || (el.innerText === "</" + x.name + ">" + x.description ? x.description : "")
            }
          );

          if (result && result.type) {
            if (result.type === "int") {
              $(el).append($(`<span class="label type-int">${result.type}</span>`));
            } else if (result.type === "string") {
              $(el).append($(`<span class="label type-string">${result.type}</span>`));
            } else {
              $(el).append($(`<span class="label type">${result.type}</span>`));
            }
          }
        });
      }
    },

    /**
     * 显示参数注释
     */
    showDescription: function () {
      if (!this.ifShowDescription || this.descriptionList.length === 0) {
        $("#response").find(".label.description").remove();
        return;
      }
      let children = $("#response").children();
      if (this.type === "json") {
        children.each((index, el) => {
          if (el.className !== "hljs-attr") {
            let result = this.descriptionList.find((x) => children[index].innerText === x.name);
            if (result && result.description) {
              $(el).append($(`<span class="label description">${result.description}</span>`));
            }
          }
        });
      } else if (this.type === "xml") {
        children.each((index, el) => {
          let result = this.descriptionList.find((x) => el.innerText === "</" + x.name + ">" || el.innerText === "</" + x.name + ">" + x.type);
          if (result && result.description) {
            $(el).append($(`<span class="label description">${result.description}</span>`));
          }
        });
      }
    },

    /**
     * 生成数据注释
     */
    makeTypeList: function () {
      this.typeList = [];
      let that = this;
      if (!this.commentData || this.commentData.length === 0) {
        return [];
      }
      const revertWithObj = function (data) {
        for (let i = 0; i < data.length; ++i) {
          let el = data[i];
          if (el.type === "array") {
            revertWithArray(el.childs);
          } else if (el.type === "object") {
            revertWithObj(el.childs);
          } else {
            that.typeList.push(el.type);
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
            that.typeList.push(el.type);
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
      //       this.typeList.push(Object.prototype.toString.call(obj[key]));
      //     }
      //   }
      // };
      // setDataType(this.resCodeDisplay);
    },

    /**
     * 清空代码注释和类型显示
     */
    clean: function () {
      this.ifShowDescription = false;
      this.ifShowType = false;
      this.descriptionList = [];
      $("#response").find(".label.description").remove();
      this.typeList = [];
      $("#response").find(".label.type").remove();
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

  #response {
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
      &.description {
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
