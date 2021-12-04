<template>
  <div class="j-w">
    <div class="editor-w clearfix">
      <div class="w-2">
        <div class="editor">
          <easyapi-json-view
            :jsonData="jsonData"
            :commentData="commentData"
          ></easyapi-json-view>
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
          childs: [],
          type: "string"
        },
        {
          name: "info",
          description: null,
          type: "array",
          childs: [
            {
              name: "",
              description: "tt",
              type: "object",
              childs: [
                {
                  name: "age",
                  description: "年龄",
                  childs: [],
                  type: "number"
                },
              ],
            },
          ],
        },
      ],
      // commentData: [
      //   {
      //     name: "name",
      //     description: "姓名",
      //     childs: [],
      //   },
      //   {
      //     name: "info",
      //     description: null,
      //     childs: [
      //       {
      //         name: "age",
      //         description: "年龄",
      //         childs: [
      //         ],
      //       },
      //     ],
      //   },
      // ],

      jsonData: {
        name: "张三丰",
        info: [
          {
            age: 30,
          },
        ],
      },
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


