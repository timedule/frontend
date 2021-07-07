<template>
    <div>
        <div v-if="!response && !error && exists">
            <vue-loading class="my-3" type="spin" color="#007bff" :size="{width: '50px', height: '50px'}"></vue-loading>
        </div>
        <div v-if="response">
            <div class="p-3 border-bottom border-2">
                <div class="row">
                    <div class="h2 col my-auto">
                        {{ this.$route.params.user_id }}さんの時間割
                    </div>
                    <div class="col-auto my-auto h4" v-if="user !== null && user.uid == $route.params.user_id">
                        <router-link :to="'/user/' + user.uid + '/settings'" class="link-dark">
                            <b-icon-gear></b-icon-gear>
                        </router-link>
                    </div>
                </div>
            </div>
            <div v-if="user !== null && user.emailVerified == false" class="alert alert-warning m-3" role="alert">
                ユーザーの登録が完了していません。受信したメールからメールアドレスの確認を行ってください。
                <div class="row">
                    <div class="col"></div>
                    <div class="btn btn-outline-dark col-auto mx-2 mt-2" @click="resendEmail()">
                        確認メールを再送信
                    </div>
                </div>
            </div>
            <div class="row m-3 mx-md-0">
                <div class="btn btn-outline-success col-md-6 mx-md-auto py-2" @click="appendTable()" style="cursor: pointer;" v-if="user !== null && user.uid == $route.params.user_id && user.emailVerified" :key="btnKey">+ 追加</div>
            </div>
            <div v-if="response.length == 0" class="text-center m-3">
                <h5>時間割がありません</h5>
            </div>
            <div v-else v-for="item in response" :key="item.id" class="card m-3 col-md-6 mx-md-auto">
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
                        <div class="col-auto" v-if="user !== null && user.uid == $route.params.user_id">
                            <router-link :to="'/edit/' + item.id" class="btn btn-outline-secondary">
                                編集
                            </router-link>
                        </div>
                        <div class="col-auto" v-if="user !== null && user.uid == $route.params.user_id">
                            <div class="btn btn-outline-danger" @click="delTable(item.id)">
                                削除
                            </div>
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
import firebase from 'firebase'
import axios from "axios";
import { VueLoading } from 'vue-loading-template'
import NotFound from '@/components/NotFound.vue'

import 'swiper/css/swiper.css'

export default {
  name: 'User',
  mounted () {
    firebase.auth().onAuthStateChanged((user)=> {
      if (user !== null) {
        this.user = user;
      }
    });
    axios
      .get('https://api.timedule.net/user/' + this.$route.params.user_id)
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
    resendEmail() {
      this.user.sendEmailVerification()
        .then(() => {
          window.alert('確認メールを送信しました');
        });
    },
    appendTable() {
      let sSet="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
      let tableId = Array.from(Array(8)).map(()=>sSet[Math.floor(Math.random()*sSet.length)]).join('');
      axios
        .get('https://api.timedule.net/table/' + tableId)
        .then(() => {
          this.appendTable();
        })
        .catch((reason) => {
          if (reason.response.status == 404) {
            this.user.getIdToken(true)
              .then((idToken) => {
                axios
                  .post('https://api.timedule.net/table/' + tableId, {
                    owner: idToken,
                    title: '新しい時間割',
                    main_data: {},
                    template: [],
                  })
                  .then(() => {
                    this.response.unshift({
                      id: tableId,
                      title: '新しい時間割',
                      updated_at: new Date().toString(),
                    });
                    this.btnKey++;
                  })
                  .catch(() => {
                    alert('エラーが発生しました');
                  });
              })
              .catch(() => {
                alert('エラーが発生しました');
              });
          } else {
            this.appendTable();
          }
        });
    },
    delTable(id) {
      if (confirm('本当に削除しますか？')) {
        this.user.getIdToken(true)
          .then((idToken) => {
            axios
              .post('https://api.timedule.net/deltable/' + id, {
                user_id: idToken,
              })
              .then(() => {
                this.response = this.response.filter((item) => {
                  return item.id != id;
                });
                this.response.splice();
              })
              .catch(() => {
                alert('エラーが発生しました');
              });
          })
          .catch(() => {
            alert('エラーが発生しました');
          });
      }
    },
  },
  data: () => ({
    user: null,
    response: null,
    exists: true,
    error: false,
    btnKey: 0,
  }),
}
</script>
