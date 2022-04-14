/**
 * 格式化JSON源码(对象转换为JSON文本)
 * @param json JSON字符串
 * @param comments 注释型JSON
 * @param compress 是否为压缩模式
 * @param ifShowDescription 是否显示数据注释
 * @param ifShowType 是否显示数据类型
 */
let formatJson = function (json, comments, compress, ifShowDescription, ifShowType) {
  let PADDING = "  ";
  if (/^\s*$/.test(json)) {
    //数据为空,无法格式化
    return;
  }
  let data = JSON.parse(json);
  let draw = []
  let line = compress ? "" : "\n"
  let nodeCount = 0 //字段数量
  let maxDepth = 0
  let level = 0; //参数层级

  /**
   * 注释JSON转换为扁平数组
   */
  function convert(data, parentName) {
    if (!data) {
      return []
    }
    return data.reduce((pre, cur) => {
      cur.name = (parentName ? (parentName + ".") : "") + cur.name
      const {type, name, description, childs = []} = cur
      return pre.concat([{type, name, description}], convert(childs, cur.name))
    }, [])
  }

  comments = convert(comments);

  /**
   * 获取对应注释类型和注释描述
   */
  function getComment(name) {
    for (let comment of comments) {
      if (comment.name === name) {
        let content = (ifShowType ? (comment.type + " ") : "") + (ifShowDescription ? (comment.description ? comment.description : "") : "");
        return content ? " //" + content : "";
      }
    }
    return "";
  }

  /**
   *
   * @param name 字段名
   * @param value 字段值
   * @param prefix 字段前缀
   * @param ifLast 是否当前对象最后一个字段
   * @param indent 缩进
   * @param ifObject 是否是对象
   */
  let notify = function (name, value, prefix, ifLast, indent, ifObject) {

    nodeCount++;//节点计数

    let tab = ""
    for (let i = 0; i < indent; i++) {
      tab += PADDING;
    }
    //缩进HTML
    tab = compress ? "" : tab;
    //压缩模式忽略缩进
    maxDepth = ++indent;
    //缩进递增并记录
    if (value && value.constructor === Array) {
      //处理数组
      draw.push(tab + (ifObject ? '"' + name + '":' : "") + "[" + line);
      //缩进'[' 然后换行
      for (let i = 0; i < value.length; i++) {
        notify(i, value[i], (prefix ? prefix + "." : "") + name, i === value.length - 1, indent, false);
      }
      draw.push(tab + "]" + (ifLast ? line : "," + line));
      //缩进']'换行,若非尾元素则添加逗号
    } else if (value && typeof value === "object") {
      level++
      //处理对象
      draw.push(tab + (ifObject ? '"' + name + '":' : "") + "{" + line);
      //缩进'{' 然后换行
      let len = 0, i = 0;
      for (let key in value) {
        len++;
      }
      prefix = ifObject ? (prefix ? prefix + "." : prefix) + name : (prefix ? prefix : "")
      for (let key in value) {
        notify(key, value[key], prefix, ++i === len, indent, true);
      }
      draw.push(tab + "}" + (ifLast ? line : "," + line));
      //缩进'}'换行,若非尾元素则添加逗号
    } else {
      if (typeof value === "string") {
        value = '"' + value + '" ';
      }
      let comment = getComment((prefix ? (prefix + ".") : "") + name)
      draw.push(tab + (ifObject ? '"' + name + '":' : "") + value + (ifLast ? comment : "," + comment) + line);
    }
  };
  let ifLast = true //是否对象最后一个字段
  let indent = 0; //缩进
  notify("", data, "", ifLast, indent, false);
  return draw.join("");
};

export {
  formatJson
}
