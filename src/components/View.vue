<template>
    <div>
        <div v-if="!response && !error && exists">
            <vue-loading class="my-3" type="spin" color="#007bff" :size="{width: '50px', height: '50px'}"></vue-loading>
        </div>
        <div v-if="response">
            <div class="p-3 border-bottom border-2">
                <span class="h2">
                    {{ this.response.title }}
                </span>
                <span>
                    <b-icon-person-circle></b-icon-person-circle>
                    {{ this.response.owner }}
                    <b-icon-clock></b-icon-clock>
                    {{ this.response.ua_formatted }}
                </span>
            </div>
        </div>
        <div v-if="error" class="alert alert-danger" role="alert">
            エラーが発生しました。もう一度お試しください。
        </div>
        <NotFound v-if="!exists"></NotFound>
    </div>
</template>

<script>
import axios from "axios";
import { VueLoading } from 'vue-loading-template'
import NotFound from '@/components/NotFound.vue'

export default {
  name: 'View',
  mounted () {
    axios
      .get('https://timedule.herokuapp.com/table/' + this.$route.params.id)
      .then((response) => {
        this.response = response.data;
        let ua = new Date(this.response.updated_at);
        this.response.ua_formatted = String(ua.getFullYear()).slice(-2) + '/' + String(ua.getMonth() + 101).slice(-2) + '/' + String(ua.getDate() + 100).slice(-2);
      })
      .catch((reason) => {
        if (reason.response.status == 404) {
          this.exists = false;
        } else {
          this.error = true;
        }
        console.log(reason.message)
      });
  },
  components: {
    NotFound,
    VueLoading,
  },
  data: () => ({
    response: null,
    exists: true,
    error: false,
  }),
}
</script>
