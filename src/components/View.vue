<template>
    <div>
        <div v-if="!response && !error && exists">
            <vue-loading class="my-3" type="spin" color="#007bff" :size="{width: '50px', height: '50px'}"></vue-loading>
        </div>
        <div v-if="response">
            <div class="px-3 py-2 border-bottom border-2">
                <div class="row">
                    <div class="h2 col my-auto">
                        {{ this.response.title }}
                        <router-link :to="'/edit/' + $route.params.id" class="text-dark h5 m-1" v-if="user !== null && user.uid == response.owner">
                            <b-icon-pencil></b-icon-pencil>
                        </router-link>
                    </div>
                    <div class="col-auto">
                        <div>
                            <router-link :to="'/user/' + this.response.owner" class="link-dark">
                                <b-icon-person-circle></b-icon-person-circle>
                                {{ this.response.owner }}
                            </router-link>
                        </div>
                        <div>
                            <b-icon-clock></b-icon-clock>
                            {{ this.response.ua_formatted }}
                        </div>
                    </div>
                </div>
            </div>
            <swiper class="swiper" :options="swiperOption" @ready="swiperReady">
                <div class="swiper-button-prev" slot="button-prev"></div>
                <div class="swiper-button-next" slot="button-next"></div>
                <swiper-slide v-for="i in 61" :key="i">
                    <viewTable :arg="getTable(i - 11)"></viewTable>
                </swiper-slide>
            </swiper>
        </div>
        <div v-if="error" class="alert alert-danger" role="alert">
            エラーが発生しました。もう一度お試しください。
        </div>
        <NotFound v-if="!exists"></NotFound>
    </div>
</template>

<script>
import firebase from 'firebase'
import axios from "axios";
import { VueLoading } from 'vue-loading-template'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import viewTable from '@/components/View-table.vue'
import NotFound from '@/components/NotFound.vue'

import 'swiper/css/swiper.css'

export default {
  name: 'View',
  mounted () {
    firebase.auth().onAuthStateChanged((user)=> {
      if (user !== null) {
        this.user = user;
      }
    });
    axios
      .get('https://timedule.herokuapp.com/table/' + this.$route.params.id)
      .then((response) => {
        this.response = response.data;
        let ua = new Date(this.response.updated_at);
        this.response.ua_formatted = String(ua.getFullYear()).slice(-2) + '/' + String(ua.getMonth() + 101).slice(-2) + '/' + String(ua.getDate() + 100).slice(-2);
        document.title = this.response.title + ' - Timedule';
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
    viewTable,
    NotFound,
    VueLoading,
    Swiper,
    SwiperSlide,
  },
  methods: {
    getTable (a) {
      let d = new Date(this.today.toString());
      d.setDate(d.getDate() + a);
      let datestr = String(d.getFullYear()).slice(-2) + '/' + String(d.getMonth() + 101).slice(-2) + '/' + String(d.getDate() + 100).slice(-2);
      let data = this.response.main_data[datestr];
      let dayJP = ['日', '月', '火', '水', '木', '金', '土'];
      let dtext = datestr + ' (' + dayJP[d.getDay()] + ')';
      return {
        dtext: dtext,
        data: data,
      };
    },
    swiperReady (swiper) {
      swiper.slideTo(10, 0);
    },
  },
  data: () => ({
    user: null,
    response: null,
    exists: true,
    error: false,
    today: new Date(),
    swiperOption: {
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    },
  }),
}
</script>
