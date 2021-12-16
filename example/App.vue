<template>
  <div class="j-w">
    <div class="editor-w clearfix">
      <div class="w-2">
        <div class="editor">
          <!-- <easyapi-json-view
            :jsonData="jsonData"
            :commentData="commentData"
          ></easyapi-json-view> -->
          <easyapi-json-view :commentData="commentData"></easyapi-json-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  data: function () {
    return {
      commentData: [
        {
          name: "username",
          description: "",
          type: "string",
          demo: "zhangsan",
          childs: [],
        },
        {
          name: "pass",
          description: "密码",
          type: "int",
          demo: 1,
          childs: [],
        },
      ],

      // jsonData: {
      //   name: "张三丰",
      //   info:
      //     {
      //       age: 30,
      //     },

      // },
    };
  },
};
</script>

<style>
@import url("../node_modules/highlight.js/styles/github.css");

.editor {
  width: 600px;
}
</style>


