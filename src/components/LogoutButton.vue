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
const handleLogout = async () => {
  try {
    await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    window.location.href = '/login'
  } catch (error) {
    // TODO: Add toast
    console.error('An error occurred during logout:', error)
  }
}
</script>