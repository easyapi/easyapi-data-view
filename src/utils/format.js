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
        return (ifShowType ? (comment.type + " ") : "") + (ifShowDescription ? comment.description : "");
      }
    }
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
      draw.push(tab + (ifObject ? '"' + name + '":' : "") + value + (ifLast ? " //" + comment : ", //" + comment) + line);
    }
  };
  let ifLast = true //是否对象最后一个字段
  let indent = 0; //缩进
  notify("", data, "", ifLast, indent, false);
  return draw.join("");
};

/**
 * XML格式化
 */
let formatXml = function (text) {
  //使用replace去空格
  text = "\n" + text.replace(/(<\w+)(\s.*?>)/g, function ($0, name, props) {
    return name + " " + props.replace(/\s+(\w+=)/g, " $1");
  }).replace(/>\s*?</g, ">\n<");
  //处理注释
  text = text.replace(/\n/g, "\r").replace(/<!--(.+?)-->/g, function ($0, text) {
    return "<!--" + escape(text) + "-->";
  }).replace(/\r/g, "\n");
  //调整格式  以压栈方式递归调整缩进
  var rgx =
    /\n(<(([^\?]).+?)(?:\s|\s*?>|\s*?(\/)>)(?:.*?(?:(?:(\/)>)|(?:<(\/)\2>)))?)/gm;
  var nodeStack = [];
  var output = text.replace(
    rgx,
    function (
      $0,
      all,
      name,
      isBegin,
      isCloseFull1,
      isCloseFull2,
      isFull1,
      isFull2
    ) {
      var isClosed = isCloseFull1 === "/" || isCloseFull2 === "/" || isFull1 === "/" || isFull2 === "/";
      var prefix = "";
      if (isBegin === "!") {
        //!开头
        prefix = setPrefix(nodeStack.length);
      } else {
        if (isBegin !== "/") {
          ///开头
          prefix = setPrefix(nodeStack.length);
          if (!isClosed) {
            //非关闭标签
            nodeStack.push(name);
          }
        } else {
          nodeStack.pop(); //弹栈
          prefix = setPrefix(nodeStack.length);
        }
      }
      return "\n" + prefix + all;
    }
  );
  var prefixSpace = -1;
  var outputText = output.substring(1);
  //还原注释内容
  outputText = outputText
    .replace(/\n/g, "\r")
    .replace(/(\s*)<!--(.+?)-->/g, function ($0, prefix, text) {
      if (prefix.charAt(0) == "\r") prefix = prefix.substring(1);
      text = unescape(text).replace(/\r/g, "\n");
      var ret =
        "\n" + prefix + "<!--" + text.replace(/^\s*/gm, prefix) + "-->";
      return ret;
    });
  outputText = outputText.replace(/\s+$/g, "").replace(/\r/g, "\r\n");
  return outputText;
}

/**
 * 计算头函数 用来缩进
 * @param prefixIndex
 */
function setPrefix(prefixIndex) {
  var result = "";
  var span = "    "; //缩进长度
  var output = [];
  for (var i = 0; i < prefixIndex; ++i) {
    output.push(span);
  }
  result = output.join("");
  return result;
}

export {
  formatJson, formatXml
}
