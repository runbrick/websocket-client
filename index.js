const {ipcRenderer} = require("electron")
let websocket;

/**
 * 连接
 */
function connect() {
    // 要连接的地址 Url
    let connectUrl = document.getElementById("connect_url").value

    if (connectUrl === '') {
        ipcRenderer.send("errmsg", "请输入要连接的地址")
    } else {
        websocket = new WebSocket(connectUrl)
        websocket.onopen = function (evt) {
            onOpen(evt)
        }
        websocket.onclose = function (evt) {
            onClose(evt)
        };
        websocket.onmessage = function (evt) {
            onMessage(evt)
        };
        websocket.onerror = function (evt) {
            onError(evt)
        };
    }

}

/**
 * 用来动态添加到文本框的方法
 * @param content 要放入的内容
 */
function appendContent(content) {
    var collbackMsg = document.getElementById("collback_msg");
    collbackMsg.value = collbackMsg.value + content + "\n"
    // 让滚动条置于最底部
    collbackMsg.scrollTop = collbackMsg.scrollHeight
}

/**
 * 退出
 */
function disConnect() {
    if (websocket) {
        websocket.close()
        websocket = null;
    } else {
        ipcRenderer.send("errmsg", "暂时无法退出,可能是没有链接?")
    }
}

/**
 * 发送
 */
function send() {
    let sendMsg = document.getElementById("send_msg").value
    if (sendMsg === '') {
        ipcRenderer.send("errmsg", "请输入要发送的内容")
    } else {
        appendContent("[>>>]" + sendMsg)
        websocket.send(sendMsg)
    }
}

/**
 * 清空 输入框和消息框
 */
function clearBox() {
    document.getElementById("collback_msg").value = ''
    document.getElementById("send_msg").value = ''
}


function onOpen(evt) {
    appendContent("[!]连接成功")
    document.getElementById("send_msg").disabled = ""
    document.getElementById("connect_url").disabled = "disabled"
}

function onClose(evt) {
    if (websocket) {
        websocket.close();
    }
    appendContent("[!]Websocket连接已断开!")
    document.getElementById("send_msg").disabled = "disabled"
    document.getElementById("connect_url").disabled = ""
}

function onMessage(evt) {
    if (evt !== "") {
        appendContent("[<<<]" + evt.data)
    }
}

function onError(evt) {
    websocket.close();
    appendContent("[!]发生错误")
    document.getElementById("connect_url").disabled = ""
}
