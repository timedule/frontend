<template>
    <div class="text-center font-monospace mt-5 py-3" id="404main">
        <div class="display-1 fw-bold my-3" @click="egg">
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

<style>
    .rotate {
        animation: rotate 5s linear;
    }

    @keyframes rotate {
        0%   { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>

<script>
export default {
  name: 'NotFound',
  methods: {
    egg() {
      this.cnt++;
      if (this.cnt == Math.floor(Math.random() * 6) + 5) {
        this.cnt = 0;
        document.getElementById('404main').classList.add('rotate');
        setTimeout(() => {
          document.getElementById('404main').classList.remove('rotate');
        }, 5000);
      }
    },
  },
  data: () => ({
    cnt: 0,
  }),
}
</script>
