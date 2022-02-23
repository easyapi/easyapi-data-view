/**
 * JSON format print
 */
let formatJson = function (txt, compress /*是否为压缩模式*/) {
  /* 格式化JSON源码(对象转换为JSON文本) */
  var indentChar = "  ";
  if (/^\s*$/.test(txt)) {
    console.error("数据为空,无法格式化! ");
    return;
  }
  try {
    var data = eval("(" + txt + ")");
  } catch (e) {
    throw ("数据源语法错误,格式化失败! 错误信息: " + e.description, "err");
    return;
  }
  let draw = [],
    line = compress ? "" : "\n",
    nodeCount = 0,
    maxDepth = 0;

  let notify = function (name, value, isLast, indent /*缩进*/, formObj) {
    nodeCount++;
    /*节点计数*/
    for (var i = 0, tab = ""; i < indent; i++) tab += indentChar;
    /* 缩进HTML */
    tab = compress ? "" : tab;
    /*压缩模式忽略缩进*/
    maxDepth = ++indent;
    /*缩进递增并记录*/
    if (value && value.constructor === Array) {
      /*处理数组*/
      draw.push(
        tab + (formObj ? '"' + name + '":' : "") + "[" + line
      );
      /*缩进'[' 然后换行*/
      for (var i = 0; i < value.length; i++)
        notify(i, value[i], i === value.length - 1, indent, false);
      draw.push(
        tab + "]" + (isLast ? line : "," + line)
      );
      /*缩进']'换行,若非尾元素则添加逗号*/
    } else if (value && typeof value === "object") {
      /*处理对象*/
      draw.push(tab + (formObj ? '"' + name + '":' : "") + "{" + line);
      /*缩进'{' 然后换行*/
      let len = 0, i = 0;
      for (let key in value) len++;
      for (let key in value) notify(key, value[key], ++i === len, indent, true);
      draw.push(tab + "}" + (isLast ? line : "," + line));
      /*缩进'}'换行,若非尾元素则添加逗号*/
    } else {
      if (typeof value === "string") value = '"' + value + '"';
      draw.push(
        tab +
        (formObj ? '"' + name + '":' : "") +
        value +
        (isLast ? "" : ",") +
        line
      );
    }
  };
  var isLast = true, indent = 0;
  notify("", data, isLast, indent, false);
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
