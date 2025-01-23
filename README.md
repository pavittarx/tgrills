# tgrills
This project is still a work in progress hobby project. 

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