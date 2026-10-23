<script setup lang="ts">
import { onMounted, ref } from "vue";
import ChatRoom from "./ChatRoom.vue";
import { colorOf, type User } from "./users";

const users = ref<User[]>([]);
const me = ref<User>();

onMounted(async () => {
  users.value = await fetch("/api/users").then((response) => response.json());
});
</script>

<template>
  <main class="page">
    <ChatRoom v-if="me" :me="me" :users="users" />

    <section v-else class="card join">
      <div class="brand"><span class="mark">C</span> Celeris Quickstart</div>
      <h1>Join demo-room</h1>
      <p>Pick a person. Then open a second tab and pick the other one.</p>
      <div class="people">
        <button v-for="user in users" :key="user.id" class="person" @click="me = user">
          <span class="avatar" :style="{ background: colorOf(user.id) }">{{ user.name[0] }}</span>
          <span class="person-name">{{ user.name }}</span>
          <span class="person-go">Join →</span>
        </button>
      </div>
    </section>
  </main>
</template>
