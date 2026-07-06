// migrate.js — run once with `node migrate.js`
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient(
  'https://tjrpgqlnmqcyzxuusyki.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqcnBncWxubXFjeXp4dXVzeWtpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzA4Nzc1MSwiZXhwIjoyMDk4NjYzNzUxfQ.4ZO1nkQ2nFvsli0h_NnTQHJv8SUNr7nCE_A8esgsBNU' // from Supabase dashboard > Settings > API
);

const listings = JSON.parse(fs.readFileSync('./listings.json', 'utf8'));

const formatted = listings.map(item => ({
  id: parseInt(item.id),
  name: item.name,
  brand: item.brand,
  price: parseFloat(item.price),
  image: item.image,
  stock: item.stock ? parseInt(item.stock) : 0
}));

const { data, error } = await supabase.from('listings').insert(formatted);

if (error) console.error('Migration failed:', error);
else console.log('Migrated', formatted.length, 'listings');