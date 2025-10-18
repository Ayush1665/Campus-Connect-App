import { client } from "@/configs/NilPostgresConfig";

export async function GET(request: Response) {
  await client.connect();
  const result = await client.query(`SELECT * from clubs ORDER BY name asc`)
  await client.end();

  return Response.json(result.rows)
}

export async function POST(request: Response) {
  const {imageUrl,clubName, about,email} = await request.json();
  await client.connect();
  const result = await client.query(`INSERT INTO CLUBS VALUES(DEFAULT,'${clubName}','${imageUrl}','${about}',DEFAULT)
    `)
  await client.end();

  return Response.json(result.rows)
}
