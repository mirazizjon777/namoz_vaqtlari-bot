import { Bot } from "grammy";
import axios from "axios";

import dotenv from "dotenv";
dotenv.config();

import * as cheerio from "cheerio";
import regions from "./regions.js";
import months from "./months.js";
import days from "./days.js";
const bot = new Bot(process.env.TOKEN);

const regionButtons = [
  regions.map((reg) => ({ text: reg.name, callback_data: reg.id })),
];

bot.command("start", (ctx) => {
  ctx.reply("Hududni tanlang ?", {
    reply_markup: {
      inline_keyboard: regionButtons,
    },
  });
});

bot.on("callback_query", async (ctx) => {
  const reg_id = ctx.callbackQuery.data;
  const date = new Date();
  const year = date.getFullYear();
  const weekDay = days[date.getDay()];
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const monthsName = months[date.getMonth()];
  const res = await axios.get(`https://islom.uz/vaqtlar/${reg_id}/${month}`);
  const $ = cheerio.load(res.data);
  const tong = $("tr.bugun > td:nth-child(4)").text();
  const quyosh = $("tr.bugun > td:nth-child(5)").text();
  const peshin = $("tr.bugun > td:nth-child(6)").text();
  const asr = $("tr.bugun > td:nth-child(7)").text();
  const shom = $("tr.bugun > td:nth-child(8)").text();
  const hufton = $("tr.bugun > td:nth-child(9)").text();
  ctx.reply(
    `☪️ ${year}-yil\n🗓 ${day}-${monthsName}\n${weekDay}\n(${
      regions.find((reg) => reg.id == reg_id)?.name
    } shahri)\n\nBomdod - ${tong}\n\nQuyosh - ${quyosh}\n\nPeshin - ${peshin}\n\nAsr - ${asr}\n\nShom - ${shom}\n\nHufton - ${hufton}\n\nManba: www.islom.uz `,
    {
      reply_markup: {
        inline_keyboard: regionButtons,
      },
    }
  );
});

bot.start();
