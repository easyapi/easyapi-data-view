<template>
  <div class="j-w">
    <div class="editor-w clearfix">
      <div class="w-2">
        <div class="editor">
          <el-json-view :jsonData="jsonData" :commentData="commentData"></el-json-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  data: function() {
    return {
      commentData: [
        {
          name: "dddd",
          remark: "232",
          childParams: []
        },
        {
          name: "fff",
          remark: null,
          childParams: [
            {
              name: "fasd",
              remark: "22",
              childParams: []
            },
            {
              name: "vvv",
              remark: "fff",
              childParams: []
            }
          ]
        },
        {
          name: "vvv",
          remark: "123",
          childParams: []
        }
      ],
      jsonData: {
        dddd: 1234,
        fff: {
          fasd: "213",
          vvv: "12312"
        },
        vvv: "ass"
      }
    };
  },
  methods: {},
  mounted: function() {}
};
</script>

<style>
@import url("../node_modules/highlight.js/styles/github.css");

.editor {
  width: 600px;
}
</style>


