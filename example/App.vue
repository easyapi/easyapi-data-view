<template>
  <div class="j-w">
    <div class="editor-w clearfix">
      <div class="w-2">
        <div class="editor">
          <json-view :jsonData="jsonData"></json-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import hljs from "highlight.js";

export default {
  name: "app",
  data: function() {
    return {
      jsonData: {
        name: "may",
        age: null,
        address: [
          "Panyu Shiqiao on Canton",
          "Tianhe",
          {
            city: "forida meta 11"
          }
        ],
        ohters: {
          id: 1246,
          joinTime: "2017-08-20. 10:20",
          description: "another"
        }
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


