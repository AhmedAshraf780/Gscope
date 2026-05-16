---

# Default module

Base URLs:

# Authentication

# Auth

## POST Signin

POST /api/v1/auth/signin

> Body Parameters

```json
{
    "email": "amedashraf780@gmail.com",
    "password": "ahmedash"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| yes |none|

> Response Examples

> 200 Response

```json
{"message":"Gym found, login successful","gym_id":1,"name":"Arena Gym","ok":true}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Signup

POST /api/v1/auth/signup

> Body Parameters

```json
{
    "name": "White Knight",
    "email": "xLokii7@outlook.com",
    "password": "lokiashraf",
    "phone": "01115871696"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| yes |none|

> Response Examples

> 200 Response

```json
{"ok":true,"message":"OTP sent to user's email","session":"d2d3c27d-9519-4649-bddb-04b630d8c3ec"}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST ValidateOtp

POST /api/v1/auth/validateotp

> Body Parameters

```json
{
    "otp": "599189",
    "session": "81060ee4-930e-48ab-b079-f3fb72e4efbd"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| yes |none|

> Response Examples

> 200 Response

```json
{"ok":true,"message":"OTP is correct","forgotPassword":false}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST restorepassword

POST /api/v1/auth/restorepassword

> Body Parameters

```json
{
    "password": "i love coding",
    "confirmPassword": "i love coding",
    "session": "64c6704c-4a5e-4319-8fd3-94d844214ac1"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| yes |none|

> Response Examples

> 200 Response

```json
{"ok":true,"message":"Password changed"}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST forgotpassword

POST /api/v1/auth/forgotpassword

> Body Parameters

```json
{
    "email": "xLokii7@outlook.com"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| yes |none|

> Response Examples

> 200 Response

```json
{"ok":true,"message":"OTP sent to user's email","session":"64c6704c-4a5e-4319-8fd3-94d844214ac1"}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Members

## POST Add member

POST /api/v1/members

> Body Parameters

```json
{
  "name": "John Doe",
  "phone": "0111222333",
  "months": 12,
  "price": 1200,
  "notes": "Prefers evening sessions",
  "offer_id": 1
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| yes |none|

> Response Examples

> 200 Response

```json
{"message":"Member added successfully"}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET list all members

GET /api/v1/members

> Response Examples

> 200 Response

```json
[{"gym_id":1,"id":2,"name":"ahmed khalx","phone":"01115871696","months":3,"price":600,"start_date":"2026-5-2","end_date":"2026-8-2","notes":""},{"gym_id":1,"id":3,"name":"ebrahem mohamed","phone":"01115871696","months":3,"price":600,"start_date":"2026-5-2","end_date":"2026-8-2","notes":""},{"gym_id":1,"id":4,"name":"hossam el nemr","phone":"01115871696","months":3,"price":600,"start_date":"2026-5-2","end_date":"2026-8-2","notes":"no notes"},{"gym_id":1,"id":5,"name":"ahmed fucking","phone":"01115871696","months":3,"price":600,"start_date":"2026-05-03","end_date":"2026-08-03","notes":""},{"gym_id":1,"id":6,"name":"bassam","phone":"0111111111","months":3,"price":500,"start_date":"2026-05-05","end_date":"2026-08-05","notes":""},{"gym_id":1,"id":7,"name":"John Doe","phone":"0111222333","months":12,"price":1200,"start_date":"2026-05-15","end_date":"2027-05-15","notes":"Prefers evening sessions"}]
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET filter members by name

GET /api/v1/members/filter

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|name|query|string| no |name|

> Response Examples

> 200 Response

```json
{"gym_id":1,"id":6,"name":"bassam","phone":"0111111111","months":3,"price":500,"start_date":"2026-05-05","end_date":"2026-08-05","notes":""}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Get member by ID

GET /api/v1/members/3

> Response Examples

> 200 Response

