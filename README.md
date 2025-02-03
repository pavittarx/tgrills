# tgrills
This project is still a work in progress hobby project. 

### Business Use Case
Harris is a food vendor thats runs a local food stall nearby. 
He wants to be able to take orders online, due to changing market conditions and attract more customers.
The locality he operates in is not very tech savy and Harris wants to keep his costs low. 
He already takes orders on calls, and Whatsapp as well. However, now also wants to move his products online. 

#### Solution
Allow users to browse the menu, create orders, and store the user & order details. 
Once this is done, fulfil orders via Call or Whatsapp. 

### Technologies: 
- Typescript, 
- Next.js (app router), zustand.  
- Google Sheets API 
- Supabase

## Run / Develop

```js
    pnpm install // install necessary packages and dependencies
    pnpm dev // runs development server

    pnpm build // build the project
```

## ENV Variables

```
  SHEET_ID=***
  G_CREDS=*** 
```

`SHEET_ID` - google sheet id 
`G_CREDS` - stringified json service account key.

You can get Service account key from Google Cloud Project, the Sheets API must be enabled for the key to work. 