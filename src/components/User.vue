<template>
    <div>
        <div v-if="!response && !error && exists">
            <vue-loading class="my-3" type="spin" color="#007bff" :size="{width: '50px', height: '50px'}"></vue-loading>
        </div>
        <div v-if="response">
            <div class="p-3 border-bottom border-2">
                <span class="h2">
                    {{ this.$route.params.user_id }}さんの時間割
                </span>
            </div>
            <div v-for="item in response" :key="item.id" class="card m-3 col-md-6 mx-md-auto">
                <div class="card-body">
                    <h5 class="card-title">
                        {{ item.title }}
                    </h5>
                    <div class="row">
                        <p class="card-text col">
                            <b-icon-clock></b-icon-clock>
                            {{ formatDate(item.updated_at) }}
                        </p>
                        <div class="col-auto">
                            <router-link :to="'/view/' + item.id" class="btn btn-outline-primary">
                                開く
                            </router-link>
                        </div>
                    </div>
                </div>
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

import 'swiper/css/swiper.css'

export default {
  name: 'View',
  mounted () {
    axios
      .get('https://timedule.herokuapp.com/user/' + this.$route.params.user_id)
      .then((response) => {
        this.response = response.data.sort((a, b) => {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });

        document.title = this.$route.params.user_id + 'さんの時間割 - Timedule';
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
  methods: {
    formatDate(dstring) {
      let ua = new Date(dstring);
      return String(ua.getFullYear()).slice(-2) + '/' + String(ua.getMonth() + 101).slice(-2) + '/' + String(ua.getDate() + 100).slice(-2);
    },
  },
  data: () => ({
    response: null,
    exists: true,
    error: false,
  }),
}
</script>
