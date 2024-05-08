import express, { Request, Response } from 'express';
import fs from 'fs';
import { promisify } from 'util';
const router = express.Router();

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const readJsonFile = async (fileName: string) => {
  const path = `./data/${fileName}.json`;
  if(!fs.existsSync(path)){
    return {};
  }
  const data = await readFile(path, 'utf8');
  return JSON.parse(data);
};

const writeJsonFile = async (fileName: string, data: any) => {
  const dataStr = JSON.stringify(data);  
  const filePath = `./data/${fileName}.json`;
  if(!fs.existsSync(filePath)){
    fs.mkdirSync('./data', { recursive: true });
  }
  await writeFile(filePath, dataStr, 'utf8');
};

/* GET users listing. */
router.get('/:userName', async <T> (req : Request, res : Response) => {
  const userName = req.params.userName;
  const data = await readJsonFile(userName);
  res.json({
    data: data as T,
    code: 200,
    success: true,
    message: 'Get user data successfully'
  });
});

router.post('/:userName', async <T> (req : Request, res : Response) => {
  const userName = req.params.userName;
  const data = req.body;
  await writeJsonFile(userName, data);
  res.json({
    data: null,
    code: 200,
    success: true,
    message: 'update user data successfully'
  });
});
export default router;
