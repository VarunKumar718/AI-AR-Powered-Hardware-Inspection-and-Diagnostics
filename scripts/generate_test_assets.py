"""Generates synthetic high-resolution test PCB images in test-assets/."""

from pathlib import Path
import numpy as np
import cv2

ROOT = Path(__file__).resolve().parent.parent
TEST_ASSETS = ROOT / "test-assets"
TEST_ASSETS.mkdir(parents=True, exist_ok=True)
OUT_DIR = TEST_ASSETS / "out"
OUT_DIR.mkdir(parents=True, exist_ok=True)


def create_arduino_pcb():
    w, h = 1200, 800
    # Green solder mask
    img = np.full((h, w, 3), (25, 80, 20), dtype=np.uint8)

    # Copper traces
    for y in range(100, 700, 40):
        cv2.line(img, (150, y), (1050, y), (35, 120, 30), 2)
    for x in range(200, 1000, 60):
        cv2.line(img, (x, 100), (x, 700), (35, 120, 30), 2)

    # ATmega328P DIP-28 MCU Body
    cv2.rectangle(img, (550, 480), (820, 560), (20, 20, 20), -1)
    cv2.rectangle(img, (550, 480), (820, 560), (60, 60, 60), 2)
    cv2.putText(img, "ATMEGA328P-PU", (570, 525), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (200, 200, 200), 2)

    # Silver DIP Pins
    for px in range(560, 810, 18):
        cv2.rectangle(img, (px, 470), (px + 8, 480), (210, 210, 215), -1)
        cv2.rectangle(img, (px, 560), (px + 8, 570), (210, 210, 215), -1)

    # USB Connector (J1)
    cv2.rectangle(img, (60, 100), (240, 240), (180, 185, 190), -1)
    cv2.rectangle(img, (60, 100), (240, 240), (100, 105, 110), 3)
    cv2.putText(img, "USB-B", (90, 180), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (50, 50, 50), 2)

    # DC Barrel Jack (J2)
    cv2.rectangle(img, (50, 520), (240, 720), (25, 25, 28), -1)
    cv2.circle(img, (145, 620), 28, (10, 10, 10), -1)

    # ATmega16U2 QFN IC (U2)
    cv2.rectangle(img, (320, 180), (410, 270), (30, 30, 30), -1)
    cv2.putText(img, "16U2", (335, 230), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (180, 180, 180), 2)

    # 16MHz Crystal (Y1)
    cv2.rectangle(img, (580, 600), (660, 635), (200, 205, 210), -1)
    cv2.putText(img, "16.000", (590, 624), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (40, 40, 40), 1)

    # NCP1117 Voltage Regulator (U1)
    cv2.rectangle(img, (330, 380), (410, 440), (25, 25, 25), -1)
    cv2.rectangle(img, (340, 370), (400, 380), (190, 195, 200), -1)

    # Electrolytic Capacitors (C1, C2)
    cv2.circle(img, (260, 390), 28, (210, 215, 220), -1)
    cv2.circle(img, (260, 610), 28, (210, 215, 220), -1)

    # Resistors & Ceramic Caps
    for rx in range(450, 540, 25):
        cv2.rectangle(img, (rx, 220), (rx + 16, 232), (30, 30, 150), -1)
        cv2.rectangle(img, (rx, 260), (rx + 16, 272), (180, 120, 30), -1)

    # Digital Header strip
    cv2.rectangle(img, (480, 60), (980, 95), (20, 20, 20), -1)
    for hx in range(495, 965, 26):
        cv2.circle(img, (hx, 77), 5, (230, 230, 100), -1)

    path = TEST_ASSETS / "pcb_arduino_uno.png"
    cv2.imwrite(str(path), img)
    print(f" -> Wrote {path}")


def create_esp32_pcb():
    w, h = 1000, 800
    # Matte black solder mask
    img = np.full((h, w, 3), (30, 30, 32), dtype=np.uint8)

    # ESP-WROOM-32 Metal RF Can
    cv2.rectangle(img, (350, 100), (650, 420), (190, 195, 200), -1)
    cv2.rectangle(img, (350, 100), (650, 420), (130, 135, 140), 3)
    cv2.putText(img, "ESP-WROOM-32", (380, 260), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (50, 50, 50), 2)
    # PCB Antenna meander
    cv2.rectangle(img, (380, 110), (620, 170), (180, 140, 30), -1)

    # CP2102 USB Bridge IC
    cv2.rectangle(img, (440, 520), (520, 600), (20, 20, 20), -1)
    cv2.putText(img, "CP2102", (445, 565), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (200, 200, 200), 1)

    # Micro USB Port
    cv2.rectangle(img, (430, 710), (530, 790), (200, 205, 210), -1)

    # Dual 19-Pin Headers Left & Right
    cv2.rectangle(img, (80, 120), (130, 720), (15, 15, 15), -1)
    cv2.rectangle(img, (870, 120), (920, 720), (15, 15, 15), -1)
    for py in range(140, 700, 30):
        cv2.circle(img, (105, py), 6, (220, 210, 80), -1)
        cv2.circle(img, (895, py), 6, (220, 210, 80), -1)

    path = TEST_ASSETS / "pcb_esp32_devkit.png"
    cv2.imwrite(str(path), img)
    print(f" -> Wrote {path}")


def create_dense_smt_pcb():
    w, h = 1000, 800
    # Royal blue solder mask
    img = np.full((h, w, 3), (120, 40, 20), dtype=np.uint8)

    # Quad Flat Package QFP-64 IC
    cv2.rectangle(img, (380, 280), (620, 520), (22, 22, 22), -1)
    cv2.putText(img, "ARM CORTEX-M4", (405, 410), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (220, 220, 220), 2)
    # QFP Gullwing leads
    for lx in range(400, 600, 12):
        cv2.line(img, (lx, 260), (lx, 280), (215, 215, 220), 3)
        cv2.line(img, (lx, 520), (lx, 540), (215, 215, 220), 3)
    for ly in range(300, 500, 12):
        cv2.line(img, (360, ly), (380, ly), (215, 215, 220), 3)
        cv2.line(img, (620, ly), (640, ly), (215, 215, 220), 3)

    # Dense Decoupling Capacitor Arrays (0402/0603)
    for cy in range(200, 620, 24):
        cv2.rectangle(img, (320, cy), (336, cy + 12), (180, 130, 40), -1)
        cv2.rectangle(img, (670, cy), (686, cy + 12), (180, 130, 40), -1)

    path = TEST_ASSETS / "pcb_dense_smt.png"
    cv2.imwrite(str(path), img)
    print(f" -> Wrote {path}")


if __name__ == "__main__":
    print("Generating synthetic test PCB assets...")
    create_arduino_pcb()
    create_esp32_pcb()
    create_dense_smt_pcb()
    print("Done!")
