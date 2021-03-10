import axios from "axios";
import * as crypto from "crypto";
import * as git from "isomorphic-git";
import * as fs from "fs";

const feishuWebhook =
  "https://open.feishu.cn/open-apis/bot/v2/hook/99cb553f-b5ca-409e-a743-f08d07913929";
const key = "8kYHSSz7t7REuSyIrrWCwh";

function getSign(timestamp: number, key: string) {
  const sign = crypto
    .createHmac("sha256", "" + timestamp + "\n" + key)
    .digest()
    .toString("base64");
  return sign;
}

interface FeishuTextMessage {
  timestamp: string;
  sign: string;
  msg_type: "text";
  content: {
    text: string;
  };
}

async function sendMessage(feishuUrl: string, message: string) {
  const timestamp = Math.floor(+new Date() / 1000);
  const feishuMessage: FeishuTextMessage = {
    timestamp: timestamp.toString(),
    sign: getSign(timestamp, key),
    msg_type: "text",
    content: {
      text: message,
    },
  };
  const result = await axios.post(feishuUrl, feishuMessage);
  return result;
}

async function main() {
  const log = (await git.log({ fs, dir: ".", depth: 1 })).find(() => true);
  if (!log) return;
  const commitMessage = getCommitMessage(log);
  console.log(commitMessage);
  const result = await sendMessage(feishuWebhook, commitMessage);
  if (result.data.StatusMessage !== "success") {
    throw new Error("Send failed");
  }
}

function getCommitMessage(log: git.ReadCommitResult) {
  const commit = log.commit;
  return `${commit.author.name} 推送了更改: ${commit.message}
commit hash: ${log.oid}`;
}

main()
  .then(() => {
    console.log("Send message done");
  })
  .catch((e) => {
    console.error(e);
    console.error("Send message failed");
  });
