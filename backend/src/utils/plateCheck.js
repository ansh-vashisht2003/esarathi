import { execFile } from "child_process";
import path from "path";

export const checkPlateAI = (imagePath) => {
  return new Promise((resolve) => {
    const pythonPath =
      "C:/Users/Dell/OneDrive/Desktop/essarathi/backend/ai_env/Scripts/python.exe";

    const scriptPath =
      "C:/Users/Dell/OneDrive/Desktop/essarathi/backend/plate_check.py";

    execFile(
      pythonPath,
      [scriptPath, imagePath],
      { timeout: 120000 },
      (error, stdout, stderr) => {
        if (error) {
          console.error("❌ AI PROCESS ERROR:", error.message);
          return resolve(null); // 🔥 NEVER THROW
        }

        try {
          const output = stdout.toString().trim();
          const json = JSON.parse(output);
          return resolve(json);
        } catch (e) {
          console.error("❌ AI OUTPUT PARSE FAILED:", stdout);
          return resolve(null); // 🔥 NEVER THROW
        }
      }
    );
  });
};
