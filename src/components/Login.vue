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
                <input type="password" class="form-control" id="password" placeholder="パスワード" v-model="password" @keydown.enter="logIn()">
            </div>
        </div>
        <div class="btn btn-outline-primary" @click="logIn()">ログイン</div>
        <transition>
            <div v-if="errcode" class="alert alert-danger m-3" role="alert">
                ログインに失敗しました。エラーコード: {{ this.errcode }}
            </div>
        </transition>
    </div>
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
    errcode: '',
  }),
  methods: {
    focusPw() {
      document.getElementById('password').focus();
    },
    logIn() {
      firebase.auth().signInWithEmailAndPassword(this.username, this.password)
        .then((userCredential) => {
          let user = userCredential.user;
          this.$router.push('/user/' + user.uid);
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
}
</script>
