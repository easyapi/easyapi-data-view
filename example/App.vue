<template>
  <div>
    <div class="editor">
      <easyapi-data-view
        :responseData="jsonData"
        :commentData="jsonCommentData"
        :type="jsonType"
        :fontSize='fontSize'
      ></easyapi-data-view>
    </div>
    <div class="editor">
      <!--          <easyapi-data-view :responseData="xmlData" :commentData="xmlCommentData" :type="xmlType" :size='fontSize'></easyapi-data-view>-->
    </div>
    <el-button @click="big">大</el-button>
    <el-button @click="middle">中</el-button>
    <el-button @click="small">小</el-button>
  </div>
</template>

<script>
export default {
  name: "app",
  data: function () {
    return {
      fontSize: "14px",
      jsonType: "json",
      jsonData:
        '{"code":0,"msg":"success","app_access_token":"a-6U1SbDiM6XIH2DcTCPyeub","expire":7140}',
      jsonCommentData:  [{
        "childs": [{
          "childs": null,
          "demo": "0",
          "description": "返回码",
          "mock": null,
          "name": "code",
          "type": "int"
        }, {
          "childs": null,
          "demo": "success",
          "description": "",
          "mock": null,
          "name": "msg",
          "type": "string"
        }, {
          "childs": null,
          "demo": "a-6U1SbDiM6XIH2DcTCPyeub",
          "description": "",
          "mock": null,
          "name": "app_access_token",
          "type": "string"
        }, {
          "childs": null,
          "demo": "7140",
          "description": "",
          "mock": null,
          "name": "expire",
          "type": "int"
        }],
        "demo": "",
        "description": "",
        "mock": null,
        "name": "根节点",
        "type": "object"
      }],
      xmlType: "xml",
      xmlData:
        '<person sex="female"><code>Anna</code><latitude>Smith</latitude></person>',
      xmlCommentData: [
        {
          name: "根节点",
          description: "",
          type: "object",
          demo: "",
          childs: [
            {
              name: "code",
              description: "12121",
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
  methods:{
    big(){
      this.fontSize = '16px'
    },
    small(){
      this.fontSize = '12px'
    },
    middle(){
      this.fontSize = '14px'
    }
  }
};
</script>

<style>
@import url("../node_modules/highlight.js/styles/github.css");

.editor {
  width: 600px;
}
</style>


