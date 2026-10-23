<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { createClient, readText, textPayload } from "@useceleris/client";
import { colorOf, type User } from "./users";

type Message = { from: string; text: string; at: number };

const props = defineProps<{ me: User; users: User[] }>();

const state = ref("connecting");
const messages = ref<Message[]>([]);
const draft = ref("");
const list = ref<HTMLElement>();

// The browser asks your backend for credentials. It never sees the secret.
const client = createClient({
  credentialProvider: async (request) => {
    const response = await fetch("/api/realtime-credentials", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId: props.me.id, channelReference: request.channelReference }),
    });
    if (!response.ok) throw new Error("Credentials: " + response.status);
    return response.json();
  },
});

const channel = client.channel("demo-room");
const chat = channel.segment("chat");

channel.events().onStateChange((next) => (state.value = next));
chat.onMessage((payload, meta) => {
  show({ from: meta.tokenReference, text: readText(payload), at: Number(meta.timestamp) });
});
chat.subscribe();

onMounted(() => channel.connect().catch(console.error));
onBeforeUnmount(() => channel.close());

async function send() {
  const text = draft.value.trim();
  if (!text) return;

  draft.value = "";
  await chat.publish({ payload: textPayload(text) });
  // A connection does not get its own messages by default: show a local copy.
  show({ from: props.me.id, text, at: Date.now() });
}

async function show(message: Message) {
  messages.value.push(message);
  await nextTick();
  list.value?.scrollTo({ top: list.value.scrollHeight });
}

const nameOf = (id: string) => props.users.find((user) => user.id === id)?.name ?? id;
const timeOf = (at: number) => new Date(at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
</script>

<template>
  <section class="card chat">
    <header class="chat-header">
      <div>
        <div class="room"># demo-room</div>
        <div class="signed-in">Signed in as {{ me.name }}</div>
      </div>
      <span class="status" :class="state"><span class="dot"></span>{{ state }}</span>
    </header>

    <ul ref="list" class="messages">
      <li v-if="!messages.length" class="empty">No messages yet. Say hello.</li>
      <li v-for="(message, index) in messages" :key="index" class="message" :class="{ mine: message.from === me.id }">
        <span v-if="message.from !== me.id" class="avatar small" :style="{ background: colorOf(message.from) }">
          {{ nameOf(message.from)[0] }}
        </span>
        <div class="body">
          <div class="meta">
            <strong v-if="message.from !== me.id">{{ nameOf(message.from) }}</strong>
            <span>{{ timeOf(message.at) }}</span>
          </div>
          <div class="bubble">{{ message.text }}</div>
        </div>
      </li>
    </ul>

    <form class="composer" @submit.prevent="send">
      <input v-model="draft" placeholder="Write a message" autofocus />
      <button :disabled="!draft.trim()" aria-label="Send">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
    </form>
  </section>
</template>
