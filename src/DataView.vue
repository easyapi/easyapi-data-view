<template>
  <div class="ea-data-view" id="data-view">
    <div class="ea-data-view_control" v-if="type === 'json' || type === 'xml'">
      <el-checkbox v-model="ifShowDescription" @change="response()">
        数据注释
      </el-checkbox>
      <el-checkbox v-model="ifShowType" @change="response()">
        数据类型
      </el-checkbox>
      <el-tooltip class="item" effect="dark" content="复制" placement="top">
        <el-button icon="el-icon-document-copy" @click="copy"></el-button>
      </el-tooltip>
    </div>
    <pre class="ea-data-view_viewport response" :id="id"></pre>
  </div>
</template>

<script>
import hljs from "highlight.js";

import {formatJson} from "./utils/json";
import {formatXml} from "./utils/xml";

export default {
  name: "easyapi-data-view",
  props: [
    "commentData", //注释数据
    "responseData", //返回内容
    "type", //类型（json/xml）
    "fontSize", //字体大小
    "id",
  ],
  data() {
    return {
      ifShowDescription: true, //是否显示数据注释
      ifShowType: true, //是否显示数据类型
    };
  },
  created() {
    this.response();
  },
  mounted() {
    this.setFontSize();
  },
  watch: {
    commentData: function () {
      this.response();
    },
    responseData: function () {
      this.response();
    },
    fontSize: function () {
      this.setFontSize();
    },
  },
  methods: {
    /**
     * 设置字体大小
     */
    setFontSize() {
      let dataView = document.getElementById("data-view");
      dataView.style.fontSize = this.fontSize ? "14px" : this.fontSize;
    },
    /**
     * 返回信息
     */
    response: function () {
      if (!this.responseData) {
        return;
      }
      let formatData;
      if (this.type === "json") {
        formatData = formatJson(
          this.responseData,
          this.commentData,
          false,
          this.ifShowDescription,
          this.ifShowType
        );
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
      let target = document.getElementById(this.id);
      target.textContent = content;

      hljs.highlightElement(target);
    },

    /**
     * 清空变量及代码注释和类型显示
     */
    clean: function () {
      this.ifShowDescription = false;
      this.ifShowType = false;
    },

    /**
     * 复制
     */
    copy: function () {
      let input = document.createElement("input");
      input.setAttribute("value", this.responseData);
      input.setAttribute("id", "copyInput");
      document.getElementsByTagName("body")[0].appendChild(input);
      document.getElementById("copyInput").select();
      document.execCommand("Copy");
      document.getElementById("copyInput").remove();
      this.$message.success("复制成功");
    },
  },
};
</script>

<style lang="less" scoped>
.ea-data-view {
  width: 100%;
  border: 1px solid #e4e4e4;

  .ea-data-view_control {
    position: relative;
    padding: 10px 12px;
    background: #ececec;

    .el-button {
      padding: 0;
      border: 0 solid #dcdfe6;
      background-color: rgba(0, 0, 0, 0);
      position: absolute;
      right: 10px;
      top: 10px;
    }
  }

  .ea-data-view_viewport {
    margin: 0;
    padding: 12px;
    line-height: 1.4;
  }
}
</style>

<style lang="less">
.ea-data-view {
  .hljs-attr {
    display: inline-block;
    margin-bottom: 5px;
  }

  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #11b5ca;
  }

  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    border-color: #11b5ca !important;
    background-color: #11b5ca !important;
  }

  .response {
    .hljs {
      background: unset !important;
      background-color: unset !important;
      border: none !important;
    }
  }
}
</style>
