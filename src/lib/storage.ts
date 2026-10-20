import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucket      = process.env.SUPABASE_STORAGE_BUCKET || 'receipts';

export const storageConfigured = Boolean(supabaseUrl && serviceKey);

if (!storageConfigured && process.env.NODE_ENV !== 'test') {
  console.warn('[storage] Supabase Storage is NOT configured. Uploads will fail.');
}

function adminClient() {
  if (!storageConfigured) {
    throw new Error('خدمة رفع الملفات غير مُفعّلة بعد. تواصل مع الإدارة.');
  }
  return createClient(supabaseUrl!, serviceKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

const MAX_SIZE_MB = 10;
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

export type UploadResult = { path: string; signedUrl: string };

export async function uploadReceipt(file: File, studentId: string): Promise<UploadResult> {
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(`حجم الملف يتجاوز ${MAX_SIZE_MB} ميجابايت`);
  }
  if (!ALLOWED_MIME.includes(file.type)) {
    throw new Error('نوع الملف غير مسموح (JPG / PNG / WEBP / PDF فقط)');
  }

  const ext = (file.name.split('.').pop() || 'bin').toLowerCase().slice(0, 8);
  const key = `receipts/${studentId}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const supabase = adminClient();
  const { error } = await supabase.storage
    .from(bucket)
    .upload(key, file, { contentType: file.type, upsert: false });

  if (error) throw new Error(`فشل الرفع: ${error.message}`);

  const { data, error: signErr } = await supabase.storage
    .from(bucket)
    .createSignedUrl(key, 60 * 60 * 24 * 7); // صلاحية 7 أيام

  if (signErr) throw new Error(`فشل إنشاء رابط الوصول: ${signErr.message}`);

  return { path: key, signedUrl: data.signedUrl };
}

export async function deleteReceipt(path: string): Promise<void> {
  const supabase = adminClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw new Error(`فشل الحذف: ${error.message}`);
}