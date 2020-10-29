# Twitch-API <img src="https://img.shields.io/static/v1?label=code&message=Node.js&color=green" alt="">

## 기능
- [m3u8](#hls)

### HLS
### Requests
```http
GET /hls/<Channel_ID>
```
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `Channel_ID` | `string` | 트위치 채널 ID |

### Responses
JSON list 타입으로 화질에 따라 인덱스 처음에서 끝으로 정렬됩니다.<br>
ex) [0] = 1080p60, [1] = 720p60 ....
```javascript
[
  "http://video-weaver.....m3u8",
  "http://video-weaver.....m3u8",
  "http://video-weaver.....m3u8"
]
```

### Status Codes
| Status Code | Description |
| :--- | :--- |
| 200 | m3u8 데이터 존재 |
| 404 | m3u8 데이터 없음 |
| 500 | 트위치 API와 통신 오류 |

### 문의
[이메일](mailto:kwabang2827@gmail.com) 또는 [디스코드](https://kwabang.codes/join)로 문의를 넣을 수 있습니다.

### 책임
프로그램을 이용하여 생기는 문제의 책임은 **사용자**에게 있습니다.
