#ifndef CONFIG_H
#define CONFIG_H

// #define WIFI_SSID "SEM-SOFT"
// #define WIFI_PSK "janjinshugamyum"

#define WIFI_SSID "SEM-SOFTWARE-NEW"
#define WIFI_PSK "janjinshugam"

#define NATS_NAME "qparking:device"
#define NATS_PSWD "Cd4l1vJC4^2G3Cjh4$mVm"
#define NATS_TOPIC "qparking"

#define NTP_SERVER "pool.ntp.org"           // just a ntp server
#define GMT_OFFSET 8                        // Ulaanbaatar timezone
#define GMT_OFFSET_SEC GMT_OFFSET * 60 * 60 // Ulaanbaatar timezone
#define DAYLIGHT_OFFSET 0                   // daylight offset is not used in Mongolia

uint8_t device_EUI[16];               //64 bit globally unique Extended Unique Identifier (EUI-64) assigned by the manufacturer, or the owner, of the end-device 

#endif
