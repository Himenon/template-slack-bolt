import type { MessageItem } from "@himenon/message-command-parser";

export const Help: MessageItem = {
  command: "help",
  description: "コマンドのヘルプメッセージを出力します",
};

export const Ping: MessageItem = {
  command: "ping",
  description: "Botが生きているか確認します",
};

export const Version: MessageItem = {
  command: "version",
  description: "Botのバージョン情報を返します",
};

export const MessageItems: MessageItem[] = [Help, Ping, Version];
