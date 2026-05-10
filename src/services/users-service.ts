import { db } from "../index";
import { users, sessions } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const registerUser = async (data: any) => {
  const { name, email, password } = data;

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    throw new Error("Email Sudah terdaftar");
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
  });

  return { data: "OK" };
};

export const loginUser = async (data: any) => {
  const { email, password } = data;

  // 1. Cari user berdasarkan email
  const userList = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const user = userList[0];

  // 2. Jika tidak ditemukan atau password salah
  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw new Error("Email Atau password salah");
  }

  // 3. Generate UUID token
  const token = crypto.randomUUID();

  // 4. Simpan ke tabel sessions
  await db.insert(sessions).values({
    token,
    userId: user.id,
  });

  // 5. Kembalikan token
  return { data: token };
};
