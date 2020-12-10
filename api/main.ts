import { NowRequest, NowResponse } from "@vercel/node";
import Axios from "axios";
import { Card } from "./card";

export const fetchPlayer = async (futbinId: number) => {
  const res = await Axios.get(
    `https://www.futbin.com/getPlayerInfo?id=${futbinId}`
  );
  return res.data;
};

module.exports = async (req: NowRequest, res: NowResponse) => {
  const player = await fetchPlayer(parseInt(req.query.futbinId as string));
  const card = new Card(player);
  res.setHeader("Content-Type", "image/png");
  res.send(await card.draw());
};
