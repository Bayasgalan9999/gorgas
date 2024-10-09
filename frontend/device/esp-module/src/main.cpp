#include <Arduino.h>
#include <WiFi.h>
#include "ArduinoNATS.h"
#include "config.h"
#include "time.h"
// #include <SSLClient.h>

WiFiClient client;

NATS nats(
	&client,
	"nats.clix.mn", NATS_DEFAULT_PORT, false, NATS_NAME, NATS_PSWD
);

void connect_wifi() {
  Serial.print("Connecting to ");
  Serial.println(WIFI_SSID);
	WiFi.mode(WIFI_STA);
	WiFi.begin(WIFI_SSID, WIFI_PSK);
	while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
		yield();
	}
  Serial.println("");
  Serial.println("WiFi connected.");
}

void nats_echo_handler(NATS::msg msg) {
	nats.publish(msg.reply, msg.data);
  Serial.print(msg.data);
}

void nats_on_connect() {
  esp_chip_info_t chip_info;
  esp_chip_info(&chip_info);
  
  Serial.println("Hardware info");
  Serial.printf("%d cores Wifi %s%s\n", chip_info.cores, (chip_info.features & CHIP_FEATURE_BT) ? "/BT" : "",
  (chip_info.features & CHIP_FEATURE_BLE) ? "/BLE" : "");
  Serial.printf("Silicon revision: %d\n", chip_info.revision);
  Serial.printf("%dMB %s flash\n", spi_flash_get_chip_size()/(1024*1024),
  (chip_info.features & CHIP_FEATURE_EMB_FLASH) ? "embeded" : "external");
  
  //get chip id
  String chipId = String((uint32_t)ESP.getEfuseMac(), HEX);
  chipId.toUpperCase();
  
  Serial.printf("Chip id: %s\n", chipId.c_str());
  Serial.println((String)"Mac address is " + WiFi.macAddress());
  
  String s_topic = ((String)NATS_TOPIC + "." + (String)chipId + "-" + WiFi.macAddress());
  char* topic = (char*)malloc(s_topic.length() * sizeof(char));
  s_topic.toCharArray(topic, s_topic.length());
    
	nats.subscribe(topic, nats_echo_handler);
}

void printLocalTime(){
  struct tm timeinfo;
  if(!getLocalTime(&timeinfo)){
    Serial.println("Failed to obtain time");
    return;
  }
  
  time_t mms = mktime(&timeinfo);
  Serial.println(mms);
  Serial.println(&timeinfo, "%A, %B %d %Y %H:%M:%S");
  Serial.print("Day of week: ");
  Serial.println(&timeinfo, "%A");
  Serial.print("Month: ");
  Serial.println(&timeinfo, "%B");
  Serial.print("Day of Month: ");
  Serial.println(&timeinfo, "%d");
  Serial.print("Year: ");
  Serial.println(&timeinfo, "%Y");
  Serial.print("Hour: ");
  Serial.println(&timeinfo, "%H");
  Serial.print("Hour (12 hour format): ");
  Serial.println(&timeinfo, "%I");
  Serial.print("Minute: ");
  Serial.println(&timeinfo, "%M");
  Serial.print("Second: ");
  Serial.println(&timeinfo, "%S");

  Serial.println("Time variables");
  char timeHour[3];
  strftime(timeHour,3, "%H", &timeinfo);
  Serial.println(timeHour);
  char timeWeekDay[10];
  strftime(timeWeekDay,10, "%A", &timeinfo);
  Serial.println(timeWeekDay);
  Serial.println();
}

void setup() {
  Serial.begin(115200);
	connect_wifi();

	nats.on_connect = nats_on_connect;
	nats.connect();

  configTime(GMT_OFFSET_SEC, DAYLIGHT_OFFSET, NTP_SERVER);
  printLocalTime();
}

int loopCnt = 6000;

void loop() {
  ++loopCnt;

  if (loopCnt % 10600 == 0) {
    const uint8_t payload[] = {0x92, 0x01, 0x3B, 0xA3, 0x99, 0x8A, 0x00, 0x00, 0x00, 0x01, 0x07, 0xD0, 0x00, 0x00, 0x14, 0x00, 0x00, 0x01, 0x85, 0x15, 0x34, 0xF3, 0xF0};
    String strPayload = "";
    for (int i=0; i<23; ++i) {
      strPayload += char(payload[i]);
    }
    nats.publish("qparking.F255B594-94:B5:55:F2:6A:7C", strPayload);
  }
	if (WiFi.status() != WL_CONNECTED) connect_wifi();
  else {
    nats.process();
    yield();
  }
}