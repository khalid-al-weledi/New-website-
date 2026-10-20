import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'receipts';

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

export async function uploadReceipt(file: File, studentId: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${studentId}-${Date.now()}.${fileExt}`;
  const filePath = `receipts/${fileName}`;

  // رفع الملف إلى Supabase Storage
  const { data, error } = await supabaseAdmin.storage
    .from(bucketName)
    .upload(filePath, file);

  if (error) throw new Error(`فشل رفع الملف: ${error.message}`);

  // إنشاء رابط موقّع (صالح لـ 7 أيام) لمشاهدة الإيصال لاحقاً
  const { data: signedUrlData, error: urlError } = await supabaseAdmin.storage
    .from(bucketName)
    .createSignedUrl(filePath, 60 * 60 * 24 * 7);

  if (urlError) throw new Error(`فشل إنشاء رابط الملف: ${urlError.message}`);

  return signedUrlData.signedUrl;
}