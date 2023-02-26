// ==UserScript==
// @name         V2EX Base64 Helper
// @name:zh-CN   V2EX Base64 助手
// @namespace    https://github.com/amorphobia/v2ex-base64-helper
// @version      0.6.0
// @description  Base64 auto decoding, reply with base64 encoded
// @description:zh-CN  Base64 自动解码，用 base64 编码回复
// @author       Hinnka, amorphobia
// @match        https://v2ex.com/*
// @match        https://*.v2ex.com/*
// @icon         https://www.v2ex.com/static/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/js-base64@3.4.5
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var blacklist = ["bilibili", "Bilibili", "MyTomato", "InDesign", "Encrypto", "encrypto", "Window10", "USERNAME", "airpords", "Windows7"];

    var reg = /[A-z0-9+/=]+/g;

    var replaceContent = function(el) {
        var innerLinkTexts = Array.from(el.getElementsByTagName("a")).map(item => item.innerText);
        el.innerHTML = el.innerHTML.replace(reg, function(str) {
            if (str.length % 4 !== 0 || str.length < 8) {
                return str;
            }
            for (var text of innerLinkTexts) {
                if (text.includes(str)) {
                    return str;
                }
            }
            if (blacklist.includes(str)) {
                return str;
            }
            try {
                return `${str}<span style="color:#EE6F2D"><xmp style="display:inline;white-space:pre-wrap;word-wrap:break-word;">(${unescape(Base64.decode(str).replace(/\r?\n?/g, '').trim())})</xmp></span>`;
            } catch (error) {
                return str;
            }
        });
    };

    var topicContent = document.getElementsByClassName("topic_content")[0];
    if (topicContent) {
        replaceContent(topicContent);
    }
    var replyContent = document.getElementsByClassName("reply_content");
    if (replyContent) {
        for (var i = 0; i < replyContent.length; i++) {
            replaceContent(replyContent[i]);
        }
    }

    var replyTextArea = document.getElementById("reply_content");
    var buttonRow = replyTextArea.nextElementSibling;
    var form = buttonRow ? buttonRow.parentElement : null;
    if (form) {
        var base64ReplyFunc = function() {
            replyTextArea.value = Base64.encode(replyTextArea.value);
            form.submit();
        };
        var replyButton = buttonRow.querySelector("input");
        var div = document.createElement("div");
        div.appendChild(replyButton);
        var template = document.createElement("template");
        template.innerHTML = '<input type="button" id="base64Reply" value="Base64 回复" class="super normal button" style="margin-left: 10px"></input>';
        div.appendChild(template.content.firstChild);
        buttonRow.prepend(div);
        var base64Reply = document.getElementById("base64Reply");
        if(base64Reply) {
            base64Reply.onclick = base64ReplyFunc;
        }
    }
})();
