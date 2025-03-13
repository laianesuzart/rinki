import type { PageServerLoad } from "./$types";
import { adminDB } from "$lib/server/admin";
import { error, redirect } from "@sveltejs/kit";

export const load = (async ({ locals, params }) => {
  const uid = locals.userID;

  if (!uid) {
    throw redirect(301, "/login");
  }

  const userDoc = await adminDB.collection("users").doc(uid).get();
  const { username } = userDoc.data()!;

  if (params.username !== username) {
    throw error(401, "That username does not belong to you.");
  }
}) satisfies PageServerLoad;

