<template>
  <div class="el-json-view">
    <span>
      <el-checkbox v-model="dataNoteShow">数据注释</el-checkbox>
      <el-checkbox v-model="dataTypeShow">数据类型</el-checkbox>
    </span>
    <pre>
        <code class="json" id="res_code"></code>
      </pre>
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
  },
  watch: {
    dataNoteShow: function() {
      if (this.dataNoteShow) {
        this.showParamsNote();
      }
    },
    dataTypeShow: function() {
      this.showDataType();
    },
    dataTypeArr: function() {
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
      this.showDataType();
      this.showParamsNote();
    },

    //生成数据注释
    makeParamsNote: function() {
      //获取一级key
      // let obj = JSON.parse(this.resCodeDisplay)
      // this.firstLevelParams = []
      // for(let i in obj) {
      //   this.firstLevelParams.push(i)
      // }

      //描述字段
      let attrs = $("#res_code .hljs-attr");
      let tmpAttrs = attrs;
      attrs = [];

      for (let i = 0; i < tmpAttrs.length; ++i) {
        if (
          $(tmpAttrs[i])
            .next()
            .hasClass("hljs-attr")
        ) {
          continue;
        }
        attrs.push(tmpAttrs[i]);
      }

      this.dataNoteArr = [];
      for (let i = 0; i < attrs.length; ++i) {
        let noCheck = true;
        let attrTmp = $(attrs[i])
          .text()
          .replace('"', "")
          .replace('"', "");
        for (let j = 0; j < this.paramsNote.length; ++j) {
          let el = this.paramsNote[j];
          if (el.name == attrTmp) {
            this.dataNoteArr.push({
              name: el.name,
              des: el.description
            });
            noCheck = false;
            break;
          }
        }
        if (noCheck) {
          this.dataNoteArr.push({
            name: "",
            des: ""
          });
        }
      }

      this.showParamsNote();
    },

    //显示参数注释
    showParamsNote: function() {
      if (this.dataNoteShow) {
        if (!this.dataNoteArr.length) {
          return;
        }

        let vals = $("#res_code").children("span:not(.hljs-attr)");

        vals.each((index, el) => {
          if (this.dataNoteArr[index].des) {
            $(el).append(
              $(
                `<span class="label note">${this.dataNoteArr[index].des}</span>`
              )
            );
          } else {
            $(el).append($(`<span class="label note none">无注释</span>`));
          }
        });
      } else {
        $("#res_code")
          .find(".label.note")
          .remove();
      }
    },

    //显示数据类型
    showDataType: function() {
      if (this.dataTypeShow) {
        this.dataTypeArr = [];

        //生成数据类型
        var makeDataType = oj => {
          let obj = typeof oj == "string" ? JSON.parse(oj) : oj;
          for (var key in obj) {
            if (obj[key] !== null && typeof obj[key] == "object") {
              makeDataType(obj[key]);
            } else {
              this.dataTypeArr.push(Object.prototype.toString.call(obj[key]));
            }
          }
        };

        makeDataType(this.resCodeDisplay);
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
    }
  }
};
</script>

<style lang="less">
.el-json-view {
  width: 100%;
}

.button {
  &.to-test {
    position: absolute;
    top: 20px;
    right: 10px;
  }
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
</style>