import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { ATTENDEE_PORTAL_ROLES } from "@/lib/constants";
import { toPublicErrorMessage } from "@/lib/public-errors";
import { createClient } from "@/lib/supabase/server";

type AttendeeBoardAction =
  | {
      action: "create-post";
      organization?: string;
      body?: string;
      room?: string;
      authorToken?: string;
    }
  | {
      action: "update-post";
      postId?: string;
      body?: string;
      room?: string;
      authorToken?: string;
    }
  | {
      action: "delete-post";
      postId?: string;
      authorToken?: string;
    }
  | {
      action: "create-reply";
      postId?: string;
      organization?: string;
      body?: string;
      authorToken?: string;
    }
  | {
      action: "update-reply";
      replyId?: string;
      body?: string;
      authorToken?: string;
    }
  | {
      action: "delete-reply";
      replyId?: string;
      authorToken?: string;
    }
  | {
      action: "toggle-like";
      postId?: string;
      viewerToken?: string;
    };

function normalizeToken(value?: string) {
  const token = value?.trim();
  return token ? token : crypto.randomUUID();
}

function isCommunitySetupError(error: unknown) {
  const message =
    typeof error === "object" && error
      ? `${"message" in error ? String(error.message ?? "") : ""} ${
          "details" in error ? String(error.details ?? "") : ""
        }`
      : "";

  return [
    "attendee_board_posts",
    "attendee_board_replies",
    "attendee_board_likes",
    "create_attendee_board_post_with_token",
    "update_attendee_board_post",
    "delete_attendee_board_post",
    "create_attendee_board_reply",
    "update_attendee_board_reply",
    "delete_attendee_board_reply",
    "toggle_attendee_board_like",
    "account_id",
    "room",
    "schema cache"
  ].some((fragment) => message.includes(fragment));
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Please sign into the attendee portal first." }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role,full_name")
      .eq("id", user.id)
      .maybeSingle();

    if (!ATTENDEE_PORTAL_ROLES.includes(profile?.role as (typeof ATTENDEE_PORTAL_ROLES)[number])) {
      return NextResponse.json(
        { error: "This login does not include attendee portal access." },
        { status: 403 }
      );
    }

    const payload = (await request.json()) as AttendeeBoardAction;
    const attendeeName =
      profile?.full_name?.trim() ||
      String(user.user_metadata?.full_name ?? "").trim() ||
      user.email?.split("@")[0] ||
      "Attendee";
    const attendeeEmail = user.email?.trim().toLowerCase() ?? "";
    const responseToken =
      "authorToken" in payload
        ? normalizeToken(payload.authorToken)
        : "viewerToken" in payload
          ? normalizeToken(payload.viewerToken)
          : crypto.randomUUID();

    let rpcError: { message?: string; details?: string } | null = null;

    switch (payload.action) {
      case "create-post": {
        if (!attendeeEmail || !payload.body?.trim()) {
          return NextResponse.json(
            { error: "Your attendee account needs a valid email before you can post." },
            { status: 400 }
          );
        }

        const { error } = await supabase.rpc("create_attendee_board_post_with_token", {
          p_full_name: attendeeName,
          p_email: attendeeEmail,
          p_organization: payload.organization?.trim() || null,
          p_body: payload.body.trim(),
          p_author_token: responseToken,
          p_room: payload.room?.trim() || null
        });

        if (error && isCommunitySetupError(error)) {
          const fallback = await supabase.rpc("create_attendee_board_post_with_token", {
            p_full_name: attendeeName,
            p_email: attendeeEmail,
            p_organization: payload.organization?.trim() || null,
            p_body: payload.body.trim(),
            p_author_token: responseToken
          });
          rpcError = fallback.error;
        } else {
          rpcError = error;
        }
        break;
      }
      case "update-post": {
        if (!payload.postId?.trim() || !payload.body?.trim()) {
          return NextResponse.json({ error: "A post and updated message are required." }, { status: 400 });
        }

        const { error } = await supabase.rpc("update_attendee_board_post", {
          p_post_id: payload.postId.trim(),
          p_body: payload.body.trim(),
          p_author_token: responseToken,
          p_room: payload.room?.trim() || null
        });

        if (error && isCommunitySetupError(error)) {
          const fallback = await supabase.rpc("update_attendee_board_post", {
            p_post_id: payload.postId.trim(),
            p_body: payload.body.trim(),
            p_author_token: responseToken
          });
          rpcError = fallback.error;
        } else {
          rpcError = error;
        }
        break;
      }
      case "delete-post": {
        if (!payload.postId?.trim()) {
          return NextResponse.json({ error: "Choose a post to delete first." }, { status: 400 });
        }

        const { error } = await supabase.rpc("delete_attendee_board_post", {
          p_post_id: payload.postId.trim(),
          p_author_token: responseToken
        });

        rpcError = error;
        break;
      }
      case "create-reply": {
        if (!payload.postId?.trim() || !attendeeEmail || !payload.body?.trim()) {
          return NextResponse.json(
            { error: "Your attendee account needs a valid email before you can reply." },
            { status: 400 }
          );
        }

        const { error } = await supabase.rpc("create_attendee_board_reply", {
          p_post_id: payload.postId.trim(),
          p_full_name: attendeeName,
          p_email: attendeeEmail,
          p_organization: payload.organization?.trim() || null,
          p_body: payload.body.trim(),
          p_author_token: responseToken
        });

        rpcError = error;
        break;
      }
      case "update-reply": {
        if (!payload.replyId?.trim() || !payload.body?.trim()) {
          return NextResponse.json({ error: "A reply and updated message are required." }, { status: 400 });
        }

        const { error } = await supabase.rpc("update_attendee_board_reply", {
          p_reply_id: payload.replyId.trim(),
          p_body: payload.body.trim(),
          p_author_token: responseToken
        });

        rpcError = error;
        break;
      }
      case "delete-reply": {
        if (!payload.replyId?.trim()) {
          return NextResponse.json({ error: "Choose a reply to delete first." }, { status: 400 });
        }

        const { error } = await supabase.rpc("delete_attendee_board_reply", {
          p_reply_id: payload.replyId.trim(),
          p_author_token: responseToken
        });

        rpcError = error;
        break;
      }
      case "toggle-like": {
        if (!payload.postId?.trim()) {
          return NextResponse.json({ error: "A post is required to like it." }, { status: 400 });
        }

        const { error } = await supabase.rpc("toggle_attendee_board_like", {
          p_post_id: payload.postId.trim(),
          p_viewer_token: responseToken
        });

        rpcError = error;
        break;
      }
      default:
        return NextResponse.json({ error: "Unsupported attendee board action." }, { status: 400 });
    }

    if (rpcError) {
      return NextResponse.json(
        {
          error: isCommunitySetupError(rpcError)
            ? "Attendee community tools are not fully enabled in Supabase yet. Run the 015_attendee_board_engagement.sql migration first."
            : toPublicErrorMessage(rpcError, {
                fallback: "We couldn't save that attendee board update just now. Please try again.",
                duplicateMessage: "That action has already been recorded.",
                duplicateFragments: ["duplicate key", "unique"]
              })
        },
        { status: 400 }
      );
    }

    revalidatePath("/attendee");
    revalidatePath("/admin/dashboard/resources");

    const response = NextResponse.json({ ok: true, viewerToken: responseToken });
    response.cookies.set("fs2s_attendee_token", responseToken, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "We couldn't update the attendee board right now. Please try again in a moment."
      },
      { status: 500 }
    );
  }
}
