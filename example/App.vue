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
          remark: "姓名",
          childParams: []
        },
        {
          name: "info",
          remark: null,
          childParams: [
            {
              name: "age",
              remark: "年龄",
              childParams: []
            },
            {
              name: "birthday",
              remark: "生日",
              childParams: []
            }
          ]
        },
        {
          name: "description",
          remark: "描述",
          childParams: []
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


