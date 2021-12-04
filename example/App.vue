<template>
  <div class="j-w">
    <div class="editor-w clearfix">
      <div class="w-2">
        <div class="editor">
          <easyapi-json-view :jsonData="jsonData" :commentData="commentData"></easyapi-json-view>
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
          name: "name",
          description: "姓名",
          childs: []
        },
        {
          name: "info",
          description: null,
          childs: [
            {
              name: "age",
              description: "年龄",
              childs: []
            },
            {
              name: "birthday",
              description: "生日",
              childs: []
            }
          ]
        },
        {
          name: "description",
          description: "描述",
          childs: []
        }
      ],
      jsonData: {
        name: "张三丰",
        info: {
          age: 30,
          birthday: "1988-10-22"
        },
        description: "我是一个中国人"
      }
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


