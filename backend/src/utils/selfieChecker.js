import cron from "node-cron";
import Driver from "../models/Driver.js";

cron.schedule("0 0 * * *", async () => {
  console.log("🕒 Checking driver selfies...");

  const drivers = await Driver.find();

  for (let driver of drivers) {
    if (!driver.lastSelfieDate) {
      driver.missedSelfieCount += 1;
    } else {
      const diffDays =
        (Date.now() - new Date(driver.lastSelfieDate)) /
        (1000 * 60 * 60 * 24);

      if (diffDays >= 1) {
        driver.missedSelfieCount += 1;
      }
    }

    // ❌ If missed selfie 2 days → delete driver
    if (driver.missedSelfieCount >= 2) {
      console.log("❌ Deleting driver:", driver.email);
      await Driver.findByIdAndDelete(driver._id);
      continue;
    }

    await driver.save();
  }
});
