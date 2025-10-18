import { client } from "@/configs/NilPostgresConfig";

export async function POST(request: Request) {
  const { eventName, bannerUrl, location, link, eventDate, eventTime, email } = await request.json();
  await client.connect();

  const result = await client.query(`
    INSERT INTO events VALUES(
    DEFAULT,
    '${eventName}',
    '${location}',
    '${link}',
    '${bannerUrl}',
    '${eventDate}',
    '${eventTime}',
    '${email}',
    DEFAULT
    )
    `)
  await client.end();

  return Response.json(result);
}

export async function GET(request: Request) {
  await client.connect();

  const result = await client.query(`
   SELECT events.*, users.name AS username
FROM events
INNER JOIN users
ON events.createdby = users.email
ORDER BY id DESC;

    `)
  await client.end();

  return Response.json(result.rows);
}