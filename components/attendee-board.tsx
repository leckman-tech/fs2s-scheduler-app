"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { AttendeeBoardThreadRecord } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils";

type AttendeeBoardProps = {
  initialThreads: AttendeeBoardThreadRecord[];
};

type Identity = {
  fullName: string;
  email: string;
  organization: string;
};

type FlashState = {
  tone: "success" | "error";
  message: string;
} | null;

const TOKEN_KEY = "fs2s_attendee_token";
const PROFILE_KEY = "fs2s_attendee_profile";

function generateToken() {
  try {
    return crypto.randomUUID();
  } catch {
    return `fs2s-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

function syncAttendeeToken(token: string) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `fs2s_attendee_token=${token}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

function saveIdentity(identity: Identity) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(PROFILE_KEY, JSON.stringify(identity));
}

export function AttendeeBoard({ initialThreads }: AttendeeBoardProps) {
  const router = useRouter();
  const [threads, setThreads] = useState(initialThreads);
  const [identity, setIdentity] = useState<Identity>({
    fullName: "",
    email: "",
    organization: ""
  });
  const [token, setToken] = useState("");
  const [newPostBody, setNewPostBody] = useState("");
  const [flash, setFlash] = useState<FlashState>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingPostBody, setEditingPostBody] = useState("");
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editingReplyBody, setEditingReplyBody] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setThreads(initialThreads);
  }, [initialThreads]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedToken = localStorage.getItem(TOKEN_KEY) || generateToken();
    syncAttendeeToken(storedToken);
    setToken(storedToken);

    const storedProfile = localStorage.getItem(PROFILE_KEY);
    if (!storedProfile) {
      return;
    }

    try {
      const parsed = JSON.parse(storedProfile) as Partial<Identity>;
      setIdentity({
        fullName: parsed.fullName ?? "",
        email: parsed.email ?? "",
        organization: parsed.organization ?? ""
      });
    } catch {
      // Ignore invalid saved profile data.
    }
  }, []);

  async function submitAction(payload: Record<string, unknown>, successMessage?: string) {
    setFlash(null);

    const response = await fetch("/api/attendee-board", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = (await response.json().catch(() => null)) as
      | {
          ok?: boolean;
          error?: string;
          viewerToken?: string;
        }
      | null;

    if (!response.ok || !data?.ok) {
      setFlash({
        tone: "error",
        message: data?.error || "We couldn't save that update just now. Please try again."
      });
      return false;
    }

    if (data.viewerToken) {
      syncAttendeeToken(data.viewerToken);
      setToken(data.viewerToken);
    }

    if (successMessage) {
      setFlash({
        tone: "success",
        message: successMessage
      });
    }

    startTransition(() => {
      router.refresh();
    });

    return true;
  }

  async function handleCreatePost() {
    if (!identity.fullName.trim() || !identity.email.trim() || !newPostBody.trim()) {
      setFlash({
        tone: "error",
        message: "Use your name, email, and a short message to publish to the attendee board."
      });
      return;
    }

    saveIdentity(identity);

    const ok = await submitAction(
      {
        action: "create-post",
        fullName: identity.fullName,
        email: identity.email,
        organization: identity.organization,
        body: newPostBody,
        authorToken: token
      },
      "Your post is live on the attendee board."
    );

    if (ok) {
      setNewPostBody("");
    }
  }

  async function handleCreateReply(postId: string) {
    const body = replyDrafts[postId]?.trim() ?? "";

    if (!identity.fullName.trim() || !identity.email.trim() || !body) {
      setFlash({
        tone: "error",
        message: "Use your name, email, and a reply before posting."
      });
      return;
    }

    saveIdentity(identity);

    const ok = await submitAction(
      {
        action: "create-reply",
        postId,
        fullName: identity.fullName,
        email: identity.email,
        organization: identity.organization,
        body,
        authorToken: token
      },
      "Your reply is live."
    );

    if (ok) {
      setReplyDrafts((current) => ({ ...current, [postId]: "" }));
      setReplyingTo(null);
    }
  }

  async function handleUpdatePost(postId: string) {
    if (!editingPostBody.trim()) {
      setFlash({
        tone: "error",
        message: "Post text cannot be empty."
      });
      return;
    }

    const ok = await submitAction(
      {
        action: "update-post",
        postId,
        body: editingPostBody,
        authorToken: token
      },
      "Your post has been updated."
    );

    if (ok) {
      setEditingPostId(null);
      setEditingPostBody("");
    }
  }

  async function handleUpdateReply(replyId: string) {
    if (!editingReplyBody.trim()) {
      setFlash({
        tone: "error",
        message: "Reply text cannot be empty."
      });
      return;
    }

    const ok = await submitAction(
      {
        action: "update-reply",
        replyId,
        body: editingReplyBody,
        authorToken: token
      },
      "Your reply has been updated."
    );

    if (ok) {
      setEditingReplyId(null);
      setEditingReplyBody("");
    }
  }

  async function handleToggleLike(postId: string) {
    await submitAction({
      action: "toggle-like",
      postId,
      viewerToken: token
    });
  }

  return (
    <section className="panel detail-side-panel attendee-board">
      <div className="section-heading">
        <div>
          <h2>Attendee Board</h2>
          <p className="muted attendee-board__intro">
            Share a note, reply to other attendees, and like helpful posts. Posts and replies can
            be edited from the same browser or device that published them.
          </p>
        </div>
      </div>

      {flash ? (
        <div className={flash.tone === "error" ? "empty-state" : "announcement announcement--urgent"}>
          {flash.message}
        </div>
      ) : null}

      <div className="attendee-board__identity">
        <div className="form-grid form-grid--two">
          <div className="field">
            <label htmlFor="attendee-board-name">Full name</label>
            <input
              id="attendee-board-name"
              value={identity.fullName}
              onChange={(event) =>
                setIdentity((current) => ({ ...current, fullName: event.target.value }))
              }
              placeholder="How your post should appear"
            />
          </div>
          <div className="field">
            <label htmlFor="attendee-board-email">Email</label>
            <input
              id="attendee-board-email"
              type="email"
              value={identity.email}
              onChange={(event) =>
                setIdentity((current) => ({ ...current, email: event.target.value }))
              }
              placeholder="Used for accountability only"
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="attendee-board-organization">Organization</label>
          <input
            id="attendee-board-organization"
            value={identity.organization}
            onChange={(event) =>
              setIdentity((current) => ({ ...current, organization: event.target.value }))
            }
            placeholder="Optional"
          />
        </div>
      </div>

      <div className="attendee-board__composer">
        <div className="field">
          <label htmlFor="attendee-board-body">Start a conversation</label>
          <textarea
            id="attendee-board-body"
            rows={4}
            value={newPostBody}
            onChange={(event) => setNewPostBody(event.target.value)}
            placeholder="Share a reflection, resource, meetup idea, or question for the community."
          />
        </div>
        <div className="admin-actions">
          <button
            type="button"
            className="button"
            onClick={handleCreatePost}
            disabled={isPending}
          >
            {isPending ? "Posting..." : "Post to attendee board"}
          </button>
        </div>
      </div>

      <div className="attendee-board__feed">
        {threads.length ? (
          threads.map((thread) => {
            const isEditingPost = editingPostId === thread.id;
            const isReplying = replyingTo === thread.id;

            return (
              <article key={thread.id} className="announcement attendee-thread">
                <div className="attendee-thread__header">
                  <div>
                    <strong>{thread.full_name}</strong>
                    <div className="muted">
                      {[thread.organization, formatTimestamp(thread.created_at)]
                        .filter(Boolean)
                        .join(" · ")}
                      {thread.updated_at && thread.updated_at !== thread.created_at
                        ? " · Edited"
                        : ""}
                    </div>
                  </div>
                  <div className="attendee-thread__actions">
                    <button
                      type="button"
                      className={`button-secondary attendee-thread__action-button ${
                        thread.likedByViewer ? "attendee-thread__action-button--active" : ""
                      }`}
                      onClick={() => handleToggleLike(thread.id)}
                      disabled={isPending}
                    >
                      {thread.likedByViewer ? "Liked" : "Like"} {thread.likeCount}
                    </button>
                    <button
                      type="button"
                      className="button-secondary attendee-thread__action-button"
                      onClick={() =>
                        setReplyingTo((current) => (current === thread.id ? null : thread.id))
                      }
                    >
                      Reply{thread.replies.length ? ` (${thread.replies.length})` : ""}
                    </button>
                    {thread.canEdit ? (
                      <button
                        type="button"
                        className="button-secondary attendee-thread__action-button"
                        onClick={() => {
                          setEditingPostId(thread.id);
                          setEditingPostBody(thread.body);
                          setEditingReplyId(null);
                        }}
                      >
                        Edit
                      </button>
                    ) : null}
                  </div>
                </div>

                {isEditingPost ? (
                  <div className="attendee-thread__edit">
                    <textarea
                      rows={3}
                      value={editingPostBody}
                      onChange={(event) => setEditingPostBody(event.target.value)}
                    />
                    <div className="admin-actions">
                      <button
                        type="button"
                        className="button"
                        onClick={() => handleUpdatePost(thread.id)}
                        disabled={isPending}
                      >
                        Save edit
                      </button>
                      <button
                        type="button"
                        className="button-secondary"
                        onClick={() => {
                          setEditingPostId(null);
                          setEditingPostBody("");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="attendee-thread__body">{thread.body}</p>
                )}

                {thread.replies.length ? (
                  <div className="attendee-thread__replies">
                    {thread.replies.map((reply) => {
                      const isEditingReply = editingReplyId === reply.id;

                      return (
                        <div key={reply.id} className="attendee-reply">
                          <div className="attendee-reply__meta">
                            <strong>{reply.full_name}</strong>
                            <span className="muted">
                              {[reply.organization, formatTimestamp(reply.created_at)]
                                .filter(Boolean)
                                .join(" · ")}
                              {reply.updated_at && reply.updated_at !== reply.created_at
                                ? " · Edited"
                                : ""}
                            </span>
                          </div>
                          {isEditingReply ? (
                            <div className="attendee-thread__edit">
                              <textarea
                                rows={3}
                                value={editingReplyBody}
                                onChange={(event) => setEditingReplyBody(event.target.value)}
                              />
                              <div className="admin-actions">
                                <button
                                  type="button"
                                  className="button"
                                  onClick={() => handleUpdateReply(reply.id)}
                                  disabled={isPending}
                                >
                                  Save reply
                                </button>
                                <button
                                  type="button"
                                  className="button-secondary"
                                  onClick={() => {
                                    setEditingReplyId(null);
                                    setEditingReplyBody("");
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="attendee-reply__body">{reply.body}</p>
                          )}
                          {reply.canEdit ? (
                            <button
                              type="button"
                              className="button-secondary attendee-thread__action-button"
                              onClick={() => {
                                setEditingReplyId(reply.id);
                                setEditingReplyBody(reply.body);
                                setEditingPostId(null);
                              }}
                            >
                              Edit reply
                            </button>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                ) : null}

                {isReplying ? (
                  <div className="attendee-thread__reply-form">
                    <div className="field">
                      <label htmlFor={`reply-${thread.id}`}>Reply to this post</label>
                      <textarea
                        id={`reply-${thread.id}`}
                        rows={3}
                        value={replyDrafts[thread.id] ?? ""}
                        onChange={(event) =>
                          setReplyDrafts((current) => ({
                            ...current,
                            [thread.id]: event.target.value
                          }))
                        }
                        placeholder="Add a response, resource, or follow-up note."
                      />
                    </div>
                    <div className="admin-actions">
                      <button
                        type="button"
                        className="button"
                        onClick={() => handleCreateReply(thread.id)}
                        disabled={isPending}
                      >
                        {isPending ? "Posting..." : "Post reply"}
                      </button>
                      <button
                        type="button"
                        className="button-secondary"
                        onClick={() => setReplyingTo(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })
        ) : (
          <div className="empty-state">
            No attendee board posts yet. The first post can set the tone for the conversation.
          </div>
        )}
      </div>
    </section>
  );
}
