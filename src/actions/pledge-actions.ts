'use server'

import { sql } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export interface Pledge {
  id: number;
  name: string;
  city: string;
  pledge_type: string;
  comment: string;
  created_at: string;
}

async function ensurePledgesTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS pledges (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        city VARCHAR(100) NOT NULL,
        pledge_type VARCHAR(100) NOT NULL,
        comment TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const countResult = await sql`SELECT COUNT(*) as count FROM pledges`;
    const count = parseInt(countResult[0].count as string, 10);

    if (count === 0) {
      await sql`
        INSERT INTO pledges (name, city, pledge_type, comment) VALUES
        ('Alex Rivera', 'San Jose, CA', 'Recycle Old Electronics', 'Recycled 3 old smartphones and a broken tablet today! Feel so good to clear the clutter responsibly.'),
        ('Liam Chen', 'Vancouver, BC', 'Separate Waste Batteries', 'Started a battery collection bin at our local community center. Over 50 collected already!'),
        ('Sophia Martinez', 'Austin, TX', 'Wipe & Donate Devices', 'Sanitized and donated two older laptops to the local student shelter. Reuse is the best form of recycling.'),
        ('Amara Okafor', 'London, UK', 'Spread E-Waste Awareness', 'Shared an infographic about heavy metals in e-waste on my social feeds. Let''s educate each other!')
      `;
    }
  } catch (error) {
    console.error('Failed to ensure or seed pledges table:', error);
  }
}

export interface PledgeStats {
  total: number;
  recycleCount: number;
  batteriesCount: number;
  awarenessCount: number;
  donateCount: number;
}

export async function getPledgeStats(): Promise<PledgeStats> {
  try {
    await ensurePledgesTable();
    const result = await sql`
      SELECT 
        COUNT(*)::integer as total,
        COUNT(CASE WHEN pledge_type = 'Recycle Old Electronics' THEN 1 END)::integer as recycle_count,
        COUNT(CASE WHEN pledge_type = 'Separate Waste Batteries' THEN 1 END)::integer as batteries_count,
        COUNT(CASE WHEN pledge_type = 'Spread E-Waste Awareness' THEN 1 END)::integer as awareness_count,
        COUNT(CASE WHEN pledge_type = 'Wipe & Donate Devices' THEN 1 END)::integer as donate_count
      FROM pledges
    `;
    const row = result[0];
    return {
      total: (row.total as number) || 0,
      recycleCount: (row.recycle_count as number) || 0,
      batteriesCount: (row.batteries_count as number) || 0,
      awarenessCount: (row.awareness_count as number) || 0,
      donateCount: (row.donate_count as number) || 0
    };
  } catch (error) {
    console.error('Error fetching pledge stats:', error);
    return {
      total: 0,
      recycleCount: 0,
      batteriesCount: 0,
      awarenessCount: 0,
      donateCount: 0
    };
  }
}

export type ActionState = {
  success: boolean;
  error?: string;
  data?: Pledge;
};

export async function createPledgeAction(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
  const name = formData.get('name') as string;
  const city = formData.get('city') as string;
  const pledge_type = formData.get('pledge_type') as string;
  const comment = formData.get('comment') as string;

  if (!name || !city || !pledge_type) {
    return {
      success: false,
      error: 'Name, city, and pledge type are required'
    };
  }

  try {
    await ensurePledgesTable();
    const result = await sql`
      INSERT INTO pledges (name, city, pledge_type, comment)
      VALUES (${name.trim()}, ${city.trim()}, ${pledge_type.trim()}, ${comment ? comment.trim() : ''})
      RETURNING *
    `;
    const row = result[0];
    const newPledge: Pledge = {
      id: row.id as number,
      name: row.name as string,
      city: row.city as string,
      pledge_type: row.pledge_type as string,
      comment: row.comment as string,
      created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at)
    };

    revalidatePath('/');

    return {
      success: true,
      data: newPledge
    };
  } catch (error) {
    console.error('Error creating pledge:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit pledge'
    };
  }
}
