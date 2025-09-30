<template>
  <div style="max-width: 1000px; margin: auto">
    <h1>Posts</h1>

    <!-- <Post Form> -->
    <v-sheet class="mx-auto" width="500">
      <v-form @submit.prevent>
        <v-text-field v-model="newPost.title" label="Title"></v-text-field>
        <v-textarea
          v-model="newPost.body"
          placeholder="Body"
          required
        ></v-textarea>
        <template v-if="!editingPost">
          <v-btn
            class="mb-4"
            color="#42b983"
            size="large"
            @click="addPost"
            :disabled="isAddDisabled"
          >
            Add Post
          </v-btn>
        </template>
        <template v-else>
          <div class="mb-4" style="display: flex; gap: 8px">
            <v-btn
              color="#42b983"
              size="large"
              style="flex: 1"
              @click="updatePost"
            >
              Save
            </v-btn>
            <v-btn size="large" style="flex: 1" @click="cancelEdit">
              Cancel
            </v-btn>
          </div>
        </template>
      </v-form>
    </v-sheet>

    <v-text-field
      v-model="search"
      label="Search posts..."
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
    />

    <v-table>
      <thead>
        <tr>
          <th class="text-center">Title</th>
          <th class="text-center">Body</th>
          <th class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="post in filteredPosts" :key="post.id">
          <td>{{ post.title }}</td>
          <td>{{ post.body }}</td>
          <td style="width: 20%">
            <v-btn
              size="small"
              color="warning"
              icon="mdi-pencil"
              class="mr-2"
              @click="editPost(post)"
            >
            </v-btn>
            <v-btn
              size="small"
              color="error"
              icon="mdi-delete-outline"
              @click="deletePost(post.id)"
            >
            </v-btn>
          </td>
        </tr>
        <tr v-if="filteredPosts.length === 0">
          <td colspan="3" class="text-center">No posts found</td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

// State
const posts = ref([]);
const newPost = ref({ title: "", body: "" });
const editingPost = ref(null);
const search = ref("");

const isAddDisabled = computed(() => {
  return newPost.value.title.trim() === "" || newPost.value.body.trim() === "";
});

const filteredPosts = computed(() => {
  const query = search.value.trim().toLowerCase();
  if (!query) return posts.value;
  return posts.value.filter((post) => {
    const title = String(post.title || "").toLowerCase();
    const body = String(post.body || "").toLowerCase();
    return title.includes(query) || body.includes(query);
  });
});

// Fetch Data
onMounted(async () => {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=5"
  );
  posts.value = await res.json();
  console.log(posts.value);
});

function addPost() {
  const id = posts.value.length + 1;
  posts.value.push({ id, ...newPost.value });
  newPost.value = { title: "", body: "" };
}

function editPost(post) {
  console.log("masuk?");
  console.log(editingPost);
  editingPost.value = { ...post };
  console.log(editingPost.value);
  // Populate input fields with the selected post's data
  newPost.value = { title: post.title || "", body: post.body || "" };
}

function updatePost() {
  const index = posts.value.findIndex((p) => p.id === editingPost.value.id);
  if (index !== -1) {
    posts.value[index] = {
      ...posts.value[index],
      title: newPost.value.title,
      body: newPost.value.body,
    };
  }
  editingPost.value = null;
  newPost.value = { title: "", body: "" };
}

function cancelEdit() {
  editingPost.value = null;
  newPost.value = { title: "", body: "" };
}

function deletePost(id) {
  posts.value = posts.value.filter((post) => post.id !== id);
}
</script>

<style></style>
