<template>
    <div class="text-center font-monospace mt-5 py-3">
        <div class="display-1 fw-bold my-3">
            &gt;_&lt;
        </div>
        <h3>
            404:ページが存在しません
        </h3>
        <router-link class="btn btn-outline-primary" to='/'>
            ホームに戻る
        </router-link>
    </div>
</template>

<script>
export default {
  name: 'NotFound',
}
</script>
