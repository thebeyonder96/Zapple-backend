import { verify } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default (req: any, res: any, next: any) => {
  const token = req.headers.access_token as string;

  if (!token) res.status(401).send("Token missing");

  try {
    const decodedUser = verify(token, process.env.JWT_KEY as string);
    console.log(decodedUser);

    req.user = decodedUser;
  } catch (error) {
    res.status(401).send("Token Mismatch");
  }
  return next();
};

export function verifyAdmin(req: any, res: any, next: any) {
  const token = req.headers.access_token as string;

  if (!token) res.status(401).send("Token missing");

  try {
    const decodedUser = verify(token, process.env.JWT_KEY as string);
    if ((<any>decodedUser).isAdmin) return next();
    res.status(400).send("You're not an admin");
  } catch (error) {
    console.log(error);

    res.status(401).send("Token Mismatch");
  }
  // return next();
}
