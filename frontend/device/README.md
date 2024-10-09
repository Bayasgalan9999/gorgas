# YOUR_PROJECT_NORMAL_NAME Device Protocol

### Implemented features:
- [ ] ["ESP32 -> Arduino" communication](#ESP32-to-Arduino-communication)
- [ ] ["ESP32 -> Backend" communication](#ESP32-to-Backend-communication)

----------------------------------------------

## ESP32 to Arduino communication


### Packet structure

1. Communication convention: 115200 Bps, even parity, 8 data bits, 1 stop bit
2. Command data structure:
    * Synchronization header: 2 Byte. All commands and responses are synchronized with 0xAB and 0xCD headers.
    * Command code: 1 Byte.
    * Data length: 1 Byte.
    * Data: According to the different commands, the length of the data is variable.
    * Cyclic Redundancy Check: 2 Byte. The CRC check is used to check the CRC value of the command, address, and data byte. The low byte of the CRC is sent first, followed by the high byte.
    * End of Packet: 2 Byte. Tail bytes are 0xDC, 0xBA.


Packet example:

```ts
[
  0xAB, 0xCD,   // head
  0x50,         // command code
  0x09,         // command length
  0x07, 0xD0, 0x01, 0x5F, 0x90, 0x00, 0x00, 0x00, 0x01, // command data
  0x66, 0x28,   // CRC16 bytes in reverse order
  0xDC, 0xBA,   // tail
]
```

## Commands dialog

|             Command                 |    Command code     |          Data          | Command direction | Usecase | Resp.            |
| :---------------------------------: | :-----------------: | ---------------------- | :---------------: |---------| :--------------: |
| Send<br>Parking<br>Status   | `0x69`<br>[dec: `112`]<br>(DL: `0x04`) | Slot Number (1 byte),<br>Parking Status (1 byte),<br>Price (2 bytes) | Arduino -> ESP32 | Device will send status<br>changes for each parking<br>slot for any events (device<br>lock, device unlock, etc.)<br>or every 2 minutes | `0x70` |
| Resp<br>Online<br>Status    | `0x70`<br>[dec: `124`]<br>(DL: `0x01`) | Online Status (1 byte) | ESP32 -> Mega | Response online status from ESP32 | `-` |
| Set Price            | `0x71`<br>[dec: `113`]<br>(DL: `0x03`) | Slot Number (1 byte),<br>Price (2 bytes) | ESP32 -> Arduino | Overwrite price on Arduino | `0x69` |
| Сhange<br>Parking<br>Status | `0x72`<br>[dec: `116`]<br>(DL: `0x02`) | Slot Number (1 byte),<br>Parking Status (1 byte) | ESP32 -> Arduino | Open or close parking slot | `0x69` |
| Send<br>Trans Info | `0x73`<br>[dec: `114`]<br>(DL: `0x0A`) | Slot Number (1 byte),<br>Card UID (4 bytes),<br>Price (2 bytes),<br>Amount (3 bytes) | Arduino -> ESP32 | Send transaction info to the ESP32 | `0x74` |
| Accepted<br>Trans Info   | `0x74`<br>[dec: `115`]<br>(DL: `0x02`) | Slot Number (1 byte),<br>Payment Status (1 byte) | ESP32 -> Arduino | Transaction confirmation | `-` |

--------------

<br><br>

## Packet data description

<br>

- **Online Status** - if Esp32 succeed to connect to the internet or not:
  - 0x00 - ONLINE
  - 0x01 - CONNECTING
  - 0x0F - OFFLINE
  - 0xEE - ERROR
<br><br>

- **Slot Number**  - Local unique device number (1 bytes).
- **Parking Status** - Vehicle movement in the parking slot (1 byte):
  - 0x00: UNLOCKED   - no vehicle
  - 0x01: LOCKED     - vehicle is parked
  - 0x11: LOCKING    - vehicle is parking (for closing parking slot). Waiting for device to be locked
  - 0x10: UNLOCKING  - vehicle is about to leave (for opening parking slot)
  - 0xEE: ERROR      - something went wrong
<br><br>

- **Card UID**     - EPass card UID number (4 byte). If the user pays with QPay, fill it with 0xFFFFFFFF.
- **Price**        - Hourly payment of the parking slot. Local currency (tugrik for Mongolia).
- **Parking Time** - The time since the vehicle has been parked. By minute.
- **Amount** - The total amount since the car has been parked. Local currency (tugrik for Mongolia).
- **Payment Status**      - Payment status (1 byte):
  - 0xAA: SUCCESS             - Payment has been successfully made.
  - 0xE0: NOT_REGISTERED      - User validated card is not registered.
  - 0xE1: CARD_BALANCE_ERROR  - User card balance is insufficient.
  - 0xE2: SERVER_SIDE_ERROR   - Payment server crash error.
  - 0xFF: FAILED              - Payment failed.
<br><br>
--------------
--------------

## ESP32 to Backend communication

Because we are using NATS (tcp/ip connection) for communication, we can use JSON formatted data. ESP32 should check CRC16 values of packet and send data to server without CRC16 bytes, head and tail.

Packet example:

```java
{
  "someJson": 1488
}
```

--------------

<br><br>

## Packet data description

- **time** - Real time that can be obtained like so:
    ```c++
      //do config in setup() and every 24 hours (or less frequently) just in case
      configTime(GMT_OFFSET_SEC, DAYLIGHT_OFFSET, NTP_SERVER);

      ...

      //call it whenever you need
      int64_t getTime() {
        struct timeval tv;
        if (gettimeofday(&tv, NULL))
          return 0;
        return (tv.tv_sec * 1000LL + (tv.tv_usec / 1000LL));
      }
    ```