```json
{"member":{"gym_id":1,"id":3,"name":"ebrahem mohamed","phone":"01115871696","months":3,"price":600,"start_date":"2026-5-2","end_date":"2026-8-2","notes":""}}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## PUT Update member by ID

PUT /api/v1/members/3

> Body Parameters

```json
{
  "months": 6,
  "price": 600
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| yes |none|

> Response Examples

> 200 Response

```json
{"message":"Member updated successfully"}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## DELETE Delete member by ID

DELETE /api/v1/members/3

> Response Examples

> 200 Response

```json
{"message":"Member deleted successfully"}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Sessions

## GET List all sessions 

GET /api/v1/sessions

> Response Examples

> 200 Response

```json
[{"gym_id":1,"id":1,"session_date":"2026-05-03","session_type":"gym","price":30,"member_name":"اشرف"},{"gym_id":1,"id":2,"session_date":"2026-05-03","session_type":"gym","price":30,"member_name":"ahmed ashraf"}]
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Add session

POST /api/v1/sessions

> Body Parameters

```json
{
  "session_date": "2026-05-15",
  "session_type": "gym",
  "price": 50,
  "member_name": "John Doe"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| yes |none|

> Response Examples

> 200 Response

```json
{"message":"Session added successfully"}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Logs

## GET Get all logs 

GET /api/v1/logs

> Response Examples

> 200 Response

```json
[{"id":3,"member_id":2,"check_in_time":"2026-05-15T12:51:11.510Z","gym_id":1,"name":"ahmed khalx","phone":"01115871696"},{"id":4,"member_id":5,"check_in_time":"2026-05-15T12:51:15.906Z","gym_id":1,"name":"ahmed fucking","phone":"01115871696"}]
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Get all logs of specific ID

GET /api/v1/logs/2

> Response Examples

> 200 Response

```json
[{"id":3,"member_id":2,"check_in_time":"2026-05-15T12:51:11.510Z","gym_id":1}]
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Create log for Member

POST /api/v1/logs/2

> Response Examples

> 200 Response

```json
{"message":"Log created successfully"}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Get last attendance for a Member

GET /api/v1/logs/2/last-attendance

> Response Examples

> 200 Response

```json
{"last_attendance":"2026-05-15T15:33:54.999Z","duration_in_days":0}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Offer

## GET Get all offers gym have

GET /api/v1/offers

> Response Examples

> 200 Response

```json
[{"gym_id":1,"id":1,"offer_end_date":"2026-05-30","name":"3ard elsohab","price":600,"months":3,"member_count":4,"created_at":"2026-05-02"},{"gym_id":1,"id":2,"offer_end_date":"2026-05-14","name":"los_gala","price":500,"months":3,"member_count":1,"created_at":"2026-05-05"}]
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Create an offer

POST /api/v1/offers

> Body Parameters

```json
{
  "name": "Summer Offer",
  "months": 6,
  "price": 500,
  "end_date": "2026-12-31"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| yes |none|

> Response Examples

> 200 Response

```json
{"message":"Offer added successfully","offerId":3}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Get available offers 

GET /api/v1/offers/available

> Response Examples

> 200 Response

```json
[{"gym_id":1,"id":1,"offer_end_date":"2026-05-30","name":"3ard elsohab","price":600,"months":3,"member_count":4,"created_at":"2026-05-02"},{"gym_id":1,"id":3,"offer_end_date":"2026-12-31","name":"Summer Offer","price":500,"months":6,"member_count":0,"created_at":"2026-05-15"}]
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Expenses

## GET Get all expenses of the gym

GET /api/v1/expenses

> Response Examples

> 200 Response

```json
[{"id":2,"title":"كهرباء","amount":1000,"date":"2026-05-03","category":"كهرباء","notes":"","created_at":"2026-05-03 01:28:42"}]
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Create expense 

POST /api/v1/expenses

> Body Parameters

```json
{
  "title": "Electricity bill",
  "amount": 150.5,
  "date": "2026-05-15",
  "category": "utilities",
  "notes": "Monthly electricity"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| yes |none|

> Response Examples

> 200 Response

```json
3
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Get expense by ID

GET /api/v1/expenses/3

> Response Examples

> 200 Response

```json
{"id":3,"title":"Electricity bill","amount":150.5,"date":"2026-05-15","category":"utilities","notes":"Monthly electricity","created_at":"2026-05-15 15:38:40"}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## PUT Update expense by ID

PUT /api/v1/expenses/3

> Body Parameters

```json
{
  "title": "Updated bill",
  "amount": 200,
  "date": "2026-05-15",
  "category": "string",
  "notes": "string"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| yes |none|

> Response Examples

> 200 Response

```json
{"id":3,"title":"Electricity bill","amount":150.5,"date":"2026-05-15","category":"utilities","notes":"Monthly electricity","created_at":"2026-05-15 15:38:40"}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## DELETE Delete expense by ID

DELETE /api/v1/expenses/3

> Body Parameters

```json
{}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| yes |none|

> Response Examples

> 200 Response

```json
{"id":3,"title":"Electricity bill","amount":150.5,"date":"2026-05-15","category":"utilities","notes":"Monthly electricity","created_at":"2026-05-15 15:38:40"}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Data Schema
