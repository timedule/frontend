<template>
<div>
    <div class="p-3 border-bottom border-2">
        <span class="h2">
            Timeduleにログイン
        </span>
    </div>
    <div class="text-center">
        <div :key="formKey">
            <img src="@/assets/login.png" height="150" class="my-3">
            <div class="form-group m-3 col-md-4 mx-md-auto">
                <label for="email">メールアドレス</label>
                <input type="email" class="form-control" id="email" placeholder="メールアドレス" v-model="username" @keydown.enter="focusPw()">
            </div>
            <div class="form-group m-3 col-md-4 mx-md-auto">
                <label for="password">パスワード</label>
                <input :type="pwType" class="form-control" id="password" placeholder="パスワード" v-model="password" @keydown.enter="logIn()">
            </div>
            <div class="form-check d-inline-block mb-3">
                <input class="form-check-input" type="checkbox" id="showPass" v-model="showPass">
                <label class="form-check-label" for="showPass">パスワードを表示</label>
            </div>
        </div>
        <div class="btn btn-outline-primary" @click="logIn()">ログイン</div>
        <div class="m-3">
            <small>
                まだ登録してませんか？ ➔ <router-link to="/signup">登録</router-link>
            </small>
        </div>
        <div class="m-3">
            <small>
                パスワードを忘れた方 ➔ <a class="link" @click="showResetPassModal">再設定メールを送信</a>
            </small>
        </div>
        <transition>
            <div v-if="errcode" class="alert alert-danger m-3" role="alert">
                ログインに失敗しました。エラーコード: {{ this.errcode }}
            </div>
        </transition>
        <transition>
            <div v-if="emailSended" class="alert alert-success m-3" role="alert">
                パスワード再設定メールを送信しました。
            </div>
        </transition>
    </div>
    <b-modal v-model="resetPassModal" title="パスワード再設定メールを送信" hide-header-close @ok="sendResetEmail">
        <div class="form-group text-center">
            <label for="email">メールアドレス</label>
            <input type="email" class="form-control" id="email" placeholder="メールアドレス" v-model="username" @keydown.enter="sendResetEmail">
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

export default {
  name: 'Login',
  data: () => ({
    formKey: 0,
    username: '',
    password: '',
    showPass: false,
    resetPassModal: false,
    emailSended: false,
    errcode: '',
  }),
  mounted() {
    firebase.auth().onAuthStateChanged((user)=> {
      if (user !== null) {
        this.$router.replace('/user/' + user.uid);
      }
    });
  },
  methods: {
    focusPw() {
      document.getElementById('password').focus();
    },
    logIn() {
      firebase.auth().signInWithEmailAndPassword(this.username, this.password)
        .then((userCredential) => {
          let user = userCredential.user;
          this.$router.replace('/user/' + user.uid);
        })
        .catch((error) => {
          this.errcode = error.code;
          this.formKey += 1;
          setTimeout(() => {
            this.errcode = '';
          }, 2000);
        });
    },
    showResetPassModal() {
      this.resetPassModal = true;
    },
    sendResetEmail() {
      firebase.auth().sendPasswordResetEmail(this.username)
        .then(() => {
          this.emailSended = true;
          setTimeout(() => {
            this.emailSended = false;
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
