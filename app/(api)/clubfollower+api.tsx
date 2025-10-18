import { client } from "@/configs/NilPostgresConfig";

export async function POST(request: Request) {
  const { clubId, u_email } = await request.json();
  await client.connect();
  const result = await client.query(`INSERT INTO clubfollowers VALUES(DEFAULT,'${clubId}','${u_email}')`)
  await client.end();

  return Response.json(result) 
}

export async function GET(request: Request) {
  const u_email = new URL(request.url).searchParams.get('u_email');
  await client.connect();
  const result = await client.query(`select clubs.name,clubfollowers.* from clubs
inner join clubfollowers
on clubs.id=clubfollowers.club_id
where clubfollowers.u_email='${u_email}'`);
  await client.end();

  return Response.json(result.rows)
}

export async function DELETE(request: Request) {
  const u_email = new URL(request.url).searchParams.get('u_email');
  const club_id = new URL(request.url).searchParams.get('club_id');

  await client.connect();
  const result = await client.query(
    `DELETE FROM clubfollowers WHERE club_id ='${club_id}' AND u_email='${u_email}'`
  );

  await client.end();
  return Response.json(result.rows); 
}