<template>
  <form @submit.prevent="handleLogout">
    <button
      type="submit"
      class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
    >
      Sign out
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const handleLogout = async () => {
  try {
    const response = await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      window.location.href = '/login';
    } else {
      // TODO: Add toast
      console.error('Logout failed');
    }
  } catch (error) {
    // TODO: Add toast
    console.error('An error occurred during logout:', error);
  }
}
</script>