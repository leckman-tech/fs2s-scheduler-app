"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { AttendeeBoardThreadRecord } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils";

type AttendeeBoardProps = {
  initialThreads: AttendeeBoardThreadRecord[];
  initialIdentity: Identity;
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
const DEFAULT_ROOM_LABEL = "Community Lounge";
const ALL_ACTIVITY_LABEL = "All activity";
const ROOM_SUGGESTIONS = [
  {
    label: DEFAULT_ROOM_LABEL,
    description: "General conversation, reflections, and day-of connections."
  },
  {
    label: "Capitol Hill",
    description: "Advocacy planning, Lobby Day coordination, and policy conversation."
  },
  {
    label: "Meetups & Meals",
    description: "Coffee runs, dinner plans, and in-person meetups around the convening."
  },
  {
    label: "Resources & Slides",
    description: "Handouts, links, recommended reads, and follow-up materials."
  },
  {
    label: "Questions & Help",
    description: "Ask logistical questions and help each other out during the event."
  },
  {
    label: "Travel & D.C.",
    description: "Transportation, local recommendations, and downtown logistics."
  }
] as const;

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

function normalizeRoomLabel(value?: string | null) {
  const normalized = value?.replace(/\s+/g, " ").trim();
  return normalized ? normalized.slice(0, 48) : DEFAULT_ROOM_LABEL;
}

function describeRoom(label: string) {
  const preset = ROOM_SUGGESTIONS.find((room) => room.label === label);
  return (
    preset?.description ??
    "Use this room to keep a focused thread going around one topic, meetup, or shared interest."
  );
}

export function AttendeeBoard({ initialThreads, initialIdentity }: AttendeeBoardProps) {
  const router = useRouter();
  const [threads, setThreads] = useState(initialThreads);
  const [identity, setIdentity] = useState<Identity>(initialIdentity);
  const [token, setToken] = useState("");
  const [newPostBody, setNewPostBody] = useState("");
  const [composerRoom, setComposerRoom] = useState(DEFAULT_ROOM_LABEL);
  const [selectedRoom, setSelectedRoom] = useState(ALL_ACTIVITY_LABEL);
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
    setIdentity((current) => ({
      ...current,
      fullName: initialIdentity.fullName,
      email: initialIdentity.email
    }));
  }, [initialIdentity.email, initialIdentity.fullName]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedToken = localStorage.getItem(TOKEN_KEY) || generateToken();
    syncAttendeeToken(storedToken);
    setToken(storedToken);
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
        message: "Your attendee account needs a name and email before you can post."
      });
      return;
    }

    const ok = await submitAction(
      {
        action: "create-post",
        organization: identity.organization,
        body: newPostBody,
        room: normalizeRoomLabel(composerRoom),
        authorToken: token
      },
      "Your post is live on the attendee board."
    );

    if (ok) {
      setNewPostBody("");
      setSelectedRoom(normalizeRoomLabel(composerRoom));
    }
  }

  async function handleCreateReply(postId: string) {
    const body = replyDrafts[postId]?.trim() ?? "";

    if (!identity.fullName.trim() || !identity.email.trim() || !body) {
      setFlash({
        tone: "error",
        message: "Your attendee account needs a name and email before you can reply."
      });
      return;
    }

    const ok = await submitAction(
      {
        action: "create-reply",
        postId,
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

  async function handleDeletePost(postId: string) {
    if (!window.confirm("Delete this post and its replies from the attendee board?")) {
      return;
    }

    await submitAction(
      {
        action: "delete-post",
        postId,
        authorToken: token
      },
      "Your post has been removed."
    );
  }

  async function handleDeleteReply(replyId: string) {
    if (!window.confirm("Delete this reply from the attendee board?")) {
      return;
    }

    await submitAction(
      {
        action: "delete-reply",
        replyId,
        authorToken: token
      },
      "Your reply has been removed."
    );
  }

  const knownRooms = Array.from(
    new Set([
      ...ROOM_SUGGESTIONS.map((room) => room.label),
      ...threads.map((thread) => normalizeRoomLabel(thread.room))
    ])
  );

  const roomTabs = [ALL_ACTIVITY_LABEL, ...knownRooms];
  const activeRoomLabel = selectedRoom === ALL_ACTIVITY_LABEL ? DEFAULT_ROOM_LABEL : selectedRoom;
  const visibleThreads =
    selectedRoom === ALL_ACTIVITY_LABEL
      ? threads
      : threads.filter((thread) => normalizeRoomLabel(thread.room) === selectedRoom);
  const roomCounts = roomTabs.reduce<Record<string, number>>((acc, roomLabel) => {
    acc[roomLabel] =
      roomLabel === ALL_ACTIVITY_LABEL
        ? threads.length
        : threads.filter((thread) => normalizeRoomLabel(thread.room) === roomLabel).length;
    return acc;
  }, {});

  return (
    <section className="panel detail-side-panel attendee-board">
      <div className="section-heading">
        <div>
          <h2>Attendee Board</h2>
          <p className="muted attendee-board__intro">
            Use the attendee board like a live community hub: start a thread, reply to others,
            like helpful notes, and keep conversations organized in rooms that fit the moment.
          </p>
        </div>
      </div>

      {flash ? (
        <div className={flash.tone === "error" ? "empty-state" : "announcement announcement--urgent"}>
          {flash.message}
        </div>
      ) : null}

      <div className="attendee-board__workspace">
        <aside className="attendee-board__sidebar">
          <div className="attendee-board__module">
            <div className="directory-account-summary">
              <div>
                <span className="directory-account-summary__label">Posting as</span>
                <strong>{identity.fullName}</strong>
              </div>
              <div>
                <span className="directory-account-summary__label">Account email</span>
                <strong>{identity.email}</strong>
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

          <div className="attendee-board__module">
            <div className="section-heading section-heading--stacked">
              <div>
                <h3>Conversation rooms</h3>
                <p className="muted">
                  Move between active rooms, or name a new one when you start a post.
                </p>
              </div>
            </div>
            <div className="attendee-room-switcher">
              {roomTabs.map((roomLabel) => (
                <button
                  key={roomLabel}
                  type="button"
                  className={`attendee-room-tab ${
                    selectedRoom === roomLabel ? "attendee-room-tab--active" : ""
                  }`}
                  onClick={() => setSelectedRoom(roomLabel)}
                >
                  <span>{roomLabel}</span>
                  <strong>{roomCounts[roomLabel] ?? 0}</strong>
                </button>
              ))}
            </div>
          </div>

          <div className="attendee-board__module attendee-board__composer">
            <div className="field">
              <label htmlFor="attendee-board-room">Room</label>
              <input
                id="attendee-board-room"
                list="attendee-board-room-suggestions"
                value={composerRoom}
                onChange={(event) => setComposerRoom(event.target.value)}
                placeholder={DEFAULT_ROOM_LABEL}
              />
              <datalist id="attendee-board-room-suggestions">
                {knownRooms.map((roomLabel) => (
                  <option key={roomLabel} value={roomLabel} />
                ))}
              </datalist>
              <p className="field-hint">
                Choose an existing room or create a new one for this conversation.
              </p>
            </div>

            <div className="field">
              <label htmlFor="attendee-board-body">Start a conversation</label>
              <textarea
                id="attendee-board-body"
                rows={5}
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
        </aside>

        <div className="attendee-board__main">
          <div className="attendee-board__room-hero">
            <div>
              <span className="directory-account-summary__label">
                {selectedRoom === ALL_ACTIVITY_LABEL ? "Room overview" : "Current room"}
              </span>
              <h3>{selectedRoom === ALL_ACTIVITY_LABEL ? "All attendee activity" : activeRoomLabel}</h3>
              <p className="muted">
                {selectedRoom === ALL_ACTIVITY_LABEL
                  ? "Browse every active thread across the attendee community, or switch into a room to focus the conversation."
                  : describeRoom(activeRoomLabel)}
              </p>
            </div>
            <div className="attendee-board__room-stats">
              <span className="chip">
                {visibleThreads.length} thread{visibleThreads.length === 1 ? "" : "s"}
              </span>
              <span className="chip">
                {visibleThreads.reduce((count, thread) => count + thread.replies.length, 0)} repl
                {visibleThreads.reduce((count, thread) => count + thread.replies.length, 0) === 1
                  ? "y"
                  : "ies"}
              </span>
            </div>
          </div>

          <div className="attendee-board__feed">
            {visibleThreads.length ? (
              visibleThreads.map((thread) => {
                const isEditingPost = editingPostId === thread.id;
                const isReplying = replyingTo === thread.id;

                return (
                  <article key={thread.id} className="announcement attendee-thread">
                    <div className="attendee-thread__header">
                      <div className="attendee-thread__identity">
                        <span className="chip">{normalizeRoomLabel(thread.room)}</span>
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
                          <>
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
                            <button
                              type="button"
                              className="button-secondary attendee-thread__action-button attendee-thread__action-button--danger"
                              onClick={() => handleDeletePost(thread.id)}
                            >
                              Delete
                            </button>
                          </>
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
                                <div className="attendee-thread__actions attendee-thread__actions--reply">
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
                                  <button
                                    type="button"
                                    className="button-secondary attendee-thread__action-button attendee-thread__action-button--danger"
                                    onClick={() => handleDeleteReply(reply.id)}
                                  >
                                    Delete
                                  </button>
                                </div>
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
                {selectedRoom === ALL_ACTIVITY_LABEL
                  ? "No attendee board posts yet. The first post can set the tone for the conversation."
                  : `No posts are in ${activeRoomLabel} yet. Start the conversation and give this room some life.`}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
