<template>
  <div>
    <div class="editor">
      <easyapi-data-view
        :responseData="xmlData"
        :commentData="xmlCommentData"
        :type="xmlType"
        :size="fontSize"
        :ifSave="ifSave"
        :responses="responses"
        :id="'json'"
        @updateResponses="updateResponses"
      ></easyapi-data-view>
    </div>
    <!-- <easyapi-data-view
        :responseData="xmlData"
        :commentData="xmlCommentData"
        :type="xmlType"
        :fontSize='fontSize'
      ></easyapi-data-view> -->
    <div class="editor">
      <easyapi-data-view
        :responseData="demo"
        :commentData="jsonCommentData"
        :type="jsonType"
        :fontSize="fontSize"
        :id="'xml'"
      ></easyapi-data-view>
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
      ifSave: true,
      fontSize: "14px",
      jsonType: "json",
      responses: [
        {
          name: "返回示例",
        },
        {
          name: "返回示例789787878798",
        },
      ],
      demo: '{\n  "code": 1,\n  "message": "获取成功",\n  "content": [\n    {\n      "addTime": "2022-04-02 16:17:24",\n      "content": "添加了XX活动",\n      "ip": "123.111.222.255",\n      "logId": 1,\n      "remark": "备注1",\n      "type": "添加活动",\n      "updateTime": "2022-04-02 16:17:26",\n      "user": {\n        "addTime": "2021-10-29 00:00:44",\n        "age": null,\n        "disabilityCertificate": null,\n        "id": 459,\n        "idCard": null,\n        "idType": null,\n        "intro": null,\n        "male": true,\n        "mobile": "13656171020",\n        "nickname": "张磊@EasyAPI",\n        "photo": "https://thirdwx.qlogo.cn/mmopen/vi_32/ajNVdqHZLLBc6LY3bAVloK4XIYFsbdPmLSf7Fw9m8BSt4SAKHa0bAq8W3PmHN5eLX5wP5dXTGVFlAfqYt1KsRg/132",\n        "realName": null,\n        "type": null,\n        "updateTime": "2022-01-06 19:24:31",\n        "username": "13656171020"\n      }\n    }\n  ],\n  "number": 0,\n  "size": 10,\n  "numberOfElements": 1,\n  "totalElements": 1,\n  "totalPages": 1,\n  "first": true,\n  "last": true,\n  "sort": {\n    "empty": false,\n    "sorted": true,\n    "unsorted": false\n  }\n}',
      jsonData:
        '{"msg":"success","code":200,"data":{"total":1,"user":{"name":"张三"},"service":{"name":"睡眠服务"},"rows":[{"total":2,"occupationIdsName":"导演,导演助理","pageSize":null,"title":"招募导演和导演助理！！！！_TEST3","ipDirectionName":"行业专业技能精英","cityName":null,"searchBeginTime":null,"ipDirection":940,"personalProfile":"北京中数聚力网络科技公司（ZSDMG Inc.）公司成立于2009年4月，是中国的一家专注于IP版权交易的创新型互联网文化企业，总部位于中国北京。\\n北京中数聚力公司的主要服务于数字版权资源内容的整合运营及渠道拓展，建立数字版权产品电子商务平台（版权界），为您提供电影、电视剧、电视栏目、动漫品牌、音乐、游戏、电子书、剧本等数字产品的版权授权、版权交易、新媒体营销、网络媒体推广、节目远程推送、新媒体广告等服务。海外推广发行、电视频道栏目运作，电视、网络媒体广告经营、央视文艺活动，影视动画节目创作、培训及资本运营为一体的集团产业化运作。\\n中数聚力与国内外200家以上影视机构、版权代理机构长期合作，涵盖50%以上的电视台同步热播新剧。版权授权合作包括视频网站、电视台、电信运营商、服装厂商、玩具厂商等超过400家合作企业。\\n在新媒体运营市场上，优酷-土豆网、搜狐视频、爱奇艺、腾讯视频、乐视网、PPTV、暴风影音、迅雷看看、风行网、56网、芒果TV等在内的20多家主流视频网站和新媒体播出平台，都与中数聚力公司建立了良好的合作关系。","failReason":null,"id":6,"userOccIdsName":null,"deliveryFlag":null,"contactsList":null,"address":null,"lowAmount":100,"updateTime":"2021-10-28 14:51:44","requirement":"专业导演和专业助手","searchEndTime":null,"userName":"lizm科技发展有限公司","pageCode":null,"vipUserId":3,"deliveryNum":null,"createTime":"2021-10-28 14:51:44","delStatus":0,"occupationIds":"955,956","endTime":"2021-10-10","interestLabelName":null,"highAmount":200,"status":2}]}}',
      jsonCommentData: [
        {
          childs: null,
          demo: "success",
          description: "返回说明",
          mock: null,
          name: "msg",
          remark: null,
          type: "string",
        },
        {
          childs: null,
          demo: "200",
          description: "返回码",
          mock: null,
          name: "code",
          remark: null,
          type: "int",
        },
        {
          childs: [
            {
              childs: null,
              demo: "1",
              description: "总条数",
              mock: null,
              name: "total",
              remark: null,
              type: "int",
            },
            {
              childs: [
                {
                  childs: null,
                  demo: "张三",
                  description: "姓名",
                  mock: null,
                  name: "name",
                  remark: null,
                  type: "int",
                },
              ],
              demo: null,
              description: null,
              mock: null,
              name: "user",
              remark: null,
              type: "object",
            },
            {
              childs: [
                {
                  childs: null,
                  demo: "睡眠",
                  description: "服务名称",
                  mock: null,
                  name: "name",
                  remark: null,
                  type: "int",
                },
              ],
              demo: null,
              description: null,
              mock: null,
              name: "service",
              remark: null,
              type: "object",
            },
            {
              childs: [
                {
                  childs: null,
                  demo: null,
                  description: "第2个total",
                  mock: null,
                  name: "total",
                  remark: null,
                  type: "string",
                },
                {
                  childs: null,
                  demo: "导演,导演助理",
                  description: "导演",
                  mock: null,
                  name: "occupationIdsName",
                  remark: null,
                  type: "string",
                },
                {
                  childs: [],
                  demo: "",
                  description: null,
                  mock: null,
                  name: "pageSize",
                  remark: null,
                  type: "int",
                },
                {
                  childs: null,
                  demo: "招募导演和导演助理！！！！_TEST3",
                  description: null,
                  mock: null,
                  name: "title",
                  remark: null,
                  type: "string",
                },
                {
                  childs: null,
                  demo: "行业专业技能精英",
                  description: null,
                  mock: null,
                  name: "ipDirectionName",
                  remark: null,
                  type: "string",
                },
                {
                  childs: null,
                  demo: null,
                  description: null,
                  mock: null,
                  name: "cityName",
                  remark: null,
                  type: "string",
                },
                {
                  childs: null,
                  demo: null,
                  description: null,
                  mock: null,
                  name: "searchBeginTime",
                  remark: null,
                  type: "string",
                },
                {
                  childs: null,
                  demo: "940",
                  description: null,
                  mock: null,
                  name: "ipDirection",
                  remark: null,
                  type: "int",
                },
                {
                  childs: null,
                  demo: "北京中数聚力网络科技公司（ZSDMG Inc.）公司成立于2009年4月，是中国的一家专注于IP版权交易的创新型互联网文化企业，总部位于中国北京。\n北京中数聚力公司的主要服务于数字版权资源内容的整合运营及渠道拓展，建立数字版权产品电子商务平台（版权界），为您提供电影、电视剧、电视栏目、动漫品牌、音乐、游戏、电子书、剧本等数字产品的版权授权、版权交易、新媒体营销、网络媒体推广、节目远程推送、新媒体广告等服务。海外推广发行、电视频道栏目运作，电视、网络媒体广告经营、央视文艺活动，影视动画节目创作、培训及资本运营为一体的集团产业化运作。\n中数聚力与国内外200家以上影视机构、版权代理机构长期合作，涵盖50%以上的电视台同步热播新剧。版权授权合作包括视频网站、电视台、电信运营商、服装厂商、玩具厂商等超过400家合作企业。\n在新媒体运营市场上，优酷-土豆网、搜狐视频、爱奇艺、腾讯视频、乐视网、PPTV、暴风影音、迅雷看看、风行网、56网、芒果TV等在内的20多家主流视频网站和新媒体播出平台，都与中数聚力公司建立了良好的合作关系。",
                  description: null,
                  mock: null,
                  name: "personalProfile",
                  remark: null,
                  type: "string",
                },
                {
                  childs: null,
                  demo: null,
                  description: null,
                  mock: null,
                  name: "failReason",
                  remark: null,
                  type: "string",
                },
                {
                  childs: null,
                  demo: "6",
                  description: null,
                  mock: null,
                  name: "id",
                  remark: null,
                  type: "int",
                },
                {
                  childs: null,
                  demo: null,
                  description: null,
                  mock: null,
                  name: "userOccIdsName",
                  remark: null,
                  type: "string",
                },
                {
                  childs: null,
                  demo: null,
                  description: null,
                  mock: null,
                  name: "deliveryFlag",
                  remark: null,
                  type: "string",
                },
                {
                  childs: null,
                  demo: null,
                  description: null,
                  mock: null,
                  name: "contactsList",
                  remark: null,
                  type: "string",
                },
                {
                  childs: null,
                  demo: null,
                  description: null,
                  mock: null,
                  name: "address",
                  remark: null,
                  type: "string",
                },
                {
                  childs: null,
                  demo: "100",
                  description: null,
                  mock: null,
                  name: "lowAmount",
                  remark: null,
                  type: "int",
                },
                {
                  childs: null,
                  demo: "2021-10-28 14:51:44",
                  description: null,
                  mock: null,
                  name: "updateTime",
                  remark: null,
                  type: "string",
                },
                {
                  childs: null,
                  demo: "专业导演和专业助手",
                  description: null,
                  mock: null,
                  name: "requirement",
                  remark: null,
                  type: "string",
                },
                {
                  childs: null,
                  demo: null,
                  description: null,
                  mock: null,
                  name: "searchEndTime",
                  remark: null,
                  type: "string",
                },
                {
                  childs: null,
                  demo: "lizm科技发展有限公司",
                  description: null,
                  mock: null,
                  name: "userName",
                  remark: null,
                  type: "string",
                },
                {
                  childs: null,
                  demo: null,
                  description: null,
                  mock: null,
                  name: "pageCode",
                  remark: null,
                  type: "string",
                },
                {
                  childs: null,
                  demo: "3",
                  description: null,
                  mock: null,
                  name: "vipUserId",
                  remark: null,
                  type: "int",
                },
                {
                  childs: null,
                  demo: null,
                  description: null,
                  mock: null,
                  name: "deliveryNum",
                  remark: null,
                  type: "string",
                },
                {
                  childs: null,
                  demo: "2021-10-28 14:51:44",
                  description: null,
                  mock: null,
                  name: "createTime",
                  remark: null,
                  type: "string",
                },
                {
                  childs: null,
                  demo: "0",
                  description: null,
                  mock: null,
                  name: "delStatus",
                  remark: null,
                  type: "int",
                },
                {
                  childs: null,
                  demo: "955,956",
                  description: null,
                  mock: null,
                  name: "occupationIds",
                  remark: null,
                  type: "string",
                },
                {
                  childs: null,
                  demo: "2021-10-10",
                  description: null,
                  mock: null,
                  name: "endTime",
                  remark: null,
                  type: "string",
                },
                {
                  childs: null,
                  demo: null,
                  description: null,
                  mock: null,
                  name: "interestLabelName",
                  remark: null,
                  type: "string",
                },
                {
                  childs: null,
                  demo: "200",
                  description: null,
                  mock: null,
                  name: "highAmount",
                  remark: null,
                  type: "int",
                },
                {
                  childs: null,
                  demo: "2",
                  description: null,
                  mock: null,
                  name: "status",
                  remark: null,
                  type: "int",
                },
              ],
              demo: "",
              description: "结果列表",
              mock: null,
              name: "rows",
              remark: null,
              type: "array",
            },
          ],
          demo: "",
          description: null,
          mock: null,
          name: "data",
          remark: null,
          type: "object",
        },
      ],
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
  methods: {
    updateResponses(name) {
      console.log(name);
    },
    big() {
      this.fontSize = "16px";
    },
    small() {
      this.fontSize = "12px";
    },
    middle() {
      this.fontSize = "14px";
    },
  },
};
</script>

<style>
@import url("../node_modules/highlight.js/styles/github.css");

.editor {
  width: 600px;
}
</style>
