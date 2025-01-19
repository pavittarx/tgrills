import { google, } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];;

const auth = new google.auth.GoogleAuth({ 
  scopes: SCOPES,
});

const client = auth.fromJSON(JSON.parse(process.env.G_CREDS!));

// @ts-expect-error - a valid property, and works but ts throws error
const sheets = google.sheets({
  auth: client,
  version: "v4",
});

export async function GET() {
  const prodRes = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: "products!A:E",
  });

  const catRes = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: "categories!A:D",
  });

  const bannerRes = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: "banners!A:D",
  });
  

  const products = prodRes.data.values;
  const categories = catRes.data.values;
  const banners = bannerRes.data.values;

  return Response.json({
    products: products,
    categories: categories,
    banners: banners,
  });
}