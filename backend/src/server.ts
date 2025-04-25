import express, { Request, Response } from "express";
import routes from "./route";
export const app = express();
import cors from "cors";
const port = 3001;

app.use(cors());
app.get("/", (_req: Request, res: Response) => {
  res.send("App is working");
});

app.use("/api", routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
