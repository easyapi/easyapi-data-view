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
      descriptionList: []
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
      this.showNote();
    },
    ifShowType: function () {
      this.showNote();
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
        this.show(formatData);
      }, 200);
    },

    /**
     * 显示
     */
    show: function (content) {
      let target = document.getElementById("response");
      target.textContent = content;

      hljs.highlightElement(target);
      this.ifShowDescription = true;
      this.ifShowType = true;
      this.showNote();
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
      const makeTypeList = function (data) {
        for (let i = 0; i < data.length; ++i) {
          let el = data[i];
          if (el.type === "array" || el.type === "object") {
            makeTypeList(el.childs);
          } else {
            that.typeList.push(el.type);
          }
        }
      };
      return makeTypeList(this.commentData);
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
     * 显示注解信息
     */
    showNote: function () {
      $("#response").find(".label.type").remove();
      $("#response").find(".label.description").remove();
      if (this.type !== "json" && this.type !== "xml") {
        return;
      }
      if (!this.ifShowType && !this.ifShowDescription) {
        //如果描述和类型都不需要显示
        return;
      }
      let children = $("#response").children();
      if (this.type === "json") {
        children.each((index, el) => {
          if (el.className !== "hljs-attr") {
            let result = this.descriptionList.find(
              (x) => children[index - 1].innerText === '"' + x.name + '"'
            );
            if (result) {
              if (result.type && this.ifShowType) {
                $(el).append($(`<span class="label type">${result.type}</span>`));
              }
              if (result.description && this.ifShowDescription) {
                $(el).append($(`<span class="label description">${result.description}</span>`));
              }
            }
          }
        });
      } else if (this.type === "xml") {
        children.each((index, el) => {
          let result = this.descriptionList.find((x) => {
            el.innerText === "</" + x.name + ">" || (el.innerText === "</" + x.name + ">" + x.description ? x.description : "")
          });
          // let result = this.descriptionList.find((x) => el.innerText === "</" + x.name + ">" || el.innerText === "</" + x.name + ">" + x.type);
          if (result) {
            if (result.type && this.ifShowType) {
              if (result.type === "int") {
                $(el).append($(`<span class="label type-int">${result.type}</span>`));
              } else if (result.type === "string") {
                $(el).append($(`<span class="label type-string">${result.type}</span>`));
              } else {
                $(el).append($(`<span class="label type">${result.type}</span>`));
              }
            }
            if (result.description && this.ifShowDescription) {
              $(el).append($(`<span class="label description">${result.description}</span>`));
            }
          }
        });
      }
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
  }
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
