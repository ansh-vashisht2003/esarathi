import cv2
import easyocr
import numpy as np
import sys
import json
import re

image_path = sys.argv[1]

img = cv2.imread(image_path)
if img is None:
    print(json.dumps({"error": "Invalid image"}))
    sys.exit(1)

# -------- GREEN PLATE CHECK --------
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

lower_green = np.array([35, 40, 40])
upper_green = np.array([85, 255, 255])

mask = cv2.inRange(hsv, lower_green, upper_green)
green_ratio = cv2.countNonZero(mask) / (img.shape[0] * img.shape[1])

is_green = green_ratio > 0.05

# -------- OCR --------
reader = easyocr.Reader(['en'], gpu=False)
results = reader.readtext(img)

plate_text = ""
for (_, text, conf) in results:
    if conf > 0.4:
        plate_text += text

plate_text = re.sub(r'[^A-Z0-9]', '', plate_text.upper())

print(json.dumps({
    "isGreen": is_green,
    "detectedPlate": plate_text
}))
