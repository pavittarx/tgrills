import { google, } from "googleapis";
import type {Banner} from "@/app/_store/banners";

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

type BannerType = "top" | "middle" | "bottom";


const transformProducts = (products: Array<string[]>, categories: Array<string | string[]>) => {
  
  const _products = products.map((product: Array<string>, index: number) => {
    return {
      id: index,
      name: product[0],
      price: product[1],
      discount: product[2],
      image: product[3],
      description: product[4],
      categories: categories
        .filter((cat) => cat[1].includes(product[0]))
        .map((cat) => cat[0]),
    };
  });

  // Remove the header row
  _products.shift();
  return _products;
}

const transformCategories = (categories: Array<string | string[]>) => {
   const _categories = categories.map((cat, index) => ({
    id: index,
    name: cat[0],
  }));

  _categories.shift();
  return _categories;
}

const transformBanners = (banners: Array<string[]>) => {
  banners.shift();
  return banners.reduce(
    (acc: Banner, curr: Array<string>) => {
      if (!curr.length) {
        return acc;
      }

      const pos = curr.shift() as BannerType;
      acc[pos] = curr;

      return acc;
    },
    {
      top: [],
      middle: [],
      bottom: [],
    }
  );
}

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
  

  const products = transformProducts(prodRes.data.values as string[][], catRes.data.values as string[][]);
  const categories = transformCategories(catRes.data.values as string[][]);
  const banners = transformBanners(bannerRes.data.values as string[][]);

  return Response.json({
    products: products,
    categories: categories,
    banners: banners,
  });
}