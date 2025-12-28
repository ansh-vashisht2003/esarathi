import { execFile } from "child_process";
import path from "path";

export const checkPlateAI = (imagePath) => {
  return new Promise((resolve, reject) => {
    const pythonPath = path.join(
      process.cwd(),
      "ai_env",
      "Scripts",
      "python.exe"
    );

    const scriptPath = path.join(process.cwd(), "plate_check.py");

    execFile(pythonPath, [scriptPath, imagePath], (err, stdout) => {
      if (err) return reject(err);
      resolve(JSON.parse(stdout));
    });
  });
};
