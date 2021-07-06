<template>
    <div>
        <div v-if="user === null">
            <vue-loading class="my-3" type="spin" color="#007bff" :size="{width: '50px', height: '50px'}"></vue-loading>
        </div>
        <div v-else>
            <div class="p-3 border-bottom border-2">
                <span class="h2">
                    ユーザー設定
                </span>
            </div>
            <div :key="formKey">
                <div class="d-grid col-12 px-3 col-md-4 mx-auto">
                    <div class="btn btn-outline-primary mt-3" @click="showChangeEmailModal()">
                        メールアドレスを変更
                    </div>
                </div>
                <div class="d-grid col-12 px-3 col-md-4 mx-auto">
                    <div class="btn btn-outline-primary mt-3" @click="sendResetEmail()">
                        パスワードを変更
                    </div>
                </div>
                <div class="d-grid col-12 px-3 col-md-4 mx-auto">
                    <div class="btn btn-outline-primary mt-3" @click="logOut()">
                        ログアウト
                    </div>
                </div>
                <transition>
                    <div v-if="errcode" class="alert alert-danger m-3" role="alert">
                        エラーが発生しました。エラーコード: {{ this.errcode }}
                    </div>
                </transition>
                <transition>
                    <div v-if="successMsg" class="alert alert-success m-3" role="alert">
                        {{ this.successMsg }}
                    </div>
                </transition>
            </div>
        </div>
        <b-modal v-model="changeEmailModal" title="メールアドレスを変更" hide-header-close @ok="changeEmail">
            <div class="text-center">
                <div class="form-group m-3">
                    <label for="email">新しいメールアドレス</label>
                    <input type="email" class="form-control" id="email" placeholder="新しいメールアドレス" v-model="email" @keydown.enter="focusTo('password')">
                </div>
                <div class="form-group m-3">
                    <label for="password">パスワード</label>
                    <input :type="pwType" class="form-control" id="password" placeholder="パスワード" v-model="password" @keydown.enter="changeEmail()">
                </div>
                <div class="form-check d-inline-block mb-3">
                    <input class="form-check-input" type="checkbox" id="showPass" v-model="showPass">
                    <label class="form-check-label" for="showPass">パスワードを表示</label>
                </div>
            </div>
        </b-modal>
    </div>
</template>

<style>
.v-leave-active {
    transition: opacity 1s
}
.v-leave-to {
    opacity: 0;
}
</style>

<script>
import firebase from 'firebase'
import { VueLoading } from 'vue-loading-template'

export default {
  name: 'User-settings',
  mounted () {
    firebase.auth().onAuthStateChanged((user)=> {
      if (user === null || user.uid != this.$route.params.user_id) {
        this.$router.replace('/user/' + this.$route.params.user_id);
      } else {
        this.user = user;
      }
    });
  },
  methods: {
    focusTo(id) {
      document.getElementById(id).focus();
    },
    logOut() {
      firebase.auth().signOut()
        .then(() => {
          this.$router.replace('/user/' + this.$route.params.user_id);
        })
        .catch((error) => {
          this.errcode = error.code;
          this.formKey += 1;
          setTimeout(() => {
            this.errcode = '';
          }, 2000);
        });
    },
    showChangeEmailModal() {
      this.changeEmailModal = true;
    },
    changeEmail() {
      this.changeEmailModal = false;
      firebase.auth().signInWithEmailAndPassword(this.user.email, this.password)
        .then(() => {
          this.user.updateEmail(this.email)
            .then(() => {
              this.email = '';
              this.password = '';
              this.user.sendEmailVerification()
                .then(() => {
                  this.successMsg = 'メールアドレスを更新しました。'
                  this.formKey += 1;
                  setTimeout(() => {
                    this.successMsg = '';
                  }, 2000);
                });
            })
            .catch((error) => {
              this.email = '';
              this.password = '';
              this.errcode = error.code;
              this.formKey += 1;
              setTimeout(() => {
                this.errcode = '';
              }, 2000);
            });
        })
        .catch((error) => {
          this.email = '';
          this.password = '';
          this.errcode = error.code;
          this.formKey += 1;
          setTimeout(() => {
            this.errcode = '';
          }, 2000);
        });
    },
    sendResetEmail() {
      firebase.auth().sendPasswordResetEmail(this.user.email)
        .then(() => {
          this.successMsg = '登録されたメールアドレスにパスワード再設定メールを送信しました。';
          this.formKey += 1;
          setTimeout(() => {
            this.successMsg = '';
          }, 2000);
        })
        .catch((error) => {
          this.errcode = error.code;
          this.formKey += 1;
          setTimeout(() => {
            this.errcode = '';
          }, 2000);
        });
    },
  },
  data: () => ({
    user: null,
    email: '',
    password: '',
    showPass: false,
    changeEmailModal: false,
    formKey: 0,
    errcode: '',
    successMsg: '',
  }),
  components: {
    VueLoading,
  },
  computed: {
    pwType: function () {
      if (this.showPass) {
        return 'text';
      } else {
        return 'password';
      }
    },
  },
}
</script>
