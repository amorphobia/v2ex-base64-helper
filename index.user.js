// ==UserScript==
// @name         V2EX Base64 Helper
// @name:zh-CN   V2EX Base64 助手
// @namespace    https://github.com/amorphobia/v2ex-base64-helper
// @version      0.6.6
// @description  Base64 auto decoding, reply with base64 encoded
// @description:zh-CN  Base64 自动解码，用 base64 编码回复
// @author       Hinnka, amorphobia
// @match        https://v2ex.com/*
// @match        https://*.v2ex.com/*
// @icon         https://www.v2ex.com/static/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/js-base64@3.4.5
// @grant        none
// ==/UserScript==

/* globals Base64 */

(function() {
    'use strict';

    var blacklist = [
        "ADVENTUR",
        "airpords",
        "bilibili",
        "Bilibili",
        "CRITICAL",
        "Emphasis",
        "emphasis",
        "Encrypto",
        "encrypto",
        "EUROPEAN",
        "Exchange",
        "exchange",
        "InDesign",
        "INSTANCE",
        "MyTomato",
        "PRESSURE",
        "Question",
        "RAVPOWER",
        "Reaction",
        "Semester",
        "Synology",
        "TRANSFER",
        "USERNAME",
        "VERTICAL",
        "Window10",
        "Windows7",
    ];

    const prefixBlacklist = [
        "deepin",
    ];

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
            if (str.length == 8) {
                for (const prefix of prefixBlacklist) {
                    if (str.startsWith(prefix)) {
                        return str;
                    }
                }
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
    if (replyTextArea) {
        var form = replyTextArea.parentElement;
        var base64ReplyFunc = function() {
            replyTextArea.value = Base64.encode(replyTextArea.value);
            form.submit();
        };
        var b64Button = document.createElement("input");
        b64Button.setAttribute("id", "base64Reply");
        b64Button.setAttribute("type", "button");
        b64Button.setAttribute("class", "super normal button");
        b64Button.setAttribute("value", "Base64 回复");
        var buttonRow = form.querySelector("div.flex-one-row");
        if (buttonRow) {
            var replyButton = buttonRow.querySelector("input.super.normal.button");
            var div = document.createElement("div");
            div.appendChild(replyButton);
            b64Button.setAttribute("style", "margin-left: 10px;");
            div.appendChild(b64Button);
            buttonRow.prepend(div);
        } else {
            var sep = document.createElement("div");
            sep.setAttribute("class", "sep");
            form.appendChild(sep);
            b64Button.setAttribute("style", "width: 100%; line-height: 20px;");
            form.appendChild(b64Button);
        }
        var base64Reply = document.getElementById("base64Reply");
        if(base64Reply) {
            base64Reply.onclick = base64ReplyFunc;
        }
    }
})();
