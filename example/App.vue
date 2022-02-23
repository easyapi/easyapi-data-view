<template>
  <div class="j-w">
    <div class="editor-w clearfix">
      <div class="w-2">
        <div class="editor">
          <easyapi-data-view :responseData="jsonData" :commentData="jsonCommentData"
                             :type="jsonType"></easyapi-data-view>
        </div>
        <div class="editor">
          <!--          <easyapi-data-view :responseData="xmlData" :commentData="xmlCommentData" :type="xmlType"></easyapi-data-view>-->
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
      jsonType: "json",
      jsonData: "{\"code\":\"张三丰\",\"content\":{\"latitude\":30}}",
      jsonCommentData: [
        {
          name: "code",
          description: "编码",
          type: "int",
          demo: "张三丰",
          childs: []
        },
        {
          name: "content",
          description: "编码",
          type: "object",
          demo: "张三丰",
          childs: [
            {
              name: "latitude",
              description: "密码",
              type: "int",
              demo: "222",
              childs: []
            }
          ]
        }
      ],
      xmlType: "xml",
      xmlData: "<person sex=\"female\"><code>Anna</code><latitude>Smith</latitude></person>",
      xmlCommentData: [
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


