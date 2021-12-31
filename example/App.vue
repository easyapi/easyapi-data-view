<template>
  <div class="j-w">
    <div class="editor-w clearfix">
      <div class="w-2">
        <div class="editor">
          <!-- <easyapi-json-view
            :jsonData="jsonData"
            :commentData="commentData"
          ></easyapi-json-view> -->
          <easyapi-json-view :responseData="jsonData" :commentData="commentData" :type="0"></easyapi-json-view>
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
      // commentData: [
      //   {
      //     name: "username",
      //     description: "",
      //     type: "array",
      //     demo: "zhangsan",
      //     childs: [
      //       {
      //         name: "pass",
      //         description: "密码",
      //         type: "object",
      //         demo: 222,
      //         childs: [
      //           {
      //             name: "pass",
      //             description: "密码",
      //             type: "string",
      //             demo: "123",
      //             childs: [],
      //           },
      //           {
      //             name: "name",
      //             description: "名字",
      //             type: "int",
      //             demo: "zhangsan",
      //             childs: [],
      //           },
      //         ],
      //       },
      //     ],
      //   },
      // ],
      commentData: [
        {
          name: "根节点",
          description: "",
          type: "object",
          demo: "",
          childs: [
            {
              name: "code",
              description: null,
              type: "string",
              demo: true,
              childs: [],
            },
            {
              name: "content",
              description: "数组",
              type: "array",
              demo: "",
              childs: [
                {
                  name: "",
                  description: null,
                  type: "object",
                  demo: "",
                  childs: [
                    {
                      name: "latitude",
                      description: "金纬度",
                      type: "number",
                      demo: "0",
                      childs: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      jsonData: "{code: \"张三丰\",content:{latitude: 30,},}",
      // jsonData: "<person sex=\"female\"><firstname>Anna</firstname><lastname>Smith</lastname></person>",
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


