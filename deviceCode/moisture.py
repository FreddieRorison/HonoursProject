from machine import ADC, Pin
from breakout_bme68x import BreakoutBME68X
from pimoroni_i2c import PimoroniI2C
import utime
import network
import urequests

DeviceId = "1f01c828-6dca-6a20-8971-44ea9e4124c7"

url = "http://192.168.0.182:8080/api/SubmitData"

ssid = "BTWholeHome-2NG"
password = "x93kyXYE3T96"

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(ssid, password)

while not wlan.isconnected():
    print("Connecting to WiFi...")
    utime.sleep(1)

print("Connection Obtained")
print(wlan.ifconfig()[0])

def sendData(payload):
    headers = {'Content-type':'application/json'}
    try:
        response = urequests.post(url, json=payload, headers=headers)
        print(response.status_code)
    except Exception as e:
        print("Post Request Failure: ", e)

# Connects to Temp Sensor
PINS_PICO_EXPLORER = {"sda": 20, "scl": 21}
i2c = PimoroniI2C(**PINS_PICO_EXPLORER)
bme = BreakoutBME68X(i2c, address=0x76)

# Connects to soil moisture sensor
soil = ADC(Pin(26))
 
# Configuartion for how long to leave between read cycles
readDelay = 120

burn_in = 240

while burn_in < 240:
    temperature, _, _, _, _, _, _ = bme.read()
    burn_in = burn_in + 1
    print(temperature)
    utime.sleep(1)
 
print("Readings Starting!")

while True:
    moisture = None;
    # Reads Mosture Level
    currentLevel = soil.read_u16();
    if currentLevel >= 10000:
      moisture = 0;
    elif currentLevel < 10000:
        moisture = 100;
    
    # Reads Temperature Level
    temperature, _, _, _, _, _, _ = bme.read()
    
    temperature = round(temperature, 2)
    
    # Read Sensor Data
    print(moisture, " ", temperature)
    
    t = utime.localtime()
    # Create DataPaylod
    load = {"AccessKey": DeviceId, "entries":[{"moisture":moisture,"ph":0, "temperature":temperature, "timestamp":"{:04d}-{:02d}-{:02d}T{:02d}:{:02d}:{:02d}".format(*t[:6])}]}
    #Activate function call to send data to server
    sendData(load)
    
    utime.sleep(readDelay) # set a delay between readings
    
    
